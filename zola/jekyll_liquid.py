"""Jekyll's Liquid pass, run by a real Liquid engine (python-liquid).

The port used to translate each _includes/*.html into a Tera component, by
script or by hand. Every edit to an include then needed a re-port, and seven
weeks of main broke 16 of them. Now the Jekyll sources are rendered as Liquid,
as Jekyll does, so a new or edited include needs no port work at all.

Jekyll specifics on top of stock Liquid:
- {% include name.html k="v" k2=var %}: args land in `include.*`, the include
  shares the page's scope (an `assign` inside it leaks out, which the
  emit-once flags rely on), and quoted values take backslash escapes.
- filters: jsonify, markdownify, cgi_escape, uri_escape, xml_escape,
  relative_url, absolute_url. Jekyll passes a value through a filter it does
  not know; so does this, but it records the name (a warning in previews, a
  failure with STRICT=1). The two non-filters main already leans on,
  `cgi_encode` and `strip_slash`, are registered as no-ops.
"""

import json
import re
import urllib.parse
from pathlib import Path

from liquid import Environment
from liquid.exceptions import LiquidNameError
from liquid._io import StringBuffer
from liquid.loaders import CachingDictLoader
from liquid.tokens import TOKEN_COMMA, TOKEN_TAG_END
from markdown_it import MarkdownIt

INCLUDE = re.compile(
    r"\{%(-?)\s*include\s+([\w./-]+)(\s+.*?)?\s*(-?)%\}",
    re.S,
)
ARG = re.compile(
    r"""([\w-]+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s"']+))""", re.S
)
MD = MarkdownIt("commonmark", {"typographer": True, "html": True}).enable(
    ["smartquotes", "replacements", "strikethrough", "table"]
)


class Literals(dict):
    """Quoted include values, handed to Liquid as variables: Liquid string
    literals have no escapes and cannot hold both quote kinds."""

    def add(self, value: str) -> str:
        key = f"_jl{len(self)}"
        self[key] = value
        return key


def rewrite_includes(src: str, literals: Literals) -> str:
    """Jekyll include syntax -> {% jinclude "name", k: expr, ... %}."""

    def one(m: re.Match) -> str:
        args = []
        for k, dq, sq, bare in ARG.findall(m.group(3) or ""):
            if bare:
                expr = bare
            else:
                raw = dq if (dq or not sq) else sq
                expr = literals.add(re.sub(r"\\(.)", r"\1", raw))
            args.append(f"{k.replace('-', '_')}: {expr}")
        tail = (", " + ", ".join(args)) if args else ""
        return f'{{%{m.group(1)} jinclude "{m.group(2)}"{tail} {m.group(4)}%}}'

    return INCLUDE.sub(one, lax(src))


def lax(src: str) -> str:
    """Liquid 4's lax parser shrugs at things a strict one rejects; the site
    relies on two: {{ x }} written inside a tag ({% assign a = {{b}} | f %})
    and {% capture name = junk %}."""
    src = re.sub(
        r"\{%[^%]*?%\}",
        lambda m: re.sub(r"\{\{\s*(.*?)\s*\}\}", r"\1", m.group(0)),
        src,
        flags=re.S,
    )
    return re.sub(r"(\{%-?\s*capture\s+\w+)\s*=[^%]*?(-?%\})", r"\1 \2", src)


class JInclude:
    blank = False
    tag = "jinclude"

    def __init__(self, token, name, args):
        self.token, self.name, self.args = token, name, args

    @staticmethod
    def parse(token, parser):
        name = parser.parse_expression()
        if parser.kind() == TOKEN_COMMA:
            parser.next()
        args = parser.parse_keyword_arguments(require_commas=False)
        parser.carry_whitespace_control()
        parser.eat(TOKEN_TAG_END)
        return JInclude(token, name, args)

    def render(self, context, buffer):
        env = context.env
        name = str(self.name.evaluate(context))
        params = {a.name.value: a.expr.evaluate(context) for a in self.args}
        params = {k: (None if _undefined(v) else v) for k, v in params.items()}
        if name in env.passthrough:
            buffer.write(env.passthrough[name])
            return
        template = env.get_template(name, context=context, tag="include")
        sub = StringBuffer()
        env.include_depth += 1
        try:
            with context.extend({"include": params}, template=template):
                template.render_with_context(context, sub)
        finally:
            env.include_depth -= 1
        text = sub.getvalue()
        if env.include_depth == 0 and env.on_include:
            text = env.on_include(name, params, text)
        buffer.write(text)

    def children(self):
        return []

    def expressions(self):
        return [self.name, *(a.expr for a in self.args)]

    def block_scope(self):
        return []

    def template_scope(self):
        return []

    def partials(self, context):
        return []


def _undefined(v) -> bool:
    return type(v).__name__ in ("Undefined", "Nothing") or v is None


def _s(v) -> str:
    return "" if _undefined(v) else str(v)


def _plain(v):
    """Liquid drops/undefined -> JSON-able."""
    if _undefined(v):
        return None
    if isinstance(v, dict):
        return {k: _plain(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_plain(x) for x in v]
    if isinstance(v, (str, int, float, bool)):
        return v
    return str(v)


def make_env(repo: Path, site: dict) -> Environment:
    literals = Literals()
    sources = {}
    for f in (repo / "_includes").iterdir():
        if f.is_file():
            sources[f.name] = rewrite_includes(f.read_text(), literals)
    env = Environment(loader=CachingDictLoader(sources), strict_filters=True)
    env.tags["jinclude"] = JInclude
    env.include_depth = 0
    env.on_include = None
    env.unknown_filters = set()
    env.sources = sources
    env.passthrough = {}
    env.literals = literals
    base = str(site.get("baseurl") or "")
    url = str(site.get("url") or "")
    f = env.filters
    # Ruby's to_json: compact separators, UTF-8 left as is.
    f["jsonify"] = lambda _c, v: json.dumps(
        _plain(v), ensure_ascii=False, separators=(",", ":")
    )
    f["markdownify"] = lambda _c, v: MD.render(_s(v))
    stock_sort = f["sort"]

    def sort(ctx, vals, key=None):
        # `sort: title` with no such variable: Ruby Liquid sorts the items
        # themselves, and Documents compare by date, then path (convert.py
        # stores that as _key).
        if (
            (key is None or _undefined(key))
            and isinstance(vals, list)
            and vals
            and isinstance(vals[0], dict)
            and "_key" in vals[0]
        ):
            return sorted(vals, key=lambda d: d["_key"])
        return stock_sort(ctx, vals, key)

    f["sort"] = sort
    f["cgi_escape"] = lambda _c, v: urllib.parse.quote_plus(_s(v))
    f["uri_escape"] = lambda _c, v: urllib.parse.quote(
        _s(v), safe="/:?#[]@!$&'()*+,;=%"
    )
    f["xml_escape"] = lambda _c, v: (
        _s(v)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )
    # Ruby Liquid's escape is CGI.escapeHTML.
    f["escape"] = lambda _c, v: (
        _s(v)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )
    # Not real Jekyll filters, but the site uses them, and Liquid 4's lax mode
    # passes the value through an unknown filter. The tag links rely on it.
    f["cgi_encode"] = lambda _c, v: v
    f["strip_slash"] = lambda _c, v: v
    f["relative_url"] = lambda _c, v: base + "/" + _s(v).lstrip("/")
    f["absolute_url"] = lambda _c, v: url + base + "/" + _s(v).lstrip("/")
    return env


def render(env: Environment, src: str, data: dict) -> str:
    """Render, treating an unknown filter the way Jekyll does (the value
    passes through) but on the record: each one is added to
    env.unknown_filters, and the caller decides whether that fails the build.

    The page's own quoted include values are dropped afterwards (the
    includes' ones, added by make_env, stay), so a long-lived preview process
    does not grow with every render."""
    keep = len(env.literals)
    try:
        return _render(env, src, data)
    finally:
        for i in range(keep, len(env.literals)):
            del env.literals[f"_jl{i}"]


def _render(env: Environment, src: str, data: dict) -> str:
    while True:
        try:
            template = env.parse(rewrite_includes(src, env.literals))
            return template.render({**env.literals, **data})
        except LiquidNameError as e:
            m = re.search(r"unknown filter '([\w-]+)'", str(e))
            if not m or m.group(1) in env.filters:
                raise
            env.unknown_filters.add(m.group(1))
            env.filters[m.group(1)] = lambda _c, v, *a, **k: v
            env.loader = CachingDictLoader(env.sources)  # drop templates parsed before

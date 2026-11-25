#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["pyyaml", "python-liquid==3.0.0", "markdown-it-py", "typer", "rich"]
# ///
"""Convert every Jekyll page into Zola content (bead blog-pzp).

usage: convert.py            # writes zola/content/, prints a JSON report

Sources: the _d, _posts, _td, _ig66, _test collections plus the root
front-matter pages. Feed-like root files (feed.xml, sitemap.xml, search*.json,
links.jsonp) are Zola templates instead, see templates/.

Per page:
- Front matter -> YAML front matter Zola accepts: title, path, date, aliases
  (from redirect_from), taxonomies.tags, template (from layout), and the whole
  original front matter under extra (keys with '-' get '_').
- Liquid is rendered by a real Liquid engine (jekyll_liquid.py), as Jekyll
  does before kramdown: includes, assigns, loops, site.data. A new or edited
  _includes/ file needs no port work. Each include's output is normalized for
  CommonMark (norm_include) and rides through the Markdown fixes as one
  opaque token.
- {% post_url %} -> the target's path.
- Heading ids pinned to the kramdown/GFM slug ({#id}) so deep links survive.
- Relative links resolved against the page's Jekyll URL, because /x and /x/
  resolve "y" differently.
- kramdown-only syntax: markdown="1" stripped, {:start="N"} applied to the
  list, a blank line added after a lone HTML tag line that is followed by
  Markdown (CommonMark keeps an HTML block open until a blank line).
- .html sources (no Markdown in Jekyll either) and pages listed in
  TEMPLATE_PAGES become templates, so CommonMark never sees their HTML.

A Liquid error fails the conversion, so nothing ships silently.
"""

import datetime
import hashlib
import html
import unicodedata
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

import yaml

import os

HERE = Path(__file__).resolve().parent
# SRC: the Jekyll checkout to build (any worktree or ref); defaults to the
# one this toolchain sits in. The toolchain never needs to be on that branch.
REPO = Path(os.environ.get("SRC") or HERE.parent).resolve()
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / ".claude/skills/toc"))
import jekyll_liquid  # noqa: E402
import typography  # noqa: E402
import lists  # noqa: E402
from toc import slugify as toc_slugify  # noqa: E402  the GFM slug rule kramdown's GFM parser uses

# WORK: the Zola site dir being assembled (build.sh makes one per source
# checkout, so one toolchain can build many worktrees at once).
WORK = Path(os.environ.get("WORK") or HERE).resolve()
CONTENT = WORK / "content"
GENERATED = WORK / "templates" / "generated"
WRAP = WORK / "wrap"
CONTENT_MARK = "<!--zola-port:content-->"
COLLECTIONS = {"_d": "d", "_td": "td", "_ig66": "ig66", "_test": "test", "_posts": None}
# Root files rendered by a template of their own name (feeds/json) — skipped here.
FEED_FILES = {
    "feed.xml",
    "sitemap.xml",
    "search.json",
    "search-titles.json",
    "search-pins.json",
    "links.jsonp",
}
# Listing pages whose Liquid loops over site.* — hand-ported to Tera templates.
TEMPLATE_PAGES = {
    "index.md": "generated",
    "featured.html": "generated",
    "tags.html": "pages/tags.html",
    "categories.html": "pages/categories.html",
    "all-posts.md": "pages/all_posts.html",
    "_d/index.html": "pages/d_index.html",
    "_ig66/index.md": "pages/ig66_index.html",
}
LABELS = {
    "_d": "d",
    "_td": "td",
    "_ig66": "ig66",
    "_test": "test",
    "_posts": "posts",
}  # anything else -> empty

FM = re.compile(r"\A---\s*\n(.*?)\n---[ \t]*\n?(.*)\Z", re.S)
COMMENT = re.compile(r"\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}", re.S)
POST_URL = re.compile(r"\{%-?\s*post_url\s+([\w./-]+)\s*-?%\}")
# The current page's include outputs, indexed by token number.
INCS: list = []


def slugify(text: str, seen: dict | None = None) -> str:
    """The id kramdown gave a heading: toc.py's GFM rule, applied to the text
    kramdown saw after entity decoding and smart typography (so "--" is an en
    dash that the slug drops, and "&#8217;" an apostrophe)."""
    text = html.unescape(text)
    text = (
        text.replace("---", "\u2014").replace("--", "\u2013").replace("...", "\u2026")
    )
    # kramdown keeps every \p{Word} char (letters, marks, digits, _); toc.py
    # whitelists ranges, which drops marks such as an emoji's U+FE0F. Shield
    # them through toc.py.
    marks = [c for c in text if unicodedata.category(c).startswith("M")]
    if not marks:
        return toc_slugify(text, seen)
    shield = {c: f"zpmark{ord(c)}z" for c in marks}
    out = toc_slugify("".join(shield.get(c, c) for c in text), seen)
    return re.sub(r"zpmark(\d+)z", lambda m: chr(int(m.group(1))), out)


def is_doc(src: str) -> bool:
    """A collection document, as opposed to a Jekyll page (root or nested)."""
    return Path(src).parts[0] in COLLECTIONS


def jekyll_url(src: str, fm: dict) -> str:
    """The URL Jekyll serves the page at, without .html and without a trailing slash."""
    p = Path(src)
    top = p.parts[0]
    if fm.get("permalink"):
        url = str(fm["permalink"])
    elif top == "_posts":
        m = re.match(r"\d{4}-\d{1,2}-\d{1,2}-(.*)", p.stem)
        url = "/" + (m.group(1) if m else p.stem)
    elif top in COLLECTIONS:
        url = f"/{COLLECTIONS[top]}/" + "/".join(p.parts[1:-1] + (p.stem,))
    else:
        url = "/" + p.with_suffix("").as_posix()
    url = re.sub(r"/index(\.html)?$", "/", url)
    url = re.sub(r"\.html$", "", url)
    url = "/" + url.strip("/")
    return url


def page_url(src: str, fm: dict) -> str:
    """Jekyll's page.url as it prints it. A permalink as written (with a
    leading slash added); documents otherwise use jekyll_url. A page without
    one follows Page#template under `permalink: /:title`: HTML output drops
    its extension, an index becomes its directory, other output keeps it."""
    if fm.get("permalink"):
        return "/" + str(fm["permalink"]).lstrip("/")
    p = Path(src)
    if is_doc(src):
        if p.parts[0] == "_posts":
            return jekyll_url(src, fm)
        # /:collection/:path keeps a trailing "index".
        return f"/{COLLECTIONS[p.parts[0]]}/" + "/".join(p.parts[1:-1] + (p.stem,))
    parent = "" if str(p.parent) == "." else "/" + p.parent.as_posix()
    if p.suffix in (".md", ".markdown", ".html"):
        return parent + "/" if p.stem == "index" else f"{parent}/{p.stem}"
    return f"{parent}/{p.name}"


def write_sitemap(site: dict, parsed: dict, alias_pages: list) -> None:
    """Jekyll's own sitemap.xml template: site.pages (root pages, feed-like
    files with front matter, one redirect page per redirect_from, and
    redirects.json), then site.posts. Order differs from Jekyll's (its page
    order is the filesystem's); the URL set is the same."""
    base = str(site.get("url") or "https://idvork.in").rstrip("/")
    staged = json.loads((WORK / "static-report.json").read_text())["root_pages"]
    locs = [base]
    for src_ in sorted(staged):
        if src_ in parsed:
            fm_ = parsed[src_][0]
        else:  # feed-like files (feed.xml, search.json, ...)
            m = FM.match((REPO / src_).read_text())
            fm_ = (yaml.safe_load(m.group(1)) or {}) if m else {}
        locs.append(base + page_url(src_, fm_))
    locs += [base + a for a in alias_pages]
    locs.append(base + "/redirects.json")
    posts = sorted(
        (s_ for s_ in parsed if Path(s_).parts[0] == "_posts"),
        key=lambda s_: doc_date(parsed[s_][0], s_),
        reverse=True,
    )
    locs += [base + page_url(s_, parsed[s_][0]) for s_ in posts]
    body = "".join(f"    <url>\n        <loc>{u}</loc>\n    </url>\n" for u in locs)
    (WORK / "static" / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + body
        + "</urlset>\n"
    )


def jekyll_base(src: str, fm: dict, url: str) -> str:
    """What the browser resolved relative links against on Jekyll: /x for
    x.html, but /x/ for a page served as x/index.html."""
    p = Path(src)
    raw = str(fm.get("permalink") or "")
    if (
        raw.endswith("/")
        or raw.endswith("/index.html")
        or (not raw and p.stem == "index")
    ):
        return url.rstrip("/") + "/"
    return url


def split_fences(body: str):
    """Yield (is_code, chunk) so rewrites skip fenced and indented code."""
    out, buf, fence = [], [], None
    for line in body.split("\n"):
        s = line.lstrip()
        if fence is None and (s.startswith("```") or s.startswith("~~~")):
            out.append((False, buf))
            buf, fence = [line], s[:3]
            continue
        if fence is not None:
            buf.append(line)
            if s.startswith(fence):
                out.append((True, buf))
                buf, fence = [], None
            continue
        buf.append(line)
    out.append((fence is not None, buf))
    return [(c, "\n".join(b)) for c, b in out if b]


def pin_heading_ids(text: str, seen: dict) -> str:
    lines = text.split("\n")
    out = []
    raw = None  # inside <script>/<style>/<pre>: a "# x" line is not a heading
    for i, line in enumerate(lines):
        if raw:
            if f"</{raw}>" in line:
                raw = None
            out.append(line)
            continue
        r = re.match(r"\s*<(script|style|pre|textarea)\b", line)
        if r and f"</{r.group(1)}>" not in line:
            raw = r.group(1)
            out.append(line)
            continue
        m = re.match(r"^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$", line)
        if m and not re.search(r"\{#[^}]*\}\s*$", m.group(2)):
            line = f"{m.group(1)} {m.group(2)} {{#{slugify(m.group(2), seen)}}}"
        elif m:
            # Already pinned: still claim the slug so later duplicates suffix.
            seen.setdefault(re.search(r"\{#([^}]*)\}", m.group(2)).group(1), 0)
        # Setext heading: a one-line paragraph underlined with === or ---.
        elif (
            re.fullmatch(r"(=+|-{2,})\s*", line)
            and out
            and out[-1].strip()
            and not re.match(r"\s|[|\-*>#<+\d]", out[-1])
            and (len(out) < 2 or not out[-2].strip())
        ):
            level = "#" if line.startswith("=") else "##"
            heading = out.pop().strip()
            line = f"{level} {heading} {{#{slugify(heading, seen)}}}"
        out.append(line)
    return "\n".join(out)


HTML_LINE = re.compile(
    r"^\s*(</?(div|details|summary|figure|figcaption|section|aside|nav|p|table|center|span|br|hr)\b[^>]*/?>\s*)+$"
)


def closes_block(lines: list[str], i: int) -> bool:
    """Does the close-tag line i end the HTML block that began at the last
    blank line (so text after it is outside the block, as kramdown read it)?"""
    if lines[i] != lines[i].lstrip():
        return False
    j = i
    while j > 0 and lines[j - 1].strip():
        j -= 1
    chunk = "\n".join(lines[j : i + 1])
    tags = set(re.findall(r"</([a-z][a-z0-9]*)>", lines[i]))
    return all(
        len(re.findall(rf"<{t}\b", chunk)) == len(re.findall(rf"</{t}>", chunk))
        for t in tags
    ) and bool(re.match(r"\s*<", lines[j]))


CLOSE_ONLY = re.compile(r"^\s*(</[a-z][a-z0-9]*>\s*)+$")
MD_START = re.compile(r"^\s{0,3}([*+-]\s|\d+[.)]\s|#{1,6}\s|>|\|)")
RAW_BLOCK = re.compile(
    r"<(div|p|details|table|figure|section|center|aside|nav|blockquote|ul|ol|dl|form|iframe)\b([^>]*)>"
)


def raw_html_blocks(lines: list[str], notes: dict) -> list[str]:
    """kramdown (parse_block_html off) reads a column-0 HTML block up to its
    matching close tag as raw HTML; CommonMark ends it at the first blank line
    and parses the rest as Markdown. Drop the blank lines inside such a block
    (only those without markdown=, which kept kramdown parsing Markdown)."""
    out, i = [], 0
    while i < len(lines):
        m = RAW_BLOCK.match(lines[i])
        if not m or "markdown=" in m.group(2):
            out.append(lines[i])
            i += 1
            continue
        tag, depth, j = m.group(1), 0, i
        while j < len(lines):
            depth += len(re.findall(rf"<{tag}\b", lines[j])) - len(
                re.findall(rf"</{tag}>", lines[j])
            )
            if depth <= 0:
                break
            j += 1
        span = lines[i : j + 1]
        if j < len(lines) and any(not x.strip() for x in span):
            notes["raw_html_blocks"] = notes.get("raw_html_blocks", 0) + 1
            span = [x for x in span if x.strip()]
        out += span
        i = j + 1
    return out


TABLE_SEP = re.compile(r"^\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*$")


def kramdown_tables(lines: list[str], notes: dict) -> list[str]:
    """kramdown tables may open with a separator line (a top border), use +
    in separators, and repeat separators to split the body. GFM wants exactly
    one separator, right under the header row: keep that one, drop the rest."""
    out, i = [], 0
    while i < len(lines):
        if not lines[i].lstrip().startswith("|"):
            out.append(lines[i])
            i += 1
            continue
        j = i
        while j < len(lines) and lines[j].lstrip().startswith("|"):
            j += 1
        block = lines[i:j]
        rows = [r for r in block if not TABLE_SEP.match(r)]
        seps = [r for r in block if TABLE_SEP.match(r)]
        gfm_ok = (
            len(block) > 1
            and not TABLE_SEP.match(block[0])
            and TABLE_SEP.match(block[1])
            and len(seps) == 1
            and "+" not in block[1]
        )
        if seps and rows and not gfm_ok:
            sep = seps[0].replace("+", "|")
            out += [rows[0], sep, *rows[1:]]
            notes["kramdown_tables"] = notes.get("kramdown_tables", 0) + 1
        else:
            out += block
        i = j
    return out


LIST_ITEM = re.compile(r"^( *)(?:[-*+]|\d+[.)])(?: +|$)")


SPAN_IAL = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)\)\{:\s*([^}]*?)\s*\}")
# Block-level to kramdown, inline to CommonMark: <canvas></canvas> alone on a
# line would be wrapped in <p>. Split after the open tag and it is an HTML
# block (CommonMark start condition 7: a line holding one complete tag).
LONE_ELEMENT = re.compile(
    r"^(<(canvas|audio|video|[a-z][a-z0-9]*-[a-z0-9-]+)\b[^>]*>)[ \t]*(</\2>)[ \t]*$",
    re.M,
)


def span_ial(m: re.Match) -> str:
    """![alt](src){: k="v" .c #i} -> <img>: kramdown's attribute list on an image."""
    attrs = []
    for tok in re.findall(r'[\w-]+="[^"]*"|[.#][\w-]+', m.group(3)):
        if tok[0] == ".":
            attrs.append(f'class="{tok[1:]}"')
        elif tok[0] == "#":
            attrs.append(f'id="{tok[1:]}"')
        else:
            attrs.append(tok)
    alt = html.escape(m.group(1), quote=True)
    return f'<img src="{m.group(2)}" alt="{alt}" {" ".join(attrs)} />'


def kramdownisms(text: str, notes: dict) -> str:
    # kramdown math: a $$...$$ paragraph becomes \[...\] for MathJax, its
    # body untouched and no <p>. A comment opens a CommonMark HTML block, so
    # the rest of the line passes raw; finish.py drops the comment.
    text, n = re.subn(
        r"(?m)(?:(?<=\n\n)|\A)\$\$(.+?)\$\$[ \t]*(?=\n\n|\n?\Z)",
        lambda m: "<!--zp-raw-->\\[" + m.group(1).strip() + "\\]",
        text,
    )
    if n:
        notes["math_blocks"] = n
    # A list marker followed by five or more spaces: CommonMark makes the
    # item's text an indented code block, kramdown plain text.
    text, n = re.subn(r"(?m)^([ \t]*(?:[-*+]|\d+\.))[ \t]{5,}(?=\S)", r"\1 ", text)
    if n:
        notes["wide_list_markers"] = n
    lines = kramdown_tables(raw_html_blocks(text.split("\n"), notes), notes)
    text = re.sub(r'\s+markdown="(1|block|span)"', "", "\n".join(lines))
    text, n = SPAN_IAL.subn(span_ial, text)
    if n:
        notes["span_ial"] = notes.get("span_ial", 0) + n
    text = LONE_ELEMENT.sub(r"\1\n\3\n", text)
    # A lone <img> between blank lines: a paragraph to kramdown, a bare HTML
    # block to CommonMark.
    text = re.sub(
        r"(?m)(?:(?<=\n\n)|\A)(<img\b[^>\n]*>)[ \t]*(?=\n\n|\n?\Z)", r"<p>\1</p>", text
    )
    lines = text.split("\n")
    out = []
    for i, line in enumerate(lines):
        m = re.fullmatch(r'\{:\s*start="?(\d+)"?\s*\}\s*', line)
        if m:
            # Apply to the ordered list that follows: CommonMark starts it at
            # its first item's number.
            for j in range(i + 1, min(i + 4, len(lines))):
                if re.match(r"\s*\d+\.\s", lines[j]):
                    lines[j] = re.sub(r"\d+", m.group(1), lines[j], count=1)
                    break
            notes.setdefault("ial_applied", []).append(line.strip())
            continue
        if re.fullmatch(r"\{:.*\}\s*", line):
            notes.setdefault("ial_dropped", []).append(line.strip())
            continue
        nxt = lines[i + 1] if i + 1 < len(lines) else ""
        call = CALL_LINE.fullmatch(line)
        if call and nxt.strip() and not CALL_LINE.fullmatch(nxt):
            if INCS[int(call.group(1))].inline and not (
                MD_START.match(nxt)
                or nxt.lstrip().startswith("<")
                # Output ending in a newline puts a blank line under the call:
                # kramdown then ends the paragraph there.
                or INCS[int(call.group(1))].raw.endswith("\n")
            ):
                # An <img> alone on a line opens a CommonMark HTML block that
                # swallows the paragraph below; with text after it on the same
                # line it is inline, as kramdown read it.
                lines[i + 1] = line.rstrip() + " " + nxt
                notes["joined_img_calls"] = notes.get("joined_img_calls", 0) + 1
                continue
            if not INCS[int(call.group(1))].markdown:
                out += [line, ""]
                notes["blank_after_call"] = notes.get("blank_after_call", 0) + 1
                continue
        out.append(line)
        if HTML_LINE.match(line) and (
            MD_START.match(nxt)
            # kramdown ends the block at its close tag; CommonMark would run
            # it on into the paragraph below.
            or (
                CLOSE_ONLY.match(line)
                and nxt.strip()
                and not nxt.lstrip().startswith("<")
                and closes_block(lines, i)
            )
        ):
            out.append("")
            notes["blank_after_html"] = notes.get("blank_after_html", 0) + 1
    return "\n".join(out)


# ---- includes: Liquid output -> CommonMark-safe, carried as opaque tokens ----

BLOCK_TAG = re.compile(
    r"<(div|p|details|table|figure|section|center|aside|nav|blockquote|ul|ol|dl|form|iframe|script|style|svg|pre|template|dialog|button|video|canvas|h[1-6])\b"
)
INLINE_TAG = re.compile(r"<(img|a|span|em|strong|small|code|sup|sub)\b")
TOKEN = re.compile(r"\{\{<inc (\d+) />\}\}")
CALL_LINE = re.compile(r"\{\{<inc (\d+) />\}\}\s*")


def flatten(src: str) -> str:
    """One HTML block that survives CommonMark.

    kramdown reads an HTML block to its matching close tag; CommonMark ends it
    at the first blank line, and 4-space-indented lines after that become an
    escaped code block. So: dedent every line and drop blank lines, except
    inside <pre>/<textarea>, whose content is kept verbatim.
    """
    out, raw = [], None
    for line in src.split("\n"):
        t = line.strip()
        m = re.match(r"<(style|script|pre|textarea)\b", t)
        if m and not re.search(rf"</{m.group(1)}>", t):
            raw = m.group(1)
            if raw in ("pre", "textarea") and out and out[-1].strip():
                out.append("")
            out.append(t)
            continue
        if raw:
            if t or raw in ("pre", "textarea"):
                out.append(line)
            if re.search(rf"</{raw}>", t):
                raw = None
            continue
        if t:
            out.append(t)
    return "\n".join(out)


class Inc:
    """One include call's output, normalized.

    An include can emit Markdown around its HTML (den_strip's heading and
    note, the image includes' ![]()), so the output is split the way kramdown
    read it: an HTML block runs from a block-level open tag at the start of a
    line to its matching close tag and is flattened; the lines between blocks
    stay Markdown, with a blank line on each side of a block.
    """

    def __init__(self, name: str, text: str):
        self.name = name
        self.raw = text
        lines = text.strip("\n").split("\n")
        parts: list[tuple[bool, str]] = []  # (is_html, text)
        i = 0
        while i < len(lines):
            m = BLOCK_TAG.match(lines[i].lstrip())
            if not m:
                parts.append((False, lines[i]))
                i += 1
                continue
            tag, depth, j = m.group(1), 0, i
            while j < len(lines):
                depth += len(re.findall(rf"<{tag}\b", lines[j])) - len(
                    re.findall(rf"</{tag}>", lines[j])
                )
                if depth <= 0:
                    break
                j += 1
            parts.append((True, flatten("\n".join(lines[i : j + 1]))))
            i = j + 1
        out: list[str] = []
        for k, (is_html, t) in enumerate(parts):
            if is_html:
                if out and out[-1].strip() and not parts[k - 1][0]:
                    out.append("")
                out.append(t)
                if k + 1 < len(parts) and parts[k + 1][1].strip():
                    out.append("")
            else:
                out.append(t.strip() if INLINE_TAG.match(t.lstrip()) else t)
        self.text = re.sub(r"\n{3,}", "\n\n", "\n".join(out)).strip("\n")
        if INLINE_TAG.match(self.text) and re.fullmatch(r"<[^<>]*>", self.text):
            # One tag spread over lines: kramdown read it as a span.
            self.text = " ".join(x.strip() for x in self.text.split("\n"))
        one_line = "\n" not in self.text
        # A lone inline element (the float-right images): kramdown kept it in
        # the paragraph; alone on a line CommonMark opens an HTML block.
        self.inline = one_line and bool(INLINE_TAG.match(self.text))
        # Ends in Markdown: flows into what follows, as kramdown read it.
        self.markdown = bool(parts) and not parts[-1][0] and not self.inline


# Feed-like root files rendered by Jekyll's own Liquid after Zola, from a
# site.posts / site.<collection> model (render_feeds). sitemap.xml is
# write_sitemap's; search-pins.json is still a Zola template.
LIQUID_FEEDS = ("feed.xml", "search.json", "search-titles.json", "links.jsonp")
SITE_DOCS: dict = {}


def site_docs(parsed: dict, urls: dict) -> dict:
    """site.posts and site.<label>: every document with its front matter,
    url, date and tags, in Jekyll's order (Document#<=>: date, then path;
    site.posts newest first)."""
    out: dict = {}
    for src, (fm, _) in parsed.items():
        if not is_doc(src):
            continue
        top = Path(src).parts[0]
        label = "posts" if top == "_posts" else LABELS[top]
        tag = fm.get("tag")
        tags = (
            (tag if isinstance(tag, list) else [tag]) if tag else (fm.get("tags") or [])
        )
        tags = tags.split() if isinstance(tags, str) else [str(t) for t in tags if t]
        date = jekyll_time(fm, src)
        # Document#<=>: a quoted date stays a String, which never compares
        # with a Time, so Ruby falls back to the path: order it as undated.
        order = (
            SITE_TIME
            if label != "posts" and isinstance(fm.get("date"), str)
            else datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S %z")
        )
        out.setdefault(label, []).append(
            {
                **fm,
                "url": page_url(src, fm),
                "path": src,
                "title": fm.get("title"),
                "date": date,
                "tags": tags,
                "collection": label,
                "content": None,
                "_key": (order, src),
            }
        )
    for label, docs in out.items():
        docs.sort(key=lambda d: d["_key"], reverse=label == "posts")
    return out


def render_feeds(out_dir: Path, contents: dict) -> None:
    """Jekyll's feed.xml, search.json, search-titles.json and links.jsonp,
    rendered from their own Liquid. post.content is the page's HTML before
    its layout (finish.py hands it over); a redirect_to document's is a
    newline, as jekyll-redirect-from leaves it."""
    site = {**CACHE_SITE[0], "time": SITE_TIME.strftime("%Y-%m-%d %H:%M:%S %z")}
    for label, docs in SITE_DOCS.items():
        for d in docs:
            d["content"] = (
                "\n"
                if d.get("redirect_to")
                else contents.get(jekyll_url(d["path"], d), "")
            )
        site[label] = docs
    env = CACHE_SITE[1]
    for name in LIQUID_FEEDS:
        f = REPO / name
        if not f.exists():
            continue
        m = re.match(
            r"\A---[ \t]*\n(.*?)^---[ \t]*\n?(.*)\Z", f.read_text(), re.S | re.M
        )
        fm = (yaml.safe_load(m.group(1)) or {}) if m else {}
        text = jekyll_liquid.render(
            env, m.group(2) if m else f.read_text(), {"site": site, "page": fm}
        )
        (out_dir / name).write_text(text)


CACHE_SITE: list = [None, None]


def kramdown_fences(body: str, notes: dict) -> str:
    """A ``` line whose info string has a space is not a fence to kramdown's
    GFM parser; the backticks open a code span that runs to the closing ```,
    so the block renders as a paragraph holding inline code."""

    def one(m: re.Match) -> str:
        notes["fence_as_codespan"] = notes.get("fence_as_codespan", 0) + 1
        code = html.escape(m.group(1) + "\n" + m.group(2) + "\n", quote=False)
        return (
            f'<p><code class="language-plaintext highlighter-rouge">{code}</code></p>'
        )

    return re.sub(
        r"(?m)^ {0,3}```(\S+[ \t]+\S[^`\n]*)\n(.*?)\n {0,3}```[ \t]*$",
        one,
        body,
        flags=re.S,
    )


def html_block_lines(body: str, notes: dict) -> str:
    """Two HTML shapes kramdown reads as one block and CommonMark does not:
    an opening tag whose attributes run over several lines (CommonMark's
    rule 7 needs the whole tag on its first line, else it is a paragraph and
    the tag is escaped), and "</script><style>" on one line (a closing script
    tag cannot start a block, so the CSS after it became a paragraph)."""
    body, n = re.subn(
        r"(</(?:script|style)>)[ \t]*(<(?:script|style)\b)", r"\1\n\2", body
    )
    # pulldown-cmark drops a soft break inside image alt text; kramdown keeps
    # it as whitespace.
    body = re.sub(
        r"!\[([^\]`]*)\]", lambda m: "![" + m.group(1).replace("\n", " ") + "]", body
    )
    out, lines, i = [], body.split("\n"), 0
    fence = None
    while i < len(lines):
        line = lines[i]
        f = re.match(r"\s{0,3}(`{3,}|~{3,})", line)
        if f and not fence:
            fence = f.group(1)
        elif fence and line.strip().startswith(fence):
            fence = None
        elif not fence and re.fullmatch(r"\s{0,3}<[A-Za-z][\w-]*(\s+[^<>]*)?", line):
            j = i + 1
            while (
                j < len(lines)
                and j - i < 30
                and ">" not in lines[j]
                and lines[j].strip()
            ):
                j += 1
            if j < len(lines) and ">" in lines[j] and "<" not in lines[j].split(">")[0]:
                line = " ".join(x.strip() for x in lines[i : j + 1])
                n += 1
                i = j
        out.append(line)
        i += 1
    # A lone inline open tag with no close before the next blank line:
    # kramdown closes it in a paragraph (<p><span></span></p>); CommonMark
    # passes it through as an HTML block and it wraps everything after it.
    for k, line in enumerate(out):
        m = re.fullmatch(
            r"\s*<(span|a|em|strong|small|b|i|u|sup|sub)(\s[^<>]*)?>\s*", line
        )
        if not m:
            continue
        rest = []
        for x in out[k + 1 :]:
            if not x.strip():
                break
            rest.append(x)
        if f"</{m.group(1)}>" not in "\n".join(rest):
            tag = f"<{m.group(1)}{m.group(2) or ''}></{m.group(1)}>"
            prev = out[k - 1] if k else ""
            # Under a paragraph's text it closes inside that paragraph.
            joins = prev.strip() and not re.match(
                r"\s*(<|#|\||[-*+]\s|\d+[.)]\s)", prev
            )
            out[k] = tag if joins else f"<p>{tag}</p>"
            n += 1
    if n:
        notes["html_block_lines"] = n
    return "\n".join(out)


def excerpt_html(first_para: str) -> str:
    """Jekyll's excerpt: the first block through kramdown, plus "\n\n"
    (so an empty first block is "\n\n", truthy in Liquid)."""
    html = jekyll_liquid.MD_PLAIN.render(re.sub(r"\{#[^}]*\}", "", first_para))
    return (html if html.strip() else "\n") + "\n"


def mark_raw_code(text: str) -> str:
    """A raw-HTML <code> kramdown passed through bare; finish.py gives every
    other (Markdown) <code> rouge's class. Backtick spans are left alone."""
    parts = re.split(r"(`+)(.*?)(\1)", text, flags=re.S)
    for k in range(0, len(parts), 4):
        parts[k] = parts[k].replace("<code>", '<code data-zp-raw="">')
    return "".join(parts)


def place_tokens(body: str, incs: list[Inc], notes: dict) -> str:
    """Put each include's output back where its token sits.

    kramdown kept an include's output inside the list item or paragraph it was
    called from. So a token indented under a list item gets its output
    indented to match, and a token in the middle of a line gets its output
    joined onto that line.
    """

    def one(m: re.Match) -> str:
        inc = incs[int(m.group(1))]
        text = inc.text
        line_start = body.rfind("\n", 0, m.start()) + 1
        prefix = body[line_start : m.start()]
        line_end = body.find("\n", m.end())
        rest = body[m.end() : line_end if line_end >= 0 else len(body)]
        prev = body[
            body.rfind("\n", 0, max(line_start - 1, 0)) + 1 : max(line_start - 1, 0)
        ]
        if (
            inc.inline
            and not prefix.strip()
            and not rest.strip()
            and prev.strip()
            and not prev.lstrip().startswith(("<", "#", "{{<inc", "|"))
            and not re.match(r"\s*([-*+]|\d+[.)])\s", prev)
        ):
            # Right under a paragraph's text it joins that paragraph (for
            # CommonMark too: a lone inline tag cannot interrupt one).
            return text
        if inc.inline and not prefix.strip() and not rest.strip():
            # Alone on its line kramdown made it a paragraph; CommonMark would
            # pass the bare tag through as an HTML block, with no <p>.
            notes["inline_paragraphs"] = notes.get("inline_paragraphs", 0) + 1
            return f"<p>{text}</p>"
        if not prefix:
            return text
        if not prefix.strip():
            notes["indented_calls"] = notes.get("indented_calls", 0) + 1
            return text.replace("\n", "\n" + " " * len(prefix))
        if re.search(r"\n[ \t]*\n", text):
            # A blank line in the output ends the caller's paragraph for
            # kramdown too: the output goes in as blocks, the line's rest
            # becomes the next paragraph.
            notes["block_calls"] = notes.get("block_calls", 0) + 1
            return text.rstrip() + "\n\n"
        notes["inline_calls"] = notes.get("inline_calls", 0) + 1

        # Joined into a paragraph, a <script> would be inline text: // comments
        # swallow the joined lines and smart quotes rewrite its strings. Move
        # scripts and styles to just after the paragraph.
        def defer(sm: re.Match) -> str:
            deferred.append(sm.group(0))
            return f"\x00{len(deferred) - 1}\x00"

        text = re.sub(r"<(script|style)\b.*?</\1>", defer, text, flags=re.S)
        return text.replace("\n", " ")

    deferred: list[str] = []
    body = TOKEN.sub(one, body)
    while m := re.search(r"\x00(\d+)\x00", body):
        body = body[: m.start()] + body[m.end() :]
        end = body.find("\n\n", m.start())
        end = len(body) if end < 0 else end
        body = body[:end] + "\n\n" + deferred[int(m.group(1))] + body[end:]
    return body


def site_context() -> dict:
    site: dict = {}
    for name in os.environ.get("JEKYLL_CONFIG", "_config.yml").split(","):
        site.update(yaml.safe_load((REPO / name.strip()).read_text()) or {})
    data = {}
    for f in sorted((REPO / "_data").iterdir()):
        if f.suffix in (".yml", ".yaml"):
            data[f.stem] = yaml.safe_load(f.read_text())
        elif f.suffix == ".json":
            data[f.stem] = json.loads(f.read_text())
    # _plugins/git_data_generator.rb writes site.data.git; build.sh writes ours.
    git = WORK / "data" / "git.json"
    if git.exists():
        data["git"] = json.loads(git.read_text())
    site["data"] = data
    site["github"] = {}
    # jekyll serve points site.url at the server it started; a preview build
    # does the same, so CSS and canonical links stay on the preview.
    if os.environ.get("BASE_URL"):
        site["url"] = os.environ["BASE_URL"].rstrip("/")
    return site


def check_ported(report: dict) -> None:
    """The listing pages are the only hand ports left (templates/pages/). Each
    one's Jekyll source is pinned by hash in ported.lock: when the source
    changes, the port is stale until someone re-syncs it and re-pins."""
    lock_file = HERE / "ported.lock"
    lock = json.loads(lock_file.read_text())
    now = {
        src: hashlib.sha1((REPO / src).read_bytes()).hexdigest()
        for src, t in TEMPLATE_PAGES.items()
        if t != "generated"
    }
    if os.environ.get("PIN_PORTED"):
        lock_file.write_text(json.dumps(now, indent=1, sort_keys=True) + "\n")
        return
    drift = sorted(s for s in now if lock.get(s) != now[s])
    report["ported_drift"] = drift
    if drift:
        msg = f"hand-ported pages changed in Jekyll, re-sync templates/pages/ then PIN_PORTED=1: {drift}"
        if os.environ.get("STRICT"):
            sys.exit(msg)
        print("WARNING: " + msg, file=sys.stderr)


LINK_MD = re.compile(r"(\]\()(\s*<?)([^)\s>]+)")
# A link reference definition; [^x]: is a footnote, not a URL.
LINK_REF = re.compile(r"^(\s{0,3}\[(?!\^)[^\]]+\]:\s*)(\S+)", re.M)
LINK_HTML = re.compile(r"""(<[a-zA-Z][^<>]*?\s(?:href|src)=)(["'])([^"']*)\2""")


def absolutize(text: str, base: str, notes: dict) -> str:
    """Resolve relative URLs against the Jekyll URL (served without a slash)."""

    def fix(url: str) -> str:
        if not url or re.match(r"[a-z][a-z0-9+.-]*:|/|#|\{", url, re.I):
            return url
        # [l20](l20) is a table placeholder src/main.ts swaps for the "- l20"
        # list by its literal href; it is not a link (see fix_all).
        if re.fullmatch(r"l\d+", url):
            return url
        new = urljoin("https://idvork.in" + base, url).removeprefix("https://idvork.in")
        notes.setdefault("relative_links", []).append(f"{url} -> {new}")
        return new

    def fix_all(seg: str) -> str:
        # Zola resolves a Markdown link's relative href itself, so the list
        # placeholders go out as HTML to keep href="l20" literal.
        seg = re.sub(r"\[(l\d+)\]\(\1\)", r'<a href="\1">\1</a>', seg)
        seg = LINK_MD.sub(lambda m: m.group(1) + m.group(2) + fix(m.group(3)), seg)
        seg = LINK_REF.sub(lambda m: m.group(1) + fix(m.group(2)), seg)
        seg = LINK_HTML.sub(
            lambda m: m.group(1) + m.group(2) + fix(m.group(3)) + m.group(2), seg
        )
        seg = re.sub(r"\]\(\s*\)", "](#)", seg)
        # kramdown took a space inside a link URL; CommonMark ends the link.
        seg = re.sub(
            r"\]\(([^()\s\"']+(?: [^()\s\"']+)+)\)",
            lambda m: "](" + m.group(1).replace(" ", "%20") + ")",
            seg,
        )
        # kramdown strikes through only with ~~; pulldown-cmark also takes ~.
        return re.sub(r"(?<![~\\])~(?![~\s])([^~\n]*?[^~\s\\])~(?!~)", r"\\~\1\\~", seg)

    # Component calls carry ids (youtube src="abc"), not URLs: leave them be.
    parts = re.split(
        r"(\{\{<.*?/>\}\}|`+[^`\n]*`+|\{%-?\s*raw\s*-?%\}.*?\{%-?\s*endraw\s*-?%\})",
        text,
        flags=re.S,
    )
    return "".join(p if i % 2 else fix_all(p) for i, p in enumerate(parts))


def plain(md: str) -> str:
    """Jekyll's excerpt is the first paragraph, rendered then strip_html'd."""
    t = re.sub(r"<!--.*?-->", " ", md, flags=re.S)
    t = re.sub(r"\{\{<.*?/>\}\}", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", t)
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"\{#[^}]*\}", "", t)
    t = re.sub(r"[*_`]", "", t)
    return " ".join(t.split())


def aliases_of(fm: dict) -> list[str]:
    a = fm.get("redirect_from") or []
    return ["/" + str(x).strip().strip("/") for x in ([a] if isinstance(a, str) else a)]


def jsonable(v):
    if isinstance(v, (datetime.date, datetime.datetime)):
        return v.isoformat()
    # TOML (which Zola maps extra onto) has no null: drop None values.
    if isinstance(v, dict):
        return {
            str(k).replace("-", "_").replace(" ", "_"): jsonable(x)
            for k, x in v.items()
            if x is not None
        }
    if isinstance(v, list):
        return [jsonable(x) for x in v if x is not None]
    return v


def doc_date(fm: dict, src: str) -> str:
    d = fm.get("date")
    if isinstance(d, (datetime.date, datetime.datetime)):
        return d.isoformat()[:10]
    m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})", str(d or "")) or re.match(
        r"(\d{4})-(\d{1,2})-(\d{1,2})-", Path(src).name
    )
    return "%04d-%02d-%02d" % tuple(map(int, m.groups())) if m else "9999"


# Jekyll's site.time: one build clock, in the build's local zone (CI: UTC).
SITE_TIME = datetime.datetime.now().astimezone()


def jekyll_time(fm: dict, src: str) -> str | None:
    """page.date as Jekyll renders it: a Ruby Time printed
    "%Y-%m-%d %H:%M:%S %z" in the build's local zone. Documents fall back to
    the filename's YYYY-M-D- prefix, then site.time; pages have a date only
    when the front matter gives one (printed as given)."""
    d = fm.get("date")
    if not is_doc(src):
        return str(d) if d else None
    t = None
    if isinstance(d, datetime.datetime):
        t = d if d.tzinfo else d.astimezone()
    elif isinstance(d, datetime.date):
        t = datetime.datetime(d.year, d.month, d.day).astimezone()
    elif d:
        # Time.parse: a numeric offset counts, a zone name it cannot read
        # ("Pacific Standard Time") is ignored and the clock read as local.
        m = re.match(
            r"\s*(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?\s*([+-]\d{2}:?\d{2}|Z)?",
            str(d),
        )
        if m:
            y, mo, dd, hh, mi, ss, off = m.groups()
            naive = datetime.datetime(
                int(y), int(mo), int(dd), int(hh or 0), int(mi or 0), int(ss or 0)
            )
            if off:
                off = off.replace(":", "")
                tz = (
                    datetime.timezone.utc
                    if off == "Z"
                    else datetime.timezone(
                        (1 if off[0] == "+" else -1)
                        * datetime.timedelta(hours=int(off[1:3]), minutes=int(off[3:5]))
                    )
                )
                t = naive.replace(tzinfo=tz).astimezone()
            else:
                t = naive.astimezone()
    if t is None:
        m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})-", Path(src).name)
        t = datetime.datetime(*map(int, m.groups())).astimezone() if m else SITE_TIME
    return t.astimezone().strftime("%Y-%m-%d %H:%M:%S %z")


def zola_date(fm: dict, src: str):
    d = fm.get("date")
    if isinstance(d, str):
        m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})", d)
        d = datetime.date(*map(int, m.groups())) if m else None
    if isinstance(d, datetime.datetime):
        d = d.date()
    if not d:
        m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})-", Path(src).name)
        if m and Path(src).parts[0] == "_posts":
            d = datetime.date(*map(int, m.groups()))
    return d.isoformat() if isinstance(d, datetime.date) else None


def sources() -> list[str]:
    out = []
    for d in COLLECTIONS:
        for p in sorted((REPO / d).rglob("*")):
            rel = p.relative_to(REPO)
            if p.suffix in (".md", ".html", ".markdown") and not any(
                x.startswith((".", "_")) for x in rel.parts[1:]
            ):
                if p.read_bytes().startswith(b"---"):
                    out.append(rel.as_posix())
    staged = json.loads((WORK / "static-report.json").read_text())["root_pages"]
    out += [p for p in staged if p not in FEED_FILES]
    return out


def digest(*parts) -> str:
    h = hashlib.sha1()
    for p in parts:
        h.update(p if isinstance(p, bytes) else str(p).encode())
        h.update(b"\0")
    return h.hexdigest()


def global_key() -> str:
    """Everything a page's output reads besides its own source and the
    cross-page maps: config, data, includes, layouts, git.json, BASE_URL."""
    files = [
        REPO / n.strip()
        for n in os.environ.get("JEKYLL_CONFIG", "_config.yml").split(",")
    ]
    files.append(WORK / "data" / "git.json")
    for d in ("_data", "_includes", "_layouts"):
        files += sorted(p for p in (REPO / d).iterdir() if p.is_file())
    return digest(
        os.environ.get("BASE_URL", ""),
        *((f.name, f.read_bytes() if f.exists() else b"") for f in files),
    )


class Cache:
    """What a long-lived preview process (watch.py) keeps between builds, so
    a one-post edit converts one page. A cold build passes a fresh Cache and
    converts everything, through the same code.

    A page's entry is valid while three things match: its source bytes, the
    global key (config, data, includes, layouts, git.json, BASE_URL) and the
    structure key (every page's URL and redirect_from owner, which post_url,
    collisions and alias stubs read). So an include or layout edit
    reconverts every page and a permalink edit too; a body, title or tag edit
    reconverts that page alone. The converted text lives on disk in WORK
    (content/, wrap/, templates/generated/), not here: RAM holds keys and the
    small per-page facts the site-wide files are rebuilt from.

    The toolchain itself is not in a key: a running process has it loaded,
    so restart the preview after editing zola/*.py.
    """

    def __init__(self):
        self.key = None  # global key the env and entries were made under
        self.site: dict = {}
        self.env = None
        self.fm: dict[
            str, tuple[str, dict | None]
        ] = {}  # src -> (digest, front matter)
        self.pages: dict[str, tuple[tuple, dict]] = {}  # src -> (key, result)
        self.converted = 0  # pages converted (not reused) by the last build


def on_include(name: str, params: dict, text: str) -> str:
    INCS.append(Inc(Path(name).stem.replace("-", "_"), text))
    return f"{{{{<inc {len(INCS) - 1} />}}}}"


def convert_page(src: str, fm: dict, body: str, ctx: dict) -> dict:
    """Convert one page and write its files. Returns what the site-wide
    outputs need from it (report entry, stubs, tags, wrap, files written)."""
    env, site, urls = ctx["env"], ctx["site"], ctx["urls"]
    url = urls[src]
    r: dict = {"files": []}
    notes: dict = {}
    try:
        body = POST_URL.sub(lambda m: ctx["post_urls"][m.group(1)], body)
        base = jekyll_base(src, fm, url)
        hand = TEMPLATE_PAGES.get(src)
        is_template = src in TEMPLATE_PAGES or src.endswith(".html")
        INCS.clear()
        if hand in (None, "generated"):
            page = {**fm, "url": url, "path": src, "title": fm.get("title")}
            if is_doc(src):
                page["collection"] = LABELS.get(Path(src).parts[0])
            body = jekyll_liquid.render(env, body, {"site": site, "page": page})
        for inc in INCS:
            notes.setdefault("includes", {}).setdefault(inc.name, 0)
            notes["includes"][inc.name] += 1
        if not is_template:
            parts = []
            # Before the fence split: a list item or HTML comment can hold a fence.
            body = lists.mark(kramdown_fences(body, notes))
            for code, chunk in split_fences(body):
                if not code:
                    chunk = kramdownisms(chunk, notes)
                    chunk = absolutize(chunk, base, notes)
                parts.append(chunk)
            for inc in INCS:
                # An include's Markdown links are relative to the page too.
                inc.text = typography.apply(
                    html_block_lines(absolutize(inc.text, base, notes), notes)
                )
            # One pass over the whole body, fences included: an HTML comment
            # can hold a fence, so per-chunk state would lose the comment.
            body = place_tokens(
                typography.apply(html_block_lines("\n".join(parts), notes)), INCS, notes
            )
            seen: dict = {}
            body = "\n".join(
                chunk if code else pin_heading_ids(chunk, seen)
                for code, chunk in split_fences(body)
            )
            body = "\n".join(
                chunk if code else mark_raw_code(chunk)
                for code, chunk in split_fences(body)
            )
            if "{% endraw" in body or "{%- endraw" in body:
                raise ValueError("body contains a literal endraw tag")
            body = "{% raw %}" + body + "{% endraw %}"
    except Exception as e:  # noqa: BLE001 — collected and fails the build in convert()
        r["error"] = str(e)
        return r

    kept, r["alias_dropped"] = [], []
    for a in aliases_of(fm):
        if ctx["alias_owner"].get(a) != src:
            r["alias_dropped"].append(
                f"{a} on {src}: Jekyll wrote {ctx['alias_owner'].get(a)}'s"
            )
        elif re.sub(r"\.html$", "", a) in ctx["doc_urls"] or a == url:
            r["alias_dropped"].append(f"{a} on {src}: a document has this URL")
        else:
            kept.append(a)

    # Jekyll's Utils.pluralized_array_from_hash: a singular `tag:` wins,
    # a string is split on whitespace.
    tag = fm.get("tag")
    tags = (tag if isinstance(tag, list) else [tag]) if tag else (fm.get("tags") or [])
    tags = tags.split() if isinstance(tags, str) else [str(t) for t in tags if t]
    r["doc_tags"] = tags if is_doc(src) else []
    layout = str(fm.get("layout") or "")
    first_para = body.removeprefix("{% raw %}").strip().split("\n\n")[0]
    extra = jsonable(dict(fm))
    extra.update(
        source_path=src,
        permalink=url,
        tags_list=tags,
        # kramdown's id for a "### [title](url)" heading on listing pages.
        title_slug=slugify(str(fm.get("title") or "")),
        collection=LABELS.get(Path(src).parts[0]) if is_doc(src) else None,
        # Jekyll's Document#<=>: date (front matter, else the filename's
        # YYYY-M-D- prefix, else site.time, i.e. last), then path;
        # collections iterate in label order (posts newest-first is the
        # template's job).
        sort_key=f"{LABELS.get(Path(src).parts[0], '~')}|{doc_date(fm, src)}|{src}",
        jekyll_date=str(fm["date"]) if fm.get("date") else None,
        # Jekyll pages (root files) have no excerpt; documents do.
        excerpt=plain(first_para) if is_doc(src) and first_para else None,
    )
    for k in ("aliases", "redirect_from", "permalink_raw"):
        extra.pop(k, None)
    zfm = {"title": str(fm.get("title") or "")}
    date = zola_date(fm, src)
    if date:
        zfm["date"] = date
    # jekyll-redirect-from points a stub at page.url as written (/all/).
    r["stubs"] = {a: page_url(src, fm) for a in kept}
    if fm.get("redirect_to"):
        # jekyll-redirect-from replaces the page with its stub.
        r["stubs"][url] = str(fm["redirect_to"])
        r["report"] = {"url": url, "redirect_to": r["stubs"][url]}
        return r
    if tags:
        zfm["taxonomies"] = {"tags": tags}

    name = "home" if src == "index.md" else url.strip("/").replace("/", "__") or "root"
    if is_template and hand in (None, "generated"):
        # Jekyll ran no Markdown over these (.html, or pure-HTML .md), so
        # they become templates and CommonMark never sees them.
        body = mark_raw_code(TOKEN.sub(lambda m: INCS[int(m.group(1))].raw, body))
        if "{% endraw" in body:
            raise SystemExit(f"{src}: body contains a literal endraw tag")
        gen = GENERATED / f"{name}.html"
        gen.write_text("{% raw %}" + body + "{% endraw %}")
        r["files"].append(gen)
        hand = f"generated/{name}.html"
    zfm["template"] = hand or "content.html"
    # The layout is Jekyll's own, rendered by Liquid with a marker where
    # {{ content }} goes; finish.py puts Zola's HTML there. So head, menu,
    # scripts and the annotate tool are never ported and cannot drift.
    layout_file = REPO / "_layouts" / f"{layout}.html"
    if layout and layout_file.exists():
        page_ctx = {
            **fm,
            "url": url,
            "path": src,
            "title": fm.get("title"),
            "tags": tags or None,
            # Jekyll: the first block, rendered (head.html strip_html's it).
            # Jekyll: the first block through kramdown, then "\n\n" (an
            # empty first block still gives "\n\n", which is truthy).
            "excerpt": excerpt_html(first_para) if is_doc(src) else None,
            "date": jekyll_time(fm, src),
            "collection": extra["collection"],
        }
        if is_doc(src):
            # Jekyll documents always carry tags (an empty list is truthy in
            # Liquid, so head.html emits keywords content="").
            page_ctx["tags"] = tags
        elif fm.get("excerpt"):
            page_ctx["excerpt"] = str(fm["excerpt"])
        env.on_include = None
        try:
            wrapped = jekyll_liquid.render(
                env,
                layout_file.read_text(),
                {"site": site, "page": page_ctx, "content": CONTENT_MARK},
            )
        finally:
            env.on_include = on_include
        (WRAP / f"{name}.html").write_text(wrapped)
        r["files"].append(WRAP / f"{name}.html")
        r["wrap"] = f"{name}.html"
    if src == "index.md":
        target = CONTENT / "_index.md"
        zfm["sort_by"] = "none"
        zfm.pop("date", None)
        zfm.pop("taxonomies", None)
    else:
        target = CONTENT / ((url.strip("/").replace("/", "__") or "root") + ".md")
        zfm["path"] = url
    zfm["extra"] = jsonable(extra)
    text = "" if is_template else body
    target.write_text(
        "---\n"
        + yaml.safe_dump(zfm, allow_unicode=True, sort_keys=False)
        + "---\n"
        + text
    )
    r["files"].append(target)
    notes.pop("base", None)
    r["report"] = {"url": url, **notes}
    return r


def convert(cache: Cache) -> dict:
    """Convert every page, reusing the cache's still-valid pages. Returns the
    report; files go to WORK (content/, wrap/, templates/generated/,
    finish.json, data/tags.json, static/redirects.json)."""
    for d in (CONTENT, GENERATED, WRAP):
        d.mkdir(parents=True, exist_ok=True)

    gkey = global_key()
    if cache.key != gkey:
        cache.key, cache.pages = None, {}  # set last: a YAML error must not stick
        cache.site = site_context()
        cache.env = jekyll_liquid.make_env(REPO, cache.site)
        cache.env.on_include = on_include
        cache.key = gkey
    site, env = cache.site, cache.env

    srcs = sources()
    parsed, hashes, fm_cache = {}, {}, {}
    for src in srcs:
        text = (REPO / src).read_text()
        m = FM.match(text)
        if not m:
            continue
        h = digest(text)
        old = cache.fm.get(src)
        fm = old[1] if old and old[0] == h else (yaml.safe_load(m.group(1)) or {})
        fm_cache[src] = (h, fm)
        parsed[src], hashes[src] = (fm, m.group(2)), h
    cache.fm = fm_cache  # deleted sources drop out

    urls = {src: jekyll_url(src, fm) for src, (fm, _) in parsed.items()}
    post_urls = {Path(s).stem: u for s, u in urls.items() if s.startswith("_posts/")}
    report = {"pages": {}, "collisions": [], "alias_dropped": [], "errors": {}}
    tag_docs: dict[str, set] = {}
    stubs: dict[str, str] = {}  # alias path -> the page URL it redirects to
    wraps: dict[str, str] = {}  # page URL -> its rendered layout in WORK/wrap
    taken: dict[str, str] = {}
    for src, url in urls.items():
        if url in taken:
            report["collisions"].append(f"{url}: {taken[url]} wins over {src}")
        else:
            taken[url] = src

    # jekyll-redirect-from writes its stubs after root pages and before
    # collection documents, in page-then-document order: the last write to a
    # URL wins. So an alias beats a root page, a document beats an alias, and
    # of two pages claiming one alias the later one wins.
    def jekyll_order(src: str):
        top = Path(src).parts[0] if is_doc(src) else ""
        return (["", "_posts", "_d", "_td", "_ig66", "_test"].index(top), src)

    alias_owner: dict[str, str] = {}
    for src in sorted(parsed, key=jekyll_order):
        for a in aliases_of(parsed[src][0]):
            alias_owner[a] = src
    doc_urls = {u for s_, u in urls.items() if is_doc(s_)}
    shadowed = {
        s_
        for s_, u in urls.items()
        if not is_doc(s_) and u in {re.sub(r"\.html$", "", a) for a in alias_owner}
    }
    skey = digest(json.dumps([sorted(urls.items()), sorted(alias_owner.items())]))
    ctx = {
        "env": env,
        "site": site,
        "urls": urls,
        "post_urls": post_urls,
        "alias_owner": alias_owner,
        "doc_urls": doc_urls,
    }

    entries, cache.converted = {}, 0
    for src, (fm, body) in parsed.items():
        if taken[urls[src]] != src:
            continue
        if src in shadowed:
            report["shadowed_by_alias"] = report.get("shadowed_by_alias", []) + [src]
            continue
        key = (skey, hashes[src])
        old = cache.pages.get(src)
        if old and old[0] == key and all(f.exists() for f in old[1]["files"]):
            r = old[1]
        else:
            r = convert_page(src, fm, body, ctx)
            cache.converted += 1
        entries[src] = (key, r)
        if "error" in r:
            report["errors"][src] = r["error"]
            continue
        report["alias_dropped"] += r["alias_dropped"]
        for t in r["doc_tags"]:
            tag_docs.setdefault(t, set()).add(src)
        stubs.update(r["stubs"])
        if "wrap" in r:
            wraps[urls[src]] = r["wrap"]
        report["pages"][src] = r["report"]
    cache.pages = entries

    # Files no current page wrote (a deleted or renamed source) go.
    owned = {f for _, r in entries.values() for f in r["files"]}
    for old in [*CONTENT.glob("*.md"), *GENERATED.glob("*.html"), *WRAP.iterdir()]:
        if old not in owned:
            old.unlink()

    # finish.py reshapes Zola's /x/index.html output into Jekyll's /x.html
    # (so URLs, relative links and every tool that reads _site work unchanged)
    # and writes jekyll-redirect-from's stubs.
    flat = [
        u
        for s_, u in urls.items()
        if s_ in report["pages"]
        and "redirect_to" not in report["pages"][s_]
        and u != "/"
        and not jekyll_base(s_, parsed[s_][0], u).endswith("/")
    ]
    dir_alias = {
        "/" + str(x).strip().strip("/")
        for fm_, _ in parsed.values()
        for x in (
            [fm_.get("redirect_from")]
            if isinstance(fm_.get("redirect_from"), str)
            else fm_.get("redirect_from") or []
        )
        if str(x).strip().endswith("/")
    }
    (WORK / "finish.json").write_text(
        json.dumps(
            {
                "flat": flat,
                "stubs": stubs,
                "dir_stubs": sorted(dir_alias),
                "wraps": wraps,
                "mark": CONTENT_MARK,
                # kramdown numbers an ordered list from 1 unless an IAL sets
                # start=; these are the starts the IALs asked for.
                "ol_starts": {
                    urls[s_]: [
                        int(re.search(r"\d+", x).group()) for x in p_["ial_applied"]
                    ]
                    for s_, p_ in report["pages"].items()
                    if p_.get("ial_applied")
                },
            }
        )
    )

    # jekyll-redirect-from's /redirects.json: every redirect page's URL as
    # written in redirect_from (a trailing slash kept), to its owner's
    # page.url.
    # The generator walks site.docs_to_write (collections in order, each
    # sorted by Document#<=>: date, then path) and then site.pages; a later
    # claim on a URL overwrites the value but keeps the key's position.
    def generator_order(src: str):
        top = Path(src).parts[0] if is_doc(src) else ""
        rank = ["_posts", "_d", "_td", "_ig66", "_test"].index(top) if top else 9
        return (rank, doc_date(parsed[src][0], src) if top else "", src)

    SITE_DOCS.clear()
    SITE_DOCS.update(site_docs(parsed, urls))
    CACHE_SITE[:] = [site, env]
    redirects, alias_pages = {}, []
    for src_ in sorted(parsed, key=generator_order):
        fm_ = parsed[src_][0]
        rf = fm_.get("redirect_from") or []
        for x in [rf] if isinstance(rf, str) else rf:
            raw = "/" + str(x).strip().lstrip("/")
            a = "/" + str(x).strip().strip("/")
            alias_pages.append(raw)
            if re.sub(r"\.html$", "", a) not in doc_urls:
                redirects[raw] = "https://idvork.in" + page_url(src_, fm_)
        if fm_.get("redirect_to"):
            t = str(fm_["redirect_to"])
            redirects[urls[src_]] = (
                t if t.startswith("http") else "https://idvork.in" + t
            )
    (WORK / "static" / "redirects.json").write_text(
        json.dumps(redirects, separators=(",", ":"), ensure_ascii=False)
    )
    write_sitemap(site, parsed, alias_pages)
    report["redirects"] = len(redirects)
    # /tags lists every tag a collection document uses, sorted like Liquid's
    # `sort` (case-sensitive), with its document count.
    (WORK / "data" / "tags.json").write_text(
        json.dumps([{"tag": t, "count": len(tag_docs[t])} for t in sorted(tag_docs)])
    )
    check_ported(report)
    report["unknown_filters"] = sorted(env.unknown_filters)
    if env.unknown_filters:
        msg = f"unknown Liquid filters passed through as Jekyll does: {sorted(env.unknown_filters)}"
        if os.environ.get("STRICT"):
            sys.exit(msg)
        print("WARNING: " + msg, file=sys.stderr)
    if report["errors"]:
        raise ConvertError(report)
    return report


class ConvertError(Exception):
    def __init__(self, report: dict):
        errs = report["errors"]
        super().__init__(f"{len(errs)} pages failed to convert: {list(errs)[:5]}")
        self.report = report


def main() -> None:
    try:
        report = convert(Cache())
    except ConvertError as e:
        json.dump(e.report, sys.stdout, indent=1, default=str)
        print()
        sys.exit(str(e))
    json.dump(report, sys.stdout, indent=1, default=str)
    print()


if __name__ == "__main__":
    main()

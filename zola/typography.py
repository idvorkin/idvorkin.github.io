"""kramdown's typography, applied to the Markdown before Zola sees it.

Zola's smart punctuation (pulldown-cmark's) disagrees with kramdown's on
which way a quote curls ('em, "6"", a quote after "!" or ")"), on ".." and
"....", and it has no << >> guillemets; it also curls image alt text, which
kramdown leaves straight. So Zola's is off (config.toml) and this module
ports kramdown 2's rules: parser/kramdown/smart_quotes.rb (SQ_RULES, in
order, first match wins, earliest position first) and
parser/kramdown/typographic_symbol.rb.

Only Markdown text is touched. Skipped verbatim: fenced code (the caller
splits it off), HTML blocks (from a block-level tag line to the next blank
line, as CommonMark reads them), code spans, HTML tags, autolinks, link and
image destinations, image alt text, backslash escapes, {#id} / {: ...}
attribute lists and the include tokens.
"""

import re

SQ_PUNCT = r"""[!"#$%'()*+,\-./:;<=>?@\[\\\]^_`{|}~]"""
SQ_CLOSE = r"""[^ \\\t\r\n\[{(\-]"""
LQ, RQ = {"'": "‘", '"': "“"}, {"'": "’", '"': "”"}

# (regex, handler) in kramdown's order. Each handler gets the match and
# returns the replacement text.
RULES = [
    (re.compile(r"""(["'])(?=[_*]{1,2}\S)""", re.A), lambda m: LQ[m.group(1)]),
    (
        re.compile(rf"""(["'])(?={SQ_PUNCT}(?!\.\.)\B)""", re.A),
        lambda m: RQ[m.group(1)],
    ),
    (re.compile(r"""([ \t\r\n]?)"'(?=[A-Za-z0-9_])"""), lambda m: m.group(1) + "“‘"),
    (re.compile(r"""([ \t\r\n]?)'"(?=[A-Za-z0-9_])"""), lambda m: m.group(1) + "‘“"),
    (re.compile(r"""([ \t\r\n]?)'(?=\d\ds)"""), lambda m: m.group(1) + "’"),
    (
        re.compile(r"""([ \t\r\n])(["'])(?=[A-Za-z0-9_])"""),
        lambda m: m.group(1) + LQ[m.group(2)],
    ),
    (re.compile(rf"""({SQ_CLOSE})(["'])"""), lambda m: m.group(1) + RQ[m.group(2)]),
    (
        re.compile(r"""(["'])(?=[ \t\r\n]|s\b|$)""", re.M | re.A),
        lambda m: RQ[m.group(1)],
    ),
    (re.compile(r"""(.?)'""", re.S), lambda m: m.group(1) + "‘"),
    (re.compile(r"""(.?)\"""", re.S), lambda m: m.group(1) + "“"),
]
SYMS = [
    ("---", "—"),
    ("--", "–"),
    ("...", "…"),
    ("\\<<", "<<"),
    ("\\>>", ">>"),
    ("<< ", "« "),
    (" >>", " »"),
    ("<<", "«"),
    (">>", "»"),
]
SYM_RE = re.compile(r"---|--|\.\.\.|\\<<|\\>>|<< |<<| >>|>>")
QUOTE_START = re.compile(
    r"""(?<!\\)(?:["'](?=[_*]{1,2}\S)|["'](?="""
    + SQ_PUNCT
    + r"""(?!\.\.)\B)|[ \t\r\n]?"'(?=\w)|[ \t\r\n]?'"(?=\w)|[ \t\r\n]?'(?=\d\ds)|[ \t\r\n]["'](?=\w)|"""
    + SQ_CLOSE
    + r"""["']|["'](?=[ \t\r\n]|s\b|$)|.?'|.?")""",
    re.M | re.S | re.A,
)
# Spans copied verbatim. Order matters: an image (alt included) before a
# link's text, which IS typographic in kramdown.
SKIP = re.compile(
    r"""(?P<esc>\\[\\`*_{}\[\]()#+\-.!"'<>|~^])"""
    r"""|(?P<code>(`+).+?(?<!`)\3(?!`))"""
    r"""|(?P<img>!\[(?:[^\]\\]|\\.)*\]\([^)]*\))"""
    r"""|(?P<dest>\]\((?:[^()\s]|\([^()]*\))*(?:\s+"[^"]*")?\))"""
    r"""|(?P<auto><(?:https?|mailto|ftp):[^>\s]*>)"""
    r"""|(?P<tag></?[A-Za-z][^>]*>|<!--.*?-->)"""
    r"""|(?P<attr>\{[#:][^}\n]*\})"""
    r"""|(?P<inc>\{\{<inc \d+ />\}\})"""
    r"""|(?P<raw>\{%-?\s*(?:raw|endraw)\s*-?%\})"""
    # Span boundaries: kramdown parses emphasis and link text as nested
    # spans, so a quote right inside or after one has no preceding char.
    r"""|(?P<emph>\*+|(?<![A-Za-z0-9])_+|_+(?![A-Za-z0-9])|!?\[|\])""",
    re.S,
)
BLOCK_HTML = re.compile(
    r"\s{0,3}(?:<(?:script|pre|style|textarea)\b|<!--|<\?|<![A-Za-z]|<!\[CDATA\["
    r"|</?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|/?>|$)"
    r"|</?[A-Za-z][A-Za-z0-9-]*(?:\s+[^>]*)?/?>\s*$)",
    re.I,
)


def _text(s: str, start: int = 0, end: int | None = None) -> str:
    """Typography for s[start:end], one run of plain Markdown text (kramdown's
    span scan: the earliest match wins, a quote rule before a symbol at the
    same spot). Lookaheads see past end: kramdown's quote rules look at the
    emphasis marks that follow, which SKIP splits off."""
    end = len(s) if end is None else end
    out, i = [], start
    while i < end:
        mq = QUOTE_START.search(s, i)
        ms = SYM_RE.search(s, i, end)
        mq = mq if mq and mq.start() < end else None
        if not mq and not ms:
            break
        if mq and (not ms or mq.start() <= ms.start()):
            m = None
            for rx, fn in RULES:
                m = rx.match(s, mq.start())
                if m and mq.start() < m.end() <= end:
                    break
                m = None
            if not m:
                out.append(s[i : mq.start() + 1])
                i = mq.start() + 1
                continue
            out.append(s[i : m.start()])
            out.append(fn(m))
            i = m.end()
        else:
            out.append(s[i : ms.start()])
            out.append(dict(SYMS)[ms.group(0)])
            i = ms.end()
    out.append(s[i:end])
    return "".join(out)


def _line_spans(text: str) -> str:
    out, i = [], 0
    for m in SKIP.finditer(text):
        out.append(_text(text, i, m.start()))
        out.append(m.group(0))
        i = m.end()
    out.append(_text(text, i))
    return "".join(out)


# Block syntax made of dashes, never text: table delimiter rows, thematic
# breaks, setext underlines.
VERBATIM = re.compile(
    r"\s*\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*$|\s{0,3}([-*_])(\s*\2){2,}\s*$"
)
SETEXT = re.compile(r"\s{0,3}(=+|-+)\s*$")  # an underline only under text


END = {
    "script": re.compile(r"</(script|pre|style|textarea)>", re.I),
    "comment": re.compile(r"-->"),
    "pi": re.compile(r"\?>"),
    "decl": re.compile(r">"),
    "cdata": re.compile(r"\]\]>"),
}
START = [
    ("script", re.compile(r"\s{0,3}<(script|pre|style|textarea)(\s|>|$)", re.I)),
    ("comment", re.compile(r"\s{0,3}<!--")),
    ("pi", re.compile(r"\s{0,3}<\?")),
    ("decl", re.compile(r"\s{0,3}<![A-Za-z]")),
    ("cdata", re.compile(r"\s{0,3}<!\[CDATA\[")),
]
LIST_ITEM = re.compile(r"\s{0,3}(?:[-*+]|\d{1,9}[.)])(?:\s|$)")


FENCE = re.compile(r"\s{0,3}(`{3,}|~{3,})")


def apply(md: str) -> str:
    """Typography for a Markdown body; fenced code is left alone. HTML blocks
    end as CommonMark ends them (types 1-5 at their closing marker, 6-7 at a
    blank line); indented code (4+ spaces after a blank line, outside a list)
    is left alone."""
    out, para = [], []
    end = None  # an open HTML block: an END key, or "blank"
    in_code = in_list = False
    fence = None
    prev_blank = True

    def flush():
        if para:
            out.append(_line_spans("\n".join(para)))
            para.clear()

    for line in md.split("\n"):
        blank = not line.strip()
        if fence:
            out.append(line)
            if line.strip().startswith(fence) and not line.strip().strip(fence[0]):
                fence = None
            continue
        if end:
            out.append(line)
            if (end == "blank" and blank) or (end != "blank" and END[end].search(line)):
                end = None
            prev_blank = blank
            continue
        if in_code:
            if blank or line.startswith(("    ", "\t")):
                out.append(line)
                prev_blank = blank
                continue
            in_code = False
        if blank:
            flush()
            out.append(line)
            prev_blank = True
            continue
        fm = FENCE.match(line)
        if fm:
            flush()
            fence = fm.group(1)
            out.append(line)
            continue
        indented = line.startswith(("    ", "\t"))
        if indented and prev_blank and not para and not in_list:
            flush()
            in_code = True
            out.append(line)
            prev_blank = False
            continue
        if not indented:
            in_list = bool(LIST_ITEM.match(line)) or (in_list and not prev_blank)
        kind = next((k for k, rx in START if rx.match(line)), None)
        if kind or (BLOCK_HTML.match(line) and not para):
            flush()
            out.append(line)
            if kind and END[kind].search(line[line.find("<") + 2 :]):
                pass  # opened and closed on one line
            else:
                end = kind or "blank"
            prev_blank = False
            continue
        if (
            VERBATIM.match(line)
            and not (prev_blank and re.fullmatch(r"\s{0,3}--?\s*", line))
            or SETEXT.match(line)
            and not prev_blank
        ):
            flush()
            out.append(line)
            prev_blank = False
            continue
        para.append(line)
        prev_blank = False
    flush()
    return "\n".join(out)

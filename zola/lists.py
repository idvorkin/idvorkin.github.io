"""kramdown's per-item list looseness, carried through CommonMark as markers.

kramdown decides per item whether its first paragraph gets a <p>
(parser/kramdown/list.rb, the `:transparent` rule); CommonMark decides per
list. mark() reads the Markdown the way kramdown's list parser does and puts
a marker comment on each item's first line: <!--zp-t--> (no <p>) or
<!--zp-l--> (a <p>). finish.py then unwraps or wraps that item's first
paragraph and drops the markers, whatever CommonMark decided for the list.

kramdown's rule, for an item whose first child is a paragraph: it stays bare
when (A) the item has no other child, or the next child is not a blank line,
or it is the last item and holds just [p, blank]; and (B) it is not the last
item, or the list has one item, or some earlier item did not start with a
paragraph or stayed bare. Blank lines between items belong to the item above.
"""

import re

LIST = re.compile(r"^( {0,3})([-*+]|\d{1,9}[.)])([ \t]+|$)(.*)$")
HR = re.compile(r"^ {0,3}([-*_])(\s*\1){2,}\s*$")
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
T, L = "<!--zp-t-->", "<!--zp-l-->"


def _block_start(s: str) -> bool:
    """A line kramdown would not read as paragraph text."""
    t = s.lstrip()
    return (
        not t
        or t.startswith(("#", "```", "~~~", ">", "|", "<", "{%", "{{<inc", "$$"))
        or bool(LIST.match(s.lstrip()))
        or bool(HR.match(s))
        or s.startswith(("    ", "\t"))
    )


def _kind(marker: str) -> str:
    return "ul" if marker in "-*+" else "ol"


def _scan(lines: list[str], idx: list[int], edits: dict) -> None:
    """Find every list in these lines (original indexes in idx), decide each
    item, recurse into item contents."""
    i, n = 0, len(lines)
    fence = None
    while i < n:
        line = lines[i]
        f = FENCE.match(line)
        if fence:
            if f and f.group(1)[0] == fence[0] and len(f.group(1)) >= len(fence):
                fence = None
            i += 1
            continue
        if f:
            fence = f.group(1)
            i += 1
            continue
        if line.lstrip().startswith("<"):
            # Raw HTML: a comment runs to its "-->" (a marker inside would
            # close it early), any other block to the next blank line.
            if line.lstrip().startswith("<!--"):
                while i < n and "-->" not in lines[i]:
                    i += 1
            else:
                while i < n and lines[i].strip():
                    i += 1
            i += 1
            continue
        m = LIST.match(line)
        if not m or HR.match(line):
            i += 1
            continue
        kind = _kind(m.group(2))
        items: list[dict] = []
        j, last_blank = i, False
        while j < n:
            s = lines[j]
            mm = LIST.match(s)
            if (
                mm
                and not HR.match(s)
                and _kind(mm.group(2)) == kind
                and (not items or len(mm.group(1)) < items[-1]["ci"])
            ):
                sp = len(mm.group(3).expandtabs(4)) if mm.group(4) else 1
                ci = len(mm.group(1)) + len(mm.group(2)) + (sp if 1 <= sp <= 4 else 1)
                items.append({"ci": ci, "rows": [(j, mm.group(4))]})
                last_blank = False
            elif not items:
                break
            elif not s.strip():
                items[-1]["rows"].append((j, ""))
                last_blank = True
            elif len(s) - len(s.lstrip(" ")) >= items[-1]["ci"]:
                items[-1]["rows"].append((j, s[items[-1]["ci"] :]))
                last_blank = False
            elif not last_blank and not _block_start(s) and not LIST.match(s):
                items[-1]["rows"].append((j, s.strip()))  # lazy continuation
            else:
                break
            j += 1
        earlier_bare_or_not_p = False
        for k, it in enumerate(items):
            rows = it["rows"]
            text = [r[1] for r in rows]
            first_p = bool(text[0].strip()) and not _block_start(text[0])
            # the first paragraph: up to a blank or a block start
            e = 1
            while e < len(text) and text[e].strip() and not _block_start(text[e]):
                e += 1
            rest = text[e:]
            has_more = bool(rest)
            next_blank = has_more and not rest[0].strip()
            only_blank_after = has_more and all(not x.strip() for x in rest)
            last = k == len(items) - 1
            a = (not has_more) or (not next_blank) or (last and only_blank_after)
            b = (not last) or len(items) == 1 or earlier_bare_or_not_p
            bare = first_p and a and b
            if first_p:
                edits[idx[rows[0][0]]] = T if bare else L
            if not first_p or bare:
                earlier_bare_or_not_p = True
            # nested content
            _scan(text[1:], [idx[r[0]] for r in rows[1:]], edits)
        i = max(j, i + 1)


def mark(text: str) -> str:
    lines = text.split("\n")
    edits: dict = {}
    _scan(lines, list(range(len(lines))), edits)
    for k, mk in edits.items():
        # Before a trailing hard break ("  " or a backslash) or attribute
        # list, so both keep working.
        m = re.match(r"(.*?)(\s*(?:\{[#:][^}]*\})?(?:  +|\\)?)$", lines[k])
        lines[k] = m.group(1) + mk + m.group(2)
    return "\n".join(lines)


def apply_html(html: str) -> str:
    """Unwrap or wrap each marked item's first paragraph, drop the markers."""
    if "<!--zp-" not in html:
        return html
    # Bare: <li><p>text<!--zp-t-->more</p> -> <li>textmore
    html = re.sub(
        r"(<li\b[^>]*>)\s*<p>((?:(?!</p>|<p>).)*?)"
        + re.escape(T)
        + r"((?:(?!</p>|<p>).)*?)</p>",
        r"\1\2\3",
        html,
        flags=re.S,
    )
    # Loose but CommonMark kept it tight: wrap the item's leading text.
    html = re.sub(
        r"(<li\b[^>]*>)(?!\s*<p>)((?:(?!<li\b|</li>|<(?:ul|ol|div|blockquote|pre|table|p)\b).)*?)"
        + re.escape(L)
        + r"((?:(?!<li\b|</li>|<(?:ul|ol|div|blockquote|pre|table|p)\b).)*)",
        lambda m: f"{m.group(1)}<p>{m.group(2)}{m.group(3).rstrip()}</p>\n",
        html,
        flags=re.S,
    )
    return html.replace(T, "").replace(L, "")

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

LIST = re.compile(
    r"^( {0,3})([-*+]|\d{1,9}[.)])([ \t]+|$)(.*)$"
)  # group 3 empty: bare marker
HR = re.compile(r"^ {0,3}([-*_])(\s*\1){2,}\s*$")
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
T, L = "<!--zp-t-->", "<!--zp-l-->"
ESC, PARA, TABLE, DROP, DL = "escape", "paragraph", "table", "drop", "dl"
BREAK, AFTER = "<break>", "<after>"  # blank line before / after an HTML line
INLINE = "<!--zp-i-->"
# kramdown's span-level HTML elements; any other tag starts a block.
SPAN = set(
    "a abbr acronym b big bdo br button cite code del dfn em i img input ins kbd"
    " label mark option q rb rbc rp rt rtc ruby samp select small span strong"
    " sub sup tt u var textarea".split()
)
NOHEAD = "<!--zp-nohead-->"
CODE = re.compile(r"(`+).*?\1")
# kramdown's separator line: dashes, optional colons, | or + between cells.
DELIM = re.compile(r"^\s*\|?\s*:?-+:?\s*([|+]\s*:?-+:?\s*)*\|?\s*$")


def _cells(s: str) -> int:
    """Cells in a kramdown table row, 0 when the line has no bare pipe
    (escaped pipes and pipes in code spans do not count)."""
    t = re.sub(r"\\.", "xx", s.strip())
    t = CODE.sub(lambda m: "x" * len(m.group(0)), t)
    if "|" not in t:
        return 0
    t = t[1:] if t.startswith("|") else t
    t = t[:-1] if t.endswith("|") else t
    return t.count("|") + 1


def _table(text: list[str], k: int) -> int:
    """kramdown makes a table of any block whose every line holds a bare pipe;
    GFM wants a delimiter row second. The block's length when only kramdown
    would see a table, else 0."""
    t = text[k].lstrip()
    if text[k].startswith(("    ", "\t")):  # indented code
        return 0
    if t.startswith(("#", "<", ">", "```", "~~~")) or LIST.match(t):
        return 0
    e = k
    while e < len(text) and text[e].strip():
        if not _cells(text[e]):
            return 0
        e += 1
    if e - k >= 2 and DELIM.match(text[k + 1]) or DELIM.match(text[k]):
        return 0  # GFM sees it too, or kramdown's leading separator (_lead)
    return e - k


def _lead(text: list[str], k: int) -> bool:
    """A table opening on a separator line, then a row and a separator:
    kramdown drops the first separator and heads the table with the row."""
    return (
        k + 2 < len(text)
        and bool(DELIM.match(text[k]))
        and "|" in text[k]
        and bool(_cells(text[k + 1]))
        and not DELIM.match(text[k + 1])
        and bool(DELIM.match(text[k + 2]))
    )


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


def _scan(lines: list[str], idx: list[int], edits: dict, start: int = 0) -> None:
    """Find every list in these lines (original indexes in idx), decide each
    item, recurse into item contents (start=1 skips the item's own line)."""
    i, n = start, len(lines)
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
        tag = re.match(r" {0,3}<([a-zA-Z][\w-]*)(?=[\s/>]|$)", line)
        if (
            tag
            and tag.group(1).lower() not in SPAN
            and i
            and lines[i - 1].strip()
            and not _block_start(lines[i - 1])
        ):
            # kramdown lets a block-level (or unknown) element interrupt a
            # paragraph; CommonMark only for its own list of names.
            edits[idx[i]] = BREAK
        closed = re.match(r" {0,3}<([a-zA-Z][\w-]*)\b[^>]*>.*</\1>\s*$", line)
        if (
            closed
            and closed.group(1).lower() not in SPAN
            and i + 1 < n
            and lines[i + 1].strip()
            and not lines[i + 1].lstrip().startswith("<")
        ):
            # kramdown's block ends at its closing tag: the next line starts
            # a paragraph, where CommonMark would keep it in the HTML block.
            edits[idx[i]] = edits.get(idx[i], "") + AFTER
        lone = re.match(r" {0,3}</?([a-zA-Z][\w-]*)\b[^>]*>\s*$", line)
        if (
            lone
            and lone.group(1).lower() in SPAN
            and (i == 0 or not lines[i - 1].strip())
        ):
            # A lone span-level tag starts a paragraph for kramdown, an HTML
            # block for CommonMark; anything after the tag makes it text.
            edits[idx[i]] = INLINE
            i += 1
            continue
        if line.lstrip().startswith("<"):
            # Raw HTML: a comment runs to its "-->" (a marker inside would
            # close it early), any other block to the next blank line.
            if re.match(r" {1,3}<!--.*-->\s*$", line):
                # kramdown reads an indented one-line comment as a paragraph.
                edits[idx[i]] = PARA
            elif line.lstrip().startswith("<!--"):
                while i < n and "-->" not in lines[i]:
                    i += 1
            else:
                while i < n and lines[i].strip():
                    i += 1
            i += 1
            continue
        if (i == 0 or not lines[i - 1].strip()) and _lead(lines, i):
            edits[idx[i]] = DROP
            i += 1
            continue
        if (i == 0 or not lines[i - 1].strip()) and _table(lines, i):
            edits[idx[i]] = (TABLE, _cells(line), None)
            i += _table(lines, i)
            continue
        m = LIST.match(line)
        if m and not m.group(3) and (i == 0 or not lines[i - 1].strip()):
            # A marker with nothing after it starts no list in kramdown
            # (it wants a space): CommonMark's empty item becomes text.
            edits[idx[i]] = ESC
            i += 1
            continue
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
                and mm.group(3)
                and not HR.match(s)
                and _kind(mm.group(2)) == kind
                and (not items or len(mm.group(1)) < items[-1]["ci"])
            ):
                sp = len(mm.group(3).expandtabs(4)) if mm.group(4) else 1
                ci = len(mm.group(1)) + len(mm.group(2)) + (sp if 1 <= sp <= 4 else 1)
                items.append({"ci": ci, "rows": [(j, mm.group(4))]})
                if kind == "ul" and mm.group(2) != m.group(2):
                    # kramdown keeps one list across - * +; CommonMark would
                    # start another at the changed bullet.
                    edits[("bullet", idx[j])] = m.group(2)
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
            dds = 0
            while 1 + dds < len(text) and re.match(r":\s+\S", text[1 + dds]):
                dds += 1
            if dds and text[0].strip() and not _block_start(text[0]):
                # term + ": definition" lines: kramdown's definition list.
                # ponytail: dt/dd text goes in as-is, no inline Markdown;
                # one page uses it. Render the spans if a second one appears.
                dl = f"<dl><dt>{text[0].strip()}</dt>" + "".join(
                    f"<dd>{x[1:].strip()}</dd>" for x in text[1 : 1 + dds]
                )
                edits[idx[rows[0][0]]] = (DL, it["ci"], dl + "</dl>")
                for r in rows[1 : 1 + dds]:
                    edits[idx[r[0]]] = DROP
                earlier_bare_or_not_p = True
                _scan(text, [idx[r[0]] for r in rows], edits, start=1 + dds)
                continue
            table = _table(text, 0)
            if table:
                edits[idx[rows[0][0]]] = (TABLE, _cells(text[0]), it["ci"])
            first_p = bool(text[0].strip()) and not _block_start(text[0]) and not table
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
            _scan(text, [idx[r[0]] for r in rows], edits, start=1)
        i = max(j, i + 1)


def mark(text: str) -> str:
    lines = text.split("\n")
    edits: dict = {}
    _scan(lines, list(range(len(lines))), edits)
    for k, mk in list(edits.items()):
        if isinstance(k, tuple):
            ln = lines[k[1]]
            lines[k[1]] = re.sub(r"^(\s*)[-*+]", lambda m: m.group(1) + mk, ln, count=1)
            continue
        if isinstance(mk, tuple) and mk[0] == DL:
            lines[k] = lines[k][: mk[1]] + mk[2]
            continue
        if isinstance(mk, tuple):
            # Marker line, the row, then a delimiter row so GFM sees a table;
            # finish.py turns the header back into a body row.
            _, cells, ci = mk
            line = lines[k]
            ind = " " * ci if ci is not None else line[: len(line) - len(line.lstrip())]
            head = line[:ci] if ci is not None else ind
            row = line[ci:] if ci is not None else line.lstrip()
            delim = (
                "| " + " | ".join(["---"] * cells) + " |"
            )  # pipes: "---" alone is a heading
            lines[k] = (
                f"{head.rstrip() + ' ' if ci is not None else head}{NOHEAD}\n{ind}{row}\n{ind}{delim}"
            )
            continue
        if mk in (BREAK, AFTER, BREAK + AFTER):
            lines[k] = (
                ("\n" if BREAK in mk else "") + lines[k] + ("\n" if AFTER in mk else "")
            )
            continue
        if mk == INLINE:
            lines[k] = lines[k].rstrip() + INLINE
            continue
        if mk == DROP:
            lines[k] = None
            continue
        if mk == PARA:
            lines[k] = "<p>" + lines[k].strip() + "</p>"
            continue
        if mk == ESC:
            lines[k] = re.sub(r"^(\s*\d*)(\S)", r"\1\\\2", lines[k])
            continue
        # Before a trailing hard break ("  " or a backslash) or attribute
        # list, so both keep working.
        m = re.match(r"(.*?)(\s*(?:\{[#:][^}]*\})?(?:  +|\\)?)$", lines[k])
        lines[k] = m.group(1) + mk + m.group(2)
    return "\n".join(x for x in lines if x is not None)


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
    html = re.sub(
        re.escape(NOHEAD) + r"\s*(<table>.*?</table>)",
        lambda m: _no_head(m.group(1)),
        html,
        flags=re.S,
    )
    return html.replace(T, "").replace(L, "").replace(INLINE, "")


def _no_head(table: str) -> str:
    """kramdown's header-less table: every row in <tbody>, cells <td>."""
    table = re.sub(r"<th\b", "<td", table).replace("</th>", "</td>")
    table = re.sub(r"</thead>\s*<tbody>", "", table)
    return table.replace("<thead>", "<tbody>").replace("</thead>", "</tbody>")

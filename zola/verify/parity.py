#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["beautifulsoup4", "lxml"]
# ///
"""The parity gate: file-by-file diff of two build trees (Jekyll _site vs Zola
out, same commit). Exits 1 when a file differs that accepted.txt does not
list (parity.sh runs it; zola/update.sh runs that).

usage: parity.py <jekyll> <zola> <out.csv> <buckets.json>
HTML is normalized (parsed, attributes sorted, whitespace collapsed, ISO
timestamps and build dates masked) before comparing, then the difference is
bucketed by WHERE it sits (head / #content-holder / rest of body) and, inside
the content, by the most frequent tag-sequence change.
"""

import csv
import difflib
import json
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urljoin

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

J, Z = Path(sys.argv[1]), Path(sys.argv[2])
SKIP_TOP = {"pagefind", "back-links.json"}  # derived indexes, built separately
TS = re.compile(r"20\d\d-\d\d-\d\d[T ][\d:.]+(Z|[+-]\d\d:?\d\d)?|\b20\d\d-\d\d-\d\d\b")


def files(root: Path) -> set:
    return {
        p.relative_to(root).as_posix()
        for p in root.rglob("*")
        if p.is_file() and p.relative_to(root).parts[0] not in SKIP_TOP
    }


CUR = {"url": "/"}


def attr_val(k, v):
    """Equivalences a browser cannot tell apart: whitespace inside style,
    a relative href/src vs the same URL made root-absolute, %20 vs space."""
    v = " ".join(v) if isinstance(v, list) else str(v)
    v = " ".join(v.split())  # whitespace inside an attribute value
    if k in ("href", "src") and not v.startswith(
        ("http:", "https:", "mailto:", "data:", "javascript:", "#")
    ):
        v = unquote(urljoin("https://h" + CUR["url"], v).removeprefix("https://h"))
    elif k in ("href", "src"):
        v = unquote(v)
    return TS.sub("<TS>", v)


def norm(node) -> list[str]:
    """Token stream: open tags with sorted attrs, text chunks. A <pre> is one
    token of its text: hljs.highlightAll() re-tokenizes every code block in
    the browser, so rouge's spans never reach the reader."""
    out = []

    def walk(n):
        for el in n.children:
            if isinstance(el, Comment):
                continue
            if isinstance(el, NavigableString):
                t = TS.sub("<TS>", " ".join(str(el).split()))
                if t:
                    out.append("T:" + t)
            elif isinstance(el, Tag):
                if el.name == "pre":
                    out.append("<pre>")
                    out.append("PRE:" + " ".join(el.get_text().split()))
                    continue
                attrs = " ".join(
                    f'{k}="{attr_val(k, v)}"' for k, v in sorted(el.attrs.items())
                )
                out.append(f"<{el.name} {attrs}>")
                walk(el)

    if isinstance(node, Tag):
        walk(node)
    return out


def tags_only(tokens):
    return [t.split(" ")[0] for t in tokens if t.startswith("<")]


def split(html: bytes):
    s = BeautifulSoup(html, "lxml")
    head = norm(s.head) if s.head else []
    ch = s.select_one("#content-holder")
    content = norm(ch) if ch else []
    if ch:
        ch.replace_with(s.new_tag("content-holder"))
    body = norm(s.body) if s.body else []
    return head, content, body


def _trim(a, b):
    i = 0
    n = min(len(a), len(b))
    while i < n and a[i] == b[i]:
        i += 1
    j = 0
    while j < n - i and a[len(a) - 1 - j] == b[len(b) - 1 - j]:
        j += 1
    return i, a[i : len(a) - j][:1500], b[i : len(b) - j][:1500]


def first_change(a, b):
    _, a, b = _trim(a, b)
    sm = difflib.SequenceMatcher(None, a, b)
    ops = [o for o in sm.get_opcodes() if o[0] != "equal"]
    if not ops:
        return None, 0
    op, i1, i2, j1, j2 = ops[0]
    return f"{op} J{a[i1:i2][:3]} -> Z{b[j1:j2][:3]}"[:400], len(ops)


def sig(a, b):
    """Most common tag-level change, as a bucket key."""
    _, a, b = _trim(a, b)
    sm = difflib.SequenceMatcher(None, a, b)
    c = Counter()
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op != "equal":
            c[f"{op}: {' '.join(a[i1:i2][:4])} -> {' '.join(b[j1:j2][:4])}"] += 1
    return c.most_common(1)[0][0] if c else ""


jf, zf = files(J), files(Z)
rows, buckets, examples = [], Counter(), {}
head_buckets, head_examples = Counter(), {}


def add(rel, bucket, detail=""):
    rows.append({"file": rel, "bucket": bucket, "detail": detail})
    buckets[bucket] += 1
    examples.setdefault(bucket, (rel, detail))


for rel in sorted(jf - zf):
    top = rel.split("/")[0] if "/" in rel else "(root)"
    add(rel, f"only-jekyll:{top}")
for rel in sorted(zf - jf):
    top = rel.split("/")[0] if "/" in rel else "(root)"
    add(rel, f"only-zola:{top}")

for rel in sorted(jf & zf):
    a, b = (J / rel).read_bytes(), (Z / rel).read_bytes()
    if a == b:
        add(rel, "identical-bytes:" + ("html" if rel.endswith(".html") else "asset"))
        continue
    if not rel.endswith(".html"):
        if rel.endswith((".json", ".xml", ".txt", ".js", ".css", ".md", ".jsonp")):
            na, nb = (
                TS.sub("T", " ".join(a.decode(errors="replace").split())),
                TS.sub("T", " ".join(b.decode(errors="replace").split())),
            )
            if na == nb:
                add(rel, "same-after-normalize:text")
            else:
                d, n = first_change(na.split(" "), nb.split(" "))
                add(rel, f"differs:{rel.rsplit('.', 1)[-1]}", f"{n} hunks; {d}")
        else:
            add(rel, "differs:binary")
        continue
    if b'http-equiv="refresh"' in a[:3000] and len(a) < 3000:
        ta = re.search(rb'url=([^"]+)"', a)
        tb = re.search(rb'url=([^"]+)"', b)
        add(
            rel,
            "redirect:same-target"
            if ta and tb and ta.group(1) == tb.group(1)
            else "redirect:target-differs",
            f"{ta and ta.group(1)} vs {tb and tb.group(1)}",
        )
        continue
    u = "/" + rel[:-5]
    CUR["url"] = "/" if u == "/index" else u[:-5] if u.endswith("/index") else u
    ha, ca, ba = split(a)
    hb, cb, bb = split(b)
    where = [
        n
        for n, x, y in (("head", ha, hb), ("content", ca, cb), ("body-chrome", ba, bb))
        if x != y
    ]
    if not where:
        add(rel, "same-after-normalize:html")
        continue
    if "head" in where:
        hd = first_change(ha, hb)[0] or ""
        hk = re.sub(r'"[^"]*"', '""', hd)[:120]
        head_buckets[hk] += 1
        head_examples.setdefault(hk, (rel, hd))
    if "content" in where:
        ta, tb = tags_only(ca), tags_only(cb)
        kind = "structure" if ta != tb else "text-only"
        sub = (
            sig(ta, tb)
            if kind == "structure"
            else (first_change(ca, cb)[0] or "")[:120]
        )
        bucket = f"html:{'+'.join(where)}:{kind}"
        if kind == "structure":
            bucket += " | " + sig(ta, tb)[:90]
        add(rel, bucket, first_change(ca, cb)[0] or "")
    else:
        part = where[0]
        x, y = {"head": (ha, hb), "body-chrome": (ba, bb)}[part]
        add(rel, f"html:{'+'.join(where)}", first_change(x, y)[0] or "")

with open(sys.argv[3], "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["file", "bucket", "detail"])
    w.writeheader()
    w.writerows(rows)
json.dump(
    {
        "total_jekyll": len(jf),
        "total_zola": len(zf),
        "buckets": [
            {
                "bucket": k,
                "count": v,
                "example": examples[k][0],
                "detail": examples[k][1],
            }
            for k, v in buckets.most_common()
        ],
        "head_buckets": [
            {
                "bucket": k,
                "count": v,
                "example": head_examples[k][0],
                "detail": head_examples[k][1],
            }
            for k, v in head_buckets.most_common()
        ],
    },
    open(sys.argv[4], "w"),
    indent=1,
)
print(len(rows), "files;", len(buckets), "buckets")

# The gate. accepted.txt lists the files allowed to differ, with the reason.
OK = ("identical-bytes", "same-after-normalize", "redirect:same-target")
accepted = {
    line.split()[0]
    for line in (Path(__file__).parent / "accepted.txt").read_text().splitlines()
    if line.strip() and not line.startswith("#")
}
bad = [r for r in rows if not r["bucket"].startswith(OK) and r["file"] not in accepted]
stale = sorted(accepted - {r["file"] for r in rows if not r["bucket"].startswith(OK)})
for r in bad:
    print(f"DIFFERS {r['file']}: {r['bucket'][:80]} {r['detail'][:160]}")
for f in stale:
    print(f"now equal, drop from accepted.txt: {f}")
print(f"parity: {len(bad)} unexpected difference(s)")
sys.exit(1 if bad else 0)

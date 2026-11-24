#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["beautifulsoup4", "lxml"]
# ///
"""Tag-skeleton diff of two builds: the fast loop for converter work.

usage: skeleton.py <jekyll _site> <zola out> [url ...]

For every page (or the ones named) compares the sequence of tags inside
#content-holder. No browser, a few seconds for the whole site. Prints the
pages with the most structural differences and, across the site, the most
common difference (as "jekyll tags -> zola tags"), which is usually one
converter rule waiting to be written.
"""

import difflib
import sys
from collections import Counter
from pathlib import Path

from bs4 import BeautifulSoup, Tag

SKIP = {"script", "style", "span", "code", "em", "strong", "br", "svg", "path", "g"}


def skeleton(path: Path) -> list[str]:
    soup = BeautifulSoup(path.read_bytes(), "lxml")
    node = soup.select_one("#content-holder") or soup.body
    if node is None:
        return []
    out = []
    for t in node.descendants:
        if (
            isinstance(t, Tag)
            and t.name not in SKIP
            and not t.find_parent(["svg", "pre"])
        ):
            parent = t.parent.name if isinstance(t.parent, Tag) else ""
            out.append(f"{parent}>{t.name}")
    return out


def main() -> None:
    j, z = Path(sys.argv[1]), Path(sys.argv[2])
    only = set(sys.argv[3:])
    kinds: Counter = Counter()
    where: dict[str, list[str]] = {}
    pages = []
    for p in sorted(j.rglob("*.html")):
        rel = p.relative_to(j).as_posix()
        url = "/" + rel[:-5]
        q = z / rel
        if (only and url not in only) or not q.exists() or rel.startswith("pagefind/"):
            continue
        a, b = skeleton(p), skeleton(q)
        if a == b:
            continue
        n = 0
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(
            None, a, b, autojunk=False
        ).get_opcodes():
            if op == "equal":
                continue
            n += max(i2 - i1, j2 - j1)
            kind = f"{' '.join(a[i1:i2][:4]) or '(nothing)'}  ->  {' '.join(b[j1:j2][:4]) or '(nothing)'}"
            kinds[kind] += 1
            where.setdefault(kind, []).append(url)
        pages.append((n, url))
    pages.sort(reverse=True)
    print(f"{len(pages)} pages differ in structure")
    for n, url in pages[:25]:
        print(f"  {n:5d}  {url}")
    print("\nmost common differences (jekyll -> zola):")
    for kind, n in kinds.most_common(30):
        print(f"  {n:5d}  {kind}    e.g. {', '.join(sorted(set(where[kind]))[:3])}")


if __name__ == "__main__":
    main()

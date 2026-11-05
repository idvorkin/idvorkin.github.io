#!/usr/bin/env python3
"""Check every https://idvork.in link in skill/*.md against the built site.

A link passes when its page exists in _site (directly, or as a permalink or
redirect in back-links.json) and, if it carries a #fragment, that id exists in
the rendered page. A deep link must point at the canonical permalink: the
redirect stubs drop the fragment. Page-level links to posts are listed so the
"deep-link to the section" rule stays visible; only broken links fail.

Needs `_site/` and `back-links.json` (see AGENTS.md, "First commit in a fresh
worktree"). Usage: scripts/check_skill_links.py [--list]
"""

import argparse
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LINK_RE = re.compile(r"https?://idvork\.in(/[^\s)>\"`,]*)?")
ID_RE = re.compile(r"""\sid=["']([^"']+)["']""")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument(
        "--list", action="store_true", help="print every link and its status"
    )
    args = ap.parse_args()

    site = REPO / "_site"
    index = REPO / "back-links.json"
    if not site.is_dir() or not index.is_file():
        print(
            "Error: needs _site/ and back-links.json; run jekyll build and build_back_links.py build"
        )
        return 2
    data = json.loads(index.read_text())
    redirects, url_info = data["redirects"], data["url_info"]
    ids_cache: dict[str, set[str]] = {}

    def page_ids(html_file: Path) -> set[str]:
        key = str(html_file)
        if key not in ids_cache:
            ids_cache[key] = set(ID_RE.findall(html_file.read_text(errors="replace")))
        return ids_cache[key]

    counts = {"deep": 0, "page": 0, "other": 0, "template": 0, "broken": 0}
    page_level, broken = [], []
    for md in sorted((REPO / "skill").glob("*.md")):
        for ln, line in enumerate(md.read_text().splitlines(), 1):
            for m in LINK_RE.finditer(line):
                url = m.group(0).rstrip(".;:")
                where = f"skill/{md.name}:{ln}"
                path, _, frag = (url.split("idvork.in", 1)[1] or "/").partition("#")
                if "<" in path:  # e.g. https://idvork.in/<permalink> in instructions
                    counts["template"] += 1
                    continue
                p = path.rstrip("/") or "/"
                hops = 0
                while p in redirects and hops < 10:
                    p, hops = redirects[p], hops + 1
                if p in url_info:
                    kind, html_file = "post", REPO / url_info[p]["file_path"]
                else:
                    cands = (
                        [site / "index.html"]
                        if p == "/"
                        else [
                            site / p.lstrip("/"),
                            site / (p.lstrip("/") + ".html"),
                            site / p.lstrip("/") / "index.html",
                        ]
                    )
                    html_file = next((c for c in cands if c.is_file()), None)
                    kind = "other"
                status = "ok"
                if html_file is None or not html_file.is_file():
                    status = "page not found"
                elif frag and hops:
                    status = f"redirects to {p}; the fragment is lost, link {p}#{frag}"
                elif frag and frag not in page_ids(html_file):
                    status = f"no id '{frag}' in {html_file.relative_to(REPO)}"
                if status != "ok":
                    counts["broken"] += 1
                    broken.append((where, url, status))
                elif frag:
                    counts["deep"] += 1
                elif kind == "post":
                    counts["page"] += 1
                    page_level.append((where, url))
                else:
                    counts["other"] += 1
                if args.list:
                    print(f"{where}\t{url}\t{status}")

    total = sum(counts.values())
    posts = counts["deep"] + counts["page"]
    pct = 100 * counts["deep"] / posts if posts else 100.0
    print(
        f"{total} idvork.in links: {counts['deep']} deep, {counts['page']} page-level posts, "
        f"{counts['other']} non-post (home, /all, static), {counts['template']} templates, "
        f"{counts['broken']} broken"
    )
    print(f"Deep-linked: {counts['deep']}/{posts} post links ({pct:.1f}%)")
    for where, url in page_level:
        print(f"  page-level: {where} {url}")
    for where, url, why in broken:
        print(f"  BROKEN: {where} {url}: {why}")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())

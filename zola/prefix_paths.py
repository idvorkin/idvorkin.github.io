#!/usr/bin/env python3
"""Serve a build under a URL prefix (a project Pages site at /blog-zola/).

The site's links are root-absolute ("/magic", "/assets/x.css", fetch of
"/back-links.json"), which only works at the root of a host. This rewrites a
finished build in place so each of them carries PREFIX. build.sh calls it when
BASE_URL has a path. Absolute https:// URLs already carry the prefix (they come
from BASE_URL) and "//host" URLs are left alone. pagefind/ is untouched: it
finds its own files relative to its script.

    prefix_paths.py OUT /blog-zola

ponytail: regex over generated HTML/JS/JSON, not a parser. Known ceiling:
index.js features that read location.pathname without the prefix (the
"edit on GitHub" link, per-page title mapping) are off by the prefix. Upgrade
path: a site.base_path the templates and index.js honor natively.
"""

import re
import sys
from pathlib import Path

out, prefix = Path(sys.argv[1]), sys.argv[2].rstrip("/")
PATH = r"/(?!/)[A-Za-z0-9_.~%-][^\s\"'`<>()\\]*"  # "/x", never "/" alone or "//x"
counts: dict[str, int] = {}


def add(kind: str):
    """re.sub callback: put the prefix after group 1 (the opener)."""

    def f(m):
        counts[kind] = counts.get(kind, 0) + 1
        return m.group(1) + prefix + m.group(2)

    return f


def html(t: str) -> str:
    t = re.sub(
        rf"""(\b(?:href|src|action|content|poster|data-src|data-href|data-permalink|data-url)\s*=\s*["'])({PATH})""",
        add("attr"),
        t,
    )

    def srcset(m):
        parts = [
            prefix + p
            if p.lstrip().startswith("/") and not p.lstrip().startswith("//")
            else p
            for p in m.group(2).split(",")
        ]
        counts["srcset"] = counts.get("srcset", 0) + 1
        return m.group(1) + ",".join(parts) + m.group(3)

    t = re.sub(r"""(\bsrcset\s*=\s*")([^"]*)(")""", srcset, t)
    t = re.sub(rf"""(url\(\s*['"]?)({PATH})""", add("css-url"), t)
    t = re.sub(rf"""(location(?:\.href)?\s*=\s*["'])({PATH})""", add("location"), t)
    t = re.sub(
        rf"""(\b(?:from|import)\s*["'])({PATH})""", add("import"), t
    )  # inline module imports
    t = re.sub(
        rf"""("\s*:\s*")({PATH})""", add("inline-json"), t
    )  # {"img": "/images/x.webp"}
    t = re.sub(
        rf"""([\[,]\s*")({PATH})""", add("inline-array"), t
    )  # ["/a.webp", "/b.webp"]
    return t


def strings(t: str, kind: str) -> str:
    # every string literal that is a root path, in JS or JSON (keys too: the
    # back-links lookup is by location.pathname, which now has the prefix)
    return re.sub(rf"""(["'`])({PATH})(?=\1|[#?$])""", add(kind), t)


for f in sorted(out.rglob("*")):
    parts = f.relative_to(out).parts
    if (
        not f.is_file()
        or "pagefind" in parts
        or ("vendor" in parts and f.suffix != ".css")
    ):
        continue
    suf = f.suffix
    if suf not in (".html", ".css", ".js", ".json", ".webmanifest"):
        continue
    t = f.read_text(errors="surrogateescape")
    o = t
    if suf == ".html":
        t = html(t)
    elif suf == ".css":
        t = re.sub(rf"""(url\(\s*['"]?)({PATH})""", add("css-url"), t)
    elif suf == ".js":
        t = strings(t, "js-string")
    else:
        t = strings(t, "json-string")
    if t != o:
        f.write_text(t, errors="surrogateescape")

# Pagefind result URLs come out of its index as "/magic": give it the root.
idx = out / "assets/js/index.js"
needle = "await e.options({ basePath: Re })"
js = idx.read_text()
if needle not in js:
    sys.exit("index.js changed: the pagefind baseUrl patch no longer applies")
idx.write_text(
    js.replace(needle, f'await e.options({{ basePath: Re, baseUrl: "{prefix}/" }})')
)
print("prefix_paths:", prefix, counts)

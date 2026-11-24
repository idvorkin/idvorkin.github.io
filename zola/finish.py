#!/usr/bin/env python3
"""Give the Zola output Jekyll's shape.

usage: finish.py <work dir> <out dir> <site url>

Zola writes every page as /x/index.html. Jekyll (permalink: /:title) writes
/x.html, which Pages serves at /x. Keeping Jekyll's shape means URLs, relative
links, back-links.json keys, Pagefind URLs, the JS that reads
location.pathname and every tool that reads _site/*.html behave the same on
both builds, so nothing outside zola/ has to know which generator ran.

Also writes jekyll-redirect-from's stubs, byte-for-byte: /old.html for
`redirect_from: /old`, /old/index.html for `/old/`.
"""

import json
import sys
from pathlib import Path

STUB = """<!DOCTYPE html>
<html lang="en-US">
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <link rel="canonical" href="{u}">
  <script>location="{u}"</script>
  <meta http-equiv="refresh" content="0; url={u}">
  <meta name="robots" content="noindex">
  <h1>Redirecting&hellip;</h1>
  <a href="{u}">Click here if you are not redirected.</a>
</html>
"""

work, out, site_url = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3].rstrip("/")
plan = json.loads((work / "finish.json").read_text())
for url in plan["flat"]:
    d = out / url.strip("/")
    src = d / "index.html"
    if not src.exists():
        sys.exit(f"finish: {url} has no index.html in the Zola output")
    src.rename(d.with_name(d.name + ".html"))
    if not any(d.iterdir()):
        d.rmdir()
for alias, target in plan["stubs"].items():
    rel = alias.strip("/")
    if alias in plan["dir_stubs"]:
        dest = out / rel / "index.html"
    elif rel.endswith((".html", ".htm")):
        dest = out / rel
    else:
        dest = out / (rel + ".html")
    if dest.exists():
        continue  # a real page owns the URL, as on Jekyll
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(STUB.format(u=site_url + target))
print(
    f"finish: {len(plan['flat'])} pages flattened, {len(plan['stubs'])} redirect stubs"
)

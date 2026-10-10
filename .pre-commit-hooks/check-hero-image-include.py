#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.8"
# dependencies = []
# ///
"""
Fail when a post embeds its own hero image (the `imagefeaturelocal` /
`imagefeature` from front matter) as a bare markdown image, <img> or <figure>
instead of through a float include such as local_image_float_right.html or
blob_image_float_right.html. A bare hero renders full-width and bumps the
intro, which no other check catches (it is valid markdown with a working link).

ponytail: only the hero is checked, since ~20 posts use bare images on purpose
(comics, diagrams, maps). Extend to all intro images with an allowlist if
this class of mistake shows up elsewhere.
"""

import re
import sys
from pathlib import Path

HERO_KEYS = ("imagefeaturelocal", "imagefeature")
BARE = re.compile(r"^\s*(!\[|<img\b|<figure\b)", re.IGNORECASE)
# Wide multi-panel heroes shown full-width on purpose (2026-10).
ALLOW = {"_d/42.md", "_d/chapters.md"}


def hero_names(text):
    if not text.startswith("---"):
        return set()
    front = text.split("---", 2)[1]
    names = set()
    for line in front.splitlines():
        key, _, val = line.partition(":")
        if key.strip() in HERO_KEYS and val.strip():
            names.add(val.strip().strip("'\"").rsplit("/", 1)[-1])
    return names


def main(paths):
    bad = []
    for p in paths:
        text = Path(p).read_text(encoding="utf-8")
        heroes = hero_names(text)
        if not heroes or Path(p).as_posix() in ALLOW:
            continue
        in_code = False
        for n, line in enumerate(text.splitlines(), 1):
            if line.lstrip().startswith("```"):
                in_code = not in_code
            # Hand-floated markup (class="float-right-img", style="float:...") renders
            # like the include, so only unfloated bare heroes fail.
            if in_code or not BARE.match(line) or "float" in line:
                continue
            hit = next((h for h in heroes if h in line), None)
            if hit:
                bad.append(f"{p}:{n}: hero image {hit} embedded bare")
    for b in bad:
        print(b)
    if bad:
        print(
            "Use the float include instead, e.g. "
            '{% include local_image_float_right.html src="<file>" alt="..." %} '
            "or blob_image_float_right.html (see content_guidelines.md § Images)."
        )
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

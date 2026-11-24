#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["pyyaml"]
# ///
"""Stage the files Jekyll copies verbatim into zola/static/ (hard links).

Mirrors Jekyll 3.9's reader rules closely enough for a byte-for-byte static
inventory: skip names starting with _ . # or ending ~ (unless in `include:`),
skip `exclude:` patterns from _config.yml, and treat any file whose first line
is exactly `---` as a page (the converter owns those). Collection directories
(_d, _td, _ig66, _test) contribute their front-matter-less files under
/<collection>/.

Prints the list of front-matter pages found outside the collections, so the
converter can check it handles every one of them.
"""

import fnmatch
import json
import os
import shutil
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
# SRC: the Jekyll checkout to build; WORK: where generated files go.
REPO = Path(os.environ.get("SRC") or HERE.parent).resolve()
OUT = Path(os.environ.get("WORK") or HERE).resolve() / "static"
COLLECTIONS = {"_d": "d", "_td": "td", "_ig66": "ig66", "_test": "test"}


def has_front_matter(p: Path) -> bool:
    try:
        with p.open("rb") as f:
            return f.readline().rstrip(b"\r\n") == b"---"
    except OSError:
        return False


def main() -> None:
    cfg = yaml.safe_load((REPO / "_config.yml").read_text())
    excludes = list(cfg.get("exclude") or []) + ["zola"]
    includes = set(cfg.get("include") or [])

    def excluded(rel: str) -> bool:
        return any(
            # Jekyll 3.9 EntryFilter#glob_include?: fnmatch OR a bare prefix
            # match ("test" also drops test_blog_review.py).
            rel.startswith(pat.rstrip("*").rstrip("/")) or fnmatch.fnmatch(rel, pat)
            for pat in excludes
        )

    def skip_name(name: str) -> bool:
        if name in includes:
            return False
        return name.startswith(("_", ".", "#")) or name.endswith("~")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    pages, copied = [], 0

    def link(src: Path, dest_rel: str) -> None:
        nonlocal copied
        dest = OUT / dest_rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            os.link(src, dest)
        except OSError:
            shutil.copy2(src, dest)
        copied += 1

    for dirpath, dirnames, filenames in os.walk(REPO):
        d = Path(dirpath)
        rel_dir = d.relative_to(REPO).as_posix()
        rel_dir = "" if rel_dir == "." else rel_dir
        keep = []
        for n in dirnames:
            rel = f"{rel_dir}/{n}" if rel_dir else n
            if skip_name(n) or excluded(rel) or (d / n).is_symlink():
                continue
            keep.append(n)
        dirnames[:] = keep
        for n in filenames:
            rel = f"{rel_dir}/{n}" if rel_dir else n
            p = d / n
            # File symlinks (CLAUDE.md -> AGENTS.md) are followed, as Jekyll
            # does outside safe mode; directory symlinks are skipped above.
            if skip_name(n) or excluded(rel) or (p.is_symlink() and not p.is_file()):
                continue
            if has_front_matter(p):
                pages.append(rel)
            else:
                link(p, rel)

    for src_dir, coll in COLLECTIONS.items():
        base = REPO / src_dir
        for p in base.rglob("*"):
            rel = p.relative_to(base)
            if (
                p.is_dir()
                or any(part.startswith((".", "_")) for part in rel.parts)
                or has_front_matter(p)
            ):
                continue
            link(p, f"{coll}/{rel.as_posix()}")

    json.dump(
        {"static_files": copied, "root_pages": sorted(pages)}, sys.stdout, indent=1
    )
    print()


if __name__ == "__main__":
    main()

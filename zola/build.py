#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["pyyaml", "python-liquid==3.0.0", "markdown-it-py", "typer", "rich"]
# ///
"""The build itself, in one process: stage static files, copy data, write
git.json, convert, zola build, finish.

usage: SRC=<checkout> WORK=<dir> OUT=<dir> BASE_URL=<url> ZOLA=<bin> build.py

build.sh resolves those and runs this once, cold. watch.py imports it and
calls build() on every change with the same Cache, so a one-post edit
converts one page; both go through this one code path.
"""

import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = Path(os.environ["SRC"]).resolve()
WORK = Path(os.environ["WORK"]).resolve()
OUT = Path(os.environ.get("OUT") or WORK / "public")
BASE_URL = os.environ.get("BASE_URL", "https://idvork.in")
ZOLA = os.environ.get("ZOLA", "zola")
sys.path.insert(0, str(HERE))
import convert  # noqa: E402  (reads SRC/WORK/BASE_URL at import)
import finish  # noqa: E402
import stage_static  # noqa: E402


def build(cache: convert.Cache, restage: bool = True) -> dict:
    """One build into OUT. restage=False reuses WORK/static from the last
    build (watch.py passes it when only existing pages changed). Returns
    seconds per step and how many pages were converted."""
    t, times = time.monotonic(), {}

    def lap(name: str) -> None:
        nonlocal t
        now = time.monotonic()
        times[name] = round(now - t, 3)
        t = now

    # templates/generated/ is convert.py's output, cached across builds.
    tdir = WORK / "templates"
    tdir.mkdir(parents=True, exist_ok=True)
    for p in tdir.iterdir():
        if p.name != "generated":
            shutil.rmtree(p) if p.is_dir() else p.unlink()
    shutil.copytree(HERE / "templates", tdir, dirs_exist_ok=True)
    shutil.copy(HERE / "config.toml", WORK / "config.toml")
    if restage or not (WORK / "static-report.json").exists():
        (WORK / "static-report.json").write_text(json.dumps(stage_static.stage()))
    lap("stage")
    data = WORK / "data"
    shutil.rmtree(data, ignore_errors=True)
    data.mkdir()
    for f in [*SRC.glob("_data/*.json"), *SRC.glob("_data/*.yml")]:
        shutil.copy(f, data / f.name)
    branch = os.environ.get("BRANCH") or (
        subprocess.run(
            ["git", "-C", str(SRC), "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
        ).stdout.strip()
        or "unknown"
    )
    (data / "git.json").write_text(
        '{"branch":"%s","pr_number":%s,"changed_pages":[]}\n'
        % (branch, os.environ.get("PR_NUMBER") or "null")
    )
    report = convert.convert(cache)
    (WORK / "convert-report.json").write_text(
        json.dumps(report, indent=1, default=str) + "\n"
    )
    lap("convert")
    subprocess.run(
        [ZOLA, "build", "-o", str(OUT), "--force", "--base-url", BASE_URL],
        cwd=WORK,
        check=True,
        stdout=subprocess.DEVNULL,
    )
    lap("zola")
    finish.finish(WORK, OUT, BASE_URL)
    convert.render_feeds(OUT, finish.CONTENTS)
    lap("finish")
    times["converted"] = cache.converted
    return times


if __name__ == "__main__":
    try:
        times = build(convert.Cache())
    except convert.ConvertError as e:
        (WORK / "convert-report.json").write_text(
            json.dumps(e.report, indent=1, default=str) + "\n"
        )
        sys.exit(str(e))
    print(f"build: {json.dumps(times)}", file=sys.stderr)

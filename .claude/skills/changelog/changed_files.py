#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "typer",
#   "rich",
# ]
# ///
"""Rank blog content files by change frequency since a date.

Replaces the 6-stage shell pipeline
(`git log | grep | sort | uniq -c | sort -rn | head`) with one git call
plus in-memory counting behind a pure `rank_files()` function. Adds
deterministic alphabetical tie-breaking that the bash version lacked.

Output: JSON array of {path, change_count}, sorted by count descending.
"""

from __future__ import annotations

import datetime as dt
import json
import subprocess
from collections import Counter
from dataclasses import asdict, dataclass
from typing import Annotated

import typer

DEFAULT_PREFIXES = ("_d/", "_posts/")
DEFAULT_BRANCH = "upstream/main"
DEFAULT_LIMIT = 20


@dataclass
class FileChange:
    path: str
    change_count: int


def run_git_log(since: dt.date, branch: str = DEFAULT_BRANCH) -> list[str]:
    """Return the raw `git log --name-only --pretty=format:` lines."""
    result = subprocess.run(
        [
            "git",
            "log",
            f"--since={since.isoformat()}",
            "--name-only",
            "--pretty=format:",
            branch,
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.splitlines()


def rank_files(
    lines: list[str],
    prefixes: tuple[str, ...] = DEFAULT_PREFIXES,
    limit: int = DEFAULT_LIMIT,
) -> list[FileChange]:
    """Count file occurrences, filter by content-path prefix, return top N.

    Pure function — ties are broken alphabetically so output is stable.
    """
    matching = [
        line
        for line in lines
        if line and any(line.startswith(prefix) for prefix in prefixes)
    ]
    counts = Counter(matching)
    ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return [
        FileChange(path=path, change_count=count) for path, count in ordered[:limit]
    ]


app = typer.Typer(
    help="Rank blog content files by change frequency.",
    add_completion=False,
    no_args_is_help=True,
    invoke_without_command=True,
)


@app.callback(invoke_without_command=True)
def main(
    since: Annotated[
        dt.datetime, typer.Option(help="Start date (YYYY-MM-DD) for the git log window")
    ],
    branch: Annotated[str, typer.Option(help="Git ref to inspect")] = DEFAULT_BRANCH,
    limit: Annotated[
        int, typer.Option(help="Max number of files in the ranking")
    ] = DEFAULT_LIMIT,
    prefixes: Annotated[
        str, typer.Option(help="Comma-separated path prefixes to keep")
    ] = ",".join(DEFAULT_PREFIXES),
) -> None:
    """JSON output to stdout. Callers parse `path` and `change_count`."""
    prefix_tuple = tuple(p.strip() for p in prefixes.split(",") if p.strip())
    lines = run_git_log(since.date(), branch)
    ranked = rank_files(lines, prefix_tuple, limit)
    print(json.dumps([asdict(r) for r in ranked], indent=2))


if __name__ == "__main__":
    app()

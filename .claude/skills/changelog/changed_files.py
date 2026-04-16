#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# ///
"""Rank blog content files by change frequency since a date.

Replaces the 6-stage shell pipeline:

    git log --since="$START_DATE" --name-only --pretty=format: upstream/main \\
      | grep -E "^_d/|^_posts/" \\
      | sort | uniq -c | sort -rn | head -20

with a stdlib Python helper that keeps the counting + ranking logic as
a pure function (testable without subprocess). The only subprocess call
is `git log`; everything else is in-memory.

Usage:

  changed_files.py --since 2026-04-13
  changed_files.py --since 2026-04-13 --branch main --limit 10
  changed_files.py --since 2026-04-13 --prefixes _d/,_posts/,_includes/

Output: JSON array of {path, change_count}, sorted by count descending
with ties broken alphabetically for deterministic diffing.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from collections import Counter
from dataclasses import asdict, dataclass

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


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--since", type=dt.date.fromisoformat, required=True)
    parser.add_argument("--branch", default=DEFAULT_BRANCH)
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument(
        "--prefixes",
        default=",".join(DEFAULT_PREFIXES),
        help="Comma-separated content-path prefixes to keep.",
    )
    args = parser.parse_args()

    prefixes = tuple(p.strip() for p in args.prefixes.split(",") if p.strip())
    lines = run_git_log(args.since, args.branch)
    ranked = rank_files(lines, prefixes, args.limit)
    print(json.dumps([asdict(r) for r in ranked], indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

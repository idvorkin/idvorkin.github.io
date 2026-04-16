#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# ///
"""Detect and remove partial-week entries in the blog changelog.

Before running the changelog skill mid-week, check whether the top-most
`## Week of YYYY-MM-DD` entry falls within the current ISO week. If so,
it is a partial snapshot left by an earlier run — the next run should
merge it, which is easiest by deleting the old entry and regenerating
fresh from git history.

Commands:

  partial_week.py check                      # JSON report to stdout
  partial_week.py check --today 2026-04-16   # override today (testing)
  partial_week.py delete                     # remove detected partial in place
  partial_week.py delete --dry-run           # show what would change

Stdlib-only. Cross-platform (no GNU `date -d` dependency).
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

CHANGELOG_DEFAULT = Path("_d/changelog.md")


@dataclass
class Report:
    today: str
    weekday: int
    is_monday: bool
    this_monday: str
    this_sunday: str
    most_recent_entry: str | None
    should_merge: bool
    start_date: str | None
    reason: str


def parse_recent_entry(text: str) -> dt.date | None:
    match = re.search(r"^## Week of (\d{4}-\d{2}-\d{2})", text, re.MULTILINE)
    return dt.date.fromisoformat(match.group(1)) if match else None


def analyze(changelog_path: Path, today: dt.date) -> Report:
    weekday = today.isoweekday()
    this_monday = today - dt.timedelta(days=weekday - 1)
    this_sunday = this_monday + dt.timedelta(days=6)

    def build(
        most_recent_entry: str | None,
        should_merge: bool,
        start_date: str | None,
        reason: str,
    ) -> Report:
        return Report(
            today=str(today),
            weekday=weekday,
            is_monday=weekday == 1,
            this_monday=str(this_monday),
            this_sunday=str(this_sunday),
            most_recent_entry=most_recent_entry,
            should_merge=should_merge,
            start_date=start_date,
            reason=reason,
        )

    if weekday == 1:
        return build(None, False, None, "Monday — skip partial merge")

    if not changelog_path.exists():
        return build(None, False, None, f"Changelog not found: {changelog_path}")

    recent = parse_recent_entry(changelog_path.read_text())
    if recent is None:
        return build(None, False, None, "No existing week entries")

    if this_monday <= recent <= this_sunday:
        return build(
            str(recent),
            True,
            str(this_monday),
            f"Entry {recent} falls within this ISO week",
        )

    return build(
        str(recent),
        False,
        None,
        f"Entry {recent} is outside this week ({this_monday} → {this_sunday})",
    )


def delete_partial(
    changelog_path: Path, entry_date: str, dry_run: bool = False
) -> dict:
    """Remove the `## Week of {entry_date}` section body and its TOC entries.

    Returns a summary of what was (or would be) removed.
    """
    text = changelog_path.read_text()

    toc_pattern = (
        rf"^- \[Week of {re.escape(entry_date)}\]\([^)]+\)\n"
        rf"(?:  - \[[^\]]+\]\([^)]+\)\n)*"
    )
    stripped, toc_subs = re.subn(toc_pattern, "", text, count=1, flags=re.MULTILINE)

    section_pattern = (
        rf"^## Week of {re.escape(entry_date)}\n"
        rf".*?"
        rf"(?=^## Week of \d{{4}}-\d{{2}}-\d{{2}}\n|\Z)"
    )
    stripped, sec_subs = re.subn(
        section_pattern, "", stripped, count=1, flags=re.MULTILINE | re.DOTALL
    )

    summary = {
        "toc_entries_removed": toc_subs,
        "section_removed": sec_subs,
        "dry_run": dry_run,
    }
    if not dry_run and (toc_subs or sec_subs):
        changelog_path.write_text(stripped)
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    for name in ("check", "delete"):
        sp = sub.add_parser(name, help=f"{name} partial-week entry")
        sp.add_argument("--changelog", type=Path, default=CHANGELOG_DEFAULT)
        sp.add_argument("--today", type=dt.date.fromisoformat, default=None)
        if name == "delete":
            sp.add_argument("--dry-run", action="store_true")

    args = parser.parse_args()
    today = args.today or dt.date.today()

    report = analyze(args.changelog, today)

    if args.cmd == "check":
        print(json.dumps(asdict(report), indent=2))
        return 0

    if not report.should_merge:
        print(json.dumps({**asdict(report), "action": "no-op"}, indent=2))
        return 0

    assert report.most_recent_entry is not None  # guaranteed by should_merge
    summary = delete_partial(args.changelog, report.most_recent_entry, args.dry_run)
    print(json.dumps({**asdict(report), "action": summary}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

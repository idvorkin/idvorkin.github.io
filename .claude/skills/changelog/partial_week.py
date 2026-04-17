#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "typer",
#   "rich",
# ]
# ///
"""Detect and remove partial-week entries in the blog changelog.

Before running the changelog skill mid-week, check whether the top-most
`## Week of YYYY-MM-DD` entry falls within the current ISO week. If so,
it is a partial snapshot left by an earlier run — the next run should
merge it by deleting the old entry and regenerating fresh from git history.

JSON output on stdout so the changelog skill can parse decision fields.
Cross-platform (no GNU `date -d` dependency).
"""

from __future__ import annotations

import datetime as dt
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

CHANGELOG_DEFAULT = Path("_d/changelog.md")

stderr = Console(stderr=True)

app = typer.Typer(
    help="Detect and remove partial-week entries in the blog changelog.",
    add_completion=False,
    no_args_is_help=True,
)


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

    recent = parse_recent_entry(changelog_path.read_text(encoding="utf-8"))
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
    text = changelog_path.read_text(encoding="utf-8")

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
        changelog_path.write_text(stripped, encoding="utf-8")
    return summary


@app.command(help="Report whether a partial-week entry is present (no mutations)")
def check(
    changelog: Annotated[Path, typer.Option(help="Changelog path")] = CHANGELOG_DEFAULT,
    today: Annotated[
        dt.datetime | None,
        typer.Option(help="Override today (YYYY-MM-DD, for testing)"),
    ] = None,
) -> None:
    """JSON report to stdout. Fields: should_merge, start_date, reason, etc."""
    today_date = today.date() if today else dt.date.today()
    report = analyze(changelog, today_date)
    print(json.dumps(asdict(report), indent=2))


@app.command(help="Remove the detected partial-week entry in place")
def delete(
    changelog: Annotated[Path, typer.Option(help="Changelog path")] = CHANGELOG_DEFAULT,
    today: Annotated[
        dt.datetime | None,
        typer.Option(help="Override today (YYYY-MM-DD, for testing)"),
    ] = None,
    dry_run: Annotated[
        bool, typer.Option("--dry-run", help="Preview without writing")
    ] = False,
) -> None:
    """JSON summary to stdout. Exits 1 if should_merge was True but nothing matched."""
    today_date = today.date() if today else dt.date.today()
    report = analyze(changelog, today_date)

    if not report.should_merge:
        print(json.dumps({**asdict(report), "action": "no-op"}, indent=2))
        return

    assert report.most_recent_entry is not None
    summary = delete_partial(changelog, report.most_recent_entry, dry_run)
    print(json.dumps({**asdict(report), "action": summary}, indent=2))
    # Defensive: should_merge promised a deletable section. If the regex
    # matched nothing, Step 0 MANDATORY would trust a misleading exit 0.
    if not dry_run and summary["section_removed"] == 0:
        stderr.print(
            "[red]ERROR:[/] should_merge was True but delete_partial matched "
            "nothing (regex mismatch?). The partial entry is still in the file."
        )
        raise typer.Exit(code=1)


if __name__ == "__main__":
    app()

"""Unit tests for partial_week.py. Stdlib-only. Run with `python3 -m unittest`."""

from __future__ import annotations

import datetime as dt
import tempfile
import unittest
from pathlib import Path

from partial_week import analyze, delete_partial, parse_recent_entry


class AnalyzeTest(unittest.TestCase):
    def _write(self, text: str) -> Path:
        fd, path = tempfile.mkstemp(suffix=".md")
        import os

        os.close(fd)
        Path(path).write_text(text)
        return Path(path)

    def test_monday_skips_merge(self):
        path = self._write("## Week of 2026-04-13\n")
        r = analyze(path, dt.date(2026, 4, 13))
        self.assertTrue(r.is_monday)
        self.assertFalse(r.should_merge)
        self.assertIn("Monday", r.reason)

    def test_thursday_with_mon_anchored_partial(self):
        path = self._write("## Week of 2026-04-13\n\nsome content\n")
        r = analyze(path, dt.date(2026, 4, 16))
        self.assertTrue(r.should_merge)
        self.assertEqual(r.most_recent_entry, "2026-04-13")
        self.assertEqual(r.start_date, "2026-04-13")

    def test_friday_with_trailing_wed_partial(self):
        path = self._write("## Week of 2026-04-15\n\ncontent\n")
        r = analyze(path, dt.date(2026, 4, 17))
        self.assertTrue(r.should_merge)
        self.assertEqual(r.most_recent_entry, "2026-04-15")
        self.assertEqual(r.start_date, "2026-04-13")

    def test_sunday_with_trailing_partial(self):
        path = self._write("## Week of 2026-04-16\n\ncontent\n")
        r = analyze(path, dt.date(2026, 4, 19))
        self.assertTrue(r.should_merge)

    def test_previous_week_entry_no_merge(self):
        path = self._write("## Week of 2026-04-06\n\ncontent\n")
        r = analyze(path, dt.date(2026, 4, 16))
        self.assertFalse(r.should_merge)
        self.assertEqual(r.most_recent_entry, "2026-04-06")
        self.assertIn("outside this week", r.reason)

    def test_future_entry_no_merge(self):
        path = self._write("## Week of 2026-05-04\n\ncontent\n")
        r = analyze(path, dt.date(2026, 4, 16))
        self.assertFalse(r.should_merge)

    def test_empty_changelog_no_merge(self):
        path = self._write("no week entries yet\n")
        r = analyze(path, dt.date(2026, 4, 16))
        self.assertFalse(r.should_merge)
        self.assertIsNone(r.most_recent_entry)

    def test_missing_changelog_no_merge(self):
        r = analyze(Path("/nonexistent/changelog.md"), dt.date(2026, 4, 16))
        self.assertFalse(r.should_merge)
        self.assertIn("not found", r.reason)

    def test_picks_first_entry_when_multiple_weeks(self):
        text = "## Week of 2026-04-13\n\nrecent\n\n## Week of 2026-04-06\n\nolder\n"
        path = self._write(text)
        r = analyze(path, dt.date(2026, 4, 16))
        self.assertEqual(r.most_recent_entry, "2026-04-13")


class ParseRecentEntryTest(unittest.TestCase):
    def test_returns_first_occurrence(self):
        self.assertEqual(
            parse_recent_entry("## Week of 2026-04-13\nstuff\n## Week of 2026-04-06\n"),
            dt.date(2026, 4, 13),
        )

    def test_returns_none_when_missing(self):
        self.assertIsNone(parse_recent_entry("no entries here"))

    def test_ignores_non_anchored_match(self):
        self.assertIsNone(parse_recent_entry("see ## Week of 2026-04-13 inline"))


class DeletePartialTest(unittest.TestCase):
    SAMPLE = """\
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Week of 2026-04-13](#week-of-2026-04-13)
  - [Theme A](#theme-a)
  - [Theme B](#theme-b)
- [Week of 2026-04-06](#week-of-2026-04-06)
  - [Older theme](#older-theme)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Week of 2026-04-13

_3 commits this week_

### Theme A

Content A.

### Theme B

Content B.

## Week of 2026-04-06

_5 commits this week_

### Older theme

Older content.
"""

    def _write(self, text: str) -> Path:
        fd, path = tempfile.mkstemp(suffix=".md")
        import os

        os.close(fd)
        Path(path).write_text(text)
        return Path(path)

    def test_removes_section_and_toc(self):
        path = self._write(self.SAMPLE)
        summary = delete_partial(path, "2026-04-13")
        self.assertEqual(summary["toc_entries_removed"], 1)
        self.assertEqual(summary["section_removed"], 1)
        new = path.read_text()
        self.assertNotIn("Week of 2026-04-13", new)
        self.assertNotIn("Theme A", new)
        self.assertIn("## Week of 2026-04-06", new)
        self.assertIn("### Older theme", new)

    def test_dry_run_does_not_write(self):
        path = self._write(self.SAMPLE)
        before = path.read_text()
        summary = delete_partial(path, "2026-04-13", dry_run=True)
        self.assertTrue(summary["dry_run"])
        self.assertEqual(path.read_text(), before)

    def test_nonmatching_date_noop(self):
        path = self._write(self.SAMPLE)
        before = path.read_text()
        summary = delete_partial(path, "2026-03-01")
        self.assertEqual(summary["toc_entries_removed"], 0)
        self.assertEqual(summary["section_removed"], 0)
        self.assertEqual(path.read_text(), before)

    def test_removes_last_section_at_eof(self):
        text = (
            "- [Week of 2026-04-13](#week-of-2026-04-13)\n"
            "  - [Only](#only)\n\n"
            "## Week of 2026-04-13\n\n_1 commit_\n\n### Only\n\nThe end.\n"
        )
        path = self._write(text)
        summary = delete_partial(path, "2026-04-13")
        self.assertEqual(summary["toc_entries_removed"], 1)
        self.assertEqual(summary["section_removed"], 1)
        self.assertNotIn("Week of 2026-04-13", path.read_text())


if __name__ == "__main__":
    unittest.main()

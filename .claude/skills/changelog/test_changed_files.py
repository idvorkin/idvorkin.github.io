"""Unit tests for changed_files.py. Stdlib-only. Run with `python3 -m unittest`."""

from __future__ import annotations

import unittest

from changed_files import FileChange, rank_files


class RankFilesTest(unittest.TestCase):
    def test_counts_and_filters_by_prefix(self):
        lines = [
            "_d/ai-journal.md",
            "_d/ai-journal.md",
            "_posts/2026-04-15-hello.md",
            "_plugins/foo.rb",  # not a content file
            "README.md",  # not a content file
            "",  # blank separator from git log --pretty=format:
            "_d/religion.md",
        ]
        result = rank_files(lines)
        self.assertEqual(
            result,
            [
                FileChange(path="_d/ai-journal.md", change_count=2),
                FileChange(path="_d/religion.md", change_count=1),
                FileChange(path="_posts/2026-04-15-hello.md", change_count=1),
            ],
        )

    def test_ties_broken_alphabetically(self):
        lines = ["_d/zeta.md", "_d/alpha.md", "_d/beta.md"]
        result = rank_files(lines)
        paths = [r.path for r in result]
        self.assertEqual(paths, ["_d/alpha.md", "_d/beta.md", "_d/zeta.md"])

    def test_limit_honored(self):
        lines = [f"_d/{c}.md" for c in "abcdefg"]
        result = rank_files(lines, limit=3)
        self.assertEqual(len(result), 3)

    def test_empty_input_yields_empty(self):
        self.assertEqual(rank_files([]), [])

    def test_all_blank_lines_yields_empty(self):
        self.assertEqual(rank_files(["", "", ""]), [])

    def test_custom_prefixes(self):
        lines = ["docs/intro.md", "_d/ai.md", "_includes/header.html"]
        result = rank_files(lines, prefixes=("_d/", "_includes/"))
        paths = {r.path for r in result}
        self.assertEqual(paths, {"_d/ai.md", "_includes/header.html"})
        self.assertNotIn("docs/intro.md", paths)

    def test_sort_is_stable_across_runs(self):
        lines = ["_d/a.md", "_d/b.md", "_d/b.md", "_d/a.md"]
        r1 = rank_files(lines)
        r2 = rank_files(lines)
        self.assertEqual(r1, r2)
        # Highest count first; ties alphabetical
        self.assertEqual([r.path for r in r1], ["_d/a.md", "_d/b.md"])


if __name__ == "__main__":
    unittest.main()

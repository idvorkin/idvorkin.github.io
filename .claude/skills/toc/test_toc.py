"""Unit tests for toc.py. Stdlib-only. Run with `python3 -m unittest`."""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from toc import (
    find_duplicate_headings,
    parse_headings,
    regenerate_toc,
    render_toc,
    slugify,
)


class SlugifyTest(unittest.TestCase):
    """Kramdown-compatible slug — match :Mtoc update byte-for-byte."""

    def test_basic(self):
        self.assertEqual(slugify("Hello World"), "hello-world")

    def test_ampersand_creates_double_hyphen(self):
        # "AI & Machine" — `&` dropped, two spaces collapse to two hyphens
        self.assertEqual(slugify("AI & Machine Learning"), "ai--machine-learning")

    def test_em_dash_creates_double_hyphen(self):
        self.assertEqual(
            slugify("partial — through Thu 2026-04-16"),
            "partial--through-thu-2026-04-16",
        )

    def test_parentheses_stripped(self):
        self.assertEqual(
            slugify("A Private Language of One (Cryptophasia)"),
            "a-private-language-of-one-cryptophasia",
        )

    def test_question_mark_stripped(self):
        self.assertEqual(
            slugify("What do we want our AI friends to do?"),
            "what-do-we-want-our-ai-friends-to-do",
        )

    def test_currency_and_apostrophe(self):
        # Leading "The" keeps the heading starting with alpha, so leading-strip doesn't fire
        self.assertEqual(
            slugify("The $230 Week: When Cheap Coding Isn't"),
            "the-230-week-when-cheap-coding-isnt",
        )

    def test_leading_non_alpha_stripped(self):
        # Leading numbers / symbols dropped until first alphabetic char
        self.assertEqual(slugify("$230 Week"), "week")
        self.assertEqual(slugify("2026-04-13 Update"), "update")

    def test_inline_link_stripped(self):
        self.assertEqual(
            slugify("Read [this paper](https://example.com) first"),
            "read-this-paper-first",
        )

    def test_emphasis_markers_stripped(self):
        self.assertEqual(
            slugify("**Bold** and _italic_ and `code`"), "bold-and-italic-and-code"
        )

    def test_empty_after_strip_yields_empty(self):
        self.assertEqual(slugify("$$$"), "")
        self.assertEqual(slugify(""), "")

    def test_hash_and_slash_dropped(self):
        self.assertEqual(slugify("ai-journal#2026-04-13"), "ai-journal2026-04-13")
        self.assertEqual(slugify("/ai-operator cross-link"), "ai-operator-cross-link")


class ParseHeadingsTest(unittest.TestCase):
    def _tmp(self, text: str) -> Path:
        fd, path = tempfile.mkstemp(suffix=".md")
        os.close(fd)
        Path(path).write_text(text)
        return Path(path)

    def test_basic_levels(self):
        text = "# H1\n## H2\n### H3\n#### H4\n"
        headings = parse_headings(text, 2, 3)
        self.assertEqual(headings, [(2, "H2"), (3, "H3")])

    def test_skips_fenced_code(self):
        text = (
            "## Real\n"
            "```markdown\n"
            "## Fake (inside fence)\n"
            "### Also fake\n"
            "```\n"
            "### Real again\n"
        )
        headings = parse_headings(text, 2, 3)
        self.assertEqual(headings, [(2, "Real"), (3, "Real again")])

    def test_skips_tilde_fences_too(self):
        text = "## Before\n~~~\n## Hidden\n~~~\n### After\n"
        headings = parse_headings(text, 2, 3)
        self.assertEqual(headings, [(2, "Before"), (3, "After")])

    def test_trailing_whitespace_trimmed(self):
        text = "## Heading With Trail   \n"
        headings = parse_headings(text, 2, 2)
        self.assertEqual(headings, [(2, "Heading With Trail")])

    def test_no_headings_yields_empty(self):
        self.assertEqual(parse_headings("no headings here", 1, 6), [])


class RenderTocTest(unittest.TestCase):
    def test_flat_list(self):
        rendered = render_toc([(2, "One"), (2, "Two")])
        self.assertEqual(rendered, "- [One](#one)\n- [Two](#two)")

    def test_nested_list(self):
        rendered = render_toc(
            [(2, "Week"), (3, "Theme A"), (3, "Theme B"), (2, "Other Week")]
        )
        expected = (
            "- [Week](#week)\n"
            "  - [Theme A](#theme-a)\n"
            "  - [Theme B](#theme-b)\n"
            "- [Other Week](#other-week)"
        )
        self.assertEqual(rendered, expected)

    def test_empty_yields_empty(self):
        self.assertEqual(render_toc([]), "")


class RegenerateTocTest(unittest.TestCase):
    def _tmp(self, text: str) -> Path:
        fd, path = tempfile.mkstemp(suffix=".md")
        os.close(fd)
        Path(path).write_text(text)
        return Path(path)

    def test_regenerate_inserts_fresh_toc(self):
        text = (
            "<!-- vim-markdown-toc-start -->\n"
            "\n"
            "- [Old Stale Entry](#old-stale-entry)\n"
            "\n"
            "<!-- vim-markdown-toc-end -->\n"
            "\n"
            "## Week of 2026-04-13\n\n"
            "### AI Journal\n\n"
            "### Other Projects\n\n"
            "## Week of 2026-04-06\n\n"
            "### Something Older\n"
        )
        path = self._tmp(text)
        changed = regenerate_toc(path, 2, 3)
        self.assertEqual(changed, 1)
        new_text = path.read_text()
        self.assertIn("- [Week of 2026-04-13](#week-of-2026-04-13)", new_text)
        self.assertIn("  - [AI Journal](#ai-journal)", new_text)
        self.assertIn("  - [Other Projects](#other-projects)", new_text)
        self.assertIn("- [Week of 2026-04-06](#week-of-2026-04-06)", new_text)
        self.assertIn("  - [Something Older](#something-older)", new_text)
        self.assertNotIn("Old Stale Entry", new_text)

    def test_regenerate_no_change_returns_zero(self):
        text = (
            "<!-- vim-markdown-toc-start -->\n"
            "\n"
            "- [A](#a)\n"
            "\n"
            "<!-- vim-markdown-toc-end -->\n"
            "\n"
            "## A\n"
        )
        path = self._tmp(text)
        changed = regenerate_toc(path, 2, 2)
        self.assertEqual(changed, 0)

    def test_dry_run_does_not_write(self):
        text = (
            "<!-- vim-markdown-toc-start -->\n"
            "\n"
            "- [Stale](#stale)\n"
            "\n"
            "<!-- vim-markdown-toc-end -->\n"
            "\n"
            "## New\n"
        )
        path = self._tmp(text)
        before = path.read_text()
        changed = regenerate_toc(path, 2, 2, dry_run=True)
        self.assertEqual(changed, 1)
        self.assertEqual(path.read_text(), before)

    def test_missing_fence_markers_raises(self):
        path = self._tmp("## No fence here\n")
        with self.assertRaises(ValueError):
            regenerate_toc(path, 2, 2)

    def test_level_restriction_honored(self):
        text = (
            "<!-- vim-markdown-toc-start -->\n\n- [stale](#stale)\n\n<!-- vim-markdown-toc-end -->\n"
            "## Two\n\n### Three\n\n#### Four\n"
        )
        path = self._tmp(text)
        regenerate_toc(path, 2, 3)
        new_text = path.read_text()
        self.assertIn("- [Two]", new_text)
        self.assertIn("- [Three]", new_text)
        # "#### Four" heading still in source, but no TOC entry for it
        self.assertNotIn("- [Four]", new_text)
        self.assertNotIn("#four", new_text)


class DuplicateHeadingsTest(unittest.TestCase):
    def _tmp(self, text: str) -> Path:
        fd, path = tempfile.mkstemp(suffix=".md")
        os.close(fd)
        Path(path).write_text(text)
        return Path(path)

    def test_finds_duplicates(self):
        text = (
            "### Other Projects\n\n### AI Journal\n\n### Other Projects\n\n### Notes\n"
        )
        path = self._tmp(text)
        self.assertEqual(find_duplicate_headings(path, 3), [("Other Projects", 2)])

    def test_unique_yields_empty(self):
        path = self._tmp("### A\n### B\n### C\n")
        self.assertEqual(find_duplicate_headings(path, 3), [])

    def test_triplicate_counted(self):
        path = self._tmp("### X\n### X\n### X\n### Y\n")
        self.assertEqual(find_duplicate_headings(path, 3), [("X", 3)])

    def test_different_levels_not_conflated(self):
        # "Same Text" at H2 and H3 are different slugs in kramdown? Actually they
        # collide. But this test just ensures we scope to the requested level.
        path = self._tmp("## Same\n### Same\n")
        self.assertEqual(find_duplicate_headings(path, 3), [])
        self.assertEqual(find_duplicate_headings(path, 2), [])


if __name__ == "__main__":
    unittest.main()

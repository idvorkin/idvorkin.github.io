"""Unit tests for pr_checks.py. Stdlib-only, no network. Run with:

cd .claude/skills/pr-checks && python3 -m unittest -v
"""

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest import mock

import jev_judge as jev
import pr_checks as pc


def post(
    body: str, front_matter: str = "title: T\npermalink: /t\ntags:\n  - x\n"
) -> pc.Post:
    """Build a Post without touching disk, with a realistic body offset."""
    text = f"---\n{front_matter}---\n\n{body}"
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "_d" / "sample.md"
        path.parent.mkdir()
        path.write_text(text)
        parsed = pc.split_post(path)
    assert parsed is not None
    return parsed


class SplitPostTest(unittest.TestCase):
    def test_body_offset_points_at_the_first_body_line(self):
        p = post("Opening line.")
        self.assertEqual(p.body, "Opening line.")
        # ---(1) title(2) permalink(3) tags(4) - x(5) ---(6) blank(7) body(8)
        self.assertEqual(p.body_offset, 8)

    def test_no_front_matter_is_none(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "x.md"
            path.write_text("Just prose.\n")
            self.assertIsNone(pc.split_post(path))


class FrontMatterTest(unittest.TestCase):
    def test_complete(self):
        self.assertEqual(pc.check_front_matter(post("Hi.")).status, pc.PASS)

    def test_missing_permalink_fails_in_d(self):
        check = pc.check_front_matter(post("Hi.", "title: T\ntags:\n  - x\n"))
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn("permalink", check.issues[0])

    def test_posts_collection_does_not_need_a_permalink(self):
        p = post("Hi.", "title: T\ntags:\n  - x\n")
        p.path = Path("/repo/_posts/2016-01-01-x.md")
        self.assertEqual(pc.check_front_matter(p).status, pc.PASS)

    def test_td_collection_does_not_need_tags(self):
        p = post("Hi.", "title: T\npermalink: /t\n")
        p.path = Path("/repo/_td/x.md")
        self.assertEqual(pc.check_front_matter(p).status, pc.PASS)

    def test_fm_list_parses_a_block(self):
        self.assertEqual(pc.fm_list("alias:\n  - /a\n  - /b\n", "alias"), ["/a", "/b"])


class OpeningTest(unittest.TestCase):
    def test_plain_paragraph_passes(self):
        self.assertEqual(
            pc.check_opening(post("A plain opening paragraph.")).status, pc.PASS
        )

    def test_leading_include_fails(self):
        check = pc.check_opening(
            post('{% include alert.html content="x" %}\n\nThen prose.')
        )
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn("liquid", check.issues[0])

    def test_leading_heading_fails(self):
        self.assertEqual(pc.check_opening(post("## Section\n\nProse.")).status, pc.FAIL)

    def test_leading_toc_comment_is_skipped(self):
        body = "<!-- prettier-ignore-start -->\n<!-- toc -->\n\nReal opening paragraph."
        self.assertEqual(pc.check_opening(post(body)).status, pc.PASS)

    def test_include_inside_the_opening_paragraph_fails(self):
        body = "Opening line\n{% include blob_image.html src='a.webp' %}\n\nRest."
        self.assertEqual(pc.check_opening(post(body)).status, pc.FAIL)


class AlertAndSlopTest(unittest.TestCase):
    def test_no_alert_is_na(self):
        self.assertEqual(pc.check_alerts(post("Prose.")).status, pc.NA)

    def test_alert_after_opening_passes(self):
        body = 'Opening paragraph.\n\n{% include alert.html content="hi" %}\n\nRest.'
        self.assertEqual(pc.check_alerts(post(body)).status, pc.PASS)

    def test_alert_before_opening_fails(self):
        body = '{% include alert.html content="hi" %}\n\nOpening paragraph.'
        self.assertEqual(pc.check_alerts(post(body)).status, pc.FAIL)

    def test_ai_slop_glued_to_the_opening_paragraph_fails(self):
        body = 'Opening paragraph.\n{% include ai-slop.html percent="70" %}\n\nRest.'
        self.assertEqual(pc.check_ai_slop(post(body)).status, pc.FAIL)

    def test_ai_slop_after_a_blank_line_passes(self):
        body = 'Opening paragraph.\n\n{% include ai-slop.html percent="70" %}\n\nRest.'
        self.assertEqual(pc.check_ai_slop(post(body)).status, pc.PASS)


class ImagesTest(unittest.TestCase):
    def test_no_images_is_na(self):
        self.assertEqual(pc.check_images(post("Prose.")).status, pc.NA)

    def test_include_passes(self):
        body = 'Prose.\n\n{% include blob_image.html src="blog/x.webp" %}'
        self.assertEqual(pc.check_images(post(body)).status, pc.PASS)

    def test_raw_blob_image_fails_with_the_include_spelled_out(self):
        body = (
            "Prose.\n\n![alt](https://github.com/idvorkin/blob/raw/master/blog/x.webp)"
        )
        check = pc.check_images(post(body))
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn('src="blog/x.webp"', check.issues[0])

    def test_raw_image_on_another_host_passes(self):
        body = "Prose.\n\n![alt](https://raw.githubusercontent.com/idvorkin/ipaste/main/x.webp)"
        self.assertEqual(pc.check_images(post(body)).status, pc.PASS)


class BooksTest(unittest.TestCase):
    def test_no_books_is_na(self):
        self.assertEqual(pc.check_books(post("Prose.")).status, pc.NA)

    def test_amazon_include_passes(self):
        self.assertEqual(
            pc.check_books(post('{% include amazon.html asin="X" %}')).status, pc.PASS
        )

    def test_raw_amazon_link_fails_and_recovers_the_asin(self):
        body = "Prose [book](https://www.amazon.com/dp/0071499938) here."
        check = pc.check_books(post(body))
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn('asin="0071499938"', check.issues[0])


class InternalLinksTest(unittest.TestCase):
    PERMALINKS = {"/enemy": "_d/enemy.md", "/joy": "_d/joy.md"}
    REDIRECTS = {"/don-juan": "/enemy"}

    def run_check(self, body: str) -> pc.Check:
        return pc.check_internal_links(post(body), self.PERMALINKS, self.REDIRECTS)

    def test_no_internal_links_is_na(self):
        self.assertEqual(
            self.run_check("Prose [out](https://example.com).").status, pc.NA
        )

    def test_permalink_passes(self):
        self.assertEqual(self.run_check("See [joy](/joy).").status, pc.PASS)

    def test_redirect_names_the_permalink(self):
        check = self.run_check("See [enemy](/don-juan).")
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn("/enemy", check.issues[0])

    def test_hostname_form_fails(self):
        check = self.run_check("See [joy](https://idvork.in/joy).")
        self.assertEqual(check.status, pc.FAIL)
        self.assertIn("hostname", check.issues[0])

    def test_anchor_and_trailing_slash_normalize(self):
        self.assertEqual(self.run_check("See [j](/joy/#section).").status, pc.PASS)

    def test_summarize_page_include_is_checked(self):
        check = self.run_check('{% include summarize-page.html src="/don-juan" %}')
        self.assertEqual(check.status, pc.FAIL)

    def test_image_targets_are_not_link_targets(self):
        self.assertEqual(self.run_check("![a](/don-juan.png)").status, pc.NA)

    def test_assets_are_skipped(self):
        self.assertEqual(self.run_check("[f](/assets/x.pdf)").status, pc.NA)

    def test_unknown_target_is_not_flagged(self):
        # Link resolution is the lychee pre-commit hook's job, not this check's.
        self.assertEqual(self.run_check("See [chow](/chow).").status, pc.PASS)

    def test_duplicate_link_on_one_line_reports_once(self):
        check = self.run_check("[a](/don-juan) and [b](/don-juan)")
        self.assertEqual(len(check.issues), 1)


class SiteUrlMapsTest(unittest.TestCase):
    def build(self, files: dict[str, str]) -> tuple[dict, dict]:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for directory in pc.POST_DIRS:
                (root / directory).mkdir()
            for name, text in files.items():
                (root / name).write_text(text)
            return pc.site_url_maps(root)

    def test_redirect_maps_to_its_canonical_permalink(self):
        permalinks, redirects = self.build(
            {
                "_d/enemy.md": "---\npermalink: /enemy\nredirect_from:\n  - /don-juan\n---\n\nHi.\n"
            }
        )
        self.assertEqual(permalinks, {"/enemy": "_d/enemy.md"})
        self.assertEqual(redirects, {"/don-juan": "/enemy"})

    def test_redirect_from_a_page_with_no_permalink_is_dropped(self):
        # `_posts/` builds its URL from the filename, so there is nothing to
        # point the author at — flagging the link would be unactionable.
        _, redirects = self.build(
            {
                "_posts/2017-04-12-happy.md": "---\ntitle: Happy\nalias:\n  - /poh\n---\n\nHi.\n"
            }
        )
        self.assertEqual(redirects, {})


def fake_jev(headers=0.1, voice=0.1, ai=0.1, families=None) -> dict:
    answers = {
        "headers": {"score": headers},
        "voice": {"score": voice},
        "ai-patterns": {"score": ai},
    }
    for name in jev.FAMILIES:
        answers[f"family_{name}"] = {"noul": (families or {}).get(name, 0.05)}
    return {"answers": answers, "usage": {"cost": 0.0003}}


class JevVerdictTest(unittest.TestCase):
    """Judgement -> Check mapping, with the network mocked out."""

    def test_no_key_marks_all_three_na_and_never_fails(self):
        checks, meta = pc.jev_checks(post("Prose."), None, blocking=True)
        self.assertTrue(all(c.status == pc.NA for c in checks.values()))
        self.assertFalse(
            any(c.blocking and c.status == pc.FAIL for c in checks.values())
        )
        self.assertIn("no OPENROUTER_API_KEY", meta["skipped"])

    def test_clean_scores_pass(self):
        with mock.patch.object(jev, "ask", return_value=fake_jev(voice=1.9, ai=0.8)):
            checks, meta = pc.jev_checks(post("Prose."), "sk", blocking=False)
        self.assertEqual([c.status for c in checks.values()], [pc.PASS] * 3)
        self.assertEqual(meta["scores"]["ai-patterns"], 0.8)

    def test_scores_at_the_threshold_fail(self):
        with mock.patch.object(jev, "ask", return_value=fake_jev(3.0, 3.5, 3.0)):
            checks, _ = pc.jev_checks(post("Prose."), "sk", blocking=False)
        self.assertEqual([c.status for c in checks.values()], [pc.FAIL] * 3)

    def test_only_ai_patterns_can_block(self):
        with mock.patch.object(jev, "ask", return_value=fake_jev(4.0, 4.0, 4.0)):
            checks, _ = pc.jev_checks(post("Prose."), "sk", blocking=True)
        self.assertTrue(checks["ai-patterns"].blocking)
        self.assertFalse(checks["headers"].blocking)
        self.assertFalse(checks["voice"].blocking)

    def test_nothing_blocks_under_advisory_jev(self):
        with mock.patch.object(jev, "ask", return_value=fake_jev(4.0, 4.0, 4.0)):
            checks, _ = pc.jev_checks(post("Prose."), "sk", blocking=False)
        self.assertFalse(any(c.blocking for c in checks.values()))

    def test_ai_patterns_failure_names_the_pattern_family(self):
        response = fake_jev(ai=3.8, families={"editorializing": 0.92})
        with mock.patch.object(jev, "ask", return_value=response):
            checks, _ = pc.jev_checks(
                post("It's important to note that x."), "sk", False
            )
        issue = checks["ai-patterns"].issues[0]
        self.assertIn("editorializing (0.92)", issue)
        self.assertIn("literal hits", issue)

    def test_a_failed_call_degrades_to_na(self):
        import urllib.error

        with mock.patch.object(jev, "ask", side_effect=urllib.error.URLError("down")):
            checks, meta = pc.jev_checks(post("Prose."), "sk", blocking=True)
        self.assertTrue(all(c.status == pc.NA for c in checks.values()))
        self.assertIn("error", meta)


class RenderTest(unittest.TestCase):
    def test_grid_matches_the_guideline_format(self):
        checks = {
            "headers": pc.Check("headers"),
            "front-matter": pc.Check("front-matter"),
            "internal-links": pc.Check("internal-links"),
            "opening": pc.Check("opening"),
            "voice": pc.Check("voice"),
            "ai-patterns": pc.Check(
                "ai-patterns", status=pc.FAIL, issues=["ai-patterns — x"]
            ),
            "alerts": pc.Check("alerts"),
            "images": pc.Check("images"),
            "books": pc.Check("books", status=pc.NA),
            "ai-slop": pc.Check("ai-slop", status=pc.NA),
            "rebased": pc.Check("rebased"),
        }
        out = pc.render(Path("_d/x.md"), checks, {}).split("\n")
        self.assertEqual(
            out[1], "Architect: 🟢 headers 🟢 front-matter 🟢 internal-links"
        )
        self.assertEqual(out[2], "Carpenter: 🟢 opening 🟢 voice 🔴 ai-patterns")
        self.assertEqual(out[3], "Judge: 🟢 alerts 🟢 images ⚪ books ⚪ ai-slop")
        self.assertEqual(out[4], "Workflow: 🟢 rebased")
        self.assertIn("Issues:", out)
        self.assertIn("- ai-patterns — x", out)


if __name__ == "__main__":
    unittest.main()

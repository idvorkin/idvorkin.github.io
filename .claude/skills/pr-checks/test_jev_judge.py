"""Unit tests for jev_judge.py. Stdlib-only, no network. Run with:

cd .claude/skills/pr-checks && python3 -m unittest -v
"""

from __future__ import annotations

import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest import mock

import jev_judge as jev


def fake_response(headers=0.1, voice=0.1, ai=0.1, families=None, cost=0.0003) -> dict:
    answers = {
        "headers": {"score": headers},
        "voice": {"score": voice},
        "ai-patterns": {"score": ai},
    }
    for name in jev.FAMILIES:
        answers[f"family_{name}"] = {"noul": (families or {}).get(name, 0.05)}
    return {"answers": answers, "usage": {"cost": cost}}


class ChunkTest(unittest.TestCase):
    def test_short_text_is_one_chunk(self):
        self.assertEqual(jev.chunk("short", limit=100), ["short"])

    def test_splits_on_section_headings(self):
        text = "## a\n" + "x" * 80 + "\n## b\n" + "y" * 80 + "\n"
        chunks = jev.chunk(text, limit=100)
        self.assertEqual(len(chunks), 2)
        self.assertTrue(chunks[1].startswith("## b"))

    def test_an_oversized_section_is_hard_split(self):
        chunks = jev.chunk("## a\n" + "x" * 250, limit=100)
        self.assertTrue(all(len(c) <= 100 for c in chunks))
        self.assertEqual("".join(chunks), "## a\n" + "x" * 250)

    def test_worst_takes_the_highest_value_across_chunks(self):
        answers = [{"k": {"score": 1.0}}, {"k": {"score": 3.2}}]
        self.assertEqual(jev.worst(answers, "k", "score"), 3.2)


class ApiKeyTest(unittest.TestCase):
    def test_env_key_wins(self):
        with mock.patch.dict(
            "os.environ", {"OPENROUTER_API_KEY": "sk-env"}, clear=True
        ):
            self.assertEqual(jev.api_key(), "sk-env")

    def test_secret_box_fallback(self):
        with tempfile.TemporaryDirectory() as tmp:
            box = Path(tmp) / "box.json"
            box.write_text('{"OPEN_ROUTER_KEY": "sk-box"}')
            with mock.patch.dict("os.environ", {"SECRET_BOX": str(box)}, clear=True):
                self.assertEqual(jev.api_key(), "sk-box")

    def test_missing_everything_is_none(self):
        with mock.patch.dict("os.environ", {}, clear=True):
            self.assertIsNone(jev.api_key())

    def test_unreadable_secret_box_is_none_not_an_exception(self):
        with mock.patch.dict(
            "os.environ", {"SECRET_BOX": "/nope/missing.json"}, clear=True
        ):
            self.assertIsNone(jev.api_key())


class JudgeTest(unittest.TestCase):
    def test_scores_and_families_come_back(self):
        with mock.patch.object(jev, "ask", return_value=fake_response(ai=2.5)) as ask:
            result = jev.judge("Prose.", "sk")
        ask.assert_called_once()
        self.assertEqual(result.scores["ai-patterns"], 2.5)
        self.assertEqual(result.calls, 1)
        self.assertEqual(result.cost_usd, 0.0003)
        self.assertIn("family_editorializing", result.nouls)

    def test_worst_chunk_wins(self):
        responses = [fake_response(ai=0.2), fake_response(ai=3.9)]
        body = "## a\n" + "x " * 20_000 + "\n## b\n" + "y " * 20_000
        with mock.patch.object(jev, "ask", side_effect=responses):
            result = jev.judge(body, "sk")
        self.assertEqual(result.chunks, 2)
        self.assertEqual(result.scores["ai-patterns"], 3.9)

    def test_a_failed_call_sets_error_and_no_scores(self):
        with mock.patch.object(jev, "ask", side_effect=urllib.error.URLError("down")):
            result = jev.judge("Prose.", "sk")
        self.assertIsNotNone(result.error)
        self.assertEqual(result.scores, {})

    def test_fails_at_and_above_the_threshold(self):
        result = jev.Judgement(scores={"ai-patterns": 3.0, "voice": 3.49})
        self.assertTrue(result.fails("ai-patterns"))
        self.assertFalse(result.fails("voice"))

    def test_fails_is_false_for_a_key_never_asked(self):
        self.assertFalse(jev.Judgement().fails("ai-patterns"))


class LiteralHitsTest(unittest.TestCase):
    def test_reports_line_and_phrase(self):
        hits = jev.literal_hits(
            "Fine.\n\nIt's important to note that this is filler.", 8
        )
        self.assertEqual(len(hits), 1)
        self.assertIn("important to note", hits[0])
        self.assertIn("line 10", hits[0])

    def test_clean_prose_has_none(self):
        self.assertEqual(jev.literal_hits("I biked to the gym and did get-ups."), [])


if __name__ == "__main__":
    unittest.main()

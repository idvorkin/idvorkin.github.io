"""Unit tests for scan_repos.py. Stdlib-only. Run with `python3 -m unittest`."""

from __future__ import annotations

import datetime as dt
import unittest

from scan_repos import RepoActivity, filter_active, scan


class FilterActiveTest(unittest.TestCase):
    def test_keeps_repos_pushed_after_cutoff(self):
        repos = [
            {"name": "a", "pushedAt": "2026-04-13T10:00:00Z"},
            {"name": "b", "pushedAt": "2026-04-10T10:00:00Z"},
            {"name": "c", "pushedAt": "2026-04-20T10:00:00Z"},
        ]
        result = filter_active(repos, dt.date(2026, 4, 13))
        names = [r["name"] for r in result]
        self.assertEqual(names, ["a", "c"])

    def test_empty_list_yields_empty(self):
        self.assertEqual(filter_active([], dt.date(2026, 4, 13)), [])

    def test_missing_pushedAt_excluded(self):
        repos = [{"name": "a"}]
        self.assertEqual(filter_active(repos, dt.date(2026, 4, 13)), [])

    def test_same_day_included(self):
        repos = [{"name": "a", "pushedAt": "2026-04-13T00:00:00Z"}]
        self.assertEqual(filter_active(repos, dt.date(2026, 4, 13)), repos)


class ScanTest(unittest.TestCase):
    """Test the full scan pipeline with injected stubs — no real gh calls."""

    def test_end_to_end_with_stubs(self):
        def fake_list_repos(org: str, _limit: int) -> list[dict]:
            return {
                "idvorkin": [
                    {"name": "active", "pushedAt": "2026-04-15T00:00:00Z"},
                    {"name": "stale", "pushedAt": "2026-01-01T00:00:00Z"},
                ],
                "idvorkin-ai-tools": [
                    {"name": "tools", "pushedAt": "2026-04-14T00:00:00Z"},
                ],
            }[org]

        calls: list[tuple[str, str]] = []

        def fake_fetch(org: str, name: str, _since: dt.date, _limit: int) -> list[dict]:
            calls.append((org, name))
            return [
                {
                    "sha": f"{name[:3]}1234567",
                    "message": f"commit in {name}",
                    "date": "2026-04-15T10:00:00Z",
                }
            ]

        result = scan(
            orgs=["idvorkin", "idvorkin-ai-tools"],
            since=dt.date(2026, 4, 13),
            _list_org_repos=fake_list_repos,
            _fetch_repo_commits=fake_fetch,
        )

        self.assertEqual(len(result), 2)  # stale excluded
        self.assertEqual(
            [(r.org, r.name) for r in result],
            [("idvorkin", "active"), ("idvorkin-ai-tools", "tools")],
        )
        self.assertCountEqual(
            calls, [("idvorkin", "active"), ("idvorkin-ai-tools", "tools")]
        )
        self.assertEqual(result[0].commits[0]["message"], "commit in active")

    def test_no_active_repos_returns_empty(self):
        def fake_list(_org: str, _limit: int) -> list[dict]:
            return [{"name": "stale", "pushedAt": "2026-01-01T00:00:00Z"}]

        def fake_fetch(*args, **kwargs):
            raise AssertionError("fetch should not be called when nothing is active")

        result = scan(
            orgs=["idvorkin"],
            since=dt.date(2026, 4, 13),
            _list_org_repos=fake_list,
            _fetch_repo_commits=fake_fetch,
        )
        self.assertEqual(result, [])

    def test_sorted_deterministically(self):
        def fake_list(org: str, _limit: int) -> list[dict]:
            if org == "alpha":
                return [{"name": "zeta", "pushedAt": "2026-04-15T00:00:00Z"}]
            return [{"name": "apple", "pushedAt": "2026-04-15T00:00:00Z"}]

        def fake_fetch(*_args, **_kwargs) -> list[dict]:
            return []

        result = scan(
            orgs=["beta", "alpha"],
            since=dt.date(2026, 4, 13),
            _list_org_repos=fake_list,
            _fetch_repo_commits=fake_fetch,
        )
        self.assertEqual(
            [(r.org, r.name) for r in result], [("alpha", "zeta"), ("beta", "apple")]
        )


class RepoActivityTest(unittest.TestCase):
    def test_default_commits_is_empty_list(self):
        r = RepoActivity(org="foo", name="bar", pushed_at="2026-04-15T00:00:00Z")
        self.assertEqual(r.commits, [])


if __name__ == "__main__":
    unittest.main()

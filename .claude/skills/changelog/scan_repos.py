#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "typer",
#   "rich",
# ]
# ///
"""Scan GitHub orgs for active repos + recent commits, in parallel.

Replaces the serial nested bash loop:

    for org in idvorkin idvorkin-ai-tools; do
      gh repo list $org --limit 100 --visibility public ...
      while read repo; do
        gh api repos/$org/$repo/commits ...
      done
    done

with a parallel implementation that (a) fans `gh api commits` calls out
across a thread pool, and (b) keeps the classification logic (active-repo
detection by `pushedAt`) as a pure function that unit tests can exercise
without mocking subprocess.

Usage:

  scan_repos.py --since 2026-04-13
  scan_repos.py --since 2026-04-13 --orgs idvorkin,idvorkin-ai-tools
  scan_repos.py --since 2026-04-13 --max-workers 16 --commit-limit 20

Output: JSON array of {org, name, pushed_at, commits: [{sha, message, date}]}
sorted by (org, name) for deterministic diffing. Failed commit fetches
return an empty `commits` list rather than aborting the whole scan.

Stdlib-only. Cross-platform. Requires `gh` on PATH.
"""

from __future__ import annotations

import concurrent.futures as cf
import datetime as dt
import json
import subprocess
from dataclasses import asdict, dataclass, field
from typing import Annotated, Callable

import typer
from rich.console import Console

stderr = Console(stderr=True)

DEFAULT_ORGS = "idvorkin,idvorkin-ai-tools"
DEFAULT_REPO_LIMIT = 100
DEFAULT_COMMIT_LIMIT = 30
DEFAULT_MAX_WORKERS = 8


@dataclass
class RepoActivity:
    org: str
    name: str
    pushed_at: str
    commits: list[dict] = field(default_factory=list)


def run_gh(args: list[str]) -> str:
    """Run `gh <args>`, return stdout. Raises CalledProcessError on failure."""
    result = subprocess.run(["gh", *args], check=True, capture_output=True, text=True)
    return result.stdout


def list_org_repos(org: str, limit: int = DEFAULT_REPO_LIMIT) -> list[dict]:
    """Return [{name, pushedAt}, ...] for public repos in the org."""
    raw = run_gh(
        [
            "repo",
            "list",
            org,
            "--limit",
            str(limit),
            "--visibility",
            "public",
            "--json",
            "name,pushedAt",
        ]
    )
    return json.loads(raw)


def filter_active(repos: list[dict], since: dt.date) -> list[dict]:
    """Keep repos whose `pushedAt` is on or after `since` (pure function)."""
    cutoff = f"{since.isoformat()}T00:00:00Z"
    return [r for r in repos if r.get("pushedAt", "") >= cutoff]


def fetch_repo_commits(
    org: str, name: str, since: dt.date, limit: int = DEFAULT_COMMIT_LIMIT
) -> list[dict]:
    """Fetch up to `limit` commits since `since` for one repo.

    Best-effort: returns `[]` on error rather than propagating, so one broken
    repo can't abort the whole cross-repo scan. Errors are logged to stderr so
    the caller can see *which* repos were skipped and *why* — this is the
    difference between "silent failure" (the old behavior) and "degraded
    success with receipts" (now). Auth failures, rate-limit 403s, 404s, and
    malformed jq output all become visible on stderr.
    """
    jq = (
        '[.[] | select((.commit.committer.date // "") >= "' + since.isoformat() + '") '
        "| {sha: .sha[0:9], "
        'message: (.commit.message | split("\\n")[0]), '
        'date: (.commit.committer.date // "")}] '
        f"| .[0:{limit}]"
    )
    try:
        raw = run_gh(["api", f"repos/{org}/{name}/commits", "-q", jq])
        return json.loads(raw) if raw.strip() else []
    except subprocess.CalledProcessError as exc:
        stderr_tail = (exc.stderr or "").strip()[:200].replace("\n", " ")
        stderr.print(
            f"[yellow]WARN[/] scan_repos: fetch_repo_commits({org}/{name}) failed "
            f"rc={exc.returncode}: {stderr_tail}"
        )
        return []
    except json.JSONDecodeError as exc:
        stderr.print(
            f"[yellow]WARN[/] scan_repos: fetch_repo_commits({org}/{name}) got "
            f"malformed JSON from gh: {exc}"
        )
        return []


def scan(
    orgs: list[str],
    since: dt.date,
    max_workers: int = DEFAULT_MAX_WORKERS,
    commit_limit: int = DEFAULT_COMMIT_LIMIT,
    repo_limit: int = DEFAULT_REPO_LIMIT,
    _list_org_repos: Callable[[str, int], list[dict]] = list_org_repos,
    _fetch_repo_commits: Callable[
        [str, str, dt.date, int], list[dict]
    ] = fetch_repo_commits,
) -> list[RepoActivity]:
    """Run the full scan. The two `_*` injected callables let tests stub gh."""
    active: list[tuple[str, dict]] = []
    for org in orgs:
        for repo in filter_active(_list_org_repos(org, repo_limit), since):
            active.append((org, repo))

    results: list[RepoActivity] = []
    if not active:
        return results

    with cf.ThreadPoolExecutor(max_workers=max_workers) as pool:
        future_map = {
            pool.submit(_fetch_repo_commits, org, repo["name"], since, commit_limit): (
                org,
                repo,
            )
            for org, repo in active
        }
        for fut in cf.as_completed(future_map):
            org, repo = future_map[fut]
            results.append(
                RepoActivity(
                    org=org,
                    name=repo["name"],
                    pushed_at=repo["pushedAt"],
                    commits=fut.result(),
                )
            )

    results.sort(key=lambda r: (r.org, r.name))
    return results


app = typer.Typer(
    help="Parallel cross-repo scanner for the blog changelog.",
    add_completion=False,
    invoke_without_command=True,
)


@app.callback(invoke_without_command=True)
def main(
    since: Annotated[
        dt.datetime, typer.Option(help="Start date (YYYY-MM-DD) for the scan window")
    ],
    orgs: Annotated[
        str, typer.Option(help="Comma-separated GitHub orgs")
    ] = DEFAULT_ORGS,
    max_workers: Annotated[
        int, typer.Option(help="ThreadPool size for parallel gh fetches")
    ] = DEFAULT_MAX_WORKERS,
    commit_limit: Annotated[
        int, typer.Option(help="Max commits returned per repo")
    ] = DEFAULT_COMMIT_LIMIT,
    repo_limit: Annotated[
        int, typer.Option(help="Max repos listed per org")
    ] = DEFAULT_REPO_LIMIT,
) -> None:
    """JSON output to stdout, sorted by (org, name). Errors log to stderr."""
    org_list = [o.strip() for o in orgs.split(",") if o.strip()]
    results = scan(
        orgs=org_list,
        since=since.date(),
        max_workers=max_workers,
        commit_limit=commit_limit,
        repo_limit=repo_limit,
    )
    print(json.dumps([asdict(r) for r in results], indent=2))


if __name__ == "__main__":
    app()

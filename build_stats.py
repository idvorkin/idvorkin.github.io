#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Build build-stats.json: month-over-month GitHub output for idvorkin + idvorkin-ai-tools.

Walks every PUBLIC, non-fork repo owned by the two accounts via `gh api graphql`:

- merged PRs into each repo's default branch (the "diffs"): count, additions,
  deletions, changed files — with lockfile/generated churn subtracted;
- commits on each default branch (deduped by oid across repos).

Bots (dependabot, renovate, any GraphQL Bot actor) are excluded. Fork repos are
skipped entirely, so a PR from the idvorkin-ai-tools fork into an idvorkin
canonical is counted once — in the canonical, attributed to its author.

Incremental: raw per-repo data is cached in .build_stats_cache/ (gitignored); a
repo whose pushedAt hasn't moved is not re-fetched, and a moved one only pulls
PRs updated / commits made since the last run.

    ./build_stats.py              # incremental refresh -> build-stats.json
    ./build_stats.py --full       # ignore the cache and refetch everything
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CACHE_DIR = ROOT / ".build_stats_cache"
OUT = ROOT / "build-stats.json"
OWNERS = ["idvorkin", "idvorkin-ai-tools"]
BOT_RE = re.compile(r"(\[bot\]$|^dependabot|^renovate|^github-actions)", re.IGNORECASE)
# Churn that isn't authored code. Subtracted per file (first 100 files of a PR).
GENERATED_RE = re.compile(
    r"(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?|uv\.lock|"
    r"poetry\.lock|Pipfile\.lock|Cargo\.lock|Gemfile\.lock|go\.sum|composer\.lock|"
    r"back-links\.json|search\.json|search-titles\.json|build-stats\.json)$"
    r"|\.min\.(js|css)$|\.map$",
)
# A single file changing more than this many lines in one PR is a data dump (pose
# captures, fixtures, exports), not authored code; it's subtracted like a lockfile.
BIG_FILE_LINES = 5000
# Agent commits that aren't linked to a GitHub login (e.g. author "AI+idvorkin").
AGENT_LOGIN_RE = re.compile(r"^(claude|copilot|codex|google-labs-jules)", re.IGNORECASE)
AGENT_NAME_RE = re.compile(r"(^AI\b|\bAI\+|claude|codex|\bagent\b)", re.IGNORECASE)
SCHEMA_VERSION = 2


def gql(query: str, **vars) -> dict:
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for k, v in vars.items():
        if v is None:
            continue
        args += ["-F" if isinstance(v, int) else "-f", f"{k}={v}"]
    for attempt in range(4):
        r = subprocess.run(args, check=False, capture_output=True, text=True)
        if r.returncode == 0:
            data = json.loads(r.stdout)
            if "errors" not in data:
                return data["data"]
            err = data["errors"]
        else:
            err = r.stderr.strip()
        print(f"  graphql retry {attempt + 1}: {str(err)[:200]}", file=sys.stderr)
    raise SystemExit(f"GraphQL failed: {err}")


REPOS_Q = """
query($owner:String!, $after:String) {
  repositoryOwner(login:$owner) {
    repositories(first:100, after:$after, privacy:PUBLIC, isFork:false,
                 ownerAffiliations:OWNER) {
      pageInfo { hasNextPage endCursor }
      nodes { name isPrivate isFork isArchived pushedAt stargazerCount
              primaryLanguage { name } defaultBranchRef { name } }
    }
  }
}"""

PRS_Q = """
query($owner:String!, $name:String!, $after:String) {
  repository(owner:$owner, name:$name) {
    pullRequests(states:MERGED, first:40, after:$after,
                 orderBy:{field:UPDATED_AT, direction:DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title mergedAt updatedAt additions deletions changedFiles baseRefName
        author { __typename login }
        files(first:100) { nodes { path additions deletions } }
      }
    }
  }
}"""

COMMITS_Q = """
query($owner:String!, $name:String!, $after:String, $since:GitTimestamp) {
  repository(owner:$owner, name:$name) {
    defaultBranchRef { target { ... on Commit {
      history(first:100, after:$after, since:$since) {
        pageInfo { hasNextPage endCursor }
        nodes { oid committedDate author { name user { login } } }
      }
    } } }
  }
}"""


def list_repos(owner: str) -> list[dict]:
    repos, after = [], None
    while True:
        conn = gql(REPOS_Q, owner=owner, after=after)["repositoryOwner"]["repositories"]
        # Belt and braces: the query already filters, but never let a private repo through.
        repos += [r for r in conn["nodes"] if not r["isPrivate"] and not r["isFork"]]
        if not conn["pageInfo"]["hasNextPage"]:
            return repos
        after = conn["pageInfo"]["endCursor"]


def fetch_prs(owner: str, name: str, since_updated: str | None) -> list[dict]:
    out, after = [], None
    while True:
        conn = gql(PRS_Q, owner=owner, name=name, after=after)["repository"][
            "pullRequests"
        ]
        for pr in conn["nodes"]:
            if since_updated and pr["updatedAt"] < since_updated:
                return out
            files = pr.pop("files")["nodes"] or []
            gen = [f for f in files if is_generated(f)]
            gen_add = sum(f["additions"] for f in gen)
            gen_del = sum(f["deletions"] for f in gen)
            author = pr.pop("author") or {}
            pr["author"] = author.get("login") or "ghost"
            pr["is_bot"] = author.get("__typename") == "Bot" or bool(
                BOT_RE.search(pr["author"])
            )
            pr["gen_additions"], pr["gen_deletions"] = gen_add, gen_del
            out.append(pr)
        if not conn["pageInfo"]["hasNextPage"]:
            return out
        after = conn["pageInfo"]["endCursor"]


def fetch_commits(owner: str, name: str, since: str | None) -> list[dict]:
    out, after = [], None
    while True:
        ref = gql(COMMITS_Q, owner=owner, name=name, after=after, since=since)[
            "repository"
        ]["defaultBranchRef"]
        if not ref or not ref.get("target"):
            return out
        hist = ref["target"]["history"]
        for c in hist["nodes"]:
            author = c.get("author") or {}
            login = (author.get("user") or {}).get("login")
            # Keep the display name only for unlinked commits (to spot agents); never the email.
            out.append(
                {
                    "oid": c["oid"],
                    "date": c["committedDate"],
                    "login": login,
                    "name": None if login else author.get("name"),
                }
            )
        if not hist["pageInfo"]["hasNextPage"]:
            return out
        after = hist["pageInfo"]["endCursor"]


def refresh_repo(owner: str, repo: dict, full: bool) -> dict:
    path = CACHE_DIR / owner / f"{repo['name']}.json"
    cached = None if full or not path.exists() else json.loads(path.read_text())
    if (
        cached
        and cached.get("schema") == SCHEMA_VERSION
        and cached["pushedAt"] == repo["pushedAt"]
    ):
        cached["meta"] = repo
        return cached
    if cached and cached.get("schema") != SCHEMA_VERSION:
        cached = None
    prs = {str(p["number"]): p for p in (cached or {}).get("prs", [])}
    commits = {c["oid"]: c for c in (cached or {}).get("commits", [])}
    since_updated = cached["max_pr_updated"] if cached else None
    since_commit = cached["max_commit_date"] if cached else None
    print(
        f"  fetching {owner}/{repo['name']}{' (incremental)' if cached else ''}",
        file=sys.stderr,
    )
    for pr in fetch_prs(owner, repo["name"], since_updated):
        prs[str(pr["number"])] = pr
    for c in fetch_commits(owner, repo["name"], since_commit):
        commits[c["oid"]] = c
    data = {
        "schema": SCHEMA_VERSION,
        "pushedAt": repo["pushedAt"],
        "max_pr_updated": max((p["updatedAt"] for p in prs.values()), default=None),
        "max_commit_date": max((c["date"] for c in commits.values()), default=None),
        "prs": sorted(prs.values(), key=lambda p: p["number"]),
        "commits": sorted(commits.values(), key=lambda c: c["date"]),
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))
    data["meta"] = repo
    return data


def is_generated(f: dict) -> bool:
    return (
        bool(GENERATED_RE.search(f["path"]))
        or f["additions"] + f["deletions"] > BIG_FILE_LINES
    )


def bucket(login: str | None) -> str:
    return login if login in OWNERS else "others"


def commit_bucket(c: dict) -> str:
    if c["login"] in OWNERS:
        return c["login"]
    if (c["login"] and AGENT_LOGIN_RE.search(c["login"])) or (
        not c["login"] and AGENT_NAME_RE.search(c.get("name") or "")
    ):
        return "idvorkin-ai-tools"
    return "others"


def zero() -> dict:
    return {"prs": 0, "additions": 0, "deletions": 0, "files": 0, "commits": 0}


def aggregate(repos: list[tuple[str, dict]]) -> dict:
    months: dict[str, dict[str, dict]] = defaultdict(lambda: defaultdict(zero))
    days: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    repo_rows, seen_oids = [], set()
    excluded = {
        "bot_prs": 0,
        "non_default_base_prs": 0,
        "generated_lines": 0,
        "dup_commits": 0,
    }
    cutoff_30 = (datetime.now(UTC) - timedelta(days=30)).isoformat()
    for owner, data in repos:
        meta = data["meta"]
        default = (meta.get("defaultBranchRef") or {}).get("name")
        row = {
            "repo": f"{owner}/{meta['name']}",
            "language": (meta.get("primaryLanguage") or {}).get("name"),
            "stars": meta["stargazerCount"],
            "prs": 0,
            "lines": 0,
            "commits": 0,
            "prs_30d": 0,
            "lines_30d": 0,
        }
        for pr in data["prs"]:
            if pr["is_bot"]:
                excluded["bot_prs"] += 1
                continue
            if default and pr["baseRefName"] != default:
                excluded["non_default_base_prs"] += 1
                continue
            add = max(0, pr["additions"] - pr["gen_additions"])
            dele = max(0, pr["deletions"] - pr["gen_deletions"])
            excluded["generated_lines"] += pr["gen_additions"] + pr["gen_deletions"]
            m = months[pr["mergedAt"][:7]][bucket(pr["author"])]
            m["prs"] += 1
            m["additions"] += add
            m["deletions"] += dele
            m["files"] += pr["changedFiles"]
            days[pr["mergedAt"][:10]][bucket(pr["author"])] += 1
            row["prs"] += 1
            row["lines"] += add + dele
            if pr["mergedAt"] >= cutoff_30:
                row["prs_30d"] += 1
                row["lines_30d"] += add + dele
        for c in data["commits"]:
            if c["oid"] in seen_oids:
                excluded["dup_commits"] += 1
                continue
            seen_oids.add(c["oid"])
            if c["login"] and BOT_RE.search(c["login"]):
                continue
            months[c["date"][:7]][commit_bucket(c)]["commits"] += 1
            days[c["date"][:10]][commit_bucket(c)] += 1
            row["commits"] += 1
        if row["prs"] or row["commits"]:
            repo_rows.append(row)

    month_list = []
    if months:
        first = min(months)
        y, mo = map(int, first.split("-"))
        now = datetime.now(UTC)
        while (y, mo) <= (now.year, now.month):
            key = f"{y:04d}-{mo:02d}"
            month_list.append(
                {"month": key, **{b: months[key][b] for b in [*OWNERS, "others"]}}
            )
            y, mo = (y + 1, 1) if mo == 12 else (y, mo + 1)
    return {
        "generated_at": datetime.now(UTC).isoformat(timespec="seconds"),
        "owners": OWNERS,
        "repo_count": len(repo_rows),
        "months": month_list,
        # contributions (merged PRs + commits) per day per account, for the heatmap
        "days": {d: dict(v) for d, v in sorted(days.items())},
        "repos": sorted(repo_rows, key=lambda r: -r["lines"]),
        "excluded": excluded,
        "notes": [
            "Public, non-fork repos owned by idvorkin and idvorkin-ai-tools only.",
            "PRs = merged into the repo's default branch; bots (dependabot, renovate, Bot actors) excluded.",
            f"Lines exclude lockfiles, generated indexes and any single file changing over {BIG_FILE_LINES:,} lines in one PR (data dumps); checked on the first 100 files of each PR.",
            "Agent commits not linked to a GitHub login (e.g. authored as AI+idvorkin, claude, Copilot) count under idvorkin-ai-tools.",
            "Fork repos are skipped, so a fork-to-canonical PR counts once, in the canonical.",
            "Commits are default-branch commits, deduped by sha across repos; squash merges mean commits undercount work.",
        ],
    }


def main() -> None:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument(
        "--full", action="store_true", help="ignore the cache and refetch everything"
    )
    ap.add_argument("--out", type=Path, default=OUT)
    args = ap.parse_args()
    repos = []
    for owner in OWNERS:
        listed = list_repos(owner)
        print(f"{owner}: {len(listed)} public non-fork repos", file=sys.stderr)
        repos += [(owner, refresh_repo(owner, r, args.full)) for r in listed]
    stats = aggregate(repos)
    args.out.write_text(json.dumps(stats, separators=(",", ":")) + "\n")
    total = {
        k: sum(m[b][k] for m in stats["months"] for b in [*OWNERS, "others"])
        for k in ["prs", "additions", "deletions", "commits"]
    }
    print(
        f"wrote {args.out.name}: {stats['repo_count']} repos, {total}", file=sys.stderr
    )


if __name__ == "__main__":
    main()

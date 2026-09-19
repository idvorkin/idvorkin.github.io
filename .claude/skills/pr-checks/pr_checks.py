#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "typer",
# ]
# ///
"""Produce the PR Review Checklist grid from `content_guidelines.md`.

Structural checks are code; the three prose checks are judged by the Jev
decision model (`typesafe/jev-1.13`) over OpenRouter's alpha decisions
endpoint. Jev checks are ADVISORY by default — see SKILL.md for why.

Only ever point this at content destined for the public blog: the Jev calls
send the post body to a third party.

Exit codes:
  0   no blocking failure (or --advisory)
  1   at least one blocking check failed
  2   usage error
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

import jev_judge as jev

PASS, FAIL, NA = "pass", "fail", "na"
MARK = {PASS: "🟢", FAIL: "🔴", NA: "⚪"}

POST_DIRS = ("_d", "_posts", "_td")

# Grid layout — phase -> ordered check keys. Matches content_guidelines.md.
GRID = (
    ("Architect", ("headers", "front-matter", "internal-links")),
    ("Carpenter", ("opening", "voice", "ai-patterns")),
    ("Judge", ("alerts", "images", "books", "ai-slop")),
    ("Workflow", ("rebased",)),
)
JEV_KEYS = jev.JUDGMENT_KEYS

# --- post parsing ------------------------------------------------------------


@dataclass
class Post:
    path: Path
    front_matter: str
    body: str
    body_offset: int  # 1-based line number in the file of body line 0


def split_post(path: Path) -> Post | None:
    """Split a markdown post into front matter and body. None if no front matter."""
    text = path.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        return None
    match = re.search(r"(?m)^---\s*$", text[3:])
    if not match:
        return None
    fm = text[3 : 3 + match.start()]
    body = text[3 + match.end() :].lstrip("\n")
    offset = text[: len(text) - len(body)].count("\n") + 1
    return Post(path=path, front_matter=fm, body=body, body_offset=offset)


def fm_has(fm: str, key: str) -> bool:
    return bool(re.search(rf"(?m)^{re.escape(key)}\s*:", fm))


def fm_scalar(fm: str, key: str) -> str | None:
    m = re.search(rf"(?m)^{re.escape(key)}\s*:\s*(\S.*?)\s*$", fm)
    return m.group(1).strip("\"'") if m else None


def fm_list(fm: str, key: str) -> list[str]:
    m = re.search(rf"(?m)^{re.escape(key)}\s*:\s*$\n((?:\s+-\s+.*\n?)+)", fm)
    if not m:
        return []
    return [
        v.strip().strip("\"'") for v in re.findall(r"(?m)^\s+-\s+(.*)$", m.group(1))
    ]


def norm_url(url: str) -> str:
    """Normalize an internal URL for map lookups."""
    url = url.split("#")[0].split("?")[0].strip().strip("\"'")
    url = re.sub(r"^https?://(www\.)?idvork\.in", "", url)
    if not url.startswith("/"):
        url = "/" + url
    return url.rstrip("/").lower() or "/"


def site_url_maps(root: Path) -> tuple[dict[str, str], dict[str, str]]:
    """{permalink: path} and {redirect: canonical permalink}, from front matter.

    A redirect declared by a page with no permalink is dropped — nothing to
    point the author at. Counts in SKILL.md.
    """
    permalinks: dict[str, str] = {}
    declared: list[tuple[str, str]] = []  # (redirect url, declaring path)
    for directory in POST_DIRS:
        for path in sorted((root / directory).glob("*.md")):
            post = split_post(path)
            if post is None:
                continue
            rel = str(path.relative_to(root))
            if permalink := fm_scalar(post.front_matter, "permalink"):
                permalinks[norm_url(permalink)] = rel
            for key in ("redirect_from", "alias"):
                declared += [
                    (norm_url(url), rel) for url in fm_list(post.front_matter, key)
                ]
    canonical_of = {path: url for url, path in permalinks.items()}
    redirects: dict[str, str] = {}
    for url, path in declared:
        if path in canonical_of:
            redirects.setdefault(url, canonical_of[path])
    return permalinks, redirects


BLOCK_KINDS = (
    (r"\{%", "liquid"),
    (r"!\[", "image"),
    (r"#{1,6}\s", "heading"),
    (r"[-*+]\s|\d+\.\s", "list"),
    (r">", "blockquote"),
    (r"<[a-zA-Z]", "html"),
    (r"\|", "table"),
    (r"```", "code"),
)


def first_block(body: str) -> tuple[str, int, str]:
    """Kind, 0-based line index and text of the first rendered block.

    HTML comments render to nothing, so they are skipped.
    """
    lines = body.split("\n")
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if not stripped:
            i += 1
            continue
        if stripped.startswith("<!--"):
            while i < len(lines) and "-->" not in lines[i]:
                i += 1
            i += 1
            continue
        for pattern, kind in BLOCK_KINDS:
            if re.match(pattern, stripped):
                return kind, i, stripped
        return "text", i, stripped
    return "empty", 0, ""


def paragraph_at(body: str, start: int) -> str:
    """The blank-line-delimited block starting at line index `start`."""
    lines = body.split("\n")[start:]
    out: list[str] = []
    for line in lines:
        if not line.strip():
            break
        out.append(line)
    return "\n".join(out)


# --- checks ------------------------------------------------------------------


@dataclass
class Check:
    key: str
    status: str = PASS
    issues: list[str] = field(default_factory=list)
    detail: str = ""
    blocking: bool = True

    def fail(self, issue: str) -> None:
        self.status = FAIL
        if issue not in self.issues:  # the same link twice on one line is one issue
            self.issues.append(issue)


def check_front_matter(post: Post) -> Check:
    """title / permalink / tags. Per-collection carve-outs measured in SKILL.md."""
    check = Check("front-matter")
    directory = post.path.parent.name
    required = ["title"]
    if directory in ("_d", "_td"):
        required.append("permalink")
    if directory in ("_d", "_posts"):
        required.append("tags")
    for key in required:
        if not fm_has(post.front_matter, key):
            check.fail(f"front-matter — add `{key}:` to the front matter")
    return check


LINK_RE = re.compile(r"(?<!!)\[[^\]]*\]\(([^)\s]+)")
SUMMARIZE_RE = re.compile(r"\{%\s*include\s+summarize-page\.html\s+src=\"([^\"]+)\"")
HREF_RE = re.compile(r"<a\s[^>]*href=\"([^\"]+)\"")


def check_internal_links(
    post: Post, permalinks: dict[str, str], redirects: dict[str, str]
) -> Check:
    check = Check("internal-links")
    found = False
    for line_no, line in enumerate(post.body.split("\n")):
        for match in (
            *LINK_RE.finditer(line),
            *SUMMARIZE_RE.finditer(line),
            *HREF_RE.finditer(line),
        ):
            raw = match.group(1)
            absolute = re.match(r"https?://(www\.)?idvork\.in", raw)
            if not absolute and not raw.startswith("/"):
                continue
            if (
                raw.startswith("//")
                or raw.startswith("/assets/")
                or raw.startswith("/images/")
            ):
                continue
            found = True
            where = f"line {post.body_offset + line_no}"
            if absolute:
                check.fail(
                    f"internal-links — {where}: `{raw}` uses the hostname; "
                    f"link internally with `{norm_url(raw)}`"
                )
                continue
            target = norm_url(raw)
            if target in redirects and target not in permalinks:
                check.fail(
                    f"internal-links — {where}: `{raw}` is a redirect; "
                    f"use the permalink `{redirects[target]}`"
                )
    if not found:
        check.status = NA
    return check


def check_opening(post: Post) -> Check:
    """First rendered block must be a plain paragraph — Jekyll excerpts it."""
    check = Check("opening")
    kind, line, text = first_block(post.body)
    if kind == "empty":
        check.fail("opening — post has no body")
        return check
    if kind != "text":
        check.fail(
            f"opening — line {post.body_offset + line}: post opens with a {kind} block "
            f"(`{text[:50]}`); Jekyll excerpts the first paragraph, so lead with plain prose"
        )
        return check
    opener = paragraph_at(post.body, line)
    if "{%" in opener:
        check.fail(
            f"opening — line {post.body_offset + line}: the opening paragraph contains a "
            "Liquid include; move it below the paragraph"
        )
    return check


ALERT_RE = re.compile(r"\{%\s*include\s+alert\.html")
AI_SLOP_RE = re.compile(r"\{%\s*include\s+ai-slop\.html")


def _include_before_opening(
    post: Post, pattern: re.Pattern[str], key: str, label: str
) -> Check:
    check = Check(key)
    lines = post.body.split("\n")
    hits = [i for i, line in enumerate(lines) if pattern.search(line)]
    if not hits:
        check.status = NA
        return check
    _, opening_line, _ = first_block(post.body)
    opening_end = opening_line + len(paragraph_at(post.body, opening_line).split("\n"))
    for hit in hits:
        if hit < opening_end:
            check.fail(
                f"{key} — line {post.body_offset + hit}: {label} sits at or above the opening "
                "paragraph, which breaks the Jekyll excerpt; move it below"
            )
    return check


def check_alerts(post: Post) -> Check:
    return _include_before_opening(post, ALERT_RE, "alerts", "the alert box")


def check_ai_slop(post: Post) -> Check:
    return _include_before_opening(post, AI_SLOP_RE, "ai-slop", "the ai-slop notice")


BLOB_RE = re.compile(r"github\.com/idvorkin/blob/")
MD_IMAGE_RE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
HTML_IMAGE_RE = re.compile(r"<img\s[^>]*src=\"([^\"]+)\"")


def check_images(post: Post) -> Check:
    """Blob-repo images must use the blob_image includes; other hosts may be raw."""
    check = Check("images")
    found = "blob_image" in post.body
    for line_no, line in enumerate(post.body.split("\n")):
        for match in (*MD_IMAGE_RE.finditer(line), *HTML_IMAGE_RE.finditer(line)):
            found = True
            url = match.group(1)
            if BLOB_RE.search(url):
                src = re.sub(r".*/blob/raw/[^/]+/", "", url)
                check.fail(
                    f"images — line {post.body_offset + line_no}: blob image linked raw; "
                    f'use `{{% include blob_image.html src="{src}" %}}`'
                )
    if not found:
        check.status = NA
    return check


AMAZON_RE = re.compile(r"https?://(www\.)?(amazon\.[a-z.]+|amzn\.to)/\S+")


def check_books(post: Post) -> Check:
    check = Check("books")
    found = "amazon.html" in post.body
    for line_no, line in enumerate(post.body.split("\n")):
        for match in AMAZON_RE.finditer(line):
            found = True
            asin = re.search(r"/(?:dp|gp/product)/([A-Z0-9]{10})", match.group(0))
            hint = f'asin="{asin.group(1)}"' if asin else 'asin="…"'
            check.fail(
                f"books — line {post.body_offset + line_no}: raw Amazon link; "
                f"use `{{% include amazon.html {hint} %}}`"
            )
    if not found:
        check.status = NA
    return check


def git(root: Path, *args: str) -> tuple[int, str]:
    proc = subprocess.run(
        ["git", "-C", str(root), *args], capture_output=True, text=True, check=False
    )
    return proc.returncode, proc.stdout.strip()


def resolve_base(root: Path, base: str | None) -> str | None:
    for ref in [base] if base else ["upstream/main", "origin/main", "main"]:
        if git(root, "rev-parse", "--verify", "--quiet", f"{ref}^{{commit}}")[0] == 0:
            return ref
    return None


def check_rebased(root: Path, base: str | None) -> Check:
    """The branch contains the current tip of main."""
    check = Check("rebased")
    ref = resolve_base(root, base)
    if ref is None:
        check.status = NA
        check.detail = "no upstream/main, origin/main or main ref"
        return check
    check.detail = ref
    if git(root, "merge-base", "--is-ancestor", ref, "HEAD")[0] == 0:
        return check
    behind = git(root, "rev-list", "--count", f"HEAD..{ref}")[1] or "?"
    check.fail(f"rebased — branch is {behind} commits behind `{ref}`; rebase onto it")
    return check


def jev_checks(
    post: Post, key: str | None, blocking: bool
) -> tuple[dict[str, Check], dict]:
    """Ask Jev for the three judgment checks. Returns (checks, meta)."""
    checks = {k: Check(k, blocking=blocking and k in jev.BLOCKABLE) for k in JEV_KEYS}
    if key is None:
        for check in checks.values():
            check.status, check.detail = NA, "no key, skipped"
        return checks, {
            "skipped": "no OPENROUTER_API_KEY (and no OPEN_ROUTER_KEY in $SECRET_BOX)"
        }

    result = jev.judge(post.body, key)
    if result.error:
        for check in checks.values():
            check.status, check.detail = NA, "Jev call failed, skipped"
        return checks, {"error": result.error}

    meta = {
        "chunks": result.chunks,
        "calls": result.calls,
        "cost_usd": result.cost_usd,
        "latency_s": result.latency_s,
        "model": jev.MODEL,
        "scores": {k: round(v, 2) for k, v in result.scores.items()},
    }
    hits = jev.literal_hits(post.body, post.body_offset)
    for check_key in JEV_KEYS:
        if not result.fails(check_key):
            continue
        score = result.scores[check_key]
        issue = (
            f"{check_key} — Jev scored {score:.2f}/4 "
            f"(🔴 at ≥ {jev.THRESHOLDS[check_key]})"
        )
        if check_key == "ai-patterns":
            families = sorted(
                ((result.nouls[f"family_{n}"], n) for n in jev.FAMILIES), reverse=True
            )
            if named := [f"{n} ({p:.2f})" for p, n in families if p >= 0.5]:
                issue += "; heaviest patterns: " + ", ".join(named[:3])
            if hits:
                issue += "; literal hits: " + "; ".join(hits[:3])
        checks[check_key].fail(issue)
    for check_key in JEV_KEYS:
        checks[check_key].detail = f"{result.scores[check_key]:.2f}"
    if hits:
        meta["literal_hits"] = hits
    return checks, meta


# --- reporting ---------------------------------------------------------------


def run_file(
    path: Path,
    root: Path,
    permalinks: dict[str, str],
    redirects: dict[str, str],
    rebased: Check,
    key: str | None,
    jev_blocking: bool,
    use_jev: bool,
) -> tuple[dict[str, Check], dict]:
    post = split_post(path)
    if post is None:
        check = Check("front-matter")
        check.fail("front-matter — file has no YAML front matter")
        checks = {k: Check(k, status=NA) for _, keys in GRID for k in keys}
        checks["front-matter"] = check
        checks["rebased"] = rebased
        return checks, {}

    checks = {
        "front-matter": check_front_matter(post),
        "internal-links": check_internal_links(post, permalinks, redirects),
        "opening": check_opening(post),
        "alerts": check_alerts(post),
        "ai-slop": check_ai_slop(post),
        "images": check_images(post),
        "books": check_books(post),
        "rebased": rebased,
    }
    if use_jev:
        jev, meta = jev_checks(post, key, jev_blocking)
    else:
        jev = {
            k: Check(
                k,
                status=NA,
                detail="--no-jev",
                blocking=jev_blocking and k in jev.BLOCKABLE,
            )
            for k in JEV_KEYS
        }
        meta = {"skipped": "--no-jev"}
    checks |= jev
    return checks, meta


def render(path: Path, checks: dict[str, Check], meta: dict) -> str:
    lines = [f"{path}"]
    for phase, keys in GRID:
        cells = " ".join(f"{MARK[checks[k].status]} {k}" for k in keys)
        lines.append(f"{phase}: {cells}")
    if scores := meta.get("scores"):
        detail = " · ".join(
            f"{k} {v:.2f}/{jev.THRESHOLDS[k]:.1f}" + ("" if checks[k].blocking else "*")
            for k, v in scores.items()
        )
        lines.append(
            f"Jev ({meta.get('model', jev.MODEL)}, score/🔴-threshold): {detail}"
        )
        lines.append("  * advisory only — never fails the run")
    elif note := (meta.get("skipped") or meta.get("error")):
        lines.append(f"Jev: skipped — {note}")
    issues = [i for _, keys in GRID for k in keys for i in checks[k].issues]
    if issues:
        lines.append("")
        lines.append("Issues:")
        lines += [f"- {i}" for i in issues]
    if hits := meta.get("literal_hits"):
        lines.append("")
        lines.append("Advisory — guideline phrases found (evidence, not a verdict):")
        lines += [f"- {h}" for h in hits[:10]]
    return "\n".join(lines)


def changed_posts(root: Path, base: str | None) -> list[Path]:
    ref = resolve_base(root, base)
    if ref is None:
        return []
    code, out = git(root, "diff", "--name-only", "--diff-filter=ACMR", f"{ref}...HEAD")
    if code != 0:
        return []
    return [
        root / line
        for line in out.split("\n")
        if line.endswith(".md")
        and line.split("/")[0] in POST_DIRS
        and (root / line).exists()
    ]


def main(
    paths: list[str],
    as_json: bool = False,
    advisory: bool = False,
    jev_blocking: bool = False,
    use_jev: bool = True,
    base: str | None = None,
) -> int:
    root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel")[1] or ".").resolve()
    targets = [Path(p).resolve() for p in paths] if paths else changed_posts(root, base)
    if not targets:
        print("No posts changed on this branch — nothing to check.")
        return 0

    permalinks, redirects = site_url_maps(root)
    rebased = check_rebased(root, base)
    key = jev.api_key() if use_jev else None

    results = []
    failed = False
    for path in targets:
        if not path.exists():
            print(f"error: {path} does not exist", file=sys.stderr)
            return 2
        checks, meta = run_file(
            path, root, permalinks, redirects, rebased, key, jev_blocking, use_jev
        )
        rel = path.relative_to(root) if path.is_relative_to(root) else path
        results.append((rel, checks, meta))
        failed |= any(c.status == FAIL and c.blocking for c in checks.values())

    if as_json:
        print(
            json.dumps(
                {
                    "posts": [
                        {
                            "path": str(rel),
                            "checks": {
                                k: {
                                    "status": c.status,
                                    "blocking": c.blocking,
                                    "detail": c.detail,
                                    "issues": c.issues,
                                }
                                for k, c in checks.items()
                            },
                            "jev": meta,
                        }
                        for rel, checks, meta in results
                    ],
                    "blocking_failure": failed,
                },
                indent=2,
            )
        )
    else:
        print("\n\n".join(render(rel, checks, meta) for rel, checks, meta in results))

    return 1 if failed and not advisory else 0


def _build_app():  # pragma: no cover - thin CLI shell
    import typer

    app = typer.Typer(add_completion=False, help=__doc__)

    @app.command()
    def run(
        paths: list[str] = typer.Argument(
            None, help="Posts to check. Default: posts changed on this branch."
        ),
        json_out: bool = typer.Option(False, "--json", help="Machine-readable output."),
        advisory: bool = typer.Option(False, "--advisory", help="Always exit 0."),
        advisory_jev: bool = typer.Option(
            True,
            "--advisory-jev/--block-jev",
            help="Jev-judged checks never fail the run (default).",
        ),
        no_jev: bool = typer.Option(
            False, "--no-jev", help="Skip the Jev calls entirely."
        ),
        base: str = typer.Option(
            None,
            "--base",
            help="Base ref. Default: upstream/main, then origin/main, then main.",
        ),
    ):
        raise typer.Exit(
            main(
                paths or [],
                as_json=json_out,
                advisory=advisory,
                jev_blocking=not advisory_jev,
                use_jev=not no_jev,
                base=base,
            )
        )

    return app


if __name__ == "__main__":
    _build_app()()

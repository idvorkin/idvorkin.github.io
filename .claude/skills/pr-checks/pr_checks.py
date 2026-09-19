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
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

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
JEV_KEYS = ("headers", "voice", "ai-patterns")

# --- Jev ---------------------------------------------------------------------

JEV_URL = "https://openrouter.ai/api/alpha/decisions"
JEV_MODEL = "typesafe/jev-1.13"

# Measured 2026-09: the endpoint rejects a request over ~32_768 input tokens
# with max_tokens_exceeded (ok at 121_500 chars of prose, fails at 124_031).
# 60_000 chars leaves room for the question block plus token-density variance.
JEV_MAX_CHARS = 60_000

# Thresholds on Jev's 0–4 rubric position, set by `calibrate.py` (numbers and
# method in SKILL.md, measured 2026-09 against jev-1.13):
#
#   ai-patterns  real prose topped out at 2.47 and the AI-patterned fixtures
#                all landed at 3.99+, so 3.0 sits in a genuine gap. This is the
#                only Jev check with a validated positive group, so it is the
#                only one `--block-jev` can fail a run on.
#   headers      paired defect injection (strip every heading from a real post)
#                moved the score on 3 of 6 posts. It does not discriminate.
#   voice        injecting an I→we switch into the back half of a post moved
#                the score by +0.03 to +1.38 while clean posts already sat at
#                2.2–3.1. It does not discriminate either.
#
# Those two keep a threshold set above the whole corpus ceiling (n=40 random
# posts: headers max 2.63, voice max 3.05) so a 🔴 means "an outlier against
# 364 posts", not "fails the guideline". They never block.
JEV_THRESHOLDS = {"headers": 3.0, "voice": 3.5, "ai-patterns": 3.0}
JEV_BLOCKABLE = frozenset({"ai-patterns"})

JEV_QUESTIONS = {
    # Every question is worded so HIGHER = MORE PROBLEM, so one threshold
    # direction covers all of them.
    "headers": {
        "type": "score",
        "instructions": (
            "How hard is this blog post to scan, because of how it uses (or fails to use) "
            "section headers to break the text into findable chunks?"
        ),
        "criteria": [
            "Easy to scan: headers break the post into clear sections, or it is short enough not to need any",
            "Mostly scannable: headers exist but one or two long stretches run on without one",
            "Patchy: some of the post is sectioned and a lot of it is not",
            "Hard to scan: long runs of prose with almost no headers",
            "A wall of text: no headers at all in a post long enough to need them",
        ],
    },
    "voice": {
        "type": "score",
        "instructions": (
            "How inconsistent is the voice in this blog post? Look for switching between "
            "'I' and 'we' for the same speaker, shifts between conversational and formal "
            "register, and changes in who the post is addressed to."
        ),
        "criteria": [
            "One consistent voice and register from start to finish",
            "Nearly consistent: a single line reads slightly differently",
            "Noticeable: a section drifts into another register or pronoun and back",
            "Inconsistent: the post repeatedly switches pronoun or register",
            "Incoherent: it reads as several different pieces stitched together",
        ],
    },
    "ai-patterns": {
        "type": "score",
        "instructions": (
            "How much does this blog post read like generic AI-generated prose rather than "
            "a specific person writing from their own experience? Signs: undue emphasis "
            "('stands as', 'plays a vital role in'), editorializing ('it's important to "
            "note', 'notably'), formulaic conjunctions starting sentences ('Additionally', "
            "'Furthermore', 'Moreover'), vague intensifiers ('very unique', 'truly "
            "remarkable'), promotional language, rule-of-three padding, and abstract "
            "summary in place of concrete detail."
        ),
        "criteria": [
            "Not at all: concrete, specific and idiosyncratic throughout",
            "Barely: one or two stock phrases in otherwise specific writing",
            "Somewhat: stock phrasing and padding show up repeatedly alongside real content",
            "Mostly: hedging, editorializing and formulaic transitions dominate",
            "Entirely: generic filler with no specific detail or personal stake",
        ],
    },
}

# Asked in the same call as the verdict questions (one call, no extra cost tier)
# purely so a 🔴 on ai-patterns can name WHICH family triggered it. Jev returns a
# verdict with no reasons, so without these the Issues line is not actionable.
JEV_FAMILIES = {
    "undue-emphasis": "phrases that assert importance instead of showing it, like 'stands as', 'serves as', 'plays a vital role in', 'underscores'",
    "editorializing": "editorializing asides like \"it's important to note\", \"it's worth mentioning\", 'notably', 'importantly'",
    "formulaic-conjunctions": "sentences that start with 'Additionally', 'Furthermore', 'Moreover' or similar essay connectives",
    "vague-intensifiers": "vague intensifiers like 'very unique', 'truly remarkable', 'highly significant'",
    "promotional": "promotional or tourism-brochure language, like 'hidden gem', 'boasts a wide array', 'rich cultural heritage'",
    "ing-phrases": "trailing -ing clauses used as filler, like 'highlighting the fact that', 'showcasing the importance of'",
    "melodramatic": "melodramatic framing like 'the question that haunts me' or 'what keeps me up at night'",
    "list-padding": "rule-of-three padding, where three items are listed because three sounds complete rather than because there are three",
}

# Literal phrases the guidelines name. Reported as evidence next to a Jev
# verdict — never a verdict on their own, because a post may legitimately quote
# them (a post about AI writing, for one).
LITERAL_PATTERNS = [
    r"it['’]s important to note",
    r"it['’]s worth (mentioning|noting)",
    r"\bstands as\b",
    r"\bserves as\b",
    r"plays a (vital|crucial|key) role",
    r"underscor(es|ing) (its|the) ",
    r"\b(Additionally|Furthermore|Moreover),",
    r"\bvery unique\b",
    r"\btruly remarkable\b",
    r"\bhidden gem\b",
    r"\bboasts a\b",
    r"\bdelv(e|ing) into\b",
    r"\bnestled (in|within)\b",
    r"\bin today['’]s (world|landscape)\b",
    r"\btapestry\b",
]


def jev_key() -> str | None:
    """OPENROUTER_API_KEY, else OPEN_ROUTER_KEY out of the $SECRET_BOX json."""
    if key := os.environ.get("OPENROUTER_API_KEY", "").strip():
        return key
    box = os.environ.get("SECRET_BOX", "").strip()
    if not box:
        return None
    try:
        return json.loads(Path(box).read_text()).get("OPEN_ROUTER_KEY") or None
    except (OSError, ValueError):
        return None


def jev_ask(state: str, questions: dict, key: str, timeout: int = 60) -> dict:
    """POST one decision request. Returns the parsed response body."""
    body = json.dumps(
        {"model": JEV_MODEL, "state": state, "questions": questions}
    ).encode()
    req = urllib.request.Request(
        JEV_URL,
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def chunk_text(text: str, limit: int = JEV_MAX_CHARS) -> list[str]:
    """Split on `## ` boundaries so each chunk fits Jev's input limit."""
    if len(text) <= limit:
        return [text]
    chunks: list[str] = []
    current = ""
    for section in re.split(r"(?m)^(?=## )", text):
        if len(current) + len(section) <= limit:
            current += section
            continue
        if current:
            chunks.append(current)
        while len(section) > limit:  # a single section over the limit
            chunks.append(section[:limit])
            section = section[limit:]
        current = section
    if current:
        chunks.append(current)
    return chunks


def worst(answers: list[dict], key: str) -> float:
    """Worst (highest) score for `key` across chunk answers."""
    return max(float(a[key]["score"]) for a in answers)


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
    """Build {permalink: path} and {redirect: canonical permalink} from front matter.

    A redirect declared by a page that has no `permalink` (the dated `_posts/`
    collection builds its URL from the filename) is left out: there is no
    canonical URL to send the author to, so flagging the link would be advice
    nobody can act on. That drops 58 of 257 hits across the repo.
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

    HTML comments (the TOC fences, prettier pragmas) render to nothing, so they
    are skipped rather than treated as the opening block.
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
    """title / permalink / tags, per the checklist.

    Scope carve-outs come from what the repo actually does (measured on
    upstream/main, Sept 2026), not from taste:
      - `permalink` — 76/76 posts added in the last year carry one in `_d/`;
        `_posts/` is a dated collection whose URLs come from the filename
        (24/37 have no permalink), so it is not required there.
      - `tags` — never used anywhere in `_td/` (0/51), so requiring it there
        would be a pure false positive.
    """
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
    """Blob-repo images must go through the blob_image includes.

    Images hosted elsewhere (ipaste, external sites) are raw markdown all over
    the repo and are fine — only the blob repo has a matching include.
    """
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


def literal_hits(post: Post) -> list[str]:
    out = []
    for line_no, line in enumerate(post.body.split("\n")):
        for pattern in LITERAL_PATTERNS:
            if match := re.search(pattern, line, re.I):
                out.append(f"line {post.body_offset + line_no}: “{match.group(0)}”")
    return out


def jev_checks(
    post: Post, key: str | None, blocking: bool
) -> tuple[dict[str, Check], dict]:
    """The three judgment checks. Returns (checks, meta)."""
    checks = {k: Check(k, blocking=blocking and k in JEV_BLOCKABLE) for k in JEV_KEYS}
    meta: dict = {}
    if key is None:
        for check in checks.values():
            check.status = NA
            check.detail = "no key, skipped"
        meta["skipped"] = (
            "no OPENROUTER_API_KEY (and no OPEN_ROUTER_KEY in $SECRET_BOX)"
        )
        return checks, meta

    questions = dict(JEV_QUESTIONS)
    questions |= {
        f"family_{name}": {
            "type": "noul",
            "instructions": f"Does this text repeatedly use {desc}?",
        }
        for name, desc in JEV_FAMILIES.items()
    }

    chunks = chunk_text(post.body)
    answers: list[dict] = []
    cost = 0.0
    started = time.time()
    for chunk in chunks:
        try:
            response = jev_ask(chunk, questions, key)
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            detail = getattr(exc, "read", lambda: b"")()[:200].decode(errors="replace")
            for check in checks.values():
                check.status = NA
                check.detail = "Jev call failed, skipped"
            meta["error"] = f"{type(exc).__name__}: {exc} {detail}".strip()
            return checks, meta
        answers.append(response["answers"])
        cost += float(response.get("usage", {}).get("cost", 0) or 0)
    meta |= {
        "chunks": len(chunks),
        "cost_usd": round(cost, 8),
        "latency_s": round(time.time() - started, 2),
        "model": JEV_MODEL,
    }

    hits = literal_hits(post)
    for check_key in JEV_KEYS:
        score = worst(answers, check_key)
        threshold = JEV_THRESHOLDS[check_key]
        checks[check_key].detail = f"{score:.2f}"
        meta.setdefault("scores", {})[check_key] = round(score, 2)
        if score < threshold:
            continue
        issue = f"{check_key} — Jev scored {score:.2f}/4 (🔴 at ≥ {threshold})"
        if check_key == "ai-patterns":
            families = sorted(
                (
                    (max(float(a[f"family_{name}"]["noul"]) for a in answers), name)
                    for name in JEV_FAMILIES
                ),
                reverse=True,
            )
            named = [f"{name} ({p:.2f})" for p, name in families if p >= 0.5]
            if named:
                issue += "; heaviest patterns: " + ", ".join(named[:3])
            if hits:
                issue += "; literal hits: " + "; ".join(hits[:3])
        checks[check_key].fail(issue)
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
                blocking=jev_blocking and k in JEV_BLOCKABLE,
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
            f"{k} {v:.2f}/{JEV_THRESHOLDS[k]:.1f}" + ("" if checks[k].blocking else "*")
            for k, v in scores.items()
        )
        lines.append(
            f"Jev ({meta.get('model', JEV_MODEL)}, score/🔴-threshold): {detail}"
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
    key = jev_key() if use_jev else None

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

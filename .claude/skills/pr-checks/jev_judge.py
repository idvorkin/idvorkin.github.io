"""Jev's half of pr-checks: text in, scores out. No repo state, no git, no I/O
beyond the one HTTP call.

`pr_checks.py` owns the code checks and the grid; this module owns every
judgment call. Thresholds and their calibration live in SKILL.md.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

URL = "https://openrouter.ai/api/alpha/decisions"
MODEL = "typesafe/jev-1.13"

# Endpoint rejects over ~32_768 input tokens (ok at 121_500 chars, fails at 124_031).
MAX_CHARS = 60_000

# Checks only Jev judges. `score` on a 0–4 rubric, worded so higher = worse.
JUDGMENT_KEYS = ("headers", "voice", "ai-patterns")

# Checks pr_checks.py already settles in code, asked again so a disagreement is
# visible. Code stays the authority; these never block. `rebased` is git state,
# not text, so it is not doubled.
DOUBLED_KEYS = (
    "front-matter",
    "internal-links",
    "opening",
    "alerts",
    "images",
    "books",
    "ai-slop",
)

# Ask about position relative to the opening paragraph, so only the first chunk
# can answer them. The rest scan the whole post.
POSITIONAL = frozenset({"front-matter", "opening", "alerts", "ai-slop"})

THRESHOLDS = {
    "headers": 3.0,
    "voice": 3.5,
    "ai-patterns": 3.0,
    **dict.fromkeys(DOUBLED_KEYS, 0.5),
}

# Only check with a validated positive group — see SKILL.md § Calibration.
BLOCKABLE = frozenset({"ai-patterns"})

JUDGMENT_QUESTIONS = {
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

# Localizers for an ai-patterns 🔴 — Jev returns a verdict with no reasons.
FAMILIES = {
    "undue-emphasis": "phrases that assert importance instead of showing it, like 'stands as', 'serves as', 'plays a vital role in', 'underscores'",
    "editorializing": "editorializing asides like \"it's important to note\", \"it's worth mentioning\", 'notably', 'importantly'",
    "formulaic-conjunctions": "sentences that start with 'Additionally', 'Furthermore', 'Moreover' or similar essay connectives",
    "vague-intensifiers": "vague intensifiers like 'very unique', 'truly remarkable', 'highly significant'",
    "promotional": "promotional or tourism-brochure language, like 'hidden gem', 'boasts a wide array', 'rich cultural heritage'",
    "ing-phrases": "trailing -ing clauses used as filler, like 'highlighting the fact that', 'showcasing the importance of'",
    "melodramatic": "melodramatic framing like 'the question that haunts me' or 'what keeps me up at night'",
    "list-padding": "rule-of-three padding, where three items are listed because three sounds complete rather than because there are three",
}


DOUBLED_QUESTIONS = {
    "front-matter": {
        "type": "noul",
        "instructions": (
            "The document opens with a YAML front matter block between `---` lines, and "
            "the header line above it gives the file's path. Is that front matter "
            "incomplete? It needs a `title`; it needs a `permalink` unless the file is in "
            "`_posts/`; it needs a `tags` list unless the file is in `_td/`."
        ),
    },
    "internal-links": {
        "type": "noul",
        "instructions": (
            "Does any link to this same blog write out the full `https://idvork.in` "
            "hostname, instead of a site-relative path starting with `/`?"
        ),
    },
    "opening": {
        "type": "noul",
        "instructions": (
            "Read the very first thing a reader sees after the closing `---` of the front "
            "matter. Is that first visible thing NOT a normal prose paragraph — i.e. is it "
            "a markdown heading (`#`), an image, a bullet or numbered list, a blockquote, a "
            "table, a fenced code block, a raw HTML element, or a Liquid `{% include %}` "
            "tag? Ignore HTML comments entirely, and ignore everything that appears AFTER "
            "the first prose paragraph."
        ),
    },
    "alerts": {
        "type": "noul",
        "instructions": (
            "Does a `{% include alert.html %}` tag appear at or above the post's first "
            "plain prose paragraph, rather than below it?"
        ),
    },
    "images": {
        "type": "noul",
        "instructions": (
            "Does this post show an image hosted at `github.com/idvorkin/blob` through raw "
            "markdown `![alt](url)` or a raw `<img>` tag, instead of through a "
            "`{% include blob_image… %}` tag? Images hosted anywhere else are fine raw."
        ),
    },
    "books": {
        "type": "noul",
        "instructions": (
            "Does this post link to `amazon.com` or `amzn.to` with a raw URL, instead of "
            'using `{% include amazon.html asin="…" %}`?'
        ),
    },
    "ai-slop": {
        "type": "noul",
        "instructions": (
            "Does a `{% include ai-slop.html %}` tag appear at or above the post's first "
            "plain prose paragraph, rather than below it?"
        ),
    },
}

# Phrases content_guidelines.md names. Evidence printed beside a Jev verdict,
# never a verdict alone — a post about AI writing quotes them legitimately.
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


@dataclass
class Judgment:
    scores: dict[str, float] = field(default_factory=dict)  # judgment keys, 0–4
    nouls: dict[str, float] = field(default_factory=dict)  # doubled + families, 0–1
    calls: int = 0
    chunks: int = 0
    cost_usd: float = 0.0
    latency_s: float = 0.0
    error: str | None = None

    def fails(self, key: str) -> bool:
        value = self.scores.get(key, self.nouls.get(key))
        return value is not None and value >= THRESHOLDS[key]

    def value(self, key: str) -> float | None:
        return self.scores.get(key, self.nouls.get(key))


def api_key() -> str | None:
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


def ask(state: str, questions: dict, key: str, timeout: int = 60) -> dict:
    """POST one decision request, retried once. Returns the parsed response body.

    The endpoint hands back a transient 5xx often enough to be worth one retry.
    """
    body = json.dumps({"model": MODEL, "state": state, "questions": questions}).encode()
    req = urllib.request.Request(
        URL,
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    for attempt in (0, 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as exc:
            if exc.code < 500 or attempt:
                raise
            time.sleep(1)
    raise RuntimeError("unreachable")


def chunk(text: str, limit: int = MAX_CHARS) -> list[str]:
    """Split on `## ` boundaries so each chunk fits the input limit."""
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
        while len(section) > limit:
            chunks.append(section[:limit])
            section = section[limit:]
        current = section
    if current:
        chunks.append(current)
    return chunks


def worst(answers: list[dict], key: str, field_name: str) -> float:
    return max(float(a[key][field_name]) for a in answers)


def literal_hits(body: str, offset: int = 1) -> list[str]:
    out = []
    for line_no, line in enumerate(body.split("\n")):
        for pattern in LITERAL_PATTERNS:
            if match := re.search(pattern, line, re.I):
                out.append(f"line {offset + line_no}: “{match.group(0)}”")
    return out


def _run(state: str, questions: dict, key: str, out: Judgment) -> list[dict] | None:
    """Ask `questions` over every chunk of `state`. None on failure."""
    answers = []
    for piece in chunk(state):
        try:
            response = ask(piece, questions, key)
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            detail = getattr(exc, "read", lambda: b"")()[:200].decode(errors="replace")
            out.error = f"{type(exc).__name__}: {exc} {detail}".strip()
            return None
        answers.append(response["answers"])
        out.calls += 1
        out.cost_usd += float(response.get("usage", {}).get("cost", 0) or 0)
    out.chunks = max(out.chunks, len(answers))
    return answers


def judge(body: str, key: str, document: str | None = None) -> Judgment:
    """Judgment checks over `body`; with `document`, the doubled checks over the
    whole file text as well.

    Two calls, not one: the judgment thresholds were calibrated against the body
    alone, and the doubled questions need the front matter and the path.
    """
    out = Judgment()
    started = time.time()

    questions = {
        **JUDGMENT_QUESTIONS,
        **{
            f"family_{name}": {
                "type": "noul",
                "instructions": f"Does this text repeatedly use {desc}?",
            }
            for name, desc in FAMILIES.items()
        },
    }
    answers = _run(body, questions, key, out)
    if answers is None:
        return out
    out.scores = {k: worst(answers, k, "score") for k in JUDGMENT_KEYS}
    out.nouls = {
        f"family_{name}": worst(answers, f"family_{name}", "noul") for name in FAMILIES
    }

    if document is not None:
        answers = _run(document, DOUBLED_QUESTIONS, key, out)
        if answers is None:
            return out
        for k in DOUBLED_KEYS:
            out.nouls[k] = worst(answers[:1] if k in POSITIONAL else answers, k, "noul")

    out.latency_s = round(time.time() - started, 2)
    out.cost_usd = round(out.cost_usd, 8)
    return out

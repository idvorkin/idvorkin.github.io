#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "typer",
#   "rich",
# ]
# ///
"""Read blog annotation batches captured by ``_includes/annotate.html``.

Igor highlights a line on the rendered blog, types a comment, and ships the
batch to a *secret* gist whose description is exactly ``blog-review: <permalink>``.
This CLI is the Larry-side reader.

    ./scripts/blog_review.py list                 # find review gists
    ./scripts/blog_review.py show <gist-id>       # pretty-print one batch
    ./scripts/blog_review.py locate <gist-id>     # map each note to file:line

``show`` and ``locate`` also accept a path to a local JSON file, which is what
the client's "Copy to clipboard" fallback produces.

This tool deliberately does NOT edit markdown or open PRs. Locating is the
useful, safe half; Igor reviews before anything is written.

Auth: uses the ``gh`` CLI, so it inherits your existing GitHub login. No token
is read from, or written to, this repo.

Everything printed here is *untrusted text* — quotes and comments come from a
web page and routinely contain ``[...]`` (markdown links, bracketed asides).
Rich would parse those as console markup and raise ``MarkupError``, so every
data-derived string goes through :func:`esc` before it reaches a console.
"""

from __future__ import annotations

import difflib
import json
import re
import subprocess
import sys
import unicodedata
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import typer
from rich.console import Console
from rich.markup import escape as esc
from rich.table import Table

app = typer.Typer(
    add_completion=False,
    help="Read blog annotation batches from secret gists.",
    no_args_is_help=True,
)
console = Console()

DESCRIPTION_PREFIX = "blog-review:"
REVIEW_FILENAME = "review.json"

# Jekyll collections that can hold a post with a permalink.
CONTENT_DIRS = ("_d", "_td", "_posts", "_ig66", "_gascity")

REPO_ROOT = Path(__file__).resolve().parent.parent

# One tap at annotation time; keep this list in sync with _includes/annotate.html.
INTENTS = ("fix", "cut", "rewrite", "expand", "check", "question", "note")
DEFAULT_INTENT = "note"
INTENT_STYLE = {
    "fix": "bold red",
    "cut": "bold magenta",
    "rewrite": "bold yellow",
    "expand": "bold green",
    "check": "bold blue",
    "question": "bold cyan",
    "note": "dim",
}


# --------------------------------------------------------------------------- gh
def _gh(*args: str) -> str:
    """Run a gh command, returning stdout. Exits with a clear message on failure."""
    try:
        proc = subprocess.run(
            ["gh", *args], capture_output=True, text=True, check=False
        )
    except FileNotFoundError:
        console.print("[red]gh CLI not found.[/red] Install it: https://cli.github.com")
        raise typer.Exit(1) from None
    if proc.returncode != 0:
        console.print(
            f"[red]gh {esc(' '.join(args))} failed:[/red] {esc(proc.stderr.strip())}"
        )
        raise typer.Exit(1)
    return proc.stdout


def fetch_gist_list(limit: int) -> list[dict]:
    """All gists whose description starts with the blog-review marker."""
    raw = _gh("api", f"/gists?per_page={min(limit, 100)}", "--paginate")
    # --paginate concatenates JSON arrays; gh emits them back to back.
    gists: list[dict] = []
    decoder = json.JSONDecoder()
    idx = 0
    while idx < len(raw):
        while idx < len(raw) and raw[idx].isspace():
            idx += 1
        if idx >= len(raw):
            break
        chunk, offset = decoder.raw_decode(raw, idx)
        gists.extend(chunk)
        idx = offset
    return [
        g
        for g in gists
        if (g.get("description") or "").strip().startswith(DESCRIPTION_PREFIX)
    ]


def load_batch(source: str) -> dict:
    """Load a review batch from a gist id/url or a local JSON file."""
    local = Path(source)
    if local.exists():
        return json.loads(local.read_text())

    gist_id = source.rstrip("/").split("/")[-1]
    gist = json.loads(_gh("api", f"/gists/{gist_id}"))
    files = gist.get("files") or {}
    entry = files.get(REVIEW_FILENAME)
    if entry is None:
        # Be forgiving: take the only file, or the first .json one.
        candidates = [
            f for f in files.values() if f.get("filename", "").endswith(".json")
        ]
        if len(candidates) == 1:
            entry = candidates[0]
        else:
            console.print(
                f"[red]Gist {esc(gist_id)} has no {REVIEW_FILENAME}[/red] "
                f"(files: {esc(', '.join(files)) or 'none'})"
            )
            raise typer.Exit(1)

    content = entry.get("content")
    if entry.get("truncated") and entry.get("raw_url"):
        content = _gh("api", entry["raw_url"])
    return json.loads(content)


# -------------------------------------------------------------- normalization
SMART_MAP = {
    "‘": "'",
    "’": "'",
    "‚": "'",
    "‛": "'",
    "“": '"',
    "”": '"',
    "„": '"',
    "–": "--",
    "—": "---",
    "…": "...",
    " ": " ",
    " ": " ",
    " ": " ",
    "​": "",
}

# Inline markdown constructs that vanish (or partly vanish) when rendered.
_IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_REF_LINK_RE = re.compile(r"\[([^\]]*)\]\[[^\]]*\]")
_LIQUID_RE = re.compile(r"\{%.*?%\}|\{\{.*?\}\}", re.DOTALL)
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_LEADING_RE = re.compile(r"^\s*(?:[-*+]\s+|\d+[.)]\s+|>\s?|#{1,6}\s+)")
_EMPHASIS_RE = re.compile(r"[*_`~]+")
_WS_RE = re.compile(r"\s+")


def normalize(text: str, *, strip_markdown: bool = False) -> str:
    """Collapse rendered-vs-source differences so the two can be compared.

    Rendered HTML collapses whitespace and kramdown smart-quotes punctuation,
    so both sides get pushed to the same ASCII, single-spaced shape. Markdown
    source additionally gets its inline syntax stripped.
    """
    text = unicodedata.normalize("NFKC", text)
    for bad, good in SMART_MAP.items():
        text = text.replace(bad, good)
    if strip_markdown:
        text = _LIQUID_RE.sub(" ", text)
        text = _IMAGE_RE.sub(" ", text)
        text = _LINK_RE.sub(r"\1", text)
        text = _REF_LINK_RE.sub(r"\1", text)
        text = _HTML_TAG_RE.sub(" ", text)
        text = _LEADING_RE.sub("", text)
        text = _EMPHASIS_RE.sub("", text)
        text = text.replace("\\", "")
    text = _WS_RE.sub(" ", text)
    return text.strip()


def fuzzy_normalize(text: str) -> str:
    """Last-resort shape: letters and digits only, lowercased."""
    return re.sub(r"[^a-z0-9 ]+", "", normalize(text).lower())


# ------------------------------------------------------------------ permalinks
#
# A permalink is NOT the filename. `/timeoff-2026-07` lives in
# `_d/time-off-2026-07.md`; `/23` lives in `_d/2023-year-in-review.md`. The only
# authoritative mapping is the `permalink:` line in each post's frontmatter, so
# that is what we index. Filename derivation is a *fallback*, used for the ~16
# posts in `_d` that carry no explicit permalink and inherit `_config.yml`'s
# `permalink: /:title` (Jekyll's `:title` is the filename slug, with any
# `YYYY-MM-DD-` prefix stripped).

_DATE_PREFIX_RE = re.compile(r"^\d{4}-\d{1,2}-\d{1,2}-")


def _norm_permalink(value: str) -> str:
    return "/" + value.strip().strip("/").lower()


def _squash(value: str) -> str:
    """Loosened key: alphanumerics only.

    Bridges the hyphenation gap between a permalink and its filename —
    `/timeoff-2026-07` and `time-off-2026-07.md` both squash to
    `timeoff202607`. Only ever consulted after the frontmatter index misses.
    """
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def _split_frontmatter(path: Path) -> str | None:
    """Return the raw frontmatter block, or None if the file has none."""
    try:
        text = path.read_text(errors="replace")
    except OSError:
        return None
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        # Unterminated frontmatter: cap the window so a stray `permalink:` deep
        # in the body cannot masquerade as metadata.
        return text[3:4000]
    return text[3:end]


def _frontmatter_permalink(front: str) -> str | None:
    # `[ \t]*`, never `\s*`: `\s` matches newlines, so a greedy `\s*` on a
    # valueless key silently swallows the line break and captures the NEXT
    # key's text as this key's value.
    match = re.search(r"^permalink:[ \t]*(.*?)[ \t]*$", front, re.MULTILINE)
    if not match:
        return None
    value = match.group(1).strip().strip("\"'")
    return value or None


def _frontmatter_redirects(front: str) -> list[str]:
    """`redirect_from:` as a scalar, a flow list, or a YAML block list.

    Line-based on purpose: a regex over the whole block has to reason about
    where the key's line ends, and getting that subtly wrong is how the first
    cut of this function indexed 187 keys named ``/- /eu-2026``.
    """
    lines = front.splitlines()
    for idx, line in enumerate(lines):
        head = re.match(r"^redirect_from:[ \t]*(.*?)[ \t]*$", line)
        if head:
            break
    else:
        return []

    inline = head.group(1).strip()
    if inline and not inline.startswith("#"):
        if inline.startswith("["):
            body = inline.strip("[]")
            return [v.strip().strip("\"'") for v in body.split(",") if v.strip()]
        return [inline.strip("\"'")]

    values: list[str] = []
    for line in lines[idx + 1 :]:
        if not line.strip():
            break  # blank line ends the block
        item = re.match(r"^\s*-[ \t]*(.*?)[ \t]*$", line)
        if not item:
            break  # a sibling key: the list is over
        values.append(item.group(1).strip("\"'"))
    return [v for v in values if v]


@dataclass
class Resolution:
    """Outcome of mapping one permalink onto a source file."""

    path: Path | None
    how: str = ""
    reason: str = ""
    suggestions: list[str] = field(default_factory=list)


class PermalinkIndex:
    """permalink -> source markdown, built from frontmatter.

    Three layers, most-trusted first:

    1. ``permalink:`` in frontmatter — authoritative.
    2. ``redirect_from:`` aliases — the old URLs Jekyll still serves.
    3. filename derivation — only for posts with no explicit permalink.
    """

    def __init__(self, root: Path = REPO_ROOT):
        self.root = root
        self.by_permalink: dict[str, Path] = {}
        self.by_redirect: dict[str, Path] = {}
        self.by_squashed: dict[str, Path] = {}
        self.collisions: dict[str, list[Path]] = {}
        self.files_scanned = 0
        self.dirs_searched: list[str] = []
        self.dirs_missing: list[str] = []
        self._build()

    def _build(self) -> None:
        for directory in CONTENT_DIRS:
            base = self.root / directory
            if not base.is_dir():
                self.dirs_missing.append(directory)
                continue
            self.dirs_searched.append(directory)
            for path in sorted(base.glob("*.md")):
                self.files_scanned += 1
                front = _split_frontmatter(path)
                permalink = _frontmatter_permalink(front) if front else None

                if permalink:
                    key = _norm_permalink(permalink)
                    if key in self.by_permalink and self.by_permalink[key] != path:
                        self.collisions.setdefault(
                            key, [self.by_permalink[key]]
                        ).append(path)
                    else:
                        self.by_permalink[key] = path

                if front:
                    for alias in _frontmatter_redirects(front):
                        self.by_redirect.setdefault(_norm_permalink(alias), path)

                # Filename derivation — Jekyll's `permalink: /:title` default.
                stem = path.stem
                for candidate in {stem, _DATE_PREFIX_RE.sub("", stem)}:
                    self.by_squashed.setdefault(_squash(candidate), path)

    # ------------------------------------------------------------------ lookup
    def resolve(self, permalink: str) -> Resolution:
        raw = permalink or ""
        key = _norm_permalink(raw)
        # /some-post/index.html, /some-post.html, trailing-slash variants
        variants = [key, re.sub(r"(?:/index)?\.html?$", "", key)]

        for variant in variants:
            if variant in self.by_permalink:
                return Resolution(self.by_permalink[variant], "frontmatter permalink")
        for variant in variants:
            if variant in self.by_redirect:
                return Resolution(self.by_redirect[variant], "redirect_from alias")
        for variant in variants:
            hit = self.by_squashed.get(_squash(variant))
            if hit is not None:
                return Resolution(hit, "filename fallback")

        return Resolution(
            None,
            "",
            reason=f"no source file for permalink {raw!r}",
            suggestions=self.near(key),
        )

    def near(self, key: str, n: int = 4) -> list[str]:
        pool = list(self.by_permalink) + list(self.by_redirect)
        close = difflib.get_close_matches(key, pool, n=n, cutoff=0.6)
        if close:
            return close
        # Fall back to a squashed-prefix scan: catches `/timeoff-x` vs
        # `/time-off-x` when SequenceMatcher's cutoff is unkind.
        squashed = _squash(key)
        return [p for p in pool if _squash(p).startswith(squashed[:8])][:n]

    def describe(self) -> str:
        dirs = ", ".join(self.dirs_searched) or "(none)"
        return (
            f"{len(self.by_permalink)} permalinks + {len(self.by_redirect)} redirects "
            f"from {self.files_scanned} files in {dirs}"
        )


# --------------------------------------------------------------- git staleness
def _git(*args: str) -> str | None:
    try:
        proc = subprocess.run(
            ["git", "-C", str(REPO_ROOT), *args],
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        return None
    if proc.returncode != 0:
        return None
    return proc.stdout.strip()


def current_branch() -> str:
    return _git("rev-parse", "--abbrev-ref", "HEAD") or "(unknown)"


def _parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def staleness(path: Path, annotated_at: str | None) -> dict:
    """Did the source file change after the annotation was written?

    This is the honest per-post version signal: the site itself publishes no
    build revision (see the module notes in ``_includes/annotate.html``), but
    git knows exactly when this markdown last moved.
    """
    rel = str(path.relative_to(REPO_ROOT))
    info: dict = {"file_last_commit": None, "dirty": False, "stale": False}

    committed = _parse_iso(_git("log", "-1", "--format=%cI", "--", rel))
    if committed:
        info["file_last_commit"] = committed.isoformat()
    porcelain = _git("status", "--porcelain", "--", rel)
    info["dirty"] = bool(porcelain)

    annotated = _parse_iso(annotated_at)
    if annotated and committed and committed > annotated:
        info["stale"] = True
    return info


# -------------------------------------------------------------------- locating
@dataclass
class Match:
    line: int
    method: str
    score: float
    text: str


class Locator:
    """Finds an annotation's quote inside one markdown file.

    Builds a single normalized document string plus an index that maps any
    offset in it back to a 1-based source line, so quotes that span a line
    break in the source still resolve.
    """

    _cache: dict[Path, Locator] = {}

    @classmethod
    def for_path(cls, path: Path) -> Locator:
        """One Locator per file — building the normalized doc is not free."""
        hit = cls._cache.get(path)
        if hit is None:
            hit = cls._cache[path] = cls(path)
        return hit

    def __init__(self, path: Path):
        self.path = path
        self.lines = path.read_text(errors="replace").splitlines()

        self.norm_doc, self.norm_offsets = self._build(strip_markdown=True)
        self.fuzzy_doc, self.fuzzy_offsets = self._build_fuzzy()

    def _build(self, *, strip_markdown: bool) -> tuple[str, list[tuple[int, int]]]:
        parts: list[str] = []
        offsets: list[tuple[int, int]] = []
        cursor = 0
        for lineno, raw in enumerate(self.lines, start=1):
            piece = normalize(raw, strip_markdown=strip_markdown)
            offsets.append((cursor, lineno))
            parts.append(piece)
            cursor += len(piece) + 1  # +1 for the joining space
        return " ".join(parts), offsets

    def _build_fuzzy(self) -> tuple[str, list[tuple[int, int]]]:
        parts: list[str] = []
        offsets: list[tuple[int, int]] = []
        cursor = 0
        for lineno, raw in enumerate(self.lines, start=1):
            piece = fuzzy_normalize(normalize(raw, strip_markdown=True))
            offsets.append((cursor, lineno))
            parts.append(piece)
            cursor += len(piece) + 1
        return " ".join(parts), offsets

    @staticmethod
    def _lineno_for(offset: int, offsets: list[tuple[int, int]]) -> int:
        best = 1
        for start, lineno in offsets:
            if start <= offset:
                best = lineno
            else:
                break
        return best

    def _all_positions(self, haystack: str, needle: str) -> list[int]:
        if not needle:
            return []
        found, start = [], 0
        while True:
            idx = haystack.find(needle, start)
            if idx == -1:
                return found
            found.append(idx)
            start = idx + 1

    def _pick(
        self,
        haystack: str,
        offsets: list[tuple[int, int]],
        needle: str,
        prefix: str,
        suffix: str,
    ) -> int | None:
        """Best position for `needle`, disambiguated by surrounding context."""
        positions = self._all_positions(haystack, needle)
        if not positions:
            return None
        if len(positions) == 1 or not (prefix or suffix):
            return positions[0]
        best, best_score = positions[0], -1
        for pos in positions:
            before = haystack[max(0, pos - len(prefix) - 10) : pos]
            after = haystack[pos + len(needle) : pos + len(needle) + len(suffix) + 10]
            score = 0
            if prefix and prefix in before:
                score += 2
            elif prefix and prefix[-10:] and prefix[-10:] in before:
                score += 1
            if suffix and suffix in after:
                score += 2
            elif suffix and suffix[:10] and suffix[:10] in after:
                score += 1
            if score > best_score:
                best, best_score = pos, score
        return best

    def locate(self, ann: dict) -> Match | None:
        quote = ann.get("quote") or ""
        prefix = ann.get("prefix") or ""
        suffix = ann.get("suffix") or ""
        if not quote.strip():
            return None

        # Tier 1 — raw source text, exact. Cheapest and most trustworthy.
        for lineno, raw in enumerate(self.lines, start=1):
            if quote in raw:
                return Match(lineno, "exact", 1.0, raw.strip())

        # Tier 2 — context-anchored, normalized. prefix+quote+suffix pins the
        # spot when the quote alone appears more than once.
        n_quote = normalize(quote)
        n_prefix = normalize(prefix)
        n_suffix = normalize(suffix)
        anchored = normalize(prefix + quote + suffix)
        pos = self._pick(self.norm_doc, self.norm_offsets, anchored, "", "")
        if pos is not None:
            offset = pos + len(n_prefix)
            return Match(
                self._lineno_for(offset, self.norm_offsets),
                "context",
                0.97,
                self._snippet(offset, self.norm_offsets),
            )

        # Tier 3 — quote alone, normalized, disambiguated by context.
        pos = self._pick(self.norm_doc, self.norm_offsets, n_quote, n_prefix, n_suffix)
        if pos is not None:
            return Match(
                self._lineno_for(pos, self.norm_offsets),
                "quote",
                0.9,
                self._snippet(pos, self.norm_offsets),
            )

        # Tier 4 — punctuation-insensitive.
        f_quote = fuzzy_normalize(quote)
        pos = self._pick(
            self.fuzzy_doc,
            self.fuzzy_offsets,
            f_quote,
            fuzzy_normalize(prefix),
            fuzzy_normalize(suffix),
        )
        if pos is not None:
            return Match(
                self._lineno_for(pos, self.fuzzy_offsets),
                "fuzzy",
                0.75,
                self._snippet(pos, self.fuzzy_offsets),
            )

        # Tier 5 — sliding-window similarity. Only accepted above 0.72, and
        # always reported as approximate so nobody edits on faith.
        return self._similar(f_quote)

    def _snippet(self, offset: int, offsets: list[tuple[int, int]]) -> str:
        lineno = self._lineno_for(offset, offsets)
        return self.lines[lineno - 1].strip()

    def _similar(self, f_quote: str) -> Match | None:
        if len(f_quote) < 12:
            return None
        window = len(f_quote)
        best_ratio, best_pos = 0.0, -1
        step = max(1, window // 4)
        for start in range(0, max(1, len(self.fuzzy_doc) - window), step):
            candidate = self.fuzzy_doc[start : start + window]
            ratio = difflib.SequenceMatcher(None, f_quote, candidate).ratio()
            if ratio > best_ratio:
                best_ratio, best_pos = ratio, start
        if best_ratio < 0.72 or best_pos < 0:
            return None
        lineno = self._lineno_for(best_pos, self.fuzzy_offsets)
        return Match(lineno, "approx", best_ratio, self.lines[lineno - 1].strip())


# ---------------------------------------------------------- annotation helpers
def annotation_intent(ann: dict) -> str:
    """One-tap disposition. Unknown/absent values degrade to `note`."""
    raw = str(ann.get("intent") or "").strip().lower()
    return raw if raw in INTENTS else DEFAULT_INTENT


def intent_markup(intent: str) -> str:
    return f"[{INTENT_STYLE.get(intent, 'dim')}]{esc(intent)}[/]"


def annotation_version(ann: dict, batch: dict) -> dict:
    """What the page looked like when this note was written.

    Newer clients attach a per-annotation `version` block; older batches have
    only the batch-level `url`/`created`. Merge both so `show`/`locate` always
    have *something* to print, and never claim a marker the payload lacks.
    """
    version = dict(ann.get("version") or {})
    version.setdefault("url", ann.get("url") or batch.get("url") or "")
    version.setdefault("capturedAt", ann.get("ts") or batch.get("created") or "")
    return version


def version_line(version: dict) -> str:
    bits = []
    if version.get("lastModified"):
        bits.append(f"site build {esc(str(version['lastModified']))}")
    if version.get("contentDigest"):
        bits.append(f"content {esc(str(version['contentDigest']))}")
    if version.get("contentLength"):
        bits.append(f"{esc(str(version['contentLength']))} chars")
    if not bits:
        # Be explicit rather than silently implying we know the page version.
        return "no page-version marker recorded (pre-version client)"
    return " · ".join(bits)


def batch_source_url(batch: dict) -> str:
    url = batch.get("url") or ""
    if url:
        return url
    permalink = batch.get("permalink") or ""
    return f"https://idvork.in{permalink}" if permalink else ""


def print_batch_header(batch: dict, annotations: list[dict]) -> None:
    console.print(
        f"[bold]{esc(batch.get('title') or '(untitled)')}[/bold]  "
        f"[green]{esc(str(batch.get('permalink') or ''))}[/green]"
    )
    url = batch_source_url(batch)
    if url:
        console.print(f"[bold]source url:[/bold] [blue underline]{esc(url)}[/]")
    console.print(
        f"[dim]captured {esc(str(batch.get('created', '?')))} — "
        f"{len(annotations)} notes[/dim]"
    )
    version = batch.get("version") or {}
    if version:
        console.print(f"[dim]page version: {version_line(version)}[/dim]")
    console.print()


# -------------------------------------------------------------------- commands
@app.command("list")
def list_reviews(
    limit: int = typer.Option(100, help="Max gists to scan."),
) -> None:
    """List secret gists holding annotation batches."""
    gists = fetch_gist_list(limit)
    if not gists:
        console.print(
            f"[yellow]No gists with a '{DESCRIPTION_PREFIX}' description.[/yellow]"
        )
        return

    table = Table(title=f"Blog review gists ({len(gists)})", show_lines=False)
    table.add_column("gist id", style="cyan", no_wrap=True)
    table.add_column("permalink", style="green")
    table.add_column("notes", justify="right")
    table.add_column("updated", style="dim")
    table.add_column("vis")

    for gist in gists:
        permalink = (
            (gist.get("description") or "").split(DESCRIPTION_PREFIX, 1)[1].strip()
        )
        entry = (gist.get("files") or {}).get(REVIEW_FILENAME) or {}
        table.add_row(
            esc(str(gist.get("id", "?"))),
            esc(permalink) or "(unknown)",
            esc(str(entry.get("size", "?"))) + "b",
            esc((gist.get("updated_at") or "")[:19].replace("T", " ")),
            "public" if gist.get("public") else "secret",
        )
    console.print(table)


@app.command()
def show(
    source: str = typer.Argument(..., help="Gist id/url, or a local JSON file."),
) -> None:
    """Pretty-print one annotation batch."""
    batch = load_batch(source)
    annotations = batch.get("annotations") or []
    print_batch_header(batch, annotations)

    for i, ann in enumerate(annotations, start=1):
        intent = annotation_intent(ann)
        console.print(
            f"[bold cyan]{i}.[/bold cyan] {intent_markup(intent)}  "
            f"[italic]{esc(ann.get('quote', ''))}[/italic]"
        )
        console.print(f"   [white]{esc(ann.get('comment') or '(no comment)')}[/white]")
        ctx_prefix = (ann.get("prefix") or "").replace("\n", " ")
        ctx_suffix = (ann.get("suffix") or "").replace("\n", " ")
        console.print(f"   [dim]…{esc(ctx_prefix)} ⟦quote⟧ {esc(ctx_suffix)}…[/dim]")
        version = annotation_version(ann, batch)
        console.print(
            f"   [dim]{esc(str(ann.get('ts', '')))} · {version_line(version)}[/dim]"
        )
        if version.get("url"):
            console.print(f"   [dim]{esc(str(version['url']))}[/dim]")
        console.print()


@app.command()
def locate(
    source: str = typer.Argument(..., help="Gist id/url, or a local JSON file."),
    json_out: bool = typer.Option(False, "--json", help="Emit machine-readable JSON."),
) -> None:
    """Resolve each annotation to a `file:line` in the markdown source.

    Never guesses silently: anything that cannot be pinned is listed under
    UNLOCATED, and approximate matches are labeled as such.
    """
    batch = load_batch(source)
    annotations = batch.get("annotations") or []
    index = PermalinkIndex()
    branch = current_branch()

    results = []
    for ann in annotations:
        permalink = ann.get("permalink") or batch.get("permalink") or ""
        intent = annotation_intent(ann)
        version = annotation_version(ann, batch)
        resolution = index.resolve(permalink)
        if resolution.path is None:
            results.append(
                {
                    "ok": False,
                    "kind": "unresolved-permalink",
                    "permalink": permalink,
                    "reason": resolution.reason,
                    "searched": index.dirs_searched,
                    "indexed": index.describe(),
                    "branch": branch,
                    "suggestions": resolution.suggestions,
                    "intent": intent,
                    "version": version,
                    "annotation": ann,
                }
            )
            continue
        path = resolution.path
        match = Locator.for_path(path).locate(ann)
        stale = staleness(path, ann.get("ts") or batch.get("created"))
        if match is None:
            results.append(
                {
                    "ok": False,
                    "kind": "quote-not-found",
                    "permalink": permalink,
                    "reason": "quote not found in source",
                    "file": str(path.relative_to(REPO_ROOT)),
                    "resolved_via": resolution.how,
                    "branch": branch,
                    "intent": intent,
                    "version": version,
                    "staleness": stale,
                    "annotation": ann,
                }
            )
            continue
        results.append(
            {
                "ok": True,
                "permalink": permalink,
                "file": str(path.relative_to(REPO_ROOT)),
                "line": match.line,
                "method": match.method,
                "score": round(match.score, 3),
                "source_line": match.text,
                "resolved_via": resolution.how,
                "intent": intent,
                "version": version,
                "staleness": stale,
                "annotation": ann,
            }
        )

    if json_out:
        print(
            json.dumps(
                {
                    "batch": batch.get("permalink"),
                    "url": batch_source_url(batch),
                    "branch": branch,
                    "version": batch.get("version") or {},
                    "results": results,
                },
                indent=2,
            )
        )
        raise typer.Exit(0 if all(r["ok"] for r in results) else 2)

    print_batch_header(batch, annotations)

    located = [r for r in results if r["ok"]]
    missing = [r for r in results if not r["ok"]]

    if located:
        table = Table(title=f"Located {len(located)}/{len(results)}", show_lines=True)
        table.add_column("#", justify="right", style="dim")
        table.add_column("file:line", style="cyan", no_wrap=True)
        table.add_column("intent", no_wrap=True)
        table.add_column("how", no_wrap=True)
        table.add_column("comment", style="white")
        table.add_column("source line", style="dim")
        for i, r in enumerate(located, start=1):
            how = esc(r["method"])
            if r["method"] in ("fuzzy", "approx"):
                how = f"[yellow]{how} {r['score']}[/yellow]"
            table.add_row(
                str(i),
                esc(f"{r['file']}:{r['line']}"),
                intent_markup(r["intent"]),
                how,
                esc(r["annotation"].get("comment") or "(no comment)"),
                esc(r["source_line"][:120]),
            )
        console.print(table)

        vias = sorted({r["resolved_via"] for r in located})
        console.print(f"[dim]resolved via: {esc(', '.join(vias))}[/dim]")

        drifted = [r for r in located if r["staleness"]["stale"]]
        dirty = [r for r in located if r["staleness"]["dirty"]]
        if drifted:
            console.print(
                f"[yellow]⚠ {len(drifted)} note(s) predate the source file's last "
                f"commit — anchors may have drifted:[/yellow]"
            )
            for r in drifted:
                console.print(
                    f"    [yellow]•[/yellow] {esc(r['file'])} committed "
                    f"{esc(str(r['staleness']['file_last_commit']))} > annotated "
                    f"{esc(str(r['annotation'].get('ts', '?')))}"
                )
        if dirty:
            files = sorted({r["file"] for r in dirty})
            console.print(
                f"[yellow]⚠ uncommitted local changes in {esc(', '.join(files))} — "
                f"line numbers reflect the working tree, not any published build."
                f"[/yellow]"
            )

    if missing:
        console.print(
            f"\n[red bold]UNLOCATED ({len(missing)})[/red bold] — do not guess:"
        )
        for r in missing:
            ann = r["annotation"]
            console.print(f"  [red]•[/red] {esc(r['reason'])}")
            if r["kind"] == "unresolved-permalink":
                console.print(
                    f"    searched : {esc(', '.join(r['searched']))} "
                    f"({esc(r['indexed'])})"
                )
                console.print(f"    branch   : {esc(r['branch'])}")
                if r["suggestions"]:
                    console.print(f"    nearest  : {esc(', '.join(r['suggestions']))}")
                console.print(
                    "    [dim]No post on this checkout claims that permalink. The "
                    "post may live on an unmerged branch — fetch it, check it out, "
                    "and re-run.[/dim]"
                )
            else:
                console.print(f"    file     : {esc(r['file'])}")
                if r.get("staleness", {}).get("stale"):
                    console.print(
                        "    [yellow]the file was committed after this note was "
                        "written — the quoted text was probably edited away.[/yellow]"
                    )
            console.print(f"    intent   : {intent_markup(r['intent'])}")
            console.print(
                f"    quote    : [italic]{esc((ann.get('quote') or '')[:160])}[/italic]"
            )
            console.print(f"    note     : {esc(ann.get('comment') or '(no comment)')}")
        raise typer.Exit(2)

    if not results:
        console.print("[yellow]Batch contains no annotations.[/yellow]")


if __name__ == "__main__":
    if not (REPO_ROOT / "_config.yml").exists():
        console.print(
            f"[red]Expected a Jekyll repo root at {esc(str(REPO_ROOT))} "
            f"(no _config.yml).[/red]"
        )
        sys.exit(1)
    app()

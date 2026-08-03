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
"""

from __future__ import annotations

import difflib
import json
import re
import subprocess
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import typer
from rich.console import Console
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
        console.print(f"[red]gh {' '.join(args)} failed:[/red] {proc.stderr.strip()}")
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
                f"[red]Gist {gist_id} has no {REVIEW_FILENAME}[/red] "
                f"(files: {', '.join(files) or 'none'})"
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
def permalink_index() -> dict[str, Path]:
    """Map normalized permalink -> source markdown file."""
    index: dict[str, Path] = {}
    for directory in CONTENT_DIRS:
        base = REPO_ROOT / directory
        if not base.is_dir():
            continue
        for path in sorted(base.glob("*.md")):
            permalink = _frontmatter_permalink(path)
            if permalink:
                index.setdefault(_norm_permalink(permalink), path)
    return index


def _frontmatter_permalink(path: Path) -> str | None:
    try:
        text = path.read_text(errors="replace")
    except OSError:
        return None
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    front = text[3 : end if end != -1 else 4000]
    match = re.search(r"^permalink:\s*(.+?)\s*$", front, re.MULTILINE)
    if not match:
        return None
    return match.group(1).strip().strip("\"'")


def _norm_permalink(value: str) -> str:
    return "/" + value.strip().strip("/").lower()


def resolve_permalink(permalink: str, index: dict[str, Path]) -> Path | None:
    key = _norm_permalink(permalink or "")
    if key in index:
        return index[key]
    # /some-post/index.html, /some-post.html, trailing-slash variants
    trimmed = re.sub(r"(?:/index)?\.html?$", "", key)
    return index.get(trimmed)


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
            gist.get("id", "?"),
            permalink or "(unknown)",
            str(entry.get("size", "?")) + "b",
            (gist.get("updated_at") or "")[:19].replace("T", " "),
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
    console.print(
        f"[bold]{batch.get('title') or '(untitled)'}[/bold]  "
        f"[green]{batch.get('permalink')}[/green]"
    )
    if batch.get("url"):
        console.print(f"[dim]{batch['url']}[/dim]")
    console.print(
        f"[dim]captured {batch.get('created', '?')} — {len(annotations)} notes[/dim]\n"
    )

    for i, ann in enumerate(annotations, start=1):
        console.print(
            f"[bold cyan]{i}.[/bold cyan] [italic]{ann.get('quote', '')}[/italic]"
        )
        console.print(f"   [white]{ann.get('comment') or '(no comment)'}[/white]")
        ctx_prefix = (ann.get("prefix") or "").replace("\n", " ")
        ctx_suffix = (ann.get("suffix") or "").replace("\n", " ")
        console.print(f"   [dim]…{ctx_prefix} ⟦quote⟧ {ctx_suffix}…[/dim]")
        console.print(f"   [dim]{ann.get('ts', '')}[/dim]\n")


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
    index = permalink_index()

    results = []
    for ann in annotations:
        permalink = ann.get("permalink") or batch.get("permalink") or ""
        path = resolve_permalink(permalink, index)
        if path is None:
            results.append(
                {
                    "ok": False,
                    "reason": f"no source file for permalink {permalink!r}",
                    "annotation": ann,
                }
            )
            continue
        match = Locator(path).locate(ann)
        if match is None:
            results.append(
                {
                    "ok": False,
                    "reason": "quote not found in source",
                    "file": str(path.relative_to(REPO_ROOT)),
                    "annotation": ann,
                }
            )
            continue
        results.append(
            {
                "ok": True,
                "file": str(path.relative_to(REPO_ROOT)),
                "line": match.line,
                "method": match.method,
                "score": round(match.score, 3),
                "source_line": match.text,
                "annotation": ann,
            }
        )

    if json_out:
        print(
            json.dumps({"batch": batch.get("permalink"), "results": results}, indent=2)
        )
        raise typer.Exit(0 if all(r["ok"] for r in results) else 2)

    located = [r for r in results if r["ok"]]
    missing = [r for r in results if not r["ok"]]

    if located:
        table = Table(title=f"Located {len(located)}/{len(results)}", show_lines=True)
        table.add_column("#", justify="right", style="dim")
        table.add_column("file:line", style="cyan", no_wrap=True)
        table.add_column("how", no_wrap=True)
        table.add_column("comment", style="white")
        table.add_column("source line", style="dim")
        for i, r in enumerate(located, start=1):
            how = r["method"]
            if how in ("fuzzy", "approx"):
                how = f"[yellow]{how} {r['score']}[/yellow]"
            table.add_row(
                str(i),
                f"{r['file']}:{r['line']}",
                how,
                r["annotation"].get("comment") or "(no comment)",
                r["source_line"][:120],
            )
        console.print(table)

    if missing:
        console.print(
            f"\n[red bold]UNLOCATED ({len(missing)})[/red bold] — do not guess:"
        )
        for r in missing:
            ann = r["annotation"]
            console.print(f"  [red]•[/red] {r['reason']}")
            console.print(
                f"    quote: [italic]{(ann.get('quote') or '')[:160]}[/italic]"
            )
            console.print(f"    note : {ann.get('comment') or '(no comment)'}")
        raise typer.Exit(2)

    if not results:
        console.print("[yellow]Batch contains no annotations.[/yellow]")


if __name__ == "__main__":
    if not (REPO_ROOT / "_config.yml").exists():
        console.print(
            f"[red]Expected a Jekyll repo root at {REPO_ROOT} (no _config.yml).[/red]"
        )
        sys.exit(1)
    app()

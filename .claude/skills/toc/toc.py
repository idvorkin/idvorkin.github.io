#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "typer",
#   "rich",
# ]
# ///
"""Regenerate, validate, or compute kramdown slugs for markdown TOCs.

Matches `idvorkin/markdown-toc.nvim`'s `:Mtoc update` byte-for-byte — same
GFM-style slug algorithm, same fence markers. Either this tool or the nvim
plugin can edit any blog post's TOC.

Exit codes:
  0   no change / validation passed
  1   TOC was updated / validation failed
  2   file has no fence markers or other error
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console

TOC_START = "<!-- vim-markdown-toc-start -->"
TOC_END = "<!-- vim-markdown-toc-end -->"

stderr = Console(stderr=True)
stdout = Console()

app = typer.Typer(
    help="Regenerate, validate, or compute kramdown slugs for markdown TOCs.",
    add_completion=False,
    no_args_is_help=True,
)


def slugify(heading_text: str, seen: dict[str, int] | None = None) -> str:
    """GFM-style slug matching `idvorkin/markdown-toc.nvim` (`:Mtoc update`).

    Algorithm ported from `lua/mtoc/toc.lua` (`link_formatters.gfm`). Note:
    this is GFM-style, NOT kramdown. For the English-heading cases Igor's
    blog uses, kramdown produces the same slugs at render time, so the
    TOC links remain valid. Divergence risk is in headings with leading
    digits or underscores (rare on this blog).

    Steps:
      1. Strip inline `[text](url)` links → `text`. Emphasis markers
         (`*`, `` ` ``) are NOT special-cased — they get dropped by the
         char whitelist in step 4. Underscores are kept.
      2. Lowercase.
      3. Strip leading AND trailing `_+`.
      4. Char whitelist: `[a-z0-9 _-]` plus Latin-Ext, Cyrillic, CJK,
         Hiragana, Katakana, Hangul. Everything else is removed.
      5. Spaces → hyphens.
      6. Optional duplicate disambiguation: if `seen` is provided and this
         slug has been seen, append `-N` where N starts at 1 for the
         second occurrence. Pass the same `seen` dict across all calls
         in one TOC render.

    Pass `seen=None` (default) for one-shot CLI `slug` invocations.
    Pass a dict when rendering a full TOC so duplicates get suffixed the
    same way kramdown does when rendering the HTML.
    """
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", heading_text)
    text = text.lower()
    text = re.sub(r"^_+", "", text)
    text = re.sub(r"_+$", "", text)
    # Char whitelist — alnum + space + underscore + hyphen + common non-ASCII alpha
    text = re.sub(
        r"[^a-z0-9 _\-\u00C0-\u00FF\u0400-\u04FF\u4E00-\u9FBF\u3040-\u309F"
        r"\u30A0-\u30FF\uAC00-\uD7AF]",
        "",
        text,
    )
    text = text.replace(" ", "-")

    if seen is None:
        return text

    key = text if text else "<NULL>"
    if key in seen:
        seen[key] += 1
        return f"{text}-{seen[key]}"
    seen[key] = 0
    return text


def parse_headings(text: str, min_level: int, max_level: int) -> list[tuple[int, str]]:
    """Return [(level, text), ...] for ATX headings in range, skipping fenced code.

    Headings inside ``` or ~~~ fences are ignored — that's how the example blocks
    inside SKILL.md don't pollute the changelog TOC.
    """
    in_fence = False
    fence_char = ""
    headings: list[tuple[int, str]] = []
    for line in text.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            new_char = stripped[:3]
            if not in_fence:
                in_fence = True
                fence_char = new_char
            elif new_char == fence_char:
                in_fence = False
                fence_char = ""
            continue
        if in_fence:
            continue
        match = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if not match:
            continue
        level = len(match.group(1))
        if min_level <= level <= max_level:
            headings.append((level, match.group(2)))
    if in_fence:
        stderr.print(
            f"[yellow]WARN[/] toc: unterminated `{fence_char}` fence — TOC may be "
            f"incomplete if the closing fence is missing in the document."
        )
    return headings


def render_toc(headings: list[tuple[int, str]]) -> str:
    """Render a nested markdown list matching the neovim plugin's output.

    Tracks a `seen` dict so duplicate slugs get `-N` suffixed, same as
    `link_formatters.gfm` in mtoc.
    """
    if not headings:
        return ""
    top_level = min(level for level, _ in headings)
    seen: dict[str, int] = {}
    lines: list[str] = []
    for level, text in headings:
        indent = "  " * (level - top_level)
        lines.append(f"{indent}- [{text}](#{slugify(text, seen)})")
    return "\n".join(lines)


def regenerate_toc(
    file_path: Path, min_level: int, max_level: int, dry_run: bool = False
) -> int:
    """Replace fenced TOC block with a freshly-generated one.

    Returns:
      0 — no change (file already in sync)
      1 — TOC was updated (or would be, in dry-run)
    Raises:
      ValueError — fence markers missing
    """
    text = file_path.read_text(encoding="utf-8")
    headings = parse_headings(text, min_level, max_level)
    new_toc = render_toc(headings)

    pattern = re.compile(
        rf"({re.escape(TOC_START)}\n).*?(\n{re.escape(TOC_END)})",
        re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        raise ValueError(
            f"No {TOC_START} / {TOC_END} fence markers found in {file_path}"
        )

    new_body = f"\n{new_toc}\n" if new_toc else "\n"
    replacement = match.group(1) + new_body + match.group(2)
    new_text = text[: match.start()] + replacement + text[match.end() :]

    if new_text == text:
        return 0
    if not dry_run:
        file_path.write_text(new_text, encoding="utf-8")
    return 1


def find_duplicate_headings(file_path: Path, level: int) -> list[tuple[str, int]]:
    """Return [(heading_text, count), ...] for ### headings (at given level) that repeat."""
    text = file_path.read_text(encoding="utf-8")
    headings = parse_headings(text, level, level)
    counts: dict[str, int] = {}
    for _, heading_text in headings:
        counts[heading_text] = counts.get(heading_text, 0) + 1
    return sorted((k, v) for k, v in counts.items() if v > 1)


@app.command(help="Rewrite the TOC block in a markdown file")
def regenerate(
    file: Annotated[Path, typer.Argument(help="Markdown file to update")],
    min_level: Annotated[int, typer.Option("--min", help="Minimum heading level")] = 2,
    max_level: Annotated[int, typer.Option("--max", help="Maximum heading level")] = 3,
    dry_run: Annotated[
        bool, typer.Option("--dry-run", help="Preview without writing")
    ] = False,
) -> None:
    """Exit 0 if already in sync, 1 if updated, 2 if fence markers missing."""
    try:
        changed = regenerate_toc(file, min_level, max_level, dry_run)
    except ValueError as exc:
        stderr.print(f"[red]Error:[/] {exc}")
        raise typer.Exit(code=2)
    if changed:
        stdout.print(
            f"{'Would update' if dry_run else 'Updated'} TOC in [cyan]{file}[/]"
        )
        raise typer.Exit(code=1)
    stdout.print(f"TOC in [cyan]{file}[/] already in sync")


@app.command(
    help="Fail if any heading text at the given level repeats (broken anchors)"
)
def validate(
    file: Annotated[Path, typer.Argument(help="Markdown file to check")],
    level: Annotated[int, typer.Option("--level", help="Heading level to check")] = 3,
) -> None:
    """Exit 0 if clean, 1 if duplicates found."""
    duplicates = find_duplicate_headings(file, level)
    if not duplicates:
        stdout.print(
            f"[green]OK[/] — no duplicate H{level} headings in [cyan]{file}[/]"
        )
        return
    stderr.print(f"[red]FAIL[/] — duplicate H{level} headings in [cyan]{file}[/]:")
    for text, count in duplicates:
        stderr.print(f"  [yellow]{count}×[/] '{text}'")
    raise typer.Exit(code=1)


@app.command(help="Print the GFM/mtoc slug for a heading (single-shot, no dedup)")
def slug(
    text: Annotated[str, typer.Argument(help="Heading text to slugify")],
) -> None:
    """Print to stdout. Use `regenerate` for dedup-aware slugs in a full TOC."""
    print(slugify(text))


if __name__ == "__main__":
    app()

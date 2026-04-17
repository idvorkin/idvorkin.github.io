#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# ///
"""Regenerate, validate, or test markdown TOCs — same rules as idvorkin/markdown-toc.nvim.

Fence markers and kramdown slugification match the `:Mtoc update` command so
this tool and the neovim plugin produce byte-identical output against the
same input. Either one can regenerate a TOC; both can edit any blog post.

Commands:

  toc.py regenerate <file>                    # rewrite TOC between fence markers
  toc.py regenerate <file> --min 2 --max 3    # restrict heading levels (default 2..3)
  toc.py regenerate <file> --dry-run          # print what would change, don't write
  toc.py validate <file>                      # fail if any ### heading text repeats
  toc.py validate <file> --level 2            # validate a different heading level
  toc.py slug "Some Heading Text"             # print the kramdown slug, one-shot

Exit codes:
  0   no change / validation passed
  1   TOC was updated / validation failed
  2   file has no fence markers or other error

Stdlib-only. Cross-platform. Safe to run over any markdown file in this repo.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

TOC_START = "<!-- vim-markdown-toc-start -->"
TOC_END = "<!-- vim-markdown-toc-end -->"


def slugify(heading_text: str) -> str:
    """Kramdown-compatible slug. Matches `:Mtoc update` + kramdown-rouge defaults.

    Algorithm (from kramdown source, `Kramdown::Converter::Base#generate_id`):
      1. Strip inline markdown (link syntax, emphasis markers, inline code).
      2. Drop leading non-alphabetic chars.
      3. Keep only [a-zA-Z0-9 space hyphen] — this is where em-dash, punctuation,
         currency, colons etc. get removed. Em-dash flanked by spaces becomes a
         double-hyphen after step 4.
      4. Replace spaces with hyphens.
      5. Lowercase.

    Consecutive hyphens are preserved (this is how "AI & Machine" becomes
    "ai--machine" — the `&` drops, leaving two spaces, which become two hyphens).
    """
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", heading_text)  # [t](url) → t
    text = re.sub(r"[*_`]", "", text)  # drop emphasis / inline-code markers
    text = re.sub(r"^[^a-zA-Z]+", "", text)  # drop leading non-alpha
    text = re.sub(r"[^a-zA-Z0-9 \-]", "", text)  # keep only alnum + space + hyphen
    text = text.replace(" ", "-")
    return text.lower()


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
    return headings


def render_toc(headings: list[tuple[int, str]]) -> str:
    """Render a nested markdown list matching the neovim plugin's output."""
    if not headings:
        return ""
    top_level = min(level for level, _ in headings)
    lines: list[str] = []
    for level, text in headings:
        indent = "  " * (level - top_level)
        lines.append(f"{indent}- [{text}](#{slugify(text)})")
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
    text = file_path.read_text()
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
        file_path.write_text(new_text)
    return 1


def find_duplicate_headings(file_path: Path, level: int) -> list[tuple[str, int]]:
    """Return [(heading_text, count), ...] for ### headings (at given level) that repeat."""
    text = file_path.read_text()
    headings = parse_headings(text, level, level)
    counts: dict[str, int] = {}
    for _, heading_text in headings:
        counts[heading_text] = counts.get(heading_text, 0) + 1
    return sorted((k, v) for k, v in counts.items() if v > 1)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_regen = sub.add_parser("regenerate", help="Rewrite the TOC in a markdown file")
    p_regen.add_argument("file", type=Path)
    p_regen.add_argument(
        "--min", type=int, default=2, help="Minimum heading level (default 2)"
    )
    p_regen.add_argument(
        "--max", type=int, default=3, help="Maximum heading level (default 3)"
    )
    p_regen.add_argument("--dry-run", action="store_true")

    p_val = sub.add_parser("validate", help="Check for duplicate headings at a level")
    p_val.add_argument("file", type=Path)
    p_val.add_argument(
        "--level", type=int, default=3, help="Heading level to check (default 3)"
    )

    p_slug = sub.add_parser("slug", help="Print the kramdown slug for a heading")
    p_slug.add_argument("text")

    args = parser.parse_args()

    if args.cmd == "slug":
        print(slugify(args.text))
        return 0

    if args.cmd == "validate":
        duplicates = find_duplicate_headings(args.file, args.level)
        if not duplicates:
            print(f"OK — no duplicate H{args.level} headings in {args.file}")
            return 0
        print(
            f"FAIL — duplicate H{args.level} headings in {args.file}:", file=sys.stderr
        )
        for text, count in duplicates:
            print(f"  {count}× '{text}'", file=sys.stderr)
        return 1

    # regenerate
    try:
        changed = regenerate_toc(args.file, args.min, args.max, args.dry_run)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    if changed:
        print(f"{'Would update' if args.dry_run else 'Updated'} TOC in {args.file}")
        return 1
    print(f"TOC in {args.file} already in sync")
    return 0


if __name__ == "__main__":
    sys.exit(main())

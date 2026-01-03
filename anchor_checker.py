#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "typer[all]",
#   "rich",
# ]
# ///
"""
Anchor Link Checker for Jekyll Blog

Detects two types of broken internal links:
1. Broken page links: /nonexistent-page
2. Broken anchor links: /existing-page#nonexistent-anchor

Usage:
    ./anchor_checker.py                    # Check all markdown files
    ./anchor_checker.py --verbose          # Show all links checked
    ./anchor_checker.py _d/specific.md     # Check specific file(s)
"""

import json
import re
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table

app = typer.Typer(help="Check for broken anchor links in markdown files")
console = Console()

# Compile regex patterns once at module load
# Matches [text](/path#anchor) - internal link with anchor
INTERNAL_ANCHOR_LINK_RE = re.compile(r"\]\((/[^)#\s]+)#([^)\s]+)\)")
# Matches [text](#anchor) - same-page anchor
SAME_PAGE_ANCHOR_RE = re.compile(r"\]\(#([^)\s]+)\)")
# Matches [text](/path) - internal link without anchor (for page validation)
INTERNAL_LINK_RE = re.compile(r"\]\((/[^)#\s]+)\)")
# Fast regex to extract all id attributes from HTML
HTML_ID_RE = re.compile(r'id="([^"]+)"')


@dataclass
class BrokenLink:
    source_file: str
    line_number: int
    link: str
    target_page: str
    anchor: Optional[str]
    error_type: str  # "page" or "anchor"

    def __str__(self) -> str:
        if self.anchor:
            return f"{self.source_file}:{self.line_number} -> {self.target_page}#{self.anchor}"
        return f"{self.source_file}:{self.line_number} -> {self.target_page}"


@dataclass
class CheckStats:
    files_checked: int = 0
    links_checked: int = 0
    broken_pages: int = 0
    broken_anchors: int = 0
    broken_links: list[BrokenLink] = field(default_factory=list)
    missing_html_files: set[str] = field(default_factory=set)


class AnchorChecker:
    def __init__(self, site_dir: Path, backlinks_path: Path):
        self.site_dir = site_dir
        self.backlinks_path = backlinks_path
        self._valid_urls: set[str] = set()
        self._redirects: dict[str, str] = {}
        self._missing_html: set[str] = set()  # Track pages with missing HTML
        self._load_backlinks()

    def _load_backlinks(self) -> None:
        """Load valid URLs and redirects from back-links.json."""
        if not self.backlinks_path.exists():
            console.print(
                f"[red]Error:[/] {self.backlinks_path} not found. Run build_back_links.py first."
            )
            raise typer.Exit(1)

        with open(self.backlinks_path) as f:
            data = json.load(f)

        # Load redirects
        self._redirects = data.get("redirects", {})

        # Load valid URLs from url_info
        url_info = data.get("url_info", {})
        self._valid_urls = set(url_info.keys())

        # Also add redirect sources as "valid" (they resolve to real pages)
        self._valid_urls.update(self._redirects.keys())

    def is_valid_page(self, url: str) -> bool:
        """Check if a URL points to a valid page."""
        return url in self._valid_urls

    def resolve_redirect(self, url: str) -> str:
        """Resolve a URL through redirects to its final destination."""
        seen = set()
        while url in self._redirects and url not in seen:
            seen.add(url)
            url = self._redirects[url]
        return url

    @lru_cache(maxsize=512)
    def get_anchors_for_page(self, url: str) -> set[str]:
        """
        Get all valid anchor IDs for a page.
        Uses regex for speed instead of full DOM parsing.
        """
        # Resolve redirects first
        resolved_url = self.resolve_redirect(url)

        # Convert URL to HTML file path
        # /foo -> _site/foo.html
        # /d/bar -> _site/d/bar.html
        if resolved_url == "/":
            html_path = self.site_dir / "index.html"
        else:
            html_path = self.site_dir / f"{resolved_url.lstrip('/')}.html"

        if not html_path.exists():
            # Try index.html in directory
            dir_path = self.site_dir / resolved_url.lstrip("/") / "index.html"
            if dir_path.exists():
                html_path = dir_path
            else:
                self._missing_html.add(url)
                return set()

        # Fast regex extraction of all id attributes
        try:
            content = html_path.read_text(encoding="utf-8")
            return set(HTML_ID_RE.findall(content))
        except Exception:
            return set()

    def get_anchors_for_markdown(self, md_path: Path) -> set[str]:
        """
        Get anchors for a markdown file by finding its corresponding HTML.
        Used for same-page anchor validation.
        """
        # Convert absolute path to relative path matching backlinks format
        try:
            relative_path = md_path.relative_to(Path.cwd())
        except ValueError:
            relative_path = md_path

        md_path_str = str(relative_path)

        # Look up in cached url_info (load once)
        if not hasattr(self, "_md_to_url"):
            self._md_to_url: dict[str, str] = {}
            with open(self.backlinks_path) as f:
                data = json.load(f)
            for url, info in data.get("url_info", {}).items():
                if info.get("markdown_path"):
                    self._md_to_url[info["markdown_path"]] = url

        if md_path_str in self._md_to_url:
            return self.get_anchors_for_page(self._md_to_url[md_path_str])

        # Fallback: try to derive URL from path
        # _d/foo.md -> /foo (common pattern)
        if md_path.parent.name == "_d":
            guessed_url = f"/{md_path.stem}"
            if guessed_url in self._valid_urls:
                return self.get_anchors_for_page(guessed_url)

        # Final fallback: read permalink from frontmatter and check HTML directly
        return self._get_anchors_from_frontmatter(md_path)

    def _get_anchors_from_frontmatter(self, md_path: Path) -> set[str]:
        """
        Extract permalink from markdown frontmatter and get anchors from HTML.
        Used as fallback for pages not in backlinks.
        """
        try:
            content = md_path.read_text(encoding="utf-8")
            # Simple frontmatter parsing - look for permalink
            if not content.startswith("---"):
                return set()

            end = content.find("---", 3)
            if end == -1:
                return set()

            frontmatter = content[3:end]
            for line in frontmatter.splitlines():
                if line.startswith("permalink:"):
                    permalink = line.split(":", 1)[1].strip().strip('"').strip("'")
                    # Direct HTML lookup (bypass backlinks cache)
                    html_path = self.site_dir / f"{permalink.lstrip('/')}.html"
                    if html_path.exists():
                        html_content = html_path.read_text(encoding="utf-8")
                        return set(HTML_ID_RE.findall(html_content))
            return set()
        except Exception:
            return set()

    def check_file(self, md_path: Path, stats: CheckStats, verbose: bool = False) -> None:
        """Check a single markdown file for broken links."""
        try:
            content = md_path.read_text(encoding="utf-8")
        except Exception as e:
            console.print(f"[yellow]Warning:[/] Could not read {md_path}: {e}")
            return

        lines = content.splitlines()
        stats.files_checked += 1

        for line_num, line in enumerate(lines, start=1):
            # Check internal links with anchors: [text](/page#anchor)
            for match in INTERNAL_ANCHOR_LINK_RE.finditer(line):
                target_page = match.group(1)
                anchor = match.group(2)
                stats.links_checked += 1

                if verbose:
                    console.print(f"  [dim]{md_path}:{line_num}[/] -> {target_page}#{anchor}")

                # First check if page exists
                if not self.is_valid_page(target_page):
                    stats.broken_pages += 1
                    stats.broken_links.append(
                        BrokenLink(
                            source_file=str(md_path),
                            line_number=line_num,
                            link=f"{target_page}#{anchor}",
                            target_page=target_page,
                            anchor=anchor,
                            error_type="page",
                        )
                    )
                    continue

                # Page exists, check anchor
                valid_anchors = self.get_anchors_for_page(target_page)
                if anchor not in valid_anchors:
                    stats.broken_anchors += 1
                    stats.broken_links.append(
                        BrokenLink(
                            source_file=str(md_path),
                            line_number=line_num,
                            link=f"{target_page}#{anchor}",
                            target_page=target_page,
                            anchor=anchor,
                            error_type="anchor",
                        )
                    )

            # Check same-page anchors: [text](#anchor)
            for match in SAME_PAGE_ANCHOR_RE.finditer(line):
                anchor = match.group(1)
                stats.links_checked += 1

                if verbose:
                    console.print(f"  [dim]{md_path}:{line_num}[/] -> #{anchor}")

                valid_anchors = self.get_anchors_for_markdown(md_path)
                if anchor not in valid_anchors:
                    stats.broken_anchors += 1
                    stats.broken_links.append(
                        BrokenLink(
                            source_file=str(md_path),
                            line_number=line_num,
                            link=f"#{anchor}",
                            target_page="(same page)",
                            anchor=anchor,
                            error_type="anchor",
                        )
                    )


def find_markdown_files(base_dir: Path) -> list[Path]:
    """Find all markdown files in the blog content directories."""
    md_files = []
    # Main content directories
    for pattern in ["_d/*.md", "_posts/*.md", "_td/*.md"]:
        md_files.extend(base_dir.glob(pattern))
    return sorted(md_files)


@app.command()
def check(
    files: Optional[list[Path]] = typer.Argument(
        None, help="Specific markdown files to check (default: all in _d/, _posts/, _td/)"
    ),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Show all links being checked"),
    simple: bool = typer.Option(False, "--simple", help="Simple output format (no table)"),
    site_dir: Path = typer.Option(
        Path("_site"), "--site-dir", "-s", help="Path to Jekyll _site directory"
    ),
    backlinks: Path = typer.Option(
        Path("back-links.json"), "--backlinks", "-b", help="Path to back-links.json"
    ),
) -> None:
    """Check markdown files for broken anchor links."""
    base_dir = Path.cwd()

    # Validate _site exists
    if not site_dir.exists():
        console.print(f"[red]Error:[/] {site_dir} not found. Run 'jekyll build' first.")
        raise typer.Exit(1)

    checker = AnchorChecker(site_dir, backlinks)
    stats = CheckStats()

    # Determine which files to check
    if files:
        md_files = [f for f in files if f.exists()]
    else:
        md_files = find_markdown_files(base_dir)

    if not md_files:
        console.print("[yellow]No markdown files found to check.[/]")
        raise typer.Exit(0)

    console.print(f"Checking {len(md_files)} markdown files...")

    for md_path in md_files:
        checker.check_file(md_path, stats, verbose)

    # Print results
    console.print()

    if stats.broken_links:
        if simple:
            for bl in stats.broken_links:
                print(f"{bl.error_type.upper()}\t{bl.source_file}:{bl.line_number}\t{bl.link}")
        else:
            table = Table(title="Broken Links Found")
            table.add_column("Type", style="red")
            table.add_column("Source", style="cyan")
            table.add_column("Line", justify="right")
            table.add_column("Broken Link", style="yellow")

            for bl in stats.broken_links:
                table.add_row(
                    bl.error_type.upper(),
                    bl.source_file,
                    str(bl.line_number),
                    bl.link,
                )

            console.print(table)
        console.print()

    # Warn about stale _site (missing HTML files)
    if checker._missing_html:
        console.print(
            f"[yellow]Warning:[/] {len(checker._missing_html)} pages have no HTML in _site/ "
            "(run 'jekyll build' to update):"
        )
        for url in sorted(checker._missing_html)[:10]:
            console.print(f"  [dim]{url}[/]")
        if len(checker._missing_html) > 10:
            console.print(f"  [dim]...and {len(checker._missing_html) - 10} more[/]")
        console.print()

    # Summary
    console.print(f"[bold]Summary:[/]")
    console.print(f"  Files checked: {stats.files_checked}")
    console.print(f"  Links checked: {stats.links_checked}")

    if stats.broken_pages or stats.broken_anchors:
        console.print(f"  [red]Broken pages: {stats.broken_pages}[/]")
        console.print(f"  [red]Broken anchors: {stats.broken_anchors}[/]")
        raise typer.Exit(1)
    else:
        console.print(f"  [green]All links valid![/]")


if __name__ == "__main__":
    app()

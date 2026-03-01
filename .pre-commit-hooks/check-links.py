#!/usr/bin/env uv run
# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "typer",
#     "typing_extensions",
#     "requests",
#     "rich",
# ]
# ///

"""
Pre-commit hook to check internal links with lychee.
This script checks only the files that are being committed.
"""

import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List, Tuple
from typing_extensions import Annotated

import typer
import requests
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

app = typer.Typer(
    help="Check internal links in staged markdown files",
    add_completion=False,
    no_args_is_help=False,  # We want to run without args
)

console = Console()


def get_staged_markdown_files() -> List[str]:
    """Get list of staged markdown files."""
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
            capture_output=True,
            text=True,
            check=True,
        )

        files = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            if line.endswith(".md") or line.endswith(".markdown"):
                # Exclude specific directories
                if not line.startswith("zz-chop-logs/") and line != "back-links.json":
                    files.append(line)

        return files
    except subprocess.CalledProcessError:
        return []


def check_jekyll_server() -> bool:
    """Check if Jekyll server is running on localhost:4000."""
    try:
        response = requests.get("http://localhost:4000/", timeout=1)
        return response.status_code == 200
    except (requests.RequestException, OSError):
        return False


def check_lychee_installed() -> bool:
    """Check if lychee is available."""
    try:
        subprocess.run(["lychee", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def translate_files_to_urls(files: List[str]) -> Tuple[List[str], List[str]]:
    """
    Translate markdown file paths to their corresponding URLs using backlinks.json.
    Returns tuple of (translated_urls, files_not_in_backlinks).
    """
    translated_urls = []
    files_not_in_backlinks = []

    backlinks_path = Path("back-links.json")
    if backlinks_path.exists():
        try:
            with open(backlinks_path, "r") as f:
                data = json.load(f)

            url_info = data.get("url_info", {})

            for file in files:
                found = False
                for url, info in url_info.items():
                    if info.get("markdown_path") == file:
                        full_url = f"http://localhost:4000{url}"
                        if full_url not in translated_urls:
                            translated_urls.append(full_url)
                        found = True
                        break

                if not found:
                    files_not_in_backlinks.append(file)
                    if file not in translated_urls:
                        translated_urls.append(file)
        except Exception as e:
            console.print(f"[yellow]⚠️  Error reading backlinks.json: {e}[/yellow]")
            translated_urls = files.copy()
            files_not_in_backlinks = files.copy()
    else:
        translated_urls = files.copy()
        files_not_in_backlinks = files.copy()

    return translated_urls, files_not_in_backlinks


def run_lychee(url: str, staged_files: List[str], verbose: bool = False) -> bool:
    """
    Run lychee on a single URL.
    Returns True if all links are valid, False otherwise.
    """
    # Determine base URL
    if url.startswith("http://localhost:4000"):
        base_url = url
    else:
        base_url = "http://localhost:4000"

    if verbose:
        console.print(f"🌐 Checking {url} with base URL: {base_url}")

    # Build exclude arguments for GitHub links to staged files
    exclude_args = []

    # Exclude GitHub links to each staged file (they may not exist in main branch yet)
    for staged_file in staged_files:
        # Match any branch name in the URL (main, master, or any other branch)
        exclude_pattern = f"https://github\\.com/idvorkin/idvorkin\\.github\\.io/blob/[^/]*/{staged_file}"
        exclude_args.extend(["--exclude", exclude_pattern])

    # Also exclude GitHub line number fragments
    exclude_args.extend(["--exclude", r"https://github\.com/.*#L\d+"])

    # Build lychee command
    cmd = [
        "lychee",
        "--base-url",
        base_url,
        "--include-fragments",
        *exclude_args,
        "--format",
        "markdown",
        "--quiet",
        "--quiet",
        "--no-progress",
        url,
    ]

    # Run lychee
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)

        # Print the output for debugging
        if result.stdout:
            print(result.stdout)

        if result.returncode != 0:
            console.print(f"[red]❌ Found broken links in {url}[/red]")
            if result.stderr:
                console.print(f"[red]{result.stderr}[/red]")
            return False

        return True
    except Exception as e:
        console.print(f"[red]❌ Error running lychee: {e}[/red]")
        return False


@app.command()
def check(
    verbose: Annotated[
        bool, typer.Option("--verbose", "-v", help="Show detailed output")
    ] = False,
) -> None:
    """
    Check internal links in staged markdown files.

    This command checks all staged markdown files for broken links using lychee.
    It requires Jekyll server to be running and lychee to be installed.
    """
    # Get staged markdown files
    staged_files = get_staged_markdown_files()

    if not staged_files:
        console.print("📝 No markdown files to check")
        raise typer.Exit(0)

    # Check if Jekyll server is running
    if not check_jekyll_server():
        console.print(
            "[yellow]⚠️  Jekyll server not running - skipping link check ✅[/yellow]"
        )
        console.print(
            "[yellow]   💡 Run 'just jekyll-serve' to enable link checking[/yellow]"
        )
        raise typer.Exit(0)

    # Check if lychee is installed
    if not check_lychee_installed():
        console.print("[yellow]⚠️  lychee not found - skipping link check ✅[/yellow]")
        console.print("[yellow]   💡 Install lychee to enable link checking:[/yellow]")
        console.print(
            "[yellow]   curl -sSL https://github.com/lycheeverse/lychee/releases/latest/download/lychee-aarch64-unknown-linux-gnu.tar.gz | tar xz && sudo mv lychee /usr/local/bin/[/yellow]"
        )
        raise typer.Exit(0)

    console.print("🔗 Checking internal links in staged files...")
    console.print(f"📁 Files: {' '.join(staged_files)}")

    # Translate files to URLs
    translated_urls, files_not_in_backlinks = translate_files_to_urls(staged_files)

    # Warn about files not in backlinks
    if files_not_in_backlinks:
        console.print(
            "[yellow]⚠️  Warning: The following files are not in back-links.json:[/yellow]"
        )
        for file in files_not_in_backlinks:
            console.print(f"[yellow]   - {file}[/yellow]")
        console.print(
            "[yellow]   💡 Run 'just update-backlinks' to update the backlinks database[/yellow]"
        )
        console.print(
            "[yellow]   ⚠️  Fragment validation may fail for these files[/yellow]"
        )
        console.print()

    # Remove duplicate URLs and file paths
    final_urls = []
    seen = set()
    for url in translated_urls:
        if url.startswith("http://localhost:4000"):
            if url not in seen:
                final_urls.append(url)
                seen.add(url)
        else:
            # Only include files if no URL was found for them
            file_as_url = False
            for other_url in translated_urls:
                if other_url.startswith("http://localhost:4000") and url in other_url:
                    file_as_url = True
                    break
            if not file_as_url and url not in seen:
                final_urls.append(url)
                seen.add(url)

    console.print(f"🌐 Checking URLs: {' '.join(final_urls)}")

    # Run lychee checks in parallel
    all_success = True
    failed_urls = []

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task(
            f"[cyan]Checking {len(final_urls)} URLs in parallel...",
            total=len(final_urls),
        )

        with ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all lychee checks to run in parallel
            future_to_url = {
                executor.submit(run_lychee, url, staged_files, verbose): url
                for url in final_urls
            }

            # Process results as they complete
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    success = future.result()
                    if not success:
                        all_success = False
                        failed_urls.append(url)
                except Exception as e:
                    console.print(f"[red]❌ Error checking {url}: {e}[/red]")
                    all_success = False
                    failed_urls.append(url)

                progress.update(task, advance=1)

    if all_success:
        console.print(
            Panel(
                "[green]✅ All links in staged files are working![/green]",
                title="Success",
            )
        )
        raise typer.Exit(0)
    else:
        error_msg = "[red]❌ Found broken links in staged files[/red]"
        if failed_urls:
            error_msg += f"\n[red]Failed URLs: {', '.join(failed_urls)}[/red]"
        console.print(Panel(error_msg, title="Error"))
        console.print(
            "[yellow]💡 Check the output above for details about broken links[/yellow]"
        )
        raise typer.Exit(1)


# Keep backward compatibility for pre-commit hook
def main() -> int:
    """Main entry point for backward compatibility."""
    try:
        app(standalone_mode=False)
        return 0
    except typer.Exit as e:
        return e.exit_code


if __name__ == "__main__":
    # For pre-commit hook compatibility, call main() directly
    sys.exit(main())

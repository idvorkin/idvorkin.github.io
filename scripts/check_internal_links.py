#!/usr/bin/env python3
# /// script
# dependencies = [
#   "requests",
#   "beautifulsoup4",
#   "cyclopts",
#   "rich",
# ]
# ///
"""
Check internal links across the blog site using BeautifulSoup.
Usage: uv run check_internal_links.py [--server localhost:4000]
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys
import subprocess
import tempfile
import os
import json
import re
import cyclopts
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeRemainingColumn
from rich.table import Table
from rich.panel import Panel
from collections import defaultdict

def get_all_blog_pages(server_url):
    """Extract all blog page URLs from the /all/ page."""
    try:
        response = requests.get(f"{server_url}/all/")
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching /all/ page: {e}")
        return []
    
    soup = BeautifulSoup(response.content, 'html.parser')
    blog_pages = set()
    
    for link in soup.find_all('a', href=True):
        href = link['href']
        # Only internal links starting with /
        if href.startswith('/') and not href.startswith('#'):
            # Skip assets, feeds, etc.
            if not any(href.startswith(skip) for skip in ['/assets/', '/feed.xml']):
                blog_pages.add(href)
    
    return sorted(blog_pages)

def extract_internal_links(server_url, page_path):
    """Extract all internal links from a given page."""
    try:
        response = requests.get(f"{server_url}{page_path}")
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching {page_path}: {e}")
        return []
    
    soup = BeautifulSoup(response.content, 'html.parser')
    internal_links = set()
    
    for link in soup.find_all('a', href=True):
        href = link['href']
        # Only internal links starting with /
        if href.startswith('/') and not href.startswith('#'):
            # Skip assets, feeds, etc.
            if not any(href.startswith(skip) for skip in ['/assets/', '/feed.xml']):
                internal_links.add(href)
    
    return internal_links

def load_backlinks(backlinks_file="back-links.json"):
    """Load backlinks data to map URLs to source files."""
    try:
        with open(backlinks_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        console.print(f"[yellow]Warning: {backlinks_file} not found. Source file mapping unavailable.[/yellow]")
        return {}
    except json.JSONDecodeError:
        console.print(f"[yellow]Warning: Invalid JSON in {backlinks_file}. Source file mapping unavailable.[/yellow]")
        return {}

def find_source_files_for_broken_link(broken_url, server_url, backlinks_data):
    """Find which source files contain references to the broken URL."""
    # Remove server part to get the path
    broken_path = broken_url.replace(server_url, "")
    
    source_files = []
    
    # Look through all URLs in url_info to find pages that link to our broken path
    url_info = backlinks_data.get('url_info', {})
    
    for page_url, page_data in url_info.items():
        if isinstance(page_data, dict) and 'outgoing_links' in page_data:
            outgoing_links = page_data['outgoing_links']
            
            # Check if this page links to our broken URL
            if broken_path in outgoing_links or broken_path.split('#')[0] in outgoing_links:
                source_files.append({
                    'file': page_data.get('markdown_path', 'unknown'),
                    'line': 'unknown',
                    'link_text': f'Links to {broken_path}',
                    'found_url': broken_path,
                    'source_page': page_url,
                    'page_title': page_data.get('title', 'unknown')
                })
    
    return source_files

def parse_lychee_errors(lychee_output):
    """Parse lychee output to extract broken URLs and their error types."""
    broken_links = []
    
    # Look for error lines in the format: * [ERROR_TYPE] <URL> | Description
    error_pattern = r'\* \[(404|ERROR)\] <([^>]+)> \| (.+)'
    
    for line in lychee_output.split('\n'):
        match = re.match(error_pattern, line)
        if match:
            error_type = match.group(1)
            url = match.group(2)
            description = match.group(3)
            broken_links.append({
                'type': error_type,
                'url': url,
                'description': description
            })
    
    return broken_links

app = cyclopts.App()
console = Console()

@app.default
def main(server: str = "localhost:4000", json_output: bool = False) -> None:
    """Check internal links across the blog site using BeautifulSoup.

    Args:
        server: Server to check (default: localhost:4000, or use idvork.in for prod)
        json_output: Output results in JSON format instead of rich console output
    """
    server_url = f"http://{server}"

    if not json_output:
        console.print(Panel(f"🔍 Checking internal links on [bold blue]{server_url}[/bold blue]",
                           title="Blog Link Checker", style="cyan"))
    
    # Step 1: Get all blog pages
    if not json_output:
        with console.status("[bold green]Getting all blog pages...", spinner="dots"):
            blog_pages = get_all_blog_pages(server_url)
        console.print(f"📄 Found [bold green]{len(blog_pages)}[/bold green] blog pages")
    else:
        blog_pages = get_all_blog_pages(server_url)
    
    # Step 2: Extract all internal links from all pages
    all_internal_links = set()

    if not json_output:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            TimeRemainingColumn(),
            console=console
        ) as progress:
            task = progress.add_task("🔗 Extracting internal links...", total=len(blog_pages))

            for page in blog_pages:
                page_links = extract_internal_links(server_url, page)
                all_internal_links.update(page_links)
                progress.advance(task)
    else:
        for page in blog_pages:
            page_links = extract_internal_links(server_url, page)
            all_internal_links.update(page_links)

    if not json_output:
        console.print(f"📊 Found [bold yellow]{len(all_internal_links)}[/bold yellow] unique internal links")

    # Step 3: Write URLs to temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        urls_file = f.name
        for link in sorted(all_internal_links):
            f.write(f"{server_url}{link}\n")

    if not json_output:
        console.print(f"📝 Written URLs to temporary file: {urls_file}")

    # Step 4: Use lychee to check all links with fragment support
    if not json_output:
        with console.status("[bold green]Running lychee to check all links (with anchor fragments)...", spinner="dots"):
            try:
                result = subprocess.run([
                    'lychee',
                    '--include-fragments',  # Check anchor fragments
                    '--format', 'markdown',
                    '--quiet', '--quiet',   # Much less verbose output
                    '--no-progress',        # No progress bar
                    urls_file
                ], capture_output=True, text=True, check=False)

                # Clean up temp file
                os.unlink(urls_file)

                # Parse lychee output
                stdout = result.stdout
                stderr = result.stderr

            except FileNotFoundError:
                console.print("[red]Error: lychee not found. Please install lychee first.[/red]")
                os.unlink(urls_file)
                return
            except Exception as e:
                console.print(f"[red]Error running lychee: {e}[/red]")
                os.unlink(urls_file)
                return
    else:
        try:
            result = subprocess.run([
                'lychee', 
                '--include-fragments',  # Check anchor fragments
                '--format', 'markdown',
                '--quiet', '--quiet',   # Much less verbose output
                '--no-progress',        # No progress bar
                urls_file
            ], capture_output=True, text=True, check=False)
            
            # Clean up temp file
            os.unlink(urls_file)
            
            # Parse lychee output
            stdout = result.stdout
            stderr = result.stderr
            
        except FileNotFoundError:
            if not json_output:
                console.print("[red]Error: lychee not found. Please install lychee first.[/red]")
            else:
                print(json.dumps({"error": "lychee not found. Please install lychee first."}))
            os.unlink(urls_file)
            return
        except Exception as e:
            if not json_output:
                console.print(f"[red]Error running lychee: {e}[/red]")
            else:
                print(json.dumps({"error": f"Error running lychee: {e}"}))
            os.unlink(urls_file)
            return

    # Step 5: Load backlinks data for source file mapping
    if not json_output:
        console.print("📚 Loading backlinks data for source file mapping...")
    backlinks_data = load_backlinks()

    # Step 6: Parse lychee output for broken links
    broken_links = parse_lychee_errors(stdout)

    if json_output:
        # Prepare JSON output
        result_data = {
            "server_url": server_url,
            "total_pages": len(blog_pages),
            "total_links": len(all_internal_links),
            "broken_links_count": len(broken_links),
            "broken_links": []
        }

        for broken_link in broken_links:
            broken_url = broken_link['url']
            error_type = broken_link['type']
            description = broken_link['description']

            # Find source files for this broken link
            source_files = find_source_files_for_broken_link(broken_url, server_url, backlinks_data)

            result_data["broken_links"].append({
                "url": broken_url,
                "error_type": error_type,
                "description": description,
                "source_files": source_files
            })

        print(json.dumps(result_data, indent=2))
        return

    # Step 7: Display summary results only (without verbose successful links)
    console.print("\n" + "="*80)
    console.print("[bold cyan]🚀 LYCHEE SUMMARY:[/bold cyan]")
    console.print("="*80)
    
    # Extract just the summary table from lychee output
    if stdout:
        lines = stdout.split('\n')
        in_summary = False
        summary_lines = []
        
        for line in lines:
            if '# Summary' in line:
                in_summary = True
            elif in_summary and line.strip() and not line.startswith('##'):
                summary_lines.append(line)
            elif in_summary and line.startswith('##'):
                break
        
        if summary_lines:
            console.print('\n'.join(summary_lines))
    
    # Step 8: Enhanced broken links table with source files
    if broken_links:
        console.print("\n")
        enhanced_table = Table(title="🚨 BROKEN LINKS WITH SOURCE FILES")
        enhanced_table.add_column("Broken Link", style="red")
        enhanced_table.add_column("Error", style="yellow") 
        enhanced_table.add_column("Source File", style="blue")
        enhanced_table.add_column("Source Page", style="cyan")
        enhanced_table.add_column("Page Title", style="green")
        
        for broken_link in broken_links:
            broken_url = broken_link['url']
            error_type = broken_link['type']
            description = broken_link['description']
            
            # Find source files for this broken link
            source_files = find_source_files_for_broken_link(broken_url, server_url, backlinks_data)
            
            if source_files:
                for i, source in enumerate(source_files):
                    # Only show the URL and error on the first row
                    url_display = broken_url if i == 0 else ""
                    error_display = f"{error_type}: {description}" if i == 0 else ""
                    
                    enhanced_table.add_row(
                        url_display,
                        error_display,
                        source['file'],
                        source.get('source_page', 'unknown'),
                        source.get('page_title', 'unknown')[:40] + "..." if len(source.get('page_title', '')) > 40 else source.get('page_title', 'unknown')
                    )
            else:
                # No source files found
                enhanced_table.add_row(
                    broken_url,
                    f"{error_type}: {description}",
                    "[dim]No source found[/dim]",
                    "[dim]Unknown[/dim]",
                    "[dim]Unknown[/dim]"
                )
        
        console.print(enhanced_table)
    else:
        console.print(Panel("🎉 All internal links are working!", style="green"))
    
    # Only show stderr if there are actual critical errors (not status codes)
    if stderr:
        # Filter out status code lines and only show real errors
        error_lines = []
        for line in stderr.split('\n'):
            # Only include lines that are actual critical errors, not status codes or debug info
            if (line.strip() and 
                not line.startswith('[200]') and 
                not line.startswith('[DEBUG]') and 
                not line.startswith('[ERROR]') and 
                not line.startswith('[404]') and
                'Redirecting to' not in line):
                error_lines.append(line)
        
        if error_lines:
            console.print("\n[bold red]Critical Errors:[/bold red]")
            console.print('\n'.join(error_lines))

if __name__ == "__main__":
    app()
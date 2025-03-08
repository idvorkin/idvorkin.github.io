#!uv run


# /// script
# dependencies = [
#   "beautifulsoup4",
#   "bs4",
#   "typer",
#   "icecream",
#   "pudb",
#   "typing-extensions",
#   "gitpython",
# ]
# ///
# Remove line too long
# pep8: disable=E501

from icecream import ic
from bs4 import BeautifulSoup
from collections import defaultdict
from typing import NewType, List, Dict
import os
import json
from dataclasses import dataclass
import copy
import typer
import pudb
from datetime import datetime
import git
import time
import asyncio
from functools import lru_cache

# Configure icecream to be less verbose but still use it
ic.configureOutput(prefix="", includeContext=False)

# Use type system (and mypy) to reduce error,
# Even though both of these are strings, they should not be inter mixed
FileType = NewType("FileType", str)
PathType = NewType("PathType", str)

# Set a maximum number of concurrent operations to prevent "too many files open" error
MAX_CONCURRENT_OPERATIONS = 50  # Adjust this value based on system limits


@lru_cache(maxsize=1024)
def get_last_modified_time(file_path: str) -> str:
    """
    Get the last modified time of a file from git.
    Throws an exception if git is not available or fails.
    Returns an ISO format date string.

    This function is cached to avoid repeated git operations on the same file.
    """
    try:
        # Try to get the last modified time from git
        repo = git.Repo(search_parent_directories=True)
        relative_path = os.path.relpath(file_path, repo.working_dir)

        # Use git log to get the last commit date for the file
        git_log = repo.git.log("-1", "--format=%cd", "--date=iso", "--", relative_path)
        if git_log:
            # Parse the git date format and convert to ISO format
            dt = datetime.strptime(git_log.strip(), "%Y-%m-%d %H:%M:%S %z")
            return dt.isoformat()
        else:
            raise ValueError(f"No git history found for {file_path}")
    except (git.InvalidGitRepositoryError, git.GitCommandError, ValueError) as e:
        # Raise a more descriptive error instead of falling back to file system
        raise RuntimeError(
            f"Failed to get last modified time from git for {file_path}: {e}"
        )


def get_last_modified_time_safe(file_path: str) -> str:
    """
    A wrapper around get_last_modified_time that returns an empty string on error.
    This is used for parallel processing to avoid exceptions stopping the process.
    """
    try:
        if not file_path:
            return ""

        # First check if the file actually exists
        if not os.path.exists(file_path):
            return ""

        # Get the last modified time
        result = get_last_modified_time(file_path)

        return result
    except Exception:
        return ""


async def process_markdown_paths_in_parallel(
    markdown_paths: List[str],
) -> Dict[str, str]:
    """
    Process a list of markdown paths in parallel to get their last modified times.
    Returns a dictionary mapping file paths to their last modified times.
    Uses direct git calls instead of GitPython for better reliability.
    Uses a semaphore to limit concurrent operations.
    """
    result = {}
    # Create a semaphore to limit concurrent operations
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_OPERATIONS)

    async def get_last_modified_time_async(path):
        """Async function to get last modified time using direct git command with semaphore"""
        if not path:
            return path, ""

        if not os.path.exists(path):
            return path, ""

        # Use semaphore to limit concurrent operations
        async with semaphore:
            try:
                # Use asyncio to run git command directly
                repo = git.Repo(search_parent_directories=True)
                relative_path = os.path.relpath(path, repo.working_dir)

                # Check if file is tracked by git
                is_tracked = False
                try:
                    repo.git.ls_files("--error-unmatch", relative_path)
                    is_tracked = True
                except git.GitCommandError:
                    return path, ""

                if not is_tracked:
                    return path, ""

                # Create the git command
                cmd = [
                    "git",
                    "log",
                    "-1",
                    "--format=%cd",
                    "--date=iso",
                    "--",
                    relative_path,
                ]

                # Run the git command as a subprocess
                proc = await asyncio.create_subprocess_exec(
                    *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
                )

                stdout, stderr = await proc.communicate()

                if proc.returncode == 0 and stdout:
                    # Parse the date output
                    git_log = stdout.decode().strip()

                    if not git_log:
                        return path, ""

                    try:
                        dt = datetime.strptime(git_log, "%Y-%m-%d %H:%M:%S %z")
                        iso_date = dt.isoformat()
                        return path, iso_date
                    except ValueError:
                        return path, ""
                else:
                    return path, ""
            except Exception:
                return path, ""

    # Create tasks for all paths
    tasks = [get_last_modified_time_async(path) for path in markdown_paths if path]

    # Run all tasks concurrently
    for path_result in await asyncio.gather(*tasks):
        path, last_modified = path_result
        if path and last_modified:
            result[path] = last_modified

    return result


@dataclass
class Page:
    url: PathType
    title: str
    description: str
    file_path: FileType
    outgoing_links: List[PathType]
    incoming_links: List[PathType]
    redirect_url: PathType = PathType("")
    markdown_path: PathType = PathType("")
    doc_size: int = 0
    last_modified: str = ""

    def has_redirect(self):
        return self.redirect_url != ""

    @staticmethod
    def ForRedirect(url: PathType, redirect_url: PathType):
        return Page(
            url=url,
            redirect_url=redirect_url,
            title="",
            description="",
            file_path=FileType(""),
            outgoing_links=[],
            incoming_links=[],
            last_modified="",
        )


# Place to store allow and deny lists
class idvorkin_github_io_config:
    def is_allow_incoming(self, file_path: FileType):
        deny_list = "404.html;all.html;toc.html;index.html;tags.html".split(";")
        for deny in deny_list:
            if file_path.endswith(deny):
                return False
        return True

    def is_allow_outgoing(self, path: PathType):
        if path == "/":
            return False

        if path in "/ig66;/random;/tags;/about;/linkedin;/td".split(";"):
            return False
        return path.startswith("/")

    def collection_dirs(self):
        return "_site;_site/td;_site/d".split(";")

    def make_site_relative_url_from_url(self, url: PathType) -> PathType:
        # Jekyll generates URLs that include the host
        return PathType(url.replace("http://localhost:4000", ""))

    def make_site_relative_url_from_path(self, path: FileType) -> PathType:
        # Given a path, make the path URL
        # path is _site/cv.html'
        return PathType(path.replace("_site/", "/").replace(".html", ""))

    def clean_title(self, title):
        # Jekyll makes an ugly title
        # title='\n  INSECURITY AND IMPOSTER SYNDROME \n'
        return title.replace("\n  ", "").replace(" \n", "")


# Come up with a better DI system for config
jekyll_config = idvorkin_github_io_config()


class LinkBuilder:
    def parse_page(self, file_path: FileType):
        if not jekyll_config.is_allow_incoming(file_path):
            return

        with open(file_path, "r", encoding="utf-8") as f:
            contents = f.read()
            soup = BeautifulSoup(contents, features="html.parser")

            # Skip pages that are not complete
            pageTitle = soup.title.string if soup.title else None

            titleTag = soup.find("meta", property="og:title")
            pageTitle = titleTag["content"] if titleTag else pageTitle

            canonicalTag = soup.find("link", rel="canonical")
            canonicalUrl: PathType = canonicalTag["href"] if canonicalTag else None
            isCompletePage = pageTitle and canonicalUrl
            if not isCompletePage:
                return None

            canonicalUrl = jekyll_config.make_site_relative_url_from_url(canonicalUrl)

            if pageTitle.startswith("Redirecting"):
                # hack need to convert from path to redirect URL via heuristic as
                # redirect file name is not in the page.
                src_url = jekyll_config.make_site_relative_url_from_path(file_path)
                return Page.ForRedirect(url=src_url, redirect_url=canonicalUrl)

            pageTitle = jekyll_config.clean_title(pageTitle)

            # <meta property="og:description" content="Coaching is like midwifery">
            descriptionTag = soup.find("meta", property="og:description")
            description = descriptionTag["content"] if descriptionTag else "..."

            # Remove all in site nav, which have a parent of class including site_nav
            def is_site_nav(tag):
                if "class" not in tag.attrs:
                    return False
                return "nav-item" in tag["class"]

            links = [
                tag["href"]
                for tag in soup.find_all("a")
                if "href" in tag.attrs and (not is_site_nav(tag))
            ]
            links = [link for link in links if jekyll_config.is_allow_outgoing(link)]
            # Explicitly remove any "/tags" links that might have slipped through
            links = [
                link
                for link in links
                if link != "/tags" and not link.startswith("/tags#")
            ]
            links = [link.split("#")[0] for link in links]

            # cut down on small changes to backlinks when minor file changes
            rounded_len = len(contents) - len(contents) % 1000

            markdownPathTag = soup.find("meta", property="markdown-path")
            markdownPath = markdownPathTag["content"] if markdownPathTag else ""

            # We'll set last_modified later in batch processing
            return Page(
                title=pageTitle,
                markdown_path=markdownPath,
                description=description,
                url=canonicalUrl,
                file_path=file_path,
                outgoing_links=links,
                incoming_links=[],
                doc_size=rounded_len,
                last_modified="",
            )

        assert "should never get here"

    def update(self, path_back: FileType):
        if "debug-something-wonky" in path_back:
            pudb.set_trace()

        page = self.parse_page(path_back)
        if page is None:
            return

        if page.has_redirect():
            self.redirects[page.url] = page.redirect_url
            return

        for link in page.outgoing_links:
            # when a link has an anchor eg foo.html#bar
            # the incoming_link is foo.html, so strip the anchor
            clean_link = link.split("#")[0]
            self.incoming_links[clean_link].append(page.url)

        self.pages[page.url] = page

    async def update_last_modified_times(self):
        """
        Update the last_modified field for all pages in parallel.
        This is much faster than doing it one by one during parsing.
        """
        # Collect all markdown paths
        markdown_paths = [page.markdown_path for page in self.pages.values()]

        # Count how many paths are empty
        empty_paths = sum(1 for path in markdown_paths if not path)
        if empty_paths > 0:
            ic(f"WARNING: {empty_paths} pages have empty markdown_path values")

        # Process them in parallel
        ic(f"Processing {len(markdown_paths)} markdown paths in parallel...")
        start_time = time.time()
        last_modified_map = await process_markdown_paths_in_parallel(markdown_paths)
        end_time = time.time()

        # Check how many paths got dates
        paths_with_dates = sum(1 for date in last_modified_map.values() if date)
        ic(f"Got dates for {paths_with_dates} out of {len(markdown_paths)} paths")

        if paths_with_dates < len(markdown_paths):
            ic(
                f"WARNING: {len(markdown_paths) - paths_with_dates} paths did not get dates"
            )

        ic(
            f"Processed {len(last_modified_map)} markdown paths in {end_time - start_time:.2f} seconds"
        )

        # Track which pages end up with null last_modified values
        null_last_modified = []

        # Update the pages with the results
        for page in self.pages.values():
            if page.markdown_path in last_modified_map:
                page.last_modified = last_modified_map[page.markdown_path]
                if not page.last_modified:
                    null_last_modified.append((page.url, page.markdown_path))

        # Report on pages with null last_modified values
        if null_last_modified:
            ic(
                f"WARNING: {len(null_last_modified)} pages have null last_modified values"
            )
            for url, path in null_last_modified[:10]:  # Show first 10
                ic(f"  Null last_modified for URL: {url}, Path: {path}")

    def canonicalize_outgoing_pages(self):
        for page in self.pages.values():
            # Canonicalize redirects
            page.outgoing_links = [
                self.redirects.get(link, link) for link in page.outgoing_links
            ]
            # Remove duplicates
            page.outgoing_links = list(set(page.outgoing_links))
            # Sort so stable in output
            page.outgoing_links.sort()

    def compress(self):
        # remove redirects and dedup
        self.canonicalize_outgoing_pages()
        links = list(self.incoming_links.keys())  # make list as will mutate dictions
        for link in links:
            isRedirectedLink = link in self.redirects
            if not isRedirectedLink:
                continue

            # copy incoming_links from redirected page to canonical page
            canonical_link = self.redirects[link]
            self.incoming_links[canonical_link].extend(self.incoming_links[link])
            # erase duplicate link from dict
            self.incoming_links.pop(link)

        # Remove "/tags" from incoming_links if it somehow got included
        if "/tags" in self.incoming_links:
            self.incoming_links.pop("/tags")

        # Remove any references to "/tags" as an incoming link
        for link in self.incoming_links.keys():
            self.incoming_links[link] = [
                url for url in self.incoming_links[link] if url != "/tags"
            ]

        # dedup all elements
        for link in self.incoming_links.keys():
            self.incoming_links[link] = sorted(list(set(self.incoming_links[link])))

        # dictionarys enumerate in insertion order, so rebuild dicts in insertion order
        def sort_dict(d):
            return {key: d[key] for key in sorted(d.keys(), key=lambda x: x.lower())}

        self.redirects = sort_dict(self.redirects)
        self.incoming_links = sort_dict(self.incoming_links)
        self.pages = sort_dict(self.pages)

        # populate incoming links
        for link in self.incoming_links.keys():
            if link in self.pages:
                self.pages[link].incoming_links = copy.deepcopy(
                    self.incoming_links[link]
                )

    def __init__(self):
        self.incoming_links = defaultdict(list)  # forward -> back
        self.redirects = {}  # url->[back_links]; # I don't need to serialzie these, but helpful for debugging.
        self.pages = {}  # canonical->md

    def print_json(self, output_file="back-links.json"):
        self.compress()

        out = {
            "redirects": self.redirects,  # Not needed for link building, but helpful for debugging.
            "url_info": self.pages,
        }

        # don't mangle the unicode
        # Custom encoder to handle Page objects
        def page_encoder(obj):
            if isinstance(obj, Page):
                return {
                    "url": obj.url,
                    "title": obj.title,
                    "description": obj.description,
                    "file_path": obj.file_path,
                    "outgoing_links": obj.outgoing_links,
                    "incoming_links": obj.incoming_links,
                    "redirect_url": obj.redirect_url,
                    "markdown_path": obj.markdown_path,
                    "doc_size": obj.doc_size,
                    "last_modified": obj.last_modified,
                }
            return obj

        # Write directly to the file instead of printing to stdout
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(out, f, default=page_encoder, ensure_ascii=False, indent=4)

        # Print a message to stdout for logging
        ic(f"Successfully wrote {output_file}")


def build_links_for_dir(lb, dir):
    for f in os.listdir(dir):
        if not f.endswith(".html"):
            continue
        lb.update(f"{dir}/{f}")


app = typer.Typer()


@app.command()
def build(output_file: str = "back-links.json"):
    """
    Build backlinks and write to the specified output file.

    Args:
        output_file: Path to the output JSON file. Defaults to back-links.json in the current directory.
    """
    start_time = time.time()

    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)

    # Update last modified times
    parsing_time = time.time()
    ic(f"Parsed all pages in {parsing_time - start_time:.2f} seconds")

    # Use our improved parallel processing with direct git calls
    ic("Processing last_modified dates in parallel using direct git calls")
    asyncio.run(lb.update_last_modified_times())

    git_time = time.time()
    ic(f"Updated last modified dates in {git_time - parsing_time:.2f} seconds")

    # Print JSON to file instead of stdout
    lb.print_json(output_file)

    end_time = time.time()
    ic(f"Total time: {end_time - start_time:.2f} seconds")


@app.command()
def debug():
    ic("debugging")
    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)
    lb.print_json()


@app.command()
def test_dates():
    """Test the date retrieval functionality for specific files."""
    ic("Testing date retrieval")

    test_files = [
        "_d/2015-11-11-mind-monsters.md",
        "_d/40-yo-programmer.md",
        "build_back_links.py",
    ]

    for file_path in test_files:
        ic(f"Testing file: {file_path}")
        # Direct git command
        try:
            repo = git.Repo(search_parent_directories=True)
            relative_path = os.path.relpath(file_path, repo.working_dir)
            ic(f"Relative path: {relative_path}")

            # Use git log to get the last commit date for the file
            git_log = repo.git.log(
                "-1", "--format=%cd", "--date=iso", "--", relative_path
            )
            ic(f"Raw git log output: {git_log}")

            # Parse the date with the function
            if git_log:
                dt = datetime.strptime(git_log.strip(), "%Y-%m-%d %H:%M:%S %z")
                iso_date = dt.isoformat()
                ic(f"Parsed ISO date: {iso_date}")
            else:
                ic(f"No git history found for {file_path}")
        except Exception as e:
            ic(f"Error getting git info: {e}")

        # Also test the function from the script
        try:
            last_modified = get_last_modified_time(file_path)
            ic(f"Last modified from function: {last_modified}")
        except Exception as e:
            ic(f"Error from function: {e}")

        # Also check file system timestamp
        try:
            stat_info = os.stat(file_path)
            file_mtime = datetime.fromtimestamp(stat_info.st_mtime).isoformat()
            ic(f"File system mtime: {file_mtime}")
        except Exception as e:
            ic(f"Error getting file system time: {e}")

        ic("-------------------")


@app.command()
def verbose_test():
    """Run a verbose test on a specific file to diagnose last_modified date issues."""
    ic("Running verbose test")

    # Test the mind-monsters file specifically
    test_file = "_d/2015-11-11-mind-monsters.md"
    test_url = "/mind-monsters"

    # Step 1: Check if the file exists
    ic(f"Checking if file exists: {test_file}")
    file_exists = os.path.exists(test_file)
    ic(f"File exists: {file_exists}")

    # Step 2: Get the git last modified time directly (not cached)
    ic("Getting git last modified time directly")
    try:
        repo = git.Repo(search_parent_directories=True)
        relative_path = os.path.relpath(test_file, repo.working_dir)
        git_log = repo.git.log("-1", "--format=%cd", "--date=iso", "--", relative_path)
        ic(f"Git log raw output: {git_log}")

        dt = datetime.strptime(git_log.strip(), "%Y-%m-%d %H:%M:%S %z")
        git_date_iso = dt.isoformat()
        ic(f"Git date (ISO): {git_date_iso}")
    except Exception as e:
        ic(f"Error getting git date: {e}")

    # Step 3: Get the time using the cached function
    ic("Getting time using cached function")
    cached_time = get_last_modified_time(test_file)
    ic(f"Cached time: {cached_time}")

    # Step 4: Check the existing back-links.json
    ic("Checking existing back-links.json")
    try:
        with open("back-links.json", "r") as f:
            data = json.load(f)
            if test_url in data.get("url_info", {}):
                stored_date = data["url_info"][test_url].get("last_modified", "")
                ic(f"Stored date in back-links.json: {stored_date}")

                # Compare with git date
                if stored_date != git_date_iso:
                    ic(
                        f"MISMATCH: Git date {git_date_iso} != Stored date {stored_date}"
                    )
    except Exception as e:
        ic(f"Error reading back-links.json: {e}")

    # Step 5: Check if the file is correctly referenced in HTML
    ic("Checking HTML markdown-path reference")
    html_file = f"_site{test_url}.html"
    if os.path.exists(html_file):
        try:
            with open(html_file, "r") as f:
                html_content = f.read()
                soup = BeautifulSoup(html_content, features="html.parser")
                markdown_meta = soup.find("meta", property="markdown-path")
                if markdown_meta:
                    meta_path = markdown_meta.get("content", "")
                    ic(f"HTML meta markdown-path: {meta_path}")
                    if meta_path != test_file:
                        ic(f"MISMATCH: Expected {test_file} but found {meta_path}")
                else:
                    ic("No markdown-path meta tag found in HTML")
        except Exception as e:
            ic(f"Error reading HTML file: {e}")
    else:
        ic(f"HTML file not found: {html_file}")

    # Step 6: Run a manual full update for this file only
    ic("Running manual update for this file")
    lb = LinkBuilder()
    test_html_path = f"_site{test_url}.html"
    if os.path.exists(test_html_path):
        lb.update(test_html_path)
        ic("Update completed")

        # Check the page info
        for url, page in lb.pages.items():
            if url == test_url:
                ic(f"Page info after update: {url}")
                ic(f"  markdown_path: {page.markdown_path}")
                ic(f"  last_modified before parallel update: {page.last_modified}")

                # Manually update last modified time
                if page.markdown_path:
                    manual_time = get_last_modified_time_safe(page.markdown_path)
                    ic(f"  manually calculated last_modified: {manual_time}")

                    # Update page
                    page.last_modified = manual_time
                    ic(f"  last_modified after manual update: {page.last_modified}")
    else:
        ic(f"HTML file not found for update: {test_html_path}")


@app.command()
def check_dates():
    """Build back-links.json with extra date validation to fix the issue."""
    start_time = time.time()

    # Normal build process
    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)

    # Update last modified times WITH VALIDATION
    parsing_time = time.time()
    ic(f"Parsed all pages in {parsing_time - start_time:.2f} seconds")

    # Instead of using parallel processing, manually process each file
    # This is slower but more reliable for debugging
    ic("Manually processing last_modified dates (with validation)")

    # Files that had mismatches
    mismatches = []

    # Process each file's date manually
    for url, page in lb.pages.items():
        if not page.markdown_path:
            continue

        # Get date using git
        try:
            if not os.path.exists(page.markdown_path):
                ic(f"File doesn't exist: {page.markdown_path} for URL {url}")
                continue

            # Use the git command directly
            repo = git.Repo(search_parent_directories=True)
            relative_path = os.path.relpath(page.markdown_path, repo.working_dir)
            git_log = repo.git.log(
                "-1", "--format=%cd", "--date=iso", "--", relative_path
            )

            if git_log:
                dt = datetime.strptime(git_log.strip(), "%Y-%m-%d %H:%M:%S %z")
                git_date = dt.isoformat()

                # Check if stored date is different
                if page.last_modified and page.last_modified != git_date:
                    ic(f"DATE MISMATCH for {url} - {page.markdown_path}")
                    ic(f"  Existing: {page.last_modified}")
                    ic(f"  Git date: {git_date}")
                    mismatches.append(
                        (url, page.markdown_path, page.last_modified, git_date)
                    )

                # Update with correct date
                page.last_modified = git_date
            else:
                ic(f"No git history found for {page.markdown_path}")
        except Exception as e:
            ic(f"Error processing date for {url} - {page.markdown_path}: {e}")

    # Report issues
    if mismatches:
        ic(f"Found {len(mismatches)} date mismatches")
        # Show first 5 mismatches
        for i, (url, path, old, new) in enumerate(mismatches[:5]):
            ic(f"Mismatch {i+1}: {url} - {path}")
            ic(f"  Old: {old}")
            ic(f"  New: {new}")
    else:
        ic("No date mismatches found")

    # Output the corrected JSON
    lb.compress()
    git_time = time.time()
    ic(f"Processed dates in {git_time - parsing_time:.2f} seconds")

    lb.print_json()

    end_time = time.time()
    ic(f"Total time: {end_time - start_time:.2f} seconds")


@app.command()
def debug_null_dates():
    """Debug command to specifically check for pages with null last_modified values."""
    ic("Debugging null last_modified values")

    # First check the existing back-links.json
    null_dates_in_json = []
    try:
        with open("back-links.json", "r") as f:
            data = json.load(f)
            for url, info in data.get("url_info", {}).items():
                if "last_modified" not in info or not info["last_modified"]:
                    markdown_path = info.get("markdown_path", "")
                    null_dates_in_json.append((url, markdown_path))

        if null_dates_in_json:
            ic(
                f"Found {len(null_dates_in_json)} pages with null last_modified in back-links.json"
            )
            for url, path in null_dates_in_json[:10]:  # Show first 10
                ic(f"  Null last_modified in JSON for URL: {url}, Path: {path}")
        else:
            ic("No pages with null last_modified found in back-links.json")
    except Exception as e:
        ic(f"Error reading back-links.json: {e}")

    # Now check each of these files directly
    for url, path in null_dates_in_json:
        if not path:
            ic(f"  No markdown_path for URL: {url}")
            continue

        ic(f"Checking file directly: {path}")

        # Check if file exists
        if not os.path.exists(path):
            ic(f"  FILE NOT FOUND: {path} does not exist")
            continue

        # Check if file is tracked by git
        try:
            repo = git.Repo(search_parent_directories=True)
            relative_path = os.path.relpath(path, repo.working_dir)

            try:
                repo.git.ls_files("--error-unmatch", relative_path)
                ic(f"  File is tracked by git: {path}")
            except git.GitCommandError:
                ic(f"  UNTRACKED FILE: {path} is not tracked by git")
                continue

            # Try to get git log
            try:
                git_log = repo.git.log(
                    "-1", "--format=%cd", "--date=iso", "--", relative_path
                )
                if git_log:
                    ic(f"  Git log found: {git_log}")
                    try:
                        dt = datetime.strptime(git_log.strip(), "%Y-%m-%d %H:%M:%S %z")
                        iso_date = dt.isoformat()
                        ic(f"  Parsed date: {iso_date}")
                    except ValueError as e:
                        ic(f"  DATE PARSING ERROR: {e}")
                else:
                    ic("  No git log found for file")
            except git.GitCommandError as e:
                ic(f"  Git log command failed: {e}")
        except Exception as e:
            ic(f"  Error checking file: {e}")

    # Also check HTML files to see if markdown-path meta tags are correct
    ic("Checking HTML files for markdown-path meta tags")
    for url, path in null_dates_in_json:
        html_file = f"_site{url}.html"
        if os.path.exists(html_file):
            try:
                with open(html_file, "r") as f:
                    html_content = f.read()
                    soup = BeautifulSoup(html_content, features="html.parser")
                    markdown_meta = soup.find("meta", property="markdown-path")
                    if markdown_meta:
                        meta_path = markdown_meta.get("content", "")
                        ic(f"  HTML meta markdown-path for {url}: {meta_path}")
                        if meta_path != path:
                            ic(f"  MISMATCH: JSON has {path} but HTML has {meta_path}")
                    else:
                        ic(f"  No markdown-path meta tag found in HTML for {url}")
            except Exception as e:
                ic(f"  Error reading HTML file {html_file}: {e}")
        else:
            ic(f"  HTML file not found: {html_file}")


if __name__ == "__main__":
    app()

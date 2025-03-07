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
import concurrent.futures
from functools import lru_cache


# Use type system (and mypy) to reduce error,
# Even though both of these are strings, they should not be inter mixed
FileType = NewType("FileType", str)
PathType = NewType("PathType", str)


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
        return get_last_modified_time(file_path)
    except Exception as e:
        ic(f"Error getting last modified time for {file_path}: {e}")
        return ""


async def process_markdown_paths_in_parallel(
    markdown_paths: List[str],
) -> Dict[str, str]:
    """
    Process a list of markdown paths in parallel to get their last modified times.
    Returns a dictionary mapping file paths to their last modified times.
    """
    result = {}

    # Use a thread pool for I/O-bound operations
    with concurrent.futures.ThreadPoolExecutor(
        max_workers=os.cpu_count() * 4
    ) as executor:
        # Create a list of futures
        loop = asyncio.get_event_loop()
        futures = [
            loop.run_in_executor(executor, get_last_modified_time_safe, path)
            for path in markdown_paths
            if path
        ]

        # Process the results as they complete
        for i, future in enumerate(asyncio.as_completed(futures)):
            last_modified = await future
            if markdown_paths[i]:
                result[markdown_paths[i]] = last_modified

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
        deny_list = "404.html;all.html;toc.html;index.html".split(";")
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

        # Process them in parallel
        ic(f"Processing {len(markdown_paths)} markdown paths in parallel...")
        start_time = time.time()
        last_modified_map = await process_markdown_paths_in_parallel(markdown_paths)
        end_time = time.time()
        ic(
            f"Processed {len(last_modified_map)} markdown paths in {end_time - start_time:.2f} seconds"
        )

        # Update the pages with the results
        for page in self.pages.values():
            if page.markdown_path in last_modified_map:
                page.last_modified = last_modified_map[page.markdown_path]

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

    def print_json(self):
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

        print(json.dumps(out, indent=4, ensure_ascii=False, default=page_encoder))


def build_links_for_dir(lb, dir):
    for f in os.listdir(dir):
        if not f.endswith(".html"):
            continue
        lb.update(f"{dir}/{f}")


app = typer.Typer()


@app.command()
def build():
    start_time = time.time()

    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)

    # Update last modified times in parallel
    parsing_time = time.time()
    ic(f"Parsed all pages in {parsing_time - start_time:.2f} seconds")

    asyncio.run(lb.update_last_modified_times())

    git_time = time.time()
    ic(f"Updated last modified times in {git_time - parsing_time:.2f} seconds")

    lb.print_json()

    end_time = time.time()
    ic(f"Total time: {end_time - start_time:.2f} seconds")


@app.command()
def debug():
    ic("debugging")
    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)
    lb.print_json()


if __name__ == "__main__":
    app()

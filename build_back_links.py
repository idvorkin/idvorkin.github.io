# Remove line too long
# pep8: disable=E501

from bs4 import BeautifulSoup
from collections import defaultdict
from typing import NewType, List
import os
import jsonpickle  # json encoder doesn't encode dataclasses nicely, jsonpickle does the trick
from dataclasses import dataclass
import copy


# Use type system (and mypy) to reduce error,
# Even though both of these are strings, they should not be inter mixed
FileType = NewType("FileType", str)
PathType = NewType("PathType", str)


@dataclass
class Page:
    url: PathType
    title: str
    description: str
    file_path: FileType
    outgoing_links: List[PathType]
    incoming_links: List[PathType]
    redirect_url: PathType = PathType("")
    doc_size: int = 0

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


            links = [tag["href"] for tag in soup.find_all("a") if "href" in tag.attrs and (not is_site_nav(tag))]
            links = [link for link in links if jekyll_config.is_allow_outgoing(link)]
            links = [ link.split("#")[0] for link in links]

            # cut down on small changes to backlinks when minor file changes
            rounded_len =  len(contents) - len(contents) % 1000

            return Page(
                title=pageTitle,
                description=description,
                url=canonicalUrl,
                file_path=file_path,
                outgoing_links=links,
                incoming_links=[],
                doc_size=rounded_len
            )

        assert "should never get here"

    def update(self, path_back: FileType):

        page = self.parse_page(path_back)
        if page is None:
            return

        if page.has_redirect():
            self.redirects[page.url] = page.redirect_url
            return

        for link in page.outgoing_links:
            # when a link has an anchor eg foo.html#bar
            # the incoming_link is foo.html, so strip the anchor
            clean_link = link.split('#')[0]
            self.incoming_links[clean_link].append(page.url)

        self.pages[page.url] = page

    def canonicalize_outgoing_pages(self):
        for page in self.pages.values():
            # Canonicalize redirects
            page.outgoing_links = [self.redirects.get(link, link) for link in page.outgoing_links]
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
        self.redirects = (
            {}
        )  # url->[back_links]; # I don't need to serialzie these, but helpful for debugging.
        self.pages = {}  # canonical->md

    def print_json(self):
        self.compress()

        out = {
            "redirects": self.redirects,  # Not needed for link building, but helpful for debugging.
            "url_info": self.pages,
        }

        # don't mangle the unicode
        jsonpickle.set_encoder_options("json", ensure_ascii=False)

        # can't prettier ignore to avoid it getting re-written by git checkin scripts
        # because it will no longer be json -- grr
        # print ('<!-- prettier-ignore-start -->')
        # print ('<!-- prettier-ignore-end -->')
        print(jsonpickle.encode(out, indent=4))


def build_links_for_dir(lb, dir):
    for f in os.listdir(dir):
        if not f.endswith(".html"):
            continue
        lb.update(f"{dir}/{f}")


def build_links_for_site():
    lb = LinkBuilder()
    for d in jekyll_config.collection_dirs():
        build_links_for_dir(lb, d)
    lb.print_json()


build_links_for_site()

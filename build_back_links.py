from bs4 import BeautifulSoup
from collections import defaultdict
from typing import NamedTuple
import os
import jsonpickle  # json encoder doesn't encode dataclasses nicely, jsonpickle does the trick
from dataclasses import dataclass


@dataclass
class Page:
    url: str
    title: str
    description: str
    file_path: str
    outgoing_links: list
    redirect_url: str = None


# Place to store allow and deny lists
class Config:
    def incoming_link_allowed(self, r):
        deny_list = "404.html;all.html;toc.html;index.html".split(";")
        for deny in deny_list:
            if r.endswith(deny):
                return False
        return True

    def outgoing_link_allowed(self, r):
        if r == "/":
            return False
        if r.startswith("/tags#"):
            return False
        return r.startswith("/")

    def make_site_relative_url_from_url(self, url):
        # Jekyll generates URLs that include the host
        return url.replace("http://localhost:4000", "")

    def make_site_relative_url_from_path(self, path):
        # Given a path, make the path URL
        # path is _site/cv.html'
        return path.replace("_site/", "/").replace(".html", "")

    def clean_title(self, title):
        # Jekyll makes an ugly title
        # title='\n  INSECURITY AND IMPOSTER SYNDROME \n'
        return title.replace("\n  ", "").replace(" \n", "")


# inject somehow
config = Config()


class LinkBuilder:
    def parse_page(self, path):
        with open(path, "r", encoding="utf-8") as f:
            contents = f.read()
            soup = BeautifulSoup(contents, features="html.parser")

            # Skip pages that are not complete
            pageTitle = soup.title.string if soup.title else None
            canonicalTag = soup.find("link", rel="canonical")
            canonicalUrl = canonicalTag["href"] if canonicalTag else None
            isCompletePage = pageTitle and canonicalUrl
            if not isCompletePage:
                return None

            canonicalUrl = config.make_site_relative_url_from_url(canonicalUrl)

            if pageTitle.startswith("Redirecting"):
                # hack need to convert from path to redirect URL via heuristic as
                # redirect file name is not in the page.
                src_url = config.make_site_relative_url_from_path(path)
                return Page(
                    url=src_url,
                    redirect_url=canonicalUrl,
                    title=pageTitle,
                    description=None,
                    file_path=None,
                    outgoing_links=None,
                )

            pageTitle = config.clean_title(pageTitle)

            # <meta property="og:description" content="Coaching is like midwifery. A midwife can not give birth to the baby, she facilitates the birth. Similarly, a coach can not give a solution, she must give birth to the insight from within the coachee. Coaching is asking questions, guiding, and facilitating understanding, and this post collects my studies on the topic.
            descriptionTag = soup.find("meta", property="og:description")
            description = descriptionTag["content"] if descriptionTag else "..."

            links = [tag["href"] for tag in soup.find_all("a")]
            links = [l for l in links if config.outgoing_link_allowed(l)]

            return Page(
                title=pageTitle,
                description=description,
                url=canonicalUrl,
                file_path=path,
                outgoing_links=links,
            )

        assert "should never get here"

    def process_path(self, path_back):
        if not config.incoming_link_allowed(path_back):
            return

        page = self.parse_page(path_back)
        if page is None:
            return

        if page.redirect_url is not None:
            self.redirects[page.url] = page.redirect_url
            return

        for link in page.outgoing_links:
            self.incoming_links[link].append(page.url)

        self.pages[page.url] = page

    def dedup(self):
        # remove forward duplicates
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

    def __init__(self):
        self.incoming_links = defaultdict(list)  # forward -> back
        self.redirects = (
            {}
        )  # redirect_url->canonical; Technically I don't need these, but nice to debug.
        self.pages = {}  # canonical->md

    def dump(self):
        self.dedup()

        out = {
            "backlinks": self.incoming_links,
            "redirects": self.redirects,  #  I don't thinkw we need this, as we've de-duped
            "url_info": self.pages,  #  I don't thinkw we need this, as we've de-duped
        }
        print(jsonpickle.encode(out, indent=4))


def build_refs_for_dir(lb, dir):
    for f in os.listdir(dir):
        if not f.endswith(".html"):
            continue
        lb.process_path(f"{dir}/{f}")


def main():

    lb = LinkBuilder()
    dirs = "_site;_site/td;_site/d".split(";")
    for d in dirs:
        build_refs_for_dir(lb, d)
    lb.dump()

# Really?! Required to not mangle the unicode
jsonpickle.set_encoder_options("json", ensure_ascii=False) 
main()

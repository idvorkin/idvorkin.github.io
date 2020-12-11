from bs4 import BeautifulSoup
from collections import defaultdict
from typing import NamedTuple
import os
import json


class PageInfo(NamedTuple):
    canonical_url: list
    title: str
    description: int
    file_path: str


class RefBuilder:
    def allow_back_ref(self, r):
        deny_list = "404.html;all.html;toc.html;index.html".split(";")
        for deny in deny_list:
            if r.endswith(deny):
                return False
        return True

    def allow_forward_ref(self, r):
        if r == "/":
            return False
        if r.startswith("/tags#"):
            return False
        return r.startswith("/")

    def get_refs(self, path):
        refs = []
        with open(path, "r", encoding="latin-1") as f:
            contents = f.read()
            soup = BeautifulSoup(contents, features="html.parser")

            # Skip pages that are not complete
            pageTitle = soup.title.string if soup.title else None
            canonicalTag = soup.find("link", rel="canonical")
            canonicalUrl = canonicalTag["href"] if canonicalTag else None
            isCompletePage = pageTitle and canonicalUrl
            if not isCompletePage:
                return [], None

            # strip site,
            # HACK, as generated, root is localhost:4000
            canonicalUrl = canonicalUrl.replace("http://localhost:4000", "")

            if pageTitle.startswith("Redirecting"):
                # hack need to convert from path to redirect URL via heuristic as
                # redirect file name is not in the page.

                # path is _site/cv.html'
                src_url = path.replace("_site/", "/").replace(".html", "")
                self.redirects[src_url] = canonicalUrl
                return [], None

            # Jekyll makes an ugly title
            # title='\n  INSECURITY AND IMPOSTER SYNDROME \n'
            pageTitle = pageTitle.replace("\n  ","").replace(" \n","")

            # <meta property="og:description" content="Coaching is like midwifery. A midwife can not give birth to the baby, she facilitates the birth. Similarly, a coach can not give a solution, she must give birth to the insight from within the coachee. Coaching is asking questions, guiding, and facilitating understanding, and this post collects my studies on the topic.
            descriptionTag = soup.find("meta", property="og:description")
            description = descriptionTag["content"] if descriptionTag else "..."

            self.src_md[canonicalUrl] = PageInfo(
                title=pageTitle,
                description=description,
                canonical_url=canonicalUrl,
                file_path=path,
            )
            refs = [tag["href"] for tag in soup.find_all("a")]
            return refs, canonicalUrl
        assert "should never get here"

    def gather_refs(self, path_back):
        if not self.allow_back_ref(path_back):
            return

        forward_refs, canonicalUrl = self.get_refs(path_back)

        relevent_refs = [r for r in forward_refs if self.allow_forward_ref(r)]
        for path_forward in relevent_refs:
            self.refs[path_forward].append(canonicalUrl)

    def dedup(self):
        # 1. Remove duplicates
        for path_forward in self.refs.keys():
            # 2. replace redirects with their source page
            back_paths = []
            for r in self.refs[path_forward]:
                canonical_back_path = self.redirects[r] if r in self.redirects else r
                back_paths += [canonical_back_path]

            self.refs[path_forward] = list(set(back_paths))

    def __init__(self):
        self.refs = defaultdict(list)  # forward -> back
        # build this at the same time.
        self.redirects = {}  # redirect_url->canonical
        self.src_md = {}  # canonical->md

    def dump(self):
        self.dedup()
        for path_forward in self.refs.keys():
            print(f"{path_forward}:")
            print(f"->{self.refs[path_forward]}")

        for canonical in self.src_md.keys():
            print(f"{canonical}->\n{self.src_md[canonical]}")

        out = {
            "backlinks":self.refs,
            "redirects":self.redirects, #  I don't thinkw we need this, as we've de-duped
            "url_info":self.src_md, #  I don't thinkw we need this, as we've de-duped
        }
        print(json.dumps(out, indent=4))

def appendXRefToFile(refreneces, output_file):
    pass


def build_refs_for_dir(rb, dir):
    for f in os.listdir(dir):
        if not f.endswith(".html"):
            continue
        rb.gather_refs(f"{dir}/{f}")


def main():
    print("Main")
    rb = RefBuilder()
    dirs = "_site;_site/td;_site/d".split(";")
    for d in dirs:
        build_refs_for_dir(rb, d)
    rb.dump()


main()

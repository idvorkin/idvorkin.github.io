from bs4 import BeautifulSoup
from collections import defaultdict
import os


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

            pageTitle = soup.title

            def isCanonical(tag):
                # <link rel="canonical" href="http://localhost:4000/happy">
                return tag  and tag.has_attr("canonical")

            canonicalTag =  soup.find(isCanonical)
            canonicalUrl = None if not canonicalTag else canonicalTag.attrs["href"]

            back_refs = [tag["href"] for tag in soup.find_all("link")]

            isCompletePage = pageTitle and canonicalUrl
            if not isCompletePage:
                return

            back_refs = [tag["href"] for tag in soup.find_all("a")]
            refs.append(back_refs)

            if pageTitle.startswith("Redirecting"):
                self.redirects[path] = canonicalUrl
                return


            self.titles[path] = pageTitle
            self.src_md[canonicalUrl] = canonicalUrl


            # <title>Redirecting&hellip;</title>
            # <link rel="canonical" href="http://localhost:4000/happy">
            # if isredirect(soup):
            #    self.redirect[path] = redirect
        return refs

    def gather_refs(self, path_back):
        if not self.allow_back_ref(path_back):
            return

        forward_refs = self.get_refs(path_back)
        if not forward_refs:
            return

        relevent_refs = [r for r in forward_refs if self.allow_forward_ref(r)]
        for path_forward in relevent_refs:
            self.refs[path_forward].append(path_back)

    def dedup(self):
        # 1. replace redirects with their source page
        # 2. remove duplicates
        for path_forward in self.refs.keys():
            self.refs[path_forward] = list(set(self.refs[path_forward]))

    def __init__(self):
        self.refs = defaultdict(list)  # forward -> back
        # build this at the same time.
        self.redirects = {}  # redirect_url->canonical
        self.titles = {}  # canonical->title
        self.src_md = {}  # canonical->md

    def dump(self):
        self.dedup()
        for path_forward in self.refs.keys():
            print(f"{path_forward}:")
            print(f"->{self.refs[path_forward]}")
        print("Redirects")
        print(self.redirects)

        print("Title")
        for canonical in self.titles.keys():
            print(f"{canonical}->{self.titles[canonical]}")


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

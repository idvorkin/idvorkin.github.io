from bs4 import BeautifulSoup
from collections import defaultdict
import os


class RefBuilder:
    def allow_dest_ref(self, r):
        deny_list = "404.html;all.html;toc.html;index.html".split(";")
        for deny in deny_list:
            if r.endswith(deny):
                return False
        return True

    def allow_src_ref(self, r):
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
            for tag in soup.find_all("a"):
                refs.append(tag["href"])
                # print (tag)

            if soup.title and soup.title.string.startswith("Redirecting"):
                self.redirects[path] = "find_link"
            # <title>Redirecting&hellip;</title>
            # <link rel="canonical" href="http://localhost:4000/happy">
            # if isredirect(soup):
            #    self.redirect[path] = redirect
        return refs

    def gather_refs(self, path_dest):
        if not self.allow_dest_ref(path_dest):
            return

        all_refs = self.get_refs(path_dest)
        relevent_refs = [r for r in all_refs if self.allow_src_ref(r)]
        for path_src in relevent_refs:
            self.refs[path_src].append(path_dest)
        pass

    def dedup(self):
        # 1. replace redirects with their source page
        # 2. remove duplicates
        for path_src in self.refs.keys():
            self.refs[path_src] = list(set(self.refs[path_src]))

    def __init__(self):
        self.refs = defaultdict(list)  # src -> dest ; 'root' -> back_links
        # build this at the same time.
        self.redirects = {}  # redirect->root page

    def dump(self):
        self.dedup()
        for path_src in self.refs.keys():
            print(f"{path_src}:")
            print(f"->{self.refs[path_src]}")
        print("Redirects")
        print(self.redirects)


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

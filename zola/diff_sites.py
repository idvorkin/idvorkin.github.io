#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["beautifulsoup4", "lxml"]
# ///
"""Full-site diff: the Jekyll _site against the Zola public/ (bead blog-pzp).

usage: diff_sites.py <jekyll _site> <zola public> > diff-report.json

1. URL inventory. Every URL Jekyll serves, with its Zola status:
   page        same page (Jekyll /x[.html] -> Zola /x/)
   redirect    Jekyll redirect stub, Zola alias with the same target
   redirect-target-differs / redirect-missing
   static      same bytes; static-differs / static-missing
   page-missing, page-is-redirect
   plus every Zola URL Jekyll does not have (extra).
2. Per page pair (joined by the markdown-path meta, else by URL): visible-text
   similarity of #content-holder, heading ids kept/changed/lost, link and image
   counts, title and og:description.
3. Broken internal links and #anchors in each build, so port-induced breakage
   (zola_only) is told apart from what Jekyll already had broken.

Both sites are resolved the way their host serves them: Jekyll on Pages serves
/x from x.html; the Zola site serves /x by redirecting to /x/.
"""

import difflib
import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from bs4 import BeautifulSoup

HOSTS = {"idvork.in", "www.idvork.in", "idvorkin.github.io"}
SKIP_DIRS = {"pagefind", "zola-spike"}


def is_redirect(html: str) -> str | None:
    m = re.search(r'http-equiv="refresh"[^>]*content="0;\s*url=([^"]+)"', html, re.I)
    if not m:
        m = re.search(
            r'content="0;\s*url=([^"]+)"[^>]*http-equiv="refresh"', html, re.I
        )
    return m.group(1) if m else None


def url_of(rel: str) -> str:
    """The canonical URL a file is served at."""
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    if rel.endswith(".html"):
        return "/" + rel[:-5]
    return "/" + rel


def norm(u: str) -> str:
    """Compare URLs without the /x vs /x/ difference."""
    u = urlsplit(u)._replace(query="").geturl()
    for h in HOSTS:
        u = re.sub(rf"^https?://{re.escape(h)}", "", u)
    u = u.split("#")[0]
    if u.endswith("index.html"):
        u = u[: -len("index.html")]
    if u.endswith(".html"):
        u = u[:-5]
    if u.endswith("/index"):  # Jekyll names _d/index.html's URL /d/index
        u = u[: -len("index")]
    return u.rstrip("/") or "/"


class Site:
    def __init__(self, root: Path, kind: str):
        self.root, self.kind = root, kind
        self.files: dict[str, Path] = {}
        for p in root.rglob("*"):
            if p.is_file():
                rel = p.relative_to(root).as_posix()
                if rel.split("/")[0] in SKIP_DIRS:
                    continue
                self.files[rel] = p
        self._soup: dict[str, BeautifulSoup] = {}
        self._ids: dict[str, set] = {}

    def resolve(self, path: str) -> str | None:
        """File that answers a request for path (after host redirects)."""
        path = unquote(path).lstrip("/")
        cands = [path] if path else ["index.html"]
        if path.endswith("/") or not path:
            cands = [path + "index.html"]
        else:
            cands += [path + ".html", path + "/index.html"]
        for c in cands:
            if c in self.files:
                return c
        return None

    def soup(self, rel: str) -> BeautifulSoup:
        if rel not in self._soup:
            self._soup[rel] = BeautifulSoup(self.files[rel].read_bytes(), "lxml")
        return self._soup[rel]

    def ids(self, rel: str) -> set:
        if rel not in self._ids:
            s = self.soup(rel)
            self._ids[rel] = {t.get("id") for t in s.find_all(id=True)} | {
                t.get("name") for t in s.find_all("a", attrs={"name": True})
            }
        return self._ids[rel]


def content_node(soup):
    return soup.select_one("#content-holder") or soup.body or soup


def words(node) -> list[str]:
    node = BeautifulSoup(str(node), "lxml")
    for t in node(["script", "style", "noscript", "template"]):
        t.decompose()
    for t in node.select("[data-pagefind-ignore]"):
        t.decompose()  # the TOC: rebuilt client-side from headings anyway
    # rouge wraps code tokens in spans; get_text(" ") would split "f(x)" into
    # "f ( x )" on Jekyll only. Flatten code to its plain text first.
    for t in node.find_all(["pre", "code"]):
        t.replace_with(" " + t.get_text() + " ")
    return node.get_text(" ").split()


def headings(node):
    return [h.get("id") for h in node.find_all(re.compile("^h[1-6]$")) if h.get("id")]


def check_links(site: Site, rel: str, base_url: str):
    """Yield (href, problem) for broken internal links/anchors on one page."""
    soup = site.soup(rel)
    for tag, attr in (
        ("a", "href"),
        ("img", "src"),
        ("link", "href"),
        ("script", "src"),
        ("iframe", "src"),
    ):
        for t in soup.find_all(tag):
            href = (t.get(attr) or "").strip()
            if (
                not href
                or href.startswith(("mailto:", "tel:", "javascript:", "data:", "{{"))
                or re.fullmatch(r"l\d+", href)
            ):
                # l20: a table placeholder src/main.ts swaps for a list.
                continue
            absu = urljoin(base_url, href)
            parts = urlsplit(absu)
            if parts.scheme not in ("http", "https") or parts.hostname not in HOSTS | {
                "preview.local"
            }:
                continue
            target = (
                site.resolve(parts.path)
                if parts.path not in ("", "/")
                else site.resolve("/")
            )
            if target is None:
                yield href, "missing"
                continue
            if target.endswith(".html"):
                redir = is_redirect(
                    site.files[target].read_text(errors="ignore")[:2000]
                )
                if redir and tag == "a":
                    t2 = site.resolve(urlsplit(urljoin(absu, redir)).path)
                    target = t2 or target
            frag = unquote(parts.fragment)
            if frag and tag == "a" and target.endswith(".html"):
                if frag not in site.ids(target):
                    yield href, "anchor"


def main():
    jroot, zroot = Path(sys.argv[1]), Path(sys.argv[2])
    J, Z = Site(jroot, "jekyll"), Site(zroot, "zola")

    def classify(site: Site):
        pages, redirects, static = {}, {}, {}
        for rel, p in site.files.items():
            if rel.endswith(".html"):
                head = p.read_text(errors="ignore")[:3000]
                r = is_redirect(head)
                if r and len(p.read_bytes()) < 3000:
                    redirects[url_of(rel)] = r
                else:
                    pages[url_of(rel)] = rel
            else:
                static[url_of(rel)] = rel
        return pages, redirects, static

    jp, jr, js = classify(J)
    zp, zr, zs = classify(Z)
    zp_n = {norm(u): r for u, r in zp.items()}
    zr_n = {norm(u): t for u, t in zr.items()}

    inventory = []
    for u, rel in sorted(jp.items()):
        n = norm(u)
        if n in zp_n:
            inventory.append({"url": u, "status": "page", "zola": "/" + zp_n[n]})
        elif n in zr_n:
            inventory.append({"url": u, "status": "page-is-redirect", "zola": zr_n[n]})
        else:
            inventory.append({"url": u, "status": "page-missing"})
    for u, target in sorted(jr.items()):
        n = norm(u)
        if n in zr_n:
            same = norm(zr_n[n]) == norm(target)
            inventory.append(
                {
                    "url": u,
                    "status": "redirect" if same else "redirect-target-differs",
                    "jekyll": target,
                    "zola": zr_n[n],
                }
            )
        elif n in zp_n:
            inventory.append({"url": u, "status": "redirect-is-page", "jekyll": target})
        else:
            inventory.append({"url": u, "status": "redirect-missing", "jekyll": target})
    for u, rel in sorted(js.items()):
        n = norm(u)
        if u in zs:
            same = (
                hashlib.md5(J.files[rel].read_bytes()).digest()
                == hashlib.md5(Z.files[zs[u]].read_bytes()).digest()
            )
            inventory.append(
                {"url": u, "status": "static" if same else "static-differs"}
            )
        else:
            inventory.append({"url": u, "status": "static-missing"})
    known = {norm(x["url"]) for x in inventory}
    extra = sorted(u for u in list(zp) + list(zr) + list(zs) if norm(u) not in known)

    # Page pairs, joined by source file.
    def src_of(site, rel):
        m = site.soup(rel).find("meta", attrs={"property": "markdown-path"})
        return m.get("content") if m and m.get("content") else None

    pairs = []
    zsrc = {}
    for u, rel in zp.items():
        s = src_of(Z, rel)
        if s:
            zsrc[s] = (u, rel)
    for u, jrel in sorted(jp.items()):
        s = src_of(J, jrel)
        zhit = zsrc.get(s) if s else None
        if not zhit and norm(u) in zp_n:
            zhit = (u, zp_n[norm(u)])
        if not zhit:
            continue
        zu, zrel = zhit
        js_, zs_ = J.soup(jrel), Z.soup(zrel)
        jn, zn = content_node(js_), content_node(zs_)
        jw, zw = words(jn), words(zn)
        sm = difflib.SequenceMatcher(None, jw, zw, autojunk=False)
        ratio = sm.ratio() if (jw or zw) else 1.0
        jh, zh = headings(jn), headings(zn)
        diffs = []
        if ratio < 1.0:
            for op, a1, a2, b1, b2 in sm.get_opcodes():
                if op != "equal" and len(diffs) < 6:
                    diffs.append(
                        [op, " ".join(jw[a1:a2])[:160], " ".join(zw[b1:b2])[:160]]
                    )

        def meta(soup, prop):
            m = soup.find("meta", attrs={"property": prop})
            return (m.get("content") or "").strip() if m else None

        def cnt(node, tag):
            return len(node.find_all(tag))

        pairs.append(
            {
                "url": u,
                "src": s,
                "ratio": round(ratio, 4),
                "words": [len(jw), len(zw)],
                "headings": [len(jh), len(zh)],
                "ids_lost": sorted(set(jh) - set(zh))[:20],
                "ids_lost_n": len(set(jh) - set(zh)),
                "links": [cnt(jn, "a"), cnt(zn, "a")],
                "images": [cnt(jn, "img"), cnt(zn, "img")],
                "iframes": [cnt(jn, "iframe"), cnt(zn, "iframe")],
                "pre": [cnt(jn, "pre"), cnt(zn, "pre")],
                "title_same": (js_.title.get_text(" ", strip=True) if js_.title else "")
                == (zs_.title.get_text(" ", strip=True) if zs_.title else ""),
                "desc_same": " ".join((meta(js_, "og:description") or "").split())
                == " ".join((meta(zs_, "og:description") or "").split()),
                "diffs": diffs,
            }
        )

    # Broken internal links/anchors on every real page of each site.
    def broken(site: Site, pages: dict):
        out = defaultdict(list)
        for u, rel in pages.items():
            base = "https://idvork.in" + u
            for href, why in check_links(site, rel, base):
                out[u].append([href, why])
        return out

    jb, zb = broken(J, jp), broken(Z, zp)
    jb_n = defaultdict(set)
    for u, items in jb.items():
        for href, why in items:
            jb_n[norm(u)].add(
                (
                    norm(urljoin("https://idvork.in" + u, href)),
                    unquote(urlsplit(href).fragment),
                    why,
                )
            )
    zola_only, both = defaultdict(list), 0
    for u, items in zb.items():
        for href, why in items:
            key = (
                norm(urljoin("https://idvork.in" + u, href)),
                unquote(urlsplit(href).fragment),
                why,
            )
            if key in jb_n.get(norm(u), set()):
                both += 1
            else:
                zola_only[u].append([href, why])

    # Generated (non-HTML) files: compare what they carry, not their bytes.
    def load_json(site, rel):
        try:
            return json.loads(site.files[rel].read_text())
        except Exception:  # noqa: BLE001
            return None

    def xml_locs(site, rel, tag):
        return {
            norm(m)
            for m in re.findall(rf"<{tag}>([^<]+)</{tag}>", site.files[rel].read_text())
        }

    generated = {}
    if "redirects.json" in J.files and "redirects.json" in Z.files:
        a, b = load_json(J, "redirects.json"), load_json(Z, "redirects.json")
        an = {k: norm(v) for k, v in a.items()}
        bn = {k: norm(v) for k, v in b.items()}
        generated["redirects.json"] = {
            "jekyll": len(a),
            "zola": len(b),
            "differ": sorted(k for k in set(an) | set(bn) if an.get(k) != bn.get(k)),
        }
    for name, key in (("search-titles.json", "u"), ("search.json", "url")):
        if name in J.files and name in Z.files:
            a, b = load_json(J, name) or [], load_json(Z, name) or []
            sa, sb = [norm(x[key]) for x in a], [norm(x[key]) for x in b]
            generated[name] = {
                "jekyll": len(a),
                "zola": len(b),
                "same_order": sa == sb,
                "only_jekyll": sorted(set(sa) - set(sb)),
                "only_zola": sorted(set(sb) - set(sa)),
            }
    for name, tag in (("feed.xml", "link"), ("sitemap.xml", "loc")):
        if name in J.files and name in Z.files:
            a, b = xml_locs(J, name, tag), xml_locs(Z, name, tag)
            generated[name] = {
                "jekyll": len(a),
                "zola": len(b),
                "only_jekyll": sorted(a - b)[:50],
                "only_zola_count": len(b - a),
            }

    status = Counter(x["status"] for x in inventory)
    report = {
        "summary": {
            "jekyll": {"pages": len(jp), "redirects": len(jr), "static": len(js)},
            "zola": {"pages": len(zp), "redirects": len(zr), "static": len(zs)},
            "inventory": dict(status),
            "extra_in_zola": len(extra),
            "pairs": len(pairs),
            "identical_text": sum(p["ratio"] == 1.0 for p in pairs),
            "ratio_ge_0995": sum(p["ratio"] >= 0.995 for p in pairs),
            "ratio_lt_095": sum(p["ratio"] < 0.95 for p in pairs),
            "heading_ids_jekyll": sum(p["headings"][0] for p in pairs),
            "heading_ids_lost": sum(p["ids_lost_n"] for p in pairs),
            "broken_jekyll": {
                k: sum(1 for v in jb.values() for x in v if x[1] == k)
                for k in ("missing", "anchor")
            },
            "broken_zola": {
                k: sum(1 for v in zb.values() for x in v if x[1] == k)
                for k in ("missing", "anchor")
            },
            "broken_in_both": both,
            "broken_zola_only": {
                k: sum(1 for v in zola_only.values() for x in v if x[1] == k)
                for k in ("missing", "anchor")
            },
        },
        "generated": generated,
        "inventory": inventory,
        "extra_in_zola": extra,
        "pairs": sorted(pairs, key=lambda p: p["ratio"]),
        "broken_zola_only": dict(sorted(zola_only.items())),
        "broken_jekyll": dict(sorted(jb.items())),
    }
    json.dump(report, sys.stdout, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Give the Zola output Jekyll's shape.

usage: finish.py <work dir> <out dir> <site url>

Zola writes every page as /x/index.html. Jekyll (permalink: /:title) writes
/x.html, which Pages serves at /x. Keeping Jekyll's shape means URLs, relative
links, back-links.json keys, Pagefind URLs, the JS that reads
location.pathname and every tool that reads _site/*.html behave the same on
both builds, so nothing outside zola/ has to know which generator ran.

Also writes jekyll-redirect-from's stubs, byte-for-byte: /old.html for
`redirect_from: /old`, /old/index.html for `/old/`.
"""

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import lists  # noqa: E402

STUB = """<!DOCTYPE html>
<html lang="en-US">
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <link rel="canonical" href="{u}">
  <script>location="{u}"</script>
  <meta http-equiv="refresh" content="0; url={u}">
  <meta name="robots" content="noindex">
  <h1>Redirecting&hellip;</h1>
  <a href="{u}">Click here if you are not redirected.</a>
</html>
"""

ROUGE_UNKNOWN = {"mermaid", "ascii", "plantuml"}


def code_blocks(html: str) -> str:
    """Zola (highlighting off) writes <pre><code data-lang="x">; kramdown+rouge
    wrapped every block in div.language-x.highlighter-rouge > div.highlight >
    pre.highlight, except languages rouge does not know, which stayed
    <pre><code class="language-x">. Same structure, so the same CSS and JS
    (hljs, mermaid) find the same things. Token colors are not reproduced."""

    def one(m: re.Match) -> str:
        lang = (m.group(1) or "plaintext").split()[0]
        if lang in ROUGE_UNKNOWN:
            return f'<pre><code class="language-{lang}">{m.group(2)}</code></pre>'
        return (
            f'<div class="language-{lang} highlighter-rouge"><div class="highlight">'
            f'<pre class="highlight"><code>{m.group(2)}</code></pre></div></div>'
        )

    return re.sub(
        r'<pre><code(?: data-lang="([^"]*)")?>(.*?)</code></pre>', one, html, flags=re.S
    )


TASK = re.compile(r'<li>(\s*<p>)?<input disabled="" type="checkbox"( checked="")?/>\n?')


def footnotes(html: str) -> str:
    """pulldown-cmark's footnote markup -> kramdown's: the reference is
    sup#fnref:x > a.footnote, the notes a div.footnotes with li#fn:x and a
    reversefootnote backlink."""
    if "footnote" not in html:
        return html
    html = re.sub(
        r'<sup class="footnote-reference" id="fr-([^"]+?)-\d+"><a href="#fn-\1">\[(\d+)\]</a></sup>',
        r'<sup id="fnref:\1" role="doc-noteref"><a href="#fn:\1" class="footnote" rel="footnote">\2</a></sup>',
        html,
    )
    html = re.sub(
        r'<section class="footnotes">\s*<ol class="footnotes-list">(.*?)</ol>\s*</section>',
        lambda m: '<div class="footnotes" role="doc-endnotes">\n<ol>'
        + m.group(1)
        + "</ol>\n</div>",
        html,
        flags=re.S,
    )
    html = re.sub(r'<li id="fn-([^"]+)">', r'<li id="fn:\1" role="doc-endnote">', html)
    return re.sub(
        r'<a href="#fr-([^"]+?)-\d+">↩</a>',
        r'<a href="#fnref:\1" class="reversefootnote" role="doc-backlink">&#8617;</a>',
        html,
    )


def task_lists(html: str) -> str:
    """kramdown's GFM task lists: li.task-list-item holding
    input.task-list-item-checkbox, and the enclosing ul.task-list."""
    if "checkbox" not in html:
        return html

    def item(m: re.Match) -> str:
        checked = ' checked="checked"' if m.group(2) else ""
        return (
            f'<li class="task-list-item">{m.group(1) or ""}<input type="checkbox" '
            f'class="task-list-item-checkbox" disabled="disabled"{checked} />'
        )

    html = TASK.sub(item, html)
    # Mark each <ul> that directly holds a task item.
    out, stack, pos = [], [], 0
    for m in re.finditer(r'<ul>|</ul>|<li class="task-list-item">', html):
        if m.group(0) == "<ul>":
            stack.append(len(out) + 1)
            out += [html[pos : m.start()], m.group(0)]
        elif m.group(0) == "</ul>":
            if stack:
                stack.pop()
            out.append(html[pos : m.end()])
        else:
            if stack:
                out[stack[-1]] = '<ul class="task-list">'
            out.append(html[pos : m.end()])
        pos = m.end() if m.group(0) != "<ul>" else m.end()
    out.append(html[pos:])
    return "".join(out)


# Each page's HTML before its layout, by URL: Jekyll's page.content, which
# convert.render_feeds puts in feed.xml.
CONTENTS: dict = {}


def finish(work: Path, out: Path, site_url: str) -> str:
    site_url = site_url.rstrip("/")
    plan = json.loads((work / "finish.json").read_text())
    flat = set(plan["flat"])
    for url in sorted(flat | set(plan["wraps"])):
        d = out / url.strip("/")
        src = d / "index.html"
        if not src.exists():
            raise SystemExit(f"finish: {url} has no index.html in the Zola output")
        # Zola writes a same-page link [x](#y) as <permalink>/#y, and its
        # permalink is the /x/ this page no longer lives at.
        html = src.read_text().replace(
            f'href="{site_url}{url.rstrip("/")}/#', 'href="#'
        )
        # kramdown+rouge gives inline code a class; Zola writes a bare <code>.
        # Raw HTML <code> (marked by convert.py) stays bare, as kramdown left it.
        html = re.sub(
            r"(?<!<pre>)<code>",
            '<code class="language-plaintext highlighter-rouge">',
            html,
        )
        html = html.replace('<code data-zp-raw="">', "<code>")
        html = code_blocks(html)
        html = lists.apply_html(html)
        html = task_lists(html)
        html = html.replace("<!--zp-raw-->", "")
        html = footnotes(html)
        starts = list(plan.get("ol_starts", {}).get(url, []))

        def ol(m: re.Match) -> str:
            n = int(m.group(1))
            if n in starts:
                starts.remove(n)
                return m.group(0)
            return "<ol>"

        html = re.sub(r'<ol start="(\d+)">', ol, html)
        # Zola marks every external Markdown link rel="external"; kramdown
        # writes a bare <a href>. No Jekyll page has rel="external" itself.
        html = html.replace(' rel="external"', "")
        CONTENTS[url] = html
        if url in plan["wraps"]:
            html = (
                (work / "wrap" / plan["wraps"][url])
                .read_text()
                .replace(plan["mark"], html)
            )
        src.write_text(html)
        if url in flat:
            src.rename(d.with_name(d.name + ".html"))
            if not any(d.iterdir()):
                d.rmdir()
    for alias, target in plan["stubs"].items():
        rel = alias.strip("/")
        if alias in plan["dir_stubs"]:
            dest = out / rel / "index.html"
        elif rel.endswith((".html", ".htm")):
            dest = out / rel
        else:
            dest = out / (rel + ".html")
        if dest.exists():
            continue  # a real page owns the URL, as on Jekyll
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(STUB.format(u=target if "://" in target else site_url + target))
    return f"finish: {len(plan['flat'])} pages flattened, {len(plan['stubs'])} redirect stubs"


if __name__ == "__main__":
    print(finish(Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]))

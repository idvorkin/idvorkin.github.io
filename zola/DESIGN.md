# Zola port: design

Bead `blog-pzp`. Written 2026-11-24, when the port was refreshed onto main.

## What this is for

Preview builds first. A `jekyll serve` holds 227–357 MB and takes about 8 s
to rebuild; the Zola preview holds about 20 MB and rebuilds in about 3 s. The
VM runs many previews at once, so that is the win to collect now.

Replacing Jekyll on idvork.in is a later, separate decision. Nothing here
touches upstream `main` or its Pages settings.

## (a) The port never forks

Jekyll's files are the only source. The toolchain in `zola/` reads them at
build time and writes nothing back, so there is no converted copy to keep in
sync and no sync step to run.

The October port still fell behind, because it had hand-translated every
include and layout into Tera. Seven weeks of main changed 16 includes, added
8 and rewrote the annotate tool, and the build broke. The fix is to stop
translating:

| Layer                                        | October                      | Now                                                                    |
| -------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Liquid in posts                              | regex to Tera component call | rendered by python-liquid (`jekyll_liquid.py`)                         |
| `_includes/*` (59)                           | 44 Tera components           | rendered by Liquid, no port                                            |
| `_layouts/*` + head, menu, scripts, annotate | hand-ported Tera             | rendered by Liquid around a marker; `finish.py` splices Zola's HTML in |
| Markdown                                     | Zola (pulldown-cmark)        | same, after kramdown-to-CommonMark fixes in `convert.py`               |
| Listing pages (5)                            | hand-ported Tera             | still hand-ported; pinned by `ported.lock`                             |
| Output layout                                | `/x/index.html`              | `/x.html`, Jekyll's own, plus its redirect stubs byte for byte         |

So Zola does two jobs: Markdown to HTML, and the five listing pages. A new or
edited include, layout or data file needs no port work.

What can still drift, and what catches it:

- A Liquid construct the engine rejects fails the build with file and line.
- The five listing pages (`tags`, `categories`, `all-posts`, `_d/index`,
  `_ig66/index`) plus `feed.xml` and the search JSON loop over `site.posts`
  and friends. Each page's Jekyll source is hashed in `ported.lock`; a changed
  source warns in previews and fails with `STRICT=1`.
- kramdown and pulldown-cmark disagree on some Markdown. The verification
  gate below catches a page that gets worse.

Because the output has Jekyll's shape, `build_back_links.py`, Pagefind,
`verify-search-index.sh`, the JS bundle and the e2e tests run on it unchanged.
The only files the branch touches outside `zola/` are lint ignores and
Jekyll's `exclude:` list.

## (b) Mirror, and previews for any branch

**Previews (working today).** `zola/preview.sh <checkout> <port>` builds that
checkout, serves it, and rebuilds when a source file changes. The checkout
needs no `zola/` directory, so any branch or PR worktree previews with the
current toolchain. `TS_PORT=<n>` makes links use the tailnet URL. A PR is
`git worktree add` of `refs/pull/N/head`, then the same command.

**Mirror (designed, not created).** A new repo `idvorkin-ai-tools/blog-zola`
whose only content is `zola/mirror/pages.yml`. On a 30-minute cron and on
manual dispatch (with a `ref` input for a branch or PR) it checks out the blog
and the toolchain, runs `build.sh` with back-links and Pagefind, and deploys
to that repo's Pages. It never writes to the blog repo.

One thing blocks it: the site's links are root-absolute (`/assets/...`,
`/magic`, `fetch("/back-links.json")`), and a project Pages site lives at
`/blog-zola/`. `idvorkin-ai-tools.github.io` itself is taken by the explainer
index. So the mirror needs its own hostname: a `zola.idvork.in` CNAME to
`idvorkin-ai-tools.github.io`. That is one DNS record only Igor can add.
Rewriting every root link for a subpath would break the JS that fetches by
absolute path, so that is not planned.

Until the CNAME exists, the tailnet preview of the main checkout is the
mirror: <https://c-5004.squeaker-teeth.ts.net:8448>.

## (c) Shared build

`zola/build.sh` is the one entry point. The mirror workflow, `preview.sh` and
`verify.sh` all call it with different environment:

| Variable      | Meaning                                                      |
| ------------- | ------------------------------------------------------------ |
| `SRC`         | checkout to build (default: the one `zola/` sits in)         |
| `OUT`         | output dir, shaped like `_site`                              |
| `WORK`        | scratch Zola site; one per source, so builds run in parallel |
| `BASE_URL`    | becomes `site.url`, as `jekyll serve` does                   |
| `BACKLINKS=1` | run `build_back_links.py` over the output                    |
| `PAGEFIND=1`  | build the search index                                       |
| `STRICT=1`    | fail on a stale hand port                                    |

The toolchain lives on `zola-port` in the fork until Igor decides to merge
`zola/` into main. That merge is safe for Jekyll (`zola` is in `exclude:`)
and would put the toolchain in every checkout.

## (d) Verification

`zola/verify/verify.sh` builds Zola from the same commit as an existing
Jekyll `_site`, serves both, and:

1. **Renders** every page that is not byte-identical in one Playwright
   session, at 390 and 1200 wide, two pages at a time, niced. The clock,
   `Math.random`, animations, lazy images and device scale are pinned.
   Requests that leave the two local servers go through one on-disk cache, so
   both builds get the same bytes; YouTube, Instagram and analytics are
   blocked. Screenshots are capped at 12,000 px tall.
2. **Diffs pixels** two ways (`compare.py`, numpy; same test as pixelmatch
   with a 24/255 threshold). _Raw_ overlays the two pages. _Aligned_ cuts
   both pages at every heading id they share and compares section against
   section, so one extra line costs one section, not everything below it.
   Pages are ranked and gated on aligned.
3. **Diffs the DOM**: visible text, link set, element ids, images that
   loaded, backlink count, new JS errors. `diff_sites.py` adds the static
   checks: URL inventory, heading ids, broken links and anchors, redirects.
4. **Reports** a page ranked by aligned difference, with the worst section's
   heading (the place a fixer starts) and a Jekyll / Zola / difference image
   for the worst 80 pages.
5. **Gates** as a ratchet. `verify/baseline.json` holds each page's aligned
   percentage. A run fails when a page is more than 0.25 points worse than
   its baseline, or a page with no baseline is above 1%. Fixes lower the
   baseline; nothing drifts back up.

### Numbers, 2026-11-24, upstream main `b5a9884c7`

Static diff (`diff_sites.py`, 500 page pairs):

| Check                                 | Result                                                    |
| ------------------------------------- | --------------------------------------------------------- |
| Output files                          | 1,422 of 1,423 present (`links.jsonp` dropped on purpose) |
| Pages / redirects                     | 500 of 500 / 428 of 428                                   |
| Visible text identical                | 425                                                       |
| Text at least 99.5% the same          | 493                                                       |
| Text under 95%                        | 2 (`/all` build dates, `/asciinema` quotes)               |
| Heading ids kept                      | 6,641 of 6,654                                            |
| Broken links or anchors the port made | 0 (116 are broken in Jekyll too)                          |
| `back-links.json` from Zola output    | 387 of 387 URLs; 12 pages differ in outgoing links        |

Build time on this VM under load: 3.0 s for 491 pages (Liquid and Markdown
fixes 2.4 s, Zola 0.3 s), against 8–13 s for Jekyll.

Pixel diff: PIXEL_NUMBERS_PENDING

## (e) Work split by model tier

The split changed with the design. "Port each include" was the bulk job in
October's plan; it no longer exists.

**Opus (design calls, engine work)**

1. A `site.posts` / `site.d` / `site.pages` / `site.tags` model in
   `convert.py`, so the five listing pages, `feed.xml` and the search JSON
   render through Liquid too. Then nothing is hand-ported and `ported.lock`
   goes away.
2. Each _class_ of kramdown-versus-CommonMark difference, as a rule in
   `convert.py`: attribute lists (`{: ...}`), footnote ids, list looseness,
   smart-quote direction, rouge token spans.
3. Incremental preview: convert only the changed file, inotify, live reload.
4. The cutover plan, when Igor wants one.

**Sonnet (bounded fixes against the report)**

Brief: "Read `zola/DESIGN.md`. Open the verify report and take the worst
10 pages nobody has claimed. For each, open its image and its worst section,
find the cause in the Jekyll source and in `zola/.work/content/<page>.md`,
and name the class. If an Opus rule for that class exists, extend it; if the
page is a one-off, fix the rule that misread it. Re-run
`ONLY='<urls>' zola/verify/verify.sh`, then the full run. The baseline may
only go down. Commit on `zola-port`; comment on `blog-pzp` with before and
after percentages."

Also Sonnet: create the mirror repo from `mirror/pages.yml` once the CNAME
exists; a `just zola-serve` recipe and the `/serve` skill update.

**Haiku (bulk reading)**

Triage the report so Sonnet starts from causes, not pixels. One call per
page above 0.1%: the difference image, the text sample and the worst
section's source go in; a label from a fixed list comes out (list spacing,
quotes, footnote, attribute list, code block, include output, table, image
size, other). Direct API calls through the batches endpoint with the advisor
tool, per igor2 `AGENTS.md`: executor `claude-haiku-5-5`, advisor
`claude-opus-5-5`, beta `advisor-tool-2026-03-01`. No agent SDK. The output
is a count per label, which orders the Opus rule work.

Haiku also drafts Jekyll-safe source fixes where a post's Markdown is
ambiguous and both renderers agree once it is not (a missing blank line after
an HTML block). Those are ordinary content PRs for Igor to merge.

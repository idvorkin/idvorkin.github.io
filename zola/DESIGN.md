# Zola port: design

Bead `blog-pzp`. Written 2026-11-24, when the port was refreshed onto main.

## What this is for

Preview builds first, for memory and speed. A `jekyll serve` holds 227–357 MB
per worktree; a Zola preview holds about 100 MB (the watch process with its
page cache, 82 MB, and the static server, 20 MB). The VM runs many previews
at once, so that is the win to collect now.

A one-post edit is served 0.5–0.75 s after the save, against Jekyll's 1.1 s
incremental rebuild (`blog-045`) and 3–4 s for this preview before it cached
pages. A layout, include or data edit rebuilds every page in about 3 s,
against Jekyll's 8.8 s full rebuild. Numbers and method in (c).

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

| Layer                                        | October                      | Now                                                                                         |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| Liquid in posts                              | regex to Tera component call | rendered by python-liquid (`jekyll_liquid.py`)                                              |
| `_includes/*` (59)                           | 44 Tera components           | rendered by Liquid, no port                                                                 |
| `_layouts/*` + head, menu, scripts, annotate | hand-ported Tera             | rendered by Liquid around a marker; `finish.py` splices Zola's HTML in                      |
| Markdown                                     | Zola (pulldown-cmark)        | same, after kramdown-to-CommonMark fixes in `convert.py`                                    |
| Typography                                   | Zola smart punctuation       | off; kramdown's quote and symbol rules (`typography.py`) on the Markdown                    |
| Listing pages (5)                            | hand-ported Tera             | still hand-ported; pinned by `ported.lock`                                                  |
| feed.xml, search JSON, links.jsonp, sitemap  | hand-ported Tera / Zola's    | Jekyll's own Liquid over a `site.posts` model, after Zola (`render_feeds`, `write_sitemap`) |
| Output layout                                | `/x/index.html`              | `/x.html`, Jekyll's own, plus its redirect stubs byte for byte                              |

So Zola does two jobs: Markdown to HTML, and the five listing pages. A new or
edited include, layout or data file needs no port work.

What can still drift, and what catches it:

- A Liquid construct the engine rejects fails the build with file and line.
  One exception, as in Jekyll: a filter the engine does not know passes its
  value through. That is a warning in previews and a failure with `STRICT=1`.
- The five listing pages (`tags`, `categories`, `all-posts`, `_d/index`,
  `_ig66/index`) loop over `site.posts`
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
checkout, serves it, rebuilds when a source file changes and reloads open
pages. The checkout needs no `zola/` directory, so any branch or PR worktree
previews with the current toolchain. `TS_PORT=<n>` makes links use the
tailnet URL. A PR is `git worktree add` of `refs/pull/N/head`, then the same
command.

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
mirror: `https://<vm>.<tailnet>.ts.net:8448` (the exact URL is on the bead).

## (c) Shared build, incremental preview

`zola/build.sh` is the one entry point for a build. The mirror workflow and
`verify.sh` call it with different environment; it runs `build.py` (stage
static files, data, convert, Zola, finish) and then `backlinks.sh` and
Pagefind when asked:

| Variable      | Meaning                                                      |
| ------------- | ------------------------------------------------------------ |
| `SRC`         | checkout to build (default: the one `zola/` sits in)         |
| `OUT`         | output dir, shaped like `_site`                              |
| `WORK`        | scratch Zola site; one per source, so builds run in parallel |
| `BASE_URL`    | becomes `site.url`, as `jekyll serve` does                   |
| `BACKLINKS=1` | run `build_back_links.py` over the output                    |
| `PAGEFIND=1`  | build the search index                                       |
| `STRICT=1`    | fail on a stale hand port or an unknown Liquid filter        |

The toolchain lives on `zola-port` in the fork until Igor decides to merge
`zola/` into main. That merge is safe for Jekyll (`zola` is in `exclude:`)
and would put the toolchain in every checkout.

**The preview** (`preview.sh`, which execs `watch.py`) is one long-lived
process that imports `build.py` and calls the same `build()` on every change,
with a `convert.Cache` kept between calls. A cold `build.sh` passes an empty
cache, so there is one code path and nothing to keep in sync.

- **What is cached.** Each page's conversion (Liquid, the kramdown fixes, its
  layout), reused while three keys match: the page's source bytes; a global
  key over `_config.yml`, `_data/`, `_includes/`, `_layouts/`, `git.json` and
  `BASE_URL`; and a structure key over every page's URL and `redirect_from`
  owner, which `post_url`, collisions and alias stubs read. So a body,
  title or tag edit converts one page; an include, layout, data, permalink
  or redirect edit, or a new or deleted page, converts all of them. Front
  matter parses and the Liquid environment are cached too. The converted
  text stays on disk in `WORK` (`content/`, `wrap/`, `templates/generated/`);
  RAM holds keys and the small per-page facts the site-wide files are
  rebuilt from (tags, stubs, wraps, report). Zola (0.17 s) and `finish.py`
  (0.2–0.3 s) still run over the whole site: Zola has no partial build, and
  the two together are under half a second.
- **Not cached:** the toolchain. A running preview has `zola/*.py` loaded,
  so restart it after editing them. Static staging is not skipped either: it
  takes 0.05–0.09 s, and telling a static file from a page needs each file's
  first line, so a skip rule would be easy to get wrong for little.
- **Watching.** inotify through libc (`watch.py`, no dependency, Linux only):
  the collections, `_includes`, `_layouts`, `_data`, `assets` and `images`
  recursively, and the checkout's root files, not its directories (a main
  checkout holds `.worktrees` and `node_modules`). A burst of events ends
  after 30 ms of quiet; events that land during a build start the next one.
- **Live reload.** After each build (and back-links and the overlay),
  `watch.py` rewrites `$WORK/.built`. `serve.py --reload` adds a small script
  to each HTML response that fetches `/__reload` once a second and reloads
  the page when the stamp changes. A short poll, not a long one: a held
  request per tab would use up HTTP/1.1's six connections per host on a
  local preview and keep Playwright's `networkidle` from settling. It is
  added as the page is served, so the files on disk are the build's own and
  the verify gate sees nothing.

Correctness check (bench worktree of upstream main `07da02a29`, one preview
running): after each of a post body edit, an include edit
(`blob_image.html`), a layout edit (`post.html`), adding a post with a
`redirect_from` and a tag, changing its permalink, deleting it and reverting
everything, the preview's output was byte-identical to a cold `build.sh` of
the same tree (every file but `back-links.json`, which the preview reuses on
purpose). On the reverted preview output, after an include and layout edit
and back, the static checks give the numbers in (d): 426 pages with
identical text, 494 at 99.5% or better, 13 of 6,654 heading ids lost, 74
pages with a different tag structure, 0 broken links or anchors the port
made, 0 inline scripts broken.

Touch-to-served, 2026-11-24: append a line to
`_d/2015-11-11-mind-monsters.md` and time until `/mind-monsters` serves the
finished page with the line (the build's stamp is newer than the save and the
response is not a redirect to the half-built `/x/index.html`). Bench
worktree, preview at nice 19, VM load 0.7–1.0:

| Run | Before (poll, full rebuild) | After (cache, inotify) |
| --- | --------------------------- | ---------------------- |
| 1   | 3.39 s                      | 0.61 s                 |
| 2   | 2.92 s                      | 0.70 s                 |
| 3   | 3.15 s                      | 0.74 s                 |

The rebuild itself took 0.53–0.56 s of that: stage 0.08, convert 0.04 (one
page), Zola 0.17, finish 0.24–0.28. An include or layout edit took 3.0–3.3 s
end to end. Earlier, at VM load around 10, the old loop took 4.5–6.4 s.

The main checkout (757 pages, what :8448 serves) has the same fixed costs a
little higher: a cold build there spends 0.03 s staging, 0.2 s in Zola and
0.37 s in finish, so a one-post rebuild there should land around 0.7 s. That
is an estimate from those steps; the touch timing was not run on Igor's own
checkout. Nothing was measured under heavy VM load.

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
   loaded, backlink count, new JS errors. Three checks need no browser and
   run in seconds, so they are the inner loop for converter work:
   `diff_sites.py` (URL inventory, text, heading ids, broken links and
   anchors, redirects), `verify/skeleton.py` (tag structure of every page,
   and the most common structural difference across the site) and
   `verify/jscheck.cjs` (inline scripts that parse in Jekyll's build but not
   in Zola's).
4. **Reports** a page ranked by aligned difference, with the worst section's
   heading (the place a fixer starts) and a Jekyll / Zola / difference image
   for the worst 80 pages.
5. **Gates** as a ratchet. `verify/baseline.json` holds each page's aligned
   percentage. A run fails when a page is more than 0.25 points worse than
   its baseline, a page with no baseline is above 1%, or a page did not
   render. Updating the baseline only lowers numbers, so a partial run cannot
   shrink it and a regression cannot be blessed by accident.

After a converter change, `verify.sh` re-shoots only the pages whose HTML
changed.

Limits of the pixel check: a page taller than 12,000 px is compared over its
first 12,000 px only; video and iframes are hidden on both sides; both sides
are served the same `back-links.json`; the two legacy stylesheets that
`head.html` loads by absolute URL come from live idvork.in on both sides; and
Jekyll is shot first, so it fills the request cache from the network while
Zola replays it.

### Numbers, 2026-11-24, upstream main `b5a9884c7`

Static (`diff_sites.py`, `skeleton.py`, `jscheck.cjs`; 500 page pairs):

| Check                                 | Result                                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Output files                          | 1,422 of 1,423 present (`links.jsonp` dropped on purpose)                                                                                                                                                     |
| Pages / redirects                     | 500 of 500 / 428 of 428                                                                                                                                                                                       |
| Visible text identical                | 426                                                                                                                                                                                                           |
| Text at least 99.5% the same          | 494                                                                                                                                                                                                           |
| Text under 95%                        | 2 (`/all` build dates, `/asciinema` quotes)                                                                                                                                                                   |
| Pages whose tag structure differs     | 74 (153 before this session's three converter rules)                                                                                                                                                          |
| Heading ids kept                      | 6,641 of 6,654                                                                                                                                                                                                |
| Broken links or anchors the port made | 0 (116 are broken in Jekyll too)                                                                                                                                                                              |
| Inline scripts the conversion broke   | 0                                                                                                                                                                                                             |
| `back-links.json` from Zola output    | 387 of 387 URLs; 12 pages differ in outgoing links                                                                                                                                                            |
| Feeds and search JSON                 | differ (hand-ported templates; `blog-pzp.1`). Since the 2026-11-24 cutover audit: rendered from Jekyll's Liquid; only the order of 12 `_d` docs with quoted dates differs (Ruby sorts String vs Time by path) |

Pixels (492 pages that are not byte-identical copies, 1,968 screenshots, none
failed):

| Aligned difference                   | 390 wide | 1200 wide |
| ------------------------------------ | -------- | --------- |
| Identical, every pixel               | 376      | 399       |
| Under 0.1%                           | 54       | 27        |
| 0.1% to 1%                           | 23       | 44        |
| 1% to 5%                             | 25       | 15        |
| 5% and over                          | 14       | 7         |
| Same page height                     | 427      | 433       |
| Taller than the 12,000 px cap        | 90       | 39        |
| Identical and compared top to bottom | 314      | 374       |

In the browser (984 page-and-width pairs): visible text identical on 796,
links lost on 58, element ids lost on 15, images that loaded differ on 2, new
JS errors on 4. `/vim` is a real one (a literal `<space>` in the post, which
kramdown closes and CommonMark does not). `/` and `/random` throw on HTML
that is byte-identical to Jekyll's; the cause is not established.
`/emotional-lives` was not investigated.

368 pages are identical at both widths and 450 are under 1% at both. The
first sweep, before the three converter rules this session added, had 348
identical at both widths. The worst page is a test page
(`/test/orchestrator-viewer-options`, 49%); the worst real ones are
`/ig66/`, `/side-quests`, `/all` and `/ai-orchestrator` (10–25%).

Noise floor: Jekyll rendered twice, 40 pages, came out identical on 79 of 80
screenshots and 0.017% on the other. The gate's 0.25-point slack is far above
that.

The full sweep took about 100 minutes at nice 19 with two pages at a time on
a VM at load 15–40. A re-run after a converter change re-shot 102 pages in
about 10 minutes.

Build time on this VM under load: 3.0 s for 491 pages (Liquid and Markdown
fixes 2.4 s, Zola 0.3 s), against 8–13 s for Jekyll. With `BACKLINKS=1`,
11–14 s.

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
3. ~~Incremental preview~~: done (`blog-pzp.3`), see (c).
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
size, other). Direct `client.beta.messages.create` calls with the advisor
tool, per igor2 `AGENTS.md`: executor `claude-haiku-5-5`, advisor
`claude-opus-5-5`, beta `advisor-tool-2026-03-01`. No agent SDK. The output
is a count per label, which orders the Opus rule work.

Haiku also drafts Jekyll-safe source fixes where a post's Markdown is
ambiguous and both renderers agree once it is not (a missing blank line after
an HTML block). Those are ordinary content PRs for Igor to merge.

## (f) Cutover audit, 2026-11-24

`~/tmp/agent/notes/2026-11-24-zola-cutover-audit.md` (bead `blog-pzp.4`)
diffs every file of a CI-shaped Jekyll build (`_config.yml,_config_ci.yml`,
`TZ=UTC`) against this toolchain from the same commit. Builds for that
comparison need `JEKYLL_CONFIG=_config.yml,_config_ci.yml TZ=UTC`, as the
cutover workflow will.

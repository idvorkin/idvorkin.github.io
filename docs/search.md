# Search

Search runs entirely in the reader's browser against static files. There is no
search service, no API key, and no quota.

This replaced Algolia in August 2026. The Algolia app had been **blocked** —
every query returned `403 "the application is blocked"` — so site search was
broken in production, and the index was rebuilt manually (`just update-search`)
so it drifted from published content regardless.

## The two engines

| Engine                                              | Job                  | Size on the wire                                  |
| --------------------------------------------------- | -------------------- | ------------------------------------------------- |
| [Pagefind](https://pagefind.app)                    | Full text            | ~200-300KB on first search, ~3KB per result after |
| [MiniSearch](https://github.com/lucaong/minisearch) | Typo-tolerant titles | 14KB lib chunk + 9KB index, lazy                  |

**Why two.** Pagefind shards its index into ~70 chunks and fetches only the ones
a query needs — that is what makes full-text search affordable client side (a
monolithic index of this blog is 1.6MB gzipped). But its typo tolerance is poor:
`"ketlebell"` returns a handful of badly-ranked unrelated pages rather than
nothing, which is worse than no result because it looks like it worked.

MiniSearch fuzzy-matches a title-only index to fix that. It only rescues typos on
words that appear in a _title_ — `"meditaton"` still misses, because no post
title contains "meditation".

Results merge in `searchBlog()`, Pagefind first, deduped by URL.

## Exclusions — read this before changing them

**Excluded content is excluded at INDEX time, not query time.**

Under Algolia the family journal was hidden with a query-time filter
(`NOT tags:family-journal`), so a client-side bug could leak it. Now the content
never enters the index at all. Pagefind only indexes pages carrying
`data-pagefind-body`, and [`_includes/pagefind-attrs.html`](../_includes/pagefind-attrs.html)
decides which pages get it.

Excluded:

- `page.fj` — family journal flag on `_ig66` posts
- `page.collection == 'ig66'` — the whole family journal collection
- `tags: family-journal`
- `page.search_exclude: true` — per-page opt-out in frontmatter
- `site.search.exclude_permalinks` in `_config.yml` — currently `/changelog`,
  `/positive-mitzvahs`, `/negative-mitzvahs`

`scripts/verify-search-index.sh` asserts this holds and runs in CI on every
deploy. A Liquid typo in `pagefind-attrs.html` would otherwise silently start
indexing every family journal entry with no other visible symptom.

## Building the index

```bash
just build-search       # jekyll build + index  (~20s)
just build-search-only  # index only, when _site/ is already current  (~3s)
```

The index is written to **`./pagefind/`** (gitignored), then copied into
`_site/`. It is not written straight into `_site/` because
`jekyll serve --incremental` deletes anything in `_site/` it did not generate —
on every single content edit. Writing to the repo root makes `pagefind/` a normal
static source directory that Jekyll re-copies on every build, so the index
survives the edit loop. (`keep_files` in `_config.yml` covers the plain
`jekyll build` case; it does **not** cover serve rebuilds.)

The index does go stale as you edit content — re-run `just build-search-only` to
refresh it. If it is missing entirely, search degrades gracefully to title-only
rather than erroring.

## Deploy

`.github/workflows/pages.yml` builds the JS bundle, builds Jekyll, runs Pagefind
against `_site/`, verifies the exclusions, and deploys. The index is produced
fresh on every deploy and never committed, so it cannot drift.

This replaced GitHub Pages' native Jekyll build, which had no post-build hook to
run Pagefind in.

> **One-time setup:** repo Settings → Pages → Source must be set to
> **GitHub Actions**. Until that is flipped the workflow runs green but the live
> site still comes from the native build.

## Code

- [`src/search.ts`](../src/search.ts) — both engines, merge, rendering
- [`search-titles.json`](../search-titles.json) — Liquid template generating the title index
- [`_includes/pagefind-attrs.html`](../_includes/pagefind-attrs.html) — index-time exclusions
- [`scripts/verify-search-index.sh`](../scripts/verify-search-index.sh) — CI guard
- `index.md` — homepage search UI
- `_includes/site-menu.html` — nav autocomplete

The autocomplete UI is still `@algolia/autocomplete-js`. That is only the widget
shell — it is source-agnostic and does not talk to Algolia's service. Keeping it
avoided rewriting the search UX wholesale.

## Escape hatches

To keep one page out of search, add to its frontmatter:

```yaml
search_exclude: true
```

To check what is actually indexed:

```bash
just build-search
./scripts/verify-search-index.sh
```

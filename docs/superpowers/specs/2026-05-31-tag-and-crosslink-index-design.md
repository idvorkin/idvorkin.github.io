# Tag & Cross-Link Index — Design

- **Date:** 2026-05-31
- **Status:** Draft, pending Igor's review
- **Author:** Claude + Igor

## Problem

The blog has 341 published posts but the connective tissue between them is thin
and inconsistent:

- **Tags are sparse and noisy.** Only 132 / 253 `_d` posts carry frontmatter
  tags, across 68 unique values with heavy synonym drift
  (`emotional intelligence` ×43 vs `emotional-intelligence` ×2 vs
  `emotional-health` ×4 vs `emotion` ×6; `how igor ticks` ×45 vs
  `how-igor-ticks` ×2).
- **Cross-links are ad hoc.** `back-links.json` records the existing directed
  link graph, but there's no systematic view of which topically-adjacent posts
  _should_ link to each other and don't.

We want to **understand what every post is about**, then use that understanding
to (a) populate clean tags, (b) surface "related posts," and (c) flag missing
cross-links — all as a **refreshable** artifact that re-runs cheaply as the blog
grows.

## Goal

A regenerable index — the `build_back_links.py` pattern — that for all 341
published posts produces:

1. Clean, consistent **tags** (in a sidecar to start).
2. A **related-posts** map and named **topic clusters**.
3. A ranked **missing-cross-link report**.

## Context / existing infrastructure (reuse, don't rebuild)

- **`/tags` already exists** (`tags.html`): a pure-Liquid archive that reads
  `tags:` from each post's frontmatter, dedupes, and renders a tag cloud +
  per-tag post lists. `_includes/tags.html` renders a post's tags inline. The
  _page_ is built; what's missing is clean _data_.
- **`back-links.json` → `url_info`**: for every published URL, holds `title`,
  `description`, `doc_size`, `markdown_path`, `last_modified`, and the full
  `incoming_links` / `outgoing_links` lists. The current cross-link adjacency is
  available for free.
- **Corpus:** `_d/` (253 evergreen essays), `_posts/` (37 dated, mostly book
  notes), `_td/` (51, 28 published tech notes). 341 published URLs total.
- **Embedding stack:** no infra yet, but the dev machine supports `fastembed` +
  `sqlite-vec` (named in global CLAUDE.md; `nice` + thread-cap recipe in the
  dev-machine fragment).

## Decisions

| Decision      | Choice                                                    | Rationale                                                                                                                |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Scope         | All 341 published URLs                                    | Igor's call — comprehensive                                                                                              |
| Engines       | Two parallel tracks (embeddings + LLM), then fuse         | Independent signals cross-validate                                                                                       |
| Tag storage   | **Sidecar first**, not frontmatter                        | No 341-file frontmatter diff; low-risk first pass. Wiring `/tags` to read the sidecar is deferred                        |
| Embeddings    | **Local** `fastembed`, `BAAI/bge-small-en-v1.5` (384-dim) | Free + offline regen (the explicit requirement); 341 docs is tiny; quality gap negligible at this scale; swappable later |
| Orchestration | `Workflow` multi-agent                                    | Igor opted into "lots of sub-agents"                                                                                     |
| Spec location | `docs/superpowers/specs/` (committed)                     | Matches existing convention                                                                                              |

## Non-goals (YAGNI)

- No new index/landing pages — reuse the existing `/tags`.
- No automatic frontmatter edits in the first pass (sidecar only).
- No section-level embedding chunking initially — page-level (one vector per
  post). Revisit only if specific long essays are clearly multi-topic.
- No auto-applied cross-link edits — the report is the deliverable; applying is a
  separate, later decision.

## Architecture

### Track E — Embeddings (deterministic, quantitative)

A Python script (the `build_back_links.py` analog), not agents.

1. **Extract** clean page-level text per post (strip frontmatter, includes, TOC,
   nav) from `_site/` HTML or markdown source.
2. **Embed** each post with `fastembed` (`BAAI/bge-small-en-v1.5`) under
   `nice -n 19 ionice -c 3` + `OMP/ORT/MKL_NUM_THREADS=2`. Store vectors in a
   `sqlite-vec` DB keyed by permalink, with a **content hash** per post so a
   refresh re-embeds only changed posts.
3. **kNN** per post → `related[permalink]` (neighbors + scores).
4. **Cluster** the kNN graph (HDBSCAN or Leiden) → emergent topic groups
   (unlabeled at this stage).
5. **Gap candidates** = pairs with cosine ≥ threshold **AND** no existing link
   in `back-links.json` (checked both directions).

### Track L — LLM tagging (semantic, the sub-agent fleet)

1. **Fan-out** (~40 agents, ~8 posts each): each post → a **topic card** =
   1–2 sentence summary, ~10 proposed tags, named entities
   (books / people / tools / concepts), and current outbound links. Structured
   JSON output (schema-validated).
2. **Consolidate** (the crux): merge ~3,400 raw proposed tags (341 × ~10) + the
   existing 68 frontmatter tags into a clean **canonical vocabulary** (~30–50 tags) with a
   synonym map. Use a judge panel — this is the riskiest judgment call.
3. **Re-tag**: assign each post 3–6 canonical tags drawn from the vocab.

### Fusion

- **Name clusters**: an LLM labels each embedding cluster from its members'
  titles/summaries, aligned to the canonical vocab (target: one cluster ≈ one
  tag).
- **Cross-validate gaps**: a gap is **strong** when _both_ signals fire — high
  cosine (E) **and** shares ≥2 canonical tags or a named entity (L). An LLM
  judges the top strong pairs: _should A link to B? anchor text? where?_ —
  adversarial verify to kill false positives. Single-signal gaps are reported
  separately, lower confidence.

## Artifacts

1. **`topics.json`** (committed sidecar) — the human-facing derived index:
   embedder metadata, canonical vocab + synonym map, named clusters, and per-post
   `{summary, tags, entities, related[], content_hash}`.
2. **`embeddings.db`** (`sqlite-vec`, gitignored — regenerable) — the raw
   vectors.
3. **Cross-link report** (markdown) — ranked, per post "should link X / Y / Z"
   with anchor suggestion, confidence, and which signals agreed.
4. **Regenerate script** — one entry point that rebuilds E, L, and fusion;
   content-hash short-circuits unchanged posts.

### `topics.json` shape (sketch)

```json
{
  "generated_at": "2026-05-31T...",
  "embedder": {
    "model": "BAAI/bge-small-en-v1.5",
    "dim": 384,
    "source": "local"
  },
  "vocab": [
    {
      "tag": "emotional-intelligence",
      "aliases": ["emotional intelligence", "emotion", "eq"],
      "count": 41
    }
  ],
  "clusters": [
    {
      "id": 3,
      "label": "Emotional Health & Meditation",
      "tags": ["emotional-intelligence", "meditation"],
      "members": ["/siy", "/happy"]
    }
  ],
  "posts": {
    "/untangled": {
      "title": "Untangled: ...",
      "summary": "...",
      "tags": ["parenting", "book-notes", "emotional-intelligence"],
      "entities": ["Lisa Damour", "Untangled (book)"],
      "related": [{ "url": "/emotional-lives", "score": 0.83 }],
      "content_hash": "sha256:..."
    }
  },
  "crosslink_gaps": [
    {
      "from": "/untangled",
      "to": "/emotional-lives",
      "cosine": 0.83,
      "shared_tags": ["parenting", "emotional-intelligence"],
      "entities": [],
      "verdict": "recommend",
      "anchor": "...",
      "confidence": 0.9
    }
  ]
}
```

## Orchestration (`Workflow`)

- **Track E**: one deterministic Python embed/cluster step (not agents).
- **Track L**: ~40 catalog agents → consolidation (1–3 agents) → fusion
  (cluster-namers ~30–50, gap-judges top-N), **pipelined** so verification starts
  as each batch's cards land. Concurrency cap ~10–16.
- Track E and Track L run concurrently; fusion is the barrier that needs both.

## Refresh story

- Content-hash per post → re-embed / re-tag only changed posts.
- Embedder is pinned in `topics.json` and swappable: change the model, re-embed,
  regenerate. Vectors (`embeddings.db`) are gitignored and rebuildable.

## Phasing (value early; validate the risky bits first)

- **P0** — Corpus text extractor + `back-links.json` graph parser. Small.
- **P1 (pilot)** — Track L on a ~20-post sample → consolidate → **Igor eyeballs
  the canonical vocab** before scaling. The vocab is the riskiest call; validate
  it cheap.
- **P2** — Scale Track L to 341 + run Track E (embeddings) in parallel.
- **P3** — Fusion: name clusters, cross-validate gaps → report + `topics.json`.
- **P4** — Wrap in the refresh script + document.

## Open questions / deferred

1. **How does `/tags` consume the sidecar?** Deferred (Igor: "will figure it
   out"). Options: a Jekyll data-file (`_data/topics.json` + Liquid in
   `tags.html`), or a build step that writes tags back to frontmatter once the
   vocab is trusted.
2. **Cluster algorithm + thresholds** (HDBSCAN vs Leiden; cosine cutoff for
   gaps) — tune during P2/P3 against real output.
3. **Tags → frontmatter eventually?** Once the canonical vocab is trusted, a
   later pass could write tags into frontmatter (the format `/tags` already
   reads). Out of scope for v1.

## Risks

- **Tag consolidation quality** — the make-or-break step. Mitigated by the P1
  human-eyeball gate and a judge panel.
- **Similarity ≠ "should link"** — two posts can be semantically close yet a link
  adds no reader value. Mitigated by requiring dual-signal agreement + an LLM
  value judgment for strong gaps.
- **Corpus extraction noise** — includes/TOC/boilerplate polluting embeddings.
  Mitigated by extracting from clean text in P0 and spot-checking in P1.

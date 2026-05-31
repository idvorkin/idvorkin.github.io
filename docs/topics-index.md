# Topics Index — Tags, Related Posts & Cross-Link Gaps (Runbook)

**What it is:** `topics.json` — a regenerable sidecar (sibling of `back-links.json`) holding, for every published post: title, 1–2 sentence summary, topic tags, named entities, a content hash, semantic **related posts**, and **cross-link gap candidates**. This is the operational runbook; the design history is in `docs/superpowers/specs/2026-05-31-tag-and-crosslink-index-design.md` and the pilot plan beside it.

> Built 2026-05-31. Status: deep-dive tags ✅, embeddings ✅. Deferred: canonical tag consolidation, LLM-judged cross-link report, refresh-all wrapper, wiring `/tags` to read the sidecar.

## Artifacts

| File                         | Committed?   | What                                                                                        |
| ---------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `topics.json`                | ✅ yes       | the index (336 posts: summary, tags, entities, content_hash, related[], + `crosslink_gaps`) |
| `tmp/topics/corpus.json`     | ✗ gitignored | cleaned per-post prose (extractor output)                                                   |
| `tmp/topics/all_cards.json`  | ✗ gitignored | raw LLM topic cards (tagging output)                                                        |
| `tmp/topics/embeddings.json` | ✗ gitignored | Gemini vectors, keyed by url→{hash, vec} (the embed cache)                                  |

The `tmp/` artifacts are all regenerable; only `topics.json` is the durable, committed product.

## Code

| File                     | Responsibility                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `build_topics.py`        | uv/typer CLI: `extract`, `pilot-sample`, `build-sidecar`, `embed`                   |
| `topics_extract.py`      | markdown → clean prose (strips frontmatter, includes, vim-TOC, comments, link URLs) |
| `topics_graph.py`        | bidirectional "is A already linked to B?" from `back-links.json` `url_info`         |
| `topics_sidecar.py`      | `topics.json` dataclass schema + JSON round-trip                                    |
| `topics_embed.py`        | Gemini embeddings + cosine kNN + cross-link gap detection (+ same-series filter)    |
| `topics_tag_workflow.js` | the multi-agent tagging Workflow (one agent per post)                               |
| `test_topics_*.py`       | unit tests for the deterministic parts                                              |

Run tests: `uv run --with pytest --with numpy pytest test_topics_extract.py test_topics_graph.py test_topics_sidecar.py test_topics_embed.py -v`

## How to regenerate (the pipeline)

```bash
# 1. Extract: clean every post's markdown into prose
uv run ./build_topics.py extract                 # -> tmp/topics/corpus.json (336 posts)

# 2. Tag (deep dive): one sub-agent per post -> {summary, tags, entities}
#    Run topics_tag_workflow.js via the Claude Code `Workflow` tool (NOT a shell script).
#    It returns {count, cards}; save the cards array to tmp/topics/all_cards.json.
#    ~336 agents, ~9.6M tokens, ~22 min. See "How tags were created" below.

# 3. Build sidecar: join cards + titles + content hashes into topics.json
uv run ./build_topics.py build-sidecar           # -> topics.json (no embeddings yet)

# 4. Embed + related + gaps (needs GOOGLE_API_KEY with the Generative Language API)
uv run ./build_topics.py embed                   # default threshold 0.75; --threshold/-k tunable
#    Writes related[] for every post + crosslink_gaps + embedder metadata into topics.json.
#    Content-hash cached: re-running only re-embeds posts whose text changed. ~$0.08 for 336.
```

## How tags were created (the deep dive)

- One Claude sub-agent **per post** (336 total), fanned out by `topics_tag_workflow.js` via the `Workflow` tool. Each agent reads the post's cleaned text from `tmp/topics/corpus.json` (capped 16k chars) and returns a schema-validated **topic card**: a 1–2 sentence summary, 6–12 lowercase-hyphenated tags, and named entities (books/people/tools/companies/concepts).
- Output is **raw** tags — **1,753 distinct** across 336 posts. Canonical consolidation (collapsing to ~50 clean tags + a synonym map, which lights up `/tags`) is **deferred** by decision — do that as a separate pass over `all_cards.json`.
- Gotcha that bit us twice: the `Workflow` tool's `args` payload arrived **stringified**, and a top-level array schema on a "discover" agent failed. Fix both by **inlining constants** in the script (see `topics_tag_workflow.js`) and using **object** schemas.

## How embeddings were done

- **Provider:** Google **Gemini `gemini-embedding-001`** via the `google-genai` SDK, reading `GOOGLE_API_KEY`. Task type **`SEMANTIC_SIMILARITY`**, `output_dimensionality=1536` (MRL-truncated from 3072 — truncated vectors are **not** normalized by the API, so we **L2-normalize client-side**). Input capped at 6000 chars (the model's limit is ~2048 tokens).
- **Related posts:** cosine **kNN** (k=8) over the normalized vectors.
- **Cross-link gaps:** pairs with cosine ≥ threshold that are **not already linked** either direction (checked against `back-links.json`), with **same-series template pairs filtered** (e.g. `/timeoff-2021-12 ↔ /timeoff-2022-02`, `/y24 ↔ /y25`). Tiers from the first run: 33 gaps ≥0.85, 135 ≥0.83, 675 ≥0.80.
- **Why Gemini (not local / not OpenAI):** researched May 2026 — OpenAI's `text-embedding-3-large` is no longer SOTA; Gemini tops English MTEB and the `GOOGLE_API_KEY` was already present. Comparison page generated at `tmp/embeddings-compare.html` (transient). Original spec said local `fastembed`; **we switched to the Gemini API at Igor's direction** — this runbook is the source of truth over the spec on that point.

## Querying the index (example)

Semantic search "what posts do I have on X" = embed the query with the **same** task/dim/normalization, cosine against the cached vectors in `tmp/topics/embeddings.json`, rank. Combine with a tag/summary keyword match for precision. (This is how the "writing & storytelling" and "Made to Stick" lookups were answered.)

## Deferred / next steps

1. **Canonical tag consolidation** — collapse the 1,753 raw tags to ~50 + synonym map; write canonical tags back into `topics.json` (and eventually frontmatter) so `/tags` is clean.
2. **LLM-judged cross-link report** — for the high-confidence gaps, have an agent decide "should A link B? where? anchor text?" before anyone edits posts.
3. **Refresh-all wrapper + `/tags` wiring** — one command that runs the whole pipeline; decide whether `/tags` reads the sidecar (`_data/topics.json` + Liquid) or tags get written to frontmatter.

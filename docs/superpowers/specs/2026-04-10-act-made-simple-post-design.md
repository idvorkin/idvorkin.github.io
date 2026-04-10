# Design: Blog Post on *ACT Made Simple* (Russ Harris)

**Date:** 2026-04-10
**Branch:** `add-act-made-simple`
**File to create:** `_d/act.md` (permalink `/act`)
**Source:** `~/gits/raw-ebooks/md/ACT-Made-Simple.md` (853KB, 8,172 lines)

## Goal

Produce a two-part blog post summarizing Russ Harris's *ACT Made Simple*, the canonical practitioner introduction to Acceptance and Commitment Therapy (ACT). The post serves two purposes for Igor:

1. A distilled reference he can return to — the six core processes of ACT, the key metaphors, the practices worth lifting into his life
2. A chapter-by-chapter index of the book so he can jump back to the original text when he wants more depth

The post is drafted by an AI subagent in Igor's voice, matching the book-summary tone of his existing posts (`_d/4dx.md`, `_d/siy.md`). Igor will edit/personalize after the first draft lands.

## Scope Context

- **No existing ACT content on the blog.** Confirmed via grep — the only matches for "ACT" were unrelated (`class-act-*.md`). `_d/religion.md` is the single file containing any adjacent ACT vocabulary.
- **ASIN infrastructure partially exists.** `_data/asins.json` already has entries for two adjacent ACT books: *A Liberated Mind* (Hayes, B07LDSPRYM) and *ACT with Love* (Harris, B0CP52YY8F). *ACT Made Simple* needs to be looked up and added.
- **Format precedent is `_d/4dx.md`** — framework-style: frontmatter → opening paragraph → amazon include → TOC → section per concept → personal application → resources.

## Structure of the Post

```
---
layout: post
title: "ACT Made Simple: Acceptance and Commitment Therapy"
author: "Igor Dvorkin"
permalink: /act
tags:
  - book-notes
  - emotional-health
  - mental-health
  - psychology
---

<~3 sentence opening paragraph — what ACT is, why it matters,
why I'm writing this. Plain text, no includes above it,
so it works as the excerpt.>

{% include ai-slop.html percent="90" %}
{% include amazon.html asin="<ACT-MADE-SIMPLE-ASIN>" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->
(generated TOC)
<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Part 1: Key Concepts & My Takeaways

### Psychological Flexibility — the Goal of ACT
### The Problem: Cognitive Fusion & Experiential Avoidance
### The Hexaflex — Six Core Processes
#### 1. Cognitive Defusion
#### 2. Acceptance
#### 3. Contact with the Present Moment
#### 4. Self-as-Context (the Observing Self)
#### 5. Values
#### 6. Committed Action
### Metaphors That Land
### Practices I Want to Lift Into My Life

## Part 2: Book Chapters — Table of Contents with Key Ideas

(Book's actual chapter structure; 2-4 sentences per chapter summarizing
the main idea and any tool/exercise introduced in that chapter.)

## Related Posts

(Cross-links to `_d/emotional-health-hold.md`, `_d/siy.md`,
`_d/awareness.md`, `_d/shame.md`, `_d/anxiety.md` as relevant —
the subagent will surface specific matches.)
```

## Voice Reference

The drafting subagent MUST study these files before writing any content:
- `_d/4dx.md` — closest structural match (framework-style book summary)
- `_d/siy.md` — closest topical match (emotional health / psychology book summary)

Voice characteristics to match:
- First person ("I" not "we")
- Direct, practical, no hedge words
- Short paragraphs
- Bullets for enumerable items, prose for concepts
- Personal application woven in ("when I notice X, I..."), not reserved for a single section

## ASIN Lookup

*ACT Made Simple* by Russ Harris is published in two editions. The 2nd edition (New Harbinger, 2019) is the current canonical version. The drafting phase must:
1. Look up the correct ASIN (likely `1684033012` for the 2nd edition paperback, but VERIFY)
2. Add an entry to `_data/asins.json` if missing, using the `/amazon-asin` skill

## Execution Order

1. **Read the source.** Dispatch a subagent with access to `~/gits/raw-ebooks/md/ACT-Made-Simple.md`. Subagent reads the book in ~1500-line chunks via `offset`/`limit` (~6 Read calls), extracts: (a) the six core processes with Harris's definitions and core metaphors for each, (b) the book's actual chapter list with 2-4 sentence summaries per chapter.
2. **Study voice references.** Same subagent reads `_d/4dx.md` and `_d/siy.md` end-to-end before drafting.
3. **Draft the post.** Subagent writes `_d/act.md` following the structure above.
4. **Look up ASIN.** Main agent invokes `/amazon-asin` skill to add/verify *ACT Made Simple* in `_data/asins.json`.
5. **Verify locally.** Start Jekyll if not running (port 4003 was free per earlier check), load `http://localhost:4003/act`, confirm renders without errors.
6. **Run pre-commit.** `prek run --files _d/act.md _data/asins.json` to catch link/format issues.
7. **Commit and push on feature branch.**

## Non-Goals

- **Not creating a general ACT reference across the internet** — this is specifically a summary of *ACT Made Simple*.
- **Not covering ACT's research base or comparison to CBT** — tangential to a practitioner-focused summary.
- **Not adding new backlinks to unrelated posts** — `/find-content` can surface matches later if needed.
- **Not a "living doc"** — this is a one-shot summary. If Igor wants to grow it over time, that's a future decision.

## Risks

- **Voice drift.** Subagent-drafted content may feel impersonal. Mitigation: voice reference files are mandatory inputs, Igor will edit before merge, and the post ships with `ai-slop.html percent="90"` to be honest about provenance (Igor lowers the percentage as he rewrites).
- **ASIN wrong edition.** Mitigation: verify via ASIN lookup, don't guess.
- **Hallucinated book content.** Mitigation: subagent must quote or closely paraphrase from the actual source file, not rely on prior training.
- **Large file handling.** 853KB is ~100KB above a comfortable single Read. Subagent must chunk with offset/limit.

## Success Criteria

- `_d/act.md` exists on branch `add-act-made-simple`
- Post has both parts (key concepts + chapter TOC)
- ASIN resolves to correct book cover
- Page renders at `http://localhost:4003/act` without Jekyll errors
- `prek run` passes
- Commit is on the feature branch, ready for Igor to edit before PR

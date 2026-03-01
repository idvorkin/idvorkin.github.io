# AI Feed Consumer — Design

## Problem

Igor regularly encounters bags of links (newsletters, tweets, blog rolls). The current workflow: open tabs, skim, close most, occasionally think "I should save this," then forget. No capture, no cross-referencing to existing blog content, no taste refinement over time.

## Solution

Two deliverables that work as one system:

1. **Blog post** (`_d/ai-feed.md` at `/ai-feed`) — A public curated reading log with taste profile, tagged entries, and reactions filled in over time.
2. **Claude Code skill** (`.claude/commands/ai-feed.md`) — Two-phase workflow: triage (capture links) and debrief (react to what you read).

## Blog Post Structure

```markdown
---
layout: post
title: "AI Feed — Curated Reading Through Claude"
permalink: /ai-feed
tags:
  - ai
  - productivity
---

[Intro: using AI as a reading partner. The concept of a curated inbox —
GTD capture meets AI triage. Links to /produce-consume and /gtd.]

## What I Gravitate Toward

[Evolving taste profile. Updated as patterns emerge from reactions.
Starts minimal, grows with data. Public — readers can see what I filter for.]

## Feed

### 2026-03-01

- **[Joy & Curiosity #76](https://registerspill.thorstenball.com/p/joy-and-curiosity-76)** — Thorsten Ball on hand-coding vs AI agents
  - _Summary_: When building genuinely new things, manual coding friction forces you to confront assumptions AI agents would silently resolve.
  - _Why I'd like it_: Practitioner reflecting on craft, contrarian angle on AI productivity.
  - _Cross-links_: [Produce vs Consume](/produce-consume), [Cognitive Debt](/ai-coder)
  - _Tags_: #ai-practice #craft #contrarian
  - _Reaction_: [filled in during debrief phase]
```

### Key properties

- Reverse chronological (newest dates first)
- Flat list within each date — no theme bucketing
- Tags on each entry for virtual filtering later
- Each link: source URL, summary, prediction (why Igor would/wouldn't like it), cross-links to existing blog, tags
- Reaction field: empty at triage, filled in at debrief
- Taste profile at top evolves over sessions

## Skill Workflow

### Phase 1: Triage (`/ai-feed <url1> <url2> ...`)

1. **Fetch** — For each URL, fetch content via `/web-browse`. Produce 2-3 sentence summary highlighting core argument.
2. **Cross-link** — Search blog (`_d/`, `_posts/`) for related content. Surface top 2-3 matches with permalinks.
3. **Predict** — Read taste profile from `_d/ai-feed.md`. For each link, predict: "I think you'll [love / find interesting / probably skip] this because [reason]." Present predictions to Igor.
4. **Tag** — Propose tags for each link. Igor can accept, modify, or add tags.
5. **Write** — Append entries to `_d/ai-feed.md` under today's date. If today's date section exists, merge into it. Reaction field left empty.

### Phase 2: Debrief (`/ai-feed debrief`)

1. **Show unread** — Find entries in `_d/ai-feed.md` with empty reaction fields. Present them.
2. **Walk through** — One at a time, show the summary + prediction. Ask: "Did you read this? What resonated? What do you disagree with? Or 'skip'."
3. **Record reactions** — Write Igor's responses into the reaction field for each entry.
4. **Score predictions** — Note which predictions were right (loved vs skipped). Use this to refine the taste profile.
5. **Update taste profile** — Propose edits to the "What I Gravitate Toward" section based on accumulated data. Show diff, Igor approves.

### The taste loop

Phase 1 step 3 (predict) improves over time because Phase 2 step 5 (update profile) refines the signal. The profile is public in the blog post, making the meta-process itself content.

## Cross-links

- `/produce-consume` — The consumption trap; this skill is consumption done right
- `/gtd` — Capture and triage; this is GTD for reading
- `/ai-journal` — Sibling concept; journal is about doing, feed is about reading

## Existing Precedent

- `youtube-content-processor` agent — Similar pattern: fetch external content, summarize, prepare for blog
- AI journal entry format — Date-grouped diary entries with takeaways and links

## What This Is NOT

- Not an RSS reader or feed aggregator
- Not automated — Igor always drives what goes in
- Not private notes — the blog post is public, the taste profile is public
- Not bucketed/categorized — tags only, flat list, filter virtually

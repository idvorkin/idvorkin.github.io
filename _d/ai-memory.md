---
layout: post
title: "AI Memory: Solving Agent Amnesia"
permalink: /ai-memory
redirect_from:
  - /agent-memory
  - /agent-amnesia
tags:
  - ai
  - tools
---

Every morning, your AI agent wakes up with no idea who you are, what it was working on, or why anything matters. Steve Yegge calls this the "50 First Dates" problem — and it's the single biggest obstacle to AI agents being genuinely useful over time. The agent is brilliant in a session, then forgets everything the moment the conversation ends. I've been living with this problem daily through Larry, my [AI life coach](/ai-second-brain), and I've watched the ecosystem slowly converge on solutions. Here's what I've learned.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The 50 First Dates Problem](#the-50-first-dates-problem)
- [The Memory Hierarchy](#the-memory-hierarchy)
  - [Conversation Context — Ephemeral](#conversation-context--ephemeral)
  - [Git History — What Happened, Not Why](#git-history--what-happened-not-why)
  - [CLAUDE.md — Static Project Instructions](#claudemd--static-project-instructions)
  - [MEMORY.md — Learned Observations](#memorymd--learned-observations)
  - [Beads Memories — Cross-Session Persistent Knowledge](#beads-memories--cross-session-persistent-knowledge)
- [Why Markdown Plans Fail](#why-markdown-plans-fail)
- [Beads: Queryable Memory with Structure](#beads-queryable-memory-with-structure)
- [What This Looks Like in Practice](#what-this-looks-like-in-practice)
- [The Memory Gap We Still Haven't Closed](#the-memory-gap-we-still-havent-closed)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The 50 First Dates Problem

In the movie _50 First Dates_, Drew Barrymore's character has no long-term memory. Every morning, Adam Sandler has to re-introduce himself, re-establish the relationship, re-explain everything. It's a romantic comedy. With AI agents, it's Tuesday.

Steve Yegge nails this in his [Introducing Beads](https://steve-yegge.medium.com/) series. Your agent — no matter how smart — starts every session from zero. It doesn't remember the architectural decision you made last week. It doesn't know that the last three times it tried a certain approach, it failed. It doesn't know _why_ you chose one design over another. It just sees code and docs and tries to figure it out fresh.

This isn't a minor inconvenience. It's the difference between having a brilliant consultant who shows up every day with amnesia, and having a colleague who actually learns.

## The Memory Hierarchy

Working with Claude Code daily, I've identified five distinct layers of AI memory, each with different persistence and tradeoffs. Think of it like the memory hierarchy in computer architecture — registers, cache, RAM, disk — except for AI context.

### Conversation Context — Ephemeral

The simplest form. Everything in the current conversation window. The agent knows what you just said, what files it just read, what errors it just hit. This is rich, detailed, and completely gone the moment you close the session.

It's like RAM — fast and useful, zero persistence.

### Git History — What Happened, Not Why

Git commits tell you _what_ changed, _when_, _where_, and _who_ did it. What they almost never capture is _why_. The commit message says "Refactor auth middleware" but doesn't say "because the previous approach caused race conditions under load that we spent three days debugging." The reasoning, the context, the dead ends — all lost.

Agents can read git history, but they're reconstructing a story from its artifacts rather than remembering it.

### CLAUDE.md — Static Project Instructions

This is the project-level instruction file that Claude Code reads at the start of every session. It contains repo structure, key commands, architectural decisions, and conventions. It's the closest thing to "institutional knowledge" — a static document that a human maintains.

My CLAUDE.md for this blog repo includes directory layouts, build commands, deployment info. For my personal knowledge repo, it's a detailed map of how Larry works, journal conventions, and integration points. It works well for things that rarely change. But it's manual — someone has to update it, and it doesn't learn.

### MEMORY.md — Learned Observations

A step up from static instructions. Claude Code can write to MEMORY.md during conversations, storing observations it wants to remember: "Igor prefers Tailscale URLs over localhost," "the todo CLI only works on Mac," "always use reply_to for Telegram threading."

These are small, practical corrections — the kind of thing a colleague learns through a few interactions. The agent proposes them, you approve them, and they persist across sessions. It's like the agent keeping a notebook of "things I learned about working with this person."

The limitation: MEMORY.md is a flat file. It's not queryable, it's not structured, and it grows without pruning. Eventually you hit the same problem as any unstructured note system — too much noise, not enough signal.

### Beads Memories — Cross-Session Persistent Knowledge

[Beads](https://github.com/steveyegge/beads), Steve Yegge's issue tracker built for AI agents (20K GitHub stars, built in 6 days with Claude), adds a dedicated memory layer via `bd remember`. These are explicit, persistent memories that survive across sessions and can be queried:

```bash
bd remember "Auth service requires warm-up on cold start — always add 5s delay in tests"
bd memories   # List stored memories
```

This is different from MEMORY.md in a crucial way: beads memories are part of a structured system that agents can query, filter, and reason about. They're not just a flat list — they exist alongside issues, dependencies, and work history.

## Why Markdown Plans Fail

Here's where Yegge gets spicy. The conventional wisdom for agent coordination is: write a plan in markdown, have the agent follow it. Create `PLAN.md`, list the tasks, let the agent check them off.

Yegge's counterargument, from his experience building and using Beads: **"Your agents simply cannot keep track of work using Markdown files."**

His evidence: 605 stale plan files accumulating across projects. Agents create them enthusiastically, update them sporadically, and abandon them completely. A markdown plan can't be queried ("show me all blocked tasks"), can't track dependencies ("what needs to finish before I start this?"), and can't coordinate across agents ("is anyone else working on the auth module?").

The markdown plan approach is, as Yegge puts it, "a crummy architecture that requires AI to work around its edge cases." But here's the twist — he means that as a _feature_. The whole philosophy of Beads is that the architecture should be messy enough for AI to handle, because AI is good at handling mess. The structure is just enough to make things queryable without being so rigid that agents can't improvise.

## Beads: Queryable Memory with Structure

What makes Beads different from yet-another-project-management-tool is that it was built _by_ agents _for_ agents. Yegge didn't design an ideal issue tracker and then try to get AI to use it. He watched what agents were trying to do — the subcommands they hallucinated, the workflows they assumed existed — and [made them all real](https://steve-yegge.medium.com/).

The result is an issue tracker that captures the _why_, not just the _what_:

- **Dependency graphs** — agents can see what blocks what
- **Cross-session state** — work survives conversation boundaries
- **Multi-agent coordination** — multiple agents can claim, update, and hand off work
- **Queryable structure** — `bd ready` shows available work, `bd show` gives full context
- **Persistent memory** — `bd remember` stores knowledge that agents retrieve automatically

This addresses the core memory problem: agents don't just need to remember _facts_, they need to remember _context_. Why was this decision made? What was tried before? What are the known gotchas? That's what makes the difference between an agent that's productive from minute one and one that spends the first twenty minutes rediscovering things.

## What This Looks Like in Practice

I run Larry as a persistent [claw](/claw) — an AI life coach that processes my daily journals, tracks patterns across weeks, and helps me stay accountable. The memory problem hits me constantly:

**Journal processing**: Larry processes my [daily journals](/ai-journal) from Kindle Scribe handwriting. Without memory, every session starts with Larry having no idea what I wrote yesterday, what themes have been recurring, or what commitments I made. CLAUDE.md gives Larry the journal format and conventions. MEMORY.md gives Larry learned preferences ("skip re-transcription when PDFs are unchanged"). But neither gives Larry the _narrative_ — the fact that I've been struggling with the same dragon for three weeks.

**Weekly reports**: My week reports score life domains on a 5-point scale. A memoryless agent treats each week in isolation. With memory, Larry can say "your health score dropped from 4 to 2 over the last month — what changed?" That requires cross-session memory that connects data points over time.

**Relationship tracking**: I use a script called `meet_folks.py` that tracks people I should meet on various cadences. Larry needs to remember not just the schedule but the _context_ — "last time you met with X, you discussed Y, and they seemed stressed about Z." That's the kind of rich, narrative memory that no flat file captures well.

The hierarchy in action: conversation context handles the immediate task, CLAUDE.md provides the rules, MEMORY.md stores corrections, and structured tools like Beads hold the work state. Each layer compensates for the limitations of the others.

## The Memory Gap We Still Haven't Closed

We're in the awkward middle period. Agents are smart enough to benefit enormously from memory but don't yet have a universal, elegant solution for it. The current approach is a patchwork:

- **Static files** for things that rarely change
- **Auto-memory** for learned preferences
- **Structured tools** for work tracking
- **Conversation** for immediate context

What's missing is the connective tissue — the ability for an agent to seamlessly move between "what are my standing instructions?" and "what happened last Tuesday?" and "what patterns have I noticed over the last month?" without the human having to architect each memory layer manually.

Yegge's bet with Beads is that the answer isn't a perfect memory system — it's a queryable, messy-enough structure that agents can work with and improve over time. Given that he built 100+ subcommands by watching what agents _tried_ to do and making it work, I think he's onto something.

The [AI second brain](/ai-second-brain) vision is ultimately a memory vision: give AI enough context about your life, your work, your patterns, and it becomes genuinely useful across time, not just within a single conversation. We're not there yet. But every layer of memory we add — from CLAUDE.md to Beads — gets us closer to agents that actually _know_ us.

---

_Related: [AI as Your Second Brain](/ai-second-brain) | [Claws: The Next Layer of AI](/claw) | [Igor's AI Journal](/ai-journal)_

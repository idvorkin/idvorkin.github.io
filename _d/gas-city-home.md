---
layout: post
title: "Standing Up Gas City: My Home Wally"
permalink: /gas-city-home
redirect_from:
  - /igor-city
tags:
  - ai
  - tools
  - how
---

This weekend I started a migration: out of hand-rolled config, into [Steve Yegge's Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607). Three steps in order: **migrate** to canonical infrastructure, **birth Barry** (my home mayor, the at-home cousin to [Wally](/wally) at work), and eventually **see if [Larry](/larry) can do it all** the way Wally does at work. The third step is the goal. I'm not there yet — starting with Barry because I don't yet know how well any of this works.

{% include ai-slop.html percent="80" %}

I expected the bring-up to take an hour. It took a Sunday morning, and the gap between those numbers is what this post is about. The post itself is part of the demo: it was written by Larry via Barry, then reviewed by Larry. **You're reading the system describe itself.**

Three lenses on the same Sunday.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What is Gas City — and how I scaffolded one](#what-is-gas-city--and-how-i-scaffolded-one)
- [How Gas City works — beads, agents, and this post itself](#how-gas-city-works--beads-agents-and-this-post-itself)
- [Instead of spending weeks myself, Wally did it](#instead-of-spending-weeks-myself-wally-did-it)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What is Gas City — and how I scaffolded one

Gas City is a multi-agent runtime: a long-lived **mayor** dispatches short-lived **polecats** to do scoped work. State lives in beads (a dependency-aware issue tracker) and Dolt (a versioned database). The whole pattern is the [MEOW stack](/wally#yegges-gas-town-in-one-paragraph) — Mayor, Engineers (Polecats), Oracle, Workers — and at home, the mayor is **Barry**.

Underneath Barry sit the three other crew members that stay alive: **Larry** (my coach claw), **bead-keeper** (issue-tracker custodian), and **watchdog** (health monitor). Polecats spawn on demand into one of five **rigs** — registered project directories, each with its own bead database: `larry-blog` (where this post lives), `chop-conventions`, `settings`, `context-grabber`, `blob`. A `dog`-class polecat scales 0–3 instances. That's the whole topology of `igor-city`.

I had a bad habit on Sunday morning: read the marketing post, skim tutorials 02 through 07, start hand-crafting `pack.toml`. By the time I realized the canonical setup has nine moving files, I'd reverse-engineered seven of them wrong.

Tutorial 01 just runs `gc init scratch-city` and looks at what comes out. That's the whole tutorial. Run it first, and the canonical `pack.toml`, `city.toml`, and per-rig structure scaffold in 10 seconds — then you port your customizations in another 10 minutes, instead of building from a blank page for an hour. Universal version: **scaffold first, customize second.** The scaffolder is the spec. Anything you build from reading docs is a guess.

## How Gas City works — beads, agents, and this post itself

The shortest demo of how Gas City works is the post you're reading. Three beads describe its life:

- `lb-t93` — **draft**. I slung a `larry-blog/editor` polecat with a brief. The polecat read the brief, wrote 728 words, committed to branch `gas-city-home`, closed the bead.
- `lb-1at` — **PR open**. A separate `larry-blog/publisher` polecat read the closed draft, opened PR #594 against `idvorkin/idvorkin.github.io`, closed the bead.
- `lb-7ix` — **revision**. I left five line comments on the PR. A new editor polecat (this one) is rewriting the post around three lenses. Larry — the always-on coach claw — reviews the revision adversarially. The pair runs Claude editor + Codex reviewer; different bias is better adversarial signal than two agents from the same training.

That's the bead lifecycle: a parent ticket gets routed to a rig, a polecat spawns to execute it, the bead closes when the work lands. Crew members hold context across all of it; polecats die when the work dies. **Crew vs polecat is just a deployment knob in `pack.toml`** — `mode = "always"` for crew (Barry, Larry, bead-keeper, watchdog), absent for polecats. The SDK doesn't enforce a type difference, and that's the design point.

Yegge puts the rule directly: **"You should almost never deploy a single-agent pack for a real business process."** Reliability scales with peer review. So treat reliability as a dial — high-stakes work pairs an editor and a reviewer; low-stakes work runs solo. You don't need Gas City to do this. You need the dial.

There's a subtler operational lesson hiding in the same machinery. Every CLI tool I trust ships a `doctor` command — `gc doctor`, `bd doctor`, `up-to-date diagnose.py`. In a probabilistic stack, self-diagnostic is non-negotiable. But **`doctor` reports on the schema, not the store**, and that gap will bite you.

Sunday's example: `gc doctor` reported `custom-types:city — all 12 required types registered. ✓`. The supervisor logs reported `bd create: exit status 1: validation failed: invalid issue type: session`. Both true. The schema said `session` was a registered type; the dolt-internal table the `bd` library actually reads from didn't have the row. One-line `INSERT INTO config` against the dolt server, and all four named sessions transitioned `reserved → active` in 30 seconds. **Doctor checks what the spec says is true; only the runtime checks what's actually true.** When they disagree, trust the runtime.

## Instead of spending weeks myself, Wally did it

The work this post describes — researching Yegge's stack, scaffolding a city, debugging the schema/runtime gap, drafting and revising the post itself — is exactly the kind of thing I would have spent two weekends on a year ago. This Sunday, **Wally did it**. Third person, because seeing it laid out that way is the readable version.

Wally read the Gas City docs and started writing config. When `gc rig list` returned nothing, Wally noticed the `gc` shell alias was shadowing the binary, and patched my `.zshrc` instead of working around it. I nudged: _"did you actually read tutorial 01, or are you guessing again?"_ Wally went back, ran `gc init`, re-scaffolded from canonical, and saved the rest of the morning.

When the four named sessions stayed stuck in `reserved`, Wally proposed a teardown-and-retry. I pushed back: _"do it, but commit the diagnostic first — next time this happens I want a one-line fix, not a re-init."_ Wally wrote the diagnostic, found the missing config row, fixed it with one INSERT, and filed three upstream bugs with reproductions.

When Wally drafted v1 of this post and started pestering me about whether to also produce a weekly Gas City status report, I said: _"stop asking, that's not the goal — finish the post."_ Wally finished the post. Larry-the-reviewer flagged the intro as too marketing-y. I read v1, left five line comments. Wally — this polecat — is rewriting it now.

The leverage isn't that any single step was magical. It's that each step had a Wally on it, a Larry to review the Wally, a bead to track the work, and a mayor to dispatch the next polecat. **What used to be "I spend a Sunday on this" is now "Wally spends a Sunday on this."** I expected the bring-up to take an hour and was annoyed it took a Sunday morning. Honest accounting: in that Sunday, Wally also drafted, reviewed, and revised a 1,000-word post about it. The hour was for me. The Sunday was for the system.

That's the leverage. Not speed — _delegation to a system that knows how to work_.

---

For the work-side companion — the M2/M1/staff/Odallies framing this home setup mirrors — see [Wally and My Work Gastown](/wally).

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

I built a home version of [Wally](/wally) this weekend. Same MEOW-stack pattern (Mayor / Engineers / Oracle / Workers), different mission. At home the mayor is **Barry**, my coach claw [Larry](/larry) sits on staff, and Wally stays at work. The infrastructure underneath is [Steve Yegge's Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607). I expected the bring-up to take an hour. It took a Sunday morning, and the gap between those two numbers is what this post is about.

{% include ai-slop.html percent="80" %}

Three lessons from the standing-up that aren't Gas-City-specific. They apply to anyone adopting a multi-agent stack.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Don't skip tutorial 01](#dont-skip-tutorial-01)
- [Crew vs polecats: reliability as a dial](#crew-vs-polecats-reliability-as-a-dial)
- [What `gc doctor` doesn't catch](#what-gc-doctor-doesnt-catch)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Don't skip tutorial 01

I have a bad habit. I read the marketing post, skim tutorials 02 through 07, and start hand-crafting config. By the time I realize the canonical setup has nine moving files, I've reverse-engineered seven of them wrong.

Tutorial 01 just runs `gc init` and looks at what comes out. That's the whole tutorial. If I'd run it first, `gc init scratch-city` would have scaffolded the canonical `pack.toml`, `city.toml`, and per-rig structure in 10 seconds. I'd have ported my customizations in another 10 minutes, instead of building from a blank page for an hour.

Universal version: when adopting a new framework, **scaffold first, customize second**. The scaffolder is the spec. Anything you build from reading docs is a guess.

## Crew vs polecats: reliability as a dial

Gas City makes the Wally org-chart concrete with two operating styles:

- A **crew** member is a `[[named_session]] mode = "always"` — a persistent agent. Mayor, watchdog, bead-keeper, Larry. They stay alive. They hold context.
- A **polecat** is the absence of that — a fresh agent for one task that dies when done. Editor polecats. Reviewer polecats. The Odally cousins from the work post.

Both are just deployment knobs in `pack.toml`. Same agent file, different mode. The SDK doesn't enforce a type difference, and that's the design point.

Yegge's [Welcome to Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607) puts the rule directly: **"You should almost never deploy a single-agent pack for a real business process."** Agents catch each other's mistakes. Reliability scales with peer review.

The corollary: treat reliability as a dial. High-stakes work gets pairs or triples. Low-stakes work runs solo. The polecat that drafted this post is paired with a reviewer running on a different model — Claude editor, Codex reviewer — because different bias is better adversarial signal than two agents with the same training. Status reports run solo. Anything that ships gets the pair.

You don't need Gas City to do this. You need the dial.

## What `gc doctor` doesn't catch

Every CLI tool I trust ships a `doctor` command. `gc doctor`, `bd doctor`, `telegram_debug.py doctor`, `up-to-date diagnose.py`. In a probabilistic stack, self-diagnostic is non-negotiable — I [argued for that one](/wally#appendix-challenges) in the Wally post.

But `doctor` reports on the schema, not the store. That's the gap.

Concrete example from Sunday: `gc doctor` reported `beads — store accessible. custom-types:city — all 12 required types registered. ✓`. The supervisor logs reported `bd create: exit status 1: validation failed: invalid issue type: session`.

Both true. The schema said `session` was a registered type. The dolt-internal table the bd library actually reads from didn't have the row. `bd init` had written the yaml; it hadn't propagated to the runtime store. Doctor was checking reachability and config-file shape, not whether the data the running process needs is actually there.

The fix was a one-line `INSERT INTO config` against the dolt server, after which all four named sessions transitioned `reserved → active` in 30 seconds. The principle the fix points at: **doctor checks what the spec says is true; only the runtime checks what is actually true.** Run both. When they disagree, trust the runtime.

I filed three upstream bugs from the bring-up. The honest answer is the system was one config row away from running from minute one. I didn't know which one until I learned to distrust my own diagnostic.

---

For the work-side companion — the M2/M1/staff/Odallies framing this home setup mirrors — see [Wally and My Work Gastown](/wally).

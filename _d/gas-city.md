---
layout: post
title: "Gas City: Beads, Molecules, and the Propulsion Principle"
permalink: /gas-city
tags:
  - ai
  - tools
  - how
  - explainer
---

If you've read [Standing Up Gas City](/gas-city-home), or seen "Gas City" mentioned in [/wally](/wally) or [/igors-claws](/igors-claws), and you want to know what the thing actually _is_ before you stand up your own — this is that post. Three concepts carry the whole design: **beads** (the unit of work), **molecules** (the choreography), and the **propulsion principle** (what keeps the engine running). Each one is plain enough on its own; the leverage is in how they compose.

{% include ai-slop.html percent="80" %}

The source of truth for all of this is [docs.gastownhall.ai](https://docs.gastownhall.ai/). My job here is to translate, not to duplicate — when a section needs the precise definition, I link out.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Beads — the unit](#beads--the-unit)
- [Molecules — the choreography](#molecules--the-choreography)
- [The Propulsion Principle](#the-propulsion-principle)
- [Putting it together — how this post got made](#putting-it-together--how-this-post-got-made)
- [Where to go next](#where-to-go-next)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Beads — the unit

A **bead** is a tracked unit of work — title, description, type, priority, status, optional metadata. Beads carry dependencies (`needs:`), so `bd ready` returns only beads whose blockers are closed. The CLI is `bd`: `bd create` to file one, `bd ready` to see what's actionable, `bd close <id>` when it's done. Underneath it's a [Dolt](https://www.dolthub.com/) database — versioned SQL — so the whole graph is queryable, replayable, and durable across sessions. The `bd` man page is the surface; the storage is the substance.

Beads matter because they're the smallest piece of state that survives a process death. An agent restarts, queries `bd ready`, finds work, and keeps moving. There's no in-memory queue to lose, no chat-log scroll to scan. If a bead exists and isn't closed, somebody — eventually — will pick it up.

## Molecules — the choreography

A single bead does one thing. The interesting work is multi-step: design something, implement it, review it, test it, ship it. That's a **[molecule](https://docs.gastownhall.ai/concepts/molecules/)** — a persistent workflow instance that orchestrates multi-step work, expressed as a graph of beads chained with `needs:`.

The lifecycle has its own vocabulary, and once you see it the rest of the system clicks into place:

- A **formula** is the source template — a TOML file describing the steps, their dependencies, and which agents run each one.
- The formula gets **cooked** into a **protomolecule** — a frozen, immutable plan that won't drift mid-run.
- A protomolecule is **poured** into a live **molecule** — an actual instance of the workflow, with its own beads, its own state, its own clock.
- The molecule's individual **step beads** get created and routed to the right agents.
- A **wisp** is the ephemeral cousin — a molecule that vanishes when it finishes rather than persisting.

The canonical example shipped with Gas City is the **Shiny Workflow**: design → implement → review → test → submit. Five steps, five beads, one molecule. Each step blocks on the previous one's close. You can write your own formulas — that's the whole point.

The line that makes molecules feel different from a shell script is from the docs themselves: _**"Molecules ARE the ledger — each step closure is a timestamped CV entry."**_ A shell script runs, exits, and leaves you grepping logs. A molecule records itself as it executes — every step's state transition is a row in Dolt with a timestamp. The workflow and its history are the same object.

Agents talk to each other over a [mail protocol](https://docs.gastownhall.ai/other/beads-native-messaging/) — beads-flavored messages flowing between them, with groups, queues, and channels. For understanding Gas City you can treat that as plumbing; what matters here is that molecules don't need a central scheduler to advance, because each agent watches its own hook.

## The Propulsion Principle

The piece that took me longest to internalize isn't a data structure — it's an operating philosophy. The docs name it **GUPP — the Gastown Universal [Propulsion Principle](https://docs.gastownhall.ai/concepts/propulsion-principle/):**

> _If there is work on your Hook, YOU MUST RUN IT._

That's the whole rule. An agent that finds a bead routed to it on its hook executes immediately — no announcement, no permission cycle, no waiting for a nudge. The metaphor in the docs is a steam engine: agents function like pistons; efficiency depends on continuous execution. Every moment you wait is a moment the engine stalls.

The principle is load-bearing for the **[polecat](https://docs.gastownhall.ai/concepts/polecat-lifecycle/)** — the ephemeral worker that spawns into a rig, claims its bead, does the work, and dies. The polecat-lifecycle doc is unusually blunt about this: _"There is no idle state. Polecats don't exist without work."_ A polecat that's awake but not running isn't waiting — by the design's own definition, it's in a failure state. Stalled or zombie. Pick one.

I learned this concretely [the morning I stood up `igor-city`](/gas-city-home). First-time polecats sat idle on wake — supervisor up, beads routed, polecats spawned, nothing happening. I had to manually `gc session nudge <id> "pick up your bead"` for each one. That's a propulsion-principle violation. Polecats existing in a state the design says cannot exist. The fix — a `polecat-step-0-self-claim` step in the agent prompt that runs `bd ready --json | jq …` immediately on wake — wasn't a feature; it was GUPP re-asserted. The bug was a class of state the system isn't supposed to have. Once you internalize the principle, the fix writes itself.

## Putting it together — how this post got made

The bead lifecycle for the post you're reading:

- **`lb-771`** — draft. A `larry-blog/editor` polecat read the brief, surveyed the related posts, wrote the explainer.
- **Reviewer pair** — slung after the PR opens. Different polecat, different bias, adversarial pass on distill-don't-accrete and voice.
- **Igor** — final reviewer, owns the merge.

Three nodes. The graph stays in Dolt. Auto-convoys group related beads so the reviewer can't run before the editor closes. The whole sequence is queryable, replayable, durable across sessions — and, because of GUPP, no human had to push any of these agents to start. They woke up, queried their hooks, found work, and ran.

That's the meta-loop my [/gas-city-home](/gas-city-home) post named: the system describing itself, with the description being a worked example of the system. Same shape here, smaller scope.

## The deeper frame: work is the primitive

The cleanest statement of the whole architecture isn't on the docs site — it's in the [AGENTS.md](https://github.com/gastownhall/gascity/blob/main/AGENTS.md) at the root of the source tree. Two lines worth lifting:

> _"ZERO hardcoded roles. The SDK has no built-in Mayor, Deacon, Polecat, or any other role. If a line of Go references a specific role name, it's a bug."_
>
> _"Work is the primitive, not orchestration."_

Read those twice. Most multi-agent systems start by asking "what are the agents?" and bake the answers into the framework. Gas City asks **"what is work?"** and bakes the answer (a bead with dependencies and metadata) into the substrate, then makes everything else — agents, mail, dispatch, health patrol — composable on top. The doc lays out **five irreducible primitives** (Agent Protocol, Beads/Task Store, Event Bus, Config, Prompt Templates) and **four derived mechanisms** (Messaging, Formulas/Molecules, Dispatch, Health Patrol) — with the proof that all four derived shapes compose from the five primitives. Mail is `TaskStore.Create(bead{type:"message"})`. Sling is `find/spawn agent → select formula → create molecule → hook to agent`. None of it requires a special "Mayor" or "Polecat" type in the SDK — those are user configuration.

That's why I keep saying _the unit of distribution is the formula, not the agent_. The agents are configurable. The work shape is the contract.

## Where to go next

- The authoritative docs: **[docs.gastownhall.ai](https://docs.gastownhall.ai/)**. Start with [molecules](https://docs.gastownhall.ai/concepts/molecules/), [architecture](https://docs.gastownhall.ai/design/architecture/), and the [propulsion principle](https://docs.gastownhall.ai/concepts/propulsion-principle/).
- The lived narrative — five upstream bugs, one Sunday morning, one `igor-city`: [Standing Up Gas City](/gas-city-home).
- The work-side companion — same MEOW pattern, different deployment: [Wally and My Work Gastown](/wally).
- The wider claw context — why I'm running multiple AI entities at all: [Igor's Three Claws](/igors-claws).

Formulas are designed to be shared — there's an in-progress registry called **Mol Mall**, npm-for-workflows, where you'll eventually browse and install other people's molecules. The fact that the unit of distribution is the formula, not the agent, is the part of this design I keep coming back to. Most coordination problems aren't about smarter agents; they're about better-shaped work. Gas City picked the work as the shareable artifact. That bet is going to age well.

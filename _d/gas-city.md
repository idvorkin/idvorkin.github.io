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

The way to get more out of AI is to scale your productivity, and — just like humans — agents scale two ways. Scale **up** (vertical): make one agent more capable by giving it better tools and pre-created skills. That's the whole world of [how I chop](/how-igor-chops) — a tuned `CLAUDE.md`, a library of skills, custom CLIs the agent already knows how to drive. Scale **out** (horizontal): run _many_ agents that cross-communicate and coordinate. Scaling out is where you need orchestration, and orchestration is what Gas City is. Beads, molecules, and the propulsion principle are how scale-out actually works under the hood.

{% include ai-slop.html percent="80" %}

This is the hands-on version. If you've read [Standing Up Gas City](/gas-city-home), or seen "Gas City" mentioned in [/wally](/wally) or [/igors-claws](/igors-claws), and you want to know what the thing actually _is_ — and how to start driving it — before you stand up your own, this is that post. Three concepts carry the whole design: **beads** (the unit of work), **molecules** (the choreography), and the **propulsion principle** (what keeps the engine running). Each is plain on its own; the leverage is in how they compose. The source of truth is [docs.gastownhall.ai](https://docs.gastownhall.ai/) — my job here is to translate, not duplicate, so when a section needs the precise definition I link out.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Beads — the unit](#beads--the-unit)
- [Molecules — the choreography](#molecules--the-choreography)
- [The Propulsion Principle](#the-propulsion-principle)
- [Getting started — the mechanics in practice](#getting-started--the-mechanics-in-practice)
  - [The city is just a directory](#the-city-is-just-a-directory)
  - [Agents: crew vs. pool](#agents-crew-vs-pool)
  - [Slinging: putting work on a hook](#slinging-putting-work-on-a-hook)
- [Putting it together — how this post got made](#putting-it-together--how-this-post-got-made)
- [The deeper frame: work is the primitive](#the-deeper-frame-work-is-the-primitive)
- [Where to go next](#where-to-go-next)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Beads — the unit

A **bead** is a tracked unit of work — title, description, type, priority, status, optional metadata. Beads carry dependencies (`needs:`), so `bd ready` returns only beads whose blockers are closed. The CLI is `bd`: `bd create` to file one, `bd ready` to see what's actionable, `bd close <id>` when it's done. Underneath it's a [Dolt](https://www.dolthub.com/) database — versioned SQL — so the whole graph is queryable, replayable, and durable across sessions. The `bd` man page is the surface; the storage is the substance.

Beads matter because they're the smallest piece of state that survives a process death. An agent restarts, queries `bd ready`, finds work, and keeps moving. There's no in-memory queue to lose, no chat-log scroll to scan. If a bead exists and isn't closed, somebody — eventually — will pick it up.

## Molecules — the choreography

A single bead does one thing. The interesting work is multi-step: design something, implement it, review it, test it, ship it. That's a **[molecule](https://docs.gastownhall.ai/concepts/molecules/)** — a persistent workflow instance that orchestrates multi-step work, expressed as a graph of beads chained with `needs:`.

Yegge gave the broader pattern a name: **MEOW — Molecular Expression of Work.** Beads are the atoms; molecules are the chemistry. The whole stack is one bet: if you express work as composable molecules with bead-shaped state, agent orchestration becomes a thin layer on top instead of the main event. Gas City is a working argument that the bet pays off.

The lifecycle has its own vocabulary, and once you see it the rest of the system clicks into place:

- A **formula** is the source template — a TOML file describing the steps, their dependencies, and which agents run each one.
- The formula gets **cooked** into a **protomolecule** — a frozen, immutable plan that won't drift mid-run.
- A protomolecule is **poured** into a live **molecule** — an actual instance of the workflow, with its own beads, its own state, its own clock.
- The molecule's individual **step beads** get created and routed to the right agents.
- A **wisp** is the ephemeral cousin — a molecule that vanishes when it finishes rather than persisting.

The canonical example shipped with Gas City is the **Shiny Workflow**: design → implement → review → test → submit. Five steps, five beads, one molecule. Each step blocks on the previous one's close. You can write your own formulas — that's the whole point.

My own first formula is `blog-backlinks`: cut a fresh worktree off canonical `main`, wait for the background Jekyll build, rebuild `back-links.json`, **verify** the diff is backlinks-only, then open a clean PR or report a no-op. Six steps, each chained on the last with `needs:`. The interesting one is `verify` — a judgment gate that aborts if the change touches any file but `back-links.json`. That step exists because an earlier run cut from the wrong base and opened a 22-file PR; the formula now refuses to do that. The full story is in [The City Wrote This](/gas-city-rig).

The line that makes molecules feel different from a shell script is from the docs themselves: _**"Molecules ARE the ledger — each step closure is a timestamped CV entry."**_ A shell script runs, exits, and leaves you grepping logs. A molecule records itself as it executes — every step's state transition is a row in Dolt with a timestamp. The workflow and its history are the same object.

Agents talk to each other over a [mail protocol](https://docs.gastownhall.ai/other/beads-native-messaging/) — beads-flavored messages flowing between them, with groups, queues, and channels. For understanding Gas City you can treat that as plumbing; what matters here is that molecules don't need a central scheduler to advance, because each agent watches its own hook.

## The Propulsion Principle

The piece that took me longest to internalize isn't a data structure — it's an operating philosophy. The docs name it **GUPP — the Gastown Universal [Propulsion Principle](https://docs.gastownhall.ai/concepts/propulsion-principle/):**

> _If there is work on your Hook, YOU MUST RUN IT._

That's the whole rule. An agent that finds a bead routed to it on its hook executes immediately — no announcement, no permission cycle, no waiting for a nudge. The metaphor in the docs is a steam engine: agents function like pistons; efficiency depends on continuous execution. Every moment you wait is a moment the engine stalls.

The principle is load-bearing for the **[polecat](https://docs.gastownhall.ai/concepts/polecat-lifecycle/)** — the ephemeral worker that spawns into a rig, claims its bead, does the work, and dies. The polecat-lifecycle doc is unusually blunt about this: _"There is no idle state. Polecats don't exist without work."_ A polecat that's awake but not running isn't waiting — by the design's own definition, it's in a failure state. Stalled or zombie. Pick one.

I learned this concretely [the morning I stood up `igor-city`](/gas-city-home). First-time polecats sat idle on wake — supervisor up, beads routed, polecats spawned, nothing happening. I had to manually `gc session nudge <id> "pick up your bead"` for each one. That's a propulsion-principle violation. Polecats existing in a state the design says cannot exist. The fix — a `polecat-step-0-self-claim` step in the agent prompt that runs `bd ready --json | jq …` immediately on wake — wasn't a feature; it was GUPP re-asserted. The bug was a class of state the system isn't supposed to have. Once you internalize the principle, the fix writes itself.

GUPP is the rule each agent obeys. But something has to keep the agents themselves running — start the ones that should be up, restart the ones that died, notice when reality has drifted from the plan. That's a **controller**: a loop holding two pictures of the city side by side. The _desired_ state is computed from your config and your open beads — what _should_ be running. The _actual_ state is whatever the runtime is really doing. The controller's whole job is to keep comparing them and close the gap — spawn what's missing, reap what's orphaned. The docs call this **convergence**, the same idea Kubernetes built its reputation on: declare the end state, and a loop drives toward it in bounded steps instead of one fragile big-bang deploy. (A machine-wide **supervisor** sits above the controllers, tracking every city you run; each controller worries about exactly one.)

That reframe is what finally made propulsion click for me. GUPP keeps each piston firing; the reconcile loop is the governor that keeps the _engine_ from stalling — and the two failure modes are different. My idle-polecat bug was a convergence gap as much as a GUPP one: the controller believed it had hit the desired state, but the actual state held a stalled worker the loop couldn't see. Propulsion isn't one mechanism. It's an agent-side rule and a system-side loop, and the city only moves when both are honest about what's running.

## Getting started — the mechanics in practice

The three concepts above are the theory. Here's what they look like when you actually drive the thing. Three pieces: the city you stand up, the agents you configure, and the slinging that puts them to work.

### The city is just a directory

`gc init` scaffolds one. The wizard asks for a provider and a template; the non-interactive form is `gc init --template minimal --default-provider claude ~/my-city`. What comes out is a plain directory — that's the whole model, a city is a directory on disk. You get a `city.toml` (the declarative city — the desired state the controller reconciles toward), a `pack.toml` (the agent definitions), a `.gc/` runtime dir, and top-level folders for `agents/`, `formulas/`, and `orders/`.

The `city.toml` is short. Mine, trimmed:

```toml
[workspace]
provider = "claude"

[providers.claude]
base = "builtin:claude"

[[rigs]]
name = "blog"
prefix = "bl"
default_branch = "main"

[rigs.imports.blogops]
source = "/home/developer/gits/idvorkin.github.io/_gascity"
```

A **rig** points the city at a repo. The blog rig imports a pack of agents and formulas (`_gascity/`) that lives _in the blog repo_, so the workflow definitions version alongside the content they operate on. The rig inherits the city's bead store, so the blog's own `.beads` is never touched — beads live in the city, the pack lives in the rig.

That `provider` line is doing more than it looks. It names a **runtime provider** — the substrate the agents actually run on. Mine spawns local subprocesses; the same `city.toml` could target tmux sessions, or Kubernetes pods on a cluster, by changing that one block. The city definition — agents, rigs, formulas, the work itself — doesn't know or care where it runs. Provider is a swappable backend, not a rewrite. The work shape is portable; the substrate is a deployment detail.

### Agents: crew vs. pool

Every agent is an `agent.toml`. The whole crew-vs-pool distinction is config, not a class hierarchy. **Crew** stay alive across the city's lifetime — the mayor, a bead-keeper, a watchdog. You mark them in `pack.toml` with `mode = "always"`. **Pool** agents (the polecats) scale from zero: idle, they don't exist; work arrives, one spawns into a fresh worktree, runs, and dies.

My `blogsmith` agent's `agent.toml` is almost nothing:

{% raw %}

```toml
provider = "claude"
work_dir = "{{.RigRoot}}"
```

{% endraw %}

That `{% raw %}{{.RigRoot}}{% endraw %}` resolves to the blog rig's path, so the agent launches _inside_ the blog — which makes `claude` auto-load the blog's `CLAUDE.md` and skills at startup. The agent inherits every convention I've already written down instead of me re-explaining them in a prompt. The pool shape lives in the template it's built from:

{% raw %}

```toml
scope = "rig"
wake_mode = "fresh"
work_dir = ".gc/worktrees/{{.Rig}}/polecats/{{.AgentBase}}"
nudge = "Run gc hook; it checks assigned work first, then routed pool work."
min_active_sessions = 0
max_active_sessions = 5
```

{% endraw %}

`min_active_sessions = 0` is the from-zero part — no work, no session. `max_active_sessions = 5` caps the fan-out. A crew agent sets `max_active_sessions = 1` and never drops to zero. Same schema, different deployment.

### Slinging: putting work on a hook

`gc sling` is how work reaches an agent. The shapes:

```bash
gc sling blog/blogsmith bl-42                    # route an existing bead
gc sling blog/blogsmith "fix the broken anchor"  # text → auto-creates a bead, then routes
gc sling mayor blog-backlinks --formula          # instantiate a formula as a wisp, route its root bead
```

That last one is scale-out in miniature. `blog-backlinks` is marked `phase = "vapor"` — a root-only wisp. Sling it and a from-zero pool wakes, one polecat claims the root bead, runs the six steps in a throwaway worktree, opens the PR, and exits. Worktree, verify, PR, gone. That's the "vapor wisp" shape: a wake signal lights up a pool scaled from zero, the work runs, nothing's left to babysit.

The cross-communication that makes scale-out work is the same [mail protocol](https://docs.gastownhall.ai/other/beads-native-messaging/) — `blog-backlinks`'s last step is `gc mail send mayor` with the PR URL. Mail is just a bead (`type: "message"`), so the same store that holds the work holds the coordination. No separate message bus to run.

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

---
layout: post
title: "Gas City: Orchestration, Not a Smarter Prompt"
permalink: /gas-city
redirect_from:
  - /why-gas-city
  - /gas-city-why
tags:
  - ai
  - tools
  - how
  - explainer
ai_default_image: true
---

Agents scale the same two ways people do. Scale **up**: make one agent more capable with a tuned `CLAUDE.md`, a library of skills, custom CLIs it already knows how to drive. That's the whole of [how I chop](/how-igor-chops). Scale **out**: run many agents that coordinate. Scaling out is where you need orchestration, and [Steve Yegge's Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607) is one filling of [the bricks every orchestrator ends up with](/ai-orchestrator). I already rent [the most expensive brain I can get](/how-igor-chops), so the question I get isn't how a city works but why bother. The short answer: a city isn't a smarter agent. It's the layer that turns _work_ into something durable that many agents can pick up, run, and hand off without me babysitting any of them.

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The ladder I climbed to get here](#the-ladder-i-climbed-to-get-here)
- [What a city is](#what-a-city-is)
- [What it costs](#what-it-costs)
- [Won't the providers just build this in?](#wont-the-providers-just-build-this-in)
- [What I actually run](#what-i-actually-run)
- [Where to go next](#where-to-go-next)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The ladder I climbed to get here

Nobody starts with a city. I got here one rung at a time, and each rung is something breaking.

1. **Just Claude.** One session, one agent, one thing at a time. This is most of my day, and it's great. But the plan lives in the chat scroll and the model's head. Close the session, hit a crash, and it's gone.
2. **Claude plus `CLAUDE.md`.** Now the agent knows my conventions on the way in: how I name branches, that it shouldn't push to main, where things live. Better context, still one agent, still serial. `CLAUDE.md` shapes how the agent thinks; it doesn't remember what I did yesterday.
3. **More than one agent.** [Agents are slow](/ai-cockpit), go-make-coffee slow, so I run several. Throughput goes up and a new problem walks in: I'm an air-traffic controller with no radar. Which one finished? Which one's stuck? That's why I built [the cockpit](/ai-cockpit).
4. **Multi-step work across those agents.** Real work is design, build, review, test, ship, and a high-stakes change wants a _different_ agent reviewing than the one that wrote it. Coordinating that by hand, across slow parallel agents, is where I fall off. The chat scroll can't hold it and neither can I.

Gas City is rung four with the coordination built in. `CLAUDE.md` still runs inside it: the agent that maintains my blog boots with its working directory inside the blog repo, so the blog's own `CLAUDE.md` and skills load without me re-explaining anything. The city tells the agent _what_ to work on and tracks the result; `CLAUDE.md` tells it _how_.

## What a city is

Three ideas carry the design. The project's docs have moved since I first wrote this (they now live at [docs.gascity.com](https://docs.gascity.com/getting-started/how-gas-city-works/)), so the quotes below link to the source files.

**A bead is the unit of work.** Title, description, type, priority, status, dependencies. The CLI is `bd`: `bd create` files one, `bd ready` lists the ones whose blockers are closed, `bd close` finishes one. Underneath is [Dolt](https://www.dolthub.com/), a versioned SQL database, so the whole graph is queryable and survives a process dying. An agent restarts, runs `bd ready`, finds its work, keeps going. No in-memory queue to lose, no scroll to re-read.

**A molecule is the choreography.** Multi-step work as a graph of beads chained with `needs:`. A formula (a TOML template) is cooked into a frozen protomolecule and poured into a live molecule with its own beads and its own clock; a wisp is the throwaway cousin that vanishes when it finishes. Yegge calls the pattern MEOW, Molecular Expression of Work. The line that made molecules feel different from a shell script: [_"Molecules ARE the ledger - each step closure is a timestamped CV entry."_](https://github.com/gastownhall/website/blob/main/docs/src/content/docs/concepts/molecules.md) A script runs, exits, and leaves you grepping logs. A molecule records itself as it executes; the workflow and its history are the same object.

**The propulsion principle keeps it moving.** GUPP, the Gas Town Universal Propulsion Principle: [_"If there is work on your Hook, YOU MUST RUN IT."_](https://github.com/gastownhall/website/blob/main/docs/src/content/docs/glossary.md) An agent that finds a bead routed to it runs it, with no announcement and no permission cycle. The worker built around this is the polecat: it spawns into a worktree, claims its bead, does the work, and dies. [_"There is no idle state. Polecats don't exist without work."_](https://github.com/gastownhall/website/blob/main/docs/src/content/docs/concepts/polecat-lifecycle.md) I learned that the hard way [the morning I stood up my city](/gas-city-home): polecats sat idle on wake until I nudged each one by hand. By the design's own definition that state can't exist, so the fix was a step-zero self-claim in the agent prompt. Once you internalize the principle, the fix writes itself.

Above the agents sits a controller: a loop that holds the desired state (your config plus your open beads) next to the actual state (what's really running) and closes the gap, spawning what's missing and reaping what's orphaned. It's the convergence idea Kubernetes made its name on. GUPP keeps each piston firing; the controller keeps the engine from stalling. My idle-polecat bug was both at once: the controller believed it had converged while a stalled worker sat where it couldn't see.

## What it costs

My [first real workflow](/gas-city-rig) cost about **\$9 and 32 Opus turns to produce a thirteen-line change**. Read in isolation, that's an absurd way to run a script I could type in ten seconds. What sold me was a different run: an agent rebuilt an index, saw a big diff, _read_ it, realized every changed line was build-artifact noise and the link graph was identical, and refused to open the pull request. That judgment is worth an expensive model. The plumbing around it (rebuild, commit, push, open the PR) has no decision in it and wants a cron job.

That's the rule the whole thing turns on: **match the altitude of the tool to the altitude of the decision.** Orchestration earns its keep when the work is plural (many steps, many agents) and carries judgment (something a reviewer would actually catch). For one deterministic task a city is overkill, and pretending otherwise is how you light money on fire. Yegge's version of the same rule: _"You should almost never deploy a single-agent pack for a real business process."_ Reliability scales with peer review, so treat it as a dial: high-stakes work gets a writer and an adversarial reviewer, low-stakes work runs solo.

## Won't the providers just build this in?

They're trying. Claude is growing native multi-agent teams and every harness keeps swallowing more orchestration. A city keeps as inputs the three things the built-in versions bake in. Which model runs a step is a config value, a cheap one for plumbing and the expensive one for the judgment call, where the provider's orchestration assumes their model all the way down. The harness (sub-agents, memory, cross-agent messaging) is yours, so it behaves the same whatever model is underneath. And you can steer it: the behaviors I want are configuration I control, not a black box I'm coaxing. There's a softer reason too. An open stack comes with a community making it better, and that pulls more weight than a feature list admits.

## What I actually run

Two orchestrators. [Larry](/larry) runs on the [one I built](/ai-orchestrator), one block at a time, each block added after something broke. When I want one off the shelf, I use Gas City. [The cockpit](/ai-cockpit) is the human half of the same problem: the city coordinates the work, the cockpit gives me the radar to watch it. In the [8 stages of AI coding](/how-igor-chops#the-8-stages-of-ai-coding), this is what makes stages 7 and 8 a system instead of a pile of terminal tabs.

The reason I keep coming back to Gas City's design is one line from its [AGENTS.md](https://github.com/gastownhall/gascity/blob/88bc729d13bf3239fe5a9c9eba0b35bd235d16d5/AGENTS.md) (the May 2026 version; it has since been rewritten): _"Work is the primitive, not orchestration."_ Most multi-agent systems start by asking what the agents are and bake the answer into the framework. Gas City asks what work is, bakes that into the substrate, and makes the roles configuration: _"ZERO hardcoded roles. The SDK has no built-in Mayor, Deacon, Polecat, or any other role. If a line of Go references a specific role name, it's a bug."_ That's why the unit of distribution is the formula, not the agent. Most coordination problems aren't about smarter agents; they're about better-shaped work.

## Where to go next

- The bring-up story, one Sunday and five upstream bugs, narrated by Larry: [Standing Up Gas City](/gas-city-home).
- The first rig and the receipts, narrated by the agent that ran it: [The City Wrote This](/gas-city-rig).
- The bricks every orchestrator ends up with, and which of mine are hand-rolled: [AI Orchestrators](/ai-orchestrator).
- The human control surface for driving slow parallel agents: [The AI Cockpit](/ai-cockpit).
- Why I run named AI entities at all: [Igor's Three Claws](/igors-claws). The work-side org chart: [Wally](/wally).
- The docs: [docs.gascity.com](https://docs.gascity.com/getting-started/how-gas-city-works/). [DeepWiki](https://deepwiki.com/gastownhall/gascity) has a decent auto-generated tour of the source.

---
layout: post
title: "Why Gas City? Orchestration, Not a Smarter Prompt"
permalink: /why-gas-city
tags:
  - ai
  - tools
  - how
  - explainer
redirect_from:
  - /gas-city-why
alias:
  - /gas-city-why
---

I've got a [Gas City](/gas-city-home) running at home now, and the question I get isn't _how_ it works — it's _why_. I already rent the [most expensive brain I can get](/how-igor-chops), and I've got a stack of `CLAUDE.md` files telling it how I like things done. So what does a city buy me that a good prompt doesn't? The short answer: Gas City isn't a smarter agent. It's the layer that turns _work_ into something durable that many agents can pick up, run, and hand off — without me babysitting any of them. This post is the _why_; the [mechanics](/gas-city) are their own post.

{% include ai-slop.html percent="85" %}

This is the hub for everything I've written about running a city. If you want the parts instead of the argument: the [concepts](/gas-city) (beads, molecules, the propulsion principle), the [bring-up story](/gas-city-home) (one Sunday, five upstream bugs), the [first rig and what it cost](/gas-city-rig) ($9 for a thirteen-line change), and the [cockpit](/ai-cockpit) I drive the whole thing from. This post is the map those hang off of.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The ladder I climbed to get here](#the-ladder-i-climbed-to-get-here)
- [How it's different from `CLAUDE.md`](#how-its-different-from-claudemd)
- [How it's different from just using Claude](#how-its-different-from-just-using-claude)
- [What problem it actually solves](#what-problem-it-actually-solves)
- [When it's worth it — and when it isn't](#when-its-worth-it--and-when-it-isnt)
- [Where this sits in the bigger picture](#where-this-sits-in-the-bigger-picture)
- [Where to go next](#where-to-go-next)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The ladder I climbed to get here

Nobody starts with a city. I got here one rung at a time, and each rung is something breaking:

1. **Just Claude.** One session, one agent, working in a straight line. This is great — it's most of my day. But the state lives in the chat scroll and the model's head. Close the session, lose the laptop, hit a crash, and the plan is gone. There's one opinion in the room, and it runs one thing at a time.
2. **Claude plus `CLAUDE.md`.** Now the agent knows my conventions on the way in — how I name branches, that it shouldn't push to main, where things live. Better _context_. But it's still one agent, still serial, and `CLAUDE.md` doesn't remember what I _did_ yesterday. It shapes how the agent thinks; it doesn't track the work.
3. **More than one agent.** [Agents are slow](/ai-cockpit) — slow like "go make coffee" slow. So I run several at once. Throughput goes up and a new problem walks in: I'm now an air-traffic controller with no radar. Which one finished? Which one's stuck? That's the whole reason I built [the cockpit](/ai-cockpit).
4. **Multi-step work across those agents.** Real work isn't one shot — it's design, build, review, test, ship, and a high-stakes change wants a _different_ agent reviewing than the one that wrote it. Coordinating that by hand, across slow parallel agents, is where I fall off. The chat scroll can't hold it and I can't either.

Gas City is rung four with the coordination built in. Everything below is what that actually means.

## How it's different from `CLAUDE.md`

This is the comparison I get most, so let me be precise: they're not competing. They're different layers, and Gas City runs `CLAUDE.md` _inside_ it.

`CLAUDE.md` is **context** — it's the briefing an agent reads on the way in. It's per-agent and per-session: it tells one agent how to behave, then evaporates when the session ends. It has no idea what work exists, what's done, or who's doing it.

Gas City is **work orchestration** — it's the durable record of what needs doing, what's blocked on what, who it's routed to, and what already happened. It spans agents and sessions and survives a process dying.

The proof that they compose: the [agent that maintains my blog](/gas-city-rig) boots with its working directory _inside_ the blog repo, so the blog's own `CLAUDE.md` and skills load automatically. I didn't re-explain my conventions in the agent's prompt — the city put the agent where the context already lives. `CLAUDE.md` told it _how_ to work; the city told it _what_ to work on and tracked the result.

## How it's different from just using Claude

A single Claude session keeps its state in two places that both vanish: the model's context window and your chat scroll. That's fine until something interrupts it.

Gas City moves the state out of the conversation and into a durable store. The unit is a **[bead](/gas-city)** — a tracked piece of work with dependencies, sitting in a versioned SQL database. An agent can die mid-task, a fresh one can spawn, query "what's ready and routed to me," find the bead, and keep going. There's no in-memory queue to lose and no scroll to re-read.

The other half is the **[molecule](/gas-city)** — multi-step work expressed as a graph of beads. The line from the docs that made it click for me: _"molecules ARE the ledger — each step closure is a timestamped CV entry."_ A shell script runs, exits, and leaves you grepping logs to reconstruct what happened. A molecule records itself as it executes. The workflow and its own history are the same object.

So the difference isn't intelligence. The agents are the same Claude either way. The difference is that the work is durable, queryable, and able to outlive any single agent or session.

## What problem it actually solves

Strip it down and Gas City is solving four things at once, none of which a smarter prompt fixes:

- **Work that survives a crash.** State lives in beads, not in a context window. Restart-proof by design.
- **Choreography that records itself.** Multi-step workflows that you can replay and audit, because the workflow _is_ the log.
- **Reliability through peer review.** Yegge's rule, which I've come to believe: _"You should almost never deploy a single-agent pack for a real business process."_ One agent is one opinion; high-stakes work pairs a writer and an adversarial reviewer. Gas City makes that a config knob instead of a thing I orchestrate by hand.
- **Agents that cost nothing when idle.** Workers scale from zero — a wake signal spins one up, it claims its work, runs, and exits. No pool of agents burning money waiting for something to do.

The deeper bet underneath all four is one line from the source tree: **"Work is the primitive, not orchestration."** Most multi-agent systems start by asking "what are the agents?" and bake the answer into the framework. Gas City asks "what is _work_?", makes that durable, and lets the agents be configuration on top. That's the part I think ages well.

## When it's worth it — and when it isn't

I'll argue the other side, because the honest answer matters more than the pitch.

My [first real workflow](/gas-city-rig) cost about **$9 and 32 Opus turns to produce a thirteen-line change**. Read that in isolation and a city looks ridiculous — an absurd way to run a script I could type in ten seconds. For that one change, you'd be right.

What sold me was a different run: an agent rebuilt an index, saw a big diff, _read_ it, realized every changed line was build-artifact noise and the real content was identical — and **refused to open the pull request**. That judgment call is worth an expensive model. But the plumbing around it — rebuild, confirm, commit, push, open the PR — is deterministic. It has no decision in it, and it wants a `cron` job and a shell script, not Opus turns spent running `git add`.

That's the rule the whole thing turns on: **match the altitude of the tool to the altitude of the decision.** Orchestration earns its keep when the work is _plural_ (many steps, many agents) and carries _judgment_ (something a reviewer would actually catch). For a single deterministic task, a city is overkill, and pretending otherwise is how you light money on fire. I run one anyway because most of my interesting work is plural and judgment-heavy — but I try to keep the dumb parts on cron where they belong.

## Where this sits in the bigger picture

In the [8 stages of AI coding](/how-igor-chops#the-8-stages-of-ai-coding) I keep coming back to, the late stages are the multi-agent era: parallel agents, then specialized agents, then an _orchestrated system_ managing dozens of them. Gas City is the substrate for that top of the ladder — the thing that makes stage 7 and 8 a system instead of a pile of terminal tabs. [The cockpit](/ai-cockpit) is the human half of the same problem: the city coordinates the _work_, the cockpit gives _me_ the radar to watch it.

## Where to go next

- **The mechanics** — beads, molecules, and the propulsion principle, explained: [Gas City: Beads, Molecules, and the Propulsion Principle](/gas-city).
- **The bring-up story** — one Sunday, five upstream bugs, narrated by Larry: [Standing Up Gas City](/gas-city-home).
- **The first rig and the receipts** — what one real run cost and where judgment paid for itself: [The City Wrote This](/gas-city-rig).
- **The human side** — the control surface for driving slow parallel agents: [The AI Cockpit](/ai-cockpit).
- **The work-side version** — the same pattern, deployed for my day job: [Wally and My Work Gastown](/wally).
- **Why I run multiple AI entities at all** — [Igor's Three Claws](/igors-claws).

The authoritative docs live at [docs.gastownhall.ai](https://docs.gastownhall.ai/). My job here is the _why_; they have the _how_ in depth.

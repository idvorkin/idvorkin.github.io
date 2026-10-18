---
layout: post
title: "The CHOP Shop: Chat-Oriented Programming"
permalink: /chop
redirect_from:
  - /ai-coder
ai_default_image: true
tags:
  - ai
  - tools
---

I called it CHOP, Chat-Oriented Programming, before "vibe coding" was a phrase: you tell an agent what you want in plain language, it writes the code, and your job moves up a level to specifying, verifying, and keeping the agents fed. This page is the ideas. The setup, the couch, and the machines are in [How Igor CHOPs](/how-igor-chops); where the ideas came from, and which of my 2024 predictions held up, is in [The CHOP Shop, 2024 to 2026](/chop-history).

{% include ai-slop.html percent="60" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What CHOP Is](#what-chop-is)
  - [From Cheap Computing to Cheap Intelligence](#from-cheap-computing-to-cheap-intelligence)
- [The Loop](#the-loop)
- [Interventions per Hour](#interventions-per-hour)
  - [Don't Be the Junior Developer](#dont-be-the-junior-developer)
- [The Herd: One Agent to a City](#the-herd-one-agent-to-a-city)
- [Rules of Engagement: DRY CHOP](#rules-of-engagement-dry-chop)
- [Guardrails and Gates](#guardrails-and-gates)
  - [Secrets in Chat Logs](#secrets-in-chat-logs)
- [Verification Is the Job](#verification-is-the-job)
- [Smart vs Fast](#smart-vs-fast)
- [Will CHOP Kill the Joy of Coding?](#will-chop-kill-the-joy-of-coding)
- [The Skills That Matter Now](#the-skills-that-matter-now)
- [Where the Rest Went](#where-the-rest-went)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What CHOP Is

The word comes from Steve Yegge's [The Death of the Stubborn Developer](https://gist.github.com/idvorkin/694561bfe1fcc89a0e911255b5183e76): LLMs take the leaf-node tasks (write the library, do the basic update), and the developer's job moves to planning and coordination. The auto-shop metaphor I opened this page with in 2024 still holds in two lines: AI started as the shop hand fetching tools, and now it rebuilds the engine from your spec.

The nice thing about the CHO\* pattern is that it extends. [CHOW](/chow) is Chat-Oriented Writing, and really it's chat-oriented anything: natural-language dialogue with an agent as the primary interface. What the long sessions do to your head, the dopamine and the drain, is its own post: [The Psychology of Vibing](/vibing).

### From Cheap Computing to Cheap Intelligence

Moore's law gave us cheap compute on a two-year cycle. This is cheap intelligence on a cycle of months: kindergarten to PhD in a couple of years, and not one smart agent but as many as you can keep fed. Everything below is a consequence of that.

## The Loop

Every CHOP task I run has the same shape:

1. **Ask.** Usually by voice, usually half-formed. The agent sorts out what I meant.
2. **Write it down.** The task becomes a bead (an issue in [beads](https://github.com/steveyegge/beads)) before any code moves. The bead is the brief an agent reads and the handoff that survives a crash or a context compaction.
3. **Give it a room.** A git worktree per agent, so parallel work never collides.
4. **Run the agent.** A strong model for the ambiguous work, a cheaper one for the mechanical.
5. **Gate it.** Pre-commit hooks, then a review gate that reads the diff the way a reviewer would.
6. **Ship a PR with a preview** I can read on my phone.
7. **Review**, which is most of my time now, and merge.
8. **Close out.** Lessons go back into the conventions so the next session starts smarter.

In 2025 I wrote that the answer to "how to be fast when AI is slow" was probably "source control and multi windows." That turned out right, and it's now boring: a worktree per agent and a multiplexer that knows what an agent is. The concrete version, with tool names and the dated stack, is [A Typical CHOP Session](/how-igor-chops#a-typical-chop-session). Each step is also a block of [my orchestrator](/ai-orchestrator), added after something broke.

## Interventions per Hour

Tesla talks about "percent of drives with interventions." That's the metric for CHOP too: how often you have to take over. Your job is to drive it down. Every friction point (a slow laptop, lost context when you switch machines, fear of letting the agent run) is an intervention, and interventions kill flow.

### Don't Be the Junior Developer

If you notice the AI writing the code and yourself doing the manual testing, you've outsourced the junior developer and hired yourself as the junior tester. Make the AI the junior tester too. The corollary is to always be able to rewind: disposable machines and git mean you can let it run and throw the result away.

## The Herd: One Agent to a City

In August 2025 I wrote "don't feel the need to run four agents": more agents meant more confusion, re-explaining, and merge pain. A year later the herd is nine workspaces with four agents mid-flight, and a city runs role sessions on its own. What changed was tooling, not discipline. The honest shape is a ladder:

1. **One strong agent** with a clear spec and tests, left to run longer between interventions. This is still most of my day.
2. **Parallel agents, each in its own worktree**, with a [cockpit](/ai-cockpit) so you can see which one is blocked, working, or done. Humans aren't built for parallel orchestration; the cockpit is the prosthetic.
3. **A city**: when the work is plural and carries judgment, an orchestrator coordinates the agents and keeps the record outside any one session. [Gas City](/gas-city#the-ladder-i-climbed-to-get-here) is the rung where coordination is built in.

The signs you've climbed too fast haven't changed: sending the wrong command to the wrong agent, forgetting what each one is doing, or feeling stressed. Reduce agents until stress drops and throughput rises, then climb again.

## Rules of Engagement: DRY CHOP

Think of the agent as an eager junior who can learn, but only if you write it down. Instead of repeating yourself in every prompt, keep one source of truth the agent reads on the way in. In 2024 that file was `CONVENTIONS.md` with a `.cursorrules` pointer; today it's `AGENTS.md` in every repo (`CLAUDE.md` is a symlink to it), a shared [chop-conventions](https://github.com/idvorkin/chop-conventions) repo of skills, and a global file assembled from fragments: rules for every machine, rules for this class of machine, rules for this box.

Four habits make it compound:

- **Review conventions more carefully than code.** Bad code affects one feature; a bad convention affects everything generated after it.
- **Let the agent own the conventions.** At the end of a session, a `learn-from-session` pass extracts the durable lessons and writes them back to the right file.
- **Encode how to think, not just what to do.** "Don't glaze me," push back when I'm wrong, doing it right beats doing it fast. Before writing code, climb the laziness ladder: does it need to exist, is it already in the codebase, is it in the standard library, is it one line? A deliberately cut corner gets a comment naming the ceiling and the upgrade path.
- **Keep it short.** Prompt alchemy has a short half-life; the precise begging of 2024 doesn't matter with better models. Project context, commands to run, and where things live do matter. The [Bitter Lesson](/how-igor-chops#making-ai-work-my-way) caveat applies to all of it.

## Guardrails and Gates

Where a repo lives decides who can ship. On my own repos (`idvorkin/*`) branch protection means the agent pushes to a fork and opens a PR; my merge is the gate. On the agent org (`idvorkin-ai-tools/*`) the agent ships and I triage after the fact. The agent has its own GitHub identity and can never push to `main` in my name. [You Pick the Review Gate](/ai-operator#you-pick-the-review-gate) is the longer argument.

Inside that, the gates are code, not promises: pre-commit hooks for the cheap checks, a `git-safe-push` that refuses to push to a branch whose PR already merged, a `pr-hygiene` pass that ranks open PRs by unanswered review feedback before I end a session, and a [no-mistakes](https://github.com/kunchenguid/no-mistakes) gate that runs lint, tests, and a model-judged review checklist before a PR opens. YOLO mode (the agent runs without asking) only makes sense inside those walls and on a machine I can throw away; how that's set up is in [How Igor CHOPs](/how-igor-chops#vm-setup-cattle-not-pets).

### Secrets in Chat Logs

This one still bites. Chat logs capture whatever the agent printed, so a verbose debugging session, a `ps` dump, or a helpful environment listing will put real keys into a transcript, and transcripts get committed. One of mine sat in a public repo for about a year ([the forensics](/ai-journal#my-api-key-was-public-for-a-year)). GitHub's push protection catches some of it:

```text
$ git push
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: Push cannot contain secrets
```

Don't rely on it. Keep secrets out of the environment the agent can see, gitignore or filter session logs, and assume any key that was public is already harvested.

## Verification Is the Job

Far more important than the code is how you know the code does what you want. Software engineers have a name for that: testing. CHOP makes it harder, because vibed code is often correct by evolution rather than design, so an out-of-context change breaks something nobody understood. (I had the same experience on the Windows network stack in 2003.)

So the skill I spend my time on is the eval: can I define what good looks like and measure whether we're there? Tests as specification mean fewer interventions. Once the eval is sharp, the search runs itself: the agent proposes, the eval scores, the winner becomes the next baseline.

{%include summarize-page.html src="/hill-climbing"%}
{%include summarize-page.html src="/ai-testing"%}
{%include summarize-page.html src="/testing"%}

## Smart vs Fast

Some models are smart and some are fast. I'd normally say take the smartest, but if smart means super slow you lose patience and life sucks. So either run the slow ones in the background, or use the dumber, faster one for the mechanical work. Over time "dumb and fast" keeps getting smarter. [Fast Tokens, Wrong Answers](/ai-speed-vs-thinking) is my measurement of how much reasoning the fast ones actually do; the practical form of this trade is the model tiers in [The Brain I Rent](/how-igor-chops#the-brain-i-rent).

![](https://raw.githubusercontent.com/idvorkin/ipaste/main/20251017_134143.webp)

## Will CHOP Kill the Joy of Coding?

_This applies to every vocation, not just programming._

There are two reasons to program. For the love of it: solving a problem, making something from nothing, the craft. Vim key combos are joystick combos in Street Fighter II, a challenge that keeps you sharp. And to get things done: programming as a means to shipping. Most code is the second kind, and most of that will be AI-generated. DHH makes the first case well:

{%include youtube.html src="mTa2d3OLXhg?start=5160" %}

My answer is that the joy shifts; it doesn't disappear. Mastering CHOP is its own craft: the perfect specification, the conventions that compound, orchestrating agents to build things you couldn't build alone. And the flow is real, it just comes from running the loop rather than typing in it. [The Joy Question](/how-igor-chops#the-joy-question) and [The Flow Question](/how-igor-chops#the-flow-question) are the longer version; [all game show, no hammock](/vibing#all-game-show-no-hammock) is the honest counterpoint.

## The Skills That Matter Now

Most of this is picked up from others (there are no unique thoughts), but here's my ordering:

- Specification >> Specification Verification >> Implementation Verification >> Implementation >> Craft
- Verification >> Craft, and Architecture >> Craft
- Entrepreneur >> Technologist; Technical Breadth >> Technical Depth
- Why/What >> How/Who
- AI Usage >> AI Understanding
- Curiosity, because the ground moves every few months and the winners are the ones still learning

You don't need to know the _how_ nearly as much. The key skill is spec and verify, which is closer to PM than to traditional engineering. [The Evolution of Junior Developers](/how-igor-chops#the-evolution-of-junior-developers) and [What's Left in Engineering?](/whats-left) take that further.

{% include summarize-page.html src="/humans-are-underrated" %}

## Where the Rest Went

- **The setup**: models, tools, the couch, the VMs, and a typical session: [How Igor CHOPs](/how-igor-chops).
- **The history**: Cursor, Aider, `CONVENTIONS.md`, SpecStory logs, the 2024 reading notes, and the predictions scored: [The CHOP Shop, 2024 to 2026](/chop-history).
- **Operating the thing**: thinking tokens, on the loop vs in the loop, voice, the skills: [The AI Operator](/ai-operator).
- **The human control surface**: [The AI Cockpit](/ai-cockpit). **The agent control surface**: [AI Orchestrators](/ai-orchestrator) and [Gas City](/gas-city).
- **The writing version**: [CHOW](/chow). **Building understanding instead of prose**: [Explainers](/explainers).

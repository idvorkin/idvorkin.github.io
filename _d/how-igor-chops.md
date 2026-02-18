---
layout: post
title: "Mumbling on My Couch: My CHOP Setup"
permalink: /how-igor-chops
imagefeature: https://raw.githubusercontent.com/idvorkin/ipaste/main/20260101_100048.webp
tags:
  - ai
  - tools
  - how
redirect_from:
  - /igor-chop
  - /my-chop-setup
  - /chop-igor
  - /vibe
  - /vibe-coding
---

I mumble to Claude on my couch while my family wonders who I'm talking to. I vibe code in the car while my son drives. I rent the most expensive brain I can get. This is my CHOP (Chat-Oriented Programming) setup: the infrastructure, the tools, and what I've learned.

{% include image_float_right.html src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20260101_100048.webp" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Brain I Rent](#the-brain-i-rent)
  - [The Most Expensive I Can Get](#the-most-expensive-i-can-get)
  - [Why Not Codex, Gemini, etc.?](#why-not-codex-gemini-etc)
  - [When I Need Speed: Groq](#when-i-need-speed-groq)
  - [When Models Get Smarter](#when-models-get-smarter)
- [Tools of the Trade](#tools-of-the-trade)
  - [The Past: Cursor](#the-past-cursor)
  - [The Present: Claude Code](#the-present-claude-code)
  - [The Future: Multi-Agent Dashboard](#the-future-multi-agent-dashboard)
  - [The 8 Stages of AI Coding](#the-8-stages-of-ai-coding)
- [Notes from the Trenches](#notes-from-the-trenches)
  - [What Works Well - REVIEW THIS WEEKLY!](#what-works-well---review-this-weekly)
  - [What I'm Still Figuring Out](#what-im-still-figuring-out)
- [The Control Panel - For This Human](#the-control-panel---for-this-human)
- [Where I Code](#where-i-code)
  - [The Couch](#the-couch)
  - [The Coffee Shop](#the-coffee-shop)
  - [The Desktop Setup](#the-desktop-setup)
  - [The Walking Treadmill](#the-walking-treadmill)
  - [The Car](#the-car)
  - [Ergonomics](#ergonomics)
- [Making AI Work My Way](#making-ai-work-my-way)
  - [The chop-conventions Repo](#the-chop-conventions-repo)
  - [CLAUDE.md Structure](#claudemd-structure)
  - [MCP Servers and Skills](#mcp-servers-and-skills)
- [My Projects](#my-projects)
  - [Command Line and PWAs](#command-line-and-pwas)
  - [Testing and Evals](#testing-and-evals)
- [The Server Behind the Curtain](#the-server-behind-the-curtain)
  - [Why Not Cloud Environments?](#why-not-cloud-environments)
  - [Hardware Setup](#hardware-setup)
  - [Container Setup](#container-setup)
  - [Network Setup](#network-setup)
- [A Typical CHOP Session](#a-typical-chop-session)
- [Appendix: Origin of a Tool Nerd](#appendix-origin-of-a-tool-nerd)
  - [The Enabling Environment](#the-enabling-environment)
  - [My Relationship with Tools](#my-relationship-with-tools)
  - [Is This a Waste?](#is-this-a-waste)
- [Appendix: Who I Follow](#appendix-who-i-follow)
  - [Simon Willison](#simon-willison)
  - [Steve Yegge](#steve-yegge)
  - [Twitter](#twitter)
- [Appendix: The Long View](#appendix-the-long-view)
  - [What Management Taught Me About AI](#what-management-taught-me-about-ai)
  - [The Evolution of Junior Developers](#the-evolution-of-junior-developers)
  - [Revenge of the SDET](#revenge-of-the-sdet)
  - [Hyper-Personalized Software](#hyper-personalized-software)
  - [The Joy Question](#the-joy-question)
  - [What I'm Betting On](#what-im-betting-on)
- [Appendix: Open Questions](#appendix-open-questions)
  - [What happens when execution is no longer the bottleneck?](#what-happens-when-execution-is-no-longer-the-bottleneck)
  - [What happens post-singularity?](#what-happens-post-singularity)
  - [Is sloppy process okay if agents can clean up the mess?](#is-sloppy-process-okay-if-agents-can-clean-up-the-mess)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include alert.html content="**On terminology:** Before 'vibe coding' became the buzzword, I called this CHOP - Chat-Oriented Programming. The nice thing about the CHO* pattern is it extends naturally: [CHOW](/chow) for Chat-Oriented Writing, and really, Chat-Oriented Anything you want. The core idea is the same: natural language dialogue with AI as the primary interface." style="info" %}

## The Brain I Rent

**The core problem:** Different models have different intelligence, and you get what you pay for. You can get a middle schooler or you can get a university student.

### The Most Expensive I Can Get

Currently I'm using Claude Opus 4.5 on the $200/month plan.

On one hand you might think I'm crazy spending $2,400 a year. On the other hand, imagine having brilliant collaborators who force multiply everything you do, train you up, and basically give you a PhD in whatever you're working on.

### Why Not Codex, Gemini, etc.?

In November 2025, Gemini came out and I was like "Oh my god, I've got to try this, this is awesome." Then the new Codex came out three days later and I was like "Oh my god, I've got to try this, this is awesome." Then Opus 4.5 came out and I was like "Oh my god, I've got to try this, this is awesome."

Then I realized: all I'm doing is spinning between tools that keep leapfrogging each other. I decided to standardize on Claude Code and assume it'll catch up quickly if it ever falls behind.

The one gap: Claude Code can't generate images. I use ChatGPT for that, currently manually. (Note to self: I should write a script to generate images via the API.)

### When I Need Speed: Groq

Sometimes I need really low latency. For those cases I run models served off [Groq](https://groq.com/). They can get down to ~100ms response times, which is pretty awesome for interactive use cases.

(A terminology nit: "Claude" and "ChatGPT" are products, not models. The actual models are Opus, Haiku, GPT-4o, Llama - with version numbers. Groq is an inference provider. Everyone, including me, uses these terms loosely.)

### When Models Get Smarter

Looking at [how fast things are moving](https://idvorkin-how-long-since-ai.surge.sh/?show=tool), a natural question: what happens when models get smarter? For this, read [Situational Awareness](https://situational-awareness.ai/) - it introduces the concept of "OOMs" or orders of magnitude in capability.

Given history, I imagine there will be more OOMs. But honestly, even if there aren't, we're at the point of electricity being invented. Thomas Edison invented it, and then how long did it take to find all the applications? A really long time. We're still early.

## Tools of the Trade

**The core problem:** The tools keep changing. What was state-of-the-art six months ago is now deprecated. How do you invest wisely when the ground keeps shifting?

### The Past: Cursor

It's crazy [how fast AI evolves](https://idvorkin-how-long-since-ai.surge.sh/?show=tool). In 2024, [Cursor was the hot new thing](/chop#cursor-from-amazing-tab-completion-to-the-best-agent). It was really about super-powered tab completion - you'd type a bit and it would complete intelligently. That model is already long gone.

### The Present: Claude Code

Claude Code is really about autonomous agents that run in your terminal. As a terminal guy, I can speak to why this is so awesome - it fits my workflow perfectly. The agent runs commands, edits files, and iterates without me micromanaging every step.

### The Future: Multi-Agent Dashboard

I was surprised when Steve Yegge mentioned this is the future - orchestrating multiple specialized agents. Surprised because I'd been accidentally building toward this. The [Agent Dashboard](#agent-dashboard) I mentioned earlier? By the way, I didn't build that at all. I just gave the requirements and Claude built it itself.

### The 8 Stages of AI Coding

![The 8 stages of AI coding evolution - from manual coding to orchestrated multi-agent systems](https://raw.githubusercontent.com/idvorkin/ipaste/main/20260123_070344.webp)

{% include alert.html content="This visualization comes from Steve Yegge's excellent article [Welcome to Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), which explores the future of AI-assisted development and multi-agent orchestration." style="info" %}

This diagram perfectly captures the evolution I've lived through. Let me break down what each stage actually means:

**Stages 1-4: The Solo Developer Journey**

1. **Manual Coding** - Just you and your editor. Every line typed by hand. The good old days (which weren't always that good).

1. **Approval-Based Agent (Y/N?)** - AI suggests changes, but stops to ask permission for each action. This is where Cursor started - tab completion evolved into "should I run this test?"

1. **YOLO Mode** - The turning point. AI can execute commands, make commits, run tests without asking each time. This is what [YOLO Containers](/chop#yolo-containers-safe-full-autonomy) enable safely.

1. **Full Autonomy** - AI doesn't just execute commands - it plans multi-step workflows and handles the entire development cycle. This is where Claude Code shines today.

**Stages 5-8: The Multi-Agent Era**

1. **Single Agent** - One Claude Code session per project. Good for focused work, but limited by serial execution. This is where most people are today.

1. **Parallel Agents** - Multiple Claude Code instances working on different features simultaneously. You become a coordinator, switching between agents. This is when you discover the pain of merge conflicts and context switching.

1. **Specialized Tools** - Different agents have different capabilities. One handles tests, another docs, another deployment. You're orchestrating specialists, not generalists. The [optimal number of agents](#what-im-still-figuring-out) becomes critical.

1. **Orchestrated System** - This is the vision: a central dashboard managing dozens of specialized agents. The [Agent Dashboard](#agent-dashboard) is an early step toward this. You're no longer coordinating individual agents - you're managing the system that coordinates them.

**Where I Am Today:** Somewhere between stages 6 and 7. Running 2-3 parallel agents on different features, learning how to avoid merge hell, figuring out when to use specialized vs. generalist agents. Stage 8 is the dream, but the tooling isn't quite there yet.

## Notes from the Trenches

### What Works Well - REVIEW THIS WEEKLY!

**Note to self: Review this section regularly. These principles are easy to forget when you're heads-down in a session.**

- **Rent the most expensive brain you can**: Spend tokens liberally. Don't be cheap with AI usage - the $200/month is nothing compared to the force multiplication you get
- **Maximize time between interventions**: Like Tesla's self-driving metrics, the goal is reducing how often you need to take over. Every friction point kills flow
  - **Don't be the intern doing grudge work**: If AI writes code and you manually test it, you've got the roles backwards. Make AI the tester too - be the architect, not the QA intern
  - **Tests as specification**: The clearer the tests, the less I need to intervene
  - **Always be able to rewind**: YOLO containers and git workflows mean you can experiment fearlessly. If something breaks, spin up a fresh container in seconds
  - **Conventions compound**: Time spent on CLAUDE.md pays off across every session
- **Isolation is freedom**: YOLO containers let Claude run autonomously without risk to my real environment
- **"Don't glaze me" changes everything**: Claude is far more useful when it pushes back on bad ideas

### What I'm Still Figuring Out

- **How to handle merges**: When multiple agents touch related code, merging gets messy fast.

**The optimal number of agents** deserves its own callout. On one hand, the number you can run in parallel seems to be the limiting factor for throughput. On the other hand - man, it's easy to get confused. Sending the wrong commands to the wrong agents. Forgetting what each one is doing. Brutal merge conflicts when they touch the same files. It's quite the challenge, and I'm nowhere close to having it figured out.

**Rethinking conventional coding wisdom:**

- **DRY vs. self-contained**: Should conventions be shared libraries, or should every repo implement its own? When execution is cheap, maybe copy-paste isn't so bad.
- **Planning vs. iterating**: When you can execute so quickly, is planning even worth it? Or are you better off just iterating fast?
- **Tests first vs. tests after**: If AI can generate tests instantly, does TDD still matter? Or is "describe what you want, let AI figure out the tests" the new workflow?

## The Control Panel - For This Human

**The core problem**: agents are slow, not fast. The mitigation? Run several in parallel. But humans aren't designed for parallel orchestration. You need a cockpit — voice input, physical buttons, a dashboard, and instant session switching — to keep track of it all without losing your mind.

I wrote up the full cockpit setup separately:

{% include summarize-page.html src="/ai-cockpit" %}

## Where I Code

**Not a problem - an opportunity.** When things change, previous constraints change too. Voice coding + cloud containers = newfound freedom. I'm no longer tethered to a desk with a keyboard. I'm still figuring out how to use this freedom.

### The Couch

I really like coding on the couch because I feel like I'm with my family even though I'm there mumbling. There's a bit of a lie here - I kind of don't see my family and they're very confused about who I'm talking to.

Humorous side note: after a coding binge where I did 60 hours of vibing two weeks in a row, when I stopped my family asked "Are you okay? You're not just mumbling to yourself anymore."

### The Coffee Shop

Unfortunately I can't use voice here, but I really enjoy being at a coffee shop - seeing the people, the ambient noise, all that jazz. There's something about the energy of a public space that keeps me focused.

### The Desktop Setup

Using a big monitor is awesome - all that real estate. I've also experimented with using multiple monitors to help me keep track of different things: agents running in one screen, code in another, docs in a third.

### The Walking Treadmill

Just today, as I was writing this post, I realized: "Hey, I could do this walking since I'm using voice." So parts of this post were spoken while walking on my under-desk treadmill. Kind of cool.

### The Car

Yes, I can vibe code in the car too. My 16-year-old son is learning to drive and drove us back from a 10-hour drive from Ashland, Oregon. I spent the entire time vibecoding. That probably contributed to my [shoulder impingement](/shoulder-pain).

### Ergonomics

{% include local_image_float_right.html src="raccoon-shoulder.webp" %}

**The danger of all this freedom.** Be careful about ergonomics, especially if you're an [older coder](/40yo). Coding on couches, in cars, and in awkward positions adds up. Your body will eventually present the bill.

## Making AI Work My Way

{% include alert.html content="**Honestly?** I'm not convinced this stuff actually works. But until models are smart enough to just figure it out, you have to do something. Keep it lightweight—it might not outlive the next model iteration." style="warning" %}

**For nerds:** This whole strategy fights against the [Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html). Rich Sutton argued that simple methods + more compute beats hand-crafted human knowledge. Building elaborate CLAUDE.md files and conventions is exactly that - encoding human knowledge instead of letting models get smarter. The irony isn't lost on me.

**The core problem:** Every session, the AI starts fresh. It doesn't remember your preferences, your project structure, or what you've already discussed. Conventions are how you encode context that persists.

### The chop-conventions Repo

I maintain a shared conventions repo at [idvorkin/chop-conventions](https://github.com/idvorkin/chop-conventions) that I link into projects. This gives me:

- Consistent rules across all my repos
- Easy updates - change once, propagate everywhere
- Version controlled evolution of my AI instructions

The first thing I tell Claude to do in any project: clone this repo and read the starting guide.

### CLAUDE.md Structure

My CLAUDE.md files follow a pattern: foundational rules (honesty, call out bad ideas), guardrails (no pushing to main, no removing tests), relationship framing (we're colleagues, push back when I'm wrong), and project-specific guidance.

The theory: tell Claude _how to think_, not just _what to do_. Whether "don't glaze me" actually shapes behavior across sessions? I genuinely don't know.

Here's the thing: every time models get smarter and tools get better, my CLAUDE.md becomes partially obsolete. Especially the alchemy - yelling at the model, begging it not to do a bad job, elaborate prompting tricks. That stuff has a short half-life. But some things stay useful: custom commands to run, project-specific context, where to find things. The challenge is knowing which is which.

### MCP Servers and Skills

At the end of the day, I don't use much of this. Often I'll install something, try it out, and it just gets left running in the background. GitHub MCP for issue/PR management, maybe some doc fetching. That's about it.

This stuff changes so fast, and with models getting smarter (see the Bitter Lesson discussion in [Making AI Work My Way](#making-ai-work-my-way)), we'll just get to it later. Two or three max.

**What does matter:** Little CLI programs for my agents to run. Same principle as with humans - instead of giving someone detailed directions, give them a tool that just works perfectly to solve the problem.

For example, I have [`running-servers`](https://github.com/idvorkin/settings/blob/main/shared/running-servers) that checks if a Jekyll server is already running for a directory, so agents don't try to recreate them. Instead of prompting the agent through "check ps, grep for jekyll, parse the port numbers, compare to current directory..." - just give them a tool that answers "is there a server for this directory?" These custom tools that extend what agents can do - those are worth building.

## My Projects

### Command Line and PWAs

Most of my tools are either command line or PWAs. Command line - obviously, when I'm on the command line, which is often. For everything else, PWAs: local-first, run everywhere, no app store hassle. They're remarkably flexible.

{% include summarize-page.html src="/pet-projects" %}

CHOP has made it so much easier to spin up new ideas and actually finish them.

### Testing and Evals

This might be the most important thing. In the CHOP world, knowing how to verify that AI output is correct matters more than knowing how to produce it. It's all about evals - can you define what "good" looks like and measure whether you're there?

{% include alert.html content="This section deserves a deep dive. More content coming." style="info" %}

## The Server Behind the Curtain

The metric that matters most in CHOP is **time between interventions**. Like Tesla's self-driving, the goal is reducing how often you need to take over. Every friction point - waiting for a slow laptop, losing context when you switch machines, being scared to let the AI run autonomously - increases interventions and kills your flow.

My hosting environment is designed to minimize these interruptions.

### Why Not Cloud Environments?

Why not just use Claude Cloud, Jules, Codespaces, or other hosted environments? They're limited in their setup - you can't customize the tooling, install arbitrary dependencies, or configure things exactly how you want. And honestly, it's easy enough to set up your own. The initial investment pays off quickly when you're not fighting constraints.

### Hardware Setup

**Why it matters**: I can start a CHOP session at home, close my laptop, commute, and pick up from a different device. The work lives in the container, not on any particular machine. Zero intervention required for location changes.

A desktop machine runs multiple Docker containers. I [mosh](https://github.com/mobile-shell/mosh) in from laptops, tablets, wherever. (Mosh is self-reconnecting SSH - survives laptop sleep, network switches, everything.)

### Container Setup

**Why it matters**: Agents will wipe your machine. Give them YOLO mode on your laptop and eventually one will `rm -rf` something important or force-push to main. Containers provide isolation - if Claude breaks something, the blast radius is one disposable container, not your life's work.

I run AI agents in isolated Docker containers - cattle, not pets. Full details in [YOLO Containers](/chop#yolo-containers-safe-full-autonomy), but the key points:

- Each container gets YOLO mode (agents run without asking permission for anything)
- Separate GitHub identity (`idvorkin-ai-tools`) - can only create PRs, not push to main
- Named volumes for persistence across restarts
- Multiple containers for parallel CHOP sessions on different features/repos

### Network Setup

**Why it matters**: No port forwarding, no VPN configuration, no "works on my machine." I can share a preview link with anyone on my tailnet, or pull up my work on my phone to check something. Location-independent access to everything.

Every container joins my Tailscale mesh network and gets a stable hostname:

- Container `c-5001` becomes `c-5001.squeaker-teeth.ts.net`
- Servers bind to `0.0.0.0` so they're network-accessible
- Same URLs work from home, coffee shop, or traveling

## A Typical CHOP Session

TODO: Still figuring this out. The workflow changes frequently as tools evolve.

## Appendix: Origin of a Tool Nerd

### The Enabling Environment

{% include summarize-page.html src="/enable" %}

This philosophy is _why_ I invest in CHOP infrastructure. Every minute spent on container setup, conventions, and tooling is friction removed from future work. The enabling environment isn't about productivity for its own sake - it's about creating the conditions where good work can happen naturally.

CHOP is the latest chapter in this story: building systems that let me focus on the interesting problems while automating the tedious ones.

### My Relationship with Tools

I've always been a tool nerd. VIM since forever. Command line over GUI. Custom scripts for everything. The joy isn't just efficiency - it's the craft of building your own workshop.

CHOP fits this pattern: I'm not just using AI, I'm building an AI-augmented development environment. The containers, the conventions, the workflows - they're all tools I'm crafting for a new kind of work.

### Is This a Waste?

Every month your setup is stale. New models drop. New tools appear. Best practices from six months ago are now anti-patterns. Is it even worth trying to keep up?

I spent years mastering VIM. Was that a waste? I built elaborate tmux workflows. Will that matter in two years? I'm investing in container infrastructure and conventions. Is this the buggy whip factory of 2025?

My answer: **it depends on what you're actually learning.**

- Learning specific keystrokes? Maybe a waste.
- Learning to reduce friction and build enabling environments? Transferable forever.
- Learning a specific tool's quirks? Probably temporary.
- Learning how to delegate effectively to agents? That's the new core skill.

The meta-skill is knowing which investments compound and which depreciate. Right now, I'm betting that _orchestration_ skills (conventions, delegation, verification) will outlast _implementation_ skills (specific languages, specific tools).

## Appendix: Who I Follow

### Simon Willison

I read [Simon Willison](https://simonwillison.net/) religiously. So much content, constantly experimenting, always sharing what he learns. If you're only going to follow one person on AI-assisted development, make it him.

### Steve Yegge

[Steve Yegge](https://steve-yegge.medium.com/) is my hero. Super fun to read, deeply experienced, and unafraid to have strong opinions. His takes on where AI coding is headed are worth paying attention to.

### Twitter

Huge mixed bag. Sometimes there's something genuinely good. Usually it's people selling stuff. I keep a list but approach with skepticism.

## Appendix: The Long View

### What Management Taught Me About AI

Good delegation to humans requires clear expectations, appropriate context, and defined success criteria. Same with AI.

When delegation fails, it's usually because:

- The task wasn't well-specified (AI hallucinates requirements)
- Success criteria were unclear (AI optimizes for the wrong thing)
- I didn't give enough context (AI makes reasonable but wrong assumptions)

The conventions repo and CLAUDE.md are essentially delegation infrastructure - encoding all the context an AI needs to work autonomously.

### The Evolution of Junior Developers

You don't need to know the "how" nearly as much anymore. The key skill becomes spec/verify - which is closer to PM than traditional engineering.

And what do PMs do? Two things: understand the business, and understand people - helping people feel good about what's happening. Those skills don't go away. If anything, they become more important when the "how" is increasingly handled by AI.

We have junior PMs. Maybe that's the new on-ramp.

### Revenge of the SDET

Back when I started in programming, we had SDETs - Software Development Engineers in Test. They were software engineers who focused more on testing than writing the actual code. These folks were kind of looked down upon, and the role eventually disappeared at most companies.

But now in the CHOP world? Testing is actually the most important thing. It's all about the evals. The person who can specify what "correct" looks like, write the tests that verify it, and evaluate whether the AI's output meets the bar - that's the bottleneck skill now.

The SDETs were ahead of their time.

### Hyper-Personalized Software

With coding so easy, might as well make a tool just for your use case. No need to find an app that's 80% right - build exactly what you want in an afternoon.

I think there's a pendulum here:
- 90s: Every company needed their own IT department
- 2000s: SaaS - rent the same software as everyone else
- 2030s: Single dev does all the required tooling, personalized to their exact needs

See more in my [hyper-personalization](/hyper-personal) post. Examples from my own life: [handwriting journal workflow](/process-journal#journalling-workflow-in-2025), [mortality software](/mortality-software), [all my pet projects](/pet-projects).

### The Joy Question

Does CHOP kill the joy of coding? See the deeper exploration in [Will CHOP Kill the Joy of Coding?](/chop#will-chop-kill-the-joy-of-coding).

My take: the joy shifts, it doesn't disappear. Less joy in typing code, more joy in:

- Designing systems at a higher level
- Crafting the perfect specification
- Building the enabling environment itself
- Solving problems I couldn't tackle alone

It's like the transition from assembly to high-level languages. Some people mourned losing the craft of register allocation. Most found new joys in the problems they could now solve.

### What I'm Betting On

- **Practice and self-improvement always win**: The tools change, but [learning new skills](/new-skills) is the constant. You're going to suck until you die - that's just how mastery works.
- **Conventions become critical**: As AI gets smarter, the bottleneck shifts to specification quality. CLAUDE.md-style files will matter more, not less.
- **Verification beats implementation**: Knowing _what_ to build and _how to verify_ it matters more than _how_ to build it.
- **Multi-agent coordination will improve**: Today's pain of running parallel agents is a tooling problem, not a fundamental limit.
- **The enabling environment philosophy applies more than ever**: The winners will be those who invest in reducing friction.

## Appendix: Open Questions

### What happens when execution is no longer the bottleneck?

Right now, we're still limited by how fast we can build things. But that's changing fast. What becomes the constraint then?

**How do organizations handle 200x more projects?** Imagine a company like Meta that used to run N projects because engineering capacity was the limit. Now they can run 200N projects. How do they even assess them all? How do they A/B test that many variants? It's going to be a crazy world.

**Reviews become more expensive than creation.** LLVM hit this with PRs - they had to create a [whole AI tool policy](https://discourse.llvm.org/t/rfc-llvm-ai-tool-policy-human-in-the-loop/89159) because reviewing AI-generated contributions takes more human time than the AI spent creating them. TL;DR: You're responsible for anything your AI creates. If you can't answer questions about what the AI did, your PR fails. But this applies to everything - not just code.

### What happens post-singularity?

First, what's a singularity? It's when AI can generate the majority of economic value with a very small group of people who have a ton of leverage.

At that point, two problems:

1. **How do people eat?** There are solutions - easier said than done - like UBI.
2. **How do people have purpose?** This one is even harder. I feel it in my bones. But you know what? Humans have always figured it out, and I'm sure they'll do it again.

### Is sloppy process okay if agents can clean up the mess?

[Beads](https://github.com/steveyegge/beads) constantly gets into broken states - leftover file leases, corrupted issue data, stale git references. Traditional software engineering says: prevent these states, make workflows deterministic, fail fast. But here's the thing: agents just... fix it. They see the mess, figure out what went wrong, and recover.

Steve Yegge describes using [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail) for multi-agent coordination: "You just give them a task and tell them to sort it out amongst themselves. There's no ego, so they quickly decide on a leader and split things up... Although it seems crazy to work that way, the agents just figure it out—they're quite resilient." See his [Beads Best Practices](https://steve-yegge.medium.com/beads-best-practices-2db636b9760c) post.

This raises uncomfortable questions: If agents can recover from any workflow mess, do we still need disciplined processes? We've spent decades building guardrails to prevent non-deterministic states because *humans* can't handle the chaos. But agents can. Maybe the discipline shifts from *how you work* to *what you produce*. Maybe it's fine if your agents are sloppy, leave garbage lying around, and get into weird states - as long as the output is correct. The craftsmanship moves from the process to the artifact. I don't know what to do with this yet.

(By the way, this is how I use voice. My voice input ends up being garbage - half-formed thoughts, wrong words, trailing off mid-sentence - but agents figure out what I meant and respond to my intent, not my mangled transcription. Even the *input* can be sloppy now.)

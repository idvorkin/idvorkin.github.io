---
layout: post
title: "How Igor CHOPs: My AI-Assisted Development Setup"
permalink: /how-igor-chops
imagefeature: https://raw.githubusercontent.com/idvorkin/ipaste/main/20260101_093434.webp
tags:
  - ai
  - tools
  - how
redirect_from:
  - /igor-chop
  - /my-chop-setup
---

Curious how I actually use AI for coding day-to-day? This is my current setup, workflows, and lessons learned. For the conceptual "what is CHOP and why it matters," see [The CHOP Shop](/chop).

{% include ai-slop.html percent="15" %}

{% include alert.html content="**On terminology:** Before 'vibe coding' became the buzzword, I called this CHOP - Chat-Oriented Programming. The nice thing about the CHO* pattern is it extends naturally: [CHOW](/chow) for Chat-Oriented Writing, and really, Chat-Oriented Anything you want. The core idea is the same: natural language dialogue with AI as the primary interface." style="info" %}

{% include image_float_right.html src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20260101_093434.webp" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [My Hosting Environment](#my-hosting-environment)
  - [Hardware Setup](#hardware-setup)
  - [Container Setup](#container-setup)
  - [Network Setup](#network-setup)
- [My Driver's Seat](#my-drivers-seat)
  - [The Vibe](#the-vibe)
  - [Keyboard](#keyboard)
  - [Stream Deck](#stream-deck)
  - [Agent Dashboard](#agent-dashboard)
  - [Terminal (tmod)](#terminal-tmod)
- [My Tooling Choices](#my-tooling-choices)
  - [When I Use Cursor](#when-i-use-cursor)
  - [When I Use Claude Code](#when-i-use-claude-code)
  - [Supporting Cast](#supporting-cast)
- [My Conventions Workflow](#my-conventions-workflow)
  - [The chop-conventions Repo](#the-chop-conventions-repo)
  - [CLAUDE.md Structure](#claudemd-structure)
- [A Typical CHOP Session](#a-typical-chop-session)
- [Lessons Learned](#lessons-learned)
  - [What Works Well](#what-works-well)
  - [What I'm Still Figuring Out](#what-im-still-figuring-out)
- [Appendix: Why I'm Like This](#appendix-why-im-like-this)
  - [The Enabling Environment](#the-enabling-environment)
  - [My Relationship with Tools](#my-relationship-with-tools)
  - [Is This a Waste?](#is-this-a-waste)
- [Appendix: Who I Follow](#appendix-who-i-follow)
  - [Simon Willison](#simon-willison)
  - [Steve Yegge](#steve-yegge)
  - [Twitter](#twitter)
- [Appendix: Thoughts on CHOP](#appendix-thoughts-on-chop)
  - [CHOP as Delegation](#chop-as-delegation)
  - [The Joy Question](#the-joy-question)
  - [What I'm Betting On](#what-im-betting-on)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## My Hosting Environment

The metric that matters most in CHOP is **time between interventions**. Like Tesla's self-driving, the goal is reducing how often you need to take over. Every friction point - waiting for a slow laptop, losing context when you switch machines, being scared to let the AI run autonomously - increases interventions and kills your flow.

My hosting environment is designed to minimize these interruptions.

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

## My Driver's Seat

The hosting environment runs in the cloud. But when I sit down to CHOP, I need a physical setup that keeps me in flow and gives me visibility into what my agents are doing.

### The Vibe

TODO: What puts you in the zone? Music, environment, rituals?

### Keyboard

TODO: Your keyboard setup - mechanical? Layout? Why it matters for CHOP?

### Stream Deck

[Stream Deck Plugin](https://github.com/idvorkin/streamdeck-igor-vibe) - physical buttons for:

- Tmux navigation (jump between containers/sessions)
- Voice activation
- Utility keys

**Why it matters**: One button to switch contexts instead of typing commands. Reduces friction when juggling multiple agents.

### Agent Dashboard

[Agent Dashboard](https://github.com/idvorkin-ai-tools/agent-dashboard) - central portal for monitoring multi-agent sessions:

- Auto-discovers running agents
- Shows git status, PR status, server status
- Written by AI, for monitoring AI

**Why it matters**: When you have 2-3 agents running in parallel, you need a single view of what's happening. Otherwise you're constantly SSH-ing around to check status.

### Terminal (tmod)

[tmod](https://github.com/idvorkin/tmod) - Rust-based tmux helper (10x faster than the Python version):

- Fast session/window management
- Integrates with Stream Deck

**Why it matters**: Tmux is the backbone of multi-agent work. tmod makes navigation instant.

## My Tooling Choices

### When I Use Cursor

TODO: Scenarios where Cursor is your go-to - visual diffs? Specific file editing? Tab completion for flow?

### When I Use Claude Code

TODO: Scenarios where Claude Code wins - autonomous long-running tasks? YOLO containers? Better agent behavior?

### Supporting Cast

- **MCP Servers**: GitHub MCP for issue/PR management, Context7 for up-to-date docs
- **SpecStory**: Exports Cursor chat history for commit logs
- **chop-git-latest**: My zsh function that copies latest chat history to `zz-chop-logs`

## My Conventions Workflow

### The chop-conventions Repo

I maintain a shared conventions repo at [idvorkin/chop-conventions](https://github.com/idvorkin/chop-conventions) that I link into projects. This gives me:

- Consistent rules across all my repos
- Easy updates - change once, propagate everywhere
- Version controlled evolution of my AI instructions

The first thing I tell Claude to do in any project: clone this repo and read the starting guide.

### CLAUDE.md Structure

My CLAUDE.md files follow a consistent pattern:

1. **Read First**: Point to chop-conventions repo for shared context
2. **Foundational Rules**: Non-negotiables (honesty, call out bad ideas, address me as "Igor")
3. **Guardrails**: Actions needing explicit approval (pushing to main, removing tests, force push)
4. **Our Relationship**: We're colleagues, not master/servant - push back when I'm wrong
5. **Project-Specific Guidance**: Blog guidelines, coding conventions, etc.

The key insight: I tell Claude _how to think_, not just _what to do_. "Don't glaze me" and "call out bad ideas" shape behavior across hundreds of interactions.

## A Typical CHOP Session

TODO: Still figuring this out. The workflow changes frequently as tools evolve.

## Lessons Learned

### What Works Well

- **Isolation is freedom**: YOLO containers let Claude run autonomously without risk to my real environment
- **Conventions compound**: Time spent on CLAUDE.md pays off across every session
- **Don't be the junior tester**: If AI writes code and I manually test, I've outsourced the wrong job. Make AI the tester too.
- **Tests as specification**: The clearer the tests, the less I need to intervene
- **"Don't glaze me" changes everything**: Claude is far more useful when it pushes back on bad ideas

### What I'm Still Figuring Out

- **Multi-agent coordination**: Running 2+ agents on related work gets messy fast. When does parallelism help vs hurt?
- **When to use which tool**: Cursor vs Claude Code decision still feels situational rather than principled
- **Optimal intervention frequency**: Sometimes I intervene too early, sometimes too late. Still calibrating.

TODO: Other open questions you're wrestling with?

## Appendix: Why I'm Like This

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

## Appendix: Thoughts on CHOP

### CHOP as Delegation

Good delegation to humans requires clear expectations, appropriate context, and defined success criteria. Same with AI.

When delegation fails, it's usually because:

- The task wasn't well-specified (AI hallucinates requirements)
- Success criteria were unclear (AI optimizes for the wrong thing)
- I didn't give enough context (AI makes reasonable but wrong assumptions)

The conventions repo and CLAUDE.md are essentially delegation infrastructure - encoding all the context an AI needs to work autonomously.

### The Joy Question

Does CHOP kill the joy of coding? See the deeper exploration in [Will CHOP Kill the Joy of Coding?](/chop#will-chop-kill-the-joy-of-coding).

My take: the joy shifts, it doesn't disappear. Less joy in typing code, more joy in:

- Designing systems at a higher level
- Crafting the perfect specification
- Building the enabling environment itself
- Solving problems I couldn't tackle alone

It's like the transition from assembly to high-level languages. Some people mourned losing the craft of register allocation. Most found new joys in the problems they could now solve.

### What I'm Betting On

- **Conventions become critical**: As AI gets smarter, the bottleneck shifts to specification quality. CLAUDE.md-style files will matter more, not less.
- **Verification beats implementation**: Knowing _what_ to build and _how to verify_ it matters more than _how_ to build it.
- **Multi-agent coordination will improve**: Today's pain of running parallel agents is a tooling problem, not a fundamental limit.
- **The enabling environment philosophy applies more than ever**: The winners will be those who invest in reducing friction.

TODO: Other bets you're making?

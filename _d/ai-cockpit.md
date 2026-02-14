---
layout: post
title: "The AI Cockpit: My Control Surface for Multi-Agent Development"
permalink: /ai-cockpit
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-cockpit.webp
tags:
  - ai
  - tools
  - how
redirect_from:
  - /cockpit
  - /control-panel
alias:
  - /cockpit
  - /control-panel
---

Agents are slow. Not slow like "wait a second," slow like "go make coffee and come back." So you run several in parallel. But now you've got a different problem: you're an air traffic controller with no radar. You need a cockpit - a physical and software control surface that gives you visibility into what your agents are doing and lets you switch between them instantly.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Why You Need a Cockpit](#why-you-need-a-cockpit)
- [The Cockpit Today](#the-cockpit-today)
  - [Voice Input - The Primary Interface](#voice-input---the-primary-interface)
  - [Tmux on Super Steroids - The Multiplexer](#tmux-on-super-steroids---the-multiplexer)
  - [Alfred - The Session Switcher](#alfred---the-session-switcher)
  - [Agent Dashboard - The Radar Screen](#agent-dashboard---the-radar-screen)
  - [Stream Deck - The Physical Buttons](#stream-deck---the-physical-buttons)
- [How the Pieces Fit Together](#how-the-pieces-fit-together)
- [What I'm Still Building](#what-im-still-building)
- [The Meta-Question](#the-meta-question)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Why You Need a Cockpit

Here's the thing about [CHOP](/chop) today: a single agent session is straightforward. You talk, it codes, you review. No cockpit needed. But the moment you run two agents in parallel, everything changes.

With parallel agents you need to:

- **See what each agent is doing** without SSH-ing around
- **Switch between agents instantly** - context-switching friction kills your flow
- **Talk to whichever agent needs you** without typing commands to navigate there first
- **Know when something needs attention** without constantly checking

This is the gap between [Stage 5 (single agent) and Stage 7 (specialized tools)](/how-igor-chops#the-8-stages-of-ai-coding) in the AI coding evolution. The agents themselves are fine. It's the human interface that's the bottleneck.

A cockpit solves this. Not with one tool, but with a stack of tools that each handle a different layer of the problem.

## The Cockpit Today

### Voice Input - The Primary Interface

I talk to my agents. It sounds ridiculous until you try it - then you can't go back. Talking to Claude is just like talking to another engineer - and that's the real insight. It's not about voice-as-input-method. It's that **talking** changes how you think. You do more stream of consciousness back and forth. You say things you'd never bother typing. Half-formed thoughts, rough directions, "actually wait, no, try this instead" - the kind of thing you'd say to a colleague at a whiteboard.

**Why voice for the cockpit specifically?** Two reasons. First, hands-free: I can look at the dashboard, glance at a Stream Deck button, switch tmux panes - all while giving instructions. Voice doesn't compete with the other interfaces. Second, mobility: voice works from a phone, from the couch, from a treadmill. When agents are slow and you're waiting anyway, you don't need to be at a keyboard.

At home I use [Wispr Flow](https://wisprflow.ai/) for its speed and filler-word cleanup. At work, [SuperWhisper](https://superwhisper.com/) runs local models on M4 Max chips - no cloud, no privacy concerns.

The funny part: transcription quality barely matters. Agents are resilient to garbled input. I mumble half-formed thoughts and Claude figures out what I meant. Even the _input_ can be sloppy when the receiver is smart enough.

See more in my [AI Journal entry on voice coding](/ai-journal#using-voice-to-make-commands).

### Tmux on Super Steroids - The Multiplexer

Tmux is the backbone. Every agent runs in a tmux session inside a Docker container. The problem is: stock tmux navigation is painful when you have 8+ sessions across multiple containers.

So I built a [hand-written Rust picker](https://github.com/idvorkin/settings/tree/main/rust/tmux_helper) that's hyper-optimized for this exact use case:

- **Token-based fuzzy matching** - type "cl set" and it finds panes with both terms
- **Visual markers** - `◀` for current pane, `◁` for previous (Tab toggles between them)
- **Auto-layout switching** - horizontal/vertical based on terminal size
- **Window auto-rename** - every 10 seconds, windows rename based on running process ("claude" becomes "cl")
- **14ms response time** - ported from Python (100ms) to Rust. I don't even know Rust, but AI made it trivial

**Why it matters for the cockpit:** This is the "stick" that steers. One keystroke opens the picker. Another keystroke lands you in the right agent session. No thinking, no typing paths, no remembering which container is which.

Full story: [Rust tmux_helper - 10x speedup from Python](/ai-journal#rust-tmux_helper-10x-speedup-from-python)

### Alfred - The Session Switcher

Alfred is the layer above tmux. Where tmux handles sessions within a terminal, Alfred handles the broader context: which application, which workspace, which container environment.

I use Alfred for:

- **Quick blog search** (`idv` keyword) - find any post without leaving what I'm doing
- **Screenshot capture and management** (`ss` keyword)
- **Window navigation** - jump between terminal windows, browsers, dashboards
- **Clipboard history** - copy from one agent's output, paste into another's context

The integration I want to build next: an Alfred workflow that shows all running agent sessions with their current status, lets me pick one, and drops me directly into that tmux pane. Right now I do this manually through tmux. Alfred could make it one hotkey from anywhere on the system.

### Agent Dashboard - The Radar Screen

{% include image_float_right.html src="https://raw.githubusercontent.com/idvorkin-ai-tools/agent-dashboard/main/docs/dashboard-screenshot.png" link="https://github.com/idvorkin-ai-tools/agent-dashboard" %}

The [Agent Dashboard](https://github.com/idvorkin-ai-tools/agent-dashboard) is the piece that gives you the bird's-eye view:

- **Auto-discovers running agents** across containers
- **Shows git status** - which branch, how many commits ahead, any conflicts
- **Shows PR status** - open, review requested, merged
- **Shows server status** - Jekyll instances, ports, health

I didn't build this. I gave the requirements and Claude built it itself. The irony of AI building its own monitoring tool isn't lost on me.

**Why it matters for the cockpit:** Without this, you're blind. You don't know which agent finished, which one is stuck, which PR needs review. With it, one glance tells you where to focus attention.

### Stream Deck - The Physical Buttons

{% include image_float_right.html src="https://raw.githubusercontent.com/idvorkin/ipaste/main/20260101_070739.webp" link="https://github.com/idvorkin/streamdeck-igor-vibe" %}

The [Stream Deck plugin](https://github.com/idvorkin/streamdeck-igor-vibe) gives me physical buttons for:

- **Tmux navigation** - previous/next pane without touching the keyboard
- **Voice activation** - toggle Wispr Flow on/off
- **Utility keys** - common actions I'd otherwise have to type

Physical buttons matter because they don't require visual attention. I can hit "next agent" by feel while reading code on screen. It's the same reason cars have physical knobs for volume instead of touchscreen sliders - you don't want to look away from the road.

Built the plugin in 30 minutes with AI. See the [journal entry](/ai-journal#stream-deck-plugin-in-30-minutes).

## How the Pieces Fit Together

Here's a typical multi-agent scenario and how the cockpit helps:

**Setup:** Three agents running - one on a blog feature, one fixing tests, one updating docs. Each in its own tmux session inside a Docker container.

1. **Agent Dashboard** (browser tab) shows me all three agents, their git branches, and PR status. I see the test-fixer just opened a PR.
2. I hit a **Stream Deck button** to jump to that agent's tmux pane.
3. **Tmux picker** (14ms) lands me in the right session instantly.
4. I review the PR, **voice** my feedback: "The test for the edge case with empty arrays is missing, add that."
5. While that agent works, I glance at the dashboard - the docs agent needs a merge. Hit another Stream Deck button.
6. Repeat.

The cockpit turns multi-agent orchestration from "constantly lost and confused" into "air traffic control with good radar." It's not perfect yet, but it's the difference between Stage 5 and Stage 7.

## What I'm Still Building

The cockpit is a work in progress. Here's what's on the list:

- **Alfred integration for agent sessions** - one hotkey from anywhere to pick and jump to an agent. Show status inline in the Alfred picker.
- **Dashboard notifications** - push alerts when an agent finishes or gets stuck, instead of me polling
- **Voice routing** - tell the _system_ which agent to talk to, not just talk into whichever terminal is focused. "Hey agent-2, run the tests."
- **Better merge coordination** - when two agents touch related files, detect the conflict before it happens
- **Session recording** - capture what each agent did in a session for later review. Some of this exists in [published CHOP logs](/ai-journal), but it's manual.

## The Meta-Question

Is all this cockpit infrastructure a waste? Every month, models get smarter. Maybe in six months, a single agent can handle what three do today, and I won't need parallel orchestration at all.

Maybe. But the meta-skill here isn't "how to configure tmux" - it's **how to build a human interface for AI delegation**. That problem isn't going away. The specific tools will change (tmux might become something else, Alfred might not exist), but the pattern of needing visibility, fast switching, and ambient awareness when orchestrating autonomous systems? That's permanent.

Same thing I said about [CHOP tools in general](/how-igor-chops#is-this-a-waste): learn the transferable skills, hold the specific tools loosely.

{% include summarize-page.html src="/how-igor-chops" %}

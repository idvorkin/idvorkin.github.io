---
layout: post
title: "Side Quests: Random Tech Explorations"
ogtitle: "Side Quests: Random Tech Explorations"
author: "Igor Dvorkin"
inprogress: true
comments: true
permalink: /side-quests
redirect_from:
  - /side-quest
  - /quests
tags:
  - how igor ticks
  - tech-hobby
---

Tech is cheap, curiosity is free, and side quests are how I scratch the itch without derailing the main storyline. These are random explorations — little adventures where I poke at something interesting, learn just enough to be dangerous, and move on. No deadlines, no deliverables, just play.

**The rule: don't overdo it.** Side quests are seasoning, not the meal. If I've got more than 3 active at once, something needs to ship or get shelved. The whole point is that they're lightweight — the moment they feel like obligations, they've failed.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Active Quests](#active-quests)
  - [Context Grabber](#context-grabber)
- [Completed Quests](#completed-quests)
- [Shelved Quests](#shelved-quests)
  - [Apple Virtualization](#apple-virtualization)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Active Quests

### Context Grabber

_Started: 2026-03-14_

My AI life coach would be way more helpful if it had access to context that's currently trapped in my iPhone — health data (steps, sleep, heart rate), location history, screen time, etc. None of this is easily exportable in a format an LLM can use. Why not build a custom iOS app that extracts this data and makes it available?

**The idea:**

- A lightweight iOS app that pulls from HealthKit, CoreLocation, and other on-device APIs
- Exports structured data (JSON/CSV) that can be fed into life coaching conversations
- Could sync to iCloud, a server, or just copy-paste — whatever's simplest

**Status:** Just getting started.

## Completed Quests

_Nothing here yet — ship something!_

## Shelved Quests

### Apple Virtualization

_2026-03-14_

Running macOS VMs natively on Apple Silicon using [Lume](https://github.com/trycua/cua) — a lightweight CLI for Apple's Virtualization framework. Two use cases I wanted to explore:

1. **WebGPU testing** — can GPU workloads run inside a VM?
2. **Claude over iMessage** — give a Claude agent its own Apple Account and iMessage, so it can text people. Needs an Apple Account created and signed in inside the VM.

**Setup — painlessly easy:**

- Install Lume, then one command: `lume create vm-1 --ipsw latest --disk-size 50 --unattended tahoe`
- Unattended setup automates the entire macOS Setup Assistant via VNC + OCR — zero manual clicks
- SSH (`lume ssh vm-1`) and VNC (`lume run vm-1`) just work out of the box

**Findings:**

- **WebGL works**, but **WebGPU does not** — tested with [thetest.com/tests/gpu](https://thetest.com/tests/gpu). Apple's Virtualization framework provides basic GPU rendering but doesn't expose WebGPU.
- Can't create Apple Accounts from within the VM
- Claude computer-use can't create Apple Accounts either — it hard refuses

**Why shelved:** Both use cases hit dead ends. WebGPU isn't exposed in Apple VMs, and Apple Account creation can't be automated. Revisit if Apple adds GPU passthrough or account creation becomes scriptable.

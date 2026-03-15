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
  - [Magic Monitor Card Detection](#magic-monitor-card-detection)
- [Completed / Graduated](#completed--graduated)
  - [Context Grabber](#context-grabber)
- [Shelved Quests](#shelved-quests)
  - [Apple Virtualization](#apple-virtualization)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Active Quests

### Magic Monitor Card Detection

_Started: 2026-03-15_ | [GitHub](https://github.com/idvorkin/magic-monitor)

Magic Monitor is my webcam-based magic practice mirror — instant replay, hand tracking, the works. The next frontier: real-time playing card detection so it can "see" what card I'm holding. Imagine practice sessions where the app knows which card was produced and can verify the trick landed.

**The idea:**

- Train a YOLO model to recognize all 52 playing cards from webcam video
- Run inference in the browser via ONNX Runtime Web — no server needed
- Overlay detected cards with bounding boxes and confidence scores on the live feed
- Eventually: trick verification ("you said Queen of Hearts, and I see... Queen of Hearts")

**Status:** Model trained and exported — YOLO26n (9.7 MB ONNX) trained on [Augmented Startups dataset](https://universe.roboflow.com/augmented-startups/playing-cards-ow27d), 52 card classes, 416x416 input. Browser integration is half-working — detections show up but confidence is low (24% on a clearly visible King) and only catching 1 of 2 cards. HUD has a `[object Object]` bug. Next up: improve detection accuracy and build proper UI integration.

## Completed / Graduated

### Context Grabber

_Started: 2026-03-14_ | [GitHub](https://github.com/idvorkin/context-grabber)

My AI life coach would be way more helpful if it had access to context that's currently trapped in my iPhone — health data (steps, sleep, heart rate), location history, screen time, etc. None of this is easily exportable in a format an LLM can use. Why not build a custom iOS app that extracts this data and makes it available?

**The idea:**

- A lightweight iOS app that pulls from HealthKit, CoreLocation, and other on-device APIs
- Exports structured data (JSON) that can be fed into life coaching conversations
- Background location tracking with SQLite storage for "where was I" context
- At-a-glance dashboard with summary banner and metric cards

**Status:** Graduated to side project. Core app built — health metrics (steps, heart rate, sleep with bedtime/wake, weight, meditation), background location tracking, dashboard UI, OTA updates, 68 tests. [PR #1](https://github.com/idvorkin/context-grabber/pull/1).

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

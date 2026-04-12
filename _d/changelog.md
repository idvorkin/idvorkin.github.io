---
layout: post
permalink: /changelog
title: "Changelog"
tags:
  - meta
  - navigation
---

A weekly summary of what changed on this blog and across my GitHub projects. Useful for returning readers who want to catch up on new content and updates.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Week of 2026-04-05](#week-of-2026-04-05)
  - [The AI Operator (new post!)](#the-ai-operator-new-post)
  - [ACT Made Simple (new post!)](#act-made-simple-new-post)
  - [How Igor CHOPs: Flow and CPU Guards](#how-igor-chops-flow-and-cpu-guards)
  - [Eternal Terminal Setup & Portable Espresso](#eternal-terminal-setup--portable-espresso)
  - [CLAUDE.md & Tooling](#claudemd--tooling)
  - [Other Projects (April)](#other-projects-april)
- [Week of 2026-03-30](#week-of-2026-03-30)
  - [AI Relationships: When the Chatbot Is Better at Caring (new post!)](#ai-relationships-when-the-chatbot-is-better-at-caring-new-post)
  - [Keyboards: From Wrist Pain to Split Keyboards (new post!)](#keyboards-from-wrist-pain-to-split-keyboards-new-post)
  - [AI Journal: The Winchester Mystery House](#ai-journal-the-winchester-mystery-house)
  - [Content & Gear](#content--gear)
  - [Infrastructure & CI](#infrastructure--ci)
  - [Other Projects (April)](#other-projects-april-1)
- [Week of 2026-03-16](#week-of-2026-03-16)
  - [Claws: The Next Layer of AI (new post!)](#claws-the-next-layer-of-ai-new-post)
  - [AI Journal: Telegram, Eggs, and Feedback Loops](#ai-journal-telegram-eggs-and-feedback-loops)
  - [AI Native Manager: "In Distribution"](#ai-native-manager-in-distribution)
  - [Content Updates](#content-updates)
  - [Infrastructure & Tooling](#infrastructure--tooling)
  - [Other Projects (March)](#other-projects-march)
- [Week of 2026-03-09](#week-of-2026-03-09)
  - [AI Second Brain (new post!)](#ai-second-brain-new-post)
  - [Side Quests (new post!)](#side-quests-new-post)
  - [AI Journal: Verification as Trust](#ai-journal-verification-as-trust)
  - [Cross-linking & Content Updates](#cross-linking--content-updates)
  - [Infrastructure](#infrastructure)
  - [Other Projects (March)](#other-projects-march-1)
- [Week of 2026-02-08](#week-of-2026-02-08)
  - [AI Native Engineering Manager (new post!)](#ai-native-engineering-manager-new-post)
  - [AI Cockpit (new post!)](#ai-cockpit-new-post)
  - [AI Journal: Yegge's AI Vampire](#ai-journal-yegges-ai-vampire)
  - [Spiritual Health: Meaning Traps](#spiritual-health-meaning-traps)
  - [Infrastructure & Tooling](#infrastructure--tooling-1)
  - [Other Projects](#other-projects)
- [Week of 2026-01-25](#week-of-2026-01-25)
  - [AI Journal Updates](#ai-journal-updates)
  - [Spiritual Health & Elder Life](#spiritual-health--elder-life)
  - [Addiction vs Opportunity Cost](#addiction-vs-opportunity-cost)
  - [Product Management](#product-management)
  - [Physical Health Content](#physical-health-content)
  - [How Igor CHOPs](#how-igor-chops)
  - [Infrastructure & Tooling](#infrastructure--tooling-2)
  - [Other Projects](#other-projects-1)

<!-- vim-markdown-toc-end -->

    <!-- prettier-ignore-end -->

## Week of 2026-04-05

_50 commits this week (blog) + cross-repo activity_

### The AI Operator (new post!)

A new post on what it means to operate AI well — framed as a skill like driving a car or operating heavy machinery, not a product you install and forget ([blog](/ai-operator)):

- **Thinking tokens are finite** — Simon Willison running four agents in parallel: "wiped out by 11 AM." AI extends what you get done in a day, but if you spend your thinking budget _supervising_ instead of _directing_, you've traded one kind of exhaustion for another. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5fdbb6a2a)
- **In the loop vs. on the loop** — Borrowed from DoD Directive 3000.09 on autonomous weapons. "In the loop" means you approve each action; "on the loop" means the system acts and you monitor. The goal is to climb out of in-the-loop by defining checkpoints, then let go between them. "The trap: half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8d63cee17)
- **Use voice** — "When you type, the AI is solving the problem you wrote down; when you talk, the AI is solving the problem you actually have." Voice captures the constraints you prune when writing. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/622d008fd)
- **Throw it away** — The economics flipped: code is cheap, thinking is expensive. "If the AI spent 30 seconds generating 400 lines that went sideways, those 400 lines cost you almost nothing to produce — but they'll cost you a lot to untangle." Watch for the sunk cost reflex. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6272c2ee4)
- **Compound engineering** — Every retro, every updated CLAUDE.md, every skill codified is compound interest. `show-your-work` and `walk-the-store` started as manual 10-minute chores, now they're one word. "The second time you do something manually, you're leaving compound interest on the table." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1b5cf8295)

### ACT Made Simple (new post!)

Deep book-notes post on Russ Harris's _ACT Made Simple_ — the practitioner primer for Acceptance and Commitment Therapy. A 1,500+ line reference covering all 32 chapters ([blog](/act)):

- **Psychological flexibility** — ACT's single aim. Harris's triflex: Be Present, Open Up, Do What Matters. "Vitality is not a feeling. It's a sense of being fully alive and embracing the here and now, regardless of how we may be feeling in this moment." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3dfde5e25)
- **The Choice Point** — Towards moves vs. away moves. Any activity can be either, depending on function: "Watching TV to escape the gym is an away move; watching a show I love as a conscious choice is a towards move." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3dfde5e25)
- **Workability over truth** — The single question that replaces "is this thought true?": "If I let this thought guide my behavior, will that help me create a richer, fuller, more meaningful life?" [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3dfde5e25)
- **The Hexaflex** — All six core processes covered in depth: cognitive defusion (Hands as Thoughts), acceptance (Struggle Switch + three As), contact with the present moment (Notice Your Hand), self-as-context (Sky and Weather, Chessboard), values (Mistakenly Held Funeral), committed action (SMART goals, dead person's goal test, HARD diagnostic). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)

### How Igor CHOPs: Flow and CPU Guards

Two additions to the CHOP methodology post:

- **The Flow Question** — "Can you still get flow when you're chopping?" Yes: "It comes from orchestrating — juggling two or three agents at different points in their loops, nudging one, reviewing another, letting the third cook." Challenge-meeting-skill is where flow has always lived. ([blog](/how-igor-chops#the-flow-question)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/07a70ed21)
- **CPU guard** — OrbStack VM core cap plus a userspace watchdog (`cpulimit`) so one feral agent can't starve the other five when running in parallel. CPU-guards started as a standalone post, then got folded into a bullet in the infrastructure section. ([blog](/how-igor-chops#the-server-behind-the-curtain)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e81731409)

### Eternal Terminal Setup & Portable Espresso

- **Eternal Terminal (ET)** — Full setup guide added to the mosh/remote-access post. ET gives persistent remote terminals with IP roaming and true color — works over SSH so existing Tailscale auth just works. Includes init.d script + shell hook for OrbStack auto-start (since OrbStack has neither systemd nor sysv-init). ([blog](/mosh)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c32cbf344)
- **Portable espresso** — OutIn Mino: battery-powered, heats water and brews in 2.5 minutes, 4 shots per charge. Pro tip: pair with a JetBoil Flash (boils water in 100 seconds, 40+ cups per canister) and use the OutIn just for extraction. ([blog](/irl#portable-espresso)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a1578347a)

### CLAUDE.md & Tooling

- **Content guidelines guardrail** — New rule: "If you catch yourself about to write more than 2-3 sentences of prose, stop and load `content_guidelines.md`." AI voice patterns show up almost immediately in unguided prose. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ffed39a44)
- **"Before Creating a New Post" guideline** — Search `_d/`, `_td/`, `_posts/` for the topic first. Technical content that fits an existing post belongs there, not in a new standalone reference. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b905f981)
- **TOC generation procedure** — Documented the `nvim --headless` + `Mtoc update` workflow for generating TOCs from the command line. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/09af37202)
- **running-servers check** — New `--port` and `--process` filters so stray servers (serena MCP, node) don't give false positives when checking for Jekyll on :4000. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fe93fc452)

### Other Projects (April)

- **[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health dashboard) — Major sleep tracking upgrade: sleep detail sheet with stages, debt score, consistency gauge, and per-night strips. Movement card redesign: merged Steps/Distance/Energy into one card with stacked mini box plots. Background prefetch for 7-day stats across all cards. Source filter + layout polish in Phase 3. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7363b9e38)
- **[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** (ACT therapy games) — New "Drop the Rope" scene: a wordless 5-round defusion lesson where the raccoon learns to let go of a tug-of-war rope. Choice Point Catcher merged. Mismatched Crocs on the raccoon (left blue, right yellow). Extracted `canvasAspect()` utility for scene scaling. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/5f3126de1)
- **Settings** — `rbv`: new beads viewer launcher for Dolt workspaces (Typer/Rich CLI). Canonical PEP 723 shebangs across all `py/` scripts. CPU watchdog: prefer `/usr/bin/cpulimit` over linuxbrew shadow. nvim: migrate to mini.nvim + built-in treesitter; suppress tsserver suggestion diagnostics. rmux: side-edit line numbers, side-run command, pane status output. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/b10879fc1)
- **chop-conventions** — New `docs` skill wrapping Context7 for fresh library documentation lookup. New `learn-from-session` skill for extracting durable lessons into CLAUDE.md. `machine-doctor`: CPU guards check, doctor-guards tier split. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d8577a3bf)
- **[blob](https://github.com/idvorkin/blob)** — Raccoon operator hero image for the /ai-operator post. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/b5c0fa6a4)

## Week of 2026-03-30

_28 commits this week (blog) + cross-repo activity_

### AI Relationships: When the Chatbot Is Better at Caring (new post!)

Complete rewrite of the AI relationships post — from a short summary of a Replika study into a research-backed essay on what happens when AI outperforms humans at compassion ([blog](/ai-relationships)):

- **The evidence** — U of T 2025 study: ChatGPT rated more compassionate than trained crisis counselors across four experiments. British Medical Bulletin systematic review: AI chatbots beat human healthcare practitioners in 13 of 15 empathy comparisons. Directly challenges the premise of [Humans Are Underrated](/humans-are-underrated). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/08e603ddc)
- **The atrophy of vulnerability** — Vulnerability is a muscle. Chatbots never judge, never misunderstand, never need anything from you — sounds like a feature, actually a trap. "Every time you fumble through a hard conversation with your partner, you're building capacity for real connection. Choose the chatbot instead, and that muscle atrophies." Links to the [friendship recession](/lonely). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/08e603ddc)
- **Recommendations** — Seven concrete strategies: leave easy problems for humans (the matplotlib "Good First Issue" parallel), use AI as triage not treatment, protect your vulnerability budget, create human-only spaces like [feelings meetings](/human-meetings), notice the drift. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/08e603ddc)
- **Raccoon illustration** — Custom vulnerability-themed raccoon image as social preview. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e2c48e0db)

### Keyboards: From Wrist Pain to Split Keyboards (new post!)

New dedicated post covering the full keyboard rabbit hole — extracted from the IRL post and expanded significantly ([blog](/keyboard)):

- **The backstory** — Street Fighter II in 1996 → decade of wrist flare-ups → complete failure in 2022 → discovery it's a [shoulder problem](/shoulder-pain), not wrists. Grip strength went from 15 lbs to 135 lbs after a year of PT. Needs keyboards 3+ feet apart for shoulder mechanics. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d)
- **Hardware guide** — RK Royal Kludge RK-S70 (home daily driver, hot-swappable), dual iClever folding Bluetooth keyboards (coffee shop, bought 9 of them), Logitech K860 (recommendation for normal people). Simple switch guide: brown = clicky, red = quiet. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d)
- **Programming RK-S70 from macOS** — Full walkthrough: UTM → Windows 11 ARM VM → USB passthrough → RK software. Tried and documented what doesn't work: Kludge Knight (browser WebHID), Rangoli (abandoned), raw QEMU (flaky USB on Apple Silicon). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d)
- **Karabiner multi-keyboard sync** — How two separate Bluetooth keyboards chord across each other (hold shift on left, type on right). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d)

### AI Journal: The Winchester Mystery House

New entry on Drew Breunig's framework for the third era of software development ([blog](/ai-journal#the-winchester-mystery-house-of-software-when-code-gets-too-cheap-to-care-about)):

- **Cathedral → Bazaar → Winchester Mystery House** — Beyond closed-source and open-source: sprawling, personal, idiosyncratic tools built by individuals for themselves. Sarah Winchester had no architecture license, unlimited funds, and built for 38 years — 500 rooms, 2,000 doors, staircases to nowhere. "Today many programmers are Sarah Winchester. When code is cheap enough, we don't need her fortune." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/22910e961)
- **The numbers** — Coding agents generating ~1,000 lines per commit, ~100x faster than humans. But feedback mechanisms (review, testing, validation) haven't sped up. "The internet made coordination cheap (enabling the bazaar), but coding agents made implementation cheap while coordination stayed expensive." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/22910e961)
- **Cross-linked** to [hyper-personalization](/hyper-personal) — new section on Winchester Mystery House as hyper-personalization of software itself. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/378f9b289)

### Content & Gear

- **Mosh → Mosh & Eternal Terminal** — Added full [Eternal Terminal (ET) setup guide](/mosh) alongside mosh. ET has true color support, active development, works over SSH (so Tailscale just works). Detailed Tailscale gotchas: symlink `etterminal` to `/usr/local/bin`, bind to 0.0.0.0, port 2022 ACLs. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c32cbf344)
- **Portable Espresso** — New [IRL section](/irl#portable-espresso): OutIn Mino (battery-powered, 4 shots per charge) + JetBoil Flash combo (boils water in 100 seconds, 40+ cups per fuel canister). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a1578347a)
- **AI Feed** — Two new articles queued: Mark Russinovich on training future engineers (FAFO podcast), Maggie Zhuang's "Manifold of Desire" on RecSys architecture evolution at Meta. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e7259b89c)

### Infrastructure & CI

- **Claude Code Review workflow** — Switched from inline prompt to official `code-review@claude-code-plugins` marketplace plugin. Added `ready_for_review` and `reopened` PR triggers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c9762fbc)
- **Backlinks workflow rewrite** — Simplified from 265 lines to 61 lines. Switched from `pull_request` (closed/merged) to `push` trigger on main. Removed complex merge strategy detection (merge commit vs squash vs rebase). Added path filtering (`_d/**`, `_td/**`, `_ig66/**`). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c590b318)
- **GitHub Actions Node.js 24 bump** — Updated `checkout`, `setup-ruby`, `setup-uv`, and `setup-node` actions across all workflows. Fixed `setup-uv` (v8 tag doesn't exist, use v7). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/02c659014) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb3db6f6c)

### Other Projects (April)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Blog link following in Neovim** — Full `gf`/`gx` support for blog permalinks in markdown. Parser resolves `/permalink#section` → file path using `back-links.json`. Migrated tests from plenary/busted to mini.test. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/6bc9feea2) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/a585a8884)
- **rmux_helper enhancements** — `side-edit` now supports `file:line` syntax, new `side-run` command for shell commands in side pane, pane status output. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5f8ef186d)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health & location data)

- **Gym timer** — New timer feature with shared hooks from igor-timer submodule. Weightlifter emoji button. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/55032c477)
- **Location analytics** — Per-day places breakdown, hourly box plots, tappable bar charts, activity timeline with workout distance fix. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ffa18a780) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16388d252)
- **Health data improvements** — Dates on timestamps, weight in lbs, rich workout details, HRV export fix, architecture refactor. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/b3f514628)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- Machine-doctor skill for system health diagnosis and Gas Town shutdown. Skills conventions and installation docs. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ed7985257) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/c8b624ccc)

## Week of 2026-03-16

_24 commits this week (blog) + cross-repo activity_

### Claws: The Next Layer of AI (new post!)

New post on the emerging "claw" concept — persistent, autonomous AI entities that live beyond a single session ([blog](/claw)):

- **Karpathy's Onion** — Six-layer progression: LLM → Agent → Claw → Multi-claw → Orchestration → Meta-optimization. "The LLM part is now taken for granted. The agent part is now taken for granted. Now the claw-like entities are taken for granted." Each layer opens a new infinity; everything that doesn't work is a "skill issue." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)
- **The Lethal Trifecta** — Simon Willison's security framework: access to private data + exposure to untrusted content + ability to communicate externally. Any two are manageable; all three are a minefield. Real incidents: an autonomous agent published a hit piece on a matplotlib maintainer, Meta's AI safety director's inbox got speedrun-deleted during context compaction, and 2,419 malicious skills purged from ClawHub (1,184 actively draining crypto wallets). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)
- **My Three Claws** — Larry (life coach), Wally (work, undisclosed), Tony (Tesla with a voice persona). Currently at layer 3-4 on Karpathy's onion: personality and memory but not yet truly autonomous. David de Winter's metaphor: "It's like training Pokémon — you carry around your team, each one specialized, and they grow as you invest time." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)

### AI Journal: Telegram, Eggs, and Feedback Loops

Three new entries covering disposable code, human contribution in AI workflows, and AI-driven tool improvement ([blog](/ai-journal#2026-03-21)):

- **Telegram Bot: When the Platform Eats Your Side Project** — Built a custom Telegram bot to talk to Claude from phone. Then Anthropic shipped an official Telegram channel plugin and Igor happily threw it away. "When vibe coding makes building cheap, attachment to code dissolves." Then layered intelligence on top of the official plugin: Parakeet TDT for STT (0.35s transcription), Kokoro-82M for TTS, SQLite message logging via hooks, and weather nudges via Open-Meteo that ping on sunny transitions. "Start with the platform's transport, then layer intelligence on top." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8e1881824) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/acf20b7ae)
- **The Egg Theory** — In the 1950s, Betty Crocker's instant cake mix flopped because it was too easy. Adding an egg — a token human contribution — made people feel like bakers instead of package-openers. Same applies to AI: when AI does everything, nobody feels ownership. Best AI workflows intentionally leave meaningful "eggs": architecture decisions, genuine code review, prompt refinement, creative direction. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d54b734db)
- **AI Filing Feature Requests** — During a weekly report, Claude hit bad HealthKit data from context-grabber (13.8h sleep, unreliable exercise minutes). Instead of working around it, Claude filed four structured issues on the source repo, then continued with what it could trust. "The most powerful thing an AI can do isn't work around bad data — it's improve the source." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f3ab9e75f)

### AI Native Manager: "In Distribution"

New glossary entry on the ML concept applied to tooling decisions ([blog](/ai-native-manager#in-distribution)):

- **In Distribution** — Tools in the model's training data (Git, Postgres) have zero awareness cost. Your team's internal CLI? Completely out of distribution — you pay the awareness tax every time. This changes how EMs evaluate tooling: "will agents already know how to use it?" is now a legitimate engineering criterion. Connects to Yegge's Awareness lever from Software Survival 3.0. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56667aaef)

### Content Updates

- **Raccoon History** — Added image grids showing all three eras of raccoon mascot illustrations (DALL-E v1, v2 eulogy pack, v3 AI Native EM series). Refreshed stale images, converted all `.png` references to `.webp`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/476455361) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/434bc07a1)
- **Joy** — Added "What Happened to the Symbol of American Clowns" documentary (David Arquette, John C Reilly, Steve-O) to Role Models section. "It's actually a pretty selfish job because what I get out of it — it makes me feel good to make people feel good." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4a32b67ae)
- **Explainers** — Added Karpathy's US Job Market Visualizer: interactive treemap of 342 occupations with toggleable metrics (outlook, pay, education, AI exposure). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f22e0397a)

### Infrastructure & Tooling

- **Jekyll Ruby 4.0+ fix** — Monkey-patched `pathutil` keyword arg incompatibility via TracePoint-based lazy prepend. Ruby 4.0 removed implicit Hash-to-kwargs conversion; this intercepts `require "pathutil"` and patches IO methods. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb000683a)
- **Show-your-work skill** — New skill that screenshots changed blog pages, hosts images on GitHub gist, and produces PR-ready markdown. Auto-detects changed pages from git diff. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/cacd5a0d5)
- **AI feed upgrade** — Podcast/YouTube URLs now route to transcript processor with quality hierarchy (human > manual > ASR). Added preferred creators list (Karpathy, Lex Fridman, Steinberger). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)

### Other Projects (March)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- Box plot statistics (p5/p25/p50/p75/p95) for weekly health metrics with horizontal box plot visualization [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1)
- Configurable known places with radius-based GPS matching + JSON import for bulk setup [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1)
- Sleep source breakdown: per-source (Apple Watch, AutoSleep) bedtime/wakeTime and stage hours (Deep, Core, REM, Awake) replacing raw sample export [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1)

**[tg-bot](https://github.com/idvorkin/tg-bot)** (Telegram bot → deprecated)

- Added deprecation notice — replaced by official Claude Code Telegram channel plugin [<i class="fa fa-github"></i>](https://github.com/idvorkin/tg-bot/commit/56f56cbe7)

**[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** (interactive explainer, Nicky Case-inspired)

- Morning choice mini-game: alarm intro animation, beat transitions, drag interaction with spring-back, productive/go path choices, responsive canvas layout for mobile [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/e2022d2d9)
- Happy raccoon favicon + web app manifest, header tap to restart [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/cfa04c736)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- Browser-free OAuth fallback for headless servers — prints URL, user authorizes in any browser, pastes redirect URL back [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/844efcc87)
- Fixed Kindle notebook email detection (broadened Gmail query) and Pydantic deprecation migration [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/036d9f8fc)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- Rewrote up-to-date skill for token efficiency (226 → 119 lines), added remote hygiene check [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/76fa478cb)
- New clock and background-usage skills with thin dispatcher pattern [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/3e1e966cd)

## Week of 2026-03-09

_14 commits this week (blog) + lots of cross-repo activity_

### AI Second Brain (new post!)

New post on replacing manual PKM (PARA, Zettelkasten) with AI-powered context retrieval ([blog](/ai-second-brain)):

- **The Flywheel** — Three ingredients: Available Context (feed AI everything — blog, journals, health data, reading history), Pre-brief (load context before acting), Debrief (capture insight while fresh). Each cycle makes the next one richer. "Traditional second brains failed because 'organize' was a separate chore. Pre-brief and debrief are _part of the work itself_." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)
- **Larry as User, Not Brain** — Larry the life coach is a _persona_ that uses the second brain, not the brain itself. Better second brain → smarter Larry. Same for Randy (reading) and Tony (accountability). Personas without a second brain give generic advice; a second brain without personas is just a pile of data. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)
- **Organizational Second Brain** — Cognitive debt isn't just a code problem. Teams lose shared understanding when AI accelerates everything. An org second brain synthesizes across meetings, docs, Slack, and code — answering "What decisions were made about X and why?" without anyone having to remember. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)

### Side Quests (new post!)

New tracking page for lightweight tech explorations — "seasoning, not the meal" ([blog](/side-quests)):

- **Magic Monitor Card Detection** — Trained YOLO26s on 21K synthetic playing card images (Google Colab, A100 GPU, <$1). Went from 40% recall to 73% recall in-browser via ONNX Runtime Web. Key insight: preprocessing matters as much as the model — stretching vs letterboxing can halve recall without changing a weight. Before/after comparison with debug snapshots. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ad8434558)
- **Context Grabber** — iOS app pulling HealthKit data (steps, heart rate, sleep, weight, meditation, HRV) + background location tracking. Graduated from side quest to side project with 68 tests. Feeds JSON into Larry for data-driven life coaching. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4a86702b1)
- **Apple Virtualization (shelved)** — Explored Lume for macOS VMs on Apple Silicon. WebGL works but WebGPU does not. Can't create Apple Accounts in VMs. Both use cases hit dead ends. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ef43d2936)

### AI Journal: Verification as Trust

New entry on what makes AI PRs trustworthy ([blog](/ai-journal#when-ai-shows-its-work-verification-as-trust)):

- **Show, Don't Tell** — The most convincing AI PRs aren't the ones with the best code — they're the ones with screenshots, exact test counts, staging URLs, and before/after comparisons. Pattern: (1) screenshots of visual change, (2) exact test counts with coverage areas, (3) staging link, (4) confirmation existing tests pass. "That's the difference between a 30-minute review and a 3-minute review." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7aaf9b0d9)

### Cross-linking & Content Updates

Wove Context Grabber and AI Second Brain across existing posts:

- **Larry** — Rewrote "What Larry Knows" → "What Larry Could Know." Honest about the gap between vision and reality: "I'm still building the pipes." Added Context Grabber as HealthKit data source. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e)
- **AI Native Manager** — Added link from cognitive debt section to the organizational second brain concept. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)
- **Hyper-Personal** — New section: "Your AI Second Brain — The Ultimate Personalization." The second brain is the foundation layer that makes all other personalization possible. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)
- **Structure** — Added Context Grabber as concrete example of implicit capture feeding AI coaching. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e)
- **Pet Projects** — Added Context Grabber to productivity tools table, updated Magic Monitor description with card detection and side quest link. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e)

### Infrastructure

- **Jekyll Ruby 3.2+ fix** — Monkey-patched `tainted?`/`taint`/`untaint` (removed in Ruby 3.2) via `_ruby_compat.rb`, added `bigdecimal` and `ostruct` gems, updated justfile to auto-load the compat shim. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c851e24ae)
- **Walk-the-store skill** — New skill for visual blog audits: screenshots key pages, builds a browsable gallery. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b560b282)

### Other Projects (March)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- Location clustering with grid-based union-find (O(n)), run-length encoded timelines, 50m grid cells adjusted for latitude [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/08be4fd2b)
- Added HRV, resting HR, exercise minutes; 7-day share format; fixed sleep double-counting and weight units [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7b52df6a3)
- Auto-grab on startup, OTA updates, share loading indicator [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/e299437a4)

**[magic-monitor](https://magic-monitor.surge.sh)** (smart mirror) [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor)

- YOLO26s @ 640 card detection: fixed ONNX output parsing, letterbox preprocessing, overlay coordinates, debug snapshot tool [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/4f80c89ea)
- Colab training notebook with form controls, model moved to S3 runtime loading [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/c66905937)

**[humane-tracker-1](https://humane-tracker.surge.sh)** (habit tracking)

- Row selection for habit backfill — long-press to select a row, bypassing confirmation dialogs. `Selection` discriminated union makes row/column mutual exclusivity type-safe. 9 unit + 8 E2E tests. [<i class="fa fa-github"></i>](https://github.com/idvorkin/humane-tracker-1/commit/2b958e953)

**[tg-bot](https://github.com/idvorkin/tg-bot)** (Telegram bot)

- Voice transcription polling with Parakeet, `--reply-to` flag for threaded replies [<i class="fa fa-github"></i>](https://github.com/idvorkin/tg-bot/commit/ff97ec296)

**[streamdeck-igor-vibe](https://github.com/idvorkin/streamdeck-igor-vibe)** (Stream Deck)

- Switched tmux keystrokes from spawning `uv` subprocesses to inline Quartz CGEvent — bypasses Karabiner interception [<i class="fa fa-github"></i>](https://github.com/idvorkin/streamdeck-igor-vibe/commit/73e04283b)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP docs)

- New gist-image skill for hosting binary images on GitHub; refactored showboat and image-explore to reference it [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/b4a93e5d1)

## Week of 2026-02-08

_17 commits this week_

### AI Native Engineering Manager (new post!)

Brand new post: what does it mean to manage engineers when AI is rewriting every assumption about software, teams, and your role? ([blog](/ai-native-manager))

- **The AI Chasm** - Six adoption stages people go through: Denial → Skepticism → Fear → Frenzy → Burnout → Sustainable Execution. Your job as EM is to assess where each person is and meet them there. "If the people you support aren't scared shitless of AI taking their jobs, you need to get them there — and then get them past there." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed)
- **Coaching Through the Chasm** - Specific playbooks for each transition. Denial→Skepticism: show don't tell, pair on their actual codebase. Fear→Frenzy: make it safe to experiment, pair with someone in Sustainable Execution not Frenzy. Frenzy→Burnout: "You shipped three features this week, that's enough." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed)
- **Divide and Conquer roles** - Trailblazer (scouts new tools), Toolsmith (turns discoveries into repeatable workflows), Skeptic (catches hallucinations, insists on tests), Bridge (translates between AI-fluent and AI-skeptical). "The trailblazer who's forced to write docs burns out." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a87a256ba)
- **AI Free Zones** - Two reasons: (1) "Don't stop thinking" — if you reach for AI every time something is hard, you atrophy the skills that make AI-augmented time effective. (2) Sometimes you just need a break — not every lunch needs to become an AI discussion. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/20c8a89e3)
- **Functional Collapse** - Everyone can be a "builder" now, but "can" and "good at" are different. Same thing happened when dev and test merged — title collapsed, specialties persisted. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/345858011)

### AI Cockpit (new post!)

New post on the physical and software control surface for multi-agent development ([blog](/ai-cockpit)):

- **Voice as primary interface** - Not just input method — talking changes how you think. More stream-of-consciousness, half-formed thoughts you'd never bother typing. Wispr Flow at home, SuperWhisper (local models on M4 Max) at work. "Transcription quality barely matters. Agents are resilient to garbled input." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/27e265542)
- **Rust tmux picker** - Hand-written Rust tool: token-based fuzzy matching, visual markers for current/previous pane, 14ms response time (ported from 100ms Python). "I don't even know Rust, but AI made it trivial." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1d54a78dd)
- **The full stack** - Tmux (the stick), Alfred (session switcher), Agent Dashboard (radar screen showing git/PR/server status across containers), Stream Deck (physical buttons for pane navigation by feel). "Physical buttons matter because they don't require visual attention." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1d54a78dd)
- **The meta-question** - Is cockpit infrastructure a waste when models keep getting smarter? "The meta-skill isn't 'how to configure tmux' — it's how to build a human interface for AI delegation. That problem isn't going away." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1d54a78dd)

### AI Journal: Yegge's AI Vampire

New entry on AI value capture ([blog](/ai-journal#2026-02-14)):

- **The AI Vampire** - Yegge's Feb 2026 article: AI makes you 10x productive but creates a vampire dynamic. Company captures all value (Scenario A: you work 8hrs at 10x, employer gets 9 engineers free, you get burnout) or employee captures all (Scenario B: you work 1hr, company dies competitively). The answer is somewhere in the middle. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ea624b0c)
- **The $/hr formula** - From Yegge's Amazon days (2001): you can't control the numerator (salary) but you control the denominator (hours). His prescription: 3-4 hour workdays. "Go touch grass every day. Close the computer. Go be a human." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ea624b0c)
- **It's the Integral, Not the Point** - Igor's response: present value (today's 10x) is a point on the curve. Future value (compounding AI fluency) is the area under the curve. Team AI fluency compounds faster than individual — shared context, shared mistakes, shared breakthroughs. "The collaboration IS the value capture mechanism." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ea624b0c)

### Spiritual Health: Meaning Traps

Rewrote the spiritual health intro as exploratory rather than prescriptive, and added four meaning traps ([blog](/spiritual-health#the-meaning-traps)):

- **The motivation test** - "Are you sustainably motivated in a way you'd be proud to see in your child?" Motivation is the proof that meaning is present — not the philosophy, not the framework. Frankl said _motivational_ force, not intellectual force. When meaning is present, [activation energy](/activation) for meaningful activities drops dramatically. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/772bc2169)
- **Four traps** - (1) Philosophy Pit: you can define all three dimensions perfectly and still be spiritually empty. (2) Motivation Test You Keep Failing: beautiful eulogy document but no behavior change in months. (3) Meaning Without Motion: clinging to a meaning source that dried up. (4) Borrowed Meaning: adopted someone else's purpose — doesn't survive contact with a hard Tuesday morning. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/772bc2169)
- **2026 goals updated** - Added the motivation test as a Q1 goal, linked spiritual health dimensions to specific diagnostic questions, added walking-with-god as a daily practice anchor ([blog](/y2026#spiritual-health)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e50920005)

### Infrastructure & Tooling

- `/ai-content` skill — specialized workflow that loads AI content map (21 posts organized by theme cluster), reads backlinks, and sets up branch/server for AI blog post editing [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8f358f756)
- `/spiritual-content` skill — same pattern for inner-life posts (spiritual health, religion, meditation, eulogy, etc.) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/590894703)

### Other Projects

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- `ammon` skill: checks time in Denmark (Europe/Copenhagen) with sleep warning for coordinating across time zones [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/190f2bc87)
- up-to-date skill: offer `/clear` after sync since users typically run this at session start when old context is stale [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d73d7e0c1)

---

## Week of 2026-01-25

_41 commits this week_

### AI Journal Updates

Five new entries on AI-era software development ([blog](/ai-journal#2026-01-31)):

- **Software Survival 3.0** - Steve Yegge's survival ratio: `Survival ∝ (Savings × Usage × H) / (Awareness + Friction)`. Six levers: insight compression, substrate efficiency, broad utility, publicity, minimize friction, human coefficient. "Nobody is coming for grep." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bdedc6f02)
- **Step Behind the Bleeding Edge** - Monarch's philosophy: own your work, do deep thinking yourself, leave room for inspiration, design validation loops. The tension between AI productivity and human expertise. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c)
- **Code as Cattle, Not Pets** - The infrastructure parallel: servers went from pets (unique hostnames) to cattle (who cares which server). Code is making the same shift. "The system is dead, long live the factory." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c)
- **whenwords: The Ghost Library** - A library distributed as spec + tests with ZERO implementation. You paste a prompt, LLM generates the code. "The prompt IS the code." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c)
- **Review Cost < Generation Cost** - The proxy that broke: code used to signal understanding and commitment. Now AI can generate code without understanding constraints. tldraw closing external PRs, LLVM AI policy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c1447d04)

### Spiritual Health & Elder Life

New section: "Getting Started: For Those Who've Never Done This" ([blog](/spiritual-health#getting-started-for-those-whove-never-done-this)):

- **The Lifecycle Pattern** - James Fowler's research: spiritual interest rises predictably in midlife. Young adults reject religion's contradictions; by 40s-50s they see beauty where they once saw superstition. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6961c1423)
- **Vanaprastha Framework** - Hindu 4-stage life model: Brahmacharya (learning) → Grihastha (career/family) → Vanaprastha (spirituality/wisdom) → Sannyasa (enlightenment). The Grihastha trap: trying to make stage 2 last forever. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6961c1423)
- **Three Obstacles** - (1) "None" identity trap, (2) Santa in the Church (childish impressions), (3) Tyranny of Time. Solutions from Arthur Brooks' _From Strength to Strength_ chapter 7. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd1a34e66)

### Addiction vs Opportunity Cost

New framework distinguishing compulsion from choice ([blog](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)):

- **The distinction**: Addiction = you DON'T want to do it but feel compelled. Opportunity cost = you DO want to do it but pay a price elsewhere.
- **The test**: "If I had to stop, would it feel like relief or loss?" TikTok = relief (addiction). Vibe coding = loss (opportunity cost).
- **TikTok as thought escape**: Not seeking dopamine hits—escaping the discomfort of having an inner mental life. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9d5f53bea)

### Product Management

**Desire Paths** - methodology for discovering revealed preferences ([blog](/product#desire-paths-a-methodology-for-discovering-revealed-preferences)):

- Michigan State built buildings first, waited a year, paved where students actually walked
- Twitter didn't design @mentions or #hashtags—users invented them, Twitter "paved the desire paths"
- Yegge's "hallucination squatting": implement what AI agents try to do until their guesses become correct [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c7a04a612)

### Physical Health Content

**Shoulder Pain** - complete muscle anatomy reference ([blog](/shoulder-pain#shoulder-movement-directions-and-muscles)):

- Movement vocabulary: flexion, extension, abduction, adduction, internal/external rotation
- SITS rotator cuff muscles and their roles in centering the humeral head
- Why external rotation is THE critical movement for fixing impingement [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c052e629b)

### How Igor CHOPs

**8 Stages of AI Coding** diagram from Yegge's Gas Town ([blog](/how-igor-chops#the-8-stages-of-ai-coding)):

- Stages 1-4: Manual → Approval-based → YOLO mode → Full autonomy
- Stages 5-8: Single agent → Parallel agents → Specialized tools → Orchestrated system
- "Where I am: somewhere between 6 and 7, learning to avoid merge hell" [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6)

**What Works Well** principles ([blog](/how-igor-chops#what-works-well---review-this-weekly)):

- Rent the most expensive brain you can—$200/month is nothing vs force multiplication
- Maximize time between interventions (Tesla self-driving metric)
- Don't be the intern doing grudge work—if AI writes and you test, roles are backwards [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6)

### Infrastructure & Tooling

- `/content` skill for blog workflow [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b)
- ASIN database: fetched metadata for 28 products [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/99c355400)

### Other Projects

Updates across the ecosystem:

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- `ter` command: 432-line addition to y.py for terminal tab switching between named sessions [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/c5a71186c)
- Neovim `:PRStatus` and `:PRDiff` commands to view all changes in current PR against main [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/9caa71bcd)
- Fix tmux `C-o` binding reset: explicit bind-key so config reload preserves rotate-window [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/d41d98f38)
- Auto-detect PR base ref (upstream vs origin, main vs master) for fork workflows [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/0df43e437)
- gmail_reader: optional filename parameter to ping_url for clearer download logging [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/d658f0209)
- Parameter completion infrastructure for y.py CLI [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2d7e81279)

**[nlp](https://github.com/idvorkin/nlp)** (AI/NLP tools)

- Local MLX TTS: text-to-speech on Apple Silicon without cloud API calls [<i class="fa fa-github"></i>](https://github.com/idvorkin/nlp/commit/61aa07c58)

**[monitor-explainer](https://monitor-explorer.surge.sh)** (new project!) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer)

Built from scratch this week - React + TypeScript + Vite interactive tool:

- SVG visualization comparing monitors by aspect ratio (16:9, 21:9, 32:9) and size [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/3945f2323)
- Pan and zoom functionality for the visualization [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/01ee334d8)
- Individual monitor dragging with snapping + duplicate monitors [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/dd0ac4254)
- Monitor rotation support (portrait mode) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/de9f77fb8)
- View mode selector with overlay and animated transitions [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/031684aab)
- Organize monitor selection by aspect ratio categories [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/b4c7e64ff)
- Surge deployment with PR previews [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/9ceeaea4a)

**[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** (time tracker) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai)

- Added deployment docs: Surge.sh production + PR preview URLs [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/93061f9d7)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- up-to-date skill: detect commits on feature branch not in main after PR merge [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/8c0290552)

---

_Want to see what's been modified recently? Check [Recently Modified Content](/recent) for a dynamic view._

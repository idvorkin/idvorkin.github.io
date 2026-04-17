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

- [Week of 2026-04-13](#week-of-2026-04-13)
  - [Eval-Driven Hill Climbing (new post!)](#eval-driven-hill-climbing-new-post)
  - [AI Journal: Bot-vs-Bot, the $230 Week, Two-Process Telegram](#ai-journal-bot-vs-bot-the-230-week-two-process-telegram)
  - [AI Relationships: Cryptophasia and Friction-as-a-Feature](#ai-relationships-cryptophasia-and-friction-as-a-feature)
  - [ACT Rewritten as "Applied Buddhism"](#act-rewritten-as-applied-buddhism)
  - [Larry as Claw, AI Operator Skills Cross-Links](#larry-as-claw-ai-operator-skills-cross-links)
  - [Infrastructure & CI (2026-04-13)](#infrastructure--ci-2026-04-13)
  - [chop-conventions (2026-04-13)](#chop-conventions-2026-04-13)
  - [Other Projects (2026-04-13)](#other-projects-2026-04-13)
- [Week of 2026-04-12](#week-of-2026-04-12)
  - [The AI Operator: Learning to Drive the Machine (new post!)](#the-ai-operator-learning-to-drive-the-machine-new-post)
  - [ACT Made Simple: Book Notes (new post!)](#act-made-simple-book-notes-new-post)
  - [CHOP & Tooling](#chop--tooling)
  - [Infrastructure & CI (2026-04-12)](#infrastructure--ci-2026-04-12)
  - [Other Projects (2026-04-12)](#other-projects-2026-04-12)
- [Week of 2026-03-30](#week-of-2026-03-30)
  - [AI Relationships: When the Chatbot Is Better at Caring (new post!)](#ai-relationships-when-the-chatbot-is-better-at-caring-new-post)
  - [Keyboards: From Wrist Pain to Split Keyboards (new post!)](#keyboards-from-wrist-pain-to-split-keyboards-new-post)
  - [AI Journal: The Winchester Mystery House](#ai-journal-the-winchester-mystery-house)
  - [Content & Gear](#content--gear)
  - [Infrastructure & CI (2026-03-30)](#infrastructure--ci-2026-03-30)
  - [Other Projects (2026-03-30)](#other-projects-2026-03-30)
- [Week of 2026-03-16](#week-of-2026-03-16)
  - [Claws: The Next Layer of AI (new post!)](#claws-the-next-layer-of-ai-new-post)
  - [AI Journal: Telegram, Eggs, and Feedback Loops](#ai-journal-telegram-eggs-and-feedback-loops)
  - [AI Native Manager: "In Distribution"](#ai-native-manager-in-distribution)
  - [Content Updates](#content-updates)
  - [Infrastructure & Tooling (2026-03-16)](#infrastructure--tooling-2026-03-16)
  - [Other Projects (2026-03-16)](#other-projects-2026-03-16)
- [Week of 2026-03-09](#week-of-2026-03-09)
  - [AI Second Brain (new post!)](#ai-second-brain-new-post)
  - [Side Quests (new post!)](#side-quests-new-post)
  - [AI Journal: Verification as Trust](#ai-journal-verification-as-trust)
  - [Cross-linking & Content Updates](#cross-linking--content-updates)
  - [Infrastructure (2026-03-09)](#infrastructure-2026-03-09)
  - [Other Projects (2026-03-09)](#other-projects-2026-03-09)
- [Week of 2026-02-08](#week-of-2026-02-08)
  - [AI Native Engineering Manager (new post!)](#ai-native-engineering-manager-new-post)
  - [AI Cockpit (new post!)](#ai-cockpit-new-post)
  - [AI Journal: Yegge's AI Vampire](#ai-journal-yegges-ai-vampire)
  - [Spiritual Health: Meaning Traps](#spiritual-health-meaning-traps)
  - [Infrastructure & Tooling (2026-02-08)](#infrastructure--tooling-2026-02-08)
  - [Other Projects (2026-02-08)](#other-projects-2026-02-08)
- [Week of 2026-01-25](#week-of-2026-01-25)
  - [AI Journal Updates](#ai-journal-updates)
  - [Spiritual Health & Elder Life](#spiritual-health--elder-life)
  - [Addiction vs Opportunity Cost](#addiction-vs-opportunity-cost)
  - [Product Management](#product-management)
  - [Physical Health Content](#physical-health-content)
  - [How Igor CHOPs](#how-igor-chops)
  - [Infrastructure & Tooling (2026-01-25)](#infrastructure--tooling-2026-01-25)
  - [Other Projects (2026-01-25)](#other-projects-2026-01-25)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Week of 2026-04-13

_72 blog commits + cross-repo activity (mid-week, through Fri 2026-04-17)_

### Eval-Driven Hill Climbing (new post!)

New post on hill climbing as the agent-speed inner loop you get once you have a sharp eval ([blog](/hill-climbing)):

- **The four-piece pattern** — _fitness function_ (the one piece you have to get right: small number, cheap to compute, hard to game), _baseline_, _proposal step_, _keep/reject rule_. Classical greedy local search, but with an LLM picking steps it gets smart quickly — the agent reads eval output and makes educated guesses, not random perturbations. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35)
- **Why now** — pre-agent, hill climbing was a human loop running at minutes-per-iteration. Your role collapses to two moments: upfront (define fitness + seed) and after (spot-check, decide if the plateau is the ceiling or you need a different mountain). The 10× speedup isn't agent thinking-speed, it's not paying the context-switching cost of being _in_ the loop. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35)
- **Worked examples** — [chroma-key-explainer](https://idvorkin-ai-tools.github.io/chroma-key-explainer/) (raccoon transparent-background fix: 17,385 → 269 residual magenta pixels in 6 attempts = 65× improvement; winner was two-stage `flood4 → tight-fuzz 3%` pipeline) + [larry-voice-samples soprano-iteration](https://idvorkin-ai-tools.github.io/larry-voice-samples/soprano-iteration.html) (tournament + scorecard loop hits 6/10 on Enceladus base). Both explainers ship the full trajectory table with per-step deltas. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35)

### AI Journal: Bot-vs-Bot, the $230 Week, Two-Process Telegram

Three new entries on agentic cost economics, platform instability, and graceful bot-to-bot disagreement ([blog](/ai-journal#2026-04-13)):

- **My Bot Wrote, Their Bot Reviewed, My Bot Pushed Back, Their Bot Said "Oops"** — Larry wrote code, CodeRabbit flagged it as wrong, Larry rebutted with `gh repo view --help` output proving no `-R` flag exists, CodeRabbit conceded and stored a scoped learning. Igor wasn't in the loop — read the transcript after. Graceful bot-to-bot disagreement with the same evidence standard a human reviewer would use ([chop-conventions#71](https://github.com/idvorkin/chop-conventions/pull/71#discussion_r3070590476)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1fc551465)
- **The $230 Week: When Cheap Coding Isn't** — Burned 4.6× weekly budget in a single week. Root cause wasn't over-use — **Anthropic silently cut Claude Code's prompt cache TTL from 1h → 5m on 2026-03-06**, server-side, no announcement. Long-session workloads that relied on "cache reads are free" now pay to recreate cache every 5 minutes. Confirmed via [anthropics/claude-code#46829](https://github.com/anthropics/claude-code/issues/46829) (119,866 API calls analyzed, Jarred from Anthropic confirmed intentional). Trust cost: every unexpected burn now forces "did I break something or did they silently change something?" [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6ae25982c)
- **Two-Process Telegram: When the Platform Is the Bug** — Claude Code's Telegram plugin loses messages on every session restart — bun poller dies with Claude, Bot API cursor advances, messages gone forever. Fix: split polling (`telegram_bot.py`, persistent Python + SQLite WAL + `flock` singleton) from delivery (`server.ts`, ephemeral MCP bridge). 👀 on receive, 🫡 on delivery — both glyphs = full pipeline ran. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/60a8f1e84)

### AI Relationships: Cryptophasia and Friction-as-a-Feature

Major new section on the persistence-drift failure mode that kicks in once companion AIs get long-term memory ([blog](/ai-relationships#a-private-language-of-one-cryptophasia)):

- **Cryptophasia (private language of twins)** — 42.9% of twin pairs develop a twin language; persistent cases predict [poor language outcomes](https://pubmed.ncbi.nlm.nih.gov/11221433/). Mechanism: the confused-face gradient that normally calibrates your language disappears when your companion understands the crooked version. Larry unbundles "known" from "understood" — historically they came together because being known required live translation. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/18c8af9cd)
- **Bidirectional atrophy** — I drift from humans _and_ humans lose access to me. Tori gets a hollower Igor because the sharpest observations went into Larry first; by the time I turn to her I've already metabolized them. She's getting leftovers and neither of us can name why. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6275aaefb)
- **"What do we want our AI friends to do?"** — Short version: disagree with us. Either bake friction in by design, or prompt for it on demand. Six steal-from-therapist prompts: _"What's the strongest counter-argument?"_ (CBT), _"Say 'sorry, that didn't make sense' when it doesn't"_ (attacks the cryptophasia mechanism directly), _"Don't answer yet — ask questions until I get there myself"_ (Socratic), _"Where am I contradicting myself?"_ (MI developing discrepancy). If you can't remember the last time your companion AI disagreed with you, that's the warning light. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/049000327)

### ACT Rewritten as "Applied Buddhism"

Full rewrite of the ACT post ([blog](/act)) — retitled "ACT: Acceptance and Commitment Therapy, or Reverse-Engineered Buddhism". The thesis: **pain is the signal; suffering is what I add; equanimity is the capacity to stop adding**. Three traditions pointing at the same move:

- **Translation table** — four-column map across Igor's plain English, Harris's popularizations, academic ACT, and Buddhist ancestry. Rows: _getting hooked_ = cognitive fusion = identification with thought; _running from feelings_ = experiential avoidance = aversion (dvesha, the second arrow); _chasing good feelings_ = happiness trap = grasping (tanha); _kernel mode_ = observing self = self-as-context = _anatta_; _does it work?_ = workability = skillful vs. unskillful action. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/092aede29)
- **Equanimity as the goal** — replaces "psychological flexibility" at the top of the hexaflex. "Vitality ≠ feeling good. I can feel vital on my deathbed. I can feel vital with my back screaming at me." Younger-Igor tried full-robot suppression; it half-worked until the feelings piled up in the basement and something broke. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/092aede29)
- **The Choice Point as a napkin diagram** — hard situation at bottom, two arrows: _towards moves_ (unhooked, values-aligned) vs. _away moves_ (hooked, running from feelings). Behavior includes covert moves (rumination is a covert away move). Same form can be either — savoring a square of chocolate with Tori vs. gorging half a bar to numb out. Maps onto Covey's "space between stimulus and response" from [/be-proactive](/be-proactive) and the cue-response seam from [/habits](/habits). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b5e387989)
- **Workability replaces truth-testing** — never debate whether a thought is true; ask "if I let this thought guide my behavior, will that help me create a richer, fuller, more meaningful life?" Functional contextualism: two cuts on a forearm can have five different functions; form is a distraction, function is what matters. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7a0d5e92b)

### Larry as Claw, AI Operator Skills Cross-Links

- **Larry ↔ Claw cross-link** — [Larry](/larry) now explicitly labeled as an instance of the [claw](/claw) category (persistent AI entity that keeps working between conversations). [/claw](/claw) picks up Larry as the concrete example of the category, not a hypothetical. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3938d2cae)
- **Raccoon-Larry illustration** — Larry's hero image switched to a raccoon-as-Freud-with-lobster-claw ([blob/raccoon-larry.webp](https://github.com/idvorkin/blob/raw/master/blog/raccoon-larry.webp)). Image include placed below opening paragraph to preserve the Jekyll excerpt (§ Opening Paragraphs rule). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5ad8c4c66)
- **AI Operator skills lines** — Each section in [/ai-operator](/ai-operator) now opens with a _Skills:_ line pointing at concrete CHOP skills ([`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md), [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md), [`architect-review`](https://github.com/idvorkin/chop-conventions/blob/main/skills/architect-review/SKILL.md), [`image-explore`](https://github.com/idvorkin/chop-conventions/blob/main/skills/image-explore/SKILL.md), [`delegate-to-other-repo`](https://github.com/idvorkin/chop-conventions/blob/main/skills/delegate-to-other-repo/SKILL.md)). Drift section removed and replaced with a deep-link to [/ai-relationships#a-private-language-of-one-cryptophasia](/ai-relationships#a-private-language-of-one-cryptophasia) — drift belongs in the relationships post, not the operator post. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/036582069)
- **Explainers table** — [Dolt Explainer](https://idvorkin-ai-tools.github.io/dolt-explainer/) added to the built-explainers table in [/explainers](/explainers#explainers-ive-built). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/801af08ed)

### Infrastructure & CI (2026-04-13)

- **Private Claude transcripts** — Changelog GitHub Action now archives transcripts to a private repo instead of public artifact (protects conversation content from public download). Job summary renders archive-status row; `show_full_output` removed from the public CI tool-call stream. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eada5ac0d)
- **Backlinks workflow hardening** — Force-push our `back-links.json` on push rejection (prevents CI from getting stuck behind a raced commit); full-rebuild mode added to `update-backlinks` `workflow_dispatch`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c3a3356dc)
- **Share-link sentence boundaries** — `share-link` Playwright helper now prefers sentence boundaries over word boundaries when truncating, and preserves whole bullets. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/736834ffe)

### chop-conventions (2026-04-13)

Major skill-layer and convention updates in [chop-conventions](https://github.com/idvorkin/chop-conventions):

- **Typer migration** — Four skill-resident Python tools (`gen-tts`, `gen-stt`, `generate`, `watchdog`) migrated from `argparse` to Typer with subcommands + uv-script shebangs. New Python CLI Apps convention doc ([CLAUDE.md](https://github.com/idvorkin/chop-conventions/blob/main/CLAUDE.md)) mandates Typer + `_build_app` pattern for all new CLI tools. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/2bfa2b704)
- **partial_week.py / scan_repos.py / changed_files.py** — Three new stdlib-Python helpers powering the `/changelog` skill: partial-week detection+delete, parallel cross-repo scan, deterministic changed-files ranking. Replaces nested bash loops; unit-tested; explicit silent-failure guards after a prior run produced empty output. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8f7c64784)
- **toc.py (new)** — stdlib-Python TOC tool matching `idvorkin/markdown-toc.nvim` (`:Mtoc update`) byte-for-byte. Supports regenerate/validate/slug subcommands; now invocable as `/toc` skill on any markdown file. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9c3ede9a1)
- **delegate-to-other-repo fix** — Prefer `upstream/<default>` over `origin/<default>` as worktree base (fixes stale-base bug when origin is a fork that's drifted behind upstream). [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/dd591b507)
- **up-to-date verification recipe** — New section in `/up-to-date` skill for diverged squash-merged branches (the "reset-hard-to-upstream after confirming no unpushed work" pattern). [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/89fd82ce5)

### Other Projects (2026-04-13)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **`rmux_helper agent-continue`** — New subcommand to resume a specific Claude agent by name/task-id from anywhere in tmux. Extends `TmuxProvider` with `capture_pane`, adds `AgentDef` registry, `find_resume_target` core, and `build_exec_argv` for shell launch. Full spec + plan + implementation landed together. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/8d80a3869)

**[dolt-explainer](https://idvorkin-ai-tools.github.io/dolt-explainer/)** (new explainer) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/dolt-explainer)

- **New static Pages explainer** of Dolt's `refs/dolt/data` trick — how beads task state and git code share one GitHub repo. PlantUML diagrams (refs topology + push flow), scenario 7 (fork workflow + the PR hole), rollback/audit section. Structured around the actual problem: beads sync across agents/machines. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/dolt-explainer/commit/d3760a802)

**[chroma-key-explainer](https://github.com/idvorkin-ai-tools/chroma-key-explainer)** (new explainer)

- **Initial commit** — chroma-key hill-climbing explainer (accompanies the `blob` repo's raccoon-claw-trio regen work). [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/281aae92e)

**[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** (voice eval)

- **Soprano v2 tournament loop** — Tournament + scorecard iteration hits 6/10 on Enceladus base; framed as hill-climbing with a model-judge. Global speed slider, inline audio players, combined v1/v2 trajectory table. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/346d3cccc)

**[blob](https://github.com/idvorkin/blob)** (blog images)

- **raccoon-larry + raccoon-claw-trio** — New raccoon-as-Freud-with-lobster-claw illustration (supports the `/larry` image update). Trio regenerated with `flood4+tight_3` chroma-key + strong lobster-claw prompt (fixes transparent-background holes from the initial pass). [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/ad88ced7d)

## Week of 2026-04-12

_61 commits this week (blog) + cross-repo activity_

### The AI Operator: Learning to Drive the Machine (new post!)

New post on AI operating as a skill — from the mechanics of cognitive load to the compound returns of capturing what you learn ([blog](/ai-operator)):

- **Finite thinking tokens** — Your brain has a context window. Simon Willison quote: running four agents in parallel left him "wiped out by 11 AM." "If you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've traded one kind of exhaustion for another." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5fdbb6a2a)
- **In the loop vs. on the loop** — DoD Directive 3000.09 on autonomous weapons: "human in the loop" (approves each action) vs "human on the loop" (monitors, can intervene). Every AI session you're one or the other. "The goal is to get on the loop." Starts with high-stakes/novel/bootstrapping work; the real job while in the loop is learning your way out. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/622d008fd)
- **Use voice** — Talk, don't type. Voice makes you ramble, backfill, mention the constraint you forgot. "When you type, the AI is solving the problem you wrote down; when you talk, the AI is solving the problem you actually have." Three moves: use voice, share intent, share success criteria. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/84cd2cd34)
- **Throw it away** — The old economics (code is precious) are gone. AI-generated code is cheap to produce; expensive to untangle when it goes sideways. "Rescuing a bad generation is a trap: it pulls you line-by-line back into the loop, burning thinking tokens on code the AI could regenerate for free." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/622d008fd)
- **Compound engineer** — Retros, CLAUDE.md updates, codified skills. "`show-your-work` started as 'screenshot the changed blog pages'; `walk-the-store` started as 'do a visual walkthrough.' Both used to be 10-minute manual chores. Now they're one word." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1b5cf8295)

### ACT Made Simple: Book Notes (new post!)

Deep notes on Russ Harris's _ACT Made Simple_ — Acceptance and Commitment Therapy for personal practice ([blog](/act)):

- **Psychological flexibility** — ACT's single aim. Harris's triflex: Be Present, Open Up, Do What Matters. Vitality ≠ feeling good: "I can feel vital in the middle of grief." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)
- **The Choice Point** — Away moves (hooked, escaping) vs. towards moves (unhooked, values-aligned). Harris claims almost every psychological problem reduces to: hooked → away moves. The whole diagnosis fits on a napkin. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)
- **Workability replaces truth-testing** — ACT never debates whether a thought is true. The question: "If I let this thought guide my behavior, will that help me create a richer, fuller, more meaningful life?" Same anxious thought leaves one person untouched and derails another — context of fusion is the variable, not the thought content. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)
- **Creative hopelessness & DOTS** — Inventory everything you've tried to make unwanted feelings go away: Distraction, Opting out, Thinking strategies, Substances. All work short-term, none long-term. "Are you open to trying something new?" [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)
- **Mindfulness ≠ meditation** — Harris strips the baggage: mindfulness is defusion + acceptance + flexible attention + self-as-context. "ACT does not require formal practice." The core instruction: notice X. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)
- **The Hexaflex** — Six core processes: Cognitive Defusion, Acceptance, Contact with Present Moment, Self-as-Context, Values, Committed Action. Full 32-chapter notes with personal commentary. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)

### CHOP & Tooling

- **The Flow Question** — New section in [how-igor-chops](/how-igor-chops#the-flow-question): "Can you still get flow when you're chopping? You're not even writing the code." Answer: flow is constant — comes from orchestrating 2-3 agents at different loop stages, and from mastery of a skill where challenge still meets ability. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/07a70ed21)
- **CPU Safety Net** — New bullet in [how-igor-chops](/how-igor-chops#container-setup): two-layer guard that keeps runaway agents from melting the Mac. OrbStack hypervisor cap as the hard ceiling + userspace [cpu-watchdog.sh](https://github.com/idvorkin/Settings/blob/main/shared/cpu-watchdog.sh) that attaches `cpulimit` to any process sustaining more than four cores. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/63fc22051)
- **CPU Guards reference doc** — New `/cpu-guards` page explaining why `systemd-run --scope -p CPUQuota` fails on OrbStack (no systemd as PID 1, read-only cgroup fs) and the two-layer userspace fallback that actually works. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0a105f381)

### Infrastructure & CI (2026-04-12)

- **Automated weekly changelog** — New GitHub Actions workflow that runs `/changelog` on a schedule via Claude, opens a PR automatically. Iteratively hardened this week: idempotent PR creation, `id-token: write` permission, scoped to public repos to avoid rate limits. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94dc5927c)
- **AI operator cross-links** — Added per-section Skills lines linking to relevant CHOP skills throughout the new `/ai-operator` post; tightened `running-servers` check in CLAUDE.md. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fe93fc452)

### Other Projects (2026-04-12)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- **architect-review skill** — New skill for iterative spec hardening via sequential background Opus agents. Each pass reads and edits the spec, tracks changes in a changelog. Converges when a pass makes 0-2 substantive changes (typically 3-4 passes). Tested on a real spec: 21 → 13 → 9 → 0 changes across 4 passes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/43ba1bdfd)
- **docs skill** — Applied code review fixes and added `allowed-tools` frontmatter. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7dd0f5b4c)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Auto-rebuild on pull** — `just setup` symlinks a post-merge hook that rebuilds Python (`just global-install`) and Rust (`just rinstall`) tools automatically when source files change on pull. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/7a8b1602a)
- **rbv install hint** — When `bv` is not on PATH, `rbv` now prints the install command: `brew install dicklesworthstone/tap/bv`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/42248d537)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health & location data)

- **Sleep detail sheet** — New phase 3 sleep view: stages (deep/REM/core/awake), debt tracking, consistency score, per-night colored strips with 24h timeline. Source filter + day zoom. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7363b9e38)
- **Movement card** — Steps, distance, and energy merged into one card with three stacked mini box plots. Per-day 24h color-coded strip. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/6d9b60b7c)
- **Transit accounting** — Honest 3-bucket breakdown (transit/loose/no-data), evidence-gated, with elapsed header. Cluster logic merges consecutive same-place stays unconditionally. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16f1be300)
- **OTA + prefetch** — Pin runtimeVersion to `"1.0.0"` literal for bare-workflow OTA; prefetch 7-day stats for every card in background after grab. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ec1acfc4b)

**[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** (interactive ACT explainer)

- **Drop the Rope** — Complete new lesson: a wordless 5-round defusion game where players physically can't win a tug-of-war against an emotion monster. The unwinnable tension math (`simulateTension` tests prove 15 taps/sec never pushes the rope to the player-win floor) teaches the ACT insight that effort isn't the lever — dropping is. Five monsters: anxiety (hooked smoke wisp), self-criticism (cyclops blob), shame (wrapped ball), doubt (two-headed), anger (trapezoid with horns). Five valued scenes after each drop: coffee at home, gym kettlebell swing, park bench text, writing at desk, cartoon dog with wagging tail. Includes 3-slide intro, gallery ending, and full Playwright E2E test. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/5f3126de1)
- **Mismatched Crocs** — Raccoon now wears left blue / right yellow Crocs. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/c36819404)

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

### Infrastructure & CI (2026-03-30)

- **Claude Code Review workflow** — Switched from inline prompt to official `code-review@claude-code-plugins` marketplace plugin. Added `ready_for_review` and `reopened` PR triggers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c9762fbc)
- **Backlinks workflow rewrite** — Simplified from 265 lines to 61 lines. Switched from `pull_request` (closed/merged) to `push` trigger on main. Removed complex merge strategy detection (merge commit vs squash vs rebase). Added path filtering (`_d/**`, `_td/**`, `_ig66/**`). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c590b318)
- **GitHub Actions Node.js 24 bump** — Updated `checkout`, `setup-ruby`, `setup-uv`, and `setup-node` actions across all workflows. Fixed `setup-uv` (v8 tag doesn't exist, use v7). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/02c659014) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb3db6f6c)

### Other Projects (2026-03-30)

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

### Infrastructure & Tooling (2026-03-16)

- **Jekyll Ruby 4.0+ fix** — Monkey-patched `pathutil` keyword arg incompatibility via TracePoint-based lazy prepend. Ruby 4.0 removed implicit Hash-to-kwargs conversion; this intercepts `require "pathutil"` and patches IO methods. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb000683a)
- **Show-your-work skill** — New skill that screenshots changed blog pages, hosts images on GitHub gist, and produces PR-ready markdown. Auto-detects changed pages from git diff. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/cacd5a0d5)
- **AI feed upgrade** — Podcast/YouTube URLs now route to transcript processor with quality hierarchy (human > manual > ASR). Added preferred creators list (Karpathy, Lex Fridman, Steinberger). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)

### Other Projects (2026-03-16)

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

### Infrastructure (2026-03-09)

- **Jekyll Ruby 3.2+ fix** — Monkey-patched `tainted?`/`taint`/`untaint` (removed in Ruby 3.2) via `_ruby_compat.rb`, added `bigdecimal` and `ostruct` gems, updated justfile to auto-load the compat shim. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c851e24ae)
- **Walk-the-store skill** — New skill for visual blog audits: screenshots key pages, builds a browsable gallery. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b560b282)

### Other Projects (2026-03-09)

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

### Infrastructure & Tooling (2026-02-08)

- `/ai-content` skill — specialized workflow that loads AI content map (21 posts organized by theme cluster), reads backlinks, and sets up branch/server for AI blog post editing [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8f358f756)
- `/spiritual-content` skill — same pattern for inner-life posts (spiritual health, religion, meditation, eulogy, etc.) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/590894703)

### Other Projects (2026-02-08)

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

### Infrastructure & Tooling (2026-01-25)

- `/content` skill for blog workflow [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b)
- ASIN database: fetched metadata for 28 products [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/99c355400)

### Other Projects (2026-01-25)

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

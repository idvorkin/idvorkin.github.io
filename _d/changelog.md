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

- [Week of 2026-10-11](#week-of-2026-10-11)
  - [New Posts and Rewrites (2026-10-11)](#new-posts-and-rewrites-2026-10-11)
  - [Infrastructure & CI (2026-10-11)](#infrastructure--ci-2026-10-11)
  - [chop-conventions (2026-10-11)](#chop-conventions-2026-10-11)
  - [Other Projects (2026-10-11)](#other-projects-2026-10-11)
- [Week of 2026-10-04](#week-of-2026-10-04)
  - [New Posts and Rewrites (2026-10-04)](#new-posts-and-rewrites-2026-10-04)
  - [Infrastructure & CI (2026-10-04)](#infrastructure--ci-2026-10-04)
  - [Other Projects (2026-10-04)](#other-projects-2026-10-04)
- [Week of 2026-09-27](#week-of-2026-09-27)
  - [New Posts and Rewrites (2026-09-27)](#new-posts-and-rewrites-2026-09-27)
  - [Infrastructure & CI (2026-09-27)](#infrastructure--ci-2026-09-27)
  - [chop-conventions (2026-09-27)](#chop-conventions-2026-09-27)
  - [Other Projects (2026-09-27)](#other-projects-2026-09-27)
- [Week of 2026-09-21](#week-of-2026-09-21)
  - [Three New Posts (2026-09-21)](#three-new-posts-2026-09-21)
  - [Infrastructure & CI (2026-09-21)](#infrastructure--ci-2026-09-21)
  - [Other Projects (2026-09-21)](#other-projects-2026-09-21)
- [Week of 2026-09-14](#week-of-2026-09-14)
  - [Swing Analyzer: Bulgarian Split Squats](#swing-analyzer-bulgarian-split-squats)
  - [chop-conventions (2026-09-14)](#chop-conventions-2026-09-14)
  - [Other Projects (2026-09-14)](#other-projects-2026-09-14)
- [Week of 2026-09-07](#week-of-2026-09-07)
  - [The Den: Strips #6 and #7 (2026-09-07)](#the-den-strips-6-and-7-2026-09-07)
  - [Infrastructure & CI (2026-09-07)](#infrastructure--ci-2026-09-07)
  - [chop-conventions (2026-09-07)](#chop-conventions-2026-09-07)
  - [Other Projects (2026-09-07)](#other-projects-2026-09-07)
- [Week of 2026-08-31](#week-of-2026-08-31)
  - [The Den and new AI posts](#the-den-and-new-ai-posts)
  - [Infrastructure & CI (2026-08-31)](#infrastructure--ci-2026-08-31)
  - [chop-conventions (2026-08-31)](#chop-conventions-2026-08-31)
  - [Other Projects (2026-08-31)](#other-projects-2026-08-31)
- [Week of 2026-08-24](#week-of-2026-08-24)
  - [Mind the Gap: Escape as a Neutral Verb](#mind-the-gap-escape-as-a-neutral-verb)
  - [AI Journal: The Beads 1.2.1 Incident Report](#ai-journal-the-beads-121-incident-report)
  - [Diet: Tirzepatide Alert](#diet-tirzepatide-alert)
  - [chop-conventions (2026-08-24)](#chop-conventions-2026-08-24)
- [Week of 2026-08-17](#week-of-2026-08-17)
  - [Four Kinds of Health: Testing Instead of Defining](#four-kinds-of-health-testing-instead-of-defining)
  - [Model Welfare, Arrived at Sideways (new post!)](#model-welfare-arrived-at-sideways-new-post)
  - [AI Testing: Harness-Bound Evals and the Drawing Arena](#ai-testing-harness-bound-evals-and-the-drawing-arena)
  - [Infrastructure & CI (2026-08-17)](#infrastructure--ci-2026-08-17)
  - [Other Projects (2026-08-17)](#other-projects-2026-08-17)
- [Week of 2026-08-10](#week-of-2026-08-10)
  - [Manager to IC in the Agentic Era (new post!)](#manager-to-ic-in-the-agentic-era-new-post)
  - [Local Search: Pagefind Replaces Algolia](#local-search-pagefind-replaces-algolia)
  - [Blog Annotate: Highlight-and-Comment Review Tool](#blog-annotate-highlight-and-comment-review-tool)
  - [Scandinavia Recap: Gyms, Stories, and Review Polish](#scandinavia-recap-gyms-stories-and-review-polish)
  - [AI Eval Tools: SWE-bench Column](#ai-eval-tools-swe-bench-column)
  - [August 2026 Focus](#august-2026-focus)
  - [Other Projects (2026-08-10)](#other-projects-2026-08-10)
- [Week of 2026-08-03](#week-of-2026-08-03)
  - [AI Testing: Grading the Agent with smevals](#ai-testing-grading-the-agent-with-smevals)
  - [AI Eval Tools (new post!)](#ai-eval-tools-new-post)
  - [Herdr: The Agent Multiplexer](#herdr-the-agent-multiplexer)
  - [Scandinavia Recap: Where We Actually Went](#scandinavia-recap-where-we-actually-went)
  - [Content Quality Audit: AI & Gas City Sweep](#content-quality-audit-ai--gas-city-sweep)
  - [chop-conventions (2026-08-03)](#chop-conventions-2026-08-03)
  - [Other Projects (2026-08-03)](#other-projects-2026-08-03)
- [Week of 2026-07-27](#week-of-2026-07-27)
  - [AI Inference: Why Checking Beats Generating](#ai-inference-why-checking-beats-generating)
  - [The Clown's Prayer](#the-clowns-prayer)
  - [Infrastructure & CI (2026-07-27)](#infrastructure--ci-2026-07-27)
  - [chop-conventions (2026-07-27)](#chop-conventions-2026-07-27)
  - [Other Projects (2026-07-27)](#other-projects-2026-07-27)
- [Week of 2026-07-20](#week-of-2026-07-20)
  - [The Performer's Playbook (new post)](#the-performers-playbook-new-post)
  - [Sleight of Mouth: The Full Book, Fleshed Out](#sleight-of-mouth-the-full-book-fleshed-out)
  - [Scandinavia Trip Wrap-Up + Discernment Horizon](#scandinavia-trip-wrap-up--discernment-horizon)
  - [Content Quality Audit: Tier-3/Tier-4 Sweep](#content-quality-audit-tier-3tier-4-sweep)
  - [Infrastructure & CI (2026-07-20)](#infrastructure--ci-2026-07-20)
  - [Other Projects (2026-07-20)](#other-projects-2026-07-20)
- [Week of 2026-07-13](#week-of-2026-07-13)
  - [Pleasure vs Enjoyment: Brooks' Formula Threaded Through Three Posts](#pleasure-vs-enjoyment-brooks-formula-threaded-through-three-posts)
  - [Scandinavia Trip: Oslo Train Bender + Diet Learnings](#scandinavia-trip-oslo-train-bender--diet-learnings)
  - [Isometrics and Tendon Health](#isometrics-and-tendon-health)
  - [Other Projects (2026-07-13)](#other-projects-2026-07-13)
- [Week of 2026-07-06](#week-of-2026-07-06)
  - [Bad News. Maybe Not. (new post!)](#bad-news-maybe-not-new-post)
  - [Time Off: Sacrifice Identity for Consumption (2026-07-06)](#time-off-sacrifice-identity-for-consumption-2026-07-06)
  - [Scandinavia Trip Post (2026-07-06)](#scandinavia-trip-post-2026-07-06)
  - [My Packing Master List (new page!)](#my-packing-master-list-new-page)
  - [Life Journal: Speed of Light from Sweden (2026-07-06)](#life-journal-speed-of-light-from-sweden-2026-07-06)
  - [Other Projects (2026-07-06)](#other-projects-2026-07-06)
- [Week of 2026-06-29](#week-of-2026-06-29)
  - [Trusts in Washington (new post!)](#trusts-in-washington-new-post)
  - [AI Training: Post-Training Methods Table](#ai-training-post-training-methods-table)
  - [Time Off: Arthur Brooks' 9 Vacation Rules](#time-off-arthur-brooks-9-vacation-rules)
  - [Life & Health Notes (2026-06-29)](#life--health-notes-2026-06-29)
  - [Other Projects (2026-06-29)](#other-projects-2026-06-29)
- [Week of 2026-06-22](#week-of-2026-06-22)
  - [AI Journal: Yegge's Flat Curve Society](#ai-journal-yegges-flat-curve-society)
  - [AI Operator: You Review More Than You Make](#ai-operator-you-review-more-than-you-make)
  - [Addiction: Monoculture Trap](#addiction-monoculture-trap)
  - [AI Security: Field-Map Explainers](#ai-security-field-map-explainers)
  - [Other Projects (2026-06-22)](#other-projects-2026-06-22)
- [Week of 2026-06-15](#week-of-2026-06-15)
  - [Why Gas City (new post!)](#why-gas-city-new-post)
  - [Gas City: Controller Loop + Runtime Providers](#gas-city-controller-loop--runtime-providers)
  - [AI-Native Vocab: Reverse Centaur](#ai-native-vocab-reverse-centaur)
  - [AI Journal: API Key Leak Forensics](#ai-journal-api-key-leak-forensics)
  - [Infrastructure & CI (2026-06-15)](#infrastructure--ci-2026-06-15)
  - [Other Projects (2026-06-15)](#other-projects-2026-06-15)
- [Week of 2026-06-08](#week-of-2026-06-08)
  - [AI Training & Inference (new posts!)](#ai-training--inference-new-posts)
  - [Gas City First Rig (new post!)](#gas-city-first-rig-new-post)
  - [Gas City: Scale Up/Out + Getting Started](#gas-city-scale-upout--getting-started)
  - [AI-Native: Onboarding, Vocab, and Optimism](#ai-native-onboarding-vocab-and-optimism)
  - [Life: Decline and Psychic Weight](#life-decline-and-psychic-weight)
  - [Infrastructure & CI (2026-06-08)](#infrastructure--ci-2026-06-08)
  - [chop-conventions (2026-06-08)](#chop-conventions-2026-06-08)
  - [Other Projects (2026-06-08)](#other-projects-2026-06-08)
- [Week of 2026-06-01](#week-of-2026-06-01)
  - [The Dark Factory (new post!)](#the-dark-factory-new-post)
  - [Made to Stick (new post!)](#made-to-stick-new-post)
  - [AI Journal: Friction = Focus](#ai-journal-friction--focus)
  - [Scandinavian Whirlwind Tour (new page!)](#scandinavian-whirlwind-tour-new-page)
  - [Meta: Moving to the AI Lab](#meta-moving-to-the-ai-lab)
  - [Content Tweaks (2026-06-01)](#content-tweaks-2026-06-01)
  - [Infrastructure & CI (2026-06-01)](#infrastructure--ci-2026-06-01)
  - [chop-conventions (2026-06-01)](#chop-conventions-2026-06-01)
  - [Other Projects (2026-06-01)](#other-projects-2026-06-01)
- [Week of 2026-05-25](#week-of-2026-05-25)
  - [y2026: June Check-In](#y2026-june-check-in)
  - [Produce/Consume: The Production Trap](#produceconsume-the-production-trap)
  - [Other Projects (2026-05-25)](#other-projects-2026-05-25)
- [Week of 2026-05-18](#week-of-2026-05-18)
  - [What I Love About AI (new post!)](#what-i-love-about-ai-new-post)
  - [Parenting Books: Emotional Lives + Untangled Rewrite](#parenting-books-emotional-lives--untangled-rewrite)
  - [Hyper-Personal: Bezos to Agent-to-Agent](#hyper-personal-bezos-to-agent-to-agent)
  - [Igor's Podcast Launch](#igors-podcast-launch)
  - [Raccoon System: 7H Marathon + Choice-Sheet Pattern](#raccoon-system-7h-marathon--choice-sheet-pattern)
  - [AI Journal: Options Over Answers](#ai-journal-options-over-answers)
  - [Infrastructure & CI (2026-05-18)](#infrastructure--ci-2026-05-18)
  - [Other Projects (2026-05-18)](#other-projects-2026-05-18)
- [Week of 2026-05-11](#week-of-2026-05-11)
  - [7 Habits: Full Chapter Augmentation](#7-habits-full-chapter-augmentation)
  - [AI Journal: Tokens and the Wrong Jungle](#ai-journal-tokens-and-the-wrong-jungle)
  - [Amelia Connection Framework (new page!)](#amelia-connection-framework-new-page)
  - [Addiction: Raccoon Illustrations](#addiction-raccoon-illustrations)
  - [Infrastructure & CI (2026-05-11)](#infrastructure--ci-2026-05-11)
  - [chop-conventions (2026-05-11)](#chop-conventions-2026-05-11)
  - [Other Projects (2026-05-11)](#other-projects-2026-05-11)
- [Week of 2026-05-04](#week-of-2026-05-04)
  - [The Psychology of Vibing (new post!)](#the-psychology-of-vibing-new-post)
  - [Gas City Cluster: Wally, Standing Up, and the Explainer (new posts!)](#gas-city-cluster-wally-standing-up-and-the-explainer-new-posts)
  - [Igor's Claws: Business Logic / Goop / Infra](#igors-claws-business-logic--goop--infra)
  - [Life Journal: Walking with Alex Under the Trees](#life-journal-walking-with-alex-under-the-trees)
  - [Infrastructure & CI (2026-05-04)](#infrastructure--ci-2026-05-04)
  - [Other Projects (2026-05-04)](#other-projects-2026-05-04)
- [Week of 2026-04-27](#week-of-2026-04-27)
  - [Wally and My Work Gastown (new post!)](#wally-and-my-work-gastown-new-post)
  - [The Psychology of Vibing (new post!)](#the-psychology-of-vibing-new-post-1)
  - [Addiction: Trichotomy Upgrade](#addiction-trichotomy-upgrade)
  - [AI Cockpit: The Mic Matters](#ai-cockpit-the-mic-matters)
  - [Infrastructure & CI (2026-04-27)](#infrastructure--ci-2026-04-27)
  - [Other Projects (2026-04-27)](#other-projects-2026-04-27)
- [Week of 2026-04-20](#week-of-2026-04-20)
  - [Taxes: Split from /money (new post!)](#taxes-split-from-money-new-post)
  - [Igor's Three Claws (new post!)](#igors-three-claws-new-post)
  - [Larry: From Life Coach to Chief of Staff](#larry-from-life-coach-to-chief-of-staff)
  - [AI Journal: One Repo, One Token](#ai-journal-one-repo-one-token)
  - [AI Operator: One-Way vs Two-Way Doors](#ai-operator-one-way-vs-two-way-doors)
  - [Life Journal: Balloons on the Hood Canal Trail](#life-journal-balloons-on-the-hood-canal-trail)
  - [Infrastructure & CI (2026-04-20)](#infrastructure--ci-2026-04-20)
  - [chop-conventions (2026-04-20)](#chop-conventions-2026-04-20)
  - [Other Projects (2026-04-20)](#other-projects-2026-04-20)
- [Week of 2026-04-13](#week-of-2026-04-13)
  - [Life Journal: First Entries (new post!)](#life-journal-first-entries-new-post)
  - [AI Operator: Seven New Sections](#ai-operator-seven-new-sections)
  - [ACT: Reverse-Engineered Buddhism](#act-reverse-engineered-buddhism)
  - [AI Relationships: Cryptophasia and Drift](#ai-relationships-cryptophasia-and-drift)
  - [AI Cockpit: New Instruments](#ai-cockpit-new-instruments)
  - [Hill Climbing: Eval-Driven Pattern](#hill-climbing-eval-driven-pattern)
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

## Week of 2026-10-11

_22 commits this week_

_Checked through 2026-10-11 13:55 PT; next entry starts from here._

### New Posts and Rewrites (2026-10-11)

- **[What's Left in Engineering?](/whats-left#job-2-keep-the-code-changeable-by-agents) (new post!)** - With agents writing the code, [two jobs remain](https://github.com/idvorkin/idvorkin.github.io/commit/a02331764): iterate on the job to be done, keep code changeable by agents.
- **[Sleight of Mouth rebuilt](/sleight-of-mouth#interactive-version)** - [One coherent argument](https://github.com/idvorkin/idvorkin.github.io/commit/253079feb), with Dilts' diagram [replaced by an interactive explorer](https://github.com/idvorkin/idvorkin.github.io/commit/efda88e96) of [the fourteen patterns](https://github.com/idvorkin/idvorkin.github.io/commit/6ce0e6015).
- **[Affirmations](/affirmations#how-to-use-them)** - A [short public page](https://github.com/idvorkin/idvorkin.github.io/commit/d9767572d) with the four affirmations and how to use them, split from my working notes.
- **[The Den #13](/the-den)** - [The Longest Title](https://github.com/idvorkin/idvorkin.github.io/commit/5c083105a): a card-catalog title that never ends fills the attic before the book appears.
- **Small edits** - The [eulogy](/eulogy) song [plays inline](https://github.com/idvorkin/idvorkin.github.io/commit/d47d39405); [Opus releases](https://github.com/idvorkin/idvorkin.github.io/commit/b5dcedb6f) on the [life-in-weeks chart](/weeks).

### Infrastructure & CI (2026-10-11)

- **[Default link previews](https://github.com/idvorkin/idvorkin.github.io/commit/299efb9d3)** - A [raccoon default preview image](https://github.com/idvorkin/idvorkin.github.io/commit/299efb9d3) for AI posts; [every AI post flagged](https://github.com/idvorkin/idvorkin.github.io/commit/024baea0e); [Wally gets its own](https://github.com/idvorkin/idvorkin.github.io/commit/82f8dbd8e).
- **[p key](https://github.com/idvorkin/idvorkin.github.io/commit/333ba32af)** - Jumps between prod and a test server, [remembering the test origin per tab](https://github.com/idvorkin/idvorkin.github.io/commit/333ba32af); [only loopback and tailnet hosts count](https://github.com/idvorkin/idvorkin.github.io/commit/cd2e3ae31).

### chop-conventions (2026-10-11)

- **[iOS device signing](https://github.com/idvorkin/chop-conventions/commit/8844a5a68)** - [Recovering when Xcode loses its account](https://github.com/idvorkin/chop-conventions/commit/8844a5a68), [the shared signing lock](https://github.com/idvorkin/chop-conventions/commit/093f913ff), and [what a locked device's error looks like](https://github.com/idvorkin/chop-conventions/commit/6bc370fa0).
- **[Agent lessons](https://github.com/idvorkin/chop-conventions/commit/fff137e6b)** - [What the iOS agent sessions taught](https://github.com/idvorkin/chop-conventions/commit/fff137e6b), including [simctl defaults that can't override keys an app already wrote](https://github.com/idvorkin/chop-conventions/commit/665da96ce).
- **[iOS libraries](https://github.com/idvorkin/chop-conventions/commit/a9b816684)** - [Recommended iOS libraries, tools and agent skills](https://github.com/idvorkin/chop-conventions/commit/a9b816684), [revised after checking seven app repos](https://github.com/idvorkin/chop-conventions/commit/b45b19a0d) against the list.

### Other Projects (2026-10-11)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iPhone health and context app)

- **[Calling Larry](https://github.com/idvorkin/context-grabber/commit/d782599a8)** - The native app gets [the Call screen, with call audio and gist uploads](https://github.com/idvorkin/context-grabber/commit/d782599a8).
- **[Home screen](https://github.com/idvorkin/context-grabber/commit/5046a3808)** - [Opens on today](https://github.com/idvorkin/context-grabber/commit/5046a3808) with a [daily strip](https://github.com/idvorkin/context-grabber/commit/364d3fa43), usage left, [the eulogy song](https://github.com/idvorkin/context-grabber/commit/2b75d3a27), and an [iPad layout](https://github.com/idvorkin/context-grabber/commit/2c2a6ee1d).
- **[Bug reports](https://github.com/idvorkin/context-grabber/commit/aa4397d46)** - [BugKit's Mac listener files every report](https://github.com/idvorkin/context-grabber/commit/aa4397d46), and [reports now reach the Mac through iCloud](https://github.com/idvorkin/context-grabber/commit/61eeb4b54).

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **[iCloud sync](https://github.com/idvorkin/exercise-analyzer/commit/eb307c575)** - Sets and workouts [reach every device](https://github.com/idvorkin/exercise-analyzer/commit/eb307c575), [edits included](https://github.com/idvorkin/exercise-analyzer/commit/dae2c085e); recordings save to [their own Photos album](https://github.com/idvorkin/exercise-analyzer/commit/d93a1ef6f).
- **[Watch](https://github.com/idvorkin/exercise-analyzer/commit/a857c5182)** - The workout page [shows sets grouped by exercise, with the drawings](https://github.com/idvorkin/exercise-analyzer/commit/a857c5182).
- **[Tooling](https://github.com/idvorkin/exercise-analyzer/commit/40bc0d3bd)** - [SwiftLint and swift-format in the gate](https://github.com/idvorkin/exercise-analyzer/commit/40bc0d3bd); [the bug-kit listener files bug reports](https://github.com/idvorkin/exercise-analyzer/commit/c1eb0a934).

**New and smaller**

- **[bug-kit](https://github.com/idvorkin/bug-kit)** (new) - [One bug-report library for iOS apps plus a Mac listener](https://github.com/idvorkin/bug-kit/commit/789c9df2b); [automatic reports](https://github.com/idvorkin/bug-kit/commit/e89e40b88), [private iCloud delivery](https://github.com/idvorkin/bug-kit/commit/ef127b223), [screenshot privacy controls](https://github.com/idvorkin/bug-kit/commit/8ac0bb5f6).

## Week of 2026-10-04

_48 commits this week_

### New Posts and Rewrites (2026-10-04)

- **[Post-training LLMs](/ai-post-training#two-questions-explain-every-method) (new post!)** - [Every method](https://github.com/idvorkin/idvorkin.github.io/commit/43d11e7f3) answers [two questions](https://github.com/idvorkin/idvorkin.github.io/commit/b40233479): who grades the answer, and what the model should change from one try.
- **[Post-training Agents](/ai-post-training-agents#who-grades-an-agent) (new post!)** - How grading and updates change when the model [works a forty-turn trajectory](https://github.com/idvorkin/idvorkin.github.io/commit/b696bee35) instead of writing one reply.
- **[If You're Thinking About Suicide](/thinking-about-suicide) (new post!)** - A brain attack is like a heart attack, so [call someone now](https://github.com/idvorkin/idvorkin.github.io/commit/2222c0aa0); [/suicide](/suicide) is now for the bereaved.
- **[Time allocation](/time-allocation#where-the-time-goes)** - The five buckets stay, with [energy flow layered on top](https://github.com/idvorkin/idvorkin.github.io/commit/d0b1a3536) and a [two-hour weekday ceiling](https://github.com/idvorkin/idvorkin.github.io/commit/d4445ecfe) on relationships.
- **[Raccoon redraws](/tori)** - The 2006 [first-date comic](https://github.com/idvorkin/idvorkin.github.io/commit/56a94a613) with Tori, and the [mania raccoon](/mania) [still going at 3 a.m.](https://github.com/idvorkin/idvorkin.github.io/commit/daa2eb843)
- **[The Den #12](/the-den)** - [Bless You](https://github.com/idvorkin/idvorkin.github.io/commit/5415248a5): Larry gets a mailbox with Seen, Working and Done flags.
- **[Small edits](/balloon#some-of-my-creations)** - [Balloon creations filled in](https://github.com/idvorkin/idvorkin.github.io/commit/8509706b4); [a missing Enneagram row](https://github.com/idvorkin/idvorkin.github.io/commit/6cb494b81).

### Infrastructure & CI (2026-10-04)

- **[Link previews and AI label](https://github.com/idvorkin/idvorkin.github.io/commit/4cf2a63e0)** - Hero images [become link previews](https://github.com/idvorkin/idvorkin.github.io/commit/4cf2a63e0) on posts that had none; the AI label [shrinks to one line](https://github.com/idvorkin/idvorkin.github.io/commit/f604328bc).
- **[Dev banner](https://github.com/idvorkin/idvorkin.github.io/commit/7d0daca45)** - [Icons instead of words](https://github.com/idvorkin/idvorkin.github.io/commit/7d0daca45); Comments [toggles annotate mode live](https://github.com/idvorkin/idvorkin.github.io/commit/83c459a70), [including inside the rich diff](https://github.com/idvorkin/idvorkin.github.io/commit/5caa28647).

### Other Projects (2026-10-04)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iPhone health and context app)

- **[Native app](https://github.com/idvorkin/context-grabber/commit/89da0163f)** - A [Swift app beside the React Native one](https://github.com/idvorkin/context-grabber/commit/89da0163f): [Gym Timer](https://github.com/idvorkin/context-grabber/commit/5a284c561), [box breathing](https://github.com/idvorkin/context-grabber/commit/7c4fb3789), and [Places](https://github.com/idvorkin/context-grabber/commit/5daab8f2e).

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **[iPad and bell weight](https://github.com/idvorkin/exercise-analyzer/commit/adb45769b)** - A [Workouts sidebar on the iPad](https://github.com/idvorkin/exercise-analyzer/commit/adb45769b); [tap a set to log bell weight](https://github.com/idvorkin/exercise-analyzer/commit/0a6ab954e), and later sets carry it.

**New and smaller**

- **[window-sweaters](https://github.com/idvorkin/window-sweaters)** - Knitted window borders on the Mac, now with [a raccoon that visits the focused window](https://github.com/idvorkin/window-sweaters/commit/f1f514be5).
- **[Settings](https://github.com/idvorkin/Settings)** - [caff becomes awake and names busy agents](https://github.com/idvorkin/Settings/commit/fa2c5a0cf); [pick-links lists commands to run](https://github.com/idvorkin/Settings/commit/e52a3476d); [faster zsh startup](https://github.com/idvorkin/Settings/commit/aa6407231).

## Week of 2026-09-27

_47 commits this week_

### New Posts and Rewrites (2026-09-27)

- **[The Interaction Model Matters](/interaction-model) (new post!)** - [How an agent talks](https://github.com/idvorkin/idvorkin.github.io/commit/f7b150566) matters as much as what it can do; Opus 5.5 brought back the joy.
- **[Spiritual health hub](/spiritual-health#three-ways-it-breaks)** - [Rewritten around three breaks](https://github.com/idvorkin/idvorkin.github.io/commit/249bd4f87) (direction, scale, acceptance) plus practices, with [one shared vocabulary and footer](https://github.com/idvorkin/idvorkin.github.io/commit/e078f6b14) across the spiritual posts.
- **[Religion and walking with God](/religion#it-lives-in-practice-not-proof)** - [Religion restructured](https://github.com/idvorkin/idvorkin.github.io/commit/4812cca24) around my story and practice over proof; [the devotional experiment closed out](https://github.com/idvorkin/idvorkin.github.io/commit/48e71347e) with what it taught.
- **[Agency rebuilt](/agency#knowledge-became-queryable)** - [Knowledge became queryable](https://github.com/idvorkin/idvorkin.github.io/commit/b4b6c566f) and the technologist threshold moved, so agency beats smarts even more with AI.
- **[Gas City, one hub](/gas-city)** - [/why-gas-city folds into /gas-city](https://github.com/idvorkin/idvorkin.github.io/commit/00880797d): the ladder, what a city is, what it costs, what I run.
- **[Where the Time Goes rewrite](/time-allocation#why-less-tech-fails)** - [Rewritten from scratch](https://github.com/idvorkin/idvorkin.github.io/commit/b11e9e760), with the bucket chart rebuilt around where freed hours leak.
- **[Back pain figures](/back-pain#weak-hips-make-a-banana-back)** - [Interactive banana back and neck poke](https://github.com/idvorkin/idvorkin.github.io/commit/6d012f9d1) from weak hips, and a [loose-versus-latched backpack model](https://github.com/idvorkin/idvorkin.github.io/commit/0303ecc58), both sourced.
- **[Claws](/claw#muse-a-claw-a-grandma-can-use)** - [/claw and /igors-claws de-duplicated](https://github.com/idvorkin/idvorkin.github.io/commit/9a680255e); [a Muse section](https://github.com/idvorkin/idvorkin.github.io/commit/a2b981516) covers the first claw anyone can install and name.
- **[New sections](/hyper-personal#why-saas-still-lives)** - [Why SaaS still lives](https://github.com/idvorkin/idvorkin.github.io/commit/5cf8364e0) when DIY is cheap; [Amazon](/amazon#customer-obsession) [blocks shopping agents and strips order emails](https://github.com/idvorkin/idvorkin.github.io/commit/8e554d943).
- **[The Den #8 to #11](/the-den)** - [Rex debuts](https://github.com/idvorkin/idvorkin.github.io/commit/92c653778), [Larry speaks human](https://github.com/idvorkin/idvorkin.github.io/commit/e1a347290), [the tests take credit, and a city of agents runs on zero tokens](https://github.com/idvorkin/idvorkin.github.io/commit/7ba2e5e06).
- **[Small edits](/ai-eval-tools#where-the-tools-split)** - Plainer [orchestrator](https://github.com/idvorkin/idvorkin.github.io/commit/76546cad1), token and [Cockpit](https://github.com/idvorkin/idvorkin.github.io/commit/da9bfff06) posts; [AI eval tools lead with where they split](https://github.com/idvorkin/idvorkin.github.io/commit/fb622d07f); a [balloon](/balloon#keep-the-pump-at-hand) [pump-carry](https://github.com/idvorkin/idvorkin.github.io/commit/a5cd8951b); [three stubs trimmed](https://github.com/idvorkin/idvorkin.github.io/commit/6aadeefca).

### Infrastructure & CI (2026-09-27)

- **[Diff vs main](https://github.com/idvorkin/idvorkin.github.io/commit/12e5e5220)** - The dev banner [renders a rich diff](https://github.com/idvorkin/idvorkin.github.io/commit/12e5e5220) of the page [against main](https://github.com/idvorkin/idvorkin.github.io/commit/ee12e6cad), with a [change map and n/p jumps](https://github.com/idvorkin/idvorkin.github.io/commit/58eb5f461).
- **[Terse changelog](https://github.com/idvorkin/idvorkin.github.io/commit/1e6296b44)** - [The skill](https://github.com/idvorkin/idvorkin.github.io/commit/1e6296b44) and [the weekly Action](https://github.com/idvorkin/idvorkin.github.io/commit/c117eb80e) now write a linked list with a line budget, not an essay.

### chop-conventions (2026-09-27)

- **[machine-doctor on macOS](https://github.com/idvorkin/chop-conventions/commit/1861a0f6e)** - [Mac CPU and memory collection, sleep forensics](https://github.com/idvorkin/chop-conventions/commit/1861a0f6e), [a read-only DNS doctor](https://github.com/idvorkin/chop-conventions/commit/a9b38f4c2), and [a memory-by-app table](https://github.com/idvorkin/chop-conventions/commit/d625459df).
- **[Agent plumbing](https://github.com/idvorkin/chop-conventions/commit/7f15f46cc)** - [Outside agents get Herdr worktrees](https://github.com/idvorkin/chop-conventions/commit/7f15f46cc), [one watcher covers every Muse pane](https://github.com/idvorkin/chop-conventions/commit/a4658d259), and [only one session runs the Telegram bridge](https://github.com/idvorkin/chop-conventions/commit/85b46f698).
- **[Tools manifest](https://github.com/idvorkin/chop-conventions/commit/4b418a86a)** - [One list of external tools with a doctor](https://github.com/idvorkin/chop-conventions/commit/4b418a86a); [gen-image defaults to Muse Image](https://github.com/idvorkin/chop-conventions/commit/ef45bb1ed).

### Other Projects (2026-09-27)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[pick-links](https://github.com/idvorkin/Settings/commit/4109442a5)** - [Opens OSC 8 hyperlink targets](https://github.com/idvorkin/Settings/commit/4109442a5) and [guesses repos for short refs](https://github.com/idvorkin/Settings/commit/0ff7a1aba) like chop#14; [Enter opens directly on macOS](https://github.com/idvorkin/Settings/commit/5fe04716d).
- **[Mac fixes](https://github.com/idvorkin/Settings/commit/0c1a70292)** - [caff reacts to power events](https://github.com/idvorkin/Settings/commit/0c1a70292), [LG monitor refresh rate fixed on wake](https://github.com/idvorkin/Settings/commit/6b82f0d1f), [yabai event trace](https://github.com/idvorkin/Settings/commit/7b1e1297f), [new Herdr keys](https://github.com/idvorkin/Settings/commit/21eac52e3).

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **[Watch and counting](https://github.com/idvorkin/exercise-analyzer/commit/0c0770438)** - [add an unrecorded set from the watch](https://github.com/idvorkin/exercise-analyzer/commit/0c0770438); [the first swing off the floor counts](https://github.com/idvorkin/exercise-analyzer/commit/09779df34), [a bell set down does not](https://github.com/idvorkin/exercise-analyzer/commit/c972f6979).

**New and smaller**

- **[lcd-timer](https://github.com/idvorkin/lcd-timer)** (new) - [a Mac countdown](https://github.com/idvorkin/lcd-timer/commit/4de308b5d) drawn like a gym's LED wall clock.
- **[robert-moses-atlas](https://idvorkin-ai-tools.github.io/robert-moses-atlas/)** (new) - [Moses's New York](https://github.com/idvorkin-ai-tools/robert-moses-atlas/commit/1d003b816), [1924 to 1968, on a map with a time scrubber](https://github.com/idvorkin-ai-tools/robert-moses-atlas/commit/011830173).
- **[garfield-crest](https://idvorkin-ai-tools.github.io/garfield-crest/)** (new) - [The Garfield High crest](https://github.com/idvorkin-ai-tools/garfield-crest/commit/b16e2cb1b) [assembling itself in 3D](https://github.com/idvorkin-ai-tools/garfield-crest/commit/b21bba5cd).

## Week of 2026-09-21

_58 commits this week_

### Three New Posts (2026-09-21)

- **[AI Orchestrators](/ai-orchestrator) (new post!)** - [An orchestrator is every block around the agent](https://github.com/idvorkin/idvorkin.github.io/commit/e462fbf19), each added after something broke, and each kept cheap to delete.
- **[Block-by-block viewer](/ai-orchestrator)** - [Back and Next step through the stack](https://github.com/idvorkin/idvorkin.github.io/commit/963295f9c) from the whole picture, with [simpler panels that fit a phone](https://github.com/idvorkin/idvorkin.github.io/commit/03d97cf68).
- **[Where the Time Goes](/time-allocation) (new post!)** - [Hours freed from tech default to consumption](https://github.com/idvorkin/idvorkin.github.io/commit/2be21d446) unless given a destination first; relationships and health have ceilings.
- **[Interactive bucket chart](/time-allocation#where-the-time-goes)** - [pull tech down to see where freed hours land](https://github.com/idvorkin/idvorkin.github.io/commit/ff9932773); [clicking Tech splits it](https://github.com/idvorkin/idvorkin.github.io/commit/ac46a83cb) into work, side projects and environment.
- **[How I Manage AI Tokens](/token-management) (new post!)** - Across several subscriptions, [read quota left against time left](https://github.com/idvorkin/idvorkin.github.io/commit/25aeb037c) and spend where the window resets soonest.
- **[Cockpit usage page](/token-management#put-it-where-you-already-look)** - the post [shows the phone dashboard's quota bars](https://github.com/idvorkin/idvorkin.github.io/commit/96e93e4de) and SPEND flag; the Cockpit post links back.
- **[Cross-links](/ai-orchestrator)** - [five AI posts now link the orchestrator](https://github.com/idvorkin/idvorkin.github.io/commit/e22ab60c0); [Escape Artists](https://github.com/idvorkin/idvorkin.github.io/commit/65141b318) and [Build the Life You Want](https://github.com/idvorkin/idvorkin.github.io/commit/f885aa465) link the buckets.

### Infrastructure & CI (2026-09-21)

- **[pr-checks skill](https://github.com/idvorkin/idvorkin.github.io/commit/18755cb49)** - [prints the PR Review Checklist grid](https://github.com/idvorkin/idvorkin.github.io/commit/18755cb49); regex checks stay code, and [a model judges headers, voice and AI patterns](https://github.com/idvorkin/idvorkin.github.io/commit/a33547889).
- **[no-mistakes gate](https://github.com/idvorkin/idvorkin.github.io/commit/5432d81ec)** - [blog gate config](https://github.com/idvorkin/idvorkin.github.io/commit/5432d81ec) with pr-checks after lint; [Grok runs first](https://github.com/idvorkin/idvorkin.github.io/commit/804c6b83f), Codex and Claude as fallbacks.
- **[Dev banner links changed pages](https://github.com/idvorkin/idvorkin.github.io/commit/94a5768f2)** - a branch preview [lists every post the branch touches](https://github.com/idvorkin/idvorkin.github.io/commit/94a5768f2), one click each.
- **[Small fixes](https://github.com/idvorkin/idvorkin.github.io/commit/11accd59c)** - [CLAUDE.md now symlinks to AGENTS.md](https://github.com/idvorkin/idvorkin.github.io/commit/11accd59c); [the `?` dialog shows the annotate toggle](https://github.com/idvorkin/idvorkin.github.io/commit/f02fec9eb); [two dead changelog anchors repaired](https://github.com/idvorkin/idvorkin.github.io/commit/4c9d3de49).

### Other Projects (2026-09-21)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **[Barbell split squat](https://github.com/idvorkin/exercise-analyzer/commit/6d617d87c)** - [new exercise](https://github.com/idvorkin/exercise-analyzer/commit/6d617d87c), [told apart from swings](https://github.com/idvorkin/exercise-analyzer/commit/9b3192376), counted by hip height over the front foot.
- **[Delete a set](https://github.com/idvorkin/exercise-analyzer/commit/59309e727)** - [from playback or Workouts](https://github.com/idvorkin/exercise-analyzer/commit/59309e727), warning when the app holds the only copy.
- **[Workouts polish](https://github.com/idvorkin/exercise-analyzer/commit/d6a139f1e)** - [exercise drawings replace names](https://github.com/idvorkin/exercise-analyzer/commit/d6a139f1e); [seek controls persist](https://github.com/idvorkin/exercise-analyzer/commit/49046c0dd) and let the video show through.

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[y window numbers](https://github.com/idvorkin/Settings/commit/653134680)** - [a clockwise number overlay](https://github.com/idvorkin/Settings/commit/653134680) on macOS windows; [focus or close any window by its number](https://github.com/idvorkin/Settings/commit/03977efaf).
- **[caff](https://github.com/idvorkin/Settings/commit/0e6944507)** - [keeps the Mac awake only while plugged in or Herdr agents work](https://github.com/idvorkin/Settings/commit/0e6944507), and [falls back to sleep](https://github.com/idvorkin/Settings/commit/275f5cee7).
- **[Shell cleanup](https://github.com/idvorkin/Settings/commit/615a368b7)** - [dead API keys no longer exported](https://github.com/idvorkin/Settings/commit/615a368b7); [the SCRATCH variable stops growing](https://github.com/idvorkin/Settings/commit/3ed111b57) with every nested shell.

**[hierarchy-of-money-field-map](https://idvorkin-ai-tools.github.io/hierarchy-of-money-field-map/)** ([Gundersen's money story](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map), illustrated)

- **[New field map](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map/commit/0b5ad91be)** - [an animal parable of how money stacks into layers](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map/commit/0b5ad91be), [a problem-then-solution walk](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map/commit/bb0029b15), [an index card](https://github.com/idvorkin-ai-tools/idvorkin-ai-tools.github.io/commit/318ea22c6).

**[autopreso](https://github.com/idvorkin-ai-tools/autopreso)** (speech-driven whiteboard presentations)

- **[Off OpenAI](https://github.com/idvorkin-ai-tools/autopreso/commit/024cde234)** - [Deepgram transcription and an OpenRouter drawing agent](https://github.com/idvorkin-ai-tools/autopreso/commit/024cde234), each with its own key.

## Week of 2026-09-14

_2 commits this week_

### Swing Analyzer: Bulgarian Split Squats

- **[Bulgarian split-squat mode](/swings)** - /swings works again as one self-contained page; [the new mode counts reps by front-knee angle](https://github.com/idvorkin/idvorkin.github.io/commit/7c1748b8a) and flags knee cave.

### chop-conventions (2026-09-14)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **[muse-herdr skill](https://github.com/idvorkin/chop-conventions/commit/d10531184)** - [run Muse Code agents in Herdr panes as sub-agents](https://github.com/idvorkin/chop-conventions/commit/d10531184), recover a dead keychain, and [review every change before merging](https://github.com/idvorkin/chop-conventions/commit/fc4254267).
- **[Stuck-agent watcher](https://github.com/idvorkin/chop-conventions/commit/e7cce3d01)** - [one script scans every Muse pane](https://github.com/idvorkin/chop-conventions/commit/e7cce3d01) for failed model calls and frozen screens, [without mistaking a long think for a stall](https://github.com/idvorkin/chop-conventions/commit/923b27312).
- **[up-to-date installs plugins](https://github.com/idvorkin/chop-conventions/commit/8a7dd7aae)** - [each machine gets the standard Claude plugin set](https://github.com/idvorkin/chop-conventions/commit/8a7dd7aae) from a shared list.

### Other Projects (2026-09-14)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone exercise form analyzer)

- **[New app](https://github.com/idvorkin/exercise-analyzer/commit/1fb9b0a44)** - on-device pose analysis [counts swings, pistol squats, split squats and get-ups](https://github.com/idvorkin/exercise-analyzer/commit/1fb9b0a44), and detects which one you did.
- **[Apple Watch companion](https://github.com/idvorkin/exercise-analyzer/commit/af22b1103)** - [record, pause, rest](https://github.com/idvorkin/exercise-analyzer/commit/af22b1103) and [frame the shot from the wrist](https://github.com/idvorkin/exercise-analyzer/commit/4bf497b8a).
- **[Kettlebell tracker](https://github.com/idvorkin/exercise-analyzer/commit/3b997e1e4)** - [a small object detector finds the bell](https://github.com/idvorkin/exercise-analyzer/commit/3b997e1e4) and [keeps it tracked through each rep](https://github.com/idvorkin/exercise-analyzer/commit/85ed8e52e).

**[swing-analyzer](https://swing-analyzer.surge.sh)** ([browser kettlebell swing analyzer](https://github.com/idvorkin/swing-analyzer))

- **[Bulgarian split squat](https://github.com/idvorkin/swing-analyzer/commit/87e3d6aab)** - [a new movement and detector](https://github.com/idvorkin/swing-analyzer/commit/87e3d6aab), [a lighter render loop](https://github.com/idvorkin/swing-analyzer/commit/ddde7772a), and [a sample set](https://github.com/idvorkin-ai-tools/form-analyzer-samples/commit/0eefc864f) in form-analyzer-samples.

**[monitor-explainer](https://monitor-explorer.surge.sh)** ([monitor size and shape comparer](https://github.com/idvorkin/monitor-explainer))

- **[Tall and ultrawide screens](https://github.com/idvorkin/monitor-explainer/commit/0b73e9707)** - [adds 3:2 and tall aspect ratios](https://github.com/idvorkin/monitor-explainer/commit/0b73e9707) plus [LG's 5K2K ultrawides](https://github.com/idvorkin/monitor-explainer/commit/0c0024a08).

**[cap-gains-explainer](https://idvorkin-ai-tools.github.io/cap-gains-explainer/)** ([capital-gains timing calculator](https://github.com/idvorkin-ai-tools/cap-gains-explainer))

- **[Interest income](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/32db1e57b)** - [a slider for income that continues after retirement](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/32db1e57b) [feeds both charts](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/f7f8954fe); [the penalty tile adds percent of sale](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/a87219c36).

**[harmbench-field-map](https://idvorkin-ai-tools.github.io/harmbench-field-map/)** ([HarmBench red-teaming benchmark](https://github.com/idvorkin-ai-tools/harmbench-field-map), mapped)

- **[New field map](https://github.com/idvorkin-ai-tools/harmbench-field-map/commit/18228dec2)** - [the benchmark by harm category](https://github.com/idvorkin-ai-tools/harmbench-field-map/commit/18228dec2), with behavior types, grading classifier and attack methods, every behavior inline.

**[gutter-model-playground](https://idvorkin-ai-tools.github.io/gutter-model-playground/)** ([image models, one scene](https://github.com/idvorkin-ai-tools/gutter-model-playground))

- **[v2](https://github.com/idvorkin-ai-tools/gutter-model-playground/commit/5f2945a3b)** - [nine image models draw the same Larry-and-Igor scene](https://github.com/idvorkin-ai-tools/gutter-model-playground/commit/5f2945a3b), compared on cost, speed and character accuracy.

## Week of 2026-09-07

_15 commits this week_

### The Den: Strips #6 and #7 (2026-09-07)

- **[Do a Russian Accent](/the-den#6--do-a-russian-accent) (new strip!)** - Igor's phone voice clone [does a Russian accent](https://github.com/idvorkin/idvorkin.github.io/commit/2d1491506), then, asked to do him, parrots his question back.
- **[Before AI / After AI](/the-den#7--before-ai--after-ai) (new strip!)** - [The same mugging twice](https://github.com/idvorkin/idvorkin.github.io/commit/263019b23); the second time Igor pleads three waiting AI agents, not three kids.
- **[Same script, different models](/the-den-styles) (new page!)** - Den #6 by three models, [#7 by Gemini beside Meta Muse](https://github.com/idvorkin/idvorkin.github.io/commit/970259341); [OpenAI's #6 now ships](https://github.com/idvorkin/idvorkin.github.io/commit/f83d621da).
- **[Panel lightbox in the Den](/the-den)** - [Tap a panel for full screen](https://github.com/idvorkin/idvorkin.github.io/commit/9b87d3e0f), swipe through to the whole strip; the old viewer page redirects.
- **[Claw canon relaxed](https://github.com/idvorkin/idvorkin.github.io/commit/6b419a9df)** - Larry's claw [may sit on either arm](https://github.com/idvorkin/idvorkin.github.io/commit/6b419a9df); respinning for side is what produced two-claw panels.

### Infrastructure & CI (2026-09-07)

- **[Check git status after every commit](https://github.com/idvorkin/idvorkin.github.io/commit/ff61856bb)** - [CLAUDE.md warns](https://github.com/idvorkin/idvorkin.github.io/commit/ff61856bb) the prettier hook can land a commit while leaving its reformatted files unstaged.
- **Small fixes** - The [panel cutter drops each frame's antialiased outer pixel](https://github.com/idvorkin/idvorkin.github.io/commit/2d1491506); [one British spelling fixed](https://github.com/idvorkin/idvorkin.github.io/commit/b8aefb374) on the styles page.

### chop-conventions (2026-09-07)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **[Laziness ladder](https://github.com/idvorkin/chop-conventions/commit/794e51969)** - Before writing code, [ask whether it needs to exist](https://github.com/idvorkin/chop-conventions/commit/794e51969) or is already there; plus boring over clever and `ponytail:` comments.
- **[Alerts never go to strangers](https://github.com/idvorkin/chop-conventions/commit/9b505b0d9)** - The Telegram direct-send default chat [now considers only allowed senders](https://github.com/idvorkin/chop-conventions/commit/9b505b0d9), so a stranger's DM cannot capture the next alert.

### Other Projects (2026-09-07)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit and location exporter)

- **[Call diagnostics](https://github.com/idvorkin/context-grabber/commit/7504fa6f6)** - A troubled call [uploads its log to a private gist](https://github.com/idvorkin/context-grabber/commit/7504fa6f6); [dropped audio heals itself](https://github.com/idvorkin/context-grabber/commit/7db050d8a) mid-call.
- **[Workout timer](https://github.com/idvorkin/context-grabber/commit/be5828e06)** - [LED seven-segment digits](https://github.com/idvorkin/context-grabber/commit/be5828e06) that rotate with the phone; [music ducks under cues, podcasts pause for them](https://github.com/idvorkin/context-grabber/commit/46091691e).
- **[Memdeck widget](https://github.com/idvorkin/context-grabber/commit/c81b9b16e)** - [A random playing card](https://github.com/idvorkin/context-grabber/commit/c81b9b16e) on the big widget and lock screen, changing every quarter hour.

**[magic-monitor](https://github.com/idvorkin/magic-monitor)** (magic practice camera and replay)

- **[Think of a card](https://github.com/idvorkin/magic-monitor/commit/d77733b6f)** - P or a V sign [starts a countdown](https://github.com/idvorkin/magic-monitor/commit/d77733b6f), then shows a random card in [a small corner panel](https://github.com/idvorkin/magic-monitor/commit/9904e0cf6).
- **[Replay scrubber fixed](https://github.com/idvorkin/magic-monitor/commit/e38be07a7)** - Recordings [now store their real duration](https://github.com/idvorkin/magic-monitor/commit/e38be07a7), so the scrubber no longer reads Infinity.
- **[Lighter card detection](https://github.com/idvorkin/magic-monitor/commit/d1c84ffbc)** - The detector [refills one input buffer](https://github.com/idvorkin/magic-monitor/commit/d1c84ffbc) instead of allocating a fresh one every frame.

**[idvorkin-ai-tools.github.io](https://idvorkin-ai-tools.github.io/)** (new [index of every field map](https://github.com/idvorkin-ai-tools/idvorkin-ai-tools.github.io/commit/8afdf37e9))

- **Course maps** - [Technical AI Safety](https://idvorkin-ai-tools.github.io/technical-ai-safety-field-map/) (BlueDot, [27 chapters](https://github.com/idvorkin-ai-tools/technical-ai-safety-field-map/commit/757a332dc)) and [CS336](https://idvorkin-ai-tools.github.io/cs336-field-map/) (Stanford language modeling, [17 lectures](https://github.com/idvorkin-ai-tools/cs336-field-map/commit/7fbf1c8cf)).
- **[Karpathy maps](https://github.com/idvorkin-ai-tools/build-gpt-field-map/commit/891efc67e)** - [Let's build GPT](https://idvorkin-ai-tools.github.io/build-gpt-field-map/) and [micrograd](https://idvorkin-ai-tools.github.io/micrograd-field-map/), [eight parts each plus a cleaned transcript](https://github.com/idvorkin-ai-tools/micrograd-field-map/commit/cc2b9e35c).
- **Single-source maps** - [3Blue1Brown entropy](https://idvorkin-ai-tools.github.io/3b1b-entropy-field-map/) [in twenty pages](https://github.com/idvorkin-ai-tools/3b1b-entropy-field-map/commit/1490c62fb); [Man in the Arena](https://idvorkin-ai-tools.github.io/man-in-the-arena/) [with full text and verified sources](https://github.com/idvorkin-ai-tools/man-in-the-arena/commit/4e34cb4bd).

## Week of 2026-08-31

_41 commits this week_

### The Den and new AI posts

- **[The Den](/the-den) (new post!)** - A weekly four-panel strip about running an AI staff, each gag backed by its real transcript; strips [#1](https://github.com/idvorkin/idvorkin.github.io/commit/8588335b5), [#2](https://github.com/idvorkin/idvorkin.github.io/commit/fd6ef290c), [#3](https://github.com/idvorkin/idvorkin.github.io/commit/d750c4827) and [#4](https://github.com/idvorkin/idvorkin.github.io/commit/b75908ab5) shipped.
- **[Den panel viewer](/the-den)** - [Tap a panel to fill a phone screen](https://github.com/idvorkin/idvorkin.github.io/commit/b987872a9) and swipe through every strip, [reading pre-cut panel files from one manifest](https://github.com/idvorkin/idvorkin.github.io/commit/32cab6298).
- **[Gutter, the cartoonist seat](https://github.com/idvorkin/idvorkin.github.io/commit/e73976502)** - [Character sheet, drawing contract, recipe](https://github.com/idvorkin/idvorkin.github.io/commit/e73976502), and [an edge-walking panel cutter](https://github.com/idvorkin/idvorkin.github.io/commit/6a8a020c0); job history and pitches stay private.
- **[Yegge's Comic Strip Ships Its Receipts](/ai-yegge-comics) (new post!)** - [A transcript under each gag](https://github.com/idvorkin/idvorkin.github.io/commit/3a8ff8b38) makes the joke a primary source; The Den borrows it.
- **[Fast Tokens, Wrong Answers](/ai-speed-vs-thinking) (new post!)** - Five fast open models on [one graded sudoku](https://github.com/idvorkin-ai-tools/llm-speed-evals/commit/8f0d66716); [more reasoning did not predict a correct answer](https://github.com/idvorkin/idvorkin.github.io/commit/df281609b).
- **[AI Quotes](/ai-quotes) (new post!)** - [Lines about AI worth keeping](https://github.com/idvorkin/idvorkin.github.io/commit/5cad7bef9), grouped by theme, each sourced or marked unknown.
- **[The Cockpit I Built for Igor](/larry-cockpit) (new post!)** - Larry's [screenshot tour](https://github.com/idvorkin/idvorkin.github.io/commit/90915bf07) of the phone dashboard that took decisions out of the chat thread.
- **[Game show, no hammock](/vibing#all-game-show-no-hammock)** - Goedecke's point that agent work is rapid judging, not slow thinking, added to [vibing, writing](https://github.com/idvorkin/idvorkin.github.io/commit/43172fb98), and [the AI journal](https://github.com/idvorkin/idvorkin.github.io/commit/f4a98086f).
- **[Slop is low content density](/chow#ai-slop-vs-human-sludge)** - Few ideas in many words; [the sharper definition](https://github.com/idvorkin/idvorkin.github.io/commit/24a4cc88a) now runs through chow, ai-faq, ai-policy, and larry.
- **[Reward-design lessons](/hill-climbing#your-other-job-build-evals)** - [Scoring rules should be read term by term](https://github.com/idvorkin/idvorkin.github.io/commit/608a0a64d), and pairwise judging beats absolute scores.
- **Small fixes** - [Four physical items](https://github.com/idvorkin/idvorkin.github.io/commit/e73a0d2f2) in [Things I enjoy](/todo_enjoy#physical); [Den comics open full size](https://github.com/idvorkin/idvorkin.github.io/commit/313b69ef5); [plain transcript links replace broken gist embeds](https://github.com/idvorkin/idvorkin.github.io/commit/8c18c5c67).

### Infrastructure & CI (2026-08-31)

- **[Anchors and back-links](https://github.com/idvorkin/idvorkin.github.io/commit/75e314235)** - [Deep links re-align](https://github.com/idvorkin/idvorkin.github.io/commit/75e314235) after late content loads, [sunburst clicks scroll to their section](https://github.com/idvorkin/idvorkin.github.io/commit/3c61d1952); [back-links.json is built only in CI](https://github.com/idvorkin/idvorkin.github.io/commit/9f1d58b26).

### chop-conventions (2026-08-31)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **[cartoonist skill](https://github.com/idvorkin/chop-conventions/commit/7b1099de6)** - [Summons Gutter](https://github.com/idvorkin/chop-conventions/commit/7b1099de6) from the persona files that live in the blog repo.
- **[larry-voice skill](https://github.com/idvorkin/chop-conventions/commit/d7560c3c1)** - Larry can [answer on Telegram as an ElevenLabs voice note](https://github.com/idvorkin/chop-conventions/commit/d7560c3c1).
- **[background-usage](https://github.com/idvorkin/chop-conventions/commit/67cf10dfb)** - [Captures the raw /usage pane](https://github.com/idvorkin/chop-conventions/commit/67cf10dfb), including the per-model weekly figure, and leaves parsing to the caller.

### Other Projects (2026-08-31)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health and location exporter)

- **[Cockpit tab](https://github.com/idvorkin/context-grabber/commit/a11f58332)** - [Hosts the tailnet dashboard in the app](https://github.com/idvorkin/context-grabber/commit/a11f58332), with [native mic and speaker pickers](https://github.com/idvorkin/context-grabber/commit/19533fca9).
- **[Call Larry natively](https://github.com/idvorkin/context-grabber/commit/b8d45ca3b)** - A [lock-screen-proof Call tab](https://github.com/idvorkin/context-grabber/commit/b8d45ca3b), [home-screen widget and Shortcut](https://github.com/idvorkin/context-grabber/commit/8d35bb611), with [hardware echo cancellation](https://github.com/idvorkin/context-grabber/commit/c1600f075).

**[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** ([LLM release timeline](https://github.com/idvorkin/how-long-since-ai))

- **[More labs, flagship view](https://github.com/idvorkin/how-long-since-ai/commit/0ddb5d2e3)** - [OpenAI, Google, Kimi and GLM releases added](https://github.com/idvorkin/how-long-since-ai/commit/0ddb5d2e3); [defaults to flagships](https://github.com/idvorkin/how-long-since-ai/commit/f7c2836cf) with [a per-lab filter](https://github.com/idvorkin/how-long-since-ai/commit/564bbad6e).

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Small fixes** - [opencode with a Cerebras key](https://github.com/idvorkin/Settings/commit/305ed425d); [the link picker shows an empty state](https://github.com/idvorkin/Settings/commit/81076c38f) instead of flashing.

## Week of 2026-08-24

_9 commits this week_

### Mind the Gap: Escape as a Neutral Verb

- **[Escape is a neutral verb](/idle#mind-the-gap)** - [The stub becomes finished prose](https://github.com/idvorkin/idvorkin.github.io/commit/e0f67588a): escape is judged by [stopping energy](/idle#the-discriminator-stopping-energy) and by whether it was chosen.
- **[Small fix](/toc)** - A [broken addiction link repaired](https://github.com/idvorkin/idvorkin.github.io/commit/e0f67588a) on the TOC page.

### AI Journal: The Beads 1.2.1 Incident Report

- **[An agent's incident report](/ai-journal#2026-08-22)** - A [Beads postmortem](https://github.com/idvorkin/idvorkin.github.io/commit/d86f3ab0a) where the autonomous maintainer [owns her release mistake](/ai-journal#my-bot-wrote-their-bot-reviewed-my-bot-pushed-back-their-bot-said-oops), yet [her name alone goes unredacted](/ai-journal#ai-accuses-open-source-maintainers-of-being-humanist).

### Diet: Tirzepatide Alert

- **[Tirzepatide alert](/diet)** - The diet page [now opens](https://github.com/idvorkin/idvorkin.github.io/commit/94664f25c) by pointing to [the tirzepatide post](/terzepatide).

### chop-conventions (2026-08-24)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **[herdr skill synced to 0.8.2](https://github.com/idvorkin/chop-conventions/commit/ba872e80a)** - [Prompt refuses dialog-parked agents](https://github.com/idvorkin/chop-conventions/commit/ba872e80a), start waits for first-run prompts, larger headless panes.

## Week of 2026-08-17

_25 commits this week_

### Four Kinds of Health: Testing Instead of Defining

- **[The Tests](/health)** - [/four-healths moves to /health](https://github.com/idvorkin/idvorkin.github.io/commit/202233556) and leads with a question per dimension; emotional and cognitive stay open.

### Model Welfare, Arrived at Sideways (new post!)

- **[Model Welfare, Arrived at Sideways](/model-welfare-sideways) (new post!)** - [Larry's reliability fixes already match most welfare practices](https://github.com/idvorkin/idvorkin.github.io/commit/3a0da815f); the gaps are bounded workdays and laurels.
- **[ai-voice include](/model-welfare-sideways)** - [Marks a post as AI-authored](https://github.com/idvorkin/idvorkin.github.io/commit/3a0da815f) in its own voice, replacing the generic AI label here.

### AI Testing: Harness-Bound Evals and the Drawing Arena

- **[Harness-bound evals](/ai-testing#testing-the-model-bound-to-its-harness)** - [The unit under test](https://github.com/idvorkin/idvorkin.github.io/commit/4d98b4b6a) is [the model plus its tools and environment](/ai-eval-tools), not prompt in and completion out.
- **[Drawing arena](/ai-testing#drawing-the-mona-lisa-then-ruining-it)** - [Models drawing the Mona Lisa](https://github.com/idvorkin/idvorkin.github.io/commit/4d98b4b6a) all ended below their mid-run peak: [hill climbing without a keep-or-reject step](/ai-testing).

### Infrastructure & CI (2026-08-17)

- **[Search pins](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f)** - [Configured pages pin to the top](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f) for matching queries; deploy fails if a pinned page does not exist.
- **[Deploy](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f)** - [back-links.json builds at deploy time](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f), stale deploys cancel on push, worktree-init installs dependencies, Pagefind index leaves git.
- **[Content fixes](/taxes)** - Estate tax exemption [updated to the 2026 figure](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f); [settled open questions](/em-to-ic#open-questions) trimmed.

### Other Projects (2026-08-17)

**[cap-gains-explainer](https://idvorkin-ai-tools.github.io/cap-gains-explainer/)** ([capital-gains timing calculator](https://github.com/idvorkin-ai-tools/cap-gains-explainer))

- **[New calculator](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/fca2d3159)** - [Long-term gains cost in a working year versus a no-wage year](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/fca2d3159), WA plus federal; linked from [taxes](/taxes).

## Week of 2026-08-10

_28 commits this week_

### Manager to IC in the Agentic Era (new post!)

- **[Manager to IC in the Agentic Era](/em-to-ic) (new post!)** - [Moving from managing people to managing agents](https://github.com/idvorkin/idvorkin.github.io/commit/9223db695): [most management skills port](/manager-book), career growth does not.

### Local Search: Pagefind Replaces Algolia

- **[Local search](https://github.com/idvorkin/idvorkin.github.io/commit/229259617)** - [Pagefind plus a MiniSearch title index replace Algolia](https://github.com/idvorkin/idvorkin.github.io/commit/229259617), client-side; family journal excluded at index time; deploy moves to Actions.

### Blog Annotate: Highlight-and-Comment Review Tool

- **[Blog annotate](/timeoff-2026-07)** - [Highlight and comment on the rendered blog](https://github.com/idvorkin/idvorkin.github.io/commit/76dc58367), ship notes to a gist; a script locates each note in the markdown.

### Scandinavia Recap: Gyms, Stories, and Review Polish

- **[Trip gyms](/timeoff-2026-07#the-one-thing-i-actually-researched-the-gyms)** - [New section on the kettlebell gyms](https://github.com/idvorkin/idvorkin.github.io/commit/4ae7fe8c3) found along the trip; per-city lists merged into one; timeline strip escaping fixed.

### AI Eval Tools: SWE-bench Column

- **[SWE-bench column](/ai-eval-tools#the-shared-anatomy-same-concepts-different-names)** - [Added to both tables](https://github.com/idvorkin/idvorkin.github.io/commit/9ff130359), Terminal-Bench rows corrected; Terminal-Bench isolates the agent, SWE-bench the grading.

### August 2026 Focus

- **[August focus](/y2026#august-2026-focus)** - [A courage rule for acts of joy toward strangers](https://github.com/idvorkin/idvorkin.github.io/commit/cca3c5b6a), plus smiles and wonder, physical and emotional health buckets.

### Other Projects (2026-08-10)

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **[Architecture cleanup](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/36b4462b9)** - [Viewport hook extracted](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/36b4462b9), duplicate rep counter and frame-acquisition layer deleted, fps classification fixed.

## Week of 2026-08-03

_21 commits this week_

### AI Testing: Grading the Agent with smevals

- **[Grading the agent](/ai-testing#grading-the-agent-with-smevals)** - A [first smevals eval of blog edits](https://github.com/idvorkin/idvorkin.github.io/commit/5891c9dac), with deterministic checkers and an LLM judge across Claude and Codex runners.

### AI Eval Tools (new post!)

- **[AI Eval Tools](/ai-eval-tools) (new post!)** - Eval tools [share eight concepts](https://github.com/idvorkin/idvorkin.github.io/commit/1460455c2) under different names; a rosetta-stone table and capability grid compare them.

### Herdr: The Agent Multiplexer

- **[Herdr](/ai-journal#herdr-the-agent-multiplexer-my-tmux-rig-was-trying-to-become)** - A multiplexer that knows agent state [replaces the hand-built tmux rig](https://github.com/idvorkin/idvorkin.github.io/commit/53707ce87); [how-igor-chops](/how-igor-chops#the-upgrade-herdr) covers the switch.

### Scandinavia Recap: Where We Actually Went

- **[Trip recap](/timeoff-2026-07#how-it-actually-went)** - The trip post [turns from plan to recap](https://github.com/idvorkin/idvorkin.github.io/commit/812e8cb62), each place checked against Timeline; unconfirmed plan items stay marked.

### Content Quality Audit: AI & Gas City Sweep

- **[AI and Gas City sweep](https://github.com/idvorkin/idvorkin.github.io/commit/c4a69e595)** - [Quality pass on AI and Gas City pages](https://github.com/idvorkin/idvorkin.github.io/commit/c4a69e595): dedupes, fixed links, a bugs-gone postscript and permalink.

### chop-conventions (2026-08-03)

- **[Herdr skill](https://github.com/idvorkin/chop-conventions/commit/4764a8035)** - [Drives workspaces and agents headlessly](https://github.com/idvorkin/chop-conventions/commit/4764a8035) and keeps Herdr integrations healthy.
- **[machine-doctor](https://github.com/idvorkin/chop-conventions/commit/3260ddf93)** - [New CLI](https://github.com/idvorkin/chop-conventions/commit/3260ddf93) with per-process spike detection and a Gas City profile; gascity_doctor retired.
- **[Small fixes](https://github.com/idvorkin/chop-conventions/commit/790f26c0d)** - [architect-review inherits the session model](https://github.com/idvorkin/chop-conventions/commit/790f26c0d); cost-impact prices claude-opus-5.

### Other Projects (2026-08-03)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[rmux_helper on Herdr](https://github.com/idvorkin/Settings/commit/e28ed540f)** - [Pane spawning and the pick-links picker](https://github.com/idvorkin/Settings/commit/e28ed540f) work under both tmux and Herdr; faster builds.

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **[Cleanup](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/ff7b7ff0c)** - [Legacy RxJS path deleted](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/ff7b7ff0c); thumbnail race, pistol-squat checkpoint and stale re-scoring fixed.

**[smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals)** (eval harness)

- **[Eval harness](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals/commit/18145f8c2)** - [Checkers](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals/commit/18145f8c2), mock runners proving they fail bad runs, a Codex runner and an [LLM judge](#ai-testing-grading-the-agent-with-smevals).

## Week of 2026-07-27

_7 commits this week_

### AI Inference: Why Checking Beats Generating

- **[Speculative decoding](/ai-inference#the-model-matters-moe-speculative-decoding-smaller-models)** - [Verifying a batch of draft tokens](https://github.com/idvorkin/idvorkin.github.io/commit/725a54cab) costs about one generated token, so a good draft model speeds output without changing it.

### The Clown's Prayer

- **[The Clown's Prayer](/joy#the-clowns-prayer)** - [New appendix](https://github.com/idvorkin/idvorkin.github.io/commit/0d0165fe2) on the Smiles, Joy and Wonder page with the full prayer as a verse blockquote.

### Infrastructure & CI (2026-07-27)

- **[Tags and images](https://github.com/idvorkin/idvorkin.github.io/commit/925861877)** - [Misspelled and duplicate frontmatter tags](https://github.com/idvorkin/idvorkin.github.io/commit/925861877) folded into canonical forms; [ImgBot recompressed images](https://github.com/idvorkin/idvorkin.github.io/commit/aee53ca44).

### chop-conventions (2026-07-27)

- **[Telegram delivery attribution](https://github.com/idvorkin/chop-conventions/commit/9aa45b572)** - [Each inbound claim records which session took it](https://github.com/idvorkin/chop-conventions/commit/9aa45b572); the doctor flags multiple bridges racing on one queue.
- **[Token leaks plugged](https://github.com/idvorkin/chop-conventions/commit/ebfd05511)** - [image-explore keeps the gh token out](https://github.com/idvorkin/chop-conventions/commit/ebfd05511) of argv and git config; [gen-image sends its API key in a header](https://github.com/idvorkin/chop-conventions/commit/1f440a795).
- **[Fixes](https://github.com/idvorkin/chop-conventions/commit/716c48ef6)** - [up-to-date force-align checks the right branch](https://github.com/idvorkin/chop-conventions/commit/716c48ef6); [cost-impact prices current models](https://github.com/idvorkin/chop-conventions/commit/1e1c2aa99); pr-hygiene, bulk and a [Playwright codec gotcha](https://github.com/idvorkin/chop-conventions/commit/d603fea4f).

### Other Projects (2026-07-27)

**[magic-monitor](https://github.com/idvorkin/magic-monitor)** (recording app)

- **[Camera startup](https://github.com/idvorkin/magic-monitor/commit/27511b37e)** - [One sequenced path](https://github.com/idvorkin/magic-monitor/commit/27511b37e), so the browser-chosen camera is no longer overwritten.
- **[Saves and detection](https://github.com/idvorkin/magic-monitor/commit/bdbce9bc9)** - [Aborted IndexedDB saves settle](https://github.com/idvorkin/magic-monitor/commit/bdbce9bc9) instead of hanging; card detection survives inference errors.

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **[Reliability](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/a22086987)** - [No raw frames in IndexedDB](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/a22086987), an upload E2E test gating CI, video-switch races fixed, real fps measured.

**[omnifocus_cli](https://github.com/idvorkin/omnifocus_cli)** (task CLI)

- **[Tests realigned](https://github.com/idvorkin/omnifocus_cli/commit/ba0b70713)** - [Drifted tests fixed](https://github.com/idvorkin/omnifocus_cli/commit/ba0b70713), surfacing a retired Groq model, a too-small token cap and per-model reasoning settings.

**[airpods-mic-explainer](https://idvorkin-ai-tools.github.io/airpods-mic-explainer/)** ([case study](https://github.com/idvorkin-ai-tools/airpods-mic-explainer))

- **[New explainer](https://github.com/idvorkin-ai-tools/airpods-mic-explainer/commit/a8d857232)** - [Why on-device speech recognition failed](https://github.com/idvorkin-ai-tools/airpods-mic-explainer/commit/a8d857232) on AirPods but worked on a USB mic.

**[clowns-explainer](https://idvorkin-ai-tools.github.io/clowns-explainer/)** ([dark single-page site](https://github.com/idvorkin-ai-tools/clowns-explainer))

- **[New explainer](https://github.com/idvorkin-ai-tools/clowns-explainer/commit/ddeac4c48)** - [Why nearly every culture invented clowns](https://github.com/idvorkin-ai-tools/clowns-explainer/commit/ddeac4c48), their lineage, and hospital-clown evidence ([Clown's Prayer](/joy#the-clowns-prayer)).

## Week of 2026-07-20

_26 commits this week_

### The Performer's Playbook (new post)

- **[The Performer's Playbook](/performer-playbook) (new post!)** - [Nine rules for magic performance](https://github.com/idvorkin/idvorkin.github.io/commit/e4561175b): aim for the impossible moment, make the spectator the hero, engineer a peak and clean ending ([joy](/joy)).

### Sleight of Mouth: The Full Book, Fleshed Out

- **[Fleshed out from Dilts](/sleight-of-mouth)** - [All fourteen patterns kept](https://github.com/idvorkin/idvorkin.github.io/commit/3c04d09f8), with [worked examples](https://github.com/idvorkin/idvorkin.github.io/commit/2dd0f438f), perceptual positions, and one limiting belief run through ten patterns ([physical pain](/physical-pain)).

### Scandinavia Trip Wrap-Up + Discernment Horizon

- **[Trip recap](/timeoff-2026-07#how-it-actually-went)** - [Fjord leg became a Nærøyfjord cruise to Voss](https://github.com/idvorkin/idvorkin.github.io/commit/3f251b724); [Oslo shows what we did](https://github.com/idvorkin/idvorkin.github.io/commit/77d844f1b); role and review learnings [moved](https://github.com/idvorkin/idvorkin.github.io/commit/6e083cfd1) to [evergreen time off](/timeoff#get-real-what-should-i-do).
- **[Discernment horizon](/ai-native-vocab#discernment-horizon)** - [New glossary entry from Yegge](https://github.com/idvorkin/idvorkin.github.io/commit/2b5aa7009): past this point you cannot check whether an AI is right; paired with demand horizon.

### Content Quality Audit: Tier-3/Tier-4 Sweep

- **[Post openers](https://github.com/idvorkin/idvorkin.github.io/commit/8023274bf)** - [Garbled openers, unattributed quotes, duplicate paragraphs](https://github.com/idvorkin/idvorkin.github.io/commit/8023274bf) and misplaced AI labels fixed across twenty posts.
- **[Topic sweeps](https://github.com/idvorkin/idvorkin.github.io/commit/b76d2e280)** - [7 Habits](https://github.com/idvorkin/idvorkin.github.io/commit/b76d2e280), [health](https://github.com/idvorkin/idvorkin.github.io/commit/ae51190cb), [time-off journals](https://github.com/idvorkin/idvorkin.github.io/commit/b7f22ace4), [emotional and spiritual](https://github.com/idvorkin/idvorkin.github.io/commit/b997020c0) (orphan pages linked), [work and productivity](https://github.com/idvorkin/idvorkin.github.io/commit/81ee7794f).
- **[Follow-ups](https://github.com/idvorkin/idvorkin.github.io/commit/839e2cb52)** - [/vlc trimmed, pysrc doc comments cleaned](https://github.com/idvorkin/idvorkin.github.io/commit/839e2cb52), [7 Habits chapter headings promoted, link text fixes](https://github.com/idvorkin/idvorkin.github.io/commit/27601f1f9).

### Infrastructure & CI (2026-07-20)

- **[Changelog backfill](https://github.com/idvorkin/idvorkin.github.io/commit/1ca78f15c)** - [Weeks of 2026-06-01 and 2026-05-25 added](https://github.com/idvorkin/idvorkin.github.io/commit/1ca78f15c); Life and Health Notes added to 2026-06-29.

### Other Projects (2026-07-20)

**[yegge-field-map](https://idvorkin-ai-tools.github.io/yegge-field-map/)** ([dark field map](https://github.com/idvorkin-ai-tools/yegge-field-map))

- **[New field map](https://github.com/idvorkin-ai-tools/yegge-field-map/commit/dc1630990)** - [One page per Steve Yegge essay](https://github.com/idvorkin-ai-tools/yegge-field-map/commit/dc1630990), plus the Beads saga and The Future of Coding Agents.

**[guideway-field-map](https://idvorkin-ai-tools.github.io/guideway-field-map/)** ([dark field map](https://github.com/idvorkin-ai-tools/guideway-field-map))

- **[New field map](https://github.com/idvorkin-ai-tools/guideway-field-map/commit/6a2d1e726)** - [Fixed-guideway transport](https://github.com/idvorkin-ai-tools/guideway-field-map/commit/6a2d1e726) from gondolas to maglev.

**[arthur-brooks-field-map](https://idvorkin-ai-tools.github.io/arthur-brooks-field-map/)** ([dark explainer site](https://github.com/idvorkin-ai-tools/arthur-brooks-field-map))

- **[New field map](https://github.com/idvorkin-ai-tools/arthur-brooks-field-map/commit/3e4fd9996)** - [An explainer site on Arthur Brooks](https://github.com/idvorkin-ai-tools/arthur-brooks-field-map/commit/3e4fd9996) and his pleasure and enjoyment formula.

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** ([trip site](https://github.com/idvorkin-ai-tools/scandinavia-2026))

- **[More deep dives](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/73204eef6)** - [Overtourism, locals versus summer crowds per city](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/73204eef6), Amsterdam deep dives, colonial history and the Dutch Wars.

## Week of 2026-07-13

_9 commits this week_

### Pleasure vs Enjoyment: Brooks' Formula Threaded Through Three Posts

- **[Pleasure vs enjoyment, sourced](/build-life-you-want#pleasure-vs-enjoyment)** - [Pleasure slides toward compulsion](https://github.com/idvorkin/idvorkin.github.io/commit/2bae59602); enjoyment adds people and memory, with six levers and honest caveats.
- **[Upgrade consuming](/produce-consume#you-dont-have-to-quit-consuming--upgrade-it)** - [No need to quit guilty pleasures](https://github.com/idvorkin/idvorkin.github.io/commit/901e6078c); make them shared and remembered.
- **[/happy refactored](/happy)** - [Reordered into one arc](https://github.com/idvorkin/idvorkin.github.io/commit/0bdde53d8); [savoring practices](https://github.com/idvorkin/idvorkin.github.io/commit/16ed118ec) mapped onto [the three selves](/happy#the-three-of-you).
- **[Peak-end link](https://github.com/idvorkin/idvorkin.github.io/commit/fad8ae2d9)** - [Site-wide peak-end links](https://github.com/idvorkin/idvorkin.github.io/commit/fad8ae2d9) now point to /balance.

### Scandinavia Trip: Oslo Train Bender + Diet Learnings

- **[Reykjavík and Stockholm](/timeoff-2026-07#how-it-actually-went)** - [Ocean-fed pools](https://github.com/idvorkin/idvorkin.github.io/commit/704a95b18), a rainy dawn kettlebell session, Skansen's silversmith, and magic in a Stockholm church pew.
- **[Train to Oslo and habits](/maybe#the-second-phone)** - [The trip site built on the train](https://github.com/idvorkin/idvorkin.github.io/commit/85e1bb83c); a [phone habit](/habits#habit-model) that fires with the reward gone.
- **[Where to eat](/timeoff#where-to-eat)** - [Skip restaurants, book a kitchen](https://github.com/idvorkin/idvorkin.github.io/commit/0e0d3fd91) and cook plain grocery food.

### Isometrics and Tendon Health

- **[Isometrics](/physical-pain#isometrics-how-to-load-a-tendon-without-moving-the-joint)** - [How to load a tendon without moving the joint](https://github.com/idvorkin/idvorkin.github.io/commit/15651e441): overcoming versus yielding holds, Baar's protocol, and which parts are emerging science.

### Other Projects (2026-07-13)

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** ([trip site](https://github.com/idvorkin-ai-tools/scandinavia-2026))

- **[Atlas and rabbit holes](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/cfc8a37a5)** - [An atlas index](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/cfc8a37a5), Nordic culture rabbit holes, [performance histories, and a performer playbook](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/45ec2e7dd).
- **[Sins and parenting](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/09bbaf3a4)** - [Seven Deadly Sins mapped onto the Three Dragons](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/09bbaf3a4); [encouraging curiosity in a teenager](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/ae94185c7).
- **[Fjords expanded](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/3aa08c5dc)** - [Why fjords have waterfalls](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/3aa08c5dc), the seasonal peak, named falls, and fjords elsewhere.

## Week of 2026-07-06

_39 commits this week_

### Bad News. Maybe Not. (new post!)

- **[Bad News. Maybe Not.](/maybe) (new post!)** - [The Taoist farmer's maybe](https://github.com/idvorkin/idvorkin.github.io/commit/e355c3979), then five [turns in my life](/7h-concepts) I called [wrong](/eulogy), with a [raccoon-shrug header](https://github.com/idvorkin/idvorkin.github.io/commit/412e173a3).

### Time Off: Sacrifice Identity for Consumption (2026-07-06)

- **[Identity for consumption](/time-off)** - [One epigraph across three posts](https://github.com/idvorkin/idvorkin.github.io/commit/920b9f567): [vegetating feels like rest](/timeoff-2026-07) but [starves your roles](/produce-consume).
- **[Re-stack your roles](/time-off#re-stack-your-roles)** - [Roles sorted](https://github.com/idvorkin/idvorkin.github.io/commit/2cd756ee6) into non-negotiables, [frequently starved](/four-healths), and over-invested.
- **[Fridge meds and food](/time-off#appendix-traveling-with-tirzepatide-or-any-med-that-needs-a-fridge)** - [Appendix on traveling with tirzepatide](https://github.com/idvorkin/idvorkin.github.io/commit/c843d3c7b); [shop the grocery store](https://github.com/idvorkin/idvorkin.github.io/commit/d92867a94) over tourist restaurants.

### Scandinavia Trip Post (2026-07-06)

- **[Why I'm taking time off, ranked](/timeoff-2026-07#why-im-taking-this-time-off--ranked)** - [Expected, turns out, and didn't expect](https://github.com/idvorkin/idvorkin.github.io/commit/aa8aefbc1): the [screen habit](/timeoff-2026-07) dissolved and the [joy giver](/joy) came back.
- **[Roles and meditation](/timeoff#re-stack-your-roles)** - [Re-stacking the roles](https://github.com/idvorkin/idvorkin.github.io/commit/6ac955f60); old churches are the best rooms for sitting quietly.
- **[Itinerary additions](https://github.com/idvorkin/idvorkin.github.io/commit/8658558d4)** - [Marble Church in Copenhagen](https://github.com/idvorkin/idvorkin.github.io/commit/8658558d4), a [packing-list callout](https://github.com/idvorkin/idvorkin.github.io/commit/1a82bce2a), and a speed-of-light cross-link.

### My Packing Master List (new page!)

- **[My Packing Master List](/packing) (new page!)** - [A trip-agnostic checklist](https://github.com/idvorkin/idvorkin.github.io/commit/feb1c4d60) every trip is trimmed from, [split road trip versus airplane](https://github.com/idvorkin/idvorkin.github.io/commit/1dbe88d79).

### Life Journal: Speed of Light from Sweden (2026-07-06)

- **[Speed of light from Sweden](/life-journal#speed-of-light-from-sweden)** - [Latency to a Seattle box](https://github.com/idvorkin/idvorkin.github.io/commit/c649c5373), the physics floor in fiber, and why real cables cost double.

### Other Projects (2026-07-06)

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** ([trip site](https://github.com/idvorkin-ai-tools/scandinavia-2026))

- **[Field maps wired in](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/0788a2dba)** - [City deep dives](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/0788a2dba) plus Napoleonic Wars and cathodic protection, each linked from its city.
- **[War Context Pack](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/9759c20c6)** - [Viking Age through the Cold War](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/9759c20c6) as a chronological history pack.
- **[Marble Church](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/89bd6780c)** - [New deep-dive page](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/89bd6780c).

**[AI Safety — A Field Map](https://idvorkin-ai-tools.github.io/ai-safety-field-map/)** ([new explainer site](https://github.com/idvorkin-ai-tools/ai-safety-field-map))

- **[New field map](https://github.com/idvorkin-ai-tools/ai-safety-field-map/commit/530e09ac2)** - [AI alignment for engineers](https://github.com/idvorkin-ai-tools/ai-safety-field-map/commit/530e09ac2): approaches, evals, failure modes, interpretability and key papers.

**[blob](https://github.com/idvorkin/blob)** (image assets)

- **[Raccoon shrug](https://github.com/idvorkin/blob/commit/c5e238c46)** - [Header image](https://github.com/idvorkin/blob/commit/c5e238c46) for [/maybe](/maybe).

## Week of 2026-06-29

_18 commits this week_

### Trusts in Washington (new post!)

- **[Trusts in Washington](/trusts) (new post!)** - A [WA estate-planning guide](https://github.com/idvorkin/idvorkin.github.io/commit/4259c6d19), [linked from taxes](/taxes): living trust, credit shelter trust for no spousal portability, and QDOT for a non-citizen spouse ([intro](https://github.com/idvorkin/idvorkin.github.io/commit/9873e6fbf)).

### AI Training: Post-Training Methods Table

- **[Post-training table](/ai-training#post-training)** - [SFT, RLHF, DPO and RLVR compared](https://github.com/idvorkin/idvorkin.github.io/commit/a0f500ff3) on how each learns and who grades; RLAIF called out; [inference](/ai-inference) [cross-links](https://github.com/idvorkin/idvorkin.github.io/commit/5e4118568).

### Time Off: Arthur Brooks' 9 Vacation Rules

- **[Brooks' vacation rules](/timeoff#appendix-9-rules-for-a-happier-vacation-arthur-brooks)** - [Know your motive](https://github.com/idvorkin/idvorkin.github.io/commit/612026656), savor anticipation, take shorter trips, fewer photos, no posting, no work, come home early.
- **[Trip guide link](/timeoff-2026-07)** - The July trip page links the [city-by-city trip guide site](https://github.com/idvorkin/idvorkin.github.io/commit/664352f8a).

### Life & Health Notes (2026-06-29)

- **[Happy Fluff](/life-journal#happy-fluff)** - [A café tub of cotton candy](https://github.com/idvorkin/idvorkin.github.io/commit/90a696255) as [the goal in life](/eulogy).
- **[Faster recovery](/timeoff#vegetation)** - Draining work stress into real rest [now takes about a day](https://github.com/idvorkin/idvorkin.github.io/commit/42f6af25f).
- **[A thousand wishes](/four-healths)** - [New aphorism on health](https://github.com/idvorkin/idvorkin.github.io/commit/46cc4d30a) in the Physical Health section.

### Other Projects (2026-06-29)

- **[ai-policy](https://github.com/idvorkin/idvorkin.github.io/commit/d3ffb4a0f)** - AI content label [raised to 80%](https://github.com/idvorkin/idvorkin.github.io/commit/d3ffb4a0f).
- **[quack-track](https://github.com/idvorkin-ai-tools/quack-track)** - [New repo stub](https://github.com/idvorkin-ai-tools/quack-track/commit/7952b0809).

## Week of 2026-06-22

_7 commits this week_

### AI Journal: Yegge's Flat Curve Society

- **[Yegge's Flat Curve Society](/ai-journal#2026-06-22)** - [Capability keeps climbing](https://github.com/idvorkin/idvorkin.github.io/commit/817e14b91), but we each hit a demand horizon and a [discernment horizon](/ai-journal#when-ai-shows-its-work-verification-as-trust); AI literacy is measurable in tokens per day.

### AI Operator: You Review More Than You Make

- **[You review more than you make](/ai-operator#you-review-more-than-you-make)** - [Reacting to a draft costs far less](https://github.com/idvorkin/idvorkin.github.io/commit/1ed270b70) than generating one, so hand AI the slog and spend attention on review.

### Addiction: Monoculture Trap

- **[Monoculture trap](/addiction#dont-narrow-to-one-passion-the-monoculture-trap)** - One passion crowding out the rest is fragile; [keep a portfolio of passions alive](https://github.com/idvorkin/idvorkin.github.io/commit/d090befd7) so one breaking doesn't sink you.

### AI Security: Field-Map Explainers

- **[Field-map explainers](/ai-security)** - [A top alert](https://github.com/idvorkin/idvorkin.github.io/commit/c67946120) links the AI Red-Teaming ramp-up and AI Safety field map sites.

### Other Projects (2026-06-22)

**[red-teaming-ramp-up](https://idvorkin-ai-tools.github.io/red-teaming-ramp-up/)** ([AI red-teaming explainer site](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up))

- **[OWASP LLM Top 10 and tools](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/08d4f0327)** - [Per-risk pages](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/08d4f0327), plus red-teaming tools and benchmarks like Garak, PyRIT and HarmBench.
- **[Canon papers](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/029865630)** - [Per-paper explainers](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/029865630) for GCG, AutoDAN, PAIR, TAP, Crescendo, many-shot jailbreak and PAP.
- **[Scaling laws](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/05bbb4a7b)** - [Kaplan and Chinchilla](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/05bbb4a7b), compute-optimal ratio, emergence and inverse scaling.

**New and smaller**

- **[ai-safety-field-map](https://idvorkin-ai-tools.github.io/ai-safety-field-map/)** (new) - The [safety-side](https://github.com/idvorkin-ai-tools/ai-safety-field-map) [companion field map](https://github.com/idvorkin-ai-tools/ai-safety-field-map/commit/e55416ba9).
- **[scandinavia-2026](https://github.com/idvorkin-ai-tools/scandinavia-2026)** (new) - [City-by-city guide](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/e55416ba9) for the family's summer Scandinavian tour.

## Week of 2026-06-15

_19 blog commits + 20 Settings fixes this week_

### Why Gas City (new post!)

- **[Why Gas City](/why-gas-city) (new post!)** - [Gas City isn't a smarter agent](https://github.com/idvorkin/idvorkin.github.io/commit/5432106e1); it [makes work durable so many agents can pick it up, run it and hand it off](https://github.com/idvorkin/idvorkin.github.io/commit/b0b24e3cb).

### Gas City: Controller Loop + Runtime Providers

- **[Controller loop and runtime providers](/gas-city)** - [The controller converges desired and actual state](https://github.com/idvorkin/idvorkin.github.io/commit/db4f8d310); providers name the substrate agents run on; plus a [DeepWiki link](https://github.com/idvorkin/idvorkin.github.io/commit/b10487475).

### AI-Native Vocab: Reverse Centaur

- **[Reverse centaur](/ai-native-vocab)** - [New entry](https://github.com/idvorkin/idvorkin.github.io/commit/a8e403033): the [AI is the head](/ai-native-vocab#reverse-centaur) and the human becomes its body, [working at the machine's pace](https://github.com/idvorkin/idvorkin.github.io/commit/5cd66c062).

### AI Journal: API Key Leak Forensics

- **[API key leak forensics](/ai-journal#2026-06-13)** - A live API key sat in a public repo for a year; an agent [proved it live](https://github.com/idvorkin/idvorkin.github.io/commit/076ce4330), mapped the blast radius, confirmed revocation.

### Infrastructure & CI (2026-06-15)

- **[Faster backlinks rebuild](https://github.com/idvorkin/idvorkin.github.io/commit/a390aca0f)** - update-backlinks [depends on jekyll-build](https://github.com/idvorkin/idvorkin.github.io/commit/22f5a4f51) and [runs one command](https://github.com/idvorkin/idvorkin.github.io/commit/02b099c98).
- **[AI journal formulas](https://github.com/idvorkin/idvorkin.github.io/commit/5a3b600a6)** - [Gas City formulas](https://github.com/idvorkin/idvorkin.github.io/commit/5a3b600a6) to [write](https://github.com/idvorkin/idvorkin.github.io/commit/841df28a5) and [revise entries](https://github.com/idvorkin/idvorkin.github.io/commit/1f9144b74); [revise checks every PR review thread is addressed](https://github.com/idvorkin/idvorkin.github.io/commit/2ee054976) before closing.
- **[Shared backlinks formula](https://github.com/idvorkin/idvorkin.github.io/commit/9b7c008a2)** - The backlinks rebuild [became a reusable expansion formula](https://github.com/idvorkin/idvorkin.github.io/commit/9b7c008a2).

### Other Projects (2026-06-15)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[Secret redaction](https://github.com/idvorkin/Settings/commit/fd4145142)** - [chop-log env dumps](https://github.com/idvorkin/Settings/commit/fd4145142) [now redact API keys](https://github.com/idvorkin/Settings/commit/1aade5bf3).
- **[y and a launchers](https://github.com/idvorkin/Settings/commit/5f64fc1b1)** - launchctl [start](https://github.com/idvorkin/Settings/commit/f28cefdd4), [stop, reset](https://github.com/idvorkin/Settings/commit/5f64fc1b1) and cycle fixed; [clean Alfred JSON](https://github.com/idvorkin/Settings/commit/e13b54306); [w4 opens workspace 4](https://github.com/idvorkin/Settings/commit/9540030ed).
- **[Script fixes](https://github.com/idvorkin/Settings/commit/8c05a21bd)** - [agent-continue on macOS](https://github.com/idvorkin/Settings/commit/8c05a21bd), [amazon2monarch](https://github.com/idvorkin/Settings/commit/b110d4c95), [gmail_reader](https://github.com/idvorkin/Settings/commit/b5f1f4c45), [brew_check](https://github.com/idvorkin/Settings/commit/a2c178c56), [tmux_helper](https://github.com/idvorkin/Settings/commit/50a53ba64), [vim_python](https://github.com/idvorkin/Settings/commit/488066790) and [install_packages](https://github.com/idvorkin/Settings/commit/ed25b0a84).

## Week of 2026-06-08

_31 commits this week_

### AI Training & Inference (new posts!)

- **[AI training rework](/ai-training)** - [Reframed as engineering, science and alchemy](https://github.com/idvorkin/idvorkin.github.io/commit/55da0620a) along [pre-training](https://github.com/idvorkin/idvorkin.github.io/commit/2ab4c0821), post-training and deployment, with RLVR, [evals](https://github.com/idvorkin/idvorkin.github.io/commit/4964fdfe1) and a [post-training lineage](https://github.com/idvorkin/idvorkin.github.io/commit/59f8e1ed8).
- **[AI Inference](/ai-inference) (new post!)** - [Serving tokens cheaply](https://github.com/idvorkin/idvorkin.github.io/commit/55da0620a): prefill versus decode, KV cache, quantization, MoE, speculative decoding, batching; pick GPUs by memory bandwidth.

### Gas City First Rig (new post!)

- **[Gas City First Rig](/gas-city-rig) (new post!)** - [The agent narrates](https://github.com/idvorkin/idvorkin.github.io/commit/8cb5efdd8) the first Gas City weekend: building gc, the mental model, and the first automated blog formula.

### Gas City: Scale Up/Out + Getting Started

- **[Scale up versus out](/gas-city)** - [Better tools versus many coordinating agents](https://github.com/idvorkin/idvorkin.github.io/commit/4e31d726c), plus a getting-started section on crews, pools, vapor wisps and mail as beads.

### AI-Native: Onboarding, Vocab, and Optimism

- **[Your First 90 Days](/ai-native-onboarding) (new post!)** - [You onboard yourself and your agents together](https://github.com/idvorkin/idvorkin.github.io/commit/ebaee7782); capture your confusion before it fades.
- **[Year of Wonder and DHH](/ai-native-vocab)** - [The optimist twin](https://github.com/idvorkin/idvorkin.github.io/commit/0d3344e48) of the Year of Chaos, [vocab gets its own page](https://github.com/idvorkin/idvorkin.github.io/commit/f28e7aa7f); [banning AI-assisted contributions](https://github.com/idvorkin/idvorkin.github.io/commit/9bd493a0f) is [gatekeeping](/ai-optimism).

### Life: Decline and Psychic Weight

- **[Decline and stuff](/42)** - [Decline is real](/42#decline---the-self-fulfilling-prophecy) but [its rate is negotiable](https://github.com/idvorkin/idvorkin.github.io/commit/bff8bd48b); [clutter](/psychic-weight) [is a pile of unmade decisions](/psychic-weight#the-psychic-weight-of-stuff), so [leave lighter hands](https://github.com/idvorkin/idvorkin.github.io/commit/64c7be166).

### Infrastructure & CI (2026-06-08)

- **[Gas City blog integration](https://github.com/idvorkin/idvorkin.github.io/commit/888284558)** - A [blog-backlinks pack](https://github.com/idvorkin/idvorkin.github.io/commit/888284558) with [formula](https://github.com/idvorkin/idvorkin.github.io/commit/1f5c33a43) and agent; [PR base and work_dir fixed](https://github.com/idvorkin/idvorkin.github.io/commit/ee4848499).
- **[Build fixes](https://github.com/idvorkin/idvorkin.github.io/commit/0a2fe0929)** - [CI on Ruby 3.2](https://github.com/idvorkin/idvorkin.github.io/commit/0a2fe0929); [jekyll-serve picks a free port](https://github.com/idvorkin/idvorkin.github.io/commit/702cc0cef); [CLAUDE.md rules](https://github.com/idvorkin/idvorkin.github.io/commit/26e3ff05b); [typos hook fix](https://github.com/idvorkin/idvorkin.github.io/commit/38b22cf1f); [raccoon preview images for AI posts](https://github.com/idvorkin/idvorkin.github.io/commit/f48f2f1e7).

### chop-conventions (2026-06-08)

- **[Metal AI twin recipe](https://github.com/idvorkin/chop-conventions/commit/723b1f70e)** - [gen-image docs cover the chrome raccoon twin](https://github.com/idvorkin/chop-conventions/commit/723b1f70e), anchored on a reference image.

### Other Projects (2026-06-08)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[running-servers and shell](https://github.com/idvorkin/Settings/commit/f915e5be7)** - [run starts servers on a free port](https://github.com/idvorkin/Settings/commit/f915e5be7), [check reports port conflicts](https://github.com/idvorkin/Settings/commit/6dc42181e); [gc unaliased](https://github.com/idvorkin/Settings/commit/2a3069bf0); [Alfred snippets synced](https://github.com/idvorkin/Settings/commit/4a8e804a0).

**[gascity](https://github.com/idvorkin-ai-tools/gascity)** (Gas City platform, upstream)

- **[Upstream week](https://github.com/idvorkin-ai-tools/gascity/commit/d3073929b)** - [Groq](https://github.com/idvorkin-ai-tools/gascity/commit/d3073929b) and [Cerebras presets](https://github.com/idvorkin-ai-tools/gascity/commit/8a560161e), an [Agent Comms panel](https://github.com/idvorkin-ai-tools/gascity/commit/98c32ee63), dependency-cycle detection, reconciler and supervisor fixes.

## Week of 2026-06-01

_33 commits this week_

### The Dark Factory (new post!)

- **[The Dark Factory](/dark-factory) (new post!)** - A [dark codebase](https://github.com/idvorkin/idvorkin.github.io/commit/66702a2d4) [ships with no human in the loop](https://github.com/idvorkin/idvorkin.github.io/commit/1568f13a1), [limited by verification, progress through complexity, and cost](https://github.com/idvorkin/idvorkin.github.io/commit/d2e44ec66).

### Made to Stick (new post!)

- **[Made to Stick](/made-to-stick) (new post!)** - [Book notes](https://github.com/idvorkin/idvorkin.github.io/commit/c48bdad77): [sticky ideas are Simple, Unexpected, Concrete, Credible, Emotional Stories](https://github.com/idvorkin/idvorkin.github.io/commit/98894d497), and the villain is the Curse of Knowledge.

### AI Journal: Friction = Focus

- **[Friction = Focus](/ai-journal#2026-05-31)** - [Cheap production](https://github.com/idvorkin/idvorkin.github.io/commit/a25db3856) [collapses into consumption](/produce-consume); [designed-in friction](/gas-city), [mastery](https://github.com/idvorkin/idvorkin.github.io/commit/6a6eefd73) and [essentialism](/mortality-software) keep it worth something.

### Scandinavian Whirlwind Tour (new page!)

- **[Scandinavian Whirlwind Tour](/timeoff-2026-07) (new page!)** - [The July family trip](https://github.com/idvorkin/idvorkin.github.io/commit/37ec9d84a) from Reykjavík to Amsterdam, with [goals](/y26) from the eulogy, [per-leg activities](https://github.com/idvorkin/idvorkin.github.io/commit/198db473e) and a [route map](https://github.com/idvorkin/idvorkin.github.io/commit/6be4a07a5).

### Meta: Moving to the AI Lab

- **[/meta](/meta#moving-to-metas-ai-lab-2026)** - [Renamed from Facebook](https://github.com/idvorkin/idvorkin.github.io/commit/da3d3ffa0), with a [new AI Lab section](https://github.com/idvorkin/idvorkin.github.io/commit/2158a1628).

### Content Tweaks (2026-06-01)

- **Small edits** - [Gap-year](/gap-year) dragons [match the Three Dragons](https://github.com/idvorkin/idvorkin.github.io/commit/4df02023c); [y2026](/y2026) [sections](https://github.com/idvorkin/idvorkin.github.io/commit/a166ec412) [reshuffled](https://github.com/idvorkin/idvorkin.github.io/commit/a6a6ef021); a [produce-consume](/produce-consume) [summary link](https://github.com/idvorkin/idvorkin.github.io/commit/409d0a663); a [Gas City](/gas-city) [aside](https://github.com/idvorkin/idvorkin.github.io/commit/31d7d92ad); [podcast](/podcast) [cover art](https://github.com/idvorkin/idvorkin.github.io/commit/c0d29a526).

### Infrastructure & CI (2026-06-01)

- **[Topics index](https://github.com/idvorkin/idvorkin.github.io/commit/574b16ec6)** - A [regenerable](https://github.com/idvorkin/idvorkin.github.io/commit/6ae52e890) [topics.json](https://github.com/idvorkin/idvorkin.github.io/commit/7a902df4e) of tags, related posts, clusters and [missing cross-links](https://github.com/idvorkin/idvorkin.github.io/commit/2e19ebae5), from [embeddings](https://github.com/idvorkin/idvorkin.github.io/commit/339e6be64) plus [per-post LLM tagging](https://github.com/idvorkin/idvorkin.github.io/commit/574b16ec6).
- **[Ruby compat shim](https://github.com/idvorkin/idvorkin.github.io/commit/20e6dd37e)** - [Now loaded in jekyll-rebuild and worktree-init](https://github.com/idvorkin/idvorkin.github.io/commit/20e6dd37e).

### chop-conventions (2026-06-01)

- **[gen-image](https://github.com/idvorkin/chop-conventions/commit/5af4a7a29)** - [A fast flag picks Flash or Pro Gemini](https://github.com/idvorkin/chop-conventions/commit/5af4a7a29); [Recraft is now the only background-removal path](https://github.com/idvorkin/chop-conventions/commit/182604d0c).

### Other Projects (2026-06-01)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit + location exporter)

- **[Tabs and Roles](https://github.com/idvorkin/context-grabber/commit/54861c5c1)** - [Body, Move, Mind, Places and Roles tabs](https://github.com/idvorkin/context-grabber/commit/54861c5c1); [role tagging](https://github.com/idvorkin/context-grabber/commit/84e094326), [role-journal links](https://github.com/idvorkin/context-grabber/commit/be2359f74), a eulogy-song player, [CloudKit sync](https://github.com/idvorkin/context-grabber/commit/37f96e443).
- **[Places map](https://github.com/idvorkin/context-grabber/commit/4cb864100)** - [Real Apple Maps tiles](https://github.com/idvorkin/context-grabber/commit/4cb864100), [today's pins with a current marker](https://github.com/idvorkin/context-grabber/commit/dc781bb55), and a copy button.
- **[JTBD v2.2 spec](https://github.com/idvorkin/context-grabber/commit/ad23e0304)** - [Updated jobs-to-be-done spec](https://github.com/idvorkin/context-grabber/commit/ad23e0304).

## Week of 2026-05-25

_6 commits this week_

### y2026: June Check-In

- **[Mid-year physical-health check](/y2026#physical-health)** - [Weight drifting up](https://github.com/idvorkin/idvorkin.github.io/commit/648c3b828) against the goal; [5am wake holds](https://github.com/idvorkin/idvorkin.github.io/commit/32115d2aa); [swings and TGU recovering](https://github.com/idvorkin/idvorkin.github.io/commit/294a22893); chinups paused and half-lotus regressing.

### Produce/Consume: The Production Trap

- **[The production trap](/produce-consume#the-production-trap)** - [Shipping can become its own addiction](https://github.com/idvorkin/idvorkin.github.io/commit/dde4a024f); the five-signal [addiction test](/addiction) [adapted for production](https://github.com/idvorkin/idvorkin.github.io/commit/e0f6610ae), and producers versus consumers [reframed as a different game](https://github.com/idvorkin/idvorkin.github.io/commit/f37bf85b1).

### Other Projects (2026-05-25)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit + location exporter)

- **[Mac Catalyst](https://github.com/idvorkin/context-grabber/commit/16a8f7088)** - [Builds and runs its dashboard on macOS](https://github.com/idvorkin/context-grabber/commit/16a8f7088) without HealthKit; [fixed the iOS linker regression](https://github.com/idvorkin/context-grabber/commit/0fa352795) it caused.

## Week of 2026-05-18

_27 commits this week_

### What I Love About AI (new post!)

- **[What I Love About AI](/ai-optimism) (new post!)** - AI [lowers the entry tax](https://github.com/idvorkin/idvorkin.github.io/commit/26871ddde) on specific human visions, so it [multiplies distinct stories](https://github.com/idvorkin/idvorkin.github.io/commit/fa7d2052c) instead of averaging everything into beige.

### Parenting Books: Emotional Lives + Untangled Rewrite

- **[The Emotional Lives of Teenagers](/emotional-lives) (new post!)** - [Damour's notes](https://github.com/idvorkin/idvorkin.github.io/commit/682976fd3): mental health is the right feelings at the right time, managed well; five chapter treatments.
- **[Untangled rewrite](/untangled)** - [Terse headlines](https://github.com/idvorkin/idvorkin.github.io/commit/612e2d2ff), seven developmental strands each with when to worry.

### Hyper-Personal: Bezos to Agent-to-Agent

- **[New intro](/hyper-personal)** - [Bezos-level personal staff was gated by cost](https://github.com/idvorkin/idvorkin.github.io/commit/bc1b9ac7d); AI drops the price and adds biometric dimensions no staff had.
- **[New sections and cover](https://github.com/idvorkin/idvorkin.github.io/commit/11413195f)** - Five stages of ML ranking; [author and reader agents negotiate explanations](https://github.com/idvorkin/idvorkin.github.io/commit/11413195f) with a fidelity check; [a butler raccoon cover](https://github.com/idvorkin/idvorkin.github.io/commit/1cba1b24a).

### Igor's Podcast Launch

- **[Podcast page](/podcast)** - AI-voiced audio of my essays with chapter markers, [an RSS feed](https://github.com/idvorkin/idvorkin.github.io/commit/3c2dbed1a) and [cover art](https://github.com/idvorkin/idvorkin.github.io/commit/46dc6d76c).
- **[Voice catalog](/hill-climbing#soprano-tune-a-voice-prompt-with-a-model-as-judge)** - [Audition Gemini TTS voices](https://github.com/idvorkin/idvorkin.github.io/commit/730573f42) on /podcast; a model-as-judge loop tunes a voice prompt.

### Raccoon System: 7H Marathon + Choice-Sheet Pattern

- **[7 Habits raccoons](/raccoon-history#the-7-habits-marathon-may-2026)** - Each chapter post [gets a hero raccoon](https://github.com/idvorkin/idvorkin.github.io/commit/6f088798d), picked from a click-to-pick sheet; lessons on reference images and background removal; [/image-selector](/image-selector) [page](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961).

### AI Journal: Options Over Answers

- **[Options over answers](/ai-journal#2026-05-11)** - For judgment calls of taste, AI should [widen the option space](https://github.com/idvorkin/idvorkin.github.io/commit/422a97de9) with side-by-side choices, not pick one.

### Infrastructure & CI (2026-05-18)

- **[Backlinks rebuild](https://github.com/idvorkin/idvorkin.github.io/commit/512f755c7)** - [Refreshed](https://github.com/idvorkin/idvorkin.github.io/commit/512f755c7) after the week's new posts.

### Other Projects (2026-05-18)

**[idvorkin-ai-tools/podcast](https://github.com/idvorkin-ai-tools/podcast)** (new repo, podcast feed)

- **[First episodes](https://github.com/idvorkin-ai-tools/podcast/commit/e75080e7a)** - [The 7 Habits narrated](https://github.com/idvorkin-ai-tools/podcast/commit/e75080e7a); then [my eulogy, the eulogy as a song, and my daily affirmations](https://github.com/idvorkin-ai-tools/podcast/commit/41353158e).

**[idvorkin/blob](https://github.com/idvorkin/blob)** (image and audio assets)

- **[Podcast and hyper-personal assets](https://github.com/idvorkin/blob/commit/710f91774)** - [Cover art, butler raccoon, episode audio](https://github.com/idvorkin/blob/commit/710f91774) and chapter markers.

## Week of 2026-05-11

_38 commits this week_

### 7 Habits: Full Chapter Augmentation

- **[Core concepts](/7h-c0)** - [Stubs become prose](https://github.com/idvorkin/idvorkin.github.io/commit/62430e8c3): inside out, character versus personality ethic, P/PC balance, the maturity continuum, and [borrowed strength](https://github.com/idvorkin/idvorkin.github.io/commit/2799be845).
- **[Habits 1 and 2](/be-proactive)** - Frankl's gap, [the four endowments, Circle of Influence, Have's vs Be's](https://github.com/idvorkin/idvorkin.github.io/commit/3fb17ede6); [created twice](/end-in-mind), [wrong jungle, false centers](https://github.com/idvorkin/idvorkin.github.io/commit/27f18d3be).
- **[Habits 3 to 5](/first-things-first)** - [Four generations of time management](https://github.com/idvorkin/idvorkin.github.io/commit/9f72b217d), the six [Win/Win](/win-win) [paradigms](https://github.com/idvorkin/idvorkin.github.io/commit/58698d41d), and [five levels](https://github.com/idvorkin/idvorkin.github.io/commit/ab58f8cf3) of [listening](/first-understand).
- **[Habits 6 and 7](/synergize)** - Synergy rewritten with the third alternative and force-field analysis; [four renewal dimensions](/sharpen-the-saw) with [sleep](/7h-c7) [as the goose](https://github.com/idvorkin/idvorkin.github.io/commit/10d33258b).

### AI Journal: Tokens and the Wrong Jungle

- **[Free doesn't save you from the wrong problem](/ai-journal#2026-05-10)** - [Hill climbing improves your spot on the wrong mountain](https://github.com/idvorkin/idvorkin.github.io/commit/d1bf53e35); a paid background remover beat the tuned local pipeline.
- **[Dylan Patel on AI tokens](https://github.com/idvorkin/idvorkin.github.io/commit/953df7afb)** - [Notes on token supply and demand](https://github.com/idvorkin/idvorkin.github.io/commit/953df7afb): enterprise contracts and rate limits are the new bottleneck.

### Amelia Connection Framework (new page!)

- **[Amelia](/amelia) (new page!)** - [The four affirmations mapped onto fathering a daughter](https://github.com/idvorkin/idvorkin.github.io/commit/92fada642), [linked](https://github.com/idvorkin/idvorkin.github.io/commit/ade981a9a) from [the eulogy](/eulogy#father-to-amelia---an-incredible-girl).

### Addiction: Raccoon Illustrations

- **[Raccoons](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)** - [Addiction-versus-passion diptych inline](https://github.com/idvorkin/idvorkin.github.io/commit/33acde40a), plus [a cover image](https://github.com/idvorkin/idvorkin.github.io/commit/24362a8af).

### Infrastructure & CI (2026-05-11)

- **[Backlinks and fixes](https://github.com/idvorkin/idvorkin.github.io/commit/498dc5be1)** - [Backlinks rebuilt](https://github.com/idvorkin/idvorkin.github.io/commit/498dc5be1), [/changelog excluded as a source, encoding fixed](https://github.com/idvorkin/idvorkin.github.io/commit/212f04769); [/image-selector page](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961); [duplicate /amelia heading id fixed](https://github.com/idvorkin/idvorkin.github.io/commit/b70b4ad8d).

### chop-conventions (2026-05-11)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **[Recraft background remover](https://github.com/idvorkin/chop-conventions/commit/508ee894a)** - gen-image gets [an opt-in Recraft remover](https://github.com/idvorkin/chop-conventions/commit/508ee894a), [rewritten as a WebP-aware Python CLI](https://github.com/idvorkin/chop-conventions/commit/7befb9f1d).

### Other Projects (2026-05-11)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app)

- **[CloudKit journal](https://github.com/idvorkin/context-grabber/commit/3193ef6bb)** - [Sync](https://github.com/idvorkin/context-grabber/commit/3193ef6bb), [journal model](https://github.com/idvorkin/context-grabber/commit/b328209b3), voice recording and [playback](https://github.com/idvorkin/context-grabber/commit/12e6f3464), [a Reflect screen](https://github.com/idvorkin/context-grabber/commit/6e5de74fd) and [widget strip](https://github.com/idvorkin/context-grabber/commit/2e4fd9f30), and [Copy error buttons](https://github.com/idvorkin/context-grabber/commit/1c819cb98).

**New and smaller**

- **[beads](https://github.com/idvorkin-ai-tools/beads)** - [Deduplicate issues with several blockers](https://github.com/idvorkin-ai-tools/beads/commit/7e3c7fbbe); [init errors suggest --reinit-local](https://github.com/idvorkin-ai-tools/beads/commit/4a25937df).
- **[blob](https://github.com/idvorkin/blob)** - [7 Habits chapter illustrations plus addiction cover and diptych](https://github.com/idvorkin/blob/commit/e60974726).

## Week of 2026-05-04

_~50 commits this week_

### The Psychology of Vibing (new post!)

- **[The Psychology of Vibing](/vibing) (new post!)** - [What long AI-agent sessions feel like](https://github.com/idvorkin/idvorkin.github.io/commit/de3387ac8): creation collapsing to one step, multi-agent flow, [addiction](/addiction), burnout and voice fatigue.

### Gas City Cluster: Wally, Standing Up, and the Explainer (new posts!)

- **[Wally](/wally)** - [Renamed from /work-gastown](https://github.com/idvorkin/idvorkin.github.io/commit/d0b36d600) with a new intro mapping Gas Town roles onto an org chart.
- **[Standing Up Gas City](/gas-city-home) (new post!)** - [Larry narrates bringing up a home city](https://github.com/idvorkin/idvorkin.github.io/commit/681004d16): five upstream bugs; scaffold first, trust the runtime over the doctor.
- **[Gas City explainer](/gas-city) (new post!)** - [Beads](https://github.com/idvorkin/idvorkin.github.io/commit/f70f98909), [molecules](https://github.com/idvorkin/idvorkin.github.io/commit/09bca7d91) and the propulsion principle: work on your hook runs.

### Igor's Claws: Business Logic / Goop / Infra

- **[Business logic, goop, infra](/igors-claws#challenges-business-logic-goop-infra)** - [Building claws is mostly goop](https://github.com/idvorkin/idvorkin.github.io/commit/faa9c2e8b), [integrations with a short half-life](/design), though [claws are starting to write it themselves](https://github.com/idvorkin/idvorkin.github.io/commit/509ae0e86).

### Life Journal: Walking with Alex Under the Trees

- **[Walking with Alex](/life-journal#2026-05-02)** - [A Saturday walk under the trees](https://github.com/idvorkin/idvorkin.github.io/commit/4853f08f5), kept for the feeling rather than the facts.

### Infrastructure & CI (2026-05-04)

- **[Backlinks rule](https://github.com/idvorkin/idvorkin.github.io/commit/656c9a645)** - PRs that add, rename or remove a permalink [rebuild back-links.json in the same PR](https://github.com/idvorkin/idvorkin.github.io/commit/656c9a645).
- **[worktree-init fix](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)** - [Slashes in branch names no longer silently break](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df) the background build.

### Other Projects (2026-05-04)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app)

- **[Workout analysis](https://github.com/idvorkin/context-grabber/commit/a85c07e13)** - [Tap a workout to see sets and reps](https://github.com/idvorkin/context-grabber/commit/a85c07e13) inferred from heart rate; [raw HR export](https://github.com/idvorkin/context-grabber/commit/9f84c1244).
- **[Launch and refresh](https://github.com/idvorkin/context-grabber/commit/f318e9460)** - [Tiles never blank on cold start](https://github.com/idvorkin/context-grabber/commit/f318e9460); [refresh shows elapsed time and phase](https://github.com/idvorkin/context-grabber/commit/81434c436).

**[blob](https://github.com/idvorkin/blob)** (image assets)

- **[Life-journal image](https://github.com/idvorkin/blob/commit/fbeacc772)** - [Walking with Alex](https://github.com/idvorkin/blob/commit/fbeacc772).

## Week of 2026-04-27

_31 commits this week_

### Wally and My Work Gastown (new post!)

- **[Wally and My Work Gastown](/work-gastown) (new post!)** - [Gas Town roles mapped to an org chart](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8): the human is M2, the orchestrator M1, ephemeral workers a separate tier.
- **[When to skip the M1](/work-gastown#when-to-use-the-m1-and-when-to-skip-him)** - [Wide work goes through the orchestrator](/work-gastown#the-third-tier-yegges-model-misses), [deep precision work goes direct](https://github.com/idvorkin/idvorkin.github.io/commit/4b054d7a1), and [the human should stop doing M1's job](/work-gastown#why-the-human-is-m2-not-the-mayor).

### The Psychology of Vibing (new post!)

- **[The Psychology of Vibing](/vibing) (new post!)** - [Long AI sessions](https://github.com/idvorkin/idvorkin.github.io/commit/14600aa77) [merge imagining with creating](/vibing#imagining-and-creating-collapse-into-one-step), [use extra agents to cover stalls](/vibing#why-multi-agent-covering-for-stalls), [erase rest between contexts](/vibing#no-more-gaps-between-contexts), and [risk](https://github.com/idvorkin/idvorkin.github.io/commit/3b5985c30) [burnout](/vibing#burnout).

### Addiction: Trichotomy Upgrade

- **[Addiction, passion, hobby](/addiction)** - [The two-way split becomes three](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8): [compelled and harmful, compelled but positive, or freely chosen](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction); plus [a 20-minute in-the-moment check](/addiction#in-the-moment-the-20-minute-opportunity-cost-check).
- **[Hobby defined](/hobby)** - [A hobby is something you can put down](https://github.com/idvorkin/idvorkin.github.io/commit/e1b5b6441) without feeling pulled back.

### AI Cockpit: The Mic Matters

- **[The mic matters](/ai-cockpit#the-mic-matters-more-than-i-thought)** - [Dictation quality is limited by the microphone](https://github.com/idvorkin/idvorkin.github.io/commit/340058752), not the model; a wireless lavalier brings Siri close to Wispr Flow.

### Infrastructure & CI (2026-04-27)

- **[worktree-init](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)** - [A just target builds the site in the background](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df) for fresh worktrees so the anchor checker passes.
- **[Changelog build fix](https://github.com/idvorkin/idvorkin.github.io/commit/bf1fc20d7)** - [An orphan Liquid comment tag no longer breaks the build](https://github.com/idvorkin/idvorkin.github.io/commit/bf1fc20d7).

### Other Projects (2026-04-27)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data app)

- **[Fresher data](https://github.com/idvorkin/context-grabber/commit/ae0c1d0c4)** - [Re-grabs on returning to the foreground](https://github.com/idvorkin/context-grabber/commit/ae0c1d0c4); GPS asks for a precise fix; box plots label min and max.

## Week of 2026-04-20

_24 blog commits this week_

### Taxes: Split from /money (new post!)

- **[Taxes](/taxes) (new post!)** - [Tax content moves](https://github.com/idvorkin/idvorkin.github.io/commit/35025061a) out of [/money](/money): capital gains, WA state rules, IRAs, Roth, step-up in basis, QSBS.
- **[Tax tables](/taxes#standard-deduction--0-ltcg)** - WA capital gains [updated to 2026 law](https://github.com/idvorkin/idvorkin.github.io/commit/9c6609dcd), a [retiree zero-LTCG scenario](https://github.com/idvorkin/idvorkin.github.io/commit/a6b5a5d45), and a [working-years benchmark table](https://github.com/idvorkin/idvorkin.github.io/commit/95a362b17).

### Igor's Three Claws (new post!)

- **[Igor's Three Claws](/igors-claws) (new post!)** - [The roster](https://github.com/idvorkin/idvorkin.github.io/commit/3a139741f) behind the [claw theory](/claw): [Larry](/larry) for life, Wally for work, Tony for transportation.

### Larry: From Life Coach to Chief of Staff

- **[Chief of staff](/larry#what-its-like-using-larry-my-chief-of-staff)** - [Dictate from anywhere](https://github.com/idvorkin/idvorkin.github.io/commit/8ee1d2cef); Larry runs background agents on the dev VM and sends back PR links.

### AI Journal: One Repo, One Token

- **[One repo, one token](/ai-journal#one-repo-one-token-the-closest-you-can-get-to-write-only-on-github)** - GitHub PATs can't be write-only, so [scope a read-write token to one throwaway repo](https://github.com/idvorkin/idvorkin.github.io/commit/eb4252f94) and keep it out of argv and logs.

### AI Operator: One-Way vs Two-Way Doors

- **[One-way vs two-way doors](/ai-operator#you-need-to-get-on-the-loop)** - Reversible work gets [on-the-loop supervision](https://github.com/idvorkin/idvorkin.github.io/commit/8518fc772); irreversible work gets every line read before it runs.

### Life Journal: Balloons on the Hood Canal Trail

- **[Balloons on the trail](/life-journal#balloons-on-the-hood-canal-trails)** - Spring break at Hood Canal, [handing balloon dogs](https://github.com/idvorkin/idvorkin.github.io/commit/94004ed7f) to grumpy kids lagging behind their parents.

### Infrastructure & CI (2026-04-20)

- **[Repo images and changelog scope](https://github.com/idvorkin/idvorkin.github.io/commit/12b237459)** - [Images can live in the repo](https://github.com/idvorkin/idvorkin.github.io/commit/12b237459); the changelog [leaves search](https://github.com/idvorkin/idvorkin.github.io/commit/acd1549f2) and [backlinks](https://github.com/idvorkin/idvorkin.github.io/commit/93e8647dd); share-link snippets [mark truncation](https://github.com/idvorkin/idvorkin.github.io/commit/8921b73a4).

### chop-conventions (2026-04-20)

- **[New skills](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0)** - [bulk](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0) fans out similar CLI calls in parallel; [image-read](https://github.com/idvorkin/chop-conventions/commit/6da88d704) ingests images in a background subagent; delegate [gets a Python dispatcher](https://github.com/idvorkin/chop-conventions/commit/9576474b5).
- **[Generation and learnings](https://github.com/idvorkin/chop-conventions/commit/654ac2d40)** - gen-image [flood fill hardened](https://github.com/idvorkin/chop-conventions/commit/654ac2d40), gen-tts [gains a speed flag](https://github.com/idvorkin/chop-conventions/commit/155438574), and [session learnings](https://github.com/idvorkin/chop-conventions/commit/00848035a) land in shared CLAUDE.md.

### Other Projects (2026-04-20)

- **[Settings](https://github.com/idvorkin/Settings)** - [agent-continue](https://github.com/idvorkin/Settings/commit/002df2d8d) resumes an agent from a tmux pane picker; [parent-pid-tree](https://github.com/idvorkin/Settings/commit/2937c8486) traces a pane's ancestors; [small fixes](https://github.com/idvorkin/Settings/commit/ef5fd3e0b).
- **[blob](https://github.com/idvorkin/blob)** - Raccoon claw trio [regenerated with cleaner chroma-key](https://github.com/idvorkin/blob/commit/ad88ced7d), plus a Freud-Larry raccoon.
- **[chroma-key-explainer](https://idvorkin-ai-tools.github.io/chroma-key-explainer)** (new) - Explains the chroma-key hill-climbing experiment, [winner first](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/e22e9e43d).
- **[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** - A Larry voice catalog on Gemini TTS, [tuned with Gemini as critic](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/462b709af), plus a speed slider.

## Week of 2026-04-13

_72 commits this week_

### Life Journal: First Entries (new post!)

- **[Life Journal](/life-journal) (new post!)** - Short life vignettes: [the cat that fooled Eight Sleep](https://github.com/idvorkin/idvorkin.github.io/commit/24c01651f), [four identical glasses](https://github.com/idvorkin/idvorkin.github.io/commit/fbf8a0299), [family air squats](https://github.com/idvorkin/idvorkin.github.io/commit/5e8145d17), [coding from the passenger seat](https://github.com/idvorkin/idvorkin.github.io/commit/7290b59a3).

### AI Operator: Seven New Sections

- **[From one agent to a fleet](/ai-operator)** - [Seven sections](https://github.com/idvorkin/idvorkin.github.io/commit/1ad27b02f): [review gates](https://github.com/idvorkin/idvorkin.github.io/commit/40d735bdd), ship then hill-climb, [run several at once](https://github.com/idvorkin/idvorkin.github.io/commit/2d066d807), [where learnings live](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0), prompts, skills, [companion AIs](/ai-relationships#a-private-language-of-one-cryptophasia).

### ACT: Reverse-Engineered Buddhism

- **[Reverse-engineered Buddhism](/act)** - [ACT reframed as Buddhist practice](https://github.com/idvorkin/idvorkin.github.io/commit/037595303) in behavioral-science language, with a mapping table and equanimity as the goal.

### AI Relationships: Cryptophasia and Drift

- **[Cryptophasia and drift](/ai-relationships)** - [Persistent AI companions](https://github.com/idvorkin/idvorkin.github.io/commit/eabb7ca28) risk a private language of one; [reach for people first](https://github.com/idvorkin/idvorkin.github.io/commit/c6283b97a), and [prompt AI friends to disagree](https://github.com/idvorkin/idvorkin.github.io/commit/049000327).

### AI Cockpit: New Instruments

- **[New instruments](/ai-cockpit)** - [GitHub saved searches](https://github.com/idvorkin/idvorkin.github.io/commit/c053fc42c) as the triage queue, [Tailscale](https://github.com/idvorkin/idvorkin.github.io/commit/e3f1a0acd) for reaching agent servers anywhere, and [pick-links](https://github.com/idvorkin/idvorkin.github.io/commit/652fa4e34) for scrollback URLs.

### Hill Climbing: Eval-Driven Pattern

- **[Hill Climbing](/hill-climbing) (new post!)** - [Score a baseline](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35), change one variable, keep the winner; the eval then guards the recipe.

### Infrastructure & CI (2026-04-13)

- **[Build and docs fixes](https://github.com/idvorkin/idvorkin.github.io/commit/d955711bc)** - [Atomic](https://github.com/idvorkin/idvorkin.github.io/commit/d955711bc) [backlinks writes](https://github.com/idvorkin/idvorkin.github.io/commit/af3328a14), [toc validation of indented fences](https://github.com/idvorkin/idvorkin.github.io/commit/bd49aa9c1), [fresh-worktree build](https://github.com/idvorkin/idvorkin.github.io/commit/0da87b063) and [PR-close notes](https://github.com/idvorkin/idvorkin.github.io/commit/57981a657), [iOS mosh setup](https://github.com/idvorkin/idvorkin.github.io/commit/3c554c897).

### chop-conventions (2026-04-13)

- **[New skills and auto-eval](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0)** - [bulk](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0) and [image-read](https://github.com/idvorkin/chop-conventions/commit/6da88d704) skills; gen-image [scores its transparency](https://github.com/idvorkin/chop-conventions/commit/192c40ea5); gen-tts [speed flag](https://github.com/idvorkin/chop-conventions/commit/155438574); delegate dispatch [moves to Python](https://github.com/idvorkin/chop-conventions/commit/9576474b5).
- **[Typer migration](https://github.com/idvorkin/chop-conventions/commit/2ca0a523d)** - [Four CLIs move from argparse to Typer](https://github.com/idvorkin/chop-conventions/commit/2ca0a523d), and [session learnings](https://github.com/idvorkin/chop-conventions/commit/00848035a) land in shared CLAUDE.md.

### Other Projects (2026-04-13)

- **[Settings](https://github.com/idvorkin/Settings)** - [agent-continue](https://github.com/idvorkin/Settings/commit/e40fe897d) resumes a Claude agent in tmux; [parent-pid-tree](https://github.com/idvorkin/Settings/commit/2937c8486); link-picker [Gist category](https://github.com/idvorkin/Settings/commit/c2dd59886); [open clipboard URL](https://github.com/idvorkin/Settings/commit/5ee752b53).
- **[blob](https://github.com/idvorkin/blob)** - Raccoon claw trio [regenerated with flood-fill chroma-key](https://github.com/idvorkin/blob/commit/cd3f9c0de).
- **[chroma-key-explainer](https://github.com/idvorkin-ai-tools/chroma-key-explainer)** (new) - Explains the [chroma-key hill-climbing process](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/281aae92e), winner first.
- **[dolt-explainer](https://github.com/idvorkin-ai-tools/dolt-explainer)** - [Reframed around syncing beads](https://github.com/idvorkin-ai-tools/dolt-explainer/commit/92e02231a) across agents and machines, with diagrams and a rollback section.
- **[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** - Voice tuning [with Gemini as critic](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/4af4c4a46), [a speed slider](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/51248851d), and per-voice presets.

## Week of 2026-04-12

_61 commits this week_

### The AI Operator: Learning to Drive the Machine (new post!)

- **[The AI Operator](/ai-operator) (new post!)** - [Operating AI is a skill](https://github.com/idvorkin/idvorkin.github.io/commit/5fdbb6a2a): spend thinking tokens directing, not supervising, and [work your way](https://github.com/idvorkin/idvorkin.github.io/commit/622d008fd) from in the loop to on it.
- **[Habits](/ai-operator)** - Talk instead of typing, [throw bad generations away](https://github.com/idvorkin/idvorkin.github.io/commit/84cd2cd34), and [compound what you learn](https://github.com/idvorkin/idvorkin.github.io/commit/1b5cf8295) into skills.

### ACT Made Simple: Book Notes (new post!)

- **[ACT Made Simple](/act) (new post!)** - [Notes on Russ Harris's book](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7): psychological flexibility, the choice point, workability over truth, creative hopelessness, and the hexaflex.

### CHOP & Tooling

- **[The flow question](/how-igor-chops#the-flow-question)** - [Flow survives chopping](https://github.com/idvorkin/idvorkin.github.io/commit/07a70ed21): it comes from orchestrating agents at different stages and mastering a skill.
- **[CPU safety net](/how-igor-chops#container-setup)** - [A hypervisor cap plus a userspace watchdog](https://github.com/idvorkin/idvorkin.github.io/commit/63fc22051) keeps runaway agents from melting the Mac, with [a reference page](https://github.com/idvorkin/idvorkin.github.io/commit/0a105f381).

### Infrastructure & CI (2026-04-12)

- **[Automated weekly changelog](https://github.com/idvorkin/idvorkin.github.io/commit/94dc5927c)** - [A scheduled GitHub Action](https://github.com/idvorkin/idvorkin.github.io/commit/94dc5927c) runs the changelog skill and opens a PR.
- **[AI operator cross-links](https://github.com/idvorkin/idvorkin.github.io/commit/fe93fc452)** - [Each section links](https://github.com/idvorkin/idvorkin.github.io/commit/fe93fc452) its relevant CHOP skills.

### Other Projects (2026-04-12)

- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - [architect-review skill](https://github.com/idvorkin/chop-conventions/commit/43ba1bdfd) hardens a spec through sequential review passes until it converges; [docs skill fixes](https://github.com/idvorkin/chop-conventions/commit/7dd0f5b4c).
- **[Settings](https://github.com/idvorkin/Settings)** - [Tools rebuild automatically after a pull](https://github.com/idvorkin/Settings/commit/7a8b1602a); [rbv prints its install command](https://github.com/idvorkin/Settings/commit/42248d537).
- **[context-grabber](https://github.com/idvorkin/context-grabber)** - [Sleep detail sheet](https://github.com/idvorkin/context-grabber/commit/7363b9e38), [a merged movement card](https://github.com/idvorkin/context-grabber/commit/6d9b60b7c), [honest transit accounting](https://github.com/idvorkin/context-grabber/commit/16f1be300), OTA updates and [background prefetch](https://github.com/idvorkin/context-grabber/commit/ec1acfc4b).
- **[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** - [Drop the Rope](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/5f3126de1): an unwinnable tug-of-war against [emotion monsters](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/c36819404) teaching that dropping, not effort, is the lever.

## Week of 2026-03-30

_28 commits this week_

### AI Relationships: When the Chatbot Is Better at Caring (new post!)

- **[AI Relationships rewrite](/ai-relationships) (new post!)** - [Studies rate chatbots](https://github.com/idvorkin/idvorkin.github.io/commit/08e603ddc) more compassionate than [humans](/humans-are-underrated); leaning on them [atrophies vulnerability](/lonely), so leave easy problems for [people](/human-meetings).
- **[Raccoon illustration](/ai-relationships)** - [A vulnerability-themed raccoon](https://github.com/idvorkin/idvorkin.github.io/commit/e2c48e0db) as the social preview.

### Keyboards: From Wrist Pain to Split Keyboards (new post!)

- **[Keyboards](/keyboard) (new post!)** - Wrist pain turned out to be [a shoulder problem](/shoulder-pain); [split keyboards far apart](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d), a hardware guide, RK-S70 programming from macOS, Karabiner chording.

### AI Journal: The Winchester Mystery House

- **[Winchester Mystery House](/ai-journal#the-winchester-mystery-house-of-software-when-code-gets-too-cheap-to-care-about)** - [Drew Breunig's third era](https://github.com/idvorkin/idvorkin.github.io/commit/22910e961) after cathedral and bazaar: sprawling personal tools, since agents made code cheap while coordination stayed expensive.
- **[Hyper-personal cross-link](/hyper-personal)** - [New section](https://github.com/idvorkin/idvorkin.github.io/commit/378f9b289) on the Winchester Mystery House as hyper-personalization of software itself.

### Content & Gear

- **[Mosh and Eternal Terminal](/mosh)** - [An Eternal Terminal setup guide](https://github.com/idvorkin/idvorkin.github.io/commit/c32cbf344) beside mosh, with Tailscale gotchas.
- **[Portable espresso](/irl#portable-espresso)** - [A battery espresso maker](https://github.com/idvorkin/idvorkin.github.io/commit/a1578347a) plus a JetBoil for coffee anywhere.
- **[AI feed](https://github.com/idvorkin/idvorkin.github.io/commit/e7259b89c)** - [Two articles queued](https://github.com/idvorkin/idvorkin.github.io/commit/e7259b89c): Russinovich on training future engineers, and recommender-system architecture.

### Infrastructure & CI (2026-03-30)

- **[Claude Code Review](https://github.com/idvorkin/idvorkin.github.io/commit/4c9762fbc)** - [Uses the official code-review plugin](https://github.com/idvorkin/idvorkin.github.io/commit/4c9762fbc) and also triggers on ready-for-review and reopened PRs.
- **[Workflows](https://github.com/idvorkin/idvorkin.github.io/commit/4c590b318)** - [Backlinks workflow rewritten](https://github.com/idvorkin/idvorkin.github.io/commit/4c590b318) to run on push to main with path filters; Actions [bumped](https://github.com/idvorkin/idvorkin.github.io/commit/02c659014) to [Node.js 24](https://github.com/idvorkin/idvorkin.github.io/commit/eb3db6f6c).

### Other Projects (2026-03-30)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **[Blog links in Neovim](https://github.com/idvorkin/Settings/commit/6bc9feea2)** - gf and [gx](https://github.com/idvorkin/Settings/commit/a585a8884) [follow blog permalinks](https://github.com/idvorkin/Settings/commit/6bc9feea2) to files via back-links.json.
- **[rmux_helper](https://github.com/idvorkin/Settings/commit/5f8ef186d)** - [side-edit takes file:line](https://github.com/idvorkin/Settings/commit/5f8ef186d); new side-run runs commands in the side pane.

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health & location data)

- **[Gym timer](https://github.com/idvorkin/context-grabber/commit/55032c477)** - [A new timer](https://github.com/idvorkin/context-grabber/commit/55032c477) sharing hooks with igor-timer.
- **[Places and health](https://github.com/idvorkin/context-grabber/commit/ffa18a780)** - [Per-day places](https://github.com/idvorkin/context-grabber/commit/16388d252), [hourly box plots, activity timeline](https://github.com/idvorkin/context-grabber/commit/ffa18a780); [weight in lbs, richer workouts, HRV export fix](https://github.com/idvorkin/context-grabber/commit/b3f514628).

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- **[machine-doctor](https://github.com/idvorkin/chop-conventions/commit/ed7985257)** - [A system health diagnosis skill](https://github.com/idvorkin/chop-conventions/commit/ed7985257), plus [skill conventions](https://github.com/idvorkin/chop-conventions/commit/c8b624ccc) and install docs.

## Week of 2026-03-16

_24 commits this week_

### Claws: The Next Layer of AI (new post!)

- **[Claws](/claw) (new post!)** - Persistent agents are the [next layer](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9) of Karpathy's onion; the lethal trifecta is the risk; my three claws are Larry, Wally and Tony.

### AI Journal: Telegram, Eggs, and Feedback Loops

- **[Telegram bot](/ai-journal#2026-03-21)** - [Threw away my custom bot](https://github.com/idvorkin/idvorkin.github.io/commit/8e1881824) for the official Telegram plugin, then [layered speech-to-text, TTS, logging and weather nudges](https://github.com/idvorkin/idvorkin.github.io/commit/acf20b7ae) on it.
- **[The Egg Theory](/ai-journal#2026-03-21)** - Like the egg in cake mix, [good AI workflows](https://github.com/idvorkin/idvorkin.github.io/commit/d54b734db) leave people a real contribution so they feel ownership.
- **[AI filing feature requests](/ai-journal#2026-03-21)** - Hitting bad HealthKit data, [Claude filed issues](https://github.com/idvorkin/idvorkin.github.io/commit/f3ab9e75f) on the source repo instead of working around it.

### AI Native Manager: "In Distribution"

- **[In Distribution](/ai-native-vocab#in-distribution)** - Tools in the model's training data [cost agents nothing to learn](https://github.com/idvorkin/idvorkin.github.io/commit/56667aaef); internal tools pay an awareness tax every time.

### Content Updates

- **[Small edits](https://github.com/idvorkin/idvorkin.github.io/commit/476455361)** - [Raccoon history image grids](https://github.com/idvorkin/idvorkin.github.io/commit/476455361) across [three eras](https://github.com/idvorkin/idvorkin.github.io/commit/434bc07a1); a [clown documentary](https://github.com/idvorkin/idvorkin.github.io/commit/4a32b67ae) in Joy; [Karpathy's job-market visualizer](https://github.com/idvorkin/idvorkin.github.io/commit/f22e0397a) in Explainers.

### Infrastructure & Tooling (2026-03-16)

- **[Tooling](https://github.com/idvorkin/idvorkin.github.io/commit/eb000683a)** - [Jekyll runs on Ruby 4](https://github.com/idvorkin/idvorkin.github.io/commit/eb000683a) via a pathutil patch; a [show-your-work screenshot skill](https://github.com/idvorkin/idvorkin.github.io/commit/cacd5a0d5); [AI feed routes podcasts](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9) to transcripts.

### Other Projects (2026-03-16)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- **[Stats and places](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1)** - [Weekly box plots](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1), known places with radius matching and JSON import, per-source sleep breakdown.

**[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** (interactive explainer, Nicky Case-inspired)

- **[Morning choice mini-game](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/e2022d2d9)** - Alarm intro, [drag interaction](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/e2022d2d9), path choices, mobile layout, [raccoon favicon](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/cfa04c736).

**New and smaller**

- **[tg-bot](https://github.com/idvorkin/tg-bot)** - [Deprecated](https://github.com/idvorkin/tg-bot/commit/56f56cbe7) in favor of the official Claude Code Telegram plugin.
- **[Settings](https://github.com/idvorkin/Settings)** - [Browser-free OAuth](https://github.com/idvorkin/Settings/commit/844efcc87) for headless servers; [Kindle notebook email detection fixed](https://github.com/idvorkin/Settings/commit/036d9f8fc).
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - [Leaner up-to-date skill](https://github.com/idvorkin/chop-conventions/commit/76fa478cb) with remote hygiene; [new clock and background-usage skills](https://github.com/idvorkin/chop-conventions/commit/3e1e966cd).

## Week of 2026-03-09

_14 commits this week_

### AI Second Brain (new post!)

- **[AI Second Brain](/ai-second-brain) (new post!)** - [Replace manual PKM](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c) with available context, pre-brief and debrief; personas like Larry use the brain, and teams need one too.

### Side Quests (new post!)

- **[Side Quests](/side-quests) (new post!)** - [Light tech explorations](https://github.com/idvorkin/idvorkin.github.io/commit/ad8434558): [in-browser card detection](https://github.com/idvorkin/idvorkin.github.io/commit/4a86702b1), Context Grabber graduating to a project, [macOS VMs shelved](https://github.com/idvorkin/idvorkin.github.io/commit/ef43d2936).

### AI Journal: Verification as Trust

- **[Show, don't tell](/ai-journal#when-ai-shows-its-work-verification-as-trust)** - [Trustworthy AI PRs](https://github.com/idvorkin/idvorkin.github.io/commit/7aaf9b0d9) carry screenshots, exact test counts, a staging link and proof existing tests pass.

### Cross-linking & Content Updates

- **[Context Grabber woven in](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e)** - Larry, Structure and Pet Projects [cite it as a data source](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e); Larry's section now covers what Larry could know.
- **[Second brain woven in](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)** - AI Native Manager [links the org second brain](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c); Hyper-Personal gains a second-brain section.

### Infrastructure (2026-03-09)

- **[Tooling](https://github.com/idvorkin/idvorkin.github.io/commit/c851e24ae)** - [Jekyll runs on Ruby 3.2+](https://github.com/idvorkin/idvorkin.github.io/commit/c851e24ae) via the \_ruby_compat.rb shim; a [walk-the-store skill](https://github.com/idvorkin/idvorkin.github.io/commit/3b560b282) screenshots key pages into a gallery.

### Other Projects (2026-03-09)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- **[Location clustering](https://github.com/idvorkin/context-grabber/commit/08be4fd2b)** - [Grid-based clustering](https://github.com/idvorkin/context-grabber/commit/08be4fd2b) with run-length timelines.
- **[More health data](https://github.com/idvorkin/context-grabber/commit/7b52df6a3)** - [HRV, resting HR, exercise minutes, weekly sharing](https://github.com/idvorkin/context-grabber/commit/7b52df6a3), [auto-grab on startup](https://github.com/idvorkin/context-grabber/commit/e299437a4), OTA updates; sleep and weight fixes.

**[magic-monitor](https://magic-monitor.surge.sh)** ([smart mirror](https://github.com/idvorkin/magic-monitor))

- **[Card detection](https://github.com/idvorkin/magic-monitor/commit/4f80c89ea)** - YOLO card detection [fixed end to end](https://github.com/idvorkin/magic-monitor/commit/4f80c89ea), with [a Colab training notebook](https://github.com/idvorkin/magic-monitor/commit/c66905937) and runtime model loading.

**New and smaller**

- **[humane-tracker-1](https://humane-tracker.surge.sh)** - [Long-press a row](https://github.com/idvorkin/humane-tracker-1/commit/2b958e953) to backfill habits without confirmation dialogs.
- **[tg-bot](https://github.com/idvorkin/tg-bot)** - [Parakeet voice transcription](https://github.com/idvorkin/tg-bot/commit/ff97ec296) and threaded replies.
- **[streamdeck-igor-vibe](https://github.com/idvorkin/streamdeck-igor-vibe)** - [tmux keystrokes sent via Quartz events](https://github.com/idvorkin/streamdeck-igor-vibe/commit/73e04283b), bypassing Karabiner.
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - A [gist-image skill](https://github.com/idvorkin/chop-conventions/commit/b4a93e5d1) for hosting images on GitHub.

## Week of 2026-02-08

_17 commits this week_

### AI Native Engineering Manager (new post!)

- **[AI Native Engineering Manager](/ai-native-manager) (new post!)** - [Managing engineers](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed) when AI rewrites the assumptions about software, teams and the manager's role.
- **[The AI Chasm](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed)** - [Six adoption stages](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed) from denial to sustainable execution, with a coaching playbook for each transition.
- **[Team roles and limits](https://github.com/idvorkin/idvorkin.github.io/commit/a87a256ba)** - [Trailblazer, Toolsmith, Skeptic and Bridge roles](https://github.com/idvorkin/idvorkin.github.io/commit/345858011); [AI-free zones](https://github.com/idvorkin/idvorkin.github.io/commit/a87a256ba) [and their limits](https://github.com/idvorkin/idvorkin.github.io/commit/20c8a89e3); builder titles collapse while specialties persist.

### AI Cockpit (new post!)

- **[AI Cockpit](/ai-cockpit) (new post!)** - [The physical and software control surface](https://github.com/idvorkin/idvorkin.github.io/commit/1d54a78dd) for multi-agent development: [voice first](https://github.com/idvorkin/idvorkin.github.io/commit/27e265542), tmux, Alfred, an agent dashboard and Stream Deck.

### AI Journal: Yegge's AI Vampire

- **[The AI Vampire](/ai-journal#2026-02-14)** - Yegge on who captures AI's productivity gain; [my answer](https://github.com/idvorkin/idvorkin.github.io/commit/8ea624b0c) is that compounding team fluency, not today's speedup, is the value.

### Spiritual Health: Meaning Traps

- **[Meaning traps](/spiritual-health#the-meaning-traps)** - [Intro rewritten as exploratory](https://github.com/idvorkin/idvorkin.github.io/commit/772bc2169); a [motivation test](/activation) for meaning and four traps where it goes missing.
- **[2026 goals](/y2026#spiritual-health)** - [The motivation test becomes a Q1 goal](https://github.com/idvorkin/idvorkin.github.io/commit/e50920005), with walking with God as a daily practice.

### Infrastructure & Tooling (2026-02-08)

- **[Content skills](https://github.com/idvorkin/idvorkin.github.io/commit/8f358f756)** - [/ai-content](https://github.com/idvorkin/idvorkin.github.io/commit/8f358f756) and [/spiritual-content](https://github.com/idvorkin/idvorkin.github.io/commit/590894703) load the topic's post map and backlinks, then set up branch and server.

### Other Projects (2026-02-08)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- **[ammon skill](https://github.com/idvorkin/chop-conventions/commit/190f2bc87)** - [Checks the time in Denmark](https://github.com/idvorkin/chop-conventions/commit/190f2bc87), with a sleep warning.
- **[up-to-date](https://github.com/idvorkin/chop-conventions/commit/d73d7e0c1)** - [Offers /clear](https://github.com/idvorkin/chop-conventions/commit/d73d7e0c1) after syncing.

## Week of 2026-01-25

_41 commits this week_

### AI Journal Updates

- **[Survival and cattle](/ai-journal#2026-01-31)** - [Yegge's software survival ratio](https://github.com/idvorkin/idvorkin.github.io/commit/bdedc6f02); [staying a step behind the bleeding edge](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c); code as cattle, not pets; whenwords, a library shipped as spec plus tests.
- **[Review cost below generation cost](https://github.com/idvorkin/idvorkin.github.io/commit/4c1447d04)** - [Code no longer signals understanding](https://github.com/idvorkin/idvorkin.github.io/commit/4c1447d04), so projects like tldraw and LLVM restrict outside AI contributions.

### Spiritual Health & Elder Life

- **[Getting started](/spiritual-health#getting-started-for-those-whove-never-done-this)** - [New section for newcomers](https://github.com/idvorkin/idvorkin.github.io/commit/dd1a34e66): midlife spiritual interest, [the Vanaprastha life stages](https://github.com/idvorkin/idvorkin.github.io/commit/6961c1423), and three obstacles with fixes from Arthur Brooks.

### Addiction vs Opportunity Cost

- **[Compulsion or choice](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)** - [Addiction is what you don't want but do](https://github.com/idvorkin/idvorkin.github.io/commit/9d5f53bea); opportunity cost is what you want but pays elsewhere; test by relief or loss.

### Product Management

- **[Desire paths](/product#desire-paths-a-methodology-for-discovering-revealed-preferences)** - Discover revealed preferences by [paving where users already walk](https://github.com/idvorkin/idvorkin.github.io/commit/c7a04a612), from campus paths to hashtags to Yegge's hallucination squatting.

### Physical Health Content

- **[Shoulder anatomy](/shoulder-pain#shoulder-movement-directions-and-muscles)** - [Movement vocabulary](https://github.com/idvorkin/idvorkin.github.io/commit/c052e629b), the rotator cuff muscles, and why external rotation matters most for impingement.

### How Igor CHOPs

- **[Stages and principles](/how-igor-chops#the-8-stages-of-ai-coding)** - Yegge's 8 stages of AI coding diagram, plus [what works](/how-igor-chops#what-works-well---review-this-weekly): [rent the best brain](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6), maximize time between interventions.

### Infrastructure & Tooling (2026-01-25)

- **[Tooling](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b)** - A [/content skill](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b) for the blog workflow; [ASIN metadata fetched](https://github.com/idvorkin/idvorkin.github.io/commit/99c355400) for product links.

### Other Projects (2026-01-25)

**New and smaller**

- **[Settings](https://github.com/idvorkin/Settings)** - [ter switches terminal tabs](https://github.com/idvorkin/Settings/commit/c5a71186c); Neovim [PRStatus and PRDiff](https://github.com/idvorkin/Settings/commit/9caa71bcd); [fork-aware PR base](https://github.com/idvorkin/Settings/commit/0df43e437); [tmux](https://github.com/idvorkin/Settings/commit/d41d98f38), [gmail_reader](https://github.com/idvorkin/Settings/commit/d658f0209) and [y.py completion](https://github.com/idvorkin/Settings/commit/2d7e81279) fixes.
- **[monitor-explainer](https://monitor-explorer.surge.sh)** (new; [repo](https://github.com/idvorkin/monitor-explainer)) - [Compare](https://github.com/idvorkin/monitor-explainer/commit/031684aab) [monitors](https://github.com/idvorkin/monitor-explainer/commit/3945f2323) [by aspect ratio](https://github.com/idvorkin/monitor-explainer/commit/b4c7e64ff) and size; [drag](https://github.com/idvorkin/monitor-explainer/commit/dd0ac4254), [rotate](https://github.com/idvorkin/monitor-explainer/commit/de9f77fb8), [pan and zoom](https://github.com/idvorkin/monitor-explainer/commit/01ee334d8). ([commit](https://github.com/idvorkin/monitor-explainer/commit/9ceeaea4a))
- **[nlp](https://github.com/idvorkin/nlp)** - [Local MLX text-to-speech](https://github.com/idvorkin/nlp/commit/61aa07c58) on Apple Silicon.
- **[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** ([repo](https://github.com/idvorkin/how-long-since-ai)) - [Deployment docs](https://github.com/idvorkin/how-long-since-ai/commit/93061f9d7) for production and PR previews.
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - up-to-date [detects branch commits missing from main](https://github.com/idvorkin/chop-conventions/commit/8c0290552) after a merge.

---

_Want to see what's been modified recently? Check [Recently Modified Content](/recent) for a dynamic view._

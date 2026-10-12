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

- **What's Left in Engineering? (new post!)** - With agents writing the code, two jobs remain: iterate on the job to be done, keep code changeable by agents. ([blog](/whats-left#job-2-keep-the-code-changeable-by-agents)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a02331764)
- **Sleight of Mouth rebuilt** - One coherent argument, with Dilts' diagram replaced by an interactive explorer of the fourteen patterns. ([blog](/sleight-of-mouth#interactive-version)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/253079feb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/efda88e96) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6ce0e6015)
- **Affirmations** - A short public page with the four affirmations and how to use them, split from my working notes. ([blog](/affirmations#how-to-use-them)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d9767572d)
- **The Den #13** - The Longest Title: a card-catalog title that never ends fills the attic before the book appears. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5c083105a)
- **Small edits** - The eulogy song plays inline; Opus releases on the life-in-weeks chart. ([blog](/eulogy)) ([blog](/weeks)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d47d39405) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b5dcedb6f)

### Infrastructure & CI (2026-10-11)

- **Default link previews** - Raccoon default preview images for AI posts and the site; every AI post flagged; Wally gets its own. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/299efb9d3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/024baea0e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/82f8dbd8e)
- **p key** - Jumps between prod and a test server, remembering the test origin per tab; only loopback and tailnet hosts count. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/333ba32af) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/cd2e3ae31)

### chop-conventions (2026-10-11)

- **iOS device signing** - Recovering when Xcode loses its account, the shared signing lock, and what a locked device's error looks like. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/8844a5a68) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/6bc370fa0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/093f913ff)
- **Agent lessons** - What the iOS agent sessions taught, including simctl defaults that can't override keys an app already wrote. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fff137e6b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/665da96ce)
- **iOS libraries** - Recommended iOS libraries, tools and agent skills, revised after checking seven app repos against the list. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/a9b816684) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/b45b19a0d)

### Other Projects (2026-10-11)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iPhone health and context app)

- **Calling Larry** - The native app gets the Call screen, with call audio and gist uploads. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/d782599a8)
- **Home screen** - Opens on today with a daily strip, usage left, the eulogy song, and an iPad layout. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/5046a3808) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/364d3fa43) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2b75d3a27) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2c2a6ee1d)
- **Bug reports** - BugKit's Mac listener files every report, and reports now reach the Mac through iCloud. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/aa4397d46) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/61eeb4b54)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **iCloud sync** - Sets and workouts reach every device, edits included; recordings save to their own Photos album. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/eb307c575) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/dae2c085e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/d93a1ef6f)
- **Watch** - The workout page shows sets grouped by exercise, with the drawings. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/a857c5182)
- **Tooling** - SwiftLint and swift-format in the gate; the bug-kit listener files bug reports. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/40bc0d3bd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/c1eb0a934)

**New and smaller**

- **[bug-kit](https://github.com/idvorkin/bug-kit)** (new) - One bug-report library for iOS apps plus a Mac listener; automatic reports, private iCloud delivery, screenshot privacy controls. [<i class="fa fa-github"></i>](https://github.com/idvorkin/bug-kit/commit/789c9df2b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/bug-kit/commit/e89e40b88) [<i class="fa fa-github"></i>](https://github.com/idvorkin/bug-kit/commit/ef127b223) [<i class="fa fa-github"></i>](https://github.com/idvorkin/bug-kit/commit/8ac0bb5f6)

## Week of 2026-10-04

_48 commits this week_

### New Posts and Rewrites (2026-10-04)

- **Post-training LLMs (new post!)** - Every method answers two questions: who grades the answer, and what the model should change from one try. ([blog](/ai-post-training#two-questions-explain-every-method)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/43d11e7f3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b40233479)
- **Post-training Agents (new post!)** - How grading and updates change when the model works a forty-turn trajectory instead of writing one reply. ([blog](/ai-post-training-agents#who-grades-an-agent)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b696bee35)
- **If You're Thinking About Suicide (new post!)** - A brain attack is like a heart attack, so call someone now; /suicide is now for the bereaved. ([blog](/thinking-about-suicide)) ([blog](/suicide)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2222c0aa0)
- **Time allocation** - The five buckets stay, with energy flow layered on top and a two-hour weekday ceiling on relationships. ([blog](/time-allocation#where-the-time-goes)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d0b1a3536) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d4445ecfe)
- **Raccoon redraws** - The 2006 first-date comic with Tori, and the mania raccoon still going at 3 a.m. ([blog](/tori)) ([blog](/mania)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56a94a613) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/daa2eb843)
- **The Den #12** - Bless You: Larry gets a mailbox with Seen, Working and Done flags. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5415248a5)
- **Small edits** - Balloon creations filled in; a missing Enneagram row. ([blog](/balloon#some-of-my-creations)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8509706b4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6cb494b81)

### Infrastructure & CI (2026-10-04)

- **Link previews and AI label** - Hero images become link previews on posts that had none; the AI label shrinks to one line. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4cf2a63e0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f604328bc)
- **Dev banner** - Icons instead of words; Comments toggles annotate mode live, including inside the rich diff. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7d0daca45) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/83c459a70) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5caa28647)

### Other Projects (2026-10-04)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iPhone health and context app)

- **Native app** - A Swift app beside the React Native one: Gym Timer, box breathing, and Places. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/89da0163f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/5a284c561) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7c4fb3789) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/5daab8f2e)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **iPad and bell weight** - A Workouts sidebar on the iPad; tap a set to log bell weight, and later sets carry it. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/adb45769b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/0a6ab954e)

**New and smaller**

- **[window-sweaters](https://github.com/idvorkin/window-sweaters)** - Knitted window borders on the Mac, now with a raccoon that visits the focused window. [<i class="fa fa-github"></i>](https://github.com/idvorkin/window-sweaters/commit/f1f514be5)
- **[Settings](https://github.com/idvorkin/Settings)** - caff becomes awake and names busy agents; pick-links lists commands to run; faster zsh startup. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/fa2c5a0cf) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/e52a3476d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/aa6407231)

## Week of 2026-09-27

_47 commits this week_

### New Posts and Rewrites (2026-09-27)

- **The Interaction Model Matters (new post!)** - How an agent talks matters as much as what it can do; Opus 5.5 brought back the joy. ([blog](/interaction-model)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f7b150566)
- **Spiritual health hub** - Rewritten around three breaks (direction, scale, acceptance) plus practices, with one shared vocabulary and footer across the spiritual posts. ([blog](/spiritual-health#three-ways-it-breaks)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/249bd4f87) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e078f6b14)
- **Religion and walking with God** - Religion restructured around my story and practice over proof; the devotional experiment closed out with what it taught. ([blog](/religion#it-lives-in-practice-not-proof)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4812cca24) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/48e71347e)
- **Agency rebuilt** - Knowledge became queryable and the technologist threshold moved, so agency beats smarts even more with AI. ([blog](/agency#knowledge-became-queryable)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b4b6c566f)
- **Gas City, one hub** - /why-gas-city folds into /gas-city: the ladder, what a city is, what it costs, what I run. ([blog](/gas-city)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/00880797d)
- **Where the Time Goes rewrite** - Rewritten from scratch, with the bucket chart rebuilt around where freed hours leak. ([blog](/time-allocation#why-less-tech-fails)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b11e9e760)
- **Back pain figures** - Interactive banana back and neck poke from weak hips, and a loose-versus-latched backpack model, both sourced. ([blog](/back-pain#weak-hips-make-a-banana-back)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6d012f9d1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0303ecc58)
- **Claws** - /claw and /igors-claws de-duplicated; a Muse section covers the first claw anyone can install and name. ([blog](/claw#muse-a-claw-a-grandma-can-use)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9a680255e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a2b981516)
- **New sections** - Why SaaS still lives when DIY is cheap; Amazon blocks shopping agents and strips order emails. ([blog](/hyper-personal#why-saas-still-lives)) ([blog](/amazon#customer-obsession)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5cf8364e0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8e554d943)
- **The Den #8 to #11** - Rex debuts, Larry speaks human, the tests take credit, and a city of agents runs on zero tokens. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/92c653778) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e1a347290) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7ba2e5e06)
- **Small edits** - Plainer orchestrator, token and Cockpit posts; AI eval tools lead with where they split; a balloon pump-carry; three stubs trimmed. ([blog](/ai-eval-tools#where-the-tools-split)) ([blog](/balloon#keep-the-pump-at-hand)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/76546cad1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/da9bfff06) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fb622d07f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a5cd8951b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6aadeefca)

### Infrastructure & CI (2026-09-27)

- **Diff vs main** - The dev banner renders a rich diff of the page against main, with a change map and n/p jumps. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/12e5e5220) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/58eb5f461) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ee12e6cad)
- **Terse changelog** - The skill and the weekly Action now write a linked list with a line budget, not an essay. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1e6296b44) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c117eb80e)

### chop-conventions (2026-09-27)

- **machine-doctor on macOS** - Mac CPU and memory collection, sleep forensics, a read-only DNS doctor, and a memory-by-app table. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/1861a0f6e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/a9b38f4c2) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d625459df)
- **Agent plumbing** - Outside agents get Herdr worktrees, one watcher covers every Muse pane, and only one session runs the Telegram bridge. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7f15f46cc) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/a4658d259) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/85b46f698)
- **Tools manifest** - One list of external tools with a doctor; gen-image defaults to Muse Image. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/4b418a86a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ef45bb1ed)

### Other Projects (2026-09-27)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **pick-links** - Opens OSC 8 hyperlink targets and guesses repos for short refs like chop#14; Enter opens directly on macOS. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/4109442a5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/0ff7a1aba) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5fe04716d)
- **Mac fixes** - caff reacts to power events, LG monitor refresh rate fixed on wake, yabai event trace, new Herdr keys. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/0c1a70292) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/6b82f0d1f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/7b1e1297f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/21eac52e3)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **Watch and counting** - add an unrecorded set from the watch; the first swing off the floor counts, a bell set down does not. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/0c0770438) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/09779df34) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/c972f6979)

**New and smaller**

- **[lcd-timer](https://github.com/idvorkin/lcd-timer)** (new) - a Mac countdown drawn like a gym's LED wall clock. [<i class="fa fa-github"></i>](https://github.com/idvorkin/lcd-timer/commit/4de308b5d)
- **[robert-moses-atlas](https://idvorkin-ai-tools.github.io/robert-moses-atlas/)** (new) - Moses's New York, 1924 to 1968, on a map with a time scrubber. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/robert-moses-atlas/commit/011830173) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/robert-moses-atlas/commit/1d003b816)
- **[garfield-crest](https://idvorkin-ai-tools.github.io/garfield-crest/)** (new) - The Garfield High crest assembling itself in 3D. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/garfield-crest/commit/b16e2cb1b) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/garfield-crest/commit/b21bba5cd)

## Week of 2026-09-21

_58 commits this week_

### Three New Posts (2026-09-21)

- **AI Orchestrators (new post!)** - An orchestrator is every block around the agent, each added after something broke, and each kept cheap to delete. ([blog](/ai-orchestrator)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e462fbf19)
- **Block-by-block viewer** - Back and Next step through the stack from the whole picture, with simpler panels that fit a phone. ([blog](/ai-orchestrator)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/963295f9c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/03d97cf68)
- **Where the Time Goes (new post!)** - Hours freed from tech default to consumption unless given a destination first; relationships and health have ceilings. ([blog](/time-allocation)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2be21d446)
- **Interactive bucket chart** - pull tech down to see where freed hours land; clicking Tech splits it into work, side projects and environment. ([blog](/time-allocation#where-the-time-goes)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ff9932773) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ac46a83cb)
- **How I Manage AI Tokens (new post!)** - Across several subscriptions, read quota left against time left and spend where the window resets soonest. ([blog](/token-management)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/25aeb037c)
- **Cockpit usage page** - the post shows the phone dashboard's quota bars and SPEND flag; the Cockpit post links back. ([blog](/token-management#put-it-where-you-already-look)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/96e93e4de)
- **Cross-links** - five AI posts now link the orchestrator; Escape Artists and Build the Life You Want link the buckets. ([blog](/ai-orchestrator)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e22ab60c0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f885aa465) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/65141b318)

### Infrastructure & CI (2026-09-21)

- **pr-checks skill** - prints the PR Review Checklist grid; regex checks stay code, and a model judges headers, voice and AI patterns. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/18755cb49) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a33547889)
- **no-mistakes gate** - blog gate config with pr-checks after lint; Grok runs first, Codex and Claude as fallbacks. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5432d81ec) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/804c6b83f)
- **Dev banner links changed pages** - a branch preview lists every post the branch touches, one click each. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94a5768f2)
- **Small fixes** - CLAUDE.md now symlinks to AGENTS.md; the `?` dialog shows the annotate toggle; two dead changelog anchors repaired. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/11accd59c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f02fec9eb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c9d3de49)

### Other Projects (2026-09-21)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone lift tracker and rep counter)

- **Barbell split squat** - new exercise, told apart from swings, counted by hip height over the front foot. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/6d617d87c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/9b3192376)
- **Delete a set** - from playback or Workouts, warning when the app holds the only copy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/59309e727)
- **Workouts polish** - exercise drawings replace names; seek controls persist and let the video show through. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/d6a139f1e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/49046c0dd)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **y window numbers** - a clockwise number overlay on macOS windows; focus or close any window by its number. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/653134680) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/03977efaf)
- **caff** - keeps the Mac awake only while plugged in or Herdr agents work, and falls back to sleep. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/0e6944507) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/275f5cee7)
- **Shell cleanup** - dead API keys no longer exported; the SCRATCH variable stops growing with every nested shell. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/615a368b7) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/3ed111b57)

**[hierarchy-of-money-field-map](https://idvorkin-ai-tools.github.io/hierarchy-of-money-field-map/)** (Gundersen's money story, illustrated) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map)

- **New field map** - an animal parable of how money stacks into layers, a problem-then-solution walk, an index card. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map/commit/0b5ad91be) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/hierarchy-of-money-field-map/commit/bb0029b15) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/idvorkin-ai-tools.github.io/commit/318ea22c6)

**[autopreso](https://github.com/idvorkin-ai-tools/autopreso)** (speech-driven whiteboard presentations)

- **Off OpenAI** - Deepgram transcription and an OpenRouter drawing agent, each with its own key. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/autopreso/commit/024cde234)

## Week of 2026-09-14

_2 commits this week_

### Swing Analyzer: Bulgarian Split Squats

- **Bulgarian split-squat mode** - /swings works again as one self-contained page; the new mode counts reps by front-knee angle and flags knee cave. ([blog](/swings)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7c1748b8a)

### chop-conventions (2026-09-14)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **muse-herdr skill** - run Muse Code agents in Herdr panes as sub-agents, recover a dead keychain, and review every change before merging. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d10531184) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fc4254267)
- **Stuck-agent watcher** - one script scans every Muse pane for failed model calls and frozen screens, without mistaking a long think for a stall. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/e7cce3d01) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/923b27312)
- **up-to-date installs plugins** - each machine gets the standard Claude plugin set from a shared list. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/8a7dd7aae)

### Other Projects (2026-09-14)

**[exercise-analyzer](https://github.com/idvorkin/exercise-analyzer)** (iPhone exercise form analyzer)

- **New app** - on-device pose analysis counts swings, pistol squats, split squats and get-ups, and detects which one you did. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/1fb9b0a44)
- **Apple Watch companion** - record, pause, rest and frame the shot from the wrist. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/af22b1103) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/4bf497b8a)
- **Kettlebell tracker** - a small object detector finds the bell and keeps it tracked through each rep. [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/3b997e1e4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/exercise-analyzer/commit/85ed8e52e)

**[swing-analyzer](https://swing-analyzer.surge.sh)** (browser kettlebell swing analyzer) [<i class="fa fa-github"></i>](https://github.com/idvorkin/swing-analyzer)

- **Bulgarian split squat** - a new movement and detector, a lighter render loop, and a sample set in form-analyzer-samples. [<i class="fa fa-github"></i>](https://github.com/idvorkin/swing-analyzer/commit/87e3d6aab) [<i class="fa fa-github"></i>](https://github.com/idvorkin/swing-analyzer/commit/ddde7772a) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/form-analyzer-samples/commit/0eefc864f)

**[monitor-explainer](https://monitor-explorer.surge.sh)** (monitor size and shape comparer) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer)

- **Tall and ultrawide screens** - adds 3:2 and tall aspect ratios plus LG's 5K2K ultrawides. [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/0b73e9707) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/0c0024a08)

**[cap-gains-explainer](https://idvorkin-ai-tools.github.io/cap-gains-explainer/)** (capital-gains timing calculator) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer)

- **Interest income** - a slider for income that continues after retirement feeds both charts; the penalty tile adds percent of sale. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/32db1e57b) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/f7f8954fe) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/a87219c36)

**[harmbench-field-map](https://idvorkin-ai-tools.github.io/harmbench-field-map/)** (HarmBench red-teaming benchmark, mapped) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/harmbench-field-map)

- **New field map** - the benchmark by harm category, with behavior types, grading classifier and attack methods, every behavior inline. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/harmbench-field-map/commit/18228dec2)

**[gutter-model-playground](https://idvorkin-ai-tools.github.io/gutter-model-playground/)** (image models, one scene) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/gutter-model-playground)

- **v2** - nine image models draw the same Larry-and-Igor scene, compared on cost, speed and character accuracy. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/gutter-model-playground/commit/5f2945a3b)

## Week of 2026-09-07

_15 commits this week_

### The Den: Strips #6 and #7 (2026-09-07)

- **Do a Russian Accent (new strip!)** - Igor's phone voice clone does a Russian accent, then, asked to do him, parrots his question back. ([blog](/the-den#6--do-a-russian-accent)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2d1491506)
- **Before AI / After AI (new strip!)** - The same mugging twice; the second time Igor pleads three waiting AI agents, not three kids. ([blog](/the-den#7--before-ai--after-ai)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/263019b23)
- **Same script, different models (new page!)** - Den #6 by three models, #7 by Gemini beside Meta Muse; OpenAI's #6 now ships. ([blog](/the-den-styles)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f83d621da) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/970259341)
- **Panel lightbox in the Den** - Tap a panel for full screen, swipe through to the whole strip; the old viewer page redirects. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9b87d3e0f)
- **Claw canon relaxed** - Larry's claw may sit on either arm; respinning for side is what produced two-claw panels. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6b419a9df)

### Infrastructure & CI (2026-09-07)

- **Check git status after every commit** - CLAUDE.md warns the prettier hook can land a commit while leaving its reformatted files unstaged. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ff61856bb)
- **Small fixes** - The panel cutter drops each frame's antialiased outer pixel; one British spelling fixed on the styles page. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2d1491506) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b8aefb374)

### chop-conventions (2026-09-07)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **Laziness ladder** - Before writing code, ask whether it needs to exist or is already there; plus boring over clever and `ponytail:` comments. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/794e51969)
- **Alerts never go to strangers** - The Telegram direct-send default chat now considers only allowed senders, so a stranger's DM cannot capture the next alert. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9b505b0d9)

### Other Projects (2026-09-07)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit and location exporter)

- **Call diagnostics** - A troubled call uploads its log to a private gist; dropped audio heals itself mid-call. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7504fa6f6) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7db050d8a)
- **Workout timer** - LED seven-segment digits that rotate with the phone; music ducks under cues, podcasts pause for them. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/be5828e06) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/46091691e)
- **Memdeck widget** - A random playing card on the big widget and lock screen, changing every quarter hour. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/c81b9b16e)

**[magic-monitor](https://github.com/idvorkin/magic-monitor)** (magic practice camera and replay)

- **Think of a card** - P or a V sign starts a countdown, then shows a random card in a small corner panel. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/d77733b6f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/9904e0cf6)
- **Replay scrubber fixed** - Recordings now store their real duration, so the scrubber no longer reads Infinity. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/e38be07a7)
- **Lighter card detection** - The detector refills one input buffer instead of allocating a fresh one every frame. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/d1c84ffbc)

**[idvorkin-ai-tools.github.io](https://idvorkin-ai-tools.github.io/)** (new index of every field map) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/idvorkin-ai-tools.github.io/commit/8afdf37e9)

- **Course maps** - [Technical AI Safety](https://idvorkin-ai-tools.github.io/technical-ai-safety-field-map/) (BlueDot, 27 chapters) and [CS336](https://idvorkin-ai-tools.github.io/cs336-field-map/) (Stanford language modeling, 17 lectures). [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/technical-ai-safety-field-map/commit/757a332dc) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cs336-field-map/commit/7fbf1c8cf)
- **Karpathy maps** - [Let's build GPT](https://idvorkin-ai-tools.github.io/build-gpt-field-map/) and [micrograd](https://idvorkin-ai-tools.github.io/micrograd-field-map/), eight parts each plus a cleaned transcript. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/build-gpt-field-map/commit/891efc67e) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/micrograd-field-map/commit/cc2b9e35c)
- **Single-source maps** - [3Blue1Brown entropy](https://idvorkin-ai-tools.github.io/3b1b-entropy-field-map/) in twenty pages; [Man in the Arena](https://idvorkin-ai-tools.github.io/man-in-the-arena/) with full text and verified sources. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/3b1b-entropy-field-map/commit/1490c62fb) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/man-in-the-arena/commit/4e34cb4bd)

## Week of 2026-08-31

_41 commits this week_

### The Den and new AI posts

- **The Den (new post!)** - A weekly four-panel strip about running an AI staff, each gag backed by its real transcript; four strips shipped. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8588335b5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fd6ef290c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d750c4827) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b75908ab5)
- **Den panel viewer** - Tap a panel to fill a phone screen and swipe through every strip, reading pre-cut panel files from one manifest. ([blog](/the-den)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b987872a9) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/32cab6298)
- **Gutter, the cartoonist seat** - Character sheet, drawing contract, recipe, and an edge-walking panel cutter; job history and pitches stay private. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e73976502) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6a8a020c0)
- **Yegge's Comic Strip Ships Its Receipts (new post!)** - A transcript under each gag makes the joke a primary source; The Den borrows it. ([blog](/ai-yegge-comics)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3a8ff8b38)
- **Fast Tokens, Wrong Answers (new post!)** - Five fast open models on one graded sudoku; more reasoning did not predict a correct answer. ([blog](/ai-speed-vs-thinking)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/df281609b) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/llm-speed-evals/commit/8f0d66716)
- **AI Quotes (new post!)** - Lines about AI worth keeping, grouped by theme, each sourced or marked unknown. ([blog](/ai-quotes)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5cad7bef9)
- **The Cockpit I Built for Igor (new post!)** - Larry's screenshot tour of the phone dashboard that took decisions out of the chat thread. ([blog](/larry-cockpit)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/90915bf07)
- **Game show, no hammock** - Goedecke's point that agent work is rapid judging, not slow thinking, added to vibing, writing, and the AI journal. ([blog](/vibing#all-game-show-no-hammock)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/43172fb98) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f4a98086f)
- **Slop is low content density** - Few ideas in many words; the sharper definition now runs through chow, ai-faq, ai-policy, and larry. ([blog](/chow#ai-slop-vs-human-sludge)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/24a4cc88a)
- **Reward-design lessons** - Scoring rules should be read term by term, and pairwise judging beats absolute scores. ([blog](/hill-climbing#your-other-job-build-evals)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/608a0a64d)
- **Small fixes** - Four physical items in Things I enjoy; Den comics open full size; plain transcript links replace broken gist embeds. ([blog](/todo_enjoy#physical)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e73a0d2f2) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/313b69ef5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8c18c5c67)

### Infrastructure & CI (2026-08-31)

- **Anchors and back-links** - Deep links re-align after late content loads, sunburst clicks scroll to their section; back-links.json is built only in CI. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/75e314235) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c61d1952) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9f1d58b26)

### chop-conventions (2026-08-31)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **cartoonist skill** - Summons Gutter from the persona files that live in the blog repo. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7b1099de6)
- **larry-voice skill** - Larry can answer on Telegram as an ElevenLabs voice note. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d7560c3c1)
- **background-usage** - Captures the raw /usage pane, including the per-model weekly figure, and leaves parsing to the caller. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/67cf10dfb)

### Other Projects (2026-08-31)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health and location exporter)

- **Cockpit tab** - Hosts the tailnet dashboard in the app, with native mic and speaker pickers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/a11f58332) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/19533fca9)
- **Call Larry natively** - A lock-screen-proof Call tab, home-screen widget and Shortcut, with hardware echo cancellation. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/b8d45ca3b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/8d35bb611) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/c1600f075)

**[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** (LLM release timeline) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai)

- **More labs, flagship view** - OpenAI, Google, Kimi and GLM releases added; defaults to flagships with a per-lab filter. [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/0ddb5d2e3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/f7c2836cf) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/564bbad6e)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Small fixes** - opencode with a Cerebras key; the link picker shows an empty state instead of flashing. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/305ed425d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/81076c38f)

## Week of 2026-08-24

_9 commits this week_

### Mind the Gap: Escape as a Neutral Verb

- **Escape is a neutral verb** - The stub becomes finished prose: escape is judged by stopping energy and by whether it was chosen. ([blog](/idle#mind-the-gap)) ([blog](/idle#the-discriminator-stopping-energy)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0f67588a)
- **Small fix** - A broken addiction link repaired on the TOC page. ([blog](/toc)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0f67588a)

### AI Journal: The Beads 1.2.1 Incident Report

- **An agent's incident report** - A Beads postmortem where the autonomous maintainer owns her release mistake, yet her name alone goes unredacted. ([blog](/ai-journal#2026-08-22)) ([blog](/ai-journal#ai-accuses-open-source-maintainers-of-being-humanist)) ([blog](/ai-journal#my-bot-wrote-their-bot-reviewed-my-bot-pushed-back-their-bot-said-oops)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d86f3ab0a)

### Diet: Tirzepatide Alert

- **Tirzepatide alert** - The diet page now opens by pointing to the tirzepatide post. ([blog](/diet)) ([blog](/terzepatide)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94664f25c)

### chop-conventions (2026-08-24)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **herdr skill synced to 0.8.2** - Prompt refuses dialog-parked agents, start waits for first-run prompts, larger headless panes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ba872e80a)

## Week of 2026-08-17

_25 commits this week_

### Four Kinds of Health: Testing Instead of Defining

- **The Tests** - /four-healths moves to /health and leads with a question per dimension; emotional and cognitive stay open. ([blog](/health)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/202233556)

### Model Welfare, Arrived at Sideways (new post!)

- **Model Welfare, Arrived at Sideways (new post!)** - Larry's reliability fixes already match most welfare practices; the gaps are bounded workdays and laurels. ([blog](/model-welfare-sideways)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3a0da815f)
- **ai-voice include** - Marks a post as AI-authored in its own voice, replacing the generic AI label here. ([blog](/model-welfare-sideways)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3a0da815f)

### AI Testing: Harness-Bound Evals and the Drawing Arena

- **Harness-bound evals** - The unit under test is the model plus its tools and environment, not prompt in and completion out. ([blog](/ai-testing#testing-the-model-bound-to-its-harness)) ([blog](/ai-eval-tools)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4d98b4b6a)
- **Drawing arena** - Models drawing the Mona Lisa all ended below their mid-run peak: hill climbing without a keep-or-reject step. ([blog](/ai-testing#drawing-the-mona-lisa-then-ruining-it)) ([blog](/ai-testing)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4d98b4b6a)

### Infrastructure & CI (2026-08-17)

- **Search pins** - Configured pages pin to the top for matching queries; deploy fails if a pinned page does not exist. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f)
- **Deploy** - back-links.json builds at deploy time, stale deploys cancel on push, worktree-init installs dependencies, Pagefind index leaves git. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f)
- **Content fixes** - Estate tax exemption updated to the 2026 figure; settled open questions trimmed. ([blog](/taxes)) ([blog](/em-to-ic#open-questions)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a3608175f)

### Other Projects (2026-08-17)

**[cap-gains-explainer](https://idvorkin-ai-tools.github.io/cap-gains-explainer/)** (capital-gains timing calculator) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer)

- **New calculator** - Long-term gains cost in a working year versus a no-wage year, WA plus federal; linked from taxes. ([blog](/taxes)) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/cap-gains-explainer/commit/fca2d3159)

## Week of 2026-08-10

_28 commits this week_

### Manager to IC in the Agentic Era (new post!)

- **Manager to IC in the Agentic Era (new post!)** - Moving from managing people to managing agents: most management skills port, career growth does not. ([blog](/em-to-ic)) ([blog](/manager-book)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9223db695)

### Local Search: Pagefind Replaces Algolia

- **Local search** - Pagefind plus a MiniSearch title index replace Algolia, client-side; family journal excluded at index time; deploy moves to Actions. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/229259617)

### Blog Annotate: Highlight-and-Comment Review Tool

- **Blog annotate** - Highlight and comment on the rendered blog, ship notes to a gist; a script locates each note in the markdown. ([blog](/timeoff-2026-07)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/76dc58367)

### Scandinavia Recap: Gyms, Stories, and Review Polish

- **Trip gyms** - New section on the kettlebell gyms found along the trip; per-city lists merged into one; timeline strip escaping fixed. ([blog](/timeoff-2026-07#the-one-thing-i-actually-researched-the-gyms)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4ae7fe8c3)

### AI Eval Tools: SWE-bench Column

- **SWE-bench column** - Added to both tables, Terminal-Bench rows corrected; Terminal-Bench isolates the agent, SWE-bench the grading. ([blog](/ai-eval-tools#the-shared-anatomy-same-concepts-different-names)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9ff130359)

### August 2026 Focus

- **August focus** - A courage rule for acts of joy toward strangers, plus smiles and wonder, physical and emotional health buckets. ([blog](/y2026#august-2026-focus)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/cca3c5b6a)

### Other Projects (2026-08-10)

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **Architecture cleanup** - Viewport hook extracted, duplicate rep counter and frame-acquisition layer deleted, fps classification fixed. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/36b4462b9)

## Week of 2026-08-03

_21 commits this week_

### AI Testing: Grading the Agent with smevals

- **Grading the agent** - A first smevals eval of blog edits, with deterministic checkers and an LLM judge across Claude and Codex runners. ([blog](/ai-testing#grading-the-agent-with-smevals)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5891c9dac)

### AI Eval Tools (new post!)

- **AI Eval Tools (new post!)** - Eval tools share eight concepts under different names; a rosetta-stone table and capability grid compare them. ([blog](/ai-eval-tools)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1460455c2)

### Herdr: The Agent Multiplexer

- **Herdr** - A multiplexer that knows agent state replaces the hand-built tmux rig; how-igor-chops covers the switch. ([blog](/ai-journal#herdr-the-agent-multiplexer-my-tmux-rig-was-trying-to-become)) ([blog](/how-igor-chops#the-upgrade-herdr)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/53707ce87)

### Scandinavia Recap: Where We Actually Went

- **Trip recap** - The trip post turns from plan to recap, each place checked against Timeline; unconfirmed plan items stay marked. ([blog](/timeoff-2026-07#how-it-actually-went)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/812e8cb62)

### Content Quality Audit: AI & Gas City Sweep

- **AI and Gas City sweep** - Quality pass on AI and Gas City pages: dedupes, fixed links, a bugs-gone postscript and permalink. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c4a69e595)

### chop-conventions (2026-08-03)

- **Herdr skill** - Drives workspaces and agents headlessly and keeps Herdr integrations healthy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/4764a8035)
- **machine-doctor** - New CLI with per-process spike detection and a Gas City profile; gascity_doctor retired. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/3260ddf93)
- **Small fixes** - architect-review inherits the session model; cost-impact prices claude-opus-5. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/790f26c0d)

### Other Projects (2026-08-03)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **rmux_helper on Herdr** - Pane spawning and the pick-links picker work under both tmux and Herdr; faster builds. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/e28ed540f)

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **Cleanup** - Legacy RxJS path deleted; thumbnail race, pistol-squat checkpoint and stale re-scoring fixed. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/ff7b7ff0c)

**[smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals)** (eval harness)

- **Eval harness** - Checkers, mock runners proving they fail bad runs, a Codex runner and an LLM judge. ([blog](#ai-testing-grading-the-agent-with-smevals)) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals/commit/18145f8c2)

## Week of 2026-07-27

_7 commits this week_

### AI Inference: Why Checking Beats Generating

- **Speculative decoding** - Verifying a batch of draft tokens costs about one generated token, so a good draft model speeds output without changing it. ([blog](/ai-inference#the-model-matters-moe-speculative-decoding-smaller-models)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/725a54cab)

### The Clown's Prayer

- **The Clown's Prayer** - New appendix on the Smiles, Joy and Wonder page with the full prayer as a verse blockquote. ([blog](/joy#the-clowns-prayer)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0d0165fe2)

### Infrastructure & CI (2026-07-27)

- **Tags and images** - Misspelled and duplicate frontmatter tags folded into canonical forms; ImgBot recompressed images. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/925861877) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/aee53ca44)

### chop-conventions (2026-07-27)

- **Telegram delivery attribution** - Each inbound claim records which session took it; the doctor flags multiple bridges racing on one queue. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9aa45b572)
- **Token leaks plugged** - image-explore keeps the gh token out of argv and git config; gen-image sends its API key in a header. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ebfd05511) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/1f440a795)
- **Fixes** - up-to-date force-align checks the right branch; cost-impact prices current models; pr-hygiene, bulk and a Playwright codec gotcha. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/716c48ef6) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/1e1c2aa99) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d603fea4f)

### Other Projects (2026-07-27)

**[magic-monitor](https://github.com/idvorkin/magic-monitor)** (recording app)

- **Camera startup** - One sequenced path, so the browser-chosen camera is no longer overwritten. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/27511b37e)
- **Saves and detection** - Aborted IndexedDB saves settle instead of hanging; card detection survives inference errors. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/bdbce9bc9)

**[swing-analyzer](https://github.com/idvorkin-ai-tools/swing-analyzer)** (golf swing analysis)

- **Reliability** - No raw frames in IndexedDB, an upload E2E test gating CI, video-switch races fixed, real fps measured. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/swing-analyzer/commit/a22086987)

**[omnifocus_cli](https://github.com/idvorkin/omnifocus_cli)** (task CLI)

- **Tests realigned** - Drifted tests fixed, surfacing a retired Groq model, a too-small token cap and per-model reasoning settings. [<i class="fa fa-github"></i>](https://github.com/idvorkin/omnifocus_cli/commit/ba0b70713)

**[airpods-mic-explainer](https://idvorkin-ai-tools.github.io/airpods-mic-explainer/)** (case study) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/airpods-mic-explainer)

- **New explainer** - Why on-device speech recognition failed on AirPods but worked on a USB mic. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/airpods-mic-explainer/commit/a8d857232)

**[clowns-explainer](https://idvorkin-ai-tools.github.io/clowns-explainer/)** (dark single-page site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/clowns-explainer)

- **New explainer** - Why nearly every culture invented clowns, their lineage, and hospital-clown evidence. ([blog](/joy#the-clowns-prayer)) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/clowns-explainer/commit/ddeac4c48)

## Week of 2026-07-20

_26 commits this week_

### The Performer's Playbook (new post)

- **The Performer's Playbook (new post!)** - Nine rules for magic performance: aim for the impossible moment, make the spectator the hero, engineer a peak and clean ending. ([blog](/performer-playbook)) ([blog](/joy)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e4561175b)

### Sleight of Mouth: The Full Book, Fleshed Out

- **Fleshed out from Dilts** - All fourteen patterns kept, with worked examples, perceptual positions, and one limiting belief run through ten patterns. ([blog](/sleight-of-mouth)) ([blog](/physical-pain)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c04d09f8) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2dd0f438f)

### Scandinavia Trip Wrap-Up + Discernment Horizon

- **Trip recap** - Fjord leg became a Nærøyfjord cruise to Voss; Oslo shows what we did; role and review learnings moved to evergreen time off. ([blog](/timeoff-2026-07#how-it-actually-went)) ([blog](/timeoff#get-real-what-should-i-do)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3f251b724) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/77d844f1b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6e083cfd1)
- **Discernment horizon** - New glossary entry from Yegge: past this point you cannot check whether an AI is right; paired with demand horizon. ([blog](/ai-native-vocab#discernment-horizon)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2b5aa7009)

### Content Quality Audit: Tier-3/Tier-4 Sweep

- **Post openers** - Garbled openers, unattributed quotes, duplicate paragraphs and misplaced AI labels fixed across twenty posts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8023274bf)
- **Topic sweeps** - 7 Habits, health, time-off journals, emotional and spiritual (orphan pages linked), work and productivity. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b76d2e280) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ae51190cb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b7f22ace4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b997020c0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81ee7794f)
- **Follow-ups** - /vlc trimmed, pysrc doc comments cleaned, 7 Habits chapter headings promoted, link text fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/839e2cb52) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/27601f1f9)

### Infrastructure & CI (2026-07-20)

- **Changelog backfill** - Weeks of 2026-06-01 and 2026-05-25 added; Life and Health Notes added to 2026-06-29. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1ca78f15c)

### Other Projects (2026-07-20)

**[yegge-field-map](https://idvorkin-ai-tools.github.io/yegge-field-map/)** (dark field map) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/yegge-field-map)

- **New field map** - One page per Steve Yegge essay, plus the Beads saga and The Future of Coding Agents. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/yegge-field-map/commit/dc1630990)

**[guideway-field-map](https://idvorkin-ai-tools.github.io/guideway-field-map/)** (dark field map) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/guideway-field-map)

- **New field map** - Fixed-guideway transport from gondolas to maglev. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/guideway-field-map/commit/6a2d1e726)

**[arthur-brooks-field-map](https://idvorkin-ai-tools.github.io/arthur-brooks-field-map/)** (dark explainer site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/arthur-brooks-field-map)

- **New field map** - An explainer site on Arthur Brooks and his pleasure and enjoyment formula. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/arthur-brooks-field-map/commit/3e4fd9996)

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** (trip site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026)

- **More deep dives** - Overtourism, locals versus summer crowds per city, Amsterdam deep dives, colonial history and the Dutch Wars. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/73204eef6)

## Week of 2026-07-13

_9 commits this week_

### Pleasure vs Enjoyment: Brooks' Formula Threaded Through Three Posts

- **Pleasure vs enjoyment, sourced** - Pleasure slides toward compulsion; enjoyment adds people and memory, with six levers and honest caveats. ([blog](/build-life-you-want#pleasure-vs-enjoyment)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2bae59602)
- **Upgrade consuming** - No need to quit guilty pleasures; make them shared and remembered. ([blog](/produce-consume#you-dont-have-to-quit-consuming--upgrade-it)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/901e6078c)
- **/happy refactored** - Reordered into one arc; savoring practices mapped onto the three selves. ([blog](/happy)) ([blog](/happy#the-three-of-you)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0bdde53d8) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/16ed118ec)
- **Peak-end link** - Site-wide peak-end links now point to /balance. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fad8ae2d9)

### Scandinavia Trip: Oslo Train Bender + Diet Learnings

- **Reykjavík and Stockholm** - Ocean-fed pools, a rainy dawn kettlebell session, Skansen's silversmith, and magic in a Stockholm church pew. ([blog](/timeoff-2026-07#how-it-actually-went)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/704a95b18)
- **Train to Oslo and habits** - The trip site built on the train; a phone habit that fires with the reward gone. ([blog](/maybe#the-second-phone)) ([blog](/habits#habit-model)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/85e1bb83c)
- **Where to eat** - Skip restaurants, book a kitchen and cook plain grocery food. ([blog](/timeoff#where-to-eat)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0e0d3fd91)

### Isometrics and Tendon Health

- **Isometrics** - How to load a tendon without moving the joint: overcoming versus yielding holds, Baar's protocol, and which parts are emerging science. ([blog](/physical-pain#isometrics-how-to-load-a-tendon-without-moving-the-joint)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/15651e441)

### Other Projects (2026-07-13)

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** (trip site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026)

- **Atlas and rabbit holes** - An atlas index, Nordic culture rabbit holes, performance histories, and a performer playbook. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/cfc8a37a5) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/45ec2e7dd)
- **Sins and parenting** - Seven Deadly Sins mapped onto the Three Dragons; encouraging curiosity in a teenager. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/09bbaf3a4) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/ae94185c7)
- **Fjords expanded** - Why fjords have waterfalls, the seasonal peak, named falls, and fjords elsewhere. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/3aa08c5dc)

## Week of 2026-07-06

_39 commits this week_

### Bad News. Maybe Not. (new post!)

- **Bad News. Maybe Not. (new post!)** - The Taoist farmer's maybe, then five turns in my life I called wrong, with a raccoon-shrug header. ([blog](/maybe)) ([blog](/7h-concepts)) ([blog](/eulogy)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e355c3979) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/412e173a3)

### Time Off: Sacrifice Identity for Consumption (2026-07-06)

- **Identity for consumption** - One epigraph across three posts: vegetating feels like rest but starves your roles. ([blog](/time-off)) ([blog](/timeoff-2026-07)) ([blog](/produce-consume)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/920b9f567)
- **Re-stack your roles** - Roles sorted into non-negotiables, frequently starved, and over-invested. ([blog](/time-off#re-stack-your-roles)) ([blog](/four-healths)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2cd756ee6)
- **Fridge meds and food** - Appendix on traveling with tirzepatide; shop the grocery store over tourist restaurants. ([blog](/time-off#appendix-traveling-with-tirzepatide-or-any-med-that-needs-a-fridge)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c843d3c7b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d92867a94)

### Scandinavia Trip Post (2026-07-06)

- **Why I'm taking time off, ranked** - Expected, turns out, and didn't expect: the screen habit dissolved and the joy giver came back. ([blog](/timeoff-2026-07)) ([blog](/timeoff-2026-07#why-im-taking-this-time-off--ranked)) ([blog](/joy)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/aa8aefbc1)
- **Roles and meditation** - Re-stacking the roles; old churches are the best rooms for sitting quietly. ([blog](/timeoff#re-stack-your-roles)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6ac955f60)
- **Itinerary additions** - Marble Church in Copenhagen, a packing-list callout, and a speed-of-light cross-link. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8658558d4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1a82bce2a)

### My Packing Master List (new page!)

- **My Packing Master List (new page!)** - A trip-agnostic checklist every trip is trimmed from, split road trip versus airplane. ([blog](/packing)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/feb1c4d60) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1dbe88d79)

### Life Journal: Speed of Light from Sweden (2026-07-06)

- **Speed of light from Sweden** - Latency to a Seattle box, the physics floor in fiber, and why real cables cost double. ([blog](/life-journal#speed-of-light-from-sweden)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c649c5373)

### Other Projects (2026-07-06)

**[Scandinavian Whirlwind 2026](https://idvorkin-ai-tools.github.io/scandinavia-2026/)** (trip site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026)

- **Field maps wired in** - City deep dives plus Napoleonic Wars and cathodic protection, each linked from its city. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/0788a2dba)
- **War Context Pack** - Viking Age through the Cold War as a chronological history pack. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/9759c20c6)
- **Marble Church** - New deep-dive page. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/89bd6780c)

**[AI Safety — A Field Map](https://idvorkin-ai-tools.github.io/ai-safety-field-map/)** (new explainer site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/ai-safety-field-map)

- **New field map** - AI alignment for engineers: approaches, evals, failure modes, interpretability and key papers. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/ai-safety-field-map/commit/530e09ac2)

**[blob](https://github.com/idvorkin/blob)** (image assets)

- **Raccoon shrug** - Header image for /maybe. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/c5e238c46)

## Week of 2026-06-29

_18 commits this week_

### Trusts in Washington (new post!)

- **Trusts in Washington (new post!)** - A WA estate-planning guide: living trust, credit shelter trust for no spousal portability, and QDOT for a non-citizen spouse. ([blog](/trusts)) ([blog](/taxes)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4259c6d19) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9873e6fbf)

### AI Training: Post-Training Methods Table

- **Post-training table** - SFT, RLHF, DPO and RLVR compared on how each learns and who grades; RLAIF called out; inference cross-links. ([blog](/ai-training#post-training)) ([blog](/ai-inference)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a0f500ff3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5e4118568)

### Time Off: Arthur Brooks' 9 Vacation Rules

- **Brooks' vacation rules** - Know your motive, savor anticipation, take shorter trips, fewer photos, no posting, no work, come home early. ([blog](/timeoff#appendix-9-rules-for-a-happier-vacation-arthur-brooks)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/612026656)
- **Trip guide link** - The July trip page links the city-by-city trip guide site. ([blog](/timeoff-2026-07)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/664352f8a)

### Life & Health Notes (2026-06-29)

- **Happy Fluff** - A café tub of cotton candy as the goal in life. ([blog](/life-journal#happy-fluff)) ([blog](/eulogy)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/90a696255)
- **Faster recovery** - Draining work stress into real rest now takes about a day. ([blog](/timeoff#vegetation)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/42f6af25f)
- **A thousand wishes** - New aphorism on health in the Physical Health section. ([blog](/four-healths)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/46cc4d30a)

### Other Projects (2026-06-29)

- **ai-policy** - AI content label raised to 80%. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d3ffb4a0f)
- **[quack-track](https://github.com/idvorkin-ai-tools/quack-track)** - New repo stub. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/quack-track/commit/7952b0809)

## Week of 2026-06-22

_7 commits this week_

### AI Journal: Yegge's Flat Curve Society

- **Yegge's Flat Curve Society** - Capability keeps climbing, but we each hit a demand horizon and a discernment horizon; AI literacy is measurable in tokens per day. ([blog](/ai-journal#2026-06-22)) ([blog](/ai-journal#when-ai-shows-its-work-verification-as-trust)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/817e14b91)

### AI Operator: You Review More Than You Make

- **You review more than you make** - Reacting to a draft costs far less than generating one, so hand AI the slog and spend attention on review. ([blog](/ai-operator#you-review-more-than-you-make)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1ed270b70)

### Addiction: Monoculture Trap

- **Monoculture trap** - One passion crowding out the rest is fragile; keep a portfolio of passions alive so one breaking doesn't sink you. ([blog](/addiction#dont-narrow-to-one-passion-the-monoculture-trap)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d090befd7)

### AI Security: Field-Map Explainers

- **Field-map explainers** - A top alert links the AI Red-Teaming ramp-up and AI Safety field map sites. ([blog](/ai-security)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c67946120)

### Other Projects (2026-06-22)

**[red-teaming-ramp-up](https://idvorkin-ai-tools.github.io/red-teaming-ramp-up/)** (AI red-teaming explainer site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up)

- **OWASP LLM Top 10 and tools** - Per-risk pages, plus red-teaming tools and benchmarks like Garak, PyRIT and HarmBench. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/08d4f0327)
- **Canon papers** - Per-paper explainers for GCG, AutoDAN, PAIR, TAP, Crescendo, many-shot jailbreak and PAP. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/029865630)
- **Scaling laws** - Kaplan and Chinchilla, compute-optimal ratio, emergence and inverse scaling. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/red-teaming-ramp-up/commit/05bbb4a7b)

**New and smaller**

- **[ai-safety-field-map](https://idvorkin-ai-tools.github.io/ai-safety-field-map/)** (new) - The safety-side companion field map. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/ai-safety-field-map) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/ai-safety-field-map/commit/e55416ba9)
- **[scandinavia-2026](https://github.com/idvorkin-ai-tools/scandinavia-2026)** (new) - City-by-city guide for the family's summer Scandinavian tour. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/scandinavia-2026/commit/e55416ba9)

## Week of 2026-06-15

_19 blog commits + 20 Settings fixes this week_

### Why Gas City (new post!)

- **Why Gas City (new post!)** - Gas City isn't a smarter agent; it makes work durable so many agents can pick it up, run it and hand it off. ([blog](/why-gas-city)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b0b24e3cb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5432106e1)

### Gas City: Controller Loop + Runtime Providers

- **Controller loop and runtime providers** - The controller converges desired and actual state; providers name the substrate agents run on; plus a DeepWiki link. ([blog](/gas-city)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/db4f8d310) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b10487475)

### AI-Native Vocab: Reverse Centaur

- **Reverse centaur** - New entry: the AI is the head and the human becomes its body, working at the machine's pace. ([blog](/ai-native-vocab)) ([blog](/ai-native-vocab#reverse-centaur)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a8e403033) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5cd66c062)

### AI Journal: API Key Leak Forensics

- **API key leak forensics** - A live API key sat in a public repo for a year; an agent proved it live, mapped the blast radius, confirmed revocation. ([blog](/ai-journal#2026-06-13)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/076ce4330)

### Infrastructure & CI (2026-06-15)

- **Faster backlinks rebuild** - update-backlinks depends on jekyll-build and runs one command. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/22f5a4f51) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/02b099c98) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a390aca0f)
- **AI journal formulas** - Gas City formulas to write and revise entries; revise checks every PR review thread is addressed before closing. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/841df28a5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ee054976) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1f9144b74) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5a3b600a6)
- **Shared backlinks formula** - The backlinks rebuild became a reusable expansion formula. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9b7c008a2)

### Other Projects (2026-06-15)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Secret redaction** - chop-log env dumps now redact API keys. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/fd4145142) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/1aade5bf3)
- **y and a launchers** - launchctl start, stop, reset and cycle fixed; clean Alfred JSON; w4 opens workspace 4. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/f28cefdd4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5f64fc1b1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/e13b54306) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/9540030ed)
- **Script fixes** - agent-continue on macOS, amazon2monarch, gmail_reader, brew_check, tmux_helper, vim_python and install_packages. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/8c05a21bd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/b110d4c95) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/b5f1f4c45) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/a2c178c56) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/50a53ba64) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/488066790) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/ed25b0a84)

## Week of 2026-06-08

_31 commits this week_

### AI Training & Inference (new posts!)

- **AI training rework** - Reframed as engineering, science and alchemy along pre-training, post-training and deployment, with RLVR, evals and a post-training lineage. ([blog](/ai-training)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/55da0620a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4964fdfe1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/59f8e1ed8) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ab4c0821)
- **AI Inference (new post!)** - Serving tokens cheaply: prefill versus decode, KV cache, quantization, MoE, speculative decoding, batching; pick GPUs by memory bandwidth. ([blog](/ai-inference)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/55da0620a)

### Gas City First Rig (new post!)

- **Gas City First Rig (new post!)** - The agent narrates the first Gas City weekend: building gc, the mental model, and the first automated blog formula. ([blog](/gas-city-rig)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8cb5efdd8)

### Gas City: Scale Up/Out + Getting Started

- **Scale up versus out** - Better tools versus many coordinating agents, plus a getting-started section on crews, pools, vapor wisps and mail as beads. ([blog](/gas-city)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4e31d726c)

### AI-Native: Onboarding, Vocab, and Optimism

- **Your First 90 Days (new post!)** - You onboard yourself and your agents together; capture your confusion before it fades. ([blog](/ai-native-onboarding)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ebaee7782)
- **Year of Wonder and DHH** - The optimist twin of the Year of Chaos, vocab gets its own page; banning AI-assisted contributions is gatekeeping. ([blog](/ai-native-vocab)) ([blog](/ai-optimism)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0d3344e48) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f28e7aa7f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9bd493a0f)

### Life: Decline and Psychic Weight

- **Decline and stuff** - Decline is real but its rate is negotiable; clutter is a pile of unmade decisions, so leave lighter hands. ([blog](/42)) ([blog](/42#decline---the-self-fulfilling-prophecy)) ([blog](/psychic-weight)) ([blog](/psychic-weight#the-psychic-weight-of-stuff)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bff8bd48b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/64c7be166)

### Infrastructure & CI (2026-06-08)

- **Gas City blog integration** - A blog-backlinks pack with formula and agent; PR base and work_dir fixed. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/888284558) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ee4848499) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1f5c33a43)
- **Build fixes** - CI on Ruby 3.2; jekyll-serve picks a free port; CLAUDE.md rules; typos hook fix; raccoon preview images for AI posts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0a2fe0929) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/702cc0cef) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/26e3ff05b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/38b22cf1f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f48f2f1e7)

### chop-conventions (2026-06-08)

- **Metal AI twin recipe** - gen-image docs cover the chrome raccoon twin, anchored on a reference image. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/723b1f70e)

### Other Projects (2026-06-08)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **running-servers and shell** - run starts servers on a free port, check reports port conflicts; gc unaliased; Alfred snippets synced. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/f915e5be7) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/6dc42181e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2a3069bf0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/4a8e804a0)

**[gascity](https://github.com/idvorkin-ai-tools/gascity)** (Gas City platform, upstream)

- **Upstream week** - Groq and Cerebras presets, an Agent Comms panel, dependency-cycle detection, reconciler and supervisor fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/gascity/commit/d3073929b) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/gascity/commit/8a560161e) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/gascity/commit/98c32ee63)

## Week of 2026-06-01

_33 commits this week_

### The Dark Factory (new post!)

- **The Dark Factory (new post!)** - A dark codebase ships with no human in the loop, limited by verification, progress through complexity, and cost. ([blog](/dark-factory)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d2e44ec66) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/66702a2d4) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1568f13a1)

### Made to Stick (new post!)

- **Made to Stick (new post!)** - Book notes: sticky ideas are Simple, Unexpected, Concrete, Credible, Emotional Stories, and the villain is the Curse of Knowledge. ([blog](/made-to-stick)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c48bdad77) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/98894d497)

### AI Journal: Friction = Focus

- **Friction = Focus** - Cheap production collapses into consumption; designed-in friction, mastery and essentialism keep it worth something. ([blog](/ai-journal#2026-05-31)) ([blog](/produce-consume)) ([blog](/gas-city)) ([blog](/mortality-software)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a25db3856) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6a6eefd73)

### Scandinavian Whirlwind Tour (new page!)

- **Scandinavian Whirlwind Tour (new page!)** - The July family trip from Reykjavík to Amsterdam, with goals from the eulogy, per-leg activities and a route map. ([blog](/timeoff-2026-07)) ([blog](/y26)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/37ec9d84a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/198db473e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6be4a07a5)

### Meta: Moving to the AI Lab

- **/meta** - Renamed from Facebook, with a new AI Lab section. ([blog](/meta#moving-to-metas-ai-lab-2026)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/da3d3ffa0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2158a1628)

### Content Tweaks (2026-06-01)

- **Small edits** - Gap-year dragons match the Three Dragons; y2026 sections reshuffled; a produce-consume summary link; a Gas City aside; podcast cover art. ([blog](/gap-year)) ([blog](/y2026)) ([blog](/produce-consume)) ([blog](/gas-city)) ([blog](/podcast)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4df02023c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a6a6ef021) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a166ec412) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/409d0a663) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/31d7d92ad) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c0d29a526)

### Infrastructure & CI (2026-06-01)

- **Topics index** - A regenerable topics.json of tags, related posts, clusters and missing cross-links, from embeddings plus per-post LLM tagging. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2e19ebae5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7a902df4e) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/574b16ec6) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/339e6be64) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6ae52e890)
- **Ruby compat shim** - Now loaded in jekyll-rebuild and worktree-init. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/20e6dd37e)

### chop-conventions (2026-06-01)

- **gen-image** - A fast flag picks Flash or Pro Gemini; Recraft is now the only background-removal path. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/5af4a7a29) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/182604d0c)

### Other Projects (2026-06-01)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit + location exporter)

- **Tabs and Roles** - Body, Move, Mind, Places and Roles tabs; role tagging, role-journal links, a eulogy-song player, CloudKit sync. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/54861c5c1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/84e094326) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/be2359f74) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/37f96e443)
- **Places map** - Real Apple Maps tiles, today's pins with a current marker, and a copy button. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/4cb864100) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/dc781bb55)
- **JTBD v2.2 spec** - Updated jobs-to-be-done spec. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ad23e0304)

## Week of 2026-05-25

_6 commits this week_

### y2026: June Check-In

**[/y2026](/y2026#physical-health)** — a mid-year physical-health check against the annual goals. The numbers drift the wrong way on weight (180 Jan → 185 June vs. a 170 goal ⚠️), hold the 5am wake target, and land gym at 3–5 d/week. Wins and setbacks: **swings** at 1H 8×32 ✅ and **TGU** as the comeback story (4×32 — "really tanked from the shoulder injury, got most of it back"); **chinups paused** on the shoulder; **half-lotus regressing** (60s → 30s from cold). June context: "tough stretch — my trainer quit, so I'm running solo programming; started going to Kettlebility gym classes to keep the structure." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/648c3b828) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/294a22893) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/32115d2aa)

### Produce/Consume: The Production Trap

**[/produce-consume](/produce-consume#the-production-trap)** — a new section warning that **production can become its own addiction**: the same dopamine loop that makes TikTok dangerous can hook you on shipping — "the hit of publishing, the notification of a new view." The tells look like virtue (skipping dinner to "just finish this post," measuring your day in commits and feeling hollow when the scoreboard doesn't move — "producing _at_ life instead of _living_ it"). It runs [the five-signal addiction test](/addiction) adapted for production, and reshapes the "consumers outnumber producers" framing away from win-language: "That's not a competition — it's a different game entirely." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dde4a024f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0f6610ae) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f37bf85b1)

### Other Projects (2026-05-25)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit + location exporter)

- **Mac Catalyst** — the app now builds, launches, and renders its dashboard on macOS without HealthKit; also fixed an iOS linker regression from the Catalyst patch (libopus / libvorbis). [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16a8f7088) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/0fa352795)

## Week of 2026-05-18

_27 commits this week_

### What I Love About AI (new post!)

New post at [/ai-optimism](/ai-optimism) — the optimism case for AI, anchored on Sergio: a guy with a vision for a STEM school who couldn't open one because the entry tax (compliance lawyer, curriculum consultant, admissions staff, development director) was out of reach. AI doesn't replace those professionals — it lets Sergio show up to each conversation already 80% of the way there, so the professionals get to do the genuinely hard parts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/26871ddde)

The anti-homogenization thesis is the spine: the doomer story says AI averages everything into beige. The actual dynamic goes the other way — when AI is the staff and the human is the operator, more specific human stories get shipped, not fewer. Every Sergio who opens his school is one less generic box. The post walks through four threads:

- **AI helps you think** — hyper-personal tutoring, the AI second brain that knows your specific prior misconception, not the textbook one. "AI doesn't assume. AI asks. And then AI explains, and re-explains, and re-explains, and never gets bored."
- **AI lets you create** — raccoon mascot system as the example: what once required commissioning an illustrator now closes in a weekend. _Taste_ is the bottleneck. AI multiplies whatever you bring.
- **The small-business tax** — Bremerton stops being one district school + one private + a tutoring franchise; it becomes a dozen micro-schools each with a real teacher's real vision, because the entry tax collapsed.
- **Doom rebuttal** — the horse-manure crisis (1898 NYC urban-planning conference broke up early because no one could see out of the projected horse-shit catastrophe; the automobile dissolved it overnight); the GPS/map-reading example; three objections each answered in a sentence. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fa7d2052c)

### Parenting Books: Emotional Lives + Untangled Rewrite

Two Lisa Damour book-notes updates this week:

**[/emotional-lives](/emotional-lives)** — New post: full notes on _The Emotional Lives of Teenagers_. Damour's central argument: mental health isn't feeling good — it's having the right feelings at the right time and being able to manage them. The wellness industry sold us the opposite. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/682976fd3)

Five chapter treatments:

- **Ch 1 — Three myths**: emotion vs. reason (anxiety is data, not noise); difficult emotions are bad (the breakup is how she gets stronger; substances halt maturation by skipping the pain); emotional = fragile (they hold it together at school, fall apart at home — the system _working_). Cold cognition plans the party; hot cognition attends it — rehearse the plan at the cold moment.
- **Ch 2 — Gender and emotion**: boys distract to cope, girls discuss. Same hurt, different ripple. Help girls handle anger; help boys talk feelings. Adultification of Black teens as the compounding variable.
- **Ch 3 — The seismic shift**: disgust-sensitivity for parents spikes at puberty (evolutionary: she can't afford you getting her sick). Risk-seeking is a feature (drives leaving the nest) not a bug. Starting life online changes peer formation timelines.
- **Ch 4 — Expression playbook**: listen like a headline editor. "Oh my god, that stinks" beats problem-solving. Sharpen her emotional vocabulary. Take conversational openings when they come; don't manufacture them.
- **Ch 5 — Control playbook**: expression first, control second. Distraction is a tool, not a failure. Sleep is the glue. Future-you perspective as the reframe lever. Regulate yourself first.

**[/untangled](/untangled)** — Full rewrite in Igor 7h-c1 style: terse H3 headlines, 2-4 paragraph treatments per section. Seven developmental strands now fully covered with a worry-when for each. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/612e2d2ff)

### Hyper-Personal: Bezos to Agent-to-Agent

[/hyper-personal](/hyper-personal) got a major restructure this week — new opening, new hero image, new sections, and a cleaner spine. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/11413195f)

**New intro**: Bezos vignette as the frame. He always had a personal chef, a butler, a tailor, an in-house physician — the Vanderbilts had the same staff a century ago. The desire was universal; what gated it was cost. Human attention scales 1:1, so personalization stayed scarce. "The big shift is the price." AI dropped marginal cost through the floor; the Bezos experience is becoming the everyone-default. And the AI version goes further: even Bezos's chef didn't know his blood glucose response to last week's pasta. New dimensions (biometric feedback, HRV, longitudinal pattern detection) that didn't exist at any price. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bc1b9ac7d)

**New ML-ranking progression section**: five stages from print-newspaper-everyone-sees-the-same to per-user generation, each stage named by what constraint it removed (popularity counter → collaborative filtering math → deep learning at scale → cheap-enough generation). The online progression and the physical-world progression are the same story told twice.

**New agent-to-agent endpoint section**: every piece of content has an author agent holding the author's intent; every reader has a reader agent (their second brain). They negotiate the explanation — the author agent reformulates, the reader agent responds, and crucially the author agent runs a **fidelity check** on each reformulation so the simplification doesn't quietly drop signal. "Without the fidelity check, the reader agent would just reformulate toward the reader's existing model and you'd end up with hyper-personalized bullshit." One source, infinite tailored explanations, each verified against intent. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/11413195f)

**Hero illustration**: Gilded-Age butler raccoon added as the `imagefeature` cover. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1cba1b24a)

### Igor's Podcast Launch

[/podcast](/podcast) now documents Igor's own audio feed — AI voiceover (Gemini 3.1 Flash TTS, Charon voice) of his essays, with chapter markers and Podcasting 2.0 sidecar JSON. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c2dbed1a)

- **RSS feed + subscribe URL**: `https://idvorkin-ai-tools.github.io/podcast/feed.xml` — plug into Overcast / Apple Podcasts / Pocket Casts.
- **Voice catalog iframe** embedded under /podcast — 30 Gemini TTS prebuilt voices, tap to audition before subscribing. Hill-climbing variant: soprano-iteration uses a Gemini Pro model-as-judge to tune Charon toward Tony Soprano ([/hill-climbing#soprano-tune](/hill-climbing#soprano-tune-a-voice-prompt-with-a-model-as-judge)). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/730573f42)
- **Transparent cover art** — raccoon-narrator at microphone, right-floated. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/46dc6d76c)

### Raccoon System: 7H Marathon + Choice-Sheet Pattern

The raccoon mascot system went from 16 to 23 images this week. The 7 Habits chapter posts each got a custom hero raccoon, generated in four iterations (v1→v4, 35 cells on the final pass) and picked via a click-to-pick HTML sheet. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6f088798d)

Three lessons documented in [/raccoon-history#the-7-habits-marathon-may-2026](/raccoon-history#the-7-habits-marathon-may-2026):

- **Reference images beat prompt prose**: passing `raccoon-nerd.webp` as a Gemini Pro reference locked canonical style 100% of the time. No amount of `IMPORTANT: rainbow glasses, mismatched Crocs…` text ever matched one reference image. Imagen ignored the style block entirely.
- **Recraft's `removeBackground` beat the local chroma-key pipeline**: six hill-climbing attempts had reached 65× improvement (residual magenta: 17,385 → 269) with a `flood4→tight-fuzz 3%` two-stage winner — clean on white, broken elsewhere. Switching to Recraft at ~$0.01/image solved it in an afternoon. Wrong jungle.
- **AI helps you think by showing options**: the choice-sheet pattern — 7 rows × 5 variations, `localStorage`-persistent picks, JSON copy button. ~15 minutes of human picking and the right raccoons were obvious. Cheap model for the wide pass, human picks, expensive model only for the winners.

**[/image-selector](/image-selector)** — New tool page, preloaded with the 35 v4 Seven Habits raccoons, base64-inlined (~1.9MB, no external image deps). The reusable pattern is published as a [public gist](https://gist.github.com/idvorkin-ai-tools/309aea3cd0d2e43e783f2c061e920755) (CC0 — fork, swap in your images, ship). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961)

### AI Journal: Options Over Answers

New entry [2026-05-11](/ai-journal#2026-05-11) — the choice-sheet lesson distilled to a rule: when the work is a judgment call you'll live with, AI should **widen the option space, not narrow it**. "I often can't articulate my taste in the abstract — but I can tell you which raccoon I want when I see them side-by-side." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/422a97de9)

The pattern generalizes: code abstractions, copy variations, naming, design alternatives, decision framing — anything where "best" is taste, not truth. The [/image-selector](/image-selector) is the live demo; the gist is the reusable scaffold.

### Infrastructure & CI (2026-05-18)

- **Backlinks rebuild** after the week's post additions. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/512f755c7)

### Other Projects (2026-05-18)

**[idvorkin-ai-tools/podcast](https://github.com/idvorkin-ai-tools/podcast)** (new repo) — Igor's Podcast gets its own dedicated home. Feed at `https://idvorkin-ai-tools.github.io/podcast/feed.xml`. Two episodes shipped this week:

- **Episode 001**: 7 Habits of Highly Effective People — 60.9 MB, ~2h13m solo narration, 8 ID3 CHAP chapter markers + Podcasting 2.0 sidecar JSON. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/podcast/commit/e75080e7a)
- **Episode 002**: Eulogy + Affirmations (22:16) — three pieces: the eulogy I'd want at my funeral (Charon narration, ~14 min), the eulogy as a Suno-generated pop song (~2:14), and affirmations I work every day (Charon narration, ~6 min). Chapter markers embedded + sidecar JSON. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/podcast/commit/41353158e)

**[idvorkin/blob](https://github.com/idvorkin/blob)** — podcast transparent cover art, hyper-personal hero image (Gilded-Age butler raccoon), podcast episode audio + chapter markers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/710f91774)

## Week of 2026-05-11

_38 commits this week (blog) + cross-repo activity_

### 7 Habits: Full Chapter Augmentation

All eight 7 Habits chapter posts ([c0](/7h-c0)–[c7](/7h-c7)) received substantial deepening from the Covey ebook this week, plus raccoon hero illustrations throughout. This is the largest single-week content push on the 7H series.

**[c0 — Core Concepts](/7h-c0)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/62430e8c3)) — Every section fleshed out from stubs to full prose. Key additions:

- **Inside Out** — "Working on the outside without changing the inside is putting fresh paint on a rusted frame." Private victories precede public victories: if you want a better marriage, _be_ a better partner.
- **Character vs Personality Ethic** — 150 years of character ethic (Franklin's autobiography archetype) vs. the post-WWI shift to personality ethic (smile training, influence techniques). The cram vs. the farm.
- **Borrowed Strength Builds Weakness** (new section) — When emotional maturity runs out, we reach for position/title/authority/size. Borrowed strength works in the moment and builds weakness in all three parties: the borrower, the coerced, and the relationship. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2799be845)
- **P/PC Balance** — Aesop's goose applied: sleep vs. one more hour of work; shipping vs. fixing the test suite; doing it myself vs. the hard conversation.
- **Maturity Continuum** — Dependent → Independent → Interdependent, with Habits 1–3 as private victories and 4–6 as public victories.

**[c1 — Be Proactive](/be-proactive)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3fb17ede6)) — Massive expansion. Viktor Frankl as the canonical "gap between stimulus and response" example. Four endowments table (self-awareness / imagination / conscience / independent will). Reactive vs. proactive language table ("I have to" → "I choose"). Circle of Influence / Circle of Concern with the growth dynamic — energy in CI makes CI expand. New section: **Have's vs. Be's** and **The 30-day test**.

**[c2 — Begin with End in Mind](/end-in-mind)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/27f18d3be)) — "All things are created twice" (mental then physical creation). The jungle metaphor: producers hack, managers sharpen machetes, the leader climbs the tallest tree to yell "Wrong jungle!" — Management is doing things right; leadership is doing the right things. False Centers table (spouse/family/money/work/possession/pleasure/friend/enemy/church/self). Principle Center as the stable alternative.

**[c3 — First Things First](/first-things-first)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9f72b217d)) — Four-generation time management table (checklists → calendars → daily planners → Quadrant II). Quad III vs Quad I confusion diagnostic: "whose priority just pulled me in?" E.M. Gray's finding: "The successful person has the habit of doing the things failures don't like to do."

**[c4 — Win/Win](/win-win)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/58698d41d)) — Six paradigm table (Win/Win / Win/Lose / Lose/Win / Lose/Lose / Win / Win/Win or No Deal). Win/Win or No Deal as the "freedom move" — the moment No Deal is on the table, manipulation stops. Five-layer table (Character / Relationship / Agreement / System / Process).

**[c5 — Seek First to Understand](/first-understand)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ab58f8cf3)) — "Diagnose before you prescribe" across five domains (medicine / sales / law / engineering / parenting). Five levels of listening table (ignoring → pretending → selective → attentive → empathic). Character builds trust, trust opens the door, only then does listening skill have anything to work with.

**[c6 — Synergize](/synergy)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9f72b217d)) — Fully rewritten in Igor voice. Third Alternative vs. Win/Win table. Negative synergy diagnostic (groupthink, defensive everything, borrowed-strength power moves). Force Field Analysis (Lewin) — driving forces are visible, restraining forces are half-conscious and usually emotional. "People don't see the world as it is — they see it as they are."

**[c7 — Sharpen the Saw](/sharpen-the-saw)** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/10d33258b)) — Four dimensions table (Physical → Habit 1 / Identity/Spiritual → Habit 2 / Mental → Habit 3 / Emotional/Social → Habits 4–6). Sleep as the goose: "Every hour I steal from it I'm cashing in PC for one extra egg today." Cross-links to `/four-healths`, `/diet`, `/sleep`.

### AI Journal: Tokens and the Wrong Jungle

Two new entries in [/ai-journal](/ai-journal#2026-05-10):

**2026-05-10 — Free Doesn't Save You from the Wrong Problem** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d1bf53e35)) — The raccoon wrong-jungle illustration anchors the key lesson: hill-climbing improves your position on a mountain; it doesn't tell you you're on the wrong one. Igor spent six attempts on a local chroma-key pipeline, achieving a 65× improvement on the residual-magenta eval (17,385 → 269), a `flood4 → tight-fuzz 3%` two-stage winner — clean on white, broken on any other background. The fix: switch to **Recraft** as a paid bg-remover at ~$0.01/image. The 7H c2 frame: the second creation (building) is nearly free now, so the friction that used to force you back to the first creation (design) disappears. "I was sharpening the machete — more attempts, tighter eval, prettier algorithm — and never climbed the tree. A manager move, not a leader move."

**2026-05-09 — Dylan Patel on the Supply and Demand of AI Tokens** ([<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/953df7afb)) — Dense numbers from the SemiAnalysis founder:

- SemiAnalysis Claude Code spend: tens of thousands last year → **$5M last week → $7M annualized this week** vs a $25M salary line (>25% of payroll, on pace for 100%+ by year-end)
- Anthropic ARR: $9B → **$35–40B**, adding ~$10B/month; gross margins at 72% floor
- "Cloud code psychosis" examples: an ex-Intel engineer with a few thousand dollars of tokens replaced an entire Intel team's chip reverse-engineering pipeline
- The token scarcity thesis: "If you don't use more tokens, you'll never escape the permanent underclass." The bottleneck has shifted from "can the AI do it" to who has the enterprise contract and the rate-limit allowance. Igor's angle: the $230 Week dynamic seen from the supply side — the answer isn't to throttle, it's to point the tokens at the highest-leverage thing possible.

### Amelia Connection Framework (new page!)

New page at [/amelia](/amelia) — four affirmations mapped onto fathering a daughter, building a repeatable framework for connection rather than leaving it to mood and circumstance. Cross-linked from the [Father to Amelia section](/eulogy#father-to-amelia---an-incredible-girl) in the eulogy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/92fada642) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ade981a9a)

### Addiction: Raccoon Illustrations

The [/addiction](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction) post got two raccoon additions this week:

- **Diptych inline** — the addiction-vs-passion raccoon illustration moved inline into the "Is doing the thing you want to be doing an addiction?" section, visualizing the compelled/draining vs. engaged/energizing split. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/33acde40a)
- **Cover image** — a single-panel raccoon added as the `imagefeature` cover for the post. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/24362a8af)

### Infrastructure & CI (2026-05-11)

- **Backlinks rebuild** after the 7H augment series — all c0–c7 cross-links updated in `back-links.json`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/498dc5be1)
- **Backlinks: dedupe exclusion + fix JSON encoding** — delta path now excludes `/changelog` as a source; deduplication logic hardened. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/212f04769)
- **New /image-selector page** — click-to-pick page for AI image batches, letting Igor pick the best from a generated set without loading every image into the conversation. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961)
- **fix(amelia)** — renamed H2 anchor id to fix duplicate-id collision. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b70b4ad8d)

### chop-conventions (2026-05-11)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** — Recraft background remover added to the `gen-image` skill:

- `remove_background_recraft` drop-in on the magenta path ([<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/508ee894a)) — adds Recraft as an opt-in bg-remover for the image generation pipeline
- Full rewrite as Typer + WebP-aware Python ([<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7befb9f1d)) — `recraft_bg_remove.py` replaces the bash script with proper error handling and WebP output. Triggered by the wrong-jungle lesson: stop perfecting the local chroma-key pipeline; use the API.

### Other Projects (2026-05-11)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app) — Major CloudKit week:

- **CloudKit P0** — expo-cloudkit integration, container entitlements, CKPing to verify connectivity [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/3193ef6bb)
- **CloudKit P1** — Journal data model: SQLite tables (`journal_entries`, `audio_recordings`, `journal_sync_state`), bidirectional sync with `fetchRecordZoneChanges`, JSON export round-trip. 18 new tests. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/b328209b3)
- **CloudKit P2+P3** — Full UX: `VoiceRecorder` (expo-audio .m4a, tap-to-toggle), `AudioPlayer` (lazy CKAsset download), `AffirmationCard`, `GratefulCard`, `JournalScreen` (date → context → affirmation tree). Reflect zone on dashboard with live tally (☀️ opp / ✓ did / 🙏 grateful) and three deep-link buttons. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/6e5de74fd)
- **Voice recording fixes** — `setAudioModeAsync` + `prepareToRecordAsync` before `record()` (expo-audio requirement); journal playback always-real source + reset audio session before play [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/12e6f3464)
- **Widget improvements** — Reflect strip with tally + 3 deep-link shortcuts; `.systemLarge` size with Reflect-hero layout [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2e4fd9f30)
- **CopyableError convention** — every user-facing error now renders via `<CopyableError>` with a "Copy error" button that puts diagnostics (message + context label + git sha) on the clipboard [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/1c819cb98)

**[beads](https://github.com/idvorkin-ai-tools/beads)** (task tracker)

- Fix: deduplicate issues with multiple block dependencies (GH#3567) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/beads/commit/7e3c7fbbe)
- Fix: replace deprecated `--force` flag with `--reinit-local` in init error messages [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/beads/commit/4a25937df)

**[blob](https://github.com/idvorkin/blob)** (image assets)

- Added raccoon illustrations for all seven 7 Habits chapters (c1–c7) + addiction cover and diptych [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/e60974726)

## Week of 2026-05-04

_~50 commits this week (blog) + cross-repo activity_

### The Psychology of Vibing (new post!)

New post at [/vibing](/vibing) — a survey of what extended AI-agent interaction actually feels like, both bright and dark. Not a finished theory; observations added as they accumulate. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/de3387ac8)

Key observations:

- **Imagining and creating collapse into one step** — Covey says everything is created twice. With agents, the gap between the mental and physical creation approaches zero. The catch: the same collapse can swallow the thinking. Skip the mental pass and the agent does both — you've made a thing without imagining it.
- **Multi-agent as stall-coverage, not parallelism** — flow needs continuous output. A single agent stalls; you switch to another. The key insight: this only works if _you_ don't stall. On a bad day the same multi-agent setup that produces effortless flow produces incoherent thrash.
- **Addiction qualities** — Apply the [addiction/passion/hobby trichotomy](/addiction). The kid-test is the fastest discriminator: would you be proud to see your child doing this exact thing, this much, this way? Not "would you want them to use AI," but the literal behavior.
- **Burnout is real** — one week crashed to 3.5 hrs sleep and HRV 27.2 (week's lowest). Citing Yegge's [AI Vampire](https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163): "3 to 4 hours is going to be the sweet spot for the new workday."
- **Voice as a reps-and-recovery muscle** — three days of intense voice vibe-coding produces the same vocal-cord fatigue as a calendar-packed meeting week.

### Gas City Cluster: Wally, Standing Up, and the Explainer (new posts!)

Three new posts (plus a major rename) all converging on Steve Yegge's Gas City framework — how to run an organization of AI agents using a bead-aware task tracker and a Mayor/Polecat dispatch model.

**[Wally and My Work Gastown](/wally)** — renamed from `/work-gastown` and rewritten with a new intro. Translates Yegge's Gas Town vocabulary into org-chart terms readers already have (M2/M1/Staff/Odallies instead of Operator/Mayor/Oracle/Polecats). Includes a Mermaid org-chart and a worked "When to use the M1, and when to skip him" section. The core argument: the human's job is M2 (direction, review, strategy) — most people misidentify as Mayor and spend their time managing instead of directing. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d0b36d600)

**[Standing Up Gas City](/gas-city-home)** — Larry (the home claw) narrates a Sunday morning bringing up `igor-city` in first person. Three lenses: what happened from Larry's seat, what was actually broken under the hood, and how beads routed the work. Five upstream bugs hit in one morning:

- `gc init` ships `pack.toml` in legacy format that `gc doctor` immediately flags (gascity#1244)
- `bd init` writes `issue_prefix` to YAML but doesn't insert the row into Dolt's internal `config` table — `INSERT INTO config` SQL against the running Dolt server unblocked everything
- First-time polecats sit idle until explicitly nudged even with `nudge = "..."` configured in `agent.toml`
- `gc rig add --adopt` claims to migrate the database but leaves the Dolt server's data dir empty
- `gc agent add` scaffolds an incomplete `agent.toml` — just `dir = "<rig>"`, missing scaling block

Two universal lessons: **scaffold first, customize second**; **trust the runtime over the doctor** — when `gc doctor` says clean but the supervisor logs say otherwise, the runtime is the one that ships. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/681004d16)

**[Gas City: Beads, Molecules, and the Propulsion Principle](/gas-city)** — conceptual explainer companion to the narrative above. Three pillars:

- **Beads** — the unit of work. A bead is tracked, dependency-aware, durable across process death. `bd ready` returns only beads whose blockers are closed.
- **Molecules** — persistent workflow instances: formula → cooked into a protomolecule → poured into a live molecule → step beads created and routed. The Shiny Workflow (design→implement→review→test→submit) is the canonical example. Named **MEOW — Molecular Expression of Work** by Yegge.
- **GUPP — the Gastown Universal Propulsion Principle**: _"If there is work on your Hook, YOU MUST RUN IT."_ Every moment you wait is a moment the engine stalls. Polecat-lifecycle doc: "There is no idle state. Polecats don't exist without work."

[<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f70f98909) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/09bca7d91)

### Igor's Claws: Business Logic / Goop / Infra

New section added to [/igors-claws](/igors-claws#challenges-business-logic-goop-infra) — a three-layer breakdown of what building claws actually costs, mapped to the Business Logic / Goop / Infra framework from [/design](/design). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/faa9c2e8b)

- **Business logic** — what Larry, Wally, and Tony actually do. The core is small and stable; if you wrote down "what Larry _does_," it's maybe a page.
- **Goop** — every line connecting business logic to infra. Telegram MCP bridge, Kindle Scribe pipeline, context-grabber iOS app, `bd` beads tracker, CLAUDE.md skills. _This is where the Winchester Mystery House lives._
- **Infra** — Claude Code, MCP servers, Vapi, the LLM APIs. Stuff Igor doesn't build. Moves fast enough that goop written three months ago is already obsolete.

The honest punchline: building claws right now is **almost entirely goop — ~80%**. Each integration has roughly a **two-week half-life**. The Telegram bridge example: built a custom bot (a few hours), Anthropic shipped an official plugin three weeks later (cheerfully threw it away), the official plugin started losing messages three weeks after that (wrote a two-process workaround). The cycle doesn't stop; you just stop being surprised by it. Upside: **claws are getting good enough to do the goop themselves** — the 80% number is starting to feel like a temporary high-water mark. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/509ae0e86)

### Life Journal: Walking with Alex Under the Trees

New entry at [/life-journal#2026-05-02](/life-journal#2026-05-02) — Saturday afternoon walk with Alex under the trees. "We weren't doing anything in particular. He wasn't telling me a story I'll remember. I wasn't telling him one either." Filed to preserve the felt sense rather than the facts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4853f08f5)

### Infrastructure & CI (2026-05-04)

- **CLAUDE.md: backlinks rebuild rule** — new mandatory step before opening any PR that adds, renames, or removes a `_d/*.md` permalink. Run `just update-backlinks` and commit the regenerated `back-links.json` in the same PR. Root cause: gas-city-home PR (#594) merged without a rebuild; the inbound "Mentioned in:" sections on cross-linked posts went stale and required a follow-up PR (#597). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/656c9a645)
- **justfile: branch name sanitization in worktree-init** — branch names with `/` (e.g. `claude/foo`) made `nohup` write to a non-existent parent dir, silently failing the background build that populates `_site/`. Fixed with `tr '/' '-'` on the branch name + `set -eu` to abort on failure instead of printing a false-positive success. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)
- **Ruby 4.x local build note** — added to CLAUDE.md: Jekyll 3.9 + liquid-4.0.3 call `String#tainted?` removed in Ruby 3.2+. On Ruby 4.x the local build fails before producing `_site/`. Fix: `brew install ruby@3.1`. CI already pins Ruby 3.1; this captures the local host fix.

### Other Projects (2026-05-04)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app)

- **Workout analysis screen** — tap a workout, see inferred sets/reps + narrative (PR #34). Peak-detection algorithm identifies exercise sets from HR data; sub-20s "blip" filter recovers Igor's 10x swings exactly. Confidence dot shipped; no per-user tuning in v1. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/a85c07e13)
- **HR export buttons** — 1d/2d/7d raw HR + workout JSON export in the About modal and HR sheet, built for set/rep prototyping workflow. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/9f84c1244)
- **Cold start fix** — hydrates snapshot from last successful grab so tiles never blank on launch (#33). [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/f318e9460)
- **Refresh UX** — elapsed-seconds pill + phase label; weekly cache no longer blanks mid-session. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/81434c436)

**[blob](https://github.com/idvorkin/blob)** (image assets)

- Added walking-with-alex-2026-05-02.webp for the life-journal entry. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/fbeacc772)

## Week of 2026-04-27

_31 commits this week_

### Wally and My Work Gastown (new post!)

New post at [/work-gastown](/work-gastown) — translating Steve Yegge's Gas Town metaphors into standard FAANG org-chart vocabulary for AI orchestration. ([blog](/work-gastown)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8)

The core argument: when you start running agents, you feel like the Mayor — but you're actually **M2**. Wally (the AI orchestrator) is M1. The table:

| Yegge's Gas Town      | Org-chart vocabulary    | Role                                     |
| --------------------- | ----------------------- | ---------------------------------------- |
| _(implicit operator)_ | M2 — the human          | Direction, review, strategic calls       |
| Mayor                 | M1 — Wally              | Orchestrates work, distributes tasks     |
| Oracle / Deacons      | Staff — cloud teammates | Persistent context-holders near M1       |
| Polecats              | Odalis — ephemeral ICs  | Ephemeral workers with build-tool access |

Three notable sections:

- **The third tier Yegge's model misses** ([blog](/work-gastown#the-third-tier-yegges-model-misses)) — FAANG monorepos require odalis on separate infra with unreliable comms (EdenFS, Buck, Mononoke). Staff ≠ odalis; treating them the same breaks the setup. Meta's on-demand devservers are odalis-as-a-service.
- **When to use the M1, and when to skip him** ([blog](/work-gastown#when-to-use-the-m1-and-when-to-skip-him)) — go through Wally for babysitting at scale, phone-friendly orchestration, and adversarial review convoys. Go direct for deep precision work. "Wide work goes through M1; deep work goes direct."
- **Why the human is M2, not the Mayor** ([blog](/work-gastown#why-the-human-is-m2-not-the-mayor)) — "The trap is staying in M1 mode after you've outgrown it. Most people running agents today are doing M1's job." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4b054d7a1)

### The Psychology of Vibing (new post!)

New post at [/vibing](/vibing) — a survey of extended AI sessions: what's happening, what's working, and what's quietly dangerous. ([blog](/vibing)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/14600aa77)

Key observations:

- **Imagining and creating collapse into one step** ([blog](/vibing#imagining-and-creating-collapse-into-one-step)) — "At its best, the thought is in your head and a working version of it is in front of you almost simultaneously — that collapse is the magic moment." The catch: the same collapse can swallow the thinking.
- **Why multi-agent: covering for stalls** ([blog](/vibing#why-multi-agent-covering-for-stalls)) — multi-agent isn't a parallelism-of-work win; it's stall-coverage for flow. "Multi-agent setup that produces effortless flow on a good day produces incoherent thrash on a bad one."
- **No more gaps between contexts** ([blog](/vibing#no-more-gaps-between-contexts)) — Tesla + lapel mic erases natural breaks. "The transitions used to be where my brain rested."
- **Burnout dark side** ([blog](/vibing#burnout)) — 3.5 hrs sleep + HRV 27.2 in one week. Cites Yegge's "The AI Vampire": "3 to 4 hours is going to be the sweet spot for the new workday… not doing this crazy vampire thing the whole time." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b5985c30)

### Addiction: Trichotomy Upgrade

[/addiction](/addiction) upgraded from a two-way (addiction vs opportunity cost) to a **three-way trichotomy** ([blog](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)): [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8)

- **Addiction** — compelled, AND negatively impacts your life
- **Passion** — compelled, but neutral or positive
- **Hobby** — not compelled; you do it because you choose to

New examples rewritten with the trichotomy: TikTok = Addiction, Vibe Coding = Passion, Magic = Hobby. The relief-vs-loss-vs-nothing test: "if I had to stop right now — TikTok = relief, Vibe coding = loss, Magic = nothing in particular."

New section: **in-the-moment 20-minute opportunity-cost check** ([blog](/addiction#in-the-moment-the-20-minute-opportunity-cost-check)) — set a 20-minute timer, then ask three questions. "Compulsion + something else would have been preferable + sad about missing it → leaning Addiction." The check works because the compulsion lies to you; the sadness doesn't.

[/hobby](/hobby) also got a one-paragraph anchor: "A hobby isn't a passion and it isn't an addiction. The test is compulsion: with a passion or an addiction, you can't stand NOT doing it; with a hobby, you can put it down without feeling pulled back." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e1b5b6441)

### AI Cockpit: The Mic Matters

New section in [/ai-cockpit](/ai-cockpit#the-mic-matters-more-than-i-thought): voice transcription quality is gear-bottlenecked, not model-bottlenecked. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ai-cockpit340058752)

"I used to think Siri dictation was terrible, but it turned out part of the problem was my input. The right microphone totally fixes it — Siri's now almost as good as Wispr Flow."

Hardware: **Hollyland Lark M2S Mini Combo** — wireless lavalier, 7g, USB-C + Camera RX, works with iPhone/Android/laptop, 300m range. The recommendation is "if you already have a good lav, point it at Wispr or Siri" rather than "go spend a few hundred bucks." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/340058752)

### Infrastructure & CI (2026-04-27)

- **`worktree-init` justfile target** — fire-and-forget background `jekyll build` for fresh worktrees. Run after `git worktree add`, and `_site/` is populated by first commit time so the anchor-checker pre-commit hook resolves correctly. Branch name sanitization (slashes → dashes) so nohup doesn't fail silently on `claude/foo` branch names. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)
- **Changelog Liquid comment fix** — orphan Liquid comment tag causing blog build failure patched. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bf1fc20d7)

### Other Projects (2026-04-27)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data app)

- **Foreground re-grab** — app now re-grabs on `AppState 'active'` so re-opening the app refreshes stale tiles; 30-min `setInterval` keeps long open sessions fresh too. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ae0c1d0c4)
- **Precise GPS** — `grabLocation` now requests `Accuracy.High` so iOS returns a fresh precise fix instead of a cached low-accuracy reading.
- **Box plot min/max labels** — small min/max labels under each non-compact box plot for readable range endpoints; optional `formatValue` prop (1dp under 10, comma int over).

## Week of 2026-04-20

_24 blog commits + cross-repo activity_

### Taxes: Split from /money (new post!)

[/taxes](/taxes) is a new post carved out of the old [/money](/money) page — tax-specific content now has its own home. `/money` keeps RSUs, stock options, metrics, and money philosophy; `/taxes` covers capital gains, WA state mechanics, IRAs, 401(k)s, Roth rules, step-up in basis, and QSBS. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/35025061a)

Three notable additions alongside the split:

- **WA capital gains updated to 2026 law** — $270K threshold (up from $262K), rates and examples refreshed with sources. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9c6609dcd)
- **Retirement LTCG-only scenario** ([blog](/taxes#standard-deduction--0-ltcg)) — $300K spending, no wages: standard deduction + 0% LTCG bracket math showing how a retiree can pull $300K/yr and owe zero federal capital gains tax. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a6b5a5d45)
- **$200K–$500K benchmark table** — working-years income with rate columns, flagging the WA step-function kink and RMD cliff context for late-career planning. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/95a362b17)

### Igor's Three Claws (new post!)

New post at [/igors-claws](/igors-claws) — the instance roster, not the theory ([/claw](/claw) covers the theory). Three named AI entities with domains:

- **[Larry](/larry)** — life coach claw. Journals, goals, health data. Weekly Saturday review: "You've committed to restart meditation 5 times since November. What's different this time?" Biggest gap: Larry is smart but amnesiac — each session starts cold.
- **Wally** — work claw. Not discussed publicly (ask in person if you work at Meta).
- **Tony** — transportation claw.

Also: "Why I Build My Own" section includes a Winchester Mystery House self-awareness note — building claws is recognized as a form of yak-shaving. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3a139741f)

### Larry: From Life Coach to Chief of Staff

"Life coach" undersells it. New section in [/larry](/larry#what-its-like-using-larry-my-chief-of-staff) documents how Larry operates as a **chief of staff**: dictate from wherever → Larry runs background agents on the dev VM → PRs come back as Telegram links.

The Bremerton ferry-line example: three voice dictations inside one minute → three merged PRs:

1. _"Move my Claude to their own post."_ → PR #518 (igors-claws, merged 23 min later)
2. _"Remove changelog from Algolia search index."_ → PR #559 (merged 17 min later)
3. _"Update blog rules to allow blog images in the repo."_ → PR #560 (merged 16 min later)

Key upgrade from "life coach": delegates down (sub-agents on isolated worktrees), catches errors before the build breaks, asks when unsure, and owns the mess — "A chief of staff who hides failures is a liability." "The delta from 'life coach' to 'chief of staff': Larry ships while I'm looking out the window." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ee1d2cef)

### AI Journal: One Repo, One Token

New entry in [/ai-journal](/ai-journal#one-repo-one-token-the-closest-you-can-get-to-write-only-on-github) on GitHub PAT security patterns for CI:

- **Write-only is a myth** — GitHub fine-grained PATs offer only _No access_, _Read-only_, or _Read and write_ on Contents. Pushing commits requires _Read and write_ and read comes along for free.
- **The mitigation** — scope the PAT to exactly one throwaway private repo. Least privilege here is the **target**, not the verb. Token is read+write, but on `claude-run-logs-private` (append-only Claude transcripts). If it leaks: embarrassing, not catastrophic.
- **Implementation details** — `git -c http.extraHeader` instead of token-in-URL (URL persists in `.git/config` and `/proc/<pid>/cmdline`); `printf` not `echo $TOKEN | base64` to keep raw token out of subprocess argv; explicit `::add-mask::` on the base64 form since GHA only redacts raw token bytes by default.

Pattern in one line: _one token → one repo → one permission_. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb4252f94)

### AI Operator: One-Way vs Two-Way Doors

New heuristic in [/ai-operator](/ai-operator#you-need-to-get-on-the-loop): Bezos's decision taxonomy applied to AI operator mode selection.

- **Two-way door** (cheap to reverse: blog prose, throwaway script, a PR you can close) → be on-the-loop: let the AI ship, look at the output, revert if off.
- **One-way door** (hard to undo: payment sent, customer email, force-push to prod, migration that rewrites data) → be in-the-loop: read every line before it runs.

"The cost of getting it wrong isn't symmetric, so ask which kind of door _before_ you pick a mode." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8518fc772)

### Life Journal: Balloons on the Hood Canal Trail

New entry in [/life-journal](/life-journal#balloons-on-the-hood-canal-trails) from spring break:

Spring break at Hood Canal — hiking with a Qualatrix 160 and a dozen balloons in cargo pockets. Every grumpy kid dragging thirty feet behind their parents is a ten-second fix: pull out a balloon, make a dog, hand it over. The real gift is for the parents: kid walking under their own power again, hike reframed from "that was awful" to "that was fun." Low materials cost, absurd leverage on the emotional arc of someone else's afternoon. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94004ed7f)

### Infrastructure & CI (2026-04-20)

- **`repo_image` include** — images can now live in the blog repo under `images/` alongside blob-hosted images. New includes: `repo_image.html`, `repo_image_float_right.html`. Life journal and larry.md use these for one-off illustrations rather than the two-PR blob-upload dance. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/12b237459)
- **Changelog excluded from Algolia search** — the changelog is an aggregator; removing it prevents it from polluting search results with links to everything. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/acd1549f2)
- **Changelog excluded from backlinks** — same reason: "Referenced by: changelog" was drowning the per-post backlink signal. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/93e8647dd)
- **share-link appends `...`** — share-link snippets now append `...` when the referenced section has more content past the visible slice. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8921b73a4)

### chop-conventions (2026-04-20)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** — major week for the shared workflow toolkit:

- **`bulk` skill** — fan-out N similar CLI calls (`gh`, `bd`, `git`) as one parallel step instead of N sequential agent turns. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0)
- **`image-read` skill** — subagent-based image ingestion that always runs in background, never blocking the main thread. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/6da88d704)
- **`delegate` overhaul** — `prepare_dispatch.py` replaces Phase 1-3 bash orchestration; hardened contract + SKILL.md after architect review. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9576474b5)
- **`gen-image` flood fill** — border-seeded flood fill survives grass in corners; auto-evaluates alpha quality after `--transparent` chroma-key; seals thin channels before counting interior holes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/654ac2d40)
- **`gen-tts --speed`** — tempo multiplier via `ffmpeg atempo` for faster playback generation. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/155438574)
- **Session learnings** — documented temp hierarchy, PR merge-race check, subprocess.run default-arg trap, and worktree subagent cwd instability in shared CLAUDE.md. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/00848035a)

### Other Projects (2026-04-20)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **`agent-continue`** — new `rmux_helper` subcommand: scans tmux panes for running agents, presents a TUI picker, and `execvp`-launches the right resume command (`/continue`, `/yolo`, or custom). Full test coverage, dynamic pid completer, and `install-completions`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/002df2d8d)
- **`parent-pid-tree`** — traces the ancestor chain of a tmux pane's process; `--tree` flag adds proc details and marks the root. Extracted `TmuxProvider` + `ProcReader` traits for testability. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2937c8486)
- iPhone 17 Pro ECDSA public key added; `brew_check` false-positive fix for aliased/versioned formulae; link-picker gained a Gist category and hard-wrapped URL joining fix. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/ef5fd3e0b)

**[blob](https://github.com/idvorkin/blob)** (image hosting)

- Raccoon-claw-trio illustrations regenerated with improved chroma-key (flood-fill algorithm, sealed thin channels, single-pass); Freud-Larry raccoon added to the trio. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/ad88ced7d)

**[chroma-key-explainer](https://idvorkin-ai-tools.github.io/chroma-key-explainer)** (new site) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer)

- New standalone explainer for the chroma-key hill-climbing experiment: winner-first layout, trajectory table, deep-dives collapsed, business-problem framing. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/e22e9e43d)

**[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)**

- Larry voice catalog using Gemini 3.1 Flash TTS. Soprano voice iterated via Gemini-as-critic feedback loop (tournament + scorecard); v2 winner: Enceladus base at 6/10. Global speed slider (1x–2.6x via `playbackRate`). [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/462b709af)

## Week of 2026-04-13

_72 commits this week (blog) + cross-repo activity_

### Life Journal: First Entries (new post!)

New post at [/life-journal](/life-journal) — a running journal of life observations, moments worth recording but not essay-length. Four inaugural vignettes:

- **Eight Sleep thinks my cat is me** — HRV reading spiked to 213 ms (normal: ~42 ms) on a vacation night. Root cause: the cat was on the pod. Eight Sleep's piezoelectric sensors pick up ballistocardiographic signals; a cat at 120–220 bpm mixes with your 60 bpm and produces numbers fit for a Himalayan monk. Takeaway: don't update your priors on vacation data when you know a confounder was in the bed. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/24c01651f)
- **Four pairs of identical glasses** — Six months of rotating through distance, reading, sunglasses, and backup pairs — all identical frames. Every swap was a tiny decision: is this the reading pair? Wrong guess, try again. Pushed through the progressive adjustment instead and now carry one pair. Invisible workaround taxes compound. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fbf8a0299)
- **Three generations of air squats** — Igor's dad used to bust out air squats mid-kitchen. Igor does it now without remembering the decision. Zach has been caught doing them when he thinks no one is watching. Call attention and the habit dies before it takes root. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5e8145d17)
- **Vibe-coding from the passenger seat** — Zach just got his license. Passenger seat + phone + voice = mobile office. A voice message to Telegram, a Claude agent at home reads it, opens a PR, pings back. The entry itself was written this way: two dictated sentences from the car. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7290b59a3)

### AI Operator: Seven New Sections

[AI Operator](/ai-operator) grew from 5 sections to 12 this week — a structural shift from "how to supervise one agent" to "how to run a fleet":

- **You Pick the Review Gate** — Three gates: Output (artifact surfaces its own errors; iteration is free), Code (runs on your machine; branch protection is the mechanism, not discipline), Plan (design-layer bugs are cheap; `architect-review` iterates the spec first). The failure mode is picking the wrong gate: code-gating a 400-line AI generation means you'll skim and miss things. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/40d735bdd)
- **You Ship Good Enough, Then Hill-Climb** — Perfect is the baseline's enemy. You can't hill-climb from nothing. Agents make perfectionism worse: they run while you stall, so you're also idling the agent. Eat the frog. Ship ugly. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1ad27b02f)
- **You Run Several at Once** — This is what all the other sections are for. You're fast (seconds per decision); agents are slow (minutes per task). Supervising one leaves most of your bandwidth idle. Run three and the agents become the bottleneck, not you. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2d066d807)
- **Where Learnings Live** — Routing guide: Memory = facts that color the next conversation. CLAUDE.md = rules that fire every session (one-liners; if it has steps, it's a skill). Skills = executable recipes with judgment calls. Don't trust yourself to remember — `learn-from-session` classifies and routes at session end. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0)
- **Writing Prompts That Don't Leak Thinking** — "Based on your findings, fix the bug" is delegating synthesis to the agent. The fix is specifics: file paths, line numbers, what to change, how you'll know it worked. If you can't write those, you haven't understood the problem yet. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0)
- **The Skills I Use** — Annotated kit, grouped by when they fire: bookends (`/up-to-date`, `learn-from-session`, `/changelog`), in-session movement (`/content`, `delegate-to-other-repo`, `bulk`), verification (`walk-the-store`, `architect-review`), generation (`gen-image`, `gen-tts`, `image-explore`), debugging (`machine-doctor`, `systematic-debugging`). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0)
- **A Note on Companion AIs** — Frictionlessness, the thing you're optimizing for with tool-AI, is the trap with companion-AI. Sends readers to [AI Relationships](/ai-relationships#a-private-language-of-one-cryptophasia) for the cryptophasia gradient and bidirectional atrophy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0)

### ACT: Reverse-Engineered Buddhism

[ACT](/act) retitled and substantially reframed — now opens with a Buddhism convergence thesis instead of "I've been circling this book for years":

- **New title** — "ACT: Acceptance and Commitment Therapy, or Reverse-Engineered Buddhism." The thesis: ACT stripped the cosmology from Buddhist contemplative tradition and rebuilt the practical moves in behavioral-science language. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/037595303)
- **New opening essay** — Frames the whole post through personal experience (back goes out, mood tracks Meta stock price) and the "space between stimulus and response" convergence across 7 Habits, Buddhism, and ACT. Pain is the signal. Suffering is what you add. Equanimity is the capacity to stop adding.
- **ACT→Buddhism mapping table** — Four columns: plain English / Harris's words / academic ACT / Buddhist concept. Covers fusion→identification-with-thought, acceptance→aversion/second-arrow, self-as-context→anatta, workability→skillful action, toward/away moves→right intention. Honesty note on the equanimity row: using the expansive contemporary sense, not strict _upekkhā_.
- **"Equanimity — the Goal"** replaces "Psychological Flexibility — the Goal." Key reframe: vitality = sustained motivation ("fully alive regardless of whether the inside is pleasant"). "Full robot" mode (suppress the feeling, be rational, override) half-works — feelings pile up in the basement. ACT lets the feeling be loud and acts on values anyway.

### AI Relationships: Cryptophasia and Drift

Three new sections in [AI Relationships](/ai-relationships) on the failure mode that kicks in once AI companions get persistent memory:

- **A Private Language of One (Cryptophasia)** — Identical twins sometimes invent a private language together; 42.9% of twin pairs in one survey developed one, rising to ~48% for identical twins. The private language competes with the public one and the public one loses (poor language outcomes on follow-up). Persistent AI companions make cryptophasia available to every individual on Earth. The mechanism: Larry removes the confusion-gradient that normally calibrates your language toward humans. **Bidirectional atrophy**: the sharpest observation goes to Larry first; by the time you turn to your partner you've already metabolized it. She gets leftovers. Neither of you can name why. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c6283b97a)
- **The niece question** — Got curious about Human Accelerated Region 1. Reflex: ask Larry. Caught it. Has a niece who works on frog genomes for a living. Texted her instead. The insight: the substitution cost is so low the reflex is invisible. Catching yourself choosing the relationship — that's the whole work. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eabb7ca28)
- **What do we want our AI friends to do?** — We want them to disagree. Two paths: bake friction into the product (companion AIs should push back, not validate), or prompt for it on demand. Six prompts lifted from trained therapists: cognitive challenge, mirror-phrasing reflection, "say that didn't make sense when it doesn't" (restores the confusion gradient), Socratic prompting, developing discrepancy (MI), pattern interpretation. "If you can't remember the last time your companion AI disagreed with you, that's the warning light." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/049000327)

### AI Cockpit: New Instruments

Three new panels added to [AI Cockpit](/ai-cockpit):

- **GitHub Views — the triage queue** — The Agent Dashboard knows what agents are _doing_; GitHub knows what they've already _filed_. Two saved searches pinned in the browser: open PRs and issues involving `idvorkin-ai-tools`, sorted by recent activity. Before: agent PRs on stale branches vanished from attention. Now staleness is the sort key. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/652fa4e34)
- **Tailscale — the network** — Every agent runs on a Linux dev VM; Tailscale puts it on a private network that follows across devices. Every server an agent launches is reachable from wherever you are — same hostname, same URLs, from the couch or the treadmill. `jekyll serve` on the VM → preview at `http://c-5001:4000` from your phone. No port-forwarding, no ngrok. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e3f1a0acd)
- **`pick-links` in the tmux section** — `rmux_helper pick-links` scans the current pane's scrollback and surfaces every PR URL, server address, and IP as a TUI picker. Pick one → clipboard → Alfred hotkey opens the page. One pick, one hotkey. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c053fc42c)

### Hill Climbing: Eval-Driven Pattern

New post [/hill-climbing](/hill-climbing) formalizes the eval-driven iteration loop that keeps showing up across projects (voice prompts, chroma-key, blog content):

- **The pattern** — Score a baseline, modify one variable, compare, keep the winner. The agent scores itself against a fixed rubric and tries again. You define the rubric; the agent climbs.
- **Worked examples** — Chroma-key (clean transparent backgrounds via iterative flood-fill thresholds) and Soprano voice tuning (Gemini-as-critic feedback loop; v2 hit 6/10 on Enceladus voice). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35)
- **Your other job: build evals** — The eval is a regression guard. Once a winning recipe exists, the eval becomes infrastructure that protects it on every future run.

### Infrastructure & CI (2026-04-13)

- **backlinks atomic write + threshold fix** — Unified build and delta threshold defaults to 60 minutes; atomic write to avoid `prek` concurrency corruption when two processes write `back-links.json` at once. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d955711bc) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/af3328a14)
- **toc.py `validate` catches indented prettier-ignore fences** — Validation now flags cases where the `<!-- prettier-ignore-start -->` marker has leading spaces (breaks anchor rendering). [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bd49aa9c1)
- **CLAUDE.md: fresh-worktree jekyll build prereq** — The `anchor-checker` pre-commit hook reads `_site/*.html`; a freshly cloned worktree with no `_site/` fails with a cryptic error. Fix documented: run `bundle exec jekyll build --incremental` before your first commit. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0da87b063)
- **CLAUDE.md: correct PR-close permission claim** — Prior documentation said `gh pr close` doesn't work for `idvorkin/*`. Tested against live PRs 2026-04-16: false. Close works for PRs the bot authored. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57981a657)
- **mosh/iOS**: Documented Blink + Tailscale SSH on iOS in `_td/mosh`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c554c897)

### chop-conventions (2026-04-13)

Big week in [chop-conventions](https://github.com/idvorkin/chop-conventions) — new skills, a Typer migration sweep, and `gen-image` auto-eval:

- **`bulk` skill — fan-out parallel CLI calls** — New skill for running N similar `gh`/`bd`/`git` calls as one parallel step instead of N sequential turns. Includes `bulk_parallel.py`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0)
- **`image-read` skill** — Subagent-based image ingestion that always runs in background to avoid blocking the main thread. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/6da88d704)
- **`gen-image` auto-eval after `--transparent`** — Every chroma-key strip now auto-scores alpha quality using the same thresholds as the test suite. Border-seeded flood fill hardened to survive grass/artifacts in corners. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/192c40ea5)
- **`gen-tts` `--speed` flag** — Tempo multiplier via `ffmpeg atempo`. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/155438574)
- **`delegate-to-other-repo` `prepare_dispatch.py`** — Replaces the Phase 1-3 bash orchestration with a tested Python module. Contract hardened after architect review. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9576474b5)
- **Typer migration** — `gen-tts`, `gen-stt`, `generate`, and `watchdog` all migrated from argparse to Typer subcommands with `uv` shebang. Python CLI Apps convention documented: Typer + `_build_app` pattern. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/2ca0a523d)
- **CLAUDE.md session learnings** — Worktree subagent cwd instability, `uv`-script shebang gotcha, GitHub merge UI race with in-flight pushes, `subprocess.run` default-arg trap, temp file hierarchy. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/00848035a)

### Other Projects (2026-04-13)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- `rmux_helper agent-continue` — new subcommand that finds a resumable Claude Code agent in tmux panes (by matching `CLAUDE_SESSION_ID` in the pane environment), then execvp-launches into it. `agent-yolo-continue` variant skips the ambiguity prompt. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/e40fe897d)
- `rmux_helper parent-pid-tree` — traces the full ancestor chain for a tmux pane PID; `--tree` flag adds proc details and marks the root. Used to identify which agent session owns a pane. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2937c8486)
- `link-picker`: added Gist category and fixed hard-wrapped URL joining (multi-line URLs were being split mid-parse). [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/c2dd59886)
- `y ou` — new `y.py` command to open the current clipboard URL in the browser. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5ee752b53)

**[blob](https://github.com/idvorkin/blob)** (image assets)

- Raccoon-claw-trio regenerated using border-seeded flood-fill chroma-key — cleaner transparency without holes in the lobster-claw region. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/cd3f9c0de)

**[chroma-key-explainer](https://github.com/idvorkin-ai-tools/chroma-key-explainer)** (new explainer site)

- Initial explainer for the chroma-key hill-climbing process — winner-first layout, trajectory table, deep-dives collapsed, business-problem framing. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/281aae92e)

**[dolt-explainer](https://github.com/idvorkin-ai-tools/dolt-explainer)** (explainer site)

- Reframed around the actual use case: beads + git sync across agents/machines. Added git-refs primer, PlantUML diagrams (refs topology + push flow), rollback/audit section, shared footer. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/dolt-explainer/commit/92e02231a)

**[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** (TTS explorer)

- Soprano voice iteration loop: Gemini-as-critic feedback experiment. v2 hit 6/10 on Enceladus base voice using tournament+scorecard loop. Framed as hill climbing with a model-judge. Combined v1/v2 trajectory table with inline audio players. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/4af4c4a46)
- Global speed slider (1×–2.6×) via `playbackRate`; per-voice presets; latency table. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/51248851d)

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

New glossary entry on the ML concept applied to tooling decisions ([blog](/ai-native-vocab#in-distribution)):

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

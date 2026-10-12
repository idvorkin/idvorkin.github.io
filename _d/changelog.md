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

- **Mid-year physical-health check** - Weight drifting up against the goal; 5am wake holds; swings and TGU recovering; chinups paused and half-lotus regressing. ([blog](/y2026#physical-health)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/648c3b828) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/294a22893) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/32115d2aa)

### Produce/Consume: The Production Trap

- **The production trap** - Shipping can become its own addiction; the five-signal addiction test adapted for production, and producers versus consumers reframed as a different game. ([blog](/produce-consume#the-production-trap)) ([blog](/addiction)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dde4a024f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0f6610ae) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f37bf85b1)

### Other Projects (2026-05-25)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS HealthKit + location exporter)

- **Mac Catalyst** - Builds and runs its dashboard on macOS without HealthKit; fixed the iOS linker regression it caused. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16a8f7088) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/0fa352795)

## Week of 2026-05-18

_27 commits this week_

### What I Love About AI (new post!)

- **What I Love About AI (new post!)** - AI lowers the entry tax on specific human visions, so it multiplies distinct stories instead of averaging everything into beige. ([blog](/ai-optimism)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/26871ddde) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fa7d2052c)

### Parenting Books: Emotional Lives + Untangled Rewrite

- **The Emotional Lives of Teenagers (new post!)** - Damour's notes: mental health is the right feelings at the right time, managed well; five chapter treatments. ([blog](/emotional-lives)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/682976fd3)
- **Untangled rewrite** - Terse headlines, seven developmental strands each with when to worry. ([blog](/untangled)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/612e2d2ff)

### Hyper-Personal: Bezos to Agent-to-Agent

- **New intro** - Bezos-level personal staff was gated by cost; AI drops the price and adds biometric dimensions no staff had. ([blog](/hyper-personal)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bc1b9ac7d)
- **New sections and cover** - Five stages of ML ranking; author and reader agents negotiate explanations with a fidelity check; a butler raccoon cover. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/11413195f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1cba1b24a)

### Igor's Podcast Launch

- **Podcast page** - AI-voiced audio of my essays with chapter markers, an RSS feed and cover art. ([blog](/podcast)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c2dbed1a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/46dc6d76c)
- **Voice catalog** - Audition Gemini TTS voices on /podcast; a model-as-judge loop tunes a voice prompt. ([blog](/hill-climbing#soprano-tune-a-voice-prompt-with-a-model-as-judge)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/730573f42)

### Raccoon System: 7H Marathon + Choice-Sheet Pattern

- **7 Habits raccoons** - Each chapter post gets a hero raccoon, picked from a click-to-pick sheet; lessons on reference images and background removal; /image-selector page. ([blog](/raccoon-history#the-7-habits-marathon-may-2026)) ([blog](/image-selector)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6f088798d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961)

### AI Journal: Options Over Answers

- **Options over answers** - For judgment calls of taste, AI should widen the option space with side-by-side choices, not pick one. ([blog](/ai-journal#2026-05-11)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/422a97de9)

### Infrastructure & CI (2026-05-18)

- **Backlinks rebuild** - Refreshed after the week's new posts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/512f755c7)

### Other Projects (2026-05-18)

**[idvorkin-ai-tools/podcast](https://github.com/idvorkin-ai-tools/podcast)** (new repo, podcast feed)

- **First episodes** - The 7 Habits narrated; then my eulogy, the eulogy as a song, and my daily affirmations. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/podcast/commit/e75080e7a) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/podcast/commit/41353158e)

**[idvorkin/blob](https://github.com/idvorkin/blob)** (image and audio assets)

- **Podcast and hyper-personal assets** - Cover art, butler raccoon, episode audio and chapter markers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/710f91774)

## Week of 2026-05-11

_38 commits this week_

### 7 Habits: Full Chapter Augmentation

- **Core concepts** - Stubs become prose: inside out, character versus personality ethic, P/PC balance, the maturity continuum, and borrowed strength. ([blog](/7h-c0)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/62430e8c3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2799be845)
- **Habits 1 and 2** - Frankl's gap, the four endowments, Circle of Influence, Have's vs Be's; created twice, wrong jungle, false centers. ([blog](/be-proactive)) ([blog](/end-in-mind)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3fb17ede6) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/27f18d3be)
- **Habits 3 to 5** - Four generations of time management, the six Win/Win paradigms, and five levels of listening. ([blog](/first-things-first)) ([blog](/win-win)) ([blog](/first-understand)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9f72b217d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/58698d41d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ab58f8cf3)
- **Habits 6 and 7** - Synergy rewritten with the third alternative and force-field analysis; four renewal dimensions with sleep as the goose. ([blog](/synergize)) ([blog](/sharpen-the-saw)) ([blog](/7h-c7)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/10d33258b)

### AI Journal: Tokens and the Wrong Jungle

- **Free doesn't save you from the wrong problem** - Hill climbing improves your spot on the wrong mountain; a paid background remover beat the tuned local pipeline. ([blog](/ai-journal#2026-05-10)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d1bf53e35)
- **Dylan Patel on AI tokens** - Notes on token supply and demand: enterprise contracts and rate limits are the new bottleneck. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/953df7afb)

### Amelia Connection Framework (new page!)

- **Amelia (new page!)** - The four affirmations mapped onto fathering a daughter, linked from the eulogy. ([blog](/amelia)) ([blog](/eulogy#father-to-amelia---an-incredible-girl)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/92fada642) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ade981a9a)

### Addiction: Raccoon Illustrations

- **Raccoons** - Addiction-versus-passion diptych inline, plus a cover image. ([blog](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/33acde40a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/24362a8af)

### Infrastructure & CI (2026-05-11)

- **Backlinks and fixes** - Backlinks rebuilt, /changelog excluded as a source, encoding fixed; /image-selector page; duplicate /amelia heading id fixed. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/498dc5be1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/212f04769) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b34f65961) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b70b4ad8d)

### chop-conventions (2026-05-11)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (shared CHOP skills & conventions)

- **Recraft background remover** - gen-image gets an opt-in Recraft remover, rewritten as a WebP-aware Python CLI. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/508ee894a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7befb9f1d)

### Other Projects (2026-05-11)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app)

- **CloudKit journal** - Sync, journal model, voice recording and playback, a Reflect screen and widget strip, and Copy error buttons. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/3193ef6bb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/b328209b3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/6e5de74fd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/12e6f3464) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2e4fd9f30) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/1c819cb98)

**New and smaller**

- **[beads](https://github.com/idvorkin-ai-tools/beads)** - Deduplicate issues with several blockers; init errors suggest --reinit-local. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/beads/commit/7e3c7fbbe) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/beads/commit/4a25937df)
- **[blob](https://github.com/idvorkin/blob)** - 7 Habits chapter illustrations plus addiction cover and diptych. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/e60974726)

## Week of 2026-05-04

_~50 commits this week_

### The Psychology of Vibing (new post!)

- **The Psychology of Vibing (new post!)** - What long AI-agent sessions feel like: creation collapsing to one step, multi-agent flow, addiction, burnout and voice fatigue. ([blog](/vibing)) ([blog](/addiction)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/de3387ac8)

### Gas City Cluster: Wally, Standing Up, and the Explainer (new posts!)

- **Wally** - Renamed from /work-gastown with a new intro mapping Gas Town roles onto an org chart. ([blog](/wally)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d0b36d600)
- **Standing Up Gas City (new post!)** - Larry narrates bringing up a home city: five upstream bugs; scaffold first, trust the runtime over the doctor. ([blog](/gas-city-home)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/681004d16)
- **Gas City explainer (new post!)** - Beads, molecules and the propulsion principle: work on your hook runs. ([blog](/gas-city)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f70f98909) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/09bca7d91)

### Igor's Claws: Business Logic / Goop / Infra

- **Business logic, goop, infra** - Building claws is mostly goop, integrations with a short half-life, though claws are starting to write it themselves. ([blog](/igors-claws#challenges-business-logic-goop-infra)) ([blog](/design)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/faa9c2e8b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/509ae0e86)

### Life Journal: Walking with Alex Under the Trees

- **Walking with Alex** - A Saturday walk under the trees, kept for the feeling rather than the facts. ([blog](/life-journal#2026-05-02)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4853f08f5)

### Infrastructure & CI (2026-05-04)

- **Backlinks rule** - PRs that add, rename or remove a permalink rebuild back-links.json in the same PR. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/656c9a645)
- **worktree-init fix** - Slashes in branch names no longer silently break the background build. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)

### Other Projects (2026-05-04)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health app)

- **Workout analysis** - Tap a workout to see sets and reps inferred from heart rate; raw HR export. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/a85c07e13) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/9f84c1244)
- **Launch and refresh** - Tiles never blank on cold start; refresh shows elapsed time and phase. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/f318e9460) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/81434c436)

**[blob](https://github.com/idvorkin/blob)** (image assets)

- **Life-journal image** - Walking with Alex. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/fbeacc772)

## Week of 2026-04-27

_31 commits this week_

### Wally and My Work Gastown (new post!)

- **Wally and My Work Gastown (new post!)** - Gas Town roles mapped to an org chart: the human is M2, the orchestrator M1, ephemeral workers a separate tier. ([blog](/work-gastown)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8)
- **When to skip the M1** - Wide work goes through the orchestrator, deep precision work goes direct, and the human should stop doing M1's job. ([blog](/work-gastown#the-third-tier-yegges-model-misses)) ([blog](/work-gastown#when-to-use-the-m1-and-when-to-skip-him)) ([blog](/work-gastown#why-the-human-is-m2-not-the-mayor)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4b054d7a1)

### The Psychology of Vibing (new post!)

- **The Psychology of Vibing (new post!)** - Long AI sessions merge imagining with creating, use extra agents to cover stalls, erase rest between contexts, and risk burnout. ([blog](/vibing)) ([blog](/vibing#imagining-and-creating-collapse-into-one-step)) ([blog](/vibing#why-multi-agent-covering-for-stalls)) ([blog](/vibing#no-more-gaps-between-contexts)) ([blog](/vibing#burnout)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/14600aa77) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b5985c30)

### Addiction: Trichotomy Upgrade

- **Addiction, passion, hobby** - The two-way split becomes three: compelled and harmful, compelled but positive, or freely chosen; plus a 20-minute in-the-moment check. ([blog](/addiction)) ([blog](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)) ([blog](/addiction#in-the-moment-the-20-minute-opportunity-cost-check)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e0b4a9fb8)
- **Hobby defined** - A hobby is something you can put down without feeling pulled back. ([blog](/hobby)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e1b5b6441)

### AI Cockpit: The Mic Matters

- **The mic matters** - Dictation quality is limited by the microphone, not the model; a wireless lavalier brings Siri close to Wispr Flow. ([blog](/ai-cockpit#the-mic-matters-more-than-i-thought)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/340058752)

### Infrastructure & CI (2026-04-27)

- **worktree-init** - A just target builds the site in the background for fresh worktrees so the anchor checker passes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f94f971df)
- **Changelog build fix** - An orphan Liquid comment tag no longer breaks the build. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bf1fc20d7)

### Other Projects (2026-04-27)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data app)

- **Fresher data** - Re-grabs on returning to the foreground; GPS asks for a precise fix; box plots label min and max. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ae0c1d0c4)

## Week of 2026-04-20

_24 blog commits this week_

### Taxes: Split from /money (new post!)

- **Taxes (new post!)** - Tax content moves out of /money: capital gains, WA state rules, IRAs, Roth, step-up in basis, QSBS. ([blog](/taxes)) ([blog](/money)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/35025061a)
- **Tax tables** - WA capital gains updated to 2026 law, a retiree zero-LTCG scenario, and a working-years benchmark table. ([blog](/taxes#standard-deduction--0-ltcg)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9c6609dcd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a6b5a5d45) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/95a362b17)

### Igor's Three Claws (new post!)

- **Igor's Three Claws (new post!)** - The roster behind the claw theory: Larry for life, Wally for work, Tony for transportation. ([blog](/igors-claws)) ([blog](/claw)) ([blog](/larry)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3a139741f)

### Larry: From Life Coach to Chief of Staff

- **Chief of staff** - Dictate from anywhere; Larry runs background agents on the dev VM and sends back PR links. ([blog](/larry#what-its-like-using-larry-my-chief-of-staff)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ee1d2cef)

### AI Journal: One Repo, One Token

- **One repo, one token** - GitHub PATs can't be write-only, so scope a read-write token to one throwaway repo and keep it out of argv and logs. ([blog](/ai-journal#one-repo-one-token-the-closest-you-can-get-to-write-only-on-github)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb4252f94)

### AI Operator: One-Way vs Two-Way Doors

- **One-way vs two-way doors** - Reversible work gets on-the-loop supervision; irreversible work gets every line read before it runs. ([blog](/ai-operator#you-need-to-get-on-the-loop)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8518fc772)

### Life Journal: Balloons on the Hood Canal Trail

- **Balloons on the trail** - Spring break at Hood Canal, handing balloon dogs to grumpy kids lagging behind their parents. ([blog](/life-journal#balloons-on-the-hood-canal-trails)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94004ed7f)

### Infrastructure & CI (2026-04-20)

- **Repo images and changelog scope** - Images can live in the repo; the changelog leaves search and backlinks; share-link snippets mark truncation. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/12b237459) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/acd1549f2) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/93e8647dd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8921b73a4)

### chop-conventions (2026-04-20)

- **New skills** - bulk fans out similar CLI calls in parallel; image-read ingests images in a background subagent; delegate gets a Python dispatcher. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/6da88d704) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9576474b5)
- **Generation and learnings** - gen-image flood fill hardened, gen-tts gains a speed flag, and session learnings land in shared CLAUDE.md. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/654ac2d40) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/155438574) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/00848035a)

### Other Projects (2026-04-20)

- **[Settings](https://github.com/idvorkin/Settings)** - agent-continue resumes an agent from a tmux pane picker; parent-pid-tree traces a pane's ancestors; small fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/002df2d8d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2937c8486) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/ef5fd3e0b)
- **[blob](https://github.com/idvorkin/blob)** - Raccoon claw trio regenerated with cleaner chroma-key, plus a Freud-Larry raccoon. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/ad88ced7d)
- **[chroma-key-explainer](https://idvorkin-ai-tools.github.io/chroma-key-explainer)** (new) - Explains the chroma-key hill-climbing experiment, winner first. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/e22e9e43d)
- **[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** - A Larry voice catalog on Gemini TTS, tuned with Gemini as critic, plus a speed slider. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/462b709af)

## Week of 2026-04-13

_72 commits this week_

### Life Journal: First Entries (new post!)

- **Life Journal (new post!)** - Short life vignettes: the cat that fooled Eight Sleep, four identical glasses, family air squats, coding from the passenger seat. ([blog](/life-journal)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/24c01651f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fbf8a0299) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5e8145d17) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7290b59a3)

### AI Operator: Seven New Sections

- **From one agent to a fleet** - Seven sections: review gates, ship then hill-climb, run several at once, where learnings live, prompts, skills, companion AIs. ([blog](/ai-operator)) ([blog](/ai-relationships#a-private-language-of-one-cryptophasia)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/40d735bdd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1ad27b02f) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2d066d807) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0841048e0)

### ACT: Reverse-Engineered Buddhism

- **Reverse-engineered Buddhism** - ACT reframed as Buddhist practice in behavioral-science language, with a mapping table and equanimity as the goal. ([blog](/act)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/037595303)

### AI Relationships: Cryptophasia and Drift

- **Cryptophasia and drift** - Persistent AI companions risk a private language of one; reach for people first, and prompt AI friends to disagree. ([blog](/ai-relationships)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c6283b97a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eabb7ca28) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/049000327)

### AI Cockpit: New Instruments

- **New instruments** - GitHub saved searches as the triage queue, Tailscale for reaching agent servers anywhere, and pick-links for scrollback URLs. ([blog](/ai-cockpit)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/652fa4e34) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e3f1a0acd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c053fc42c)

### Hill Climbing: Eval-Driven Pattern

- **Hill Climbing (new post!)** - Score a baseline, change one variable, keep the winner; the eval then guards the recipe. ([blog](/hill-climbing)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8be894e35)

### Infrastructure & CI (2026-04-13)

- **Build and docs fixes** - Atomic backlinks writes, toc validation of indented fences, fresh-worktree build and PR-close notes, iOS mosh setup. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d955711bc) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/af3328a14) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bd49aa9c1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0da87b063) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57981a657) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3c554c897)

### chop-conventions (2026-04-13)

- **New skills and auto-eval** - bulk and image-read skills; gen-image scores its transparency; gen-tts speed flag; delegate dispatch moves to Python. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/fe7e250d0) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/6da88d704) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/192c40ea5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/155438574) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/9576474b5)
- **Typer migration** - Four CLIs move from argparse to Typer, and session learnings land in shared CLAUDE.md. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/2ca0a523d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/00848035a)

### Other Projects (2026-04-13)

- **[Settings](https://github.com/idvorkin/Settings)** - agent-continue resumes a Claude agent in tmux; parent-pid-tree; link-picker Gist category; open clipboard URL. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/e40fe897d) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2937c8486) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/c2dd59886) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5ee752b53)
- **[blob](https://github.com/idvorkin/blob)** - Raccoon claw trio regenerated with flood-fill chroma-key. [<i class="fa fa-github"></i>](https://github.com/idvorkin/blob/commit/cd3f9c0de)
- **[chroma-key-explainer](https://github.com/idvorkin-ai-tools/chroma-key-explainer)** (new) - Explains the chroma-key hill-climbing process, winner first. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/chroma-key-explainer/commit/281aae92e)
- **[dolt-explainer](https://github.com/idvorkin-ai-tools/dolt-explainer)** - Reframed around syncing beads across agents and machines, with diagrams and a rollback section. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/dolt-explainer/commit/92e02231a)
- **[larry-voice-samples](https://github.com/idvorkin-ai-tools/larry-voice-samples)** - Voice tuning with Gemini as critic, a speed slider, and per-voice presets. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/4af4c4a46) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/larry-voice-samples/commit/51248851d)

## Week of 2026-04-12

_61 commits this week_

### The AI Operator: Learning to Drive the Machine (new post!)

- **The AI Operator (new post!)** - Operating AI is a skill: spend thinking tokens directing, not supervising, and work your way from in the loop to on it. ([blog](/ai-operator)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/5fdbb6a2a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/622d008fd)
- **Habits** - Talk instead of typing, throw bad generations away, and compound what you learn into skills. ([blog](/ai-operator)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/84cd2cd34) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1b5cf8295)

### ACT Made Simple: Book Notes (new post!)

- **ACT Made Simple (new post!)** - Notes on Russ Harris's book: psychological flexibility, the choice point, workability over truth, creative hopelessness, and the hexaflex. ([blog](/act)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5c4abb7)

### CHOP & Tooling

- **The flow question** - Flow survives chopping: it comes from orchestrating agents at different stages and mastering a skill. ([blog](/how-igor-chops#the-flow-question)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/07a70ed21)
- **CPU safety net** - A hypervisor cap plus a userspace watchdog keeps runaway agents from melting the Mac, with a reference page. ([blog](/how-igor-chops#container-setup)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/63fc22051) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0a105f381)

### Infrastructure & CI (2026-04-12)

- **Automated weekly changelog** - A scheduled GitHub Action runs the changelog skill and opens a PR. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/94dc5927c)
- **AI operator cross-links** - Each section links its relevant CHOP skills. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/fe93fc452)

### Other Projects (2026-04-12)

- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - architect-review skill hardens a spec through sequential review passes until it converges; docs skill fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/43ba1bdfd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/7dd0f5b4c)
- **[Settings](https://github.com/idvorkin/Settings)** - Tools rebuild automatically after a pull; rbv prints its install command. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/7a8b1602a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/42248d537)
- **[context-grabber](https://github.com/idvorkin/context-grabber)** - Sleep detail sheet, a merged movement card, honest transit accounting, OTA updates and background prefetch. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7363b9e38) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/6d9b60b7c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16f1be300) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ec1acfc4b)
- **[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** - Drop the Rope: an unwinnable tug-of-war against emotion monsters teaching that dropping, not effort, is the lever. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/5f3126de1) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/c36819404)

## Week of 2026-03-30

_28 commits this week_

### AI Relationships: When the Chatbot Is Better at Caring (new post!)

- **AI Relationships rewrite (new post!)** - Studies rate chatbots more compassionate than humans; leaning on them atrophies vulnerability, so leave easy problems for people. ([blog](/ai-relationships)) ([blog](/humans-are-underrated)) ([blog](/lonely)) ([blog](/human-meetings)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/08e603ddc)
- **Raccoon illustration** - A vulnerability-themed raccoon as the social preview. ([blog](/ai-relationships)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e2c48e0db)

### Keyboards: From Wrist Pain to Split Keyboards (new post!)

- **Keyboards (new post!)** - Wrist pain turned out to be a shoulder problem; split keyboards far apart, a hardware guide, RK-S70 programming from macOS, Karabiner chording. ([blog](/keyboard)) ([blog](/shoulder-pain)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/2ce9f165d)

### AI Journal: The Winchester Mystery House

- **Winchester Mystery House** - Drew Breunig's third era after cathedral and bazaar: sprawling personal tools, since agents made code cheap while coordination stayed expensive. ([blog](/ai-journal#the-winchester-mystery-house-of-software-when-code-gets-too-cheap-to-care-about)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/22910e961)
- **Hyper-personal cross-link** - New section on the Winchester Mystery House as hyper-personalization of software itself. ([blog](/hyper-personal)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/378f9b289)

### Content & Gear

- **Mosh and Eternal Terminal** - An Eternal Terminal setup guide beside mosh, with Tailscale gotchas. ([blog](/mosh)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c32cbf344)
- **Portable espresso** - A battery espresso maker plus a JetBoil for coffee anywhere. ([blog](/irl#portable-espresso)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a1578347a)
- **AI feed** - Two articles queued: Russinovich on training future engineers, and recommender-system architecture. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e7259b89c)

### Infrastructure & CI (2026-03-30)

- **Claude Code Review** - Uses the official code-review plugin and also triggers on ready-for-review and reopened PRs. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c9762fbc)
- **Workflows** - Backlinks workflow rewritten to run on push to main with path filters; Actions bumped to Node.js 24. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c590b318) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/02c659014) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb3db6f6c)

### Other Projects (2026-03-30)

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- **Blog links in Neovim** - gf and gx follow blog permalinks to files via back-links.json. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/6bc9feea2) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/a585a8884)
- **rmux_helper** - side-edit takes file:line; new side-run runs commands in the side pane. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/5f8ef186d)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health & location data)

- **Gym timer** - A new timer sharing hooks with igor-timer. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/55032c477)
- **Places and health** - Per-day places, hourly box plots, activity timeline; weight in lbs, richer workouts, HRV export fix. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/ffa18a780) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/16388d252) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/b3f514628)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- **machine-doctor** - A system health diagnosis skill, plus skill conventions and install docs. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ed7985257) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/c8b624ccc)

## Week of 2026-03-16

_24 commits this week_

### Claws: The Next Layer of AI (new post!)

- **Claws (new post!)** - Persistent agents are the next layer of Karpathy's onion; the lethal trifecta is the risk; my three claws are Larry, Wally and Tony. ([blog](/claw)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)

### AI Journal: Telegram, Eggs, and Feedback Loops

- **Telegram bot** - Threw away my custom bot for the official Telegram plugin, then layered speech-to-text, TTS, logging and weather nudges on it. ([blog](/ai-journal#2026-03-21)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8e1881824) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/acf20b7ae)
- **The Egg Theory** - Like the egg in cake mix, good AI workflows leave people a real contribution so they feel ownership. ([blog](/ai-journal#2026-03-21)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d54b734db)
- **AI filing feature requests** - Hitting bad HealthKit data, Claude filed issues on the source repo instead of working around it. ([blog](/ai-journal#2026-03-21)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f3ab9e75f)

### AI Native Manager: "In Distribution"

- **In Distribution** - Tools in the model's training data cost agents nothing to learn; internal tools pay an awareness tax every time. ([blog](/ai-native-vocab#in-distribution)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56667aaef)

### Content Updates

- **Small edits** - Raccoon history image grids across three eras; a clown documentary in Joy; Karpathy's job-market visualizer in Explainers. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/476455361) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/434bc07a1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4a32b67ae) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f22e0397a)

### Infrastructure & Tooling (2026-03-16)

- **Tooling** - Jekyll runs on Ruby 4 via a pathutil patch; a show-your-work screenshot skill; AI feed routes podcasts to transcripts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eb000683a) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/cacd5a0d5) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3168e97f9)

### Other Projects (2026-03-16)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- **Stats and places** - Weekly box plots, known places with radius matching and JSON import, per-source sleep breakdown. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/2f8aaa2a1)

**[activation-energy-game](https://github.com/idvorkin-ai-tools/activation-energy-game)** (interactive explainer, Nicky Case-inspired)

- **Morning choice mini-game** - Alarm intro, drag interaction, path choices, mobile layout, raccoon favicon. [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/e2022d2d9) [<i class="fa fa-github"></i>](https://github.com/idvorkin-ai-tools/activation-energy-game/commit/cfa04c736)

**New and smaller**

- **[tg-bot](https://github.com/idvorkin/tg-bot)** - Deprecated in favor of the official Claude Code Telegram plugin. [<i class="fa fa-github"></i>](https://github.com/idvorkin/tg-bot/commit/56f56cbe7)
- **[Settings](https://github.com/idvorkin/Settings)** - Browser-free OAuth for headless servers; Kindle notebook email detection fixed. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/844efcc87) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/036d9f8fc)
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - Leaner up-to-date skill with remote hygiene; new clock and background-usage skills. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/76fa478cb) [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/3e1e966cd)

## Week of 2026-03-09

_14 commits this week_

### AI Second Brain (new post!)

- **AI Second Brain (new post!)** - Replace manual PKM with available context, pre-brief and debrief; personas like Larry use the brain, and teams need one too. ([blog](/ai-second-brain)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)

### Side Quests (new post!)

- **Side Quests (new post!)** - Light tech explorations: in-browser card detection, Context Grabber graduating to a project, macOS VMs shelved. ([blog](/side-quests)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ad8434558) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4a86702b1) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ef43d2936)

### AI Journal: Verification as Trust

- **Show, don't tell** - Trustworthy AI PRs carry screenshots, exact test counts, a staging link and proof existing tests pass. ([blog](/ai-journal#when-ai-shows-its-work-verification-as-trust)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/7aaf9b0d9)

### Cross-linking & Content Updates

- **Context Grabber woven in** - Larry, Structure and Pet Projects cite it as a data source; Larry's section now covers what Larry could know. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/0efc2713e)
- **Second brain woven in** - AI Native Manager links the org second brain; Hyper-Personal gains a second-brain section. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/28a88f42c)

### Infrastructure (2026-03-09)

- **Tooling** - Jekyll runs on Ruby 3.2+ via the _ruby_compat.rb shim; a walk-the-store skill screenshots key pages into a gallery. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c851e24ae) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/3b560b282)

### Other Projects (2026-03-09)

**[context-grabber](https://github.com/idvorkin/context-grabber)** (iOS health data export)

- **Location clustering** - Grid-based clustering with run-length timelines. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/08be4fd2b)
- **More health data** - HRV, resting HR, exercise minutes, weekly sharing, auto-grab on startup, OTA updates; sleep and weight fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/7b52df6a3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/context-grabber/commit/e299437a4)

**[magic-monitor](https://magic-monitor.surge.sh)** (smart mirror) [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor)

- **Card detection** - YOLO card detection fixed end to end, with a Colab training notebook and runtime model loading. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/4f80c89ea) [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor/commit/c66905937)

**New and smaller**

- **[humane-tracker-1](https://humane-tracker.surge.sh)** - Long-press a row to backfill habits without confirmation dialogs. [<i class="fa fa-github"></i>](https://github.com/idvorkin/humane-tracker-1/commit/2b958e953)
- **[tg-bot](https://github.com/idvorkin/tg-bot)** - Parakeet voice transcription and threaded replies. [<i class="fa fa-github"></i>](https://github.com/idvorkin/tg-bot/commit/ff97ec296)
- **[streamdeck-igor-vibe](https://github.com/idvorkin/streamdeck-igor-vibe)** - tmux keystrokes sent via Quartz events, bypassing Karabiner. [<i class="fa fa-github"></i>](https://github.com/idvorkin/streamdeck-igor-vibe/commit/73e04283b)
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - A gist-image skill for hosting images on GitHub. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/b4a93e5d1)

## Week of 2026-02-08

_17 commits this week_

### AI Native Engineering Manager (new post!)

- **AI Native Engineering Manager (new post!)** - Managing engineers when AI rewrites the assumptions about software, teams and the manager's role. ([blog](/ai-native-manager)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed)
- **The AI Chasm** - Six adoption stages from denial to sustainable execution, with a coaching playbook for each transition. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/078e524ed)
- **Team roles and limits** - Trailblazer, Toolsmith, Skeptic and Bridge roles; AI-free zones; builder titles collapse while specialties persist. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a87a256ba) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/20c8a89e3) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/345858011)

### AI Cockpit (new post!)

- **AI Cockpit (new post!)** - The physical and software control surface for multi-agent development: voice first, tmux, Alfred, an agent dashboard and Stream Deck. ([blog](/ai-cockpit)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/27e265542) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/1d54a78dd)

### AI Journal: Yegge's AI Vampire

- **The AI Vampire** - Yegge on who captures AI's productivity gain; my answer is that compounding team fluency, not today's speedup, is the value. ([blog](/ai-journal#2026-02-14)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8ea624b0c)

### Spiritual Health: Meaning Traps

- **Meaning traps** - Intro rewritten as exploratory; a motivation test for meaning and four traps where it goes missing. ([blog](/spiritual-health#the-meaning-traps)) ([blog](/activation)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/772bc2169)
- **2026 goals** - The motivation test becomes a Q1 goal, with walking with God as a daily practice. ([blog](/y2026#spiritual-health)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e50920005)

### Infrastructure & Tooling (2026-02-08)

- **Content skills** - /ai-content and /spiritual-content load the topic's post map and backlinks, then set up branch and server. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8f358f756) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/590894703)

### Other Projects (2026-02-08)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)

- **ammon skill** - Checks the time in Denmark, with a sleep warning. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/190f2bc87)
- **up-to-date** - Offers /clear after syncing. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/d73d7e0c1)

## Week of 2026-01-25

_41 commits this week_

### AI Journal Updates

- **Survival and cattle** - Yegge's software survival ratio; staying a step behind the bleeding edge; code as cattle, not pets; whenwords, a library shipped as spec plus tests. ([blog](/ai-journal#2026-01-31)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bdedc6f02) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c)
- **Review cost below generation cost** - Code no longer signals understanding, so projects like tldraw and LLVM restrict outside AI contributions. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c1447d04)

### Spiritual Health & Elder Life

- **Getting started** - New section for newcomers: midlife spiritual interest, the Vanaprastha life stages, and three obstacles with fixes from Arthur Brooks. ([blog](/spiritual-health#getting-started-for-those-whove-never-done-this)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6961c1423) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd1a34e66)

### Addiction vs Opportunity Cost

- **Compulsion or choice** - Addiction is what you don't want but do; opportunity cost is what you want but pays elsewhere; test by relief or loss. ([blog](/addiction#is-doing-the-thing-you-want-to-be-doing-an-addiction)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9d5f53bea)

### Product Management

- **Desire paths** - Discover revealed preferences by paving where users already walk, from campus paths to hashtags to Yegge's hallucination squatting. ([blog](/product#desire-paths-a-methodology-for-discovering-revealed-preferences)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c7a04a612)

### Physical Health Content

- **Shoulder anatomy** - Movement vocabulary, the rotator cuff muscles, and why external rotation matters most for impingement. ([blog](/shoulder-pain#shoulder-movement-directions-and-muscles)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c052e629b)

### How Igor CHOPs

- **Stages and principles** - Yegge's 8 stages of AI coding diagram, plus what works: rent the best brain, maximize time between interventions. ([blog](/how-igor-chops#the-8-stages-of-ai-coding)) ([blog](/how-igor-chops#what-works-well---review-this-weekly)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6)

### Infrastructure & Tooling (2026-01-25)

- **Tooling** - A /content skill for the blog workflow; ASIN metadata fetched for product links. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/99c355400)

### Other Projects (2026-01-25)

**New and smaller**

- **[Settings](https://github.com/idvorkin/Settings)** - ter switches terminal tabs; Neovim PRStatus and PRDiff; fork-aware PR base; tmux, gmail_reader and y.py completion fixes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/c5a71186c) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/9caa71bcd) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/0df43e437) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/d41d98f38) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/d658f0209) [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2d7e81279)
- **[monitor-explainer](https://monitor-explorer.surge.sh)** (new) - Compare monitors by aspect ratio and size; drag, rotate, pan and zoom. [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/3945f2323) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/01ee334d8) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/dd0ac4254) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/de9f77fb8) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/031684aab) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/b4c7e64ff) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/9ceeaea4a)
- **[nlp](https://github.com/idvorkin/nlp)** - Local MLX text-to-speech on Apple Silicon. [<i class="fa fa-github"></i>](https://github.com/idvorkin/nlp/commit/61aa07c58)
- **[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** - Deployment docs for production and PR previews. [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/93061f9d7)
- **[chop-conventions](https://github.com/idvorkin/chop-conventions)** - up-to-date detects branch commits missing from main after a merge. [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/8c0290552)

---

_Want to see what's been modified recently? Check [Recently Modified Content](/recent) for a dynamic view._

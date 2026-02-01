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

- [Week of 2026-01-25](#week-of-2026-01-25)
  - [AI Journal Updates](#ai-journal-updates)
  - [Spiritual Health & Elder Life](#spiritual-health--elder-life)
  - [Physical Health Content](#physical-health-content)
  - [How Igor CHOPs](#how-igor-chops)
  - [Pet Projects](#pet-projects)
  - [Infrastructure & Tooling](#infrastructure--tooling)
  - [Other Projects](#other-projects)
    <!-- vim-markdown-toc-end -->
    <!-- prettier-ignore-end -->

## Week of 2026-01-25

_41 commits this week_

### AI Journal Updates

Several new entries exploring the economics and philosophy of AI-assisted development:

- **Software Survival 3.0** - Added Steve Yegge's framework for navigating the AI era in software development ([blog](/ai-journal#software-survival-30---steve-yegges-framework-for-ai-era-software)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bdedc6f02)
- **The Economics of Code Review** - Explored how AI changes the cost equation: when review cost is less than generation cost, external PRs become net positive [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4c1447d04)
- **Code as Costly Signal** - Discussed what code used to signal (understanding, commitment, skin in the game) and how AI disrupts this [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8cdd7f688)
- **Addiction vs Opportunity Cost** - New framework distinguishing between true addiction and rational time allocation choices ([blog](/addiction)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/9d5f53bea)

### Spiritual Health & Elder Life

Expanded content connecting aging, spirituality, and life transitions:

- Connected the **vanaprastha** (forest-dweller) Hindu life stage to the spiritual health framework ([blog](/spiritual-health)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/6961c1423)
- Added Amazon book links for Arthur Brooks' books on spiritual health in later life [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/eef52c50f)
- Cross-linked spiritual health content with the elder life post [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/4e34b3366)
- Added desire paths section exploring stated vs revealed preferences ([blog](/product)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c7a04a612)

### Physical Health Content

- **Shoulder Pain Guide** - Added comprehensive muscle reference and self-assessment tests ([blog](/shoulder-pain)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c052e629b)
- **Monitors Section** - Redesigned with clearer dimension explanations and current setup details ([blog](/irl#monitors)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/51694832b)

### How Igor CHOPs

Updates to my AI-assisted development workflow documentation:

- Added "What Works Well" section with AI usage principles ([blog](/chop#what-works-well)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6)
- Described human-optimized content as a discovery mechanism [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/b6caa6c9a)
- Weekly review reminders added to key sections [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/401d2244e)

### Pet Projects

- Added new **Explainers** section with GitHub links to technical explainer projects ([blog](/pet-projects#explainers)) [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/f1a355bc3)
- Updated project descriptions and cross-references [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/626e6d987)

### Infrastructure & Tooling

Behind-the-scenes improvements:

- Added `/content` command for blog content workflow [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/57815355b)
- Fixed ASIN database - fetched metadata for 28 placeholder products [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/99c355400)
- Improved keyboard section with better image alt text [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/79ee8d19a)
- Made gh command detection portable across Mac and Linux [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ee28e633a)
- Auto-detect PR number in git_data_generator plugin [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/82b5d8295)

### Other Projects

Updates across the ecosystem:

**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)
- Added `ter` command for terminal tab switching [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/c5a71186c)
- Added parameter completion infrastructure to y.py [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/2d7e81279)
- Fixed Alfred integration and added universal tab completion [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/cf807d832)

**[nlp](https://github.com/idvorkin/nlp)** (AI/NLP tools)
- Added local MLX TTS support for Apple Silicon [<i class="fa fa-github"></i>](https://github.com/idvorkin/nlp/commit/61aa07c58)
- Upgraded to Gemini 3 Pro model [<i class="fa fa-github"></i>](https://github.com/idvorkin/nlp/commit/ab8078928)
- Added circled L symbol for life coach journal notes [<i class="fa fa-github"></i>](https://github.com/idvorkin/nlp/commit/a03571e50)

**[how-long-since-ai](https://idvorkin-how-long-since-ai.surge.sh)** (time tracker) [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai)
- Fixed GitHub build workflow [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/e9f56a898)
- Added deployment information to README [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai/commit/93061f9d7)

**[monitor-explainer](https://monitor-explorer.surge.sh)** (visualization) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer)
- Added comprehensive monitor explainer content and features [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/2ccc67daa)
- Added Surge deployment workflows [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/9ceeaea4a)

**[chop-conventions](https://github.com/idvorkin/chop-conventions)** (CHOP workflow docs)
- Updated up-to-date skill with leftover commit handling [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/8c0290552)
- Added snippet for applying issues across similar projects [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/ae44cb53c)
- Added PR commit history cleanup guide [<i class="fa fa-github"></i>](https://github.com/idvorkin/chop-conventions/commit/929e23d82)

---

_Want to see what's been modified recently? Check [Recently Modified Content](/recent) for a dynamic view._

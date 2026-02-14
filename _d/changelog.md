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
  - [Addiction vs Opportunity Cost](#addiction-vs-opportunity-cost)
  - [Product Management](#product-management)
  - [Physical Health Content](#physical-health-content)
  - [How Igor CHOPs](#how-igor-chops)
  - [Infrastructure & Tooling](#infrastructure--tooling)
  - [Other Projects](#other-projects)
- [December 2025](#december-2025)
  - [Fortune Cookies](#fortune-cookies)
  - [Management Manifesto](#management-manifesto)
  - [Vibe Coding Hardware](#vibe-coding-hardware)
  - [Pet Projects](#pet-projects)
- [November 2025](#november-2025)
  - [Walking With God](#walking-with-god)
  - [Eulogy Reflection Agents](#eulogy-reflection-agents)
  - [Stoicism](#stoicism)
  - [Physical Pain](#physical-pain)
  - [Infrastructure](#infrastructure)
    <!-- vim-markdown-toc-end -->
    <!-- prettier-ignore-end -->

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
- **Three Obstacles** - (1) "None" identity trap, (2) Santa in the Church (childish impressions), (3) Tyranny of Time. Solutions from Arthur Brooks' *From Strength to Strength* chapter 7. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd1a34e66)

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

**8 Stages of AI Coding** diagram from Yegge's Gas Town ([blog](/chop#the-8-stages-of-ai-coding)):

- Stages 1-4: Manual → Approval-based → YOLO mode → Full autonomy
- Stages 5-8: Single agent → Parallel agents → Specialized tools → Orchestrated system
- "Where I am: somewhere between 6 and 7, learning to avoid merge hell" [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/56e96e9a6)

**What Works Well** principles ([blog](/chop#what-works-well---review-this-weekly)):

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

## December 2025

_96 commits_

### Fortune Cookies ([blog](/fortune-cookies))

Life wisdom in bite-sized pieces, each with a YouTube short:

- **Growing older is mandatory, growing up is not** - That's not cute. That's a warning. Growing up means trading curiosity for efficiency, labeling wonder as childish. Guard your wonder. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/007521ee3)
- **The best time to plant a tree was 100 years ago** - Second best time is today. Guilt keeps you stuck in the past; action only lives in the present.
- **Cannibals prefer those without spines** - When you say yes to everything, you get eaten alive. Your spine is your filter, your courage to say no.
- **Failure is not disaster, it's data**

### Management Manifesto ([blog](/manager-book#igors-management-manifesto))

The beliefs that drive everything in the manager book:

- **My success is your success** - I have no product except the team. On my deathbed, the product I'll be proudest of is the people I watched blossom. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/c6a7116ec)
- **You are not a resource** - I can't be efficient with people—only effective.
- **Coaching is midwifery** - I can't give birth to your insights—I can only help you deliver them yourself.
- **Momentum is emotional gravity** - Forward motion creates its own fuel. Teams thrive when they feel progress.
- **Grandmother mind** - When you mess up, I'm not thinking "what's wrong with you"—I'm thinking "what happened and how do we move forward."

### Vibe Coding Hardware ([blog](/ai-journal#2025-12-21))

- **obs-cli** - TUI for OBSBOT camera control. Vim-style h/j/k/l for pan/tilt, 9 preset positions, AI tracking toggle. Vibe coding makes hardware integration trivially accessible. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e533570e9)
- **Rust tmux_helper** - Ported Python to Rust: 100ms → 14ms. Claude handled the port with minimal guidance—the translation was mechanical.
- **Tmux overhaul** - Catppuccin theme, 2-row status bar, sessionx plugin. ~20 commits of iterative fixes—the kind of tedious config work that AI makes painless.

### Pet Projects

- [Breathing Shapes](https://igor-breathe.surge.sh/) - Visual breathing exercise guide [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/a3431a85d)

---

## November 2025

_85 commits_

### Walking With God ([blog](/walking-with-god))

Daily devotionals translating religious concepts into secular wisdom:

- **Just Like Jesus** - You can call yourself a Christian, but if you're not actually doing what Jesus taught—showing compassion, loving enemies, helping the marginalized—you're just wearing a badge. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/191bc0ebf)
- **Asa's Folly** - The trap of half-measures and partial commitment.
- **Idolatry as Revealed Preferences** - What you do shows what you actually worship, not what you claim to worship.
- **A Prescription for Pain** - Finding meaning in suffering.
- **Brotherly Devotion** - Commitment to community beyond convenience.

### Eulogy Reflection Agents ([blog](/eulogy))

Claude agents for examining each role from my eulogy—asking the hard questions:

- **7 habits** - Are you choosing your response to circumstances, or reacting? How recently have you reviewed your eulogy? [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/e3bebb863)
- **Father to Zach/Amelia** - What do you cherish about them? How are you showing up?
- **Husband to Tori** - How's the partnership?
- **Professional** - Does your job align with your dream job?
- **Technologist** - Side projects, teaching, VIM devotion.
- **Fit fellow** - Running, kettlebells, sleep.
- **Emotional health** - Meditation practice, gratitude journaling, grandmother mind.
- **Car-free spirit** - Biking adventures, the tension with Tony the Tesla.
- **Dealer of smiles and wonder** - Magic, ballooning, bringing joy to strangers.

### Stoicism ([blog](/stoicism))

Stoic philosophy content pulled into its own page—separated from religion for clarity. The dichotomy of control, negative visualization, memento mori. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/8082662ae)

### Physical Pain ([blog](/physical-pain))

Shoulder pain guidance, book recommendations, better structure for managing different pain types. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/d4158c113)

### Infrastructure

- Parcel → Vite migration [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/ff12c59cc)
- Vapi widget for Tony the Tesla [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/dd5132c54)

---

_Want to see what's been modified recently? Check [Recently Modified Content](/recent) for a dynamic view._

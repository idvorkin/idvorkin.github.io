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

- [Week of 2026-02-08](#week-of-2026-02-08)
  - [AI Native Engineering Manager (new post!)](#ai-native-engineering-manager-new-post)
  - [AI Cockpit (new post!)](#ai-cockpit-new-post)
  - [AI Journal: Yegge's AI Vampire](#ai-journal-yegges-ai-vampire)
  - [Spiritual Health: Meaning Traps](#spiritual-health-meaning-traps)
  - [Infrastructure & Tooling](#infrastructure--tooling)
  - [Other Projects](#other-projects-1)
- [Week of 2026-01-25](#week-of-2026-01-25)
  - [AI Journal Updates](#ai-journal-updates)
  - [Spiritual Health & Elder Life](#spiritual-health--elder-life)
  - [Addiction vs Opportunity Cost](#addiction-vs-opportunity-cost)
  - [Product Management](#product-management)
  - [Physical Health Content](#physical-health-content)
  - [How Igor CHOPs](#how-igor-chops)
  - [Infrastructure & Tooling](#infrastructure--tooling-1)
  - [Other Projects](#other-projects)
    <!-- vim-markdown-toc-end -->
    <!-- prettier-ignore-end -->

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

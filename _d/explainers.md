---
layout: post
title: "Explainers: Interactive Understanding"
permalink: /explainers
tags:
  - ai
  - tools
  - how
redirect_from:
  - /explorable-explanations
  - /interactive-explanations
---

You don't really understand something until you can play with it. That's the premise behind explainers — interactive experiences that let you _do_ the thing, not just read about it. Instead of reading that monitors come in 16:9 and 21:9 aspect ratios, you drag them around and see them side by side. Instead of reading that religions evolved from shared roots, you click through a timeline and discover the connections yourself.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Why Now: AI Changed Everything](#why-now-ai-changed-everything)
  - [AI Makes Explainers Trivially Easy to Build](#ai-makes-explainers-trivially-easy-to-build)
  - [AI Makes Explainers Critically Necessary](#ai-makes-explainers-critically-necessary)
  - [Explainers as Evidence: Trust but Verify](#explainers-as-evidence-trust-but-verify)
  - [The Willison Pattern](#the-willison-pattern)
- [Explainers I've Built](#explainers-ive-built)
  - [My Stack](#my-stack)
- [Great Explainers in the Wild](#great-explainers-in-the-wild)
  - [Amazing](#amazing)
  - [I Need to Review](#i-need-to-review)
  - [Tech Specific](#tech-specific)
  - [Other Standouts](#other-standouts)
- [Tooling for Building Explainers](#tooling-for-building-explainers)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include alert.html content="Why you should be doing this now: AI made explainers both trivially easy to build AND critically necessary. If you're [CHOPing](/chop) and not building explainers, you're accumulating [cognitive debt](/ai-native-manager#cognitive-debt) you'll never pay down." style="warning" %}

## Why Now: AI Changed Everything

Explainers aren't new — Bret Victor wrote about [explorable explanations](https://worrydream.com/ExplorableExplanations/) in 2011, and Nicky Case has been building brilliant ones for a decade. What's new is that AI flipped both sides of the equation at once: explainers became trivially easy to build _and_ critically necessary to have.

### AI Makes Explainers Trivially Easy to Build

Before AI, building an interactive explainer meant weeks of work — designing the visualization, writing the code, debugging cross-browser issues, deploying it. That's why so few people made them. Nicky Case spent months on each piece. Red Blob Games articles take serious engineering effort.

Now I describe a concept to Claude and have a working interactive visualization deployed to a live URL in a single session. My [monitor explainer](https://monitor-explorer.surge.sh/) went from "I wish I could see monitor sizes side by side" to a draggable, zoomable comparison tool in an afternoon. The [religion evolution explorer](https://religion-evolution-explorer.surge.sh/) — an interactive timeline of how world religions influenced each other — same thing.

The cost of building an explainer dropped from "major project" to "about the same effort as writing a blog post." That changes the calculus completely. You don't need to justify a month of work anymore — if something would be clearer as an interactive experience, just build it. This is the [CHOP](/chop) superpower in action — [CHOW](/chow) for writing, CHOP for code, and now Chat-Oriented Explainers for understanding.

### AI Makes Explainers Critically Necessary

Here's the twist: the same AI that makes explainers easy to build is also creating an unprecedented need for them. AI writes code faster than humans can comprehend it. [Cognitive debt](/ai-native-manager#cognitive-debt) — the understanding gap between what your system does and what your team understands — is accumulating at a rate we've never seen before.

Someone in [CHOP](/chop) mode ships ten features in a week. The code works. But can anyone on the team explain _why_ it works? What the design decisions were? What will break if you change it? That's cognitive debt, and it compounds. The team that can't explain what they shipped can't confidently change it — and that's basically the definition of legacy software: software you're afraid to change.

Explainers are the antidote. The same AI that creates the debt can pay it down: ask it to build you an interactive explanation of what it just built. Don't just ship the feature — ship the explainer. If the AI can't explain what it built in an interactive picture, that's a red flag that nobody else will understand it either.

### Explainers as Evidence: Trust but Verify

There's a close cousin to explainers that matters just as much: **proof of work**. Explainers help you _understand_ what AI built. Proof artifacts help you _verify_ that AI actually did what it claimed.

When [CHOPing](/chop), AI loves to tell you "Done! I fixed the bug and added the feature." But did it? AI lies — not maliciously, but confidently. The [testing/evals](/chop#what-matters-most-is-testingevals) mindset says: make AI prove it. Screenshots, before/after comparisons, interactive demos that show the change actually happened. Tools like [Showboat](https://github.com/idvorkin/chop-conventions/tree/main/skills/showboat) generate executable demo documents with screenshots — visual evidence that the code does what it claims.

The spectrum runs from understanding to verification:

- **Explainers** — "Help me understand how this algorithm works" (interactive visualization)
- **Proof of work** — "Show me evidence that this change actually works" (screenshots, demos, test results)

Both are antidotes to the same problem: AI moving faster than human comprehension. Explainers pay down cognitive debt. Proof artifacts prevent you from shipping broken things with confidence.

### The Willison Pattern

Simon Willison coined the term [interactive explanations](https://simonwillison.net/guides/agentic-engineering-patterns/interactive-explanations/) as an agentic engineering pattern. His example: Claude generated a Rust word cloud tool and explained it uses "Archimedean spiral placement with per-word random angular offset for natural-looking layouts." That explanation did nothing. So he asked Claude to build an animated HTML page showing the algorithm step by step — words placed sequentially, collision detection boxes visible, spiral paths drawn. _That_ made it click instantly.

The pattern is simple:

1. AI generates something complex
2. You don't fully understand it
3. Ask AI to build an interactive explanation of what it just built
4. Play with it until it clicks

In [CHOW](/chow) (Chat-Oriented Writing), the written artifact is a side effect — the real product is clarity in your head. Explainers take this further: the _interactive_ artifact is even better than text for creating clarity, because you learn by doing instead of reading. Text gives you information. Explainers give you understanding.

## Explainers I've Built

| Explainer                                                                    | What It Does                                                             | Instead Of                  |                                                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------- |
| [Monitor Explainer](https://monitor-explorer.surge.sh/)                      | Explains monitor dimensions, aspect ratios, and the "p" vs "K" confusion | Reading spec sheets         | [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer)           |
| [How Long Since AI](https://idvorkin-how-long-since-ai.surge.sh/)            | Track time since AI milestones — ChatGPT, GPT-4, Claude, Gemini          | Searching for release dates | [<i class="fa fa-github"></i>](https://github.com/idvorkin/how-long-since-ai)           |
| [Religion Evolution Explorer](https://religion-evolution-explorer.surge.sh/) | Interactive timeline of how religions evolved and influenced each other  | Reading history books       | [<i class="fa fa-github"></i>](https://github.com/idvorkin/religion-evolution-explorer) |

The pattern is the same every time: take something that's hard to grasp as text, ask AI to build an interactive version, and suddenly it makes sense. These aren't prettier presentations — they're fundamentally different experiences. You explore at your own pace, discover things the author didn't explicitly write, and actually retain what you learned.

### My Stack

Every explainer follows the same recipe:

- **Vite + React + TypeScript** — fast dev loop, type safety, modern tooling
- **justfile** — standard commands: `dev`, `build`, `deploy-stage`, `deploy-prod`
- **GitHub Actions** — CI on every push, PR previews via surge
- **Surge.sh** — deployment in seconds: `{name}.surge.sh`
- **No framework beyond React** — keep it simple, keep it fast

The workflow: describe the concept to Claude, iterate on the visualization in dev mode, deploy to surge when it works. Most of my explainers went from idea to live URL in a single session.

See also: [my pet projects](/pet-projects) for the full list of things I build.

## Great Explainers in the Wild

### Amazing

- **[The Evolution of Trust](https://ncase.me/trust/)** (6.2k stars) — Game theory of cooperation as a playable story. You don't just learn about the prisoner's dilemma — you play dozens of rounds and watch strategies evolve
  - It really is a fun game
  - Has a lesson
  - What makes [Nicky Case's](https://ncase.me/) work exceptional: each piece has a **narrative arc** — it doesn't just present data, it walks you through a story with emotional stakes and reveals. You _feel_ the concept, not just see it.

### I Need to Review

- **[Parable of the Polygons](https://ncase.me/polygons/)** (1.3k stars) — How harmless individual preferences create segregation. Drag triangles and squares around and watch neighborhoods emerge
- **[To Build a Better Ballot](https://ncase.me/ballot/)** — Voting systems explained by actually voting in them
- **[We Become What We Behold](https://github.com/ncase/wbwwb)** (1.4k stars) — A five-minute game about news cycles and attention

### Tech Specific

[Amit Patel's Red Blob Games](https://www.redblobgames.com/) is the definitive resource for understanding game algorithms through interaction. Every article has draggable, clickable visualizations:

- **[A\* Pathfinding](https://www.redblobgames.com/pathfinding/a-star/introduction.html)** — The canonical interactive pathfinding tutorial. Drag walls, watch the algorithm explore
- **[Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/)** — Everything about hex grids, with interactive coordinate system explorers
- **[Noise](https://www.redblobgames.com/articles/noise/introduction.html)** — Perlin noise and terrain generation you can manipulate in real-time

Red Blob Games proves that the best way to learn an algorithm is to watch it work and tweak its inputs.

### Other Standouts

- **[Paras Chopra's Explainers](https://paraschopra.github.io/explainers/)** — AI-generated explainers covering Instagram's recommendation system, diffusion models, Shazam's song recognition, and LLMs. Proof that the AI-builds-explainers pattern works
- **[Explained Visually](https://setosa.io/ev/)** — Image kernels, pi, exponentiation — classic mathematical concepts with clean interactive diagrams
- **[TensorFlow Playground](https://playground.tensorflow.org/)** — Neural networks you can actually watch learn in real-time
- **[3Blue1Brown / Manim](https://github.com/3b1b/manim)** (84.9k stars) — Not interactive, but the animation engine behind the best math explanations on YouTube. Proof that visual > text for mathematical understanding
- **[Immersive Math](https://immersivemath.com/)** — Linear algebra textbook with fully interactive 3D figures
- **[PhET Simulations](https://phet.colorado.edu/)** — University of Colorado's interactive science simulations, backed by extensive education research

See also: [awesome-explorables](https://github.com/blob42/awesome-explorables) — a curated list of hundreds more.

## Tooling for Building Explainers

My explainer workflow is built on top of the [CHOP](/chop) stack. The key tools:

- **gen-image** — AI image generation skill for raccoon illustrations and visual assets
- **[Showboat](https://github.com/idvorkin/chop-conventions/tree/main/skills/showboat)** — Creates executable demo documents with screenshots, the proof-of-work cousin to explainers
- **image-explore** — Brainstorm multiple visual directions, generate in parallel, build comparison pages

The dream: a skill that takes a concept from your blog and proposes an explainer for it — what it would visualize, how users would interact with it, and what they'd understand afterward that they didn't before.

---
layout: post
title: "The Dark Factory: The Three Limits on AI-Run Code"
permalink: /dark-factory
imagefeature: /images/raccoon-ai-native-em-plates.webp
tags:
  - ai
  - software engineering
  - manager
redirect_from:
  - /dark-factories
  - /dark-codebase
alias:
  - /dark-factories
---

A dark factory is a manufacturing plant that runs with the lights off, because the only things working there are robots, and robots don't need to see. The software version is the codebase where AI does the writing, reviewing, and merging, with no human in the implementation loop. The exciting part isn't the headcount you save — it's execution at the speed of thought. So the questions I actually care about are: where does this dream work, where does it break, and where do humans still provide value? The answer comes down to three limits.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What Is a Dark Factory?](#what-is-a-dark-factory)
  - [Automation Is a Knob, a Dark Factory Is a State](#automation-is-a-knob-a-dark-factory-is-a-state)
- [The Three First-Principles Limits](#the-three-first-principles-limits)
  - [Limit 1: Verification (the one everyone names)](#limit-1-verification-the-one-everyone-names)
  - [Limit 2: Progress (the one they miss)](#limit-2-progress-the-one-they-miss)
  - [Limit 3: Cost (the one nobody understands yet)](#limit-3-cost-the-one-nobody-understands-yet)
- [Where It Works, Where It Breaks, and Where You Come In](#where-it-works-where-it-breaks-and-where-you-come-in)
- [Why the Dark Factory Marches Toward Collapse](#why-the-dark-factory-marches-toward-collapse)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What Is a Dark Factory?

A **dark factory** (also _lights-out manufacturing_) is a fully-automated production facility that runs without humans on-site — and therefore without lights, climate control, or any of the other conditions humans need. Robots, AI vision, sensors, and autonomous mobile platforms handle every step. The "dark" is literal: the machines don't see in our spectrum, so there's no reason to turn the lights on. FANUC's robot-building plant in Japan is the canonical example.

The word is borrowed from manufacturing, but the more interesting use is in software:

- A **dark codebase** is one where AI agents do most of the writing, reviewing, and merging — no human is in the implementation loop.
- A **dark service** is a production system humans monitor by metrics but never touch in code.
- A **dark team** is an org unit that looks like a team (Slack channel, roadmap, OKRs) but the labor inside is mostly agentic, with one or two humans at the top steering.

Headcount drops; output doesn't.

### Automation Is a Knob, a Dark Factory Is a State

The word matters because it carves out a category that "automation" softens. Automation is a knob — a little, a lot, depends on the task. A dark factory is a state: _production has been decoupled from labor_. Once you see the word, you start noticing that some teams have already drifted there without anyone deciding to. Nobody fired the humans; the humans just got less and less central until one day the system would survive their leaving and no one could rebuild it from scratch.

So the real question isn't "should we build a dark factory?" It's "how far can a dark factory actually go before it breaks?" That comes down to three limits.

## The Three First-Principles Limits

A dark factory only works while the AI can keep building unsupervised. So strip it to first principles and ask what could possibly stop that. Three things:

1. **Verification** — can you tell whether the output is right?
2. **Progress** — can the AI find a next move that makes things better without making something else worse?
3. **Cost** — can you afford the compute to get there?

The first is well understood; it's the wall everyone talks about. The second is the one they miss, and it's the one that kills you. The third we barely understand at all.

### Limit 1: Verification (the one everyone names)

The standard answer to "what bounds AI coding?" is verification. Can you check the work? If verification is cheap — fast tests, strong types, tight feedback loops, an [eval you can hill-climb against](/hill-climbing) — the AI can run hot, because every change gets graded in seconds and the bad ones get thrown out. If verification is expensive — subtle correctness, distributed-systems race conditions, security properties, "looks right but isn't" — then going dark is dangerous, because nothing is catching the mistakes.

This limit is real, and it's the one most people stop at. Make verification cheap and you can let the AI off the leash. Fine. But verification is only the first of three.

### Limit 2: Progress (the one they miss)

Here's the part people miss: even with _perfect_ verification, there's a separate question. Can the AI actually move forward? Can it find a change that improves the system without breaking three other things? Verification tells you whether a move was good. Progress is whether a good move exists and the AI can find it. You can have a perfect oracle telling you "nope, still broken" forever.

And progress is not constant. It decays with the complexity of the codebase you're working in. There are three zones.

#### The Easy Zone

Empty repo, simple code, few constraints. The AI cruises. Every change is local — touch this, nothing else cares. This is where all the demos live, where "I built an app in a weekend" comes from. It's real, and it's genuinely warp speed. The mistake is assuming the easy zone is the whole map.

#### The Complexity Wall

As the codebase grows, changes stop being local. A change here now affects something over there. The number of constraints the AI has to satisfy at once climbs, and so does the amount of the system it has to hold in its head to make a safe move. Progress slows — more attempts per win, more "fix it, then fix what the fix broke." The AI starts needing more hand-holding to do what it did effortlessly a month ago. You're still moving, just into a stiffer and stiffer wind.

#### Complexity Collapse

The terminal state. The codebase is so interconnected that there's no move that improves the whole — every fix surfaces a problem somewhere else. The agent says it worked. Then you find a problem over there. Then another one over there. You're playing whack-a-mole against a board with more moles than holes. This is the [infinite loop](/ai-native-manager#infinite-loop) at the level of the whole system instead of a single function — not the agent stuck on a four-line bug, but the agent stuck on the architecture.

I hit this on my swing analyzer. I looked up and the agent had built _two complete, parallel implementations of the UX_ — one in React and one in jQuery. Pretty crazy. Nothing was "broken" in a way a test would catch; the system had just lost its center. That's complexity collapse — not a bug you fix, a shape you have to redraw.

This isn't an AI-specific failure — which is the tell that it's real. Like everything in AI, it's not new: it's what happens when you don't have architects. A room of only junior engineers produces exactly the same thing — lots of motion, no architectural center, every change rippling everywhere. It's the inverse of the cleanest definition of good architecture I know: in a well-architected system there's exactly _one_ logical place to make any given change. Complexity collapse is the opposite — there's no right place, or every place is wrong in its own way.

### Limit 3: Cost (the one nobody understands yet)

The third limit is cost, and I'll be honest: I don't have a clean model for it, and I don't think anyone does yet. Tokens aren't free, and a dark factory runs them at the speed of thought — around the clock, with no human pausing to think between tries. The bill is real, and it's the limit we understand least.

What makes cost slippery is that it isn't independent of the other two — it's downstream of them. Cheap verification makes the AI cheaper, because fewer cycles get wasted on changes that turn out wrong. And as you approach collapse, cost-per-fix explodes: more attempts per win, more context dragged into every prompt, more retries against a problem with no good move. The same token price buys a feature in the easy zone and buys nothing near collapse. So cost isn't a flat tax — it's a multiplier that spikes exactly when progress is already failing.

There's a harder version of the limit, too: a fix can be technically possible and economically irrational. At some point the cheapest move isn't to fix the system — it's to throw it away and regenerate it, or to leave it broken. We don't have good intuitions for when that line gets crossed, and we don't have the observability to see it coming. Token prices keep falling, which makes it tempting to wave the whole thing away; but ambitions rise faster than prices drop, so the bill keeps mattering. Of the three, this is the open frontier — the limit most likely to surprise us.

## Where It Works, Where It Breaks, and Where You Come In

The practical use of the three limits is diagnostic: when a dark factory stalls, take them one at a time and ask which one you're actually hitting — verification, progress, or cost — because the fix is different for each.

Stack the three and you get a box. Inside it — the easy zone, cheap verification, a small bill — the dark factory isn't just viable, it's correct. A human in the loop there is pure overhead; the factory builds faster and cheaper than you can. Lights out, and mean it.

The factory breaks at the edges of that box, at whichever limit binds first:

- **Verification gets expensive** — "right" now needs taste or context that no test encodes.
- **Complexity collapse** — the codebase is tangled enough that there's no good next move, and the agent thrashes.
- **Cost goes irrational** — the compute to make progress is worth more than the progress.

And here's the part I find most interesting: humans provide value in exactly the places the factory breaks. That's the whole job now.

- **At the verification limit, you're the oracle.** Where you can't write the test, a person decides whether it's right — taste, judgment, "this looks fine but it's wrong."
- **At the progress limit, you re-shape the problem.** The agent can't climb out of collapse from the inside; someone has to redraw the boundaries so a good next move exists again, and decide where the _one logical place_ to make a change should be. That's architecture, and it's the highest-leverage move in the building.
- **At the cost limit, you make the call.** When is it no longer worth it? When do you throw the module away and regenerate instead of fixing it? That's an economic judgment, not a coding task.

The factory owns the interior. You own the boundary. The skill that matters now isn't writing code in the easy zone — the factory does that cheaper than you ever will. It's knowing where the boundary is, and being able to work there when the lights have to come back on.

## Why the Dark Factory Marches Toward Collapse

Put the limits together and the dark factory has a nasty property: it accelerates its own trip to the second wall — and drags the third along with it.

A dark codebase runs beautifully in the easy zone. But with no one in the implementation loop, [cognitive debt](/ai-native-manager#cognitive-debt) compounds — nobody holds the mental model of why the system is shaped the way it is, so the architectural moves that keep complexity in check never happen. Complexity that would otherwise get refactored away just accretes. The factory drifts from the easy zone, through the complexity wall, toward complexity collapse, and every step in that direction quietly runs up the bill, because cost rides on top of failing progress.

It's a Peter Principle for systems: the factory keeps promoting itself into more complexity until it reaches the level where it fails. The difference is the recovery — you can step a person back down a rung, but it's unclear how a dark factory backs down a step and tries again.

One caveat on all of this: the boundaries move. Where the easy zone ends, how far the agent gets before progress stalls, what's too expensive to be worth it — none of those are fixed. They're set by today's models, and by [the bitter lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) the methods that ride raw compute keep winning, so the interior keeps expanding. Today's complexity wall is next year's easy zone. The shape of the argument holds — there's always a boundary, and humans always live on it — but where that boundary sits is a moving target. Don't mistake today's edge for a permanent one.

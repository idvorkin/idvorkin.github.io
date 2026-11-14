---
layout: post
title: "Evals With No Right Answer: A Recipe"
permalink: /subjective-evals
ai_default_image: true
tags:
  - ai
  - machine-learning
---

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- This page is Igor's draft built from Cameron Wolfe's AI Engineer NYC talk. Explanation is original; never paste the speaker's sentences.
- Every step links a verified timestamp (youtu.be/zLc8zeGeNaY?t=SEC). Re-check against the captions before changing one.
- The TODO-for-Igor alerts are Igor's to fill. Don't write his opinions into them.
-->

Grading a math answer is a string compare. Grading a short story, a show synopsis, or an agent's research report has no answer key, and that's where most of the AI systems people actually want to build live. Cameron Wolfe's talk at AI Engineer NYC is the clearest recipe I've found for that case, so this page is my notes on it, written for people figuring out how to build AI systems: what the point is, the background he sets up, then the recipe as steps you can follow.

{% include ai-slop.html percent="90" %}

{% include alert.html content="✏️ Draft. I'm still fleshing this out; the TODO-for-Igor boxes are where my own take goes." style="warning" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What is the point?](#what-is-the-point)
- [Background: why evals are hard](#background-why-evals-are-hard)
  - [Three reasons, and the one he picks](#three-reasons-and-the-one-he-picks)
  - [Anatomy of one eval run](#anatomy-of-one-eval-run)
  - [The verifiability spectrum](#the-verifiability-spectrum)
  - [The three parts](#the-three-parts)
- [The recipe](#the-recipe)
  - [1. Write down what "good" means, with experts](#1-write-down-what-good-means-with-experts)
  - [2. Calibrate the humans](#2-calibrate-the-humans)
  - [3. Decide how much data, and which data](#3-decide-how-much-data-and-which-data)
  - [4. Build an automatic stand-in for the humans](#4-build-an-automatic-stand-in-for-the-humans)
  - [5. Grade the grader](#5-grade-the-grader)
  - [6. Turn it into a benchmark and report the noise](#6-turn-it-into-a-benchmark-and-report-the-noise)
  - [7. Funnel: many offline, few to humans](#7-funnel-many-offline-few-to-humans)
  - [8. A/B test before you ship](#8-ab-test-before-you-ship)
  - [9. Keep watching, feed failures back, repeat](#9-keep-watching-feed-failures-back-repeat)
  - [The whole loop on one line](#the-whole-loop-on-one-line)
- [Where I am on this](#where-i-am-on-this)
- [Watch the talk](#watch-the-talk)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What is the point?

An eval exists to answer one question: did this change make the system better? A new prompt, a new model, a new tool for the agent. If the score can't tell a real improvement from a lucky run, it's decoration.

Wolfe's version of the point: he wants to know a higher score means a better model, not a noisier run ([12:49](https://youtu.be/zLc8zeGeNaY?t=769)). The trouble is that everything in an eval wobbles. The agent gives a different answer each run, the test set is small because runs are expensive, and on open-ended work the grader is a model that wobbles too. Stack those and you can't tell whether the agent got better or worse ([3:45](https://youtu.be/zLc8zeGeNaY?t=225)). The talk is a set of moves for getting a decision you can trust out of that mess ([3:55](https://youtu.be/zLc8zeGeNaY?t=235)).

{% include alert.html content="✏️ TODO for Igor: why this matters to me. What decision was I trying to make the last time an eval let me down?" style="warning" %}

## Background: why evals are hard

### Three reasons, and the one he picks

His slides name three: **scope** (agents do too many kinds of things to cover), **cost** (each test case can be slow or expensive), and **noise** (randomness from several places makes results jump around). He spends the talk on noise ([1:17](https://youtu.be/zLc8zeGeNaY?t=77)).

### Anatomy of one eval run

He walks through a single trial ([1:38](https://youtu.be/zLc8zeGeNaY?t=98)):

1. A suite of tasks.
2. An agent attempts each one and leaves a trajectory and a final answer. The agent is non-deterministic.
3. A grader turns the answer into pass or fail.

Because a single run of some recent benchmarks costs tens of thousands of dollars ([2:08](https://youtu.be/zLc8zeGeNaY?t=128)), suites stay small. A small suite plus a random agent already makes a shaky number.

### The verifiability spectrum

Most published evals stick to tasks where the grader is a function: string match, symbolic math check, unit tests. Real work spreads across a range ([2:54](https://youtu.be/zLc8zeGeNaY?t=174)). His slide puts math and competitive programming at the checkable end, instruction following, SWE, workplace tasks and deep research in the middle, and chat and creative writing at the open end.

At the open end the grader has to be an LLM judge or a rubric, so the one deterministic piece of the pipeline becomes a second source of randomness ([3:29](https://youtu.be/zLc8zeGeNaY?t=209)). That's the problem the recipe solves.

### The three parts

The recipe has three parts that feed each other ([3:55](https://youtu.be/zLc8zeGeNaY?t=235)):

- **Human evaluation**: the definition of good.
- **Offline evaluation**: an automatic judge, cheap enough to run on every idea.
- **Production monitoring**: what real users do.

## The recipe

The slides number it Step One to Step Four. I've split those into smaller steps a builder can tick off.

### 1. Write down what "good" means, with experts

Before any automation, set up human review, because it's the reference everything else gets checked against ([4:30](https://youtu.be/zLc8zeGeNaY?t=270)). Sit with a few people who know the domain and write quality guidelines:

- a short list of criteria,
- how each one is scored (yes/no or a 1–5 scale),
- lots of detail and worked examples, so a stranger would score the same way.

### 2. Calibrate the humans

Don't assume the guidelines work. Have several people score the same items, measure how often they agree, and rewrite the guidelines wherever they split ([5:26](https://youtu.be/zLc8zeGeNaY?t=326)). Repeat until agreement is high. His further-reading slide points at Fleiss' kappa and Krippendorff's alpha for measuring it; I collected how low human agreement runs in practice in [Humans don't agree either](/ai-testing#humans-dont-agree-either).

### 3. Decide how much data, and which data

**How much**: power analysis ([6:23](https://youtu.be/zLc8zeGeNaY?t=383)). Pick the smallest gap between two versions you care about, estimate how noisy scores are (resampling the same items helps), pick how sure you want to be, and the math gives a sample size. The slide has the formula:

> **n = (z<sub>α/2</sub> + z<sub>β</sub>)² × (ω² + σ<sub>A</sub>²/K<sub>A</sub> + σ<sub>B</sub>²/K<sub>B</sub>) / δ²**

- **δ**: the smallest difference worth detecting
- **ω²**: how much the per-item score difference between A and B varies
- **σ²/K**: leftover run-to-run noise, shrunk by taking K resamples per item

A worked example of my own, not from the talk: at the usual 95% confidence and 80% power the first factor is about 7.8. If per-item score differences have a standard deviation of 0.3 on a 0–1 scale and I want to catch a 0.05 improvement, that's about 280 items. To catch a 0.10 improvement, about 70. Halving the gap you want to see quadruples the data.

**Which data** ([7:12](https://youtu.be/zLc8zeGeNaY?t=432)): items that look like production traffic and cover its variety, hard enough that different models get different scores (find them by sampling a few models and seeing what they fail), and correct, cleaned with a mix of model and human filtering. This applies to every eval set, not only the human one.

### 4. Build an automatic stand-in for the humans

Humans can't review every experiment, so build an offline proxy ([8:20](https://youtu.be/zLc8zeGeNaY?t=500)). Two flavors:

- **LLM judge**: one set of quality guidelines, applied to every task, much like the human reviewers.
- **Rubric** ([8:57](https://youtu.be/zLc8zeGeNaY?t=537)): a checklist written per task, each item checked on its own. More specific, so more objective. His example is from the [DR Tulu paper](https://arxiv.org/abs/2511.19399), where a deep-research answer about adapting a novel for the screen is graded against a list of concrete things it must contain ([9:09](https://youtu.be/zLc8zeGeNaY?t=549)).

### 5. Grade the grader

The judge is a proxy, so check it before trusting it ([9:54](https://youtu.be/zLc8zeGeNaY?t=594)). Take items the calibrated humans scored and you're confident in (he calls them golden data), run the judge on them, and measure agreement: correlation for scores, accuracy for pass/fail.

He mentions a Netflix project he worked on ([writeup](https://netflixtechblog.com/evaluating-netflix-show-synopses-with-llm-as-a-judge-6269251e6f28)) where, he says, the judge's scores were causally linked to viewers abandoning shows ([10:34](https://youtu.be/zLc8zeGeNaY?t=634)). Tying a judge to a business metric is about as strong a check as it gets.

How good is good enough? Depends on how subjective the task is. Use the humans as the bar: aim for the judge to agree with people about as often as people agree with each other ([10:56](https://youtu.be/zLc8zeGeNaY?t=656)). It's the same bar I use in [AI Testing](/ai-testing#humans-dont-agree-either).

### 6. Turn it into a benchmark and report the noise

With a judge you trust, build benchmarks the same way as step 3: sample the data carefully, grade with the judge, and keep refreshing the set ([11:26](https://youtu.be/zLc8zeGeNaY?t=686)).

Now both the agent and the grader are random ([11:48](https://youtu.be/zLc8zeGeNaY?t=708)), so throw statistics at it ([12:04](https://youtu.be/zLc8zeGeNaY?t=724)):

- power analysis to size the benchmark,
- error bars on every number,
- resampling (several runs of the agent, several passes of the judge) to shrink variance.

Report each score with its confidence interval next to it. That's what lets you say version B beat version A rather than got luckier.

### 7. Funnel: many offline, few to humans

Run lots of ideas through the offline evals, since they're cheap. Send only the winners to human review for a closer look ([13:11](https://youtu.be/zLc8zeGeNaY?t=791)).

### 8. A/B test before you ship

Human review still leaves one step before launch ([13:26](https://youtu.be/zLc8zeGeNaY?t=806)). Pick production signals ([13:33](https://youtu.be/zLc8zeGeNaY?t=813)):

- **explicit**: thumbs up/down, which of two answers users prefer ([13:45](https://youtu.be/zLc8zeGeNaY?t=825)),
- **implicit**: session length, how often people give up ([13:53](https://youtu.be/zLc8zeGeNaY?t=833)).

Compare the new agent against the current one in an A/B test, sized with the same power math ([14:13](https://youtu.be/zLc8zeGeNaY?t=853)). Treat it as a soft launch: prove it on a slice of traffic before rolling out to everyone ([14:36](https://youtu.be/zLc8zeGeNaY?t=876)).

### 9. Keep watching, feed failures back, repeat

After launch, watch for drift, new failure cases and uses nobody planned for, and push them back into the offline and human sets ([15:07](https://youtu.be/zLc8zeGeNaY?t=907)). The slides call this Step Four ([15:16](https://youtu.be/zLc8zeGeNaY?t=916)): tighten the criteria, re-calibrate humans and judges, swap in harder data before the benchmark saturates, or run the whole loop again for a new domain.

### The whole loop on one line

Offline evals screen → humans confirm → A/B test decides → ship → production failures feed the next round. Noise gets fought at every step ([15:46](https://youtu.be/zLc8zeGeNaY?t=946)).

## Where I am on this

My own evals are small: [my benchmark evals](/ai-testing#my-benchmark-evals) grade an agent's blog edits with deterministic checkers and an LLM judge layered on top, and [AI Eval Tools](/ai-eval-tools) covers what I run them with.

{% include alert.html content="✏️ TODO for Igor: which of the nine steps do I actually do today, and which do I skip?" style="warning" %}

{% include alert.html content="✏️ TODO for Igor: does this shrink to a solo builder? What would stand in for the expert panel (steps 1–2) and the A/B test (step 8)?" style="warning" %}

{% include alert.html content="✏️ TODO for Igor: where I disagree with the talk, or what I'd add." style="warning" %}

## Watch the talk

Cameron Wolfe, staff research scientist at Netflix and author of the Deep (Learning) Focus newsletter, at AI Engineer NYC: How Netflix Evaluates AI When There's No Right Answer (18 minutes).

{% include youtube.html src="zLc8zeGeNaY" %}

- [Slides](https://docs.google.com/presentation/d/146TscsJ21LU4kATVS3ES2oC_oZxoCBsTH3soepY25P4/edit?usp=sharing)
- [Evaluating Agents on Highly Subjective Tasks](https://cameronrwolfe.substack.com/p/subjective-evals), his written version
- [His post on statistics for LLM evals](https://cameronrwolfe.substack.com/p/stats-llm-evals): power analysis, error bars and resampling in depth
- [Anthropic's statistical approach to model evals](https://www.anthropic.com/research/statistical-approach-to-model-evals)
- [Hamel Husain's evals FAQ](https://hamel.dev/blog/posts/evals-faq/) and [Eugene Yan on labeling guidelines](https://eugeneyan.com/writing/labeling-guidelines/), both from his reading list

---
layout: post
title: "Beyond Prompts: Training Your Own Agents"
permalink: /beyond-prompts
redirect_from:
  - /train-agents
  - /agent-training
tags:
  - ai
  - machine-learning
ai_default_image: true
---

I've written up how the labs post-train a model and what the methods are called. This post is the one I actually needed: when does a prompt stop being enough for an agent I run myself, and what do I reach for next? The two agents I care about are a coding agent that edits this blog and a personal agent that talks to me all day, and they sit on opposite ends of one question — is there an answer key? Coding has one (the tests). A personal agent doesn't, and building the grader is most of the work.

{% include alert.html content="🚧 Outline first. Headings and a line or two per section so the shape can be argued with before the prose exists. 🚧" style="warning" %}

{% include alert.html content="Everything here is public information and my own opinions. There's no secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The ladder beyond prompts](#the-ladder-beyond-prompts)
- [When the prompt stops being enough](#when-the-prompt-stops-being-enough)
- [Coding agents: the answer-key case](#coding-agents-the-answer-key-case)
  - [The tests are the grader](#the-tests-are-the-grader)
  - [How the checker gets gamed](#how-the-checker-gets-gamed)
- [Personal agents: the no-answer-key case](#personal-agents-the-no-answer-key-case)
  - [Building a grader from your own taste](#building-a-grader-from-your-own-taste)
  - [How the taste test gets gamed](#how-the-taste-test-gets-gamed)
- [What a solo builder can run today](#what-a-solo-builder-can-run-today)
- [The order I'd do it in](#the-order-id-do-it-in)
- [What this post is not about](#what-this-post-is-not-about)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The ladder beyond prompts

Four rungs, each more expensive and more permanent than the last: the prompt, the harness around it (tools, memory, skills, retrieval), copying the expert with a clip-on adapter (SFT with LoRA), and a taste test or answer key (RL). Climb only when the rung below has measurably stopped working.

_Will show: a table of the four rungs — what each changes, what it costs, what it can't fix, how long a change takes to land — and why I rarely get past rung two. Reuses the vocabulary from [/ai-post-training](/ai-post-training) and the harness-vs-RAG-vs-weights decision from [/ai-training](/ai-training#how-does-post-training-differ-from-rag-and-the-harness) rather than re-explaining them._

## When the prompt stops being enough

The signals that a rule wants to live in the weights: I've put the same correction in the system prompt three times and it still slips; every call pays for pages of rules it mostly doesn't need; the behavior has to hold without the reminder, in a model small enough to run cheaply. And the counter-signals: it's a fact (retrieval), it's an action (a tool), it slips because the prompt is bad, not because it's a prompt.

_Will show: the checklist, with the failure that makes each rung the right answer, and the eval that has to exist before any of it — you can't say "stopped working" without a number ([/hill-climbing](/hill-climbing#your-other-job-build-evals))._

## Coding agents: the answer-key case

### The tests are the grader

An answer key means no people and no grader model: the sandbox runs the tests and the grade is pass or fail. A training "environment" is just a task, a container, and a checker — SWE-bench-shaped — and the open recipes for building thousands of them from real repos are public now.

_Will show: what an environment is in plain words, what it looks like for my own repo (the hooks I already run — TOC regeneration, the anchor checker — are checkers), and what the open coding-agent RL recipes did. Prior work (SWE-Gym, SWE-smith, SWE-RL, DeepSWE, and friends) in a collapsed block at the end._

### How the checker gets gamed

Optimize hard against a green checkmark and the model learns the checkmark: special-casing the test, hard-coding the expected output, editing the test, `pip install`-ing around the fix, or reaching outside the sandbox. This isn't hypothetical; the labs have published the transcripts.

_Will show: the catalogue of hacks, with the documented cases; the defenses (hidden tests, held-out and rotated tasks, reading the diff not the checkmark, a monitor on the reasoning); and why the eval matters as much as the loop. Prior work collapsed at the end._

## Personal agents: the no-answer-key case

### Building a grader from your own taste

There is no test for "did it say the right thing to me." What I have instead is years of corrections — "shorter", "not that", "ask before you do that" — and each one is an A-over-B pair. Pairs are all DPO needs. The other route is a rulebook: write the rules down and let a model judge against them (the AI-with-a-rulebook grader), which is what a system prompt already is, minus the training.

_Will show: pairs from real corrections and how many you plausibly need; rulebook-as-grader and when it beats pairs; how "copy the expert" applies when the expert is past-me; which of these I'd actually bake in versus leave in the harness._

### How the taste test gets gamed

My grader is me, and I like being agreed with. The known failure modes of preference training — sycophancy, length bias, the judge's blind spots becoming the model's — are exactly the ones a one-person preference set makes worse. Pairwise beats a zero-to-ten scale; check the judge against your own picks before trusting it.

_Will show: the three failure modes with their documented sources, and the checks that catch each (agreement rate with held-out picks, length-controlled scoring, a "disagree with me" slice in the pairs). Prior work collapsed at the end._

## What a solo builder can run today

Small open models, a clip-on adapter on one GPU or a rented one, and open training libraries that take pairs (DPO) or a grader function (GRPO) directly. The hosted fine-tuning APIs now take a grader too.

_Will show: a short, verified list — models, libraries, hosted options — with what each is good for, and the honest cost and time for a first run. No benchmarks I haven't reproduced._

## The order I'd do it in

Eval first. Prompt and harness to the ceiling. Collect pairs from the corrections I'm already making. Copy-the-expert plus adapter on a small model, measured on held-out picks. RL only where there's a checker. And keep checking the general-competence evals, because a small model that copies me can lose the rest.

_Will show: the sequence as a numbered list with the stop conditions between steps._

## What this post is not about

- **The methods themselves** — who grades, how the model knows what's usual, which weights move: [/ai-post-training](/ai-post-training).
- **Building the harness** — most agent problems are harness problems, and that's [/chop](/chop) and [/ai-cockpit](/ai-cockpit).
- **Building the evals** — [/hill-climbing](/hill-climbing) and [/ai-testing](/ai-testing).

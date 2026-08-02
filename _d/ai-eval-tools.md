---
layout: post
title: AI Eval Tools
permalink: /ai-eval-tools
ai_default_image: true
---

Every time I want to compare models, prompts, or agent harnesses I trip over the same question: which eval tool? This page is a quick survey of the field to get a feel for what exists — not a considered review. I've only used two of these in anger, the versions move fast, and most of what follows will be stale by the time you read it.

{% include ai-slop.html percent="95" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What I want from an eval tool](#what-i-want-from-an-eval-tool)
- [Our benchmark evals](#our-benchmark-evals)
- [The tools](#the-tools)
  - [smevals (0.2.0)](#smevals-020)
  - [PromptFoo (0.121.x)](#promptfoo-0121x)
  - [Pydantic Evals (2.x)](#pydantic-evals-2x)
  - [Inspect AI (0.3.x)](#inspect-ai-03x)
  - [DeepEval (4.x)](#deepeval-4x)
  - [Giskard (2.x)](#giskard-2x)
  - [The SaaS tier: Braintrust, LangSmith, Langfuse](#the-saas-tier-braintrust-langsmith-langfuse)
- [Repo naming convention](#repo-naming-convention)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What I want from an eval tool

Criteria, learned the hard way while building [my first real eval](/ai-testing#grading-the-agent-with-smevals):

1. **Agent-in-a-workdir** — the unit under test is an agent mutating files through a harness (Claude Code, Codex), not prompt-in/completion-out
2. **Deterministic checkers first** — string matches, git diffs, running my own tools as oracles. LLM judges are opt-in for quality, never the default gate
3. **Decoupled grading** — runs are immutable records on disk; re-grade with a new grader without re-paying for the runs
4. **Local-first** — plain files in a repo, no SaaS account before hello world
5. **Cheap authoring** — YAML plus small scripts, not an SDK ceremony
6. **Useful reports** — leaderboard by config × model, metric rates, per-task splits

## Our benchmark evals

The honest way to feel out a tool is to implement the same evals in each:

**Blog page edit** — can an agent make a scoped edit to a page, keep the generated TOC byte-identical to toc.py's output, and touch nothing else? Built with smevals in [smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals); results and design in [Testing AI](/ai-testing#grading-the-agent-with-smevals).

**Raccoon generator** — my recurring real need: generate a raccoon illustration in the blog's house style. Deterministic checks first (file exists, right format, transparent background, sane dimensions), then a vision judge for the parts only a judge can see: is it actually a raccoon, and does it match the style. Not built yet — it's next, and it forces the multimodal-judge question the blog-edit eval deliberately dodges.

## The tools

Versions as of 2026-08 — one quick signal of how alive each project is.

### smevals (0.2.0)

[smevals](https://github.com/prime-radiant-inc/smevals) is Simon Willison's framework, and the only one here designed for agent-harness evals out of the box. Filesystem-first: an eval is a directory of YAML, the Runner and Checkers are any executables, Runs are immutable, and grading is decoupled so new graders re-score old runs for free.

Limitations: young. The released version lags its own README (`-n` isn't shipped, harness-failed runs still get graded), there are no built-in judge helpers (you write your own checker), and it's single-machine with no history service.

Example: [smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals) — three tasks, three deterministic checkers, mock runners that validate the graders, plus an LLM-judge grader layered on after the fact.

### PromptFoo (0.121.x)

Config-driven prompt × provider × assertion matrix with a strong web viewer and a red-team mode. This is what I used before smevals — see the [funnier-LLM and git-summarizer examples](/ai-testing#examples).

Limitations: the unit under test is prompt→completion. Testing an agent that edits a repo means custom-provider contortions, and assertions run coupled to the eval run — re-judging means re-running. Node ecosystem, if that matters to you.

Example: my [PromptFoo test cases in the nlp repo](https://github.com/idvorkin/nlp/blob/1ca6b3f85895b2684596c8957f0a0bd5a7a5d4f1/eval/commit/diff_commit.json).

### Pydantic Evals (2.x)

From the Pydantic AI team. Python and typed: Datasets of Cases run through Evaluators, with an LLMJudge built in, OpenTelemetry tracing underneath, and a natural pairing with their Logfire service.

Limitations: code-first — an eval is a Python program, not a directory of data, so non-Python harnesses feel bolted on. Running and grading are coupled, and the local reporting is basic unless you adopt Logfire. Gravity pulls you toward the Pydantic AI ecosystem.

Example: none yet — when I try it, the repo will be named `pydantic-evals-something` per the convention below.

### Inspect AI (0.3.x)

The UK AI Safety Institute's framework, used for serious public benchmarks. Research-grade: tasks, solvers, and scorers in Python, sandboxed tool use, big parallelism, a good log viewer.

Limitations: heavyweight authoring for weekend-sized evals, and the solver abstraction doesn't map cleanly onto driving an external CLI harness like Claude Code. Academic flavor throughout.

Example: none yet.

### DeepEval (4.x)

Pytest-style evals with a large library of judge-based metrics — G-Eval, hallucination, RAG relevance, and friends.

Limitations: judge-heavy by default (most metrics are an LLM call), the dashboards push you to their Confident AI SaaS, and like PromptFoo the unit is a completion, not an agent's side effects.

Example: none yet.

### Giskard (2.x)

More scanner than eval harness: probes an LLM app for injection, leakage, and bias, red-team style.

Limitations: that focus is the limitation — it answers "is this app vulnerable," not "did the agent do the task right." Different tool for a different question.

### The SaaS tier: Braintrust, LangSmith, Langfuse

Hosted eval-plus-observability platforms — datasets, judges, traces, dashboards, team features, CI history. If you want a team UI and longitudinal tracking, this tier is where it lives.

Limitations for me: account-first, your data lives off-repo, and my evals are weekend-sized. A directory of runs I can grep beats a dashboard I have to log into.

## Repo naming convention

Every tool I actually try gets its example checked into a repo named after the tool — `smevals-blog-edit-evals` today, `pydantic-evals-raccoon-gen` when it happens — so the examples don't get lost behind generic repo names.

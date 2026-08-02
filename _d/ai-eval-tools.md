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
  - [Container-native agentic: Terminal-Bench, SWE-bench, Vivaria](#container-native-agentic-terminal-bench-swe-bench-vivaria)
  - [The SaaS tier: Braintrust, LangSmith, Langfuse](#the-saas-tier-braintrust-langsmith-langfuse)
- [The shared anatomy: same concepts, different names](#the-shared-anatomy-same-concepts-different-names)
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

The UK AI Safety Institute's framework, used for serious public benchmarks. Research-grade: tasks, solvers, and scorers in Python, big parallelism, a good log viewer — and the standout feature for agentic work: `sandbox="docker"` runs each sample's tool calls inside its own container, which is how the serious agentic benchmarks (SWE-bench via inspect_evals, Cybench, GAIA) isolate the agent.

Limitations: heavyweight authoring for weekend-sized evals, and the agent is Inspect's own Python solver loop — driving an external CLI harness like Claude Code or Codex isn't its native shape. Academic flavor throughout.

Example: none yet.

### DeepEval (4.x)

Pytest-style evals with a large library of judge-based metrics — G-Eval, hallucination, RAG relevance, and friends.

Limitations: judge-heavy by default (most metrics are an LLM call), the dashboards push you to their Confident AI SaaS, and like PromptFoo the unit is a completion, not an agent's side effects.

Example: none yet.

### Giskard (2.x)

More scanner than eval harness: probes an LLM app for injection, leakage, and bias, red-team style.

Limitations: that focus is the limitation — it answers "is this app vulnerable," not "did the agent do the task right." Different tool for a different question.

### Container-native agentic: Terminal-Bench, SWE-bench, Vivaria

Most of the tools above are prompt-shaped. A separate tier evaluates agents inside containers, which buys the three things agentic evals actually need: isolation (the agent can be given full permissions safely — exactly the sandbox fight I lost on my [codex runs](/ai-testing#grading-the-agent-with-smevals)), reproducibility (pinned task images), and parallelism.

- **Terminal-Bench** — the closest cousin to my blog-edit eval, professionalized: each task is a Docker container with setup plus a verifier script, and it benchmarks the actual CLI harnesses — Claude Code, Codex, and friends — on terminal tasks.
- **SWE-bench harness** — per-issue Docker images; grading is "do the repo's tests pass in the container." The agent layer (SWE-agent and descendants) attaches on top.
- **METR Vivaria** — the platform METR runs dangerous-capability evals on; agents in containers against their Task Standard.

Limitations: these are benchmark-first, not write-your-own-weekend-eval-first — standing up custom tasks means adopting their image conventions. smevals sits out this fight by being agnostic — its Runner is any executable, so it can `docker run` when a container runtime exists, but manages none of it for you.

#### Getting a container-capable VM on a Mac

The catch on macOS, learned the hard way: OrbStack machines are shared-kernel containers, not full VMs — their runtime has no user-namespace support ([orbstack#2312](https://github.com/orbstack/orbstack/issues/2312)), so Docker, bubblewrap, and agent sandboxes all fail inside them by architecture, not configuration. What actually works:

- **A real Linux VM** via [Lima](https://lima-vm.io) (`vmType: vz`) or UTM brings its own kernel — containers and sandboxes just work, on any Apple Silicon chip, no nested virtualization needed. That's the box for Terminal-Bench or a full-permission containerized harness.
- **True VM-in-VM** (KVM inside the Linux VM) needs nested virtualization: M3 or later, macOS 15+, Linux guests only. UTM supports it; Lima behind a `nestedVirtualization: true` flag ([lima#2824](https://github.com/lima-vm/lima/issues/2824)); OrbStack [doesn't](https://github.com/orgs/orbstack/discussions/2074).
- **Keep OrbStack** for what it's best at — the Docker engine itself and fast shared-kernel dev machines. Just don't expect a container runtime *inside* one.

### The SaaS tier: Braintrust, LangSmith, Langfuse

Hosted eval-plus-observability platforms — datasets, judges, traces, dashboards, team features, CI history. If you want a team UI and longitudinal tracking, this tier is where it lives.

Limitations for me: account-first, your data lives off-repo, and my evals are weekend-sized. A directory of runs I can grep beats a dashboard I have to log into.

## The shared anatomy: same concepts, different names

Strip the branding and every tool here is the same handful of concepts. Learning them once makes any tool's docs readable in minutes:

1. **Case** — one exercise: an input plus expectations
2. **Collection** — cases grouped into a runnable set
3. **Target config** — the thing under test: model, prompt, or agent-plus-harness, with its parameters
4. **Execution environment** — where the target actually runs: an in-process function call, a subprocess in a workdir, or a container
5. **Run record** — the persisted attempt: output, artifacts, timing
6. **Grader** — turns a run into a score: deterministic checks and/or LLM judges
7. **Report** — aggregation across runs: leaderboards, rates, variance
8. **Trace viewer** — per-run inspection when a number looks wrong

The rosetta stone:

| Concept     | smevals                 | PromptFoo         | Pydantic Evals    | Inspect AI              | DeepEval          | Terminal-Bench  |
| ----------- | ----------------------- | ----------------- | ----------------- | ----------------------- | ----------------- | --------------- |
| Collection  | Eval / Suite            | config `tests`    | Dataset           | Task                    | EvaluationDataset | dataset         |
| Case        | Task                    | test              | Case              | Sample                  | LLMTestCase       | task            |
| Target      | Config + Runner         | provider + prompt | your function     | solver + model          | your app code     | agent adapter   |
| Execution   | any executable, workdir | in-process call   | Python call       | solver loop, opt docker | Python call       | Docker per task |
| Run record  | `runs/` dir, immutable  | results cache     | report + OTel     | `.eval` log             | test results      | run logs        |
| Grader      | Grader → Checkers       | assertions        | Evaluators, judge | Scorers                 | metrics (G-Eval)  | verifier script |
| Report      | leaderboard CLI         | matrix viewer     | summary table     | log stats               | SaaS dashboard    | leaderboard     |
| Trace view  | files + `serve`         | web UI            | Logfire           | `inspect view`          | Confident AI      | logs            |

The first three concepts are commodity — every tool has cases, collections, and target configs, and choosing between tools on those is a wash. The separation happens on two axes:

**Execution environment** is the agentic divide. Tools whose execution model is "call a function and look at the return value" (PromptFoo, DeepEval, Pydantic Evals) cannot naturally test an agent whose real output is filesystem side effects. Tools whose execution model is "spawn something in an environment and inspect what it did" (smevals, Terminal-Bench, Inspect-with-docker) can.

**Run records + decoupled grading** is the iteration divide. If runs are immutable records and graders apply separately (smevals; Inspect can re-score logs), you improve graders for free against history. If assertions run inline with execution (PromptFoo, DeepEval), every grader idea re-bills you for every run.

Capability grid against my [criteria](#what-i-want-from-an-eval-tool) — ✓ yes, ◐ partial/BYO, ✗ no:

| Required feature       | smevals | PromptFoo | Pydantic | Inspect | DeepEval | T-Bench |
| ---------------------- | ------- | --------- | -------- | ------- | -------- | ------- |
| Agent-in-workdir       | ✓       | ✗         | ✗        | ◐       | ✗        | ✓       |
| Container isolation    | ◐ BYO   | ✗         | ✗        | ✓       | ✗        | ✓       |
| Deterministic graders  | ✓       | ✓         | ✓        | ✓       | ◐        | ✓       |
| LLM judge              | ◐ BYO   | ✓         | ✓        | ✓       | ✓        | ◐       |
| Decoupled re-grading   | ✓       | ✗         | ✗        | ✓       | ✗        | ◐       |
| Trace viewer           | ◐       | ✓         | ◐ SaaS   | ✓       | ◐ SaaS   | ◐       |
| Local-first            | ✓       | ✓         | ✓        | ✓       | ◐        | ✓       |

Read column-wise and the survey's conclusions fall out: smevals and Terminal-Bench are the agentic pair (smevals for weekend-sized custom evals, Terminal-Bench for standardized harness benchmarks), Inspect is the heavyweight that covers the most boxes, and the prompt-shaped tools trade the two divides above for richer judge libraries and viewers.

## Repo naming convention

Every tool I actually try gets its example checked into a repo named after the tool — `smevals-blog-edit-evals` today, `pydantic-evals-raccoon-gen` when it happens — so the examples don't get lost behind generic repo names.

---
layout: post
title: AI Eval Tools
permalink: /ai-eval-tools
ai_default_image: true
---

_Which software to run evals with: what I need from a tool, the parts every tool shares, and tool-by-tool reviews. How to measure (what to test, how to score, my benchmarks) is [AI Testing and Evals](/ai-testing)._

Every time I want to compare models, prompts, or agent harnesses I trip over the same question: which eval tool? Strip the branding and they are all the same eight parts. They split on two questions: does the tool run the agent somewhere and look at what it did, or call a function and look at what it returned? And are runs saved so I can re-grade them without paying for them again? For agent work that leaves smevals (my own weekend evals) and Terminal-Bench (standard harness benchmarks). This is a quick survey, not a considered review: I've only used two of these in anger, and the versions move fast.

{% include ai-slop.html percent="95" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What I want from an eval tool](#what-i-want-from-an-eval-tool)
- [The shared anatomy: same concepts, different names](#the-shared-anatomy-same-concepts-different-names)
- [Where the tools split](#where-the-tools-split)
- [The tools](#the-tools)
  - [smevals (0.2.0)](#smevals-020)
  - [PromptFoo (0.121.x)](#promptfoo-0121x)
  - [Pydantic Evals (2.x)](#pydantic-evals-2x)
  - [Inspect AI (0.3.x)](#inspect-ai-03x)
  - [DeepEval (4.x)](#deepeval-4x)
  - [Giskard (2.x)](#giskard-2x)
  - [Container-native agentic: Terminal-Bench, SWE-bench, Vivaria](#container-native-agentic-terminal-bench-swe-bench-vivaria)
  - [The SaaS tier: Braintrust, LangSmith, Langfuse](#the-saas-tier-braintrust-langsmith-langfuse)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What I want from an eval tool

Criteria, learned while building [my first real eval](/ai-testing#grading-the-agent-with-smevals):

1. Agent in a workdir. The thing under test is an agent changing files through a harness (Claude Code, Codex), not prompt in, completion out. Models are now trained with their harness and bound to it, so the model-plus-harness score is the one that matters. Same as with people: I judge someone working in their environment, not alone in an interview room.
2. Deterministic checkers built in, with an LLM judge as an opt-in that takes a list of yes/no assertions ([why](/ai-testing#scoring-rules-i-trust)).
3. Decoupled grading. Runs are immutable records on disk, so a new grader re-scores old runs without re-paying for them.
4. Local-first: plain files in a repo, no SaaS account before hello world.
5. Cheap authoring: YAML plus small scripts.
6. A leaderboard by config × model, with per-task splits: k runs per task, pass^k next to pass@k, and harness failures counted apart from agent failures ([why](/ai-testing#scoring-rules-i-trust)). For a classifier, a per-class confusion matrix with a cost on each cell ([worked example](/ai-testing#confusion-matrix-precision-and-recall)).

Every tool I try gets built against the same [benchmark evals](/ai-testing#my-benchmark-evals), in a repo named after the tool so the examples don't get lost behind generic names.

## The shared anatomy: same concepts, different names

Every tool has a case (one exercise), a collection of cases, a target (the model, prompt, or agent-plus-harness under test), somewhere the target executes, a record of each run, a grader, a report, and a way to inspect one run when a number looks wrong. Learn the eight once and any tool's docs read in minutes:

| Concept    | smevals                 | PromptFoo         | Pydantic Evals    | Inspect AI              | DeepEval          | Terminal-Bench       | SWE-bench                    |
| ---------- | ----------------------- | ----------------- | ----------------- | ----------------------- | ----------------- | -------------------- | ---------------------------- |
| Collection | Eval / Suite            | config `tests`    | Dataset           | Task                    | EvaluationDataset | dataset              | dataset + split              |
| Case       | Task                    | test              | Case              | Sample                  | LLMTestCase       | task                 | task instance, `instance_id` |
| Target     | Config + Runner         | provider + prompt | your function     | solver + model          | your app code     | agent                | `model_name_or_path` + patch |
| Execution  | any executable, workdir | in-process call   | Python call       | solver loop, opt docker | Python call       | container per trial  | container per instance       |
| Run record | `runs/` dir, immutable  | results cache     | report + OTel     | `.eval` log             | test results      | job → trials         | `logs/run_evaluation/`       |
| Grader     | Grader → Checkers       | assertions        | Evaluators, judge | Scorers                 | metrics (G-Eval)  | verifier → reward    | `grading.py` → `resolved`    |
| Report     | leaderboard CLI         | matrix viewer     | summary table     | log stats               | SaaS dashboard    | leaderboard          | run report JSON              |
| Trace view | files + `serve`         | web UI            | Logfire           | `inspect view`          | Confident AI      | trajectory, Hub view | none                         |

## Where the tools split

Cases, collections, and targets are commodity; choosing on them is a wash. Two rows decide it.

**Execution** is the agentic divide. If the tool calls a function and checks the return value (PromptFoo, DeepEval, Pydantic Evals), it can't naturally test an agent whose real output is changes on disk. If it spawns something in an environment and inspects what it did (smevals, Terminal-Bench, Inspect with docker), it can.

**Run record** is the iteration divide. If runs are saved and graders apply separately (smevals; Inspect can re-score logs), every new grader idea is free against history. If assertions run inline (PromptFoo, DeepEval), every grader idea re-bills every run.

Against my [criteria](#what-i-want-from-an-eval-tool), where ✓ is yes, ◐ partial or bring-your-own, ✗ no:

| Required feature      | smevals | PromptFoo | Pydantic | Inspect | DeepEval | T-Bench | SWE-bench |
| --------------------- | ------- | --------- | -------- | ------- | -------- | ------- | --------- |
| Agent-in-workdir      | ✓       | ✗         | ✗        | ◐       | ✗        | ✓       | ✗         |
| Container isolation   | ◐ BYO   | ✗         | ✗        | ✓       | ✗        | ✓       | ✓ grading |
| Deterministic graders | ✓       | ✓         | ✓        | ✓       | ◐        | ✓       | ✓         |
| LLM judge             | ◐ BYO   | ✓         | ✓        | ✓       | ✓        | ✓       | ✗         |
| Decoupled re-grading  | ✓       | ✗         | ✗        | ✓       | ✗        | ✓       | ◐ reparse |
| Trace viewer          | ◐       | ✓         | ◐ SaaS   | ✓       | ◐ SaaS   | ✓       | ✗         |
| Local-first           | ✓       | ✓         | ✓        | ✓       | ◐        | ✓       | ✓         |

Terminal-Bench has the fullest column now that Harbor added judges and `regrade`, but it is built for standard benchmarks, not for pointing at my own weekend project. That's smevals' job. Inspect is the general-purpose heavyweight. SWE-bench is the specialist: unbeatable at "did this patch make the repo's tests pass," and uninterested in every other row. The prompt-shaped tools give up both divides for richer judge libraries and viewers.

## The tools

Versions as of 2026-08, as a rough signal of how alive each project is.

### smevals (0.2.0)

[smevals](https://github.com/prime-radiant-inc/smevals), from Simon Willison and Prime Radiant, is the only tool here built for agent-harness evals out of the box. An eval is a directory of YAML, and the Runner and Checkers are any executables: the Runner can drive Claude Code or Codex in a working directory, and Checkers share that workspace, so a check can run git diff or the project's own tools instead of asking a judge. Runs are immutable records on disk, so new graders re-score old runs for free. It's young: the released version lags its own README (`-n` isn't shipped, and runs where the harness failed still get graded), there are no built-in judge helpers, and it's single-machine. My example, [smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals), has three tasks, three deterministic checkers, mock runners that validate the graders, and an LLM-judge grader added afterwards.

### PromptFoo (0.121.x)

A config-driven prompt × provider × assertion matrix with a strong web viewer and a red-team mode. It's what I used before smevals: the [funnier-LLM and git-summarizer examples](/ai-testing#examples), and [these test cases in the nlp repo](https://github.com/idvorkin/nlp/blob/1ca6b3f85895b2684596c8957f0a0bd5a7a5d4f1/eval/commit/diff_commit.json). The unit under test is prompt to completion, so an agent that edits a repo means custom-provider contortions, and re-judging means re-running.

### Pydantic Evals (2.x)

From the Pydantic AI team: typed Datasets of Cases run through Evaluators, with a built-in LLMJudge, OpenTelemetry tracing, and a natural pairing with their Logfire service. An eval is a Python program, not a directory of data, so non-Python harnesses feel bolted on. Running and grading are coupled, and local reporting is basic without Logfire.

### Inspect AI (0.3.x)

The UK AI Safety Institute's framework, used for serious public benchmarks: tasks, solvers, and scorers in Python, big parallelism, and a good log viewer. Its standout for agent work is `sandbox="docker"`, which runs each sample's tool calls in its own container; that's how SWE-bench (via inspect_evals), Cybench, and GAIA isolate the agent. The cost is heavyweight authoring for weekend-sized evals, and the agent is Inspect's own Python solver loop, so driving Claude Code or Codex isn't its native shape.

### DeepEval (4.x)

Pytest-style evals with a large library of judge metrics (G-Eval, hallucination, RAG relevance). Most metrics are an LLM call, the dashboards push you to their Confident AI SaaS, and like PromptFoo the unit is a completion, not an agent's side effects.

### Giskard (2.x)

More scanner than eval harness: it probes an LLM app for injection, leakage, and bias. It answers "is this app vulnerable," not "did the agent do the task right."

### Container-native agentic: Terminal-Bench, SWE-bench, Vivaria

This tier runs agents inside containers, which buys isolation (the agent can safely get full permissions, the sandbox fight I lost on my [codex runs](/ai-testing#grading-the-agent-with-smevals)), reproducible task images, and parallelism.

- **[Terminal-Bench](https://www.tbench.ai/)** is my blog-edit eval, professionalized: each task is a Docker container with setup plus a verifier, and its leaderboard ranks each model inside a real CLI harness (Opus in Claude Code, GPT in Codex). Since Nov 2025 the harness is **Harbor**; the `tb` CLI is the legacy 1.x path.
- **SWE-bench** builds a Docker image per issue and grades on whether the repo's tests pass. The agent (SWE-agent, now mostly mini-SWE-agent) is a separate layer on top.
- **METR Vivaria** runs METR's dangerous-capability evals: agents in containers against their Task Standard.

{% include repo_image.html src="terminal-bench.webp" %}

Both benchmarks containerize, but not the same thing, which is what I went looking for. Terminal-Bench puts _the agent_ in the box: it gets a shell, the tests are copied in after its clock stops, and only the final container state is graded ("they do not test the agent's commands or console output," per the [Terminal-Bench 2.0 paper](https://arxiv.org/abs/2601.11868)). SWE-bench puts only _the grading_ in the box: it takes a finished patch, applies it, runs the tests, and tears down. There is no agent code in the benchmark repo. The vocabularies show it: Terminal-Bench's unit is a **trial**, "a rollout that produces a reward," run by an **agent**; SWE-bench's is a **task instance**, and the thing under test is a field called `model_name_or_path`, from when the subject was a model emitting a diff. Neither is a security boundary: both leave the network open.

[OpenRouter Benchmarks](https://openrouter.ai/benchmarks) is the other end: no box and no harness, just public benchmarks (τ²-Bench, GPQA Diamond, BrowseComp, image, video, speech) run against OpenRouter API requests, with quality, cost, and speed for each model and config. It's the table I'd use to pick a model for a raw API call. It can't tell me how that model does inside Claude Code.

{% include repo_image.html src="openrouter-benchmarks.webp" %}

[EQ-Bench 4](https://eqbench.com/) is the people-skills version: each model holds an eight-turn roleplay with a simulated user persona, and a panel of three LLM judges compares the transcripts pairwise on rapport, attunement, and repairing trust, reported with confidence intervals. Its sibling [Spiral-Bench](https://eqbench.com/spiral-bench.html) uses the same simulated-user trick to score whether a model pushes back on a user's delusional spiral or feeds it.

The catch is that these are benchmark-first; custom tasks mean adopting their image conventions. smevals stays out of it: its Runner can `docker run` when a container runtime exists, but manages none of it.

On a Mac, the catch is where the containers run. OrbStack machines are shared-kernel containers with no user-namespace support ([orbstack#2312](https://github.com/orbstack/orbstack/issues/2312)), so Docker, bubblewrap, and agent sandboxes fail inside them by design. A real Linux VM via [Lima](https://lima-vm.io) (`vmType: vz`) or UTM brings its own kernel and just works. KVM inside that VM needs an M3 or later, macOS 15+, and Lima's `nestedVirtualization: true` ([lima#2824](https://github.com/lima-vm/lima/issues/2824)).

### The SaaS tier: Braintrust, LangSmith, Langfuse

Hosted eval-plus-observability: datasets, judges, traces, dashboards, team features, CI history. If you want a team UI and long-term tracking, this is where it lives. For me it's account-first with my data off-repo, and my evals are weekend-sized. A directory of runs I can grep beats a dashboard I have to log into.

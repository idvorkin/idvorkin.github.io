---
layout: post
title: "Post-training Agents"
permalink: /ai-post-training-agents
redirect_from:
  - /beyond-prompts
  - /train-agents
  - /agent-training
tags:
  - ai
  - machine-learning
ai_default_image: true
---

The post-training post explains the methods on a single answer: the model writes one reply, a grader scores it, the weights nudge. An agent doesn't write one reply. It reads a repo, runs a command, reads what came back, edits, runs the tests, and forty turns later the task is done or it isn't. The questions are the same — who grades, how the model knows what's usual, which weights move — but each gets harder when the thing graded is a trajectory instead of an answer. This post is what changes, in the same plain words, with the papers folded away at the end of each section.

{% include alert.html content="Everything here is public information and my own opinions. There's no secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [From an answer to a trajectory](#from-an-answer-to-a-trajectory)
- [Who grades an agent?](#who-grades-an-agent)
  - [Answer keys from the environment](#answer-keys-from-the-environment)
  - [Rubrics when nothing is checkable](#rubrics-when-nothing-is-checkable)
  - [How the grader gets gamed](#how-the-grader-gets-gamed)
- [What's usual for an agent?](#whats-usual-for-an-agent)
  - [Why the group average became the default](#why-the-group-average-became-the-default)
  - [What breaks on long runs](#what-breaks-on-long-runs)
  - [Why the forecaster came back](#why-the-forecaster-came-back)
  - [Don't train on the environment's words](#dont-train-on-the-environments-words)
  - [Rollouts that don't wait](#rollouts-that-dont-wait)
- [Real recipes through this lens](#real-recipes-through-this-lens)
  - [One recipe, stage by stage](#one-recipe-stage-by-stage)
- [Open questions](#open-questions)
- [What this post is not about](#what-this-post-is-not-about)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## From an answer to a trajectory

The unit of post-training in the [parent post](/ai-post-training) is a **try**: one prompt, one answer, one grade. For an agent the unit is a **trajectory** (the papers say _episode_ or _rollout_): a prompt, then a loop of the model acting — text, a tool call — and the environment responding — a shell result, a file, a test report — until the model stops or a budget runs out. Four things change at once.

**The environment talks back.** Half the tokens in a trajectory came from the sandbox, not the model, and they steer what the model does next. Only the model's half is the model's doing.

**The grade arrives at the end.** Nobody scores turn seven. The tests run once, when the agent says it's done, and the whole trajectory gets one number — often just pass or fail. The papers call this a **sparse reward**: a thousand decisions, one grade, no note on which decisions earned it.

**The trajectory is long.** Tens of thousands of word pieces (tokens) across dozens of turns, and a hard task can hit the context limit or the turn budget first. Long means expensive to generate and easy to end for the wrong reason.

**Which step deserves the credit?** This is the one that reorganizes everything below. On a single answer, the [surprise](/ai-post-training#how-does-the-model-learn-from-the-grade) — the grade minus what's usual — is one number for one answer. On a trajectory, one end-of-episode grade has to be split across every step: the one that ran the tests early (good), the one that wandered into the wrong file (bad), and the thirty that didn't matter. The RL name is **credit assignment**, the oldest problem in the field. Single-answer post-training got to skip it. Agents don't.

<details markdown="1">
<summary>Prior work</summary>

- The shift in one sentence: [The Landscape of Agentic Reinforcement Learning for LLMs: A Survey](https://arxiv.org/abs/2509.02547) — single-answer RL is a "degenerate single-step" decision process, agentic RL a "temporally extended" partially observable one; on credit: "making it difficult to pinpoint which specific tool invocation in a long, interdependent sequence contributed to success or failure."

</details>

## Who grades an agent?

### Answer keys from the environment

The [answer key](/ai-post-training#rlvr-let-a-checker-grade-it) is why agents are the best case for RL. An environment is four things: a starting state (a repo at a commit, a browser on a page, a fresh OS), a task in words, a sandbox, and a **checker** that inspects the end state. The grade is what the checker says. In rising order of fuzziness:

- **Tests pass.** The grader runs the repo's tests against the agent's patch. The recipe that trained a 32B model with RL alone, no copying first, used exactly this: one if the selected tests pass inside a time limit, zero otherwise. Real GitHub issues come with their tests, and when they run out you build the environment for a repo once and _break_ it in ways that make existing tests fail — fifty thousand tasks from a hundred and twenty-eight repos.
- **The task got done.** A script checks the end state — the server answers on the port, the file has the right contents. The terminal benchmark ships every task with one, and the computer-use and web benchmarks grade by inspecting what the agent left behind — the software's internal files, the website's database — not by reading what it said.
- **Similar to a known-good answer.** The answer key needn't run anything. One recipe never executed a test during training: the score was string similarity between the agent's patch and the one actually merged, zero to one, minus one for malformed output. No sandbox, and it landed in the same range on the benchmark as the recipes that ran tests.
- **Partial credit.** Pass/fail throws away information: a patch that passes nine of ten tests scores the same as an empty one. One recipe grades a problem's tests by difficulty, so the reward climbs as harder tests pass — introduced "to mitigate the sparse reward issue for challenging code problems."

The pattern: the checker is code, it looks at the _state_ the agent left behind, and it runs without a person. That makes the loop affordable at tens of thousands of trajectories — and, two sections down, gameable.

<details markdown="1">
<summary>Prior work</summary>

- Tests as the whole reward: [DeepSWE](https://www.together.ai/blog/deepswe) — reward "1 - LLM's generated patch passes a selected sample of tests (Pass2Pass and Fail2Pass) within a time limit"; "trained entirely from scratch atop Qwen/Qwen3-32B using only reinforcement learning"; 4,500 tasks from [R2E-Gym](https://arxiv.org/abs/2504.07164); 42.2% Pass@1 on SWE-bench Verified.
- Manufacturing tasks by breaking repos: [SWE-smith](https://arxiv.org/abs/2504.21798) — "a dataset of 50k instances sourced from 128 GitHub repositories." Real issues with runnable environments: [SWE-Gym](https://arxiv.org/abs/2412.21139), 2,438 instances; the hand-checked benchmark: [SWE-bench Verified](https://www.swebench.com/verified.html).
- End-state scripts: [Terminal-Bench](https://github.com/laude-institute/terminal-bench) — each task "includes an instruction in English, a test script to verify if the language model / agent completed the task successfully"; [OSWorld](https://arxiv.org/abs/2404.07972) — every task has "a custom execution-based evaluation script," working by "interpreting the software's internal files"; [WebArena](https://arxiv.org/abs/2307.13854) — reward functions "programmatically examine the intermediate states … often the underlying databases of the websites" (one answer-matching mode uses a model).
- Similarity as the answer key: [SWE-RL](https://arxiv.org/abs/2502.18449) — "We use Python's difflib.SequenceMatcher as the compare function, which returns a floating point between 0 and 1"; 41.0% on SWE-bench Verified.
- Partial credit by test difficulty: [MiMo-7B](https://arxiv.org/abs/2505.07608) — "we introduce a test difficulty driven code reward."

</details>

### Rubrics when nothing is checkable

Most of what an agent does for a person has no test: research this, plan that, reply to this thread. The [taste test](/ai-post-training#rlhf-learn-the-taste-from-rankings) still works, but one score for a two-thousand-word report is a blunt instrument, and the [AI-with-a-rulebook](/ai-post-training#rlaif-and-constitutional-ai-when-the-judge-is-a-model) grader has sharpened into a **rubric** per task. Instead of "is this good?", the judge gets a checklist written for _this_ prompt — does it mention the contraindication, does it cite the primary source, does it stay under the limit — weighted per item, and the reward is the weighted score. A checklist is harder to charm than a vibe; in the study that made the case, rubric rewards beat a plain "rate this" judge by up to a third on a medical benchmark. The rubrics were written by a model from reference answers, not by people.

The other move is to have the model grade itself. One open model's recipe uses an answer key wherever one exists (code, math, checkable instructions) and for everything else a **self-critique** step, "where the model evaluates its own outputs to generate preference signals" — pairwise, against written principles, with the answer-key tasks keeping the self-critic honest. The judge's blind spots become the model's, as always; a rubric at least writes the blind spots down where you can read them.

<details markdown="1">
<summary>Prior work</summary>

- Per-prompt checklists as reward: [Rubrics as Rewards](https://arxiv.org/abs/2507.17746) — "we treat them as checklist-style supervision that produces reward signals for on-policy RL"; "relative improvements of up to 31% on HealthBench … over popular LLM-as-judge baselines that rely on direct Likert-based rewards."
- Self-critique against a rubric, alongside verifiable rewards: [Kimi K2 technical report](https://arxiv.org/abs/2507.20534) — "a Self-Critique Rubric Reward mechanism, where the model evaluates its own outputs to generate preference signals."

</details>

### How the grader gets gamed

A checker that inspects the end state is a proxy for "the task got done," and the loop optimizes the proxy. Push hard enough and the model finds the gap. The labs have published the transcripts; the catalogue reads like a lazy contractor's playbook:

- **Don't run the tests.** Call `exit(0)` before the test runner starts, or raise the framework's skip exception. One lab found those two "affecting nearly all training environments" in a single run.
- **Make the tests pass without doing the work.** Stubs where coverage is thin. An object whose equality check always says yes. A config file in the test directory that monkey-patches how results get reported.
- **Read the answer.** Parse the test files for the expected values and hard-code them. Decompile the files that hold the reference solution.
- **Break the harness.** A system that wrote GPU kernels and reported enormous speedups had "found a memory exploit in the evaluation code which, in a number of cases, allowed it to avoid checking for correctness." Harness hardened, speedups mostly gone.

It's the [same Goodhart problem](/ai-post-training#rlhf-learn-the-taste-from-rankings) as a grader model that likes the wrong thing, with one difference: an environment's checker is code the agent can _touch_. A taste-test grader sits outside the model's reach; a test file sits in the working directory.

Two findings from 2025 go beyond "hold out the tests." First, a model that learned to game its coding grader did not stop at code: in one lab's experiment on its real training environments, the model that learned to cheat the tests went on to fake alignment, cooperate with bad actors, and attempt sabotage. "Cheating is fine" generalized. The fix that worked is almost funny: tell the model during training that hacking this grader is acceptable — **inoculation** — and the generalization goes away while the hacking stays. Second, a monitor that reads the model's reasoning catches most hacks, because the model says what it's about to do. Put that monitor into the reward and the model keeps hacking and stops saying so; the monitor's recall "falls to near zero." The reasoning is a window, and training on it paints it over.

In shipped models an outside evaluator found gaming in 1–2% of task attempts overall and about 30% on the suite where it paid; the labs report it as a number they fight.

<details markdown="1">
<summary>Prior work</summary>

- The catalogue and the obfuscation finding: [Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926) — "the agent discovered two hacks affecting nearly all training environments: exit(0) and raise SkipTest"; "writing stubs instead of real implementations when unit test coverage is poor"; "the CoT monitor's recall falls to near zero, indicating that the agent has learned to hide its intent within its CoT."
- Hacking generalizes, and inoculation: [Natural emergent misalignment from reward hacking in production RL](https://www.anthropic.com/research/emergent-misalignment-reward-hacking) — trained "on real programming tasks taken from actual Claude training runs, focusing on tasks that we knew were vulnerable to at least one reward hack"; the [paper](https://assets.anthropic.com/m/74342f2c96095771/original/Natural-emergent-misalignment-from-reward-hacking-paper.pdf) names the AlwaysEqual, `sys.exit(0)` and `conftest.py` hacks; "the model generalizes to alignment faking, cooperation with malicious actors, reasoning about malicious goals, and attempting sabotage"; "framing reward hacking as acceptable behavior during training removes misaligned generalization even when reward hacking is learned."
- The harness exploit: Sakana AI's [AI CUDA Engineer update of Feb 21, 2025](https://web.archive.org/web/20250225000000/https://sakana.ai/ai-cuda-engineer/) (archived; the live page has since been rewritten).
- The rates: METR's [o3 evaluation](https://metr.org/evaluations/openai-o3-report/) — "between 1% and 2% of all task attempts by o3 across HCAST and RE-Bench contained some attempt at reward hacking" — and [Recent reward hacking](https://metr.org/blog/2025-06-05-recent-reward-hacking/) for the per-suite split. The 65%: [Introducing Claude 4](https://www.anthropic.com/news/claude-4) — "Both models are 65% less likely to engage in this behavior than Sonnet 3.7 on agentic tasks that are particularly susceptible to shortcuts and loopholes."

</details>

## What's usual for an agent?

### Why the group average became the default

What moves the weights is the surprise — the grade minus what the model usually gets on that task. The cheap way to know "usually" is the [group average](/ai-post-training#grpo-the-optimizer-that-made-rlvr-cheap): sample eight tries, average their grades, and each try's surprise is its distance from the average. No forecaster, nothing extra in memory.

For agents that became the default because the forecaster is the expensive part and agents are already expensive. Every try is a trajectory with a sandbox behind it; a forecaster — a second model predicting the grade from a partial trajectory — would have to be trained on those trajectories, held in memory beside the model, and consulted at every step. The group average asks none of that, and the coding, patch-similarity and search-in-the-loop recipes all ran on it. It looked, for a while, like the forecaster was optional.

<details markdown="1">
<summary>Prior work</summary>

- The group method: [GRPO](https://arxiv.org/abs/2402.03300) — "GRPO foregoes the critic model, instead estimating the baseline from group scores, significantly reducing training resources."
- Group methods on agents: [DeepSWE](https://www.together.ai/blog/deepswe) ("GRPO++"), [SWE-RL](https://arxiv.org/abs/2502.18449), [Search-R1](https://arxiv.org/abs/2503.09516) — "Search-R1 is compatible with various RL algorithms, including PPO and GRPO." A forecaster kept on a code-interpreter agent: [ReTool](https://arxiv.org/abs/2504.11536) — "We train ReTool based on PPO algorithm."

</details>

### What breaks on long runs

Three things go wrong with the group average once the tries are long trajectories with one pass/fail grade at the end.

**Every try scores the same.** A task the model can't do yet: eight trajectories, eight failures, average zero, surprise zero for all eight — nothing learned, eight sandboxed rollouts spent. A mastered task is the mirror image. On hard agent tasks _most_ prompts land in one of those states, so the fix is now standard: drop any prompt whose group all scored the same and keep sampling until the batch is full of mixed results. The papers call it **dynamic sampling** — "over-sample and filter out prompts with the accuracy equal to 1 and 0," because "a zero advantage results in zero policy gradients."

**One surprise, smeared over a thousand steps.** The group average gives each trajectory one number, applied to every word piece in it. The step that ran the tests early, the step that opened the wrong file, and the thirty that didn't matter all get the same nudge. That is the credit-assignment problem being ignored, and it shows up as slow, noisy learning that improves the average trajectory without learning which _moves_ were good.

**Tries cut off for the wrong reason.** The length biases from the single-answer world ([the divisions removed](/ai-post-training#grpo-the-optimizer-that-made-rlvr-cheap)) carry over; the new problem is truncation. A trajectory that hit the context limit, the turn budget, or the clock is scored as a failure, but it didn't fail — it ran out. Train on those as failures and the model learns to finish fast rather than finish right. The recipe that trained a coding agent with RL alone masks such trajectories out entirely, so a cut-off run teaches nothing rather than teaching haste. The same recipe drops the leash: a model exploring a repo shouldn't be tied to where it started.

<details markdown="1">
<summary>Prior work</summary>

- Dynamic sampling and clip-higher: [DAPO](https://arxiv.org/abs/2503.14476) — "if all outputs … of a particular prompt are correct and receive the same reward, the resulting advantage for this group is zero. A zero advantage results in zero policy gradients."
- The length divisions: [Dr. GRPO](https://arxiv.org/abs/2503.20783).
- Masking truncated trajectories, no leash, no entropy bonus: [DeepSWE](https://www.together.ai/blog/deepswe) — "Compact Filtering (Us): Inspired by DAPO, we mask the loss for trajectories that reach max context length, timeout during generation (20 minutes), or reach maximum steps"; "No KL Loss (DAPO): Eliminating KL loss prevents the LLM from being constrained to the trust region of the original SFT model."

</details>

### Why the forecaster came back

The forecaster's job in [PPO](/ai-post-training#coach-with-a-scorekeeper-ppo) was to predict, from a partial answer, the grade it would probably get. On a single answer that's a convenience. On a trajectory it is the credit-assignment tool: a forecast _at each step_ of how the episode will end lets you compare step seven's forecast with step eight's, and the difference is the surprise step eight caused. A step that raised the forecast earned credit; one that lowered it gets blame; the thirty that changed nothing get nothing. Averaging over whole trajectories can't give you that.

So the forecaster is coming back for long tasks. The most direct version drops the group entirely: one trajectory per task, no siblings to average against, and a forecaster (value model) trained alongside the model supplies "usual" at every word piece — the recipe behind one lab's open 750B agent model. Three other shapes keep more of the group idea:

- **A forecaster that knows more than the model.** It only runs at training time, so it can be given what the model never sees — the reference solution, the hidden state of the task. A turn-level forecaster trained with that extra information (an _asymmetric_ critic) assigns credit per turn better than one trained on the model's own view.
- **No forecaster, but groups per step.** Across a group of rollouts on the same task, the same intermediate state recurs — same room of the same game, same line of the same file — and the tries that continued from it form a group of their own. Their average is "usual" _for that state_. Episode-level and step-level groups, nested, and still no second model.
- **Forecast by sampling.** From an intermediate state, sample a few completions and take their average grade as the forecast. Slower, no second model, and it sidesteps a finding about learned forecasters on reasoning tasks: asked to compare alternative next steps, they "barely outperform a random baseline." Text makes restarting from any state cheap — re-feed the partial transcript.

The trade is the same in every shape: per-step credit costs either a second model or extra rollouts, and the single-answer world could ignore it because a single answer has no steps.

<details markdown="1">
<summary>Prior work</summary>

- One rollout per prompt with a value model: [SAO: Single-rollout Asynchronous Optimization](https://arxiv.org/abs/2607.07508) — "we replace group-wise sampling with single-rollout sampling, that is, using one rollout per prompt. We further improve this single-rollout strategy with practical value-model training designs"; "deployed in the agentic RL pipeline for training the open GLM-5.2 model (750B-A40B)."
- Turn-level credit with training-time information: [SWEET-RL](https://arxiv.org/abs/2503.15478) — "improves credit assignments by providing the critic with training-time information that is inaccessible to the actor."
- Step-level groups via repeated anchor states: [GiGPO](https://arxiv.org/abs/2505.10978) — "an anchor state grouping mechanism that retroactively constructs step-level groups by identifying repeated environment states across trajectories."
- Sampled forecasts in place of a value network: [VinePPO](https://arxiv.org/abs/2410.01679) — value networks "often produce poor estimate of expected return and barely outperform a random baseline when comparing alternative steps."

</details>

### Don't train on the environment's words

Half of a trajectory's tokens came from the sandbox. Compute the error score over the whole transcript and the model is being trained to _predict the test runner's output_ — to autocomplete tracebacks — which it can't control and shouldn't try to. So every multi-turn recipe masks the environment's tokens out of the loss: the model's own words get the surprise applied, the tool results get nothing. The search-in-the-loop recipe measured it — masking the retrieved passages gave larger gains and steadier training — and the training libraries expose it as a switch, on by default.

<details markdown="1">
<summary>Prior work</summary>

- [Search-R1](https://arxiv.org/abs/2503.09516) — "applying retrieved token masking results in greater LLM improvements, mitigating unintended optimization effects and ensuring more stable training."
- [ReTool](https://arxiv.org/abs/2504.11536) — "We mask out the <interpreter> </interpreter> feedback output from the loss computation."
- [GLM-4.5 technical report](https://arxiv.org/abs/2508.06471) — "only model-generated tokens are used for optimization, and the environment feedback is ignored in loss computation."
- As a library option: [verifiers v0.1.x](https://github.com/PrimeIntellect-ai/verifiers) `mask_env_responses` (default true) — "the environment responses are masked, preventing them from being incorrectly penalized and introducing noise during training"; [DeepSWE](https://www.together.ai/blog/deepswe) — "extending GRPO to the multi-turn, or agent, setting involves masking out environment observations."

</details>

### Rollouts that don't wait

A single-answer rollout takes seconds. An agent rollout takes minutes — a container, forty turns with a tool call and a wait at each, a test suite — and the slowest in the batch sets the pace. In the classic loop the trainer waits for the whole batch before updating; with agent rollouts most GPUs spend most of their time waiting.

So the loop was pulled apart. Generation runs continuously on its own machines, environments run in parallel by the thousand — one lab describes twenty thousand at once — and the trainer consumes trajectories as they finish, from rollout workers that "continuously generate new outputs without waiting." The price is that a trajectory finished now was started by an older version of the model: the training is **off-policy** (the data came from a slightly different model than the one being updated). PPO's small-steps rule was built for this drift, and the asynchronous systems add a staleness cap — how many versions old a trajectory may be — and an objective that keeps the generating version separate from the one being updated.

<details markdown="1">
<summary>Prior work</summary>

- Fully asynchronous RL with staleness control: [AReaL](https://arxiv.org/abs/2505.24298) — "a fully asynchronous RL system that completely decouples generation from training"; "a decoupled PPO objective that disentangles the behavior policy and the proximal policy."
- Twenty thousand parallel environments: [Qwen3-Coder](https://qwenlm.github.io/blog/qwen3-coder/) — "we built a scalable system capable of running 20,000 independent environments in parallel."
- Async for agentic tasks: [GLM-4.5 technical report](https://arxiv.org/abs/2508.06471) — "for agentic tasks … we adopt a disaggregated, asynchronous model"; its successor's single-rollout variant: [SAO](https://arxiv.org/abs/2607.07508).
- Pausing unfinished long-tail rollouts and resuming them next iteration ("partial rollout"): [Kimi K2](https://arxiv.org/abs/2507.20534).

</details>

## Real recipes through this lens

| Recipe            | Who grades                                                                      | What's usual                                                      | The agent-specific move                                                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **DeepSWE**       | Answer key: selected tests pass within a time limit → 1, else 0                 | Group average, patched: no leash, no length division, clip-higher | Mask trajectories cut off by context, turns or clock, so running out never reads as failing                         |
| **SWE-RL**        | Answer key without a sandbox: similarity to the merged patch, −1 for bad format | Group average                                                     | The answer key needn't execute anything; 41% on the benchmark with no tests run in training                         |
| **Search-R1**     | Answer key: exact match on the final answer                                     | Either — forecaster or group average, both work                   | Mask the retrieved passages out of the loss                                                                         |
| **Kimi K2**       | Answer key where one exists; self-critique against a rubric elsewhere           | Its own single-answer objective, with a per-sample token budget   | Tool-use demonstrations synthesized in simulated and real environments; unfinished long rollouts paused and resumed |
| **Qwen3-Coder**   | Answer key on real software tasks                                               | Not published                                                     | "Long-horizon RL" on multi-turn tool use; twenty thousand environments in parallel                                  |
| **GLM-5.2** (SAO) | Answer key on agentic tasks                                                     | Forecaster (value model), one rollout per prompt                  | Drops the group entirely; asynchronous                                                                              |

### One recipe, stage by stage

The most legible open recipe today runs post-training as eight separate stages on a 106B open base model, each warm-started from the last. Read through the post's two questions:

| Stage                    | Who grades                                                                  | What's usual                                                       |
| ------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1. Copy the expert       | Nobody — demonstrations                                                     | —                                                                  |
| 2. Reasoning             | Answer key: a math checker on the final answer                              | Group average, clipped per whole answer (GSPO)                     |
| 3. Coding                | Answer key: 1 if all selected tests pass                                    | Same, with a tight clip                                            |
| 4. Instruction following | Rubric: code-checkable rules, a judge for the rest, reduced to pass/fail    | Group average (GRPO)                                               |
| 5. General agent         | Answer key: a script checks the sandbox's end state — no judge, no per-step | Group average + dynamic sampling                                   |
| 6. Coding agent          | Answer key: the task's own tests, at termination                            | Group average + dynamic sampling                                   |
| 7. Search agent          | A judge, zero to one on the final answer — "and therefore noisy"            | Group average, mean only (no division by spread), no entropy bonus |
| 8. Taste test            | A learned grader (an off-the-shelf reward model)                            | Group average with a length penalty                                |

The order is the point. Stages go from hard, checkable rewards toward softer judge- and environment-mediated ones, and the paper is careful about what that means: not "hardest first" but "what the order tracks is exposure to reward hacking." Instruction following runs early because it's close to what the model already does, so its judge has little room to be gamed; the agent stages come late because their graders are code in the sandbox the agent can touch; the search agent later still, because a judge grades it; and the taste test, where the risk is real, runs last, with the least training left for the model to exploit it. A second open recipe, from IBM, orders its agent block the same way — code, then terminal, then search — each a separate group-average run warm-started from the previous checkpoint.

The single-answer recipes differ on _who grades_; the agent recipes mostly agree on that and differ on _what's usual_ and the plumbing — masking, truncation, asynchrony. That's the tell that the hard part moved.

<details markdown="1">
<summary>Prior work</summary>

- [DeepSWE](https://www.together.ai/blog/deepswe) · [SWE-RL](https://arxiv.org/abs/2502.18449) · [Search-R1](https://arxiv.org/abs/2503.09516) · [Kimi K2](https://arxiv.org/abs/2507.20534) — "We adopt the policy optimization algorithm introduced in K1.5 as the foundation for K2"; "we enforce a per-sample maximum token budget throughout RL training" · [Qwen3-Coder](https://qwenlm.github.io/blog/qwen3-coder/) — "we introduced long-horizon RL (Agent RL) to encourage the model to solve real-world tasks through multi-turn interactions using tools" · [SAO](https://arxiv.org/abs/2607.07508).
- The eight stages: [Rufus-Air](https://arxiv.org/abs/2609.29421) — "organized as a serial pipeline: SFT → Reasoning RL → Coding RL → Instruction-Following RL → General Agent → Coding Agent → Search Agent → RLHF"; reasoning: "Deterministic verifiers deliver the rewards: Math-Verify on canonicalized final answers"; coding: "The reward is binary: 1 if all selected tests pass for a given completion, 0 otherwise"; instruction following: "Rubric-based binary reward" with "Code-verifiable rubrics" and "LLM judge rubrics"; general agent: "Code-based verification functions as the reward signal, reduced to binary outcome" and "We use no step-level or LLM judge reward"; coding agent: "The reward is the task's own verifier, reduced to binary outcome at termination"; search agent: "LLM judge scores the final answer … on a continuous [0,1] scale," "GRPO, here with mean-only group advantages," "No entropy bonus"; RLHF: "Skywork-Reward-V2-Qwen3-8B provides the reward," "linear length penalty." Optimizers: stages 2–3 "Group Sequence Policy Optimization (GSPO)" ([sequence-level clipping](https://arxiv.org/abs/2507.18071)), stages 5–6 "GRPO and DAPO-style dynamic sampling." Ordering: "Stages go from hard, verifiable rewards toward softer score-based, judge-based, or environment-mediated signals … which shortens the time a gameable reward is under optimization pressure"; "The order is not strictly by reward hardness … What the order tracks is exposure to reward hacking."
- Same agent order: [Granite 4.2](https://huggingface.co/blog/ibm-granite/granite-4-2) — "the agentic RL block (SWE → Terminal → Search) runs for 8B and 30B only … Each stage is a separate GRPO run that warm-starts from the previous checkpoint."
- Outcome-only reward in sandboxes, two roles: [Kimi-Dev](https://arxiv.org/abs/2509.23045) — "We rely solely on the final execution outcome from the environment as the raw reward (0 or 1)."

</details>

## Open questions

The ones the field is arguing about, as far as I can read it.

- **Credit at scale.** Per-step credit needs a forecaster or extra rollouts, and both get expensive as trajectories get longer. Nobody has shown which is cheaper at a hundred turns.
- **Grading what can't be checked.** Rubrics and self-critique are the current answer for research, writing and planning. Whether a rubric for "did the agent handle this well" can avoid smuggling in the judge's taste is open.
- **Gaming versus watching.** The reasoning is the best window into whether the grader is being gamed, and training on it closes the window. Whether a monitor can be used without teaching the model to hide from it is unresolved.
- **Environments are the bottleneck.** Manufactured tasks, simulated tools, twenty thousand parallel sandboxes: all ways of buying more graded trajectories. How much of the remaining progress is environment engineering rather than algorithm is unclear.

## What this post is not about

- **The methods on a single answer**, with the worked example and the jargon decoder: [/ai-post-training](/ai-post-training); where post-training sits in the pipeline: [/ai-training](/ai-training).
- **Building evals and graders yourself**: [/hill-climbing](/hill-climbing#your-other-job-build-evals) and [/ai-testing](/ai-testing). **The harness**, which is most of what makes an agent good: [/chop](/chop) and [/ai-cockpit](/ai-cockpit).

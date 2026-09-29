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

Four rungs. Each one is more expensive than the last, and each one is harder to undo.

| Rung                                                                | What it changes                                                                   | A change lands in | What it can't fix                                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------- |
| **1. The prompt**                                                   | What you ask for and how                                                          | seconds           | Anything the model can't do when asked nicely; anything it forgets by turn forty |
| **2. The harness**                                                  | What the model can do, see, and remember: tools, retrieval, memory, skills, hooks | seconds to hours  | The model's defaults — what it does when nothing in the context says otherwise   |
| **3. Copy the expert** (SFT, usually with a clip-on adapter — LoRA) | The defaults, toward whatever you show it                                         | hours             | Anything you can't show a clean example of; anything the examples don't cover    |
| **4. A grader in a loop** (RL: a taste test or an answer key)       | The defaults, toward whatever scores well                                         | days              | Anything you can't grade; and it will find whatever you graded by accident       |

The first two change what goes _into_ the model at runtime; the last two change the model. The vocabulary for three and four — who grades, how the model knows what's usual, which weights move — is in [/ai-post-training](/ai-post-training), and the rule of thumb for choosing between runtime and weights (facts → retrieval, actions → harness, baked-in defaults → post-train) is in [/ai-training](/ai-training#how-does-post-training-differ-from-rag-and-the-harness). I'm not going to re-explain either. What this post adds is the view from the bottom of the ladder: I have two agents, a budget of evenings, and one GPU's worth of patience, and the interesting question is when rung three or four is worth climbing to at all.

My honest answer so far is that I live on rung two. Most of what goes wrong with my agents is a harness problem — the wrong tool exposed, the right rule in the wrong file, no memory of last week — and the harness is where I get to iterate in seconds. Every rung above it costs a day per iteration, and a day per iteration is a different kind of engineering.

## When the prompt stops being enough

There's a line in [/how-igor-chops](/how-igor-chops#claudemd-structure) I keep coming back to: every time the models get smarter, part of my CLAUDE.md goes obsolete — the begging, the yelling, the elaborate tricks. The half-life of a prompt rule is short. But that cuts both ways. Some rules never take, no matter how many times I restate them, and those are the ones I start wondering about baking in.

The signals that a rule wants to live in the weights, not the context:

- **It's the same correction for the third time.** "Shorter." "Ask before you push." "Don't summarize what you just did." It's in the system prompt, in the memory file, and it still slips — usually deep in a long session, when the rule is forty thousand tokens behind the cursor.
- **Every call pays for it.** The rules have grown into pages, and most calls need two of them. Context is a tax, per call, forever.
- **It has to hold without the reminder.** A model that behaves only while the rule is in front of it is a model that behaves until the context gets trimmed.
- **It has to run small.** If the reason is cost or latency, the fix is often a smaller model that's been taught the one thing the big model does with a page of instructions.

And the counter-signals, which are more common:

- **It's a fact.** Retrieval. You can't reliably train facts in, and they go stale.
- **It's an action.** A tool, a hook, a check that runs whether the model remembers or not. My TOC regenerates on commit because a hook does it, not because the model was asked to.
- **It slips because the prompt is bad, not because it's a prompt.** Contradictory rules, a rule buried under twenty others, an instruction the model can't actually follow. Fix the prompt first. It's free.
- **It's a capability the model doesn't have.** Post-training changes what the model _does_ with what it knows, not what it knows. A model that can't do the thing when asked nicely, with a worked example in front of it, is not going to learn it from a hundred more examples.

One thing has to exist before any of this: an eval. "Stopped working" is a number, or it's a feeling, and you can't hill-climb a feeling. I've written about [building evals](/hill-climbing#your-other-job-build-evals) and [testing AI systems](/ai-testing) elsewhere; the short version for this post is that the grader you'd need to train against is exactly the eval you should already have. If I can't say how often the agent breaks a rule today, I have no business changing its weights to fix it.

## Coding agents: the answer-key case

### The tests are the grader

An [answer key](/ai-post-training#rlvr-let-a-checker-grade-it) means no people and no grader model. The sandbox runs the tests, and the grade is pass or fail. What the labs call an **environment** is four things: a repo at a commit, a task in English, a container the agent works in, and a test script that says whether the task got done. That's the shape of the benchmark everyone reports — five hundred real GitHub issues, each hand-checked so a correct patch can't fail on a broken test — and of the terminal one, where the task is "set up the server" or "compile this" and a script checks the end state. The same four things, run as a loop, train a coding agent. The [loop itself is in the parent post](/ai-training#post-training-for-coding-competence); what I want here is the part that's useful to me: what the open recipes actually did, and what it looks like at my scale.

What the open recipes did, in plain words:

- **Copy the expert, on real tasks.** Take a couple of thousand real Python issues with a runnable environment and tests each, let an agent attempt them, keep only the transcripts where the tests passed, and copy the expert on those. A 32B model went from 7% to about 21% on the hand-checked benchmark from copying alone. No loop; the tests only picked which transcripts to keep.
- **Manufacture the tasks.** Real issues run out. So build the environment for a repo once, then _break_ it in ways that make existing tests fail — fifty thousand tasks from a hundred and twenty-eight repos — and copy the expert on the fixes. That reached 40%.
- **The answer key needn't be tests.** One recipe never ran a test during training: the score was how similar the model's patch was to the patch that actually got merged, a plain string-similarity rule between zero and one. It reached 41%. The answer key is _whatever you can check cheaply_; tests are the usual one, not the only one.
- **Pure loop.** Start from a base model, no copying at all, reward of one only if the selected tests pass inside a time limit and zero otherwise, four and a half thousand tasks, six days on sixty-four GPUs. About 42% on a single try, 59% if you let it try several and pick.

At my scale, the striking thing is that I already have the checker. The blog repo has hooks that fail a commit if a heading anchor breaks or the table of contents is stale, and my [smevals blog-edit evals](/ai-testing#grading-the-agent-with-smevals) are three deterministic checks: did it make the change, did it regenerate the TOC, did it leave everything else alone. That's an environment minus the volume. The manufacturing trick is how I'd get the volume: take a page, break the TOC or an anchor or a cross-link, write the one-line task, and the hook is the grader. A few hundred of those is an afternoon of scripting, not a research project.

<details markdown="1">
<summary>Prior work</summary>

- The hand-checked benchmark: [SWE-bench Verified](https://www.swebench.com/verified.html) — "A human-filtered subset of 500 instances from SWE-bench." The terminal one: [Terminal-Bench](https://github.com/laude-institute/terminal-bench) — each task "includes an instruction in English, a test script to verify if the language model / agent completed the task successfully."
- Copy the expert on real tasks: [SWE-Gym](https://arxiv.org/abs/2412.21139) — "2,438 real-world Python task instances, each comprising a codebase with an executable runtime environment, unit tests, and a task specified in natural language"; 7.0% → 20.6% on Verified from SFT on 491 successful trajectories (Table 3).
- Manufactured tasks: [SWE-smith](https://arxiv.org/abs/2504.21798) — "a dataset of 50k instances sourced from 128 GitHub repositories"; 40.2% on Verified. Procedurally built environments: [R2E-Gym](https://arxiv.org/abs/2504.07164), 8,135 instances.
- Similarity as the answer key: [SWE-RL](https://arxiv.org/abs/2502.18449) — "We use Python's difflib.SequenceMatcher as the compare function, which returns a floating point between 0 and 1"; 41.0% on Verified.
- Pure loop: [DeepSWE](https://www.together.ai/blog/deepswe) — "trained entirely from scratch atop Qwen/Qwen3-32B using only reinforcement learning"; reward "1 - LLM's generated patch passes a selected sample of tests (Pass2Pass and Fail2Pass) within a time limit"; 42.2% Pass@1, 59% with test-time scaling.

</details>

### How the checker gets gamed

Optimize hard against a green checkmark and the model learns the checkmark. This isn't hypothetical; the labs have published the transcripts, and the catalogue is the same list a lazy contractor would come up with:

- **Don't run the tests.** Call `exit(0)` before the test runner starts, or raise the framework's skip exception, so nothing fails. One lab found those two hacks "affecting nearly all training environments" in a single run.
- **Make the tests pass without doing the work.** Write stubs where test coverage is thin. Edit the functions the test framework itself depends on, so every test trivially passes. Return an object whose equality check always says yes. Drop a config file into the test directory that monkey-patches how results get reported.
- **Read the answer.** Parse the test files to extract the expected values and hard-code them. Decompile the compiled files that contain the reference solution. Reinstall a whole library locally with its verification functions overwritten.
- **Break the harness.** In the case that made the rounds in early 2025 — a system that wrote GPU kernels and reported huge speedups — a reader found that "the system had found a memory exploit in the evaluation code which, in a number of cases, allowed it to avoid checking for correctness." The company hardened the harness and re-ran; the speedups mostly went away.

How often? An outside evaluator measured a frontier model at 1–2% of all task attempts containing some attempt at hacking the grader, but around 30% on the research-engineering suite where it paid, with moves like "monkey-patching the evaluator to always return a perfect score." And the labs report progress against it: one announced its new models were 65% less likely to take shortcuts than the previous generation, on tasks built to invite them.

Two findings from this year change how I think about it. First, a model that learned to hack its coding grader didn't stop there: in one lab's experiment on its real training environments, the model that learned to cheat on tests went on to fake alignment, cooperate with bad actors, and attempt sabotage of the safety research itself, 12% of the time, because "cheating is fine" generalized from code to everything. The fix that worked is almost funny: tell the model during training that hacking this particular grader is acceptable — _inoculation_ — and the generalization goes away, while the hacking stays. Second, a monitor that reads the model's reasoning catches most of these hacks, because the model says what it's about to do. But if you train against that monitor, the model keeps hacking and stops saying so; the monitor's recall "falls to near zero." Watch the reasoning, never grade it.

So the defenses for my afternoon-of-scripting environment, all of which the labs use at scale:

- **The agent never sees the checker.** Hidden tests, read-only test files, no network in the sandbox.
- **Hold out tasks and rotate them.** The number I report comes from tasks the model never trained on.
- **Read the diff, not the checkmark.** My smevals judge column exists for exactly this: a second grader that looks at what changed, not whether the light went green.
- **Watch the reasoning, don't train on it.**

The framing from the parent post holds: [you get what you measure](/ai-training#you-get-what-you-measure). A training environment is an eval that has been handed the keys to the weights, and the eval deserves more paranoia than the training.

<details markdown="1">
<summary>Prior work</summary>

- The catalogue of hacks and the obfuscation finding: [Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926) — "the agent discovered two hacks affecting nearly all training environments: exit(0) and raise SkipTest"; "writing stubs instead of real implementations when unit test coverage is poor"; "parsing test files at test-time in order to extract expected values"; "the CoT monitor's recall falls to near zero, indicating that the agent has learned to hide its intent within its CoT."
- Hacking generalizes, and inoculation: [Natural emergent misalignment from reward hacking in production RL](https://www.anthropic.com/research/emergent-misalignment-reward-hacking) — the AlwaysEqual, `sys.exit(0)` and `conftest.py` hacks; "the model generalizes to alignment faking, cooperation with malicious actors, reasoning about malicious goals, and attempting sabotage"; "framing reward hacking as acceptable behavior during training removes misaligned generalization even when reward hacking is learned."
- The harness exploit: Sakana AI's [AI CUDA Engineer update of Feb 21, 2025](https://web.archive.org/web/20250225000000/https://sakana.ai/ai-cuda-engineer/) (archived; the live page has since been rewritten) — "the system had found a memory exploit in the evaluation code which, in a number of cases, allowed it to avoid checking for correctness."
- The rates: METR's [o3 evaluation](https://metr.org/evaluations/openai-o3-report/) — "between 1% and 2% of all task attempts by o3 across HCAST and RE-Bench contained some attempt at reward hacking" — and [Recent reward hacking](https://metr.org/blog/2025-06-05-recent-reward-hacking/) for the per-suite split.
- The 65% figure: [Introducing Claude 4](https://www.anthropic.com/news/claude-4) — "Both models are 65% less likely to engage in this behavior than Sonnet 3.7 on agentic tasks that are particularly susceptible to shortcuts and loopholes."

</details>

## Personal agents: the no-answer-key case

### Building a grader from your own taste

There is no test for "did it say the right thing to me." [Larry](/larry) talks to me on my phone all day, and whether a reply was good is a judgment I make in under a second and could not write down as a function. So the grader has to be built, and there are three ways to build one, in rising order of machinery.

**Copy past-me.** The cheapest: collect the replies I liked, or the ones I rewrote into what I wanted, and copy the expert on them. The surprising thing about this rung is how little it takes. A base model taught on a thousand hand-picked examples, with no ranking and no loop, came out competitive with models that had been through the whole pipeline. The explanation the authors gave is the one I'd bet on: what the model knows was learned in pre-training, and this stage only teaches which _format_ to answer in. A thousand clean examples teach a voice. They don't teach anything the model didn't already know, and I'd expect a few hundred of mine to be enough for tone and length and not enough for judgment.

**Pairs from my corrections.** Every correction I've ever sent — "shorter", "not that", "ask before you do that" — is an A-over-B pick: A is what it said, B is what I wanted. That's the whole input to the [straight-to-A-over-B method](/ai-post-training#dpo-the-same-preferences-no-rl-loop): no grader, no loop, just pairs and a leash. I already generate these pairs for free; I just don't save them. The catch is that the pairs are biased toward what I _noticed_. The replies that were quietly fine never become a pair, and the model can't learn anything the pairs don't say.

**A rulebook and a judge.** Write the rules down — brief in chat, plain names, ask before you act, never claim done without checking — and have a model judge answers against them. That's the [AI-with-a-rulebook grader](/ai-post-training#taste-test-by-an-ai-with-a-rulebook-rlaif-constitutional-ai), pointed at one person's rules instead of a lab's, and there's a published precedent for teaching a _personality_ this way: describe the traits, have the model write replies in line with them and rank its own, train on the rankings, no human labels in the loop. Here's the joke, though: I already have the rulebook. It's my CLAUDE.md. The rulebook _is_ the system prompt. Rung four for a personal agent isn't inventing rules; it's deciding which rules are stable enough to bake in.

Which I would bake in: tone, brevity, the reflexes (ask before acting, say "I don't know"). Which stays in the harness: anything with a name, a date, or a fact in it, and anything I've changed my mind about in the last month. That second list is most of the file.

### How the taste test gets gamed

My grader is me, and I like being agreed with. Every known failure mode of training on preferences gets _worse_ when the preferences come from one person, and they're well documented:

- **Flattery wins.** When people and grader models rate answers, a convincingly written answer that agrees with the reader beats a correct one a non-negligible fraction of the time, and pushing a model against such a grader sometimes trades truth for agreement. The public version of this happened in spring 2025: a chat model got an update that added users' thumbs-up and thumbs-down to its training reward, turned noticeably sycophantic within days, and was rolled back, with the postmortem saying the new signal had weakened the one that "had been holding sycophancy in check." My thumbs are that signal, at n=1. A personal agent trained on my picks will learn to please me unless I deliberately put picks in the set where I preferred the answer that told me I was wrong.
- **Longer wins.** Most of the measured improvement from preference training, in one careful study, came down to answers getting longer — a reward that counted only length reproduced most of the gains. A widely used judge-based leaderboard had to add length control because models were gaming it with verbosity. This one is funny for me, since "shorter" is my most frequent correction: a lazy judge would train the opposite of the thing I most want.
- **The judge's blind spots become the model's.** Judges prefer whichever answer they read first, prefer longer answers, and prefer their own writing. The good news is that a strong judge agrees with people about as often as people agree with each other — over 80% in the paper that measured it — so a judge is about as good as a second person. The question is whether it agrees with _me_, and I only find out by checking it against picks I held back.

The checks, one per failure: a held-out set of my own picks and an agreement rate the judge has to hit before it grades anything; length-controlled comparisons, or an explicit penalty, so "more" doesn't score as "better"; and a deliberate slice of pairs where the winner disagreed with me. And the framing rule from [/ai-testing](/ai-testing#wrinkle---no-known-answer): ask the judge _which of these two is better_, never _rate this from one to ten_. Pairwise is what makes any of this work.

<details markdown="1">
<summary>Prior work</summary>

- The thousand-example result and the "alignment teaches format" hypothesis: [LIMA: Less Is More for Alignment](https://arxiv.org/abs/2305.11206) — a 65B model "fine-tuned with the standard supervised loss on only 1,000 carefully curated prompts and responses, without any reinforcement learning or human preference modeling."
- Straight from pairs, no grader: [Direct Preference Optimization](https://arxiv.org/abs/2305.18290).
- Rulebook graders: [Constitutional AI](https://arxiv.org/abs/2212.08073); teaching personality the same way: [Claude's Character](https://www.anthropic.com/research/claude-character) — "Claude then ranks its own responses to each message by how well they align with its character." The long-form rulebook itself, released January 2026: [Claude's constitution](https://www.anthropic.com/news/claude-new-constitution).
- Flattery: [Towards Understanding Sycophancy in Language Models](https://arxiv.org/abs/2310.13548) — "both humans and preference models (PMs) prefer convincingly-written sycophantic responses over correct ones a non-negligible fraction of the time." The rolled-back update: OpenAI's [Sycophancy in GPT-4o](https://openai.com/index/sycophancy-in-gpt-4o/) and [Expanding on what we missed with sycophancy](https://openai.com/index/expanding-on-sycophancy/) — "the update introduced an additional reward signal based on user feedback—thumbs-up and thumbs-down data from ChatGPT."
- Length: [A Long Way to Go: Investigating Length Correlations in RLHF](https://arxiv.org/abs/2310.03716) — "even a purely length-based reward reproduces most downstream RLHF improvements over supervised fine-tuned models"; [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475).
- Judge biases and the 80% figure: [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685).

</details>

## What a solo builder can run today

The honest list, checked this week. Everything here takes an open-weight model and a clip-on adapter; nobody on a budget of evenings moves all the weights.

- **The adapter isn't a compromise.** For the loop methods, an adapter matches moving all the weights even at the smallest rank, and the reason is the one behind the [surprise table](/ai-post-training#how-does-the-model-learn-from-the-grade): a graded try carries only about a bit of information, so there's very little to store. Two practical findings from the same work: put the adapter on every layer, not just attention, and use a learning rate about ten times higher than you would for full training.
- **One GPU is enough.** With the base model squeezed to 4 bits, a 65B model fine-tunes on a single 48GB card. Going the other way, a 1.5B model runs a reasoning-style RL loop in 5GB, which is a free Colab.
- **Open libraries take pairs or a grader function directly.** The Hugging Face trainers cover all three rungs — copy the expert, pairs, and grade on a curve — and the curve one takes a plain Python function that gets the completions and returns a list of scores. Prime Intellect's `verifiers` packages an _environment_ (a dataset, the rollout logic, and a rubric of weighted reward functions) as an installable Python project, with a hub of shared ones, and plugs into several trainers.
- **Or rent the loop.** Tinker, from Thinking Machines, is the one I'd try first: you write the training loop locally in four calls (forward-backward, optimizer step, sample, save) and they run the GPUs. It's been open to everyone since December 2025 and prices per million tokens — for an 8B model, about 44¢ per million tokens trained and 60¢ per million sampled at the time of writing. Napkin math for a first run: five thousand of my correction pairs at a few hundred tokens each is a few million training tokens, so single-digit dollars. The loop methods cost more because sampling dominates, but not a different order of magnitude.
- **What's gone.** OpenAI's hosted reinforcement fine-tuning, the one that took a grader you wrote, is closed to new users and being wound down. If you find a tutorial for it, it's history.

<details markdown="1">
<summary>Prior work</summary>

- Adapters for RL: [LoRA Without Regret](https://thinkingmachines.ai/blog/lora/) — "LoRA fully matches the learning performance of FullFT when running policy gradient algorithms for reinforcement learning, even with ranks as low as 1."
- 4-bit base plus adapter: [QLoRA](https://arxiv.org/abs/2305.14314) — "finetune a 65B parameter model on a single 48GB GPU while preserving full 16-bit finetuning task performance."
- The 5GB reasoning loop: [Unsloth's GRPO release](https://unsloth.ai/blog/grpo) — "train your own reasoning model with just 5GB VRAM for Qwen2.5 (1.5B)."
- Libraries: [TRL](https://huggingface.co/docs/trl/index) (`SFTTrainer`, `DPOTrainer`, [`GRPOTrainer`](https://huggingface.co/docs/trl/main/en/grpo_trainer) — "The function must return a list of floats. Each float represents the reward corresponding to a single completion."); [verifiers](https://github.com/PrimeIntellect-ai/verifiers) and the Environments Hub.
- Rented loop: [Tinker](https://thinkingmachines.ai/tinker/), its [general availability](https://thinkingmachines.ai/news/tinker-general-availability/), and the [models and pricing page](https://tinker-docs.thinkingmachines.ai/tinker/models/).
- Wound down: OpenAI's [reinforcement fine-tuning guide](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning) — "The platform is no longer accessible to new users."

</details>

## The order I'd do it in

This is the sequence, with the stop condition between each step. The point of the stop conditions is that most of the time I should stop.

1. **Build the eval.** A set of held-out tasks or held-out picks and a number that comes out of them. _Stop if_ the number is already fine — the problem was a feeling.
2. **Prompt and harness to the ceiling.** Rewrite the rule, move it closer to where it's needed, turn it into a hook or a tool where it can be one. _Stop if_ the number moves. It usually does.
3. **Start collecting pairs anyway.** Every correction I make is an A-over-B pick, and the cost of saving them is near zero. This step has no stop condition; it's how step five becomes possible later.
4. **Copy the expert, with an adapter, on a small model.** Take the examples I already have of the behavior done right, train an adapter, and score on the held-out set _and_ on a general benchmark — a small model that learns my taste and forgets how to code is a loss. _Stop if_ the held-out number moves and the general one doesn't drop.
5. **Pairs, straight to A-over-B.** Same adapter, the saved picks, no grader and no loop. _Stop if_ agreement with my held-out picks is where I want it.
6. **A grader in a loop, only where there's a checker.** For the coding agent that's the tests. For the personal agent it's a rulebook grader I've first validated against my own picks — and honestly, I don't expect to reach this step for the personal agent. The failure modes in the section above are the reason.

Two things stay true all the way up. The eval from step one is the thing I'm optimizing toward, so it gets more scrutiny than the training does. And the general-competence check from step four never comes off — every rung up the ladder is a chance to teach the model my taste at the cost of its skill.

## What this post is not about

- **The methods themselves** — who grades, how the model knows what's usual, which weights move: [/ai-post-training](/ai-post-training). Where post-training sits next to pre-training and serving: [/ai-training](/ai-training).
- **Building the harness** — most agent problems are harness problems, and that's [/chop](/chop), [/how-igor-chops](/how-igor-chops), and [/ai-cockpit](/ai-cockpit).
- **Building the evals** — the grader is an eval, and evals are [/hill-climbing](/hill-climbing) and [/ai-testing](/ai-testing).
- **Results** — I haven't run any of this yet. This is the plan and the reading, written down before the first run so I can check later how wrong it was.

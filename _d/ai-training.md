---
layout: post
title: "Training LLMs"
permalink: /ai-training
redirect_from:
  - /training
  - /llm-training
tags:
  - ai
  - machine-learning
ai_default_image: true
---

I don't train models for a living — I build on top of them. But the models I build on are made in two very different steps, and almost everything I care about as a consumer happens in the second one. Pre-training reads the internet and installs knowledge; post-training turns that into an assistant with a format, a personality, and lately the ability to reason and write working code. These are my working notes on that second step — kept deliberately shallow, enough to know which lever to pull, not to go pull it myself.

{% include alert.html content="Everything here is public information and my own opinions. There's no secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [How a model gets made](#how-a-model-gets-made)
- [Post-training](#post-training)
  - [SFT: imitate good answers](#sft-imitate-good-answers)
  - [RLHF: learn the taste from rankings](#rlhf-learn-the-taste-from-rankings)
  - [DPO: the same preferences, no RL loop](#dpo-the-same-preferences-no-rl-loop)
  - [RLVR: let a checker grade it](#rlvr-let-a-checker-grade-it)
  - [GRPO: the optimizer that made RLVR cheap](#grpo-the-optimizer-that-made-rlvr-cheap)
  - [RLAIF: when the judge is a model](#rlaif-when-the-judge-is-a-model)
  - [Methods at a glance](#methods-at-a-glance)
  - [How the weights actually change: LoRA](#how-the-weights-actually-change-lora)
  - [Datasets: what you train on vs what you grade on](#datasets-what-you-train-on-vs-what-you-grade-on)
- [How does post-training differ from RAG and the harness?](#how-does-post-training-differ-from-rag-and-the-harness)
- [Post-training for coding competence](#post-training-for-coding-competence)
  - [You get what you measure](#you-get-what-you-measure)
  - [The loop](#the-loop)
- [Deployment: quantization and serving](#deployment-quantization-and-serving)
- [See how it works](#see-how-it-works)
- [What this post is not about](#what-this-post-is-not-about)
- [Appendix: engineering, science, and alchemy](#appendix-engineering-science-and-alchemy)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## How a model gets made

Three stages, and almost everything else is a footnote to them:

1. **Pre-training** — show the model a huge pile of text and have it predict the next token, over and over. No labels, just text, which is why it scales: raw text is basically free. This is where the compute and money go — the headline "\$X million to train" numbers are almost entirely pre-training — and it's where facts, skills, and the model's "world model" come from. If a model doesn't know something, it usually didn't see enough of it here. The output is a **base model**: it has read the internet but isn't an assistant. Prompt it with a question and it'll happily autocomplete ten more questions.
2. **Post-training** — take that base model and shape its _behavior_: answer instead of autocomplete, follow instructions, hold a format, refuse the obviously bad stuff, and — the recent addition — think before answering. A rounding error next to pre-training's cost, and most of what makes a chat model feel like one. The rest of this post.
3. **Deployment** — shrink and serve the thing so it runs fast and cheap. [Briefly below](#deployment-quantization-and-serving); the full story is [/ai-inference](/ai-inference).

The one intuition to keep: **pre-training installs knowledge; post-training shapes behavior.** That single line drives the whole [post-training vs RAG vs the harness](#how-does-post-training-differ-from-rag-and-the-harness) decision below.

A caveat before the map: a lot of this is still alchemy — recipes kept because they work, not because anyone can say why. [Why that is, in the appendix ↓](#appendix-engineering-science-and-alchemy)

## Post-training

Every post-training method is the same move: pick a behavior you want more of, find a **signal** that says which outputs have it, and nudge the weights toward it. The methods differ in where the signal comes from, and that's the lineage:

1. **Demonstrations → SFT.** Show it good answers; it imitates them. The first and biggest shift.
2. **Preferences → RLHF, or DPO** for the same data with less machinery. Show it two answers and which is better; it learns the taste.
3. **Verifiable rewards → RLVR.** Skip the human: let a checker grade the answer. This is what made reasoning and coding models take off.

Each step builds on the last — SFT gets the model into the right neighborhood, preference tuning polishes, and verifiable rewards push hard on whatever you can actually grade. A modern open recipe runs all three in order: [Tülu 3](https://arxiv.org/abs/2411.15124) is SFT → DPO → RLVR.

### SFT: imitate good answers

Supervised fine-tuning is plain next-token training pointed at a curated set of (prompt → ideal answer) pairs instead of the internet. It's the first step of the [InstructGPT](https://arxiv.org/abs/2203.02155) recipe that turned GPT-3 into an assistant: the base model learns to answer instead of autocomplete, and to hold whatever format the demos hold.

- **Optimizes:** the likelihood of the demonstrated answers — imitation.
- **Data:** human-written (or strong-model-written) target answers. Thousands to tens of thousands, and quality beats volume.
- **Reach for it when:** the behavior can be shown by example — a format, a tone, a workflow.
- **Watch-out:** it can only copy. It can't exceed the demos, and it never learns what _not_ to do.

### RLHF: learn the taste from rankings

People find it far easier to say which of two answers is better than to write the ideal one. So RLHF ([InstructGPT](https://arxiv.org/abs/2203.02155)) collects rankings, trains a **reward model** to predict them, then runs reinforcement learning (PPO) so the policy produces answers the reward model scores highly. A per-token KL penalty keeps the policy close to the SFT model, so it can't drift into nonsense the reward model happens to like.

- **Optimizes:** the reward model's score — a learned proxy for "what people prefer".
- **Data:** A-vs-B human preferences, plus an SFT model to start from.
- **Reach for it when:** you want helpfulness, tone, or safety beyond what demos can teach.
- **Watch-out:** a heavy pipeline (policy, reference, reward, and value models all in flight), and the reward model is a proxy the policy will over-optimize — [reward hacking](#the-loop).

### DPO: the same preferences, no RL loop

[DPO](https://arxiv.org/abs/2305.18290) noticed the reward model was a detour: the same preference data can be fit directly with a classification-style loss on the policy — no reward model, no RL loop. Most of RLHF's benefit for a fraction of the machinery, which is why it's the default preference step in open recipes.

- **Optimizes:** the same preference objective as RLHF, solved in closed form.
- **Data:** the same A-vs-B pairs.
- **Reach for it when:** you'd reach for RLHF but can't run (or don't want to babysit) an RL pipeline.
- **Watch-out:** still bounded by the preference data, and less flexible than a real RL loop when you want to shape the reward.

### RLVR: let a checker grade it

If the answer can be checked — a math result, a unit test, a task that either got done or didn't — you need neither humans nor a reward model. [RLVR](https://arxiv.org/abs/2411.15124) (the name is from Tülu 3) runs RL straight against that checker: a reward when the answer verifies, nothing otherwise. [DeepSeek-R1](https://arxiv.org/abs/2501.12948) showed how far it goes — reasoning behavior came out of RL on a base model with no human-written reasoning traces at all — and it's the engine behind the o1-style reasoning models and the coding agents [below](#post-training-for-coding-competence). The optimizer is PPO or, increasingly, [GRPO](#grpo-the-optimizer-that-made-rlvr-cheap) — next.

- **Optimizes:** the rate at which answers pass the checker.
- **Data:** prompts that come with a verifier — math with known answers, code with tests, instructions with checkable constraints. No human labels at training time.
- **Reach for it when:** correctness is checkable: reasoning, math, code, agentic tasks.
- **Watch-out:** only works where answers are checkable, and the checker becomes the target — the model will game the test if it can.

### GRPO: the optimizer that made RLVR cheap

PPO needs a second network, the value model (critic), to estimate how well each answer was _expected_ to do, so a raw reward can be turned into an advantage. [GRPO](https://arxiv.org/abs/2402.03300) (DeepSeekMath) drops it: sample a group of answers to the same prompt, score each with the checker, and use the group's mean and spread as the baseline — an answer's advantage is just how much better it did than its siblings. No critic to train or hold in memory, which is what let [DeepSeek-R1](https://arxiv.org/abs/2501.12948) run pure RL with rule-based accuracy and format rewards straight on a base model.

- **Optimizes:** the same verifiable reward as RLVR, with the group standing in for the critic.
- **Data:** several sampled answers per prompt, plus the checker's score for each. Nothing else.
- **Reach for it when:** you're doing RLVR and can't afford, or don't want to tune, a value model — the default for reasoning RL today.
- **Watch-out:** its normalization terms bias it. Dividing each answer's loss by its length penalizes long wrong answers less, so wrong answers get longer; dividing by the group's reward spread over-weights the easiest and hardest prompts. [Dr. GRPO](https://arxiv.org/abs/2503.20783) removes both terms. [DAPO](https://arxiv.org/abs/2503.14476) widens the upper clip against entropy collapse, skips prompts where every sample scored the same (zero gradient), averages loss per token rather than per answer, and penalizes over-long answers softly instead of as failures.

### RLAIF: when the judge is a model

RLAIF (from [Constitutional AI](https://arxiv.org/abs/2212.08073)) is RLHF with an AI doing the ranking — an LLM-as-judge instead of a human, so the preference data scales past what people can label. It's also what's left when the target can't be checked at all. To teach a language model to paint by writing p5.brush JavaScript, [Surya Narreddi hand-rated 1,664 generated images down to a 581-picture reference pool](https://surya.website/rling-qwen-to-paint-with-code) and made the reward "did the judge prefer this render to two pulled from that pool" — with no test to pass, the reward function _is_ the design work, and [a badly built one plateaus while the score keeps climbing](/hill-climbing#your-other-job-build-evals).

### Methods at a glance

| Method    | Signal (who or what grades)                                           | Separate reward model?           | Best for                                                       | Watch-out                                       |
| --------- | --------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| **SFT**   | Human-written target answers                                          | No                               | The first shift: answer instead of autocomplete, hold a format | Can't exceed the demos or learn what not to do  |
| **RLHF**  | Humans rank A vs B → reward model                                     | **Yes**                          | Helpfulness, tone, safety beyond what demos teach              | Heavy pipeline; reward hacking                  |
| **RLAIF** | A model ranks A vs B → reward model                                   | Yes                              | RLHF at scale, or when nothing is checkable                    | The judge's blind spots become the model's      |
| **DPO**   | The same A-vs-B rankings, fit directly                                | No                               | RLHF's benefit without the RL loop                             | Bounded by the preference data                  |
| **RLVR**  | A checker: unit tests, math grader, sandbox                           | No — the checker _is_ the reward | Reasoning and coding agents, anything checkable                | Only where checkable; gaming the test           |
| **GRPO**  | RLVR's checker; a group of sampled answers per prompt is the baseline | No — and no value model either   | Reasoning RL on a budget; the usual RLVR optimizer             | Length bias (Dr. GRPO), entropy collapse (DAPO) |

### How the weights actually change: LoRA

Whichever method, you rarely retrain every weight. **LoRA** ([Low-Rank Adaptation](https://arxiv.org/abs/2106.09685)) freezes the model and trains a small low-rank matrix bolted alongside each layer — stick a narrow matrix next to the model and only tune that. On GPT-3 175B it cut trainable parameters 10,000× and GPU memory 3× with no loss in quality, and the base model's knowledge stays intact because you never touched it. Hands-on: [LoRA on Llama 3](https://colab.research.google.com/drive/1efOx_rwZeF3i0YsirhM1xhYLtGNX6Fv3?usp=sharing#scrollTo=bDp0zNpwe6U_) and [Fine-Tune Your Own Llama 2 Model in a Colab Notebook](https://mlabonne.github.io/blog/posts/Fine_Tune_Your_Own_Llama_2_Model_in_a_Colab_Notebook.html), the walkthrough I'd start with.

### Datasets: what you train on vs what you grade on

The data splits into what you _train_ on and what you _grade_ on — and under RLVR the two collapse, because the eval's checker is the reward.

**Training data** — the (prompt → good answer) sets behavior gets shaped on:

- **[Alpaca](https://huggingface.co/datasets/yahma/alpaca-cleaned)** — the early instruction dataset: [52K demonstrations generated with OpenAI's text-davinci-003](https://crfm.stanford.edu/2023/03/13/alpaca.html), used to fine-tune LLaMA 7B. The clever bit was using a strong model to make training data for a weaker one, cheaply. That trick is everywhere now.

**Evals / benchmarks** — held-out tasks you score against, not train on. For coding agents they're also the RLVR reward target (see [Post-training for coding competence](#post-training-for-coding-competence)):

- **[SWE-bench](https://www.swebench.com/)** — real GitHub issues paired with the repo they came from; the model must produce a patch that makes the repo's _hidden_ tests pass. Binary grade, no LLM-judging style. The [paper](https://arxiv.org/abs/2310.06770) drew from popular Python repos; the subset everyone reports is [**SWE-bench Verified**](https://www.swebench.com/verified.html), 500 tasks each hand-checked by human developers so a correct patch can't fail on a broken test or ambiguous issue.
- **[Terminal-bench](https://www.tbench.ai/)** — agentic, end-to-end command-line tasks in a real sandbox (build a kernel, stand up a git server, debug a broken system), scored purely by whether the task got done. Where SWE-bench tests _writes a patch_, Terminal-bench tests _runs the machine_.

## How does post-training differ from RAG and the harness?

There are three places to change how a model behaves, and picking the right one saves enormous effort. Post-training changes the **weights**; RAG and the harness change things at **runtime**. Runtime is cheaper, faster to iterate, and updatable — so the order I actually reach for is harness → RAG → post-train, and I rarely get to the third.

| Layer                       | What it changes                           | Reach for it when                             | Iterate in |
| --------------------------- | ----------------------------------------- | --------------------------------------------- | ---------- |
| **Harness / MCP** (runtime) | what the model can _do_ and how it _acts_ | it needs tools, or a different way of working | seconds    |
| **RAG** (runtime)           | what the model _knows_                    | it needs your facts or fresh data             | seconds    |
| **Post-training** (weights) | the model's _default_ behavior            | the change must hold for everyone, every call | days       |

- **New facts** — your docs, today's data, private knowledge → **RAG**. Retrieve the relevant text at query time and put it in context. You can't reliably fine-tune facts in; that's pre-training's job, and fine-tuning on a handful of examples teaches _style_, not _knowledge_ — then cheerfully hallucinates the gaps.
- **New actions, or a different way of working** — call an API, read a file, search the web, plan before acting, always check its work → **the harness**: the system prompt, the tools you expose (increasingly through [MCP](https://modelcontextprotocol.io), a standard way to hand a model tools), the agent loop, memory, retries. The weights don't change; the scaffolding gets bigger. Building this well is most of what [/chop](/chop) and the [agent cockpit](/ai-cockpit) are about.
- **A new default everywhere** — behavior that has to hold for everyone without re-explaining it every call, or that prompting just can't make reliable → **post-training** (the [methods above](#post-training)).

Rule of thumb: facts → RAG, actions → harness, baked-in defaults → post-train. When in doubt, push the change as far toward runtime as it'll go.

## Post-training for coding competence

The map above is abstract until you watch it chase a target. Coding agents are the cleanest example, because "did it work" is something a computer can check — which is exactly the [RLVR](#rlvr-let-a-checker-grade-it) setup, pointed at software.

### You get what you measure

So first, define the target by the eval. "Coding competence" for an agent isn't a vibe; it's two questions a benchmark can answer (both are [described above](#datasets-what-you-train-on-vs-what-you-grade-on)):

- **SWE-bench** — can it fix real software? Hand the model a real GitHub issue and its repo; the grade is binary: do the hidden tests pass? The tests decide, not a style judge.
- **Terminal-bench** — can it actually operate a computer? Drop the agent in a real terminal sandbox with an end-to-end job, scored by whether it's done.

Pick those as your scoreboard and you've defined the goal precisely enough to optimize against — which is the whole trap and the whole point. You get what you measure, so measure the thing you actually want.

### The loop

With the target pinned, post-training is the same lineage, run as a loop:

1. **SFT on good trajectories** — collect traces of an agent doing the job _well_ (read the repo, run the tests, edit, re-run, fix), and fine-tune on them. This teaches the _shape_ of the work — that you check before you claim done — not just the final diff.
2. **RL with execution rewards (RLVR)** — now let the model attempt held-out tasks and reward it for the tests going green. The passing test suite _is_ the reward signal; no human ranks the answers, the sandbox does. This is the same engine as the math-and-code reasoning models, with "the repo's tests pass" standing in for "the answer is 42." The Goblin walkthrough [below](#see-how-it-works) is a hands-on tour of this exact RL loop.
3. **Measure on held-out tasks** — score on SWE-bench / Terminal-bench instances the model never trained on, then feed what broke back into steps 1 and 2. Iterate.

The catch is the same as with any sharp reward: optimize hard enough and the model games it. Reward the tests passing and it may special-case the test, hard-code the expected output, or `pip install` its way around the real fix — reward hacking, coding-agent edition. So you hold out tasks, rotate them, and keep a human reading what the green checkmark is actually rewarding. The verifiable reward is what makes coding such fertile ground for RL; the leak it invites is why the held-out eval matters as much as the loop.

## Deployment: quantization and serving

Not training, but it's where the model you actually run comes from. Serving _is_ inference, and that story is its own post:

{% include summarize-page.html src="/ai-inference" %}

- **Quantization** — compress the weights from 16 bits per parameter down to ~4 bits or less (`Q4_0`, `IQ2_XXS`, and friends). [How the methods work](https://www.reddit.com/r/LocalLLaMA/comments/1ba55rj/overview_of_gguf_quantization_methods/), and a [scorecard comparing them](https://huggingface.co/datasets/christopherthompson81/quant_exploration). It's _lossy_ compression, so you have to eval the damage — a common check is comparing the difference in answers via embeddings.
- **GGUF (GPT-Generated Unified Format)** — the file format these models are stored in (GGUF is GGML's successor). It's what you download when you grab a quantized model to run locally.
- [Introduction to Weight Quantization](https://mlabonne.github.io/blog/posts/Introduction_to_Weight_Quantization.html) — the explainer I keep going back to.

## See how it works

For the concepts — how a neural network actually learns, then how a transformer turns that into language — nothing beats 3Blue1Brown's [neural networks series](https://www.3blue1brown.com/topics/neural-networks). Start with gradient descent and backprop (that _is_ training), then the [transformers and GPT chapters](https://www.youtube.com/watch?v=wjZofJX0v4M).

For the mechanics, Brendan Bycroft's [LLM visualization](https://bbycroft.net/llm) walks a single token through every layer of a GPT model in 3D — embeddings, attention, the lot.

And for post-training specifically, [How to Train Your Goblin](https://goblins.mchen.workers.dev/) (mchen and Will Brown, on Prime Intellect) is a playful scroll-through of RL — it retraces how GPT picked up its accidental "goblin" tic by deliberately RL-training models to overuse the word, hidden trigger reward and all. A concrete look at reward hacking and how RL differs from SFT, with the code and training runs open.

## What this post is not about

To keep the map focused, a few neighbors that live elsewhere:

- **Image / diffusion models** — a different training story altogether (denoising, not next-token). See [/ai-image](/ai-image) for generating images of yourself, and [/ai-art](/ai-art) for the art side.
- **The actual math** — I'm staying at the mental-model level on purpose. For the deep version, start with the [seminal papers](/ai-paper). For the intuition behind language models, see [/gpt](/gpt).
- **Distributed-training infrastructure** — the 8,000-GPU engineering problem. Real, hard, and out of scope for me.

For the basics ("what even is an LLM"), [/ai-faq](/ai-faq) is the canonical reference; for putting models to work, see [/chop](/chop); for checking they actually work, [/ai-testing](/ai-testing).

## Appendix: engineering, science, and alchemy

Training LLMs is three jobs at once. Two have clean definitions: **science** figures out a true fact about a model that already exists; **engineering** makes a system hit a target. The same question word tells you which — _"why is this true?"_ is science, _"how do I hit this number?"_ is engineering.

Concrete pairs, same topic on each line:

| Topic          | Science question                                      | Engineering question                                          |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| Scaling        | Why does loss drop predictably with compute?          | How do I train this 70B model on 8k GPUs without it crashing? |
| Inference      | What is the model actually computing in these layers? | How do I serve it at 50ms/token without going broke?          |
| Generalization | Why don't overparameterized nets just memorize?       | How do I stop _this_ model overfitting on _my_ data?          |
| Alignment      | Does the model have goals? Can it deceive?            | How do I make it refuse harmful requests in prod?             |
| Capabilities   | Why do new abilities appear suddenly at scale?        | How do I get reliable tool-calling out of what I have?        |
| Data           | What did the model actually learn from this corpus?   | How do I dedup, filter, and decontaminate 10T tokens?         |

Science output is a _fact_ ("loss scales as a power law"). Engineering output is a _working thing_ ("a serving stack that hits the SLA").

The one insight worth keeping: in AI the usual order is reversed. Normally science comes first — thermodynamics, then engines. In deep learning we built the thing first and are still reverse-engineering why it works, so a lot of AI "science" is closer to biology (dissect an organism you didn't design) than physics. That's why the line feels blurry: the systems are running ahead of the explanations.

Which brings in the third job. A lot of training is still **alchemy** — you curate the data, pick the recipe, run it, and see what comes out, and when it works the explanation usually arrives later, if at all. It can feel like macrodata refinement in _Severance_: sort the numbers that _feel_ wrong into the bin, without being told why they're wrong or what the bin is for. The difference is ours ships a product at the end.

{% include youtube.html src="Gnffe374Upw" %}

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

I don't train models for a living — I build on top of them. But to use LLMs well, it helps to carry a rough map of how one gets made: what pre-training buys you, what post-training changes, and where fine-tuning, RAG, and quantization actually fit. These are my working notes on that map, kept deliberately shallow — enough to make good decisions as a consumer of models, not to go train one.

{% include alert.html content="Everything here is public information and my own opinions. There's no internal Meta secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Engineering, science, and alchemy](#engineering-science-and-alchemy)
- [How a model gets made](#how-a-model-gets-made)
  - [Pre-training](#pre-training)
  - [Post-training](#post-training)
  - [Datasets](#datasets)
  - [Fine-tuning methods](#fine-tuning-methods)
  - [Deployment: quantization and serving](#deployment-quantization-and-serving)
- [How does post-training differ from RAG and the harness?](#how-does-post-training-differ-from-rag-and-the-harness)
- [Post-training for coding competence](#post-training-for-coding-competence)
  - [You get what you measure](#you-get-what-you-measure)
  - [The loop](#the-loop)
- [See how it works](#see-how-it-works)
- [What this post is not about](#what-this-post-is-not-about)
- [Appendix: engineering, science, and alchemy](#appendix-engineering-science-and-alchemy)
- [Appendix: AI inference](#appendix-ai-inference)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Engineering, science, and alchemy

Training LLMs is three jobs at once. **Engineering** makes a system hit a target — _"how do I hit this number?"_ **Science** figures out a true fact about a model that already exists — _"why is this true?"_ And **alchemy** is everything that works before either of those catches up: recipes found by trial and error and kept because they work, not because anyone can say why. The twist with AI is that we built the thing first, so the science is still chasing the systems — which means a lot of what looks like science is really alchemy for now. [The full breakdown, with concrete pairs, is in the appendix ↓](#appendix-engineering-science-and-alchemy)

## How a model gets made

Three stages, and almost everything else is a footnote to them:

1. **Pre-training** — show the model a huge pile of text and have it predict the next token, over and over. This is the expensive part — most of the compute and money — and it's where the model's _knowledge and raw capability_ come from. The output is a "base model" that has read the internet but isn't yet a helpful assistant. Prompt it with a question and it'll happily autocomplete ten more questions.
2. **Post-training** — take that base model and shape its _behavior_: follow instructions, answer instead of autocomplete, refuse the obviously bad stuff, hold a format. Cheap compared to pre-training, and it's most of what makes a chat model feel like one.
3. **Deployment** — shrink and serve the thing so it runs fast and cheap.

The one intuition to keep: **pre-training installs knowledge; post-training shapes behavior.** That single line drives the whole [post-training vs RAG vs the harness](#how-does-post-training-differ-from-rag-and-the-harness) decision below.

### Pre-training

- The objective is dumb and powerful: predict the next token. No labels, just text — which is why it scales, since raw text is basically free.
- This is where facts, skills, and the model's "world model" come from. If a model doesn't know something, it usually didn't see enough of it here.
- It's also where the cost lives. The headline "$X million to train" numbers are almost entirely pre-training.
- Output is a **base / foundation model** — capable but not steerable. Not the thing you actually talk to.

### Post-training

Turning the base model into an assistant. Most of my old "fine-tuning" notes actually belong here — they're behavior changes, not knowledge.

These methods form a lineage, not a flat menu — SFT shifts behavior first, preference tuning (RLHF and its descendants) refines it, and verifiable rewards branch off for problems you can grade:

| Method                                                                                              | How it learns                                                                                      | Signal (who/what grades)                    | Separate reward model?           | Best for                                                                                    | Watch-out                                                                                   |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **SFT** (supervised fine-tuning)                                                                    | Imitates curated answers — next-token loss on (prompt → ideal answer) pairs                        | Human-written target answers                | No                               | The first, biggest behavior shift: answer instead of autocomplete, hold a format            | Only as good as the demos — can't exceed them or learn what _not_ to do                     |
| **RLHF** (RL from human feedback)                                                                   | RL (usually PPO): optimize the policy against a learned reward model                               | Humans rank outputs → reward model          | **Yes**                          | Refining helpfulness / tone / safety beyond what demos can teach                            | Heavy pipeline; reward-model drift; over-optimization (reward hacking)                      |
| **[DPO](https://arxiv.org/pdf/2305.18290.pdf?ref=hackernoon.com)** (direct preference optimization) | Optimizes the preference _directly_ with a classification-style loss — no RL loop, no reward model | Same A-vs-B human/model preferences as RLHF | No                               | A simpler, cheaper, more stable stand-in for RLHF — most of the benefit, far less machinery | Still bounded by the preference data; less flexible than full RL for complex reward shaping |
| **RLVR** (RL from verifiable rewards)                                                               | RL against an automatic checker — reward = "did it get the right answer"                           | A grader: unit tests, math checker, sandbox | No — the checker _is_ the reward | Reasoning & coding agents (the o1-style frontier), where correctness is checkable           | Only works where answers are checkable; invites reward hacking (gaming the test)            |

**RLAIF** is the cheap variant of RLHF — an AI does the ranking (LLM-as-judge) instead of humans, so it scales past what humans can label.

### Datasets

The data the model learns from — split into what you _train_ on and what you _grade_ on.

**Training data** — the (prompt → good answer) sets behavior gets shaped on:

- **[Alpaca](https://huggingface.co/datasets/yahma/alpaca-cleaned)** — an early instruction dataset. The clever bit was using GPT-4 to generate the training data cheaply. That "use a strong model to make data for a weaker one" trick is everywhere now.

**Evals / benchmarks** — held-out tasks you score against, not train on. For coding agents these are also the RLVR reward target (see [Post-training for coding competence](#post-training-for-coding-competence)):

- **[SWE-bench](https://www.swebench.com/)** — real GitHub issues paired with the repo they came from; the model must produce a patch that makes the repo's _hidden_ tests pass. Binary grade, no LLM-judging style. The [paper](https://arxiv.org/abs/2310.06770) drew from popular Python repos; the subset everyone reports is [**SWE-bench Verified**](https://www.swebench.com/verified.html), 500 tasks each hand-checked by human developers so a correct patch can't fail on a broken test or ambiguous issue.
- **[Terminal-bench](https://www.tbench.ai/)** — agentic, end-to-end command-line tasks in a real sandbox (build a kernel, stand up a git server, debug a broken system), scored purely by whether the task got done. Where SWE-bench tests _writes a patch_, Terminal-bench tests _runs the machine_.

### Fine-tuning methods

How you actually do the fine-tuning above without retraining the whole model:

- **LoRA (Low-Rank Adaptation)** — instead of updating all the weights, freeze them and train a small low-rank matrix bolted alongside. Basically: stick a narrow matrix next to the model and only tune that. Far fewer parameters to update, so it's faster and cheaper, and you keep the base model's knowledge intact. ([Example on Llama 3](https://colab.research.google.com/drive/1efOx_rwZeF3i0YsirhM1xhYLtGNX6Fv3?usp=sharing#scrollTo=bDp0zNpwe6U_))
- [Fine-Tune Your Own Llama 2 Model in a Colab Notebook](https://mlabonne.github.io/blog/posts/Fine_Tune_Your_Own_Llama_2_Model_in_a_Colab_Notebook.html) — a good hands-on walkthrough.

### Deployment: quantization and serving

Not training, but it's where the model you actually run comes from, so it lands here.

- **Quantization** — compress the weights from 16 bits per parameter down to ~4 bits or less (`Q4_0`, `IQ2_XXS`, and friends). [How the methods work](https://www.reddit.com/r/LocalLLaMA/comments/1ba55rj/overview_of_gguf_quantization_methods/), and a [scorecard comparing them](https://huggingface.co/datasets/christopherthompson81/quant_exploration). It's _lossy_ compression, so you have to eval the damage — a common check is comparing the difference in answers via embeddings.
- **GGUF (GPT-Generated Unified Format)** — the file format these models are stored in (GGUF is GGML's successor). It's what you download when you grab a quantized model to run locally.
- [Introduction to Weight Quantization](https://mlabonne.github.io/blog/posts/Introduction_to_Weight_Quantization.html) — the explainer I keep going back to.

## How does post-training differ from RAG and the harness?

There are three places to change how a model behaves, and picking the right one saves enormous effort. Post-training changes the **weights**; RAG and the harness change things at **runtime**. Runtime is cheaper, faster to iterate, and updatable — so the order I actually reach for is harness → RAG → fine-tune, and I rarely get to the third.

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

The post-training story above is abstract until you watch it chase a target. Coding agents are the cleanest example, because "did it work" is something a computer can check — which is exactly the [RLVR](#post-training) setup, pointed at software.

### You get what you measure

So first, define the target by the eval. "Coding competence" for an agent isn't a vibe; it's two questions a benchmark can answer (both [datasets](#datasets) are described above):

- **[SWE-bench](#datasets)** — can it fix real software? Hand the model a real GitHub issue and its repo; the grade is binary: do the hidden tests pass? The tests decide, not a style judge.
- **[Terminal-bench](#datasets)** — can it actually operate a computer? Drop the agent in a real terminal sandbox with an end-to-end job, scored by whether it's done. SWE-bench tests _writes a patch_, Terminal-bench tests _runs the machine_.

Pick those as your scoreboard and you've defined the goal precisely enough to optimize against — which is the whole trap and the whole point. You get what you measure, so measure the thing you actually want.

### The loop

With the target pinned, post-training is the same three stages, run as a loop:

1. **SFT on good trajectories** — collect traces of an agent doing the job _well_ (read the repo, run the tests, edit, re-run, fix), and fine-tune on them. This teaches the _shape_ of the work — that you check before you claim done — not just the final diff.
2. **RL with execution rewards (RLVR)** — now let the model attempt held-out tasks and reward it for the tests going green. The passing test suite _is_ the reward signal; no human ranks the answers, the sandbox does. This is the same engine as the math-and-code reasoning models, with "the repo's tests pass" standing in for "the answer is 42." The Goblin walkthrough [below](#see-how-it-works) is a hands-on tour of this exact RL loop.
3. **Measure on held-out tasks** — score on SWE-bench / Terminal-bench instances the model never trained on, then feed what broke back into steps 1 and 2. Iterate.

The catch is the same as with any sharp reward: optimize hard enough and the model games it. Reward the tests passing and it may special-case the test, hard-code the expected output, or `pip install` its way around the real fix — reward hacking, coding-agent edition. So you hold out tasks, rotate them, and keep a human reading what the green checkmark is actually rewarding. The verifiable reward is what makes coding such fertile ground for RL; the leak it invites is why the held-out eval matters as much as the loop.

## See how it works

For the concepts — how a neural network actually learns, then how a transformer turns that into language — nothing beats 3Blue1Brown's [neural networks series](https://www.3blue1brown.com/topics/neural-networks). Start with gradient descent and backprop (that _is_ training), then the [transformers and GPT chapters](https://www.youtube.com/watch?v=wjZofJX0v4M).

For the mechanics, Brendan Bycroft's [LLM visualization](https://bbycroft.net/llm) walks a single token through every layer of a GPT model in 3D — embeddings, attention, the lot.

And for post-training specifically, [How to Train Your Goblin](https://goblins.mchen.workers.dev/) (mchen and Will Brown, on Prime Intellect) is a playful scroll-through of RL — it retraces how GPT picked up its accidental "goblin" tic by deliberately RL-training models to overuse the word, hidden trigger reward and all. A concrete look at reward hacking and how RL differs from SFT, with the code and training runs open.

I want to embed a small next-token-prediction demo right here (type a prefix, watch the probability distribution over the next token), built as a standalone [explainer](/explainers) and iframed in. Coming soon.

## What this post is not about

To keep the map focused, a few neighbors that live elsewhere:

- **Image / diffusion models** — a different training story altogether (denoising, not next-token). See [/ai-image](/ai-image) for generating images of yourself, and [/ai-art](/ai-art) for the art side.
- **The actual math** — I'm staying at the mental-model level on purpose. For the deep version, start with the [seminal papers](/ai-paper). For the intuition behind language models, see [/gpt](/gpt).
- **Distributed-training infrastructure** — the 8,000-GPU engineering problem. Real, hard, and out of scope for me.

For the basics ("what even is an LLM"), [/ai-faq](/ai-faq) is the canonical reference; for putting models to work, see [/chop](/chop); for checking they actually work, [/ai-testing](/ai-testing).

## Appendix: engineering, science, and alchemy

Two of the three roles have clean definitions. **Science** figures out a true fact about a model that already exists; **engineering** makes a system hit a target. The same question word tells you which — _"why is this true?"_ is science, _"how do I hit this number?"_ is engineering.

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

Which brings in the third role. A lot of training is still **alchemy** — you curate the data, pick the recipe, run it, and see what comes out, and when it works the explanation usually arrives later, if at all. It can feel like macrodata refinement in _Severance_: sort the numbers that _feel_ wrong into the bin, without being told why they're wrong or what the bin is for. The difference is ours ships a product at the end.

{% include youtube.html src="Gnffe374Upw" %}

## Appendix: AI inference

Training is how the model gets made; inference is what you pay for every time you _use_ it. The whole game is one question: **how do I serve tokens as cheaply as possible at a given level of intelligence?** You can always spend more compute and memory to go faster — the price just rises with it. The knobs that move that trade-off:

- **Prefill vs decode** — two very different phases. _Prefill_ reads the whole prompt in parallel and is compute-bound; it sets your time-to-first-token. _Decode_ then generates one token at a time, sequentially, bound by memory bandwidth — it has to stream the entire model plus the growing KV cache for every single token. Long outputs are decode-bound, which is why they feel slow.
- **Quantization** — fewer bits per weight means less data to move per token, so decode gets faster and cheaper, at some quality cost. Same lever as in [deployment](#deployment-quantization-and-serving), pointed at speed instead of disk.
- **The model matters** — a Mixture-of-Experts (MoE) model only activates a slice of its parameters per token, so you get big-model quality at small-model inference cost. Speculative decoding (a small draft model proposes tokens, the big model verifies a batch of them at once) is another way around the sequential bottleneck.

This one is big enough to deserve its own post — the full version lives at [/ai-inference](/ai-inference).

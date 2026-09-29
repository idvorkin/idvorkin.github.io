---
layout: post
title: "Post-training LLMs"
permalink: /ai-post-training
redirect_from:
  - /post-training
  - /rlhf
tags:
  - ai
  - machine-learning
ai_default_image: true
---

Pre-training is where a model reads the internet, and it's where the money goes. But the model you actually talk to was made afterwards, in post-training — the comparatively cheap stage that turns a text-autocompleter into an assistant. The first version of this post listed the methods one after another, and reading it back I couldn't hold them in my head: too many acronyms, each explained on its own. So this is the rewrite, built on two plain questions that every method answers — who grades the answer, and how the model learns from the grade. The jargon is in parentheses, where it belongs, with a [decoder at the end](#jargon-decoder) for when you go read the papers.

{% include alert.html content="Everything here is public information and my own opinions. There's no secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The one intuition](#the-one-intuition)
- [Two questions explain every method](#two-questions-explain-every-method)
- [Who grades the answer?](#who-grades-the-answer)
  - [Copy the expert (SFT)](#copy-the-expert-sft)
  - [Taste test by people (RLHF)](#taste-test-by-people-rlhf)
  - [Taste test by an AI with a rulebook (RLAIF, Constitutional AI)](#taste-test-by-an-ai-with-a-rulebook-rlaif-constitutional-ai)
  - [Answer key (RLVR)](#answer-key-rlvr)
- [How does the model learn from the grade?](#how-does-the-model-learn-from-the-grade)
  - [Coach with a forecaster (PPO)](#coach-with-a-forecaster-ppo)
  - [Grade on a curve against its own tries (GRPO)](#grade-on-a-curve-against-its-own-tries-grpo)
  - [Straight to A-over-B: no grader model, no forecaster (DPO)](#straight-to-a-over-b-no-grader-model-no-forecaster-dpo)
  - [Clip-on adapter (LoRA)](#clip-on-adapter-lora)
- [Recipes in plain words](#recipes-in-plain-words)
- [Methods at a glance](#methods-at-a-glance)
- [What this post is not about](#what-this-post-is-not-about)
- [Jargon decoder](#jargon-decoder)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The one intuition

**Pre-training installs knowledge; post-training shapes behavior.** A base model has read the internet but isn't an assistant — prompt it with a question and it happily autocompletes ten more questions. Post-training doesn't teach it much that's new; it changes what the model _does_ with what it already knows. That's why it's cheap next to pre-training, and why it's where most of the personality of a chat model comes from. The whole pipeline, and where post-training sits in it, is in the parent post:

{% include summarize-page.html src="/ai-training" %}

<a id="the-lineage"></a>

## Two questions explain every method

{% include local_image_float_right.html src="raccoon-post-training-lineage.webp" %}

Every post-training method takes the model's answer, grades it, and nudges the weights toward whatever scored well. So there are only two things to ask about any of them:

1. **Who grades the answer?** An expert's own answers to copy (SFT). A taste test by people (RLHF). A taste test by an AI with a rulebook (RLAIF, Constitutional AI). An answer key (RLVR).
2. **How does the model learn from the grade?** With a coach and a forecaster (PPO). Graded on a curve against its own tries (GRPO). Straight from A-over-B pairs, with no grader model and no forecaster (DPO). And whichever you pick, a clip-on adapter (LoRA) makes the weight update cheap.

Copy the expert is the odd one out: there is no grade, so no column — it's plain imitation and the first step every recipe takes. Every other method is a cell in this grid:

| Who grades ↓ · How it learns →                  | Coach + forecaster (PPO)                                         | Grade on a curve (GRPO)                         | Straight to A-over-B (DPO)                                         |
| ----------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| **Taste test by people** (RLHF)                 | classic RLHF — [InstructGPT](https://arxiv.org/abs/2203.02155)   | works too: GRPO takes any score                 | DPO — [Tülu 3](https://arxiv.org/abs/2411.15124)'s preference step |
| **Taste test by an AI with a rulebook** (RLAIF) | [Constitutional AI](https://arxiv.org/abs/2212.08073)'s RL phase | works too                                       | DPO on AI-labeled pairs                                            |
| **Answer key** (RLVR)                           | RLVR with PPO                                                    | [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | — (needs a score, not pairs)                                       |

The row and the column are independent, and that's the thing I kept getting wrong. **RLVR and GRPO are not either/or.** RLVR says where the score comes from (an answer key); GRPO says how a score turns into learning (grade each try against its siblings). GRPO is just as happy taking a grader model's score — DeepSeek-R1's final RL stage runs GRPO on a mix of answer-key and grader-model scores. Likewise RLHF is a row (people's taste, written down as a grader), and PPO is the column it's usually paired with.

Read the recipes that way and they stop being alphabet soup: **InstructGPT** is copy the expert, then a taste test with a coach. **Tülu 3** is copy the expert, then A-over-B, then an answer key. **DeepSeek-R1** is an answer key, graded on a curve. The [full recipes are below](#recipes-in-plain-words).

## Who grades the answer?

<a id="sft-imitate-good-answers"></a>

### Copy the expert (SFT)

{% include local_image_float_right.html src="raccoon-post-training-sft.webp" %}

No grade here, just an answer sheet. Supervised fine-tuning is further training of exactly the kind pre-training does — predict the next word piece (token) — pointed at a curated set of (prompt → ideal answer) pairs instead of the internet; nothing about the goal (the objective) changes, only the data, and that turns out to be enough. It's the first step of the [InstructGPT](https://arxiv.org/abs/2203.02155) recipe that turned GPT-3 into an assistant: OpenAI's labelers wrote demonstrations of the behavior they wanted, about 13k prompts' worth, and the base model learned to answer instead of autocomplete, and to hold whatever format the demos hold.

The expert doesn't have to be a person. Stanford's [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html) further trained LLaMA 7B on 52K demonstrations generated by OpenAI's text-davinci-003 — a strong model writing the training data for a weaker one. That trick is everywhere now: [DeepSeek-R1](https://arxiv.org/abs/2501.12948) was copied the same way — teacher-student copying (distillation) — into smaller models that beat their instruction-tuned starting points, and every "reasoning traces" dataset on Hugging Face is a big model's homework being copied by a small one.

- **Optimizes:** the probability (likelihood) the model gives the demonstrated answers — imitation.
- **Data:** (prompt → ideal answer) pairs, human-written or strong-model-written. Thousands to tens of thousands, and quality beats volume.
- **Reach for it when:** the behavior can be shown by example — a format, a tone, a workflow, a style of reasoning.
- **Watch-out:** it can only copy. It can't exceed the demos, it never learns what _not_ to do, and a handful of examples teaches _style_, not _knowledge_ — then cheerfully hallucinates the gaps.

{% include post-training-anim.html name="sft" caption="Copy the expert: the model's answer is pulled onto the teacher's, and the error score shrinks." %}

<a id="rlhf-learn-the-taste-from-rankings"></a>

### Taste test by people (RLHF)

{% include local_image_float_right.html src="raccoon-post-training-rlhf.webp" %}

People find it far easier to say which of two answers is better than to write the ideal one. So RLHF runs a taste test: show labelers several answers to the same prompt and have them rank them. Then it writes the taste down as a model — a copy of the LLM (OpenAI used a 6B one) trained on 33k prompts' worth of comparisons to take a prompt and a response and output one number predicting what people would prefer. That is the **grader** (reward model); it can score millions of answers nobody will ever read. The whole pipeline in one line: people's picks → train the grader → PPO scores thousands of fresh answers with it (the [coach-and-forecaster loop below](#coach-with-a-forecaster-ppo)). DPO skips the grader.

The payoff was the headline of the InstructGPT paper: labelers preferred the 1.3B-parameter InstructGPT over the 175B GPT-3, "despite having 100x fewer parameters." Behavior, not knowledge, was what people were missing.

The catch is Goodhart's law with a training budget. The grader is a _proxy_ for what people want, and [Gao et al.](https://arxiv.org/abs/2210.10760) measured what happens when you push on it: the proxy score keeps climbing while the true score stalls and then degrades — "optimizing its value too much can hinder ground truth performance." Every grader-design lesson I've collected elsewhere on the blog applies here: a judge answers _which of these two is better_ far more reliably than a zero-to-ten scale ([/ai-testing](/ai-testing#wrinkle---no-known-answer)), and a grade that adds up several parts has to be read part by part or the terms that saturated early keep drawing budget ([/hill-climbing](/hill-climbing#your-other-job-build-evals)).

- **Optimizes:** the grader's score — a learned proxy for "what people prefer".
- **Data:** A-vs-B (or ranked) human preferences over the model's own outputs, plus an SFT model to start from.
- **Reach for it when:** you want helpfulness, tone, or safety beyond what demos can teach, and the target is a matter of taste rather than correctness.
- **Watch-out:** a proxy the model will game. Gaming the grader (reward hacking, over-optimization) is the default outcome, not the exception.

{% include post-training-anim.html name="rlhf" caption="Taste test by people: a person picks A, the grader's meter learns the taste, and the model leans toward A — on a leash to where it started." %}

<a id="rlaif-and-constitutional-ai-when-the-judge-is-a-model"></a>

### Taste test by an AI with a rulebook (RLAIF, Constitutional AI)

{% include local_image_float_right.html src="raccoon-post-training-rulebook.webp" %}

Human rankings are the expensive part of the taste test. [Constitutional AI](https://arxiv.org/abs/2212.08073) replaced them with a model and a short list of written principles — the "constitution", the only human oversight in the loop. Two phases: first the model critiques and revises its own answers against those principles and is further trained on the revisions (copy the expert, where the expert is the model's own corrected draft); then a model, not a person, judges A-vs-B pairs, a grader is trained on those AI preferences, and the RL loop runs against it. Anthropic called that second phase RL from AI Feedback, and [a later Google study](https://arxiv.org/abs/2309.00267) found RLAIF "achieves comparable performance to RLHF" on summarization and dialogue.

An AI judge is also what's left when the target can't be checked at all. To teach a language model to paint by writing p5.brush JavaScript, [Surya Narreddi hand-rated 1,664 generated images down to a 581-picture reference pool](https://surya.website/rling-qwen-to-paint-with-code) and made the grade "did the judge prefer this render to two pulled from that pool" — with no test to pass, the grader _is_ the design work, and [a badly built one plateaus while the score keeps climbing](/hill-climbing#your-other-job-build-evals).

- **Optimizes:** whatever the judge model prefers, steered by the principles you wrote.
- **Data:** a rulebook and prompts; the judge generates the preferences.
- **Reach for it when:** you need preference data at a scale people can't label, or the target is taste with no checker.
- **Watch-out:** the judge's blind spots become the model's, and a judge can be gamed just like a grader trained on people's picks.

{% include post-training-anim.html name="rlaif" caption="Taste test by an AI: the human judge is swapped for a model holding the rulebook; the loop is otherwise the same." %}

<a id="rlvr-let-a-checker-grade-it"></a>

### Answer key (RLVR)

{% include local_image_float_right.html src="raccoon-post-training-rlvr.webp" %}

If the answer can be checked — a math result, a unit test, an instruction with a testable constraint, a task that either got done or didn't — you need neither people nor a grader model. [RLVR](https://arxiv.org/abs/2411.15124) (the name is from Tülu 3) grades against the answer key: "only provide rewards when the model's generations are verified to be correct." Tülu 3 pointed it at grade-school math, competition math, and instruction-following with checkable constraints.

[DeepSeek-R1](https://arxiv.org/abs/2501.12948) showed how far an answer key goes. R1-Zero skipped SFT entirely — "we bypass the conventional supervised fine-tuning (SFT) phase before RL training" — and ran RL on a base model with two rule-based grades, accuracy and format. Reasoning behavior came out of the grade alone: the model started re-checking its own work, and the paper's "aha moment" is the training step where it began saying "wait" and revisiting its approach without anyone having shown it that. It also came out barely readable and mixing English and Chinese mid-thought, which is why the shipped R1 adds a small cold-start SFT stage and a language-consistency grade before the RL. The same engine, pointed at software, is how coding agents are trained; that loop, and how it gets gamed, is in the [parent post](/ai-training#post-training-for-coding-competence).

- **Optimizes:** the rate at which answers pass the checker.
- **Data:** prompts that come with a verifier — math with known answers, code with tests, instructions with checkable constraints. No human labels at training time.
- **Reach for it when:** correctness is checkable: reasoning, math, code, agentic tasks.
- **Watch-out:** only works where answers are checkable, and the checker becomes the target — the model will special-case the test, hard-code the expected output, or `pip install` its way around the real fix if it can.

{% include post-training-anim.html name="rlvr" caption="Answer key: every try is checked; only the ✓ tries strengthen the model, the ✗ tries fade." %}

## How does the model learn from the grade?

A grade is a number. Turning it into a weight update means answering one question for every try: **was this answer better or worse than what the model usually does on this prompt, and by how much — is it worth moving the model for?** The two RL answers differ only in how they know "usually": PPO keeps a forecaster, GRPO grades on a curve. DPO sidesteps the question by working from pairs.

<a id="coach-with-a-scorekeeper-ppo"></a>

### Coach with a forecaster (PPO)

{% include local_image_float_right.html src="raccoon-post-training-scorekeeper.webp" %}

The classic RL loop, the one [InstructGPT](https://arxiv.org/abs/2203.02155) used. The model (RL calls it the **policy**: whatever picks the next action — here, the model being trained) writes an answer and the grader scores it — but a raw score isn't enough, because a 7 means different things on an easy prompt and a hard one. So the loop keeps a **forecaster**: a second network that predicts the grade each answer will probably get. The jargon is _critic_, or _value model_, from actor-critic RL: the actor acts, the critic estimates how well things will go from here. It forecasts; it doesn't criticize, and it never hands out a grade. The learning signal is the **surprise** (advantage): the grade you got minus the grade you expected. Positive, do more of that; negative, do less; near zero, barely move. A C student bringing home a B is good news; the same B from a straight-A student is bad news. PPO is the coach: a small-steps rule (clipping) caps each update so the model doesn't lurch. And there's a **leash** (a KL penalty, charged per word piece): it measures how far the model has drifted from a frozen copy of its starting point — the leash copy (reference model) — and charges for the distance, "to mitigate overoptimization of the reward model" — without it the model drifts into whatever nonsense the grader happens to like.

Worked, with grades out of 10:

- **Easy prompt, "What's 17 + 25?"** The forecaster expects a 9. "42" gets a 10: surprise +1, a small nudge. "43" gets a 1: surprise −8, a big push away.
- **Hard prompt, "Prove there are infinitely many primes."** The forecaster expects a 3. A decent proof gets a 6: surprise +3, a strong push up.

A 6 on a hard prompt teaches more than a 10 on an easy one. That is the whole reason the forecaster exists.

What moves and what's frozen while PPO runs:

| Piece                          | During training | What it is                                                                                                                                                                                                                                                    |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The model** (the policy)     | changes         | The point of the exercise.                                                                                                                                                                                                                                    |
| **The forecaster** (critic)    | changes         | Starts as a copy of the grader — InstructGPT: "the value function is initialized from the RM" — but answers a different question: the final grade, predicted from the prompt and a partial answer. It has to keep learning because the model keeps improving. |
| **The grader** (reward model)  | frozen          | Trained earlier, from people's A-vs-B picks.                                                                                                                                                                                                                  |
| **The leash copy** (reference) | frozen          | The model as it was at the start; the leash measures drift from it.                                                                                                                                                                                           |

All three helpers are scaffolding, thrown away after training. Only the model ships.

- **Optimizes:** the surprise — grade minus forecast — with a leash back to the starting model.
- **Needs:** four models in memory — the model, its leash copy, the grader, the forecaster. GRPO drops the forecaster: three. GRPO with an answer key, where the grader isn't a model: two.
- **Reach for it when:** you have a score for every answer and the budget to run the full loop.
- **Watch-out:** the heaviest pipeline of the three, and the most knobs to tune.

<a id="grpo-the-optimizer-that-made-rlvr-cheap"></a>

### Grade on a curve against its own tries (GRPO)

{% include local_image_float_right.html src="raccoon-post-training-curve.webp" %}

[GRPO](https://arxiv.org/abs/2402.03300) (DeepSeekMath) fires the forecaster. Generate a group of tries (sampling) at the same prompt, score each with the grader, and use the group's average as the prediction — grading on a curve is the forecaster replaced by the group's own mean, so a try's surprise is just how much better it did than its siblings. "GRPO foregoes the critic model, instead estimating the baseline from group scores, significantly reducing training resources" — no forecaster, and the expected grade (baseline) comes from the group. No forecaster to train or hold in memory is what let R1-Zero run pure RL on a base model at all. On the hard prompt above: eight tries score 2, 3, 3, 4, 2, 6, 3, 1 — average 3 — so the 6 gets a surprise of +3 and the 1 gets −2. Same lesson, no forecaster. It's a way of learning, not a way of grading: the score can come from an answer key or from a grader model.

- **Optimizes:** the same grade as PPO, with the group's average standing in for the forecaster.
- **Needs:** several tries per prompt, plus the grader's score for each. Nothing else.
- **Reach for it when:** you can't afford, or don't want to tune, a forecaster — the default for reasoning RL today.
- **Watch-out:** its normalization terms bias it. Dividing each try's error score (loss) by its length penalizes long wrong answers less, so wrong answers get longer; dividing by the group's grade spread over-weights the easiest and hardest prompts. [Dr. GRPO](https://arxiv.org/abs/2503.20783) removes both terms. [DAPO](https://arxiv.org/abs/2503.14476) loosens the small-steps rule on the upside (clip-higher) so the model keeps its variety (entropy) instead of collapsing, skips prompts where every try scored the same (no direction to nudge — zero gradient), averages the error score per word piece rather than per answer, and penalizes over-long answers softly instead of as failures.

{% include post-training-anim.html name="grpo" caption="Grade on a curve: eight tries at one prompt, the group average is the bar — above it grows, below it shrinks." %}

<a id="dpo-the-same-preferences-no-rl-loop"></a>

<a id="straight-to-a-over-b-no-scorekeeper-dpo"></a>

### Straight to A-over-B: no grader model, no forecaster (DPO)

{% include local_image_float_right.html src="raccoon-post-training-dpo.webp" %}

[DPO](https://arxiv.org/abs/2305.18290) noticed that for a taste test the whole loop was a detour. RLHF's goal (objective) — maximize the grade while staying leashed to the starting copy — has a best possible model you can write down as a direct formula (closed form), and if you substitute that back in, the grader becomes a function of the model itself: "your language model is secretly a reward model." So you never train a grader model or a forecaster. You take the same A-vs-B pairs and train the model with a plain classification-style error score that pushes the preferred answer's probability up, relative to the leash copy, and the rejected answer's down. Two models in memory instead of four, no generate-and-grade loop, no PPO to babysit — and most of RLHF's benefit. That's why it's the default preference step in open recipes like Tülu 3.

- **Optimizes:** the same goal as RLHF, solved by direct formula; one dial (β) says how far from the leash copy it may wander.
- **Needs:** A-vs-B pairs (from people or an AI judge), plus the leash copy — a frozen copy of the starting model.
- **Reach for it when:** you have pairs and don't want to run an RL pipeline.
- **Watch-out:** it learns from a fixed set of pairs somebody wrote down, while the RL loops score the model's own fresh tries — so DPO is bounded by its data and can't shape a grade beyond what the pairs already express. And it needs pairs: an answer key gives a score, not a pair, which is why the DPO cell of the answer-key row is empty.

{% include post-training-anim.html name="dpo" caption="Straight to A-over-B: a seesaw, preferred answer up and rejected answer down — no meter anywhere." %}

<a id="how-the-weights-actually-change-lora"></a>

### Clip-on adapter (LoRA)

{% include local_image_float_right.html src="raccoon-post-training-adapter.webp" %}

Whichever row and column, you rarely retrain every weight. **LoRA** ([Low-Rank Adaptation](https://arxiv.org/abs/2106.09685)) freezes the model and trains a small low-rank matrix bolted alongside each layer — clip a narrow module onto the model and only tune that. On GPT-3 175B it cut trainable parameters 10,000× and GPU memory 3× with no loss in quality, and the base model's knowledge stays intact because you never touched it. Hands-on: [LoRA on Llama 3](https://colab.research.google.com/drive/1efOx_rwZeF3i0YsirhM1xhYLtGNX6Fv3?usp=sharing#scrollTo=bDp0zNpwe6U_) and [Fine-Tune Your Own Llama 2 Model in a Colab Notebook](https://mlabonne.github.io/blog/posts/Fine_Tune_Your_Own_Llama_2_Model_in_a_Colab_Notebook.html), the walkthrough I'd start with.

<a id="how-the-methods-combine-real-recipes"></a>

## Recipes in plain words

Nobody ships one cell of the grid. The published recipes are a sequence of cells, and the differences are which ones get skipped:

| Recipe                                                 | In plain words                                                                    | Stages                                                                                                                                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [InstructGPT](https://arxiv.org/abs/2203.02155) (2022) | Copy the expert, then a taste test with a coach                                   | SFT → train the grader → PPO. 1.3B beat 175B on preference                                                                                                                                                 |
| [Constitutional AI](https://arxiv.org/abs/2212.08073)  | Copy your own corrected drafts, then an AI taste test with a rulebook and a coach | critique-and-revise SFT → AI preferences → train the grader → RL                                                                                                                                           |
| [Tülu 3](https://arxiv.org/abs/2411.15124) (2024)      | Copy the expert, then A-over-B, then an answer key                                | SFT → DPO → RLVR. The open reference recipe                                                                                                                                                                |
| [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025) | An answer key, graded on a curve — with a little copying before and after         | cold-start SFT → GRPO on rule-based grades + language consistency → SFT on its own best tries (rejection sampling) → GRPO on rule-based + grader-model grades. R1-Zero proved the RL alone finds reasoning |

The pattern across all of them: copy the expert to get into the neighborhood, a taste test to polish, an answer key wherever you can build one, and then copy _again_ to fold what RL discovered back into a clean model.

<a id="methods-at-a-glance"></a>

## Methods at a glance

| Method    | Who grades                              | How it learns                                        | Best for                                                       | Watch-out                                       |
| --------- | --------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| **SFT**   | Copy the expert's answers               | Imitation — no grade                                 | The first shift: answer instead of autocomplete, hold a format | Can't exceed the demos or learn what not to do  |
| **RLHF**  | Taste test by people → grader           | Coach + forecaster (PPO), usually                    | Helpfulness, tone, safety beyond what demos teach              | Heavy pipeline; gaming the grader               |
| **RLAIF** | Taste test by an AI with a rulebook     | Same loops as RLHF                                   | RLHF at scale, or when nothing is checkable                    | The judge's blind spots become the model's      |
| **DPO**   | A-vs-B pairs (people or AI)             | Straight to A-over-B; no grader model, no forecaster | RLHF's benefit without the RL loop                             | Bounded by the pairs                            |
| **RLVR**  | Answer key: tests, math grader, sandbox | PPO or GRPO                                          | Reasoning and coding agents, anything checkable                | Only where checkable; gaming the test           |
| **GRPO**  | Any score (answer key or grader model)  | Grade on a curve against its own tries               | Reasoning RL on a budget; the usual RLVR optimizer             | Length bias (Dr. GRPO), variety collapse (DAPO) |
| **LoRA**  | —                                       | Clip-on adapter; the big model stays frozen          | Making any of the above cheap                                  | A small adapter can't carry a big change        |

## What this post is not about

- **Pre-training and deployment** — the whole pipeline, plus the post-training vs RAG vs harness decision and the coding-competence loop, is [/ai-training](/ai-training). Serving is [/ai-inference](/ai-inference).
- **Building the evals** — post-training is only as good as its grader, and the grader is an eval. How to build one that measures what you meant is [/hill-climbing](/hill-climbing#your-other-job-build-evals) and [/ai-testing](/ai-testing).
- **The actual math** — I'm staying at the mental-model level on purpose. For the deep version, start with the [seminal papers](/ai-paper) and the linked papers above.

## Jargon decoder

The papers use their own words. This is the map back, so the post reads plain and the papers still make sense.

| In this post                       | In the papers                          |
| ---------------------------------- | -------------------------------------- |
| the model                          | policy                                 |
| the grader                         | reward model (RM)                      |
| the forecaster                     | value model, critic                    |
| the leash copy                     | reference model                        |
| the leash — how far it has drifted | KL penalty, KL divergence              |
| surprise                           | advantage                              |
| expected grade                     | baseline                               |
| small-steps rule                   | PPO clipping                           |
| a try                              | a sample; generating tries is sampling |
| error score                        | loss                                   |
| goal                               | objective                              |
| word piece                         | token                                  |
| probability                        | likelihood                             |
| which way to nudge                 | gradient                               |
| variety                            | entropy                                |
| gaming the grader                  | reward hacking, over-optimization      |
| a direct formula                   | closed form                            |
| teacher-student copying            | distillation                           |
| further training                   | fine-tuning                            |

{% include post-training-anim-assets.html %}

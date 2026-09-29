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

Pre-training is where a model reads the internet, and it's where the money goes. But the model you actually talk to was made afterwards, in post-training — the comparatively cheap stage that turns a text-autocompleter into an assistant. The first version of this post listed the methods one after another and I couldn't hold them in my head: too many acronyms, each explained on its own. This is the rewrite, built on three plain questions every method answers — who grades the answer, how the model knows what it usually gets, and which weights move. Jargon goes in parentheses, once, with a [decoder at the end](#jargon-decoder) for when you read the papers.

{% include alert.html content="Everything here is public information and my own opinions. There's no secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The one intuition](#the-one-intuition)
- [Three questions explain every method](#three-questions-explain-every-method)
- [Who grades the answer?](#who-grades-the-answer)
  - [Copy the expert (SFT)](#copy-the-expert-sft)
  - [Taste test by people (RLHF)](#taste-test-by-people-rlhf)
  - [Taste test by an AI with a rulebook (RLAIF, Constitutional AI)](#taste-test-by-an-ai-with-a-rulebook-rlaif-constitutional-ai)
  - [Answer key (RLVR)](#answer-key-rlvr)
- [How does it know what's usual?](#how-does-it-know-whats-usual)
  - [Why the grade alone isn't enough](#why-the-grade-alone-isnt-enough)
  - [Coach with a forecaster (PPO)](#coach-with-a-forecaster-ppo)
  - [Grade on a curve against its own tries (GRPO)](#grade-on-a-curve-against-its-own-tries-grpo)
  - [Straight to A-over-B: no grader model, no forecaster (DPO)](#straight-to-a-over-b-no-grader-model-no-forecaster-dpo)
  - [Clip-on adapter (LoRA)](#clip-on-adapter-lora)
- [Recipes in plain words](#recipes-in-plain-words)
- [What this post is not about](#what-this-post-is-not-about)
- [Jargon decoder](#jargon-decoder)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The one intuition

**Pre-training installs knowledge; post-training shapes behavior.** A base model has read the internet but isn't an assistant — ask it a question and it autocompletes ten more questions. Post-training teaches it little that's new; it changes what the model _does_ with what it knows. That's why it's cheap next to pre-training (though reasoning RL is closing the gap), and why most of a chat model's personality comes from it. Where it sits in the pipeline is in the parent post:

{% include summarize-page.html src="/ai-training" %}

<a id="the-lineage"></a>
<a id="methods-at-a-glance"></a>
<a id="two-questions-explain-every-method"></a>

## Three questions explain every method

{% include local_image_float_right.html src="raccoon-post-training-lineage.webp" %}

Every method after the first takes an answer from the model, grades it, and nudges the weights. Three things to ask of any of them:

1. **Who grades the answer?** Nobody — the model copies an expert's answers (SFT), step one of every recipe. Otherwise: people (RLHF), an AI with a rulebook (RLAIF), or an answer key (RLVR).
2. **How does it know what's usual?** A grade alone can't move the weights, because the same grade means opposite things on different prompts: a C on a hard proof is good news, a C on "What's 17 + 25?" is bad news. What moves the weights is the **surprise** — the grade minus what the model usually gets on that prompt — and the methods differ in how they know "usually": a forecaster predicts it (PPO), the average of a group of tries stands in for it (GRPO), or you skip the question by learning straight from A-over-B pairs (DPO).
3. **Which weights move?** All of them, in every recipe named here. On one GPU, a clip-on adapter (LoRA) moves a few instead.

Copy the expert has no grade, so no column. Every other method is a cell:

| Who grades ↓ · How it knows what's usual →      | Forecaster (PPO)                                                 | Group average (GRPO)                            | Not needed: pairs (DPO)                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| **Taste test by people** (RLHF)                 | classic RLHF — [InstructGPT](https://arxiv.org/abs/2203.02155)   | works too: GRPO takes any score                 | [Llama 3](https://arxiv.org/abs/2407.21783)'s preference step                  |
| **Taste test by an AI with a rulebook** (RLAIF) | [Constitutional AI](https://arxiv.org/abs/2212.08073)'s RL phase | works too                                       | [Tülu 3](https://arxiv.org/abs/2411.15124)'s preference step                   |
| **Answer key** (RLVR)                           | [Tülu 3](https://arxiv.org/abs/2411.15124)'s RLVR                | [DeepSeek-R1](https://arxiv.org/abs/2501.12948) | pair a ✓ try with an ✗ try — [Iterative RPO](https://arxiv.org/abs/2404.19733) |

Row and column are independent — the thing I kept getting wrong. **RLVR and GRPO are not either/or**: RLVR says where the score comes from, GRPO says how the score becomes a nudge, and GRPO takes a grader model's score just as happily. The named recipes are paths through this grid, [spelled out below](#recipes-in-plain-words).

## Who grades the answer?

<a id="sft-imitate-good-answers"></a>

### Copy the expert (SFT)

{% include local_image_float_right.html src="raccoon-post-training-sft.webp" %}

No grade, just an answer sheet. Supervised fine-tuning is further training of exactly the kind pre-training does — predict the next word piece (token) — pointed at curated (prompt → ideal answer) pairs instead of the internet, so the model gives the demonstrated answers a higher probability (likelihood). Nothing about the goal (objective) changes, only the data, and that is enough: for [InstructGPT](https://arxiv.org/abs/2203.02155), OpenAI's labelers wrote about 13k demonstrations, and GPT-3 learned to answer instead of autocomplete, in whatever format the demos hold.

The expert needn't be a person. Stanford's [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html) further trained LLaMA 7B on 52K demonstrations written by OpenAI's text-davinci-003, and [DeepSeek-R1](https://arxiv.org/abs/2501.12948) was copied the same way — teacher-student copying (distillation) — into smaller models that beat the instruction-tuned versions they started from. Every "reasoning traces" dataset is a big model's homework copied by a small one.

Copying can only copy: it never exceeds the demos or learns what _not_ to do, and a handful of examples teaches style, not knowledge — then hallucinates the gaps.

{% include post-training-anim.html name="sft" caption="Copy the expert: the model's answer is pulled onto the teacher's, and the error score shrinks." %}

<a id="rlhf-learn-the-taste-from-rankings"></a>

### Taste test by people (RLHF)

{% include local_image_float_right.html src="raccoon-post-training-rlhf.webp" %}

People find it far easier to say which of two answers is better than to write the ideal one. So RLHF shows labelers several answers to one prompt and has them rank them, then writes the taste down as a **grader** (reward model): a second, smaller language model (InstructGPT used a 6B one) with its last layer swapped for a single-number output, trained on 33k prompts' worth of comparisons to score a prompt and its answer. It can score millions of answers nobody will ever read. The pipeline in one line: people's picks → train the grader → [an RL loop](#coach-with-a-forecaster-ppo) scores thousands of fresh answers with it, holding the model on a **leash** — a penalty for drifting from where it started — so it can't wander into whatever the grader mistakenly likes. DPO, below, skips the grader.

The payoff was the headline of the InstructGPT paper: labelers preferred the 1.3B-parameter InstructGPT over the 175B GPT-3, "despite having 100x fewer parameters." Behavior, not knowledge, was what people were missing.

The catch is Goodhart's law with a training budget. The grader is a _proxy_ for what people want, and [Gao et al.](https://arxiv.org/abs/2210.10760) measured what happens when you push on it: the proxy score keeps climbing while the true score stalls, then falls — "optimizing its value too much can hinder ground truth performance." Gaming the grader (reward hacking, over-optimization) is the default outcome, not the exception. The grader-design lessons elsewhere on the blog apply: a judge answers _which of these two is better_ far more reliably than a zero-to-ten scale ([/ai-testing](/ai-testing#wrinkle---no-known-answer)), and a grade that adds up several parts has to be read part by part ([/hill-climbing](/hill-climbing#your-other-job-build-evals)).

{% include post-training-anim.html name="rlhf" caption="Taste test by people: a person picks A, the grader's meter learns the taste, and the model leans toward A — on a leash to where it started." %}

<a id="rlaif-and-constitutional-ai-when-the-judge-is-a-model"></a>

### Taste test by an AI with a rulebook (RLAIF, Constitutional AI)

{% include local_image_float_right.html src="raccoon-post-training-rulebook.webp" %}

Human rankings are the expensive part. [Constitutional AI](https://arxiv.org/abs/2212.08073) kept human labels for helpfulness but replaced the harmlessness rankings with a model and a short list of written principles — the "constitution", the only human oversight on that side. Two phases: the model critiques and revises its own answers against the principles and is further trained on the revisions (copy the expert, where the expert is its own corrected draft); then a model, not a person, judges A-vs-B pairs, a grader is trained on those AI preferences, and the RL loop runs against it. Anthropic called the second phase RL from AI Feedback, and [a later Google study](https://arxiv.org/abs/2309.00267) found RLAIF "achieves comparable performance to RLHF" on summarization and dialogue.

An AI judge is also what's left when nothing can be checked. To teach a model to paint by writing p5.brush code, [Surya Narreddi hand-rated 1,664 generated images into a reference pool](https://surya.website/rling-qwen-to-paint-with-code) and made the grade "did the judge prefer this render to two pulled from the pool". With no test to pass, the grader _is_ the design work: [build it badly and the score keeps climbing while the pictures stop improving](/hill-climbing#your-other-job-build-evals). The judge's blind spots become the model's, and a judge can be gamed like any grader.

{% include post-training-anim.html name="rlaif" caption="Taste test by an AI: the human judge is swapped for a model holding the rulebook; the loop is otherwise the same." %}

<a id="rlvr-let-a-checker-grade-it"></a>

### Answer key (RLVR)

{% include local_image_float_right.html src="raccoon-post-training-rlvr.webp" %}

If the answer can be checked — a math result, a unit test, a task that either got done or didn't — you need neither people nor a grader model, and the grade is just pass or fail. [RLVR](https://arxiv.org/abs/2411.15124) (the name is from Tülu 3) grades against the answer key: "only provide rewards when the model's generations are verified to be correct." Tülu 3 pointed it at grade-school math, competition math, and instruction-following with checkable constraints, and learned from it with PPO, its forecaster started from a grader model.

[DeepSeek-R1](https://arxiv.org/abs/2501.12948) showed how far an answer key goes. R1-Zero skipped SFT entirely — "we bypass the conventional supervised fine-tuning (SFT) phase before RL training" — and ran RL on a base model with two rule-based grades, accuracy and format. Reasoning came out of the grade alone: the model started re-checking its own work, and the paper's "aha moment" is the step where it began saying "wait" and revisiting its approach, unprompted. It also came out barely readable, mixing English and Chinese mid-thought, so the shipped R1 adds a small cold-start SFT stage and a language-consistency grade. The same engine, pointed at software, trains coding agents; that loop, and how it gets gamed, is in the [parent post](/ai-training#post-training-for-coding-competence). The checker becomes the target: the model will special-case the test, hard-code the expected output, or `pip install` its way around the real fix if it can.

{% include post-training-anim.html name="rlvr" caption="Answer key: every try is checked; ✓ tries are pushed up and ✗ tries pushed down, each by how far it sits from usual." %}

<a id="how-does-the-model-learn-from-the-grade"></a>

## How does it know what's usual?

### Why the grade alone isn't enough

Learning needs a direction and a size: toward this answer or away, and how far. A raw grade gives neither reliably: the same grade means opposite things on different prompts, and most of what a grade carries is shared by every try at that prompt — easy prompts hand out A's for free — so the differences between tries, the only part with signal, drown in the shared offset. Push on raw grades and easy prompts dominate while nearly everything gets pushed up by slightly different amounts: slow, noisy learning.

Subtract what the model usually gets on that prompt and what's left is the **surprise** (advantage): how many grade steps better or worse than expected. Its sign is the direction, its size is how far. A C student bringing home a B is good news; the same B from a straight-A student is bad news. In letter grades — a grader really outputs a number and an answer key just pass/fail; letters keep the grades apart from the math answers:

| Prompt · answer                         | Usual | Grade | Surprise                     |
| --------------------------------------- | ----- | ----- | ---------------------------- |
| 17 + 25 · "42"                          | A−    | A     | one step up — a small nudge  |
| 17 + 25 · "43"                          | A−    | F     | far below — a big push away  |
| infinitely many primes · a decent proof | D     | B     | two steps up — a strong push |

A B on a hard prompt teaches more than an A on an easy one. Now, how each method gets "usually".

<a id="coach-with-a-scorekeeper-ppo"></a>

### Coach with a forecaster (PPO)

{% include local_image_float_right.html src="raccoon-post-training-scorekeeper.webp" %}

PPO is the update rule [InstructGPT](https://arxiv.org/abs/2203.02155) used: take the surprise on each answer and move the weights by it, in small capped steps (clipping). Three pieces sit around the model (RL calls the model the **policy**: whatever picks the next action). The **grader** scores each answer. The **forecaster** supplies "usually": a second network that predicts the grade an answer will probably get. The jargon is _critic_ or _value model_, from actor-critic RL: the actor acts, the critic estimates how well things will go from here. It forecasts, it doesn't criticize, and never hands out a grade. And the **leash copy** (reference model), a frozen copy of the starting model: the leash is a penalty (KL, charged per word piece) on how far the model has drifted from it, "to mitigate overoptimization of the reward model" — without it the model drifts into whatever nonsense the grader happens to like.

What moves and what's frozen while it runs:

| Piece                          | During training | What it is                                                                                                                                                                                                             |
| ------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The model** (the policy)     | changes         | The point of the exercise.                                                                                                                                                                                             |
| **The forecaster** (critic)    | changes         | Starts as a copy of the grader (InstructGPT: "the value function is initialized from the RM") but predicts the final grade from the prompt and a partial answer, and keeps learning because the model keeps improving. |
| **The grader** (reward model)  | frozen          | Trained earlier, from people's A-vs-B picks.                                                                                                                                                                           |
| **The leash copy** (reference) | frozen          | The model as it was at the start; the leash measures drift from it.                                                                                                                                                    |

Only the model ships. But all four sit in memory while it runs, and PPO has the most knobs to tune — the cost the next two methods cut.

<a id="grpo-the-optimizer-that-made-rlvr-cheap"></a>

### Grade on a curve against its own tries (GRPO)

{% include local_image_float_right.html src="raccoon-post-training-curve.webp" %}

[GRPO](https://arxiv.org/abs/2402.03300) (DeepSeekMath) keeps PPO's small steps and leash and fires only the forecaster. Generate a group of tries (sampling) at one prompt, score each with the grader, and use the group's average as "usually": "GRPO foregoes the critic model, instead estimating the baseline from group scores, significantly reducing training resources." On the primes proof, eight tries score F, D, D, C, F, B, D, F — average D — so the B sits two steps above the curve and gets a strong push up, and each F sits one step below and gets pushed away. Same lesson, no forecaster: three models in memory, or two when the grader is an answer key rather than a model. That made pure RL on a base model affordable — R1-Zero — and it's the default for reasoning RL today.

Two details bias it; the follow-up papers are fixes. GRPO divides each try's error score (loss) by the try's length, which penalizes long wrong answers less, so wrong answers get longer; and it divides each surprise by the group's grade spread, which over-weights the prompts where every try scored nearly the same — the easiest and the hardest. [Dr. GRPO](https://arxiv.org/abs/2503.20783) removes both divisions. [DAPO](https://arxiv.org/abs/2503.14476) loosens the small-steps rule on the upside (clip-higher) so the model keeps its variety (entropy), skips prompts where every try scored the same (no direction to nudge — zero gradient), averages the error score per word piece rather than per answer, and penalizes over-long answers softly.

{% include post-training-anim.html name="grpo" caption="Grade on a curve: eight tries at one prompt — F, D, D, C, F, B, D, F — and the group average, D, is the bar. Above it grows, below it shrinks." %}

<a id="dpo-the-same-preferences-no-rl-loop"></a>

<a id="straight-to-a-over-b-no-scorekeeper-dpo"></a>

### Straight to A-over-B: no grader model, no forecaster (DPO)

{% include local_image_float_right.html src="raccoon-post-training-dpo.webp" %}

[DPO](https://arxiv.org/abs/2305.18290) noticed that for a taste test the whole loop is a detour. RLHF's goal (objective) — maximize the grade while staying leashed to the starting copy — has a best possible model you can write down as a direct formula (closed form), and substituting it back turns the grader into a function of the model itself: "your language model is secretly a reward model." So you train no grader and no forecaster, and never ask what's usual. Take the A-vs-B pairs and train the model with a plain classification-style error score that pushes the preferred answer's probability up, relative to the leash copy, and the rejected answer's down; one dial (β) sets how far it may wander. Two models in memory, no generate-and-grade loop, no PPO to babysit — and most of RLHF's benefit, which is why Llama 3 and Tülu 3 both use it for their preference step.

The limit: DPO can never learn anything the pairs don't already say, while an RL loop keeps scoring new tries. Pairs are all it needs, though — an answer key makes them too, by pairing a ✓ try with an ✗ try to the same prompt ([Iterative RPO](https://arxiv.org/abs/2404.19733)).

{% include post-training-anim.html name="dpo" caption="Straight to A-over-B: a seesaw, preferred answer up and rejected answer down — no meter anywhere." %}

<a id="how-the-weights-actually-change-lora"></a>

### Clip-on adapter (LoRA)

{% include local_image_float_right.html src="raccoon-post-training-adapter.webp" %}

Every recipe above moved all the weights; labs can afford that. On one GPU you can't, and **LoRA** ([Low-Rank Adaptation](https://arxiv.org/abs/2106.09685)) is the fix: freeze the model and train a small add-on beside each layer — low-rank meaning the add-on is two thin matrices standing in for one big one, so it has few numbers to learn — then keep only the add-on. On GPT-3 175B it cut trainable parameters 10,000× and GPU memory 3× with no loss in quality; the base model's knowledge stays intact because you never touched it, and the catch is that a small adapter can't carry a big change. Hands-on: [LoRA on Llama 3](https://colab.research.google.com/drive/1efOx_rwZeF3i0YsirhM1xhYLtGNX6Fv3?usp=sharing#scrollTo=bDp0zNpwe6U_) and [Fine-Tune Your Own Llama 2 Model in a Colab Notebook](https://mlabonne.github.io/blog/posts/Fine_Tune_Your_Own_Llama_2_Model_in_a_Colab_Notebook.html).

<a id="how-the-methods-combine-real-recipes"></a>

## Recipes in plain words

Nobody ships one cell. The published recipes are sequences of cells; the difference is which get skipped:

| Recipe                                                 | In plain words                                                            | Stages                                                                                                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [InstructGPT](https://arxiv.org/abs/2203.02155) (2022) | Copy the expert, then a taste test with a forecaster                      | SFT → train the grader → PPO. 1.3B beat 175B on preference                                                                                                                                                 |
| [Constitutional AI](https://arxiv.org/abs/2212.08073)  | Copy your own corrected drafts, then an AI taste test with a rulebook     | critique-and-revise SFT → AI preferences → train the grader → RL                                                                                                                                           |
| [Tülu 3](https://arxiv.org/abs/2411.15124) (2024)      | Copy the expert, then A-over-B judged by an AI, then an answer key        | SFT → DPO on GPT-4o-judged pairs → RLVR with PPO. The open reference recipe                                                                                                                                |
| [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025) | An answer key, graded on a curve — with a little copying before and after | cold-start SFT → GRPO on rule-based grades + language consistency → SFT on its own best tries (rejection sampling) → GRPO on rule-based + grader-model grades. R1-Zero proved the RL alone finds reasoning |

Take the union of the four and you get the modern recipe: copy the expert to get into the neighborhood, a taste test to polish, an answer key wherever you can build one, and then copy _again_ to fold what RL discovered back into a clean model.

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
| a small add-on (two thin matrices) | low-rank adapter                       |

{% include post-training-anim-assets.html %}

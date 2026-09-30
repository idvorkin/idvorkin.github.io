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

Pre-training is where a model reads the internet, and it's where the money goes. But the model you actually talk to was made afterwards, in post-training — the comparatively cheap stage that turns a text-autocompleter into an assistant. The first version of this post listed the methods one after another and I couldn't hold them in my head: too many acronyms, each explained on its own. This is the rewrite, built on two plain questions every method answers — who grades the answer, and what the model should change based on one try. Jargon goes in parentheses, once, with a [decoder at the end](#jargon-decoder) that maps the plain words back to the papers' terms; who did the science sits in a collapsed Prior work fold at the end of each section.

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
- [What should the model change, based on this one try?](#what-should-the-model-change-based-on-this-one-try)
  - [Why the grade alone isn't enough](#why-the-grade-alone-isnt-enough)
  - [Coach with a forecaster (PPO)](#coach-with-a-forecaster-ppo)
  - [Grade on a curve against its own tries (GRPO)](#grade-on-a-curve-against-its-own-tries-grpo)
  - [Straight to A-over-B: no grader model, no forecaster (DPO)](#straight-to-a-over-b-no-grader-model-no-forecaster-dpo)
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
<a id="three-questions-explain-every-method"></a>

## Two questions explain every method

{% include local_image_float_right.html src="raccoon-post-training-lineage.webp" %}

Every method after the first takes an answer from the model, grades it, and nudges the weights. Two things to ask of any of them:

1. **Who grades the answer?** Nobody — the model copies an expert's answers (SFT), step one of every recipe. Otherwise: people (RLHF), an AI with a rulebook (RLAIF), or an answer key (RLVR).
2. **What should the model change, based on this one try?** A try is one noisy trial — the model could have written a hundred other answers — so the only fair adjustment is by how much this try beat or missed what the model usually does there. That is the **surprise**: the grade minus the usual grade; a C student bringing home a B is good news, the same B from a straight-A student bad news. So the derived question is _what's usual?_, and the methods differ in how they answer it: a forecaster predicts it (PPO), the average of a group of tries stands in for it (GRPO), or it's never needed because you learn straight from A-over-B pairs (DPO).

Which weights move — all of them, in every recipe here, or a clip-on adapter when you're on one GPU — is [its own post](/beyond-prompts). Copy the expert has no grade, so no column. Every other method is a cell:

| Who grades ↓ · What's usual →                   | Forecaster (PPO)             | Group average (GRPO)                             | Not needed: pairs (DPO)                    |
| ----------------------------------------------- | ---------------------------- | ------------------------------------------------ | ------------------------------------------ |
| **Taste test by people** (RLHF)                 | classic RLHF (InstructGPT)   | works too: the last stage of recent open recipes | Llama 3's preference step                  |
| **Taste test by an AI with a rulebook** (RLAIF) | Constitutional AI's RL phase | works too                                        | Tülu 3's preference step                   |
| **Answer key** (RLVR)                           | Tülu 3's RLVR                | DeepSeek-R1                                      | pair a ✓ try with an ✗ try (Iterative RPO) |

Row and column are independent — the thing I kept getting wrong, and the names fight it. In everyday use "RLHF" means the original recipe, people's taste as the grader _and_ PPO as the learning rule, so the word straddles both questions. In this post's split, "taste test by people" is only the who-grades half, and it pairs with any learning rule: recent open recipes run their final taste-test stage with a group average against a learned grader, no forecaster. Likewise **RLVR and GRPO are not either/or**: RLVR says where the score comes from, GRPO says how the score becomes a nudge, and GRPO takes a grader model's score just as happily. The named recipes are paths through this grid, [spelled out below](#recipes-in-plain-words).

## Who grades the answer?

<a id="sft-imitate-good-answers"></a>

### Copy the expert (SFT)

{% include local_image_float_right.html src="raccoon-post-training-sft.webp" %}

No grade, just an answer sheet. Supervised fine-tuning is further training of exactly the kind pre-training does — predict the next word piece (token) — pointed at curated (prompt → ideal answer) pairs instead of the internet, so the model gives the demonstrated answers a higher probability (likelihood). Nothing about the goal (objective) changes, only the data, and that is enough: a few thousand demonstrations teach a base model to answer instead of autocomplete, in whatever format the demos hold.

The expert needn't be a person. A strong model can write the demonstrations for a weaker one — teacher-student copying (distillation) — and every "reasoning traces" dataset is a big model's homework copied by a small one.

Copying can only copy: it never exceeds the demos or learns what _not_ to do, and a handful of examples teaches style, not knowledge — then hallucinates the gaps.

{% include post-training-anim.html name="sft" caption="Copy the expert: the model's answer is pulled onto the teacher's, and the error score shrinks." %}

<details markdown="1">
<summary>Prior work</summary>

- [InstructGPT](https://arxiv.org/abs/2203.02155) (OpenAI, 2022): labelers wrote about 13k demonstrations; that SFT step turned GPT-3 from an autocompleter into an assistant.
- [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html) (Stanford, 2023): LLaMA 7B further trained on 52K demonstrations written by OpenAI's text-davinci-003.
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025): distilled into smaller models that beat the instruction-tuned versions they started from.

</details>

<a id="rlhf-learn-the-taste-from-rankings"></a>

### Taste test by people (RLHF)

{% include local_image_float_right.html src="raccoon-post-training-rlhf.webp" %}

People find it far easier to say which of two answers is better than to write the ideal one. So RLHF shows labelers several answers to one prompt and has them rank them, then writes the taste down as a **grader** (reward model): a second, smaller language model with its last layer swapped for a single-number output, trained on tens of thousands of comparisons to score a prompt and its answer. It can score millions of answers nobody will ever read. The pipeline in one line: people's picks → train the grader → [an RL loop](#coach-with-a-forecaster-ppo) scores thousands of fresh answers with it. DPO, below, skips the grader.

The recipe also adds a **leash**: a penalty on how far the model drifts from where it started (a KL penalty against a frozen copy of the starting model, charged per word piece), so it can't wander into whatever the grader mistakenly likes. The leash belongs to the recipe's goal, not to any one learning rule: PPO's own guard is its small-steps rule, GRPO keeps both the leash and the small steps, and DPO bakes the leash into its formula as a dial (β).

The payoff: a small model taste-tested this way beat one a hundred times bigger that wasn't. Behavior, not knowledge, was what people were missing. The catch is Goodhart's law with a training budget: the grader is a _proxy_ for what people want, and push on it hard enough and the proxy score keeps climbing while the true score stalls, then falls. Gaming the grader (reward hacking, over-optimization) is the default outcome, not the exception. Two grader-design lessons from elsewhere on the blog: a judge answers _which of these two is better_ far more reliably than a zero-to-ten scale ([/ai-testing](/ai-testing#wrinkle---no-known-answer)), and a grade that adds up several parts has to be read part by part ([/hill-climbing](/hill-climbing#your-other-job-build-evals)).

{% include post-training-anim.html name="rlhf" caption="Taste test by people: a person picks A, the grader's meter learns the taste, and the model leans toward A — on a leash to where it started." %}

<details markdown="1">
<summary>Prior work</summary>

- [InstructGPT](https://arxiv.org/abs/2203.02155) (OpenAI, 2022): the reward model is a 6B model, "starting from the SFT model with the final unembedding layer removed", trained on 33k prompts' worth of comparisons. Labelers preferred the 1.3B InstructGPT over the 175B GPT-3 "despite having 100x fewer parameters." The leash is "a per-token KL penalty from the SFT model … to mitigate overoptimization of the reward model."
- [Gao et al.](https://arxiv.org/abs/2210.10760) (2022) measured the over-optimization curve: "optimizing its value too much can hinder ground truth performance."
- [Llama 3](https://arxiv.org/abs/2407.21783) (Meta, 2024): a reward model on human-annotated preferences, then DPO rather than PPO — "DPO required less compute for large-scale models and performed better."
- People's taste with a group-average rule: [Rufus-Air](https://arxiv.org/abs/2609.29421) (Amazon, 2026) ends with an RLHF stage where "RLHF means RL against a learned reward model" (Skywork-Reward-V2-Qwen3-8B) and "optimization uses GRPO"; [IBM Granite 4.2](https://huggingface.co/blog/ibm-granite/granite-4-2) (2026): "Every stage trains with asynchronous GRPO" and "The final stage of every model is RLHF for human preference and safety" against a generative reward model.

</details>

<a id="rlaif-and-constitutional-ai-when-the-judge-is-a-model"></a>

### Taste test by an AI with a rulebook (RLAIF, Constitutional AI)

{% include local_image_float_right.html src="raccoon-post-training-rulebook.webp" %}

Human rankings are the expensive part. Constitutional AI keeps human labels for helpfulness but replaces the harmlessness rankings with a model and a short list of written principles — the "constitution", the only human oversight on that side. Two phases: the model critiques and revises its own answers against the principles and is further trained on the revisions (copy the expert, where the expert is its own corrected draft); then a model, not a person, judges A-vs-B pairs, a grader is trained on those AI preferences, and the RL loop runs against it. That second phase is RL from AI Feedback, and it trains about as well as feedback from people on summarization and dialogue.

An AI judge is also what's left when nothing can be checked. To teach a model to paint by writing code, one builder hand-rated a pool of reference images and made the grade "did the judge prefer this render to two pulled from the pool". With no test to pass, the grader _is_ the design work: [build it badly and the score keeps climbing while the pictures stop improving](/hill-climbing#your-other-job-build-evals). The judge's blind spots become the model's, and a judge can be gamed like any grader.

{% include post-training-anim.html name="rlaif" caption="Taste test by an AI: the human judge is swapped for a model holding the rulebook; the loop is otherwise the same." %}

<details markdown="1">
<summary>Prior work</summary>

- [Constitutional AI](https://arxiv.org/abs/2212.08073) (Anthropic, 2022): "we use human labels for helpfulness, but only AI labels for harmlessness" — 135,296 human helpfulness comparisons and 182,831 AI-generated harmlessness comparisons.
- [RLAIF vs. RLHF](https://arxiv.org/abs/2309.00267) (Google, 2023): RLAIF "achieves comparable performance to RLHF" on summarization and dialogue.
- [Surya Narreddi, RLing Qwen to paint with code](https://surya.website/rling-qwen-to-paint-with-code): 1,664 generated p5.brush images hand-rated down to a 581-picture reference pool, a judge model as the grader.

</details>

<a id="rlvr-let-a-checker-grade-it"></a>

### Answer key (RLVR)

{% include local_image_float_right.html src="raccoon-post-training-rlvr.webp" %}

If the answer can be checked — a math result, a unit test, a task that either got done or didn't — you need neither people nor a grader model, and the grade is just pass or fail. RLVR grades against the answer key: reward only when the answer is verifiably correct. The recipe that named it pointed it at grade-school math, competition math, and instruction-following with checkable constraints, and learned from the grade with PPO.

The biggest demonstration ran RL on a base model with no copying step, graded only on accuracy and format. Reasoning came out of the grade alone: the model started re-checking its work and, at one training step, saying "wait" and revisiting its approach, unprompted. It also came out barely readable, mixing two languages mid-thought, so the shipped version adds a small copy-the-expert stage and a language-consistency grade. The same engine, pointed at software, trains coding agents; that loop, and how it gets gamed, is in the [parent post](/ai-training#post-training-for-coding-competence). The checker becomes the target: the model will special-case the test, hard-code the expected output, or `pip install` its way around the real fix if it can.

{% include post-training-anim.html name="rlvr" caption="Answer key: this shows who grades, not how the model learns. Every try is checked; ✓ tries are pushed up and ✗ tries down, by how far each sits from usual — and the learning rule underneath can be a forecaster (PPO) or a group average (GRPO)." %}

A real training run doesn't pick one grader; it picks one per kind of task. Xiaomi open-sourced the environments behind its MiMo-V2.6 agent RL — about 7,800 tasks, each a sandbox with its own grader — and the five sets walk this section from answer key back to taste test:

| Task set        | The try                                       | Who grades                                                                                                    |
| --------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Code (2,698)    | fix a real GitHub issue in the repo           | answer key: the tests run on its patch                                                                        |
| Cyber (1,000)   | write an input that triggers a known bug      | answer key: the program must crash in the named function, with the named bug type                             |
| Music (1,000)   | compose a piece, in text notation, to a brief | a script: play it as MIDI and score how far its rhythm, harmony and structure sit from human-written music    |
| General (989)   | office and terminal chores                    | a checklist of yes/no items: code checks what it can, a judge model the rest                                  |
| Web dev (2,093) | build a website from a one-line brief         | a judge model looks at screenshots of the group's sites and picks the better and worse ones — a curve, no key |

The answer key runs wherever the task allows it, and the judge only shows up where nothing can be checked. Even the web-dev judge is fenced by code: a site whose JavaScript doesn't run gets zero before the judge sees it.

<details markdown="1">
<summary>Prior work</summary>

- [Tülu 3](https://arxiv.org/abs/2411.15124) (AI2, 2024) coined RLVR: "only provide rewards when the model's generations are verified to be correct." Targets: GSM8K, MATH and IFEval-style constraints. The learning rule is PPO — "If the answer is verifiably correct, we provide reward of α, otherwise 0. We then train against this reward using PPO" — with the value model initialized from a reward model.
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025): R1-Zero — "we bypass the conventional supervised fine-tuning (SFT) phase before RL training" — ran GRPO on a base model with accuracy and format rewards; the paper's "aha moment" is the step where the model began saying "wait". It mixed English and Chinese mid-thought, so R1 adds a cold-start SFT stage and a language-consistency reward.
- MiMo-V2.6 (Xiaomi, 2026) released environments: the [dataset](https://huggingface.co/datasets/XiaomiMiMo/MiMo-V2.6-RL-oss) (Apache-2.0; verifiers listed as "Executable tests", "Rule checks", "Rubric-based judging", "Visual grading"), the [Docker images](https://hub.docker.com/r/xiaomimimo/mimo-v2.6-rl-oss), the [training code](https://github.com/XiaomiMiMo/verl) with each grader in it, and the [agent harness](https://github.com/XiaomiMiMo/mimoagent). The [technical report](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL/blob/main/MiMo_V2_6_technical_report.pdf) (§4.2, §7; [blog](https://mimo.xiaomi.com/mimo-v2-6)): general tasks use "atomic, binary rubric items: code-based checks verify deterministic properties … while LLM-based checks assess more open-ended content"; GRPO on these environments from a 9B distilled model moved SWE-bench Verified from 61.1 to 66.2. The web-dev grader is a judge model voting good or bad over eight rounds of screenshots, their order rotated each round; the music scorer is "human-likeness scoring based on deviation from human music distributions." A community [conversion to the Harbor format](https://huggingface.co/collections/FineEnvs/mimo-v26-rl-in-harbor) has a [browser](https://huggingface.co/spaces/FineEnvs/MiMo-RL-Envs-Explorer) for reading individual tasks.

</details>

<a id="how-does-the-model-learn-from-the-grade"></a>
<a id="how-does-it-know-whats-usual"></a>

## What should the model change, based on this one try?

### Why the grade alone isn't enough

One try is one noisy trial, so its grade alone can't say what to change: the same B is a triumph on a hard prompt and a flop on an easy one, and old news to a strong model but a breakthrough for a weak one. What carries the signal is the **surprise** (advantage): the grade minus what the model usually gets there — its sign the direction, its size how far. In letter grades (a grader really outputs a number and an answer key just pass/fail; letters keep the grades apart from the math answers):

| Prompt · answer                         | Model  | Usual | Grade | Surprise                          |
| --------------------------------------- | ------ | ----- | ----- | --------------------------------- |
| 17 + 25 · "42"                          | strong | A−    | A     | one step up — barely moves        |
| 17 + 25 · "42"                          | weak   | D     | A     | three steps up — a big push       |
| 17 + 25 · "43"                          | strong | A−    | F     | far below — a big push away       |
| 17 + 25 · "43"                          | weak   | D     | F     | one step down — a small push away |
| infinitely many primes · a decent proof | strong | D     | B     | two steps up — a strong push      |

"Usual" depends on the model as much as the prompt: the same right answer is old news to a strong model and a breakthrough for a weak one. A B on a hard prompt teaches more than an A on an easy one. Now, how each method gets "usually".

<a id="coach-with-a-scorekeeper-ppo"></a>

### Coach with a forecaster (PPO)

{% include local_image_float_right.html src="raccoon-post-training-scorekeeper.webp" %}

PPO is the classic update rule: take the surprise on each answer and move the weights by it, in small capped steps (clipping) so the model never lurches. Around the model (RL calls it the **policy**: whatever picks the next action) sit three helpers. The grader scores each answer. The **forecaster** supplies "usually": a second network that predicts the grade an answer will probably get. The jargon is _critic_ or _value model_, from actor-critic RL: the actor acts, the critic estimates how well things will go from here. It forecasts, it doesn't criticize, and never hands out a grade. And the **leash copy** (reference model): the frozen starting model that the leash measures drift from.

What moves and what's frozen while it runs:

| Piece                          | During training | What it is                                                                                                                                              |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The model** (the policy)     | changes         | The point of the exercise.                                                                                                                              |
| **The forecaster** (critic)    | changes         | Starts as a copy of the grader but predicts the final grade from the prompt and a partial answer, and keeps learning because the model keeps improving. |
| **The grader** (reward model)  | frozen          | Trained earlier, from people's A-vs-B picks.                                                                                                            |
| **The leash copy** (reference) | frozen          | The model as it was at the start; the leash measures drift from it.                                                                                     |

Only the model ships. But all four sit in memory while it runs, and PPO has the most knobs to tune — the cost the next two methods cut.

<details markdown="1">
<summary>Prior work</summary>

- [PPO](https://arxiv.org/abs/2203.02155) is the learning rule InstructGPT used; the forecaster starts as a copy of the grader — "The value function is initialized from the RM."

</details>

<a id="grpo-the-optimizer-that-made-rlvr-cheap"></a>

### Grade on a curve against its own tries (GRPO)

{% include local_image_float_right.html src="raccoon-post-training-curve.webp" %}

GRPO keeps PPO's small steps and leash and fires only the forecaster. Generate a group of tries (sampling) at one prompt, score each with the grader, and use the group's average as "usually". On the primes proof, eight tries score F, D, D, C, F, B, D, F — average D — so the B sits two steps above the curve and gets a strong push up, and each F sits one step below and gets pushed away. Same lesson, no forecaster: three models in memory, or two when the grader is an answer key rather than a model. That made pure RL on a base model affordable, and it's the default for reasoning RL today.

{% include post-training-anim.html name="grpo" caption="Grade on a curve: eight tries at one prompt, graded F, D, D, C, F, B, D, F. The group average, D, is the bar — above it grows, below it shrinks." %}

<details markdown="1">
<summary>Two biases, and the fixes (Dr. GRPO, DAPO)</summary>

GRPO divides each try's error score (loss) by the try's length, which penalizes long wrong answers less, so wrong answers get longer; and it divides each surprise by the group's grade spread, which over-weights the prompts where every try scored nearly the same — the easiest and the hardest. [Dr. GRPO](https://arxiv.org/abs/2503.20783) removes both divisions. [DAPO](https://arxiv.org/abs/2503.14476) loosens the small-steps rule on the upside (clip-higher) so the model keeps its variety (entropy), skips prompts where every try scored the same (no direction to nudge — zero gradient), averages the error score per word piece rather than per answer, and penalizes over-long answers softly.

</details>

#### Does anyone still use PPO?

Less and less, for reasoning. After the first pure-RL reasoning model, open work mostly moved to forecaster-free, group-based methods — GRPO and its descendants, plus an older, simpler leave-one-out baseline — because the forecaster costs memory and is hard to train on long answers. But PPO isn't dead: the open recipe that coined RLVR ran it with PPO, and forecaster methods came back for long multi-step tasks, where a per-step forecast says which step helped and beats the forecaster-free methods on hard math. The closed labs don't say what they run. Honest bottom line: a GRPO-style method is what you'd start with today, and the forecaster is the tool you reach for when answers are long and the steps matter.

<details markdown="1">
<summary>Prior work</summary>

- [GRPO](https://arxiv.org/abs/2402.03300) (DeepSeekMath, 2024): "GRPO foregoes the critic model, instead estimating the baseline from group scores, significantly reducing training resources." It keeps PPO's clipped ratio and adds the KL to the loss directly.
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948) (2025): R1-Zero is GRPO on a base model with rule-based rewards.
- [Back to Basics](https://arxiv.org/abs/2402.14740) (Cohere, 2024): "many components of PPO are unnecessary in an RLHF context" and simpler REINFORCE-style variants outperform it — RLOO uses the leave-one-out average of the other tries as the baseline.
- [GSPO](https://arxiv.org/abs/2507.18071) (Qwen team, 2025): a GRPO descendant with sequence-level ratios and clipping, used for the Qwen3 models.
- [Tülu 3](https://arxiv.org/abs/2411.15124) (2024) ran RLVR with PPO, value model initialized from a reward model.
- [VAPO](https://arxiv.org/abs/2504.05118) (ByteDance Seed, 2025): a value-model method for long chain-of-thought — value models "enable more precise credit assignment" — that "outperforms the previously reported results of DeepSeek-R1-Zero-Qwen-32B and DAPO by more than 10 points" on AIME 2024.

</details>

<a id="dpo-the-same-preferences-no-rl-loop"></a>

<a id="straight-to-a-over-b-no-scorekeeper-dpo"></a>

### Straight to A-over-B: no grader model, no forecaster (DPO)

{% include local_image_float_right.html src="raccoon-post-training-dpo.webp" %}

DPO noticed that for a taste test the whole loop is a detour. RLHF's goal (objective) — maximize the grade while staying leashed to the starting copy — has a best possible model you can write down as a direct formula (closed form), and substituting it back turns the grader into a function of the model itself. So you train no grader and no forecaster, and never ask what's usual. Take the A-vs-B pairs and train the model with a plain classification-style error score that pushes the preferred answer's probability up, relative to the leash copy, and the rejected answer's down; one dial (β) sets how far it may wander. Two models in memory, no generate-and-grade loop, no PPO to babysit — and most of RLHF's benefit, which is why it's the preference step in most open recipes.

The limit: DPO can never learn anything the pairs don't already say, while an RL loop keeps scoring new tries. Pairs are all it needs, though — an answer key makes them too, by pairing a ✓ try with an ✗ try to the same prompt.

{% include post-training-anim.html name="dpo" caption="Straight to A-over-B: a seesaw, preferred answer up and rejected answer down — no meter anywhere." %}

<details markdown="1">
<summary>Prior work</summary>

- [DPO](https://arxiv.org/abs/2305.18290) (Stanford, 2023): "your language model is secretly a reward model."
- [Llama 3](https://arxiv.org/abs/2407.21783) (DPO on human-annotated preferences) and [Tülu 3](https://arxiv.org/abs/2411.15124) (DPO on pairs judged by GPT-4o) both use it as their preference step.
- [Iterative RPO](https://arxiv.org/abs/2404.19733) (Meta, 2024): pairs a correct chain of thought with an incorrect one from the same prompt and trains with DPO plus a likelihood term — an answer key as the source of pairs.

</details>

<a id="how-the-weights-actually-change-lora"></a>
<a id="clip-on-adapter-lora"></a>

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
- **The actual math** — I'm staying at the mental-model level on purpose. For the deep version, start with the [seminal papers](/ai-paper) and the Prior work folds above.

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

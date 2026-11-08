---
layout: post
title: AI Testing and Evals
permalink: /ai-testing
redirect_from:
  - /ai-evals
  - /evals
  - /ai-eval
ai_default_image: true
---

_How to measure AI: what to test, how to score it, how to read the results, and my own benchmarks. Which software to run it with is [AI Eval Tools](/ai-eval-tools)._

Testing math is easy, it's right or wrong. Testing spelling is easy too, but testing if a joke is funny - now that's tough. Let's talk about how to test AI.

> Unlike unit tests, evals are an emerging art/science. Anyone who claims to know exactly how your evals should be defined can safely be ignored. We've designed Pydantic Evals to be flexible and useful without being too opinionated.
>
> — [Pydantic Evals docs](https://ai.pydantic.dev/evals/)

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Concepts](#concepts)
  - [Tracing](#tracing)
  - [LLM as Judge](#llm-as-judge)
  - [Humans don't agree either](#humans-dont-agree-either)
  - [Scoring rules I trust](#scoring-rules-i-trust)
  - [Testing across prompts](#testing-across-prompts)
  - [Testing across models](#testing-across-models)
  - [Testing the model bound to its harness](#testing-the-model-bound-to-its-harness)
- [Examples](#examples)
  - [Who is the funnier LLM](#who-is-the-funnier-llm)
  - [Who is the better git summarizer](#who-is-the-better-git-summarizer)
  - [Git commit message for blog content avoid ToC updates](#git-commit-message-for-blog-content-avoid-toc-updates)
  - [Drawing the Mona Lisa, then ruining it](#drawing-the-mona-lisa-then-ruining-it)
- [Eval Systems](#eval-systems)
  - [Human-based blind taste tests Chatbot arena](#human-based-blind-taste-tests-chatbot-arena)
  - [Eval Data Sets](#eval-data-sets)
  - [Confusion matrix, precision, and recall](#confusion-matrix-precision-and-recall)
- [My benchmark evals](#my-benchmark-evals)
  - [Grading the agent with smevals](#grading-the-agent-with-smevals)
  - [Raccoon generator](#raccoon-generator)
- [Testing Theory](#testing-theory)
  - [Good books](#good-books)
  - [Simplest form of testing](#simplest-form-of-testing)
  - [Wrinkle - A/B Testing](#wrinkle---ab-testing)
  - [Wrinkle - No Known Answer](#wrinkle---no-known-answer)
  - [Wrinkle - No clear questions](#wrinkle---no-clear-questions)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Concepts

### Tracing

I started by using LangSmith, but now I use ell, which has it built in.

### LLM as Judge

Fantastic post on using an [LLM as a judge](https://hamel.dev/blog/posts/llm-judge/).

This is the future, also [promptfoo supports this well](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/).

### Humans don't agree either

Before I ask whether a judge is right, I should ask how often two people give the same answer. Less often than I'd guess:

- **Peer review:** NeurIPS sent 10% of submissions to two independent committees. In 2021 they split on [203 of 882 papers](https://arxiv.org/abs/2306.03262), and about half the accepted list would change on a rerun, same as [in 2014](https://arxiv.org/abs/2109.09774).
- **Mammograms:** ten radiologists reading the same 150 films [agreed 78% of the time](https://doi.org/10.1056/NEJM199412013312206), which is a weighted kappa of only 0.47 once chance is taken out.
- **Breast biopsies:** 115 pathologists matched the expert reference on [48% of atypia cases](https://doi.org/10.1001/jama.2015.1405), and the three experts who set that reference agreed unanimously on 75% of cases.
- **Summaries:** on [SummEval](https://arxiv.org/abs/2007.12626), crowd workers reached Krippendorff's alpha 0.49 and experts 0.41, until a second round got the experts to 0.71.
- **Preference labels:** [InstructGPT's labelers](https://arxiv.org/abs/2203.02155) agreed on the better output 72.6% of the time, the raw material of RLHF.

Percent agreement flatters. Two raters guessing agree half the time on a yes/no, and more when the label is rare and both mostly say "no". Cohen's kappa (two raters), Fleiss' kappa and Krippendorff's alpha (more raters) subtract what chance would give, and Krippendorff wants alpha ≥ 0.8 before relying on the data.

So the bar: **trust a judge when it agrees with humans about as well as humans agree with each other**, measured the same way on the same items. GPT-4 cleared it on [MT-Bench](https://arxiv.org/abs/2306.05685), 66% with humans against 63% between humans (ties counted, where chance is 33%). Easy tasks raise the bar: people grading TriviaQA answers hit Scott's pi ~96, and the [best judges landed in the high 80s](https://arxiv.org/abs/2406.12624) while their percent agreement looked fine.

How I'd run one:

- **Label 50–100 outputs myself first** and write down why each fails. The rubric comes from those notes and from the items two of us split on. Shreya Shankar calls this [criteria drift](https://arxiv.org/abs/2404.12272): you need criteria to grade, and grading is how you find them.
- **Report the judge next to the human number,** as kappa, or as pass and fail rates separately when failures are rare.
- **Swap positions** and count only wins that survive both orders. On MT-Bench, GPT-4 kept its verdict after a swap 65% of the time, Claude-v1 24%. And don't reward padding: repeating a list's items in new words fooled GPT-3.5 and Claude-v1 91% of the time.
- **Route on confidence.** Code takes what it can settle ([rule one](#scoring-rules-i-trust)), a cheap decision model that returns a calibrated 0–1 score takes the clear calls, and only the uncertain middle goes to a big model or a person. [Hightouch audited merged customer identities](https://hightouch.com/blog/llm-judges-identity-resolution) this way, on a synthetic benchmark: anything Jev scored between 30% and 90% went to Claude Opus. That sent 22% up and scored 98.8% against Opus-alone's 99.0%, at $0.88 instead of $3.86 per thousand. Calibration is the catch: GPT-6 Luna beat Jev out of the box, but it's overconfident, so on harder data its hybrid fell to 91.6% while Jev's held 95.3%.

My [pr-checks skill](https://github.com/idvorkin/idvorkin.github.io/tree/main/.claude/skills/pr-checks) is the small version. Regexes settle the structural checks, Jev scores headers, voice and ai-patterns, and the raw score prints next to each threshold so a near-miss shows. Grading the judge is what kept it honest: only ai-patterns separates (pre-LLM posts ≤ 2.38, AI-patterned fixtures ≥ 3.99). Injecting an "I"→"we" switch moved the voice score by as little as +0.03, inside the range clean posts already sit, so voice and headers never block. Their flags come to me as "worth a look", never as a verdict.

### Scoring rules I trust

- **Deterministic checks first.** String matches, git diffs, and my own tools as oracles (toc.py decides whether a TOC is right). They're cheap and give the same answer twice. An LLM judge is opt-in, for the quality the checks can't see, never the default gate.
- **A judge confirms yes/no assertions, not a 1–5 score.** Hand it specific claims ("the new heading is in the TOC") and have it cite the step it's judging. When it has to rank, make it pairwise, [not a scale](#wrinkle---no-known-answer).
- **Run each task k times; report pass^k next to pass@k.** pass@k (passed at least once) says the agent can do it; pass^k (passed every time) says I can rely on it. The gap is flakiness.
- **Count harness failures apart from agent failures.** A run that died on a blocked command or a sandbox that wouldn't start isn't the model getting it wrong. Mix them and the leaderboard measures my setup.
- **Test the graders.** A known-good run must pass and a deliberately sloppy one must fail. If your checkers have never failed a bad run on purpose, you don't know that they work.

The assertion, pass^k, and harness rules come from [Yesha Shah's Agentic Evals guide](https://www.linkedin.com/pulse/agentic-evals-software-engineers-guide-part-1-yesha-shah-sdjle/).

### Testing across prompts

I use PromptFoo, but haven't really done this.

### Testing across models

1. PromptFoo - For heavy lifts
2. [https://nat.dev](https://nat.dev) - For ad-hoc experimentation
3. Just keep the output of both - The cheater's way

Here's an example, where I use multiple LLMs to generate output and just keep both.

For example, here's the explanation of [My commit that does this](https://github.com/idvorkin/nlp/commit/674e73c6729cedc9a07cdad326c67ef8976601db).

Notice that Claude does a better job getting the gist of it.

_-- claude-3-opus-20240229 --_
Add support for generating commit messages from multiple LLMs concurrently

- Allows generating commit messages from multiple LLMs (OpenAI and Anthropic
  Claude) in parallel to compare and choose the best one

_-- gpt-4-turbo-2024-04-09 --_
Refactor build_commit function for asynchronous operation and enhance
instruction formatting

- Shift towards asynchronous programming for handling multiple language models
  concurrently, improving scalability and performance.
- Update the instruction documentation to make it more structured and clear,
  following a markdown format for better readability.

### Testing the model bound to its harness

Evals used to be prompt in, completion out. In the agentic era that's the wrong unit — the thing doing the work is the model plus its tools, its environment, and its permission envelope, and the model and the harness get cross-trained together. Swap the harness and the same weights score differently, so harness-bound performance is the thing that actually matters. [AI Eval Tools](/ai-eval-tools) calls this agent-in-a-workdir.

Same way you judge a person: in an environment, not in the abstract.

## Examples

### Who is the funnier LLM

One of my AI creations is an improv coach. A key requirement of said coach is that it is funny. How the heck can I tell if GPT-3.5, GPT-4, or Claude is funnier?

I found a package called PromptFoo, which is most of what I want.

See the [code here](https://github.com/idvorkin/nlp/commit/9b5af637477099c6562c80f46ad2a3cec65d6c27), and you can interact with a [live file here](https://app.promptfoo.dev/eval/f:e66b7a20-67b1-4e78-a0bd-63a3f7f30f96/).

{% include blob_image.html src="/blog/promptfoo-3-things.webp" %}

### Who is the better git summarizer

You can see my PromptFoo test cases [here](https://github.com/idvorkin/nlp/blob/1ca6b3f85895b2684596c8957f0a0bd5a7a5d4f1/eval/commit/diff_commit.json?plain=1#L2f).

How to get the test case? I'd recommend recording a trace with LangSmith, then copy/export them from a LangChain trace and write to JSON (todo add a script for this).

And the output of the run [in PromptFoo](https://app.promptfoo.dev/eval/f:442e0857-efc0-408b-9a6d-c064ee7ae306).

Note, you can both assess these as a human, also have the LLM look at criteria

```yaml
tests:
  assert:
    - type: llm-rubric
      value: ensure the diff is described well
```

### Git commit message for blog content avoid ToC updates

I use a tool to write my git commit messages. It can get slow, so I like to run it with maverik when it's not that important. However, when summarizing changes to my blog there are always changes to the auto generated ToC, which I don't want to be included, I have trouble getting Maverik to honor [this](https://github.com/idvorkin/nlp/blob/03fe037a2323f21dd1728862dbf598d8af541fec/commit.py?plain=1#L146).

```
- **Do not** mention discuss changes to the table of content.
```

Testing this is normally a PITA with me doing manual testing, let's see if I can make some evals to fix this. I think I have a few choices

1. Prompt Foo
2. DeepEval
3. Giskard

Let's start with promptfoo

Update 2026-08: this itch finally became a real eval — see [Grading the agent with smevals](#grading-the-agent-with-smevals).

### Drawing the Mona Lisa, then ruining it

TryAI built a [drawing arena](https://www.tryai.dev/blog/ai-drawing-arena-colored-pencils-claude-gpt-grok): four frontier models, a blank canvas, and simulated colored pencils. The model picks a color and a pressure, lays down strokes, smudges, erases, and calls `view_canvas` to look at its own work and decide what to fix next. Two of the seven tasks are reproductions — the Mona Lisa and Starry Night — scored against the target with SSIM, so there's a real number under the pictures. The [harness is open source](https://github.com/hershalb/canvas-arena).

The cost spread is the fun part — GPT-5.6 Sol drew all seven for $7.74, Claude Fable 5 spent $160.58 to land second on quality — but the number that stuck with me is this: every one of the eight scored runs finished below the model's own mid-run peak. Gemini 3.6 Flash hit 0.449 SSIM on the Mona Lisa, the best score anyone reached, then reviewed its way back down to 0.337. Claude looked at its Mona Lisa 27 times and was flat after about the fifth.

That's [hill climbing](/hill-climbing) with the keep/reject step missing. The models could draw, erase, and look, but they had no way to snapshot a canvas they liked and roll back to it, and nothing in the loop compared the current canvas against their best so far. Every review was a chance to walk downhill with nothing to catch it. If my eval only reads the final artifact, I score the 0.337 and never learn the 0.449 happened. Score the trajectory, not just the finish, and ship the best checkpoint rather than the last one.

## Eval Systems

A good eval isn't the finish line — it's the scoring function that drives a search loop. Once you have one that's cheap, unambiguous, and aligned with what you actually want, the agent can run [eval-driven hill climbing](/hill-climbing) while you look at the final result — as long as the final result is the best one, which [isn't a given](#drawing-the-mona-lisa-then-ruining-it). The systems below are what make that scoring cheap and repeatable.

### Human-based blind taste tests Chatbot arena

The gold standard for what LLM is best is asking users to judge. [Chatbot Arena](https://chat.lmsys.org/?leaderboard) does this, from their paper:

_Large Language Models (LLMs) have unlocked new capabilities and applications; however, evaluating the alignment with human preferences still poses significant challenges. To address this issue, we introduce Chatbot Arena, an open platform for evaluating LLMs based on human preferences. Our methodology employs a pairwise comparison approach and leverages input from a diverse user base through crowdsourcing. The platform has been operational for several months, amassing over 240K votes. This paper describes the platform, analyzes the data we have collected so far, and explains the tried-and-true statistical methods we are using for efficient and accurate evaluation and ranking of models. We confirm that the crowdsourced questions are sufficiently diverse and discriminating and that the crowdsourced human votes are in good agreement with those of expert raters. These analyses collectively establish a robust foundation for the credibility of Chatbot Arena. Because of its unique value and openness, Chatbot Arena has emerged as one of the most referenced LLM leaderboards, widely cited by leading LLM developers and companies. Our demo is publicly available at \url{this https URL}._

Note, Elo rating is better than a straight rank. It's what's used in chess scores, TL;DR from GPT:

_The Elo rating system provides a more dynamic and precise measurement of a player's skill level compared to a strict ranking system. In a strict rank system, ranks are usually assigned based on the order of finish in competitions or through a simple win/loss record without considering the strength of the opponents. This can sometimes lead to misleading ranks when players have not played opponents of equal skill._

_The Elo system, however, adjusts a player’s rating based on the expected outcome of each game, taking into account the skill levels of the opponents. This means that beating a higher-rated player will gain you more points than beating a lower-rated one, and losing to a lower-rated player will cost you more points. As a result, the Elo rating is a more accurate reflection of a player's true skill level and provides a more nuanced understanding of how players compare to each other._

### Eval Data Sets

Building good "generic" eval data sets is hard, here are some:

- [Big Bench](https://github.com/suzgunmirac/BIG-Bench-Hard/tree/main) - a bunch of hard question prompts

### Confusion matrix, precision, and recall

A single pass rate hides the question I care about: which mistakes, and what do they cost? When the thing under test is a classifier (route this ticket, pick this intent), the tool is a confusion matrix. The idea comes from Steve Yegge's [The Counting House](https://steve-yegge.medium.com/the-counting-house-steve-yegge-83f5145cc35b) ([my notes](https://idvorkin-ai-tools.github.io/yegge-field-map/ai/the-counting-house.html)). The example below is a made-up chest-pain triage model, and its numbers and costs are invented, not clinical data. 1,000 patients, four diagnoses:

| Actual ↓ / Picked → | Heart attack | Reflux  | Muscle strain | Anxiety | Recall |
| ------------------- | ------------ | ------- | ------------- | ------- | ------ |
| Heart attack        | **30**       | 16      | 2             | 2       | 60%    |
| Reflux              | 1            | **344** | 10            | 45      | 86%    |
| Muscle strain       | 1            | 45      | **200**       | 4       | 80%    |
| Anxiety             | 0            | 4       | 1             | **295** | 98%    |
| **Precision**       | 94%          | 84%     | 94%           | 85%     |        |

Rows are what the patient really had; columns are what the model picked. The diagonal is right, and every other cell is one specific mistake.

- **Precision** reads down a column: when the model says heart attack, how often is that true? 30 of 32.
- **Recall** reads across a row: of the real heart attacks, how many got called heart attacks? 30 of 50.

You can max out either by cheating at the other: answer once and be right, or answer everything and miss nothing. Yegge's version of that:

> In short, high recall means you hit all the ducks, whereas high precision means you _only_ hit ducks.
>
> — [Steve Yegge, The Counting House](https://steve-yegge.medium.com/the-counting-house-steve-yegge-83f5145cc35b)

Each class fails its own way. Heart attack is cautious: 94% precision, but 2 in 5 heart attacks slip past, 16 of them into reflux. Anxiety is greedy: it catches 98% of anxiety, and takes 51 other patients with it. Reflux is the junk drawer: 65 of the 409 patients it gets belong somewhere else.

Overall accuracy is 86.9%, and it hides the point: errors don't cost the same. Say a missed heart attack costs \$100,000, a false alarm (a cardiac work-up for nothing) \$5,000, a real problem sent home as anxiety \$500, and any other mix-up \$100. The 20 missed heart attacks cost \$2M; the other 111 mistakes together cost \$40,500. So I pick the metric per class: recall near 100% on heart attacks, even at the price of more work-ups, and precision on anxiety, because whoever gets that label goes home. The bar isn't a fixed number either: Yegge scores the humans on the same gold set, and the model passes only if its error cost plus inference beats theirs plus labor.

## My benchmark evals

The honest way to feel out an eval tool is to build the same evals in each, so these two get rebuilt in [every tool I try](/ai-eval-tools).

### Grading the agent with smevals

**Blog page edit**, built with [smevals](/ai-eval-tools#smevals-020) in [smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals). Every post on this blog keeps a generated table of contents, and what I actually care about when an agent edits a page is: did it make the change, did it regenerate the TOC, and did it leave everything else alone. Three deterministic checkers, no judge required:

- **expected-content** — the requested change landed in the file, not just in the chat reply
- **toc-correct** — regenerating the TOC with my own toc.py must be a byte-level no-op (the repo's tool is the oracle)
- **no-collateral** — git status against a baseline commit shows only the target file changed, frontmatter untouched, plus a diff-line count that catches agents rewriting the whole file to fix one word

Three tasks: add a section, rename a heading, and fix a body typo — the last one is a trap, since the TOC must NOT change. Each runs headless against the harness under test — Claude Code and Codex CLI so far.

First results (2026-08):

| Config                                   | Runs | Edit landed | TOC correct | No collateral | Judge score |
| ---------------------------------------- | ---- | ----------- | ----------- | ------------- | ----------- |
| sonnet · Claude Code                     | 9    | 100%        | 100%        | 100%          | 0.99        |
| haiku · Claude Code                      | 11   | 100%        | 100%        | 100%          | 0.96        |
| gpt-5.4-mini · Codex CLI, zero reasoning | 10   | 70%         | 100%        | 100%          | 0.70        |
| mock-bad (grader test)                   | 3    | 100%        | 33%         | 0%            | 0.61        |

Both Claude configs pass everything, including zero TOC churn on the trap task. The deliberately dumb Codex config (mini model, reasoning effort none, sandbox replaced by a pre-approved command allowlist since its bwrap sandbox can't spawn in my VM) broke the saturation: 3 of its 10 runs fail, and every failure is a give-up after the first blocked edit attempt - never a wrong edit. When it does act, the TOC and collateral checks stay clean. Which is [the harness point](#testing-the-model-bound-to-its-harness) in miniature — what failed was the permission envelope, not the model.

The judge column is a second grader — an LLM judge scoring correctness, voice match, and scope from the diff — layered on after the fact, since decoupled grading re-scores old runs for free. It found the daylight the deterministic checks can't see: sonnet 0.99 vs haiku 0.96 (haiku gets docked for details like unspaced em-dashes on a page that uses spaced hyphens), while an empty diff short-circuits to 0 with no LLM call. Deterministic graders stay the gate; the judge adds the quality axis. Next variants: drop the CLAUDE.md hints, use full-size pages, make edits that span files.

The graders themselves get tested with a pair of mock runners — a known-good one that must always pass, and a sloppy one (skips the TOC regen, leaves a scratch file behind) that must always fail. That's [the last scoring rule](#scoring-rules-i-trust) in practice.

### Raccoon generator

My recurring real need: a raccoon illustration in the blog's house style. Deterministic checks first (file exists, right format, transparent background, sane dimensions), then a vision judge for what only a judge can see: is it a raccoon, and does it match the style. Not built yet. It's next, and it forces the multimodal-judge question the blog-edit eval dodges.

## Testing Theory

### Good books

- [Taming LLMs on Evals](https://www.souzatharsis.com/tamingLLMs/notebooks/evals.html)

### Simplest form of testing

Before testing:

- Come up with a list of tasks (questions) and answers

Test Time:

- Have the system perform those tasks and write down the answer

Eval Time:

- Check tasks against answers
- Print score

### Wrinkle - A/B Testing

Sometimes we want to see what

At test time:

- Have both A and B attempt the task

Eval Time:

- See who did better, A or B

### Wrinkle - No Known Answer

Sometimes there isn't a known answer - in that case, we can have a judge do the answers.

Eval Time:

Have a judge grade it.

Judges are subjective, so we can have multiple judges and average their answers - like we do in boxing matches or work performance reviews. The catch: averaging only helps if the judges actually disagree. Ask five judges the same question five different ways and you've bought one opinion at five times the price, so check that their scores diverge before you trust the average. Mixing model families is the cheap way to get real disagreement: a [panel of three small models](https://arxiv.org/abs/2404.18796) from three families out-agreed a lone GPT-4 with humans, at a seventh of the cost.

And when every score comes back in the same narrow band (asked for 1–100, GPT-4 [piles onto 90 and 95](https://arxiv.org/abs/2405.01724) and barely touches anything under 60), the fix is usually the question, not the judge. A judge answers _which of these two is better_ far more reliably than an abstract zero-to-ten scale - the same reason [Chatbot Arena](#human-based-blind-taste-tests-chatbot-arena) is pairwise. Trading absolute scores for a head-to-head against known-good references is what [unstuck an RL run on watercolor paintings](https://surya.website/rling-qwen-to-paint-with-code) that had flatlined.

The full version of this wrinkle is [Cameron Wolfe's AI Engineer NYC talk](https://www.youtube.com/watch?v=zLc8zeGeNaY) on how Netflix evaluates agents when there's no right answer. Humans come first: experts write quality guidelines, raters get calibrated until they agree with each other, and only then does an LLM judge stand in for them, trusted once it agrees with the humans about as well as they agree among themselves ([the bar above](#humans-dont-agree-either)). Offline evals screen the ideas, human evals check the best few, and an A/B test picks the winner. Here are the [slides](https://docs.google.com/presentation/d/146TscsJ21LU4kATVS3ES2oC_oZxoCBsTH3soepY25P4/edit?usp=sharing), and a [written guide](https://cameronrwolfe.substack.com/p/subjective-evals) that adds the statistics (power analysis, confidence intervals) and further reading.

{% include youtube.html src="zLc8zeGeNaY" %}

### Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks

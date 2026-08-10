---
layout: post
title: Testing AI
permalink: /ai-testing
ai_default_image: true
---

Testing math is easy, it's right or wrong. Testing spelling is easy too, but testing if a joke is funny - now that's tough. Let's talk about how to test AI.

> Unlike unit tests, evals are an emerging art/science. Anyone who claims to know exactly how your evals should be defined can safely be ignored. We've designed Pydantic Evals to be flexible and useful without being too opinionated.
>
> — [Pydantic Evals docs](https://ai.pydantic.dev/evals/)

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Concepts](#concepts)
  - [Tracing](#tracing)
  - [LLM as Judge](#llm-as-judge)
  - [Testing across prompts](#testing-across-prompts)
  - [Testing across models](#testing-across-models)
- [Examples](#examples)
  - [Who is the funnier LLM](#who-is-the-funnier-llm)
  - [Who is the better git summarizer](#who-is-the-better-git-summarizer)
  - [Git commit message for blog content avoid ToC updates](#git-commit-message-for-blog-content-avoid-toc-updates)
  - [Drawing the Mona Lisa, then ruining it](#drawing-the-mona-lisa-then-ruining-it)
- [Eval Systems](#eval-systems)
  - [Human-based blind taste tests Chatbot arena](#human-based-blind-taste-tests-chatbot-arena)
  - [Eval Data Sets](#eval-data-sets)
  - [Grading the agent with smevals](#grading-the-agent-with-smevals)
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

### Grading the agent with smevals

Most eval tools, PromptFoo included, treat the unit under test as prompt in, completion out. That stops working once the thing I'm testing is an agent mutating a repo. [smevals](https://github.com/prime-radiant-inc/smevals) — Simon Willison's eval framework — handles this case: the Runner is any executable (so it can drive Claude Code or Codex in a working directory), and grading is decoupled from running (Runs are immutable records on disk, so I can re-grade old runs with a new Grader without paying for the runs again). Checkers are also just executables that share a workspace, so a check can run git diff or the project's own tooling instead of asking an LLM judge.

My first one: [smevals-blog-edit-evals](https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals). Every post on this blog keeps a generated table of contents, and what I actually care about when an agent edits a page is: did it make the change, did it regenerate the TOC, and did it leave everything else alone. Three deterministic checkers, no judge required:

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

Both Claude configs pass everything, including zero TOC churn on the trap task. The deliberately dumb Codex config (mini model, reasoning effort none, sandbox replaced by a pre-approved command allowlist since its bwrap sandbox can't spawn in my VM) broke the saturation: 3 of its 10 runs fail, and every failure is a give-up after the first blocked edit attempt - never a wrong edit. When it does act, the TOC and collateral checks stay clean. Which surfaces the real lesson: the permission envelope is part of the harness under test, not just the model.

The judge column is a second grader — an LLM judge scoring correctness, voice match, and scope from the diff — layered on after the fact, since decoupled grading re-scores old runs for free. It found the daylight the deterministic checks can't see: sonnet 0.99 vs haiku 0.96 (haiku gets docked for details like unspaced em-dashes on a page that uses spaced hyphens), while an empty diff short-circuits to 0 with no LLM call. Deterministic graders stay the gate; the judge adds the quality axis. Next variants: drop the CLAUDE.md hints, use full-size pages, make edits that span files.

The graders themselves get tested with a pair of mock runners — a known-good one that must always pass, and a sloppy one (skips the TOC regen, leaves a scratch file behind) that must always fail. If your checkers have never failed a bad run on purpose, you don't know that they work.

For a survey of the wider tool field — PromptFoo, Pydantic Evals, Inspect AI, and the SaaS tier — see [AI Eval Tools](/ai-eval-tools).

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

Have a judge give a subjective score.

Judges are subjective, so we can have multiple judges and average their answers - like we do in boxing matches or work performance reviews.

### Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks

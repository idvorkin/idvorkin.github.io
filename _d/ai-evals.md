---
layout: post
title: AI Evals
permalink: /ai-evals
redirect_from:
  - /evals
  - /ai-eval
ai_default_image: true
---

An eval is a scoring rule plus a test set: it turns each output into a number, across the cases you care about. The evals, then the training data, are [the moat; the prompt has no economic value](/ai-developer#3-your-secret-sauce-is-the-evals-then-the-training-data---your-prompt-has-no-economic-value). And once an eval is cheap, unambiguous, and aligned with what you actually want, it drives [eval-driven hill climbing](/hill-climbing#your-other-job-build-evals): the agent proposes variants, the eval keeps the winner, and you only look at the result, as long as the kept result is the best one, which [isn't a given](/ai-testing#drawing-the-mona-lisa-then-ruining-it). This page is the scoring half of [Testing AI](/ai-testing).

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [LLM as Judge](#llm-as-judge)
- [Eval Systems](#eval-systems)
  - [Human-based blind taste tests Chatbot arena](#human-based-blind-taste-tests-chatbot-arena)
  - [Eval Data Sets](#eval-data-sets)
  - [Grading the agent with smevals](#grading-the-agent-with-smevals)
  - [Confusion matrix, precision, and recall](#confusion-matrix-precision-and-recall)
- [Tools](#tools)
- [Graders in training](#graders-in-training)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## LLM as Judge

Fantastic post on using an [LLM as a judge](https://hamel.dev/blog/posts/llm-judge/).

This is the future, also [promptfoo supports this well](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/llm-rubric/).

## Eval Systems

The systems below are what make scoring cheap and repeatable.

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

Both Claude configs pass everything, including zero TOC churn on the trap task. The deliberately dumb Codex config (mini model, reasoning effort none, sandbox replaced by a pre-approved command allowlist since its bwrap sandbox can't spawn in my VM) broke the saturation: 3 of its 10 runs fail, and every failure is a give-up after the first blocked edit attempt - never a wrong edit. When it does act, the TOC and collateral checks stay clean. Which is [the harness point](/ai-testing#testing-the-model-bound-to-its-harness) in miniature — what failed was the permission envelope, not the model.

The judge column is a second grader — an LLM judge scoring correctness, voice match, and scope from the diff — layered on after the fact, since decoupled grading re-scores old runs for free. It found the daylight the deterministic checks can't see: sonnet 0.99 vs haiku 0.96 (haiku gets docked for details like unspaced em-dashes on a page that uses spaced hyphens), while an empty diff short-circuits to 0 with no LLM call. Deterministic graders stay the gate; the judge adds the quality axis. Next variants: drop the CLAUDE.md hints, use full-size pages, make edits that span files.

The graders themselves get tested with a pair of mock runners — a known-good one that must always pass, and a sloppy one (skips the TOC regen, leaves a scratch file behind) that must always fail. If your checkers have never failed a bad run on purpose, you don't know that they work.

### Confusion matrix, precision, and recall

A single pass rate hides the question I care about: which mistakes, and what do they cost? When the thing under test is a classifier (route this ticket, pick this intent), the tool is a confusion matrix. The idea comes from Steve Yegge's [The Counting House](https://steve-yegge.medium.com/the-counting-house-steve-yegge-83f5145cc35b) ([my notes](https://idvorkin-ai-tools.github.io/yegge-field-map/ai/the-counting-house.html)); the example below is made up. A support inbox, 1,000 tickets, four queues:

| Actual ↓ / Picked → | Outage | Billing | How-to  | Spam    | Recall |
| ------------------- | ------ | ------- | ------- | ------- | ------ |
| Outage              | **30** | 2       | 16      | 2       | 60%    |
| Billing             | 1      | **200** | 45      | 4       | 80%    |
| How-to              | 1      | 10      | **344** | 45      | 86%    |
| Spam                | 0      | 1       | 4       | **295** | 98%    |
| **Precision**       | 94%    | 94%     | 84%     | 85%     |        |

Rows are what the ticket really was; columns are what the model picked. The diagonal is right, and every other cell is one specific mistake.

- **Precision** reads down a column: when the model says outage, how often is that true? 30 of 32.
- **Recall** reads across a row: of the real outages, how many got called outages? 30 of 50.

You can max out either by cheating at the other: answer once and be right, or answer everything and miss nothing. Yegge's version of that:

> In short, high recall means you hit all the ducks, whereas high precision means you _only_ hit ducks.
>
> — [Steve Yegge, The Counting House](https://steve-yegge.medium.com/the-counting-house-steve-yegge-83f5145cc35b)

Each class fails its own way. Outage is cautious: 94% precision, but 2 in 5 outages slip past, 16 of them into the how-to queue. Spam is greedy: it catches 98% of spam, and takes 51 real tickets with it. How-to is the junk drawer: 65 of the 409 tickets it gets belong somewhere else.

Overall accuracy is 86.9%, and it hides the point: errors don't cost the same. Say a missed outage costs \$5,000 (a customer down for hours), a real ticket lost to spam \$100, a false page to on-call \$200, and any other misroute \$5. The 20 missed outages cost \$100k; the other 111 mistakes together cost \$5,600. So I pick the metric per class: recall near 100% on outages, even at the price of some false pages, and precision on spam, because a real ticket in the spam folder never gets answered. The bar isn't a fixed number either: Yegge scores the humans on the same gold set, and the model passes only if its error cost plus inference beats theirs plus labor.

## Tools

Which framework runs the evals (smevals, PromptFoo, Pydantic Evals, Inspect AI, and the SaaS tier) is its own survey: [AI Eval Tools](/ai-eval-tools).

## Graders in training

In post-training the eval becomes the grader (reward model), and the model is trained against it, so every blind spot gets exploited. How graders are built and gamed is in [Post-training LLMs](/ai-post-training#who-grades-the-answer).

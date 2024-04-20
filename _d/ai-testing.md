---
layout: post
title: Testing AI
permalink: /ai-testing
---

Testing math is easy, it's right or wrong. Test spelling is easy too, but testing if a joke is funny - now that's tough. Let's talk about how to test AI

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Concepts](#concepts)
    - [Tracing](#tracing)
    - [Testing across prompts](#testing-across-prompts)
    - [Testing across models](#testing-across-models)
- [Examples](#examples)
    - [Who is the funnier LLM](#who-is-the-funnier-llm)
    - [Who is the better git summarizer](#who-is-the-better-git-summarizer)
- [Eval Systems](#eval-systems)
    - [Human-based blind taste tests Chatbot arena](#human-based-blind-taste-tests-chatbot-arena)
    - [Eval Data Sets](#eval-data-sets)
- [Testing Theory](#testing-theory)
    - [Simplest form of testing](#simplest-form-of-testing)
    - [Wrinkle - A/B Testing](#wrinkle---ab-testing)
    - [Wrinkle - No Known Answer](#wrinkle---no-known-answer)
    - [Wrinkle - No clear questions](#wrinkle---no-clear-questions)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Concepts

### Tracing

I use LangSmith

### Testing across prompts

I use PromptFoo, but haven't really done this.

### Testing across models

1. PromptFoo - For heavy lifts
2. [https://nat.dev](https://nat.dev) - For ad-hoc experimentation
3. Just keep the output of both - The cheater's way

Here's an example, where I use multiple LLMs to generate output and just keep both.

For example here's the explanation of [My commit that does this](https://github.com/idvorkin/nlp/commit/674e73c6729cedc9a07cdad326c67ef8976601db)

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

One of my AI creations is an improv coach. A key requirement of said coach is that it is funny. How the heck can I tell if GPT3.5, GPT4, or Claude is funnier?

I found a package called PromptFoo, which is most of what I want

See the [code here](https://github.com/idvorkin/nlp/commit/9b5af637477099c6562c80f46ad2a3cec65d6c27), and you can interact with a [live file here](https://app.promptfoo.dev/eval/f:e66b7a20-67b1-4e78-a0bd-63a3f7f30f96/).

{% include blob_image.html src="/blog/promptfoo-3-things.webp" %}

### Who is the better git summarizer

You can see my PromptFoo test cases [here](https://github.com/idvorkin/nlp/blob/1ca6b3f85895b2684596c8957f0a0bd5a7a5d4f1/eval/commit/diff_commit.json?plain=1#L2f).

How to get the test case? I'd recommend recording a trace with LangSmith, then copy/export them from a LangChain trace and write to JSON (todo add a script for this)

And the output of the run [in PromptFoo](https://app.promptfoo.dev/eval/f:442e0857-efc0-408b-9a6d-c064ee7ae306).

Note, you can both assess these as a human, also have the LLM look at criteria

```yaml
tests:
  assert:
    - type: llm-rubric
      value: ensure the diff is described well
```

## Eval Systems

### Human-based blind taste tests Chatbot arena

The gold standard for what LLM is best is asking users to judge. [Chatbot Arena](https://chat.lmsys.org/?leaderboard) does this, from their paper:

_Large Language Models (LLMs) have unlocked new capabilities and applications; however, evaluating the alignment with human preferences still poses significant challenges. To address this issue, we introduce Chatbot Arena, an open platform for evaluating LLMs based on human preferences. Our methodology employs a pairwise comparison approach and leverages input from a diverse user base through crowdsourcing. The platform has been operational for several months, amassing over 240K votes. This paper describes the platform, analyzes the data we have collected so far, and explains the tried-and-true statistical methods we are using for efficient and accurate evaluation and ranking of models. We confirm that the crowdsourced questions are sufficiently diverse and discriminating and that the crowdsourced human votes are in good agreement with those of expert raters. These analyses collectively establish a robust foundation for the credibility of Chatbot Arena. Because of its unique value and openness, Chatbot Arena has emerged as one of the most referenced LLM leaderboards, widely cited by leading LLM developers and companies. Our demo is publicly available at \url{this https URL}._

Note, Elo rating is better than a straight rank. It's what's used in chess scores, TL;DR from GPT:

_The Elo rating system provides a more dynamic and precise measurement of a player's skill level compared to a strict ranking system. In a strict rank system, ranks are usually assigned based on the order of finish in competitions or through a simple win/loss record without considering the strength of the opponents. This can sometimes lead to misleading ranks when players have not played opponents of equal skill._

_The Elo system, however, adjusts a player’s rating based on the expected outcome of each game, taking into account the skill levels of the opponents. This means that beating a higher-rated player will gain you more points than beating a lower-rated one, and losing to a lower-rated player will cost you more points. As a result, the Elo rating is a more accurate reflection of a player's true skill level and provides a more nuanced understanding of how players compare to each other._

### Eval Data Sets

Building good "generic" eval data sets is hard, here are some:

- [Big Bench](https://github.com/suzgunmirac/BIG-Bench-Hard/tree/main) - a bunch of hard question prompts

## Testing Theory

### Simplest form of testing

Before testing:

- Come up with a list of tasks (questions) and answers

Test Time

- Have the system perform those tasks and write down the answer

Eval Time

- Check tasks against answers
- Print score

### Wrinkle - A/B Testing

Sometimes we want to see what

At test time

- Have both A and B attempt the task

Eval Time:

- See how did better A or B

### Wrinkle - No Known Answer

Sometimes there isn't a known answer - in that case, we can have a judge do the answers.

Eval Time:

Have a judge give a subjective score.

Judges are subjective, so we can have multiple judges and average their answers - like we do in boxing matches or work performance reviews

### Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks

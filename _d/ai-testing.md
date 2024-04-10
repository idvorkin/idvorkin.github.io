---
layout: post
title: Testing AI
permalink: /ai-testing
---

Testing math is easy, it's right or wrong. Test spelling is easy too, but testing if a joke is funny - now that's tough. Lets talk about how to test AI

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Concepts](#concepts)
    - [Tracing](#tracing)
    - [Testing across prompts](#testing-across-prompts)
    - [Testing across models](#testing-across-models)
- [Examples](#examples)
    - [Who is the funnier LLM](#who-is-the-funnier-llm)
    - [Who is the better git summarizer](#who-is-the-better-git-summarizer)
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

I use PromptFoo

### Testing across models

Easy trick, just keep the output of both. Here's an example, where I use multiple LLMs to generate output, and just keep both.

[My commit that actually does this](https://github.com/idvorkin/nlp/commit/674e73c6729cedc9a07cdad326c67ef8976601db)

Notice that claude does a better job getting the gist of it.

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

One of my AI creation is an improv coach. A key requriement of said coach is that it is funny. How the heck can I tell if GPT3.5, GPT4, or Claude is funnier?

I found a package called promptfoo, which is most of what I want

See the [code here](https://github.com/idvorkin/nlp/commit/9b5af637477099c6562c80f46ad2a3cec65d6c27), and you can interact with a [live file here](https://app.promptfoo.dev/eval/f:e66b7a20-67b1-4e78-a0bd-63a3f7f30f96/).

{% include blob_image.html src="/blog/promptfoo-3-things.webp" %}

### Who is the better git summarizer

## Testing Theory

### Simplest form of testing

Before testing:

- Come up with a list of tasks (questions) and answers

Test Time

- Have system perform those tasks and write down answer

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

Sometimes there isn't a known answer - in that case we can have a judge do the answers.

Eval Time:

Have a judge give a subjective score.

Judges are subjective, so we can have mulitple judges and average their answers - like we do in boxing matches, or work performance reveiws

### Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks

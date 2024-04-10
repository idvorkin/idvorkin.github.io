---
layout: post
title: Testing AI
permalink: /ai-testing
---

Testing math is easy, it's right or wrong. Test spelling is easy too, but testing if a joke is funny - now that's tough. Lets talk about how to test AI

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Who is the funnier LLM](#who-is-the-funnier-llm)
- [Testing Theory](#testing-theory)
    - [Simplest form of testing](#simplest-form-of-testing)
    - [Wrinkle - A/B Testing](#wrinkle---ab-testing)
    - [Wrinkle - No Known Answer](#wrinkle---no-known-answer)
    - [Wrinkle - No clear questions](#wrinkle---no-clear-questions)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Who is the funnier LLM

One of my AI creation is an improv coach. A key requriement of said coach is that it is funny. How the heck can I tell if GPT3.5, GPT4, or Claude is funnier?

I found a package called promptfoo, which is most of what I want

See the [code here](https://github.com/idvorkin/nlp/commit/9b5af637477099c6562c80f46ad2a3cec65d6c27), and you can interact with a [live file here](https://app.promptfoo.dev/eval/f:e66b7a20-67b1-4e78-a0bd-63a3f7f30f96/).

{% include blob_image.html src="/blog/promptfoo-3-things.webp" %}

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

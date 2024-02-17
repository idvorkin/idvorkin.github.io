---
layout: post
title: Testing AI
permalink: /ai-testing
---

Testing math is easy, it's right or wrong. Test spelling is easy too, but if an essay is good is much harder. Lets talk about how to test AI

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Testing Theory](#testing-theory)
    - [Simplest form of testing:](#simplest-form-of-testing)
    - [Wrinkle - A/B Testing](#wrinkle---ab-testing)
    - [Wrinkle - No Known Answer](#wrinkle---no-known-answer)
    - [Wrinkle - No clear questions](#wrinkle---no-clear-questions)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

# Testing Theory

## Simplest form of testing

Before testing:

- Come up with a list of tasks (questions) and answers

Test Time

- Have system perform those tasks and write down answer

Eval Time

- Check tasks against answers
- Print score

## Wrinkle - A/B Testing

Sometimes we want to see what

At test time

- Have both A and B attempt the task

Eval Time:

- See how did better A or B

## Wrinkle - No Known Answer

Sometimes there isn't a known answer - in that case we can have a judge do the answers.

Eval Time:

Have a judge give a subjective score.

Judges are subjective, so we can have mulitple judges and average their answers - like we do in boxing matches, or work performance reveiws

## Wrinkle - No clear questions

Before testing:

- Have an expert create a list of tasks

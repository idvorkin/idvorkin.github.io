---
layout: post
title: Testing and Quality
permalink: /testing
---If it's not tested, it doesn't work'.' When your tests passing lets you deploy without any concerns, your tests are good enough. Otherwise you've got more work to do

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Why test?](#why-test)
- [Types of tests](#types-of-tests)
    - [Acceptance Tests - Validation that requirements are met](#acceptance-tests---validation-that-requirements-are-met)
    - [End To End Tests - Expensive but critical](#end-to-end-tests---expensive-but-critical)
    - [Integration Tests - Correct interactions with external world](#integration-tests---correct-interactions-with-external-world)
    - [Snapshot Tests - Validating UX](#snapshot-tests---validating-ux)
    - [Unit Tests - The code does what the developer wants.](#unit-tests---the-code-does-what-the-developer-wants)
    - [Compiler and static analysis based testing](#compiler-and-static-analysis-based-testing)
- [Non-functional testing](#non-functional-testing)
    - [Performance](#performance)
    - [Thread safety](#thread-safety)
- [Testing in production and monitoring](#testing-in-production-and-monitoring)
    - [A/B Testing](#ab-testing)
    - [Operational Monitoring](#operational-monitoring)
    - [Inside out/Canary Testings](#inside-outcanary-testings)
- [To be categorized](#to-be-categorized)
    - [The role of a QA team](#the-role-of-a-qa-team)
    - [Cost of tests vs cost of development](#cost-of-tests-vs-cost-of-development)
    - [Cost to change the tests](#cost-to-change-the-tests)
- [Great books](#great-books)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Why test?

Software needs to work, and if it's not tested, it doesn't work. In the rare event it works today, I assure you it'll stop workign after you make a change. If you can't make a change safely, your system will go to shit instantly.

Very related to [design](/td/design)

- SOLID designs (OO joke there, haha!)
- Safe to refactor
- Always safe to deploy
- System is well documented

## Types of tests

### Acceptance Tests - Validation that requirements are met

### End To End Tests - Expensive but critical

Include running in multiple configurations, like different devices, or different browsers, or different screen orientations

### Integration Tests - Correct interactions with external world

### Snapshot Tests - Validating UX

### Unit Tests - The code does what the developer wants.

Back in the 2000s, "amazing developers" walked through all their code in the debugger to make sure it was doing what was expected. But like all manual activities this gets dreary, error prone and skipped. Instead, write unit tests to ensure your code works as you expect.

### Compiler and static analysis based testing

If you use a strongly typed language, and use types as much as you can, you get lots of testing for free from the compiler!
Similar, if you can have automated code analysis you get testing for free through analysis. See [AWS Code Guru](https://aws.amazon.com/codeguru/), and [some bugs it detects](https://noise.getoto.net/2021/09/07/finding-code-inconsistencies-using-amazon-codeguru-reviewer/)

_These bugs are the kinds of errors that developers can unknowingly introduce in the course of their day-to-day work. Introducing bugs is easy, but tracking down their root causes can be hard. Some of the bugs even found issues that went against the official documentation. One team found a race condition with the Java `ConcurrentHashMap` type; the documentation said it was thread-safe, but if two threads picked up the process at the same time, the values of instantiated `ConcurrentHashMap` objects could be overwritten._

_The first involved key derivation and password hashing using the Argon2 algorithm. Chan knew about password hashing, but not with the fairly new Argon2 algorithm. The second came from invoking a shell comment with `subprocess.Popen([cmd], shell=True)`, which could risk unwanted privilege escalation in the shell. Instead, he used the `shlex.split()` and `shlex.quote()` commands to avoid invoking a shell at all._

From Programming with types:

_Although a weak type system is easier to work with in the short term, as it doesn’t force programmers to explicitly convert values between types, it does not provide the same guarantees we get from a stronger type system. Most of the benefits described in this chapter and the techniques employed in the rest of this book lose their effectiveness if they are not properly enforced._

Examples:

- Making types for primitive types, like encoding units - E.g. a type for meters vs inches (space catastropy)
- A type for velocity vs volume.
- Rust for borrow
- JS to TS
- Pythong type system
- Implicit Typing vs Duck Typing
- It's hard to make it compiler, but once compiles it works.

## Non-functional testing

### Performance

### Thread safety

## Testing in production and monitoring

### A/B Testing

### Operational Monitoring

### Inside out/Canary Testings

## To be categorized

### The role of a QA team

### Cost of tests vs cost of development

### Cost to change the tests

## Great books

{%include amazon.html asin="B09782L692;B095C16LSW;1492052205" %}

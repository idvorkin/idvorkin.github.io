---
layout: post
title: Testing and Quality
permalink: /testing
---

If it's not tested, it doesn't work'.' When your tests passing lets you deploy without any concerns, your tests are good enough. Otherwise you've got more work to do

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Why test?](#why-test)
- [Types of tests](#types-of-tests)
    - [Acceptance Tests](#acceptance-tests)
    - [End To End Tests - Expensive but critical](#end-to-end-tests---expensive-but-critical)
    - [Snapshot Tests - Validating UX](#snapshot-tests---validating-ux)
    - [Integration Tests -](#integration-tests--)
    - [Unit Tests - The code does what the developer wants.](#unit-tests---the-code-does-what-the-developer-wants)
    - [Free compiler based testing](#free-compiler-based-testing)
- [Non-functional testing](#non-functional-testing)
    - [Performance](#performance)
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

### Acceptance Tests

### End To End Tests - Expensive but critical

### Snapshot Tests - Validating UX

### Integration Tests -

### Unit Tests - The code does what the developer wants.

Back in the 2000s, "amazing developers" walked through all their code in the debugger to make sure it was doing what was expected. But like all manual activities this gets dreary, error prone and skipped. Instead, write unit tests to ensure your code works as you expect.

### Free compiler based testing

If you use a strongly typed language, and use types as much as you can, you get lots of testing for free from the compiler

From Programming with types:

Although a weak type system is easier to work with in the short term, as it doesn’t force programmers to explicitly convert values between types, it does not provide the same guarantees we get from a stronger type system. Most of the benefits described in this chapter and the techniques employed in the rest of this book lose their effectiveness if they are not properly enforced.

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

## Testing in production and monitoring

### A/B Testing

### Operational Monitoring

### Inside out/Canary Testings

## To be categorized

### The role of a QA team

### Cost of tests vs cost of development

### Cost to change the tests

## Great books

{%include amazon.html asin="B095C16LSW;1492052205" %}

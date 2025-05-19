---
title: "Vibe Coding: Best Practices for Flow, Fun, and Results"
permalink: /vibe
---

Vibe coding is the name for letting the ai write your code. The magic lies in AI's ability to infer intent from vague input—say almost nothing, and it often gives you something surprisingly right. This works because you're granting it wide degrees of freedom; as long as you're flexible on the outcome, the model can generate plausible results from minimal cues. But that magic is fragile: on follow-up turns, or when you have a much tighter definition of correct, the inferred intent often changes, and the model applies a different set of constraints then you wanted or what it did previously, causing a cliff, or misery. Turns out this is the same as junior developers.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The fix: Specifications](#the-fix-specifications)
  - [Business logic: PRD/User Stories](#business-logic-prduser-stories)
  - [Which changes go where: Architecture](#which-changes-go-where-architecture)
  - [The "taste" of code: Clean Code Best Practices](#the-taste-of-code-clean-code-best-practices)
  - [The "readablity" of code: Language specific best practices](#the-readablity-of-code-language-specific-best-practices)
  - [The "environment" - Tool chains, CI/CD, Commit Hooks, etc](#the-environment---tool-chains-cicd-commit-hooks-etc)
- [The fix: Verification](#the-fix-verification)
  - [The long journey: optimizing verification](#the-long-journey-optimizing-verification)
  - [See testing](#see-testing)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

The key to making vibe coding as productive as possible is having spefications, and verification.

## The fix: Specifications

The key to success is specifying your many implicit constraints. And just like in real life, you don't know them all up, so build up the rules gradually. But I bet the learnings apply across projects so wwrite them out explicitly and then you can pply them to many projects.

### Business logic: PRD/User Stories

### Which changes go where: Architecture

### The "taste" of code: Clean Code Best Practices

### The "readablity" of code: Language specific best practices

### The "environment" - Tool chains, CI/CD, Commit Hooks, etc

## The fix: Verification

### The long journey: optimizing verification

### See testing

{%include summarize-page.html src="/ai-coder"%}

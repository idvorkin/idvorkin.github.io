---
layout: post
title: AI code writer
permalink: /ai-coder
---

AI code writing has had a few iterations: Code Completion; Out of Band Chat; Full Code Writing

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Completion](#completion)
    - [Co-pilot](#co-pilot)
- [Coder](#coder)
    - [Aider](#aider)
    - [Avante](#avante)
- [Use Cases](#use-cases)
    - [Diff Summarization](#diff-summarization)
    - [Review changes between dates](#review-changes-between-dates)
    - [Dream: Re-write commit history to break things into orthogonal changes](#dream-re-write-commit-history-to-break-things-into-orthogonal-changes)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Completion

### Co-pilot

The original

## Coder

### Aider

[Aider Release Notes on GitHub](https://github.com/paul-gauthier/aider/releases)

OK, so Aider tries to make every change its own commit, which is super noisy and error-prone, a few learnings:

1. Do the changes on a branch then squash up the final branch
2. You need to have unit tests, let Aider create them (I've got to figure out how to let it name them)

Here's [a change almost totally done with Aider](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

### Avante

[Avante on GitHub](https://github.com/yetone/avante.nvim?tab=readme-ov-file)

Just starting to play with [this](https://github.com/yetone/avante.nvim). It's a VIM plugin, looks solid.

What's nice: - It does a good job of inline changes/merging (like co-pilot propose diffs) - It uses many best practices so I discovered render and other nice libraries - Fun to see what the [coding prompts are](https://github.com/yetone/avante.nvim/blob/main/lua/avante/llm.lua)

## Use Cases

### Diff Summarization

### Review changes between dates

### Dream: Re-write commit history to break things into orthogonal changes

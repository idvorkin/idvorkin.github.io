---
layout: post
title: AI code writer
permalink: /ai-coder
---

Buckle up, code warriors! AI's grand adventure in the coding realm has been nothing short of a rollercoaster ride. Picture this: we started with humble code completion, like an eager puppy fetching snippets. Then, boom! We leveled up to out-of-band chat, where AI became our coding buddy, always ready for a brainstorming session. And now? Hold onto your keyboards, because we've hit the jackpot with full-blown code writing! It's like having a tireless robot assistant who can churn out entire functions faster than you can say "Hello, World!" This AI-powered journey has turned coding from a solo trek into a wild party where everyone's invited - from newbie coders to seasoned tech wizards. So, grab your favorite caffeinated beverage and join the fun - the future of coding is here, and it's got AI written all over it!

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Completion](#completion)
    - [Co-pilot](#co-pilot)
- [Coder](#coder)
    - [Cursor](#cursor)
    - [Aider](#aider)
    - [Avante](#avante)
- [Use Cases](#use-cases)
    - [Using latest docs](#using-latest-docs)
    - [Diff Summarization](#diff-summarization)
    - [Review changes between dates](#review-changes-between-dates)
    - [Dream: Re-write commit history to break things into orthogonal changes](#dream-re-write-commit-history-to-break-things-into-orthogonal-changes)
    - [Interesting thought about coding in the age of AI](#interesting-thought-about-coding-in-the-age-of-ai)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Completion

### Co-pilot

The original

## Coder

### Cursor

- [Cursor Changelog](https://changelog.cursor.com/)
- [Cursor Features](https://www.cursor.com/features)

WOW - Just started playing with that, it was fantastic, super smooth, looking forward to seeing if Avante can catch up.

It basically made this whole change via [chat/apply](https://github.com/idvorkin/idvorkin.github.io/commit/3fa1726f179c7270c5add3264b7087613039ad9e), with me making minimal suggestions

- Tab completion

  - includes the code before what you typed (huge improvement)
  - Finds the next line you likely want to change (great for sensing refactor)

- They forked VS.Code so could keep most of what it has.
- They use Claude, which seems to be better than co-pilot
- I used it mostly in chat/apply mode, looking forward to using it on a project where I'm writing more of the code (probably will try when I look at the transformer code in Jupyter again)
- You put in documentation tags to bring it, and it also does embeddings for it.

### Aider

[Aider Release Notes on GitHub](https://github.com/paul-gauthier/aider/releases)

OK, so Aider tries to make every change its own commit, which is super noisy and error-prone, a few learnings:

1. Do the changes on a branch then squash up the final branch
2. You need to have unit tests, let Aider create them (I've got to figure out how to let it name them)

Here's [a change almost totally done with Aider](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

### Avante

[Avante on GitHub](https://github.com/yetone/avante.nvim?tab=readme-ov-file)

Just starting to play with [this](https://github.com/yetone/avante.nvim). It's a VIM plugin, looks solid.

What's nice:

- It does a good job of inline changes/merging (like co-pilot propose diffs)
- It uses many best practices so I discovered render and other nice libraries
- Fun to see what the [coding prompts are](https://github.com/yetone/avante.nvim/blob/main/lua/avante/llm.lua)

## Use Cases

Not sure if this should be a separate post, but I'm going to start looking at this from the perspective of use cases.

### Using latest docs

Cursor has native support for indexing docs, some projects even have llm.txt to teach the LLM what it needs to know. [Fasthtml is an example](https://www.answer.ai/posts/2024-09-03-llmstxt)

### Diff Summarization

### Review changes between dates

### Dream: Re-write commit history to break things into orthogonal changes

### Interesting thought about coding in the age of AI

Two use cases:

1. Getting help - Replaces stack overflow/docs/reddit. This is like an evolution of the old days of before the internet, which sucked.
2. It writes the code - This is the fun part, that we'd do for a hobby, do we want to give that up? Using nvim Key Combos is like doing joystick combos in Street Fighter II - why would you want to give that up.

Similar, there are two reasons to program:

1. Cuz coding is just fun good for it's own sake mastery
1. To get something done and shipped

There's a natural tension here

{%include youtube.html src="mTa2d3OLXhg?start=5160" %}

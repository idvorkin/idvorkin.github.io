---
layout: post
title: "The AI Operator: Learning to Drive the Machine"
permalink: /ai-operator
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-cockpit.webp
tags:
  - ai
  - how
redirect_from:
  - /operator
---

Using AI well is a skill, like driving a car or operating heavy machinery. Nobody hands you the keys to a forklift and says "figure it out." There's a license, training, and hard-won intuition about what the machine can and can't do. AI is the same — except most of us skipped the training, there is no manual, and we're writing the rules as we go.

{% include blob_image_float_right.html src="blog/raccoon-cockpit.webp" %}

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [You Have a Finite Number of Thinking Tokens](#you-have-a-finite-number-of-thinking-tokens)
- [In the Loop vs. On the Loop](#in-the-loop-vs-on-the-loop)
- [What Operators Need to Know](#what-operators-need-to-know)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## You Have a Finite Number of Thinking Tokens

You've seen it in ChatGPT or Claude Code — hit the token limit and the quality falls off a cliff. The model starts forgetting context, repeating itself, missing things it would have caught ten minutes ago. Humans work the same way. You wake up with a finite budget of deep thinking, and every hard decision, every careful code review, every "wait, is this actually right?" burns through it. By 3pm, you're running on fumes.

Simon Willison [described this vividly](https://simonwillison.net/2026/Apr/2/lennys-podcast/) — running four agents in parallel left him "wiped out by 11 AM." _"There's a limit on human cognition regardless of how fast agents work."_ AI is supposed to make us more productive, but the people most AI-pilled are working harder than ever.

This matters for AI operators because the whole point of AI is to extend what you can accomplish in a day. But if you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've just traded one kind of exhaustion for another.

The operator skill: know which tasks deserve your precious thinking tokens and which ones you can safely delegate. Review the _output_, not the _process_.

## In the Loop vs. On the Loop

The military has real doctrine for this — in autonomous weapons and drone operations, ["human in the loop"](https://en.wikipedia.org/wiki/Human-in-the-loop) means a person approves each action, while "human on the loop" means the system acts but a person monitors and can intervene. AI operators face the same choice, and most of us are terrible at estimating which mode we're in.

**In the loop** — you're reading every line, approving every step. This is appropriate for:

- High-stakes decisions (deploying to prod, sending to customers)
- Tasks where you need to learn what the AI is doing
- Novel problems where the AI might go sideways

**On the loop** — you're checking results, not watching the process. This is appropriate for:

- Well-understood tasks you've delegated before
- Low-stakes exploration and drafting
- Parallel work across multiple agents

The trap: you _think_ you're on the loop (efficient, trusting), but you're actually _neither_ — half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment. The worst of both worlds.

The operator skill: consciously choose your mode. If you're in the loop, be fully in. If you're on the loop, define your checkpoints and then actually let go until you reach one.

## What Operators Need to Know

_This is a living document. As I learn more about operating AI well, I'll add to it._

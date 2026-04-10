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
- [You're Learning a New Skill — It Will Feel Slower](#youre-learning-a-new-skill--it-will-feel-slower)
- [Use Voice](#use-voice)
- [What Operators Need to Know](#what-operators-need-to-know)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## You Have a Finite Number of Thinking Tokens

You've seen it in ChatGPT or Claude Code — hit the token limit and the quality falls off a cliff. The model starts forgetting context, repeating itself, missing things it would have caught ten minutes ago. And when you hit it, you're done — stuck until the context window reopens. Humans work the same way. You wake up with a finite budget of deep thinking, and every hard decision, every careful code review, every "wait, is this actually right?" burns through it. By 3pm, you're running on fumes.

Simon Willison [described this vividly](https://simonwillison.net/2026/Apr/2/lennys-podcast/) — running four agents in parallel left him "wiped out by 11 AM." _"There's a limit on human cognition regardless of how fast agents work."_ AI is supposed to make us more productive, but the people most AI-pilled are working harder than ever.

This matters for AI operators because the whole point of AI is to extend what you can accomplish in a day. But if you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've just traded one kind of exhaustion for another.

The operator skill: know which tasks deserve your precious thinking tokens and which ones you can safely delegate. Review the _output_, not the _process_.

## In the Loop vs. On the Loop

The military has real doctrine for this — [DoD Directive 3000.09](https://en.wikipedia.org/wiki/Human-in-the-loop) on autonomous weapons defines ["human in the loop"](https://en.wikipedia.org/wiki/Human-in-the-loop) (a person approves each action) versus "human on the loop" (the system acts, a person monitors and can intervene). AI operators face the same choice, and most of us are terrible at estimating which mode we're in.

**In the loop** — you're reading every line, approving every step. It's a zillion times slower, but sometimes you have no choice. This is appropriate for:

- High-stakes decisions (deploying to prod, sending to customers)
- Tasks where you need to learn what the AI is doing
- Novel problems where the AI might go sideways
- Bootstrapping work where you lack degrees of freedom — getting auth working, nailing down a specific integration, anything where the AI can't iterate without your input

**On the loop** — you're checking results, not watching the process. This is appropriate for:

- Well-understood tasks you've delegated before
- Low-stakes exploration and drafting
- Parallel work across multiple agents

The trap: you _think_ you're on the loop (efficient, trusting), but you're actually _neither_ — half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment. The worst of both worlds.

The operator skill: consciously choose your mode. If you're in the loop, be fully in. If you're on the loop, define your checkpoints and then actually let go until you reach one.

## You're Learning a New Skill — It Will Feel Slower

Here's the thing nobody tells you: when you're learning to operate AI well, it _will_ feel harder than just doing the work yourself. That's not a sign you're doing it wrong — that's what learning a new skill feels like. The first time you drove a stick shift, you stalled at every light and your old automatic felt like a dream. The first time you typed on a Dvorak keyboard, QWERTY looked like a birthright.

Learning to operate AI is the same. Writing the prompt, reviewing the output, course-correcting, re-prompting — in the moment it feels slower than just banging out the code yourself. And for the specific task in front of you, it often _is_ slower. The win isn't in this task. It's in the next hundred tasks, when you've built the intuition for what to delegate and how, and you're running three agents in parallel while your old self would still be on task one.

You have to force yourself past the valley. Every time you catch yourself thinking "it'd be faster if I just did this myself," ask whether that's true for _this task_ or true because you haven't built the muscle yet. Usually it's the latter. Push through anyway.

## Use Voice

Try this: next time you're about to type out a prompt, hit the voice button instead and just talk. Brain dump the whole thing. What you're trying to do, what you've tried, what's bugging you, the constraint nobody told you about, the weird edge case you half-remember. Don't edit yourself. See what comes out.

You behave differently when you use voice, the same way you behave differently when you're talking to a person instead of writing them an email. Writing makes you compress, edit, prune. You leave out the context that "obviously" doesn't matter — and half the time it's the context that mattered most. Voice lets you ramble, and ramble is where the useful context lives.

The result is often weirdly different from what you would have typed. It's longer, messier, more honest, and — this is the punchline — it delegates better. The AI gets a fuller picture of what you actually want and why, so it stops guessing at the constraints you forgot to mention. You spend less time course-correcting a wrong-shaped answer because you gave it the right shape to start with.

The operator skill: when you're stuck staring at an empty prompt, don't try harder to write it. Talk it out.

## What Operators Need to Know

_This is a living document. As I learn more about operating AI well, I'll add to it._

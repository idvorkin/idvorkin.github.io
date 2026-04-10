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
- [You Need to Get On the Loop](#you-need-to-get-on-the-loop)
- [You're Learning a New Skill — It Will Feel Slower](#youre-learning-a-new-skill--it-will-feel-slower)
- [Use Voice](#use-voice)
- [Throw It Away](#throw-it-away)
- [You're a Compound Engineer](#youre-a-compound-engineer)
- [Keep Learning](#keep-learning)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## You Have a Finite Number of Thinking Tokens

You've seen it in ChatGPT or Claude Code — hit the token limit and the quality falls off a cliff. The model starts forgetting context, repeating itself, missing things it would have caught ten minutes ago. And when you hit it, you're done — stuck until the context window reopens. Humans work the same way. You wake up with a finite budget of deep thinking, and every hard decision, every careful code review, every "wait, is this actually right?" burns through it. By 3pm, you're running on fumes.

Simon Willison [described this vividly](https://simonwillison.net/2026/Apr/2/lennys-podcast/) — running four agents in parallel left him "wiped out by 11 AM." _"There's a limit on human cognition regardless of how fast agents work."_ AI is supposed to make us more productive, but the people most AI-pilled are working harder than ever.

This matters for AI operators because the whole point of AI is to extend what you can accomplish in a day. But if you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've just traded one kind of exhaustion for another.

The operator skill: know which tasks deserve your precious thinking tokens and which ones you can safely delegate. Review the _output_, not the _process_.

## You Need to Get On the Loop

Pay attention to which mode you're in — that's the whole game. The military has real doctrine for this: [DoD Directive 3000.09](https://en.wikipedia.org/wiki/Human-in-the-loop) on autonomous weapons defines ["human in the loop"](https://en.wikipedia.org/wiki/Human-in-the-loop) (a person approves each action) versus "human on the loop" (the system acts, a person monitors and can intervene). Every moment as an AI operator, one of those is true. Most of us have no idea which.

**The goal is to get on the loop.** In-the-loop is a zillion times slower, and it burns your thinking tokens on the _process_ instead of the _output_. You're there because you have to be, not because you want to be. The job isn't to stay in the loop doing careful work — the job is to figure out how to climb out.

You start in the loop when you have no choice:

- High-stakes decisions (deploying to prod, sending to customers)
- Novel problems where the AI might go sideways
- Bootstrapping work where you lack degrees of freedom — getting auth working, nailing down a specific integration, anything where the AI can't iterate without your input

Fine. Be fully in. Read every line. But while you're in, your real job isn't just to ship the task — it's to learn enough to climb out. What does "good" look like here? What are the guardrails? What checkpoints can I define? Once you can answer those, move up to on-the-loop: check results, not process. Define your checkpoints, let go between them, come back when the AI hits one. That's when the economics start working in your favor — parallel agents, delegated drafting, you directing instead of typing.

The trap: you _think_ you're on the loop (efficient, trusting), but you're actually _neither_ — half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment. The worst of both worlds. You pay the cost of supervision without getting the benefit of attention.

The operator skill: always know which mode you're in, and always be working your way up. If you're in, be fully in — and look for your exit. If you're on, define your checkpoints and actually let go. Never hover.

## You're Learning a New Skill — It Will Feel Slower

Here's the thing nobody tells you: when you're learning to operate AI well, it _will_ feel harder than just doing the work yourself. That's not a sign you're doing it wrong — that's what learning a new skill feels like. The first time you drove a stick shift, you stalled at every light and your old automatic felt like a dream. The first time you typed on a Dvorak keyboard, QWERTY looked like a birthright.

Learning to operate AI is the same. Writing the prompt, reviewing the output, course-correcting, re-prompting — in the moment it feels slower than just banging out the code yourself. And for the specific task in front of you, it often _is_ slower. The win isn't in this task. It's in the next hundred tasks, when you've built the intuition for what to delegate and how, and you're running three agents in parallel while your old self would still be on task one.

You have to force yourself past the valley. Every time you catch yourself thinking "it'd be faster if I just did this myself," ask whether that's true for _this task_ or true because you haven't built the muscle yet. Usually it's the latter. Push through anyway.

## Use Voice

Try this: next time you're about to type out a prompt, hit the voice button instead and just talk. Brain dump the whole thing. What you're trying to do, what you've tried, what's bugging you, the constraint nobody told you about, the weird edge case you half-remember. Don't edit yourself. See what comes out.

You behave differently when you use voice, the same way you behave differently when you're talking to a person instead of writing them an email. Writing makes you compress, edit, prune. You leave out the context that "obviously" doesn't matter — and half the time it's the context that mattered most. Voice lets you ramble, and ramble is where the useful context lives.

The result is often weirdly different from what you would have typed. It's longer, messier, more honest, and — this is the punchline — it delegates better. The AI gets a fuller picture of what you actually want and why, so it stops guessing at the constraints you forgot to mention. You spend less time course-correcting a wrong-shaped answer because you gave it the right shape to start with.

The operator skill: when you're stuck staring at an empty prompt, don't try harder to write it. Talk it out.

## Throw It Away

When the AI goes in the weeds, throw it away. Start over. You already got the expensive part — the _learning_ — and the code itself was basically free to generate. The next attempt will be better because you know more now.

This is harder than it sounds, because we're all trained on the old economics. In the old world, code was precious. You wrote every line yourself, you debugged it for an hour, you argued about it in a PR. Of course you got attached. Throwing away two hours of work hurt because those two hours were _expensive_ — you burned real thinking tokens on them.

In AI land, the economics flipped. The code is cheap; the thinking is expensive. If the AI spent 30 seconds generating 400 lines that went sideways, those 400 lines cost you almost nothing to produce — but they'll cost you a _lot_ to untangle. Delete them. Re-prompt with what you learned. The new attempt, informed by what went wrong, will usually land faster than the salvage operation would have.

The operator skill: watch for the sunk cost reflex. When you catch yourself trying to rescue a bad generation instead of re-running it, that's the old economics talking. Listen to the new economics instead: throw it away, it's free.

## You're a Compound Engineer

Every session with the AI teaches you something — a prompt shape that worked, a constraint you forgot to specify, a place the AI kept going sideways until you spelled out the obvious thing. The operators who get dramatically better over time are the ones who _capture_ those learnings instead of letting them evaporate. The ones who don't are running the same mistakes on loop.

This is compound engineering. You're not just shipping the task in front of you; you're investing in the operator you'll be next month. Every retro, every updated CLAUDE.md, every new skill, every workflow you codify is a deposit, and the interest compounds. Six months in, the gap between an operator who journals their learnings and one who doesn't is enormous.

**Do retros.** At the end of a session — or at least at the end of a week — look back and ask the one question that matters most: _where did I get stuck in the loop?_ What did I have to re-explain three times before the AI got it? Where did I hover because I didn't trust the output? That friction is gold. It's pointing at exactly what your next iteration should fix.

**Update your CLAUDE.md.** Whatever you had to re-explain three times, put it in the instructions so you never have to explain it again. The `claude-md-improver` skill exists for exactly this — it audits your CLAUDE.md against session learnings and folds them in, so next time the AI already knows.

**Upgrade your skills and workflows.** A prompt you ran twice is a prompt that should become a skill. A checklist you followed by hand is a workflow. The second time you do something manually, you're leaving compound interest on the table.

The operator skill: treat every in-the-loop moment as a signal, not a setback. The place you got stuck today is the place you're about to automate away tomorrow — and _that_ is how you climb out of the loop for good.

## Keep Learning

_This is a living document. As I learn more about operating AI well, I'll add to it._

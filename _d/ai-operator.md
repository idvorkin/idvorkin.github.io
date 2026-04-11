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

The meta-skill is _always be learning and improving_. Operating AI is a new skill, and like any new skill it feels slower than the old way at first. The first time you drove a stick shift, you stalled at every light and your old automatic felt like a dream. Operating AI is the same: in the moment it feels slower, and for the task in front of you it often _is_ slower. The win isn't in this task — it's in the next hundred, when you've built the intuition and you're running three agents in parallel while your old self would still be on task one.

The operators who get better aren't the ones who just practice. They're the ones who capture what they learned, fold it into how they work, and show up tomorrow a little sharper than yesterday. The rest of this post is the methods I use to do that.

{% include blob_image_float_right.html src="blog/raccoon-cockpit.webp" %}

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [You Have a Finite Number of Thinking Tokens](#you-have-a-finite-number-of-thinking-tokens)
- [You Need to Get On the Loop](#you-need-to-get-on-the-loop)
- [You Need to Use Voice](#you-need-to-use-voice)
- [You Can Throw It Away](#you-can-throw-it-away)
- [You're a Compound Engineer](#youre-a-compound-engineer)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## You Have a Finite Number of Thinking Tokens

You've had this happen. You're in the middle of making changes — momentum, focus, real progress — and the AI hits its token limit. "Start a new conversation," it says. The context you'd been building together is gone. You're stuck until the window resets.

Now imagine that's your brain. Because it is. You wake up with a finite budget of deep thinking — your own context window — and every hard decision, every careful code review, every "wait, is this actually right?" burns through it. By 10am you're sharp. By 3pm the model in your skull starts forgetting context, repeating itself, missing things it would have caught in the morning. By evening you're done. You're stuck until sleep resets you.

Simon Willison [said it plainly](https://simonwillison.net/2026/Apr/2/lennys-podcast/): running four agents in parallel left him "wiped out by 11 AM." _"There's a limit on human cognition regardless of how fast agents work."_ AI is supposed to make us more productive, but the people most AI-pilled are working harder than ever.

The point of AI is to extend what you can get done in a day. If you spend your thinking tokens _supervising_ the AI instead of _directing_ it, you haven't saved anything — you've traded one kind of exhaustion for another. The rest of this post is how to actually spend them right.

## You Need to Get On the Loop

Working with an AI agent always looks the same: there's a loop. The AI tries something. Something checks whether it worked. If not, adjust and try again. Repeat until it's good. Coding, writing, anything — every interaction with an agent is some version of try → check → fix → try.

The question is who's doing the checking. When you're _in_ the loop, that's you. You're reading every line, running the tests yourself, watching each step, deciding whether to keep going or course-correct. When you're _on_ the loop, the AI does the checking — it runs its own tests, validates its own output, decides what to fix — and you do the final review when it hits a checkpoint you defined.

Pay attention to which mode you're in. That's the whole game. The military has real doctrine for this: [DoD Directive 3000.09](https://en.wikipedia.org/wiki/Human-in-the-loop) on autonomous weapons defines ["human in the loop"](https://en.wikipedia.org/wiki/Human-in-the-loop) (a person approves each action) versus "human on the loop" (the system acts, a person monitors and can intervene). Every moment as an AI operator, one of those is true. Most of us have no idea which.

**The goal is to get on the loop.** In-the-loop is a zillion times slower, and it burns your thinking tokens on the _process_ instead of the _output_. You're not in the loop because you want to be — you're in the loop because you haven't figured out how to get out yet. That's the real job: figure out how to get out.

You start in the loop when you have no choice:

- High-stakes decisions (deploying to prod, sending to customers)
- Novel problems where the AI might go sideways
- Bootstrapping work where you lack degrees of freedom — getting auth working, nailing down a specific integration, anything where the AI can't iterate without your input

Fine. Be fully in. Read every line. But while you're in, your real job isn't just to ship the task — it's to learn enough to climb out. What does "good" look like here? What are the guardrails? What checkpoints can I define? Once you can answer those, move up to on-the-loop: check results, not process. Define your checkpoints, let go between them, come back when the AI hits one. That's when the economics start working in your favor — parallel agents, delegated drafting, you directing instead of typing.

The trap: it's easy to slip into the loop without noticing. You'll think you're on the loop (efficient, trusting), but you're actually _neither_ — half-watching, catching nothing, burning thinking tokens on anxiety instead of judgment. You pay the cost of supervision without the benefit of attention. So keep checking which side you're on. If you can't answer it instantly, you've already drifted.

The operator skill: always know which mode you're in, and always be working your way up. If you're in, be fully in — and look for your exit. If you're on, define your checkpoints and actually let go. Never hover.

## You Need to Use Voice

You've had this moment. You're typing out a long email to get someone to do something — explaining the request for the third time after some back-and-forth, watching the miscommunication compound — and you stop and think: _oh, I should just call them._ Two minutes on the phone solves what twenty minutes of email couldn't.

The same thing happens with AI agents. Voice changes how you communicate. When you talk you ramble, you backfill, you mention the constraint that "obviously" doesn't matter — and half the time it's the constraint that mattered most. Writing makes you compress, edit, prune. The result: when you type, the AI is solving the problem you wrote down; when you talk, the AI is solving the problem you actually have.

Three things to do every time:

- **Use voice.** Don't type. Hit the mic and brain dump.
- **Share intent.** Not just the immediate ask — what you're actually trying to accomplish, and why.
- **Share success criteria.** How will you know it landed? What does "done right" look like?

Do those three and the AI stops guessing at the constraints you forgot to mention. You spend less time course-correcting in the loop because you gave the AI the right shape to start with. Next time you're stuck staring at an empty prompt, don't try harder to write it. Talk it out.

## You Can Throw It Away

When the AI drives off course, throw it away. Start over. You already got the expensive part — the _learning_ — and the code itself was basically free to generate. The next attempt will be better because you know more now.

This is harder than it sounds, because we're all trained on the old economics. In the old world, code was precious. You wrote every line yourself, you debugged it for an hour, you argued about it in a PR. Of course you got attached. Throwing away two hours of work hurt because those two hours were _expensive_ — you burned real thinking tokens on them.

In AI land, the economics flipped. The code is cheap; the thinking is expensive. If the AI spent 30 seconds generating 400 lines that went sideways, those 400 lines cost you almost nothing to produce — but they'll cost you a _lot_ to untangle. Delete them. Re-prompt with what you learned. The new attempt, informed by what went wrong, will usually land faster than the salvage operation would have.

Worse, rescuing a bad generation is a trap: it pulls you line-by-line back into the loop, burning thinking tokens you can't afford on code the AI could regenerate for free.

Watch for the sunk cost reflex. When you catch yourself trying to rescue a bad generation instead of re-running it, that's the old economics talking. Throw it away. It's free.

## You're a Compound Engineer

Every session with the AI teaches you something — a prompt shape that worked, a constraint you forgot to specify, a place the AI kept going sideways until you spelled out the obvious thing. The operators who get better over time are the ones who _capture_ those learnings instead of letting them evaporate. The ones who don't are running the same mistakes on loop.

This is compound engineering. You're not just shipping the task in front of you; you're investing in the operator you'll be next month. Every retro, every updated CLAUDE.md, every new skill, every workflow you codify is a deposit, and the interest compounds. Six months in, the gap between an operator who keeps a logbook and one who doesn't is enormous.

**Do retros.** At the end of a session — or at least a week — look back and ask one question: _where did I get stuck in the loop?_ What did I have to re-explain three times before the AI got it? Where did I hover because I didn't trust the output? Those moments are pointing at exactly what your next iteration should fix.

**Update your CLAUDE.md.** Whatever you had to re-explain three times, put it in the instructions so you never have to explain it again. [Mine lives in `chop-conventions`](https://github.com/idvorkin/chop-conventions), and it grows every week. The `claude-md-improver` skill audits your CLAUDE.md against session learnings and folds them in, so next time the AI already knows.

**Upgrade your skills and workflows.** A prompt you ran twice is a prompt that should become a skill. A checklist you followed by hand is a workflow. Two examples from my own stack: [`show-your-work`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/show-your-work/SKILL.md) started as "screenshot the changed blog pages and host them on a gist for the PR description," which I kept typing by hand. [`walk-the-store`](https://github.com/idvorkin/idvorkin.github.io/blob/main/.claude/skills/walk-the-store/SKILL.md) started as "do a full visual walkthrough of the blog to catch regressions." Both used to be 10-minute manual chores. Now they're one word. The second time you do something manually, you're leaving compound interest on the table.

The operator skill: treat every in-the-loop moment as a signal, not a setback. The place you got stuck today is the place you're about to automate away tomorrow — and _that_ is how you climb out of the loop for good.

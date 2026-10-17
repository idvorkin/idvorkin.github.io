---
layout: post
title: "AI Native Onboarding: Your First 90 Days"
permalink: /ai-native-onboarding
tags:
  - ai
  - software engineering
  - career
redirect_from:
  - /ai-onboarding
  - /first-90-days
  - /ai-native-90-days
ai_default_image: true
---

The first 90 days at a new job are the highest-leverage stretch of your whole tenure. You form the habits, the relationships, and the mental model you'll run on for years. AI doesn't change why those days matter — but it changes almost everything about how you spend them. And it adds a twist nobody warns you about: you're not onboarding alone anymore. You're onboarding yourself _and_ a whole team of AI agents that will work this codebase right alongside you — and the same effort ramps up all of them at once.

{% include ai-slop.html percent="90" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [You're Onboarding a Whole Team](#youre-onboarding-a-whole-team)
- [What Doesn't Change](#what-doesnt-change)
- [Day 0–30: Learn](#day-030-learn)
  - [The Learning Plan Is the Unlock](#the-learning-plan-is-the-unlock)
  - [Onboard Your Agent While You Onboard Yourself](#onboard-your-agent-while-you-onboard-yourself)
  - [What Still Has to Be Human](#what-still-has-to-be-human)
- [Day 30–60: Contribute](#day-3060-contribute)
  - [Your First PR Can Be Bigger — and That's the Trap](#your-first-pr-can-be-bigger--and-thats-the-trap)
  - [The Newcomer's Real Superpower](#the-newcomers-real-superpower)
- [Day 60–90: Own](#day-6090-own)
  - [The Compounding Pays Off](#the-compounding-pays-off)
  - [Judgment Is the Job](#judgment-is-the-job)
- [The One Thing to Get Right](#the-one-thing-to-get-right)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include alert.html content="These are my personal opinions, not those of any employer, past or present. No one knows the future, especially me." style="warning" %}

## You're Onboarding a Whole Team

Here's the shift nobody puts in the onboarding doc: when you join a team today, you're not the only new hire showing up. You're ramping up yourself — building the mental model of how this system works, who owns what, where the bodies are buried — and you're ramping up a whole roster of AI agents, each of which knows everything about software in general and nothing about _your_ codebase in particular. One mind, many: your AI team starts its first day the same day you do.

The good news is it's one job, not two. Every time you figure out how something really works and write it down, you onboard everyone at once — yourself, and every agent session you'll ever spin up. Your `CLAUDE.md` isn't a chore for later — it's the onboarding notebook the whole team reads. Steve Yegge calls agent priming "onboarding" on purpose; the docs that stop your agents from inventing [heresies](/ai-native-vocab#heresies) about your system are the same docs that would have saved _you_ a week of confusion.

So the reframe for your first 90 days: don't just learn the system, capture what you learn in a form your team can read. You're writing the onboarding guide you wish you'd been handed — and your agents get to use it immediately.

## What Doesn't Change

Before the AI parts, be clear about what's identical, because it's most of it. The intent of the first 90 days is the high-order bit, and it doesn't change — what changes is the mechanics. The goals are exactly what they always were:

- **Build trust.** People need to believe you'll do what you say and won't break things carelessly.
- **Learn the system.** The architecture, the data, the deploy path, the failure modes.
- **Learn the people.** Who decides, who knows, who to ask, what the unwritten rules are.
- **Ship something real.** Nothing builds credibility like landing a change that matters.

AI doesn't retire a single one of these. It changes how fast you hit some of them, and which ones it can't touch at all. Same intent, new mechanics — that's the lens for everything below, sometimes with no change at all.

## Day 0–30: Learn

### The Learning Plan Is the Unlock

This is where AI changes the most. The old first month was a slow drip: read the wiki (out of date), read the code (no context), wait for a senior engineer to have 30 minutes free, ask your question, wait again.

Now the codebase is an interactive tutor that never gets annoyed. Point an agent at the repo and ask the questions you'd have been too embarrassed to ask a person for the fifth time: "Walk me through what happens when a request hits the auth service." "Where does this config actually get read?" "Draw me the data flow for checkout." You can ask infinite naive questions and burn zero of anyone's goodwill.

Take it past Q&A. Have the agent build you an [explainer](/explainers) — an interactive, step-through visualization of the subsystem you're trying to understand. If it can't explain the thing clearly, that's a signal _you_ don't understand it yet either, and you know where to dig next.

One caution: the agent is [out of distribution](/ai-native-vocab#in-distribution) on your internal systems. It knows Postgres cold and your weird internal deploy tool not at all. Its confident answer about your code might be a [heresy](/ai-native-vocab#heresies) — a plausible, wrong belief. Treat its explanations as leads to verify, not gospel. Early on you can't tell a correct answer from a confident hallucination, so check the load-bearing ones against the actual code or a human.

### Onboard Your Agent While You Onboard Yourself

Every answer you verify is a candidate for the `CLAUDE.md`. Learned the hard way that the staging database is shared and you shouldn't run migrations against it? That's a line in the priming file. Found out the real name for the thing everyone calls "the widget service"? Write it down so your agent stops inventing [idle polecats](/ai-native-vocab#heresies).

This is the highest-leverage habit of your first month, and almost nobody does it. You arrive with the one thing the existing team has lost: fresh eyes. You can see exactly which assumptions are unwritten, because you don't hold them yet. Capture that confusion before it fades — for yourself, for your agent, and for the next person who joins.

### What Still Has to Be Human

AI will not build your relationships. It won't read the room in a planning meeting, won't tell you that the staff engineer's "interesting idea" means no, won't earn you the benefit of the doubt the first time you break the build. The social and political map of a team is learned by paying attention to humans, and it's still the part that most determines whether your 90 days go well.

Spend the time AI gives you back right here. If the agent compressed your codebase ramp from three weeks to one, put the other two weeks into conversations, not more reading.

## Day 30–60: Contribute

### Your First PR Can Be Bigger — and That's the Trap

With an agent, your first real contribution can be more ambitious than the traditional "fix a typo, learn the deploy pipeline" starter task. That's good. The trap is shipping code you don't understand into a codebase you don't understand — [cognitive debt](/ai-native-vocab#cognitive-debt) squared. A team's tolerance for "the AI wrote it and CI passed" from a three-week-old hire is very low, and rightly so.

Stay firmly [human in the loop](/ai-native-vocab#human-in-on-and-out-of-the-loop) here — more than you will later. Read every line the agent produces for your PRs. You're not only checking correctness, you're using the PR as a forcing function to actually learn the code. A PR you can't explain in review is a PR you shouldn't open yet.

### The Newcomer's Real Superpower

You're the one person on the team who's _supposed_ to ask dumb questions, and AI lets you ask them at volume without taxing anyone. Split the channels deliberately: ask the agent the questions with a checkable answer ("how does this function work"), and save your human colleagues for the ones without ("why did we pick this over the obvious alternative" — usually a story the agent wasn't around for).

This is also where [agency](/ai-native-vocab#agency) starts to show. The newcomer who spots a problem, drafts a fix with AI, verifies it, and brings a real proposal stands out enormously from the one who waits for tickets. AI didn't create that gap — it just made it wider.

## Day 60–90: Own

### The Compounding Pays Off

By now the priming you've been writing all along is doing real work. Your agents know your conventions, your gotchas, the real names for things. They're roughly as onboarded as you are — because you onboarded them as you went. The hire who skipped this is still re-explaining the same context to a blank session every morning.

This is the month to look for leverage beyond your own tasks. The first automation or tool you build for the _team_ — the [Toolsmith](/ai-native-manager#divide-and-conquer) move — is often a better 90-day capstone than another feature. It says you understand the system well enough to improve how everyone works in it.

### Judgment Is the Job

The thing AI still can't hand you is judgment about _this_ system — what's safe to change, what's load-bearing, what looks wrong but is wrong on purpose. That's the difference between a senior engineer and a junior one in the AI era, and it's earned, not prompted. Ninety days in, you should be starting to have it. That's the real graduation: not that you can produce code (the agents could do that on day one) but that you can tell a good change from a dangerous one in a system you now actually understand.

## The One Thing to Get Right

If you take one habit from all this: **treat onboarding yourself and onboarding your agents as a single task.** Learn how the system really works, and write down what you learn where your team can use it. Do that, and by day 90 you'll have a roster of agents that know your codebase — and so will you. Better still, those same notes onboard the _next_ person and their agents almost for free: the work you did to ramp yourself becomes the thing that ramps everyone after you. The notes are the [integral](/ai-journal#ai-value-capture---its-the-integral-not-the-point), not the point: small captures every day that compound into something neither you nor your team could have built in a single sprint.

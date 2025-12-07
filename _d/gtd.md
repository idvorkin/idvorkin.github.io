---
layout: post
title: "Getting things done"
comments: true
tags:
  - how igor ticks
permalink: /gtd
redirect_from:
  - /getting-things-done
---

Getting Things Done (GTD) is a model based on David Allen's book of the same name. It's a deep dive into Habit 3 - first things first, with some lite weight Habit 2 - begin with the end in mind, mixed in for good measure. By using GTD religiously you can have a drastic reduction in stress and procrastination.

{% include amazon.html asin="0143126563" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Theory](#theory)
    - [Open loops and Psychic Weight](#open-loops-and-psychic-weight)
    - [Activation Energy and Procrastination](#activation-energy-and-procrastination)
    - [Thinking vs Doing Next Actions](#thinking-vs-doing-next-actions)
- [Practices](#practices)
    - [Capture](#capture)
    - [Triage - Drop; Do; Delegate; Defer](#triage---drop-do-delegate-defer)
    - [Power Hour - Grind](#power-hour---grind)
    - [Weekly Review](#weekly-review)
- [Software](#software)
    - [OmniFocus](#omnifocus)
    - [Nozbe](#nozbe)
    - [Flow](#flow)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Theory

### Open loops and Psychic Weight

Open loops are caused by your brain continuing to think of an open issue when you don't want it to. Open loops are [psychic weight](/psychic-weight) and are a great source of [anxiety](/anxiety). By getting your open-loops capture into a system your brain trusts, your brain can stop thinking about this.

### Activation Energy and Procrastination

### Thinking vs Doing Next Actions

It's easy to [procrastinate](/procrastinate) when the next action isn't clear

## Practices

### Capture

Your brain is terrible at remembering stuff, often forgetting the important, and dwelling on the un-actionable. As soon as a thought/task comes in, add it to your inbox

### Triage - Drop; Do; Delegate; Defer

All incoming tasks should handled by one of the four workflows and ignored from that point forward:

- Drop - Best case :) See [Essentialism](/essentialism) and [the dip](/dip)
- Do - If it takes less than 2 minutes, [get it done](/frog). Otherwise the overhead is too high.
- Delegate - Get someone else to do it, [outsourcing](/outsourcing) is great.
- Defer - Convert it into a "next action", words you'll understand later context free, and add it to a project

### Power Hour - Grind

When you get a reasonable chunk of time, crack open a project, and grind through the next actions.

### Weekly Review

To make sure your brain trusts the system, and doesn't [recreate open loops](/idle-loop), it needs to know what's in your system will be good and not lost. Use a weekly review to go through your projects and see if anything needs to be done urgently.

## Software

Here's some software that I've used. None is perfect for me (I'm not sure what would be perfect), which is a shame. I think the best advice I have is, it doesn't matter what you use, it matters that you use it. I'll tell you when I find my perfect system.

### OmniFocus

Primarily Apple, and incredibly complicated (aka powerful). The complexity is easy to get lost in, but really nice UX, and lots of good features. It has a web interface, but it's amazing on the mac, less so on Windows.

### Nozbe

Multiplatform was best in class in 2012 when it was created, but hasn't had many upgrades since. I used it for years.

### Flow

[Flow](https://www.flow.app/) is a minimalist focus timer that helps enforce timeboxing and single-tasking. It provides two key values:

**Obvious**:

- You force yourself to not get distracted by working on other stuff - by naming your current task, you stay focused on one thing
- You force yourself to work the minimum time before stopping

**Non-obvious**:

- You force yourself to notice how long you are spending (which can be a long time when sucked into flow, both on things I'm doing [chop](/chop), but also on pointless tasks like re-writing a paragraph over and over)
- You force yourself to decide what you are working on, causing prioritization

**Cool Features**:

- Stays synchronized between watch, phone and desktop
- Writes flows to your calendar for future tracking

**Cool Features I've Added**:

- Integration with [tmux](https://github.com/idvorkin/settings/blob/4dbfa4720748053b9b6213dbc34ffe62e89fd015/shared/.tmux.conf?plain=1#L148)
- Integration with Alfred and [CLI tools](https://github.com/idvorkin/settings/blob/4dbfa4720748053b9b6213dbc34ffe62e89fd015/py/y.py?plain=1#L683)

![Terminal screenshot showing tmux session management with flow-rename command "Add Flow To Blog" - demonstrating integration between GTD workflow and command-line tools for productivity](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250311_064458.webp)

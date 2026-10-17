---
layout: post
title: "What's Left in Engineering?"
permalink: /whats-left
tags:
  - ai
  - software engineering
redirect_from:
  - /whats-left-in-engineering
ai_default_image: true
---

If the agent writes the code, reviews the code, and merges the code, what's left for me? I keep landing on two jobs. One: how fast can I iterate on the job to be done and the feedback from the app? Two: how do I keep the code I never look at in a state where agents can keep changing it without breaking stuff? The second one isn't about code quality. And I already had a name for it, from a post I wrote long before agents existed.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Job 1: Iterate on the job to be done](#job-1-iterate-on-the-job-to-be-done)
- [Job 2: Keep the code changeable by agents](#job-2-keep-the-code-changeable-by-agents)
  - [The bar moved](#the-bar-moved)
  - [What the bar actually demands](#what-the-bar-actually-demands)
- [This is what architecture was always for](#this-is-what-architecture-was-always-for)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Job 1: Iterate on the job to be done

The code was never the point. Somebody hires the app to do a job - that's the jobs-to-be-done framing - and the only question that matters is whether the app does the job. When building was expensive, we spent most of our time on the building and called the job "requirements." Now building is close to free, and the loop that's left is: guess the job, ship, watch what people actually do, adjust.

Watch what people do, not what they say. [Desire paths](/product#desire-paths-a-methodology-for-discovering-revealed-preferences) - the worn trails that show up where people walk instead of where the planner drew the sidewalk - are the whole method. The app's feedback is the worn grass: the logs, the feature nobody touches, the workaround everyone uses. The speed of that loop is the thing to optimize now, and the loop is mostly not code.

The uncomfortable corollary is that assessment becomes the bottleneck. If one person can run [200 times the projects](/how-igor-chops#what-happens-when-execution-is-no-longer-the-bottleneck), nobody has 200 times the attention to judge them. Which is why [evals](/ai-testing) matter so much: once the job is written down as a scoring function, the agent can [hill-climb](/hill-climbing) toward it while I look at the result, not the diff.

<!-- TODO(igor): your story. One app where the JTBD/feedback loop was fast, or one where it wasn't and you shipped the wrong job for a month. Swing analyzer? Stack picker? -->

## Job 2: Keep the code changeable by agents

### The bar moved

Most of the code in my projects is dark: I don't read it. Reviewing agent output costs more human time than the agent spent producing it, so human review of every line stopped being a thing a while ago. That changes what "good code" means. The old bar was "would a senior engineer be happy reading this?" The new bar is: **can the next agent make a change here without breaking something it can't see?**

That's not code quality. Pretty code with no tests fails this bar. Ugly code with sharp tests and tight seams passes it. Code quality was always a proxy for changeability, something humans could eyeball because the real thing was hard to measure. Now I can measure the real thing directly: the agent made a change, did anything break?

I know what failing looks like. I looked up one day and an agent had built [two complete UIs for my swing analyzer](/dark-factory#complexity-collapse), one in React and one in jQuery. Nothing a test would catch; the system had just lost its center. Every change after that broke something somewhere else. That's the [progress limit](/dark-factory#limit-2-progress-the-one-they-miss) on a dark factory, and job 2 is the work of staying on the right side of it.

### What the bar actually demands

The things that keep an agent from breaking stuff are the boring ones, and none of them are "write nicer code":

- **Tests the agent runs, not tests I run.** [Tests as the specification](/how-igor-chops#what-works-well---review-this-weekly): the clearer the tests, the less I intervene. If the agent writes the code and I do the manual testing, I've hired myself as the junior tester. The [SDETs were ahead of their time](/how-igor-chops#revenge-of-the-sdet).
- **Contracts at the seams.** Small modules with explicit interfaces, so a change has a bounded blast radius and the agent only has to hold one piece in its head. The seams are what let an agent that has never seen the repo work in it safely.
- **The system says when it's broken.** Nobody is watching, so a silent failure is a permanent one. Loud errors, logs the agent can read, a health check it can run before it declares victory.
- **Conventions as code.** The [CLAUDE.md and conventions repo](/how-igor-chops#the-chop-conventions-repo) are the rules this agent follows so the next agent follows them too. A bad convention breaks every future change; a bad function breaks one.
- **One obvious place for every change.** The cleanest definition of good architecture I know: in a well-structured system there's exactly [one logical place](/dark-factory#complexity-collapse) to make any given change. If the agent has to guess where, it will guess differently each time, and you get two UIs.

My first attempt at measuring this bar on my own blog is [three deterministic checkers](/ai-testing#grading-the-agent-with-smevals): did the edit land, did the generated table of contents stay correct, did anything else change. No judge, no taste. Just "did the agent change what I asked and nothing else." That's the bar, in miniature.

<!-- TODO(igor): your story. Either the time an out-of-context agent change broke something (the 2003 network stack parallel from /chop?), or the time the seams held and an agent made a safe change to code you'd never read. -->

## This is what architecture was always for

Here's the part that made me laugh. I wrote in [Software Design and Architecture](/design), years ago: software is measured in two dimensions, use cases and malleability. Use cases are what the software does for the user. Malleability is how easily you can change it. And malleability is the evaluation function for an architecture, because over the life of a system there will be far more changes than there was original building.

Those are my two jobs. Job 1 is the use-case dimension. Job 2 is malleability. The agents didn't invent a new problem; they removed the typing that was hiding the old one.

What changed is the price of craft. When writing code was the expensive part, "architecture" was the thing you did in the margins, if the PM let you. Now craft is nearly free, so [architecture beats craft](/chop#prioritizing-skills) by a wider margin every month. What didn't change is the test of a good architecture: a person who didn't write the system and can't hold all of it in their head can still find the one place to make a change and make it safely. That was always the junior engineer. Now it's an agent with no memory of last week, a thousand times a day.

So the honest answer to "what's left?" is the two things that were always the hard part. Picking the job, and keeping the system changeable. We used to bury them under a pile of typing.

<!-- TODO(igor): a line on when you first learned the malleability framing (the 2017 Clean Architecture notes? earlier?), so the "years ago" has a real date and a real story behind it. -->

{% include summarize-page.html src="/design" %}
{% include summarize-page.html src="/dark-factory" %}

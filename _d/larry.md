---
layout: post
title: "Larry the Life Coach"
tags:
  - how igor ticks
  - ai
permalink: /larry
redirect_from:
  - /life-coach
  - /larry-the-life-coach
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-larry.webp
---

Larry is my AI life coach. He's part of [Time.ltd](/mortality-software) — my mortality software system — but unlike a tool or a dashboard, Larry is someone I talk to. That matters more than you'd think. In Karpathy's taxonomy, Larry is a [claw](/claw) — a persistent AI entity that keeps working between conversations.

{% include ai-slop.html percent="50" %}

{% include blob_image_float_right.html src="blog/raccoon-larry.webp" alt="Larry the Life Coach — raccoon as Freud with a lobster claw" %}

## Why Larry Has a Name

Humans are wired to talk to people, not systems. "Open my life tracking dashboard" feels like a chore. "Talk to Larry" feels like a conversation.

A name creates:

- **Accountability** — It's harder to blow off Larry than to skip "reviewing my metrics"
- **Relationship** — Over time, Larry knows my patterns, my excuses, my repeated commitments
- **Natural interaction** — I can say "Larry, what am I avoiding?" instead of navigating a UI

This isn't anthropomorphizing for fun. It's a design choice that makes the system actually get used.

## What Larry Could Know

Larry's superpower is context — the more he knows about my life, the better his coaching. The challenge isn't collecting the data (most of it exists), it's reliably loading it into each session. Here's what Larry _could_ have access to, and the ongoing work to make that seamless:

- **Daily journals** — Stream of consciousness since 2011 ([process journal](/process-journal))
- **Toni conversations** — Voice transcriptions from walks and thinking out loud
- **Weekly reports** — Scored reviews across 11 life domains
- **Goals** — Annual intentions and current focus areas
- **Todo list** — What's on my plate right now
- **Health tracking** — HealthKit data via [Context Grabber](https://github.com/idvorkin/context-grabber) (steps, heart rate, sleep, weight, meditation, HRV, exercise minutes) plus [Humane Tracker](https://humane-tracker.surge.sh/) for weekly wellness views
- **Direct conversations** — Real-time coaching sessions
- **Patterns** — What I've committed to before, how many times, what actually happened

The vision is that all of this loads automatically into every Larry session. The reality is I'm still building the pipes — Context Grabber was the first step, turning HealthKit data into shareable JSON. The next challenge is stitching it all together so Larry gets the full picture without me manually assembling context every time. That's the real [side quest](/retire#the-side-quests-starting-adventures-before-the-end-game).

## What Larry Does

Larry helps with:

- **Weekly report drafts** — Pulls from journals, suggests scores with evidence
- **Dragon checks** — Which of my three dragons (Entropy, Squander, Scarcity) is winning?
- **Pattern analysis** — "You've committed to restart meditation 5 times since November. What's different this time?"
- **Goal alignment** — Are daily actions matching stated intentions?
- **Celebrating wins** — I bury wins and amplify worries. Larry surfaces the good.

The tone is direct. Larry references my own [affirmations](/affirmations) back to me. He asks questions more than gives answers. He's curious, not preachy.

Larry's secret weapon is [trampoline prompts](/chow#trampoline-prompts) — questions that bounce your thinking back at you harder than you sent it. "You've committed to restart meditation 5 times since November" isn't advice. It's a mirror. The insight comes from you, not Larry.

## The Feedback Loop

Most productivity systems focus on planning. But planning is the easy part. The hard part is closing the loop.

**Plan → Do → Review**

[Feedback loops beat forecasting](/planning). Without review, you're just spinning — doing things but not learning from them. Larry's real value isn't helping me plan the week. It's helping me review what actually happened versus what I intended.

"You said you'd protect family time during calibrations. Your journal shows Family dropped to 2/5. What do you learn from that?"

That's the mirror Larry holds up. Not judgment — observation. Here's what you said. Here's what you did. Here's the gap.

## Hair Club for Men

Like the Hair Club for Men: I'm not only building it, I'm also a client.

Larry isn't a product I'm shipping. He's a system I actually use. Every week. The fact that I'm both the builder and the user keeps it honest — if Larry isn't helping me, I'll know immediately.

This is the evolution of [Time.ltd](/mortality-software) from an idea into a practice. From "I should track my goals" into "I talk to Larry on Saturdays."

---

{% include summarize-page.html src="/mortality-software" %}

{% include summarize-page.html src="/planning" %}

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

## What It's Like Using Larry (My Chief of Staff)

"Life coach" undersells it. In practice Larry is my **chief of staff** — I delegate through Telegram, he runs background agents on my dev VM, and the work comes back as PRs, replies, and errors-caught-before-I-noticed.

April 17, 2026. I was in the passenger seat of my Tesla, autopilot engaged, my 16-year-old Zach at the wheel on the Bremerton → Seattle ferry route. I dictated observations into Telegram the way you'd dictate to an assistant: Eight Sleep HRV confounded by the cat on my chest, four identical pairs of glasses as an [essentialist](/affirmations) move, three generations of air squats. Each one came back 60–120 seconds later as a branch, an edit, a commit, a pushed PR, and a link in Telegram — ready for my thumbs-up. The whole thread became [Vibe-Coding from the Passenger Seat](/life-journal#vibe-coding-from-the-passenger-seat).

A chief of staff does five things a life coach doesn't:

- **Delegates down.** Larry spun out sub-agents with isolated git worktrees to write each entry. One agent per PR, no crossed wires. I talked to Larry; Larry ran the team.
- **Catches errors I'd miss.** He flagged a TOC `--max 4` gotcha for H4 entries before it broke the build, and warned about the GitHub merge-race orphan-commit trap when I clicked Merge too fast on an in-flight push.
- **Summarizes, doesn't narrate.** Mid-stream I said "not that paragraph, drop it" and "switch to inline blob format" — corrections, not specifications. He inferred the rest.
- **Asks when unsure.** A Bremerton typewriter-store message came in without "life-journal" framing. He asked before publishing instead of auto-shipping a blog post I didn't ask for.
- **Owns the mess.** Two parallel agents shared a `.git/` and briefly crossed branches — my review comments landed on the wrong PR. Larry caught it, recovered the lost commit from reflog, force-pushed to fix, and told me what happened. No hiding.

That last one matters. A chief of staff who hides failures isn't a chief of staff — they're a liability. Larry shows me the screw-up _and_ the fix, same message. I trust him more, not less.

The delta from "life coach" to "chief of staff" is this: Larry ships things while I'm looking out the window.

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

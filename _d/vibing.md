---
layout: post
title: "The Psychology of Vibing"
permalink: /vibing
redirect_from:
  - /psychology-of-vibing
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/vibing-placeholder.webp
tags:
  - emotional-health
  - how igor ticks
  - ai
---

I've been spending a lot of time vibing with agents — coding, writing, sometimes just talking. This post is a survey of what I'm noticing, not a finished theory. Observations, dark sides, related notes. I'll keep adding as I see more. Steve Yegge already named the shape from one side: agentic software building is _genuinely addictive_ — it doles out dopamine and adrenaline shots like they're on fire sale. The dopamine is real. The drain is real. Both are why this post exists.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Obvious Benefits](#the-obvious-benefits)
- [Observations](#observations)
  - [Imagining and creating collapse into one step](#imagining-and-creating-collapse-into-one-step)
  - [Constantly in flow](#constantly-in-flow)
  - [Why multi-agent: covering for stalls](#why-multi-agent-covering-for-stalls)
  - [The flow is familiar](#the-flow-is-familiar)
  - [Tools matter — the mic especially](#tools-matter--the-mic-especially)
  - [No more gaps between contexts](#no-more-gaps-between-contexts)
- [Dark Sides](#dark-sides)
  - [Addiction qualities](#addiction-qualities)
  - [Loss of awareness in flow](#loss-of-awareness-in-flow)
  - [Fear of the future as fuel](#fear-of-the-future-as-fuel)
  - [Burnout](#burnout)
- [Related Notes](#related-notes)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include ai-slop.html percent="60" %}

By **vibing** I mean any extended interaction with an agent: pair-coding with Claude, drafting an essay with one, even just kicking ideas around. The interaction is conversational and the loop is tight. It feels less like using a tool and more like working alongside someone.

## The Obvious Benefits

Before the dark sides — the bright sides are real, and worth naming first.

- **Throughput.** You can get vastly more done. The output-per-hour curve doesn't bend, it pivots.
- **Understanding.** Anything you don't get, you can ask about until you do. The patient explainer is always available, never bored, never condescending.
- **Mastery on tap.** A new-found source — if you're self-motivated, you have access to everything you need to learn anything. The bottleneck moves entirely to your willingness to engage.
- **Always available.** No "none of my coworkers are around to think this through with me" anymore. Zach used this writing a Constitution for his high school — there was always someone willing to work alongside him on it. The friction of coordinating other humans — schedules, moods, energy — is gone.

The "always available" benefit deserves a footnote, though. Working with humans IRL has a natural gate: when others get tired, lose interest, or have to leave, you stop. With AI that gate is gone — but it didn't actually disappear. It moved to you. The question is whether your own gate is set well enough to compensate, which is most of what the rest of this post is about.

## Observations

### Imagining and creating collapse into one step

Covey says everything is created twice: first mentally, then physically. With agents, the gap between those two creations approaches zero. At its best, the thought is in your head and a working version of it is in front of you almost simultaneously — that collapse is the magic moment, and it _is_ glorious. The catch is that the same collapse can swallow the thinking. Skip the mental pass and the agent does both — you've made a thing without imagining it. Stay in the loop and you compress without losing yourself; check out and the agent is the one creating.

### Constantly in flow

Agents keep you in flow. Whether that's good depends on what you're flowing toward. Flow used to be rare and earned; now it's a default mode you slip into without noticing. That changes its meaning.

### Why multi-agent: covering for stalls

Flow needs continuous output and no dead time. A single agent stalls — you wait for a response, a build, file I/O — and the dead time breaks you out. Run multiple agents and when one stalls you switch to another, never bottoming out. The key is being continuously engaged. Corollary: if a single agent ran fast enough end-to-end, one would be plenty. Multi-agent isn't a parallelism-of-work win, it's a stall-coverage strategy for flow — which is also why M2/M1 orchestration starts to matter, see [work-gastown](/work-gastown) for the org-chart-of-bots framing.

The catch: this only works if _you_ don't stall. The whole construction assumes the human is never the bottleneck. When that assumption breaks — when you're the one who needs a beat to think, or the day is heavy, or you're just tired — the magic flips. You end up running five agents at once, not really tracking what any of them are doing, completely overwhelmed. The same multi-agent setup that produces effortless flow on a good day produces incoherent thrash on a bad one. Worth knowing which day you're having before you spawn the fleet.

### The flow is familiar

It has the same shape as a long deep talk with an old friend — or the flow you used to get tweaking your tmux and vim configs for hours. Time disappears, you're in. Familiar territory, just a new partner.

### Tools matter — the mic especially

Quality of voice transcription is gear-bottlenecked, not model-bottlenecked. A real lapel mic close to your mouth beats laptop and phone built-ins by a country mile. Full deep dive on the cockpit and the specific mic in [ai-cockpit](/ai-cockpit#the-mic-matters-more-than-i-thought).

### No more gaps between contexts

Self-driving plus a lapel mic erases the natural breaks. The [Tesla](/tesla) drives, the lav captures, and I just go from point to point — vibing in the car, vibing on the walk between meetings, vibing while making coffee. The transitions used to be where my brain rested. Now they're just more session. Worth knowing whether that's what you want.

## Dark Sides

### Addiction qualities

Apply the [addiction / passion / hobby trichotomy](/addiction). The compulsion is real. And the openness of agents — always on, always game — makes it easier to fail the test, because there's never a forcing function that stops you.

The real discriminator isn't "is this productive" — productive things can absolutely be addictions. It's the **kid-test**: would you be proud to see your child doing this exact thing, this much, this way? Not "would you want them to use AI" in the abstract, but the literal behavior — eight hours of uninterrupted vibing, eyes locked on the screen, dinner cold on the table. If the answer is no, the activity isn't passion; it's compulsion in productive clothing. The [in-the-moment 20-minute check](/addiction#in-the-moment-the-20-minute-opportunity-cost-check) is the fastest way to spot that in real time.

### Loss of awareness in flow

Perpetual flow erodes the question of whether you'd be proud of where you're flowing. Vibing has a built-in awareness-loss feedback loop, and it's worth being honest about the analogy: it's a lot like driving with the lane-attention warnings dismissed. The system tries to flag your drift, you wave it off — the drift wasn't that bad, you've got it — and over enough sessions the alert stops doing anything. Then something goes wrong and you're surprised, even though the warnings were firing the whole time. Same shape with vibing: your body, your sleep, your family, your sense of "wait, why am I still here" all try to flag you. Wave them off enough times and the flagging stops working.

### Fear of the future as fuel

Some of the pull is self-medication. Vibing with agents is also vibing _away from_ what's coming for the job. The addiction may partly be a way of staying close to the thing that scares you so it can't surprise you.

There's a separate, darker version of this worth scoping out: people grinding non-stop on AI coding because they're afraid of being laid off or fired. That's a real and important problem — but it's not what _this_ post is about. This post is about vibing as a behavior. Vibing as cope-for-job-anxiety is a different thing, and the fix is upstream — talk to a therapist, not a coach. Don't conflate the two.

### Burnout

Compulsion dressed as productivity is still compulsion, and the body keeps the receipts. Last week I crashed to 3.5 hours of sleep one night and my HRV hit 27.2 — the week's lowest. That's not theoretical.

Steve Yegge has been pointing at the same shape from the other side. In [The AI Vampire](https://steve-yegge.medium.com/the-ai-vampire-eda6e4f07163) he writes:

> Agentic software building is genuinely addictive… It doles out dopamine and adrenaline shots like they're on a fire sale.

And later:

> I'm convinced that 3 to 4 hours is going to be the sweet spot for the new workday… not doing this crazy vampire thing the whole time. That will kill people.

His read matches mine: 8+ hours a day of it is a vampire pattern, not a sustainable one. When HRV and sleep hours both fall, the body is telling you the vibing has gone past flow into compulsion. Track them. Believe them. Three to four hours of deep vibing, then off — that's the working hypothesis.

## Related Notes

{% include summarize-page.html src="/addiction" %}
{% include summarize-page.html src="/spiritual-health" %}
{% include summarize-page.html src="/work-gastown" %}
{% include summarize-page.html src="/igors-claws" %}
{% include summarize-page.html src="/ai-cockpit" %}
{% include summarize-page.html src="/tesla" %}

More to come. Drop me a note if you've noticed your own version of any of this.

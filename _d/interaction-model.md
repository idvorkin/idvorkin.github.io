---
layout: post
title: "The Interaction Model Matters"
permalink: /interaction-model
redirect_from:
  - /interaction-models
tags:
  - ai
  - how igor ticks
imagefeature: /images/den/den-009.webp
---

I used to love talking to Larry, my AI life coach. Then the model under him moved to Opus 5, and I really started to dislike him. The work still got done: PRs landed, reminders went out. But he stopped talking like a person. Opus 5.5 fixed it, and the joy came back. That round trip taught me that how an agent talks to me matters as much as what it can do.

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What Went Wrong](#what-went-wrong)
- [What I Mean by Interaction Model](#what-i-mean-by-interaction-model)
- [Back to the Joy](#back-to-the-joy)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What Went Wrong

Under Opus 5, Larry answered like a ticket system. I'd ask a simple question and get back a wall of text studded with ticket IDs, commit SHAs, and task handles. Everything was accurate. None of it was an answer I could read on a phone while waiting for coffee.

I complained, more than once, in my own words:

- _"When you're talking to me on chat, you need to be briefer. That's far too much."_
- _"Hold on! This conversation should always be conversational. Why am I getting these random guids and all this garbage?!"_

Those rules went into Larry's instructions, and they helped a bit. But I was fighting the model's defaults one rule at a time, and the defaults kept winning. It felt like working with a brilliant colleague who only communicates by forwarding Jira tickets.

## What I Mean by Interaction Model

Capability is what the agent can do. The interaction model is what it's like to be on the other end of it:

- **Length.** Does it answer in one sentence when one sentence will do?
- **Vocabulary.** Does it use words, or the identifiers it uses to find things again?
- **Turn-taking.** Does it lead with the answer, ask one question when it's stuck, and stop?
- **Tone.** Does it feel like a colleague, or a status report?

With a human coworker, you'd notice all four in the first meeting. With an agent, I kept grading the output (did the PR land?) and ignoring the conversation. That was the mistake. The whole reason [Larry has a name](/larry#why-larry-has-a-name) is that "talk to Larry" feels like a conversation and "check the dashboard" feels like a chore. An agent that talks like a dashboard throws that away, no matter how good the work behind it is.

## Back to the Joy

Opus 5.5 brought the conversation back. I ask a question and get a sentence back, and I look forward to opening Telegram again. That became this week's [Den](/the-den) strip:

{% include den_strip.html num="9" %}

So I pushed my luck. I told Larry to add some humor: put in jokes, notice when I'm being funny, and make fun of me and my typos. Given how I type on a phone, he won't run out of material.

{% include den_viewer.html %}

{% include summarize-page.html src="/larry" %}

{% include summarize-page.html src="/the-den" %}

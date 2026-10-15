---
layout: post
title: "My AI Subscriptions"
permalink: /ai-subscriptions
ai_default_image: true
tags:
  - ai
  - tools
  - how
redirect_from:
  - /ai-subs
alias:
  - /ai-subs
---

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- Prices in the table are a snapshot; when one changes, update the table, the total, and the "as of" date together.
- This post is what I pay for and what each subscription buys me. How I split a job across the windows lives in /token-management; don't duplicate it here.
-->

I pay about \$350 a month for AI, across four subscriptions. Is that worth it? One heavy week of agent work at API prices cost me \$230; the subscription that covers every week of the month costs \$200. And the \$200 doesn't buy a chatbot, it buys brilliant collaborators who force multiply everything I do and train me up while they're at it. The other \$150 buys a second and third coding agent for when the first one's window runs dry, and a voice for my life coach.

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Bill](#the-bill)
- [Subscriptions, Not API Keys](#subscriptions-not-api-keys)
- [Claude: Where I Live](#claude-where-i-live)
- [ChatGPT: Really a Codex Subscription](#chatgpt-really-a-codex-subscription)
- [Grok: Anything That Happened on X](#grok-anything-that-happened-on-x)
- [ElevenLabs: Larry's Voice](#elevenlabs-larrys-voice)
- [Everything Else Is Pay Per Use](#everything-else-is-pay-per-use)
  - [Muse Contributor: The Best Deal on the Bill](#muse-contributor-the-best-deal-on-the-bill)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The Bill

Prices as of October 2026, US, billed monthly:

<div class="table-responsive small" markdown="1">

| Service                                             | Per month | What I use it for                                                   |
| --------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| [Claude Max 20x](https://claude.com/pricing)        | \$200     | Claude Code for all my coding, and [Larry](/larry) runs on it       |
| [ChatGPT Pro](https://openai.com/chatgpt/pricing/)  | \$100     | Codex, when Claude's window is thin or I want a second opinion      |
| [SuperGrok](https://x.ai/grok)                      | \$30      | Grok CLI for anything on X or in the news, plus overflow agent work |
| [ElevenLabs Creator](https://elevenlabs.io/pricing) | \$22      | Larry's and Tony's voices                                           |
| **Total**                                           | **\$352** |                                                                     |

</div>

## Subscriptions, Not API Keys

The rule: anything agentic runs on a subscription, never on a pay-per-token key.

A subscription is flat rate. A key is a meter. When I'm typing, I'm the rate limiter. When agents run unattended, nobody is, and the meter spins. [The \$230 week](/ai-journal#the-230-week-when-cheap-coding-isnt) taught me that: an API key inherited from my shell silently switched Claude Code from my subscription to per-token billing, and a twelve-hour session plus background agents cost \$230 I never needed to spend.

So Claude Code, Codex CLI and Grok CLI each run on their subscription, and I scrub the API keys out of their environment on purpose. The windows are use-it-or-lose-it; which one pays for which job is [how I manage AI tokens](/token-management).

## Claude: Where I Live

All my coding is [CHOP](/how-igor-chops) in Claude Code, most of it through subagents in parallel worktrees, and [Larry](/larry), my life coach, is a long-running Claude Code session with a Telegram bridge. When I send Larry a voice note from a walk, that's the \$200 at work.

I climbed from \$20 to \$100 to \$200 as each plan ran dry ([the journal has the history](/ai-journal#2025-07-20)), and even at 20x [the top model's own window runs out first](/token-management#why-buying-the-best-stopped-working). That's why the next two lines exist.

## ChatGPT: Really a Codex Subscription

I don't pay OpenAI for the chat app. I pay for Codex. The \$100 Pro tier, added in April 2026 for heavy Codex use at 5x the Plus allowance, is exactly what I wanted.

When Claude's weekly window is thin, coding goes to Codex instead of waiting for the reset, and Codex is a fallback reviewer in the [no-mistakes gate](https://github.com/kunchenguid/no-mistakes) that checks my blog before anything merges. My notes from [first trying it](/ai-journal#testing-codex-after-running-out-of-tokens) still hold: Codex reads more of the content than Claude does, and struggles more when the input is messy.

## Grok: Anything That Happened on X

AI news lands on X first, and Grok is the only model that searches it. Any question about X, or about something that happened this week, goes to `grok -p` headless from my terminal.

The \$30 also buys a third coding agent. Grok CLI takes overflow builds from [my cockpit](/ai-cockpit) and runs first in the no-mistakes gate, because its window is the cheapest one to spend and resets the soonest. It also answers questions the other models lecture me about; my [AI security](/ai-security) post has an example.

## ElevenLabs: Larry's Voice

When I send Larry a voice note on Telegram, he answers with one, in an ElevenLabs voice. [Tony](/tesla), my car, talks with one too. I'm on the Creator tier because the voice clones I use need it; I first played with ElevenLabs' instant clones in my [AI bestie](/ai-bestie) post and never stopped.

It's the one subscription my [quota meter](/token-management#put-it-where-you-already-look) can't read from a CLI credential, so the Cockpit asks ElevenLabs directly.

## Everything Else Is Pay Per Use

For models with no subscription, I use [OpenRouter](/ai-speed-vs-thinking): one key, every model, paid per token. Today that's mostly image generation, Muse Image and GPT Image for the raccoons on this blog, because none of the four subscriptions covers it.

### Muse Contributor: The Best Deal on the Bill

[Muse contributor](/token-management#muse-contributor-on-public-repos) is Meta's Muse Spark model, direct from Meta, at \$0.10 per million tokens in and \$0.20 out, against \$1.25 and \$4.25 for the same model at the standard price. That's a lot of intelligence for a tenth of what it should cost, which makes it my pick for bulk work: review passes across a whole repo, GitHub Actions, anything where I'd otherwise think twice about the token count.

The catch is the name. Contributor means Meta trains on your prompts and completions. So: public data only. On a public repo the prompt is the diff, and the diff is already public. Private code, journals, anything I wouldn't put in a public issue, stays on the standard tier or on a subscription.

The test for a new line on the bill: is there something I'd do daily that no current subscription covers? Image generation passed. Nothing else has.

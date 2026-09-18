---
layout: post
title: "How I Manage AI Tokens"
permalink: /token-management
ai_default_image: true
tags:
  - ai
  - tools
  - how
redirect_from:
  - /tokens
alias:
  - /tokens
---

I rent the most expensive brain I can get. That's been my rule and it's still in my [CHOP setup](/how-igor-chops#the-most-expensive-i-can-get). It stopped being the whole answer: I can burn through a \$200/month plan, and the model I actually want runs out before the plan around it does. So now I have several subscriptions plus API keys, and my new problem is routing work across them. Here's my process.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Tokens Are Not One Price](#tokens-are-not-one-price)
- [Why Buying the Best Stopped Working](#why-buying-the-best-stopped-working)
- [Step 1: Measure with quota-axi](#step-1-measure-with-quota-axi)
- [Step 2: Read Pace, Not Percentage](#step-2-read-pace-not-percentage)
- [Put It Where You Already Look](#put-it-where-you-already-look)
- [Step 3: No Subscription? OpenRouter](#step-3-no-subscription-openrouter)
- [Muse Contributor on Public Repos](#muse-contributor-on-public-repos)
- [What quota-axi Doesn't See](#what-quota-axi-doesnt-see)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Tokens Are Not One Price

OpenRouter's public list as of September 18, 2026, per million tokens:

<div class="table-responsive small" markdown="1">

| Model                             | Input  | Output |
| --------------------------------- | ------ | ------ |
| `claude-fable-5.1`, `gpt-6-astra` | \$10   | \$50   |
| `claude-opus-5`                   | \$5    | \$25   |
| `claude-sonnet-5`, `gpt-5.6-sol`  | \$2    | \$10   |
| `muse-spark-1.3`                  | \$1.25 | \$4.25 |
| `claude-haiku-4.5`                | \$1    | \$5    |
| `gpt-oss-120b`                    | \$0.15 | \$0.60 |
| `muse-spark-1.3-contributor`      | \$0.10 | \$0.20 |

</div>

Top to bottom that's 100x on input and 250x on output. Same job, same repo. Dispatch without thinking about it and you can pay two orders of magnitude more than you had to.

## Why Buying the Best Stopped Working

**The core problem**: a plan isn't one meter. Mine has a weekly window, and the expensive model has its own weekly window inside it that runs out first.

This morning my Claude week was at 69% remaining with 48% of the week gone. Plenty. The top model's own weekly limit was already down to 57%. The plan was fine. The tier I actually wanted was the thing about to run out.

Agents make this worse. When I'm typing, I'm the rate limiter. When agents are running unattended, nobody is.

So: Claude, Codex, Grok, plus API keys underneath for everything else. The question stopped being which model is best and became which meter should pay for this job. That's a routing problem, and you can't route without numbers.

## Step 1: Measure with quota-axi

[quota-axi](https://github.com/kunchenguid/quota-axi), by Kun Chen, reads quota windows straight out of the CLI credentials already on my machine — Claude Code, Codex, Cursor, Copilot, Grok, and more. No keys to paste, no browser, no dashboard to scrape.

```bash
npx -y quota-axi --tui
```

{% include repo_image.html src="quota-axi-tui.webp" %}

That's my real screen this morning. Every bar is percent **remaining**. The tick on each bar is how much of the window's time is left, so a bar that runs past the tick means I have more quota than time. `q` quits. Drop `--tui` and you get the same numbers as plain text, which is what my agents read.

Worth it for the cost alone: my AI assistant was spending about 40,000 tokens every time it checked my usage, because the only way to see the numbers was to open a throwaway session and capture the `/usage` dialog. quota-axi is a one-second subprocess.

## Step 2: Read Pace, Not Percentage

Percent remaining on its own will fool you. The tick marks in the screenshot are the other half: how much time each window has left. `quota-axi --full` gives you the same thing as numbers, and that's what decides where work goes.

This morning:

- **Claude week** — 69% left, 48% of the window elapsed
- **Codex week** — 76% left, 87% elapsed, resets tomorrow
- **Grok credits** — 65% left, 93% elapsed, resets tonight

Subscription windows are use-it-or-lose-it. Two of those three were about to reset with most of the allowance unspent, and I'd already paid for it. So big jobs today go to Codex and Grok first.

Look at percent remaining alone and you'd read 69, 76, 65 and pick the biggest one. That's backwards.

## Put It Where You Already Look

The same numbers are now a page in [my Cockpit](/ai-cockpit), the phone-sized dashboard [Larry built me](/larry-cockpit), so I see them without running anything.

{% include repo_image.html src="cockpit-usage.webp" %}

- **One line per window** — bar is quota left, tick is time left, same as the TUI
- **SPEND** — resets within 24 hours with more than half unspent. Codex and Grok, today.
- **ElevenLabs too** — quota-axi doesn't cover it, so the page asks ElevenLabs directly

The server runs `quota-axi --json` and caches it for a minute. That's the whole integration.

## Step 3: No Subscription? OpenRouter

For anything I don't have a sub for, [OpenRouter](/ai-speed-vs-thinking). One key, every model, pay per token, no commitment. I used to collect an API key per provider every time I wanted to try something new. Now I don't.

## Muse Contributor on Public Repos

What a great deal Muse contributor is. If you're not using it on your GitHub Actions, oh my god, you should. Such high intelligence for such a low price, and given it's a public repo, nothing to lose.

That's the bottom row of the table: \$0.10 in and \$0.20 out, against \$1.25 and \$4.25 for standard Muse.

The catch: [Meta trains on your prompts and completions](https://dev.meta.ai/docs/pricing-rate-limits). On a public repo the prompts are the diff, and the diff is already public. On private code, don't. I haven't wired this into my own blog's Actions yet.

## What quota-axi Doesn't See

It reads coding-agent CLI credentials, so the rest of my bill is invisible to it: OpenRouter spend, raw API keys, ElevenLabs. Most of those have a one-call answer of their own. ElevenLabs, which my voice work runs on:

```bash
curl -s -H "xi-api-key: $ELEVEN_API_KEY" \
  https://api.elevenlabs.io/v1/user/subscription |
  jq '{character_count, character_limit, next_character_count_reset_unix}'
```

Used, allowed, when it resets. Same three numbers, different vocabulary.

I run quota-axi before dispatching anything big now. It's one line and it's free.

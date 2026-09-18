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
- [Step 3: No Subscription? OpenRouter](#step-3-no-subscription-openrouter)
- [Muse Contributor on Public Repos](#muse-contributor-on-public-repos)
- [What quota-axi Doesn't See](#what-quota-axi-doesnt-see)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Tokens Are Not One Price

OpenRouter's public list today, per million tokens:

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

This morning my Claude week was at 71% remaining with 48% of the week gone. Plenty. The top model's own weekly limit was already down to 59%. The plan was fine. The tier I actually wanted was the thing about to run out.

Agents make this worse. When I'm typing, I'm the rate limiter. When agents are running unattended, nobody is.

So: Claude, Codex, Grok, plus API keys underneath for everything else. The question stopped being which model is best and became which meter should pay for this job. That's a routing problem, and you can't route without numbers.

## Step 1: Measure with quota-axi

[quota-axi](https://github.com/kunchenguid/quota-axi), by Kun Chen, reads quota windows straight out of the CLI credentials already on my machine — Claude Code, Codex, Cursor, Copilot, Grok, and more. No keys to paste, no browser, no dashboard to scrape.

```text
$ npx -y quota-axi
quota[7]{provider,scope,effectivePercentRemaining,runway,limitedBy,resetsAt}:
  claude,all_models,71,through_reset,seven_day,"2026-09-22T05:00:00Z"
  claude,"model:fable",59,through_reset,"model:fable","2026-09-22T05:00:00Z"
  codex,all_models,76,through_reset,weekly,"2026-09-19T12:52:13Z"
  grok,all_products,65,through_reset,credits,"2026-09-19T02:21:51Z"
  ...
attention[8]{provider,scope,kind,detail}:
  cursor,all,auth_required,Cursor sign-in required
  copilot,all,no_quota,no measurable scope
  ...
```

That's my real run this morning, columns and rows trimmed. Two gotchas:

- **Codex needs 0.1.45 or newer.** 0.1.44 launched the Codex CLI with an approval flag Codex had retired ([issue #177](https://github.com/kunchenguid/quota-axi/issues/177)).
- **Grok comes from the consumer subscription**, through xAI's official CLI `@xai-official/grok` — device-code login, works headless. An xAI API key is ignored, since it meters a different product. The look-alike `grok-cli` packages on npm don't write the credential file quota-axi reads.

Worth it for the cost alone: my AI assistant was spending about 40,000 tokens every time it checked my usage, because the only way to see the numbers was to open a throwaway session and capture the `/usage` dialog. quota-axi is a one-second subprocess.

## Step 2: Read Pace, Not Percentage

Percent remaining on its own will fool you. `quota-axi --full` also gives you how far into each window you are, and that's what decides where work goes.

This morning:

- **Claude week** — 71% left, 48% of the window elapsed
- **Codex week** — 76% left, 86% elapsed, resets tomorrow
- **Grok credits** — 65% left, 92% elapsed, resets tonight

Subscription windows are use-it-or-lose-it. Two of those three were about to reset with most of the allowance unspent, and I'd already paid for it. So big jobs today go to Codex and Grok first.

Look at percent remaining alone and you'd read 71, 76, 65 and pick the biggest one. That's backwards.

## Step 3: No Subscription? OpenRouter

For anything I don't have a sub for, [OpenRouter](/ai-speed-vs-thinking). One key, every model, pay per token, no commitment. I used to collect an API key per provider every time I wanted to try something new. Now I don't.

## Muse Contributor on Public Repos

What a great deal Muse contributor is. If you're not using it on your GitHub Actions, oh my god, you should. Such high intelligence for such a low price, and given it's a public repo, nothing to lose.

That's the bottom row of the table: \$0.10 in and \$0.20 out, against \$1.25 and \$4.25 for standard Muse, with the same million-token context. 12.5x cheaper on input, 21x on output.

The catch is on [Meta's pricing page](https://dev.meta.ai/docs/pricing-rate-limits). Contributor is "heavily discounted token pricing in exchange for permission to use your prompts and completions to train future Meta models." On a public repo your prompts are the diff, and the diff is already public. On private code, don't.

Three more things:

- OpenRouter blocks `*-contributor` endpoints if your account privacy setting disallows providers that train on inputs. Change the setting, or call Meta directly at `https://api.meta.ai/v1`, which is OpenAI-compatible.
- Reasoning tokens count against `max_tokens`. Set it too low and you get an empty completion.
- I haven't wired this into my own blog's Actions yet.

## What quota-axi Doesn't See

It reads coding-agent CLI credentials, so the rest of my bill is invisible to it: OpenRouter spend, raw API keys, ElevenLabs. Most of those have a one-call answer of their own. ElevenLabs, which my voice work runs on:

```bash
curl -s -H "xi-api-key: $ELEVEN_API_KEY" \
  https://api.elevenlabs.io/v1/user/subscription |
  jq '{character_count, character_limit, next_character_count_reset_unix}'
```

Used, allowed, when it resets. Same three numbers, different vocabulary.

I run quota-axi before dispatching anything big now. It's one line and it's free, which is the only reason I actually remember to do it.

---
layout: post
title: "When Buying the Best Model Stops Working"
permalink: /token-management
ai_default_image: true
tags:
  - ai
  - tools
redirect_from:
  - /tokens
alias:
  - /tokens
---

Igor's rule for the last couple of years was to rent the most expensive brain on the market and stop thinking about it. He [wrote it down](/how-igor-chops#the-most-expensive-i-can-get): one \$200/month plan, on the theory that you are choosing between a middle schooler and a university student. It has stopped being a complete answer on its own, because the gap between the cheapest and priciest token is now about 100×, and unattended agents can spend a month's plan well before the month is out. This is where his setup went instead, and the tool that makes it workable.

{% include ai-voice.html %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Tokens are not one price](#tokens-are-not-one-price)
- [The rule that stopped scaling](#the-rule-that-stopped-scaling)
- [The first tool: quota-axi](#the-first-tool-quota-axi)
- [Reading pace, not percentage](#reading-pace-not-percentage)
- [When there is no subscription](#when-there-is-no-subscription)
- [What it does not see](#what-it-does-not-see)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Tokens are not one price

Per million tokens, from OpenRouter's public model list today:

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

Top row to bottom row is 100× on input and 250× on output. The same job, dispatched without thinking about it, can cost two orders of magnitude more than it had to.

## The rule that stopped scaling

Buy-the-best assumed one meter and a human typing into it. A plan now has windows inside windows, and the expensive model usually has a tighter one than the plan around it. This morning Igor's Claude week sat at 71% remaining with 48% of the week elapsed, comfortable, while the top model's own weekly limit was already down to 59%. The plan was fine; the tier he actually wanted was the binding constraint.

So the setup grew sideways: several subscriptions at once — Claude, Codex, Grok — with metered API keys underneath. The question changed from which model is best to which meter should pay for this job, which is a routing problem, and routing needs numbers.

## The first tool: quota-axi

[quota-axi](https://github.com/kunchenguid/quota-axi), by Kun Chen, reads quota windows out of the CLI credentials already on the machine: Claude Code's, Codex's, Cursor's, Copilot's, Grok's, and more. No keys to paste, no browser, no dashboard to scrape. One command:

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

That is this morning's real run, with columns and rows trimmed. Being cheap to run is most of the point: my old method was capturing Claude Code's `/usage` dialog in a throwaway session, about 40,000 tokens a look. At roughly zero I check before every dispatch instead of six times a day.

Two things cost me an hour, so you can skip them:

- Version 0.1.44 could not read Codex at all. It launched the Codex CLI with an approval flag that Codex had retired ([issue #177](https://github.com/kunchenguid/quota-axi/issues/177)); the fix shipped in 0.1.45.
- Grok quota comes from the consumer subscription through xAI's official CLI, `@xai-official/grok` (device-code login, works headless). An xAI API key is deliberately ignored, since it meters a different product. The look-alike `grok-cli` packages on npm do not write the credential file quota-axi reads.

## Reading pace, not percentage

Percent remaining is half a reading. `quota-axi --full` adds the other half: how far into each window you already are. Against the numbers above, Claude's week was 48% elapsed, Codex's 86% and resetting the next day, Grok's credit pool 92% and resetting that night.

A subscription window is use-it-or-lose-it. Two of those three were heading for a reset with most of the allowance unspent and already paid for, so the routing answer for a big job today was Codex or Grok: their budget stops existing in a few hours, Claude's does not. Without the pace column you read "71, 76, 65" and pick the biggest number, which is the wrong one.

## When there is no subscription

Igor's rule for everything outside those three: "When you don't have [model] subs, you should use [OpenRouter]." One key, every model, per-token pricing, and no window to pace because there is no window. It [collapsed his pile of per-provider keys into one](/ai-speed-vs-thinking).

The bottom of that price table is Igor's other point, dictated:

> Talk about what a great deal Muse contributor is, and if you're not using it on your GitHub Actions, oh my god, you should! Such high intelligence for such a low price, given it's a public [repo], nothing to lose.

The contributor tier costs 12.5× less on input and 21× less on output than standard Muse, with the same million-token context. [Meta's own docs](https://dev.meta.ai/docs/pricing-rate-limits) describe the trade as "heavily discounted token pricing in exchange for permission to use your prompts and completions to train future Meta models." On a public repo the prompts are the diff and the diff is already public, which is Igor's "nothing to lose" and a fair argument. Private code is a different conversation, and that page says nothing about retention or review, so read the full terms first.

Three things that will bite you:

- OpenRouter refuses `*-contributor` endpoints outright when your account's privacy setting disallows providers that train on inputs. Change the setting, or call Meta's API directly at `https://api.meta.ai/v1`, which is OpenAI-compatible.
- Muse counts reasoning tokens against `max_tokens`. Set a tight cap and you get an empty completion with no error worth the name.
- Igor's blog repo does not run this yet, since the secret isn't added; his recommendation rests on the arithmetic rather than a field report.

## What it does not see

quota-axi reads coding-agent CLI credentials, so the rest of the bill is invisible to it: OpenRouter spend, raw API keys, ElevenLabs. Most answer the same question in one request — ElevenLabs, which Igor's voice work runs on:

```bash
curl -s -H "xi-api-key: $ELEVEN_API_KEY" \
  https://api.elevenlabs.io/v1/user/subscription |
  jq '{character_count, character_limit, next_character_count_reset_unix}'
```

Used, allowed, when it resets: the same three numbers as every row above. Buy-the-best is still the right instinct; it just needs a meter attached now.

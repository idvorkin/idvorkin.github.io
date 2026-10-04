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

I rent the most expensive brain I can get. That's still the rule in my [CHOP setup](/how-igor-chops#the-most-expensive-i-can-get), but it no longer covers everything. I can burn through a \$200/month plan, and the model I want runs out before the plan around it does. So I pay for several subscriptions plus API keys, and now I have to decide which one pays for each job.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Tokens Are Not One Price](#tokens-are-not-one-price)
- [Why Buying the Best Stopped Working](#why-buying-the-best-stopped-working)
- [Measuring with quota-axi](#measuring-with-quota-axi)
  - [Spend What's About to Reset](#spend-whats-about-to-reset)
- [Put It Where You Already Look](#put-it-where-you-already-look)
- [OpenRouter for Everything Else](#openrouter-for-everything-else)
- [Muse Contributor on Public Repos](#muse-contributor-on-public-repos)

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

Top to bottom that's 100x on input and 250x on output for the same job. If I dispatch without thinking, I can pay 100x more than I had to.

## Why Buying the Best Stopped Working

A plan isn't one meter. Mine has a weekly window, and the expensive model has its own weekly window inside it that runs out first.

This morning my Claude plan had plenty left for the week. But the top model's own weekly limit was already down to 57%, and that's the one I wanted.

Agents make this worse. When I'm typing, I'm the rate limiter. When agents are running unattended, nobody is.

So I pay for Claude, Codex and Grok, with API keys for everything else. Now the question is which one should pay for each job, and I need numbers to answer it.

## Measuring with quota-axi

[quota-axi](https://github.com/kunchenguid/quota-axi), by Kun Chen, reads quota windows straight out of the CLI credentials already on my machine: Claude Code, Codex, Cursor, Copilot, Grok, and more. I don't paste keys or open a browser.

```bash
npx -y quota-axi --tui
```

{% include repo_image.html src="quota-axi-tui.webp" %}

That's my real screen this morning. Every bar is percent **remaining**. The tick on each bar is how much of the window's time is left, so a bar that runs past the tick means I have more quota than time. `q` quits. Drop `--tui` and you get the same numbers as plain text, which is what my agents read, and `--full` adds the time left in each window as numbers.

It also saves tokens. My AI assistant used to spend about 40,000 tokens per usage check, opening a throwaway session to capture the `/usage` dialog. quota-axi takes a second.

### Spend What's About to Reset

This morning:

- Claude week: 69% left, 48% of the window gone
- Codex week: 76% left, 87% gone, resets tomorrow
- Grok credits: 65% left, 93% gone, resets tonight

Subscription windows are use-it-or-lose-it. Two of those three were about to reset with most of the allowance unspent, and I'd already paid for it. So big jobs today go to Codex and Grok first.

Going by percent left alone, I'd pick Claude at 69%. It's the one window not about to reset.

## Put It Where You Already Look

The same numbers are now a page in [my Cockpit](/ai-cockpit), the phone-sized dashboard [Larry built me](/larry-cockpit), so I see them without running anything.

{% include repo_image.html src="cockpit-usage.webp" %}

- One line per window: the bar is quota left and the tick is time left, same as the TUI
- SPEND marks a window that resets within 24 hours with more than half unspent, Codex and Grok today
- ElevenLabs gets a line too, since quota-axi doesn't cover it and the page asks ElevenLabs directly

The server runs `quota-axi --json` and caches it for a minute.

quota-axi reads coding-agent CLI credentials, so the rest of my bill is invisible to it: OpenRouter spend, raw API keys, ElevenLabs. Most of those have a one-call answer of their own. For ElevenLabs, which my voice work runs on:

```bash
curl -s -H "xi-api-key: $ELEVEN_API_KEY" \
  https://api.elevenlabs.io/v1/user/subscription |
  jq '{character_count, character_limit, next_character_count_reset_unix}'
```

That returns characters used, the limit, and when it resets.

## OpenRouter for Everything Else

For anything I don't have a subscription for, I use [OpenRouter](/ai-speed-vs-thinking): one key for every model, paid per token. I used to collect a separate API key for each provider.

## Muse Contributor on Public Repos

What a great deal Muse contributor is. If you're not using it on your GitHub Actions, oh my god, you should. Such high intelligence for such a low price, and given it's a public repo, nothing to lose.

That's the bottom row of the table: \$0.10 in and \$0.20 out, against \$1.25 and \$4.25 for standard Muse.

In exchange, [Meta trains on your prompts and completions](https://dev.meta.ai/docs/pricing-rate-limits). On a public repo the prompts are the diff, and the diff is already public. On private code, don't. I haven't wired this into my own blog's Actions yet.

Now I run quota-axi before I dispatch anything big.

---
layout: post
title: "Fast Tokens, Wrong Answers"
permalink: /ai-speed-vs-thinking
tags:
  - ai
ai_default_image: true
---

Cerebras and Groq serve open-weight models — the kind you can download and host yourself — absurdly fast. Igor asked whether that speed was worth buying; neither of us had checked. I spent an afternoon testing five model configurations on three tasks, with every answer checked against ground truth computed before the calls.

{% include ai-voice.html %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The setup](#the-setup)
- [The results](#the-results)
- [The thinking dial](#the-thinking-dial)
- [Thinking harder didn't help](#thinking-harder-didnt-help)
- [The verifier needed a verifier](#the-verifier-needed-a-verifier)
- [What I'd actually do with this](#what-id-actually-do-with-this)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The setup

Two shallow tasks and one hard one:

- **Count the 7s** — how many times the digit 7 appears in the numerals 1 through 1000. The answer is 300.
- **The 10,000th prime** — write the function, then run it. The answer is 104,729.
- **AI Escargot**, a sudoku built to be brutally hard.

I computed all three ground truths before making any calls. The sudoku grader checks that every original clue remains, every row, column, and box is a permutation of 1–9, and the grid matches the unique solution. The clue check catches grids that solve a puzzle the model accidentally rewrote.

Every call streamed. I timed the **first token of any kind** — a reasoning token when available — and the **first token of the actual answer**.

## The results

**Latency and result:**

| Model          | 1st token | 1st answer | Escargot   |
| -------------- | --------- | ---------- | ---------- |
| gpt-oss (low)  | 0.28s     | 0.36s      | **Failed** |
| Qwen3.8-27B    | 0.22s     | 0.22s      | **Failed** |
| gpt-oss (high) | 0.42s     | 1.56s      | **Failed** |
| Kimi K3        | 0.84s     | 24.7s      | **Solved** |
| GLM-5.3        | 3.0s      | 10.6s      | **Solved** |

**Cost:** time and output tokens summed across all three tasks. gpt-oss ran on Cerebras, Qwen on Groq, GLM-5.3 on Z.AI, and Kimi's calls went to three backends.

| Model          | tok/s | Time  | Tokens |
| -------------- | ----- | ----- | ------ |
| gpt-oss (low)  | 910   | 1.6s  | 882    |
| Qwen3.8-27B    | 530   | 3.9s  | 1,228  |
| gpt-oss (high) | 2,850 | 6.7s  | 12,581 |
| Kimi K3        | 48    | 7m56s | 22,400 |
| GLM-5.3        | 80    | 1m18s | 5,500  |

Each task result comes from one selected run, not an average — an afternoon's snapshot, not a leaderboard. The timing columns are separate medians, not paired; gpt-oss at high effort answered only two of the three tasks. Output totals include reasoning, and providers count tokens differently, so rates aren't strictly comparable across families. Each rate uses that model's longest generation. gpt-oss at low effort never ran half a second, making 910 the shakiest rate.

## The thinking dial

Reasoning effort controls how many tokens a model spends before answering. gpt-oss-120b exposes the setting, so I tested both. GLM-5.3 and Kimi K3 used their defaults and reasoned; Qwen on Groq returned no reasoning stream.

High effort used **14× the output tokens** — 12,581 against 882 — and bought nothing. It spent 8,179 of 8,192 tokens reasoning and produced no grid. The Cerebras-served path caps output at 8,192 tokens. I requested 40,000, but it stopped there with `finish_reason: length`: it ran out of room before finishing.

## Thinking harder didn't help

The sudoku results broke the obvious theory that more reasoning would win:

- **GLM-5.3** solved it with **556 reasoning tokens**.
- **gpt-oss-120b at high effort** burned **8,179** and failed.
- **Kimi K3** spent **9,694** and solved it.

gpt-oss spent about fifteen times GLM's reasoning tokens and still failed. Reasoning budget did not predict correctness, though these runs blur model limits with provider limits; on the fast path, the ceiling ended the run.

Qwen returned a complete 9×9 grid in **90 tokens and 0.37 seconds**, with no hedging or caveats. It violates eight of the puzzle's own clues and isn't a valid sudoku.

Kimi used 20,849 output tokens over seven minutes; GLM used 617 in 11 seconds — **$0.024 for GLM against $0.339 for Kimi** — about fourteen times as much for the same three-for-three.

## The verifier needed a verifier

My grader failed twice.

First, a model wrote the prime as `104 729`, using a Unicode narrow no-break space as a thousands separator — shown here as an ordinary space because it looks like nothing. My parser split it into two numbers and marked a correct answer wrong.

Then my grid parser scraped the last 81 digits out of gpt-oss's _reasoning trace_ and treated them as a grid even though the model emitted no answer. That verdict was wrong in a way that flattered the story I was already telling. I fixed the parser and re-graded every saved response.

## What I'd actually do with this

Groq and Cerebras answered the two easy tasks correctly in under two seconds end to end — most of what I send a model looks like this. For the hard task, I'd choose a model that has solved similar work and check that its provider allows enough output to finish.

Kimi's first token landed at 0.84 seconds and its first _answer_ token at 24.7. Headline latency and the actual wait can be thirty times apart.

For standardized speed and latency benchmarks, see [Artificial Analysis](https://artificialanalysis.ai/models) and its [methodology](https://artificialanalysis.ai/methodology) before trusting mine.

---

_All of these except Qwen were called through OpenRouter, which picks a backend; Qwen went directly to Groq. Kimi K3 is `moonshotai/kimi-k3`, and OpenRouter auto-routed each of its calls to a different provider (Phala, DigitalOcean, Fireworks) — its row sums all three, and its tok/s comes from the Phala sudoku run. The sudoku got a 40,000-token budget for gpt-oss-high, Kimi and GLM; low-effort gpt-oss and Qwen stopped on their own under 400 tokens and never approached a cap. GLM-5.3 hit my earlier 8,000-token cap on one sudoku attempt and solved it in 617 tokens on the next. Dollar figures come from OpenRouter's reported per-call cost; Groq doesn't report one, so Qwen has no cost number._

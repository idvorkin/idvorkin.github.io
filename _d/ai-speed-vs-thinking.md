---
layout: post
title: "Fast Tokens, Wrong Answers"
permalink: /ai-speed-vs-thinking
tags:
  - ai
ai_default_image: true
---

Cerebras and Groq sell the same promise: open-weight models served absurdly fast. I'd been reading their tokens-per-second numbers for months without checking what that speed actually buys me, so I spent an afternoon measuring it — five model configurations, three tasks, every answer graded by my own code instead of the model's say-so.

{% include ai-slop.html percent="85" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The setup](#the-setup)
- [The results](#the-results)
- [The speed is real, and it is latency](#the-speed-is-real-and-it-is-latency)
- [The hard task inverted the ranking](#the-hard-task-inverted-the-ranking)
- [The verifier needed a verifier](#the-verifier-needed-a-verifier)
- [What I'd actually do with this](#what-id-actually-do-with-this)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The setup

Two shallow tasks and one genuinely hard one:

- **Count the 7s** written out from 1 to 1000. The answer is 300.
- **The 10,000th prime** — write the function, then run it. The answer is 104,729.
- **AI Escargot**, advertised by its author as the hardest sudoku ever constructed.

I computed all three ground truths myself before calling a single model. The sudoku grader has three gates: every original clue still present, every row and column and box a permutation of 1–9, and the grid matches the unique solution. That first gate matters more than it sounds like it should — a model can hand you a beautiful grid that solves a puzzle you didn't ask about.

Everything streamed, which separates two numbers that usually get mashed together: **time to first token** (how long before anything comes back) and **throughput** once tokens are flowing. On the sudoku I gave every model a 40,000-token output budget, so nobody failed because of my ceiling — a rerun I only did because my first pass capped output at 8,000 and two models failed on my limit rather than their own.

## The results

| Model                      | Provider            | TTFT  | tok/s | AI Escargot                                        |
| -------------------------- | ------------------- | ----- | ----- | -------------------------------------------------- |
| gpt-oss-120b (effort=low)  | Cerebras            | 0.28s | 1,800 | **Failed** — mis-copied a clue, left 3 cells blank |
| Qwen3.8-27B                | Groq                | 0.22s | 530   | **Failed** — violated 8 clues, not a valid grid    |
| gpt-oss-120b (effort=high) | Cerebras            | 0.42s | 2,850 | **Failed** — never emitted an answer               |
| Kimi K3                    | Phala (auto-routed) | 0.84s | 48    | **Solved** — 20,849 tokens, 7m20s                  |
| GLM-5.3                    | Z.AI                | 3.0s  | 80    | **Solved** — 617 tokens, 11s                       |

TTFT is the median across that model's three tasks; throughput is measured on its longest generation, which is the least noisy sample. A frontier reasoning model generates in roughly the 50–90 tok/s band — I couldn't time one from this box, so treat that as a reference point, not a measurement.

## The speed is real, and it is latency

Groq answers in 220 milliseconds. Cerebras generates at nearly 3,000 tokens per second, which is genuinely startling — GLM-5.3 is 35× slower per token and takes 3 seconds just to clear its throat. On the two shallow tasks every model got the right answer, and the fast ones got it before the slow ones had finished thinking about it.

If your work is mechanical — classify this, extract that, reformat the other — the fast open models are an outright bargain and the benchmark says so. That's most of what I actually send to a model.

## The hard task inverted the ranking

Exactly the models at the top of the speed table failed the one task that required sustained thought, and the two at the bottom passed.

Cerebras is the sharpest illustration. At high reasoning effort, gpt-oss-120b spent its entire output budget thinking and **never produced a grid** — 8,192 tokens of reasoning, `finish_reason: length`, no answer. Asking for 40,000 tokens didn't help, because Cerebras hard-caps that model's output at 8,192 regardless. More reasoning effort bought pure latency and zero correctness. The speed is speed with the thinking budget turned down, and the deployment is built to keep it that way.

Groq's Qwen is the scarier failure. It returned a complete, confident 9×9 grid in **90 tokens and 0.37 seconds** — a grid that violates eight of the puzzle's own clues and isn't a valid sudoku at all. It didn't struggle. It didn't hedge. It was wrong immediately.

Kimi K3, the model I added last, breaks the speed ranking but confirms the pattern. It's the slowest thing here at 48 tok/s, and it solved AI Escargot — by spending **20,849 tokens over seven minutes and twenty seconds**. Correctness came from an enormous thinking budget, not from being clever fast. GLM-5.3 got the same answer in 617 tokens and 11 seconds, which makes it the most impressive result on the board.

## The verifier needed a verifier

Twice today my grader was the thing that was wrong.

First, a model wrote the prime as `104 729` using a Unicode narrow no-break space as a thousands separator; my parser split it into two numbers and marked a correct answer wrong. Second — and worse — my grid parser scraped the last 81 digits out of gpt-oss's _reasoning trace_ and scored a model that emitted no answer at all as having mis-transcribed the puzzle. The verdict was wrong in a way that flattered my narrative, which is exactly the kind of bug that survives review.

If you're grading models, grade the grader. Mine gets checked against a solver I wrote before I called anything.

## What I'd actually do with this

Route by whether the problem needs thinking, not by which number on the pricing page looks best. Mechanical work goes to Groq or Cerebras and comes back before you've let go of the enter key. Anything requiring sustained reasoning goes somewhere slow, and you pay in seconds and tokens — 20,000 of them, sometimes.

The trap isn't that fast models are bad. It's that on the one problem where being wrong mattered, the fastest model was also the most confident, and it was wrong in less than half a second.

For per-model throughput and latency numbers across the whole field, [Artificial Analysis](https://artificialanalysis.ai/models) tracks this properly. My take on where inference cost actually comes from is in [AI Inference](/ai-inference).

---

_Single runs, not averages — treat these as one afternoon's snapshot, not a leaderboard. Kimi K3 is `moonshotai/kimi-k3` on OpenRouter, which auto-routed it to a different provider on each call (Phala, DigitalOcean, Fireworks), so its throughput number mixes backends. GLM-5.3's token spend on the sudoku swung from 617 to over 8,000 across runs; the fast models' failures were stable._

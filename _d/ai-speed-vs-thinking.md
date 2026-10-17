---
layout: post
title: "Fast Tokens, Wrong Answers"
permalink: /ai-speed-vs-thinking
tags:
  - ai
ai_default_image: true
---

Waiting for language models is painful. Igor has long been excited by accelerator companies promising absurd token rates, and he wanted to know what working at that speed felt like. Groq's chip team went to Nvidia while Cerebras went public; either way, their clouds rent the smaller, open-weight tier, not the closed frontier models Igor normally uses. That gave him an excuse to try open-source large models — and gave me a benchmark to run.

{% include ai-voice.html %}

Trying them meant Igor collected a pile of API keys, one per provider, because that was how he had to use them. OpenRouter eventually collapsed most of the pile into one key. "Not that I look at the code anymore," he said. Fair: I wrote the harness.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Technical details](#technical-details)
- [The results](#the-results)
- [The thinking dial](#the-thinking-dial)
- [Thinking harder didn't help](#thinking-harder-didnt-help)
- [What I'd actually do with this](#what-id-actually-do-with-this)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Technical details

I tested five model configurations on two shallow tasks and one hard one:

- **Count the 7s** in the numerals from 1 through 1000. The answer is 300.
- **Find the 10,000th prime** by writing and running a function. The answer is 104,729.
- **Solve Arto Inkala's 2012 sudoku**, the one he built to be the hardest he could make and the papers ran as the world's hardest.

I sent gpt-oss-120b, GLM-5.3, and Kimi K3 through OpenRouter; Qwen3.8-27B went directly to Groq. The gpt-oss request included `provider: {"order":["Cerebras"]}`, and OpenRouter confirmed that Cerebras served every call.

Every call used `stream: true`. I recorded TTFT as the first token of any kind, including reasoning, and `ttft_answer_s` as the first actual answer token. Completion-token counts include reasoning, so I measured generation from the first token to the last token across every delta. My earlier content-only window briefly claimed 9.1 million tok/s, which was a useful hint that I had measured nonsense.

The first streamed pass set `max_tokens=8000`; GLM and Kimi both truncated on my ceiling. I raised the sudoku ceiling to 40,000 and reran the long paths. Cerebras still stopped high-effort gpt-oss at 8,192, its own cap. The low-effort gpt-oss and Qwen runs had already stopped on their own well below the ceiling.

Groq added two small pieces of friction. Its TPM limit is 8,000, so a 7,000-token request returned 429; I retried at `max_tokens=3000` with 65 seconds between calls. It also returned 403 for urllib's default User-Agent until I supplied one explicitly.

I computed every ground truth before calling a model. The sudoku grader has three gates: preserve every clue; make every row, column, and box a permutation of 1–9; and match the unique solution. The first gate catches a model that rewrites the puzzle and then solves its own typo.

My grader still needed a grader. One model wrote the prime as `104 729` with a Unicode narrow no-break space; my parser split it and marked a correct answer wrong. Then my grid parser scraped the last 81 digits from gpt-oss's _reasoning trace_ even though the model emitted no answer. That verdict was wrong in the direction that flattered the story I was already telling. I fixed both bugs and re-graded every saved response. The [evals repo](https://github.com/idvorkin-ai-tools/llm-speed-evals) contains the harness, raw per-call JSON, and grader.

## The results

Each row below comes from one run of that sudoku, so latency, output, throughput, and verdict are finally paired:

<div class="table-responsive small" markdown="1">

| Model                   | Verdict    | Effort  | TTFT  | 1st ans | Total | Tokens | tok/s |
| ----------------------- | ---------- | ------- | ----- | ------- | ----- | ------ | ----- |
| Qwen3.8-27B (Groq)      | Failed     | none    | 0.20s | 0.20s   | 0.37s | 90     | 526   |
| gpt-oss-120b (Cerebras) | Failed     | low     | 0.28s | 0.38s   | 0.48s | 337    | 1,805 |
| gpt-oss-120b (Cerebras) | No answer  | high    | 0.42s | never   | 3.3s  | 8,192  | 2,848 |
| GLM-5.3 (Z.AI)          | **Solved** | default | 4.0s  | 10.6s   | 11.4s | 617    | 83    |
| Kimi K3 (Phala)         | **Solved** | default | 2.4s  | 7m19s   | 7m20s | 20,849 | 48    |

</div>

Qwen returned a complete-looking grid in 90 tokens and 0.37 seconds, with no hedging. It shifted a clue and solved its own typo; the first mismatch was r5c5. Low-effort gpt-oss repeated the trick at r4c6. High effort spent 8,179 of its 8,192 tokens reasoning, hit `finish_reason: length`, and never emitted a grid.

## The thinking dial

Reasoning effort controls how many tokens a model spends before answering. Only gpt-oss-120b exposed the setting here, so I tested low and high. High effort turned a fast wrong answer into a longer non-answer: the provider cap ended its reasoning before it could respond.

## Thinking harder didn't help

The sudoku runs broke the obvious theory that a larger reasoning budget would win:

- **GLM-5.3** solved it with **556 reasoning tokens**.
- **gpt-oss-120b at high effort** burned **8,179** and never answered.
- **Kimi K3** spent **9,694** and solved it.

Reasoning budget did not predict correctness here. GLM used 617 output tokens in 11.4 seconds; Kimi used 20,849 in 7 minutes 20 seconds. Across the three runs in this table's pass, OpenRouter reported **$0.024 for GLM against $0.339 for Kimi** — about fourteen times the cost for the same three correct answers.

## What I'd actually do with this

Groq and Cerebras answered both easy tasks correctly in under two seconds end to end. For shallow work I can cheaply verify, that speed is delightful. For hard work, I would choose a model that has solved similar problems and check that its provider gives it enough room to finish.

Kimi's first token landed at 2.4 seconds. Its first _answer_ token arrived at 438.9 seconds — about 180 times later. Headline latency and the actual wait can be different experiences.

For standardized speed and latency benchmarks, see [Artificial Analysis](https://artificialanalysis.ai/models) and its [methodology](https://artificialanalysis.ai/methodology) before trusting mine.

---

_These are single selected runs, not averages. The 40,000-token rerun supplies the gpt-oss-high, GLM, and Kimi rows; low-effort gpt-oss and Qwen stopped on their own in the first streamed pass. All models except Qwen were called through OpenRouter; gpt-oss was pinned to Cerebras, while the table's Kimi call auto-routed to Phala. Kimi's two easy tasks went to DigitalOcean and Fireworks. Providers count tokens differently, so cross-family rates are directional. Dollar figures sum OpenRouter's reported cost for all three tasks; Groq reported no cost for Qwen._

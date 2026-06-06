---
layout: post
title: "AI Inference"
permalink: /ai-inference
redirect_from:
  - /inference
  - /serving-llms
tags:
  - ai
  - machine-learning
---

[Training](/ai-training) is how a model gets made; inference is what you pay for every time you _use_ it. I don't build serving stacks — I pick a model, pick a provider, and pay per token — but it helps to carry a rough map of where that price comes from. The whole game is one question: **how do I serve tokens as cheaply as possible at a given level of intelligence?** You can always spend more compute and memory to go faster — the price just rises with it.

{% include alert.html content="Everything here is public information and my own opinions. There's no internal Meta secret sauce in here, and nothing on this page represents the views of my employer." style="info" %}

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The triangle: cost, latency, throughput](#the-triangle-cost-latency-throughput)
- [Prefill vs decode](#prefill-vs-decode)
  - [The KV cache](#the-kv-cache)
- [Knobs that lower the price](#knobs-that-lower-the-price)
  - [Quantization](#quantization)
  - [The model matters: MoE, speculative decoding, smaller models](#the-model-matters-moe-speculative-decoding-smaller-models)
  - [Batching](#batching)
- [Serving stacks](#serving-stacks)
- [Hardware reality: bandwidth, not FLOPs](#hardware-reality-bandwidth-not-flops)
- [Takeaways for a model consumer](#takeaways-for-a-model-consumer)
- [What this post is not about](#what-this-post-is-not-about)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The triangle: cost, latency, throughput

Every serving decision trades three things against each other:

- **Latency** — how fast a single user feels it. Two pieces: _time-to-first-token_ (how long before anything shows up) and _tokens-per-second_ (how fast the text streams after that).
- **Throughput** — total tokens (or requests) the box serves across _everyone_ at once.
- **Cost** — $/token, which mostly tracks how well you keep expensive hardware busy.

You don't get all three. Pack more users onto one GPU and throughput and $/token improve, but each user waits longer — their latency gets worse. Give one user a whole GPU and they get blazing latency at a terrible price. Most of what follows is just ways to bend this triangle: get more tokens out of the same hardware without wrecking latency.

## Prefill vs decode

The single most useful mental model. Inference runs in two phases that look nothing alike.

- **Prefill** — read the whole prompt at once. Every token of the prompt goes through the model in parallel, so prefill is **compute-bound**: it's bottlenecked on raw GPU math (FLOPs). This sets your **time-to-first-token**. A huge prompt means a long prefill before the first word appears.
- **Decode** — generate the answer one token at a time. Each new token depends on the previous one, so it's sequential — no parallelism to hide behind. For _every single token_, the GPU has to stream the entire model's weights (plus the cache below) out of memory. That makes decode **memory-bandwidth-bound**, not compute-bound. The GPU's math units sit mostly idle, waiting on memory.

The payoff: **long outputs are decode-bound, and decode is gated by memory bandwidth.** That's why a long response feels slow even on a fast GPU — you're not short on math, you're short on how fast you can move weights. Almost every speedup trick below is really "move fewer bytes per token." ([A good prefill-vs-decode explainer](https://vllm.ai/blog/2023-06-20-vllm).)

### The KV cache

When the model reads your prompt, attention computes a key and value for each token. Recomputing those for the whole context on every new token would be insane, so they're cached — the **KV cache**. Decode then reuses it instead of re-reading the past.

The catch: the cache grows with **context length × batch size**. Longer conversations and more simultaneous users both inflate it, and it lives in the same precious GPU memory as the weights. Eventually the KV cache, not the model, is what fills the card — which caps how many users you can batch and, by extension, your throughput and $/token. This is why long contexts cost more: you're renting memory for the whole conversation, every token.

## Knobs that lower the price

### Quantization

Store weights in fewer bits — 16-bit down to ~4-bit or less. The [training post covers this for shrinking the file](/ai-training#deployment-quantization-and-serving); for inference the point is **speed**. Fewer bits per weight means fewer bytes to stream per token, and since decode is bandwidth-bound, less data moved = faster, cheaper decode. The cost is some quality loss, so you eval the damage.

You can quantize the **KV cache** too, not just the weights — same idea, pointed at the cache that's eating your memory. It buys you longer contexts and bigger batches at some accuracy cost.

### The model matters: MoE, speculative decoding, smaller models

The cheapest token is the one a cheaper model serves. Three ways the model itself changes the bill:

- **Mixture of Experts (MoE)** — split the network into many "expert" sub-networks and, per token, a router fires only a few of them. You get big-model quality at small-model _active_-parameter cost, because decode only streams the active slice. [DeepSeek-V3](https://arxiv.org/abs/2412.19437) is 671B total parameters but activates only **37B per token** (~1/18th); [Mixtral 8x7B](https://mistral.ai/news/mixtral-of-experts/) has 47B total and uses ~13B per token. You still pay to _hold_ all the weights in memory, but you only pay bandwidth for the active ones — which is the part that matters for decode speed. This is the main reason frontier-quality tokens have gotten cheap.
- **Speculative decoding** — a small, fast _draft_ model proposes the next several tokens; the big model then verifies that whole batch in a single parallel forward pass. Because verification is parallel (and parallel is what GPUs are starved for during decode), you get multiple accepted tokens per expensive big-model pass. The output is provably identical to what the big model would've produced alone — it's a pure speedup, not a quality trade. ([How it works](https://bentoml.com/llm/inference-optimization/speculative-decoding).)
- **Smaller / distilled models** — the boring, biggest win. Most tasks don't need the frontier. A distilled or just plain smaller model serves the same job at a fraction of the bandwidth and price.

### Batching

One user can't keep a GPU busy — decode leaves the math units idle waiting on memory, so you stuff more users through on the same weight-load. The trick is doing it without making everyone wait for the slowest request in the batch.

**Continuous (in-flight) batching** does this: instead of waiting for a whole batch to finish, the scheduler adds and evicts requests token-by-token, so a finished request frees its slot immediately and a waiting one slides in. [vLLM](https://vllm.ai/blog/2023-06-20-vllm) pairs this with **PagedAttention**, which stores the KV cache in fixed-size pages (like OS virtual memory) instead of one big contiguous block — that cuts memory waste and pushes cache utilization from ~40% to ~96%, which means more users fit, which means more throughput. The tension never goes away though: bigger batches = better throughput and $/token, worse per-user latency.

## Serving stacks

What people actually run:

- **[vLLM](https://github.com/vllm-project/vllm)** — the default open-source server; continuous batching + PagedAttention, high throughput.
- **[TGI](https://github.com/huggingface/text-generation-inference)** (Text Generation Inference) — Hugging Face's production server.
- **[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)** — NVIDIA's, squeezes the most out of NVIDIA hardware, fiddlier to drive.
- **[llama.cpp](https://github.com/ggml-org/llama.cpp)** — run quantized models on a laptop or CPU; the engine under a lot of local setups.
- **[Ollama](https://ollama.com)** — `brew install` it, `ollama run llama3`, done. Wraps llama.cpp for painless local use.

The first three are for serving lots of users; the last two are for running a model on your own machine.

## Hardware reality: bandwidth, not FLOPs

The spec sheet number everyone quotes is FLOPs (raw math throughput). For decode, that's the wrong number. Decode is bottlenecked on **memory bandwidth** — how fast the GPU reads weights out of its own memory — so the figure that actually predicts your tokens-per-second is GB/s, not TFLOPs. It's why an H100 stomps a 4090 on serving even when the FLOP gap is smaller than you'd expect, and why "how much fast memory, how fast" is the question I'd ask first when someone picks a GPU. A card with more, faster memory serves more tokens.

## Takeaways for a model consumer

I'm paying per token, not building the stack. What the above means at the invoice:

- **Long contexts cost more — usually more than you'd guess.** You're paying for prefill compute up front _and_ renting KV-cache memory for the whole conversation, every token after. Trim context that isn't earning its keep.
- **Output length is the expensive part.** Decode is the slow, bandwidth-bound phase, so a model that rambles costs more than its $/token implies. Ask for concise output; cap `max_tokens`.
- **Prefer MoE for quality-per-dollar.** When two models are close on quality, the MoE one is usually cheaper per token for the same smarts — that's the whole point of the architecture.
- **Drop to a smaller model when the frontier is overkill.** Routing, classification, extraction, summarization — most of this doesn't need the biggest model. Match the model to the job; it's the single biggest lever on cost.
- **Caching is free money.** Many providers cache prompt prefixes — reuse a stable system prompt or document prefix and you skip re-prefilling it. Structure prompts so the constant part comes first.

## What this post is not about

- **How the model gets made** — that's [/ai-training](/ai-training), the parent post here. Pre-training, post-training, fine-tuning, RAG vs the harness.
- **Putting models to work in an agent loop** — the harness, tools, and orchestration live in [/chop](/chop) and [/how-igor-chops](/how-igor-chops). Inference is the layer underneath that; this post is about its cost.
- **The basics** — "what even is an LLM" is [/ai-faq](/ai-faq).

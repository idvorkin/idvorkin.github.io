---
layout: post
title: AI Image Generation
permalink: /ai-image
redirect-from:
  - /ai-imagegen
---

Everyone talks about GPT, but you can also generate images. Lately I've been playing with Flux, which is an image generator. You can generate images of me using the idvorkin with this lora on replicate.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Igor Image Generation](#igor-image-generation)
- [Flux](#flux)
- [History Lessons](#history-lessons)
- [Completion](#completion)
- [How it works](#how-it-works)
    - [Diffusion](#diffusion)
    - [LoRAs](#loras)
    - [Blending LoRAs](#blending-loras)
- [Providing Inputs](#providing-inputs)
    - [Text 2 Image; Control Nets; In Painting](#text-2-image-control-nets-in-painting)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Igor Image Generation

In the prompt, I'm idvorkin,

- [Igor with Mona Lisa](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=ax1m29vk19rm20chk68rkah1y0) on a sail boat.
- https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=ax1m29vk19rm20chk68rkah1y0

![Igor doing something](https://replicate.delivery/yhqm/CRLshgbk5ZomNp7GxHSISkMrtynHNufLEZJpFHCa7lcGvXrJA/out-0.webp)

You can blend in:

- mona lisa: huggingface.co/fofr/flux-mona-lisa
- scarlett johansson:

* Real and Boring - [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) - Keyword is photo

Blend multi loras (equal weights)

## Flux

As of April '24, Flux.Dev is the new open source hotness. You can train a LoRA on yourself, and then blend it with other LoRAs to do fun stuff. Here's me playing with stuff.

## History Lessons

## Completion

## How it works

### Diffusion

### LoRAs

### Blending LoRAs

## Providing Inputs

### Text 2 Image; Control Nets; In Painting

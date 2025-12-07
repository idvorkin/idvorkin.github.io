---
layout: post
title: AI Image Generation
permalink: /ai-image
redirect-from:
  - /ai-imagegen
---

Everyone talks about GPT, but you can also generate images. Lately, I've been playing with Flux, which is an image generator. You can generate images of me using the idvorkin with this lora on replicate.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Fun Demo](#fun-demo)
- [Talking Head Videos From your Head](#talking-head-videos-from-your-head)
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

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

![montage of the sequence](https://raw.githubusercontent.com/idvorkin/ipaste/main/20240831_123538.webp)

## Fun Demo

- Let's start with the Mona Lisa for ChatGPT

_"A portrait of a woman with an enigmatic smile, seated in front of a distant landscape. She has dark, flowing hair and is wearing a modest dark dress with a translucent veil. The background features a winding path and a bridge, with a serene and dreamy landscape under a soft, diffused light. The overall mood is mysterious and timeless."_

- Let's try that with a lora of [the Mona Lisa](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=fbws5428h1rm00chn7srq9ykw0)

- Now, let's add [me to that scene](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=a2g5p4az7nrm60chn7ts0pdd0c)
  _"A portrait of MNALSA with an enigmatic smile, seated in front of a distant landscape. She has dark, flowing hair and is wearing a modest dark dress with a translucent veil. She is sitting beside her boyfriend, a middle-aged bald man, idvorkin. The background features a winding path and a bridge, with a serene and dreamy landscape under a soft, diffused light. The overall mood is mysterious and timeless."_

## Talking Head Videos From your Head

Woah, this works surprisingly well:

- <https://studio.infinity.ai>

https://youtube.com/shorts/Y_YxRPC46-E?feature=share
{%include youtube.html src="Y_YxRPC46-E" %}

## Igor Image Generation

In the prompt, I'm idvorkin,

- [Igor with Mona Lisa](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=ax1m29vk19rm20chk68rkah1y0) on a sailboat.
- <https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=ax1m29vk19rm20chk68rkah1y0>

![Igor doing something](https://replicate.delivery/yhqm/CRLshgbk5ZomNp7GxHSISkMrtynHNufLEZJpFHCa7lcGvXrJA/out-0.webp)

You can blend in:

- Mona Lisa: huggingface.co/fofr/flux-mona-lisa
- Scarlett Johansson:

- Real and Boring - [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) - Keyword is photo

Blend multi loras (equal weights)

## Flux

As of April '24, Flux.Dev is the new open source hotness. You can train a LoRA on yourself, and then blend it with other LoRAs to do fun stuff. Here's me playing with stuff.

## History Lessons

## Completion

## How it works

### Diffusion

### LoRAs

Interesting -
So the original model is like 23GB, a Lora seems to be 200MB, or 1/100th the size. You can load any concepts you want.

### Blending LoRAs

## Providing Inputs

### Text 2 Image; Control Nets; In Painting

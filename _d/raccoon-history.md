---
layout: post
title: "The Raccoon Mascot: A Visual History"
permalink: /raccoon-history
tags:
  - ai
  - blog-meta
imagefeaturelocal: raccoon-magic.webp
---

Every blog needs a mascot, and mine is a raccoon — specifically, a cute anthropomorphic raccoon wearing rainbow round glasses, a green t-shirt with bold white text, and mismatched Crocs (blue left, yellow right). Here's the story of how that character evolved from early AI experiments to a cohesive visual brand.

{% include ai-slop.html percent="80" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Origin Story: December 2022](#origin-story-december-2022)
- [The Original Pack (v1 — DALL-E era, 2022)](#the-original-pack-v1--dall-e-era-2022)
- [The Refresh (v2 — GPT Image, 2025)](#the-refresh-v2--gpt-image-2025)
- [The Brand System (v3 — 2026)](#the-brand-system-v3--2026)
- [The March 2026 Audit](#the-march-2026-audit)
- [Character Design Reference](#character-design-reference)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Origin Story: December 2022

{% include local_image_float_right.html src="raccoon-magic.webp" %}

During a [December 2022 time-off](/timeoff-2022-12#ai-image-assisting-and-brand-blog-with-raccoons), I started experimenting with AI image generation for the blog. The results were charming enough to commit to: a raccoon mascot for every major section of my [eulogy](/eulogy).

The first generation used DALL-E (the best available at the time) and produced a set of `.png` images with inconsistent styles — some 3D-rendered, some semi-photorealistic, some with odd color casts. They were pioneers, not polished.

## The Original Pack (v1 — DALL-E era, 2022)

These were the originals, added December 31, 2022. Notice the inconsistent styles — some 3D cartoon, some semi-photorealistic:

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 1em 0;">
<div style="text-align: center;"><img src="/images/raccoon-magic.png" style="width: 100%; border-radius: 8px;" /><br/><small>magic</small></div>
<div style="text-align: center;"><img src="/images/raccoon-bike.png" style="width: 100%; border-radius: 8px;" /><br/><small>bike</small></div>
<div style="text-align: center;"><img src="/images/raccoon-lifting-weights.png" style="width: 100%; border-radius: 8px;" /><br/><small>lifting-weights</small></div>
<div style="text-align: center;"><img src="/images/raccoon-nerd.png" style="width: 100%; border-radius: 8px;" /><br/><small>nerd</small></div>
<div style="text-align: center;"><img src="/images/raccoon-quill.png" style="width: 100%; border-radius: 8px;" /><br/><small>quill</small></div>
<div style="text-align: center;"><img src="/images/raccoon-family.png" style="width: 100%; border-radius: 8px;" /><br/><small>family</small></div>
<div style="text-align: center;"><img src="/images/raccoon-meditate.png" style="width: 100%; border-radius: 8px;" /><br/><small>meditate</small></div>
<div style="text-align: center;"><img src="/images/raccoon-vacation.png" style="width: 100%; border-radius: 8px;" /><br/><small>vacation</small></div>
</div>

These served the blog well for over two years, but the style was inconsistent across images and clearly "early AI generation."

## The Refresh (v2 — GPT Image, 2025)

In August 2025, the eulogy images got a full refresh using OpenAI's `gpt-image-1` model. This generation established the **canonical raccoon brand**:

- Rainbow round glasses
- Green t-shirt with bold white text (unique per image)
- Blue left Croc, yellow right Croc
- Soft plush 3D/vinyl illustration style
- Studio softbox lighting
- Subtle vintage film grain
- Children's book aesthetic

The prompts were codified in [`scripts/generate_igor_images.py`](https://github.com/idvorkin/idvorkin.github.io/blob/main/scripts/generate_igor_images.py) so images could be regenerated consistently. This was a huge leap — from "interesting AI experiment" to "coherent visual identity."

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 1em 0;">
<div style="text-align: center;"><img src="/images/raccoon-magic.webp" style="width: 100%; border-radius: 8px;" /><br/><small>DEALER OF WONDER</small></div>
<div style="text-align: center;"><img src="/images/raccoon-bike.webp" style="width: 100%; border-radius: 8px;" /><br/><small>CAR-FREE SPIRIT</small></div>
<div style="text-align: center;"><img src="/images/raccoon-lifting-weights.webp" style="width: 100%; border-radius: 8px;" /><br/><small>FIT FELLOW</small></div>
<div style="text-align: center;"><img src="/images/raccoon-nerd.webp" style="width: 100%; border-radius: 8px;" /><br/><small>TECHNOLOGIST</small></div>
<div style="text-align: center;"><img src="/images/raccoon-meditate.webp" style="width: 100%; border-radius: 8px;" /><br/><small>PAIN GOOD!</small></div>
<div style="text-align: center;"><img src="/images/raccoon-family.webp" style="width: 100%; border-radius: 8px;" /><br/><small>FAMILY</small></div>
<div style="text-align: center;"><img src="/images/raccoon-husband.webp" style="width: 100%; border-radius: 8px;" /><br/><small>IGOR &hearts; TORI</small></div>
<div style="text-align: center;"><img src="/images/raccoon-vacation.webp" style="width: 100%; border-radius: 8px;" /><br/><small>ON VACATION</small></div>
</div>

## The Brand System (v3 — 2026)

Through early 2026, new raccoon images were added for specific pages, all following the established brand:

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 1em 0;">
<div style="text-align: center;"><img src="/images/raccoon-money.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/taxes">Taxes</a> — suited up</small></div>
<div style="text-align: center;"><img src="/images/raccoon-zach-orthodox-church.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/greek-orthodox">Greek Orthodox</a></small></div>
<div style="text-align: center;"><img src="/images/raccoon-year-of-chaos-wonder.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/ai-native-manager">Optimist</a></small></div>
<div style="text-align: center;"><img src="/images/raccoon-ai-native-em-plates.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/ai-native-manager">Plate-spinning EM</a></small></div>
<div style="text-align: center;"><img src="/images/raccoon-ai-team-sport.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/ai-native-manager">AI as Team Sport</a></small></div>
</div>

## The March 2026 Audit

In March 2026, we did a full audit of every raccoon image. Three images were off-brand and got replaced:

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 1em 0;">
<div style="text-align: center;"><img src="/images/raccoon-caring.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/caring">CARING</a> — replaced lab-coat outlier</small></div>
<div style="text-align: center;"><img src="/images/raccoon-shoulder.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/shoulder-pain">OUCH</a> — replaced 2D anime style</small></div>
<div style="text-align: center;"><img src="/images/raccoon-quill.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/writing">WRITER</a> — first .webp version</small></div>
</div>

**Updated references:** 13 pages still pointed to old `.png` versions — all updated to `.webp` (including fixing a "vaccation" typo in 4 time-off posts).

**Cleaned up:** Deleted unused `raccoon-ai-native-em.webp` (duplicate, zero page references).

**Final count after audit:** 16 raccoon images, all on-brand.

## Character Design Reference

{% include local_image_float_right.html src="raccoon-nerd.webp" %}

The canonical raccoon character specification (from `generate_igor_images.py`):

> Cute anthropomorphic raccoon character, big rainbow round glasses, green t-shirt with bold white text, blue left Croc and yellow right Croc, soft plush 3D/vinyl illustration, big friendly eyes, studio softbox lighting, transparent background, subtle vintage film grain, children's book style. Full body.

Each image varies only the **action/scene** and **shirt text**. This constraint is what makes the brand work — instant recognition across 16 images.

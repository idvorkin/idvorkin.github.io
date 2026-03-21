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

During a [December 2022 time-off](/time_off_2022_12#ai-image-assisting-and-brand-blog-with-raccoons), I started experimenting with AI image generation for the blog. The results were charming enough to commit to: a raccoon mascot for every major section of my [eulogy](/eulogy).

The first generation used DALL-E (the best available at the time) and produced a set of `.png` images with inconsistent styles — some 3D-rendered, some semi-photorealistic, some with odd color casts. They were pioneers, not polished.

## The Original Pack (v1 — DALL-E era, 2022)

These were the originals, added December 31, 2022:

| Image | Style | Notes |
|-------|-------|-------|
| raccoon-magic.png | Pixar-adjacent 3D | Purple top hat magician, muddy card details |
| raccoon-bike.png | Semi-photorealistic | Photo-fur on a 3D bike — style clash |
| raccoon-lifting-weights.png | Clay-like 3D | Cute but generic — no raccoon markings |
| raccoon-nerd.png | Clean 3D | Strongest of the v1 set — good glasses |
| raccoon-quill.png | Matte 3D | Naturalistic but flat and lifeless |
| raccoon-family.png | Stylized photo | Pink/teal color cast, didn't match the set |
| raccoon-meditate.png | Smooth 3D | Best of v1 — genuinely peaceful expression |
| raccoon-vacation.png | Playful 3D | Beach chair and shades, fun composition |

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

**v2 eulogy pack**: magic, bike, lifting-weights, meditate, nerd, family, husband — all `.webp`, all on-brand.

## The Brand System (v3 — 2026)

Through early 2026, new raccoon images were added for specific pages, all following the established brand:

| Image | Added | Page | Notes |
|-------|-------|------|-------|
| raccoon-money.webp | Mar 2025 | [Taxes](/taxes) | Suited-up variation — still has the glasses |
| raccoon-shoulder.webp | Jan 2026 | [Shoulder Pain](/shoulder-pain) | ⚠️ 2D anime style — brand outlier |
| raccoon-zach-orthodox-church.webp | Feb 2026 | [Greek Orthodox](/greek-orthodox) | Two raccoons with candles, beautiful |
| raccoon-year-of-chaos-wonder.webp | Mar 2026 | [AI Native EM](/ai-native-manager) | Dual glasses metaphor — one of the best |
| raccoon-ai-native-em-plates.webp | Mar 2026 | [AI Native EM](/ai-native-manager) | Plate-spinning — most dynamic in the set |
| raccoon-ai-team-sport.webp | Mar 2026 | [AI Native EM](/ai-native-manager) | Functions as illustration AND diagram |

Two images were added that didn't follow the brand system:
- **raccoon-caring.webp** (Aug 2024) — Red rectangular glasses, lab coat, garbled "emotion meter" text. Completely different character.
- **raccoon-shoulder.webp** (Jan 2026) — 2D anime-style illustration, breaking the 3D aesthetic.

## The March 2026 Audit

In March 2026, we did a full audit of every raccoon image. The findings:

**Keep (on-brand, high quality):** All v2 eulogy images, money, zach-orthodox-church, year-of-chaos-wonder, ai-native-em-plates, ai-team-sport.

**Replace (stale or off-brand):**

1. **raccoon-caring.webp** → Regenerated with brand-consistent style. Raccoon gently holding a glowing heart. Shirt text: "CARING."
2. **raccoon-shoulder.webp** → Regenerated from 2D anime to 3D plush style. Raccoon clutching a glowing red shoulder with ice pack. Shirt text: "OUCH."
3. **raccoon-quill.png** → Only image with no `.webp` replacement. Regenerated with the raccoon at a desk with a golden quill. Shirt text: "WRITER."

**Updated references:** Several pages still pointed to old `.png` versions despite `.webp` replacements existing. These were updated to use the modern versions.

## Character Design Reference

The canonical raccoon character specification (from `generate_igor_images.py`):

> Cute anthropomorphic raccoon character, big rainbow round glasses, green t-shirt with bold white text, blue left Croc and yellow right Croc, soft plush 3D/vinyl illustration, big friendly eyes, studio softbox lighting, transparent background, subtle vintage film grain, children's book style. Full body.

Each image varies only the **action/scene** and **shirt text**. This constraint is what makes the brand work — instant recognition across 15+ images.

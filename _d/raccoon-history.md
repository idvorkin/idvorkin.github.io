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
- [The 7 Habits Marathon (May 2026)](#the-7-habits-marathon-may-2026)
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

## The 7 Habits Marathon (May 2026)

In May 2026 I wired hero raccoons into all seven [7 Habits chapter posts](/7h). It took four iterations (v1 → v4, 21-35 cells per round, 7 habits × 5 variations on the final pass) and turned into the most useful pattern of the season: stop asking AI for "the best" raccoon — generate a wide field and let me pick.

Final picks, one per habit:

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 1em 0;">
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c1.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/be-proactive">Be Proactive</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c2.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/end-in-mind">Begin with the End in Mind</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c3.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/first-things-first">First Things First</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c4.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/win-win">Win/Win</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c5.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/first-understand">Seek First to Understand</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c6.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/synergize">Synergize</a></small></div>
<div style="text-align: center;"><img src="https://github.com/idvorkin/blob/raw/master/blog/raccoon-7h-c7.webp" style="width: 100%; border-radius: 8px;" /><br/><small><a href="/sharpen-the-saw">Sharpen the Saw</a></small></div>
</div>

**The choice-sheet pattern.** The bottleneck on this batch wasn't "can the model generate" — it was "which one do I want." So I built a click-to-pick HTML sheet: 7 rows × 5 variations, `localStorage`-persistent picks, JSON copy button at the bottom, mobile-responsive. ~15 minutes of human picking and the right raccoons were obvious — much faster than iterating one prompt at a time. Live demo at [/image-selector](/image-selector), reusable pattern published as a [public gist](https://gist.github.com/idvorkin-ai-tools/309aea3cd0d2e43e783f2c061e920755) (HTML/JS + README + CC0). The blog instance base64-inlines all 35 raccoons so the page is fully self-contained.

**Three things I learned, distilled** ([full entry](/ai-journal#2026-05-11)):

- **Reference images beat prompt prose** for character locking. Passing `raccoon-nerd.webp` as a reference to Gemini Pro pulled canonical style 100% of the time. No amount of `IMPORTANT: rainbow glasses, mismatched Crocs, TECHNOLOGIST shirt…` ever matched one reference image. Imagen ignored the style block entirely — a [permanent note now says never Imagen for canonical raccoon](https://github.com/idvorkin/idvorkin.github.io/blob/main/_d/ai-journal.md).
- **Recraft's `removeBackground` beat my chroma-key hill-climb.** I'd been sharpening a local pipeline for six attempts; switching to a paid bg-remover at a penny per image solved it in an afternoon. The [Wrong Jungle lesson](/ai-journal#free-doesnt-save-you-from-the-wrong-problem) from the day before applied immediately to this batch.
- **AI helps me think by showing me options.** When the work is a judgment call I'll live with, AI's job is to widen the option space, not narrow it. I often can't articulate my taste in the abstract — but I can tell you which raccoon I want when I see them side-by-side. Cheap model for the wide pass, human picks, expensive model only for the winners.

**Final count after May 2026:** 23 raccoon images, all on-brand.

## Character Design Reference

{% include local_image_float_right.html src="raccoon-nerd.webp" %}

The canonical raccoon character specification (from `generate_igor_images.py`):

> Cute anthropomorphic raccoon character, big rainbow round glasses, green t-shirt with bold white text, blue left Croc and yellow right Croc, soft plush 3D/vinyl illustration, big friendly eyes, studio softbox lighting, transparent background, subtle vintage film grain, children's book style. Full body.

Each image varies only the **action/scene** and **shirt text**. This constraint is what makes the brand work — instant recognition across 16 images.

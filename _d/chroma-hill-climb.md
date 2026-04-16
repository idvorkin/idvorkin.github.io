---
layout: post
title: "Hill-Climbing a Clean Chroma-Key"
permalink: /chroma-hill-climb
tags:
  - ai
  - tools
  - how
redirect_from:
  - /transparent-bg-hill-climb
  - /chroma-key-hill-climb
---

AI image generators give me 3D raccoon character art in minutes, but a blog post needs the character composited cleanly on whatever theme the reader is using — light mode, dark mode, a gray tag page, an RSS reader. A naive chroma-key strips the background but eats interior highlights along the way, and the damage is invisible until you composite against the wrong color. This post walks through five approaches I tried for the [claws trio illustration](/claw), ranked worst to best, with alpha-mask evidence at each step. The winner turned out to be older than ML: edge-connected flood-fill.

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Setup](#the-setup)
- [Approach 1: Dark Background, No Transparency](#approach-1-dark-background-no-transparency)
- [Approach 2: Simple Chroma-Key](#approach-2-simple-chroma-key)
- [Approach 3: Double-Pass Chroma With Tighter Fuzz](#approach-3-double-pass-chroma-with-tighter-fuzz)
- [Approach 4: rembg Semantic Segmentation](#approach-4-rembg-semantic-segmentation)
- [Approach 5: Edge-Connected Flood-Fill Chroma](#approach-5-edge-connected-flood-fill-chroma)
- [Verification Protocol: Look at the Alpha](#verification-protocol-look-at-the-alpha)
- [The One-Liner](#the-one-liner)
- [Why Hill-Climbing Works Here](#why-hill-climbing-works-here)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The Setup

I was generating a trio portrait for my [claws](/claw) post — three raccoons representing Karpathy's taxonomy of persistent AI entities. [Larry](/larry) as Freud with a lobster-claw arm, Wally with a laptop, Tony in a Cybertruck. The trio needed to composite cleanly on both my light theme and dark theme, which meant the PNG had to carry a real alpha channel and survive a zoom. Two hours of iteration later, I had five attempts on disk and a clear picture of why the obvious approach breaks.

## Approach 1: Dark Background, No Transparency

The first path is the cheap one: render the scene on a dark gradient and don't bother with transparency. The image looks fine on a dark page. It looks wrong everywhere else.

![Source rendered on a dark scene](https://gist.githubusercontent.com/idvorkin-ai-tools/5944083f46861b377e24bf2520cd0f81/raw/01-source-dark.jpg)

The background locks the image to a single theme. When I preview the same post on my phone in light mode, the raccoons sit inside an obvious dark rectangle that breaks the page. For a one-off illustration this is fine, but for reusable character art it's a dead end. Score: 0 of 5.

## Approach 2: Simple Chroma-Key

Next attempt: render on a magenta background (`#FF00FF`) and strip it with ImageMagick's `-fuzz -transparent`. This is the classic greenscreen trick, just in magenta because raccoons don't have magenta anywhere on them.

```bash
magick input.webp -fuzz 12% -transparent "#FF00FF" output.webp
```

It works. The alpha channel separates character from background. But there are two failure modes, and the second one is the one that bit me:

1. **Pink fringe on the ground shadow** — the renderer antialiases the character-to-background transition, so each pixel along a soft edge picks up some magenta. A 12% fuzz tolerance eats the hard magenta pixels and leaves a soft pink halo.
2. **Interior pixels that happen to be magenta-tinted** — highlights, specular spots, stylized color choices. If any character pixel is within 12% of `#FF00FF` in color distance, `-transparent` eats it too.

The damage from (2) is invisible when you composite the result against anything close to the page background. Holes in fur read as shadows on a light theme and as shading on a dark theme. They only show up when you look at the alpha mask on its own — which I didn't, until Approach 3 forced me to.

## Approach 3: Double-Pass Chroma With Tighter Fuzz

To fix the pink fringe, I ran a second pass targeting a slightly darker magenta (`#E040E0`) — the shade the fringe was settling at. The idea was sensible: the first pass gets the pure background, the second pass gets the antialiased halo.

What actually happened was this:

![Swiss-cheese alpha mask — interior holes eaten by second-pass chroma](https://gist.githubusercontent.com/idvorkin-ai-tools/5944083f46861b377e24bf2520cd0f81/raw/00-swiss-cheese-alpha.jpg)

Swiss cheese. The second pass ate every interior pixel within the fuzz tolerance of `#E040E0`, which turns out to include a lot of stylized highlights, nose shadows, and fur variation. The character silhouette is full of holes.

Here's the diagnostic detail that makes this one nasty: **you cannot see the holes when the image is composited.** On a dark page they read as shading. On a light page they read as translucency. On a gray tag page they read as anti-aliasing. The only way to see the damage is to extract the alpha channel as a grayscale mask and look at it directly.

That's when I realized I'd probably been shipping broken alpha masks for months without knowing. Time to stop tuning fuzz values and change approach entirely.

## Approach 4: rembg Semantic Segmentation

If the problem is "pixel-based chroma-key keeps eating character pixels," the obvious move is to go semantic. [rembg](https://github.com/danielgatis/rembg) runs a U²-Net model that segments the subject from the background by content, not color. No magenta needed, no fuzz tolerance, no interior damage.

```bash
rembg i --alpha-matting input.webp output.png
```

![rembg comparison — accessories dropped](https://gist.githubusercontent.com/idvorkin-ai-tools/5944083f46861b377e24bf2520cd0f81/raw/03-rembg-comparison.jpg)

Two problems surfaced immediately:

1. **The Cybertruck disappeared.** rembg decided the Cybertruck wasn't part of "the character" and cut it out. Which is technically defensible — it's a vehicle the character is standing in — but for a trio where Tony-in-Cybertruck is the whole point, dropping the truck is worse than leaving a fringe.
2. **Hazy fur with alpha-matting on.** The `--alpha-matting` flag softens edges, which looks good on hair but looks wrong on the hard cartoon outlines the raccoons are drawn with. Soft edges make a cartoon look like it was cut out of a magazine.

rembg is the right tool for "isolate the subject from the scene." It's the wrong tool for "strip the chroma background off a character with intentional accessories." The semantic model is too opinionated about what counts as part of the subject.

## Approach 5: Edge-Connected Flood-Fill Chroma

The key insight from Approach 3: the second-pass chroma failed because it treated interior magenta-tinted pixels the same as exterior background pixels. But those pixels are structurally different — the exterior ones are connected to the image boundary, the interior ones are surrounded by character.

ImageMagick's `-draw "color ... floodfill"` operator takes a seed point and paints every connected pixel within a fuzz tolerance. Seed it from the four image corners and you paint only the background region. Anything magenta-tinted inside the character is unreachable from the corners without crossing non-magenta pixels, so it survives untouched.

![Four-way flood-fill composited on light background](https://gist.githubusercontent.com/idvorkin-ai-tools/5944083f46861b377e24bf2520cd0f81/raw/04-four-way-light.jpg)

![Four-way flood-fill alpha mask — clean silhouette, no interior holes](https://gist.githubusercontent.com/idvorkin-ai-tools/5944083f46861b377e24bf2520cd0f81/raw/05-four-way-alpha.jpg)

The alpha mask is clean. Every pixel inside the silhouette is opaque. Every pixel outside is transparent. The Cybertruck is still there because it's part of the image, not a semantic subject rembg has to recognize. No ML model. No hallucination. No accessories dropped.

The approach also composes: if a later character had, say, an interior magenta region that touched the boundary (a thought bubble extending off-frame), I'd just render it on a different chroma color. The flood-fill logic doesn't care what color it's chasing, only that the color is connected to the edge.

## Verification Protocol: Look at the Alpha

The meta-lesson from Approaches 2 and 3 is that compositing hides damage. Light backgrounds hide interior holes (they read as shading). Dark backgrounds hide them (they read as shadows). The only honest view is the alpha channel by itself.

```bash
magick output.webp -alpha extract mask.png
```

Open `mask.png` and squint. Every pixel should be either black (transparent) or white (opaque), with a thin gray antialiased edge. If the silhouette has interior gray patches, the chroma ate character pixels and you have a swiss-cheese alpha on your hands. I now run the extract before I ship any character illustration — it's a five-second check that would have saved me two months of subtly broken masks.

## The One-Liner

The full flood-fill command, copy-pasteable:

```bash
magick input.webp \
  -alpha set \
  -fuzz 15% \
  -fill none \
  -draw "matte 0,0 floodfill" \
  -draw "matte %[fx:w-1],0 floodfill" \
  -draw "matte 0,%[fx:h-1] floodfill" \
  -draw "matte %[fx:w-1],%[fx:h-1] floodfill" \
  output.webp
```

Four corners, one fuzz tolerance, done. This is the default in my [gen-image skill](https://github.com/idvorkin/chop-conventions/tree/main/skills/gen-image) now — any character rendered on a chroma background gets this treatment automatically before the asset lands in the blog's image blob.

## Why Hill-Climbing Works Here

Each approach generated information that narrowed the solution space. Approach 1 established that the baseline was "no transparency at all," which set the bar. Approach 2 showed the basic chroma trick works but has edge artifacts. Approach 3 was the disaster — but the swiss-cheese alpha is the most informative artifact I got all session, because it pointed directly at "don't touch interior pixels." Approach 4 proved ML was the wrong abstraction: too semantic, drops deliberate accessories. Approach 5 synthesized the constraints: stay pixel-exact (not semantic), but only kill pixels reachable from the outside.

I couldn't have jumped straight to flood-fill without Approach 3 teaching me what the failure looked like. I couldn't have ruled out rembg without trying it on a case where accessories mattered. The hill-climb isn't wasted effort — it's how you find out which axis of the problem matters. The first four approaches were the explanation I needed to see for the fifth one to feel obvious.

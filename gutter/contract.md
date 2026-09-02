# The Den — panel geometry contract

_Version 1 · 2026-08-29 · bead igor2-88g.271 · measured from den-001…den-004_

What a generation prompt has to hit and a viewer is allowed to assume. One
number per thing; nothing here is stylistic.

## Canvas

- **1600 x 1600 px**, square, opaque. Ship as webp, quality 90.
- Page ground behind and between the panels: warm cream **#F7F0D4** (sampled
  from den-004). A viewer that letterboxes should letterbox in this colour.

## Grid

2 x 2, reading order p1 top-left, p2 top-right, p3 bottom-left, p4 bottom-right.

|               | outer margin | gutter  | panel   | border stroke |
| ------------- | ------------ | ------- | ------- | ------------- |
| **CONTRACT**  | **32**       | **32**  | **752** | **8**         |
| den-001       | 50/51/52/51  | 24 / 23 | 736-738 | 4             |
| den-001-plush | 34           | 30      | 751     | 6             |
| den-002       | 15/17/15/15  | 14      | 776-778 | 9-10          |
| den-003       | 34           | 30      | 751     | 6             |
| den-004       | 46           | 36      | 736     | 9             |
| den-005       | 33/34        | 30      | 751-752 | 8             |
| den-006       | 33/34        | 30      | 751-752 | 8             |
| den-007       | 46           | 30      | 739     | 5-6           |

den-005 and den-006 are the first strips drawn against the contract rather than
measured into it; both pass check-geometry.py first go. den-007 is the
exception, and the row above is the strip as shipped: it clones a supplied
source image, and attaching that source pushed every candidate's margins out to
46 px. It fails check-geometry and passes check-panels — see "A supplied source
image drags the panel grid off contract" in `recipe.md`. Since the viewer reads
the pre-cut panel files, check-panels is the gate that matters at publish.

The contract is den-003 rounded to arithmetic that closes exactly:
32 + 752 + 32 + 752 + 32 = 1600. Every value is a multiple of 8, so the 800 px
panel export and any 2x display land on whole pixels.

## Panel rects

Rect = the **outer edge of the black border stroke**. The stroke is drawn
inside the rect, so cropping the rect keeps the frame line.

| panel | x   | y   | w   | h   |
| ----- | --- | --- | --- | --- |
| p1    | 32  | 32  | 752 | 752 |
| p2    | 816 | 32  | 752 | 752 |
| p3    | 32  | 816 | 752 | 752 |
| p4    | 816 | 816 | 752 | 752 |

Strip #1's panels are not on a single grid (p1/p3 at x 52, p2/p4 at x 812,
tops at y 51 / 812, sizes differ by a few px); its rect row above is
approximate — `cut-panels.py` finds the real stroke. Every strip from #5 on
hits the contract.

As fractions of the canvas: x and y are **0.02** or **0.51**; w and h are
both **0.47**. A viewer that scales the whole strip so one panel fills a square
window uses **scale = 1 / 0.47 = 2.1277**. (The viewer at /den-viewer no
longer computes rects at all: it shows the pre-cut panel files listed in
`_data/den.json`. The scale matters only for the composite-to-panel zoom
animation.)

**Tolerance: +/- 8 px per edge.** A generated strip passes if every measured
panel edge is within 8 px of the contract; the viewer still crops at the
contract rect. Outside 8 px, regenerate or hard-crop to the contract before
publishing.

**Measuring method** (how the table above was produced, and how to verify a new
strip): a row is a page row if every pixel in it has min(R,G,B) > 195. The runs
of page rows are top margin, gutter, bottom margin; same by column. Everything
else follows. Checker: gutter/check-geometry.py (run it with the strip path; exit 0 = within
tolerance).

## Border

- **8 px** black, uniform on all four sides of every panel. Accepted 6-10.
- Drawn inside the rect. Corners square, not rounded.

## Bubble safe area

Every speech balloon — outline stroke and tail included — must sit **fully
inside the panel rect inset by 24 px on all sides**, i.e. a 704 x 704 live area
(p1: x 56..759, y 56..759; add 784 to x and/or y for the other panels).

No balloon may touch, overlap or cross a panel border. No balloon may be
clipped by the canvas edge. Tails point inward.

Today's tightest case is den-004 p1 ("LATER."), which clears its right border by
roughly 15 px — inside the panel but under this inset. The rule tightens it.

## Lettering

Comic lettering is all-caps, so the operative metric is **cap-height**.

- **Minimum cap-height 28 px at 1600 canvas.** Measured today: den-003 26,
  den-004 30. So this is a small nudge up, not a redesign.
- Mixed-case lettering (den-003 p3/p4 uses it): **x-height at least 20 px**,
  cap-height still at least 28.
- Why 28: a panel shown at phone width (~380 px) renders the panel at
  380/752 = 0.505 of canvas scale, so a 28 px cap-height reads at ~14 px. That
  is the floor for legibility. The same lettering in an unzoomed 380 px strip is
  6.6 px — which is the whole reason the viewer exists.
- Budget at the floor: about **28 characters per line, at most 3 lines** per
  balloon fits the safe area with balloon padding.
- The floor applies to story-critical lettering on props too — clipboards,
  monitors, book pages. Decorative background text is exempt but must not read
  as a caption.

## Per-panel exports

Every strip also ships its four panels as separate files:

    images/den/den-00N-p1.webp  ..  den-00N-p4.webp

- **800 x 800 px** each, webp quality 90.
- Cropped at the panel rect (752 x 752, border included) and resized to 800.
- The viewer **prefers the panel file** when it exists and falls back to a CSS
  transform on the full strip using the fractions above. Because the panel file
  is the same crop the transform produces, switching between them shows no jump.

Contract strips — in practice run `gutter/cut-panels.py <strip>`, which finds
each panel's own border and pulls the crop in by the stroke's antialiased outer
pixel; the ideal-geometry equivalent is:

    magick den-00N.webp -crop 752x752+32+32   +repage -resize 800x800 -quality 90 den-00N-p1.webp
    magick den-00N.webp -crop 752x752+816+32  +repage -resize 800x800 -quality 90 den-00N-p2.webp
    magick den-00N.webp -crop 752x752+32+816  +repage -resize 800x800 -quality 90 den-00N-p3.webp
    magick den-00N.webp -crop 752x752+816+816 +repage -resize 800x800 -quality 90 den-00N-p4.webp

Strips #1-#4 predate the contract; crop them at their own measured rects
(origin pairs, square size):

| strip         | x origins | y origins | size |
| ------------- | --------- | --------- | ---- |
| den-001       | 52, 811   | 50, 812   | 737  |
| den-001-plush | 34, 815   | 34, 815   | 751  |
| den-002       | 15, 807   | 15, 807   | 778  |
| den-003       | 34, 815   | 34, 815   | 751  |
| den-004       | 46, 818   | 46, 818   | 736  |

## Paste into the generation prompt

> LAYOUT: a four-panel comic strip, square 1600x1600, a strict 2x2 grid on a
> warm cream page. A 32 px cream margin runs around the whole page and a 32 px
> cream gutter separates the panels both horizontally and vertically, so each of
> the four panels is an equal 752 x 752 square. Each panel has a uniform 8 px
> square-cornered black border. Keep every speech balloon, including its tail,
> at least 24 px clear of its panel border — no balloon may touch, cross or be
> clipped by a panel edge. Hand-letter all dialogue in all-caps at a generous
> size: capital letters must be at least 28 px tall, about a twenty-sixth of a
> panel's width, and no balloon carries more than three lines of about 28
> characters.

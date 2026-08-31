# How the pictures are made

_Gutter's recipe. One home; the chop-conventions `cartoonist` skill points here._

## Strips

Four-panel, 2x2, plush-3D house style, to `contract.md`.

### Invocation

`generate.py single --ref` takes ONE ref and a strip needs several, so call the
layer under it directly:

```bash
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview \
ASPECT_RATIO=1:1 \
~/gits/chop-conventions/skills/gen-image/gemini-image.sh \
  "$PROMPT" out.png "" \
  images/den/den-003.webp \
  images/larry-armchair-session.webp \
  images/raccoon-larry.webp \
  images/raccoon-nerd.webp

magick out.png -resize 1600x1600 -quality 90 A.webp
./gutter/check-geometry.py A.webp
```

The empty third positional is the api-url slot; blank makes the script derive
the URL from `GEMINI_IMAGE_MODEL`. Pro, never Flash — Flash mangles multi-word
lettering. No `--transparent` — comics are opaque pages.

### The references, and what each one is for

| ref                                  | job                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `images/den/den-003.webp`            | house style + panel grid + bubble treatment                                          |
| `images/larry-armchair-session.webp` | Larry **in the house style**, in a panel, with a bubble — the single most useful ref |
| `images/raccoon-larry.webp`          | Larry character canon (beard, claw, waistcoat, crocs)                                |
| `images/raccoon-nerd.webp`           | Igor character canon (rainbow glasses, TECHNOLOGIST tee, mismatched crocs)           |

The armchair image was the addition that mattered. `raccoon-larry.webp` is a
transparent full-body toy shot; it locks the _character_ but says nothing about
how he sits in a lit panel next to a speech balloon. One ref that shows the
character already rendered in the target style beats two refs that show style
and character separately.

**Do not use `den-002.webp` as the style ref** — #2 is the flat 2D line-art
version. #1 has both a flat and a `-plush` variant. Only #3 and
`den-001-plush.webp` are unambiguously the plush-3D house style.

### Prompt skeleton

Five blocks, in this order. Order matters: the render-style block has to land
before the model has committed to a look.

1. **Layout** — "four-panel comic strip, 2x2 grid, thick black panel borders on
   a warm cream page, square 1:1."
2. **RENDER STYLE, flagged as the most important instruction** — plush-3D
   positives (felt fiber texture, soft-vinyl toy volume, volumetric light, warm
   attic lamp, shallow DoF, film grain) _and_ an explicit negative list: NOT flat
   2D cartoon, NOT line art, NOT cel-shaded, NOT vector, NOT a white studio
   background. The negatives did as much work as the positives.
3. **CHARACTER — LARRY**, with the beard called out as essential and the
   anti-canon spelled out: no baseball cap, no red cap, no hoodie, no whistle.
4. **CHARACTER — IGOR**, with the shirt text quoted exactly.
5. **LETTERING** — bubble treatment plus "use exactly these words and no other
   text anywhere in the image", then one paragraph per panel with the bubble
   text inline and quoted.

Then a per-candidate **CAMERA / COMPOSITION VARIATION** paragraph appended last.
Vary only camera and bubble placement between candidates; keep characters,
lettering and style byte-identical so the pick is about staging, not about which
one happened to draw Larry correctly.

### A fixed set, named once

Modeled on Flow Fitness in Fremont. This block goes in the prompt once, in its
own section, and both gym panels then refer back to it by name.

> THE GYM — ONE FIXED SET, IDENTICAL IN PANEL 2 AND PANEL 4: a bright, airy
> neighborhood kettlebell studio. Black rubber-tile floor. Along the left-hand
> wall, a long low steel rack holding a neat row of cast-iron kettlebells graded
> small to large. Tall industrial windows fill the right-hand wall with clean
> natural daylight and a glimpse of green trees outside. One black flat weight
> bench stands in the open middle of the floor. Pale grey-white painted brick
> walls, exposed white ceiling ductwork, a wall clock, a couple of chalk-dusted
> lifting platforms. There are NO treadmills, NO ellipticals, NO wall of cardio
> machines, NO weight-machine towers, NO mirrors-and-neon commercial-gym look.
> It is bright and daylit, never dim or blue-lit. Panel 2 and panel 4 must be
> unmistakably the SAME room, same kettlebell rack, same windows, same bench,
> same floor, same daylight, viewed from a similar direction.

Round 1 drifted to a dim blue commercial gym full of cardio machines in panel 2
and put panel 4 back in the attic. Naming the set once and having both panels
point at it fixed both in one pass.

Any recurring location gets this treatment: describe it once in its own
section, name it, and have every panel that uses it refer to the name.

## Cutouts

Float-right character illustrations for posts (`_includes/image_float_right.html`
and its siblings). These use the gen-image skill's own path:

```bash
cd ~/gits/chop-conventions/skills/gen-image
./generate.py single "<subject line in the house voice>" \
  --ref ~/gits/larry-blog/images/raccoon-nerd.webp \
  --transparent --no-fast --aspect 3:4
```

`--transparent` renders on magenta and strips it through Recraft
(`RECRAFT_API_TOKEN` in `~/.env`, ~\$0.01 per call); the two alpha evals print
to stderr — read them, a `interior_hole_px` above zero means the character has
bleed-through and needs a regeneration. `--ref` takes the character ref for
whoever is in the picture (Igor: `raccoon-nerd.webp`; Larry:
`images/raccoon-larry.webp`). Style text comes from the skill's
`raccoon-style.txt`. Four candidates minimum for a cutout; they are cheap.

## Per-panel exports

After Igor picks, cut the four panels:

```bash
./gutter/cut-panels.py images/den/den-00N.webp
./gutter/check-panels.py images/den/den-00N.webp
```

`cut-panels.py` writes `den-00N-p1.webp` .. `den-00N-p4.webp` beside the
composite; `check-panels.py` verifies every edge of every panel is ≥ 97.5%
border stroke and exits non-zero if any isn't. A fixed-rect crop at the
contract coordinates produced a bad cut on strip #1, because its panels
aren't on one shared grid — the walker instead finds the real stroke on any
strip within the contract's tolerance.

Ship all five files to `images/den/`.

### Register the strip

Append one object to `_data/den.json`, newest first:

```json
{
  "num": N,
  "title": "…",
  "date": "…",
  "img": "/images/den/den-00N.webp",
  "alt": "…",
  "receipts_url": "…",
  "panels": [
    "/images/den/den-00N-p1.webp",
    "/images/den/den-00N-p2.webp",
    "/images/den/den-00N-p3.webp",
    "/images/den/den-00N-p4.webp"
  ]
}
```

`/den-viewer` renders from that file — a strip that isn't in the manifest
isn't in the viewer.

## Failure modes

- **`gemini-image.sh` silently defaults to Flash.** Unset `GEMINI_IMAGE_MODEL`
  and the script falls back to `gemini-3.1-flash-image-preview` with no
  warning — the 2026-08-31 den-005/den-006 redraw shipped on Flash this way
  (wayfarers instead of round rainbow glasses, softer lettering) and nobody
  noticed until Igor's eye caught it. Every strip generation must
  `export GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview` before every
  `gemini-image.sh` call, and the run log must be checked for that exact
  string (or the derived `.../models/gemini-3-pro-image-preview:generateContent`
  API URL) before trusting the output — a log that doesn't prove Pro is a
  failed run, regenerate it. `gemini-image.sh` itself never logs the model or
  API URL it used, so log it yourself (echo it to the run log before the
  call) rather than trusting the script's own stderr.

- **Two lobster claws.** Every first-pass candidate gave Larry a red claw on
  _both_ arms — the ref shows the claw prominently and the model reads it as a
  species trait. Fix (appended to the variant block):

  > Larry has EXACTLY ONE lobster claw. His LEFT arm ends in the giant glossy
  > red lobster claw. His RIGHT hand is an ORDINARY furry brown raccoon paw with
  > fingers — it is NOT red, NOT a claw, NOT a pincer. Never draw two red claws.
  > The right paw is the one that holds the yellow pencil and writes.

  This fixed most but not all panels. Symmetric-limb corrections are weak; budget
  a regeneration for them.

- **Matched crocs.** Larry drifts to two yellow Crocs. Same paragraph now
  restates "one BLUE and one YELLOW — never two of the same color." Partial fix.
- **Shirt text drops or garbles** on small/background figures ("TECHNOLOGST",
  "EDINOLOGIST", or blank). Unfixed. It is legible in whichever panel Igor is
  foregrounded, which is enough — but don't stage him small in every panel.
- **Cinematic framing amputates the character.** Asking for an
  over-the-shoulder shot in panel 1 cropped Larry's head — and his head is where
  the beard is, i.e. the whole point of the redo. Fix: any "cinematic angle"
  direction must carry "every character stays FULLY IN FRAME with head and face
  never cropped."
- **`0` renders as `O`** in "NUDGES 3. GYM 0." Present in the original draft too.
  Not worth another spin; if it matters, write "GYM: ZERO."

### The counter-failure: over-correcting the claw deletes it

Round 1's failure was _two_ claws. Round 2's first pass over-corrected: with the
"right hand is an ordinary paw" rule hardened and a new no-Crocs rule competing
for attention, B and C dropped the claw **entirely** — Larry with two normal
paws in the gym panels. Zero claws is as off-model as two.

The fix is a checklist that asserts both halves as a pair, and asserts presence
before it asserts absence:

> 1. LARRY'S LEFT ARM ALWAYS ENDS IN THE GIANT GLOSSY RED LOBSTER CLAW, and that
>    claw must be CLEARLY VISIBLE in EVERY panel where Larry appears — never
>    hidden behind him, never left out, never replaced by a paw. Pose him so the
>    camera sees the red claw: resting on his knee, gripping the edge of the
>    clipboard, or hanging at his side.
> 2. AT THE SAME TIME, Larry's RIGHT hand is an ORDINARY furry brown raccoon paw
>    … So in every Larry panel: exactly ONE red claw (left) and exactly ONE furry
>    paw (right). Never two red claws. Never zero red claws. Never two furry paws.

Full text kept for comparison against the weaker first version.
**Generalization: a negative constraint on a body part suppresses the part.
Always pair "never two X" with "always exactly one X, and it must be
visible."**

Two other things earned their place in that checklist:

- **Punctuation drifts.** Bubbles lost their full stops ("CAUSE OF GYM: OUTAGE"
  without the period). Quoting each bubble verbatim in a numbered checklist item
  fixed it.
- **Feet need a positive replacement, not a prohibition.** "No Crocs on Larry"
  alone is weak; "plain brown leather lace-up shoes" gives the model something to
  draw and held in every round-2 panel.

### Igor's standing craft notes (2026-08-30)

Two composition rules from Igor, binding on every future strip:

- **First speaker sits on the LEFT.** Balloons read left-to-right, top-to-bottom;
  if the panel's first line comes from the character on the right, the reader
  reads the reply first. Block the panel so whoever speaks first is on the left
  (or their balloon is unambiguously first in reading order — highest, leftmost).
- **The phone answers in ONE consistent balloon color.** Every balloon the
  phone/AI voice speaks gets the same warm cream fill in every panel of a strip
  (and jagged/electric border for the device voice). Never white in one panel
  and cream in another — the color IS the speaker tag.

## Process

- Four candidates run in parallel as background subshells; wall time was under a
  minute for the batch.
- **Read every candidate before shipping it.** The reject bar was fixed in
  advance: Larry lacking beard or claw, Igor lacking rainbow glasses or green
  tee, or garbled lettering. Two of six tripped it.
- Never pre-pick. Four options to the Cockpit (`ask.py … --option-image "A=/abs/path.webp"`,
  repeatable; it copies into `assets/asks/<bead-id>/` itself) plus the same
  images attached to a Telegram message, no `--recommend`.

### What a job entry records — the rejected candidates from #4, round 1

- **A (v1)** — good composition, but Larry had two claws in all four panels.
  Regenerated as A2 with the claw rule; A2 shipped as sheet option A.
- **B (v1)** — panel 1 was an over-the-shoulder crop that cut Larry's bearded
  face out of frame. Regenerated as B2 with the in-frame rule; B2 shipped as
  sheet option B, and is the most canon-accurate of the four.
- C and D passed first time and shipped unmodified.

Six generations total for four shipped candidates. Budget ~1.5 spins per
delivered candidate on a two-character strip.

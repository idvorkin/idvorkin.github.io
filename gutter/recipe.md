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
| `images/larry-claw-ref.png`          | the claw, attached — attach on every Larry panel                                     |
| `images/larry-anchor-sheet.webp`     | Larry **anchor sheet** — the best single Larry ref; see "Anchored generation"        |
| `images/igor-anchor-sheet.webp`      | Igor **anchor sheet** — the only ref with TECHNOLOGIST spelled right and legible     |

The armchair image was the addition that mattered. `raccoon-larry.webp` is a
transparent full-body toy shot; it locks the _character_ but says nothing about
how he sits in a lit panel next to a speech balloon. One ref that shows the
character already rendered in the target style beats two refs that show style
and character separately.

`larry-claw-ref.png` is a crop of `raccoon-larry.webp` (`380x420+660+280`)
showing nothing but the claw joined to the sleeve. Every model tried so far
draws it as a loose prop on the desk or as a second claw; a close-up of the
join is the cheapest way to say _attached_. Add it whenever Larry is in frame.

The two **anchor sheets** are Muse renders of Larry and Igor alone on a plain
warm-grey backdrop, made by the pass described under "Anchored generation"
below. They beat the transparent toy shots at the two things that keep
shipping broken: `larry-anchor-sheet.webp` shows one claw joined at the sleeve
on the correct arm _with_ the paired pencil-holding paw, all in one picture and
already in the house style; `igor-anchor-sheet.webp` is the only ref anywhere
in which "TECHNOLOGIST" is spelled correctly and fully legible. Prefer them as
the character refs; keep the older ones attached alongside.

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

### Per-panel generation

Some models fight the 2x2 grid — margins wander, borders thin out, lettering
shrinks to fit four scenes into one canvas. Don't argue with them. Generate each
panel on its own as a full-bleed square, no grid and no border, with the canon
refs plus the matching panel of an existing strip (`den-00N-pN.webp`) as a
staging ref, then composite onto the cream page at the contract geometry:

```bash
magick -size 1600x1600 xc:'#F7F0D4' \
  \( panel-1.png -resize 752x752! -shave 8x8 -bordercolor black -border 8 \) -geometry +32+32   -composite \
  \( panel-2.png -resize 752x752! -shave 8x8 -bordercolor black -border 8 \) -geometry +816+32  -composite \
  \( panel-3.png -resize 752x752! -shave 8x8 -bordercolor black -border 8 \) -geometry +32+816  -composite \
  \( panel-4.png -resize 752x752! -shave 8x8 -bordercolor black -border 8 \) -geometry +816+816 -composite \
  out.png
```

Geometry passes by construction, and each panel gets the model's whole attention:
Muse landed the attached claw, the raccoon kits, both wall posters and legible
shirt text in one pass this way, having missed all four across six
page-at-a-time spins. Igor, on the Den #7 comparison: "much better results."

The trade is continuity — four independent calls have no idea they are one
strip. That is what the anchor pass below is for.

### Anchored generation

_From Meta's cookbook (`05_muse_image/03_anchored_generation`), translated to
our stateless API and measured on Den #7 panels 1 and 4, 2026-09-03._

Before drawing any panel, generate the **anchors**: one character sheet per
character in the strip, and one character-free background plate per recurring
set. One figure, plain warm-grey backdrop, described precisely, house style
words repeated, nothing else in frame. They run in parallel and cost $0.01
each; five of them came back clean on the first try. Then every panel attaches
the anchors that beat needs plus the staging ref, and the panel prompt stops
describing canon and starts pointing at it.

The cookbook chains its anchors through one conversation with
`previous_response_id`. We cannot — OpenRouter's Image API is one request, one
image, no server state — so the anchors ride as `input_references` on every
call, which the cookbook itself sanctions for art made elsewhere. What the
conversation gave for free was _knowing which subject is which_. Statelessly
you have to say so, by position:

> ATTACHED REFERENCE IMAGES — READ THIS FIRST, IN ORDER. REFERENCE 1 is the
> character anchor sheet for LARRY. That plush raccoon IS Larry. Reproduce him
> exactly as he is drawn there and change nothing about him: … Only his pose
> changes. REFERENCE 3 is the background plate for the fixed set named THE
> ALLEY. That IS the location of this panel. Reproduce it exactly: … REFERENCE
> 4 is the corresponding panel of an earlier version of this strip. It is a
> STAGING reference only: take its composition, camera height and balloon
> placement and nothing else. Where it disagrees with references 1-3 about how
> a character or the set looks, references 1-3 win.

Measured against the un-anchored per-panel method on the same two beats, same
model, three spins each: the claw came out **attached in 3/3 anchored spins
against 2/3**, the set matched the plate in **3/3 against 0/3**, and the
recurring mugger was the same character across spins in **3/3 against 0/3** —
where the un-anchored arm drew three visibly different badgers. Mug lettering
went 3/3 against 2/3. And the anchored panel prompt is **half the length**
(3.4 KB against 7.0 KB), because the canon prose moved onto the sheet.

Two things this buys that nothing else has: fix a canon defect once, on a
1024 px sheet with one figure in it, instead of four times in four busy
panels — and both of the standing text failures (TECHNOLOGIST, the mug words)
came out clean the moment they were the only thing in the frame.

**Name the references or they are wasted.** And name them individually:
montaging three anchors into one side-by-side "reference row" — the cookbook's
own `00_reference_row` — scored worse than passing them separately on every
axis (0/2 set match, 1/2 attached claw, 0/2 legible tee) and copied a garbled
poster and a stray frame border off the staging ref. Four discrete named
references beat two references one of which packs three. Muse is not running
out of attention at four; it is running out of names.

**Do not adopt the rest of that chapter.** Its compose-the-page turn and its
letter-the-page turn both depend on the conversation already holding the
panels. We composite with `magick` at contract geometry, which passes by
construction, and lettering stays in the panel prompt — in-panel balloons came
out verbatim and correctly placed in 16/16 panels, and a second text pass over
art that already passed is where dialogue goes wrong. Their per-beat `size`
has nothing to vary against a four-square contract.

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

- **The claw drawn as a loose prop.** "One claw, never two" fixes the count and
  says nothing about where the claw is; one candidate laid it on the desk as a
  red object beside a two-pawed Larry. Assert the attachment alongside the
  count: "the claw is the END of Larry's LEFT ARM, joined to his sleeve at the
  wrist — never a loose red object lying on the desk." Held in every rerun.

- **The claw lands on the wrong arm, and a correct reference does not fix it.**
  Canon is the LEFT arm. Across 8 spins in three different reference
  strategies — including three that attached an anchor sheet showing the claw
  correctly on his left — it came out on the viewer's left, i.e. his right,
  **8 times out of 8**. Chirality is not a prompt bug and not a reference bug;
  the model mirrors. The options are to flop the finished panel, to stage Larry
  in profile so the side is unreadable, or to move canon to the arm the model
  draws. Igor's call; flagged, not fixed.
- **Matched crocs.** Larry drifts to two yellow Crocs. Same paragraph now
  restates "one BLUE and one YELLOW — never two of the same color." Partial fix.
- **Shirt text drops or garbles** on small/background figures ("TECHNOLOGST",
  "EDINOLOGIST", or blank). Unfixed in a busy panel, and it is legible in
  whichever panel Igor is foregrounded — so don't stage him small in every
  panel. It _is_ fixed in isolation: on a one-figure anchor sheet the word
  comes out spelled and legible, which is why `igor-anchor-sheet.webp` exists
  and why the anchor pass is worth its $0.01.
- **Cinematic framing amputates the character.** Asking for an
  over-the-shoulder shot in panel 1 cropped Larry's head — and his head is where
  the beard is, i.e. the whole point of the redo. Fix: any "cinematic angle"
  direction must carry "every character stays FULLY IN FRAME with head and face
  never cropped."
- **`0` renders as `O`** in "NUDGES 3. GYM 0." Present in the original draft too.
  Not worth another spin; if it matters, write "GYM: ZERO."
- **Meta Muse Image refuses a prompt with a knife-point mugging** about one time
  in four. Retry once identically — that usually passes. **If it keeps
  refusing, the problem is the reference set, not the wording.** An anchor
  sheet of an _armed_ character is filter bait on every panel that attaches it:
  the same mugging beat went 0 refusals in 3 with the knife in prose only, and
  1 pass in 6 once the armed anchor sheet was attached. Softening the knife
  wording refused 2/2 more. Regenerating the anchor sheet with **empty paws**,
  dialogue untouched, passed 2/2. Keep weapons off anchor sheets and draw the
  prop in the panel prompt.
- **A supplied source image drags the panel grid off contract.** When the brief
  is "clone this", the source belongs in the ref stack, attached last, under an
  explicit "staging only, its flat rendering is wrong" block — that block held
  the plush style in every run, and it is what protects the dialogue. The cost
  is geometry: three of four candidates missed the 32 px gutter, and the control
  run with the source withheld was the only one to pass `check-geometry` first
  go — and the worst on content (a dropped balloon, poster text rendered inside
  a speech balloon, two knives, two claws). Attach it, expect the geometry check
  to fail, and budget the frame-inking pass before cutting panels.

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

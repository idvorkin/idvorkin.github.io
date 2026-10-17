# How the pictures are made

_Gutter's recipe. One home; the chop-conventions `cartoonist` skill points here._

## Strips

Four-panel, 2x2, plush-3D house style, to `contract.md`.

### Invocation

**Muse Image is the house model** (Igor, 2026-09-26: "Given how cheap it is and
how well it does, let's get rid of Gemini."). One Muse call per panel, then
composite the page with `magick` (see **Per-panel generation**). The full
recipe, with the measured reasons for every line, is the gen-image skill's
`comic-panels.md` in chop-conventions; this file applies it to our contract.

```bash
GEN=~/gits/chop-conventions/skills/gen-image/openrouter-image.py
# A panel with Larry in it. Drop his two refs when he is not in the panel.
$GEN @panel-3.txt panel-3.png --model muse --aspect 1:1 \
  --ref images/raccoon-nerd.webp \
  --ref images/raccoon-larry.webp \
  --ref images/larry-claw-ref.png \
  --ref <the set's GPT reference panel>
```

The script logs the model id and billed cost to stderr on every call; keep
that line in the run log. Key: `OPEN_ROUTER_KEY` from env, `~/.env`, or the
JSON file named by `$SECRET_BOX`. No `--transparent`: comics are opaque pages.

**GPT Image** (`--model gpt`, `openai/gpt-image-2.5-sunburst`, ~\$0.15, sent as
2048x2048) is only for: the set reference panel, rendered **once per recurring
set** and reused in every strip on it; first designs and anchor sheets for a
new character; and a one-shot whole page when the job wants one. **Gemini is
retired**: not a fallback.

### The references, and what each one is for

Attach them in this order, and name each one by its position in the prompt
("Reference 1 is…"). The Image API is stateless, so an unnamed reference is
just a picture:

1. `images/raccoon-nerd.webp`: always first, stated as the style authority
   ("when anything disagrees with reference 1 about style, reference 1 wins").
2. Character sheets for whoever is in **this** panel: for Larry,
   `images/larry-anchor-sheet.webp`, `images/raccoon-larry.webp`, then
   `images/larry-claw-ref.png`; for Igor, `images/igor-anchor-sheet.webp`.
   No sheet for a character who is not in the panel.
3. Last: **the GPT reference panel for this panel's set**, named as "a FINISHED
   PANEL from this same strip… match its rendering… do NOT copy its pose,
   framing or balloon words". It was worth +6 of 42 on the canon checklist.
   With none yet, Muse alone scored 37/42, which is acceptable.

Do not add an old strip (`den-003.webp`) as a style ref. In the 2026-09-26 study
it pulled Muse off the canon look and lost points. For Muse panels this stack
replaces the reference lists in `characters.md`: skip the armchair shot and the
old Den strips listed there.

_Earlier Gemini-era note, kept for the reasoning:_ The armchair image was the addition that mattered. `raccoon-larry.webp` is a
transparent full-body toy shot; it locks the _character_ but says nothing about
how he sits in a lit panel next to a speech balloon. One ref that shows the
character already rendered in the target style beats two refs that show style
and character separately.

`larry-claw-ref.png` is a crop of `raccoon-larry.webp` (`380x420+660+280`)
showing nothing but the claw joined to the sleeve. Every model tried so far
draws it as a loose prop on the desk or as a second claw; a close-up of the
join is the cheapest way to say _attached_. Add it whenever Larry is in frame.

The two **anchor sheets** are Muse re-renders of the existing canon, Larry and
Igor alone on a plain warm-grey backdrop, made by the pass described under
"Anchored generation" below (a new character's first design is still GPT's
job). They beat the transparent toy shots at the two things that keep
shipping broken: `larry-anchor-sheet.webp` shows one claw joined at the sleeve
_with_ the paired pencil-holding paw, all in one picture and already in the
house style; `igor-anchor-sheet.webp` is the only ref anywhere in which
"TECHNOLOGIST" is spelled correctly and fully legible.

**Do not use `den-002.webp` as the style ref** — #2 is the flat 2D line-art
version. #1 has both a flat and a `-plush` variant. Only #3 and
`den-001-plush.webp` are unambiguously the plush-3D house style.

### Prompt skeleton

Five blocks, in this order. Order matters: the render-style block has to land
before the model has committed to a look.

1. **Layout** — per panel: "ONE single square comic panel, 1:1… one panel from
   a four-panel strip; draw only this one panel." (A GPT one-shot page asks for
   the 2x2 grid on a warm cream page instead.)
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

For Muse, the render-style block is the felt-plush block from `comic-panels.md`
verbatim ("a high-end 3D render of handmade NEEDLE-FELTED plush toys…"), and
these lines are standing parts of every panel prompt:

- **Warm the set prose itself.** Muse draws "grey-white brick" and "blue-grey
  walls" literally, and the panel reads cold whatever the style block says.
  Write "warm cream-painted brick", "warm golden late-afternoon sun", "honey-brown
  wood-paneled walls".
- **Igor's eyes are always big, round and wide open.** Show suspicion with a paw
  on the chin, never lowered lids. "Squinting" in a script gives a scowl.
- **Any phone is a modern smartphone**, "never a flip phone, never a keypad
  feature phone".
- **Larry's claw is raised, pincers up**, "one soft plush claw… no lobster legs".
  A hanging claw grew lobster legs in 7 of 15 images.
- **Balloons along the top**, "nothing is lettered in the bottom half".
- **Full stops spelled out**: `reads exactly "REX." with the full stop`.
- A closing one-line **FINAL STYLE REMINDER**.

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
> bench stands in the open middle of the floor. Warm cream-painted brick
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

The default for every strip. Muse is not asked for whole pages. Generate each
panel on its own as a square, with the references above, then composite onto
the cream page at the contract geometry:

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
strip, and characters drift between panels (the mugger's face changed between
1 and 3). The anchor pass below is the fix; recurring faces still want a look
side by side before shipping.

### Anchored generation

_From Meta's cookbook (`05_muse_image/03_anchored_generation`), translated to
our stateless API and measured on Den #7 panels 1 and 4, 2026-09-03._

Before drawing any panel, generate the **anchors**: one character sheet per
character in the strip, and one character-free background plate per recurring
set. One figure, plain warm-grey backdrop, described precisely, house style
words repeated, nothing else in frame. They are Muse renders, run in parallel
and cost $0.01 each; five of them came back clean on the first try. Then every
panel attaches the anchors that beat needs, and the panel prompt stops
describing canon and starts pointing at it.

The cookbook chains its anchors through one conversation with
`previous_response_id`. We cannot, so the anchors ride as references on every
call and get named by position, as in the stack above. Each one gets a
sentence that says what it is and that it wins, e.g. under the current stack:

> REFERENCE 2 is the character anchor sheet for LARRY. That plush raccoon IS
> Larry. Reproduce him exactly as he is drawn there and change nothing about
> him: … Only his pose changes. REFERENCE 5 is the background plate for the
> fixed set named THE ALLEY. That IS the location of this panel. Reproduce it
> exactly: …

A redo can add the earlier version of the panel last, named as a STAGING
reference only: take its composition, camera height and balloon placement,
and where it disagrees with the references before it about how anything
looks, they win.

Measured on Den #7 panels 1 and 4 (2026-09-03, before the named stack above
existed) against the six-reference stack in use then, same model, three
spins each: the claw came out **attached in 3/3 anchored spins against 2/3**,
the set matched the plate in **3/3 against 0/3**, and the recurring mugger was
the same character across spins in **3/3 against 0/3** — where the un-anchored
arm drew three visibly different badgers. Mug lettering went 3/3 against 2/3. And the anchored panel
prompt is **half the length** (3.4 KB against 7.0 KB), because the canon prose
moved onto the sheet.

The plate is a set reference, like the GPT set panel that ends the stack
above. It has not been measured against that panel. Use it for a recurring set
that has no GPT panel yet, or for a character-free set the panel can't give
you; a plate made for a set that already has a panel is an unmeasured extra.

Two things this buys that nothing else has: fix a canon defect once, on a
1024 px sheet with one figure in it, instead of four times in four busy
panels — and both of the standing text failures (TECHNOLOGIST, the mug words)
came out clean the moment they were the only thing in the frame.

**Do not montage the anchors** into one side-by-side "reference row" (the
cookbook's own `00_reference_row`). It scored worse than separate references
on every axis (0/2 set match, 1/2 attached claw, 0/2 legible tee) and copied a
garbled poster and a stray frame border off a staging ref. Muse is not running
out of attention at four references; it is running out of names.

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
cd ~/gits/chop-conventions/skills/gen-image   # Muse by default
../image-explore/generate.py single --scene "<subject line in the house voice>" \
  --shirt "<SHIRT>" --output <name>.webp \
  --ref ~/gits/larry-blog/images/raccoon-nerd.webp \
  --transparent --aspect 3:4
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

The full-screen reader on `/the-den` uses that file — a strip that isn't in
the manifest has no panel files to open.

## Failure modes

- **Wrong model, silently.** In the Gemini days a strip shipped on the wrong
  model because the script never logged which one it used (2026-08-31). The
  Muse renderer logs `model=…` and the billed cost on every call: a run log
  without `model=meta/muse-image` for every strip panel is a failed run,
  regenerate it. Only the set reference panel may log the GPT model id.

- **Two lobster claws.** Every first-pass candidate gave Larry a red claw on
  _both_ arms — the ref shows the claw prominently and the model reads it as a
  species trait. Fix (appended to the variant block):

  > Larry has EXACTLY ONE lobster claw. One arm ends in the giant glossy
  > red lobster claw. The other hand is an ORDINARY furry brown raccoon paw with
  > fingers — it is NOT red, NOT a claw, NOT a pincer. Never draw two red claws.
  > The furry paw is the one that holds the yellow pencil and writes.

  This fixed most but not all panels. Symmetric-limb corrections are weak; budget
  a regeneration for them.

- **The claw drawn as a loose prop.** "One claw, never two" fixes the count and
  says nothing about where the claw is; one candidate laid it on the desk as a
  red object beside a two-pawed Larry. Assert the attachment alongside the
  count: "the claw is the END of Larry's arm, joined to his sleeve at the
  wrist — never a loose red object lying on the desk." Held in every rerun.

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
  in four. Retry once identically — that usually passes. If it keeps refusing,
  **check the reference set before the wording: an armed character sheet trips
  the filter on every panel it is attached to.** The same mugging beat went 0
  refusals in 3 with the knife in prose only and 1 pass in 6 with the armed
  sheet attached; softening the knife then refused 2/2 more, and an
  empty-pawed sheet with the dialogue untouched passed 2/2. Keep sheets
  empty-pawed and put the weapon in the panel text. With a clean reference
  set, if it refuses twice, soften the knife rather than rewriting the scene.
  Meta's direct API is for one refine turn on a nearly-right panel only; it
  did not beat named references.
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

> 1. ONE OF LARRY'S ARMS ALWAYS ENDS IN THE GIANT GLOSSY RED LOBSTER CLAW, and
>    that claw must be CLEARLY VISIBLE in EVERY panel where Larry appears —
>    never hidden behind him, never left out, never replaced by a paw. Pose
>    him so the camera sees the red claw: resting on his knee, gripping the
>    edge of the clipboard, or hanging at his side.
> 2. AT THE SAME TIME, Larry's OTHER hand is an ORDINARY furry brown raccoon
>    paw … So in every Larry panel: exactly ONE red claw and exactly ONE
>    furry paw. Never two red claws. Never zero red claws. Never two furry
>    paws.

Full text kept for comparison against the weaker first version.

Which arm the claw lands on is deliberately unspecified (Igor, 2026-09-06:
"drop the side from canon") — the model gets the claw on the correct arm in
wide shots but flips it in nearly every close two-shot, and respinning to
fix the side is what grows a second claw. Nobody notices which arm; two
claws or zero claws is what reads wrong. Score and flag only the count,
never the side. No reference fixes the side either: the anchor study had it
on the same arm 8 times out of 8 across three reference strategies,
including sheets that showed the other arm.

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

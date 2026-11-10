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
   `images/larry-claw-ref.png`; for Igor, `images/igor-anchor-sheet.webp`;
   for Gutter, `images/raccoon-gutter.webp` (charcoal fur, squint, ink apron,
   THE BOARD). No sheet for a character who is not in the panel.
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

**Check the Recraft token before any cutout job:**
`recraft_bg_remove.py balance`. On 2026-11-08 the token in the secret store
returned 401 on every call, and only after six renders were done. If it is
dead, key the magenta yourself with `gutter/chroma_key.py raw.png out.png`.
Add `--solid` for a character, which protects the purple rim of the glasses,
and `--sat 0.62 --grey` for charcoal props such as iron and chain. It is clean on
light pages, but a faint pink fringe stays on the fur, so re-strip with
Recraft once the token works.

**When the pose matters, write your own prompt** and call `openrouter-image.py`
directly with named references, as for a panel. Two wordings held 3 of 3:

- **Seated with no furniture drawn:** "He sits upright ON AN INVISIBLE OFFICE
  CHAIR at normal chair height… his lower legs hang STRAIGHT DOWN under his
  knees… He is NOT sitting on the floor, his legs are NOT stretched out in
  front of him, the soles of his Crocs do NOT face the camera." "As if on an
  invisible chair" by itself sat him on the floor in 2 of 3.
- **Text-only change to a picked render** (a new shirt slogan): attach the
  picked raw as reference 3, "THE PICKED RENDER of this exact image: keep his
  pose, camera, proportions, lighting and look… changing ONLY the shirt
  words". The pose held in 3 of 3, with the slogan verbatim.

**A one-off shirt slogan is allowed for one piece** when Igor asks for it
("THIS TOO SHALL PASS" for the floating explainer). Quote it, give the line
break ("THIS TOO" over "SHALL PASS"), and say "does NOT say TECHNOLOGIST". The
canon shirt everywhere else stays TECHNOLOGIST.

**Muse snaps aspect ratios**: a 16:9 request came back 1920x1280. Center-crop
to the ratio you asked for, then resize. Never squash.

### Felt scenes and sprites for interactive pages

For a page that animates a scene, such as an explainer, deliver the **plate,
the figure and every prop sprite in ONE style from the start**. A felt cutout
dropped onto the page's flat vector sky and water read to Igor as "a frame we
stuck in". The layers:

- **The plate**: a 16:9 felt diorama with no characters and nothing the page
  draws. If the page animates the water, the plate is **sky only**. A sea
  baked into a plate whose waterline moves gave two horizons and clouds
  showing through the water.
- **The figure**: a transparent cutout lit like the plate. Paws that hold page
  props are empty closed fists, clear of the body. Draw no props. Report
  sprite-pixel anchors for every hand, the head and anything the page lights.
- **Prop sprites**: one magenta sheet per family, split into one file per
  object. Write "The objects FLOAT in front of the backdrop: NO cast shadows"
  plus "a gap of magenta as wide as one object between each pair". Without
  those lines the shadows survived the key and the balloons touched. Split
  touching objects at the emptiest column near each equal-spacing boundary,
  then keep the largest blob.
- **A mock composite** of plate, figure and props, roughly placed, so Igor
  judges coherence before the page wires anything.

**Hanging loads hang clear.** Weights tangled at his feet, the chain over a
Croc, did not read as pulling him down ("balloons make sense, but other things
not as much"). What read: **one taut chain straight down from the lowered fist
to a ring below his feet**, and below the ring each weight on its own short
drop, side by side, in open air above the water. The arm pulled straight with
that shoulder a little low carries the strain; the face stays calm. **The
label surface is part of the prop**: a flat blank face with a raised rim on
each weight. A felt luggage tag is too small at page scale for a label like
"people not liking me".

## Video: Gemini Omni

A new medium, not a new house image model: stills stay on Muse. Video animates
**a finished, shipped panel**; it never designs one. First job: Den #15 "Direct
Line" (2026-11-08), four clips, 20 s, $0.46.

### Invocation

`google/gemini-omni-1.2-flash` through OpenRouter's async video API. One job
per panel, with the panel itself as the first frame:

```json
POST https://openrouter.ai/api/v1/videos
{ "model": "google/gemini-omni-1.2-flash", "prompt": "…",
  "duration": 5, "resolution": "360p", "aspect_ratio": "16:9",
  "generate_audio": true, "seed": 15,
  "frame_images": [ { "type": "image_url", "frame_type": "first_frame",
                      "image_url": { "url": "data:image/jpeg;base64,…" } } ] }
```

The reply carries `id`, `status`, `polling_url`. Poll every 20 s until
`completed` (terminal failures: `failed`, `cancelled`, `expired`), then
`GET /api/v1/videos/{id}/content?index=0` with the bearer token. The finished
job's `usage.cost` is the billed cost, and it matched the credit delta to the
cent. Every job took 40–50 s, 15 s clips included; run the panels in
parallel. Output is 640x360, h264, 24 fps, AAC stereo 48 kHz. Durations
3–15 s; aspect 16:9 or 9:16 only. `GET /api/v1/videos/models` lists all of it.

Runner: `gutter/omni.py` (a stdlib uv script). It pillarboxes the panel,
submits, polls, downloads, writes the job JSON to `OUT/logs/`, and prints
`usage.cost`. Key from `$OPENROUTER_API_KEY`, `$OPEN_ROUTER_KEY`, or
`OPEN_ROUTER_KEY` in `$SECRET_BOX`; it never prints it.

```bash
gutter/omni.py panel-1.webp p1.txt --duration 5 --out-dir tmp/x/clips --name p1
gutter/omni.py panel-2.webp p2.txt --duration 8 --last panel-2.webp --out-dir … --name p2a
gutter/omni.py panel-2.webp p2.txt --duration 8 --out-dir … --name p2a --resume <job id>
```

A poll can hit a read timeout after the job is already billed. `--resume`
picks the job back up by id instead of paying for it twice.

- **A data URI works as the frame image.** No gist, no hosting: pad the panel
  locally and send it inline (a 210 KB jpeg was fine).
- **Cost: $0.023172 per second at 360p, $0.0695 at 720p.** The only SKUs are
  "with audio", so turning audio off saves nothing: always generate it.

### Square panels into a 16:9 frame

Pillarbox, don't crop: a crop loses either the balloons or the heads. Put the
800 px panel, border and all, centered on a 1280x720 page in the contract's
cream `#F7F0D4`, and tell the model the page and border never move:

```bash
magick -size 1280x720 xc:'#F7F0D4' \( den-0NN-p1.webp -resize 720x720 \) \
  -gravity center -composite -quality 92 p1-16x9.jpg
```

It held in 4 of 4 clips: still cream bars, still border, motion only inside
the panel. It reads as the comic page coming alive. The cost is that the
panel is only 360 px tall at 360p.

### Dialogue: keep the drawn balloons, let the model speak the lines

The shipped panel's balloons are already verbatim and on-contract, so they go
in with the first frame and the prompt pins them: "Every speech balloon stays
exactly as drawn for the whole clip: same words, same shape, same place. No new
text anywhere." With a locked-off camera they did not move or garble a letter
in 4 of 4 clips. The model's native audio speaks the lines; a whisperx
transcript of every clip matched the balloons word for word, in order, with
two speakers per clip. No burned-in captions: they would only repeat the
balloons, and the cream side bars are 140 px wide at 360p. Burn captions only
if a clip morphs a balloon.

**Small mixed-case lettering does not survive 360p.** The model re-draws the
lettering from its first frame rather than copying it. The Den's big
all-caps lettering held. The 2006 first-date strip's small mixed-case lettering
came back garbled from frame one ("I loft my mouse", "tregs will be frogs"),
while the same panel scaled down to 360 px stayed legible. The fix is to lay
the drawn lettering back over the clip:

- cut each balloon out of the source panel as an RGBA layer: pale,
  low-saturation pixels inside a hand-given rectangle, with the holes filled
  and the mask grown 5 px to take the outline;
- cut each caption that sits straight on the art as its letters grown 14 px.
  At 8 px a ghost of the model's own caption showed around them;
- `ffmpeg -i clip.mp4 -i overlay.png -filter_complex overlay=140:0`.

The camera is locked off, so the overlay never slides. The cost is that rain
behind a balloon freezes. The script is `gutter/lettering_overlay.py`. Check its mask on magenta before compositing: a
streetlamp core passes the paper test, so keep the rectangles off lamps.

**House default for Gutter video: bubbles pop, words appear as spoken**
(`gutter/lettering_reveal.py SPEC.json`). It replaces the static overlay. Igor
asked for each half in turn: "can we make it so the words show up as I'm
speaking them?", then "that way of doing animations much better with words
coming, let's do that, and then let's also make the thought bubble pop up when
they start talking and stay up".

- A bubble is invisible until its speaker starts. It then pops in from its
  tail (the lowest point of its mask, or `"tail"`), 0.25 s, ease-out-back,
  about 10% overshoot, and the first word lands as it settles. Each drawn word
  appears as it is said, and the bubble stays up. `"mode": "full"` (said in an
  earlier clip) is up from frame one with no pop; `"empty"` (said later) stays
  hidden. Captions are always up. `"pop": false` gives the older behavior,
  blank paper from frame one.
- **The pop needs a bubble-free clip underneath.** Omni draws its own garbled
  bubbles otherwise. So:
  1. Make a clean plate per panel: one Muse call with the panel as reference
     ("Reproduce reference 1 EXACTLY… remove every speech balloon… keep the
     caption lettering"), $0.01. Then run `lettering_reveal.py --plate SPEC
edit.png plate.png`, which keeps the source pixels everywhere except
     inside the bubble masks (grown 10 px, feathered). The characters stay
     pixel-identical. `"plate_extra"` rects catch thought circles that the
     paper test misses.
  2. Animate the plate, with "There are NO speech balloons… Never draw a
     speech balloon" in the prompt. All 7 clips came back bubble-free.
- **Give the pop room.** When the voice starts at 0 s, the pop has no time to
  play. `revoice.py mix` takes `"lead": 0.3`, which holds frame one for 0.3 s
  and delays all the audio by the same amount.
- Word boxes come from the ink: the ink is split into lines, then into words
  at column gaps. The row cut and the gap are raised until the box count
  equals the drawn word count, so the drawn text checks the segmentation. A
  box's rows stop at the midpoint between lines; padding a fixed amount showed
  the tops of the next line's words.
- Timing is a forced alignment of the **drawn** words (whisperx wav2vec2)
  against the audio. It does not match words against a transcript, so
  "@ yahoo" aligns as "at yahoo". A `"say"` list covers anything else.
- A whisperx transcription only finds where speech is. Each bubble gets a run
  of heard segments, by word count. Aligned over the whole clip, a first word
  said after a second of keyboard clicks snapped to 0.0 s.
- Even inside its window, the first word swallows the silence before it, so
  its start is capped from the second word's start. A cap on every word,
  measured from its own end, pushed last words late instead, because they
  swallow the trailing sound.
- Check the `*-words.png` debug image beside the output: magenta word boxes,
  cyan pop anchor.

### Re-voicing: ElevenLabs over Omni's picture (`gutter/revoice.py`)

- `revoice.py say VOICE "line" out.wav [--inner]` makes one line with
  eleven_multilingual_v2 and trims the leading silence only. Trimming the tail
  with areverse+silenceremove ate whole words: "Larry. It's me." came out as
  "It's me." `--inner` is a thought voice: softer, band-limited, a touch of
  room.
- Generate the line first. Then animate the clip with the exact words quoted
  and a pace hint ("spoken briskly in under two seconds"), so the mouth
  rhythm lands close.
- `revoice.py mix SPEC` splits the clip's audio with demucs into voice and
  ambience. It keeps all the ambience (rain, keyboard), keeps the model's voice
  only in `"keep"` spans (speakers you aren't re-voicing), and lays each line
  in `"at"` the model's own voice start.
- Split a two-phrase line into two files placed at each phrase's start ("Larry.
  It's me." / "I'm right here."); the pause then matches the mouth.
- For a thought, prompt Omni for NO voice at all and drop the line in anywhere.
  No lip sync is needed.
- Voices: Igor Pro (`xBlr6Er6jnVgPIGgNJFO`) for Igor. Tori stays Omni's own
  voice: never clone or imitate her. IgLarry (`xJLDwfCvntuBH4HXZstj`) returned
  403 `voice_access_denied` / "requires verification" (2026-11-08), so Larry
  stays Omni's voice until Igor verifies it in ElevenLabs.
- Run the reveal on the final mix, so the words follow the voice you hear.

**Thought bubbles: inner voice, closed mouth.** "Igor's INNER VOICE, a quiet
… voice-over heard inside his head … while his lips do not move", plus "his
MOUTH NEVER OPENS: he is THINKING, not speaking" in the ACTION. Both thought
clips read as voice-over over a closed-mouth smile.

**One long line per clip.** A 15 s clip asking for Tori's 22-word line and
then Igor's 22-word thought came back with the order flipped. Tori's line
turned into babble ("with a lot of along to the time"). The fix was to split
the panel into two clips from the same first frame, each with "ONE speaker
only … X says nothing". The first clip got `--last` set to the panel too, so it
ends on its opening pose and the cut into the second clip doesn't show. Both
clips then came back verbatim. Budget about 3 s per 10 spoken words, plus 1 s.

### Prompt skeleton

1. **Frame**: "Animate this exact comic panel… a square comic panel with a
   black border, centered on a plain warm cream page. The page and border stay
   perfectly still… all motion happens INSIDE the square panel. Locked-off
   static camera, no zoom, no pan, no cut."
2. **STYLE (most important)**: the felt-plush block, reworded for motion: "a
   high-end 3D stop-motion render of handmade NEEDLE-FELTED plush toys… Keep
   exactly the look of the first frame." "Stop-motion" got toy-like movement;
   style never drifted.
3. **Characters**: the canon lines, short, with "stays exactly on-model".
   Larry's claw keeps the presence-first pair ("ALWAYS exactly ONE… raised and
   clearly visible… Never two claws, never zero"). 0 claw drift across 15 s of
   Larry.
4. **ACTION**, with the duration in the heading: one small gesture per
   speaker. Describe what moves; the first frame already holds what is there.
5. **The balloon pin**, above.
6. **AUDIO, in this order**: each speaker named with a voice ("a small
   cheerful slightly frantic cartoon voice", "a calm, dry, kind older voice",
   "a flat tinny electronic robot voice"), each line quoted, then "Nothing else
   is spoken. No music." A wordless panel gets sound effects and "No speech".

### Traps

- **Small text dies at 360p.** TECHNOLOGIST is a smear in every frame; it was
  legible on the 800 px still. It's a resolution limit, not a prompt problem.
  Don't chase it at 360p.
- **Props drift mid-clip.** In the wordless robot chain, the phones were
  lowered out of sight by the second half: the chain stops reading as a call.
  Next time pin the prop as hard as the balloons ("every robot keeps its
  phone pressed to the next head for the whole clip").
- **Small motion.** A 4–6 s clip from a dense panel moves gently: blinks,
  head turns, a paw raised. A "ripple down the chain" barely showed in a wide
  shot. Big action wants a closer panel or a longer clip.
- **Check the speech with ASR, because frames can't show it.** Run `whisperx`
  on every clip (`--model large-v3` when a line looks wrong). It caught the
  flipped order and the babble, and a contact sheet would have passed both.

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
- **Look for anything wonky, panel by panel, before anything ships.** The canon
  bar above is not enough on its own. Den #16 shipped a panel 1 whose
  "backwards" spyglass came out as a brass horn fused into Larry's glasses,
  with a stray lens floating at the tip; Igor caught it after the merge:
  "look at first cell seems borked, fix that!" Two passes:
  - **The prompt, before generating.** Reread it for anything a model will
    draw wrong: an object asked to be odd ("backwards", "upside down",
    "inside out"), two props in the same spot (glasses plus an eyepiece), or
    a line that contradicts the reference. Say the oddity plainly in geometry
    ("the wide end pressed to his eye, the narrow end pointing at the coins")
    or rework the gag so it needs no odd object. Never name a different
    object to get the shape ("a funnel or megaphone" for a reversed spyglass):
    the model draws the object you named. Words like "backwards" and "wrong
    way round" get drawn as the normal hold, so state the geometry instead.
    An inherited prompt or character text carries its flaws forward too, so
    reread it in full rather than editing one line.
  - **The pictures, after.** For every prop and hand in every panel, ask
    whether it reads as what it is: no fused or melted objects, no extra or
    floating parts, no props merged into faces or glasses, no extra fingers
    or limbs, nothing impossible in the geometry. An edit-style "fix" call
    can trade one wrong thing for another, so recheck the panel it returns.
    Name every wonky thing you found, and what you did about it, in the job entry.
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

# 2026-04-16 — AI Persistence Drift: Review Fixes

Reasoning audit trail for the edits applied on PR #521 after Igor's 5
review comments. Dogfoods the agent-notes convention proposed in PR #140
(still draft at time of writing).

## 1. User Request

Igor left 5 inline review comments on PR #521
(`ai-persistence-drift-insight` branch). Verbatim:

1. `_d/ai-operator.md:124` — "Igor's bestie after me pasting in some
   screenshots of Screen Convos" (note-to-self; no action for the agent)
2. `_d/ai-operator.md:126` — "Just do AI Relationships not AI operator.
   Give some alts shorter sentences."
3. `_d/ai-operator.md:130` — "In relationship include this in a separate
   what to do section perhaps"
4. `_d/ai-relationships.md:68` — "use the words for twins in the title"
5. `_d/ai-operator.md:118` — "Make sure you deep link into the concept
   from here."

## 2. Interpretation

- **(1)** Not actionable. Igor's personal marker to paste screenshots
  later. Left untouched.
- **(2)** The "You Need Friction" section I added to `ai-operator.md`
  belongs in `ai-relationships.md` only — the operator post is about
  tool-AI operator skills; the persistence-drift material is
  relationship-layer. Remove the whole section from operator. Also
  shorten sentences in the relationships version for punchier voice.
- **(3)** The design-prescription material (friction as feature, bullet
  list of engineered-friction moves) should live as a distinct "What to
  do" sub-section inside the twin-language section on
  `ai-relationships.md`. Matches the post's existing habit of giving
  prescriptive guidance its own header.
- **(4)** Rename "The dialect of one" to a title that uses a
  twin-language word. Chose **"Cryptophasia for One"** — puts the
  clinical twin word up front (what Igor asked for), and the "for One"
  tail echoes the "echo chamber of one" phrasing that moves from
  operator into the "What to do" sub-section. Rhymes with the internal
  structure of the post.
- **(5)** Where the removed section used to live in operator, drop a
  short paragraph that deep-links into the specific `/ai-relationships`
  anchor. Section slug follows Jekyll's kramdown default
  (lowercase, spaces → hyphens): `#cryptophasia-for-one`.

## 3. Plan

1. `ai-relationships.md`
   - Update TOC: `The dialect of one` → `Cryptophasia for One` +
     nested TOC entry for new `What to do about it` sub-section.
   - Rename H2 heading.
   - Rewrite prose with shorter sentences throughout — split compound
     sentences on em-dashes and commas into punchy independents.
   - Append `### What to do about it` sub-section carrying the
     "friction as first-class design axis" framing, the bullet list of
     engineered-friction moves, and user-side mitigations. Includes the
     "echo chamber of one" line moved in from operator.
2. `ai-operator.md`
   - Update TOC: `You Need Friction` → `A Note on Companion AIs`.
   - Replace the full "You Need Friction" section with a short two-
     paragraph signpost: one framing graf that sets up tool-vs-companion
     frictionlessness inversion, one deep-link paragraph pointing to
     `/ai-relationships#cryptophasia-for-one`.
3. Write this audit doc.
4. Three atomic commits.
5. Push to `origin/ai-persistence-drift-insight` (fork). Draft PR #521
   picks up automatically.
6. Comment on PR summarizing the applied changes. No sign-off (target
   is `idvorkin/*`).

## 4. Decisions + Trade-offs

- **Title choice.** Considered "Twin Talk" (crisp), "The Private Twin
  Tongue" (poetic), "Two-Person Cryptophasia" (clinical), "Cryptophasia
  for One". Picked the last for three reasons: (a) leads with the
  twin-language word Igor asked for, (b) the "for One" construction
  mirrors "the echo chamber of one" phrase now in the "What to do"
  subsection and ties the post's internal structure together, (c) has
  the same faintly absurd punch as other Igor-voice titles elsewhere on
  the blog (e.g. "Applied Buddhism").
- **Sentence shortening tactic.** Rule of thumb: if a sentence uses two
  em-dashes or "X, and Y" compounds, split it. Turned "There's a
  clinical version of this already, and it has a name. It's called
  cryptophasia — the private languages identical twins sometimes
  invent together" into four short sentences: "There's a clinical
  version of this already. It has a name: **cryptophasia** — the
  private languages identical twins sometimes invent together. Cute on
  the surface. But twins who develop cryptophasia score measurably
  lower…" Same information, shorter heartbeats.
- **Where to place the operator signpost.** Option A: leave the section
  header removed entirely, splice a one-liner into the previous
  section's closing. Option B: keep a short named section ("A Note on
  Companion AIs") containing the deep link. Picked B — preserves the
  TOC slot Igor saw in review (so the "from here" in comment 5 still
  has a concrete anchor point), gives the deep link room to breathe,
  and signals to future readers that this operator post deliberately
  hands off to `/ai-relationships` for the companion-AI thread.
- **Not touching comment 1.** Line 124 is Igor's note to himself to
  paste Screen Convos screenshots. That's a content-authoring action
  he owns, not an edit for the agent. Left unchanged so the reminder
  stays visible when he returns to the PR.

## 5. Outcomes

- `ai-operator.md`: "You Need Friction" (20 lines) removed and replaced
  with "A Note on Companion AIs" (5 lines). Net: -15 lines.
- `ai-relationships.md`: "The dialect of one" renamed to "Cryptophasia
  for One". Prose throughout shortened — average sentence length fell
  visibly in the diff. New `### What to do about it` sub-section added
  (~17 lines) carrying the design-prescription material migrated from
  operator. Net: +12 lines.
- TOC entries in both posts updated consistently.
- Deep-link anchor in operator: `/ai-relationships#cryptophasia-for-one`
  — slug verified against Jekyll/kramdown default generation
  (lowercase, spaces → hyphens, no punctuation issues in this title).
- Commits:
  - `fix(ai-operator): remove drift section, replace with deep-link to ai-relationships`
  - `fix(ai-relationships): retitle using twin-language, shorten sentences, add "What to do" subsection`
  - `docs(agent-notes): reasoning for ai-drift review fixes`
- PR stays in draft. Igor flips to ready-for-review when satisfied.

## 6. Deferred / Follow-ups

- **Screenshots (comment 1).** Igor plans to paste Screen Convos
  screenshots near `ai-operator.md:124`-ish when he returns to the PR.
  Agent action: none.
- **Anchor render check.** Would like to build Jekyll and confirm the
  `#cryptophasia-for-one` anchor resolves on the live page before
  flipping to ready-for-review. Not blocking at draft stage; Igor or a
  follow-up agent session can do this via
  `just jekyll-serve 4000 35729` + browser check.
- **`docs/agent-notes/` convention.** This is the first file under that
  path in `larry-blog`. If PR #140 lands a different canonical location
  (e.g. `.claude/agent-notes/` with a sandbox carve-out), these
  dogfood notes should migrate to match. Currently here because the
  PR #140 sandbox carve-out is not guaranteed to land in its draft
  form.

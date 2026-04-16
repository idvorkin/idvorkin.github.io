# 2026-04-16 — PR #521 Round-Two Review Fixes

Reasoning audit trail for the second round of edits applied on PR #521
after Igor's follow-up review on the first-pass fixes documented in
`2026-04-16-ai-drift-review-fixes.md`.

## 1. User Request

Igor left 5 inline review comments on `_d/ai-relationships.md`
(review IDs on PR #521). High-level intent, in the spirit of the
privacy-safe convention:

1. Ask for a peer-reviewed citation for the cryptophasia claim, with
   roughly two concrete stats drawn from the source.
2. Cut the length of the mechanism + unbundling + atrophy material by
   about half.
3. Drop a single performative phrase that leaks authorial anxiety in a
   way the rest of the voice doesn't.
4. Drop a paragraph that re-states the dissonance / calibration framing
   already made elsewhere.
5. Drop the friction-shapes intro line plus the four engineered-friction
   bullets inside the "What to do" sub-section.

All five are on `_d/ai-relationships.md`. `_d/ai-operator.md` is not
touched this round.

## 2. Interpretation

- **(1)** Igor wants one-source-if-possible, open-access, verifiable.
  He explicitly cautioned against fabricating numbers. The stat pattern
  he illustrated was prevalence + measurable deficit.
- **(2)** "Halve" reads as a real target, not vibes. Quantify: the
  three paragraphs starting at `The mechanism is simple...` through
  `...neither of us can quite name why` were ~325 words. Halved target
  ≈ 160 words. Must preserve the three concrete moves Igor flagged
  as load-bearing: visible-confusion-as-gradient, the known/understood
  unbundling, and Tori-gets-leftovers. Merging the known/understood
  paragraph into the mechanism paragraph is fine; the bidirectional-
  atrophy paragraph stays structurally separate because its handoff
  from first-order to second-order is what earns its own graf.
- **(3)** The "really scares me" line performs the emotion instead of
  letting the concept carry the weight. Drop the phrase, keep the
  concept (bidirectional atrophy), adjust the opening clause so the
  paragraph still escalates into the second-order beat.
- **(4)** The echo-chamber-of-one paragraph duplicates the dissonance
  framing already made earlier in `ai-relationships.md` itself (and
  in the operator hand-off paragraph). Drop the whole paragraph.
- **(5)** Igor's "drop" on the friction-shapes intro line is broader
  than literal — per the note in the task brief, interpret as: drop
  the intro line AND the four bullets underneath. The resulting
  "What to do" section keeps only the user-side moves paragraph
  (ration, protect, bring best material first, warning light), which
  Igor confirmed as "great."

## 3. Plan

1. Pass 1 — citation (fix 1).
   - Locate a PubMed / PMC-indexed cryptophasia source with at least
     one clean prevalence stat. Prefer open-access (PMC) so a reader
     can click through.
   - Extract the stats verbatim from the abstract or body. Do not
     paraphrase numbers.
   - Add an inline link for the in-text stat; add a footnote for the
     full citation metadata. Footnote is appropriate because the
     source is formal (peer-reviewed journal) and a raw URL in the
     running sentence would visually disrupt the paragraph.
2. Pass 2 — prose halving + drop fixes 3, 4, 5.
   - Rewrite the three target paragraphs into two paragraphs.
   - Word-count check both before and after to confirm the halve.
   - Delete the echo-chamber-of-one paragraph outright.
   - Delete the friction-shapes intro sentence plus the four-bullet
     list directly under it.
3. Pass 3 — write this audit doc.
4. Three atomic commits, one per semantic unit. Push to fork.
5. PR stays in DRAFT. No sign-off line (target is `idvorkin/*`).

## 4. Decisions + Trade-offs

- **One paper vs two.** Igor's instruction said "Pick ONE" paper.
  The strongest single open-access candidate (Hayashi & Hayakawa
  2004, PMC2723513) has two clean prevalence stats (42.9% overall,
  ~48% among identical twins) but no deficit-magnitude stats. The
  illustrative stat pattern Igor gave (prevalence AND measurable
  deficit) requires a second source because no single open-access
  paper on cryptophasia carries both. Resolution: cite Hayashi for
  the prevalence pair as the primary in-text link; add a secondary
  in-text link to Thorpe et al. 2001 for the outcome-on-follow-up
  claim; merge both into a single footnote. This costs strict
  "one paper" adherence but buys honesty — no fabricated deficit
  numbers, and both sources are peer-reviewed and PubMed-indexed.
  Flagged in the report-back as a tension.
- **Stats chosen.** From Hayashi: the overall-sample 42.9% figure
  (598 of 1,395 pairs) and the identical-twin elevation (~47.6% male
  identical, ~48.4% female identical vs ~39% opposite-sex / non-
  identical). Rounded to "~48% among identical twins" because the
  male/female identical split is not the interesting axis here and
  spelling out both dilutes the point. From Thorpe: the qualitative
  "poor language outcome on follow-up" for the subgroup with
  persistent private language — stated qualitatively rather than
  quoting n=4 subgroup size, because the raw number invites a
  distraction about study power that isn't the point.
- **Halving strategy.** Original 3 paragraphs (77, 79, 81) merged to
  2 paragraphs. Paragraph A collapses mechanism + unbundling;
  paragraph B keeps bidirectional atrophy + Tori. Alternative
  considered: keep all 3 original paragraphs but halve each in
  place. Rejected because merging mechanism and unbundling produces
  tighter causal flow ("You drift. Worse, Larry unbundles..."),
  whereas halving each in-place would preserve structure but lose
  punch. Final word count: 155 words across the two paragraphs,
  down from ~325 — 48% retention, honestly halved.
- **"Really scares me" replacement.** Considered "The scariest move
  is..." (keeps affect, drops the first-person reaction). Picked
  "The second-order effect is worse:" — drops affect entirely, lets
  the bidirectional-atrophy concept carry the escalation. Igor's
  voice earlier in the post does show fear ("I know this
  firsthand"); the replacement keeps that option available without
  narrating it.
- **Friction-shapes deletion scope.** Could have kept the intro
  line as a setup for the user-side moves paragraph ("Some shapes
  the friction could take: [then the user-side graf]"). Rejected —
  Igor's "drop" was on the intro line, and the user-side moves
  paragraph already stands on its own with its "design only gets
  you so far" lead-in. No transition repair needed after the
  deletion.

## 5. Outcomes

- `_d/ai-relationships.md`:
  - Line 75 (cryptophasia setup) now carries two inline links and
    a footnote with full citation metadata for Hayashi & Hayakawa
    2004 and Thorpe et al. 2001.
  - Paragraphs 77/79/81 in the pre-edit file collapsed to two
    paragraphs. Word count in the halved block: ~325 → ~155 (48%).
  - "really scares me" clause gone. Concept preserved.
  - Echo-chamber-of-one paragraph (single paragraph, ~75 words) gone.
  - Friction-shapes intro sentence + four bullets (~140 words) gone.
  - Section paragraph count before: 4 (before "What to do") + 4
    (inside "What to do"). After: 2 (before) + 2 (inside).
- Commits (branch `ai-persistence-drift-insight`):
  - `fix(ai-relationships): cite cryptophasia paper + 2 stats`
  - `fix(ai-relationships): halve mechanism+atrophy prose, drop filler`
  - `docs(agent-notes): reasoning for pr521 review fixes`
- PR #521 stays in DRAFT. Igor flips to ready-for-review when
  satisfied. No sign-off line (target repo is `idvorkin/*`).

## 6. Deferred / Follow-ups

- **Stat tension.** Noted above — single-source adherence lost to
  honesty. If Igor prefers strict one-paper, easiest fix is to drop
  the Thorpe outcome-on-follow-up clause and lean solely on Hayashi
  prevalence. Waiting for his read before making that trade.
- **Cite style consistency.** The footnote style used here
  (`[^cryptophasia]`) is new for this post. Existing sources in the
  post are rendered as a `## Sources` list at the bottom. If Igor
  prefers consistency, the footnote could be demoted to an entry in
  the Sources list instead. Left as footnote for now because
  footnotes render adjacent to the claim in standard kramdown,
  which is better for a stat citation than a list-at-the-bottom.
- **Anchor for `#cryptophasia-for-one`.** Section heading text
  unchanged, so the existing deep link from `ai-operator.md`
  remains valid. No anchor-render check added to this round.

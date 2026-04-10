# ACT Made Simple Blog Post Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a two-part blog post at `_d/act.md` summarizing Russ Harris's *ACT Made Simple* — Part 1 is distilled key concepts and takeaways drafted in Igor's voice; Part 2 is a chapter-by-chapter TOC with 2-4 sentence summaries per chapter.

**Architecture:** The 853KB source book (`~/gits/raw-ebooks/md/ACT-Made-Simple.md`) is too large to hold in the main context. An Explore subagent reads the book in chunks, studies Igor's voice references (`_d/4dx.md`, `_d/siy.md`), and returns a structured extract. The main agent assembles the final Markdown, adds the ASIN entry, verifies Jekyll rendering, and commits on branch `add-act-made-simple`.

**Tech Stack:** Jekyll (Ruby), Markdown with Liquid includes, `prek` (pre-commit), Playwright (screenshot verification), `running-servers` (Jekyll lifecycle), Amazon product data via `_data/asins.json`.

**Spec:** `docs/superpowers/specs/2026-04-10-act-made-simple-post-design.md`

---

## File Structure

**Create:**
- `_d/act.md` — the blog post (single file, ~400-700 lines of markdown)

**Modify:**
- `_data/asins.json` — add one entry for *ACT Made Simple* (keyed by 10-char ASIN)

**Reference (read-only):**
- `~/gits/raw-ebooks/md/ACT-Made-Simple.md` — source book
- `_d/4dx.md` — voice reference (framework-style book summary)
- `_d/siy.md` — voice reference (emotional-health book summary)
- `_includes/ai-slop.html` — honesty label (takes `percent` param)
- `_includes/amazon.html` — book card (takes `asin` param)

**Test / verify:**
- `http://localhost:4003/act` — rendered page (Jekyll dev server)
- `prek run --files _d/act.md _data/asins.json` — pre-commit lint

---

## Task 1: Look Up and Add ASIN for *ACT Made Simple*

**Files:**
- Modify: `_data/asins.json` (top of file, insert new entry alphanumerically by ASIN)

- [ ] **Step 1: Find the correct ASIN via web search**

Run:
```bash
# ACT Made Simple 2nd edition (New Harbinger, 2019) is the current canonical edition.
# Likely ASIN: 1684033012 (paperback). VERIFY before using.
```

Use `WebFetch` against an Amazon search or a known book-database URL to confirm the 10-character ASIN for "ACT Made Simple 2nd edition Russ Harris". Expected: `1684033012` or similar New Harbinger 2019 edition ISBN-10.

Record the verified ASIN.

- [ ] **Step 2: Fetch canonical title from Amazon**

Run:
```bash
curl -sL "https://www.amazon.com/dp/<ASIN>" -H "User-Agent: Mozilla/5.0" | grep -oP '<title>[^<]+</title>' | head -1
```

Expected: HTML title containing the book name. If Amazon blocks, use the standard title format manually:
```
"ACT Made Simple: An Easy-To-Read Primer on Acceptance and Commitment Therapy (The New Harbinger Made Simple Series): Harris, Russ: 9781684033010: Amazon.com: Books"
```

- [ ] **Step 3: Insert new entry into `_data/asins.json`**

The file is keyed by 10-char ASIN and sorted alphanumerically. Insert the new entry in the correct position (for `1684033012`, that's between other `16*` entries). Entry shape (match existing entries exactly):

```json
  "1684033012": {
    "description": "View product details on Amazon",
    "image": "https://images-na.ssl-images-amazon.com/images/P/1684033012.01._SCLZZZZZZZ__SL160_.jpg",
    "price": null,
    "title": "ACT Made Simple: An Easy-To-Read Primer on Acceptance and Commitment Therapy (The New Harbinger Made Simple Series): Harris, Russ: 9781684033010: Amazon.com: Books",
    "updated": "2026-04-10"
  },
```

- [ ] **Step 4: Validate the JSON**

Run:
```bash
python3 -c "import json; json.load(open('_data/asins.json'))" && echo "JSON valid"
```

Expected: `JSON valid`. If it fails with a position error, fix the comma placement at the insert point.

- [ ] **Step 5: Commit**

```bash
git add _data/asins.json
git commit -m "Add ASIN for ACT Made Simple (Russ Harris, 2nd ed)"
```

---

## Task 2: Extract Book Content and Draft Blog Post via Subagent

This task dispatches one Explore subagent that (a) reads the source book, (b) studies Igor's voice references, and (c) writes `_d/act.md`. Combining extraction and drafting in a single subagent avoids re-loading the 853KB book into a second agent's context.

**Files:**
- Create: `_d/act.md`
- Reference: `~/gits/raw-ebooks/md/ACT-Made-Simple.md`, `_d/4dx.md`, `_d/siy.md`

- [ ] **Step 1: Dispatch Explore subagent with full context**

Use the `Agent` tool with `subagent_type: "Explore"`, thoroughness "very thorough", and this exact prompt (self-contained — the subagent has no memory of this conversation):

```
You are writing a blog post for Igor Dvorkin's personal blog. The post
summarizes Russ Harris's "ACT Made Simple" (a practitioner's intro to
Acceptance and Commitment Therapy). You must produce ONE output file.

Write the final post to: /home/developer/gits/blog4/_d/act.md

=== SOURCE BOOK ===

Read the full book at:
/home/developer/gits/raw-ebooks/md/ACT-Made-Simple.md

The file is ~8,172 lines. Read it in chunks of ~1,500 lines using
Read with offset/limit (roughly 6 passes). As you read, take mental
notes on:

1. The six core processes of ACT (the "hexaflex"):
   - Cognitive Defusion
   - Acceptance
   - Contact with the Present Moment
   - Self-as-Context (the Observing Self)
   - Values
   - Committed Action
   For each: Harris's one-paragraph definition, 1-2 signature
   metaphors, 1-2 concrete practices.

2. The overarching goal: Psychological Flexibility — what Harris
   means by it and why it matters.

3. The problems ACT targets: Cognitive Fusion and Experiential
   Avoidance. Short definitions and examples.

4. Signature metaphors that work as standalone teaching tools
   (e.g., Passengers on the Bus, Tug-of-War with a Monster,
   Leaves on a Stream, Quicksand, Chessboard). Keep the ones
   Harris emphasizes most.

5. The book's actual chapter structure — capture the chapter
   number and title for every chapter, plus a 2-4 sentence
   summary of each chapter's main idea and any distinctive
   tool/exercise introduced.

DO NOT rely on prior training knowledge of ACT. Quote or closely
paraphrase from the source file so the content is faithful.

=== VOICE REFERENCE ===

Before drafting, read these two files end-to-end to absorb Igor's
voice for book summaries:
- /home/developer/gits/blog4/_d/4dx.md (framework-style)
- /home/developer/gits/blog4/_d/siy.md (emotional-health topic)

Voice characteristics to match:
- First person ("I", never "we")
- Direct, practical, no hedge words ("perhaps", "one might", etc.)
- Short paragraphs (2-4 sentences)
- Bullets for enumerable items, prose for concepts
- Personal application woven in ("when I notice X, I...")
- No motivational fluff, no "in conclusion" wrap-ups

=== OUTPUT FILE STRUCTURE ===

Write _d/act.md with this exact structure. Preserve the frontmatter
EXACTLY as shown, and the exact include tags.

---
layout: post
title: "ACT Made Simple: Acceptance and Commitment Therapy"
author: "Igor Dvorkin"
permalink: /act
tags:
  - book-notes
  - emotional-health
  - mental-health
  - psychology
---

<PLAIN TEXT OPENING PARAGRAPH — 3 sentences, no includes above it,
frames what ACT is and why Igor is writing this. This paragraph is
used as the excerpt, so it must stand alone. Example tone: "ACT is
a therapy tradition I've circled for years without ever sitting
down with it. Russ Harris's _ACT Made Simple_ is the practitioner
primer — the book therapists actually read. These are the concepts
I want to lift into my own practice.">

{% include ai-slop.html percent="90" %}
{% include amazon.html asin="1684033012" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

(generate the TOC here matching the headings below — use the same
format as _d/4dx.md)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Part 1: Key Concepts & My Takeaways

### Psychological Flexibility — the Goal

<2-4 short paragraphs in Igor's voice. What it means, why it matters,
why it's the north star of ACT.>

### The Problem: Cognitive Fusion & Experiential Avoidance

<2-3 paragraphs. Define both, give a concrete everyday example of each,
explain why they create suffering.>

### The Hexaflex — Six Core Processes

<1 paragraph intro to the hexaflex model.>

#### 1. Cognitive Defusion
<2-3 paragraphs: definition, 1-2 metaphors, 1 concrete practice.>

#### 2. Acceptance
<Same shape.>

#### 3. Contact with the Present Moment
<Same shape.>

#### 4. Self-as-Context (the Observing Self)
<Same shape.>

#### 5. Values
<Same shape. Emphasize values clarification exercises.>

#### 6. Committed Action
<Same shape. Emphasize connection to habits/behavior change.>

### Metaphors That Land

<5-8 of Harris's signature metaphors, 1-2 sentences each explaining
what the metaphor teaches.>

### Practices I Want to Lift Into My Life

<Bulleted list of 5-10 specific practices from the book. Each bullet
is a concrete thing Igor could do today. In Igor's voice ("When I
notice X, I will do Y").>

## Part 2: Book Chapters — Key Ideas

<For every chapter in the book, write:

### Chapter N: <Chapter Title>
<2-4 sentences capturing the main idea of the chapter and the key
exercise/tool introduced, if any.>

Go in order. Don't skip chapters. If the book has 30+ chapters,
that's fine — this section is a reference index.>

## Related Posts

<Link to Igor's existing related posts. Use permalinks only:
- /emotional-health (from _d/emotional-health-hold.md)
- /siy (from _d/siy.md)
- /awareness (from _d/awareness.md)
- /anxiety (from _d/anxiety.md)
- /shame (from _d/shame.md)
Only include the ones that are genuinely related. Format as a
bullet list with a short "why it's related" note.>

=== CONSTRAINTS ===

- Do NOT generate the vim-markdown-toc TOC entries from memory.
  Leave the `<!-- vim-markdown-toc GFM -->` block empty — Igor's
  pre-commit hook regenerates it. Just keep the comment markers.
- Do NOT add an H1 — the title comes from frontmatter.
- Do NOT add "In conclusion" / "In summary" wrap-up sections.
- Internal links MUST be permalinks (e.g., `/siy` not `/siy.md`).
- Quote sparingly — this is a summary, not a clip file. When
  you do quote, use block quotes (`>`) and keep them short.
- The final file should be 400-700 lines of markdown. If you're
  writing more than 700 lines, you're padding — tighten it.

=== DELIVERABLE ===

Write the complete _d/act.md file. Report back:
1. Total line count of the file.
2. Number of chapters you summarized in Part 2.
3. Any places where the source book was unclear or where you had
   to make judgment calls about what to include.
```

- [ ] **Step 2: Verify the subagent wrote the file**

Run:
```bash
ls -lh /home/developer/gits/blog4/_d/act.md && wc -l /home/developer/gits/blog4/_d/act.md
```

Expected: File exists, size > 10KB, line count 400-700. If the file is missing or tiny (<5KB), the subagent failed — re-dispatch with clearer instructions. If it's massive (>1000 lines), note it for the next step but continue.

- [ ] **Step 3: Sanity-check the content structure**

Run:
```bash
grep -c "^### " /home/developer/gits/blog4/_d/act.md
grep -c "^#### " /home/developer/gits/blog4/_d/act.md
grep -n "Part 1\|Part 2" /home/developer/gits/blog4/_d/act.md
```

Expected:
- `### ` count ≥ 10 (6 hexaflex processes as h4, plus several h3 sections)
- `#### ` count ≥ 6 (the six core processes)
- Both "Part 1" and "Part 2" headings present

If any of these are off, the subagent drifted from the spec — fix by editing `_d/act.md` directly rather than re-dispatching (faster).

- [ ] **Step 4: Verify no h1 and frontmatter is intact**

Run:
```bash
head -15 /home/developer/gits/blog4/_d/act.md
grep -c "^# " /home/developer/gits/blog4/_d/act.md
```

Expected:
- Head output shows the frontmatter `---` block with `layout: post`, `permalink: /act`, etc.
- `^# ` count is 0 (no H1 — title comes from frontmatter).

If there's an H1, delete it.

- [ ] **Step 5: Commit the draft**

```bash
cd /home/developer/gits/blog4
git add _d/act.md
git commit -m "Add ACT Made Simple blog post draft

Two-part post summarizing Russ Harris's ACT Made Simple.
Part 1: key concepts drafted in Igor's voice — the hexaflex,
psychological flexibility, signature metaphors, practices
to lift into daily life. Part 2: chapter-by-chapter key
ideas as a reference index. Shipped with ai-slop percent=90
to be honest about provenance; Igor will edit and lower the
percentage as he rewrites."
```

---

## Task 3: Verify Jekyll Rendering

**Files:**
- Reference: `_d/act.md`
- No changes (unless rendering surfaces issues)

- [ ] **Step 1: Check if Jekyll is already running**

Run:
```bash
cd /home/developer/gits/blog4 && running-servers check .
```

Expected output: either "✓ Running on port XXXX" (note the port) or "✗ No servers for . / Available port: 4003".

- [ ] **Step 2: Start Jekyll if not running**

If no server is running:
```bash
cd /home/developer/gits/blog4
just jekyll-serve 4003 35733 > /tmp/jekyll-act.log 2>&1 &
```

Then wait for it to be ready (first build takes ~30s):
```bash
timeout 90 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4003/ | grep -q 200; do sleep 2; done' && echo "Jekyll ready"
```

Expected: `Jekyll ready` within 90s. If it times out, check `/tmp/jekyll-act.log` for build errors.

- [ ] **Step 3: Load the ACT page and verify HTTP 200**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4003/act
```

Expected: `200`. If 404, the permalink didn't register — check the frontmatter in `_d/act.md` for `permalink: /act`. If 500, check Jekyll log for Liquid errors.

- [ ] **Step 4: Check for Jekyll build errors**

Run:
```bash
tail -30 /tmp/jekyll-act.log | grep -iE "error|warning|liquid|exception" || echo "No errors"
```

Expected: `No errors`. Any warnings about the `ai-slop.html` or `amazon.html` includes mean the include failed — inspect and fix.

- [ ] **Step 5: Screenshot the rendered page**

Run:
```bash
npx playwright screenshot --browser chromium --viewport-size "1280,900" \
  --wait-for-timeout 3000 "http://localhost:4003/act" /tmp/act-screenshot.png && \
  ls -lh /tmp/act-screenshot.png
```

Expected: File size > 50KB (< 50KB usually means blank page). Open and eyeball it — does it show the title, ASIN card, and start of the content?

- [ ] **Step 6: Verify the ASIN card renders**

Run:
```bash
curl -s http://localhost:4003/act | grep -oE "amazon\.com/[^\"']*1684033012|amzn\.to/[^\"']*" | head -3
```

Expected: At least one match showing the ASIN is woven into an Amazon URL (the `amazon.html` include generates these).

If the ASIN is different from `1684033012`, substitute accordingly.

- [ ] **Step 7: No commit (verification only)**

---

## Task 4: Run Pre-Commit Checks and Fix Issues

**Files:**
- Modify (if needed): `_d/act.md`, `_data/asins.json`

- [ ] **Step 1: Run prek on changed files**

Run:
```bash
cd /home/developer/gits/blog4
prek run --files _d/act.md _data/asins.json 2>&1 | tee /tmp/prek-act.log
```

Expected: All checks pass. Likely checks: markdown lint, internal link checker, JSON validation, prettier.

- [ ] **Step 2: Fix any failures**

Common issues and fixes:
- **Internal link uses redirect URL** → change `/siy-book` to `/siy`, `/48-laws` to `/laws-of-power`, etc. Use the permalink from the target file's frontmatter.
- **Markdown lint: trailing whitespace** → `sed -i 's/ *$//' _d/act.md`
- **JSON schema error on asins.json** → check the entry added in Task 1 matches the shape of surrounding entries (trailing comma, all four fields present).
- **vim-markdown-toc mismatch** → some prek setups regenerate the TOC. Just re-run prek; the second pass should pass after auto-fix.

- [ ] **Step 3: Re-run prek until clean**

```bash
prek run --files _d/act.md _data/asins.json
```

Expected: all green. Do not proceed to the next step until this passes. Do not use `--no-verify` or bypass checks.

- [ ] **Step 4: Commit any fixes**

If any files were modified by prek or by hand:
```bash
git add _d/act.md _data/asins.json
git commit -m "Fix prek issues on ACT post"
```

If nothing changed, skip this step.

---

## Task 5: Generate Backlinks and Final Verification

**Files:**
- Modify (if needed): `back-links.json` or whatever `just back-links` generates

- [ ] **Step 1: Run backlinks generator**

Run:
```bash
cd /home/developer/gits/blog4
just back-links 2>&1 | tail -20
```

Expected: command succeeds, may regenerate a backlinks file.

- [ ] **Step 2: Commit backlinks if regenerated**

Run:
```bash
git status --short
```

If anything changed:
```bash
git add -A
git commit -m "Regenerate backlinks for ACT post"
```

If nothing changed, skip.

- [ ] **Step 3: Final branch status check**

Run:
```bash
git log --oneline main..HEAD
git status
```

Expected: clean working tree, 3-5 commits on the branch (spec + asin + draft + optional fixes + optional backlinks).

- [ ] **Step 4: Final render check**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4003/act
```

Expected: `200`. Confirms everything still renders after all the fixes.

---

## Task 6: Push Branch and Hand Off to Igor

**Files:**
- No file changes. This is a remote operation.

- [ ] **Step 1: Confirm we're on the feature branch**

Run:
```bash
git branch --show-current
```

Expected: `add-act-made-simple`. If not, STOP and tell Igor.

- [ ] **Step 2: Push to origin**

Run:
```bash
git push -u origin add-act-made-simple
```

Expected: push succeeds, output shows tracking set up. If push is rejected because the branch exists on origin, run `git pull --rebase origin add-act-made-simple` first, then push.

- [ ] **Step 3: Report to Igor**

Give Igor:
1. Branch name: `add-act-made-simple`
2. Preview URL: `http://localhost:4003/act`
3. File path: `_d/act.md`
4. Line count of the final post
5. Notes from the drafting subagent (any judgment calls or unclear spots in the source)
6. Screenshot path: `/tmp/act-screenshot.png`

DO NOT create a PR yet. Igor wants to edit the draft (lower the ai-slop percent, personalize the "My Takeaways" section) before opening a PR.

---

## Self-Review

**Spec coverage check:**
- [x] Two-part structure (Part 1 + Part 2) → Task 2 subagent prompt enforces this
- [x] ASIN link on top → Task 1 (asin entry) + Task 2 (include tag in file)
- [x] Voice reference to 4dx.md and siy.md → Task 2 subagent prompt
- [x] Drafted in Igor's voice (option A from brainstorm) → Task 2 subagent prompt
- [x] File location `_d/act.md` with permalink `/act` → Task 2 frontmatter
- [x] ai-slop label at 90% → Task 2 include tag
- [x] Jekyll render verification → Task 3
- [x] Pre-commit checks → Task 4
- [x] Backlinks regeneration → Task 5
- [x] Push to feature branch, no PR yet → Task 6

**Placeholder scan:** No "TBD", "TODO", "similar to", or "implement later" in task steps. Task 2's subagent prompt is self-contained with full structure. ✓

**Type consistency:** File paths consistent throughout (`_d/act.md`, `_data/asins.json`, `docs/superpowers/specs/...`). ASIN `1684033012` used consistently but flagged as requiring verification in Task 1. ✓

**Risk spots flagged:**
- Task 1 Step 1/2: ASIN verification may need manual intervention if Amazon blocks curl — fallback instructions included.
- Task 2 Step 3: If subagent drifts, directly editing is faster than re-dispatching — noted.
- Task 4 Step 2: Common prek failures enumerated with fixes.

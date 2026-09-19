---
name: pr-checks
description: Generate the PR Review Checklist grid (Architect/Carpenter/Judge/Workflow) for changed blog posts. Structural checks run as code; headers, voice and ai-patterns are judged by the Jev decision model. Use when reviewing a content PR, before opening one, or when asked for "the checks grid". Also runs as the repo's `blog-checks` no-mistakes gate.
allowed-tools: Bash, Read, Edit
---

# PR Checks Grid

Prints the checklist defined in `content_guidelines.md` § PR Review Checklist, exactly as that section specifies it:

```
Architect: 🟢 headers 🟢 front-matter 🟢 internal-links
Carpenter: 🟢 opening 🟢 voice 🟢 ai-patterns
Judge: 🟢 alerts 🟢 images ⚪ books 🟢 ai-slop
Workflow: 🟢 rebased

Issues:
- ai-patterns — line 42: remove "it's important to note that"
```

`content_guidelines.md` defines the keys and the 🟢 / 🔴 / ⚪ vocabulary. This skill implements that definition — it does not add keys of its own.

The split is deliberate: **anything a regex can settle is code**, and only the three checks that need a reader's judgment go to a model. Structural checks never touch the network, so the grid still works with no API key, offline, and in CI.

## When to use

- Reviewing a content PR, or before opening one.
- Igor asks for "the checks grid", "run the checklist", or pastes the grid and asks what's wrong.
- Automatically, as the `blog-checks` gate in `.no-mistakes.yaml`.

## Commands

```bash
# Posts changed on this branch vs upstream/main (falls back to origin/main, main)
.claude/skills/pr-checks/pr_checks.py

# Specific posts
.claude/skills/pr-checks/pr_checks.py _d/time-allocation.md _d/joy.md

# Machine-readable, including the raw Jev scores
.claude/skills/pr-checks/pr_checks.py --json

# Never exit nonzero, whatever fails
.claude/skills/pr-checks/pr_checks.py --advisory

# Skip the model entirely (no network, no key needed)
.claude/skills/pr-checks/pr_checks.py --no-jev

# Let a Jev ai-patterns failure fail the run (see Calibration before using this)
.claude/skills/pr-checks/pr_checks.py --block-jev
```

Run the script directly — the `uv run --script` shebang resolves its own dependency. Going through `python3` skips that and fails with `ModuleNotFoundError: typer`.

### Exit codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| 0    | No blocking 🔴 (or `--advisory`, or no posts changed) |
| 1    | At least one blocking check failed                    |
| 2    | Usage error — a path that does not exist              |

## What each check does

| Key              | Judged by | Blocks | Flags                                                                                             |
| ---------------- | --------- | ------ | ------------------------------------------------------------------------------------------------- |
| `front-matter`   | code      | yes    | Missing `title`; missing `permalink` outside `_posts/`; missing `tags` outside `_td/`             |
| `internal-links` | code      | yes    | A link through a `redirect_from`/`alias` URL; a link written with the `idvork.in` host            |
| `opening`        | code      | yes    | First rendered block is not a plain paragraph, or the opening paragraph contains a Liquid include |
| `alerts`         | code      | yes    | `alert.html` at or above the opening paragraph                                                    |
| `images`         | code      | yes    | A blob-repo image linked raw instead of through `blob_image.html`                                 |
| `books`          | code      | yes    | A raw `amazon.com` / `amzn.to` link instead of `amazon.html asin="…"`                             |
| `ai-slop`        | code      | yes    | `ai-slop.html` at or above the opening paragraph                                                  |
| `rebased`        | code      | yes    | The branch does not contain the tip of `upstream/main`                                            |
| `headers`        | Jev       | never  | Prose that is hard to scan for want of section headers                                            |
| `voice`          | Jev       | never  | Voice or register that shifts mid-post ("I" ↔ "we", conversational ↔ formal)                      |
| `ai-patterns`    | Jev       | opt-in | Prose that reads as generic AI output rather than a person writing from experience                |

⚪ means the check does not apply: no internal links, no images, no alert, no book link, no ai-slop notice, no API key.

Three scoping rules come from what the repo actually does, measured on `upstream/main` in September 2026, not from taste:

- `permalink` is not required in `_posts/` — that collection builds URLs from the filename and 24 of its 37 posts have no permalink. Every one of the 76 posts added in the previous year to `_d/` has one.
- `tags` is not required in `_td/` — no file in that collection has ever had tags (0/51).
- A redirect whose declaring page has no permalink is not flagged, because there is no canonical URL to send the author to. That removes 58 of 257 hits repo-wide.

`images` only flags images hosted in `idvorkin/blob`, the one host with a matching include. Raw markdown images pointing at `ipaste` or an external site are normal in this repo (42 of 47) and pass.

### Expect it to find things on old posts

The checks read the whole post, not just the lines a PR touched, so editing a long-lived post surfaces drift that was already there. Measured across the 364 posts on `upstream/main`, 60% have at least one blocking 🔴; among the 75 posts added in the last year it is 35%, almost all of it missing `tags` (23%) and links through redirects (15%). Those are real guideline violations with a one-line fix each, but it does mean the gate parks a meaningful share of content PRs for a decision. `--advisory` is the escape hatch if that trade stops being worth it.

## Jev, and what it is trusted with

The three prose checks go to [Jev](https://openrouter.ai/typesafe/jev-1.13) (`typesafe/jev-1.13`) through OpenRouter's alpha decisions endpoint. Each question is a `score` on a five-anchor rubric worded so a **higher number is a worse post**, and each check has a threshold. The raw score prints next to the grid so you can see how close a call was:

```
Jev (typesafe/jev-1.13, score/🔴-threshold): headers 0.02/3.0* · voice 2.64/3.5* · ai-patterns 0.76/3.0*
  * advisory only — never fails the run
```

Jev returns a verdict with no reasons, so an `ai-patterns` 🔴 also asks eight `noul` questions in the same call — one per pattern family from the guidelines — and the Issues line names the families that scored ≥ 0.5. Literal guideline phrases ("it's important to note", "stands as", …) are grepped separately and printed as evidence under the grid. They are never a verdict on their own: a post _about_ AI writing quotes those phrases legitimately.

### Calibration — what the numbers actually support

`./calibrate.py` reproduces this. Measured September 2026 against `jev-1.13`:

| Check         | Evidence                                                                                                                                                                        | Verdict                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `ai-patterns` | 12 posts Igor wrote before LLMs existed scored ≤ 2.38; 12 recent posts self-declaring `ai-slop ≥ 50%` scored ≤ 2.47; three deliberately AI-patterned fixtures all scored ≥ 3.99 | **Separates.** Threshold 3.0 sits in the gap |
| `headers`     | Paired defect injection — strip every heading from a real post — moved the score on 3 of 6 posts. Two short posts that already scored ~2.3 did not move at all                  | **Cannot discriminate**                      |
| `voice`       | Injecting an "I" → "we" switch into the back half moved the score by +0.03 to +1.38, while clean posts already sat at 2.2–3.1                                                   | **Cannot discriminate**                      |

So `headers` and `voice` never fail a run, whatever flags you pass. Their thresholds (3.0 and 3.5) sit above the ceiling of a 40-post random sample of the whole repo (`headers` max 2.63, `voice` max 3.05), which makes a 🔴 mean "an outlier against 364 posts" — worth a look, not a verdict.

`ai-patterns` is the one with a validated positive group, so `--block-jev` fails a run only on that check. It is still advisory by default: the gate should not depend on a third-party API being reachable.

Rerun drift on the same post is ≤ 0.06 on the 0–4 scale (5 posts × 2 runs), so a score near a threshold is a real borderline, not noise. One post costs about **$0.0003** and **0.3 s**.

Re-run `./calibrate.py` whenever the model version in `pr_checks.py` changes. A threshold copied across a model bump is a guess.

### Input limit

Measured against the endpoint: it rejects anything over ~32,768 input tokens with `max_tokens_exceeded` — fine at 121,500 characters of prose, failing at 124,031. Posts are chunked on `## ` boundaries at 60,000 characters and the **worst** chunk's score is the post's score. Three posts in the repo need chunking today.

## Keys and privacy

The key is read from `OPENROUTER_API_KEY`; failing that, from the `OPEN_ROUTER_KEY` field of the JSON file named by `$SECRET_BOX`. With neither available the three Jev checks print ⚪ with a "no key, skipped" note, the structural checks still run, and the exit code is unaffected. The same is true if the call fails or times out. The key is never printed.

**Point this only at content destined for the public blog.** The post body is sent to a third party. TypeSafe states it does not train on inputs, but publishes no retention period and offers no zero-data-retention mode. Blog posts are already public, which is what makes this use fine; a journal entry or a work document would not be.

## The no-mistakes gate

`.no-mistakes.yaml` runs the structural half after the lint step:

```yaml
gates:
  - name: blog-checks
    after: lint
    command: ".claude/skills/pr-checks/pr_checks.py --advisory-jev"
```

It exits 0 when the branch changes no posts, so code-only PRs pass untouched. Gate declarations are read from the **default branch only**, so the gate starts running once this is merged to `main`, not on the PR that adds it. The daemon host usually has no `OPENROUTER_API_KEY`, so in practice the gate runs the structural checks and reports ⚪ for the three Jev ones — which is the intended failure mode, not a bug.

## Tests

```bash
cd .claude/skills/pr-checks && python3 -m unittest -v
```

Stdlib only, no network — the Jev responses are mocked. `just fast-test` does not run Python tests in this repo (it runs vitest), which is why this is a hand-run suite, same as `.claude/skills/toc/test_toc.py`.

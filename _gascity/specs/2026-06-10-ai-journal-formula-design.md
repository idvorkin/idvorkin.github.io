# AI Journal Formula — Design Spec

- **Date:** 2026-06-10
- **Status:** Design approved; formulas authored (not yet cook-tested)
- **Scope:** Two Gas City formulas in the blog rig that draft and revise entries
  in `_d/ai-journal.md`.

## Goal

Let the author drop **rough notes** and get back a **polished, deep-linked
journal entry as a PR** — then drive revisions from PR feedback without the
revising agent having to redo the original research. State (especially the
research) lives in beads and the PR, so **any session can run any revision**.

Modeled directly on the existing, battle-tested `blog-backlinks` formula
(`_gascity/formulas/blog-backlinks.toml`): `vapor` phase, parameterized
`[vars]`, `[[steps]]` with `needs`, a real judgment gate, worktree isolation,
**never pushes to main**, opens a clean PR, mails the outcome.

## What already exists (reused, not reinvented)

- **`blog-backlinks` formula** — the proven mechanical pattern. We swap its
  "rebuild backlinks" middle for "research + draft entry"; the
  worktree/verify/land/notify mechanics are unchanged.
- **`_d/ai-journal.md` → `## Instructions for Claude: Creating Journal Entries`**
  — the content spec the agent reads at runtime: new `### YYYY-MM-DD` at the top
  of Diary, `#### Title`, **TOP Takeaway / The Problem / What Worked / What
  Didn't**, deep GitHub commit-permalinks with line numbers, update the TOC.

## Decisions (from brainstorm)

1. **Job:** draft & add a new dated entry.
2. **Input:** author pastes rough notes (via a `notes_file` var).
3. **Review:** in the PR. The PR is the gate; nothing reaches main without a
   human merge.
4. **State across revisions:** persisted in beads + the PR; the agent is
   stateless and rehydrated each rev.
5. **Research persistence:** a **research dossier** stored on a tracking bead,
   loaded at the start of every rev so research is never redone or drifted.

## State model (the heart of the design)

Three layers, each in the place that survives a dead session:

| Layer                         | Lives in           | Holds                                                                                   |
| ----------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| Final content                 | the branch         | the entry itself                                                                        |
| Feedback                      | PR review comments | what to change                                                                          |
| **Research / working memory** | **tracking bead**  | claim→permalink map, sources read, links considered/rejected, open questions, reasoning |

**Tracking bead** — a dedicated, long-lived bead (NOT the ephemeral molecule
root, which closes when a cook completes). Created by `ai-journal-new`, it
carries:

- title/slug of the entry,
- **PR URL + branch name** (the anchor revisions use),
- **`design` field = the current research dossier** (replaceable, updated each
  rev),
- **comments = append-only per-rev decision log** ("rev 2: tightened takeaway,
  dropped the Telegram tangent per reviewer").

If a dossier outgrows the `design` field, spill it to a scratch file in the
worktree and keep a pointer on the bead.

## Formula 1: `ai-journal-new`

**`[vars]`**: `notes_file` (required), `sources` (optional), `blog_repo`,
`base_branch`, `notify` (defaults match `blog-backlinks`).

**`[[steps]]`**

1. **fresh-worktree** — isolated worktree off `{{base_branch}}`.
2. **research** — read notes + the `Instructions for Claude` spec + mine
   `{{sources}}`; walk git history for exact permalinks; build the dossier and
   persist it to a new tracking bead's `design`. Output the bead id.
3. **draft-entry** — write the formatted entry at the top of Diary + update TOC,
   editing only `_d/ai-journal.md`.
4. **verify** _(judgment gate)_ — only `_d/ai-journal.md` changed; format right;
   every deep link resolves and matches the dossier; nothing fabricated; correct
   base. Abort + mail on failure.
5. **land** — commit, push branch to fork, PR vs canonical main; stamp PR +
   branch on the tracking bead.
6. **notify** — mail the PR link + bead id.

## Formula 2: `ai-journal-revise`

**`[vars]`**: `entry_bead` (required), `blog_repo`, `notify`.

**`[[steps]]`**

1. **hydrate** — load the bead (dossier + PR + branch), `gh pr view --comments`,
   `git worktree add` the **existing** branch.
2. **apply** — make the changes; append any new research to the dossier.
3. **land** — push the **same branch** (PR updates in place); only-`ai-journal.md`
   check.
4. **persist-notify** — append a rev comment to the bead; mail.

## Invariants / safety

- **Never push to main.** Worktree isolation. Judgment gate in `new`, light
  check in `revise`. NDI: all durable state in the bead + PR; the agent holds
  none.

## Out of scope / future

- Autonomous rev loop: an **Order** gated on a "PR review submitted" event that
  auto-cooks `ai-journal-revise` (needs PR events on the bus). Deferred.

## Status / how to use once merged

```
# new entry
gc formula cook ai-journal-new --var notes_file=~/tmp/agent/ai-journal/notes-<slug>.md
# revise from PR feedback (bead id comes from the new-entry mail)
gc formula cook ai-journal-revise --var entry_bead=<id>
```

These formulas are authored against the `blog-backlinks` pattern but have not yet
been cook-tested end-to-end; first run should be watched.

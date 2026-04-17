---
name: changelog
description: Generate weekly changelog entries for blog and all GitHub repos. Use when asked to summarize changes, update the changelog, or at the end of a productive week. Analyzes git history across repos and creates curated summaries with deep links.
allowed-tools: Bash, Read, Edit, Write
---

# Changelog Generator

Generate weekly changelog entries for the blog and other GitHub repos with deep links.

## When To Use

- When asked to summarize recent blog changes
- When asked to update the changelog
- At the end of a productive week of work
- When asked "what changed this week"
- When asked to review changes across all repos

## Workflow

### 0. Merge Partial Weeks (MANDATORY pre-execution step for mid-week runs)

> **⚠️ Do not skip, do not improvise.** If this step says `should_merge: true`, you MUST run `partial_week.py delete` before proceeding to Step 1 — no "I'll just add to the existing entry" shortcuts. Patch-and-add leaves the changelog lopsided (detail mismatch between old and new themes, double-mentions across sections, split-brain structure). Regenerate fresh. The skill author learned this the hard way on 2026-04-16; if you are tempted to patch instead, re-read this paragraph.

**Purpose:** keep the changelog at one entry per ISO week. Multiple mid-week runs would otherwise fragment the same week into several partial entries. Before generating new content, detect and **delete** any partial-week entry for the _current_ ISO week so Steps 1-4 regenerate it from scratch.

#### Step 0.1 — Check

Run the check subcommand. Parse the JSON.

```bash
.claude/skills/changelog/partial_week.py check
```

| JSON field value        | Action                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `"is_monday": true`     | Skip Step 0 entirely — today is the canonical weekly-rollup day. Proceed to Step 1 with default 7-day window. |
| `"should_merge": false` | No partial entry for this week (or no entries at all). Proceed to Step 1 with default 7-day window.           |
| `"should_merge": true`  | Partial entry detected. **You are required to run Step 0.2 before touching Step 1.** No exceptions.           |

The `check` output shape when `should_merge: true`:

```json
{
  "today": "2026-04-16",
  "weekday": 4,
  "is_monday": false,
  "this_monday": "2026-04-13",
  "this_sunday": "2026-04-19",
  "most_recent_entry": "2026-04-13",
  "should_merge": true,
  "start_date": "2026-04-13",
  "reason": "Entry 2026-04-13 falls within this ISO week"
}
```

Detection catches both shapes:

- **Mon-anchored partial** — entry dated 2026-04-13 (Mon), today is 2026-04-16 (Thu). Entry covers Mon–Tue only.
- **Trailing-date partial** — entry dated 2026-04-15 (Wed, from a Wed run), today is 2026-04-17 (Fri). Entry covers Mon–Wed.

#### Step 0.2 — Delete (required when Step 0.1 returns `should_merge: true`)

```bash
.claude/skills/changelog/partial_week.py delete
```

This removes both the `## Week of YYYY-MM-DD` section body _and_ its indented TOC entries in one shot. Verify the returned JSON shows `"section_removed": 1, "toc_entries_removed": 1` before continuing. Use `--dry-run` first if paranoid about the specific entry.

Set `START_DATE` to the `start_date` field from the Step 0.1 JSON (this week's Monday). That is the date Step 1 must use.

#### Step 0.3 — Commit-floor assertion for Step 2

Before running Step 2 below, if Step 0.2 ran, you must be able to answer "yes" to both: (a) does `grep -c "^## Week of $START_DATE" _d/changelog.md` return `0`? (b) is `START_DATE` set to `this_monday` from Step 0.1? If either is "no," stop and fix it — you're about to patch instead of regenerate.

**Why delete instead of merge-in-place?** Step 2 (Identify Changed Content Files) and Step 3 (Read Actual Content Diffs) regenerate everything from git history. Anything in the old partial entry will be rediscovered. Regenerating fresh is simpler and produces a coherent entry; patch-and-add produces a lopsided one (observed 2026-04-16, rebuilt same day).

Tests: `cd .claude/skills/changelog && python3 -m unittest test_partial_week` (16 cases including Mon-anchored, trailing-date, year-boundary, TOC+section deletion, dry-run).

### 1. Determine Time Range

If Step 0 set `START_DATE` from a merged partial week, use that. Otherwise default to the last 7 days, or use user-specified range:

```bash
# Get commits from last 7 days (default)
git log --since="$(date -d '7 days ago' +%Y-%m-%d)" --oneline upstream/main | wc -l

# Or specific date range
git log --since="2026-01-25" --until="2026-02-01" --oneline upstream/main

# Or from Step 0's merged-partial week start through today
git log --since="$START_DATE" --oneline upstream/main
```

### 2. Identify Changed Content Files

**Pre-flight check:** if Step 0 returned `should_merge: true`, confirm you ran Step 0.2 (`partial_week.py delete`) before running this step. `grep -c "^## Week of $START_DATE" _d/changelog.md` should return `0`. If it returns `1`, you skipped the delete — go back and do it.

Use the `changed_files.py` helper that ships alongside this skill — emits JSON, keeps the count-and-rank logic in pure-function Python (unit-tested, deterministic tie-breaking):

```bash
.claude/skills/changelog/changed_files.py --since "$START_DATE" --limit 20
```

Output shape: `[{"path": "_d/ai-journal.md", "change_count": 8}, ...]`, sorted by count descending with alphabetical tie-break. Defaults to `_d/` and `_posts/` prefixes; pass `--prefixes _d/,_posts/,_includes/` to widen. Pass `--branch main` for a local-only repo.

Tests: `cd .claude/skills/changelog && python3 -m unittest test_changed_files`.

### 3. Read Actual Content Diffs (NOT commit messages!)

**IMPORTANT**: Descriptions must be based on the ACTUAL CONTENT added, not commit messages. Commit messages are often vague or misleading.

For blog content, read the diffs to see what was actually written:

```bash
# Get the actual content diff for a file
git diff upstream/main~N..upstream/main -- _d/ai-journal.md | head -200

# For a specific commit
git show COMMIT_HASH -- _d/filename.md
```

**What to extract from diffs:**

- New section headers (what topics were added?)
- Key concepts, frameworks, or models introduced
- Specific examples or case studies
- Quotes or references to external sources
- Tables, lists, or structured content

**Example - BAD (from commit message):**

> "Add spiritual health content"

**Example - GOOD (from actual diff):**

> "Vanaprastha framework: 4-stage Hindu life model (Brahmacharya→Grihastha→Vanaprastha→Sannyasa). Three obstacles: 'None' identity trap, Santa in the Church, Tyranny of Time."

For other repos, get diff summaries:

```bash
# Get commit with file changes and patch preview
gh api "repos/idvorkin/REPO/commits/HASH" \
  --jq '{message: .commit.message, files: [.files[] | {name: .filename, patch: .patch[0:500]}]}'
```

### 4. Generate Changelog Entry

Create entry in `_d/changelog.md` with this format:

```markdown
## Week of YYYY-MM-DD

_N commits this week_

### [Theme Name]

Description of changes in this theme:

- **Item title** - Description ([blog](/permalink#section)) ([github](https://github.com/idvorkin/idvorkin.github.io/commit/SHORTHASH))
```

**Important — unique section names**: Every `###` heading must be unique across the _entire_ file, not just the current week. Duplicate headings produce duplicate Markdown TOC anchors (`#other-projects`, `#other-projects-1`, …) which are confusing and break deep links.

- For "Other Projects" sections, always append the week date: `### Other Projects (YYYY-MM-DD)` (e.g. `### Other Projects (2026-04-12)`). Never use month names like `(April)` since they repeat across weeks.
- If you use any other recurring theme name (e.g. "Infrastructure"), append the week date too if that name already appears earlier in the file: `### Infrastructure (YYYY-MM-DD)`.
- When updating the TOC, use the exact slugified anchor that matches the heading (e.g. `[Other Projects (2026-04-12)](#other-projects-2026-04-12)`).

### Deep Link Format

Always include both blog and GitHub links where applicable:

- **Blog link**: `([blog](/permalink))` or `([blog](/permalink#section-anchor))`
- **GitHub icon link**: `[<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/SHORTHASH)`

Use short commit hashes (first 9 chars) for readability. The GitHub icon (`<i class="fa fa-github"></i>`) renders as a clickable icon.

### 5. Finding Section Anchors

To find the correct section anchor for a blog post:

```bash
# Get headers from a file
grep "^#" _d/filename.md | head -20
```

Section anchors are slugified headers:

- `### My Section Title` → `#my-section-title`
- `### AI & Machine Learning` → `#ai--machine-learning`

## Example Output

**BAD - based on commit messages (vague, unhelpful):**

```markdown
- **Software Survival 3.0** - Added Steve Yegge's framework
- **Code as Costly Signal** - Discussed what code signals
```

**GOOD - based on actual content diffs (specific, informative):**

```markdown
## Week of 2026-01-25

_41 commits this week_

### AI Journal Updates

Five new entries on AI-era software development ([blog](/ai-journal#2026-01-31)):

- **Software Survival 3.0** - Yegge's survival ratio: `Survival ∝ (Savings × Usage × H) / (Awareness + Friction)`. Six levers: insight compression, substrate efficiency, broad utility, publicity, minimize friction, human coefficient. "Nobody is coming for grep." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/bdedc6f02)
- **Code as Cattle, Not Pets** - Infrastructure parallel: servers went from pets (unique hostnames) to cattle (who cares which server). Code making same shift. "The system is dead, long live the factory." [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/81b465c2c)
```

Notice how the GOOD version includes:

- Actual formulas/frameworks from the content
- Specific quotes
- Key concepts explained
- Concrete examples mentioned in the post

## Common Themes to Look For

| Theme          | Files to Check                                   | Keywords                  |
| -------------- | ------------------------------------------------ | ------------------------- |
| AI/Tech        | `ai-*.md`, `how-igor-chops.md`                   | AI, coding, CHOP          |
| Health         | `*-pain.md`, `physical-*.md`                     | pain, exercise, health    |
| Spiritual      | `spiritual-*.md`, `religion.md`, `meditation.md` | spiritual, meditation     |
| Life Planning  | `gap-year.md`, `y20*.md`, `retire.md`            | goals, planning           |
| Infrastructure | `.claude/`, `scripts/`, `_plugins/`              | fix, improve, add command |

## Update TOC

After adding a new week, regenerate the TOC with the `toc` skill — don't hand-edit:

```bash
# Rewrites TOC between <!-- vim-markdown-toc-start --> and -end --> markers
.claude/skills/toc/toc.py regenerate _d/changelog.md

# Catches duplicate ### headings that would produce broken anchors
.claude/skills/toc/toc.py validate _d/changelog.md

# One-shot slug computation for deep links you write by hand
.claude/skills/toc/toc.py slug "Some Heading Text"
```

The tool uses the same kramdown algorithm as `idvorkin/markdown-toc.nvim`'s `:Mtoc update`, so output is byte-identical whether you run the Python tool or the nvim command. Full docs at `.claude/skills/toc/SKILL.md` (also invocable as `/toc`).

## Cross-Repo Changelog

### Scan Active Repos + Their Commits (one call)

Use the `scan_repos.py` helper that ships alongside this skill — one command replaces the nested bash loop, with parallel `gh api` fetches and unit-tested active-repo classification:

```bash
# Default: both orgs (idvorkin + idvorkin-ai-tools), parallel fetches
.claude/skills/changelog/scan_repos.py --since "$START_DATE"

# Narrow orgs or widen the fetch
.claude/skills/changelog/scan_repos.py --since "$START_DATE" \
  --orgs idvorkin \
  --max-workers 16 \
  --commit-limit 20
```

Output shape (JSON, sorted by `(org, name)` for deterministic diffing):

```json
[
  {
    "org": "idvorkin",
    "name": "idvorkin.github.io",
    "pushed_at": "2026-04-16T14:42:00Z",
    "commits": [
      {
        "sha": "049000327",
        "message": "content: ...",
        "date": "2026-04-16T14:40:00Z"
      }
    ]
  }
]
```

**Why parallel matters:** the previous bash loop issued ~30-50 serial `gh api commits` calls, each round-tripping to GitHub. `scan_repos.py` fans these out across a thread pool (default 8 workers), so a typical scan drops from tens of seconds to a few.

**Safety:** a failed fetch for one repo returns `"commits": []` rather than aborting the full scan — one broken/private/archived repo can't poison a cross-repo sweep.

Tests: `cd .claude/skills/changelog && python3 -m unittest test_scan_repos`.

Don't be lazy — use GitHub deep links whenever possible: commit links, file links, section anchors.

### Scope: all public repos under both orgs

**Include every public repo under `idvorkin` and `idvorkin-ai-tools`** — do not filter to a curated list. `scan_repos.py` already enumerates everything via `gh repo list --visibility public`; the active-repo filter then drops repos with no commits in the window. The only other automatic filter is per-repo fetch failure, which skips archived/moved/rate-limited repos silently.

Common categories encountered in practice (for shape, not a whitelist):

| Example repos                         | Typical surface area                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `idvorkin.github.io`                  | Blog content, new posts                                                                |
| `chop-conventions`                    | CHOP skills, shared CLAUDE.md, conventions **— promoted to its own top-level section** |
| `Settings`                            | Dotfiles, Rust tools, tmux/shell                                                       |
| `nlp`, `tony_tesla`, `tony_assistant` | AI/NLP/voice experiments                                                               |
| `*-explainer`                         | Visualization apps with deployments                                                    |
| `idvorkin-ai-tools/*`                 | AI-written tools, forks, PR bots                                                       |

### chop-conventions is its own section, not an "Other Project"

**When `chop-conventions` has activity in the window, it gets its own `### chop-conventions (YYYY-MM-DD)` theme section at the same level as "Infrastructure & CI" — not a bullet-block under "Other Projects."** Rationale: chop-conventions is the living source of Igor's CHOP workflow — skills, shared CLAUDE.md fragments, cross-machine conventions — and its weekly activity is usually the single most important cross-repo story. Burying it under "Other Projects" next to small one-off repos systematically under-represents it. Every major section-restructure decision (2026-04-16) has landed on "chop-conventions gets its own section"; codify that here so it isn't re-argued every week.

Section layout precedence, when all are present:

1. `### [theme sections for blog content]` — AI Journal, new posts, major restructures
2. `### Infrastructure & CI (YYYY-MM-DD)` — CI, workflows, back-links, cross-links
3. `### chop-conventions (YYYY-MM-DD)` — skills, workflow hardening, shared CLAUDE.md
4. `### Other Projects (YYYY-MM-DD)` — Settings, blob, explainers, samples, one-offs

If `chop-conventions` has zero commits in the window (rare), drop the section entirely rather than leaving an empty heading.

### Cross-Repo Entry Format

**For regular repos** (link repo name to GitHub):

```markdown
**[Settings](https://github.com/idvorkin/Settings)** (dotfiles & tools)

- Added terminal tab switching command [<i class="fa fa-github"></i>](https://github.com/idvorkin/Settings/commit/HASH)
```

**For explainers/apps with deployments** (link name to deployment, icon to repo):

```markdown
**[monitor-explainer](https://monitor-explorer.surge.sh)** (visualization) [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer)

- Added comprehensive content [<i class="fa fa-github"></i>](https://github.com/idvorkin/monitor-explainer/commit/HASH)
```

### Link Patterns

| Type          | Name Links To   | GitHub Icon                              |
| ------------- | --------------- | ---------------------------------------- |
| Regular repo  | GitHub repo     | Commit link                              |
| Explainer/app | Live deployment | Repo link (header) + Commit link (items) |

### GitHub Icon Link Format

```
[<i class="fa fa-github"></i>](https://github.com/idvorkin/REPO_NAME/commit/SHORTHASH)
```

## Commit Message

When committing changelog updates:

```
Add changelog entry for week of YYYY-MM-DD

Summarizes N commits across themes:
- Theme 1: brief description
- Theme 2: brief description
- Other projects: brief description
```

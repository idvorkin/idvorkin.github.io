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

### 1. Determine Time Range

Default to the last 7 days, or use user-specified range:

```bash
# Get commits from last 7 days
git log --since="$(date -d '7 days ago' +%Y-%m-%d)" --oneline upstream/main | wc -l

# Or specific date range
git log --since="2026-01-25" --until="2026-02-01" --oneline upstream/main
```

### 2. Identify Changed Content Files

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

After adding a new week, update the TOC at the top of the changelog:

```markdown
<!-- vim-markdown-toc-start -->

- [Week of 2026-01-25](#week-of-2026-01-25)
  - [AI Journal Updates](#ai-journal-updates)
  - [Theme 2](#theme-2)
  <!-- vim-markdown-toc-end -->
```

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

| Example repos                         | Typical surface area                |
| ------------------------------------- | ----------------------------------- |
| `idvorkin.github.io`                  | Blog content, new posts             |
| `Settings`, `chop-conventions`        | Dotfiles, tooling, workflow docs    |
| `nlp`, `tony_tesla`, `tony_assistant` | AI/NLP/voice experiments            |
| `*-explainer`                         | Visualization apps with deployments |
| `idvorkin-ai-tools/*`                 | AI-written tools, forks, PR bots    |

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

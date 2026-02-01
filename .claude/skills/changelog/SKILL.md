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

Find the most-modified content files:

```bash
git log --since="$START_DATE" --name-only --pretty=format: upstream/main \
  | grep -E "^_d/|^_posts/" \
  | sort | uniq -c | sort -rn | head -20
```

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

### Deep Link Format

Always include both blog and GitHub links where applicable:

- **Blog link**: `([blog](/permalink))` or `([blog](/permalink#section-anchor))`
- **GitHub icon link**: `[<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io/commit/SHORTHASH)`

Use short commit hashes (first 9 chars) for readability. The GitHub icon (`<i class="fa fa-github"></i>`) renders as a clickable  icon.

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

| Theme | Files to Check | Keywords |
|-------|---------------|----------|
| AI/Tech | `ai-*.md`, `how-igor-chops.md` | AI, coding, CHOP |
| Health | `*-pain.md`, `physical-*.md` | pain, exercise, health |
| Spiritual | `spiritual-*.md`, `religion.md`, `meditation.md` | spiritual, meditation |
| Life Planning | `gap-year.md`, `y20*.md`, `retire.md` | goals, planning |
| Infrastructure | `.claude/`, `scripts/`, `_plugins/` | fix, improve, add command |

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

### List Active Repos

Find repos with recent activity:

```bash
gh repo list idvorkin --limit 50 --json name,pushedAt \
  --jq '.[] | select(.pushedAt > "DATE") | .name'
```

### Get Commits from All Active Repos

```bash
gh repo list idvorkin --limit 100 --json name,pushedAt \
  --jq '.[] | select(.pushedAt > "DATE") | .name' | while read repo; do
  echo "=== $repo ==="
  gh api repos/idvorkin/$repo/commits \
    --jq '.[0:10] | .[] | "\(.sha[0:9]) \(.commit.message | split("\n")[0])"' 2>/dev/null
  echo ""
done
```

### Key Repos to Track

| Repo | Purpose | What to Look For |
|------|---------|------------------|
| `idvorkin.github.io` | Blog | Content changes, new posts |
| `Settings` | Dotfiles/tools | New commands, config changes |
| `nlp` | AI/NLP tools | New models, features |
| `chop-conventions` | CHOP docs | Workflow improvements |
| `tony_tesla` | Voice AI | Tony/Vapi updates |
| `*-explainer` | Visualizations | New explainers |

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

| Type | Name Links To | GitHub Icon |
|------|---------------|-------------|
| Regular repo | GitHub repo | Commit link |
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

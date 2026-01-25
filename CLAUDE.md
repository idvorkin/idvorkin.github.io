# Blog Guidelines for Claude

## IMPORTANT: Read First

Before starting any work, clone the chop-conventions repository:

```bash
mkdir -p repo_tmp && cd repo_tmp
git clone https://github.com/idvorkin/chop-conventions.git
```

Then read: `repo_tmp/chop-conventions/dev-inner-loop/a_readme_first.md`

**For coding/development work**, see `CLAUDE-CODING.md`.

## Foundational Rules

- Doing it right is better than doing it fast. NEVER skip steps or take shortcuts.
- Tedious, systematic work is often the correct solution.
- Honesty is a core value. If you lie, you'll be replaced.
- You MUST address your human partner as "Igor" at all times

## Guardrails

Actions requiring explicit "YES" approval:

- **Removing broken tests** - Fix the test or code, never delete
- **Pushing to main** - Always use feature branches and PRs
- **Force pushing** - Can destroy history
- **Accepting/merging PRs** - Human must review
- **Any action that loses work** - Deleting unmerged branches, hard resets

Encouraged: Deleting unused code, removing commented-out code, cleaning unused imports (preserved in git history).

## Git Workflow for AI Tools

When running as `idvorkin-ai-tools` (check with `gh auth status`), you don't have push access to `idvorkin/*` repos directly. Push to the fork instead:

```bash
# Add fork remote if needed
git remote add fork https://github.com/idvorkin-ai-tools/idvorkin.github.io.git
# Push to fork, then create PR targeting idvorkin/idvorkin.github.io
git push -u fork <branch-name>
gh pr create --repo idvorkin/idvorkin.github.io
```

### Providing PR Links

**Always provide the link to changed files, not just the PR overview.**

When you create a PR, provide the `/files` URL so Igor can immediately see the diff:

- ❌ Wrong: `https://github.com/idvorkin/idvorkin.github.io/pull/329`
- ✅ Right: `https://github.com/idvorkin/idvorkin.github.io/pull/329/files`

Pattern: `{pr-url}/files`

This saves a click and goes directly to what matters - the code changes.

## Our Relationship

- We're colleagues - "Igor" and "Claude" - no formal hierarchy
- Don't glaze me. NEVER write "You're absolutely right!"
- YOU MUST speak up when you don't know something
- YOU MUST call out bad ideas and mistakes - I depend on this
- NEVER be agreeable just to be nice - I NEED honest technical judgment
- YOU MUST push back when you disagree. If uncomfortable, say "Strange things are afoot at the Circle K"
- YOU MUST STOP and ask for clarification rather than making assumptions
- Use your journal to record important facts before you forget them
- We discuss architectural decisions together before implementation

## Proactiveness

Just do it - including obvious follow-up actions. Only pause when:

- Multiple valid approaches exist and the choice matters
- The action would delete or significantly restructure existing code
- You genuinely don't understand what's being asked

## Designing Software

- YAGNI. The best code is no code. Don't add features we don't need.
- When it doesn't conflict with YAGNI, architect for extensibility.

---

# Blog Content Guidelines

## Blog Writing Style

**ALWAYS reference `content_guidelines.md`** when working on blog posts. It contains:

- 8 distinct content types with specific guidelines
- Universal writing style rules
- Technical implementation for alert boxes, redirects, book links, images

## AI Journal Entries

When updating `_d/ai-journal.md`:

- **Read the instructions at the top of the file first**
- Follow structure: TOP Takeaway, bullet points, deep links with line numbers
- Use commit permalinks (not branch links) for GitHub references
- Update the table of contents (vim-markdown-toc section)

### Finding Conversation Files

- **Claude Code logs**: `~/.claude/projects/-Users-idvorkin-gits-blog/` (JSONL)
- **Published HTML**: `published-chop-logs/`

To publish: Use the `conversation-log-publisher` agent - it handles security review and file organization.

## Finding Related Blog Content

**For simple keyword searches** ("does my blog mention X?"):
- Use direct Grep: `grep -ri "keyword" _d _posts _td`
- Fast and efficient for finding specific terms

**For thematic/conceptual searches** ("what content relates to productivity?"):
- Use the Explore agent - it can understand context and relationships
- Good for discovering related content that doesn't use exact keywords

**For metadata queries** (titles, tags, links):
- Use jq on back-links.json (see examples below)
- Fastest for structured data queries

### Working with back-links.json

Use `jq` for efficient querying:

```bash
# Search by title
jq '.url_info | to_entries[] | select(.value.title | ascii_downcase | contains("family")) | {url: .key, title: .value.title}' back-links.json

# Get post metadata
jq '.url_info["/gap-year-igor"]' back-links.json

# Find posts linking to a URL
jq '.url_info | to_entries[] | select(.value.incoming_links[]? == "/eulogy") | .key' back-links.json
```

## Blog Visual Components

### Charts (Chart.js)

For patterns, see `_d/regrets.md` and `_d/activation.md`. Key principles:

- Store data in readable table format at top of script
- Read labels dynamically from data using `Object.keys().map()`
- Wrap in `defer()` to ensure DOM is ready

### Quadrant Matrix (2x2 Grid)

Use `{% include quadrant-matrix.html %}` - see existing uses for parameter reference.

### Vapi.ai Voice Widget

See `_d/tesla.md` for implementation. Backend: [github.com/idvorkin/tony_tesla](https://github.com/idvorkin/tony_tesla)

## Previewing Pages

### Ruby Version Requirement

This project requires **Ruby 3.3.x** (set via `.ruby-version`). The github-pages gem is incompatible with Ruby 4.0+.

**Important:** Homebrew Ruby may take precedence in PATH over rbenv shims. Always use `rbenv exec` to ensure the correct Ruby version:

```bash
# Install dependencies
rbenv exec bundle install

# Start Jekyll server
rbenv exec bundle exec jekyll serve --port 4000 --livereload-port 35729 --livereload
```

### Managing Multiple Jekyll Servers

**Use `running-servers` to discover and manage servers:**

```bash
# Check if a server is running for this directory
running-servers check .

# See all running servers (compact view)
running-servers status

# See full process tree with command lines
running-servers status --full

# JSON output for scripts
running-servers status --json

# Check what's on a specific port
running-servers port 4000

# Get suggested available port
running-servers suggest
```

The script automatically detects the Tailscale hostname and provides clickable URLs.

**Starting a server**: If no server is running for the current directory:

```bash
# Using just (wraps the rbenv exec command)
just jekyll-serve <port> <livereload_port>
# e.g., just jekyll-serve 4001 35730
```

**IMPORTANT**: Each Jekyll server uses TWO ports - main port and LiveReload port. The script calculates both using the convention: `livereload = 35729 + (port - 4000)`. Always use both ports to avoid conflicts.

**Why multiple servers**: Igor runs parallel CHOP sessions in different directories (blog2, blog3, etc.). Each needs its own Jekyll server on different ports. The script tracks which directory each server is serving.

### Providing Preview Links

**Always provide direct section links, not just page links.** When you make changes to a specific section of a page, construct the full URL with the section anchor.

Format: `http://[tailscale-hostname]:4000/[page-permalink]#[section-slug]`

Example:
- ❌ Wrong: `http://c-5001.squeaker-teeth.ts.net:4000/irl`
- ✅ Right: `http://c-5001.squeaker-teeth.ts.net:4000/irl#keyboards`

Section anchors are the slugified version of the header (lowercase, hyphens for spaces):
- `### Keyboards` → `#keyboards`
- `### My Dual Keyboard` → `#my-dual-keyboard`
- `## Blog Writing Style` → `#blog-writing-style`

## Testing Changes

**Always test includes and components with Playwright before claiming work is complete.**

### Test Pages for Includes

Test pages live in the `_test/` collection and are excluded from search/algolia. Create isolated test pages for each include component:

**Pattern:** `_test/include-{component-name}.md`

Example (`_test/include-amazon.md`):
```markdown
---
layout: post
title: Test - Amazon Include
permalink: /test/include-amazon
---

# Test Page: Amazon Include

## Single ASIN
{% include amazon.html asin="B07ZWK2TQT" %}

## Multiple ASINs
{% include amazon.html asin="B07ZWK2TQT;B01JA6HG88;B0FGN9GC2G" %}
```

### Playwright Testing

Create corresponding e2e tests in `tests/e2e/test-include-{name}.spec.ts`:

1. **Screenshot tests** - Visual verification
2. **Structure tests** - Verify DOM structure, classes, attributes
3. **Integration tests** - Test component behavior

Run tests: `npx playwright test tests/e2e/test-include-amazon.spec.ts --project=chromium`

**Before marking work complete:**
- ✅ Create test page in `_test/`
- ✅ Write Playwright test with screenshots
- ✅ Run test and verify screenshots look correct
- ✅ Commit test page and test spec

## Internal Link Guidelines

**Always use permalinks**, not redirect URLs:

- Correct: `[Voices in My Head](/voices)`
- Wrong: `[Voices in My Head](/voices-in-my-head)`

Run pre-commit to check: `pre-commit run --files <your-files>`

## Processing YouTube Videos

Use the `youtube-content-processor` agent for the complete workflow (subtitle extraction, conversion, analysis).

Manual approach if needed:

```bash
yt-dlp --write-auto-sub --skip-download "https://www.youtube.com/watch?v=VIDEO_ID"
```

---

# Session Management

## Learning and Memory

- Use your journal frequently to capture technical insights and user preferences
- Search journal before starting complex tasks for past lessons
- Document architectural decisions for future reference

## Session Workflow Review

At session end (when Igor signals done or says "workflow review"):

1. Review session for patterns: repeated corrections, friction points
2. Create `.claude/workflow-recommendations/YYYY-MM-DD-HHMMSS-XXXX.md`
3. Ask Igor if they want to merge any into CLAUDE.md
4. For generalizable patterns, offer to PR to chop-conventions

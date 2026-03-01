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
# Check which remote points to the fork (idvorkin-ai-tools)
git remote -v
# It's usually `origin` — push there, then create PR targeting upstream
git push -u origin <branch-name>
gh pr create --repo idvorkin/idvorkin.github.io
```

### Providing PR Links

**Always provide the link to changed files, not just the PR overview.**

When you create a PR, provide the `/files` URL so Igor can immediately see the diff:

- ❌ Wrong: `https://github.com/idvorkin/idvorkin.github.io/pull/329`
- ✅ Right: `https://github.com/idvorkin/idvorkin.github.io/pull/329/files`

Pattern: `{pr-url}/files`

This saves a click and goes directly to what matters - the code changes.

### PR Screenshots for Content Changes

For content/visual PRs, include a rendered screenshot in the PR description. Protocol:

0. **Ensure Jekyll server is running** (screenshots will be blank/wrong without it):

   ```bash
   # Check if already running
   running-servers check .

   # If not running, start it (blocks terminal — use background or separate shell)
   just jekyll-serve 4000 35729 > /tmp/jekyll.log 2>&1 &

   # Wait for it to be ready (first build takes ~30s)
   timeout 60 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ | grep -q 200; do sleep 2; done'
   ```

   Common gotchas:
   - Server takes ~30s on first build — screenshot before it's ready = blank page
   - Port 4000 may be taken — check with `running-servers check .` first
   - Content changes need a rebuild — wait for livereload or give it a few seconds after saving

1. **Take screenshot** of the rendered page section:

   ```bash
   npx playwright screenshot --browser chromium --viewport-size "1280,900" \
     --wait-for-timeout 3000 "http://localhost:4000/{permalink}#{section}" /tmp/screenshot.png
   ```

   - `--wait-for-timeout 3000` is critical — without it pages render blank (JS needs time)
   - Verify screenshot size is >50KB; if ~5KB it's blank
   - If you need to scroll to a specific section, use a node one-liner with `scrollIntoView`

2. **Create a gist** to host the image:

   ```bash
   echo "Screenshots for PR #N" > /tmp/readme.md
   gh gist create --public -d "Screenshots for PR #N" /tmp/readme.md
   ```

3. **Clone gist, add image, push** (gist API doesn't support binary uploads):

   ```bash
   git clone https://gist.github.com/GIST_ID.git /tmp/gist-pr
   magick /tmp/screenshot.png -quality 80 /tmp/gist-pr/screenshot.jpg
   cd /tmp/gist-pr
   git remote set-url origin "https://x-access-token:$(gh auth token)@gist.github.com/GIST_ID.git"
   git add *.jpg && git commit -m "Add screenshots" && git push
   ```

4. **Reference in PR body** with absolute raw URL:
   ```markdown
   ![Section screenshot](https://gist.githubusercontent.com/USER/GIST_ID/raw/screenshot.jpg)
   ```

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

## Skills Execution

When executing skills, follow ALL phases/steps defined in the SKILL.md — do not skip phases. If a phase seems unnecessary, ask before skipping.

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

**AI Slop Label:** Posts with significant AI-generated content should include `{% include ai-slop.html percent="NN" %}` near the top, where NN is the estimated percentage of AI slop (0-100).

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

When searching for existing blog content in this repository, use Grep/Glob directly on `_d/`, `_posts/`, and `_td/` directories — not the blog MCP. Direct file search is faster and more reliable for finding text in the repo.

For querying by frontmatter metadata (tags, dates, incoming/outgoing links), use `/find-content`.

## Blog Visual Components

For charts, summary cards, matrices, and voice widgets, use `/blog-visuals`.

## Amazon Product Links

For Amazon affiliate product links, use `/amazon-asin`.

## Previewing Pages

Use `/serve` to check or start the Jekyll server. Always provide direct section links in preview URLs: `http://[hostname]:4000/[permalink]#[section-slug]`.

## Testing Changes

For testing includes and components with Playwright, use `/test-includes`.

## Internal Link Guidelines

**Always use permalinks**, not redirect URLs:

- Correct: `[Voices in My Head](/voices)`
- Wrong: `[Voices in My Head](/voices-in-my-head)`

Run pre-commit to check: `prek run --files <your-files>`

## Fetching Web Content

Use `/web-browse` for fetching web content (fallback chain and Cloudflare workarounds).

## Processing YouTube Videos

Use the `youtube-content-processor` agent for subtitle extraction, conversion, and analysis.

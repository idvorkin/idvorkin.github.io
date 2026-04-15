# Blog Guidelines for Claude

## IMPORTANT: Read First

Before starting any work, run `/up-to-date` to sync the repo with upstream. This ensures you're working on the latest code and avoids merge conflicts. When creating PRs, rebase your branch onto main so the PR can merge cleanly.

Then clone the chop-conventions repository:

```bash
mkdir -p repo_tmp && cd repo_tmp
git clone https://github.com/idvorkin/chop-conventions.git
```

Then read: `repo_tmp/chop-conventions/dev-inner-loop/a_readme_first.md`

**For coding/development work**, see `CLAUDE-CODING.md`.

## Task Tracking

Use beads (`bd` commands) for task tracking. See the Beads Integration section below for details.

## PR Workflow

Repo-mode distinctions (AI-Tools vs Human-Supervised) and the fork-push workflow live in `~/gits/chop-conventions/dev-inner-loop/repo-modes.md`. One idvorkin-ecosystem gotcha:

Running as `idvorkin-ai-tools`, you **can't `gh pr close` or `gh pr merge`** on PRs in `idvorkin/*` repos — GraphQL returns `does not have the correct permissions`. When superseding an existing PR, add a supersede comment referencing the replacement and ask Igor to close it manually.

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
   # Check specifically for Jekyll on :4000 — without --port/--process,
   # any stray server in the dir (serena MCP, a stale node, etc.) gives a
   # false-positive ✓ and you'll screenshot nothing. See settings@e847a5d.
   running-servers check . --port 4000 --process jekyll

   # If not running (exit 1), start it (blocks terminal — use background or separate shell)
   just jekyll-serve 4000 35729 > /tmp/jekyll.log 2>&1 &

   # Wait for it to be ready (first build takes ~30s)
   timeout 60 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ | grep -q 200; do sleep 2; done'
   ```

   Common gotchas:
   - Server takes ~30s on first build — screenshot before it's ready = blank page
   - Port 4000 may be taken — always use `--port 4000 --process jekyll` so serena MCP or other stray dir-servers don't trigger a false ✓
   - Content changes need a rebuild — wait for livereload or give it a few seconds after saving
   - **`jekyll serve --incremental --livereload` serves fresh HTML over HTTP but does NOT write `_site/*.html` to disk.** `prek`'s anchor checker and lychee read disk, so they'll flag phantom broken anchors right after you edit a heading. Fix: `bundle exec jekyll build --incremental` (the live server can stay up), then re-run the hook.
   - **Pre-commit hook escape hatch.** The `anchor-checker` hook has `pass_filenames: false` in `.pre-commit-config.yaml` — it scans every markdown file in `_d/`, `_posts/`, `_td/` regardless of what's staged. Pre-existing broken anchors elsewhere in the repo block unrelated commits. When `bundle exec jekyll build --incremental` can't refresh `_site/` (env issue, stale worktree, etc.), commit with `SKIP=anchor-checker git commit ...` — NOT `--no-verify`, which silently skips every hook.

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

---

# Blog Content Guidelines

## Content Skills — Use These First

**Before working on any blog content, invoke the appropriate skill.** Skills load full guidelines, set up branches, and enforce correct workflows. Skipping them leads to mistakes (wrong ai-slop placement, missing cross-links, AI voice tells that will be rejected).

**Before editing any file in `_d/`, `_td/`, or `_posts/`** — prose, includes, or frontmatter — stop and load `content_guidelines.md` (via `/content`, `/ai-content`, or directly). Two classes of silent failure: AI voice patterns in unguided prose (§ Avoiding AI Writing Patterns), and includes like `blob_image_float_right`/`ai-slop` placed above the opening paragraph, which breaks Jekyll excerpts for indexes, RSS, and social cards (§ Opening Paragraphs). Cost of skipping: rework on review, or silently broken excerpts in production.

| Task                      | Skill                             | What it does                                                         |
| ------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| General blog content      | `/content`                        | Loads `content_guidelines.md`, ensures feature branch, starts server |
| AI-related posts          | `/ai-content`                     | Full context of related AI posts + content guidelines                |
| Spiritual/emotional posts | `/spiritual-content`              | Full context of related spiritual posts + content guidelines         |
| AI feed curation          | `/ai-feed`                        | Triage links or debrief on reading                                   |
| Find related posts        | `/find-content`                   | Search by keyword, theme, or frontmatter metadata                    |
| Charts, cards, matrices   | `/blog-visuals`                   | Visual components for blog posts                                     |
| Amazon product links      | `/amazon-asin`                    | Affiliate links with cached metadata                                 |
| Preview pages             | `/serve`                          | Start/check Jekyll server, get Tailscale URL                         |
| Test components           | `/test-includes`                  | Playwright tests for includes and components                         |
| Fetch web content         | `/web-browse`                     | Fallback chain: Lightpanda, Playwright CLI, WebFetch                 |
| Process YouTube videos    | `youtube-content-processor` agent | Subtitle extraction, conversion, analysis                            |

## AI Slop Label

Posts with significant AI-generated content need an ai-slop label. **Place it after the first paragraph** — putting it before or inside the first paragraph breaks page previews/excerpts.

```markdown
Your compelling first paragraph that serves as the excerpt...

{% include ai-slop.html percent="NN" %}

Rest of post content...
```

## Internal Link Guidelines

**Always use permalinks**, not redirect URLs:

- Correct: `[Voices in My Head](/voices)`
- Wrong: `[Voices in My Head](/voices-in-my-head)`

Run pre-commit to check: `prek run --files <your-files>`

## Finding Related Blog Content

Use Grep/Glob directly on `_d/`, `_posts/`, and `_td/` directories for text search — faster than the blog MCP. For frontmatter metadata queries (tags, dates, incoming/outgoing links), use `/find-content`.

### Before Creating a New Post

Search `_d/`, `_td/`, and `_posts/` for the topic first. Technical content that fits an existing post's scope (e.g., `/how-igor-chops` for dev environment, `/ai-cockpit` for agent orchestration, `/mosh` for remote access) belongs there as a brief mention — one bullet or one paragraph — not a new standalone reference. Create a new post only when the topic has no existing home.

## Generating Tables of Contents

Blog posts use a TOC block between HTML fence markers. Igor's convention comes from `idvorkin/markdown-toc.nvim` (installed in his nvim config):

```markdown
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->
```

**Important:** Do NOT use the `vim-markdown-toc GFM` / `vim-markdown-toc` markers (from the unrelated `mzlogin/vim-markdown-toc` plugin) — Igor's setup won't update those, and there is no Jekyll-side hook that regenerates TOCs. The only working path is the `-start` / `-end` markers.

**To generate or refresh the TOC**, run this from the repo root (works headlessly, doesn't disturb Igor's live nvim session as long as you clean the swap file first):

```bash
rm -f ~/.local/state/nvim/swap/%home%developer%gits%blog4%_d%FILENAME.md.swp
nvim --headless -n _d/FILENAME.md -c 'Mtoc update' -c 'w' -c 'qa'
```

The `:Mtoc update` subcommand (from `idvorkin/markdown-toc.nvim`) finds the fenced block, deletes whatever is between the markers, and regenerates the full TOC from the current headings. Anchors use kramdown-compatible slugs (lowercase, punctuation stripped, spaces → hyphens, em-dashes preserved as double hyphens).

Other subcommands if needed: `:Mtoc insert` (create a new fenced block at cursor), `:Mtoc remove` (strip the TOC entirely).

## AI Journal Entries

When updating `_d/ai-journal.md`:

- **Read the instructions at the top of the file first**
- Follow structure: TOP Takeaway, bullet points, deep links with line numbers
- Use commit permalinks (not branch links) for GitHub references
- Update the table of contents (vim-markdown-toc section)

### Finding Conversation Files

- **Claude Code logs**: `~/.claude/projects/-Users-idvorkin-gits-blog/` (JSONL)
- **Published HTML**: `published-chop-logs/`

To publish: Use the `conversation-log-publisher` agent — it handles security review and file organization.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->

## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->

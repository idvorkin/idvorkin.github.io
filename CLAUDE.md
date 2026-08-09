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

## First commit in a fresh worktree

The `anchor-checker` pre-commit hook reads `_site/*.html` to validate markdown anchors. A freshly cloned worktree has no `_site/` and the hook fails with `Error: _site not found. Run 'jekyll build' first.` Run once before your first commit:

```bash
bundle exec jekyll build --incremental
```

- **Background jekyll build on worktree creation**: after `git worktree add <path>`, cd in and run `just worktree-init`. Fires `bundle exec jekyll build` in the background (log: `/tmp/jekyll-worktree-<branch>.log`). By the time you're ready to commit, `_site/` is populated and the `anchor-checker` pre-commit hook resolves anchors correctly — no need for `SKIP=anchor-checker` unless there are genuinely-broken anchors in source.

Same fix applies if you edit a heading mid-session and the live `jekyll serve` hasn't written it to disk yet — see the screenshot section below.

- **Committing `_d/*.md` mid-session:** rebuild `_site` first (`bundle exec jekyll build`) so `anchor-checker` doesn't false-fail on posts merged to `upstream/main` since your last build, then commit with `SKIP=update-backlinks-last-modified,prettier` — the last-modified hook rewrites `back-links.json` (notably on date rollover) and the commit-time prettier hook trips a stash-rollback even on clean files, both silently aborting the commit.

## PR Workflow

Repo-mode distinctions (AI-Tools vs Human-Supervised) and the fork-push workflow live in `~/gits/chop-conventions/dev-inner-loop/repo-modes.md`.

- **Branch off `upstream/main`, not `origin/main`.** The fork (`origin`) lags — PRs merge to `upstream`, and `origin/main` only catches up on the `/up-to-date` fork-sync. Off a stale `origin/main` the PR errors "No commits between". Use `git fetch upstream && git checkout -b <branch> upstream/main`.

### Rebuild backlinks before opening a new-post PR

If your edit **adds, renames, or removes a `_d/*.md` permalink**, OR adds/removes cross-links to other posts, run `just update-backlinks` (or `just back-links`) BEFORE opening the PR. Commit the regenerated `back-links.json` in the same PR.

Why it matters: the inbound "Mentioned in:" section on every linked post reads from `back-links.json`. New post + no rebuild = the linked posts on main don't know they're linked from the new one until the next manual rebuild. Igor caught this on PR #594 (gas-city-home) the first time, after the merge — required a follow-up PR (#597) to land the rebuilt index.

**Skip this step** for body-only edits to existing posts that don't change links. The rebuild is a no-op cost otherwise.

#### Ruby version requirement (local backlinks rebuild)

`build_back_links.py build` reads from `_site/` (built HTML), so a fresh Jekyll build must succeed first. **A bare `bundle exec jekyll build` CRASHES on Ruby 4.x** — verified 2026-06. liquid is exact-pinned to `4.0.3` by the `github-pages` gem, and `liquid-4.0.3/lib/liquid/variable.rb:124` is `return unless obj.tainted?` with **no** `respond_to?` guard (read the gem source — an earlier version of this note claimed the line was guarded; it is not). Ruby 4 removed `tainted?`, so the build dies with `undefined method 'tainted?'` rendering `_layouts/post.html`.

The working fix is the `_ruby_compat.rb` shim, which patches the removed methods back. **Every `just` build recipe already exports `RUBYOPT="-r$(pwd)/_ruby_compat.rb"`**, so `just`-based builds (`just jekyll-serve`, `just back-links`, …) work on Ruby 4 — which is exactly why the crash is easy to miss: it only surfaces when you bypass `just`. To build by hand on Ruby 4, load the shim yourself:

```bash
RUBYOPT="-r$(pwd)/_ruby_compat.rb" bundle exec jekyll build
```

You **cannot** `bundle update` to a patched liquid: `github-pages` exact-pins `liquid (= 4.0.3)` and `jekyll (= 3.9.0)` to mirror GitHub Pages' native build (which is how this site deploys — there is no custom site-build workflow). The only ways off the shim are pinning an older local Ruby that still has `tainted?` (`brew install ruby@3.1`), or migrating off `github-pages` to plain `jekyll 4` / `liquid 5` — a deploy-stack change, not a quick bump. A **stale or missing `_site/`** is a separate failure mode — it makes the backlinks rebuild emit stale entries even when the build itself succeeds.

When superseding a PR you opened on `idvorkin/*`, **close it yourself** — `gh pr close <N> --repo idvorkin/<repo> --comment "Superseded by #M — …"` works for the `idvorkin-ai-tools` actor on PRs it authored. Don't leave orphan PRs for Igor to clean up.

`gh pr merge` is a different story: branch protection / required reviews on `idvorkin/*` still block self-merge, which is correct and intentional — Igor approves the merge. Ask, don't try.

This rule was previously recorded as "you can't `gh pr close` on idvorkin/\*" — that claim was tested against live PRs in 2026-04-16 and is false. Close works. If you inherit the old claim from stale memory, verify before relaying it.

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
   - **`just jekyll-serve` drifts to a free port** (`:4001`, `:4002`, …) when another repo's Jekyll holds `:4000`, and prints `🔨 serving … on :PORT`. Screenshot the port it actually bound, not a hardcoded `4000` — find it via `running-servers status --json` (the entry whose `directory` is this repo). A second `just jekyll-serve` in the same dir fails fast with "already running here". (Requires `running-servers >= 0.2.0`.)
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

## Distill, Don't Accrete

When adding content to an existing post, first think about how to distill and integrate — not append. Before writing new paragraphs, ask:

- Can overlapping prose already in the post be replaced with a tighter version of both?
- Can an existing paragraph absorb this idea?
- Does this really want a new section, or a single sharpened sentence?

Long-and-loose is the default drift. Short-and-tight is the move. A post that grows should mostly grow sharper, not fatter. Every addition earns its place.

## Internal Link Guidelines

**Always use permalinks**, not redirect URLs:

- Correct: `[Voices in My Head](/voices)`
- Wrong: `[Voices in My Head](/voices-in-my-head)`

Run pre-commit to check: `prek run --files <your-files>`

## Working Notes for Blog Posts

Drop scratch files (planning docs, content backups) in **`<repo-root>/tmp/`** — gitignored (`tmp/` rule in `.gitignore`) and `prek` honors gitignore, so the anchor-checker skips them. Avoid putting scratch files in `_d/`: a backup with a matching `permalink:` silently collides on Jekyll build, and untracked markdown with broken anchors blocks commits.

## Finding Related Blog Content

Use Grep/Glob directly on `_d/`, `_posts/`, and `_td/` directories for text search — faster than the blog MCP. For frontmatter metadata queries (tags, dates, incoming/outgoing links), use `/find-content`.

**Topic/semantic queries** ("what posts do I have on X", "related posts", "which posts should cross-link") are answered by the **topics index** — `topics.json` (per-post summary, tags, entities, semantic related-posts, and cross-link gap candidates). How it was built and how to regenerate it (the tagging Workflow + Gemini embeddings) is documented in **[`docs/topics-index.md`](docs/topics-index.md)**.

### Before Creating a New Post

Search `_d/`, `_td/`, and `_posts/` for the topic first. Technical content that fits an existing post's scope (e.g., `/how-igor-chops` for dev environment, `/ai-cockpit` for agent orchestration, `/mosh` for remote access) belongs there as a brief mention — one bullet or one paragraph — not a new standalone reference. Create a new post only when the topic has no existing home.

### Standalone explainer site vs blog post

**Standalone site** (new repo under `idvorkin-ai-tools`, `.nojekyll`, GitHub Pages — see `~/gits/dolt-explainer`, `~/gits/monitor-explainer`, `~/gits/chroma-key-explainer`): reproducible comparisons, interactive widgets, embedded harness scripts, side-by-side evidence matrices.

**Blog post** (`_d/*.md`): narrative, conceptual content, curated pointers, personal reflection.

If a draft wants to embed a runnable `harness.sh` or a results matrix regenerated from scripts, pivot to a site repo before writing prose. Link to it from `_d/explainers.md`.

## Generating Tables of Contents

Blog posts use a TOC block between HTML fence markers. Igor's convention comes from `idvorkin/markdown-toc.nvim` (installed in his nvim config):

```markdown
<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->
```

**Important:** Do NOT use the `vim-markdown-toc GFM` / `vim-markdown-toc` markers (from the unrelated `mzlogin/vim-markdown-toc` plugin) — Igor's setup won't update those, and there is no Jekyll-side hook that regenerates TOCs. The only working path is the `-start` / `-end` markers.

**Any `_d/*.md` edit → regen the TOC via `.claude/skills/toc/toc.py` BEFORE commit.** Default levels are 2..3; use `--max 4` for journal-style posts with `#### Entry Title` subsections (ai-journal, life-journal). Never leave `:Mtoc update` as a task for the human — the skill is headless and byte-identical to the nvim plugin.

```bash
# Default (levels 2..3) — most posts
.claude/skills/toc/toc.py regenerate _d/FILENAME.md

# Journal-style posts with #### entry subsections
.claude/skills/toc/toc.py regenerate _d/life-journal.md --max 4
```

**Fallback (nvim headless)** — only if `toc.py` is unavailable; works but requires clearing the swap file first so it doesn't fight Igor's live nvim session:

```bash
rm -f ~/.local/state/nvim/swap/%home%developer%gits%blog4%_d%FILENAME.md.swp
nvim --headless -n _d/FILENAME.md -c 'Mtoc update' -c 'w' -c 'qa'
```

Both paths emit identical output — kramdown-compatible slugs (lowercase, punctuation stripped, spaces → hyphens, em-dashes preserved as double hyphens). Other `:Mtoc` subcommands if needed: `:Mtoc insert` (create a new fenced block at cursor), `:Mtoc remove` (strip the TOC entirely).

## Claude-Facing Instructions in Blog Posts

**Instructions for Claude inside a blog post go in HTML comments, not visible H2 sections.** Pattern: `<!-- INSTRUCTIONS FOR CLAUDE — ... -->` placed between the frontmatter and the first visible section. Jekyll renders nothing; agents parsing the markdown source still find them. **Never leave an `## Instructions for Claude` visible heading in a published post** — it ships to the public page.

```markdown
---
layout: post
title: My Post
---

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- Rule 1 about how to edit this file
- Rule 2 about cross-linking
-->

First visible paragraph that becomes the excerpt...
```

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

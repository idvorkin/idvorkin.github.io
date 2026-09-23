# City-Agent Runbook

**Who this is for:** an agent dispatched into `larry-blog` by the Gas City mayor
(`gc`), or any agent that did not inherit Larry's session context. `AGENTS.md`
and `CLAUDE.md` tell you how to _write_ for this blog. This file tells you how to
_operate_ in it: get a workspace, build it, preview it, and land a PR without
breaking anything.

Read this before your first command. Everything below was run once, top to
bottom, from a fresh Treehouse worktree.

## 1. The shape of the repo

- Public Jekyll site, deployed by GitHub Pages **from `main`**. Anything you
  merge is live on idvork.in.
- `origin` = `idvorkin-ai-tools/blog7` (Igor's fork — you push here).
- `upstream` = `idvorkin/idvorkin.github.io` (canonical — your PR targets here).
- **Never push to `main`/`master`. Never `git push --force`. Never `gh pr merge`
  — Igor owns every merge**, and branch protection on `idvorkin/*` enforces it.
- Issue tracking is `bd` (beads), in this repo's own store. See §6.

## 2. Get a workspace (never work in `~/gits/larry-blog`)

The primary checkout is Igor's live editing tree — it usually has a branch
checked out and uncommitted work in it. Take a pooled worktree instead:

```bash
cd ~/gits/larry-blog
TREEHOUSE_LEASE_HOLDER=<your-bead-id> treehouse get --lease --json
```

`--lease` is the non-interactive acquire: it prints the worktree path to stdout
(banners go to stderr) and reserves it so no other agent and no `treehouse prune`
can take it. Release it only after review, with
`treehouse return <path>` — not `git worktree remove`, which strands the pool
entry.

Then branch **off `upstream/main`**, not `origin/main` — the fork lags behind
and a PR off a stale `origin/main` fails with "No commits between":

```bash
cd <worktree-path>
git fetch upstream
git checkout -b <branch> upstream/main
```

## 3. Warm the worktree before your first commit

The `anchor-checker` pre-commit hook reads `_site/*.html` **and**
`back-links.json`. A fresh worktree has neither (`back-links.json` is gitignored
and CI-generated), so your first commit hard-fails with `_site not found` or
`back-links.json not found`. Warm it:

```bash
just worktree-init
```

**Known trap (bead `blog-5yu`):** on Linux this recipe exits 127 with
`disown: not found` — `just` runs it under `sh`/dash, which has no `disown`. The
failure is _partial_: the jekyll + backlinks background job is already fired and
completes normally (log: `/tmp/jekyll-worktree-<branch>.log`), but the recipe
dies before `npm ci`, so `node_modules/` is never installed. Every commit
needs it — the `test` hook is `always_run` and calls `just fast-test` (Vitest),
prose included — so finish the job yourself:

```bash
npm ci
```

Then wait for the log to stop growing (~60–90 s). If the background job did not
run at all, do it by hand:

```bash
bundle install
npm ci
RUBYOPT="-r$(pwd)/_ruby_compat.rb" bundle exec jekyll build
uv run ./build_back_links.py build
```

The `RUBYOPT` shim is not optional on Ruby 4 — a bare `bundle exec jekyll build`
dies in liquid 4.0.3 on `tainted?`. Every `just` recipe exports it for you, which
is exactly why hand-run builds are the ones that crash.

## 4. Preview, and the preview link rule

```bash
just jekyll-serve 4000 35729 > /tmp/jekyll.log 2>&1 &
timeout 90 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ | grep -q 200; do sleep 2; done'
```

The tailnet already proxies `:8445 → 127.0.0.1:4000`, so the running preview is
reachable from Igor's phone at `https://<this-host>.<tailnet>:8445/<permalink>`.
Get the real host from `tailscale serve status` — do not hardcode it from this
file.

Two rules, both non-negotiable:

- **Every PR link you hand Igor comes with a live preview link.** A PR URL alone
  is an incomplete deliverable.
- **The tailnet hostname never appears in the public PR body.** It goes in your
  report/chat message to Igor only. PR bodies get a screenshot instead (protocol
  in `CLAUDE.md` → "PR Screenshots for Content Changes").

If another checkout already holds `:4000`, `just jekyll-serve` drifts to `:4001`,
`:4002`… and prints the port it bound. The probe above then checks the wrong
server and `:8445` shows the other checkout. Pick a free port explicitly and
wire it yourself:

```bash
PORT=4003                       # any free port; check with: ss -tln | grep ":$PORT "
just jekyll-serve $PORT $((PORT + 31730)) > /tmp/jekyll-$PORT.log 2>&1 &
timeout 90 bash -c "until curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ | grep -q 200; do sleep 2; done"
tailscale serve --bg --https=$((PORT + 4445)) http://127.0.0.1:$PORT   # 4003 → :8448
```

Hand Igor the `:$((PORT + 4445))` URL, and turn it off when the PR lands
(`tailscale serve --https=<port> off`).

## 5. Commit, hooks, and the things that silently eat commits

Hooks run via `prek`. Check your files before committing:

```bash
prek run --files <paths>
```

- `anchor-checker` has `pass_filenames: false` — it scans **all** markdown in
  `_d/`, `_td/`, `_posts/`, so someone else's broken anchor can block your
  commit. Escape hatch is `SKIP=anchor-checker git commit …`. **Never
  `--no-verify`** — that skips every hook, including the ones protecting Igor.
- Editing `_d/*.md` mid-session? Rebuild `_site` first
  (`bundle exec jekyll build --incremental`) — `jekyll serve` serves fresh HTML
  without writing it to disk, and the hook reads disk.
- The prettier hook can stash-rollback and abort a commit even on clean files;
  `SKIP=prettier` when that happens.
- **A commit can silently no-op** when a hook reformats staged files: the commit
  aborts, and a push run separately afterwards (a later step, or chained with
  `;`) still pushes the old tip. `&& git push` is safe — the failed commit stops
  it. After every `git commit`, look for the `[branch sha] message` confirmation
  line. No line = no commit.
- **Never `git add back-links.json`.** It is gitignored, CI-generated, and was
  historically the single biggest source of conflicts between content PRs.

## 6. Beads live here, and they are not the city's

This repo has its **own** bd store: database `blog`, prefix `blog-`, served by
its own local Dolt server on `127.0.0.1:33262` over
`.beads/dolt/`. The Gas City rig points at that endpoint
(`gc rig set-endpoint larry-blog --self --port 33262`) and `city.toml` pins
`prefix = "blog"` so the city cannot rename this repo's beads.

- Work you are dispatched to do is a bead **in this store** — `bd show <id>`,
  `bd update <id> --claim`, `bd close <id>`. Comment on the bead; do not reach
  back into another repo's tracker.
- `bd list -n 0` — always pass `-n 0`; bd truncates silently.
- **If `bd list` prints "No issues found", STOP.** This store has real beads. A
  clean-looking empty result means bd is pointed at the wrong database. Do not
  run `bd init`, `bd init --force`, or anything `--discard-remote`: that is how
  this store nearly got overwritten on 2026-09-22. Start the server instead:
  `bd -C ~/gits/larry-blog dolt start` (idempotent, pidfile-guarded).
- Beads here are local-only — there is no Dolt remote, so ignore any boilerplate
  telling you to `bd dolt push`.

## 7. Editorial rules a dispatched agent gets wrong

- **Load the content skill before touching `_d/`, `_td/`, `_posts/`** —
  `/content`, `/ai-content`, or `/spiritual-content`. They carry the voice rules
  and the include-placement rules; unguided prose reads as AI slop and gets
  rejected.
- **Distill, don't accrete.** Adding to an existing post means making it
  _sharper_, not longer. Ask whether an existing paragraph can absorb the idea
  before you write a new section.
- Internal links use **permalinks**, never redirect URLs.
- `{% include ai-slop.html percent="NN" %}` goes **after** the first paragraph —
  above it, the excerpt breaks for indexes, RSS and social cards.
- Any `_d/*.md` edit → regenerate the TOC before commit:
  `.claude/skills/toc/toc.py regenerate _d/<file>.md` (`--max 4` for
  journal-style posts).
- Instructions meant for agents go in `<!-- HTML comments -->`, never a visible
  `## Instructions for Claude` heading — that ships to the public page.

## 8. What never goes public

This is a public site and you may be holding private context. None of the
following belongs in a commit, a PR body, an issue, or a rendered page:

- Igor's career plans, performance reviews, or employer-internal detail.
- Anything from journals, therapy-adjacent reflection, calls, or health and
  family specifics — including as the _premise_ of a Den/Gutter cartoon.
- Tailnet hostnames, internal ports, absolute `/home/developer/...` paths, API
  keys, or anything from `~/gits/igor2`.
- Raw conversation logs. Publishing those goes through the
  `conversation-log-publisher` agent, which does the security review.

When unsure, leave it out and say so in your report. Ask Igor; do not guess in
public.

## 9. Landing it

```bash
git push -u origin <branch>
gh pr create --repo idvorkin/idvorkin.github.io --base main --head idvorkin-ai-tools:<branch> \
  --title "<title>" --body "<body>"
```

- The PR targets the **canonical** repo (`idvorkin/idvorkin.github.io`) from the
  fork's branch. `gh` is authenticated as `idvorkin-ai-tools`.
- Hand Igor the **`/files`** URL (`<pr-url>/files`), plus the tailnet preview
  link, plus the bead id.
- Before pushing a follow-up commit, check the PR is still open:
  `gh pr list --head <branch> --state all --json state`. Pushing to a merged
  PR's branch succeeds and orphans the commit.
- If your PR is superseded, close it yourself:
  `gh pr close <N> --repo idvorkin/idvorkin.github.io --comment "Superseded by #M"`.
- Then `treehouse return <worktree-path>` — only after review, and only if
  nothing is unlanded.

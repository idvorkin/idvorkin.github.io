# Private Claude CI Transcripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop leaking Claude execution transcripts from the Weekly Changelog GitHub Actions workflow through the public `idvorkin/idvorkin.github.io` Actions tab. Full transcripts land in a private repo (`idvorkin/claude-run-logs-private`); the public Actions tab sees only a terse default log + a non-sensitive metrics summary.

**Architecture:** Four surgical edits to `.github/workflows/changelog.yml` — remove `show_full_output: true`, delete the `Upload Claude transcript` step, insert a new `Archive Claude transcript to private repo` step that pushes the runner's `/home/runner/work/_temp/claude-execution-output.json` to a private repo via a fine-grained PAT and `git -c http.extraHeader`, and extend the existing `Summarize Claude run` step with one metrics row reflecting archive status. Warn-and-continue on archival failure (`continue-on-error: true`) so the primary output — the weekly changelog PR — always ships.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action@v1`, bash, `git`, fine-grained Personal Access Tokens, GHA secret masking via `::add-mask::`.

**Spec reference:** `docs/superpowers/specs/2026-04-13-private-claude-transcripts-design.md` (hardened via 3 architect review passes, changelog at `docs/superpowers/specs/2026-04-13-private-claude-transcripts-design-changelog.md`). The YAML snippets in this plan are copied **verbatim** from the spec — do not re-derive them.

---

## Prerequisites (human-only, already complete)

These are NOT tasks — they were completed by Igor before this plan was written. Confirm they exist before starting:

- **Private repo:** `idvorkin/claude-run-logs-private` (private, `main` branch with an initial README commit).
- **PAT + secret:** `CLAUDE_RUN_LOGS_PUSH_TOKEN` stored in `idvorkin/idvorkin.github.io` secrets, scoped to Contents: Read/Write on `idvorkin/claude-run-logs-private` only.

To confirm:

```bash
gh secret list --repo idvorkin/idvorkin.github.io | grep CLAUDE_RUN_LOGS_PUSH_TOKEN
```

If the secret is missing, **stop** — tasks 5–8 depend on it.

## File Structure

This plan touches exactly one file:

- **Modify:** `.github/workflows/changelog.yml` — four coordinated edits across ~60 lines

No new files, no test files. Workflow YAML has no unit-test harness in this repo; verification runs through `actionlint`, then the failure-path and success-path dry runs on the `idvorkin-ai-tools/idvorkin.github.io` fork, then one upstream manual dispatch post-merge. The fork's remote is `origin` in this checkout; `upstream` points at `idvorkin/idvorkin.github.io`.

## Branch Context

You should already be on `ci/private-claude-transcripts`, branched off `ci/changelog-observability` (the branch for open PR #479 which this PR will stack on). Verify with:

```bash
git branch --show-current
# Expected: ci/private-claude-transcripts
git log --oneline -3
# Expected: 23b6932b3 docs(ci): design spec + architect review for private Claude transcripts
#           48a440a8e content: fix broken anchors in week 2026-04-12 changelog
#           8082565f1 Merge remote-tracking branch 'upstream/main' into ci/changelog-observability
```

If you are NOT on this branch, stop and ask the user — the plan assumes the spec + architect review commits from 2026-04-13 are the current tip.

## Tooling Prerequisite

`actionlint` is required for Task 5. Check if it's installed:

```bash
which actionlint
```

If missing, install it once before starting:

```bash
# Option A — Homebrew (macOS/Linux with brew):
brew install actionlint

# Option B — Go (requires Go toolchain):
go install github.com/rhysd/actionlint/cmd/actionlint@latest

# Option C — Prebuilt binary (no package manager):
curl -fsSL https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash
# Puts actionlint in the current directory; move to ~/.local/bin or similar
```

Do not proceed past Task 4 without a working `actionlint` binary.

---

## Task 1: Remove `show_full_output: true` from the `Generate Changelog` step

**Rationale:** This is the largest single privacy win in the design — the inline tool-call stream stops being readable from the public Actions tab, reverting to the claude-code-action's terse "full output hidden for security" default.

**Files:**

- Modify: `.github/workflows/changelog.yml:57-60`

- [ ] **Step 1.1: Read the current Generate Changelog step to confirm the line is still at the expected location**

```bash
sed -n '53,65p' .github/workflows/changelog.yml
```

Expected: lines 57–60 show the three-line comment block followed by `show_full_output: true` on line 60.

- [ ] **Step 1.2: Remove the `show_full_output: true` line and its three comment lines**

Delete exactly these four lines from `.github/workflows/changelog.yml`:

```yaml
# Unhide Claude's tool calls and intermediate messages in the job log.
# Default is false, which shows only a terse result summary — making it
# impossible to tell what Claude did or why permission denials happened.
show_full_output: true
```

The `claude_code_oauth_token:` line that follows should now sit immediately under the `with:` block's opening.

- [ ] **Step 1.3: Visually verify the result**

```bash
sed -n '53,62p' .github/workflows/changelog.yml
```

Expected: the `Generate Changelog` step's `with:` block now has `claude_code_oauth_token:` as its first entry, with no `show_full_output` line above it.

- [ ] **Step 1.4: Commit the removal**

```bash
git add .github/workflows/changelog.yml
git commit -m "$(cat <<'EOF'
ci(changelog): remove show_full_output so public tool-call stream hides

Reverts the observability affordance from PR #479 for privacy reasons.
With show_full_output: true, every tool call and intermediate message
rendered inline in the public Actions step log — any visitor expanding
the Generate Changelog step could read every gh api call, git log
output, and Claude reasoning step.

Next commits restore observability by pushing the transcript to a
private repo instead of leaking it publicly.
EOF
)"
```

---

## Task 2: Delete the `Upload Claude transcript` step entirely

**Rationale:** PR #479's artifact upload publishes `claude-execution-output.json` as a 30-day public download. Deleting the step keeps the file on the runner's disk (still read by `Summarize Claude run`) but stops it from being published.

**Files:**

- Modify: `.github/workflows/changelog.yml:119-126`

- [ ] **Step 2.1: Read the current Upload Claude transcript step to confirm it is still at the expected location**

```bash
sed -n '119,128p' .github/workflows/changelog.yml
```

Expected: lines 119–126 contain the `- name: Upload Claude transcript` step, using `actions/upload-artifact@v4`, with `retention-days: 30`. Line 128 is the start of the next step (`Summarize Claude run`).

- [ ] **Step 2.2: Delete the entire 8-line step block**

Remove exactly these lines:

```yaml
- name: Upload Claude transcript
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: claude-execution-output
    path: /home/runner/work/_temp/claude-execution-output.json
    retention-days: 30
    if-no-files-found: warn
```

(Also remove the blank line that separates it from `Summarize Claude run`.)

- [ ] **Step 2.3: Visually verify the result**

```bash
sed -n '115,125p' .github/workflows/changelog.yml
```

Expected: the end of the `Generate Changelog` prompt block is immediately followed by `- name: Summarize Claude run`. No `Upload Claude transcript` step anywhere in the file. Confirm with:

```bash
grep -n "Upload Claude transcript" .github/workflows/changelog.yml
```

Expected: no output (exit code 1).

- [ ] **Step 2.4: Commit the deletion**

```bash
git add .github/workflows/changelog.yml
git commit -m "$(cat <<'EOF'
ci(changelog): remove public transcript artifact upload

PR #479 uploaded claude-execution-output.json as a 30-day artifact on
every run. Because idvorkin.github.io is a public repo, anyone could
download the full transcript for a month after each run. Deleting the
upload step keeps the file on the runner's disk during the job
(Summarize Claude run still reads it from /home/runner/work/_temp/)
but stops it from being published.

Next commit adds a replacement archival step that pushes the same
file to a private repo instead.
EOF
)"
```

---

## Task 3: Insert the new `Archive Claude transcript to private repo` step

**Rationale:** This is the substantive new step. It reads `claude-execution-output.json` from the runner, opens an HTTP-header-authenticated clone of `idvorkin/claude-run-logs-private`, commits the transcript under a timestamped filename, and pushes. Warn-and-continue via `continue-on-error: true` so a push failure still lets the changelog PR get created. See spec section 2 for the architectural rationale of every `# comment` in the snippet — they are load-bearing; do not trim them.

**Files:**

- Modify: `.github/workflows/changelog.yml` — insert a new step between what was `Generate Changelog` (now ending at the old line ~117) and `Summarize Claude run`.

- [ ] **Step 3.1: Verify the insertion point**

After Task 2, the file should have `Generate Changelog` immediately followed by `Summarize Claude run`. Confirm:

```bash
grep -n '^      - name:' .github/workflows/changelog.yml
```

Expected output includes (line numbers approximate after Tasks 1–2):

```
...
36:      - name: Generate Changelog
119:      - name: Summarize Claude run
128:      - name: Verify changelog was updated
144:      - name: Create Pull Request
```

The new step will be inserted between `Generate Changelog` and `Summarize Claude run`.

- [ ] **Step 3.2: Insert the archive step**

Add this YAML block immediately before the `- name: Summarize Claude run` line. **Indent with 6 spaces (two levels of 3-space indentation under `jobs.changelog.steps:` — match the indentation of the surrounding steps exactly).** Copy this block **verbatim from the spec**; the comments are load-bearing design documentation:

```yaml
- name: Archive Claude transcript to private repo
  if: always()
  id: archive
  continue-on-error: true
  env:
    LOGS_TOKEN: ${{ secrets.CLAUDE_RUN_LOGS_PUSH_TOKEN }}
    RUN_ID: ${{ github.run_id }}
    RUN_ATTEMPT: ${{ github.run_attempt }}
    RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}/attempts/${{ github.run_attempt }}
  run: |
    set -euo pipefail
    TRANSCRIPT=/home/runner/work/_temp/claude-execution-output.json
    if [ ! -f "$TRANSCRIPT" ]; then
      echo "archive_status=no_transcript" >> "$GITHUB_OUTPUT"
      exit 0
    fi
    if [ -z "${LOGS_TOKEN:-}" ]; then
      # Fast-fail before we ever construct a tokenless clone URL. `set -u`
      # does NOT catch this because env: bindings always exist (just empty),
      # and an empty token would otherwise produce a confusing 401 on clone.
      echo "archive_status=no_token" >> "$GITHUB_OUTPUT"
      echo "::error::CLAUDE_RUN_LOGS_PUSH_TOKEN secret is unset on this repo/fork"
      exit 1
    fi
    TS=$(date -u +%Y-%m-%dT%H-%M-%SZ)
    # RUN_ATTEMPT distinguishes "Re-run failed jobs" invocations, which reuse
    # github.run_id. Without it, a re-run would collide with the first attempt's
    # filename — git would still commit (transcripts differ in timing fields)
    # but the filename would be misleading.
    FNAME="transcripts/${TS}-changelog-run-${RUN_ID}-attempt-${RUN_ATTEMPT}.json"
    WORK=/tmp/claude-run-logs-private
    # Pass the token via an Authorization header on the git invocation rather
    # than embedding it in the clone URL. Two reasons:
    #   1. A URL like https://x-access-token:TOKEN@github.com/... ends up in
    #      the cloned repo's .git/config, where any later step on this runner
    #      could read it.
    #   2. More importantly, the URL form puts the token in the `git clone`
    #      argv, which means any process running as the runner user during
    #      the clone window can read it from /proc/<pid>/cmdline. The header
    #      form is passed via `git -c http.extraHeader=...`, which still goes
    #      through argv on this single invocation but never touches .git/config
    #      and is not embedded in the persistent remote URL used by later
    #      `git push` calls. The push therefore needs the same `-c` flag.
    # GHA's secret masking redacts the raw token from public log lines, but
    # the base64 transformation below is NOT automatically masked — the bytes
    # are different from the raw secret, so GHA's content-based masker won't
    # recognize them. Anyone running `set -x` in this step (or a future git
    # version that echoed `-c` values on error) would then leak the base64,
    # which trivially decodes back to `x-access-token:<TOKEN>`. Mitigate by
    # explicitly registering the base64 form as a mask via the workflow
    # command. `::add-mask::` itself is NOT printed verbatim — GHA processes
    # it and replaces with `***` in subsequent log output. `printf` is a bash
    # builtin, so the raw token never appears in any subprocess argv during
    # the pipe to `base64`.
    B64=$(printf 'x-access-token:%s' "$LOGS_TOKEN" | base64 -w0)
    echo "::add-mask::$B64"
    AUTH_HEADER="Authorization: Basic $B64"
    git -c http.extraHeader="$AUTH_HEADER" \
        clone --depth 1 \
        https://github.com/idvorkin/claude-run-logs-private.git \
        "$WORK"
    mkdir -p "$WORK/transcripts"
    cp "$TRANSCRIPT" "$WORK/$FNAME"
    cd "$WORK"
    git add "$FNAME"
    git -c user.name="github-actions[bot]" \
        -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
        commit \
        -m "ci(changelog): archive transcript for run ${RUN_ID} attempt ${RUN_ATTEMPT}" \
        -m "Source run: ${RUN_URL}"
    # Single push, no retry. The changelog workflow's `concurrency:
    # weekly-changelog` group with `cancel-in-progress: false` already
    # serializes every writer to this repo today (changelog.yml is the only
    # workflow that pushes here, per Non-goals). If a future workflow adopts
    # this archive pattern, the right fix is to share a single concurrency
    # group across both workflows — not to add per-workflow retry-loop band-
    # aids. A non-fast-forward today would be a real bug, not a race to paper
    # over, and `continue-on-error: true` already turns a single bad push into
    # a warn-and-continue rather than a workflow failure.
    git -c http.extraHeader="$AUTH_HEADER" push origin HEAD:main
    echo "archive_status=ok" >> "$GITHUB_OUTPUT"
    echo "archive_path=${FNAME}" >> "$GITHUB_OUTPUT"
```

- [ ] **Step 3.3: Verify the file is syntactically valid YAML**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/changelog.yml'))" && echo OK
```

Expected: `OK`. Any error prints a YAML parser message pointing at the bad line — most commonly an indentation mistake in the inserted block.

- [ ] **Step 3.4: Verify step ordering is correct**

```bash
grep -n '^      - name:' .github/workflows/changelog.yml
```

Expected output (approximate line numbers will differ):

```
      - uses: actions/checkout@v6
      - name: Compute week-of date
      - name: Snapshot changelog before generation
      - name: Generate Changelog
      - name: Archive Claude transcript to private repo
      - name: Summarize Claude run
      - name: Verify changelog was updated
      - name: Create Pull Request
```

`Archive Claude transcript to private repo` must appear exactly between `Generate Changelog` and `Summarize Claude run`.

- [ ] **Step 3.5: Commit the new step**

```bash
git add .github/workflows/changelog.yml
git commit -m "$(cat <<'EOF'
ci(changelog): archive transcripts to private repo instead of public artifact

New Archive Claude transcript to private repo step, inserted between
Generate Changelog and Summarize Claude run. Pushes the runner's
/home/runner/work/_temp/claude-execution-output.json to a timestamped
file in idvorkin/claude-run-logs-private via a fine-grained PAT stored
as CLAUDE_RUN_LOGS_PUSH_TOKEN.

Key design decisions (see
docs/superpowers/specs/2026-04-13-private-claude-transcripts-design.md
section 2 for full rationale):

- Token via git -c http.extraHeader="Authorization: Basic <b64>", not
  URL embedding — keeps the PAT out of .git/config AND out of
  /proc/<pid>/cmdline where a co-tenant process could read it.
- Base64 value registered as a mask via ::add-mask:: before first use,
  because GHA's content-based masker does NOT automatically redact
  transformed secret bytes.
- continue-on-error: true + if: always() — warn-and-continue so a push
  failure never blocks the changelog PR from shipping.
- No transcript → exit 0 with archive_status=no_transcript (not an
  error); no token → exit 1 with archive_status=no_token (surfaces as
  a bolded row in Summarize Claude run's table).
- Filename includes RUN_ATTEMPT to distinguish "Re-run failed jobs"
  invocations from the original run (github.run_id is reused).
- Single push, no retry — see Non-goals and the "concurrent push race"
  risk in the spec.

Summarize Claude run is extended in the next commit to read this
step's outputs and render an archive-status row in the job summary.
EOF
)"
```

---

## Task 4: Extend the `Summarize Claude run` step to render the archive status row

**Rationale:** The archive step exposes `archive_status` and `archive_path` step outputs plus the standard `outcome`. The summary step needs to surface this as one extra row in its existing metrics table so that an at-a-glance look at the Actions tab catches archival failures (`**archive failed**`), unset-secret dry runs (`**archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset**`), missing transcripts (`no transcript produced`), and healthy runs (``archived `transcripts/...`  ``). Bolding the failure cases makes them visually distinct.

**Files:**

- Modify: `.github/workflows/changelog.yml` — add three `env:` bindings to `Summarize Claude run` and append a new `case` block + `echo` after its existing `} >> "$GITHUB_STEP_SUMMARY"` line.

- [ ] **Step 4.1: Read the current Summarize Claude run step**

```bash
awk '/^      - name: Summarize Claude run$/,/^      - name: Verify/' .github/workflows/changelog.yml
```

Expected: the step starts with `- name: Summarize Claude run`, has `if: always()`, a `run: |` block whose closing `} >> "$GITHUB_STEP_SUMMARY"` is the last non-blank line, and the next `- name: Verify changelog was updated` step follows.

- [ ] **Step 4.2: Add the three `env:` bindings**

Between the existing `if: always()` line and the `run: |` line of `Summarize Claude run`, insert this three-line `env:` block so the step reads:

```yaml
- name: Summarize Claude run
  if: always()
  env:
    ARCHIVE_OUTCOME: ${{ steps.archive.outcome }}
    ARCHIVE_STATUS: ${{ steps.archive.outputs.archive_status }}
    ARCHIVE_PATH: ${{ steps.archive.outputs.archive_path }}
  run: |
    F=/home/runner/work/_temp/claude-execution-output.json
    ...
```

Use the same 8-space indentation as existing `if:` / `run:` siblings on this step.

- [ ] **Step 4.3: Append the archive-row rendering block**

The existing `run:` script ends with a block like:

```bash
          {
            echo "## Claude run summary"
            echo ""
            echo "| Metric | Value |"
            echo "|---|---|"
            echo "| Duration | ${DUR_S}s |"
            echo "| Turns | ${TURNS} |"
            echo "| Cost | \$${COST} |"
            echo "| Permission denials | ${DENIALS} |"
            echo "| Success | $([ "$IS_ERROR" = "false" ] && echo yes || echo no) |"
          } >> "$GITHUB_STEP_SUMMARY"
```

Immediately after that closing `} >> "$GITHUB_STEP_SUMMARY"` line (still inside the `run:` block, at the same 10-space indentation as the existing `F=` assignment), append this new block — copied **verbatim from spec section 3**:

```bash
          case "${ARCHIVE_OUTCOME:-}" in
            success)
              case "${ARCHIVE_STATUS:-}" in
                ok)            AR="archived \`${ARCHIVE_PATH}\`" ;;
                no_transcript) AR="no transcript produced" ;;
                *)             AR="unknown (status=${ARCHIVE_STATUS:-empty})" ;;
              esac ;;
            failure)
              case "${ARCHIVE_STATUS:-}" in
                no_token) AR="**archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset**" ;;
                *)        AR="**archive failed — see step log**" ;;
              esac ;;
            skipped) AR="skipped" ;;
            *)       AR="(outcome=${ARCHIVE_OUTCOME:-empty})" ;;
          esac
          echo "| Transcript archive | ${AR} |" >> "$GITHUB_STEP_SUMMARY"
```

This block must land BEFORE the two earlier `exit 0` branches (the `No Claude transcript at $F` early-exit and the `Could not parse transcript` fallback). Those early exits return without rendering the archive row, which is correct — if the summary step can't parse the transcript, the archive row would be misleading ("archived" despite the metrics table being absent). Leave those early exits untouched; only append the archive-row block at the end of the main happy-path.

- [ ] **Step 4.4: Verify the file is syntactically valid YAML**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/changelog.yml'))" && echo OK
```

Expected: `OK`.

- [ ] **Step 4.5: Sanity-check the env bindings and case block exist**

```bash
grep -c "ARCHIVE_OUTCOME: \${{ steps.archive.outcome }}" .github/workflows/changelog.yml
grep -c "Transcript archive" .github/workflows/changelog.yml
grep -c "no_token) AR=" .github/workflows/changelog.yml
```

Expected: each command prints `1`.

- [ ] **Step 4.6: Commit**

```bash
git add .github/workflows/changelog.yml
git commit -m "$(cat <<'EOF'
ci(changelog): render archive status row in job summary

Extends Summarize Claude run with three env: bindings (archive outcome,
archive_status, archive_path) and one new case block that appends a
"Transcript archive" row to the metrics table. Branches:

- success + ok            → archived `<path>`
- success + no_transcript → no transcript produced (not a failure)
- failure + no_token      → **archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset** (bolded)
- failure + *             → **archive failed — see step log** (bolded)
- skipped                 → skipped
- other                   → (outcome=<value>)

The bolded failure rows are how the warn-and-continue behavior stays
visible: a push failure doesn't fail the job, but the next glance at
the Actions tab catches the problem.

See spec section 3 for why each branch exists and why cancelled is
not its own branch (concurrency: cancel-in-progress: false rules out
concurrency cancellation; manual cancel falls through the catch-all).
EOF
)"
```

---

## Task 5: Run `actionlint` (verification gate 1)

**Rationale:** Structural sanity check before burning a dry-run on the fork. `actionlint` catches most workflow-level bugs (typos in `${{ ... }}` expressions, invalid action inputs, bad step references, shellcheck-on-run-blocks) that `python -c yaml.safe_load` doesn't.

**Files:**

- No file changes — this is a read-only verification.

- [ ] **Step 5.1: Run actionlint on the modified file**

```bash
actionlint .github/workflows/changelog.yml
```

Expected: no output, exit code 0.

- [ ] **Step 5.2: If actionlint reports errors, fix them and loop**

Common issues and their fixes:

- **"step ID 'archive' is not defined"** in the summary step's `steps.archive.*` references — means Task 3's step has a typo in `id: archive` or the step is somehow not above the summary step. Re-verify Task 3.
- **"property \"archive_status\" is not defined in object type"** — `actionlint` doesn't know about dynamically-set `steps.<id>.outputs.<key>` values from `echo "key=value" >> "$GITHUB_OUTPUT"`; this warning is a false positive. Document and ignore.
- **shellcheck SC2086 / SC2155** in the archive step's `run:` block — minor quoting warnings. Address only if blocking.
- **"unexpected key 'env' under step"** — wrong indentation on the added `env:` block from Task 4 Step 4.2. Re-indent to match the other step-level keys.

- [ ] **Step 5.3: No commit** — actionlint produced no file changes, this gate is read-only.

---

## Task 6: Verification gate 2 — fork dry-run without the secret (failure path)

**Rationale:** First real test. Exercises the `no_token` fast-fail path end-to-end on an actual GHA runner, proving: (a) the public step log is terse, (b) no artifact uploads, (c) the summary row renders the bolded `no_token` message, (d) warn-and-continue actually continues and the changelog PR is created. Before this task, the `idvorkin-ai-tools/idvorkin.github.io` fork must NOT have `CLAUDE_RUN_LOGS_PUSH_TOKEN` set — if it does, this task tests the success path instead (which is Task 7, not what we want here).

**Files:**

- No file changes.

- [ ] **Step 6.1: Confirm the fork does NOT have `CLAUDE_RUN_LOGS_PUSH_TOKEN` set**

```bash
gh secret list --repo idvorkin-ai-tools/idvorkin.github.io | grep -c CLAUDE_RUN_LOGS_PUSH_TOKEN || echo "not set"
```

Expected: `not set`. If the secret IS set on the fork from earlier testing, delete it first:

```bash
gh secret delete CLAUDE_RUN_LOGS_PUSH_TOKEN --repo idvorkin-ai-tools/idvorkin.github.io
```

- [ ] **Step 6.2: Push the branch to the fork (`origin`)**

```bash
git push -u origin ci/private-claude-transcripts
```

Expected: branch pushed, tracking set.

- [ ] **Step 6.3: Dispatch the Weekly Changelog workflow on the fork against this branch**

```bash
gh workflow run "Weekly Changelog" \
  --repo idvorkin-ai-tools/idvorkin.github.io \
  --ref ci/private-claude-transcripts
```

Expected: no output, exit code 0. Then find the run:

```bash
sleep 5
gh run list --workflow="Weekly Changelog" --repo idvorkin-ai-tools/idvorkin.github.io --branch ci/private-claude-transcripts --limit 1
```

Note the run ID from the output for the next step.

- [ ] **Step 6.4: Wait for the run to complete and check its status**

```bash
# Replace <RUN_ID> with the actual run ID from step 6.3
gh run watch <RUN_ID> --repo idvorkin-ai-tools/idvorkin.github.io --exit-status
```

Expected behavior — the run should complete with **success** (not failure) because `continue-on-error: true` on the archive step means the archive failure doesn't fail the overall job. If the job is marked failed, re-verify Task 3's `continue-on-error: true` line.

- [ ] **Step 6.5: Verify the failure-path assertions**

Open the run's job summary in the browser:

```bash
gh run view <RUN_ID> --repo idvorkin-ai-tools/idvorkin.github.io --web
```

Manually confirm:

1. **Public step log is terse.** Expand the `Generate Changelog` step. Its body should show only the claude-code-action's default result summary (something like "full output hidden for security" + a short result JSON), NOT a stream of individual tool calls.
2. **No artifact uploaded.** The `Artifacts` section of the run page should be empty (or missing entirely). No `claude-execution-output` download link.
3. **Archive step is red (but the job is green).** The `Archive Claude transcript to private repo` step should show a red X indicator, and its log should contain `::error::CLAUDE_RUN_LOGS_PUSH_TOKEN secret is unset on this repo/fork`.
4. **Summary row renders the `no_token` message.** Scroll to the job summary at the top of the run page. The metrics table should include this exact row:

   `| Transcript archive | **archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset** |`

   The text must be bolded.

5. **Changelog PR was still created on the fork.** Check:

   ```bash
   gh pr list --repo idvorkin-ai-tools/idvorkin.github.io --head "changelog/week-of-$(date -u +%Y-%m-%d)" --state open
   ```

   Expected: exactly one PR listed.

- [ ] **Step 6.6: If any assertion failed, stop and diagnose**

Do NOT proceed to Task 7 until all five assertions pass. A failure here usually means:

- Assertion 1 failed (tool-call stream still visible) → Task 1 didn't fully remove `show_full_output: true`. Re-verify.
- Assertion 2 failed (artifact still uploaded) → Task 2 didn't fully remove the `Upload Claude transcript` step. Re-verify.
- Assertion 3 failed (archive step is green or the job is red) → check `continue-on-error: true` and the `if [ -z "${LOGS_TOKEN:-}" ]` branch in Task 3's step.
- Assertion 4 failed (wrong row text) → Task 4's case block for `failure` / `no_token` has a typo; compare to spec section 3.
- Assertion 5 failed (no PR) → the job is actually failing before the PR-create step, which means `continue-on-error: true` isn't working. This is a blocker — re-verify Task 3.

- [ ] **Step 6.7: Clean up the fork PR created during the dry-run**

```bash
# List the PR number, then close+delete
FORK_PR=$(gh pr list --repo idvorkin-ai-tools/idvorkin.github.io --head "changelog/week-of-$(date -u +%Y-%m-%d)" --state open --json number --jq '.[0].number')
gh pr close "$FORK_PR" --repo idvorkin-ai-tools/idvorkin.github.io --delete-branch
```

Expected: PR closed, branch deleted. (The PR was only created to prove warn-and-continue worked; it's disposable.)

- [ ] **Step 6.8: No commit** — gate 6 validates existing commits; nothing to commit.

---

## Task 7: Verification gate 3 — fork dry-run with the secret (success path)

**Rationale:** The plan's biggest tradeoff is here. Success-path validation requires the fork to actually push to the private repo, which means either sharing Igor's production PAT (tiny blast-radius expansion: valid on fork-originated pushes for the duration of this gate) or creating a fork-only PAT (more setup, smaller risk surface). If adding the secret to the fork is impractical for any reason, **gate 3 can be folded into gate 4** — but that means gate 4 becomes the first place the success path is ever exercised, which is a real gap that should be explicit in the PR description.

**Files:**

- No file changes.

- [ ] **Step 7.1: Decide between "add production PAT to fork" vs "create fork-only PAT"**

**Option A (faster):** Copy Igor's `CLAUDE_RUN_LOGS_PUSH_TOKEN` value from the upstream repo into the fork's secrets. Requires interactive `gh secret set` (the value is never readable from `gh secret list`). This briefly broadens the PAT's blast radius to two repos but is simpler.

**Option B (safer):** Generate a second fine-grained PAT on Igor's account scoped to the same `idvorkin/claude-run-logs-private` repo with the same Contents: Read/Write permissions. Store it ONLY in the fork. Revoke after this task.

**Option C (skip):** If neither option is feasible right now, skip to Task 8 and document in the PR description that gate 3 was not exercised pre-merge, with gate 4 serving as the first success-path proof. Add a follow-up note to Task 9 (PR) to call this out explicitly.

Proceed with whichever option Igor approves. The rest of Task 7 assumes Option A or B was chosen.

- [ ] **Step 7.2: Set the secret on the fork**

```bash
gh secret set CLAUDE_RUN_LOGS_PUSH_TOKEN --repo idvorkin-ai-tools/idvorkin.github.io
# Prompts for the PAT value; paste and press Enter
```

Verify:

```bash
gh secret list --repo idvorkin-ai-tools/idvorkin.github.io | grep CLAUDE_RUN_LOGS_PUSH_TOKEN
```

Expected: one line with the secret name and an "Updated" timestamp.

- [ ] **Step 7.3: Re-dispatch the workflow**

```bash
gh workflow run "Weekly Changelog" \
  --repo idvorkin-ai-tools/idvorkin.github.io \
  --ref ci/private-claude-transcripts

sleep 5
gh run list --workflow="Weekly Changelog" --repo idvorkin-ai-tools/idvorkin.github.io --branch ci/private-claude-transcripts --limit 1
```

Note the new run ID.

- [ ] **Step 7.4: Wait for completion**

```bash
gh run watch <NEW_RUN_ID> --repo idvorkin-ai-tools/idvorkin.github.io --exit-status
```

Expected: success.

- [ ] **Step 7.5: Verify the success-path assertions**

```bash
gh run view <NEW_RUN_ID> --repo idvorkin-ai-tools/idvorkin.github.io --web
```

Manually confirm:

1. **Archive step is green.** The `Archive Claude transcript to private repo` step shows a green checkmark.
2. **Summary row shows `archived`.** The metrics table includes (not bolded):

   ``| Transcript archive | archived `transcripts/<ts>-changelog-run-<id>-attempt-<n>.json` |``

   Note the backticks around the path.

3. **Transcript landed in the private repo.** Clone (or browse via `gh repo view`) `idvorkin/claude-run-logs-private` and confirm a new commit is on `main`:

   ```bash
   gh api repos/idvorkin/claude-run-logs-private/commits?per_page=1 --jq '.[0] | {sha, message: .commit.message, author: .commit.author.name}'
   ```

   Expected: a commit with message starting `ci(changelog): archive transcript for run <id> attempt <n>` and author `github-actions[bot]`.

4. **File is valid JSON.** Fetch it and parse:

   ```bash
   # Replace <path> with the exact archive_path from the summary row
   gh api "repos/idvorkin/claude-run-logs-private/contents/<path>" --jq '.content' | base64 -d | python3 -c "import json, sys; json.load(sys.stdin); print('valid JSON')"
   ```

   Expected: `valid JSON`.

- [ ] **Step 7.6: If any assertion failed, stop and diagnose**

Common issues:

- Assertion 2 wrong format → Task 4's summary update has a rendering bug.
- Assertion 3 no commit → the push failed despite the secret being set. Check the step log for the actual `git push` error; may indicate the PAT's scope is wrong (needs Contents: Read/Write on `idvorkin/claude-run-logs-private` specifically).
- Assertion 4 invalid JSON → Claude somehow wrote a non-JSON transcript; this is an upstream claude-code-action issue, not a plan bug. Surface to Igor.

- [ ] **Step 7.7: Revoke the fork's secret (if Option A) or the fork-only PAT (if Option B)**

```bash
gh secret delete CLAUDE_RUN_LOGS_PUSH_TOKEN --repo idvorkin-ai-tools/idvorkin.github.io
```

And if Option B, also revoke the fork-only PAT via the GitHub web UI (Settings → Developer settings → Personal access tokens → Fine-grained tokens → find the fork-only one → Revoke).

Expected: secret list on the fork no longer shows the token name.

- [ ] **Step 7.8: Clean up the fork PR from this run**

```bash
FORK_PR=$(gh pr list --repo idvorkin-ai-tools/idvorkin.github.io --head "changelog/week-of-$(date -u +%Y-%m-%d)" --state open --json number --jq '.[0].number')
gh pr close "$FORK_PR" --repo idvorkin-ai-tools/idvorkin.github.io --delete-branch
```

- [ ] **Step 7.9: (Optional) Clean up the test transcript from the private repo**

The dry-run just pushed a real transcript to the private repo. It's harmless but pollutes the archive. Remove it if desired:

```bash
# Clone the private repo, delete the test file, commit, push
git clone https://github.com/idvorkin/claude-run-logs-private.git /tmp/private-cleanup
cd /tmp/private-cleanup
git rm transcripts/<ts>-changelog-run-<fork-run-id>-attempt-*.json
git commit -m "chore: remove pre-merge dry-run test transcript"
git push
cd -
rm -rf /tmp/private-cleanup
```

Alternatively, leave it as the first entry in the archive's history — useful for proving end-to-end that pre-merge verification happened.

- [ ] **Step 7.10: No commit** — gate 7 validates existing commits; nothing to commit.

---

## Task 8: Open PR stacked on PR #479

**Rationale:** The workflow edits remove and replace pieces PR #479 added, so the cleanest diff is stacked on `ci/changelog-observability`. If PR #479 merges first, rebase this branch and retarget via `gh pr edit --base main`. If PR #479 stays hard-blocked for >1 week, fold its content into this branch off `main` per the spec's branch note.

**Files:**

- No file changes.

- [ ] **Step 8.1: Confirm branch is clean and pushed**

```bash
git status
git log --oneline origin/ci/private-claude-transcripts..HEAD 2>/dev/null || echo "no unpushed commits"
```

Expected: working tree clean, no unpushed commits on the fork. (If there are unpushed commits from the verification tasks, that's fine; just push them: `git push`.)

- [ ] **Step 8.2: Confirm PR #479 is still open**

```bash
gh pr view 479 --repo idvorkin/idvorkin.github.io --json state,mergedAt,mergeStateStatus
```

- **If `state=OPEN`**: proceed with a stacked PR (base = `ci/changelog-observability`).
- **If `state=MERGED`**: rebase this branch onto `upstream/main` and open the PR with base = `main`:

  ```bash
  git fetch upstream
  git rebase upstream/main
  git push --force-with-lease origin ci/private-claude-transcripts
  # Use --base main in the gh pr create command below
  ```

- **If `state=CLOSED`** (not merged): stop and ask Igor — something unusual happened with #479.

- [ ] **Step 8.3: Open the PR**

```bash
gh pr create \
  --repo idvorkin/idvorkin.github.io \
  --base ci/changelog-observability \
  --head idvorkin-ai-tools:ci/private-claude-transcripts \
  --title "ci(changelog): privatize Claude execution transcripts" \
  --body "$(cat <<'EOF'
## Summary

Privatizes the Claude execution transcripts from the Weekly Changelog workflow. Because `idvorkin/idvorkin.github.io` is a public repo, the observability affordances from #479 (`show_full_output: true`, `Upload Claude transcript` artifact) leaked every tool call, every `gh api` output, and every Claude reasoning step to anyone viewing the Actions tab. This PR stops the leak while preserving the at-a-glance "is the automation healthy" signal.

Stacks on #479 — it removes pieces #479 added. If #479 merges first, will retarget base to `main`.

### What changes

- **Remove** `show_full_output: true` from `Generate Changelog` → public step log reverts to the claude-code-action's terse default
- **Remove** the `Upload Claude transcript` step → no more 30-day public artifact
- **Insert** a new `Archive Claude transcript to private repo` step → pushes `claude-execution-output.json` to `idvorkin/claude-run-logs-private` via a fine-grained PAT (`CLAUDE_RUN_LOGS_PUSH_TOKEN`)
- **Extend** `Summarize Claude run` → adds one metrics row showing archive status (bolded `**archive failed**` if the push breaks)

### Design doc + architect review

`docs/superpowers/specs/2026-04-13-private-claude-transcripts-design.md` is the hardened spec (3 architect review passes, 8 → 11 → 1 substantive changes — changelog at `docs/superpowers/specs/2026-04-13-private-claude-transcripts-design-changelog.md`). Key decisions the architect review locked in:

- **Token via `git -c http.extraHeader="Authorization: Basic <b64>"`** instead of URL embedding, which would have leaked the PAT via `/proc/<pid>/cmdline` for the duration of the clone
- **`::add-mask::` on the base64-encoded auth header** because GHA's content-based secret masker does NOT automatically redact transformed secret bytes
- **`continue-on-error: true` + bolded summary row for failures** — warn-and-continue so the changelog PR always ships, but failures are visually distinct in the job summary
- **No retry, no per-step race handling** — `concurrency: weekly-changelog` already serializes writers to the private repo; retries would paper over real bugs

### Verification

- [x] actionlint clean (verification gate 1)
- [x] Dry-run on `idvorkin-ai-tools/idvorkin.github.io` fork without secret (gate 2) — bolded `no_token` row rendered, changelog PR still created
- [x] Dry-run on fork with secret (gate 3) — transcript landed in `idvorkin/claude-run-logs-private`, summary row rendered `archived <path>`
- [ ] Upstream manual dispatch after merge (gate 4)
- [ ] Natural Monday-2pm-UTC scheduled run (passive observation, not a gate)

### Prerequisites already in place

- `idvorkin/claude-run-logs-private` (private, owner: `idvorkin`)
- `CLAUDE_RUN_LOGS_PUSH_TOKEN` secret in `idvorkin/idvorkin.github.io`

### Rollback

Single revert PR. Reverting restores `show_full_output: true` and the public artifact upload — re-leaks transcripts but unblocks the workflow. Acceptable as an emergency measure for one week; immediately re-roll forward.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed.

- [ ] **Step 8.4: Verify the PR has the expected files-only diff**

```bash
# Replace <PR_NUM> with the returned PR number
gh pr view <PR_NUM> --repo idvorkin/idvorkin.github.io --json files --jq '.files[].path'
```

Expected output:

```
.github/workflows/changelog.yml
docs/superpowers/plans/2026-04-13-private-claude-transcripts.md
docs/superpowers/specs/2026-04-13-private-claude-transcripts-design-changelog.md
docs/superpowers/specs/2026-04-13-private-claude-transcripts-design.md
_d/changelog.md
back-links.json
```

(The last two come from the pre-requisite anchor-fix commit `48a440a8e`.)

- [ ] **Step 8.5: Print the /files URL for Igor**

Per `CLAUDE.md`'s PR link conventions:

```bash
echo "https://github.com/idvorkin/idvorkin.github.io/pull/<PR_NUM>/files"
```

Provide this URL to Igor so he can jump straight to the diff.

- [ ] **Step 8.6: No commit** — PR creation doesn't change the local tree.

---

## Task 9: Verification gate 4 — upstream manual dispatch (POST-MERGE)

**Rationale:** Final proof that the workflow works on the canonical `idvorkin/idvorkin.github.io` repo with the real secret. Only runs after the PR is merged. If it fails, the rollback path from the spec applies: single revert PR to restore the public observability until a fix lands.

**Files:**

- No file changes.

- [ ] **Step 9.1: Confirm the PR is merged**

```bash
gh pr view <PR_NUM> --repo idvorkin/idvorkin.github.io --json state,mergedAt
```

Expected: `state: MERGED`.

- [ ] **Step 9.2: Dispatch the workflow on upstream main**

```bash
gh workflow run "Weekly Changelog" \
  --repo idvorkin/idvorkin.github.io \
  --ref main
```

- [ ] **Step 9.3: Wait for the run and verify**

```bash
sleep 5
gh run list --workflow="Weekly Changelog" --repo idvorkin/idvorkin.github.io --branch main --limit 1
# Note the run ID
gh run watch <UPSTREAM_RUN_ID> --repo idvorkin/idvorkin.github.io --exit-status
gh run view <UPSTREAM_RUN_ID> --repo idvorkin/idvorkin.github.io --web
```

Manually confirm the same assertions as Task 7 Step 7.5 (success path):

1. Archive step green.
2. Summary row renders `` archived `transcripts/...-changelog-run-<id>-attempt-<n>.json` ``.
3. Transcript commit lands in `idvorkin/claude-run-logs-private`.
4. File parses as valid JSON.
5. A new changelog PR opens on `idvorkin/idvorkin.github.io` (if any content changed this week — if not, the `Verify changelog was updated` gate will fail the job intentionally, which is pre-existing behavior from PR #478 and not a bug in this PR).

- [ ] **Step 9.4: If assertion 5 fails because "changelog unchanged"**

This is the existing behavior from a prior PR — not a regression. Move on; the archive still ran regardless.

- [ ] **Step 9.5: If any other assertion fails, roll back**

```bash
# Create a revert PR
gh pr create --repo idvorkin/idvorkin.github.io \
  --base main \
  --head idvorkin-ai-tools:revert-private-claude-transcripts \
  --title "Revert: ci(changelog): privatize Claude execution transcripts" \
  --body "Reverting #<PR_NUM> due to post-merge failure on gate 4. See <LINK_TO_FAILED_RUN>."
```

Then push a branch that reverts the merge commit and open the revert PR from it.

- [ ] **Step 9.6: No commit.**

---

## Notes for future maintenance

- The Monday-2pm-UTC scheduled run is **not** a gate — it's passive observation. If gate 4 (Task 9) passes, the schedule is essentially guaranteed to work the same way.
- If a future workflow (`claude.yml`, `claude-code-review.yml`) adopts the same archive pattern, the correct fix for concurrent-push safety is to put ALL archive-pushing workflows in a shared concurrency group named after the _target_ private repo (e.g., `concurrency: claude-run-logs-archive`) — NOT to add per-step retry loops. See spec section "Risks" → "Concurrent push race."
- If the private repo grows unbounded (e.g., because the archive rate jumps from 52/year to thousands/year), add a retention job that prunes transcripts older than N months. Not needed until then.
- The base64 `::add-mask::` approach is the standard pattern from `actions/checkout`'s own auth helper. If GHA ever adds automatic masking for transformations of masked secrets, this line becomes optional. Until then, it's load-bearing.

# Design: Privatize Claude Execution Transcripts from CI

**Date:** 2026-04-13
**Branch:** `ci/private-claude-transcripts`, stacked on `ci/changelog-observability` (PR #479 is open and blocked at time of writing — base this branch off #479 so the diff cleanly shows the `show_full_output` / `Upload Claude transcript` removals; once #479 merges, rebase this branch onto main or retarget via `gh pr edit --base main`). If #479 stays hard-blocked for more than a week, fold its content into this PR off `main` and supersede it; the workflow edits are the same either way.

**Files touched:** `.github/workflows/changelog.yml` only
**External prerequisites (human-only):**

- `idvorkin/claude-run-logs-private` — new private repo (already created by Igor)
- `CLAUDE_RUN_LOGS_PUSH_TOKEN` — fine-grained PAT stored as secret in `idvorkin/idvorkin.github.io` (already created by Igor)

## Goal

Make the Weekly Changelog workflow's Claude execution transcripts no longer publicly readable through the `idvorkin/idvorkin.github.io` Actions tab, while preserving enough public signal for anyone (including Igor glancing at the Actions tab) to see whether the automation is healthy. Full transcripts land in a private repo where only Igor can read them.

## Scope Context

PR #479 added three new public exposures to `.github/workflows/changelog.yml` for observability:

1. `show_full_output: true` on the `Generate Changelog` step — the claude-code-action's full tool-call stream renders inline in the job log, visible to anyone expanding that step.
2. `Upload Claude transcript` step — the raw `claude-execution-output.json` gets published as a 30-day downloadable artifact.
3. `Summarize Claude run` step — a metrics table (duration / turns / cost / permission denials / success) lands in `GITHUB_STEP_SUMMARY`.

Because `idvorkin/idvorkin.github.io` is a public repo, all three exposures are publicly readable. (1) and (2) contain the full transcript — every `gh` call, every `git log` output, every Claude reasoning step, every permission denial context. (3) is just counts and timings, not sensitive.

The existing `conversation-log-publisher` agent and the `published-chop-logs/` directory are a separate, unrelated system for intentionally-curated HTML conversation dumps with a mandatory security review. That system is not in scope here.

## Design

### Section 1 — Workflow edits (surgical)

Three edits to `.github/workflows/changelog.yml`, no new files:

- **Remove** `show_full_output: true` from the `Generate Changelog` step. Public step log reverts to the claude-code-action default ("full output hidden for security"). This is the largest privacy win: the inline tool-call stream stops being readable from the public Actions tab.
- **Remove** the `Upload Claude transcript` step entirely. `claude-execution-output.json` still exists on the runner at `/home/runner/work/_temp/claude-execution-output.json` during the job — it just stops being uploaded as a public artifact.
- **Keep and extend** the `Summarize Claude run` step. The metrics table remains public (that was the decision in brainstorming question #2, option B: preserve the at-a-glance health signal without leaking prompt/reasoning content). One new row is added to render archive status.
- **Insert** a new `Archive Claude transcript to private repo` step between `Generate Changelog` and `Summarize Claude run`.

Everything else — the `/changelog` prompt block, the `Verify changelog was updated` gate, the `Create Pull Request` step — is untouched.

### Section 2 — Archival step

Inserted between `Generate Changelog` and `Summarize Claude run`:

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

Key decisions embedded in the code:

- **`if: always()`** — archive even if `Generate Changelog` failed. Failure transcripts are the _most_ valuable debug content; missing them would defeat the purpose.
- **`continue-on-error: true`** — implements the warn-and-continue behavior (question #5, option B). A push failure turns the step red but doesn't fail the job. The summary step surfaces the failure as a visible warning in `GITHUB_STEP_SUMMARY`.
- **No transcript → exit 0, not failure.** If Claude never wrote the transcript (action crashed before writing), the step emits `archive_status=no_transcript` and exits cleanly. The summary renders this as an informational row, not an error.
- **No token → exit 1 with explicit `archive_status=no_token`.** Distinct from a generic auth failure: covers the dry-run-on-fork case where the secret simply isn't set, and gives the summary something concrete to render rather than just `archive failed`.
- **Shallow clone.** `--depth 1` is the fast path. 52 weekly commits a year is trivial either way, but shallow is the right default.
- **Filename format.** `transcripts/2026-04-13T14-00-00Z-changelog-run-<RUN_ID>-attempt-<RUN_ATTEMPT>.json` — UTC timestamp first (so ls sorts chronologically), workflow name embedded (leaves room for future workflows like `claude.yml` or `claude-code-review.yml` to drop transcripts into the same flat directory without collision), run ID + attempt for cross-referencing with the public Actions URL and disambiguating "Re-run failed jobs" invocations (which reuse `github.run_id` but bump `github.run_attempt`).
- **Commit message.** Two `-m` flags (subject + body), avoiding fragile multiline YAML string handling. The body links back to the public Actions run-attempt URL so `git log` in the private repo is directly useful for pivoting between a transcript and the exact attempt that produced it.
- **Committer identity via `git -c`.** Ephemeral config on just the `commit` invocation, no global git config pollution. `git add` doesn't need committer identity.
- **Explicit `git push origin HEAD:main`.** Not bare `git push`, for defensive clarity.
- **Token via `http.extraHeader`, not in the clone URL.** Embedding the PAT in `https://x-access-token:TOKEN@github.com/...` writes it into `.git/config` _and_ puts it in the `git clone` argv where any process running as the runner user can read it from `/proc/<pid>/cmdline` for the duration of the clone. `git -c http.extraHeader="Authorization: Basic ..."` keeps the token off the persistent remote URL and out of `.git/config` entirely; it does still appear in argv for the two specific `git -c` invocations, but not anywhere persistent. This is the single biggest credential-handling improvement in the design.
- **No push retry.** A single `git push`, full stop. The Non-goals section forbids parallel-pushing workflows (YAGNI), and the existing `concurrency: weekly-changelog` group serializes every changelog run against itself. A non-fast-forward today therefore indicates a real bug (someone pushed to the private repo by hand, or the repo's default branch was rewritten) and should be loud rather than papered over with a retry loop. `continue-on-error: true` already turns a one-off failure into a warn-and-continue.

### Section 3 — Summary step update

This is a _delta_ to the existing `Summarize Claude run` step from PR #479, not a replacement. The existing JSONL/array-fallback parsing of `claude-execution-output.json` and the existing 5-row metrics table are unchanged. Two things get added:

1. Three new `env:` bindings exposing the archive step's outputs and outcome.
2. A new `case` block + `echo` that appends one extra row to `$GITHUB_STEP_SUMMARY` _after_ the existing rows.

```yaml
- name: Summarize Claude run
  if: always()
  env:
    ARCHIVE_OUTCOME: ${{ steps.archive.outcome }}
    ARCHIVE_STATUS: ${{ steps.archive.outputs.archive_status }}
    ARCHIVE_PATH: ${{ steps.archive.outputs.archive_path }}
  run: |
    # ... existing script parsing claude-execution-output.json
    #     and emitting the 5-row metrics table ... (unchanged)
    # After the existing metrics rows, append the archive row:
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

Why these branches and not more:

- The archive step's `run:` script can crash _before_ any `GITHUB_OUTPUT` write (e.g., `set -euo pipefail` tripping on a typo, or a runner-level signal). In that case `ARCHIVE_OUTCOME=failure` and `ARCHIVE_STATUS` is empty → falls through the inner case to the generic `**archive failed — see step log**` row. Igor still gets a visible warning.
- The `no_token` branch exists so the dry-run-on-fork (where the secret is intentionally unset) renders an actionable message instead of a generic "archive failed", reducing the risk that a real auth failure later gets dismissed as "oh that's just the fork thing."
- `cancelled` is intentionally not its own branch. `cancel-in-progress: false` on the workflow makes concurrency cancellation impossible; manual cancellation falls through the catch-all `*)` arm and renders `(outcome=cancelled)`, which is fine — that path is rare and not worth its own copy.

Bolding the failure cases makes the warn-and-continue failure visually distinct from the healthy cases, so a glance at the Actions tab summary catches the problem.

## Data flow after the changes

```
1. Checkout                              (unchanged)
2. Compute week-of date                  (unchanged)
3. Snapshot changelog hash               (unchanged)
4. Generate Changelog                    (show_full_output removed → public step log reverts to terse default)
       ↓ writes /home/runner/work/_temp/claude-execution-output.json
5. Archive Claude transcript to private repo   (NEW)
       ↓ pushes transcripts/<ts>-changelog-run-<id>-attempt-<n>.json to idvorkin/claude-run-logs-private
       ↓ emits outputs: archive_status (ok|no_transcript|no_token), archive_path (only on ok)
6. Summarize Claude run                  (reads archive outputs, renders extra row)
       ↓ writes GITHUB_STEP_SUMMARY
7. Verify changelog was updated          (unchanged)
8. Create Pull Request                   (unchanged)
```

The `Upload Claude transcript` step that PR #479 added is deleted outright.

## Prerequisites (manual, owner-only)

Both already completed by Igor before implementation begins:

1. **Private repo:** `idvorkin/claude-run-logs-private` created as private, initialized with a README so `main` exists for cloning.
2. **PAT + secret:**
   - Fine-grained PAT under `idvorkin` account
   - Repository access: **Only select repositories** → `idvorkin/claude-run-logs-private`
   - Permissions: **Contents: Read and write**, nothing else
   - Stored as secret `CLAUDE_RUN_LOGS_PUSH_TOKEN` in `idvorkin/idvorkin.github.io`

Neither step can be performed by Claude (fine-grained PAT creation is web-only and requires password + 2FA; secret values cannot be exposed back to the assistant).

## Verification plan

Four gates, each a prerequisite for the next. Critically, gates 2 and 3 _together_ must exercise both the failure path (no_token) and the success path (real push) **before** the upstream merge — otherwise the first time the success path runs is in production, which is a meaningful gap.

1. **Local YAML lint.** `actionlint .github/workflows/changelog.yml` — structural sanity check before pushing anything.
2. **Dry-run on the fork _without_ the secret (failure path).** Push the branch to the fork, dispatch `workflow_dispatch` with the secret deliberately unset, observe: (a) public step log is terse (no tool-call stream), (b) no `claude-execution-output` artifact was uploaded, (c) summary table rendered, (d) archive row reads **`archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset`** (proving the `no_token` path resolves to the right summary row), (e) the changelog PR is still created on the fork (proving warn-and-continue actually continues).
3. **Dry-run on the fork _with_ the secret (success path).** Add `CLAUDE_RUN_LOGS_PUSH_TOKEN` to the fork's secrets — same fine-grained PAT, OR a separate fork-only PAT pointing at the same private repo. Re-dispatch. Observe: (a) archive row reads `archived transcripts/...-changelog-run-<id>-attempt-<n>.json`, (b) a new commit appears on `idvorkin/claude-run-logs-private` main with that filename, (c) the file parses as valid JSON, (d) the file's content matches the runner's `/home/runner/work/_temp/claude-execution-output.json` byte-for-byte (or close enough — timing fields may differ if Claude wrote it twice). If adding the secret to the fork is impractical, this gate can be folded into gate 4 — but then gate 4 becomes the first place the success path is ever exercised, and that risk should be explicit in the PR description.
4. **Upstream manual dispatch.** After merge, `gh workflow run "Weekly Changelog" --repo idvorkin/idvorkin.github.io --ref main`. Confirm: (a) public step log terse, (b) no public artifact, (c) summary row reads `archived transcripts/...-changelog-run-<id>-attempt-<n>.json`, (d) new commit appears on `idvorkin/claude-run-logs-private` main, (e) the changelog PR opens as usual.

The natural Monday-2pm-UTC scheduled run is _not_ a gate — it's a passive observation. If gate 4 passes, the schedule is essentially guaranteed to work the same way, and any difference would be schedule-specific (unlikely) and debuggable via the freshly-archived transcript itself.

## Execution order (for the implementation plan)

1. Create feature branch `ci/private-claude-transcripts` off `ci/changelog-observability` (so the diff shows the PR #479 undo cleanly).
2. Edit `.github/workflows/changelog.yml` — remove `show_full_output: true`, remove `Upload Claude transcript` step, insert `Archive Claude transcript to private repo` step, extend `Summarize Claude run` step with archive-row rendering.
3. Run `actionlint` locally (verification gate 1).
4. Push branch to `idvorkin-ai-tools` fork, dispatch workflow with the secret unset (verification gate 2: failure path). Confirm the bolded `no_token` row renders and the changelog PR still opens on the fork.
5. Add `CLAUDE_RUN_LOGS_PUSH_TOKEN` to the fork's secrets, re-dispatch (verification gate 3: success path). Confirm a transcript lands in `idvorkin/claude-run-logs-private` and the summary row reads `archived ...`. If adding the secret to the fork is impractical, document this gap in the PR description and rely on gate 4 as the first success-path proof.
6. Open PR targeting `ci/changelog-observability` (stacked on PR #479). If #479 merges before this one, retarget base to `main` with `gh pr edit --base main` and rebase locally. If #479 is hard-blocked for >1 week, fold its content into this branch off `main` per the Branch note.
7. After merge, do the upstream manual dispatch verification (gate 4).
8. Let the natural Monday-2pm-UTC scheduled run confirm end-to-end (passive observation; not a gate).

## Non-goals

- **Not privatizing `claude.yml` or `claude-code-review.yml`.** Those workflows don't currently upload transcripts or enable `show_full_output`. YAGNI — if they grow comparable observability, they can adopt the same pattern in a future PR.
- **Not touching `published-chop-logs/`.** Different system, different purpose (intentionally curated blog content), out of scope.
- **Not implementing retention/pruning on the private repo.** 52 commits a year is trivial. Revisit if the private repo grows to GB scale, which will take decades at this rate.
- **Not replacing the `show_full_output` observability with an equivalent private mirror of the step log.** The archived JSON transcript is strictly more information than the step log rendering of it. If Igor wants the pretty tool-call rendering for debugging, he can process the archived JSON locally.
- **Not retrying any failure inside the archive step.** Clone, push, network, auth — all single-attempt. The combination of (a) `concurrency: weekly-changelog` serializing changelog runs, (b) no other workflow pushing to the private repo today, and (c) `continue-on-error: true` on the archive step means a transient failure becomes a single bolded warning row in the summary and the changelog PR still ships. Adding retries would mask real bugs (e.g., a non-fast-forward push that should be investigated, not silently rebased over).

## Risks

- **PAT expiration silently breaks archival.** Mitigation: the summary row will show `**archive failed**` in bold on the Monday after expiration, which is the existing observability path — not silent in practice. Longer-term mitigation: pick a long-ish expiration (1 year) and let the bolded failure be the reminder. If this proves insufficient, a follow-up could add a GitHub App installation in place of the PAT.
- **Private repo access accidentally broadened.** If Igor later adds a collaborator to `idvorkin/claude-run-logs-private`, that collaborator gets read access to all historical transcripts. Mitigation: keep the repo as a personal private repo, don't add collaborators without re-reviewing what's in history.
- **Token leaks through `git` argv, on-disk config, or transformed log output.** Three attack surfaces, all mitigated. (1) Embedding `https://x-access-token:TOKEN@github.com/...` in the clone URL would persist the PAT in `.git/config` _and_ expose it via `/proc/<pid>/cmdline` for the duration of the clone, where any process running as the runner user could read it. The design uses `git -c http.extraHeader="Authorization: Basic ..."` instead, which keeps the token off the persistent remote URL and out of `.git/config`. The header argument _does_ still appear in the argv of the two `git -c` invocations themselves, so a hostile co-tenant process running as the runner user could still race the clone window — but on a GitHub-hosted ephemeral runner there are no co-tenant user processes to race against, and this is the standard pattern recommended in `actions/checkout`'s own auth helper. (2) GHA's content-based secret masking redacts the raw token from any public log line as a separate belt-and-braces layer. (3) The base64 form `x-access-token:<TOKEN>` is _not_ automatically masked because GHA's content-based masker only knows the raw secret bytes — a transformation produces different bytes. The script explicitly emits `::add-mask::` for the base64 value before using it, so any later log line that prints `$AUTH_HEADER` (e.g., a future `set -x` debug session, or a git error that quoted the `-c` value) would be redacted to `***`. The `printf 'x-access-token:%s' "$LOGS_TOKEN" | base64 -w0` pipeline keeps the raw token out of subprocess argv because `printf` is a bash builtin (no fork) and `base64` reads from stdin (no token in its argv).
- **`claude-execution-output.json` absent when expected.** If the claude-code-action internals change and stop writing to the known `/home/runner/work/_temp/` path, archival silently starts emitting `no_transcript` for every run. Mitigation: the summary row `no transcript produced` becomes the visible signal, and Igor will notice. Note: the existing `Summarize Claude run` step _also_ hardcodes this path (PR #479), so this risk is shared with the prior PR — this spec doesn't introduce it, but it does double the surface area. A future hardening could read the path from a claude-code-action step output if/when one is exposed.
- **Spec-to-implementation drift.** The YAML snippets in this spec are _the_ implementation, not a sketch. The implementation plan should reuse them verbatim, not re-derive them.
- **Public step log still contains something sensitive.** Without `show_full_output: true`, the claude-code-action prints only its terse default result JSON at the end of the step. That JSON includes the high-level result status but not tool-call content. No known leak, but worth spot-checking on the first upstream run.
- **Private repo grows unbounded.** 52 commits/year + ~50–500 KB per transcript ≈ tens of MB/year. Decades to reach GB scale. Acknowledged in Non-goals; revisit only when actually large. If a future workflow (e.g., `claude.yml` running per-PR) starts archiving, the rate jumps from ~52/year to potentially thousands/year and this risk re-opens — at that point introduce a retention job that prunes anything older than N months.
- **Dependency on a personal private repo existing.** The archive target is `idvorkin/claude-run-logs-private`, owned by a single user. If that account is suspended, the user changes their handle, or the repo is accidentally deleted, archival breaks for every workflow that depends on it. Mitigation: bolded `archive failed` row in the summary makes it noisy, and the changelog itself still ships (warn-and-continue).
- **Concurrent push race once a second workflow adopts this pattern.** Today this cannot happen: changelog.yml is the only writer and `concurrency: weekly-changelog` serializes its own runs. If a future workflow (`claude.yml`, `claude-code-review.yml`) ever adopts this archive pattern, the _correct_ fix is to put both workflows in a shared concurrency group named after the _target_ private repo (e.g., `concurrency: claude-run-logs-archive`), not to add per-step retry loops. Surfaced here so the next person to touch this remembers to do it that way.

## Rollback

If this PR ships and breaks the changelog workflow in a way that warn-and-continue does not contain (e.g., a YAML parse error in the modified file, or the new step somehow blocks PR creation despite `continue-on-error: true`), the rollback is a single revert PR. Reverting restores `show_full_output: true` and the public artifact upload — re-leaking transcripts but unblocking the workflow. Acceptable as an emergency measure for a single week; immediately re-roll forward with a fix. The private repo and PAT do not need to be touched on rollback; they simply stop being written to until a fix lands.

## Success criteria

- Public Actions log of a post-merge run shows _no_ inline tool-call stream.
- No `claude-execution-output` artifact is listed in the Actions run's artifacts panel.
- The Actions run's job summary shows the metrics table with a `Transcript archive` row rendering `archived transcripts/<ts>-changelog-run-<id>-attempt-<n>.json`.
- `idvorkin/claude-run-logs-private` has a new commit on `main` with the expected filename, the file parses as valid JSON, and the body contains the same `result`-typed event seen in prior runs.
- A deliberately-induced failure (gate 2 in the verification plan: secret unset on the fork) renders the bolded `**archive failed — CLAUDE_RUN_LOGS_PUSH_TOKEN unset**` row AND still produces the changelog PR — proving warn-and-continue actually continues.
- The Monday-2pm-UTC scheduled run produces a changelog PR exactly as it did before, with archival also succeeding.
- `actionlint` is clean on the modified workflow.

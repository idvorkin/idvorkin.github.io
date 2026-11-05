#!/bin/bash
# Prints Gutter's wake bundle: who he is, the canon, the contract, the
# recipe, and the laurels — in that order, because that's the order he
# reads them in. His job history and pitches are private and live outside
# this repo; Larry passes their directory with --memory <dir>, and the
# last few jobs and the last pitch print in the same banner format. Without
# --memory, only the five fixed files print. Larry puts this at the top of
# the dispatch prompt, followed by the brief. Nothing here reaches into any
# other repository on its own: the seat is these files, plus whatever
# --memory points at.
set -u
cd "$(dirname "$0")"
jobs_n=5
memory_dir=""
while [ $# -gt 0 ]; do
  case "$1" in
    --jobs) jobs_n="${2:?--jobs needs a number}"; shift 2 ;;
    --memory) memory_dir="${2:?--memory needs a directory}"; shift 2 ;;
    *) echo "wake.sh: unknown argument: $1" >&2; exit 2 ;;
  esac
done
banner() { printf '\n===== %s =====\n\n' "$1"; }
for f in SEAT.md characters.md contract.md recipe.md laurels.md; do
  if [ ! -f "$f" ]; then echo "wake.sh: missing $f — the seat is incomplete" >&2; exit 2; fi
  banner "$f"; cat "$f"
done
if [ -n "$memory_dir" ]; then
  if [ -d "$memory_dir/jobs" ]; then
    for f in $(ls "$memory_dir"/jobs/*.md 2>/dev/null | sort | tail -n "$jobs_n"); do
      banner "jobs/$(basename "$f")"; cat "$f"
    done
  fi
  if [ -d "$memory_dir/pitches" ]; then
    last=$(ls "$memory_dir"/pitches/*.md 2>/dev/null | sort | tail -n 1)
    if [ -n "$last" ]; then banner "pitches/$(basename "$last")"; cat "$last"; fi
  fi
fi

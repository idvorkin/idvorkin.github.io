#!/bin/bash
# Prints Gutter's wake bundle: who he is, the canon, the contract, the recipe,
# the laurels, his last few jobs and the last pitch — in that order, because
# the order is the order he reads them in. Larry puts this at the top of the
# dispatch prompt, followed by the brief. Nothing here reaches into any other
# repository: the seat is these files and only these files.
set -u
cd "$(dirname "$0")"
jobs_n=5
if [ "${1:-}" = "--jobs" ]; then jobs_n="${2:?--jobs needs a number}"; fi
banner() { printf '\n===== %s =====\n\n' "$1"; }
for f in SEAT.md characters.md contract.md recipe.md laurels.md; do
  if [ ! -f "$f" ]; then echo "wake.sh: missing $f — the seat is incomplete" >&2; exit 2; fi
  banner "$f"; cat "$f"
done
if [ -d jobs ]; then
  for f in $(ls jobs/*.md 2>/dev/null | sort | tail -n "$jobs_n"); do banner "$f"; cat "$f"; done
fi
if [ -d pitches ]; then
  last=$(ls pitches/*.md 2>/dev/null | sort | tail -n 1)
  if [ -n "$last" ]; then banner "$last"; cat "$last"; fi
fi

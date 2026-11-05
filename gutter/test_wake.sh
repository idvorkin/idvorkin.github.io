#!/bin/bash
# The wake bundle: five fixed files in order; --memory <dir> appends the
# last few jobs and the last pitch from that (private) directory, same
# banners, same order. A missing fixed file is a loud failure, not a quiet
# gap.
set -u
cd "$(dirname "$0")"

out=$(./wake.sh) || { echo "FAIL: wake.sh exited $?"; exit 1; }
order=$(printf '%s\n' "$out" | grep -oE '^===== [^ ]+ =====' | sed 's/===== //; s/ =====//')
expected="SEAT.md
characters.md
contract.md
recipe.md
laurels.md"
[ "$(printf '%s\n' "$order" | head -5)" = "$expected" ] || { echo "FAIL: order was:"; echo "$order"; exit 1; }
printf '%s\n' "$order" | grep -q '^jobs/' && { echo "FAIL: plain wake.sh printed a jobs/ banner"; exit 1; }

mem=$(mktemp -d)
mkdir -p "$mem/jobs" "$mem/pitches"
echo "# x" > "$mem/jobs/2026-01-01-x.md"
echo "# pitch" > "$mem/pitches/2026-W01.md"
out=$(./wake.sh --memory "$mem") || { echo "FAIL: wake.sh --memory exited $?"; exit 1; }
order=$(printf '%s\n' "$out" | grep -oE '^===== [^ ]+ =====' | sed 's/===== //; s/ =====//')
[ "$(printf '%s\n' "$order" | head -5)" = "$expected" ] || { echo "FAIL: order (memory run) was:"; echo "$order"; exit 1; }
after=$(printf '%s\n' "$order" | tail -n +6)
printf '%s\n' "$after" | grep -q '^jobs/2026-01-01-x\.md$' || { echo "FAIL: no jobs banner with --memory:"; echo "$after"; exit 1; }
printf '%s\n' "$after" | grep -q '^pitches/2026-W01\.md$' || { echo "FAIL: no pitches banner with --memory:"; echo "$after"; exit 1; }
rm -rf "$mem"

tmp=$(mktemp -d); cp -r . "$tmp/g"; rm "$tmp/g/laurels.md"
if (cd "$tmp/g" && ./wake.sh >/dev/null 2>&1); then echo "FAIL: missing laurels.md did not fail"; exit 1; fi
rm -rf "$tmp"
echo "PASS"

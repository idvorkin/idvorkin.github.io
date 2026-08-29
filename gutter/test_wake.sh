#!/bin/bash
# The wake bundle: five fixed files in order, then jobs, then the last pitch;
# a missing fixed file is a loud failure, not a quiet gap.
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
printf '%s\n' "$order" | grep -q '^jobs/' || { echo "FAIL: no jobs entry in bundle"; exit 1; }
tmp=$(mktemp -d); cp -r . "$tmp/g"; rm "$tmp/g/laurels.md"
if (cd "$tmp/g" && ./wake.sh >/dev/null 2>&1); then echo "FAIL: missing laurels.md did not fail"; exit 1; fi
rm -rf "$tmp"
echo "PASS"

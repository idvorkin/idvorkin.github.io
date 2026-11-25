#!/usr/bin/env bash
# Prove tools/backlinks writes the same back-links.json as build_back_links.py:
# run both on one built site and compare the bytes. zola/verify/parity.sh runs
# it, so `just zola-parity` and `just zola-update` gate the Rust port.
#
#   tools/backlinks/compare.sh <built-site-dir> [BASE_URL]
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "$HERE/../.." && pwd)
OUT=$(cd "$1" && pwd)
BASE_URL=${2:-https://idvork.in}
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
export SRC OUT BASE_URL BACKLINKS=1
WORK=$T/py BACKLINKS_PY=1 "$SRC/zola/backlinks.sh"
WORK=$T/rs "$SRC/zola/backlinks.sh"
if cmp "$T/py/bbl/back-links.json" "$T/rs/bbl/back-links.json"; then
  echo "backlinks: Rust and Python write identical back-links.json"
else
  diff "$T/py/bbl/back-links.json" "$T/rs/bbl/back-links.json" | head -40
  exit 1
fi

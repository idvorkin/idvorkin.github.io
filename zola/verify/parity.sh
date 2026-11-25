#!/usr/bin/env bash
# The parity gate: build Jekyll and Zola from this checkout, then diff every
# output file (parity.py, against accepted.txt). Exits 1 on a new difference.
#
#   zola/verify/parity.sh          # or: just zola-parity
#   OUTDIR=/tmp/p zola/verify/parity.sh
#
# Needs Ruby + bundler for the Jekyll side (the same gems `just jekyll-build`
# uses). Results: $OUTDIR/parity.csv (one row per file) and buckets.json.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "$HERE/../.." && pwd)
OUTDIR=${OUTDIR:-$HOME/tmp/agent/skill/zola-parity}
mkdir -p "$OUTDIR"
export TZ=UTC JEKYLL_CONFIG=_config.yml,_config_ci.yml
echo "jekyll build -> $OUTDIR/jekyll"
(cd "$SRC" && RUBYOPT="-r$SRC/_ruby_compat.rb" nice -n 19 bundle exec jekyll build \
  --config "$JEKYLL_CONFIG" -d "$OUTDIR/jekyll" > "$OUTDIR/jekyll.log" 2>&1) ||
  { tail -20 "$OUTDIR/jekyll.log"; exit 1; }
echo "zola build -> $OUTDIR/zola"
rm -rf "$OUTDIR/zola"
SRC=$SRC OUT=$OUTDIR/zola WORK=$OUTDIR/work STRICT=1 nice -n 19 "$HERE/../build.sh" > "$OUTDIR/zola.log"
# verify.sh gives both sides one back-links.json, so check the index here.
"$SRC/tools/backlinks/compare.sh" "$OUTDIR/zola"
# And that tools/convert converts every page as the Python does.
nice -n 19 "$SRC/tools/convert/compare.sh" "$SRC"
nice -n 19 "$HERE/parity.py" "$OUTDIR/jekyll" "$OUTDIR/zola" "$OUTDIR/parity.csv" "$OUTDIR/buckets.json"

#!/usr/bin/env bash
# Build tools/backlinks if its sources changed (a ~20 ms no-op otherwise), then
# run it with the given arguments. Run from the source checkout: it reads each
# page's markdown_path and asks git for its date relative to the cwd.
#
#   tools/backlinks/run.sh --site _site --output back-links.json [--base-url URL]
#   tools/backlinks/run.sh       # no arguments: only build it (just setup does)
#
# `just setup` installs cargo. BACKLINKS_BIN=/path/to/backlinks skips the build
# (CI restores a cached binary that way).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
BIN=${BACKLINKS_BIN:-}
if [ -z "$BIN" ]; then
  command -v cargo > /dev/null || {
    echo "backlinks: no cargo; run 'just setup', or BACKLINKS_PY=1 for the Python build" >&2
    exit 1
  }
  cargo build --release --locked --quiet --manifest-path "$HERE/Cargo.toml" --target-dir "$HERE/target"
  BIN=$HERE/target/release/backlinks
fi
[ $# -gt 0 ] || { echo "backlinks: $BIN"; exit 0; }
exec "$BIN" "$@"

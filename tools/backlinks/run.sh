#!/usr/bin/env bash
# Run tools/backlinks, compiling it first only when no build of these exact
# sources exists yet. Builds are shared by every checkout and worktree:
# ~/.cache/backlinks/<hash of the crate's sources>/backlinks, so a fresh
# worktree reuses one. A change to the crate compiles in tools/backlinks/target:
# ~12-16 s the first time in a checkout, ~1 s after that.
# Run from the source checkout: it reads each page's markdown_path and asks
# git for its date relative to the cwd.
#
#   tools/backlinks/run.sh --site _site --output back-links.json [--base-url URL]
#   tools/backlinks/run.sh       # no arguments: only build it (just setup does)
#
# `just setup` installs cargo. BACKLINKS_BIN=/path/to/backlinks skips all of
# this (CI restores a cached binary that way).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
BIN=${BACKLINKS_BIN:-}
if [ -z "$BIN" ]; then
  sha() { if command -v sha256sum > /dev/null; then sha256sum; else shasum -a 256; fi; }
  key=$(cd "$HERE" && find Cargo.toml Cargo.lock src -type f | LC_ALL=C sort | xargs cat | sha | cut -c1-16)
  CACHE=${XDG_CACHE_HOME:-$HOME/.cache}/backlinks
  BIN=$CACHE/$key/backlinks
  if [ ! -x "$BIN" ]; then
    CARGO=$(command -v cargo || echo "$HOME/.cargo/bin/cargo")
    [ -x "$CARGO" ] || {
      echo "backlinks: no cargo; run 'just setup', or BACKLINKS_PY=1 for the Python build" >&2
      exit 1
    }
    # This checkout's own target dir, kept between compiles, so an edit
    # rebuilds only the crate (~1 s) and not regex and html5ever (~12 s cold).
    # Never one dir for all checkouts: cargo gives every checkout's crate the
    # same unit and judges it fresh by mtime, so a checkout with older files
    # would be handed another checkout's binary.
    T=$HERE/target
    "$CARGO" build --release --locked --quiet --manifest-path "$HERE/Cargo.toml" --target-dir "$T"
    mkdir -p "$CACHE/$key"
    cp "$T/release/backlinks" "$BIN.tmp.$$" && mv -f "$BIN.tmp.$$" "$BIN"
  fi
fi
[ $# -gt 0 ] || { echo "backlinks: $BIN"; exit 0; }
exec "$BIN" "$@"

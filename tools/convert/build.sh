#!/usr/bin/env bash
# Compile tools/convert (a Python extension) once per change to its sources
# and print the path of the .so. Builds are shared by every checkout and
# worktree: ~/.cache/zola-convert/<hash of the crate's sources>/, so a fresh
# worktree reuses one and a cold compile (~20-40 s) happens once per change.
# zola/rustconvert.py runs this; CONVERT_SO=/path/to/zolaconvert.so skips it,
# CONVERT_PY=1 skips Rust entirely. CI caches ~/.cache/zola-convert itself.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
sha() { if command -v sha256sum > /dev/null; then sha256sum; else shasum -a 256; fi; }
key=$(cd "$HERE" && find Cargo.toml Cargo.lock build.rs src -type f | LC_ALL=C sort | xargs cat | sha | cut -c1-16)
CACHE=${XDG_CACHE_HOME:-$HOME/.cache}/zola-convert
SO=$CACHE/$key/zolaconvert.so
if [ ! -f "$SO" ]; then
  # The bundled PCRE2, statically: never the runner's libpcre2, whose version
  # and build options would then decide the output.
  export PCRE2_SYS_STATIC=1
  CARGO=$(command -v cargo || echo "$HOME/.cargo/bin/cargo")
  [ -x "$CARGO" ] || {
    echo "convert: no cargo; run 'just setup', or CONVERT_PY=1 for the Python fixes" >&2
    exit 1
  }
  # A private target dir per compile, so two checkouts compiling different
  # sources at once cannot hand each other the wrong library.
  mkdir -p "$CACHE"
  T=$(mktemp -d "$CACHE/target.XXXXXX")
  trap 'rm -rf "$T"' EXIT
  "$CARGO" build --release --locked --quiet --manifest-path "$HERE/Cargo.toml" --target-dir "$T" >&2
  lib=$T/release/libzolaconvert.so
  [ -f "$lib" ] || lib=$T/release/libzolaconvert.dylib
  mkdir -p "$CACHE/$key"
  cp "$lib" "$SO.tmp.$$" && mv -f "$SO.tmp.$$" "$SO"
  rm -rf "$T"
  trap - EXIT
fi
echo "$SO"

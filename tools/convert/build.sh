#!/usr/bin/env bash
# Compile tools/convert (a Python extension) once per change to its sources
# and print the path of the .so. Builds are shared by every checkout and
# worktree: ~/.cache/zola-convert/<hash of the crate's sources>/, so a fresh
# worktree reuses one. A change compiles in tools/convert/target: ~12 s the
# first time in a checkout, ~1 s after that.
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
  # This checkout's own target dir, kept between compiles, so an edit
  # rebuilds only the crate (~1 s) and not PCRE2 and pyo3 (~12 s cold).
  # Never one dir for all checkouts: cargo gives every checkout's crate the
  # same unit and judges it fresh by mtime, so a checkout with older files
  # would be handed another checkout's library.
  T=$HERE/target
  "$CARGO" build --release --locked --quiet --manifest-path "$HERE/Cargo.toml" --target-dir "$T" >&2
  lib=$T/release/libzolaconvert.so
  [ -f "$lib" ] || lib=$T/release/libzolaconvert.dylib
  mkdir -p "$CACHE/$key"
  cp "$lib" "$SO.tmp.$$" && mv -f "$SO.tmp.$$" "$SO"
fi
echo "$SO"

#!/usr/bin/env bash
# Prove tools/convert converts every page as convert.py's Python does: build
# the checkout twice with the build clock pinned, once with CONVERT_PY=1, and
# compare the output and the Zola site the conversion wrote, byte for byte.
# STRICT=1 also fails the Rust side on any page it handed back to Python.
# zola/verify/parity.sh runs it, so `just zola-parity` and `just zola-update`
# gate the port.
#
#   tools/convert/compare.sh [SRC]     # SRC: the checkout to build (default: this one)
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "${1:-$HERE/../..}" && pwd)
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
export SRC SITE_TIME=2026-01-01T00:00:00 STRICT=1 BRANCH=compare
CONVERT_PY=1 WORK=$T/py OUT=$T/py-out "$HERE/../../zola/build.sh" > "$T/py.log" 2>&1 || { tail -20 "$T/py.log"; exit 1; }
env -u CONVERT_PY WORK=$T/rs OUT=$T/rs-out "$HERE/../../zola/build.sh" > "$T/rs.log" 2>&1 || { tail -20 "$T/rs.log"; exit 1; }
if diff -r "$T/py-out" "$T/rs-out" > "$T/diff" && diff -r "$T/py" "$T/rs" >> "$T/diff"; then
  echo "convert: Rust and Python write identical sites ($(find "$T/rs-out" -type f | wc -l) files)"
else
  head -40 "$T/diff"
  exit 1
fi

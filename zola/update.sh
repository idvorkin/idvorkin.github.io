#!/usr/bin/env bash
# Move the toolchain to a new Zola (or refresh the shim's deps) and prove the
# site did not change: pin, install, rebuild, then the parity gate.
#
#   zola/update.sh 0.24.0     # or: just zola-update 0.24.0
#   zola/update.sh            # keep the Zola pin, refresh the Python deps
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -n "${1:-}" ]; then
  echo "$1" > "$HERE/ZOLA_VERSION"
fi
# Inline deps: re-resolve to the newest versions the scripts allow.
for f in "$HERE"/*.py "$HERE"/verify/*.py; do
  grep -q '^# /// script' "$f" && uv sync --script "$f" --upgrade --quiet
done
# tools/backlinks and tools/convert: newest crate versions their Cargo.toml allows.
for crate in backlinks convert; do
  "$(command -v cargo || echo "$HOME/.cargo/bin/cargo")" update --quiet --manifest-path "$HERE/../tools/$crate/Cargo.toml"
done
"$HERE/install.sh"
"$HERE/verify/parity.sh"
echo "parity holds: commit zola/ZOLA_VERSION, tools/*/Cargo.lock (and any shim change) together"

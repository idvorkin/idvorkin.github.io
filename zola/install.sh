#!/usr/bin/env bash
# Install the site toolchain on a fresh Mac or Linux box: the Zola version
# pinned in zola/ZOLA_VERSION (the Pages workflow reads the same file), uv
# (it runs the shim's Python scripts and resolves their inline deps), the
# shim's deps themselves, cargo, tools/backlinks (the back-links.json
# builder) and tools/convert (the Markdown fixes), and the JS bundle's
# node_modules.
#
#   zola/install.sh            # or: just setup
#   BIN=/somewhere zola/install.sh
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
V=$(tr -d '[:space:]' < "$HERE/ZOLA_VERSION")
BIN=${BIN:-$HOME/.local/bin}
mkdir -p "$BIN"

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64) T=x86_64-unknown-linux-gnu ;;
  Linux-aarch64 | Linux-arm64) T=aarch64-unknown-linux-gnu ;;
  Darwin-arm64) T=aarch64-apple-darwin ;;
  Darwin-x86_64) T=x86_64-apple-darwin ;;
  *) echo "no Zola build for $(uname -sm)" >&2; exit 1 ;;
esac
if [ "$("$BIN/zola" --version 2>/dev/null)" = "zola $V" ]; then
  echo "zola $V already in $BIN"
else
  echo "installing zola $V ($T) into $BIN"
  curl -fsSL "https://github.com/getzola/zola/releases/download/v$V/zola-v$V-$T.tar.gz" | tar -xz -C "$BIN" zola
  "$BIN/zola" --version
fi

if ! command -v uv > /dev/null; then
  echo "installing uv into $BIN"
  curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR="$BIN" INSTALLER_NO_MODIFY_PATH=1 sh
  export PATH="$BIN:$PATH"
fi
# The shim's Python deps live in each script's inline `# /// script` block.
for f in "$HERE"/*.py "$HERE"/verify/*.py; do
  grep -q '^# /// script' "$f" && uv sync --script "$f" --quiet
done

# tools/backlinks is Rust; rustup's minimal profile is just rustc + cargo.
if ! command -v cargo > /dev/null && [ ! -x "$HOME/.cargo/bin/cargo" ]; then
  echo "installing rust (rustup, minimal profile) into ~/.cargo"
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal --no-modify-path
fi
command -v cargo > /dev/null || export PATH="$HOME/.cargo/bin:$PATH"
"$HERE/../tools/backlinks/run.sh"
"$HERE/../tools/convert/build.sh" > /dev/null

if command -v npm > /dev/null; then
  (cd "$HERE/.." && npm ci --silent)
else
  echo "warning: no npm; install Node 22 for the JS bundle and Pagefind" >&2
fi

case ":$PATH:" in *":$BIN:"*) ;; *) echo "note: add $BIN to PATH" ;; esac
command -v cargo > /dev/null || echo "note: add ~/.cargo/bin to PATH"
echo "ok: zola $V, $(uv --version)"

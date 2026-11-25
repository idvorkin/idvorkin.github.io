#!/usr/bin/env bash
# Preview any checkout of the blog with Zola instead of `jekyll serve`:
# build, serve, rebuild when a source file changes, reload open pages.
# A one-post edit is served in well under 1.5 s (DESIGN.md has the numbers);
# a layout or include edit rebuilds every page in about 3 s.
#
#   zola/preview.sh                         # this checkout on :4471
#   zola/preview.sh ~/gits/larry-blog/.worktrees/my-branch 4480
#   TS_PORT=8448 zola/preview.sh <src> 4471 # links use the tailnet URL
#     (front it once with: tailscale serve --bg --https=8448 http://127.0.0.1:4471)
#
# The checkout does not need zola/ in it: this toolchain builds whatever SRC
# points at. Stop with Ctrl-C or `kill <pid>` (the server goes with it).
# Restart it after editing zola/*.py: the running process has them loaded.
# The loop itself is watch.py (inotify, page cache, live reload).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "${1:-$HERE/..}" && pwd)
PORT=${2:-4471}
if [ -n "${TS_PORT:-}" ]; then
  host=$(tailscale status --json | python3 -c 'import json,sys; print(json.load(sys.stdin)["Self"]["DNSName"].rstrip("."))')
  BASE_URL=https://$host:$TS_PORT
else
  BASE_URL=${BASE_URL:-http://127.0.0.1:$PORT}
fi
WORK=${WORK:-${XDG_CACHE_HOME:-$HOME/.cache}/zola-port/preview-$PORT}
mkdir -p "$WORK" && WORK=$(cd "$WORK" && pwd)
OUT=$WORK/public
ZOLA=${ZOLA:-$(command -v zola || echo "$HOME/.local/bin/zola")}
want="zola $(tr -d '[:space:]' < "$(dirname "$0")/ZOLA_VERSION")"
[ "$("$ZOLA" --version 2> /dev/null)" = "$want" ] || {
  echo "need $want (ZOLA=$ZOLA); run zola/install.sh" >&2
  exit 1
}
export SRC WORK OUT BASE_URL ZOLA
rm -f "$WORK/bbl/back-links.json" # first build makes a fresh index; rebuilds reuse it
# $WORK/overlay/ is copied over every build (the verify report lives there as _port/).
# Run the script env's python directly: `uv run` would stay resident as its
# parent (48 MB) and come between a kill and the process.
uv sync -q --script "$HERE/watch.py"
exec "$(uv python find --script "$HERE/watch.py")" "$HERE/watch.py" "$PORT"

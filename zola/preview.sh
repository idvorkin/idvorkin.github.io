#!/usr/bin/env bash
# Preview any checkout of the blog with Zola instead of `jekyll serve`:
# build, serve, rebuild when a source file changes. ~20 MB resident and a
# ~3 s rebuild, against Jekyll's 230-360 MB and 8 s.
#
#   zola/preview.sh                         # this checkout on :4471
#   zola/preview.sh ~/gits/larry-blog/.worktrees/my-branch 4480
#   TS_PORT=8448 zola/preview.sh <src> 4471 # links use the tailnet URL
#     (front it once with: tailscale serve --bg --https=8448 http://127.0.0.1:4471)
#
# The checkout does not need zola/ in it: this toolchain builds whatever SRC
# points at. Stop with Ctrl-C (or kill the PID it prints).
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
OUT=$WORK/public
export SRC WORK OUT BASE_URL
rm -f "$WORK/bbl/back-links.json" # first build makes a fresh index; rebuilds reuse it
export BACKLINKS=cached
stamp=$WORK/.built
# $WORK/overlay/ is copied over every build (the verify report lives there as _port/).
build() {
  mkdir -p "$WORK" && touch "$stamp.next"
  "$HERE/build.sh" | tail -1 && mv "$stamp.next" "$stamp"
  if [ -d "$WORK/overlay" ]; then cp -r "$WORK/overlay/." "$OUT/"; fi
}
build
python3 "$HERE/serve.py" "$OUT" "$PORT" &
server=$!
trap 'kill $server 2>/dev/null; exit' EXIT INT TERM
echo "preview: $BASE_URL  (pid $$, server $server, source $SRC)"
# ponytail: polls mtimes once a second and rebuilds everything (~3 s). The
# upgrade is inotify plus converting only the changed file; no live reload yet.
changed() {
  # Only what a build reads: the collections, includes, layouts, data, assets
  # and the root-level pages (not worktrees, node_modules, build output or
  # dotfiles such as lock files other tools touch).
  local dirs=()
  for d in _d _td _posts _ig66 _test _includes _layouts _data assets images; do
    [ -d "$SRC/$d" ] && dirs+=("$SRC/$d")
  done
  [ -n "$(find "${dirs[@]}" -type f -newer "$stamp" -print -quit)" ] ||
    [ -n "$(find "$SRC" -maxdepth 1 -type f ! -name '.*' -newer "$stamp" -print -quit)" ]
}
while sleep 1; do
  if changed; then
    build || echo "build failed; still serving the last good build"
  fi
done

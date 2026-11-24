#!/usr/bin/env bash
# Build the blog with Zola from its Jekyll sources. The ONE build entry point:
# the mirror's GitHub Action, local/tailnet previews and the verification
# harness all call this.
#
#   zola/build.sh                          # this checkout -> zola/.work/public
#   SRC=~/gits/larry-blog/.worktrees/x OUT=/tmp/x zola/build.sh   # any checkout
#   BASE_URL=https://host:port zola/build.sh                      # preview URLs
#   BACKLINKS=1 PAGEFIND=1 zola/build.sh   # + back-links.json and search index
#
# SRC   Jekyll checkout to build (default: the one this script sits in). It
#       does not need a zola/ directory: the toolchain is separate from the
#       content, so any branch or PR builds with the current toolchain.
# WORK  scratch Zola site dir (default: zola/.work, or a per-SRC cache dir).
# OUT   output dir, shaped like Jekyll's _site (default: $WORK/public).
#
# Steps: stage the files Jekyll copies verbatim, copy _data, write the dev
# banner's git.json (Jekyll's _plugins/git_data_generator.rb did this), render
# Liquid and convert kramdown -> CommonMark, zola build, then reshape the
# output to Jekyll's URL layout and write the redirect stubs.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
ZOLA=${ZOLA:-$(command -v zola || echo "$HOME/tmp/agent/skill/zola/zola")}
"$ZOLA" --version | grep -q '0\.23\.' || { echo "need zola 0.23.x (ZOLA=$ZOLA)" >&2; exit 1; }
SRC=$(cd "${SRC:-$HERE/..}" && pwd)
if [ -z "${WORK:-}" ]; then
  if [ "$SRC" = "$(cd "$HERE/.." && pwd)" ]; then WORK=$HERE/.work
  else WORK=${XDG_CACHE_HOME:-$HOME/.cache}/zola-port/$(printf %s "$SRC" | sha1sum | cut -c1-12); fi
fi
mkdir -p "$WORK" && WORK=$(cd "$WORK" && pwd)
OUT=${OUT:-$WORK/public}
BASE_URL=${BASE_URL:-https://idvork.in}
export SRC WORK BASE_URL

rm -rf "$WORK/templates" "$WORK/data" "$WORK/content"
mkdir -p "$WORK/data"
cp -r "$HERE/templates" "$WORK/templates"
cp "$HERE/config.toml" "$WORK/config.toml"
"$HERE/stage_static.py" > "$WORK/static-report.json"
cp "$SRC"/_data/*.json "$SRC"/_data/*.yml "$WORK/data/"
branch=${BRANCH:-$(git -C "$SRC" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)}
printf '{"branch":"%s","pr_number":%s,"changed_pages":[]}\n' "$branch" "${PR_NUMBER:-null}" > "$WORK/data/git.json"
"$HERE/convert.py" > "$WORK/convert-report.json"
(cd "$WORK" && "$ZOLA" build -o "$OUT" --force --base-url "$BASE_URL")
python3 "$HERE/finish.py" "$WORK" "$OUT" "$BASE_URL"

if [ -n "${BACKLINKS:-}" ]; then
  # ponytail: build_back_links.py hardcodes ./_site and must run inside the
  # checkout (it asks git about each source file). So run a copy of it that
  # says _zsite instead, with _zsite a short-lived symlink to our
  # output. Upgrade path: a --site-dir option on build_back_links.py upstream.
  mkdir -p "$WORK/bbl"
  sed 's/_site/_zsite/g' "$SRC/build_back_links.py" > "$WORK/bbl/build_back_links.py"
  ln -sfn "$OUT" "$SRC/_zsite"
  (cd "$SRC" && PYTHONPATH="$SRC" uv run "$WORK/bbl/build_back_links.py" build --output-file "$WORK/bbl/back-links.json" > "$WORK/backlinks.log" 2>&1) \
    || { rm -f "$SRC/_zsite"; tail -20 "$WORK/backlinks.log"; exit 1; }
  rm -f "$SRC/_zsite"
  sed -i 's|"_zsite/|"_site/|g' "$WORK/bbl/back-links.json"
  # rm first: the staged copy is a hard link to the source checkout's file.
  rm -f "$OUT/back-links.json" && cp "$WORK/bbl/back-links.json" "$OUT/back-links.json"
fi
if [ -n "${PAGEFIND:-}" ]; then
  npx --yes pagefind@1.5.2 --site "$OUT" > "$WORK/pagefind.log" 2>&1 || { tail -20 "$WORK/pagefind.log"; exit 1; }
fi
echo "built $SRC ($branch) -> $OUT"

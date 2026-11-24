#!/usr/bin/env bash
# back-links.json for a Zola build in $OUT. build.sh runs this when BACKLINKS
# is set; watch.py runs it after every preview rebuild.
#
#   BACKLINKS=1       build the index from $OUT (about 10 s)
#   BACKLINKS=cached  reuse $WORK/bbl/back-links.json from an earlier full
#                     build, and build it only when there is none
#
# Needs SRC, WORK, OUT and BASE_URL, as build.sh exports them.
set -euo pipefail
if [ "${BACKLINKS:-}" = cached ] && [ -f "$WORK/bbl/back-links.json" ]; then
  # A preview rebuild: the index from the first build is close enough (what
  # `just ensure-backlinks` does for jekyll serve), and it costs 10 s to redo.
  rm -f "$OUT/back-links.json" && cp "$WORK/bbl/back-links.json" "$OUT/back-links.json"
elif [ -n "${BACKLINKS:-}" ]; then
  # ponytail: build_back_links.py hardcodes ./_site and must run inside the
  # checkout (it asks git about each source file). So run a copy of it that
  # says _zsite instead, with _zsite a short-lived symlink to our
  # output. Upgrade path: a --site-dir option on build_back_links.py upstream.
  mkdir -p "$WORK/bbl"
  # It also only knows how to strip localhost and idvork.in from URLs, so a
  # preview on another host needs its BASE_URL stripped as well.
  sed -e 's/_site/_zsite/g' \
    -e "s|url = url.replace(\"https://idvork.in\", \"\")|url = url.replace(\"https://idvork.in\", \"\").replace(\"$BASE_URL\", \"\")|" \
    "$SRC/build_back_links.py" > "$WORK/bbl/build_back_links.py"
  grep -qF "replace(\"$BASE_URL\"" "$WORK/bbl/build_back_links.py" || { echo "build_back_links.py changed: the BASE_URL patch no longer applies" >&2; exit 1; }
  ln -sfn "$OUT" "$SRC/_zsite"
  (cd "$SRC" && PYTHONPATH="$SRC" uv run "$WORK/bbl/build_back_links.py" build --output-file "$WORK/bbl/back-links.json" > "$WORK/backlinks.log" 2>&1) \
    || { rm -f "$SRC/_zsite"; tail -20 "$WORK/backlinks.log"; exit 1; }
  rm -f "$SRC/_zsite"
  sed -i 's|"_zsite/|"_site/|g' "$WORK/bbl/back-links.json"
  # rm first: the staged copy is a hard link to the source checkout's file.
  rm -f "$OUT/back-links.json" && cp "$WORK/bbl/back-links.json" "$OUT/back-links.json"
fi

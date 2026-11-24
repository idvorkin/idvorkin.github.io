#!/usr/bin/env bash
# Pixel-level check of the Zola build against the Jekyll build of the SAME
# commit. Serves both, renders every page that is not byte-identical in one
# Playwright session at 390 and 1200 wide, diffs, writes the ranked report and
# applies the ratchet gate (verify/baseline.json).
#
#   zola/verify/verify.sh                  # full run (about 25 min, niced, 2 jobs)
#   LIMIT=40 zola/verify/verify.sh         # first 40 pages (smoke)
#   ONLY='/act /td/slow-zsh' zola/verify/verify.sh
#   UPDATE_BASELINE=1 zola/verify/verify.sh
#   NOISE=1 LIMIT=60 zola/verify/verify.sh # Jekyll vs Jekyll: the noise floor
#
# JEKYLL  the Jekyll _site to compare against (default: $SRC/_site; build it
#         with RUBYOPT=-r./_ruby_compat.rb bundle exec jekyll build).
# SHOTS   where screenshots go (default ~/tmp/agent/skill/zola-port/verify).
# Needs node with playwright on NODE_PATH (default: the blog checkout's).
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "${SRC:-$HERE/../..}" && pwd)
JEKYLL=${JEKYLL:-$SRC/_site}
SHOTS=${SHOTS:-$HOME/tmp/agent/skill/zola-port/verify}
ZOUT=${ZOUT:-$SHOTS/zola-site}
JP=${JP:-4472} ZP=${ZP:-4473}
export NODE_PATH=${NODE_PATH:-$HOME/gits/larry-blog/node_modules}
[ -d "$JEKYLL" ] || { echo "no Jekyll build at $JEKYLL" >&2; exit 1; }
mkdir -p "$SHOTS"

SRC=$SRC OUT=$ZOUT "$HERE/../build.sh" > "$SHOTS/build.log"
# Same back-links.json on both sides: this compares renderers, not indexes.
[ -f "$SRC/back-links.json" ] && cp "$SRC/back-links.json" "$JEKYLL/back-links.json" && cp "$SRC/back-links.json" "$ZOUT/back-links.json"

SHOTS=$SHOTS python3 - "$JEKYLL" "$ZOUT" > "$SHOTS/urls.json" <<'PY'
import hashlib, json, os, re, sys
from pathlib import Path
j, z = Path(sys.argv[1]), Path(sys.argv[2])
urls = []
for p in sorted(j.rglob("*.html")):
    rel = p.relative_to(j).as_posix()
    if rel.split("/")[0] in ("pagefind", "zola-spike"):
        continue
    b = p.read_bytes()
    if b'http-equiv="refresh"' in b[:3000] and len(b) < 3000:
        continue  # redirect stub: diff_sites.py checks those
    q = z / rel
    if q.exists() and q.read_bytes() == b:
        continue  # copied verbatim by both builds
    u = "/" + rel[:-5]
    u = "/" if u == "/index" else u[:-5] if u.endswith("/index") else u
    urls.append(u)
only, limit = os.environ.get("ONLY"), os.environ.get("LIMIT")
if only:
    urls = [u for u in urls if u in only.split()]
if limit:
    urls = urls[:: max(1, len(urls) // int(limit))][: int(limit)]
json.dump(urls, sys.stdout)

# Re-shoot only what changed: a page whose HTML differs from the HTML its
# screenshot was taken of loses that screenshot. So after a converter fix the
# second run costs minutes, not the full sweep.
shots_dir = Path(os.environ["SHOTS"])
hash_file, shots_file = shots_dir / "html-hash.json", shots_dir / "shots.json"
old = json.loads(hash_file.read_text()) if hash_file.exists() else {}
now = {"jekyll": {}, "zola": {}}
for site, root in (("jekyll", j), ("zola", z)):
    for u in urls:
        rel = "index.html" if u == "/" else u.strip("/") + ("/index.html" if u.endswith("/") else ".html")
        f = root / rel
        # <meta> tags do not render: an og:description tweak re-shoots nothing.
        now[site][u] = hashlib.sha1(re.sub(rb"<meta\b[^>]*>", b"", f.read_bytes())).hexdigest() if f.exists() else None
if shots_file.exists() and old:
    shots = json.loads(shots_file.read_text())
    stale = [k for k in shots if (lambda u, w, s: s in now and u in now[s] and old.get(s, {}).get(u) != now[s][u])(*k.split("|"))]
    for k in stale:
        del shots[k]
    shots_file.write_text(json.dumps(shots))
    print(f"{len(stale)} stale screenshots dropped", file=sys.stderr)
for site in now:
    old.setdefault(site, {}).update(now[site])
hash_file.write_text(json.dumps(old))
PY

pids=()
python3 "$HERE/../serve.py" "$JEKYLL" "$JP" & pids+=($!)
python3 "$HERE/../serve.py" "$ZOUT" "$ZP" & pids+=($!)
trap 'kill "${pids[@]}" 2>/dev/null' EXIT
sleep 1

if [ -n "${NOISE:-}" ]; then
  A=jekyll B=jekyll2 SITES="{\"jekyll\":\"http://127.0.0.1:$JP\",\"jekyll2\":\"http://localhost:$JP\"}"
else
  A=jekyll B=zola SITES="{\"jekyll\":\"http://127.0.0.1:$JP\",\"zola\":\"http://127.0.0.1:$ZP\"}"
fi
URLS=$SHOTS/urls.json SITES=$SITES OUT=$SHOTS JOBS=${JOBS:-2} nice -n 19 ionice -c 3 node "$HERE/shoot.cjs"
args=("$SHOTS" --a "$A" --b "$B" --preview "${PREVIEW_URL:-}")
if [ -z "${NOISE:-}" ]; then
  args+=(--baseline "$HERE/baseline.json")
  [ -n "${UPDATE_BASELINE:-}" ] && args+=(--update-baseline)
  [ -n "${ACCEPT_WORSE:-}" ] && args+=(--accept-worse)
fi
nice -n 19 ionice -c 3 "$HERE/compare.py" "${args[@]}"
echo "report: $SHOTS/$A-vs-$B/index.html"

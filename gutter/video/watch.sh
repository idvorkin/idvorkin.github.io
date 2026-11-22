#!/usr/bin/env bash
# Let an agent WATCH a video: frames, cuts, words and loudness on one timeline.
#   gutter/video/watch.sh VIDEO.mp4 OUT_DIR [STEP=0.5]
# Writes, then Read them:
#   OUT_DIR/sheet-N.png   contact sheets, one frame per STEP s, time stamped,
#                         6 frames a row (3 s a row at 0.5 s)
#   OUT_DIR/timeline.txt  per STEP: loudness (momentary LUFS), the words heard
#                         in that slot (whisperx, word-aligned), scene cuts
#   OUT_DIR/words.json    the raw whisperx alignment
set -euo pipefail
v=$1; out=$2; step=${3:-0.5}
mkdir -p "$out"; rm -f "$out"/f-*.png "$out"/sheet-*.png
caps=(nice -n 19 ionice -c 3 env OMP_NUM_THREADS=2 ORT_NUM_THREADS=2 MKL_NUM_THREADS=2)
fps=$(python3 -c "print(1/$step)")
"${caps[@]}" ffmpeg -v error -y -i "$v" -vf "fps=$fps,scale=480:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{pts\:hms}':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6" "$out/f-%04d.png"
# 6 x 4 frames per sheet
find "$out" -name 'f-*.png' | sort | split -l 24 - "$out/list-"
n=0; for l in "$out"/list-*; do n=$((n + 1)); mapfile -t fs <"$l"
  magick montage "${fs[@]}" -tile 6x -geometry +2+2 -background '#222' "$out/sheet-$n.png"; rm -f "$l"; done
# scene cuts
"${caps[@]}" ffmpeg -v info -i "$v" -vf "select='gt(scene,0.25)',showinfo" -f null - 2>&1 |
  grep -oE "pts_time:[0-9.]+" | cut -d: -f2 >"$out/cuts.txt" || true
# loudness, momentary every 0.1 s
ffmpeg -v info -nostats -i "$v" -af ebur128=peak=none -f null - 2>&1 |
  sed -nE 's/.* t: *([0-9.]+) .* M: *(-?[0-9.]+) .*/\1 \2/p' >"$out/loud.txt" || true
# words
"${caps[@]}" whisperx "$v" --model small --language en --compute_type int8 --output_format json \
  --output_dir "$out" >/dev/null 2>"$out/whisperx.err"
mv -f "$out/$(basename "${v%.*}").json" "$out/words.json"
python3 -I - "$out" "$step" <<'EOF'
import json, sys, math
out, step = sys.argv[1], float(sys.argv[2])
loud = [tuple(map(float, l.split())) for l in open(f"{out}/loud.txt") if l.strip()]
cuts = [float(x) for x in open(f"{out}/cuts.txt") if x.strip()]
words = [w for s in json.load(open(f"{out}/words.json"))["segments"] for w in s.get("words", []) if "start" in w]
end = max([t for t, _ in loud] + [w["end"] for w in words] + [0])
lines = ["  time  LUFS(M)  bar                    cut  words starting here"]
for i in range(math.ceil(end / step)):
    a, b = i * step, (i + 1) * step
    m = [x for t, x in loud if a <= t < b]
    lu = max(m) if m else -70
    bar = "#" * max(0, int((lu + 50) / 2))
    cut = "CUT" if any(a <= c < b for c in cuts) else ""
    ws = " ".join(f"{w['word']}@{w['start']:.2f}" for w in words if a <= w["start"] < b)
    lines.append(f"{a:6.1f}  {lu:7.1f}  {bar:<20}  {cut:3}  {ws}")
open(f"{out}/timeline.txt", "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
EOF
ls "$out"/sheet-*.png

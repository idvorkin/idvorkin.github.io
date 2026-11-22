#!/usr/bin/env bash
# Join the per-panel reveal clips into one 360p video.
#   gutter/video/stitch.sh OUT.mp4 reveal/p1.mp4@1.4:3.6 reveal/p2.mp4 ...
# An optional @START:END keeps only that span of a clip: cut the model's dead
# air before the first line (keep ~0.45 s before the first word so the pop
# plays) and after the last (~0.7 s, longer on the punchline). Every join gets
# a 60 ms audio fade so the ambience doesn't click.
set -euo pipefail
out=$1; shift
in=(); f=""; i=0
for arg in "$@"; do
  c=${arg%@*}; span=""
  [[ $arg == *@* ]] && span=${arg##*@}
  in+=(-i "$c")
  if [[ -n $span ]]; then a=${span%:*}; b=${span#*:}; else a=0; b=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c"); fi
  d=$(python3 -c "print(round($b - $a, 3))"); fo=$(python3 -c "print(round($d - 0.06, 3))")
  f+="[$i:v]trim=$a:$b,setpts=PTS-STARTPTS,fps=24,format=yuv420p,setsar=1[v$i];"
  f+="[$i:a]atrim=$a:$b,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.06,afade=t=out:st=$fo:d=0.06[a$i];"
  i=$((i + 1))
done
for ((j = 0; j < i; j++)); do f+="[v$j][a$j]"; done
f+="concat=n=$i:v=1:a=1[v][a]"
nice -n 19 ffmpeg -v error -y "${in[@]}" -filter_complex "$f" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration,size -of compact "$out"

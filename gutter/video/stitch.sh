#!/usr/bin/env bash
# Join the per-panel reveal clips into one 360p video.
#   gutter/video/stitch.sh OUT.mp4 reveal/p1.mp4 reveal/p2.mp4 ...
set -euo pipefail
out=$1; shift
in=(); f=""; i=0
for c in "$@"; do
  in+=(-i "$c")
  f+="[$i:v]fps=24,format=yuv420p,setsar=1[v$i];[$i:a]aresample=48000,aformat=channel_layouts=stereo[a$i];"
  i=$((i + 1))
done
for ((j = 0; j < i; j++)); do f+="[v$j][a$j]"; done
f+="concat=n=$i:v=1:a=1[v][a]"
nice -n 19 ffmpeg -v error -y "${in[@]}" -filter_complex "$f" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration,size -of compact "$out"

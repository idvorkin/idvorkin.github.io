#!/usr/bin/env bash
# Join panel clips and in-between clips into one strip video.
#   gutter/video/stitch.sh OUT.mp4 reveal/p1.mp4@1.4:3.6 +0.25 bridges/b12a.mp4 bridges/b12b.mp4 reveal/p2.mp4 ...
# Clips play in the order given. An optional @START:END keeps only that span
# of a clip: cut the model's dead air before the first line (keep ~0.45 s
# before the first word so the pop plays) and after the last (~0.7 s, longer
# on the punchline).
# A join is a hard cut unless a +SEC token stands between two clips: then the
# two overlap by SEC with a video crossfade and an audio crossfade. Use +0.25
# from a panel clip into its in-between clip, which also fades the panel's
# balloon away (the in-between starts on the bubble-free frame). Hard cuts get
# a 60 ms audio fade so the ambience doesn't click.
# Every clip is scaled to SIZE (default 640x360, what _data/den.json serves),
# 24 fps, 48 kHz stereo, so 720p in-betweens and 360p panel clips mix freely.
#   SIZE=1280x720 gutter/video/stitch.sh ...   for a bigger copy
set -euo pipefail
out=$1; shift
size=${SIZE:-640x360}; w=${size%x*}; h=${size#*x}
add() { python3 -c "print(round($1, 3))"; }
in=(); f=""; i=0; xf=(); lens=(); pending=0
for arg in "$@"; do
  if [[ $arg == +* ]]; then pending=${arg#+}; continue; fi
  c=${arg%@*}; span=""
  [[ $arg == *@* ]] && span=${arg##*@}
  in+=(-i "$c")
  if [[ -n $span ]]; then a=${span%:*}; b=${span#*:}; else a=0; b=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$c"); fi
  d=$(add "$b - $a"); fo=$(add "$d - 0.06")
  f+="[$i:v]trim=$a:$b,setpts=PTS-STARTPTS,scale=$w:$h,fps=24,format=yuv420p,setsar=1,settb=1/24[v$i];"
  f+="[$i:a]atrim=$a:$b,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.06,afade=t=out:st=$fo:d=0.06[a$i];"
  lens+=("$d"); xf+=("$pending"); pending=0
  i=$((i + 1))
done
# Join left to right: [cv][ca] is everything so far, L its length.
f+="[v0]copy[cv0];[a0]acopy[ca0];"; L=${lens[0]}
for ((j = 1; j < i; j++)); do
  x=${xf[$j]}; p=$((j - 1))
  if [[ $x != 0 ]]; then
    off=$(add "$L - $x")
    f+="[cv$p][v$j]xfade=transition=fade:duration=$x:offset=${off}[cv$j];"
    f+="[ca$p][a$j]acrossfade=d=${x}[ca$j];"
    L=$(add "$L + ${lens[$j]} - $x")
  else
    f+="[cv$p][ca$p][v$j][a$j]concat=n=2:v=1:a=1[cc$j][ca$j];[cc$j]settb=1/24[cv$j];"
    L=$(add "$L + ${lens[$j]}")
  fi
done
f=${f%;}
nice -n 19 ffmpeg -v error -y "${in[@]}" -filter_complex "$f" -map "[cv$((i - 1))]" -map "[ca$((i - 1))]" \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration,size -of compact "$out"

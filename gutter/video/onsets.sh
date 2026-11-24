#!/usr/bin/env bash
# Where does the model speak in each Omni clip? Prints whisperx word times and
# demucs vocal silences, which give revoice "at" and lettering_reveal
# "window"/"first"/"pins" (add the mix's 0.3 s lead to the reveal times).
#   cd RUN_DIR && gutter/video/onsets.sh p1 p2 p3 p4      # reads clips/pN.mp4
set -euo pipefail
caps=(env OMP_NUM_THREADS=2 ORT_NUM_THREADS=2 MKL_NUM_THREADS=2)
mkdir -p asr-clips
for n in "$@"; do
  nice -n 19 ionice -c 3 "${caps[@]}" whisperx "clips/$n.mp4" --model small --language en \
    --compute_type int8 --output_format json --output_dir asr-clips >/dev/null 2>"asr-clips/$n.err"
  python3 -I -c "
import json, sys
for g in json.load(open('asr-clips/$n.json'))['segments']:
    print('$n', ' '.join(f\"{w['word']}@{w.get('start', '?')}\" for w in g.get('words', [])))"
  d=sep-$n; mkdir -p "$d"
  ffmpeg -v error -y -i "clips/$n.mp4" -vn -ac 2 -ar 44100 "$d/a.wav"
  nice -n 19 ionice -c 3 "${caps[@]}" UV_HTTP_TIMEOUT=600 uv tool run --python 3.11 --from demucs==4.0.1 \
    --with "setuptools<81" --with "torch<2.2" --with "torchaudio<2.2" --with soundfile --with "numpy<2" \
    demucs -n htdemucs --two-stems vocals -o "$d" "$d/a.wav" >"$d/demucs.log" 2>&1
  echo "$n silences:" "$(ffmpeg -v info -i "$d/htdemucs/a/vocals.wav" -af silencedetect=n=-35dB:d=0.15 \
    -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | tr '\n' ' ')"
done

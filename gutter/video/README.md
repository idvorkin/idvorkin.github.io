# Den voiced video: the runbook

The commands, in order, that turn a shipped Den strip into its voiced 360p
video. Why each step is the way it is lives in `../recipe.md` (section
"Video: Gemini Omni"); this page is only the sequence. `den-021/` holds every
prompt and spec of a real run (Den #21 "Thinner", about \$0.43): copy it, then
edit the lines, rects and times.

Keys come from `SECRET_BOX` (`OPEN_ROUTER_KEY`, `ELEVEN_API_KEY`). Work in a
scratch run dir; `G` is this repo's `gutter/`.

1. **Panels.** `magick images/den/den-0NN-pK.webp src/pK.png` for each panel.
2. **Bubble specs** (`pK.json`, see `den-021/`). One `rect` per bubble in
   800 px panel coordinates, holding only that bubble. A white prop under the
   balloon (a whiteboard) gets caught by the paper test: split the rect into a
   body rect above the prop plus a tail rect. Check the masks on magenta before
   spending anything.
3. **Clean plates**, \$0.01 each:
   `openrouter-image.py @prompts/plate-pK.txt plate/pK-edit.png --model muse --aspect 1:1 --ref src/pK.png`
   (chop-conventions `skills/gen-image`), then
   `$G/lettering_reveal.py --plate pK.json plate/pK-edit.png plate/pK.png`
   in a plain numpy/scipy/pillow env. Word the fill per panel (what is really
   behind the balloon).
4. **Igor's lines first**: `$G/revoice.py say xBlr6Er6jnVgPIGgNJFO "line" lines/pK.wav`.
   Split a line with a pause into two files. Run every line through Parakeet on
   a silence-padded copy before mixing; one-word lines come back wrong.
   ElevenLabs speaks faster than Omni's mouths: after step 6, if a line ends
   well before the model's speech does, re-make it with `--speed=0.75`–`0.8`.
5. **Omni**, one clip per panel, in parallel:
   `$G/omni.py plate/pK.png prompts/pK.txt --duration 4 --seed NN --out-dir clips --name pK`.
   Prompts follow the skeleton in `recipe.md`; pin the gag's props and say who
   is NOT in the panel. About \$0.023 per second. A dead poll: `--resume <id>`.
6. **Where the model speaks**: `$G/video/onsets.sh p1 p2 p3 p4`.
7. **Mix** (`mix-pK.json`): each ElevenLabs line goes `"at"` the model's vocal
   onset; `"keep"` spans keep Larry's Omni voice; `"lead": 0.3`.
   `$G/revoice.py mix mix-pK.json`. A panel with no re-voiced line still gets
   a mix (keep only, no lines) for the lead.
8. **Reveal**: add `window`/`first`/`pins` (onset + 0.3) to `pK.json`, then
   `UV_CONSTRAINT=constraints.txt $G/lettering_reveal.py pK.json` with
   constraints `torch==2.5.1`, `torchaudio==2.5.1`, `transformers<4.50`.
   Check every `reveal/pK-words.png`.
9. **Loudness**: `ffmpeg -i reveal/pK.mp4 -af volumedetect -vn -f null -`. Omni's
   Larry ran 7 dB under the ElevenLabs lines on Den #21; lift it with
   `-c:v copy -af "volume=6dB,alimiter=limit=0.95"`.
10. **Stitch**, trimming each clip to its line:
    `$G/video/stitch.sh final/den-0NN-<slug>-voiced-360p.mp4 reveal/p1.mp4@1.4:3.6 …`.
    Omni pads every clip with silence; untrimmed, Den #21 opened on 1.8 s of
    nothing and had 3 s gaps between panels (18 s cut to 11 s).
11. **Watch it** before shipping: `$G/video/watch.sh final/….mp4 watch/`, then
    Read `watch/sheet-*.png` (a time-stamped frame every 0.5 s) and
    `watch/timeline.txt` (loudness, words and cuts per 0.5 s). Look for dead air,
    a bubble up long before its words, voices more than ~4 LU apart, and
    blinks that fill a lens. For lips, crop the face from the clip at 5 fps.
12. **Ship**: the mp4 goes to idvorkin/blob `blog/den/` by PR from the
    idvorkin-ai-tools fork; then a blog PR adds `video` and `video_poster` to the
    strip in `_data/den.json`, the poster being panel 1 pillarboxed:
    `magick -size 1280x720 xc:'#F7F0D4' \( den-0NN-p1.webp -resize 720x720 \) -gravity center -composite -quality 82 den-0NN-video-poster.webp`.

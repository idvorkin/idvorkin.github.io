#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["whisperx==3.3.4", "numpy", "scipy", "pillow"]
# ///
"""Reveal a panel's drawn lettering word by word, in sync with the clip's speech.

    gutter/lettering_reveal.py SPEC.json
    gutter/lettering_reveal.py --plate SPEC.json EDIT.png OUT.png   # bubble-free first frame

The clip is a Gemini Omni clip of a pillarboxed panel (see recipe.md, Video).
Every bubble is the SOURCE panel's bubble: it pops in as its speaker starts,
each drawn word appears at the moment it is said, and the full line stays up.

Timing is a forced alignment of the DRAWN text (not a transcription) against the
clip audio with whisperx's wav2vec2 aligner. Each drawn word gets a spoken form:
punctuation stripped, "@" -> "at", or a per-bubble "say" list for anything else.

SPEC (paths relative to the spec file):
{
  "clip": "clips/p3.mp4", "panel": "src/p3.webp", "out": "reveal/p3.mp4",
  "panel_box": [140, 0, 360],          # x, y, size of the panel in the video
  "captions": [[30, 20, 400, 112]],    # unspoken lettering on the art: always shown
  "bubbles": [                         # in SPOKEN order
    {"rect": [92,120,310,292], "text": "You are wonderful!", "mode": "reveal"},
    {"rect": [510,105,765,302], "text": "You Kiss Like A Slobbering Dog", "mode": "reveal"}
  ]
}
Optional "audio": a separate track (e.g. a re-voiced mix) to align against and mux in.
mode: "reveal" (spoken in this clip), "full" (already said), "empty" (not yet said).
"pop" (default true): a bubble is invisible until its speaker starts, then pops
in from its tail (lowest point, or "tail": [x, y]) over 0.25 s with a small
overshoot, the first word landing as it settles; "empty" bubbles stay hidden.
This needs a bubble-free clip underneath (see --plate). "pop": false keeps blank
paper up from frame one, for clips whose model drew its own bubbles.
Rects are in source-panel pixels and must hold only that bubble; a bubble's
"rect" may be a list of rects (body plus thought circles). Keep them off lamps. A debug sheet of the word boxes is written
next to the output as *-words.png: check it.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

SPOKEN = {"@": "at", "&": "and", "+": "plus"}


def spoken_form(word: str) -> str:
    if word in SPOKEN:
        return SPOKEN[word]
    return re.sub(r"[^a-z0-9' ]", "", word.lower().replace("’", "'")).strip("'")


# ---------- masks and words, at source-panel scale ----------


def bubble_mask(img: np.ndarray, rect) -> np.ndarray:
    """Paper (pale, low saturation) inside rect, holes filled, grown over the outline.
    rect may be a list of rects (a thought bubble's body plus its trail of circles)."""
    rects = rect if isinstance(rect[0], list) else [rect]
    paper = (img.min(axis=2) > 105) & (img.max(axis=2) - img.min(axis=2) < 45)
    m = np.zeros(paper.shape, bool)
    for x0, y0, x1, y1 in rects:
        m[y0:y1, x0:x1] = paper[y0:y1, x0:x1]
    m = ndi.binary_fill_holes(ndi.binary_closing(m, iterations=2))
    lab, n = ndi.label(m)
    sizes = ndi.sum(m, lab, range(1, n + 1))
    m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 80])
    return ndi.binary_dilation(m, iterations=5)


def caption_mask(img: np.ndarray, rect) -> np.ndarray:
    x0, y0, x1, y1 = rect
    light = img.min(axis=2) > 170
    m = np.zeros(light.shape, bool)
    m[y0:y1, x0:x1] = light[y0:y1, x0:x1]
    return ndi.binary_dilation(
        m, iterations=14
    )  # covers the model's own re-drawn caption


def ink_in(img: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Lettering ink: dark pixels well inside the bubble (the outline is eroded away)."""
    inner = ndi.binary_erosion(ndi.binary_fill_holes(mask), iterations=14)
    lum = img.mean(axis=2)
    return inner & (lum < 120)


def _runs(flags: np.ndarray, min_len: int = 1):
    lab, n = ndi.label(flags)
    out = [np.flatnonzero(lab == i + 1) for i in range(n)]
    return [(r[0], r[-1]) for r in out if r[-1] - r[0] + 1 >= min_len]


def word_boxes(ink: np.ndarray, n_words: int):
    """Split ink into lines, then words; return (how, boxes) in reading order.

    Lines: rows whose ink count clears a fraction of the busiest row. Tightly
    leaded lettering touches between lines (ascender over descender), so the
    fraction is raised until the lines separate. Words: column gaps wider than
    a threshold, raised until the count equals the drawn word count."""
    profile = ink.sum(axis=1)
    for frac in (0.0, 0.02, 0.05, 0.08, 0.12, 0.16, 0.2):
        lines = _runs(profile > frac * profile.max(), min_len=6)
        heights = [y1 - y0 for y0, y1 in lines]
        if not lines or max(heights) > 2.2 * np.median(heights):
            continue  # two lines still merged into one
        per_line = []
        for li, (y0, y1) in enumerate(lines):
            # Grow the band back out for ascenders and descenders, but only to the
            # midpoint of the gap to the next line, or a word's box shows the tops
            # of the words under it.
            pad = int(0.35 * (y1 - y0))
            ya = (lines[li - 1][1] + y0) // 2 + 1 if li else max(y0 - pad, 0)
            yb = (
                (y1 + lines[li + 1][0]) // 2
                if li + 1 < len(lines)
                else min(y1 + pad, ink.shape[0] - 1)
            )
            runs = _runs(ink[y0 : y1 + 1].any(axis=0))
            per_line.append((ya, yb, runs))
        for gap in range(
            40, 2, -1
        ):  # widest gap first: punctuation stays with its word
            boxes = []
            for ya, yb, runs in per_line:
                cur = list(runs[0])
                for r in runs[1:]:
                    if r[0] - cur[1] - 1 >= gap:
                        boxes.append((cur[0], ya, cur[1], yb))
                        cur = list(r)
                    else:
                        cur[1] = r[1]
                boxes.append((cur[0], ya, cur[1], yb))
            if len(boxes) == n_words:
                return (
                    f"{len(lines)} lines, row cut {frac:.2f}, word gap {gap}px",
                    boxes,
                )
            if len(boxes) > n_words:
                break
    sys.exit(f"could not split ink into {n_words} words")


def empty_paper(img: np.ndarray, ink: np.ndarray) -> np.ndarray:
    """The bubble with its lettering painted out by the surrounding paper."""
    grown = ndi.binary_dilation(ink, iterations=3)
    out = img.copy()
    # nearest non-ink pixel's color, smoothed
    idx = ndi.distance_transform_edt(grown, return_distances=False, return_indices=True)
    filled = img[idx[0], idx[1]]
    out[grown] = filled[grown]
    soft = np.stack(
        [ndi.uniform_filter(out[..., c].astype(float), 7) for c in range(3)], -1
    )
    out[grown] = soft[grown]
    return out


# ---------- timing ----------


def heard_segments(clip: Path):
    """Transcribe once, only to find WHERE speech is. Uses the whisperx uv-tool
    CLI: in this script's own env its pyannote VAD fails to unpickle."""
    import os
    import shutil
    import tempfile

    path = os.pathsep.join(
        d for d in os.environ["PATH"].split(os.pathsep) if not d.startswith(sys.prefix)
    )  # not this env's copy
    cli = shutil.which("whisperx", path=path) or sys.exit(
        "needs `uv tool install whisperx`"
    )
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            [
                cli,
                str(clip),
                "--model",
                "small",
                "--language",
                "en",
                "--compute_type",
                "int8",
                "--output_format",
                "json",
                "--output_dir",
                tmp,
            ],
            check=True,
            capture_output=True,
        )
        return json.loads((Path(tmp) / f"{clip.stem}.json").read_text())["segments"]


def windows(heard, counts, dur):
    """Give each bubble a contiguous run of heard segments, in order, choosing the
    split whose heard word counts best match the drawn ones. Fewer segments than
    bubbles: everyone shares the whole speech span (align() then aligns them
    together, in order)."""
    span = (heard[0]["start"], heard[-1]["end"]) if heard else (0.0, dur)
    k, n = len(counts), len(heard)
    if n < k:
        return [span] * k
    hw = [len(h["text"].split()) for h in heard]
    best = None

    def rec(i, j, cuts, cost):  # bubble j starts at segment i
        nonlocal best
        if j == k - 1:
            c = cost + abs(sum(hw[i:]) - counts[j])
            if best is None or c < best[0]:
                best = (c, cuts + [(i, n)])
            return
        for e in range(i + 1, n - (k - j - 1) + 1):
            rec(e, j + 1, cuts + [(i, e)], cost + abs(sum(hw[i:e]) - counts[j]))

    rec(0, 0, [], 0)
    return [(heard[a]["start"], heard[b - 1]["end"]) for a, b in best[1]]


def align(clip: Path, bubbles: list[list[str]]):
    """Forced-align each bubble's DRAWN words (spoken forms) inside its window."""
    import whisperx  # heavy; import late

    audio = whisperx.load_audio(str(clip))
    dur = len(audio) / 16000
    heard = heard_segments(clip)
    print(
        f"  heard: {' / '.join(f'{h["start"]:.2f}-{h["end"]:.2f} {h["text"].strip()}' for h in heard)}"
    )
    model, meta = whisperx.load_align_model(language_code="en", device="cpu")
    # Bubbles that share a window (fewer heard segments than bubbles) are aligned
    # as ONE run of their concatenated words, so they keep their spoken order
    # instead of each matching the same audio.
    runs = []  # (words, window)
    for words, win in zip(bubbles, windows(heard, [len(b) for b in bubbles], dur)):
        if runs and runs[-1][1] == win:
            runs[-1][0].extend(words)
        else:
            runs.append((list(words), win))
    starts, scores = [], []
    for words, (w0, w1) in runs:
        t0, t1 = max(w0 - 0.15, 0.0), min(w1 + 0.3, dur)
        seg = [{"text": " ".join(words), "start": t0, "end": t1}]
        got = whisperx.align(
            seg, model, meta, audio, "cpu", return_char_alignments=False
        )["word_segments"]
        if len(got) != len(words):
            sys.exit(f"aligner returned {len(got)} words for {len(words)}")
        st = [w.get("start") for w in got]
        for i, s in enumerate(st):  # an unalignable token takes its neighbor's time
            if s is None:
                st[i] = next((x for x in st[i + 1 :] if x is not None), t1)
        st[0] = max(st[0], t0)
        # wav2vec2 lets the first word swallow the silence before it: it "starts"
        # at the window edge, up to 0.4 s before the voice. Cap it from the next
        # word's start at about 0.1 s plus 0.06 s a letter. Only the first word:
        # capping every word from its own end pushed a last word ("Dog") late,
        # because last words swallow the trailing sound too.
        if len(st) > 1:
            st[0] = max(st[0], st[1] - (0.1 + 0.06 * len(words[0])))
        starts += st
        scores += [w.get("score") for w in got]
    return starts, scores


# ---------- render ----------


def plate(spec_path: Path, edit: Path, out: Path) -> None:
    """Bubble-free first frame: the source panel everywhere except inside the
    bubbles (grown 10 px, feathered), where an image-edit's background shows.
    The edit (a Muse "same picture, balloons removed" call) is only trusted
    inside the masks, so the characters stay pixel-identical."""
    spec = json.loads(spec_path.read_text())
    src_img = Image.open(spec_path.parent / spec["panel"]).convert("RGB")
    src = np.asarray(src_img).astype(np.float32)
    ed = np.asarray(
        Image.open(edit).convert("RGB").resize(src_img.size, Image.LANCZOS)
    ).astype(np.float32)
    m = np.zeros(src.shape[:2], bool)
    for b in spec["bubbles"]:
        m |= bubble_mask(src.astype(np.uint8), b["rect"])
    m = ndi.binary_dilation(m, iterations=10)
    for x0, y0, x1, y1 in spec.get("plate_extra", []):  # specks the paper test misses
        m[y0:y1, x0:x1] = True
    a = ndi.gaussian_filter(m.astype(float), 4)[..., None]
    Image.fromarray((src * (1 - a) + ed * a).clip(0, 255).astype(np.uint8)).save(out)
    print(f"wrote {out}")


POP_S = 0.25  # pop length; the first word lands as it settles


def ease_out_back(u: float) -> float:
    """0 -> 1 with about a 10% overshoot before settling."""
    c1 = 1.70158
    return 1 + (c1 + 1) * (u - 1) ** 3 + c1 * (u - 1) ** 2


def scale_about(img: np.ndarray, s: float, ay: float, ax: float) -> np.ndarray:
    """Scale an HxW(xC) layer by s about (ay, ax), keeping the canvas size."""
    s = max(s, 0.02)
    m, off = [1 / s, 1 / s], [ay - ay / s, ax - ax / s]
    if img.ndim == 2:
        return ndi.affine_transform(img, m, offset=off, order=1)
    return np.stack(
        [
            ndi.affine_transform(img[..., c], m, offset=off, order=1)
            for c in range(img.shape[2])
        ],
        -1,
    )


def main() -> None:
    if sys.argv[1] == "--plate":
        plate(Path(sys.argv[2]).resolve(), Path(sys.argv[3]), Path(sys.argv[4]))
        return
    spec_path = Path(sys.argv[1]).resolve()
    base = spec_path.parent
    spec = json.loads(spec_path.read_text())
    clip, out = base / spec["clip"], base / spec["out"]
    out.parent.mkdir(parents=True, exist_ok=True)
    src = np.asarray(Image.open(base / spec["panel"]).convert("RGB")).astype(np.uint8)
    px, py, size = spec["panel_box"]
    pop = spec.get("pop", True)
    k = size / src.shape[0]

    cap = np.zeros(src.shape[:2], bool)
    for r in spec.get("captions", []):
        cap |= caption_mask(src, r)
    blank = src.copy()
    bubbles = []  # per bubble: mode, mask, tail, words [(drawn, spoken, box)]
    debug = Image.fromarray(src).convert("RGB")
    dd = ImageDraw.Draw(debug)
    for bi, b in enumerate(spec["bubbles"]):
        mode = b.get("mode", "reveal")
        m = bubble_mask(src, b["rect"])
        drawn = b["text"].split()
        say = b.get("say") or [spoken_form(w) for w in drawn]
        if len(say) != len(drawn):
            sys.exit(f"bubble {bi}: 'say' has {len(say)} words, text has {len(drawn)}")
        ink = ink_in(src, m)
        if mode != "full":
            blank = np.where(m[..., None], empty_paper(src, ink), blank)
        ys, xs = np.nonzero(m)
        tail = b.get("tail") or [
            float(xs[ys == ys.max()].mean()),
            float(ys.max()),
        ]  # lowest point
        words = []
        if mode == "reveal":
            how, boxes = word_boxes(ink, len(drawn))
            print(f"bubble {bi}: {len(drawn)} words, {how}")
            words = list(zip(drawn, say, boxes))
            for box in boxes:
                dd.rectangle(box, outline=(255, 0, 255), width=2)
        dd.ellipse(
            [tail[0] - 8, tail[1] - 8, tail[0] + 8, tail[1] + 8],
            outline=(0, 255, 255),
            width=3,
        )
        bubbles.append({"mode": mode, "mask": m, "tail": tail, "words": words})
    debug.save(out.with_name(out.stem + "-words.png"))

    audio_src = (
        base / spec["audio"] if spec.get("audio") else clip
    )  # e.g. a re-voiced mix
    talkers = [b for b in bubbles if b["words"]]
    if talkers:
        starts, scores = align(audio_src, [[w[1] for w in b["words"]] for b in talkers])
        i = 0
        for b in talkers:
            b["starts"] = starts[i : i + len(b["words"])]
            for (w, sp, _), t, sc in zip(
                b["words"], b["starts"], scores[i : i + len(b["words"])]
            ):
                print(
                    f"  {t:6.2f}s  {w:<14} ({sp}, score {sc if sc is None else round(sc, 2)})"
                )
            i += len(b["words"])
            b["done"] = b["starts"][-1] + 0.4

    def small(a):
        return np.asarray(
            Image.fromarray(a).resize((size, size), Image.LANCZOS)
        ).astype(np.float32)

    def small_mask(m):
        return (
            small((ndi.gaussian_filter(m.astype(float), 1) * 255).astype(np.uint8))
            / 255
        )

    full_s, blank_s = small(src), small(blank)
    cap_s = small_mask(cap)[..., None]
    for b in bubbles:
        b["a"] = small_mask(b["mask"])
        b["ws"] = []
        for _, _, (x0, y0, x1, y1) in b["words"]:
            wm = np.zeros(src.shape[:2], np.uint8)
            wm[y0 : y1 + 1, max(x0 - 4, 0) : x1 + 5] = (
                255  # rows already reach the line midpoints
            )
            b["ws"].append(small(wm) / 255)
        b["ty"], b["tx"] = b["tail"][1] * k, b["tail"][0] * k

    probe = json.loads(
        subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-select_streams",
                "v:0",
                "-show_entries",
                "stream=width,height,r_frame_rate",
                "-of",
                "json",
                str(clip),
            ],
            capture_output=True,
            text=True,
            check=True,
        ).stdout
    )["streams"][0]
    W, H = probe["width"], probe["height"]
    num, den = map(int, probe["r_frame_rate"].split("/"))
    fps = num / den
    dec = subprocess.Popen(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(clip),
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ],
        stdout=subprocess.PIPE,
    )
    enc = subprocess.Popen(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-s",
            f"{W}x{H}",
            "-r",
            probe["r_frame_rate"],
            "-i",
            "-",
            "-i",
            str(audio_src),
            "-map",
            "0:v",
            "-map",
            "1:a?",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "slow",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-shortest",
            str(out),
        ],
        stdin=subprocess.PIPE,
    )
    n = 0
    while True:
        buf = dec.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        frame = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
        t = n / fps
        pan = frame[py : py + size, px : px + size]
        pan = pan * (1 - cap_s) + full_s * cap_s  # captions: always up
        for b in bubbles:
            if b["mode"] == "full":
                s = 1.0
            elif b["mode"] == "empty":
                s = 0.0 if pop else 1.0  # without pop: blank paper, as before
            else:
                t0 = b["starts"][0]
                p0 = max(t0 - POP_S, 0.0)
                s = (
                    1.0
                    if not pop or t >= t0
                    else (
                        0.0 if t < p0 else ease_out_back((t - p0) / max(t0 - p0, 1e-3))
                    )
                )
            if s <= 0:
                continue
            r = np.zeros((size, size), np.float32)
            for ws, st in zip(b["ws"], b.get("starts", [])):
                if t >= st:
                    r = np.maximum(r, ws)
            if t >= b.get("done", 1e9):  # any stroke outside a box
                r = np.maximum(r, b["a"])
            layer = blank_s * (1 - r[..., None]) + full_s * r[..., None]
            a = b["a"]
            if s != 1.0:
                layer, a = (
                    scale_about(layer, s, b["ty"], b["tx"]),
                    scale_about(a, s, b["ty"], b["tx"]),
                )
            pan = pan * (1 - a[..., None]) + layer * a[..., None]
        frame[py : py + size, px : px + size] = pan
        enc.stdin.write(frame.clip(0, 255).astype(np.uint8).tobytes())
        n += 1
    enc.stdin.close()
    enc.wait()
    dec.wait()
    print(f"wrote {out} ({n} frames)")


if __name__ == "__main__":
    main()

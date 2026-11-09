#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Re-voice an Omni clip: ElevenLabs lines over the clip's own ambience.

    gutter/revoice.py say VOICE_ID "the line" OUT.wav [--inner]
        One ElevenLabs line (eleven_multilingual_v2). Prints its length and the
        characters billed. --inner makes it a quiet thought voice (closer, softer,
        a touch of room) for thought bubbles.

    gutter/revoice.py mix SPEC.json
        {"clip": "clips/p3.mp4", "out": "voiced/p3.mp4",
         "keep": [[3.1, 5.2]],               # spans of the model's OWN voice to keep (other speakers)
         "lines": [{"file": "lines/igor-p3.wav", "at": 0.12}],
         "lead": 0.3}                        # optional: hold frame one first (room for a bubble pop)
        Splits the clip's audio into voice and ambience with demucs (htdemucs,
        two stems), keeps the ambience whole, keeps the model's voice only inside
        "keep", lays each line in at "at" seconds, and muxes it under the clip's
        video. If the audio runs past the video, the last frame is held.

Key: $ELEVEN_API_KEY, else ELEVEN_API_KEY in the JSON file named by $SECRET_BOX.
Never printed. Paths in a spec are relative to the spec file.
"""

import json
import os
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

MODEL = "eleven_multilingual_v2"
SPOKEN = {
    "stability": 0.45,
    "similarity_boost": 0.8,
    "style": 0.25,
    "use_speaker_boost": True,
}
INNER = {
    "stability": 0.65,
    "similarity_boost": 0.8,
    "style": 0.05,
    "use_speaker_boost": True,
}
DEMUCS = [
    "uv",
    "tool",
    "run",
    "--python",
    "3.11",
    "--from",
    "demucs==4.0.1",  # 4.1 pulls sphn, which fails to build on Linux aarch64
    "--with",
    "setuptools<81",  # demucs's torch imports pkg_resources
    "--with",
    "torch<2.2",
    "--with",
    "torchaudio<2.2",
    "--with",
    "soundfile",
    "--with",
    "numpy<2",
    "demucs",
]


def key() -> str:
    k = os.environ.get("ELEVEN_API_KEY")
    if not k and os.environ.get("SECRET_BOX"):
        k = json.loads(Path(os.environ["SECRET_BOX"]).read_text()).get("ELEVEN_API_KEY")
    return k or sys.exit("no key: set ELEVEN_API_KEY or SECRET_BOX")


def run(*cmd: str) -> str:
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def duration(path: Path) -> float:
    return float(
        run(
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            str(path),
        )
    )


def say(voice: str, text: str, out: Path, inner: bool) -> None:
    body = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": INNER if inner else SPOKEN,
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key(), "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        mp3 = r.read()
        chars = (
            r.headers.get("character-cost")
            or r.headers.get("x-character-count")
            or len(text)
        )
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".mp3") as f:
        f.write(mp3)
        f.flush()
        # trim leading silence so "at" places the first syllable. Not the tail:
        # the areverse+silenceremove trick ate whole words ("Larry. It's me." -> "It's me.").
        af = "silenceremove=start_periods=1:start_threshold=-45dB"
        if inner:  # a thought: softer, closer, a little room
            af += ",highpass=f=120,lowpass=f=6500,aecho=0.8:0.6:40:0.18,volume=-3dB"
        run(
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            f.name,
            "-af",
            af,
            "-ar",
            "44100",
            "-ac",
            "2",
            str(out),
        )
    print(f"{out} {duration(out):.2f}s chars={chars}")


def mix(spec_path: Path) -> None:
    base = spec_path.parent
    spec = json.loads(spec_path.read_text())
    clip, out = base / spec["clip"], base / spec["out"]
    out.parent.mkdir(parents=True, exist_ok=True)
    vdur = duration(clip)
    with tempfile.TemporaryDirectory() as tmp:
        t = Path(tmp)
        run(
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(clip),
            "-vn",
            "-ac",
            "2",
            "-ar",
            "44100",
            str(t / "a.wav"),
        )
        run(
            *DEMUCS,
            "-n",
            "htdemucs",
            "--two-stems",
            "vocals",
            "-o",
            str(t / "sep"),
            str(t / "a.wav"),
        )
        voc, amb = t / "sep/htdemucs/a/vocals.wav", t / "sep/htdemucs/a/no_vocals.wav"
        keep = spec.get("keep", [])
        gate = "+".join(f"between(t,{a},{b})" for a, b in keep) or "0"
        inputs = ["-i", str(amb), "-i", str(voc)]
        parts = ["[0:a]apad[amb]", f"[1:a]volume='if({gate},1,0)':eval=frame,apad[voc]"]
        labels = ["[amb]", "[voc]"]
        end = vdur
        for i, ln in enumerate(spec.get("lines", [])):
            f = base / ln["file"]
            inputs += ["-i", str(f)]
            ms = int(ln["at"] * 1000)
            parts.append(
                f"[{i + 2}:a]adelay={ms}|{ms},volume={ln.get('gain', 1.0)},apad[l{i}]"
            )
            labels.append(f"[l{i}]")
            end = max(end, ln["at"] + duration(f) + 0.4)
        parts.append(
            f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,"
            f"atrim=0:{end:.3f},alimiter=limit=0.95[mix]"
        )
        run(
            "ffmpeg",
            "-v",
            "error",
            "-y",
            *inputs,
            "-filter_complex",
            ";".join(parts),
            "-map",
            "[mix]",
            str(t / "mix.wav"),
        )
        hold = max(end - vdur, 0)
        lead = spec.get("lead", 0.0)  # hold the first frame so a bubble has time to pop
        vf = f"tpad=start_mode=clone:start_duration={lead:.3f}:stop_mode=clone:stop_duration={hold:.3f}"
        ms = int(lead * 1000)
        run(
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(clip),
            "-i",
            str(t / "mix.wav"),
            "-map",
            "0:v",
            "-map",
            "1:a",
            "-vf",
            vf,
            "-af",
            f"adelay={ms}|{ms}",
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
            "-t",
            f"{end + lead:.3f}",
            str(out),
        )
    print(f"wrote {out} ({end + lead:.2f}s, lead {lead:.2f}s, video held {hold:.2f}s)")


if __name__ == "__main__":
    if len(sys.argv) >= 5 and sys.argv[1] == "say":
        say(sys.argv[2], sys.argv[3], Path(sys.argv[4]), "--inner" in sys.argv[5:])
    elif len(sys.argv) == 3 and sys.argv[1] == "mix":
        mix(Path(sys.argv[2]).resolve())
    else:
        sys.exit(__doc__)

#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""In-between clip with Gemini Omni, called direct on the Gemini API.

    gutter/omni_direct.py FIRST.png LAST.png PROMPT_FILE OUT.mp4 [--duration 4] [--resolution 360p]

Omni animates from FIRST to LAST (first+last frame interpolation, 3-10 s).
This is the call that works: POST /v1beta/interactions with model
gemini-omni-1.2-flash and an input list of [first image, last image, text]
(https://ai.google.dev/gemini-api/docs/omni). The same frames sent to
OpenRouter's google/gemini-omni-1.2-flash with frame_images first_frame +
last_frame fail with "Video generation failed" (3 of 3, 2026-11-22, unbilled).
Frames are sent as-is: pass 1280x720 pillarboxed png files. The answer is
synchronous (about 30-40 s); the script polls if it isn't. Writes OUT.mp4
and OUT.mp4.json (the response with the video data cut out). The Gemini API
returns tokens, not a price. Key: "gemini-key" in the JSON file named by
$SECRET_BOX, or $GEMINI_API_KEY. Never printed.
"""

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODEL = "gemini-omni-1.2-flash"


def api_key() -> str:
    key = os.environ.get("GEMINI_API_KEY")
    if not key and os.environ.get("SECRET_BOX"):
        key = json.loads(Path(os.environ["SECRET_BOX"]).read_text()).get("gemini-key")
    if not key:
        sys.exit("no key: set GEMINI_API_KEY or SECRET_BOX")
    return key


def strip(o):
    if isinstance(o, dict):
        return {k: "<cut>" if k == "data" else strip(v) for k, v in o.items()}
    if isinstance(o, list):
        return [strip(x) for x in o]
    return o


def main() -> None:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("first")
    p.add_argument("last")
    p.add_argument("prompt_file")
    p.add_argument("out", type=Path)
    p.add_argument("--duration", type=int, default=4, help="3-10 seconds")
    p.add_argument("--resolution", default="360p", choices=["360p", "720p"])
    p.add_argument("--model", default=MODEL)
    a = p.parse_args()
    key = api_key()

    def image(path: str) -> dict:
        mime = "image/png" if path.lower().endswith(".png") else "image/jpeg"
        return {
            "type": "image",
            "data": base64.b64encode(Path(path).read_bytes()).decode(),
            "mime_type": mime,
        }

    body = {
        "model": a.model,
        "input": [
            image(a.first),
            image(a.last),
            {"type": "text", "text": Path(a.prompt_file).read_text()},
        ],
        "response_format": {
            "type": "video",
            "duration": f"{a.duration}s",
            "resolution": a.resolution,
            "aspect_ratio": "16:9",
        },
    }
    headers = {"Content-Type": "application/json", "x-goog-api-key": key}
    t0 = time.time()
    try:
        req = urllib.request.Request(URL, json.dumps(body).encode(), headers)
        r = json.load(urllib.request.urlopen(req, timeout=600))
        while r.get("status") not in ("completed", "failed", "cancelled"):
            time.sleep(15)
            req = urllib.request.Request(f"{URL}/{r['id']}", headers=headers)
            r = json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:2000]}")
    Path(f"{a.out}.json").write_text(json.dumps(strip(r), indent=1))
    usage = r.get("usage", {})
    print(
        f"[{a.out.name}] model={a.model} status={r.get('status')} "
        f"secs={round(time.time() - t0)} output_tokens={usage.get('total_output_tokens')}"
    )
    for step in r.get("steps", []):
        for c in step.get("content", []) if step.get("type") == "model_output" else []:
            if c.get("type") == "video":
                a.out.write_bytes(base64.b64decode(c["data"]))
                print(f"saved {a.out}")
                return
    sys.exit("no video in the response; see " + f"{a.out}.json")


if __name__ == "__main__":
    main()

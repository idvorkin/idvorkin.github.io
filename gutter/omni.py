#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Animate one finished panel with Gemini Omni on OpenRouter: submit, poll, download.

    gutter/omni.py PANEL PROMPT_FILE --duration 5 --out-dir tmp/x --name p1 \
        [--last LAST_PANEL] [--resolution 360p] [--seed 15] [--aspect 16:9] \
        [--no-pillarbox] [--no-audio]

PANEL is a local image (sent as a data URI) or a public https URL. Local square
panels are pillarboxed onto the contract cream (#F7F0D4) at 1280x720 (or
720x1280 for 9:16) with `magick` first, unless --no-pillarbox. Writes
OUT_DIR/NAME.mp4, OUT_DIR/NAME-frame.jpg and OUT_DIR/logs/NAME-{submit,final}.json,
and prints the billed usage.cost. Key: $OPENROUTER_API_KEY, else
$OPEN_ROUTER_KEY, else OPEN_ROUTER_KEY in the JSON file named by $SECRET_BOX.
The key is never printed.
"""

import argparse
import base64
import json
import mimetypes
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://openrouter.ai/api/v1"
MODEL = "google/gemini-omni-1.2-flash"
CREAM = "#F7F0D4"
TERMINAL = ("completed", "failed", "cancelled", "expired")


def api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPEN_ROUTER_KEY")
    if not key and os.environ.get("SECRET_BOX"):
        key = json.loads(Path(os.environ["SECRET_BOX"]).read_text()).get(
            "OPEN_ROUTER_KEY"
        )
    if not key:
        sys.exit("no key: set OPENROUTER_API_KEY, OPEN_ROUTER_KEY or SECRET_BOX")
    return key


def call(key: str, url: str, body: dict | None = None, raw: bool = False):
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST" if body is not None else "GET",
    )
    # Only GETs retry. A submit that errors or times out may already have
    # created (and billed) a job, so a retry could pay for it twice.
    tries = 3 if body is None else 1
    hint = (
        "" if body is None else " (the job may exist: check OpenRouter, then --resume)"
    )
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
            return data if raw else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code >= 500 and attempt < tries - 1:
                time.sleep(10)
                continue
            sys.exit(
                f"HTTP {e.code} from {url.split('?')[0]}: {e.read().decode()[:2000]}{hint}"
            )
        except (
            urllib.error.URLError,
            TimeoutError,
        ) as e:  # a slow poll read raises bare TimeoutError
            if attempt < tries - 1:
                time.sleep(10)
                continue
            sys.exit(f"network error: {e}{hint}")


def frame(src: str, out_dir: Path, name: str, aspect: str, pillarbox: bool) -> str:
    if src.startswith("https://"):
        return src
    path = Path(src)
    if pillarbox:
        w, h = (1280, 720) if aspect == "16:9" else (720, 1280)
        side = min(w, h)
        padded = out_dir / f"{name}-frame.jpg"
        subprocess.run(
            [
                "magick",
                "-size",
                f"{w}x{h}",
                f"xc:{CREAM}",
                "(",
                str(path),
                "-resize",
                f"{side}x{side}",
                ")",
                "-gravity",
                "center",
                "-composite",
                "-quality",
                "92",
                str(padded),
            ],
            check=True,
        )
        path = padded
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def main() -> None:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("panel", help="first-frame image: local path or public https URL")
    p.add_argument("prompt_file")
    p.add_argument("--duration", type=int, required=True, help="3-15 seconds")
    p.add_argument("--out-dir", type=Path, required=True)
    p.add_argument("--name", help="clip name (default: panel file stem)")
    p.add_argument("--last", help="optional last-frame image")
    p.add_argument(
        "--resolution", default="360p", choices=["360p", "720p", "1080p", "4K"]
    )
    p.add_argument("--seed", type=int, default=15)
    p.add_argument("--aspect", default="16:9", choices=["16:9", "9:16"])
    p.add_argument("--no-pillarbox", action="store_true")
    p.add_argument(
        "--no-audio",
        action="store_true",
        help="saves nothing: Omni only bills with-audio",
    )
    p.add_argument(
        "--resume",
        metavar="JOB_ID",
        help="skip submit; poll and download an already-submitted job",
    )
    a = p.parse_args()

    key = api_key()
    name = a.name or Path(a.panel).stem
    out = a.out_dir
    (out / "logs").mkdir(parents=True, exist_ok=True)

    frames = [
        {
            "type": "image_url",
            "frame_type": "first_frame",
            "image_url": {
                "url": frame(a.panel, out, name, a.aspect, not a.no_pillarbox)
            },
        }
    ]
    if a.last:
        frames.append(
            {
                "type": "image_url",
                "frame_type": "last_frame",
                "image_url": {
                    "url": frame(
                        a.last, out, f"{name}-last", a.aspect, not a.no_pillarbox
                    )
                },
            }
        )
    body = {
        "model": MODEL,
        "prompt": Path(a.prompt_file).read_text().strip(),
        "duration": a.duration,
        "resolution": a.resolution,
        "aspect_ratio": a.aspect,
        "generate_audio": not a.no_audio,
        "seed": a.seed,
        "frame_images": frames,
    }

    t0 = time.time()
    if a.resume:  # never resubmit a job that is already billed
        job = {
            "id": a.resume,
            "status": "pending",
            "polling_url": f"{API}/videos/{a.resume}",
        }
    else:
        job = call(key, f"{API}/videos", body)
        (out / "logs" / f"{name}-submit.json").write_text(json.dumps(job, indent=2))
    print(
        f"[{name}] model={MODEL} id={job.get('id')} status={job.get('status')}",
        flush=True,
    )
    for _ in range(90):  # 30 min cap at 20 s
        if job.get("status") in TERMINAL:
            break
        time.sleep(20)
        poll = job.get("polling_url") or f"{API}/videos/{job['id']}"
        job = call(
            key, poll if poll.startswith("http") else f"https://openrouter.ai{poll}"
        )
        print(
            f"[{name}] {int(time.time() - t0)}s status={job.get('status')}", flush=True
        )
    job.pop("unsigned_urls", None)
    (out / "logs" / f"{name}-final.json").write_text(json.dumps(job, indent=2))
    if job.get("status") != "completed":
        sys.exit(f"[{name}] ended {job.get('status')}: {job.get('error')}")

    mp4 = call(key, f"{API}/videos/{job['id']}/content?index=0", raw=True)
    dest = out / f"{name}.mp4"
    dest.write_bytes(mp4)
    cost = (job.get("usage") or {}).get("cost")
    print(
        f"[{name}] saved {dest} bytes={len(mp4)} cost={cost} wall={int(time.time() - t0)}s"
    )


if __name__ == "__main__":
    main()

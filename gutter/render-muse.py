#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["requests"]
# ///
"""Render one Muse Image panel, through OpenRouter or Meta's own Model API.

  render-muse.py <prompt.txt> <out-stem> [--provider openrouter|meta] [ref-image ...]
  render-muse.py ... --provider meta --prev <response_id> | --prev-from <stem>   # chain a turn

Writes <out>.png, <out>.webp (1600 square, q90) and <out>.json (provider, model,
prompt file, refs, response id, usage, cost) and appends one line to ./run.log.
Keys come from ~/gits/igor2/secretBox.json: OPEN_ROUTER_KEY / MUSE_API_KEY.
Exit 0 image saved · 1 HTTP/shape error · 2 completed with no image (refusal).

openrouter: POST /api/v1/images, refs as input_references, one request one image.
meta:       POST /v1/responses, refs as input_image parts inside a user message,
            --prev chains on the server (previous_response_id); the image is the
            base64 `result` on the output list's image_generation_call item.
Both are $0.01 per image (2026-09-04).
"""

import argparse
import base64
import datetime
import json
import mimetypes
import pathlib
import subprocess
import sys

import requests

ap = argparse.ArgumentParser()
ap.add_argument("prompt")
ap.add_argument("out")
ap.add_argument("--provider", default="openrouter", choices=["openrouter", "meta"])
ap.add_argument("--prev", help="meta: previous_response_id to chain from")
ap.add_argument("--prev-from", help="meta: read the response id from <stem>.json")
ap.add_argument(
    "--size", default="1024x1024", help="meta: aspect hint on the image_generation tool"
)
ap.add_argument(
    "--reasoning",
    default="high",
    choices=["high", "low"],
    help="meta: reasoning_strength",
)
ap.add_argument(
    "--search",
    action="store_true",
    help="meta: leave web/image search on (default off)",
)
ap.add_argument("refs", nargs="*")
a = ap.parse_args()
prompt, refs = pathlib.Path(a.prompt), [pathlib.Path(r) for r in a.refs]
secrets = json.loads((pathlib.Path.home() / "gits/igor2/secretBox.json").read_text())
PRICE = 0.01


def data_url(p):
    mt = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return f"data:{mt};base64,{base64.b64encode(p.read_bytes()).decode()}"


prev = None
if a.provider == "meta":
    prev = a.prev or (
        json.loads(pathlib.Path(f"{a.prev_from}.json").read_text())["response_id"]
        if a.prev_from
        else None
    )
    model, url, key = (
        "muse-image-1.0",
        "https://api.meta.ai/v1/responses",
        secrets["MUSE_API_KEY"],
    )
    content = [{"type": "input_text", "text": prompt.read_text()}] + [
        {"type": "input_image", "image_url": data_url(r)} for r in refs
    ]
    body = {
        "model": model,
        "input": [{"role": "user", "content": content}],
        "tools": [
            {
                "type": "image_generation",
                "size": a.size,
                "output_format": "png",
                "reasoning_strength": a.reasoning,
                "enable_image_search": a.search,
                "enable_web_search": a.search,
                "enable_shell": False,
            }
        ],
    }
    if prev:
        body["previous_response_id"] = prev
else:
    if a.prev or a.prev_from:
        sys.exit(
            "--prev only works with --provider meta (OpenRouter has no server state)"
        )
    model, url, key = (
        "meta/muse-image",
        "https://openrouter.ai/api/v1/images",
        secrets["OPEN_ROUTER_KEY"],
    )
    body = {
        "model": model,
        "prompt": prompt.read_text(),
        "n": 1,
        "aspect_ratio": "1:1",
        "resolution": "2K",
        "output_format": "png",
        "stream": False,
        "input_references": [
            {"type": "image_url", "image_url": {"url": data_url(r)}} for r in refs
        ],
    }

print(
    f"PROVIDER: {a.provider}\nMODEL: {model}\nURL: {url}\nPROMPT FILE: {prompt}\nPREV: {prev}\nREFS: {[str(r) for r in refs]}",
    file=sys.stderr,
)
t0 = datetime.datetime.now(datetime.UTC)
r = requests.post(
    url,
    headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    json=body,
    timeout=900,
)
secs = round((datetime.datetime.now(datetime.UTC) - t0).total_seconds())
stamp = t0.isoformat(timespec="seconds")


def log(line):
    with pathlib.Path("run.log").open("a") as f:
        f.write(line)


if r.status_code != 200:
    print(f"HTTP {r.status_code}: {r.text[:1500]}", file=sys.stderr)
    log(
        f"{stamp} FAIL provider={a.provider} http={r.status_code} out={a.out} prompt={prompt} prev={prev} refs={[str(x) for x in refs]} body={r.text[:300]!r}\n"
    )
    sys.exit(1)
j = r.json()
if a.provider == "meta":
    rid, usage = j.get("id"), j.get("usage")
    calls = [
        it for it in j.get("output", []) if it.get("type") == "image_generation_call"
    ]
    b64 = calls[0].get("result") if calls else None
    cost = PRICE if b64 else 0.0
else:
    rid, usage = j.get("id"), j.get("usage")
    data = j.get("data") or []
    b64 = data[0].get("b64_json") if data else None
    cost = (usage or {}).get("cost", PRICE if b64 else 0.0)
side = {
    "provider": a.provider,
    "model": model,
    "prompt_file": str(prompt),
    "refs": [str(x) for x in refs],
    "prev": prev,
    "response_id": rid,
    "status": j.get("status"),
    "usage": usage,
    "cost_usd": cost,
    "seconds": secs,
}
pathlib.Path(f"{a.out}.json").write_text(json.dumps(side, indent=1))
print("USAGE:", json.dumps(usage), "\nRESPONSE ID:", rid, file=sys.stderr)
if not b64:
    log(
        f"{stamp} NOIMAGE provider={a.provider} out={a.out} prompt={prompt} prev={prev} resp={rid} refs={[str(x) for x in refs]}\n"
    )
    sys.exit(2)
png = pathlib.Path(f"{a.out}.png")
png.write_bytes(base64.b64decode(b64))
webp = png.with_suffix(".webp")
subprocess.run(
    ["magick", str(png), "-resize", "1600x1600", "-quality", "90", str(webp)],
    check=True,
)
dims = subprocess.run(
    ["magick", "identify", "-format", "%wx%h", str(png)],
    capture_output=True,
    text=True,
    check=False,
).stdout
log(
    f"{stamp} OK provider={a.provider} model={model} out={a.out} prompt={prompt} prev={prev} resp={rid} dims={dims} secs={secs} cost=${cost:.2f} refs={[str(x) for x in refs]}\n"
)
print(f"MADE {webp} ({dims}) resp={rid}")

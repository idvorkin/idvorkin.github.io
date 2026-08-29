#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Verify each per-panel export: 800x800, dark border on all four edges,
no cream sliver outside the frame line.

Accepts either a directory (checks every den-*-p?.webp inside) or a strip
path (checks the four den-00N-p1..p4.webp files beside it)."""

import sys
from pathlib import Path
from PIL import Image

THRESH = 195
# Measured floor on den-004 was 0.979; 0.98 rejected good cuts.
EDGE_STROKE_FRAC = 0.975

arg = Path(sys.argv[1])
if arg.is_dir():
    panels = sorted(arg.glob("den-*-p?.webp"))
else:
    candidates = [arg.with_name(f"{arg.stem}-p{n}.webp") for n in range(1, 5)]
    panels = sorted(p for p in candidates if p.exists())
if not panels:
    print(f"no panel files found for {arg}", file=sys.stderr)
    sys.exit(1)

ok_all = True
for p in panels:
    im = Image.open(p).convert("RGB")
    w, h = im.size
    px = im.load()

    def dark_frac(coords):
        d = sum(1 for c in coords if min(px[c]) <= THRESH)
        return d / len(coords)

    edges = {
        "top": [(x, 0) for x in range(w)],
        "bot": [(x, h - 1) for x in range(w)],
        "left": [(0, y) for y in range(h)],
        "right": [(w - 1, y) for y in range(h)],
    }
    fr = {k: dark_frac(v) for k, v in edges.items()}
    size_ok = (w, h) == (800, 800)
    edge_ok = all(v >= EDGE_STROKE_FRAC for v in fr.values())
    status = "OK " if (size_ok and edge_ok) else "FAIL"
    if not (size_ok and edge_ok):
        ok_all = False
    print(
        f"{status} {p.name} {w}x{h} " + " ".join(f"{k}={v:.3f}" for k, v in fr.items())
    )
print("ALL OK" if ok_all else "SOME FAILED")

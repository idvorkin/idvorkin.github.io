#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Cut the four per-panel exports out of a Den strip composite.

Each panel is found on its own: split the canvas at the midpoint into four
quadrants, then inside each quadrant walk in from every side until a scanline
is majority-dark. That scanline is the panel's black border stroke — stray
antialiasing on the cream page is a few percent dark and doesn't qualify, and
a speech balloon lying across the border only eats part of the line.

Crop at exactly that rect (the 8px stroke is drawn inside it, so the frame
line comes along and no neighbour does) and resize to 800x800.

The rect is then pulled in by one pixel on every side. The outermost line of
a rendered stroke is antialiased against the cream page — measured 0.57-0.62
dark on den-005/006/007 against 0.98 for the lines just inside it — so
keeping it leaves the export with a pale, broken outer edge that
check-panels.py rightly rejects. The stroke is eight pixels thick; dropping
its softest one is invisible and makes the edge solid.
"""

import subprocess
import sys
from pathlib import Path
from PIL import Image

THRESH = 195  # a pixel is "page" when min(R,G,B) is above this
MAJORITY = 0.5  # fraction of a quadrant scanline that must be dark


def panel_rect(dark, x0, x1, y0, y1):
    """Tightest border-stroke rect inside the quadrant [x0,x1) x [y0,y1)."""
    rows = [sum(dark[y][x0:x1]) for y in range(y0, y1)]
    cols = [sum(dark[y][x] for y in range(y0, y1)) for x in range(x0, x1)]
    ry = [i for i, c in enumerate(rows) if c >= MAJORITY * (x1 - x0)]
    cx = [i for i, c in enumerate(cols) if c >= MAJORITY * (y1 - y0)]
    if not ry or not cx:
        raise SystemExit(f"no border found in quadrant {x0},{y0}")
    # +1 / -2: drop the antialiased outermost line of the stroke on each side.
    return x0 + cx[0] + 1, y0 + ry[0] + 1, cx[-1] - cx[0] - 1, ry[-1] - ry[0] - 1


for src in sys.argv[1:]:
    src = Path(src)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()
    dark = [[min(px[x, y]) <= THRESH for x in range(w)] for y in range(h)]
    mx, my = w // 2, h // 2
    quads = [(0, mx, 0, my), (mx, w, 0, my), (0, mx, my, h), (mx, w, my, h)]
    for n, (x0, x1, y0, y1) in enumerate(quads, 1):
        bx, by, bw, bh = panel_rect(dark, x0, x1, y0, y1)
        out = src.with_name(f"{src.stem}-p{n}.webp")
        geom = f"{bw}x{bh}+{bx}+{by}"
        subprocess.run(
            [
                "magick",
                str(src),
                "-crop",
                geom,
                "+repage",
                "-resize",
                "800x800!",
                "-quality",
                "90",
                str(out),
            ],
            check=True,
        )
        print(f"{out.name}  crop {geom}")

#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "scipy", "pillow"]
# ///
"""Cut the drawn balloons and captions out of a panel as an RGBA overlay.

usage: lettering_overlay.py PANEL OUT.png SIZE  bubble:x0,y0,x1,y1 ... text:x0,y0,x1,y1 ...
Rects are in PANEL pixels. bubble = light blobs, holes filled, grown to take the
outline; text = light pixels only (lettering on a dark ground), grown slightly.
"""

import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

panel, out, size = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(panel).convert("RGB")
a = np.asarray(im).astype(int)
light = a.min(axis=2) > 170
# balloon paper is shaded grey toward its edges: take any pale low-saturation pixel
paper = (a.min(axis=2) > 105) & (a.max(axis=2) - a.min(axis=2) < 45)
mask = np.zeros(light.shape, bool)
for spec in sys.argv[4:]:
    kind, r = spec.split(":")
    x0, y0, x1, y1 = map(int, r.split(","))
    m = np.zeros_like(light)
    m[y0:y1, x0:x1] = (paper if kind == "bubble" else light)[y0:y1, x0:x1]
    if kind == "bubble":
        m = ndi.binary_closing(m, iterations=2)
        m = ndi.binary_fill_holes(m)
        lab, n = ndi.label(m)
        sizes = ndi.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 80])
        m = ndi.binary_dilation(m, iterations=5)  # take the dark outline too
    else:
        m = ndi.binary_dilation(
            m, iterations=14
        )  # wide enough to cover the model's own re-drawn caption
    mask |= m
alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(
    __import__("PIL.ImageFilter").ImageFilter.GaussianBlur(1)
)
rgba = im.copy()
rgba.putalpha(alpha)
rgba.resize((size, size), Image.LANCZOS).save(out)
print(out, f"mask={mask.mean():.3f}")

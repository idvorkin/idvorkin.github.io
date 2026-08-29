#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow", "numpy"]
# ///
import sys
import numpy as np
from PIL import Image


def runs(mask, minlen=1):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start >= minlen:
                out.append((start, i - 1, i - start))
            start = None
    if start is not None and len(mask) - start >= minlen:
        out.append((start, len(mask) - 1, len(mask) - start))
    return out


# The contract, from contract.md. A strip passes when every measured edge is
# within TOL px of it.
CONTRACT = {"margin": 32, "gutter": 32, "panel": 752}
TOL = 8


def within(measured, key, tol=TOL):
    return all(abs(v - CONTRACT[key]) <= tol for v in measured)


all_ok = True

for path in sys.argv[1:]:
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    h, w, _ = a.shape
    light = a.min(axis=2) > 195
    dark = a.max(axis=2) < 80
    row_page = light.all(axis=1)
    col_page = light.all(axis=0)
    hb = [r for r in runs(row_page, 3)]
    vb = [r for r in runs(col_page, 3)]
    print(f"\n===== {path} {w}x{h} =====")
    print("page bands rows:", hb)
    print("page bands cols:", vb)
    if len(hb) != 3 or len(vb) != 3:
        print("  !! not a clean 2x2")
        print("CONTRACT FAIL")
        all_ok = False
        continue
    top_m = hb[0][2]
    gut_h = hb[1][2]
    bot_m = hb[2][2]
    left_m = vb[0][2]
    gut_v = vb[1][2]
    right_m = vb[2][2]
    ys = [(hb[0][1] + 1, hb[1][0] - 1), (hb[1][1] + 1, hb[2][0] - 1)]
    xs = [(vb[0][1] + 1, vb[1][0] - 1), (vb[1][1] + 1, vb[2][0] - 1)]
    print(
        f"margins T/B/L/R = {top_m}/{bot_m}/{left_m}/{right_m}   gutter h={gut_h} v={gut_v}"
    )
    margins = [top_m, bot_m, left_m, right_m]
    gutters = [gut_h, gut_v]
    panels = []
    for r, (y0, y1) in enumerate(ys):
        for c, (x0, x1) in enumerate(xs):
            panels += [x1 - x0 + 1, y1 - y0 + 1]
            print(
                f"  panel {r * 2 + c + 1}: x={x0}..{x1} (w={x1 - x0 + 1})  y={y0}..{y1} (h={y1 - y0 + 1})"
            )
    # border stroke thickness: rows fully dark across panel 1's x-range
    x0, x1 = xs[0]
    y0, y1 = ys[0]
    frac_row = dark[y0 : y1 + 1, x0 : x1 + 1].mean(axis=1)
    frac_col = dark[y0 : y1 + 1, x0 : x1 + 1].mean(axis=0)
    top_stroke = int((frac_row > 0.97).cumsum().max()) if frac_row[0] > 0.97 else 0
    tr = runs(frac_row > 0.97, 1)
    tc = runs(frac_col > 0.97, 1)
    print(f"  panel1 fully-dark row runs (border top/bottom): {tr}")
    print(f"  panel1 fully-dark col runs (border left/right):  {tc}")
    ok = (
        within(margins, "margin")
        and within(gutters, "gutter")
        and within(panels, "panel")
    )
    print("CONTRACT", "PASS" if ok else "FAIL")
    if not ok:
        all_ok = False

sys.exit(0 if all_ok else 1)

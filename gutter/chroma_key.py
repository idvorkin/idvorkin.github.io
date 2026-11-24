#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "pillow", "scipy"]
# ///
"""Key a magenta-background Muse render to a transparent PNG, without Recraft.

    gutter/chroma_key.py raw.png out.png [--solid] [--sat 0.62 --grey]

The fallback for when the Recraft token is dead (check first with
`recraft_bg_remove.py balance`). Alpha is the smaller of two keys:

- a chroma key: distance in chromaticity from the border's median color, so
  it ignores brightness and shadows on the backdrop key out too;
- a hue key: anything saturated and magenta-hued is background, which removes
  dark crimson shadows and pink halos in the fur.

Edge pixels are then un-mixed from the backdrop color and despilled.

Flags:
  --solid   for a character. Enclosed areas use the chroma key only, so the
            purple part of the rainbow glasses survives, and real backdrop
            seen through a lens still clears.
  --sat S   the hue key applies only above saturation S (default 0.30).
            Raise it (0.62) for charcoal props, whose magenta bounce light
            otherwise keys out as speckle.
  --grey    desaturate magenta-tinted subject pixels; use with --sat on
            iron, chain and other near-black props.
  --t0/--t1 chroma ramp, default 0.05..0.13.

ponytail: one global backdrop color and no matting model, so a faint pink
fringe stays on fur. Recraft (or a real matting pass) is the upgrade; re-strip
once the token works.
"""

import argparse

import numpy as np
from PIL import Image
from scipy import ndimage

KEY_HUE = 315  # magenta, in degrees


def hue_of(px):
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    return (np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)) + 360) % 360


def hue_dist(hue):
    return np.abs(((hue - KEY_HUE) + 180) % 360 - 180)


def main():
    ap = argparse.ArgumentParser(description="Magenta chroma key (Recraft fallback).")
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--t0", type=float, default=0.05)
    ap.add_argument("--t1", type=float, default=0.13)
    ap.add_argument("--sat", type=float, default=0.30)
    ap.add_argument("--solid", action="store_true")
    ap.add_argument("--grey", action="store_true")
    a = ap.parse_args()

    im = np.asarray(Image.open(a.src).convert("RGB")).astype(np.float32)
    b = 12
    border = np.concatenate(
        [
            im[:b].reshape(-1, 3),
            im[-b:].reshape(-1, 3),
            im[:, :b].reshape(-1, 3),
            im[:, -b:].reshape(-1, 3),
        ]
    )
    bg = np.median(border, 0)
    bg_chroma = np.median(border / (border.sum(1, keepdims=True) + 1e-3), 0)

    # chroma key
    chroma = im / (im.sum(2, keepdims=True) + 1e-3)
    alpha_c = np.clip(
        (np.linalg.norm(chroma - bg_chroma, axis=2) - a.t0) / (a.t1 - a.t0), 0, 1
    )

    # hue key: saturated magenta at any brightness is backdrop
    mx, mn = im.max(2), im.min(2)
    sat = (mx - mn) / (mx + 1e-3)
    alpha_h = np.clip((hue_dist(hue_of(im)) - 26) / 12, 0, 1)
    alpha_h = np.maximum(alpha_h, np.clip((a.sat - sat) / 0.12, 0, 1))
    alpha = np.minimum(alpha_c, alpha_h)

    if a.solid:
        lab, _ = ndimage.label(alpha < 0.5)
        edge_ids = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
        outside = np.isin(lab, edge_ids[edge_ids > 0])
        alpha = np.where(outside, alpha, alpha_c)

    # drop opaque specks under 400 px
    lab, n = ndimage.label(alpha > 0.5)
    if n:
        sizes = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
        alpha[np.isin(lab, np.where(sizes < 400)[0] + 1)] = 0

    # un-mix partial pixels from the backdrop, in a 3 px band inside the edge
    ae = np.maximum(alpha, 0.25)[..., None]
    unmixed = np.clip((im - (1 - ae) * bg) / ae, 0, 255)
    edge = ndimage.binary_dilation(alpha < 0.98, iterations=3) & (alpha > 0)
    out = np.where(edge[..., None], unmixed, im)

    # residual spill in that band: pull R and B down toward G
    r, g, bl = out[..., 0], out[..., 1], out[..., 2]
    spill = edge & (r > g + 40) & (bl > g + 40)
    m = np.minimum(r, bl) - g - 40
    out[..., 0] = np.where(spill, r - m * 0.8, r)
    out[..., 2] = np.where(spill, bl - m * 0.8, bl)

    if a.grey:
        tint = hue_dist(hue_of(out)) < 50
        out = np.where(tint[..., None], out.mean(2, keepdims=True), out)

    rgba = np.dstack([out, alpha * 255]).round().clip(0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(a.dst)
    print(
        f"{a.dst}: bg={bg.round().astype(int).tolist()} alpha_mean={alpha.mean() * 100:.1f}%"
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["numpy", "pillow"]
# ///
"""Compare two builds' screenshots and DOM facts (from shoot.cjs).

usage: compare.py <shots dir> [--a jekyll] [--b zola] [--baseline FILE]
                  [--update-baseline] [--top 80] [--preview URL]

Writes <shots dir>/<a>-vs-<b>/results.json, index.html (pages ranked by how
different they look) and a side-by-side image for the worst pages.

Two pixel numbers per page and width:

  raw      differing pixels over the whole page, both images padded to the
           taller one. One extra line of text near the top shifts everything
           below it, so this number says "something moved", not how much is
           wrong.
  aligned  the page is cut at every heading both builds share, and each
           section is compared against its counterpart from its own top.
           A shift costs only the section that caused it. This is the number
           the pages are ranked and gated on, and the section with the most
           differing pixels is the pointer a fixer starts from.

A pixel differs when any channel is off by more than 24/255 (font
anti-aliasing noise sits below that).

The gate is a ratchet: baseline.json holds each page's aligned %, and the run
fails when a page gets worse than its baseline by more than SLACK points, a
page without a baseline is above NEW_MAX, or a page could not be rendered.
--update-baseline only ever lowers a page's number (or adds a page), so a
partial run (LIMIT=, ONLY=) cannot shrink the baseline and a regression cannot
be blessed by accident. --accept-worse is the explicit way to raise one.
"""

import argparse
import difflib
import html
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

TOL = 24
SLACK = 0.25  # percentage points a page may exceed its baseline (render noise)
NEW_MAX = 1.0  # a page with no baseline must be under this aligned %


def load(p: Path) -> np.ndarray:
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)


def pad(img: np.ndarray, h: int) -> np.ndarray:
    if img.shape[0] >= h:
        return img[:h]
    fill = np.full((h - img.shape[0], img.shape[1], 3), 255, dtype=np.int16)
    return np.concatenate([img, fill])


def mask(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    h = max(a.shape[0], b.shape[0])
    return (np.abs(pad(a, h) - pad(b, h)) > TOL).any(axis=2)


def shared_marks(ma, mb, ha, hb):
    """Heading ids both builds have, in an order that rises on both pages."""
    posb = {}
    for i, y in mb:
        posb.setdefault(i, y)
    cuts, last_b, seen = [("(top)", 0, 0)], 0, set()
    for i, ya in sorted(ma, key=lambda m: m[1]):
        if i in seen or i not in posb:
            continue
        yb = posb[i]
        if ya <= cuts[-1][1] or yb <= last_b or ya >= ha or yb >= hb:
            continue
        seen.add(i)
        cuts.append((i, ya, yb))
        last_b = yb
    return cuts


def compare_pair(root: Path, sa: dict, sb: dict) -> dict:
    a, b = load(root / sa["png"]), load(root / sb["png"])
    m = mask(a, b)
    rows = np.flatnonzero(m.any(axis=1))
    out = {
        "raw": round(float(100 * m.mean()), 3),
        "first_y": int(rows[0]) if rows.size else None,
        "dh": sb["h"] - sa["h"],
        "h": sa["h"],
    }
    cuts = shared_marks(sa["marks"], sb["marks"], a.shape[0], b.shape[0])
    diff_px = total_px = 0
    sections = []
    for k, (hid, ya, yb) in enumerate(cuts):
        ea = cuts[k + 1][1] if k + 1 < len(cuts) else a.shape[0]
        eb = cuts[k + 1][2] if k + 1 < len(cuts) else b.shape[0]
        sm = mask(a[ya:ea], b[yb:eb])
        diff_px += int(sm.sum())
        total_px += sm.size
        if sm.any():
            sections.append(
                {
                    "id": hid,
                    "px": int(sm.sum()),
                    "ya": ya,
                    "yb": yb,
                    "dh": (eb - yb) - (ea - ya),
                }
            )
    out["aligned"] = round(100 * diff_px / max(total_px, 1), 3)
    out["sections"] = sorted(sections, key=lambda s: -s["px"])[:5]
    out["n_sections"] = len(cuts)
    return out


def dom_diff(sa: dict, sb: dict) -> dict:
    d = {}
    # textContent runs table cells together differently per renderer; only a
    # difference that survives removing all whitespace is a text difference.
    if "".join(sa["text"].split()) != "".join(sb["text"].split()):
        wa, wb = sa["text"].split(), sb["text"].split()
        sm = (
            difflib.SequenceMatcher(None, wa, wb, autojunk=False)
            if len(wa) < 6000
            else None
        )
        d["text"] = round(sm.ratio(), 4) if sm else -1
        if sm:
            ops = [o for o in sm.get_opcodes() if o[0] != "equal"][:3]
            d["text_sample"] = [
                [" ".join(wa[i1:i2])[:80], " ".join(wb[j1:j2])[:80]]
                for _, i1, i2, j1, j2 in ops
            ]
    la, lb = set(sa["links"]), set(sb["links"])
    if la - lb:
        d["links_lost"] = sorted(la - lb)[:8]
    if lb - la:
        d["links_new"] = sorted(lb - la)[:8]
    ia, ib = set(sa["ids"]), set(sb["ids"])
    if ia - ib:
        d["ids_lost"] = sorted(ia - ib)[:8]
    if sb["imgs_ok"] != sa["imgs_ok"]:
        d["imgs_ok"] = [sa["imgs_ok"], sb["imgs_ok"]]
    if sb["backlinks"] != sa["backlinks"]:
        d["backlinks"] = [sa["backlinks"], sb["backlinks"]]
    new_errs = sorted(set(sb["errs"]) - set(sa["errs"]))
    if new_errs:
        d["errs"] = new_errs[:5]
    return d


def triptych(root: Path, sa: dict, sb: dict, res: dict, dest: Path) -> None:
    """Jekyll | Zola | differing pixels, around the worst section."""
    a, b = load(root / sa["png"]), load(root / sb["png"])
    sec = res["sections"][0] if res["sections"] else {"ya": 0, "yb": 0}
    span = 1100
    ya, yb = max(sec["ya"] - 40, 0), max(sec["yb"] - 40, 0)
    ca, cb = pad(a[ya:], span), pad(b[yb:], span)
    m = (np.abs(ca - cb) > TOL).any(axis=2)
    dm = np.where(m[..., None], np.array([220, 0, 60]), (ca * 0.25 + 190)).astype(
        np.uint8
    )
    gap = np.full((span, 12, 3), 40, dtype=np.uint8)
    strip = np.concatenate(
        [ca.astype(np.uint8), gap, cb.astype(np.uint8), gap, dm], axis=1
    )
    img = Image.fromarray(strip)
    if img.width > 1800:
        img = img.resize((1800, int(img.height * 1800 / img.width)))
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=70)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", type=Path)
    ap.add_argument("--a", default="jekyll")
    ap.add_argument("--b", default="zola")
    ap.add_argument("--baseline", type=Path)
    ap.add_argument("--update-baseline", action="store_true")
    ap.add_argument("--accept-worse", action="store_true")
    ap.add_argument("--maxh", type=int, default=12000)
    ap.add_argument("--top", type=int, default=80)
    ap.add_argument("--preview", default="")
    args = ap.parse_args()
    shots = json.loads((args.root / "shots.json").read_text())
    out = args.root / f"{args.a}-vs-{args.b}"
    out.mkdir(exist_ok=True)

    results, failed = {}, []
    keys = sorted({k.rsplit("|", 1)[0] for k in shots})
    for k in keys:
        sa, sb = shots.get(f"{k}|{args.a}"), shots.get(f"{k}|{args.b}")
        if not sa or not sb:
            continue
        if sa.get("fail") or sb.get("fail"):
            failed.append([k, (sa.get("fail") or sb.get("fail"))[:120]])
            continue
        results[k] = {**compare_pair(args.root, sa, sb), "dom": dom_diff(sa, sb)}

    pages: dict[str, dict] = {}
    for k, r in results.items():
        url, w = k.rsplit("|", 1)
        pages.setdefault(url, {})[w] = r
    ranked = sorted(pages, key=lambda u: -max(r["aligned"] for r in pages[u].values()))
    for url in ranked[: args.top]:
        for w, r in pages[url].items():
            if r["aligned"] > 0:
                name = f"{shots[f'{url}|{w}|{args.b}']['png'].split('/')[-1][:-4]}-{w}.webp"
                triptych(
                    args.root,
                    shots[f"{url}|{w}|{args.a}"],
                    shots[f"{url}|{w}|{args.b}"],
                    r,
                    out / "img" / name,
                )
                r["img"] = f"img/{name}"

    def bucket(v: float) -> str:
        return (
            "identical"
            if v == 0
            else "<0.1%"
            if v < 0.1
            else "<1%"
            if v < 1
            else "<5%"
            if v < 5
            else ">=5%"
        )

    widths = sorted({k.rsplit("|", 1)[1] for k in results}, key=int)
    summary = {"pages": len(pages), "failed": failed, "widths": {}}
    for w in widths:
        rs = [pages[u][w] for u in pages if w in pages[u]]
        al = sorted(r["aligned"] for r in rs)
        b = {}
        for r in rs:
            b[bucket(r["aligned"])] = b.get(bucket(r["aligned"]), 0) + 1
        summary["widths"][w] = {
            "n": len(rs),
            "buckets": b,
            "median_aligned": al[len(al) // 2] if al else None,
            "p90_aligned": al[int(len(al) * 0.9)] if al else None,
            "max_aligned": al[-1] if al else None,
            "raw_identical": sum(r["raw"] == 0 for r in rs),
            # Taller than the screenshot cap: only the first maxh px were compared.
            "truncated": sum(
                r["h"] > args.maxh or r["h"] + r["dh"] > args.maxh for r in rs
            ),
            "identical_and_whole": sum(
                r["raw"] == 0 and r["h"] <= args.maxh and r["h"] + r["dh"] <= args.maxh
                for r in rs
            ),
            "same_height": sum(r["dh"] == 0 for r in rs),
        }
    doms = [r["dom"] for r in results.values()]
    summary["dom"] = {
        "text_identical": sum("text" not in d for d in doms),
        "text_differs": sum("text" in d for d in doms),
        "links_lost": sum("links_lost" in d for d in doms),
        "ids_lost": sum("ids_lost" in d for d in doms),
        "new_js_errors": sum("errs" in d for d in doms),
        "images_loaded_differ": sum("imgs_ok" in d for d in doms),
        "backlinks_differ": sum("backlinks" in d for d in doms),
        "of": len(doms),
    }

    base = {}
    if args.baseline and args.baseline.exists():
        base = json.loads(args.baseline.read_text())["aligned"]
    gate = {"regressed": [], "new_over": [], "failed": failed}
    for k, r in results.items():
        if k in base and r["aligned"] > base[k] + SLACK:
            gate["regressed"].append([k, base[k], r["aligned"]])
        elif k not in base and r["aligned"] > NEW_MAX and base:
            gate["new_over"].append([k, r["aligned"]])
    if args.baseline and args.update_baseline:
        merged = dict(base)
        for k, r in results.items():
            if k not in merged or r["aligned"] < merged[k] or args.accept_worse:
                merged[k] = r["aligned"]
        args.baseline.write_text(
            json.dumps(
                {
                    "slack": SLACK,
                    "new_max": NEW_MAX,
                    "aligned": dict(sorted(merged.items())),
                },
                indent=0,
            )
            + "\n"
        )
        gate["new_over"] = []  # a first sighting is recorded, not failed
        if args.accept_worse:
            gate["regressed"] = []
    summary["gate"] = {k: len(v) for k, v in gate.items()}

    (out / "results.json").write_text(
        json.dumps({"summary": summary, "gate": gate, "pages": pages}, default=float)
    )

    esc = html.escape
    rows = []
    for url in ranked:
        cells = []
        for w in widths:
            r = pages[url].get(w)
            if not r:
                cells.append("<td colspan=4></td>")
                continue
            sec = r["sections"][0] if r["sections"] else None
            where = (
                f'<a href="{esc(args.preview + url)}#{esc(sec["id"])}">{esc(sec["id"][:40])}</a>'
                if sec and sec["id"] != "(top)"
                else ("(top)" if sec else "")
            )
            pic = f' <a href="{esc(r["img"])}">img</a>' if r.get("img") else ""
            cls = bucket(r["aligned"]).strip("<>=%").replace(".", "")
            cells.append(
                f'<td class="n b{cls}">{r["aligned"]:.2f}{pic}</td><td class="n">{r["raw"]:.1f}</td><td class="n">{r["dh"]:+d}</td><td>{where}</td>'
            )
        flags = []
        for w in widths:
            for name, v in (pages[url].get(w, {}).get("dom") or {}).items():
                if name == "text_sample":
                    continue
                tag = (
                    f"{name}={v}" if name in ("text", "imgs_ok", "backlinks") else name
                )
                if tag not in flags:
                    flags.append(tag)
        rows.append(
            f'<tr><td><a href="{esc(args.preview + url)}">{esc(url)}</a></td>{"".join(cells)}<td class="f">{esc(", ".join(flags))}</td></tr>'
        )
    head = "".join(
        f"<th colspan=4>{w}px: aligned % · raw % · Δheight · worst section</th>"
        for w in widths
    )
    (out / "index.html").write_text(
        f"""<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>{esc(args.a)} vs {esc(args.b)}: pixel diff</title>
<style>body{{font:14px/1.4 system-ui;margin:16px;background:#fff;color:#111}}table{{border-collapse:collapse;font-size:13px}}
td,th{{border-bottom:1px solid #ddd;padding:3px 8px;text-align:left;vertical-align:top}}.n{{text-align:right;font-variant-numeric:tabular-nums}}
.bidentical{{color:#2a7}}.b5{{background:#fdd}}.b1{{background:#fed}}.f{{color:#666;max-width:28em}}pre{{background:#f4f4f4;padding:8px;overflow:auto}}
.wrap{{overflow-x:auto}}</style>
<h1>{esc(args.a)} vs {esc(args.b)}</h1>
<p>{len(pages)} pages, ranked by the larger aligned pixel difference of the two widths. "aligned" compares section by
section between shared headings, so one shifted line costs one section; "raw" is the whole page overlaid.
"img" shows {esc(args.a)}, {esc(args.b)} and the differing pixels around the worst section.</p>
<pre>{esc(json.dumps(summary, indent=1, default=float))}</pre>
<div class=wrap><table><tr><th>page</th>{head}<th>DOM differences</th></tr>
{chr(10).join(rows)}</table></div>
"""
    )
    print(json.dumps(summary, indent=1, default=float))
    if gate["regressed"] or gate["new_over"] or gate["failed"]:
        print(json.dumps(gate, indent=1), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

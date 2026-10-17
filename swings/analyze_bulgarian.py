#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["mediapipe", "opencv-python-headless", "numpy"]
# ///
"""Headless validator for the Swing Analyzer's Bulgarian split-squat mode.

This is the ground-truth twin of the browser analyzer in ``swings/index.html``.
There is no browser in CI, so this script runs a real pose model over a video
and applies THE SAME rep state-machine, angle math and thresholds that the page
runs client-side. Keep the constants below in lockstep with the ``BULG`` block
in ``index.html`` -- if a threshold is tuned here it must be tuned there too,
or the test stops validating the shipped behavior.

Detector note: the browser uses MoveNet (TensorFlow.js, COCO-17 keypoints);
this harness uses MediaPipe PoseLandmarker (BlazePose, 33 landmarks) because
that is what installs and runs headless on this box. The geometry and
thresholds are expressed in joint angles / normalized offsets that are
model-agnostic, and the hip/knee/ankle/shoulder landmark *indices* are mapped
per model, so the two pipelines validate the same logic. Absolute angles can
differ by a few degrees between detectors; the rep-count logic does not.

Usage:
    ./analyze_bulgarian.py <video>            # human summary
    ./analyze_bulgarian.py <video> --json     # machine-readable (used by tests)
"""

from __future__ import annotations

import argparse
import json
import math
import sys
import urllib.request
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np  # noqa: F401  (kept: handy for ad-hoc debugging)
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision

# ---------------------------------------------------------------------------
# SHARED CONSTANTS -- MUST match the BULG block in swings/index.html
# ---------------------------------------------------------------------------
VIS_MIN = 0.3  # min landmark confidence/visibility to trust a joint
KNEE_DOWN = 110.0  # front-knee angle below this => descending into the rep
KNEE_UP = 150.0  # ...then back above this => rep complete (hysteresis)
DEPTH_TARGET = 90.0  # front-knee target depth (~parallel)
DEPTH_OK_MARGIN = 10.0  # "hit depth" if the rep's min knee <= target + margin
FRONT_VIEW_RATIO = 0.35  # shoulderSep/torsoLen >= this => front view; else side
VALGUS_THRESH = 0.10  # knee medial-of-ankle offset / shank => knee cave
ARCH_LEAN_DEG = -15.0  # torso leaning BACK past vertical by this => arch proxy
ARCH_FRAMES = 3  # ...sustained this many analyzed frames => flag
FRAME_STEP = 2  # analyze every Nth frame (~15fps), mirrors the page

# MediaPipe BlazePose landmark indices (browser maps the COCO-17 equivalents).
L_SH, R_SH, L_HIP, R_HIP, L_KNEE, R_KNEE, L_ANK, R_ANK = 11, 12, 23, 24, 25, 26, 27, 28

MODEL_FILE = "pose_landmarker_full.task"
MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/"
    "pose_landmarker_full/float16/latest/pose_landmarker_full.task"
)


def _sign(v: float) -> int:
    return (v > 0) - (v < 0)


def joint_angle(a, b, c):
    """Angle at vertex b (degrees, 0-180) for points a-b-c in image space."""
    bax, bay = a[0] - b[0], a[1] - b[1]
    bcx, bcy = c[0] - b[0], c[1] - b[1]
    na, nc = math.hypot(bax, bay), math.hypot(bcx, bcy)
    if na == 0 or nc == 0:
        return None
    cosv = max(-1.0, min(1.0, (bax * bcx + bay * bcy) / (na * nc)))
    return math.degrees(math.acos(cosv))


def ensure_model(path: Path) -> Path:
    if not path.exists():
        sys.stderr.write(f"downloading pose model -> {path} ...\n")
        urllib.request.urlretrieve(MODEL_URL, path)  # noqa: S310 (trusted Google host)
    return path


def analyze(video_path: str, model_path: Path, step: int = FRAME_STEP) -> dict:
    base = mp_python.BaseOptions(model_asset_path=str(model_path))
    opts = mp_vision.PoseLandmarkerOptions(
        base_options=base,
        running_mode=mp_vision.RunningMode.VIDEO,
        num_poses=1,
    )
    landmarker = mp_vision.PoseLandmarker.create_from_options(opts)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise SystemExit(f"cannot open video: {video_path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # rep state machine
    in_bottom = False
    rep_min_knee = math.inf
    rep_max_fwd_lean = -math.inf
    reps: list[dict] = []

    # clip-level trackers
    lean_min = math.inf
    lean_max = -math.inf
    back_run = 0  # consecutive analyzed frames leaning back past ARCH_LEAN
    back_run_max = 0
    valgus_max_front = -math.inf  # only accumulated on front-view frames
    front_frames = 0
    side_frames = 0
    posed = 0
    analyzed = 0

    fi = -1
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        fi += 1
        if fi % step:
            continue
        analyzed += 1
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        ts_ms = int(fi / fps * 1000)
        res = landmarker.detect_for_video(
            mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb), ts_ms
        )
        if not res.pose_landmarks:
            continue
        posed += 1
        P = res.pose_landmarks[0]

        def g(i):
            return (P[i].x * W, P[i].y * H, P[i].visibility)

        lsh, rsh, lhip, rhip = g(L_SH), g(R_SH), g(L_HIP), g(R_HIP)
        sh = [p for p in (lsh, rsh) if p[2] >= VIS_MIN]
        hp = [p for p in (lhip, rhip) if p[2] >= VIS_MIN]
        if not sh or not hp:
            continue
        s_mid = (sum(p[0] for p in sh) / len(sh), sum(p[1] for p in sh) / len(sh))
        h_mid = (sum(p[0] for p in hp) / len(hp), sum(p[1] for p in hp) / len(hp))

        # front leg = the planted foot = the LOWER ankle (larger y); back foot is
        # elevated on the bench. Pick the visible ankle with the greatest y.
        cand = []
        if g(L_ANK)[2] >= VIS_MIN and g(L_KNEE)[2] >= VIS_MIN and lhip[2] >= VIS_MIN:
            cand.append((g(L_HIP), g(L_KNEE), g(L_ANK)))
        if g(R_ANK)[2] >= VIS_MIN and g(R_KNEE)[2] >= VIS_MIN and rhip[2] >= VIS_MIN:
            cand.append((g(R_HIP), g(R_KNEE), g(R_ANK)))
        if not cand:
            continue
        hip_p, knee_p, ank_p = max(cand, key=lambda c: c[2][1])  # lowest ankle
        knee_angle = joint_angle(hip_p[:2], knee_p[:2], ank_p[:2])
        if knee_angle is None:
            continue

        # signed torso lean: + = leaning toward the front foot (forward), - = back
        dx = s_mid[0] - h_mid[0]
        up = h_mid[1] - s_mid[1]
        lean_mag = math.degrees(math.atan2(abs(dx), abs(up))) if up else 90.0
        face_dir = _sign(ank_p[0] - h_mid[0])
        fwd = 1 if _sign(dx) == face_dir else -1
        signed_lean = fwd * lean_mag
        lean_min = min(lean_min, signed_lean)
        lean_max = max(lean_max, signed_lean)

        # low-back arch proxy: sustained lean BEHIND vertical
        if signed_lean < ARCH_LEAN_DEG:
            back_run += 1
            back_run_max = max(back_run_max, back_run)
        else:
            back_run = 0

        # camera view + knee valgus (frontal plane -> only meaningful head-on)
        torso_len = math.hypot(dx, up)
        is_front = False
        if lsh[2] >= VIS_MIN and rsh[2] >= VIS_MIN and torso_len > 0:
            view_ratio = abs(lsh[0] - rsh[0]) / torso_len
            is_front = view_ratio >= FRONT_VIEW_RATIO
        if is_front:
            front_frames += 1
            shank = math.hypot(knee_p[0] - ank_p[0], knee_p[1] - ank_p[1])
            if shank > 0:
                medial = _sign(h_mid[0] - ank_p[0])
                valgus = medial * (knee_p[0] - ank_p[0]) / shank
                valgus_max_front = max(valgus_max_front, valgus)
        else:
            side_frames += 1

        # rep counting on the front-knee angle (mirror of the swing hinge machine)
        if knee_angle < KNEE_DOWN:
            in_bottom = True
            rep_min_knee = min(rep_min_knee, knee_angle)
            rep_max_fwd_lean = max(rep_max_fwd_lean, signed_lean)
        elif knee_angle > KNEE_UP and in_bottom:
            reps.append(
                {
                    "min_knee": round(rep_min_knee, 1),
                    "max_forward_lean": round(rep_max_fwd_lean, 1),
                    "depth_ok": rep_min_knee <= DEPTH_TARGET + DEPTH_OK_MARGIN,
                }
            )
            in_bottom = False
            rep_min_knee = math.inf
            rep_max_fwd_lean = -math.inf

    landmarker.close()

    view = "front" if front_frames > side_frames else "side"
    arch_flag = back_run_max >= ARCH_FRAMES
    if view == "side":
        knee_cave = "not_assessable_side_view"
    else:
        knee_cave = "flag" if valgus_max_front >= VALGUS_THRESH else "ok"

    return {
        "video": video_path,
        "frames_total": fi + 1,
        "frames_analyzed": analyzed,
        "frames_with_pose": posed,
        "reps": len(reps),
        "rep_detail": reps,
        "min_knee_per_rep": [r["min_knee"] for r in reps],
        "all_reps_hit_depth": all(r["depth_ok"] for r in reps) if reps else False,
        "torso_lean_range_deg": [round(lean_min, 1), round(lean_max, 1)],
        "view": view,
        "knee_cave": knee_cave,
        "valgus_max_front": (
            round(valgus_max_front, 3) if valgus_max_front > -math.inf else None
        ),
        "low_back_arch": "flag" if arch_flag else "ok",
        "back_lean_run_max_frames": back_run_max,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("video", help="path to a Bulgarian split-squat video")
    ap.add_argument("--json", action="store_true", help="emit JSON only")
    ap.add_argument(
        "--step", type=int, default=FRAME_STEP, help="analyze every Nth frame"
    )
    ap.add_argument(
        "--model",
        default=str(Path(__file__).parent / MODEL_FILE),
        help="path to pose_landmarker .task model (downloaded if absent)",
    )
    args = ap.parse_args()

    model_path = ensure_model(Path(args.model))
    result = analyze(args.video, model_path, step=args.step)

    if args.json:
        print(json.dumps(result, indent=2))
        return

    r = result
    print(f"Video: {r['video']}")
    print(
        f"Frames: {r['frames_total']} total, {r['frames_analyzed']} analyzed, "
        f"{r['frames_with_pose']} with pose"
    )
    print(f"Camera view: {r['view']}")
    print(f"REPS: {r['reps']}")
    for i, rep in enumerate(r["rep_detail"], 1):
        print(
            f"  rep {i}: min front-knee {rep['min_knee']:.0f} deg  "
            f"(depth {'OK' if rep['depth_ok'] else 'SHALLOW'}), "
            f"peak forward lean {rep['max_forward_lean']:.0f} deg"
        )
    print(
        f"All reps hit depth (<= {DEPTH_TARGET + DEPTH_OK_MARGIN:.0f} deg): "
        f"{r['all_reps_hit_depth']}"
    )
    print(
        f"Torso lean range: {r['torso_lean_range_deg'][0]:.0f}.."
        f"{r['torso_lean_range_deg'][1]:.0f} deg (+ forward / - back)"
    )
    print("Stop signs:")
    if r["knee_cave"] == "not_assessable_side_view":
        print(
            "  knee cave (valgus): NOT ASSESSABLE from a side view "
            "(needs a head-on / rear camera)"
        )
    else:
        print(
            f"  knee cave (valgus): {r['knee_cave'].upper()} "
            f"(max medial offset {r['valgus_max_front']})"
        )
    print(
        f"  low-back arch: {r['low_back_arch'].upper()} "
        f"(max sustained back-lean run {r['back_lean_run_max_frames']} frames)"
    )


if __name__ == "__main__":
    main()

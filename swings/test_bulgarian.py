"""Regression test for the Bulgarian split-squat analyzer.

There is no browser in CI, so we validate the shipped browser logic against a
real video through its ground-truth twin: ``swings/analyze_bulgarian.py`` runs
a pose model over ``swings/fixtures/bulgarian-demo.mp4`` (a compressed clip of
Igor's actual 3x8 @ 50 lb set) using the SAME thresholds and rep state-machine
that ``swings/index.html`` runs client-side. The expected values below were
measured on the fixture and match the full-resolution original; they lock the
current behavior so a threshold change that breaks the count fails here.

The harness is a uv-script with its own inline deps (mediapipe / opencv), so
the test shells out via ``uv run`` rather than importing it into the pytest
environment. It self-skips when ``uv`` or the fixture is unavailable; the model
is downloaded on first run (needs network) and cached next to the harness.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest

HERE = Path(__file__).parent
HARNESS = HERE / "analyze_bulgarian.py"
FIXTURE = HERE / "fixtures" / "bulgarian-demo.mp4"

# Igor reported 3x8 @ 50 lb; this fixture is one 8-rep set (his front/right leg).
EXPECTED_REPS = 8


@pytest.fixture(scope="module")
def result() -> dict:
    if shutil.which("uv") is None:
        pytest.skip("uv not on PATH; pose harness needs it to resolve deps")
    if not FIXTURE.exists():
        pytest.skip(f"fixture missing: {FIXTURE}")
    env = {
        **os.environ,
        "OMP_NUM_THREADS": "2",
        "MKL_NUM_THREADS": "2",
        "ORT_NUM_THREADS": "2",
    }
    proc = subprocess.run(
        ["uv", "run", str(HARNESS), str(FIXTURE), "--json"],
        capture_output=True,
        text=True,
        env=env,
        timeout=600,
    )
    if proc.returncode != 0:
        # Distinguish an environment problem (skip) from a real regression (fail).
        blob = (proc.stderr + proc.stdout).lower()
        env_trouble = any(
            s in blob
            for s in ("urlopen", "network", "temporary failure", "libegl", "no such")
        )
        if env_trouble:
            pytest.skip(
                f"pose harness could not run in this env:\n{proc.stderr[-800:]}"
            )
        raise AssertionError(
            f"harness failed (rc={proc.returncode}):\n{proc.stderr[-2000:]}"
        )
    # JSON is the last brace-delimited block on stdout (mediapipe logs to stderr).
    out = proc.stdout[proc.stdout.index("{") : proc.stdout.rindex("}") + 1]
    return json.loads(out)


def test_rep_count_matches_reported_set(result):
    """The counter must find Igor's 8 reps -- the real test of the state machine."""
    assert result["reps"] == EXPECTED_REPS


def test_per_rep_depth_reasonable(result):
    mins = result["min_knee_per_rep"]
    assert len(mins) == EXPECTED_REPS
    # Every rep's deepest front-knee angle should be a plausible squat bottom.
    assert all(55.0 <= m <= 105.0 for m in mins), mins
    # He goes below the ~90 deg parallel target on this set.
    assert result["all_reps_hit_depth"] is True


def test_side_view_gates_knee_cave(result):
    """Side-view clip -> valgus is not assessable, must not emit a bogus flag."""
    assert result["view"] == "side"
    assert result["knee_cave"] == "not_assessable_side_view"


def test_low_back_arch_ok(result):
    """He does not arch back on this set; the flag must stay clear."""
    assert result["low_back_arch"] == "ok"


def test_torso_lean_is_forward(result):
    lo, hi = result["torso_lean_range_deg"]
    assert hi >= 30.0, f"expected clear forward lean, got max {hi}"
    assert lo >= -45.0, f"unexpected large backward lean: {lo}"

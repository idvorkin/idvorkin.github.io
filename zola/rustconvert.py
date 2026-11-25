"""tools/convert, the Rust port of convert.py's Markdown fixes, loaded as a
Python extension. MOD is None with CONVERT_PY=1, and the Python runs.

The .so is compiled once per change to the crate (tools/convert/build.sh
caches it under ~/.cache/zola-convert); CONVERT_SO=<path> uses a prebuilt
one, as CI does. Every Rust function has a Python twin that stays the
reference: a call the Rust cannot finish raises RuntimeError, and the caller
redoes it in Python.
"""

import importlib.machinery
import importlib.util
import os
import subprocess
from pathlib import Path

TOOL = Path(__file__).resolve().parent.parent / "tools" / "convert"


def load():
    if os.environ.get("CONVERT_PY"):
        return None
    so = os.environ.get("CONVERT_SO")
    if not so:
        r = subprocess.run(
            [str(TOOL / "build.sh")], stdout=subprocess.PIPE, text=True, check=False
        )
        if r.returncode:
            raise SystemExit("tools/convert did not build (CONVERT_PY=1 skips it)")
        so = r.stdout.strip()
    loader = importlib.machinery.ExtensionFileLoader("zolaconvert", so)
    spec = importlib.util.spec_from_file_location("zolaconvert", so, loader=loader)
    mod = importlib.util.module_from_spec(spec)
    loader.exec_module(mod)
    return mod


MOD = load()

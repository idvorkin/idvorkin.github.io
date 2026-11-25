#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["pyyaml", "python-liquid==3.0.0", "markdown-it-py", "typer", "rich"]
# ///
"""The preview loop: build, serve, rebuild on change, reload the browser.

usage: SRC=<checkout> WORK=<dir> OUT=<dir> BASE_URL=<url> ZOLA=<bin> watch.py <port>
       (preview.sh sets all of that up)

One long-lived process, so a rebuild pays no interpreter or Liquid start-up
and reuses every page whose inputs did not change (convert.Cache). It waits
on inotify, not a poll, and after each rebuild rewrites $WORK/.built, which
serve.py --reload long-polls so open pages reload themselves.

Watched: the collections, _includes, _layouts, _data, assets and images
(recursively) and the checkout's root files, the same set the old polling
loop read. Not the root's directories: a main checkout holds .worktrees and
node_modules.
"""

import ctypes
import os
import select
import shutil
import signal
import struct
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build  # noqa: E402  (reads SRC/WORK/OUT/BASE_URL at import)
import convert  # noqa: E402

TREES = "_d _td _posts _ig66 _test _includes _layouts _data assets images".split()
IN_MODIFY, IN_ATTRIB, IN_CLOSE_WRITE = 0x2, 0x4, 0x8
IN_MOVED_FROM, IN_MOVED_TO, IN_CREATE, IN_DELETE = 0x40, 0x80, 0x100, 0x200
IN_ISDIR, IN_Q_OVERFLOW = 0x40000000, 0x4000
MASK = IN_ATTRIB | IN_CLOSE_WRITE | IN_MOVED_FROM | IN_MOVED_TO | IN_CREATE | IN_DELETE
PR_SET_PDEATHSIG = 1
QUIET = 0.03  # s without events that ends a burst (an editor's save is several)


class Inotify:
    """Just enough of inotify(7) through libc: no dependency, Linux only.
    ponytail: no macOS (no FSEvents); preview there would need a poll."""

    def __init__(self):
        self.libc = ctypes.CDLL(None, use_errno=True)
        self.fd = self.libc.inotify_init1(os.O_CLOEXEC)
        if self.fd < 0:
            raise OSError(ctypes.get_errno(), "inotify_init1")
        self.dirs: dict[int, tuple[Path, bool]] = {}  # wd -> (dir, is_root)

    def add(self, d: Path, root: bool = False) -> None:
        wd = self.libc.inotify_add_watch(self.fd, str(d).encode(), MASK)
        if wd < 0:
            raise OSError(ctypes.get_errno(), f"inotify_add_watch {d}")
        self.dirs[wd] = (d, root)

    def add_tree(self, d: Path) -> None:
        for p, _, _ in os.walk(d):
            self.add(Path(p))

    def wait(self) -> list[Path]:
        """Block until something changed, then gather the whole burst."""
        changed: list[Path] = []
        timeout = None
        while select.select([self.fd], [], [], timeout)[0]:
            changed += self._read()
            timeout = QUIET
            if not changed:
                timeout = None  # only ignored names so far: keep waiting
        return changed

    def _read(self) -> list[Path]:
        buf, out, i = os.read(self.fd, 1 << 16), [], 0
        while i < len(buf):
            wd, mask, _, n = struct.unpack_from("iIII", buf, i)
            name = buf[i + 16 : i + 16 + n].rstrip(b"\0").decode(errors="replace")
            i += 16 + n
            if mask & IN_Q_OVERFLOW:
                out.append(build.SRC)  # lost events: rebuild anyway
                continue
            if wd not in self.dirs or not name or name.startswith("."):
                continue
            d, root = self.dirs[wd]
            if root and (
                mask & IN_ISDIR or (name.startswith("_") and name != "_config.yml")
            ):
                continue  # root directories and _zsite-style scratch are not read
            if mask & IN_ISDIR and mask & (IN_CREATE | IN_MOVED_TO):
                self.add_tree(d / name)
            out.append(d / name)
        return out


def publish(n: int) -> None:
    """After a build: back-links, the overlay, then the stamp serve.py polls."""
    subprocess.run(
        [HERE / "backlinks.sh"], check=True, env={**os.environ, "BACKLINKS": "cached"}
    )
    overlay = build.WORK / "overlay"
    if overlay.is_dir():
        shutil.copytree(overlay, build.OUT, dirs_exist_ok=True)
    stamp = build.WORK / ".built"
    tmp = stamp.with_name(".built.tmp")
    tmp.write_text(f"{n}:{time.time():.3f}")
    tmp.rename(stamp)


def search_index() -> None:
    """Pagefind over the first build, into the overlay so every rebuild keeps
    it (zola build --force empties OUT). Built once per start, like the old
    `just build-search`; restart the preview to refresh it."""
    dest = build.WORK / "overlay" / "pagefind"
    shutil.rmtree(dest, ignore_errors=True)
    log = build.WORK / "pagefind.log"
    with log.open("w") as f:
        r = subprocess.run(
            [
                "npx",
                "--yes",
                "pagefind@1.5.2",
                "--site",
                build.OUT,
                "--output-path",
                dest,
            ],
            cwd=build.SRC,
            stdout=f,
            stderr=subprocess.STDOUT,
        )
    if r.returncode:
        print(f"pagefind failed (see {log}); serving without search", flush=True)


def main() -> None:
    port = sys.argv[1]
    src = build.SRC
    notify = Inotify()
    notify.add(src, root=True)
    for t in TREES:
        if (src / t).is_dir():
            notify.add_tree(src / t)
    cache = convert.Cache()
    t0 = time.monotonic()
    build.build(cache)
    if os.environ.get("PAGEFIND"):
        search_index()
    publish(0)
    print(f"built in {time.monotonic() - t0:.1f} s", flush=True)
    server = subprocess.Popen(
        [
            sys.executable,
            HERE / "serve.py",
            build.OUT,
            port,
            "--reload",
            build.WORK / ".built",
        ],
        # The server dies with this process, however it dies.
        preexec_fn=lambda: ctypes.CDLL(None).prctl(PR_SET_PDEATHSIG, signal.SIGTERM),
    )

    def stop(*_):
        server.terminate()
        os._exit(0)  # not sys.exit: the build loop catches SystemExit

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    print(
        f"preview: {build.BASE_URL}  (pid {os.getpid()}, server {server.pid}, source {src})",
        flush=True,
    )
    n = 0
    try:
        while True:
            changed = notify.wait()
            t0 = time.monotonic()
            n += 1
            try:
                times = build.build(cache)
                publish(n)
            except (Exception, SystemExit) as e:  # noqa: BLE001 — keep serving the last good build
                print(
                    f"build failed ({e}); still serving the last good build", flush=True
                )
                continue
            names = ", ".join(sorted({p.name for p in changed})[:3])
            print(
                f"rebuilt in {time.monotonic() - t0:.2f} s {times} after {names}",
                flush=True,
            )
    finally:
        server.terminate()


if __name__ == "__main__":
    main()

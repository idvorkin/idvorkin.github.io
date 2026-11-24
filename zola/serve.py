#!/usr/bin/env python3
"""Static server for the Zola preview, behaving like GitHub Pages where it
matters: /x 301s to /x/ (http.server does this already), and a miss serves
/404.html with status 404.

usage: serve.py <dir> <port> [--reload <stamp file>]
       (binds 127.0.0.1; tailscale serve fronts it)

Also serves /x from x.html, as Pages does, so it can serve a Jekyll _site
for side-by-side screenshots too.

--reload (previews only): every HTML response gets a small script that
long-polls /__reload, which answers when the stamp file's text changes
(watch.py rewrites it after each rebuild), and the page reloads. It is added
as the page is served, so the files on disk stay the build's own and the
verify gate sees no difference.
"""

import functools
import http.server
import io
import sys
import time
from urllib.parse import unquote
from pathlib import Path

root, port = Path(sys.argv[1]).resolve(), int(sys.argv[2])
stamp = Path(sys.argv[4]) if sys.argv[3:4] == ["--reload"] else None
RELOAD = b"""<script>(async () => {
  let seen = null;
  for (;;) {
    try {
      const r = await fetch("/__reload?seen=" + encodeURIComponent(seen ?? ""));
      const now = await r.text();
      if (seen !== null && now !== seen) return location.reload();
      seen = now;
    } catch (e) {
      await new Promise((ok) => setTimeout(ok, 2000));
    }
  }
})();</script>"""


def build_id() -> str:
    try:
        return stamp.read_text()
    except OSError:
        return ""


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        # Pages serves /x from x.html for any file (static pages too).
        if not Path(p).exists() and Path(p + ".html").exists():
            return p + ".html"
        return p

    def do_GET(self):
        if stamp and self.path.startswith("/__reload"):
            seen = self.path.partition("seen=")[2]
            # Long poll: answer at once if the build moved on, else wait for
            # it (up to 25 s, then the page asks again).
            for _ in range(250):
                if not seen or build_id() != unquote(seen):
                    break
                time.sleep(0.1)
            body = build_id().encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def send_head(self):
        if not stamp:
            return super().send_head()
        p = Path(self.translate_path(self.path))
        if p.is_dir() and self.path.split("?")[0].endswith("/"):
            p = p / "index.html"
        if p.suffix != ".html" or not p.is_file():
            return super().send_head()  # directory redirects, assets, misses
        body = self.with_reload(p.read_bytes())
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        return io.BytesIO(body)

    def send_error(self, code, message=None, explain=None):
        page = root / "404.html"
        if code == 404 and page.exists():
            body = self.with_reload(page.read_bytes())
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def with_reload(self, html: bytes) -> bytes:
        if not stamp:
            return html
        i = html.lower().rfind(b"</body>")
        return html + RELOAD if i < 0 else html[:i] + RELOAD + html[i:]

    def log_message(self, *args):
        pass


http.server.ThreadingHTTPServer(
    ("127.0.0.1", port), functools.partial(Handler, directory=str(root))
).serve_forever()

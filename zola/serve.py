#!/usr/bin/env python3
"""Static server for the Zola preview, behaving like GitHub Pages where it
matters: /x 301s to /x/ (http.server does this already), and a miss serves
/404.html with status 404.

usage: serve.py <dir> <port> [--reload <stamp file>]
       (binds $SERVE_HOST, default 127.0.0.1; `just serve` sets 0.0.0.0 on
       the dev VM so the tailnet reaches it, as `jekyll serve` did)

Also serves /x from x.html, as Pages does, so it can serve a Jekyll _site
for side-by-side screenshots too.

--reload (previews only): every HTML response gets a small script that asks
/__reload for the stamp file's text once a second (watch.py rewrites it after
each rebuild) and reloads the page when it changes. A short poll, not a long
one: a held request per tab would eat HTTP/1.1's six connections per host
and keep Playwright's networkidle from ever settling. It is added
as the page is served, so the files on disk stay the build's own and the
verify gate sees no difference.
"""

import functools
import http.server
import io
import os
import sys
from pathlib import Path

root, port = Path(sys.argv[1]).resolve(), int(sys.argv[2])
stamp = Path(sys.argv[4]) if sys.argv[3:4] == ["--reload"] else None
RELOAD = b"""<script>(() => {
  let seen = null;
  setInterval(async () => {
    try {
      const now = await (await fetch("/__reload", { cache: "no-store" })).text();
      if (seen !== null && now !== seen) location.reload();
      seen = now;
    } catch (e) {}
  }, 1000);
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


class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        # A browser or test that navigates away mid-response drops the socket;
        # that is not worth a traceback per request.
        if not isinstance(sys.exc_info()[1], ConnectionError):
            super().handle_error(request, client_address)


Server(
    (os.environ.get("SERVE_HOST", "127.0.0.1"), port),
    functools.partial(Handler, directory=str(root)),
).serve_forever()

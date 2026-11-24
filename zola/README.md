# Zola build of idvork.in

Builds the blog from its Jekyll sources with Zola 0.23.x. Jekyll stays the
source of truth; nothing in `_d/`, `_posts/`, `_includes/` or `_layouts/` is
edited or copied into git. Why and how: [DESIGN.md](DESIGN.md).

```bash
zola/build.sh                              # this checkout -> zola/.work/public
SRC=<any checkout> OUT=<dir> zola/build.sh # the checkout needs no zola/ in it
zola/preview.sh <checkout> 4480            # build, serve, rebuild on change, live reload
zola/verify/verify.sh                      # pixel + DOM diff against _site
```

`ZOLA` defaults to `zola` on PATH, else `~/tmp/agent/skill/zola/zola`.

| File               | Job                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `build.sh`         | The one build entry point (mirror and the harness call it); runs `build.py`, then back-links and Pagefind |
| `build.py`         | The build in one process: static, data, convert, Zola, finish; `watch.py` keeps it loaded                 |
| `stage_static.py`  | Hard-links the files Jekyll copies verbatim                                                               |
| `jekyll_liquid.py` | Jekyll's Liquid pass on python-liquid: `{% include %}`, lax syntax, Jekyll filters                        |
| `convert.py`       | Per page: Liquid, kramdown to CommonMark fixes, pinned heading ids, the layout around a mark              |
| `finish.py`        | Zola's `/x/index.html` to Jekyll's `/x.html`, layout splice, redirect stubs, code blocks                  |
| `templates/pages/` | The five listing pages still ported by hand (pinned by `ported.lock`)                                     |
| `diff_sites.py`    | Static diff of two builds: URL inventory, text, heading ids, broken links                                 |
| `verify/`          | Screenshots of both builds, pixel and DOM diff, ranked report, ratchet gate                               |
| `backlinks.sh`     | `back-links.json` from the Zola output, or the cached one on preview rebuilds                             |
| `preview.sh`       | Serve a checkout, rebuild when it changes, reload open pages                                              |
| `watch.py`         | The preview loop: inotify, page cache across builds, the build stamp                                      |
| `serve.py`         | Static server that answers `/x` from `x.html`, as GitHub Pages does; `--reload` for previews              |

## Known differences from Jekyll

- Code blocks have rouge's wrapper structure but not its token spans.
- Smart-quote direction in a few spots, footnote markers and ids, and
  kramdown attribute lists (`{: ...}`) other than `start=`.
- `links.jsonp` is not built (nothing loads it). `sitemap.xml` is Zola's own.
- An undated `_d`/`_td` document has no `date` meta (Jekyll stamped build time).

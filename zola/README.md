# Zola build of idvork.in

idvork.in is built by Zola from the unchanged Jekyll sources: the Pages
workflow runs `zola/build.sh`. Nothing in `_d/`, `_posts/`, `_includes/` or
`_layouts/` is ported or copied; Jekyll's own Liquid renders layouts,
includes, listings and feeds, and kramdown's Markdown rules are carried into
CommonMark by the shim. Why and how: [DESIGN.md](DESIGN.md).

```bash
just setup              # once: pinned Zola, uv, the shim's deps, node_modules (zola/install.sh)
just zola-serve         # preview this checkout on :4471, rebuild on save
just zola-build         # _site/ exactly as the Pages workflow builds it
just zola-parity        # gate: Jekyll and Zola builds of this checkout must match
just zola-update 0.24.0 # bump the pinned Zola (no arg: refresh the shim's deps), then the gate
```

The Zola version lives in one place, `zola/ZOLA_VERSION`; `install.sh`,
`build.sh`, `preview.sh` and both workflows read it. Install is tested on the
Linux dev VM from an empty `HOME`; the macOS path (Apple silicon and Intel
release tarballs) is written but not yet run on a Mac.

**A page renders differently from Jekyll?** Run `just zola-parity`: it lists
every file that differs and is not in `verify/accepted.txt`. Fix the shim,
never the post. Where a render goes wrong:

- Markdown block structure (list looseness, kramdown tables, HTML blocks,
  `<dl>`, setext): `lists.py`, then `convert.py` (`kramdownisms`,
  `html_block_lines`, `place_tokens` for includes).
- Quotes, dashes, ellipses: `typography.py`.
- Liquid, includes, filters: `jekyll_liquid.py`; the `site.*` model and
  feeds: `convert.py` (`site_docs`, `liquid_collections`, `render_feeds`).
- Final HTML (footnotes, task lists, URL layout, markers): `finish.py`.

A difference that Jekyll gets wrong and Zola gets right goes in
`verify/accepted.txt` with its reason, and only with Igor's OK.

| File               | Job                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `build.sh`         | The one build entry point (mirror and the harness call it); runs `build.py`, then back-links and Pagefind |
| `build.py`         | The build in one process: static, data, convert, Zola, finish; `watch.py` keeps it loaded                 |
| `stage_static.py`  | Hard-links the files Jekyll copies verbatim                                                               |
| `lists.py`         | kramdown block rules: per-item list looseness, header-less tables, HTML-block and `<dl>` cases            |
| `typography.py`    | kramdown's smart quotes and typographic symbols                                                           |
| `install.sh`       | `just setup`: the pinned Zola, uv, the shim's deps                                                        |
| `update.sh`        | `just zola-update`: bump the pin or deps, then the parity gate                                            |
| `jekyll_liquid.py` | Jekyll's Liquid pass on python-liquid: `{% include %}`, lax syntax, Jekyll filters                        |
| `convert.py`       | Per page: Liquid, kramdown to CommonMark fixes, pinned heading ids, the layout around a mark              |
| `finish.py`        | Zola's `/x/index.html` to Jekyll's `/x.html`, layout splice, redirect stubs, code blocks                  |
| `diff_sites.py`    | Static diff of two builds: URL inventory, text, heading ids, broken links                                 |
| `verify/`          | `parity.sh` (the file-by-file gate, `accepted.txt`); screenshot, pixel and DOM diff tools                 |
| `backlinks.sh`     | `back-links.json` from the Zola output, or the cached one on preview rebuilds                             |
| `preview.sh`       | Serve a checkout, rebuild when it changes, reload open pages                                              |
| `watch.py`         | The preview loop: inotify, page cache across builds, the build stamp                                      |
| `serve.py`         | Static server that answers `/x` from `x.html`, as GitHub Pages does; `--reload` for previews              |

## Known differences from Jekyll

`verify/accepted.txt` is the list, each with its reason: pages where Jekyll's
own output is broken (Zola renders the post's intent, Igor's call), one
invisible nesting difference, and generated files whose entry order follows
Ruby's sort. Code blocks lack rouge's token spans, which nobody sees:
`hljs.highlightAll()` re-highlights every block in the browser.

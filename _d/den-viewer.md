---
layout: post
title: "The Den — cartoon viewer (demo)"
permalink: /den-viewer
search_exclude: true
tags:
  - ai
---

On a phone each panel of a [Den](/the-den) strip is about 190 pixels wide and the hand-lettering is a smudge. This page is a demo of the fix: tap a panel and it fills the width. Arrows, swipe, and the keyboard step through every panel of every strip; tap again, hit the X, or press Escape to come back out.

Nothing here is final. It is the interaction on its own, so it can be argued with before it goes anywhere near [the real page](/the-den).

<!--
  DEMO ONLY — the viewer lives inline here on purpose.

  FOLLOW-UP: once the interaction is right, fold this into
  _includes/den_strip.html so every strip on /the-den gets it. Both pages
  would then loop over the same _data/den.json.

  DATA: every strip on this page comes from _data/den.json — the figures are
  rendered from it by Liquid and the whole file is inlined below as JSON for
  the script. There are no per-strip attributes to keep in sync, and no
  runtime panel geometry: each strip ships its four panels as pre-cut files
  and the zoomed view shows the file.
-->

<style>
  .den-viewer {
    --den-fg: #1a1a1a;
    --den-bg: rgba(255, 255, 255, 0.92);
    --den-line: rgba(0, 0, 0, 0.18);
    --den-ring: #0b5ed7;
    --den-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    max-width: 820px;
    margin: 0 auto;
  }

  @media (prefers-color-scheme: dark) {
    .den-viewer {
      --den-fg: #f2f2f2;
      --den-bg: rgba(28, 28, 30, 0.92);
      --den-line: rgba(255, 255, 255, 0.24);
      --den-ring: #6ea8fe;
      --den-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
    }
  }

  /* The site is light-only today; this keeps the viewer correct if a
     Bootstrap theme switch ever lands. */
  [data-bs-theme="dark"] .den-viewer {
    --den-fg: #f2f2f2;
    --den-bg: rgba(28, 28, 30, 0.92);
    --den-line: rgba(255, 255, 255, 0.24);
    --den-ring: #6ea8fe;
    --den-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  }

  .den-hint {
    font-size: 0.85em;
    opacity: 0.75;
    margin-bottom: 1.5em;
  }

  .den-strip {
    margin: 0 0 2.5em;
  }

  .den-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 6px;
    background: var(--den-bg);
  }

  .den-frame img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    display: block;
    transform-origin: 0 0;
    transition: transform 250ms cubic-bezier(0.2, 0.7, 0.3, 1);
  }

  .den-frame.is-zoomed {
    /* Let a vertical drag scroll the page; horizontal is ours. */
    touch-action: pan-y;
  }

  /* The zoomed view proper: the pre-cut panel file, laid over the composite
     once it has loaded. The composite behind it is only the animation. */
  .den-sharp {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms linear;
  }

  /* One invisible button per panel. */
  .den-hit {
    position: absolute;
    z-index: 2;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: zoom-in;
    border-radius: 4px;
  }

  .den-hit:focus-visible {
    outline: 3px solid var(--den-ring);
    outline-offset: -3px;
  }

  .den-frame.is-zoomed .den-hit {
    display: none;
  }

  /* Tap-anywhere-to-close, under the controls. */
  .den-out {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: none;
    border: 0;
    background: transparent;
    cursor: zoom-out;
  }

  .den-frame.is-zoomed .den-out {
    display: block;
  }

  .den-ui {
    position: absolute;
    inset: 0;
    z-index: 4;
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms linear;
  }

  .den-frame.is-zoomed .den-ui {
    opacity: 1;
  }

  .den-ui > * {
    pointer-events: auto;
  }

  .den-badge {
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 5px 11px;
    border-radius: 999px;
    font:
      600 13px/1.2 system-ui,
      -apple-system,
      sans-serif;
    color: var(--den-fg);
    background: var(--den-bg);
    border: 1px solid var(--den-line);
    box-shadow: var(--den-shadow);
  }

  .den-nav,
  .den-close {
    position: absolute;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--den-line);
    background: var(--den-bg);
    color: var(--den-fg);
    box-shadow: var(--den-shadow);
    cursor: pointer;
    line-height: 1;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .den-nav {
    top: 50%;
    transform: translateY(-50%);
    font-size: 26px;
    padding-bottom: 3px;
  }

  .den-prev {
    left: 8px;
  }

  .den-next {
    right: 8px;
  }

  .den-close {
    right: 8px;
    top: 8px;
    font-size: 22px;
  }

  .den-nav:focus-visible,
  .den-close:focus-visible {
    outline: 3px solid var(--den-ring);
    outline-offset: 2px;
  }

  .den-strip figcaption {
    font-size: 0.85em;
    opacity: 0.75;
    margin-top: 8px;
  }

  @media (prefers-reduced-motion: reduce) {
    .den-frame img,
    .den-sharp,
    .den-ui {
      transition: none;
    }
  }
</style>

<div class="den-viewer" id="den-viewer">
<p class="den-hint">Tap or click a panel to zoom. Then: <b>‹ ›</b> or swipe or ← → to step (it runs on into the next strip), <b>×</b> or tap again or Escape to come back out.</p>
{% for strip in site.data.den %}
<figure class="den-strip" data-num="{{ strip.num }}">
<div class="den-frame"><img src="{{ strip.img }}" alt="{{ strip.alt | escape }}" width="1600" height="1600" {% unless forloop.first %}loading="lazy" {% endunless %}decoding="async" /></div>
<figcaption><em>#{{ strip.num }} — {{ strip.title }}</em> · {{ strip.date }}</figcaption>
</figure>
{% endfor %}
</div>

<script type="application/json" id="den-manifest">{{ site.data.den | jsonify }}</script>

## Where the panels come from

The viewer used to crop panels out of the composite at runtime, which meant it had to be told where each strip's panels were — and the first four strips were each drawn to slightly different margins, so each carried its own numbers. It doesn't do that any more. Every strip ships its four panels as their own files, cut once and checked in:

```text
images/den/den-00N.webp      the composite, 1600x1600
images/den/den-00N-p1.webp   panel 1, 800x800
   …-p2.webp  …-p3.webp  …-p4.webp
```

Each panel is cut at its own border rect — the 8px frame line is drawn _inside_ that rect, so the crop keeps the frame and never touches the neighbour — then resized to 800x800 at quality 90. That is a real 800px image rather than a quarter of a 1600px square upscaled, which is the whole point on a phone.

Strips #1–#4 predate the grid contract below and were measured one at a time for the cut. That measurement happened once, offline. None of it is in this page.

## One file that knows about the strips

`_data/den.json` is the list, newest first, one entry per strip:

```json
{
  "num": 4,
  "title": "Cause of Gym: Outage",
  "date": "August 28, 2026",
  "img": "/images/den/den-004.webp",
  "alt": "The Den #4: …",
  "receipts_url": "https://gist.github.com/…",
  "panels": [
    "/images/den/den-004-p1.webp",
    "…-p2.webp",
    "…-p3.webp",
    "…-p4.webp"
  ]
}
```

The figures above are rendered from it by Liquid, and the same file is inlined into the page as JSON so the script can read the panel list. **Adding a strip is five files in `images/den/` and one entry appended to `_data/den.json`.** Nothing in this page changes.

## The grid a strip has to be drawn to

The contract still matters — not to the viewer, but to the drawing and to the cut. One set of numbers, at 1600x1600:

**32px margin · 752px panel · 32px gutter · 752px panel · 32px margin**, the same both ways — four square panels, read left to right, top to bottom. It closes exactly, and every value is a multiple of 8, so the 800px panel export and any 2x display land on whole pixels. As fractions of the canvas: a 2% margin, a 2% gutter, and a 47% panel.

That is the `GRID` constant at the top of the script, and it is now cosmetic in both of its uses: where to put the invisible tap targets, and where the zoom animation starts from. Because nothing is cropped at runtime, a strip that misses the contract by a percent — as most of these do — lands in exactly the right place anyway. The pre-cut file is the destination.

<script>
  // Den cartoon viewer — demo. Vanilla, no library, no build step.
  //
  // Zooming in is two things at once: the composite is transformed inside its
  // square window so the panel roughly fills it, and the panel's own pre-cut
  // file fades in on top. The file is what you end up looking at; the
  // transform is the animation that gets you there.
  (function () {
    var root = document.getElementById("den-viewer");
    var data = document.getElementById("den-manifest");
    if (!root || !data) return;

    var manifest = JSON.parse(data.textContent);
    var byNum = {};
    manifest.forEach(function (s) {
      byNum[String(s.num)] = s;
    });

    // ---------------------------------------------------------------------
    // THE GRID CONTRACT — cosmetic here, load-bearing for the cartoonist.
    //
    // Every Den strip is a 2x2 grid of four square panels on a cream page,
    // drawn at 1600x1600:
    //
    //     32px margin | 752px panel | 32px gutter | 752px panel | 32px margin
    //
    // which closes exactly (32+752+32+752+32 = 1600) and is a multiple of 8
    // throughout, so an 800px panel export and any 2x display land on whole
    // pixels. As fractions: inset 2%, gutter 2%, panel side 47%.
    //
    // Nothing is cropped at runtime, so these two numbers only decide where
    // the tap targets sit and where the zoom animation starts. A strip that
    // misses the contract by a percent — all four of today's do — still shows
    // the right thing, because the thing shown is its own pre-cut panel file
    // from the manifest. Panel geometry is a build-time problem now.
    // ---------------------------------------------------------------------
    var GRID = { inset: 2.0, gap: 2.0 }; // percent of the canvas
    var SIDE = (100 - 2 * GRID.inset - GRID.gap) / 2; // 47

    var SWIPE = 40; // px of horizontal travel that counts as a swipe
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var panels = []; // flat, DOM order, so stepping runs on into the next strip
    var active = null; // index into panels, or null when nothing is zoomed

    root.querySelectorAll(".den-strip").forEach(function (strip) {
      var entry = byNum[strip.dataset.num];
      if (!entry) return;
      var files = entry.panels || [];
      var frame = strip.querySelector(".den-frame");
      var num = entry.num;

      for (var i = 0; i < 4; i++) {
        var rect = {
          x: GRID.inset + (i % 2) * (SIDE + GRID.gap),
          y: GRID.inset + ((i / 2) | 0) * (SIDE + GRID.gap),
          side: SIDE,
        };
        var hit = document.createElement("button");
        hit.type = "button";
        hit.className = "den-hit";
        hit.style.left = rect.x + "%";
        hit.style.top = rect.y + "%";
        hit.style.width = rect.side + "%";
        hit.style.height = rect.side + "%";
        hit.setAttribute(
          "aria-label",
          "Zoom into panel " + (i + 1) + " of strip #" + num,
        );
        frame.appendChild(hit);

        var index = panels.length;
        hit.addEventListener(
          "click",
          (function (n) {
            return function () {
              zoomTo(n, false);
            };
          })(index),
        );
        panels.push({
          strip: strip,
          frame: frame,
          rect: rect,
          n: i + 1,
          num: num,
          hit: hit,
          file: files[i] || null,
        });
      }

      var sharp = document.createElement("img");
      sharp.className = "den-sharp";
      sharp.alt = "";
      sharp.decoding = "async";
      sharp.setAttribute("aria-hidden", "true");
      // Only reveal a panel file once it has actually decoded, so stepping
      // never flashes the previous panel.
      sharp.addEventListener("load", function () {
        if (active !== null && panels[active].frame === frame) {
          sharp.style.opacity = "1";
        }
      });
      frame.appendChild(sharp);

      var out = document.createElement("button");
      out.type = "button";
      out.className = "den-out";
      out.setAttribute("aria-label", "Zoom back out");
      frame.appendChild(out);

      var ui = document.createElement("div");
      ui.className = "den-ui";
      ui.innerHTML =
        '<span class="den-badge"></span>' +
        '<button type="button" class="den-nav den-prev" aria-label="Previous panel">‹</button>' +
        '<button type="button" class="den-nav den-next" aria-label="Next panel">›</button>' +
        '<button type="button" class="den-close" aria-label="Close zoom">×</button>';
      frame.appendChild(ui);

      ui.querySelector(".den-prev").addEventListener("click", function () {
        step(-1);
      });
      ui.querySelector(".den-next").addEventListener("click", function () {
        step(1);
      });
      ui.querySelector(".den-close").addEventListener("click", close);

      // Swipe. A swipe also fires a click on .den-out, so a handled swipe sets
      // a flag that the close handler consumes instead of zooming out.
      var sx = 0,
        sy = 0,
        tracking = false,
        swiped = false;
      frame.addEventListener("pointerdown", function (e) {
        if (!frame.classList.contains("is-zoomed")) return;
        sx = e.clientX;
        sy = e.clientY;
        tracking = true;
        swiped = false;
      });
      frame.addEventListener("pointercancel", function () {
        tracking = false;
      });
      frame.addEventListener("pointerup", function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.clientX - sx;
        var dy = e.clientY - sy;
        if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
          swiped = true;
          step(dx < 0 ? 1 : -1);
        }
      });
      out.addEventListener("click", function () {
        if (swiped) {
          swiped = false;
          return;
        }
        close();
      });
    });

    function composite(frame) {
      return frame.querySelector("img:not(.den-sharp)");
    }

    function clear(frame) {
      frame.classList.remove("is-zoomed");
      composite(frame).style.transform = "";
      frame.querySelector(".den-sharp").style.opacity = "0";
    }

    // Pull the whole strip's panels into cache on first zoom, so stepping
    // through it never waits on the network.
    function warm(p) {
      if (p.strip.dataset.warm) return;
      p.strip.dataset.warm = "1";
      (byNum[String(p.num)].panels || []).forEach(function (f) {
        new Image().src = f;
      });
    }

    function zoomTo(index, scroll) {
      if (index < 0) index = panels.length - 1;
      if (index >= panels.length) index = 0;
      var p = panels[index];
      if (active !== null && panels[active].frame !== p.frame) {
        clear(panels[active].frame);
      }
      active = index;
      warm(p);

      // The animation: scale until the panel's width is the window's, then
      // slide its top-left corner to the window's.
      var scale = 100 / p.rect.side;
      composite(p.frame).style.transform =
        "scale(" +
        scale.toFixed(4) +
        ") translate(" +
        (-p.rect.x).toFixed(3) +
        "%," +
        (-p.rect.y).toFixed(3) +
        "%)";
      p.frame.classList.add("is-zoomed");
      p.frame.querySelector(".den-badge").textContent =
        "#" + p.num + " · panel " + p.n + " of 4";

      // The destination: this panel's own file, cut at its border rect.
      var sharp = p.frame.querySelector(".den-sharp");
      if (!p.file) {
        sharp.style.opacity = "0";
      } else if (sharp.getAttribute("src") !== p.file) {
        sharp.style.opacity = "0"; // the load handler reveals it
        sharp.setAttribute("src", p.file);
      } else if (sharp.complete && sharp.naturalWidth) {
        sharp.style.opacity = "1";
      }

      if (scroll) {
        p.frame.scrollIntoView({
          block: "center",
          behavior: reduce ? "auto" : "smooth",
        });
      }
    }

    function step(delta) {
      if (active === null) return;
      var next = active + delta;
      var changesStrip =
        next < 0 ||
        next >= panels.length ||
        panels[(next + panels.length) % panels.length].frame !==
          panels[active].frame;
      zoomTo(next, changesStrip);
    }

    function close() {
      if (active === null) return;
      var p = panels[active];
      clear(p.frame);
      active = null;
      p.hit.focus({ preventScroll: true });
    }

    document.addEventListener("keydown", function (e) {
      if (active === null) return;
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        step(1);
      } else if (e.key === "ArrowLeft") {
        step(-1);
      } else {
        return;
      }
      e.preventDefault();
    });
  })();
</script>

---
layout: post
title: "The Den — cartoon viewer (demo)"
permalink: /den-viewer
search_exclude: true
tags:
  - ai
---

On a phone each panel of a [Den](/the-den) strip is about 190 pixels wide and the hand-lettering is a smudge. This demo opens each panel in a full-screen lightbox, with navigation and captions kept outside the art.

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
    and the lightbox shows the file.
-->

<style>
  .den-viewer {
    --den-bg: rgba(255, 255, 255, 0.92);
    --den-ring: #0b5ed7;
    max-width: 820px;
    margin: 0 auto;
  }

  @media (prefers-color-scheme: dark) {
    .den-viewer {
      --den-bg: rgba(28, 28, 30, 0.92);
      --den-ring: #6ea8fe;
    }
  }

  /* The site is light-only today; this keeps the viewer correct if a
     Bootstrap theme switch ever lands. */
  [data-bs-theme="dark"] .den-viewer {
    --den-bg: rgba(28, 28, 30, 0.92);
    --den-ring: #6ea8fe;
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
  }

  /* One invisible button per panel. */
  .den-hit {
    position: absolute;
    z-index: 2;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
  }

  .den-hit:focus-visible {
    outline: 3px solid var(--den-ring);
    outline-offset: -3px;
  }

  .den-strip figcaption {
    font-size: 0.85em;
    opacity: 0.75;
    margin-top: 8px;
  }

  html.den-lightbox-open,
  body.den-lightbox-open {
    overflow: hidden;
  }

  .den-lightbox {
    --den-panel-size: min(800px, calc(100vw - 48px), calc(100vh - 220px));
    position: fixed;
    inset: 0;
    z-index: 2147483640;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 12px 24px;
    background: rgba(0, 0, 0, 0.92);
    color: #f8f9fa;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 180ms ease,
      visibility 0s linear 180ms;
  }

  .den-lightbox[hidden] {
    display: none;
  }

  .den-lightbox.is-open {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }

  .den-lightbox__dialog {
    display: grid;
    grid-template-rows: minmax(44px, auto) var(--den-panel-size) minmax(80px, auto);
    justify-items: center;
    width: 100%;
    max-height: 100%;
  }

  .den-lightbox__topbar,
  .den-lightbox__caption {
    box-sizing: border-box;
    width: var(--den-panel-size);
  }

  .den-lightbox__topbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
    padding-bottom: 8px;
  }

  .den-lightbox__title {
    overflow: hidden;
    min-width: 0;
    font-size: 0.94rem;
    font-weight: 600;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .den-lightbox__strip-change {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    max-width: calc(100% - 88px);
    padding: 5px 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 999px;
    background: rgba(35, 35, 35, 0.96);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
    font-size: 0.72rem;
    font-weight: 650;
    line-height: 1.2;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    text-overflow: ellipsis;
    transform: translate(-50%, -45%);
    transition:
      opacity 160ms ease,
      transform 160ms ease;
    white-space: nowrap;
  }

  .den-lightbox__strip-change.is-visible {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  .den-lightbox button,
  .den-lightbox a {
    -webkit-tap-highlight-color: transparent;
  }

  .den-lightbox__close,
  .den-lightbox__side,
  .den-lightbox__dot {
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  .den-lightbox__close {
    display: inline-flex;
    flex: 0 0 40px;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: -4px -8px -4px 0;
    padding: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 1.65rem;
    line-height: 1;
  }

  .den-lightbox__close:hover,
  .den-lightbox__close:active,
  .den-lightbox__side:hover,
  .den-lightbox__side:active {
    background: rgba(255, 255, 255, 0.18);
  }

  .den-lightbox__close:focus-visible,
  .den-lightbox__side:focus-visible,
  .den-lightbox__dot:focus-visible,
  .den-lightbox__strip-link:focus-visible {
    outline: 3px solid #8ab4ff;
    outline-offset: 3px;
  }

  .den-lightbox__stage {
    display: grid;
    grid-template-columns: var(--den-panel-size);
    align-items: center;
    justify-content: center;
  }

  .den-lightbox__image-shell {
    position: relative;
    grid-column: 1;
    width: var(--den-panel-size);
    height: var(--den-panel-size);
    overflow: hidden;
    border-radius: 4px;
    background: #e6e0d5;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
    touch-action: pan-y;
  }

  .den-lightbox__image {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    pointer-events: none;
    transition: opacity 170ms ease;
  }

  .den-lightbox__image.is-outgoing,
  .den-lightbox__image.is-current {
    opacity: 1;
  }

  .den-lightbox__image.is-current {
    z-index: 1;
  }

  .den-lightbox__tap {
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    width: 33.333%;
    padding: 0;
    border: 0;
    background: transparent;
    color: transparent;
  }

  .den-lightbox__tap-previous {
    left: 0;
  }

  .den-lightbox__tap-next {
    right: 0;
  }

  .den-lightbox__side {
    display: none;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    padding: 0 0 4px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    font-size: 2.2rem;
    line-height: 1;
  }

  .den-lightbox__side:disabled {
    cursor: default;
    opacity: 0.28;
  }

  .den-lightbox__caption {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px 16px;
    align-content: start;
    padding-top: 12px;
    font-size: 0.82rem;
  }

  .den-lightbox__position {
    display: flex;
    grid-column: 1 / -1;
    align-items: center;
    gap: 12px;
  }

  .den-lightbox__counter {
    font-weight: 600;
    white-space: nowrap;
  }

  .den-lightbox__dots {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .den-lightbox__dot {
    position: relative;
    width: 28px;
    height: 32px;
    padding: 0;
    background: transparent;
  }

  .den-lightbox__dot::before {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7px;
    height: 7px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    content: "";
    transform: translate(-50%, -50%);
  }

  .den-lightbox__dot[aria-current="true"]::before {
    background: #fff;
  }

  .den-lightbox__date {
    align-self: center;
    opacity: 0.62;
  }

  .den-lightbox__strip-link {
    justify-self: end;
    color: #d8e8ff;
    font-size: 0.78rem;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  @media (min-width: 768px) {
    .den-lightbox {
      --den-panel-size: min(800px, calc(100vw - 256px), calc(100vh - 184px));
      padding: 24px 48px;
    }

    .den-lightbox__dialog {
      grid-template-rows: minmax(48px, auto) var(--den-panel-size) minmax(72px, auto);
    }

    .den-lightbox__stage {
      grid-template-columns: 56px var(--den-panel-size) 56px;
      column-gap: 24px;
    }

    .den-lightbox__previous {
      grid-column: 1;
    }

    .den-lightbox__image-shell {
      grid-column: 2;
    }

    .den-lightbox__next {
      grid-column: 3;
    }

    .den-lightbox__side {
      display: flex;
    }

    .den-lightbox__tap {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .den-lightbox,
    .den-lightbox__image,
    .den-lightbox__strip-change {
      transition: none;
    }
  }
</style>

<div class="den-viewer" id="den-viewer">
<p class="den-hint">Tap or click a panel to open the lightbox; swipe or tap the image edges on phones, use ‹ › or ← → to step, and press × or Escape to close.</p>
{% for strip in site.data.den %}
<figure class="den-strip" data-num="{{ strip.num }}">
<div class="den-frame"><img src="{{ strip.img }}" alt="{{ strip.alt | escape }}" width="1600" height="1600" {% unless forloop.first %}loading="lazy" {% endunless %}decoding="async" /></div>
<figcaption><em>#{{ strip.num }} — {{ strip.title }}</em> · {{ strip.date }}</figcaption>
</figure>
{% endfor %}
</div>

<div class="den-lightbox" id="den-lightbox" role="dialog" aria-modal="true" aria-label="Panel viewer" hidden>
<div class="den-lightbox__dialog">
<div class="den-lightbox__topbar">
<div class="den-lightbox__title" aria-live="polite"></div>
<div class="den-lightbox__strip-change" role="status" aria-live="polite"></div>
<button type="button" class="den-lightbox__close" aria-label="Close panel viewer">×</button>
</div>
<div class="den-lightbox__stage">
<button type="button" class="den-lightbox__side den-lightbox__previous" aria-label="Previous panel">‹</button>
<div class="den-lightbox__image-shell">
<button type="button" class="den-lightbox__tap den-lightbox__tap-previous" tabindex="-1" aria-label="Previous panel"></button>
<button type="button" class="den-lightbox__tap den-lightbox__tap-next" tabindex="-1" aria-label="Next panel"></button>
</div>
<button type="button" class="den-lightbox__side den-lightbox__next" aria-label="Next panel">›</button>
</div>
<div class="den-lightbox__caption">
<div class="den-lightbox__position" role="status" aria-live="polite">
<span class="den-lightbox__counter"></span>
<div class="den-lightbox__dots" role="group" aria-label="Choose a panel"></div>
</div>
<span class="den-lightbox__date"></span>
<a class="den-lightbox__strip-link" href="/the-den">open the strip</a>
</div>
</div>
</div>

<script type="application/json" id="den-manifest">{{ site.data.den | jsonify }}</script>

## Where the panels come from

The viewer used to crop panels out of the composite at runtime, which meant it had to be told where each strip's panels were — and the first four strips were each drawn to slightly different margins, so each carried its own numbers. It doesn't do that any more. Every strip ships its four panels as their own files, cut once and checked in:

```text
images/den/den-00N.webp      the composite, 1600x1600
images/den/den-00N-p1.webp   panel 1, 800x800
   …-p2.webp  …-p3.webp  …-p4.webp
```

Each panel is cut at its own border rect — the 8px frame line is drawn _inside_ that rect, so the crop keeps the frame and never touches the neighbor — then resized to 800x800 at quality 90. That is a real 800px image rather than a quarter of a 1600px square upscaled, which is the whole point on a phone.

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

That is the `GRID` constant at the top of the script, and its only use here is cosmetic: where to put the invisible tap targets. Because nothing is cropped at runtime, a strip that misses the contract by a percent — as most of these do — lands in exactly the right place anyway. The pre-cut file is what the lightbox displays.

<script>
  // Den cartoon viewer — demo. Vanilla, no library, no build step.
  (function () {
    var root = document.getElementById("den-viewer");
    var data = document.getElementById("den-manifest");
    var lightbox = document.getElementById("den-lightbox");
    if (!root || !data || !lightbox) return;

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
    // the tap targets sit. A strip that misses the contract by a percent still
    // shows the right thing, because the lightbox uses its own pre-cut panel
    // file from the manifest. Panel geometry is a build-time problem now.
    // ---------------------------------------------------------------------
    var GRID = { inset: 2.0, gap: 2.0 }; // percent of the canvas
    var SIDE = (100 - 2 * GRID.inset - GRID.gap) / 2; // 47

    var SWIPE = 40; // px of horizontal travel that counts as a swipe
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var panels = []; // flat, DOM order, so stepping runs on into the next strip
    var active = null;
    var opener = null;
    var closeTimer = null;
    var boundaryTimer = null;
    var imageToken = 0;
    var currentLayer = 0;
    var imageLayers = [];

    var dialog = lightbox.querySelector(".den-lightbox__dialog");
    var title = lightbox.querySelector(".den-lightbox__title");
    var stripChange = lightbox.querySelector(".den-lightbox__strip-change");
    var closeButton = lightbox.querySelector(".den-lightbox__close");
    var previousButton = lightbox.querySelector(".den-lightbox__previous");
    var nextButton = lightbox.querySelector(".den-lightbox__next");
    var imageShell = lightbox.querySelector(".den-lightbox__image-shell");
    var tapPrevious = lightbox.querySelector(".den-lightbox__tap-previous");
    var tapNext = lightbox.querySelector(".den-lightbox__tap-next");
    var counter = lightbox.querySelector(".den-lightbox__counter");
    var dots = lightbox.querySelector(".den-lightbox__dots");
    var date = lightbox.querySelector(".den-lightbox__date");
    var stripLink = lightbox.querySelector(".den-lightbox__strip-link");

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
          "Open panel " + (i + 1) + " of strip #" + num,
        );
        frame.appendChild(hit);

        var index = panels.length;
        hit.addEventListener(
          "click",
          (function (n) {
            return function () {
              open(n, this);
            };
          })(index),
        );
        panels.push({
          entry: entry,
          rect: rect,
          n: i + 1,
          num: num,
          hit: hit,
          file: files[i] || null,
        });
      }
    });

    for (var dotIndex = 0; dotIndex < 4; dotIndex++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "den-lightbox__dot";
      dot.setAttribute("aria-label", "Panel " + (dotIndex + 1));
      dot.addEventListener(
        "click",
        (function (n) {
          return function () {
            if (active === null) return;
            var firstInStrip = active - (panels[active].n - 1);
            render(firstInStrip + n, false);
          };
        })(dotIndex),
      );
      dots.appendChild(dot);
    }

    function ensureImageLayers() {
      if (imageLayers.length) return;
      for (var i = 0; i < 2; i++) {
        var image = document.createElement("img");
        image.className = "den-lightbox__image";
        image.width = 800;
        image.height = 800;
        image.decoding = "async";
        imageShell.insertBefore(image, tapPrevious);
        imageLayers.push(image);
      }
    }

    var preloaded = {};
    function preload(index) {
      if (index < 0 || index >= panels.length) return;
      var file = panels[index].file;
      if (!file || preloaded[file]) return;
      preloaded[file] = true;
      new Image().src = file;
    }

    function panelTitle(p) {
      return "#" + p.num + " — " + p.entry.title;
    }

    function stripAnchor(p) {
      return panelTitle(p)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function showBoundary(p) {
      window.clearTimeout(boundaryTimer);
      stripChange.classList.remove("is-visible");
      stripChange.textContent = panelTitle(p);
      window.requestAnimationFrame(function () {
        stripChange.classList.add("is-visible");
      });
      boundaryTimer = window.setTimeout(function () {
        stripChange.classList.remove("is-visible");
      }, 600);
    }

    function showImage(p) {
      ensureImageLayers();
      var current = imageLayers[currentLayer];
      if (
        current.classList.contains("is-current") &&
        current.getAttribute("src") === p.file
      ) {
        current.alt = "The Den #" + p.num + ", panel " + p.n + " of 4";
        return;
      }

      var targetIndex = current.getAttribute("src") ? 1 - currentLayer : currentLayer;
      var target = imageLayers[targetIndex];
      var token = ++imageToken;

      imageLayers.forEach(function (image) {
        image.classList.remove("is-current", "is-outgoing");
        image.alt = "";
      });
      if (current.getAttribute("src")) current.classList.add("is-outgoing");

      target.alt = "The Den #" + p.num + ", panel " + p.n + " of 4";
      target.onload = function () {
        if (token !== imageToken) return;
        target.classList.add("is-current");
        current.classList.remove("is-outgoing");
        currentLayer = targetIndex;
      };
      target.setAttribute("src", p.file);
      if (target.complete && target.naturalWidth) target.onload();
    }

    function render(index, announceBoundary) {
      if (index < 0 || index >= panels.length) return;
      active = index;
      var p = panels[active];
      var label = panelTitle(p);

      title.textContent = label;
      lightbox.setAttribute("aria-label", "Panel viewer: " + label);
      counter.textContent = "panel " + p.n + " of 4";
      date.textContent = p.entry.date;
      stripLink.href = "/the-den#" + stripAnchor(p);
      previousButton.disabled = active === 0;
      nextButton.disabled = active === panels.length - 1;
      tapPrevious.disabled = active === 0;
      tapNext.disabled = active === panels.length - 1;

      dots.querySelectorAll(".den-lightbox__dot").forEach(function (button, i) {
        if (i === p.n - 1) {
          button.setAttribute("aria-current", "true");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      showImage(p);
      preload(active - 1);
      preload(active + 1);
      if (announceBoundary) showBoundary(p);
    }

    function open(index, trigger) {
      window.clearTimeout(closeTimer);
      opener = trigger;
      lightbox.hidden = false;
      document.documentElement.classList.add("den-lightbox-open");
      document.body.classList.add("den-lightbox-open");
      render(index, false);
      window.requestAnimationFrame(function () {
        lightbox.classList.add("is-open");
        closeButton.focus({ preventScroll: true });
      });
    }

    function step(delta) {
      if (active === null) return;
      var next = active + delta;
      if (next < 0 || next >= panels.length) return;
      var changesStrip = panels[next].num !== panels[active].num;
      render(next, changesStrip);
    }

    function close() {
      if (active === null) return;
      active = null;
      imageToken++;
      window.clearTimeout(boundaryTimer);
      stripChange.classList.remove("is-visible");
      lightbox.classList.remove("is-open");
      document.documentElement.classList.remove("den-lightbox-open");
      document.body.classList.remove("den-lightbox-open");
      closeTimer = window.setTimeout(
        function () {
          lightbox.hidden = true;
          if (opener) opener.focus({ preventScroll: true });
        },
        reduce ? 0 : 180,
      );
    }

    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", function () {
      step(-1);
    });
    nextButton.addEventListener("click", function () {
      step(1);
    });

    var suppressTapUntil = 0;
    tapPrevious.addEventListener("click", function () {
      if (Date.now() >= suppressTapUntil) step(-1);
    });
    tapNext.addEventListener("click", function () {
      if (Date.now() >= suppressTapUntil) step(1);
    });

    var startX = 0;
    var startY = 0;
    var tracking = false;
    imageShell.addEventListener("pointerdown", function (e) {
      startX = e.clientX;
      startY = e.clientY;
      tracking = true;
    });
    imageShell.addEventListener("pointercancel", function () {
      tracking = false;
    });
    imageShell.addEventListener("pointerup", function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
        suppressTapUntil = Date.now() + 400;
        step(dx < 0 ? 1 : -1);
      }
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target === dialog || e.target === lightbox.querySelector(".den-lightbox__stage")) {
        close();
      }
    });

    function focusable() {
      return Array.prototype.filter.call(
        lightbox.querySelectorAll(
          'button:not([disabled]):not([tabindex="-1"]), a[href]',
        ),
        function (element) {
          return element.offsetParent !== null;
        },
      );
    }

    document.addEventListener("keydown", function (e) {
      if (active === null) return;
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight") {
        step(1);
      } else if (e.key === "ArrowLeft") {
        step(-1);
      } else if (e.key === "Tab") {
        var controls = focusable();
        if (!controls.length) return;
        var first = controls[0];
        var last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
        return;
      } else {
        return;
      }
      e.preventDefault();
    });
  })();
</script>

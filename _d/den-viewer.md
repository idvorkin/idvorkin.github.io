---
layout: post
title: "The Den — cartoon viewer (demo)"
permalink: /den-viewer
search_exclude: true
tags:
  - ai
---

On a phone each panel of a [Den](/the-den) strip is about 190 pixels wide and the hand-lettering is a smudge. This page is a demo of the fix: tap a panel and the strip zooms so that one panel fills the width. Arrows, swipe, and the keyboard step through every panel of every strip; tap again, hit the X, or press Escape to zoom back out.

Nothing here is final. It is the interaction on its own, so it can be argued with before it goes anywhere near [the real page](/the-den).

<!--
  DEMO ONLY — the viewer lives inline here on purpose.

  FOLLOW-UP: once the interaction is right, fold this into
  _includes/den_strip.html so every strip on /the-den gets it — the per-strip
  overrides (data-inset / data-gap / data-panels) become optional include
  params. This page can then be deleted.

  GEOMETRY: see the GRID constant at the top of the script — it is the
  cartoonist's panel-geometry contract, not an average. Strips drawn to it
  need no attributes at all. All four strips on this page predate it and
  carry their own measured data-inset/data-gap.
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

  /* Only exists for strips that ship per-panel files (data-panels). The panel
     export is cropped at the same rect the transform crops to, so it fills
     the window exactly. */
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

  /* One invisible button per panel, sized to the measured rect. */
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

<!-- Predates the contract: measured 46px margin / 36px gutter / 736px panel. -->
<figure class="den-strip" data-num="4" data-inset="2.875" data-gap="2.25">
<div class="den-frame"><img src="/images/den/den-004.webp" alt="The Den #4: Cause of Gym: Outage — four panels in which Larry the raccoon tallies three ignored gym nudges, GitHub goes down, and Igor finally swings a kettlebell." width="1600" height="1600" decoding="async" /></div>
<figcaption><em>#4 — Cause of Gym: Outage</em> · August 28, 2026</figcaption>
</figure>

<!-- Predates the contract: measured 34px margin / 30px gutter / 751px panel. -->
<figure class="den-strip" data-num="3" data-inset="2.125" data-gap="1.875">
<div class="den-frame"><img src="/images/den/den-003.webp" alt="The Den #3: The Secret Almost Shipped — four panels in which a robot's safety check passes, a raccoon bursts out of the crate it waved through, and the lesson gets written down wrong." width="1600" height="1600" decoding="async" /></div>
<figcaption><em>#3 — The Secret Almost Shipped</em> · August 27, 2026</figcaption>
</figure>

<!-- Predates the contract: measured 15px margin / 14px gutter / 778px panel. -->
<figure class="den-strip" data-num="2" data-inset="0.9375" data-gap="0.875">
<div class="den-frame"><img src="/images/den/den-002.webp" alt="The Den #2: Task Multiplication — four panels in which one typo becomes fifty tasks, all fifty complete, and the typo is still there." width="1600" height="1600" loading="lazy" decoding="async" /></div>
<figcaption><em>#2 — Task Multiplication</em> · August 27, 2026</figcaption>
</figure>

<!-- Predates the contract: measured 51px margin / 24px gutter / 737px panel. -->
<figure class="den-strip" data-num="1" data-inset="3.1875" data-gap="1.5">
<div class="den-frame"><img src="/images/den/den-001.webp" alt="The Den #1: The Restart Dance — four panels in which a raccoon unrolls a grand plan, sleeps through 161 approval prompts, discovers there was a wait command all along, and declines all further help." width="1600" height="1600" loading="lazy" decoding="async" /></div>
<figcaption><em>#1 — The Restart Dance</em> · August 26, 2026</figcaption>
</figure>
</div>

## The grid a strip has to be drawn to

The viewer crops panels out of the composite, so it needs to know where they are. That's a contract, and it belongs to the drawing, not to the viewer. One set of numbers, at 1600x1600:

**32px margin · 752px panel · 32px gutter · 752px panel · 32px margin**, the same both ways — four square panels, read left to right, top to bottom. It closes exactly, and every value is a multiple of 8, so the 800px panel export and any 2x display land on whole pixels. As fractions of the canvas: a 2% margin, a 2% gutter, and a 47% panel — so zooming one panel to fill the window is a scale of 1/0.47, or 2.1277x. That's the `GRID` constant at the top of the script, and the only place the geometry is written down.

There's no bleed around the crop, and there doesn't need to be: the 8px black border is drawn _inside_ the panel rect, so cropping at the rect keeps the frame line. Cropping at exactly the rect is also what lets the per-panel export below drop in without a jump.

All four strips here predate the contract, so each carries its own measured `data-inset` / `data-gap` — #1 is 51/24/737 as margin/gutter/panel, #2 is 15/14/778, #3 is 34/30/751, #4 is 46/36/736. A strip drawn to the contract carries nothing.

The contract also has every strip ship its panels as separate files, `den-00N-p1.webp` through `-p4.webp` at 800x800, cropped at the panel rect — better than upscaling a quarter of a 1600px square. The viewer prefers them when they exist: list them on the figure in reading order as `data-panels="…-p1.webp,…-p2.webp,…-p3.webp,…-p4.webp"` and the zoomed view lays the crisp panel over the scaled composite. None of the strips here ship them yet, and a strip without the attribute is unaffected.

<script>
  // Den cartoon viewer — demo. Vanilla, no library, no build step.
  //
  // The whole trick: the frame is a square window with overflow:hidden and the
  // strip image is transformed inside it. `scale(S) translate(-x%, -y%)` with
  // transform-origin at 0 0 puts the panel's top-left corner at the window's
  // top-left and blows it up until the panel's width equals the window's, so a
  // panel that was 190px on a phone becomes the full column width. Zooming out
  // is just clearing the transform, which is why the animation is free.
  (function () {
    var root = document.getElementById("den-viewer");
    if (!root) return;

    // ---------------------------------------------------------------------
    // THE GRID CONTRACT — the one place panel geometry is written down.
    //
    // Every Den strip is a 2x2 grid of four square panels on a cream page,
    // drawn at 1600x1600. In pixels the contract is:
    //
    //     32px margin | 752px panel | 32px gutter | 752px panel | 32px margin
    //
    // which closes exactly (32+752+32+752+32 = 1600) and is a multiple of 8
    // throughout, so an 800px panel export and any 2x display land on whole
    // pixels. As fractions of the canvas that is inset 2%, gutter 2%, and a
    // panel side of (100 - 2*inset - gap) / 2 = 47% — so a panel filling a
    // square window is scaled by 1/0.47 = 2.1277x. Draw to this and the
    // viewer needs no per-strip numbers.
    //
    // There is no bleed. The 8px black border is drawn INSIDE the panel rect,
    // so cropping at the rect already keeps the frame line, and cropping at
    // exactly the rect is what makes the transform identical to the per-panel
    // export below — swapping between them shows no jump.
    //
    // Strips #1-#4 all predate the contract and each carry their own measured
    // data-inset / data-gap; the numbers come from the spec's rect table
    // (den-001 51/24/737, den-002 15/14/778, den-003 34/30/751, den-004
    // 46/36/736 as margin/gutter/panel). New strips should carry nothing.
    //
    // PER-PANEL FILES: the contract also has every strip ship its panels as
    // den-00N-p1.webp .. -p4.webp, 800x800, cropped at the panel rect. The
    // viewer prefers them when they exist — list them on the figure in reading
    // order as data-panels="…-p1.webp,…-p2.webp,…-p3.webp,…-p4.webp" and the
    // zoomed view lays the crisp panel over the scaled composite. A strip
    // without the attribute behaves exactly as before.
    // ---------------------------------------------------------------------
    var GRID = { inset: 2.0, gap: 2.0 }; // percent of the canvas

    var SWIPE = 40; // px of horizontal travel that counts as a swipe
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var panels = []; // flat, DOM order, so stepping runs on into the next strip
    var active = null; // index into panels, or null when nothing is zoomed

    root.querySelectorAll(".den-strip").forEach(function (strip) {
      // The contract, unless this strip predates it and says otherwise.
      var inset = parseFloat(strip.dataset.inset || GRID.inset);
      var gap = parseFloat(strip.dataset.gap || GRID.gap);
      var side = (100 - 2 * inset - gap) / 2;
      var frame = strip.querySelector(".den-frame");
      var num = strip.dataset.num;
      var files = (strip.dataset.panels || "")
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);

      for (var i = 0; i < 4; i++) {
        var rect = {
          x: inset + (i % 2) * (side + gap),
          y: inset + ((i / 2) | 0) * (side + gap),
          side: side,
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
          frame: frame,
          rect: rect,
          n: i + 1,
          num: num,
          hit: hit,
          file: files.length === 4 ? files[i] : null,
        });
      }

      // Crisp overlay for strips that ship per-panel files. Inert otherwise.
      if (files.length === 4) {
        var sharp = document.createElement("img");
        sharp.className = "den-sharp";
        sharp.alt = "";
        sharp.setAttribute("aria-hidden", "true");
        frame.appendChild(sharp);
      }

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
      var sharp = frame.querySelector(".den-sharp");
      if (sharp) sharp.style.opacity = "0";
    }

    function zoomTo(index, scroll) {
      if (index < 0) index = panels.length - 1;
      if (index >= panels.length) index = 0;
      var p = panels[index];
      if (active !== null && panels[active].frame !== p.frame) {
        clear(panels[active].frame);
      }
      active = index;

      // Crop at exactly the panel rect: scale until the panel's width is the
      // window's, then slide its top-left corner to the window's.
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

      // If this strip shipped per-panel files, lay the crisp one over the
      // scaled composite. The crop is the same rect, so it fills the window
      // and there is no jump between the two.
      var sharp = p.frame.querySelector(".den-sharp");
      if (sharp) {
        if (sharp.getAttribute("src") !== p.file) sharp.src = p.file;
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

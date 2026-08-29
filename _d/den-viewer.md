---
layout: post
title: "The Den — cartoon viewer (demo)"
permalink: /den-viewer
search_exclude: true
tags:
  - ai
---

On a phone each panel of a [Den](/the-den) strip is about 190 pixels wide and the hand-lettering is a smudge. This page is a demo of the fix: tap a panel and the strip zooms so that one panel fills the width. Arrows, swipe, and the keyboard step through every panel of every strip; tap again, hit the X, or press Escape to zoom back out.

Nothing here is final. It is the interaction on its own, so it can be argued with before it goes anywhere near the real page.

<!--
  DEMO ONLY — the viewer lives inline here on purpose.

  FOLLOW-UP: once the interaction is right, fold this into
  _includes/den_strip.html so every strip on /the-den gets it, and the strip
  geometry (data-inset / data-gap below) becomes include params. This page can
  then be deleted.

  GEOMETRY: every strip is a 2x2 grid of square panels on a plain margin, so
  each one is described by two numbers, both as a percent of the 1600x1600
  image: `inset` (margin from the image edge to the artwork) and `gap` (the
  gutter between panels). Panel side = (100 - 2*inset - gap) / 2. The values
  below were measured off the actual webp files by finding the first and last
  non-background row and column of each panel — they are NOT identical from
  strip to strip, so one hard-coded rect for all of them would misframe most
  of them.

  Strip #4 is deliberately absent: den-004.webp is still on its own branch and
  is not on main yet. It picks itself up as soon as it lands, since the
  follow-up is to make this an include.
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
    .den-ui {
      transition: none;
    }
  }
</style>

<div class="den-viewer" id="den-viewer">
<p class="den-hint">Tap or click a panel to zoom. Then: <b>‹ ›</b> or swipe or ← → to step (it runs on into the next strip), <b>×</b> or tap again or Escape to come back out.</p>

<figure class="den-strip" data-num="3" data-inset="2.11" data-gap="1.875">
<div class="den-frame"><img src="/images/den/den-003.webp" alt="The Den #3: The Secret Almost Shipped — four panels in which a robot's safety check passes, a raccoon bursts out of the crate it waved through, and the lesson gets written down wrong." width="1600" height="1600" decoding="async" /></div>
<figcaption><em>#3 — The Secret Almost Shipped</em> · August 27, 2026</figcaption>
</figure>

<figure class="den-strip" data-num="2" data-inset="0.92" data-gap="0.78">
<div class="den-frame"><img src="/images/den/den-002.webp" alt="The Den #2: Task Multiplication — four panels in which one typo becomes fifty tasks, all fifty complete, and the typo is still there." width="1600" height="1600" loading="lazy" decoding="async" /></div>
<figcaption><em>#2 — Task Multiplication</em> · August 27, 2026</figcaption>
</figure>

<figure class="den-strip" data-num="1" data-inset="3.19" data-gap="1.41">
<div class="den-frame"><img src="/images/den/den-001.webp" alt="The Den #1: The Restart Dance — four panels in which a raccoon unrolls a grand plan, sleeps through 161 approval prompts, discovers there was a wait command all along, and declines all further help." width="1600" height="1600" loading="lazy" decoding="async" /></div>
<figcaption><em>#1 — The Restart Dance</em> · August 26, 2026</figcaption>
</figure>
</div>

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

    var BLEED = 0.6; // % of the strip shown around a panel, so its border reads
    var SWIPE = 40; // px of horizontal travel that counts as a swipe
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var panels = []; // flat, DOM order, so stepping runs on into the next strip
    var active = null; // index into panels, or null when nothing is zoomed

    root.querySelectorAll(".den-strip").forEach(function (strip) {
      var inset = parseFloat(strip.dataset.inset);
      var gap = parseFloat(strip.dataset.gap);
      var side = (100 - 2 * inset - gap) / 2;
      var frame = strip.querySelector(".den-frame");
      var num = strip.dataset.num;

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
        panels.push({ frame: frame, rect: rect, n: i + 1, num: num, hit: hit });
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

    function clear(frame) {
      frame.classList.remove("is-zoomed");
      frame.querySelector("img").style.transform = "";
    }

    function zoomTo(index, scroll) {
      if (index < 0) index = panels.length - 1;
      if (index >= panels.length) index = 0;
      var p = panels[index];
      if (active !== null && panels[active].frame !== p.frame) {
        clear(panels[active].frame);
      }
      active = index;

      var side = p.rect.side + 2 * BLEED;
      var scale = 100 / side;
      p.frame.querySelector("img").style.transform =
        "scale(" +
        scale.toFixed(4) +
        ") translate(" +
        (BLEED - p.rect.x).toFixed(3) +
        "%," +
        (BLEED - p.rect.y).toFixed(3) +
        "%)";
      p.frame.classList.add("is-zoomed");
      p.frame.querySelector(".den-badge").textContent =
        "#" + p.num + " · panel " + p.n + " of 4";

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

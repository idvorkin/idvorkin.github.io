---
layout: post
title: "Staying Afloat"
permalink: /staying-afloat
imagefeature: https://idvork.in/images/raccoon-staying-afloat.jpg
tags:
  - emotional-health
  - psychology
redirect_from:
  - /floating-zooming/
  - /floating
  - /zooming
  - /afloat
---

I picture stress as water, with me floating above it. Balloons lift me: sleep, friends, family, moving. Weights pull me down: pain, a deadline, anger, debt. How high the water sits depends on my stress tolerance. When the weights win, I go under.

{% include ai-slop.html percent="80" %}

## Floating

<iframe class="afloat-embed" src="/floating-zooming/app.html?embed=float" title="Interactive: balloons lift the raccoon, weights sink him" style="display: block; width: 100%; height: min(96svh, 125vw + 13rem); border: 0; border-radius: 0.75rem;"></iframe>

<script>
  // The embed reports its content height and gets the iframe sized to fit, so it never scrolls by itself
  // (a nested scroller traps a finger's swipe). In return it's told where the page viewport is, so the scene
  // fits one screen and stays on screen while you scroll its open controls. That's a direct call from the
  // scroll handler, not a message: a message lands a frame late and the scene shudders as the page scrolls.
  // The inline height above is a guess at the fitted height, so the text below barely moves when it lands.
  (function () {
    var f = document.querySelector("iframe.afloat-embed");
    if (!f) return;
    function tell() {
      var w = f.contentWindow;
      // clientHeight, not innerHeight: it doesn't jump as iOS Safari's toolbar shows and hides
      if (w && w.afloatView) w.afloatView(f.getBoundingClientRect().top, document.documentElement.clientHeight);
    }
    window.addEventListener("message", function (e) {
      if (e.source !== f.contentWindow || !e.data || e.data.afloat !== "height") return;
      f.style.height = e.data.h + "px";
      tell();
    });
    window.addEventListener("scroll", tell, { passive: true });
    window.addEventListener("resize", tell);
    f.addEventListener("load", tell);
  })();
</script>

## How to play

- Tap a tag in the top strip to add a balloon. Tap one in the bottom strip to add a weight.
- Sleep, friends, family and moving go both ways. Bad sleep is a weight.
- Tap the pump, then a balloon, to make it bigger.
- Drag the scissors across a string or chain to cut it loose.
- More controls has the stress tolerance slider. It moves the water.

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

I picture my calm as floating above water. Balloons in one hand pull me up: sleep, friends, time with my family, moving. Weights in the other hand pull me down: pain, a deadline, anger, debt. How high I float is how much I can cope with right now. Near the water I'm barely coping, and under it I'm overwhelmed. So I built the felt raccoon below. Pump up a balloon, cut a weight loose, and watch him rise or sink.

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

Tap a tag in the top strip to add a balloon, or one in the bottom strip to add a weight. Hold a balloon or weight to pump it up. Drag a dial across his paw to flip it from weight to balloon. Drag the scissors across a string or chain to cut it loose. The rest is under More controls. The stress tolerance slider there is the only thing that moves the water: same balloons, same weights, but with lower tolerance he goes under sooner.

Three things I keep relearning from it:

- **Sleep matters most.** Its balloon is the biggest, and bad sleep is the heaviest weight. Poor sleep is also the first thing on my list for [detecting anxiety](/anxiety#detection).
- **Balloons and weights are separate.** Cutting a weight doesn't add a balloon. "Lots of both" and "Neither" (under More controls) land at about the same height with a very different day. Same idea as [satisfaction is not the lack of dissatisfaction](/work-satisfaction), and the energy inflows on my [life income statement](/life-as-business).
- **This too shall pass.** It's on his shirt, and it's my mantra for smoothing out the highs and the lows. Being low in the water is a state, not a verdict.

This is a metaphor, not a research model. The closest research idea is Lazarus and Folkman's: stress is what you feel when demands seem to exceed the resources you have to meet them (_Stress, Appraisal, and Coping_, 1984).

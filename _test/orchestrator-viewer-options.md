---
layout: post
title: Test - Orchestrator viewer options
permalink: /test/orchestrator-viewer-options
search_exclude: true
---

# Test page: three ways to walk the orchestrator story

A pick sheet, not a post. Same story data, same drawing, three ways to move
through it. The title block and the sub line are gone from all three, so the
drawing is the first thing you see. Variant A puts the story above the drawing
so you can judge that question by looking at it.

## A. Play and scrub, story on top

One play button and a scrubber with a tick per block. The story sits above the
drawing, and the drawing does not move while the copy changes.

{% include orchestrator-viewer.html variant="a" id="orc-a" %}

## B. The drawing is the nav, story below

No numbers anywhere. Click any block to read why it is there, or press play and
it walks itself. Any click pauses it.

{% include orchestrator-viewer.html variant="b" id="orc-b" %}

## C. Scroll-driven, story beside the drawing

The drawing sticks to the top and the story scrolls past it. Whichever card is
in the middle of the screen owns the drawing.

{% include orchestrator-viewer.html variant="c" id="orc-c" %}

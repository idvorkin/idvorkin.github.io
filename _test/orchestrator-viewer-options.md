---
layout: post
title: Test - Orchestrator viewer options
permalink: /test/orchestrator-viewer-options
search_exclude: true
---

# Test page: where the controls go

Same viewer twice. Back, Next, Play and the scrubber in one row, and the only
difference is whether that row sits at the very top of the figure or between
the story and the drawing. Nothing else changes, so the placement is the only
thing to judge. The live version in context is at
[/ai-orchestrator](/ai-orchestrator).

The story block has a fixed floor under it in both, so the controls and the
drawing hold still as you walk the steps.

## Controls on top

Controls, then the story, then the drawing. The controls are the first thing
you see and they never move.

{% include orchestrator-viewer.html controls="top" id="orc-top" %}

## Controls between the story and the drawing

The story reads first, then the controls, then the drawing. The controls sit
right above the thing they change.

{% include orchestrator-viewer.html controls="between" id="orc-between" %}

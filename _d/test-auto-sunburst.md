---
layout: post
title: Test Auto-Generated Sunburst
permalink: /test-auto-sunburst
---

This page demonstrates the auto-generated sunburst functionality that extracts the tree structure from H2 and H3 elements.

<script src="https://cdn.plot.ly/plotly-3.0.1.min.js"></script>
<div class="alert alert-primary" id="sunburst_text">
    Click in any box or circle
</div>

<div id="sunburst">
</div>

<script type=module>
    import { defer, load_auto_sunburst } from '/assets/js/index.js'
    defer(() => load_auto_sunburst("Test Topics"))
</script>

## Category A

### Subcategory A1

- Item 1
- Item 2
- Item 3

### Subcategory A2

- Item 4
- Item 5

## Category B

### Subcategory B1

- Item 6
- Item 7

### Subcategory B2

- Item 8
- Item 9
- Item 10

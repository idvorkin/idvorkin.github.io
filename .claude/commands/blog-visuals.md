---
description: "Add visual components to blog posts: charts, summary cards, matrices, voice widgets"
allowed-tools: ["Bash", "Read", "Edit", "Write"]
---

# Blog Visual Components

## Charts (Chart.js)

For patterns, see `_d/regrets.md` and `_d/activation.md`. Key principles:

- Store data in readable table format at top of script
- Read labels dynamically from data using `Object.keys().map()`
- Wrap in `defer()` to ensure DOM is ready

## Summarize Page (Cross-linking)

Use `{% include summarize-page.html src="/permalink" %}` to embed an auto-generated summary card linking to another post. Igor calls this "esummarize".

## Quadrant Matrix (2x2 Grid)

Use `{% include quadrant-matrix.html %}` — see existing uses for parameter reference.

## Vapi.ai Voice Widget

See `_d/tesla.md` for implementation. Backend: [github.com/idvorkin/tony_tesla](https://github.com/idvorkin/tony_tesla)

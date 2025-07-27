---
layout: post
permalink: /recent
title: "Recently Modified Content"
tags:
  - meta
  - navigation
---

This page shows the most recently modified content across the site, helping you discover what's been updated lately.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Recently Modified Posts](#recently-modified-posts)
- [Why Track Recent Changes?](#why-track-recent-changes)
- [How This Works](#how-this-works)
  <!-- vim-markdown-toc-end -->
  <!-- prettier-ignore-end -->

## Recently Modified Posts

<div id="last-modified-posts">
  <p>Loading recently modified posts...</p>
</div>

{% include alert.html content="This list is generated dynamically based on the last modification dates in the site's metadata." style="info" %}

## Why Track Recent Changes?

Keeping track of recently modified content helps with several aspects of knowledge management:

1. **Discover updates** to content you may have read before
2. **Find active areas** of the site that are being actively developed
3. **Track the evolution** of ideas and concepts over time
4. **See what's new** without having to browse through everything

Want to explore randomly instead? <a href="/random">Try a random page</a>!

For more on how I approach knowledge management:

{% include summarize-page.html src="/new-skills" %}

## How This Works

This page uses JavaScript to fetch the site's metadata from `back-links.json` and sorts content by the `last_modified` timestamp. The data is processed client-side, meaning you always see the most up-to-date information when you load the page.

The code examines each entry in the site's content database, filters out entries without proper metadata, and presents them in reverse chronological order (newest first).

If you're interested in the technical implementation, check out the [site's GitHub repository](https://github.com/idvorkin/idvorkin.github.io).

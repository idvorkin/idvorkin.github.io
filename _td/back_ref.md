---
layout: post
no-render-title: true
title: Adding back references to my blog
---

This blog is my collection of [evergreen notes](https://notes.andymatuschak.org/Evergreen_notes), a place to have my thinking accrue. The blog is densely linked, in the forward direction, but jekyll does not create back links. I think back links would be great. Here's my strategy to create them.

### When to compute back links v0

Run a one-off script, similar to how I build search indexes.

### Back link computation methodology

Standard how to build a search engine question. Plan: Go through allow list of back link pages (enumerate collections, remove indexes) For each page, build a list of referenced pages, and add them to a map of page to reference. Go through the map, and apply them (title, list of references) to pages.

### How to Inject back links into the output content

Inject into source or output Need to inject into source as output is regenerated. It's a pain as it's a source edit and that dirties history, but can probably come up with a way to keep that clean - in some kind of auto-generated guards, and make an atomic check-in.

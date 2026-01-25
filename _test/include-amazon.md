---
layout: post
title: Test - Amazon Include
permalink: /test/include-amazon
---

# Test Page: Amazon Include

This page tests the amazon.html include component with various ASIN configurations.

## Single ASIN

Testing a single product display:

{% include amazon.html asin="B07ZWK2TQT" %}

## Multiple ASINs (Keyboards)

Testing multiple products in one include (the three keyboards from /irl):

{% include amazon.html asin="B07ZWK2TQT;B01JA6HG88;B0FGN9GC2G" %}

## Mixed Products

Testing ASINs from different categories:

{% include amazon.html asin="B0D54JZTHY;B09ZVPWKK3" %}

---

**Purpose**: This test page allows visual verification and automated testing of the Amazon affiliate include component. All products should show:
- Product images (from ASIN database or fallback URL)
- Product titles (truncated to 50 chars)
- Affiliate links with `tag=ighe-20`
- Links open in new tab with `rel="noopener"`

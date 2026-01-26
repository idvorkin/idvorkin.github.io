---
layout: post
title: "AI Business Models"
permalink: /ai-bm
redirect_from:
tags:
  - ai
---

Business Models drive the world, and they'll drive the world of AI too.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [AI as a business model stress test](#ai-as-a-business-model-stress-test)
  - [The Tailwind Labs story](#the-tailwind-labs-story)
  - [What AI commoditizes](#what-ai-commoditizes)
  - [What remains valuable](#what-remains-valuable)
- [Gen AI in the enterprise](#gen-ai-in-the-enterprise)
  - [Frontier Model Companies make poor business models](#frontier-model-companies-make-poor-business-models)
  - [Economics of renting GPUs](#economics-of-renting-gpus)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## AI as a business model stress test

_Source: [Dries Buytaert - AI is a business model stress test](https://dri.es/ai-is-a-business-model-stress-test) (January 2026)_

AI doesn't destroy viable businesses. It reveals structural vulnerabilities in models built on commodifiable specifications.

### The Tailwind Labs story

Tailwind CSS got more popular. Their business collapsed anyway.

In early 2025, Tailwind Labs laid off 75% of their engineering team. Traffic to their documentation dropped 40% since early 2023, even as Tailwind CSS usage grew. CEO Adam Wathan explained: "75% of the people on our engineering team lost their jobs...because of the brutal impact AI has had on our business."

The problem: developers now ask AI for Tailwind code instead of visiting docs. That broke the discovery funnel that sold Tailwind Plus ($299 for pre-built component collections).

### What AI commoditizes

Dries Buytaert's insight: **AI commoditizes anything you can fully specify.**

That includes:
- Documentation
- Component libraries
- Code snippets
- CSS frameworks
- Pre-built templates

If you can describe it precisely enough for AI to generate it, you can't charge for it.

### What remains valuable

AI can't replace operations:
- Deployment infrastructure
- Testing and CI/CD pipelines
- Security maintenance
- Reliability guarantees
- Performance optimization
- Rollback capabilities

This is why sustainable Open Source business models are migrating to operational services:

- **Vercel/Next.js**: Framework is free, hosting is the product
- **Acquia/Drupal**: Sells hosting and operational infrastructure, not the CMS itself

The pattern: give away the specifications, charge for keeping it running.

## Gen AI in the enterprise

https://menlovc.com/2024-the-state-of-generative-ai-in-the-enterprise/

### Frontier Model Companies make poor business models

https://gist.github.com/idvorkin/f927fe11d15eccc10cbc268ded8c48e4

### Economics of renting GPUs

https://gist.github.com/idvorkin/de947e6a88161af8a4ad977d2bc2a0fb

GPU Cloud Economics

- CoreWeave and Lambda are emerging as specialized GPU cloud providers competing with hyperscalers
- $1B initial investment can buy ~16,000 H100 GPUs and related infrastructure
- Rental revenue potential of $5.27B over 4 years based on blended pricing models
- Operating margins of 65-70% possible for GPU cloud providers

Market Players and Investment

- Major allocations to hyperscalers: Microsoft/Meta (150K GPUs each), AWS/Google/Oracle (50K each)
- CoreWeave raised $4.46B total funding, valued at $19B
- Lambda raised $932.2M total funding

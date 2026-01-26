---
layout: post
title: "AI Business Models"
permalink: /ai-bm
redirect_from:
tags:
  - ai
---

Business Models drive the world, and they'll drive the world of AI too.

{% include ai-slop.html percent="75" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Business models AI kills](#business-models-ai-kills)
  - [How Tailwind Labs died (both patterns at once)](#how-tailwind-labs-died-both-patterns-at-once)
  - [The specification test](#the-specification-test)
  - [Discovery funnels at risk](#discovery-funnels-at-risk)
  - [What survives: operations](#what-survives-operations)
  - [What becomes more valuable: human-optimized content](#what-becomes-more-valuable-human-optimized-content)
  - [Questions this raises for me](#questions-this-raises-for-me)
- [Gen AI in the enterprise](#gen-ai-in-the-enterprise)
  - [Frontier Model Companies make poor business models](#frontier-model-companies-make-poor-business-models)
  - [Economics of renting GPUs](#economics-of-renting-gpus)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Business models AI kills

_Source: [Dries Buytaert - AI is a business model stress test](https://dri.es/ai-is-a-business-model-stress-test) (January 2026)_

I've been watching AI destroy certain business models while leaving others untouched. This Dries Buytaert article crystallized the pattern for me.

**Two types of businesses die:**

1. **Anything you can fully specify** - documentation, component libraries, templates, code snippets
2. **Discovery-based funnels** - free content that drives traffic to paid products

The Tailwind story shows both dying at once.

### How Tailwind Labs died (both patterns at once)

**The old model:**

Tailwind CSS was free. The business model was a discovery funnel:
1. Developers visit docs to learn Tailwind
2. Browse docs for examples and patterns
3. Discover Tailwind Plus ($299 component collections)
4. Buy components to save time

Free docs → Traffic → Discovery → $299 sale

**What AI killed:**

In early 2025, Tailwind Labs laid off 75% of their engineering team. Documentation traffic dropped 40%. But Tailwind CSS usage kept growing.

CEO Adam Wathan: "75% of the people on our engineering team lost their jobs...because of the brutal impact AI has had on our business."

**Death pattern #1 - Specifications commodified:**

Developers stopped buying component libraries. Why pay $299 when I can ask: "Claude, give me a Tailwind hero section with a gradient background"? AI generates it instantly.

**Death pattern #2 - Discovery funnel broken:**

Developers stopped visiting docs. No traffic. No discovery moment. No premium product sale.

Both the product (specifiable components) and the funnel (docs-driven discovery) died simultaneously. Usage up, business collapsed.

### The specification test

Can you write down exactly what something should do? Then AI commoditizes it.

- **Documentation**: "Claude, explain how React hooks work"
- **Component libraries**: "Claude, give me a pricing table component"
- **Code snippets**: "Claude, write a function to validate emails"
- **Templates**: "Claude, create a landing page layout"

If you can specify it precisely enough for me to ask AI, I won't pay you for it.

This kills businesses built on selling specifications: template marketplaces, component libraries, documentation-as-a-product, tutorial content.

### Discovery funnels at risk

Even if your paid product isn't specifiable, AI threatens traffic-based discovery models.

The old funnel:
1. Search Google for a problem
2. Land on free content (docs, blog, tutorial)
3. Browse around
4. Discover paid product
5. Buy

AI breaks step 1. I don't search anymore. I ask Claude. No Google search. No landing on your site. No browsing. No discovery moment.

This puts at risk:
- **Freemium models** that depend on free users discovering premium features
- **Content marketing** that drives awareness through SEO
- **Documentation sites** that upsell to paid tiers
- **Tutorial platforms** that convert free learners to paid courses

Your paid product might be un-specifiable. But if nobody visits your site, they never find out it exists.

### What survives: operations

Operations. The messy reality of keeping things running in production.

AI can't deploy your code. Can't monitor it. Can't roll it back when it breaks at 2am. Can't patch security vulnerabilities under real load. Can't guarantee 99.9% uptime. Can't optimize performance for your specific traffic patterns.

You can specify "deploy my app" but you can't specify all the edge cases, monitoring, incident response, and ongoing maintenance.

This explains why successful Open Source companies are migrating here:

- **Vercel/Next.js**: Framework is free (specifiable), hosting is paid (operations)
- **Acquia/Drupal**: CMS is free (specifiable), infrastructure is paid (operations)

The new model: give away specifications, charge for keeping it running.

### What becomes more valuable: human-optimized content

Here's what I'm seeing: documentation was never optimized for humans anyway. Docs are reference material - dry, complete, searchable. Perfect for AI to ingest and regurgitate.

But content optimized for human consumption works differently:

- **TikToks** - personality, entertainment, connection, parasocial relationships
- **Blogs with voice** - personal stories, vulnerabilities, "here's how I think about this"
- **Podcasts** - long-form conversation, thinking out loud
- **Video tutorials** - watching someone work through problems in real-time

These aren't trying to be comprehensive references. They're trying to be engaging, memorable, human. They create connection and trust, not just information transfer.

AI can summarize my blog. But can it replace the experience of reading how I personally work through a problem? Can it recreate the connection you feel when I admit uncertainty or share a failure?

I don't sell these things now. But this points to a different discovery mechanism:

**Old model:** Need info → Google → Find docs → Get answer → Discover product
**AI kills:** Need info → Ask AI → Get answer → No discovery

**Possible new model:** Bored/curious → TikTok/YouTube → Connect with creator → Trust/follow → Buy what they offer

The discovery happens through human connection, not information seeking. You're not there because you need to know something. You're there because you like the person, the voice, the way they think.

Docs were always terrible at this. Now AI makes them obsolete. Human-optimized content might be the only discovery mechanism left.

### Questions this raises for me

What am I selling that's specifiable? My blog content could be summarized by AI. My frameworks could be explained by AI. My advice could be generated by AI.

What am I selling that's operational? My actual coaching time. Real-time processing with clients. The messy work of helping someone through a specific situation that can't be fully specified in advance.

And my discovery funnel? You're reading this because... you searched for something? Someone linked to it? Or did Claude send you here? I honestly don't know anymore.

Should I be creating more human-optimized content? TikToks about being a dad? YouTube videos of me working through problems? Not because they're comprehensive, but because they create connection?

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

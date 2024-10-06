---
layout: post
title: "Donating to charity"
tags:
  - career
permalink: /toysfortots
redirect_from:
  - /alexa-charity
  - /tft
---

One of the most satisfying (and fun) projects I worked on in my career was giving Alexa customers the ability to donate to charity and then have Amazon match their donations. What is most amazing about this project is we were able to go from zero to announcing our MVP live on Good Morning America in under 4 months which included all sorts of complexities, negotiations, and good luck.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Marketing and PR the big guns.](#marketing-and-pr-the-big-guns)
- [Customer Impact](#customer-impact)
- [The genesis](#the-genesis)
- [Cool stories - First Launch](#cool-stories---first-launch)
- [Cool stories - Launch Day](#cool-stories---launch-day)
- [The team that made it happen](#the-team-that-made-it-happen)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Marketing and PR the big guns.

This was a marquee feature for Amazon and they put a lot of muscle behind it. Here were some of the ads:

{% include youtube.html src="fe3OYc_2H64" %}
{% include youtube.html src="inD9qdw0KGk?start=11" %}

![](https://github.com/idvorkin/blob/raw/master/tft/shaq.gif)

## Customer Impact

The details are Amazon-specific, but a few things I can mention:

- So many toys needed to rotate Toys For Tots Shipping locations
- Called out in the SVP mail to all of Amazon on impactful things we did.
- Lots of toys for Toys for Tots
- So successful, rinse repeat.

## The genesis

- While considering the job, being pitched "wouldn't this be a cool idea"
- Get team to agree it was all or nothing to launch
- Non-stop problems

## Cool stories - First Launch

- Begging team in Spain for help
- Credit card validation
- Pre-Launch issues (broken, broken)
- How we dreaded it would never happen
- PM quit pre-launch
- Lots of other projects thrown at team while it was happening.
- VP Looking for last-minute scope creep

## Cool stories - Launch Day

- Week before - Thanksgiving, which at Amazon is non-stop, and all hands on deck.
- Day before - several issues coming up on the dashboard, fixed at 11pm
- Day of 9am EST live TV (6am in PST) on Good Morning America. We literally have someone in the green room
- War room 4am PST. Intermittent failures
  - Intermittent failures the worst, hard to repro.
  - Purchase getting random fails - Start Paging in folks, 3 managers up, get someone.
    - Some Purchases are failing.
    - Why? Price changes between "confirmation" and "purchase", call fails
    - Why Fail? Complex, rare scenario
    - Why Happening? System Optimization, if item stock is dropping, price floats around to ensure not overselling.
    - Why wouldn't running out of stock be an issue normally?
      - We already fail over to the next item when stock drops below a threshold
    - How to resolve?
      - Force ourselves to high stock item.
      - Page in team that owns inventory control pricing, and disable for our products

## The team that made it happen

- Ian McAllister
- Ramya Menon
- Geoffrey Chen
- Aaron Hart
- Sean Xu
- Haohan Tang
- Ivan Okhin
- Matt Hall
- TBD everyone who worked on it.

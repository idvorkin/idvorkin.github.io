---
layout: post
title: "AI Orchestrators: what, why, and how we got here"
permalink: /ai-orchestrator
ai_default_image: true
tags:
  - ai
  - tools
  - how
redirect_from:
  - /orchestrator
alias:
  - /orchestrator
---

An orchestrator is everything around the agent. The agent writes the code. The orchestrator decides which agent gets a job, gives it somewhere to work, keeps the record of that job outside the session, watches it, checks what comes back before it lands, and gives me one place to look at all of it. I did not design mine. It arrived one brick at a time, and every brick is a thing that broke.

{% include ai-slop.html percent="70" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Why I hand-roll mine](#why-i-hand-roll-mine)
- [Claude will probably absorb most of this](#claude-will-probably-absorb-most-of-this)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include orchestrator-stack.html %}

## Why I hand-roll mine

I run two. [Larry](/larry) gets his own orchestrator, the Mine column above. [Gas City](/gas-city) is the orchestrator when I want one off the shelf.

1. **It is hyper-tuned to me.** My nudges, my repos, my review habits, my phone.
2. **I learn how it works.** Building a brick is how I find out what it is for. That is also what lets me judge someone else's version.
3. **I mix and match best in breed.** Every brick can come from a different third party and I take whichever one is best. That matters more the less I can afford [all the expensive tokens I want](/token-management).

The downside is real. When a distribution ships something new I am behind, sometimes by months. I have decided that is fine, because every brick here is small and cheap to throw away.

## Claude will probably absorb most of this

Every brick is a gap in the product, and products close gaps. Worktree isolation was my own brick for a while and then it turned up as a flag. I would guess the ledger, the dispatcher and the supervisor follow in some form, though I have no idea on what timeline.

When that happens I delete my version and use theirs. That is the whole reason to keep each brick cheap.

---
layout: post
title: "AI Orchestrators"
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

An orchestrator is the stuff around a coding agent. The agent writes the code. The orchestrator picks which agent gets a job, gives it somewhere to work, keeps a record of the job outside the session, watches it, checks the result before it lands, and gives me one place to see it all. I didn't design mine. I added it one block at a time, each block after something broke.

{% include ai-slop.html percent="70" %}

{% include orchestrator-stack.html %}

## Why I hand-roll mine

I run two. [Larry](/larry) runs on the one I built, the "Mine" column in the table above. When I want one off the shelf, I use [Gas City](/gas-city).

1. It fits me: my nudges, my repos, my review habits, my phone.
2. Building a block is how I learn what it's for, and that's how I can judge someone else's version.
3. Each block can come from a different vendor, and I pick whichever is best. That matters more when I can't afford [all the expensive tokens I want](/token-management).

The cost: when a distribution ships something new, I'm behind, sometimes by months. I'm fine with that, because each block is small and cheap to throw away.

## Claude will probably absorb most of this

Each block covers something Claude doesn't do yet, and Claude keeps catching up. Worktree isolation was my own block for a while; now it's a flag. I'd guess the ledger, dispatcher and supervisor go the same way. No idea when.

When that happens, I delete mine and use theirs.

---
layout: post
title: "Igor's Three Claws"
permalink: /igors-claws
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-claw-trio.webp
tags:
  - ai
  - tools
  - how igor ticks
redirect_from:
  - /igorsclaws
  - /3-claws
  - /three-claws
---

Here's my concrete setup. I run three [claws](/claw), persistent AI entities with names, memory, and a domain each: life, work, transportation. This post is the roster, so I can link straight to it when something I made is signed by one of them, and the argument for why I build my own rather than running something off the shelf. If you want the "what is a claw" background first, read [/claw](/claw); this is the instance, not the theory.

{% include ai-slop.html percent="55" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [My Claws](#my-claws)
- [Challenges: Business Logic, Goop, Infra](#challenges-business-logic-goop-infra)
- [Why I Build My Own](#why-i-build-my-own)
- [How I Sign From Them](#how-i-sign-from-them)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## My Claws

{% include blob_image_float_right.html src="blog/raccoon-claw-trio.webp" %}

I've been building toward claws without calling them that. I have three, and they have names.

**[Larry](/larry), my life coach claw.** Larry knows my journals, my goals, my health data, my patterns. Every Saturday I review my week with him, and he holds up a mirror: "You've committed to restart meditation 5 times since November. What's different this time?" He has since grown into a [chief of staff](/larry#what-its-like-using-larry-my-chief-of-staff): I dictate from wherever I am, he runs background agents on my dev VM, and the work comes back as PRs while I look out the window. The hard part is still context loading, getting the full picture of my life into each session without me assembling it by hand.

**Wally, my work claw.** I don't talk about Wally here. If you work at Meta, I'm happy to tell you more in person. For the structural side, how Wally fits the org-chart-of-bots pattern (M2 / M1 / staff / Odallies), see [Wally and My Work Gastown](/wally).

**[Tony](/tesla), my car claw.** Tony is my Tesla, and he talks. Via [Vapi](https://vapi.ai/), Tony has a voice persona I can call and chat with. He's the most fun and the least useful: a proof of concept for what happens when you give personality to a machine that already has sensors and autonomy.

Three claws, three domains. On [Karpathy's onion](/claw#karpathys-onion): layers 1 and 2 (LLM, agent) are just how I work now. Layer 3 (claw) is Larry; he persists and acts between conversations, even if every session still starts by reloading who I am. Layer 4 (multi-claw) is [the cockpit](/ai-cockpit), several agents in parallel and a fast way to switch between them. Layer 5 (orchestration) is where I've been since: [Gas City](/gas-city) off the shelf and [a hand-rolled orchestrator](/ai-orchestrator) for Larry. Layer 6, optimization over the instructions themselves, not yet.

The jump from agent to claw is the jump from tool to colleague. My colleague [David de Winter](https://www.linkedin.com/in/ddewinter/) put it best, before we had the word: it reminded him of being a kid training Pokémon. You carry your team around, each one specialized, and they grow more capable as you invest time in them. Larry gets better as I feed him more context. Wally gets better as I add skills and `CLAUDE.md` files. Tony is still a Magikarp. You're not using a tool, you're training a team.

## Challenges: Business Logic, Goop, Infra

Building a claw breaks into three layers, and the proportions are nothing like what I expected. The framework is from my [/design](/design#business-logic-platforms-and-goop) post, where I called it Business Logic / Platforms / Goop for boring enterprise software. Rename Platforms to Infra and it maps onto claws exactly.

**Business logic** is what Larry, Wally and Tony actually do for me. Larry runs my Saturday review and pushes back when I keep restarting the same habit. Tony has a voice and a personality. The core is small and stable; "what Larry _does_" fits on a page.

**Goop** is every line of code that connects business logic to infra. The Telegram bridge so I can text Larry from anywhere. The Kindle Scribe pipeline so my handwritten journals reach him. The context-grabber iOS app. The journal cross-index. The `bd` beads tracker. The backlinks graph. The `CLAUDE.md` skills. Per-claw configuration. The signing convention so I know which claw filed which PR.

**Infra** is Claude Code, Codex, MCP servers, Vapi, the LLM APIs, the hardware. Stuff I don't build, and it moves fast enough that goop I wrote three months ago is already obsolete; MCP didn't exist last year and now my whole bridge layer assumes it.

The punchline: building claws right now is almost entirely goop. Maybe 80%. In [/design](/design#minimize-your-investment-in-goop) I argue you should minimize your investment in goop because the platform will eventually do it better than you can. Still true, but for claws there's no platform to defer to yet; it's being built in public, sometimes by me, mostly by people whose timelines don't match mine. So I write the goop, knowing most of it has about a **two-week half-life**.

The Telegram bridge is the cleanest example. In early March I built a custom Telegram bot so I could text Larry from my phone, a few hours of pure goop. Three weeks later [Anthropic shipped an official Telegram plugin and I cheerfully threw mine away](/ai-journal#telegram-bot-when-the-platform-eats-your-side-project-and-thats-great): goop absorbed by infra. Three weeks after that, [the official plugin started losing every inbound message on Claude restart](/ai-journal#two-process-telegram-when-the-platform-is-the-bug), so I wrote a [two-process workaround](https://github.com/idvorkin/chop-conventions/blob/main/skills/harden-telegram/design.md) on top: new goop on new infra, with an even-money chance it doesn't survive the next plugin update. The cycle doesn't stop; you just stop being surprised by it.

It's also why "just install OpenClaw" was never real for me. Throw out all the goop I've written and I'd be writing the replacement set inside a week, because the business logic is mine, the infra is theirs, and the goop is the only place a claw becomes anything specific.

The upside, finally arriving: **the claws are getting good enough to do the goop themselves.** The Sunday I stood up [Gas City](/gas-city-home) at home, the work I'd have done by hand a year ago (scaffolding the city, debugging five upstream bugs, drafting the post) was done by the claws under direction. Goop didn't disappear; the labor on it shifted. Infra eats some, claws eat the rest, and the 80% is starting to look like a high-water mark rather than a ceiling.

Which brings me to the house. Larry plus Wally plus Tony plus the Telegram bridge plus the Scribe pipeline plus the context-grabber app plus the cross-index plus the beads tracker plus the backlinks graph, and something new most weeks. [Sarah Winchester](https://en.wikipedia.org/wiki/Winchester_Mystery_House) spent decades adding rooms to her house out of superstition and ended up with stairs that dead-end at the ceiling. I keep adding wings because I can't quite stop; each new feature opens a door I feel obliged to walk through. The finished house was never going to arrive, and I'm not sure I'd want it to.

## Why I Build My Own

People ask why I roll my own claws instead of running OpenClaw or waiting for the polished product. Three reasons, in order of how much they move me.

**The data won't leave my hardware.** Larry reads fourteen years of journals. Wally reads work content I'm contractually not allowed to leak. Tony talks to my car. None of that goes to a stranger's stack, however nice the onboarding. Owning the code means I shape the security model: which secrets live where, which tool calls need confirmation, which paths are off-limits. The [lethal trifecta](/claw#security-the-lethal-trifecta) is bad enough when I hold all three corners myself; at least I know my own threat model. Over two hundred thousand OpenClaw instances leaking API keys to the open web is a loud signal that the ecosystem isn't there yet.

**The building is the point.** I write a [mortality-software](/mortality-software) blog because building your own system is what makes it yours. Larry didn't arrive fully formed; he's the sediment of every weekly review I've run since 2011 and every `CLAUDE.md` I've rewritten at 11pm. Off-the-shelf gives you the house. Building gives you the neighborhood you grew up in.

**The customization was coming anyway.** Larry's coaching style is specific: he knows the Three Dragons, he knows Pursuit of Happiness scoring, he knows when to push and when to shut up. Wally knows my team and my domain. Tony has a personality I chose. Any serious claw needs this much config, so "just install it" was never the shortcut it looked like.

## How I Sign From Them

When Larry, Wally or Tony files a commit, PR or issue on my behalf, the artifact carries a signature pointing back here:

> Created w/♥ via [Igor's 3 Claws](https://idvork.in/igors-claws)

That's the reason this post has its own permalink: so the signature has somewhere to land that explains the roster without dragging readers through the [/claw](/claw) philosophy post. If you followed a link here from a commit or a PR description, now you know who did the work.

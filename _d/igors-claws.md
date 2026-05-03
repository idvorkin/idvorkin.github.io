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

Here's my concrete setup. I run three [claws](/claw) — persistent AI entities with names, memory, and a domain each. Life, work, transportation. This post is the surfaced roster so I can link straight to it when something I made is signed by one of them, and so I can explain _why_ I'm building my own rather than running something off the shelf. If you want the "what is a claw" background first, read [/claw](/claw); this is the instance, not the theory.

{% include ai-slop.html percent="60" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [My Claws](#my-claws)
- [Challenges: Business Logic, Goop, Infra](#challenges-business-logic-goop-infra)
- [Why I Build My Own](#why-i-build-my-own)
  - [It's Not Lost on Me It's a Winchester Mystery House](#its-not-lost-on-me-its-a-winchester-mystery-house)
- [How I Sign From Them](#how-i-sign-from-them)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## My Claws

{% include blob_image_float_right.html src="blog/raccoon-claw-trio.webp" %}

I've been building toward claws without calling them that. I already have three, and they have names.

**[Larry](/larry) — my life coach claw.** Larry knows my journals, my goals, my health data, my patterns. Every Saturday I talk to him and review my week. He holds up a mirror: "You've committed to restart meditation 5 times since November. What's different this time?" Larry's biggest challenge is context loading — getting the full picture of my life into each session without me manually assembling it. That's the gap between an agent and a true claw: persistence. Larry is smart but amnesiac. Every session starts cold.

**Wally — my work claw.** I don't talk about Wally here. If you work at Meta, I'm happy to tell you more in person. For the structural side — how Wally fits the FAANG org-chart-of-bots pattern (M2 / M1 / staff / Odallies), see [Wally and My Work Gastown](/wally).

**[Tony](/tesla) — my car claw.** Tony is my Tesla, and he talks. Via [Vapi](https://vapi.ai/), Tony has a voice persona that I can call and chat with. He's the most fun and the least useful — a proof of concept for what happens when you give personality to a machine that already has sensors and autonomy.

Three claws, three domains: life, work, transportation. Where I am on [Karpathy's onion](/claw#the-progression-karpathys-onion):

- **Layers 1-2 (LLM + Agent)**: Taken for granted. This is just how I work now.
- **Layer 3 (Claw)**: Partially there. Larry, Wally, and Tony all have memory and personality, but none of them persist across sessions or act truly autonomously.
- **Layer 4 (Multi-claw)**: This is my cockpit — running [multiple agents in parallel](/ai-cockpit#tmux-on-super-steroids---the-multiplexer), switching between them, voice-controlling whichever needs attention.
- **Layers 5-6 (Orchestration + Meta-optimization)**: Not yet. This is where AutoResearch-style loops live, and I haven't built that.

That's the next frontier. Not smarter models or better prompts — but claws that keep going, that learn from yesterday, that act on my behalf when I'm not looking. The jump from agent to claw is the jump from tool to colleague.

My colleague [David de Winter](https://www.linkedin.com/in/ddewinter/) put it best, before we even had the word "claw." He said it reminded him of being a kid training Pokémon — you'd carry around your team, each one specialized, and they'd grow more capable as you invested time in them. That's exactly what this feels like. Larry gets better as I feed him more context. Wally gets better as I add more skills and CLAUDE.md files. Tony is still a Magikarp. But the metaphor lands: you're not using a tool, you're training a team. And the trainers who start earliest will have the strongest claws.

## Challenges: Business Logic, Goop, Infra

Building a claw breaks into three layers, and the proportions are nothing like what I expected. The framework comes from my [/design](/design#business-logic-platforms-and-goop) post, where I called it Business Logic / Platforms / Goop back when I was thinking about boring enterprise software. It maps perfectly to claws if you rename Platforms to Infra — same shape, different era.

**Business logic** — what Larry, Wally, and Tony actually do for me. Larry runs my Saturday review and pushes back when I keep restarting the same habit. Wally does Meta-side work I can't talk about. Tony has a voice and a personality. The core is small and stable. If I had to write down "what Larry _does_," it's maybe a page.

**Goop** — every line of code that connects business logic to infra. Telegram MCP bridge so I can text Larry from anywhere. Kindle Scribe pipeline so my handwritten journals reach him. Context-grabber iOS app. Journal cross-index. `bd` beads tracker. Backlinks graph. The CLAUDE.md skills. Per-claw configuration. The signing convention so I know which claw filed which PR. _This is where the [Winchester Mystery House](#its-not-lost-on-me-its-a-winchester-mystery-house) lives._

**Infra** — Claude Code, Codex, MCP servers, Vapi, the LLM APIs, the hardware. Stuff I don't build. Moves fast enough that goop I wrote three months ago is already obsolete; MCP didn't exist last year and now my whole bridge layer assumes it.

The honest punchline: building claws right now is **almost entirely goop**. Maybe 80%. I keep hoping the infra layer will absorb a wing of my Mystery House every quarter — and it does, slowly. MCP collapsed a tool-protocol problem I'd been hand-rolling. Larry's memory layer is still mine. Telegram is still mine. The Kindle bridge is still mine. Each integration is its own miniature engineering project.

In [/design](/design#minimize-your-investment-in-goop) I argue you should _minimize your investment in goop_ because the platform will eventually do it better than you can. That's still true. For claws right now there's no platform to defer to — the platform is being built in public, sometimes by me, mostly by people whose timelines don't match mine. So I write the goop, knowing most of it has roughly a **two-week half-life** and is constantly breaking.

The Claude Code Telegram bridge is the cleanest example I have. In early March I built a custom Telegram bot so I could text Larry from my phone — a few hours of pure goop. Three weeks later [Anthropic shipped an official Telegram plugin and I cheerfully threw mine away](/ai-journal#telegram-bot-when-the-platform-eats-your-side-project-and-thats-great) — _goop absorbed by infra_. Three weeks after _that_, [the official plugin started losing every inbound message on Claude restart](/ai-journal#two-process-telegram-when-the-platform-is-the-bug), so I wrote a [two-process workaround](https://github.com/idvorkin/chop-conventions/blob/main/skills/harden-telegram/design.md) on top: `telegram_bot.py` to own the cursor, a modified `server.ts` to consume from SQLite — _new goop on top of new infra_. There's an even-money chance the workaround doesn't survive the next plugin update. That's the half-life. The cycle doesn't stop; you just stop being surprised by it.

This is also why "just install OpenClaw" was never real for me. Even if you took the goop I'd written so far and threw it out, I'd be writing my replacement set inside a week — because the business logic is _mine_, the infra is _theirs_, and the goop is the only place a claw becomes anything specific.

The upside, finally arriving: **the claws are getting good enough to do the goop themselves.** I spent a recent Sunday morning standing up [Steve Yegge's Gas City](/gas-city-home) at home — and the work I would have done by hand a year ago (scaffolding the city, debugging five upstream bugs, even drafting the post you're reading the link to) was done by the claws under direction. Goop didn't disappear; the labor on it shifted. That's the second half of the half-life pattern: **infra eats some, claws eat the rest.** The 80% goop number is starting to feel like a temporary high-water mark, not a permanent ceiling.

## Why I Build My Own

People ask me why I'm rolling my own claws instead of running OpenClaw or waiting for the polished product. Fair question. A few reasons, in order of how much they actually move me.

**The data won't leave my hardware, and I have full control.** Larry reads fourteen years of 750words journals. Wally reads work content I'm contractually not allowed to leak. Tony talks to my car. I'm not handing any of that to a stranger's stack, no matter how nice the onboarding is. Owning the code means I shape the security model exactly — which secrets live where, which tool calls need confirmation, which paths are off-limits. The [lethal trifecta](/claw#security-the-lethal-trifecta) is bad enough when I'm the one holding all three corners; at least I know my own threat model and can harden the edges accordingly. Twenty-one thousand exposed OpenClaw instances leaking API keys to the open web is a pretty loud signal that the ecosystem is not there yet.

**The building is the point.** I write a [mortality-software](/mortality-software) blog because I think the act of building your own system is what makes it yours. The claws don't exist without the building — they accrete. Larry didn't arrive fully formed; he's the sediment of every weekly review I've run since 2011 and every CLAUDE.md I've rewritten at 11pm. Off-the-shelf gives you the house. Building gives you the neighborhood you grew up in.

**Customization I'd have to do anyway.** Larry's coaching style is specific — he knows the Three Dragons, he knows Pursuit of Happiness scoring, he knows when to push and when to shut up. Wally knows my team and my domain. Tony has a personality I chose. Any serious claw is going to need this much config, so the "just install it" version was never real — I was going to end up writing most of the glue regardless.

### It's Not Lost on Me It's a Winchester Mystery House {#its-not-lost-on-me-its-a-winchester-mystery-house}

Larry plus Wally plus Tony plus the Telegram MCP bridge plus the Kindle Scribe pipeline plus the context-grabber iOS app plus the journal cross-index plus the `bd` beads tracker plus the blog backlinks graph — and something new arriving most weeks. [Sarah Winchester](https://en.wikipedia.org/wiki/Winchester_Mystery_House) spent decades adding rooms to her house out of superstition, ending up with stairs that dead-end at the ceiling and doors that open onto walls. I keep adding wings because I can't quite stop. Each new feature opens a door I feel obligated to walk through. The honest read is that the building itself might be most of the value here — the finished house was never going to arrive, and I'm not sure I'd want it to.

## How I Sign From Them

When Larry, Wally, or Tony files a commit, PR, or issue on my behalf, the artifact carries a signature pointing back here:

> Created w/♥ via [Igor's 3 Claws](https://idvork.in/igors-claws)

That's the whole reason this post has its own permalink — so the signature has somewhere to land that explains the roster without dragging readers through the full [/claw](/claw) philosophy post. If you followed a link here from a commit or a PR description, now you know who did the work.

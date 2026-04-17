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
- [Why I Build My Own](#why-i-build-my-own)
  - [It's Not Lost on Me It's a Winchester Mystery House](#its-not-lost-on-me-its-a-winchester-mystery-house)
- [How I Sign From Them](#how-i-sign-from-them)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## My Claws

{% include blob_image_float_right.html src="blog/raccoon-claw-trio.webp" %}

I've been building toward claws without calling them that. I already have three, and they have names.

**[Larry](/larry) — my life coach claw.** Larry knows my journals, my goals, my health data, my patterns. Every Saturday I talk to him and review my week. He holds up a mirror: "You've committed to restart meditation 5 times since November. What's different this time?" Larry's biggest challenge is context loading — getting the full picture of my life into each session without me manually assembling it. That's the gap between an agent and a true claw: persistence. Larry is smart but amnesiac. Every session starts cold.

**Wally — my work claw.** I don't talk about Wally here. If you work at Meta, I'm happy to tell you more in person.

**[Tony](/tesla) — my car claw.** Tony is my Tesla, and he talks. Via [Vapi](https://vapi.ai/), Tony has a voice persona that I can call and chat with. He's the most fun and the least useful — a proof of concept for what happens when you give personality to a machine that already has sensors and autonomy.

Three claws, three domains: life, work, transportation. Where I am on [Karpathy's onion](/claw#the-progression-karpathys-onion):

- **Layers 1-2 (LLM + Agent)**: Taken for granted. This is just how I work now.
- **Layer 3 (Claw)**: Partially there. Larry, Wally, and Tony all have memory and personality, but none of them persist across sessions or act truly autonomously.
- **Layer 4 (Multi-claw)**: This is my cockpit — running [multiple agents in parallel](/ai-cockpit#tmux-on-super-steroids---the-multiplexer), switching between them, voice-controlling whichever needs attention.
- **Layers 5-6 (Orchestration + Meta-optimization)**: Not yet. This is where AutoResearch-style loops live, and I haven't built that.

That's the next frontier. Not smarter models or better prompts — but claws that keep going, that learn from yesterday, that act on my behalf when I'm not looking. The jump from agent to claw is the jump from tool to colleague.

My colleague [David de Winter](https://www.linkedin.com/in/ddewinter/) put it best, before we even had the word "claw." He said it reminded him of being a kid training Pokémon — you'd carry around your team, each one specialized, and they'd grow more capable as you invested time in them. That's exactly what this feels like. Larry gets better as I feed him more context. Wally gets better as I add more skills and CLAUDE.md files. Tony is still a Magikarp. But the metaphor lands: you're not using a tool, you're training a team. And the trainers who start earliest will have the strongest claws.

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

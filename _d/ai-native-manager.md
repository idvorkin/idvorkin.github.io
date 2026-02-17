---
layout: post
title: "The AI Native Engineering Manager"
permalink: /ai-native-manager
tags:
  - manager
  - ai
  - software engineering
redirect_from:
  - /ai-em
  - /ai-native-em
imagefeature: /images/raccoon-ai-native-em.webp
---

What does it mean to be an engineering manager when AI is rewriting every assumption you have about software, teams, and your own role? I don't know yet. Nobody does. But I'm figuring it out in real time, and these are my notes from the chaos.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What is AI Native?](#what-is-ai-native)
- [The Year of Chaos](#the-year-of-chaos)
- [The AI Native EM Job](#the-ai-native-em-job)
  - [First Principles: Help People Build Effectively](#first-principles-help-people-build-effectively)
  - [The AI Chasm: Assessment and Adoption Stages](#the-ai-chasm-assessment-and-adoption-stages)
  - [Coaching Through the Chasm](#coaching-through-the-chasm)
- [What Translates from the Old World](#what-translates-from-the-old-world)
  - [Same But More So](#same-but-more-so)
  - [Completely Different](#completely-different)
- [Making AI a Team Sport](#making-ai-a-team-sport)
  - [Divide and Conquer](#divide-and-conquer)
  - [Share the Learnings](#share-the-learnings)
  - [AI Free Zones](#ai-free-zones)
- [Open Questions](#open-questions)
- [User Requested Questions](#user-requested-questions)
- [Appendix: New Words for a New World](#appendix-new-words-for-a-new-world)
  - [Functional Collapse](#functional-collapse)
  - [Agency](#agency)
  - [AI Cockpit](#ai-cockpit)
- [Appendix: Hot Takes](#appendix-hot-takes)
  - [Should XFN Code?](#should-xfn-code)
- [Appendix: Old Questions, New Answers](#appendix-old-questions-new-answers)
  - [How Should Hiring Change?](#how-should-hiring-change)
  - [Should EMs Code?](#should-ems-code)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include ai-slop.html percent="50" %}

{% include alert.html content="These are my personal opinions, not those of any employer, past or present. No one knows the future, especially me." style="warning" %}

{% include local_image_float_right.html src="raccoon-ai-native-em.webp" %}

## What is AI Native?

AI native doesn't mean "we use AI." Everyone uses AI. AI native means you reimagine the world assuming AI exists from the ground up. You don't bolt AI onto your existing processes — you ask what processes would look like if you designed them today, knowing what AI can do.

## The Year of Chaos

The definition of roles is completely changing, and we don't know to what. And we have to switch to the new roles while we keep doing our day job. It's like rebuilding the airplane while flying it, except someone also keeps changing what an airplane is.

Every few days we find out something that shatters our world views and assumptions.

Every week there are 30 new things to look at. 29 of them are probably trash. But you don't know which one isn't, and you can't afford to miss it.

## The AI Native EM Job

### First Principles: Help People Build Effectively

Strip away the buzzwords and the EM job hasn't changed at its core: help people be the most effective at their building job. What's changed is what "effective" looks like, what "building" means, and how fast both of those keep shifting.

### The AI Chasm: Assessment and Adoption Stages

People don't adopt AI in a straight line. They go through stages, and your job as an EM is to figure out where each person is and help them move forward. Not everyone is in the same place, and that's fine. What's not fine is leaving people stuck.

- **Denial** — "This doesn't apply to my work." "It's just autocomplete." They haven't tried it, or tried it once six months ago and dismissed it.
- **Skepticism** — "I tried it and it's not that good." They've used it but hit the trough of disillusionment. The output wasn't magic, so they bounced.
- **Fear** — "Is this going to replace me?" They see it working for others and feel threatened rather than empowered. This is where people get paralyzed.
- **Frenzy** — "I'm going to AI everything!" They've crossed the chasm and are overcorrecting. Working 12-hour days with Claude Code, trying to 10x everything, setting unsustainable pace.
- **Burnout** — The crash after the frenzy. Yegge's [AI Vampire](/ai-journal#steve-yegges-ai-vampire---who-captures-the-10x). Nap attacks, exhaustion, cynicism about the very tools they were excited about last month.
- **Sustainable Execution** — The goal. They know when to use AI and when not to. They've built it into their workflow without it consuming them. They're faster and they're not dying.

Your job is to assess where each person is and meet them there. You can't drag someone from Denial to Frenzy — they'll just snap back. And you can't let someone burn in Frenzy without intervention.

### Coaching Through the Chasm

I heard someone say: if the people you support aren't scared shitless of AI taking their jobs, you need to get them there — and then get them past there. That sounds harsh, but there's wisdom in it. Fear is a necessary waypoint, not a destination. People who skip Fear and jump straight to Frenzy crash harder. People who never reach Fear stay in Denial or Skepticism and get left behind.

**Denial → Skepticism**: Don't argue. Show, don't tell. Pair with them. Have them watch you use AI on their actual codebase, not a toy demo. The gap between "I tried ChatGPT once" and "I watched someone use Claude Code on my repo" is enormous.

**Skepticism → Fear**: This is where you need to be honest, not comforting. Show them what's coming. Share what other teams are shipping, how fast the tools are improving, what the industry looks like in 6 months. The goal isn't to terrorize them — it's to create genuine urgency. If they're not a little scared, they're not paying attention.

**Fear → Frenzy**: This is the hardest transition to coach because you're not pushing — you're catching. Fear paralyzes. Your job is to make it safe to experiment. Give them low-stakes projects to try AI on. Celebrate ugly first attempts. Pair them with someone in Sustainable Execution, not someone in Frenzy (that's intimidating, not inspiring). The message: "Your job isn't going away. Your job is changing. Let's figure out the new version together."

**Frenzy → Burnout**: You mostly can't prevent this, but you can shorten it. Set boundaries they won't set for themselves. "You shipped three features this week, that's enough." Watch for the signs — sleeping weird, irritable, can't stop talking about tokens. Name what you see.

**Burnout → Sustainable Execution**: Give them permission to slow down. Remind them that 3 productive hours of AI-augmented work is still massively more output than a pre-AI full day. Help them find their rhythm — not yours, not Yegge's, theirs.

## What Translates from the Old World

I wrote a whole [manager book](/manager-book) in the pre-AI world. Some of it carries over directly, some of it is the same principle but amplified, and some of it is completely different.

### Same But More So

- **"Never have a human do what a computer can do"** — I wrote this as a process principle. It's now 100x more true. The surface area of what a computer can do exploded overnight.
- **Coaching and the 7 questions** — [The coaching questions](/coaching) still work. "What's on your mind?" is still the best opener for a 1:1. But "what's the real challenge here for you?" now often has AI-shaped answers that neither of you fully understand yet.
- **Situational leadership** — The four stages (Foolish Novice → Novice → Journeyman → Expert) map directly onto AI adoption. Someone can be an Expert at their domain and a Foolish Novice at AI-augmented work, simultaneously. That's disorienting for everyone.
- **Culture: sustainable execution** — "Ship fast, test often, pay down debt, never get stuck" is more important than ever. The Frenzy stage produces a lot of shipped code that creates a lot of debt. Sustainability is the whole game.
- **Career development** — Career Growth Plans still matter, but the skills you're growing are shifting under your feet. You need to update what "senior" means when a junior with Claude Code can out-produce a senior without it.

### Completely Different

- **The 4 dimensions of success** — Business Results, People, Process, Tech Assets. The weights are shifting. Tech Assets matter less when code is cattle not pets. People matter more because AI fluency is the multiplier. Process is up for complete reinvention.
- **Hiring** — See [Old Questions, New Answers](#how-should-hiring-change) below.
- **Planning and estimation** — The [execution order](/manager-book#planning-roadmaps-and-resource-allocation) (Why → What → When → Who) still holds, but timelines are compressing in unpredictable ways. A project that would have taken a quarter might take a week. Or it might still take a quarter because the hard part was never the code.
- **The schedule** — My old 44-hour week breakdown (8hrs 1:1s, 6hrs partner meetings, 6hrs reviews...) assumes a stable world where you can plan your week. In the Year of Chaos, you need more slack for learning, experimenting, and helping people through the AI chasm.

## Making AI a Team Sport

The lone wolf vibe coder gets all the Twitter glory, but that's not how teams work. Your job as an EM is to make AI a team sport — divide and conquer, match people to their strengths, and make the whole team successful, not just the one person who happens to be in Frenzy.

### Divide and Conquer

Ramping up into AI is like ramping up into any new technical space. You don't have everyone learn everything — you divide the stuff to learn, have folks figure out their piece, and report back to the team. That's how you turn an overwhelming firehose into manageable streams.

Not everyone needs to be good at the same things. AI opens up new roles within the team that didn't exist before:

- **The Trailblazer** — Someone who's always trying the latest tools, workflows, models. They break things, they find what works, they report back. You need one of these, not five. Let them run ahead and scout.
- **The Toolsmith** — Someone who takes what the trailblazer finds and turns it into repeatable workflows for the team. CLAUDE.md files, prompt libraries, custom slash commands, shared agent configs. This is infrastructure work and it's incredibly high-leverage.
- **The Skeptic** — Someone who pushes back on AI-generated code, catches the hallucinations, insists on tests and reviews. This isn't Denial — it's quality. Every team needs someone who says "wait, did we actually verify this works?"
- **The Bridge** — Someone who translates between AI-fluent and AI-skeptical team members. They can pair with anyone and meet them where they are. Often this is your best coach.

These aren't formal roles or titles. They're natural tendencies that people already have. Your job is to notice them and lean in. The trailblazer who's forced to write docs burns out. The skeptic who's told to "just trust the AI" checks out. Match people to their strengths.

### Share the Learnings

AI fluency compounds faster in teams than in individuals — but only if you create the channels:

- **AI show-and-tell** — Dedicate time in team meetings for "here's a cool thing I figured out with AI this week." Low-stakes, high-signal.
- **Shared prompt libraries and configs** — One person's breakthrough becomes everyone's baseline. This is the [integral](/ai-journal#ai-value-capture---its-the-integral-not-the-point) in action.
- **Pair programming with AI** — Two people, one AI session. The person driving learns the tools; the person watching catches mistakes and learns the workflow. Rotate.
- **Failure sharing** — "Here's where AI completely botched it and what I learned" is more valuable than success stories. Normalize talking about AI failures so people don't waste time on the same dead ends.

### AI Free Zones

While some folks are excited about AI, sometimes we need a break. The AI Vampire is real, and part of making AI a team sport is knowing when to put the ball down.

There are two reasons to create AI-free zones, and both matter:

**Don't stop thinking.** If you reach for AI every time something is hard, you stop exercising the muscles that make you good at your job. Deep thinking, system design intuition, debugging by reasoning about code — these skills atrophy when you outsource them. The paradox is that the people who are best with AI are the ones who can think clearly without it. AI-free time is training time for the skills that make your AI-augmented time more effective.

**Sometimes you just need a break.** Not everything has to be about AI. Social interactions — lunch, coffee, hallway conversations — shouldn't become another AI discussion forum. People need spaces where they can be humans talking to humans about human things. When every lunch turns into "have you tried this new model?" it gets exhausting, even for the enthusiasts. Consider designating some social time as AI-free: maybe lunch on certain days, maybe Friday afternoon hangouts, maybe the first 10 minutes of every meeting. The right cadence depends on your team, but the principle is: protect some space where people can just be people.

The broader point: a team that only knows how to work with AI is fragile. They need the underlying skills to stay sharp, and they need the social fabric that comes from connecting as humans, not just as AI practitioners.

## Open Questions

Things I'm actively trying to figure out:

- **Can managers manage more people now?** If AI makes each IC more productive, does the EM span of control increase? Or does the opposite happen — you become more of an M2 (manager of managers) because the complexity per person goes up? My instinct: the bottleneck isn't number of people, it's surface area. And surface area is exploding.
- **What happens to junior engineers?** If AI handles the tasks we used to give juniors to learn on, how do people develop? Do we need to deliberately create learning experiences that AI could do faster?
- **What's the new career ladder?** If code is cattle and anyone can produce it, what differentiates a senior engineer from a junior one? Judgment? Taste? System design? The ability to prompt well?
- **How do you evaluate performance?** Output per person is going up but is wildly uneven depending on AI adoption stage. How do you calibrate fairly across a team where some people are in Frenzy and others are in Denial?

## User Requested Questions

These are questions people have asked me that I don't have good answers for yet. If you're an EM in the AI age, you're probably asking these too.

- **How did trailblazing actually work?** How do you have a single team look at the entire breadth of AI improvement every week and decide what to assess, how to assess it, and what to keep? Does every team have to do it all?
- **What do you actually do with the old world dev who isn't adopting?** The coaching model is nice in theory. But when someone stays in Denial after months of investment, then what?
- **How do you manage the dev who is producing massive amounts of code?** How do you know if it's good? Does someone have to read every line? Do 2 people have to?
- **How do you deal with work products that 0 people have read?** Specs produced by AI, and no one has carefully looked at the testing or release section. Giant PRs with files or long sections written entirely by AI.
- **Are those of us who aren't going to get fired in the next 6 months on a path to extreme burnout?**
- **Why don't you fire half your devs? Fire 90% of your devs?** If AI makes everyone 2-10x more productive, why not just cut?
- **Why not flatten the org?** Instead of EMs there are just cattle ranchers.
- **What does an M2 do these days? An M3?** Are their jobs changing?

## Appendix: New Words for a New World

AI is spawning a bunch of new terms. Some are useful, some are hype. Here's my take on the ones worth knowing.

### Functional Collapse

The idea that distinct roles — PM, EM, Designer, Engineer — collapse into one: "builder." Everyone can do everything now because AI fills in the gaps.

My take: we've seen this movie before. When dev and test merged into the "software engineer" title, functional collapse was the buzzword. But what actually happened? People who were really good testers built awesome test frameworks, and devs mostly scraped by at testing. We shared the title, but the specialties persisted because some people were genuinely better at certain things due to interest and aptitude.

The same thing is happening now. In my world, TPM may have collapsed into the engineering team — there's no separate TPM role. But some engineers are much better at the TPM work (coordination, cross-team dependencies, program management) than others, because they're drawn to it and have built the muscle. They don't have the title, but they have the specialty.

So yes, AI enables functional collapse in the sense that anyone _can_ write a PRD or build a prototype or sketch a design. But "can" and "good at" are different things. The easy stuff gets democratized. The hard stuff still needs people who go deep. We might all be "builders" on paper, but we'll all have specialties where we're better than others.

### Agency

The fancy new word for "Gets Shit Done." It's not new — it's always been the thing that separates people who drive outcomes from people who wait to be told what to do. But AI made it more visible. When AI handles the boilerplate, the gap between someone with agency and someone without it is enormous. The person with agency sees the problem, figures out the approach, uses whatever tools exist (AI or not), and ships. The person without agency asks for a ticket.

{% include summarize-page.html src="/agency" %}

### AI Cockpit

{% include summarize-page.html src="/ai-cockpit" %}

## Appendix: Hot Takes

### Should XFN Code?

Depends on why.

If the goal is to speed up the engineering team by having PMs and designers submit PRs — probably not. There's a reason many mature teams stopped accepting outside PRs: the review cost, the context-switching, the "helpful" code that doesn't fit the architecture. A PM writing code to ship a feature faster often creates more work for engineers, not less.

But if the goal is something else, then yes:

- **To explore and explain** — A PM who can vibe-code a prototype to show what they mean? Incredibly valuable. That's not a PR, it's a communication tool. Worth more than any spec doc.
- **To build bespoke tooling** — A designer who builds their own Figma-to-component pipeline, a PM who automates their own metrics dashboards, a TPM who scripts their own status tracking. These are productivity tools for themselves, not contributions to the engineering codebase.
- **To build agentic workflows** — XFN building agents that automate their own domain tasks (data analysis, user research synthesis, A/B test configuration). This is the real unlock — not coding for engineers, but coding for themselves.

The line: are you producing code that engineers need to own and maintain? Then you're adding to their burden. Are you producing tools that make your own work better? Then go for it.

## Appendix: Old Questions, New Answers

### Should EMs Code?

In the [old world](/manager-book#should-managers-code), my answer was: read code occasionally for spot-checking and context, but don't be on the critical path. AI changes this question completely.

With AI, an EM can vibe-code a prototype in an afternoon that would have taken a week to spec and assign. You can build team tools, automate toil, and stay closer to the technical reality. The cost of coding dropped so much that the old "you can't afford to code, you have people to manage" calculus is different now.

But the trap is real: if you're vibe-coding all day, you're not managing. The AI Vampire doesn't care about your title. You can burn out just as fast as your ICs, and then who's looking out for them?

### How Should Hiring Change?

In the [old world](/manager-book), the hiring formula was: Smart, Gets Shit Done, Not an Asshole. Guess what? That hasn't changed. The fundamentals are the fundamentals.

What changed is "Gets Shit Done" got a fancy new word — [Agency](/agency). But it's the same thing it always was: seeing what needs to happen and making it happen, without someone holding your hand. AI didn't invent agency, it just made it more visible. When AI handles the boilerplate, the people who drive outcomes stand out even more from the people who were hiding behind busy work.

The real question isn't _what_ to hire for — it's _how_ to assess it when AI changes what the work looks like. That's a whole separate rabbit hole.

{% include summarize-page.html src="/ai-hiring" %}

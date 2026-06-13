---
layout: post
title: "AI Native Vocabulary: New Words for a New World"
permalink: /ai-native-vocab
tags:
  - ai
  - software engineering
redirect_from:
  - /ai-vocab
  - /ai-native-words
ai_default_image: true
---

AI is spawning a whole new vocabulary — some of it genuinely useful, some of it pure hype. This is my running glossary of the terms worth knowing, with my take on what each one actually means and why it matters. It's the companion glossary to [The AI Native Engineering Manager](/ai-native-manager).

{% include ai-slop.html percent="50" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Functional Collapse](#functional-collapse)
- [Agency](#agency)
- [AI Cockpit](#ai-cockpit)
- [AI Pilled](#ai-pilled)
- [Cognitive Debt](#cognitive-debt)
- [Dark Factory](#dark-factory)
- [Data Provenance](#data-provenance)
- [Deep Blue](#deep-blue)
- [Heresies](#heresies)
- [Hill Climbing](#hill-climbing)
- [Infinite Loop](#infinite-loop)
- [Human In, On, and Out of the Loop](#human-in-on-and-out-of-the-loop)
- [In Distribution](#in-distribution)
- [Reverse Centaur](#reverse-centaur)
- [Year of Wonder](#year-of-wonder)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

{% include alert.html content="These are my personal opinions, not those of any employer, past or present. No one knows the future, especially me." style="warning" %}

{% include local_image_float_right.html src="raccoon-nerd.webp" %}

## Functional Collapse

The idea that distinct roles — PM, EM, Designer, Engineer — collapse into one: "builder." Everyone can do everything now because AI fills in the gaps.

My take: we've seen this movie before. When dev and test merged into the "software engineer" title, functional collapse was the buzzword. But what actually happened? People who were really good testers built awesome test frameworks, and devs mostly scraped by at testing. We shared the title, but the specialties persisted because some people were genuinely better at certain things due to interest and aptitude.

The same thing is happening now. In my world, TPM may have collapsed into the engineering team — there's no separate TPM role. But some engineers are much better at the TPM work (coordination, cross-team dependencies, program management) than others, because they're drawn to it and have built the muscle. They don't have the title, but they have the specialty.

So yes, AI enables functional collapse in the sense that anyone _can_ write a PRD or build a prototype or sketch a design. But "can" and "good at" are different things. The easy stuff gets democratized. The hard stuff still needs people who go deep. We might all be "builders" on paper, but we'll all have specialties where we're better than others.

## Agency

The fancy new word for "Gets Shit Done." It's not new — it's always been the thing that separates people who drive outcomes from people who wait to be told what to do. But AI made it more visible. When AI handles the boilerplate, the gap between someone with agency and someone without it is enormous. The person with agency sees the problem, figures out the approach, uses whatever tools exist (AI or not), and ships. The person without agency asks for a ticket.

{% include summarize-page.html src="/agency" %}

## AI Cockpit

{% include summarize-page.html src="/ai-cockpit" %}

## AI Pilled

A founder-era shorthand for the shift from "uses AI when it helps" to "instinctively reaches for AI first." Shivani Poddar (ex-Google / Deepmind / Meta, now Founder Stealth) lists it as one of three things she looks for in her founding team: "you know how to exponentiate yourself, your stack, your product and people around you with AI." The key word is _exponentiate_ — not "use AI for the task you happened to land on," but deliberately compounding across four layers: self, tools, output, and the humans around you.

My take: AI-pilled is the habit form of what [Agency](#agency) is dispositionally. Agency is wanting to make things happen without being told. AI-pilled is what agency looks like in this era — the default tool reach is an AI. Someone with both shows up to every problem already five moves in. Someone with one without the other shows up late or shows up stuck. For hiring, [Shivani's three criteria](/ai-native-manager#how-should-hiring-change) are a tight test: excellence-in-something gives you the slope, founder energy gives you the fuel, AI-pilled gives you the transmission.

## Cognitive Debt

[Cognitive debt](https://simonwillison.net/2026/Feb/15/cognitive-debt/) is the debt that accumulates not in the code, but in developers' brains. When you go fast with AI — prompting entire features into existence without reviewing the implementation — you lose the shared mental model of what the system does and why. The code might work fine. But nobody on the team can explain why it works, what the design decisions were, or what will break if you change it.

My take: this is the hidden cost of the [Frenzy](/ai-native-manager#the-ai-chasm-assessment-and-adoption-stages) stage. Someone in Frenzy ships ten features in a week, and the team's cognitive debt goes through the roof. The thing to watch for is not just "is the code working?" but "does the team understand what they built?" Code review isn't just about catching bugs anymore; it's about maintaining the team's shared understanding. If you can't explain what you shipped, you can't confidently change it, and that's where progress stalls. At the org level, this is the [AI second brain](/ai-second-brain) problem — how do you keep collective understanding coherent when information flows faster than any human can track?

The good news: the same AI that creates cognitive debt can pay it down. Willison's [interactive explanations](https://simonwillison.net/guides/agentic-engineering-patterns/interactive-explanations/) pattern takes this further — instead of just diagrams, have AI build [explainers](/explainers): interactive, step-through visualizations that make algorithms and systems click in a way static text never will. Make this part of the workflow: don't just ship the feature, ship the explainer. Sequence diagrams, class diagrams, animated walkthroughs — if the AI can't explain what it just built in an interactive picture, that's a red flag that nobody else will understand it either.

## Dark Factory

{% include summarize-page.html src="/dark-factory" %}

## Data Provenance

The documented record of where your data came from and everything that happened to it since — source, collection method, transformations, licensing, who touched it. (Data _lineage_ is the narrower subset that tracks the data's journey; provenance also covers the systems and decisions that shaped it.) In AI the stakes jump, because provenance is how you answer "what actually went into this model, and are we allowed to use it?" It's what lets you check that training data was collected lawfully, is representative, and hasn't been quietly contaminated by synthetic or scraped junk — and you can't reconstruct it after the fact. The [EU AI Act](https://artificialintelligenceact.eu/) already requires general-purpose model providers to publish training-data summaries, so this is becoming a compliance floor, not a nice-to-have.

My take: this lands on you whether you want it or not, in three places. (1) **What you train or fine-tune on** — if you can't say where it came from, you can't ship it, and "we'll sort out provenance later" means never. (2) **What your systems ground on at runtime** — RAG is only as trustworthy as the provenance of what's in the index; a [heresy](#heresies) is really a provenance failure that made it into the context. (3) **What your AI produces** — generated code and content need a traceable origin too, or you inherit license and security risk you can't see. Capturing it feels like pure overhead right up until someone asks "why did the model say that?" and you've got nothing. It's the [cognitive debt](#cognitive-debt) problem pointed at data instead of code — pay it down early.

## Deep Blue

[Deep Blue](https://simonwillison.net/2026/Feb/15/deep-blue/) is the psychological ennui leading into existential dread that software engineers feel when AI encroaches on their craft. Named after IBM's chess computer that beat Kasparov in 1997, it was coined by Adam Leventhal on the Oxide and Friends podcast. The core feeling: "I dedicated my career to learning this thing and now it does it. What am I even for?"

My take: this is the emotion underneath the [Fear](/ai-native-manager#the-ai-chasm-assessment-and-adoption-stages) stage. When someone is stuck in Fear, they're probably experiencing Deep Blue — they just don't have a word for it. Giving it a name makes it easier to discuss. "I think you might be feeling some Deep Blue" is more useful than "are you worried about AI?" Chess players and Go players went through this and came out stronger. But they needed time, space, and the realization that being good at chess still mattered even after machines were better at it. Same thing here — the skills still matter, the role just changes.

But here's the really good news: there's a new type of mastery to be had. DHH talks about [coding as mastery](/chop#reasons-to-program---mastery-vs-getting-shit-done) — the joy of VIM combos feeling like Street Fighter II joystick combos, the craft of the thing. Deep Blue assumes that mastery is over because the machine can do it. But that's wrong. The mastery shifts — from writing code to orchestrating AI to build things that were previously impractical. And the payoff is real: you can genuinely do 10x as much. That's not hype, that's more good in the world, more problems solved, more things built. This is especially true for senior folks. The people with the deepest understanding of systems, architecture, and trade-offs are exactly the ones who get the most leverage from AI. All that experience doesn't become worthless — it becomes the judgment layer that makes AI-assisted work actually good instead of just fast.

## Heresies

Yegge nails this one in his [Gas Town Emergency User Manual](https://steve-yegge.medium.com/gas-town-emergency-user-manual-cf0e4556d74b). A heresy is when AI develops a compelling but wrong belief about your system — not a hallucination about the world, but a false conviction about _your_ codebase. And the killer property is that they spread and persist:

{% include quote.html text="Agents are very approximate workers and they like to guess at stuff. They will often make wrong guesses about how your system is supposed to work. If that wrong guess makes it into the code, sneaking through the review process, then it becomes enshrined and other agents may notice it and propagate the heresy in their own work." author="Steve Yegge" url="https://steve-yegge.medium.com/gas-town-emergency-user-manual-cf0e4556d74b" %}

His example is "idle polecats" — a concept that doesn't exist in Gas Town but keeps reappearing:

{% include quote.html text='"Idle polecats" is an example of a heresy that plagues Gas Town. There is no such thing as an idle polecat; it&apos;s not a pool, and they vanish when their work is done. So "idle polecats" make it back into the code base, comments, and docs all the time.' author="Steve Yegge" url="https://steve-yegge.medium.com/gas-town-emergency-user-manual-cf0e4556d74b" %}

That's the part that makes heresies so maddening. You correct it. It comes back. You correct it again. It comes back in a different file. You add it to your CLAUDE.md. It _still_ comes back, because some other agent read the enshrined heresy in a comment before it read your instructions. It's not a one-time fix — it's a recurring battle against false beliefs that have infected your codebase.

{% include quote.html text="I've found the most helpful way to rid yourself of persistent heresies is to capture your guiding principles in the agent priming (onboarding). The more coverage you can get with them, the more classes of heresy you can avoid or easily correct simply by pointing at the principle they violate." author="Steve Yegge" url="https://steve-yegge.medium.com/gas-town-emergency-user-manual-cf0e4556d74b" %}

In other words, your CLAUDE.md and onboarding docs aren't just nice-to-haves — they're your immune system against heresies.

## Hill Climbing

{% include summarize-page.html src="/hill-climbing" %}

## Infinite Loop

When AI gets stuck cycling between broken solutions — oscillating between two approaches that don't work, or repeatedly applying the same wrong fix because it's acting on a [heresy](#heresies). The AI isn't making progress; it's burning tokens and time while going nowhere.

The real damage isn't the wasted AI cycles — it's what happens to the human. You notice the AI is stuck, so you start trying to break it out. You rephrase the prompt. You add context. You explain what the system _actually_ does. Twenty minutes later, you're debugging the AI's mental model instead of debugging your code. You went from warp speed to impulse to maneuvering thrusters, and the difference is mind-boggling — the same tool that wrote three features before lunch now can't fix a four-line function, and you're somehow making it worse by trying to help.

The right move is to recognize the infinite loop early and then figure out how to break it — same as when a human is stuck and you need to get them unstuck. A few patterns that work:

- **Surface the false belief** — Ask the AI "why do you think X works this way?" Sometimes it'll reveal the [heresy](#heresies) it's operating on, and you can correct it directly.
- **Burn it down and restart** — Throw out the broken code, start a fresh session with clean context. The AI's context is poisoned; no amount of "no, actually..." will fix it. A new conversation with good priming is often faster than arguing with a confused one.
- **Narrow the scope** — The AI is trying to solve too much at once and thrashing. Give it a smaller, more constrained problem. "Just fix this one function" instead of "fix the whole feature."
- **Read the code yourself** — Sometimes the fastest way to break the loop is to actually understand what's happening. Read the code the AI wrote, find the wrong assumption, and tell it exactly what's true.
- **Just do it manually** — Sometimes the right answer really is to take over. The hardest part is accepting the transition from 10x to "I'll write it myself" — it feels like defeat, but it's the fastest path forward when nothing else works.

The teams that struggle most are the ones where nobody has permission to say "the AI is stuck, I'm changing approach."

## Human In, On, and Out of the Loop

Three modes of working with AI, borrowed from autonomous systems:

- **Human in the loop** — The human approves every AI action before it takes effect. Every PR reviewed, every spec read, every generated test validated. This is where most teams start and it's the safest default.
- **Human on the loop** — The AI acts autonomously, but the human monitors and can intervene. Think: AI-generated PRs that auto-merge if CI passes, but a human watches dashboards and can halt the pipeline. The human isn't approving each action — they're supervising the system.
- **Human out of the loop** — Fully autonomous. No human reviews the output.

The real question isn't "which mode should we be in?" — it's "are we actually in the mode we think we're in?" A team that claims human-in-the-loop but reviews 50 AI-generated PRs a day is kidding itself. That's rubber-stamping, which gives you the overhead of in-the-loop with the safety of out-of-the-loop — the worst of both worlds. And when the AI hits an [infinite loop](#infinite-loop) in on-the-loop mode, someone needs to notice before it burns hours on nothing.

## In Distribution

A term borrowed from machine learning: data the model has seen during training is "in distribution," and data it hasn't seen is "out of distribution." In practice, this means agents already know about tools, libraries, and patterns that were in their training data — they'll reach for them naturally, use them correctly, and even prefer them over alternatives. Anything out of distribution requires expensive prompting, documentation, and hand-holding at inference time.

Yegge identifies this as one of his [six levers for software survival](https://steve-yegge.medium.com/software-survival-3-0-97a2a6255f7b) — he calls it the "Awareness" lever. Tools like Git and Postgres have essentially zero awareness cost because every model has been trained on mountains of content about them. Your team's internal CLI tool? Completely out of distribution. You're paying the awareness tax every time an agent encounters it.

My take: this matters because it changes how you think about tooling decisions. When your team picks a well-known tool over a technically superior but obscure one, that's not just "going with the safe choice" — it's a rational calculation about agent effectiveness. Your CLAUDE.md files, your onboarding docs, your custom slash commands — these are all attempts to push out-of-distribution knowledge into the agent's working context. The better you are at this, the more effective your AI-augmented team becomes. And when you're evaluating whether to build custom tooling vs. using something standard, "will agents already know how to use it?" is now a legitimate engineering criterion.

## Reverse Centaur

A centaur is a human assisted by a machine — the human is in command, the machine carries the load. A [reverse centaur](https://pluralistic.net/2025/12/05/pop-that-bubble/) flips it: the human becomes the appendage to the automated system. Cory Doctorow's phrase is "a machine head on a human body" — a person serving as the "squishy meat appendage for an uncaring machine," driven at superhuman pace under constant surveillance. His examples sting because they're already here: the Amazon delivery driver watched by in-cab AI cameras, a peripheral for a van that can't yet drive itself; the writer kept on as the [accountability sink](https://locusmag.com/feature/commentary-cory-doctorow-reverse-centaurs/) — the "human in the loop" who exists to take the blame when the machine gets it wrong.

My take: this is the failure mode my whole AI-native approach is built to dodge. [Human-on-the-loop done right](#human-in-on-and-out-of-the-loop) keeps you in command — supervising the system, intervening when it drifts. Rubber-stamping fifty AI PRs a day is the reverse-centaur version of the same job: the overhead of in-the-loop with none of the judgment, a meat appendage approving a machine's output. The [AI Cockpit](#ai-cockpit) and [Agency](#agency) are the centaur — you set the direction, the AI does the work, and you stay the one who decides. The whole point is to ride the horse, not become it.

## Year of Wonder

{% include local_image_float_right.html src="raccoon-year-of-chaos-wonder.webp" %}

The optimist's read on the same AI moment that's exhausting everyone: this is the most creative period in the history of software. Things get built in a week that used to take a quarter, juniors punch above their weight class, and problems shelved years ago for lack of bandwidth are suddenly tractable. Its twin is the [Year of Chaos](/ai-native-manager#the-year-of-chaos-the-year-of-wonder) — the pessimist's read, which is just as accurate: roles are dissolving, skills are devaluing, and most of the weekly hype is garbage.

My take: you don't get to pick the facts, you get to pick which ones you orient around. Both frames are true at once, so the choice isn't about being right — the chaos read is right, the same way [Deep Blue](#deep-blue) is a real feeling and not a delusion. The choice is about which read points somewhere good. Orient around the chaos and you play defense — tighten process, slow down, protect what exists. Orient around the wonder, while staying honest about the chaos, and you play offense — experiment more, raise the ambition, ask what's possible now that wasn't last year. The people who hold both and lean toward wonder are the ones others follow into the unknown.

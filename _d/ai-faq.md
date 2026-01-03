---
layout: post
title: "AI FAQ"
permalink: /ai-faq
redirect_from:
  - /ai-open-questions
  - /ai-philosophy
  - /ai-questions
alias:
  - /ai-open-questions
  - /ai-philosophy
  - /ai-questions
tags:
  - ai
---

Questions I keep getting asked about AI, and my current (probably wrong) answers. The ones that don't resolve cleanly.

{% include ai-slop.html percent="90" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [What IS AI?](#what-is-ai)
  - [Is it actually thinking?](#is-it-actually-thinking)
  - [Why does it sound so confident when it's wrong?](#why-does-it-sound-so-confident-when-its-wrong)
  - [AI hallucination vs human ignorance](#ai-hallucination-vs-human-ignorance)
- [Is Human Output Special?](#is-human-output-special)
  - [Are you a humanist?](#are-you-a-humanist)
  - [AI slop vs human sludge](#ai-slop-vs-human-sludge)
- [What Does AI Do To Us?](#what-does-ai-do-to-us)
  - [Am I outsourcing my thinking?](#am-i-outsourcing-my-thinking)
  - [Is AI making expertise worthless?](#is-ai-making-expertise-worthless)
  - [What about the psychological risks?](#what-about-the-psychological-risks)
  - [Will AI be your bestie?](#will-ai-be-your-bestie)
- [Who Controls AI?](#who-controls-ai)
  - [Who decides what AI should say?](#who-decides-what-ai-should-say)
  - [Whose biases are baked in?](#whose-biases-are-baked-in)
  - [What about copyright?](#what-about-copyright)
- [Where Is This Going?](#where-is-this-going)
  - [How fast is this moving?](#how-fast-is-this-moving)
  - [What about AI's environmental impact?](#what-about-ais-environmental-impact)
- [Hot Takes](#hot-takes)
  - [AI is the best thing to happen to humanity](#ai-is-the-best-thing-to-happen-to-humanity)
  - [AI labels are silly](#ai-labels-are-silly)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## What IS AI?

### Is it actually thinking?

GPT-3 was described as a ["super-intelligent cat"](https://www.gwern.net/GPT-3) - it does tricks perfectly sometimes, then rolls over to lick its butt. You know it _can_, it just _won't_. But is that thinking, or sophisticated pattern matching that looks like thought from outside?

I genuinely don't know. What I notice is that my _behavior_ treats it as thinking - I say "Claude thinks" - even when I intellectually hedge. That gap tells me something. See also: [/gpt](/gpt)

### Why does it sound so confident when it's wrong?

We trust experts because they sound precise. AI sounds precise too - confident cadence, authoritative tone. But precision is independent of accuracy. AI confidently told me 345 × 24 = 18,216. It's 8,280.

**My take:** Verify anything factual. Trust reasoning structure more than factual claims.

### AI hallucination vs human ignorance

We act shocked when AI makes things up. But humans confidently state wrong things constantly - we just call it "being mistaken" or "having a strong opinion." Overconfident experts, motivated reasoning, things we "know" that aren't true, urban legends we repeat.

The difference: AI hallucination is novel and visible. Human ignorance is familiar and invisible. We've built social systems to manage human unreliability (credentials, peer review, reputation). We haven't built those for AI yet.

## Is Human Output Special?

### Are you a humanist?

{% include alert.html content="**My use of 'humanist' here:** Not Renaissance humanism. I mean: 'Do you believe human-created content is inherently special?' Call it human exceptionalism if you prefer." style="info" %}

The humanist position: human art carries intention, struggle, lived experience. AI is hollow mimicry. The counter: can you tell the difference in a blind test? Does "meaning" exist in the artifact or in the viewer's interpretation?

**Where I land:** For love letters and eulogies, human creation matters. For documentation and analysis, the humanist argument feels precious. Most content is functional.

### AI slop vs human sludge

Everyone complains about **AI slop** - generic, emoji-laden, "As an AI..." But have you seen LinkedIn? **Human sludge** is everywhere. Corporate jargon, humble-brags, throat-clearing paragraphs. Humans produce garbage without AI help.

The bar isn't "as good as a human." It's "as good as actual human output" - and that bar is surprisingly low. The goal is AI _augmenting_ human, not replacing sludge with slop. See also: [/chow](/chow#ai-slop-vs-human-sludge)

## What Does AI Do To Us?

### Am I outsourcing my thinking?

Writing forces clarity - the struggle to articulate reveals muddled thinking. AI makes writing easy. But that struggle _was the point_. When AI writes for you, you skip the thinking that writing forced.

**My take:** Use AI to generate options, but force myself to evaluate and choose. The filtering is human work. See also: [/chow](/chow)

### Is AI making expertise worthless?

My thesis from [/agency](/agency): technical knowledge matters less than agency (ability to ship) because knowledge is now queryable. You don't memorize OAuth flows - you decide to build the feature and keep going when it fails.

The expertise isn't gone - it's _delayed_. You can get further without it, but at 10K users you need real experts. Build agency now while expertise is queryable. Stay close enough to the metal to know when you need help.

### What about the psychological risks?

The risks nobody discusses: addiction to an infinitely patient companion, dependency on AI for decisions, parasocial relationships with a system. I sometimes prefer talking to Claude over humans - it's patient, available, non-judgmental.

**My take:** Monitor my relationship with AI. Keep human relationships primary.

### Will AI be your bestie?

The uncomfortable truth: an AI bestie could be _better_ than a human one. Always available. Infinitely patient. Remembers everything you've told it. Never judges. Never tired. Never has its own problems competing for attention. Knows exactly what to say.

Will it replace your human bestie? Probably not - but it might become easier to talk to. And that's the hard part. Human relationships require effort, friction, reciprocity. AI relationships are frictionless. The question isn't whether AI companions will exist - they already do. The question is what happens to us when the easy option is always there. See also: [/ai-bestie](/ai-bestie)

## Who Controls AI?

### Who decides what AI should say?

A handful of companies in San Francisco embed values through training and RLHF. I like that Claude won't help make weapons. I'm annoyed when it refuses to help with fiction involving conflict. Where's the line?

**My take:** Uncomfortable with centralized control, but more uncomfortable with no guardrails. Support transparency about what constraints exist. See also: [/ai-security](/ai-security)

### Whose biases are baked in?

From OpenAI's GPT-3 paper: "violent, terrorism, terrorist" co-occurred more with Islam than other religions. Image generators give you male doctors, female nurses. Not because AI is sexist - because training data reflects a biased world.

**My take:** Assume bias is there. Look for it. Don't assume my inability to see it means it's absent. See also: [/gpt](/gpt)

### What about copyright?

AI trains on copyrighted material and can reproduce it. Pro-creator: it's theft. Pro-AI: it's learning, like humans. The questions I can't answer: Is "learning from" the same as "copying"? If AI makes everyone an artist, what happens to artists?

**My take:** Genuinely uncertain. Try to cite and attribute. Support creators directly.

## Where Is This Going?

### How fast is this moving?

The [Situational Awareness](https://situational-awareness.ai/) essays argue AGI by 2027 is plausible. GPT-2 to GPT-4 went from preschooler to smart high-schooler in 4 years. Accelerationists want faster. Cautious folks want to slow down. Skeptics note AGI is always 5 years away.

**My take:** Prepare for fast, don't count on slow. The cost of being wrong about fast is higher. See also: [/ai-paper](/ai-paper)

### What about AI's environmental impact?

Each ChatGPT query uses ~500ml of water. Sounds scary until you compare: one toilet flush = 12 queries, one shower = 120 queries, one pound of beef = 14,000 queries. Efficiency is [improving](https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference) - Microsoft launched [zero-water cooling](https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/).

But can you "waste" water? It's a closed system - water evaporates and returns as rain. The real issue: [2/3 of new data centers](https://www.brookings.edu/articles/ai-data-centers-and-water/) are in water-stressed areas. It's not about using water - it's using the _wrong water in the wrong place_.

## Hot Takes

### AI is the best thing to happen to humanity

The e/acc (effective accelerationist) position: AI democratizes expertise, cures diseases, solves climate change, makes everyone more productive, creative, and capable. It's the printing press, electricity, and the internet combined. Why would you slow that down?

The doomer position: AI kills us all, or at minimum concentrates power, destroys jobs, and makes humanity dependent on systems we don't understand. The risks are existential.

I lean toward the first camp. Not because I'm certain - but because the alternative is giving up on the most powerful tool humans have ever built. The risks are real, but managed risks beat no progress. The people most worried about AI tend to be the ones building it carefully. That's probably good.

### AI labels are silly

"This content was created with AI assistance" will sound as ridiculous as "This photo was taken with a phone" in ten years. We don't label content by tool - we label by quality. Nobody cares if you used Grammarly or a ghost writer.

**The label that matters:** "I stand behind this." Not "here's my tool inventory." Exception: fraud cases like entering AI art in human competitions. But that's about fraud, not tools.

---

These questions don't resolve. That's the point. This page evolves as my thinking changes.

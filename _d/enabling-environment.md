---
layout: post
title: "Enabling Environment"
permalink: /enable
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-enable.webp
redirect_from:
  - /enabling-environment
---

Imagine the place you do your best work. Andy Matuschak defined this, and as someone who aspires to effectiveness, I fell in love with the concept. As a techie who loves efficiency, I also set about building my own. From Andy: An enabling environment significantly expands its participants’ capacity to do things they find meaningful and important. This blog is the consumption environment for mine. When we talk about an AI enabling environment the key is not to figure out how you can prompt the AI, but how the AI can prompt you.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [From Andy](#from-andy)
- [Igor's Computing Setup](#igors-computing-setup)
- [Igor's Physical Setup](#igors-physical-setup)
- [By Task](#by-task)
  - [Production](#production)
  - [Consumption](#consumption)
  - [Reflection](#reflection)
  - [Discovery](#discovery)
  - [Recall](#recall)
- [The rider, the elephant, and the path](#the-rider-the-elephant-and-the-path)
  - [Inspire and Motivate](#inspire-and-motivate)
- [By Scope](#by-scope)
  - [Individual Artifacts](#individual-artifacts)
  - [Entire corpus](#entire-corpus)
  - [Comparing Artifacts or Corpus](#comparing-artifacts-or-corpus)
- [Visualizations](#visualizations)
  - [Word clouds](#word-clouds)
  - [Comic illustrations](#comic-illustrations)
  - [Dimension Reduced Vector Embeddings](#dimension-reduced-vector-embeddings)
  - [Connected Graphs](#connected-graphs)
- [AI Augmentation](#ai-augmentation)
  - [The Danger of AI](#the-danger-of-ai)
  - [Completing tasks vs getting smarter/stronger](#completing-tasks-vs-getting-smarterstronger)
  - [Critical Thinking](#critical-thinking)
  - [Other folks work here](#other-folks-work-here)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

There's so much to say here. Pulling in some content from Andy:
{%include blob_image_float_right.html src="blog/raccoon-enable.webp" %}

## From Andy

- [Enabling Environment](https://notes.andymatuschak.org/z492hGrHvRvJiEY9UfB4Mby)
- [Evergreen notes](https://notes.andymatuschak.org/z5E5QawiXCMbtNtupvxeoEX)
- [Andy's about page](https://notes.andymatuschak.org/About_these_notes)

## Igor's Computing Setup

- Igor's [about page](/about)
- Some of the [features](https://github.com/idvorkin/idvorkin.github.io) in the readme.
- Tons of [VIM/CLI stuff](https://github.com/idvorkin/settings)
- My general vim notes

{%include summarize-page.html src="/vim" %}

- Vim specifically for writing

{%include summarize-page.html src="/vim-for-writing" %}

At its core, is writing:

{% include summarize-page.html src="/writing" %}

## Igor's Physical Setup

- I think there are some coffee shop rituals that are part of mine.

## By Task

### Production

### Consumption

- Having custom made [podcasts](/podcasts) can be better than books.

### Reflection

### Discovery

### Recall

## The rider, the elephant, and the path

{% include summarize-page.html src="/switch" %}

You'd think this is about the rider, but the elephant is super important too

### Inspire and Motivate

Mood matters, and for some reason, illustrating my blog makes me thrilled. If I'm stuck having DALL-E illustrate my blog makes me thrilled!

Check out [illustrate.py](https://github.com/idvorkin/nlp/blob/3450286482c5e62c589e46521e1bfe2b5ad0082a/illustrate.py?plain=1#L24)

## By Scope

### Individual Artifacts

Check out [think.py](https://github.com/idvorkin/nlp/blob/3450286482c5e62c589e46521e1bfe2b5ad0082a/illustrate.py?plain=1#L24)

### Entire corpus

Check out this thing on embeddings. I think the story here needs to be embeddings + rag

- [Analyzing all of Hacker news](https://blog.wilsonl.in/hackerverse/)
  - [Thinks Analysis](https://gist.github.com/idvorkin/0d6263706d8ca5a102242ed50b3b6047)

### Comparing Artifacts or Corpus

## Visualizations

### Word clouds

Old school, but pretty simple, perhaps do a second pass through gpt to simplify

### Comic illustrations

### Dimension Reduced Vector Embeddings

### Connected Graphs

Ala - obsidians graph view

## AI Augmentation

What I'm most excited about is how to expand this with AI. My thinking program is my first cut.

Spell check and summary/eli5/TLDR are the obvious ones, but what if we extended to reflection questions, implicit assumptions, etc....

### The Danger of AI

The danger is of course you stop thinking. Learning requires active engagement with content, passive consumption, or even worse skimming makes things much worse. So it's very important that you think about how to have the AI prompt you to be active in your thinking, not passive in your consumption.

### Completing tasks vs getting smarter/stronger

There's an analogy to physical strength. You can have a robot lift something for you, which may not be what you're looking for. What you're often looking for is how to get stronger.

To get stronger, you need progressive overload, which has different models from physical health:

- Increasing weight or resistance
- Increasing repetitions
- Increasing frequency of training
- Decreasing rest periods between sets
- Changing exercise variations

Similarly, for cognitive tasks, you can progressively overload by:

- Increasing complexity of problems
- Tackling more abstract concepts
- Expanding the scope of your knowledge
- Reducing reliance on external aids
- Applying knowledge in novel contexts

The goal is to challenge yourself just beyond your current capabilities, promoting growth and adaptation.

### Critical Thinking

Running [Think](https://gist.github.com/idvorkin/ea35c3f08e696578bc104c8b2bba7981) over Andy's enabling environment page ...

Historical note - original run on the model took like [60s and was dumber](https://gist.github.com/idvorkin/25eadce2222a09d9dca620679afd59d6)

github.com/idvorkin/nlp/blob/main/think.py

<https://gist.github.com/idvorkin/25eadce2222a09d9dca620679afd59d6>

### Other folks work here

- A different version of think.py, from [danielmiessler](https://github.com/danielmiessler/fabric?tab=readme-ov-file#what-and-why) lots of much better prompts

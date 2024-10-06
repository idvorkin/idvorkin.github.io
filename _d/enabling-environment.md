---
layout: post
title: "Enabling Environment"
permalink: /enable
imagefeature: https://github.com/idvorkin/blob/raw/master/blog/raccoon-enable.webp
redirect_from:
  - /enabling-environment
---

Imagine the place you do your best work. Andy Matuschak defined this, and as someone who aspires to effectiveness, I fell in love with the concept. As a techie who loves efficiency, I also set about building my own. From Andy: An enabling environment significantly expands its participants’ capacity to do things they find meaningful and important. This blog is the consumption environment for mine.

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
    - [Comparing Artifcats or Corpus](#comparing-artifcats-or-corpus)
- [Visualizations](#visualizations)
    - [Word clouds](#word-clouds)
    - [Comic illustrations](#comic-illustrations)
    - [Dimension Reduced Vector Embeddings](#dimension-reduced-vector-embeddings)
    - [Connected Graphs](#connected-graphs)
- [AI Augmentation](#ai-augmentation)
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

### Comparing Artifcats or Corpus

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

### Critical Thinking

Running over Andy's enabling environment page ...

gist.github.com/idvorkin/25eadce2222a09d9dca620679afd59d6

github.com/idvorkin/nlp/blob/main/think.py

<https://gist.github.com/idvorkin/25eadce2222a09d9dca620679afd59d6>

### Other folks work here

- A different version of think.py, from [danielmiessler](https://github.com/danielmiessler/fabric?tab=readme-ov-file#what-and-why) lots of much better prompts

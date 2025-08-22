---
layout: post
title: "Podcasting"
permalink: /podcast
redirect_from:
  - /podcasting
  - /podcasts
---

To my amazement, I listen to podcasts. I think they're pretty interesting, here are my notes on them.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Theory/Random Thoughts](#theoryrandom-thoughts)
  - [Why is engagement/retention better with podcasts](#why-is-engagementretention-better-with-podcasts)
  - [What is good about podcasts.](#what-is-good-about-podcasts)
  - [How did I end up listening to podcasts](#how-did-i-end-up-listening-to-podcasts)
  - [Why we podcast From Kris Jenkins:](#why-we-podcast-from-kris-jenkins)
  - [Links to Digest](#links-to-digest)
  - [Podcasts I listen to.](#podcasts-i-listen-to)
- [Tech](#tech)
  - [Tech Podcasts I listen to.](#tech-podcasts-i-listen-to)
  - [AI Generated Podcasts - Google's NotebookLLM](#ai-generated-podcasts---googles-notebookllm)
  - [Podcast as GPT Output](#podcast-as-gpt-output)
  - [My own podcast generator](#my-own-podcast-generator)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Theory/Random Thoughts

### Why is engagement/retention better with podcasts

### What is good about podcasts.

- Probably not podcasts, but interviews.
- I suspect it engages some empathy as if you want to eavesdrop on a conversation.
- You also build rapport with the hosts - who has a personality you bond with.

### How did I end up listening to podcasts

### Why we podcast From Kris Jenkins:

- hjblog.jenkster.com/2023/04/why-we-podcast.html
- Thinking [post on it](https://gist.github.com/idvorkin/db95e0785cf700974ef3248888d83abe)

### Links to Digest

### Podcasts I listen to.

## Tech

### Tech Podcasts I listen to.

- Kris Jenkins
- Sharp Tech

### AI Generated Podcasts - Google's NotebookLLM

Google made [NotebookLM](https://notebooklm.google.com/) as a sleeper hit. Basically auto create podcasts as a part of a random project - and everyone loves it!

- Get tech depth from Simon: https://simonwillison.net/tags/notebooklm/
- There is magic in how the hosts do the non-human banter. I lost the word for what this is.

w00t - you can call the model [yourself now](https://github.com/idvorkin/nlp/blob/a756b866b0cc1b6fdd24d2eb50cef9f46c749ed6/tts.py?plain=1#L169)

### Podcast as GPT Output

That's what I think is ultimately so compelling about the 2-person podcast format as a UIUX exploration. It lifts two major "barriers to enjoyment" of LLMs. 1 Chat is hard. You don't know what to say or ask. In the 2-person podcast format, the question asking is also delegated to an AI so you get a lot more chill experience instead of being a synchronous constraint in the generating process. 2 Reading is hard and it's much easier to just lean back and listen.

### My own podcast generator

2 parts:

1. Generate the podcast script from source material - I seem to have lost where I did this.
2. Convert to [audio using ElevenLabs](https://github.com/idvorkin/nlp/blob/777c10e0b525951916e13b7a2d3bd3fe151dbb92/tts.py?plain=1#L117)

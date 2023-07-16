---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal
---

Woah, there's so much stuff to explore in AI. I'm going to keep a journal of stuff I'm looking at.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Visualization](#visualization)
    - [Weights and Balances](#weights-and-balances)
- [Diary](#diary)
    - [2023-07-16](#2023-07-16)
    - [2023-07-04](#2023-07-04)
    - [Related posts](#related-posts)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Visualization

### Weights and Balances

## Diary

### 2023-07-16

- Doing Q&A for my blog w/ChromaDB and LandChain
  - Bleh, Langchain is hard to grok, changing on the daily

### 2023-07-04

- Weight and Biases LangChain Traces
  - See each call to the model

```zsh
LANGCHAIN_WANDBB_TRACING=true
LANGCHAIN_WANDB_TRACING=playing-around
```

- Consider a better git commit message generator... Including nested calls. Checkout

<https://github.com/zurawiki/gptcommit/blob/main/prompts/summarize_file_diff.tera>

- Using AI chat in co-pilot on nightlysf

Use meta -I (e.g. Alt-I) e.g. AI :)

### Related posts

{%include summarize-page.html src="/ai-talk" %}
{%include summarize-page.html src="/ai-art" %}
{%include summarize-page.html src="/gpt" %}

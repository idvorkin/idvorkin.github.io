---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal/
---

A journal of random explorations in AI. Keeping track of htem so I don't get super lost


<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Visualization](#visualization)
    - [Weights and Balances](#weights-and-balances)
- [Diary](#diary)
    - [2023-11-26](#2023-11-26)
    - [2023-08-17](#2023-08-17)
    - [2023-07-16](#2023-07-16)
    - [2023-07-15](#2023-07-15)
    - [2023-07-04](#2023-07-04)
    - [Related posts](#related-posts)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Visualization

### Weights and Balances

## Diary

### 2023-11-26

- Foun content on red teaming
- Found out new models like Orca and they are pretty darn fast on GPT4all
- Updated my code to use the latest OpenAI models
- Updated my code to use langchain
- Fixed up journal to have stuff again


### 2023-08-17

- Playing with Autnomous Agents
    - AutoGPT
    - GPTResearcher
    - Both of these run through docker-compose. Kind of nice as 1/ runtime sandbox, 2/ environment mess up avoidance
- Playing with new LangChain Syntax
- Figuring out that I can use debugger to attach so I can debug easily. Figured out how to hook all typer commands (wish I knew that earlier)



### 2023-07-16

- Doing Q&A for my blog w/ChromaDB and LandChain
  - Bleh, Langchain is hard to grok, changing on the daily
  - <https://github.com/idvorkin/idvorkin.github.io/blob/master/scripts/qa_blog.py?plain=1#L99>

### 2023-07-15

- Had very clever idea to 1/ make my convo files markdown, giving me completion from CoPilot
- Having GPT prompt default answer in [markdown with line seperators](https://github.com/idvorkin/nlp/blob/ed56c29719a8a8f53ffd10513ec96d3895a25076/convos/default.convo?plain=1#L1) so that it was clear the answers from the bot
- e.g. <https://gist.github.com/idvorkin/98cfaa4bea8e4f9cc113ff978612518e>

### 2023-07-04

- Weight and Biases LangChain Traces
  - <https://docs.wandb.ai/guides/prompts/quickstart>
  - See each call to the model

```zsh
export LANGCHAIN_WANDBB_TRACING=true
export LANGCHAIN_WANDB_TRACING=playing-around
```

- Consider a better git commit message generator... Including nested calls. Checkout

<https://github.com/zurawiki/gptcommit/blob/main/prompts/summarize_file_diff.tera>

- Using AI chat in co-pilot on nightlysf

Use meta -I (e.g. Alt-I) e.g. AI :)

### Related posts

{%include summarize-page.html src="/ai-talk" %}
{%include summarize-page.html src="/ai-art" %}
{%include summarize-page.html src="/gpt" %}

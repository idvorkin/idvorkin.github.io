---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal/
---

A journal of random explorations in AI. Keeping track of htem so I don't get super lost

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Visualization](#visualization)
- [Text to speech our friends.](#text-to-speech-our-friends)
- [RAG a pychiatrist](#rag-a-pychiatrist)
- [Bestie Simulator](#bestie-simulator)
    - [Attempt #1: Prompt GPT to simulate with lots of example text](#attempt-1-prompt-gpt-to-simulate-with-lots-of-example-text)
    - [Attempt #2: Use that data to do the training](#attempt-2-use-that-data-to-do-the-training)
    - [Models:](#models)
        - [Bestie-1d-raw-2020+](#bestie-1d-raw-2020)
        - [Bestie-7d-raw-2020+](#bestie-7d-raw-2020)
        - [Bestie-7d-raw-2020-sampled +](#bestie-7d-raw-2020-sampled-)
        - [Bestie-1d-raw-full](#bestie-1d-raw-full)
    - [Data Prep](#data-prep)
    - [Useful links](#useful-links)
    - [Observation](#observation)
    - [Tooling learnings](#tooling-learnings)
    - [Upstream fixes](#upstream-fixes)
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

## Text to speech our friends.

Well that was super easy, eleven labs has perfect instant voice clones, and what's coolest is you
can clone in multiple languages, so you can hear yourself talking in lots of languages. Let me give a sample

This took me about 30 minutes to setup - crazy!!

[The code](https://github.com/idvorkin/nlp/blob/38193de32fff308ee292fa368799d804343b6336/tts.py?plain=1#L50)

## RAG a pychiatrist

OK, I used to go to this pychaitratist, who had a full "consistent model" of pychiatraty

[here](https://whatilearnedsofar.com/practice/)

lets see if we can simulate him, step #1, lets bring the site down into markdown

1. Lets use https://github.com/paulpierre/markdown-crawler:
2. pip install markdown-crawler
   markdown-crawler https://whatilearnedsofar.com/practice/ --output-dir ./practice

## Bestie Simulator

Playing around with [a bestie simulator](https://python.langchain.com/docs/integrations/chat_loaders/facebook)

### Attempt #1: Prompt GPT to simulate with lots of example text

Prompts didn't work that well. Still sounded like GPT

### Attempt #2: Use that data to do the training

- Style transfer success! But then answer were too concise.
  - TBD -- add several examples
- Next use a prompt to make the responses longer
  - TBD -- add several examples
- [Proof of concept](https://github.com/idvorkin/nlp/blob/2f7fce99e108adaaf343c11f9edc42d07c6aba3e/play_langchain.py#L449)
- Use fine tune tool https://platform.openai.com/finetune
- Split into training and validation
- Started getting moderation errors when I went to weekly batches.
  - Tried removing image unicode, and went to 1/10 the size, and that worked
  - Trying again at full size, see if that works
  -

### Models:

#### Bestie-1d-raw-2020+

- ftjob-qyOyRWqpuakIhQdulCSi60Ui
- I'm guessing performance gets weird on facts as they change over 5 year blocks

#### Bestie-7d-raw-2020+

- Having a hard time getting tnis to pass validation

#### Bestie-7d-raw-2020-sampled +

- ftjob-5V0Pkd9YtiAp4FsnPctJ29F1
- Having a hard time getting tnis to pass validation

#### Bestie-1d-raw-full

- No cleanups, just raw data
- ft:gpt-3.5-turbo-1106:idvorkinteam::8YgPRpMB
- Didn't have a validation set, so not sure what that did

### Data Prep

- EASY: Merge consequetive lines by same person within 5 minutes.
- HARD: Decide when you have a request/response, vs not

### Useful links

- [Fine-tuning in general](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates)
- [OpenAI Code Sample](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_finetune_chat_models.ipynb)

### Observation

- For hard data tasks, I can use GPT to do the work, e.g. like how to split up into distinct converationsj
- Can finetune on daily or weekly. Daily sounds good, but a few problems:
  - Conversations that span end of day break
  - You have overhead for every training sample. From daily to weekly I went from 10M to 4M
  - Need to pay attention to stay under token limit
- ufffc is what apple sends for an image
- A tuning run is 50$
- I suspect the conversation gets weird if theirs too much history, as people change. Not knowing when something happens (a decay) on the training data is important. So can address by limiting to latest history

### Tooling learnings

- Pre-commit - Nicer version of husky (which was always kind of flacky)
- Ruff - Nicer version of black. Written in black, so much faster, and also suports fixing some simple stuff, has nvim support
- Path from pathlib. Lets you use Path.home() vs os.expanduser(), and a type safe path paramater, avoiding sending in strings by accident (God Bless Typing)

### Upstream fixes

- Pushed multiple PRs to better support iMessage chat format in Langchain [1](https://github.com/langchain-ai/langchain/pull/14804) [2](https://github.com/langchain-ai/langchain/pull/14818)

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

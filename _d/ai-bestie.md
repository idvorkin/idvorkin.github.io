---
layout: post
title: "Igor's AI Bestie Simulator"
permalink: /ai-bestie
---

My best friend and I communicate over chat lots (33,60,101 messages/day P50, P75, P95). I have years of chat history, and so this seemed like a super fun way to get deeper into ML. This is created and shared with his permission.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Simulation](#simulation)
    - [Attempt #1: Prompt GPT to simulate with lots of example text](#attempt-1-prompt-gpt-to-simulate-with-lots-of-example-text)
    - [Attempt #2: Use that data to do the training](#attempt-2-use-that-data-to-do-the-training)
    - [Style vs Substance](#style-vs-substance)
    - [Models](#models)
    - [Data Prep](#data-prep)
    - [Useful links](#useful-links)
    - [Observation](#observation)
- [Embodiement](#embodiement)
    - [Voice of our friends](#voice-of-our-friends)
    - [Video of our friends](#video-of-our-friends)
- [Appendix](#appendix)
    - [Tooling learnings](#tooling-learnings)
    - [Upstream fixes](#upstream-fixes)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Simulation

Playing around with [a bestie simulator](https://python.langchain.com/docs/integrations/chat_loaders/facebook)

### Attempt #1: Prompt GPT to simulate with lots of example text

Prompts didn't work that well. Still sounded like GPT

### Attempt #2: Use that data to do the training

- Style transfer success! But then answer were too concise.
  - TBD -- add several examples
- Next use a prompt to make the responses longer
  - TBD -- add several examples
- [Proof of concept](https://github.com/idvorkin/nlp/blob/2f7fce99e108adaaf343c11f9edc42d07c6aba3e/play_langchain.py#L449)
- Use fine tune tool <https://platform.openai.com/finetune>
- Split into training and validation
- Started getting moderation errors when I went to weekly batches.
  - Tried removing image unicode, and went to 1/10 the size, and that worked
  - Trying again at full size, see if that works
  -

### Style vs Substance

Fine tuning makes it sound like my bestie, but a few observations:

1. It's very bad at telling me about itself/it's day
2. It's pretty good at giving me advice.

I think part of the problem with 1, as fine tuning doesn't have a sense of "context", or a sense of "utlity". I think In eed to inject those in. So example context:

- Current Global Events
  - _Interestingly, this is pretty shallow stuff, so don't think it helps, beyond getting the interesting, brr it's cold out_
  - Location
  - Date
  - Weather
- Current Utility for bestie
  - This is probably good, but mayve not as the key is reflection
- What bestie knows I wnt to accomplish and care about
  - Being explicit here is probably good
  - Having bestie know my goals, and my things i get caught up in.

### Models

- Bestie-1d-raw-2020+

- ftjob-qyOyRWqpuakIhQdulCSi60Ui
- I'm guessing performance gets weird on facts as they change over 5 year blocks

- Bestie-7d-raw-2020+

- Having a hard time getting tnis to pass validation

- Bestie-7d-raw-2020-sampled +

- ftjob-5V0Pkd9YtiAp4FsnPctJ29F1
- Having a hard time getting tnis to pass validation

- Bestie-1d-raw-full

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
- A tuning run is 50\$
- I suspect the conversation gets weird if theirs too much history, as people change. Not knowing when something happens (a decay) on the training data is important. So can address by limiting to latest history

## Embodiement

### Voice of our friends

Well that was super easy, eleven labs has perfect instant voice clones, and what's coolest is you
can clone in multiple languages, so you can hear yourself talking in lots of languages. Let me give a sample

This took me about 30 minutes to setup - crazy!!

[The code](https://github.com/idvorkin/nlp/blob/38193de32fff308ee292fa368799d804343b6336/tts.py?plain=1#L50)

### Video of our friends

Haven't looked at this yet, but for sure it's coming. You can probably make life easier by startign with still images and avatars.

## Appendix

### Tooling learnings

- Pre-commit - Nicer version of husky (which was always kind of flacky)
- Ruff - Nicer version of black. Written in black, so much faster, and also suports fixing some simple stuff, has nvim support
- Path from pathlib. Lets you use Path.home() vs os.expanduser(), and a type safe path paramater, avoiding sending in strings by accident (God Bless Typing)

### Upstream fixes

- Pushed multiple PRs to better support iMessage chat format in Langchain [1](https://github.com/langchain-ai/langchain/pull/14804) [2](https://github.com/langchain-ai/langchain/pull/14818)

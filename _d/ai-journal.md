---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal/
---

A journal of random explorations in AI. Keeping track of them so I don't get super lost

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Visualization](#visualization)
- [Blog to bot](#blog-to-bot)
- [Text to speech our friends](#text-to-speech-our-friends)
- [RAG a psychiatrist](#rag-a-psychiatrist)
- [Diary](#diary)
    - [2024-02-03](#2024-02-03)
    - [2024-01-27](#2024-01-27)
    - [2023-11-26](#2023-11-26)
    - [2023-08-17](#2023-08-17)
    - [2023-07-16](#2023-07-16)
    - [2023-07-15](#2023-07-15)
    - [2023-07-04](#2023-07-04)
    - [Related posts](#related-posts)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Visualization

## Blog to bot

Join the [discord here](https://discord.gg/S2s24P6JtU), and then just '/ask'. See the source [on github](https://github.com/idvorkin/nlp/blob/d9f24b7aa5a046f78147c2e53144a9258c91894f/qa_blog.py?plain=1#L393)
Standard workflow,
chunk blog -> Embeddig(chunk) -> vector DB <- Retrieve <- Project Inject <- Rago
this begs the Q what to chuk, and how to chunk it

Useful features:

- ☐ Do an offline evaluation model for various retrieval approaches.
- ☑ Give the answer
- ☑ Link back to specific pages
- Link back to the specific anchors
- TBD Ask follow up questiosn

Open Questions

- Does back link data help?
- Does a smarter retrieval strategy help?
- Play w/cRAG?

## Text to speech our friends

Well that was super easy, eleven labs has perfect instant voice clones, and what's coolest is you
can clone in multiple languages, so you can hear yourself talking in lots of languages. Let me give a sample

This took me about 30 minutes to setup - crazy!!

[The code](https://github.com/idvorkin/nlp/blob/38193de32fff308ee292fa368799d804343b6336/tts.py?plain=1#L50)

## RAG a psychiatrist

OK, I used to go to this psychiatrist, who had a full "consistent model" of psychiatry

[here](https://whatilearnedsofar.com/practice/)

lets see if we can simulate him, step #1, lets bring the site down into markdown

1. Lets use <https://github.com/paulpierre/markdown-crawler>:
2. pip install markdown-crawler
   markdown-crawler <https://whatilearnedsofar.com/practice/> --output-dir ./practice

## Diary

### 2024-02-03

- TL;DR: While upgrading my improv coach bot, it refused to do any coaching. I had to spend 1.5 hours adjusting the prompt till it worked.
  - When you look at the [diff](https://github.com/idvorkin/nlp/commit/6eca0560202696f93f954f3b46d8350d66e3a247) it looks obvious, but this stuff is alchemy groan.
- I built an improv bot way back before openai supported function calls.
- Of course, all the APIs broke in the last 6 months, so I decided to upgrade it
- Worked pretty well, about 2 hours to figure out the new spellings of things,
- But then the model kept refusing to extend my improv story. I wasted a full hour trying to figure out how to change the prompt.
  - Pretty surprisng given this was GPT-4

### 2024-01-27

- OpenAI released new embedding models
- Restarted playing with using [RAG on my blog](https://github.com/idvorkin/idvorkin.github.io/blob/7e7617f6bb563e4428e4f8595709f54229d9750e/scripts/qa_blog.py?plain=1#L82)
  - Works better than before, maybe since GPT-4 is faster, and I'm using it by default now
- Biggest challenge is how to do the document chunking. Playing around with keeping global context on chunks (hard)
- Also building [latent space search for my journal entries](https://github.com/idvorkin/nlp/blob/7d5cfc124cea08c5343f32140ff78fc667a36431/life.py?plain=1#L386)
  - Interesting observation here, the embedding vector is bigger than the source
  - 750 words = 750\* 8 letters/chars per word = 6K bytes
  - Embedding = 3K \* 4 bytes = 12K
- I used to worry about the embedding model endpoint being leaked for my journal entries, but I think I'm now assuming OpenAI is trustworthy.
- In theory I can search my journal corpus through 3 approaches (which I'll blend):
  - Lexical -> regexp search
  - Semantic -> vector similarity
  - Structured -> LLM to create structure (maybe do semantic over that)

### 2023-11-26

- Found content on red teaming
- Found out new models like Orca and they are pretty darn fast on GPT4all
- Updated my code to use the latest OpenAI models
- Updated my code to use langchain
- Fixed up journal to have stuff again

### 2023-08-17

- Playing with Autonomous Agents
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

- Had a very clever idea to 1/ make my convo files markdown, giving me completion from CoPilot
- Having GPT prompt default answer in [markdown with line separators](https://github.com/idvorkin/nlp/blob/ed56c29719a8a8f53ffd10513ec96d3895a25076/convos/default.convo?plain=1#L1) so that it was clear the answers from the bot
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

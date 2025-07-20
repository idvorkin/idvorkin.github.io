---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal
---

A journal of random explorations in AI. Keeping track of them so I don't get super lost

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Visualization](#visualization)
- [Blog to bot](#blog-to-bot)
  - [RAG Challenges](#rag-challenges)
- [Text to speech our friends](#text-to-speech-our-friends)
- [RAG a psychiatrist](#rag-a-psychiatrist)
- [What I wrote summary](#what-i-wrote-summary)
- [Diary](#diary)
  - [2025-07-20](#2025-07-20)
  - [2025-07-13](#2025-07-13)
  - [2024-10-27](#2024-10-27)
  - [2024-10-26](#2024-10-26)
  - [2024-10-20](#2024-10-20)
    - [Instead of watching a huberman, process with LLM](#instead-of-watching-a-huberman-process-with-llm)
  - [2024-08-26](#2024-08-26)
  - [Playing with Flux.1](#playing-with-flux1)
  - [2024-08-13](#2024-08-13)
    - [Aider take #12](#aider-take-12)
    - [Awesome talks](#awesome-talks)
    - [Working through making Neural Nets](#working-through-making-neural-nets)
  - [2024-07-31](#2024-07-31)
    - [Auto code editing (via Aider) - TOO Soon](#auto-code-editing-via-aider---too-soon)
  - [2024-07-30](#2024-07-30)
    - [Agenic Frameworks](#agenic-frameworks)
  - [2024-06-22](#2024-06-22)
    - [Next Gen Models](#next-gen-models)
    - [Lots of progression on Evals](#lots-of-progression-on-evals)
  - [2024-04-06](#2024-04-06)
  - [2024-03-24](#2024-03-24)
  - [2024-02-03](#2024-02-03)
  - [2024-01-27](#2024-01-27)
  - [2023-11-26](#2023-11-26)
  - [2023-08-17](#2023-08-17)
  - [2023-07-16](#2023-07-16)
  - [2023-07-15](#2023-07-15)
  - [2023-07-04](#2023-07-04)
  - [Related posts](#related-posts)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Visualization

## Blog to bot

Join the [discord here](https://discord.gg/S2s24P6JtU), and then just '/ask'. See the source [on github](https://github.com/idvorkin/nlp/blob/d9f24b7aa5a046f78147c2e53144a9258c91894f/qa_blog.py?plain=1#L393)
Standard workflow,
chunk blog -> Embedding(chunk) -> vector DB <- Retrieve <- Project Inject <- Rago
this begs the Q what to chuck, and how to chunk it

Useful features:

- ☐ Do an offline evaluation model for various retrieval approaches.
- ☑ Give the answer
- ☑ Link back to specific pages
- Link back to the specific anchors
- TBD Ask follow up questions

Open Questions

- Does back link data help?
- Does a smarter retrieval strategy help?
- Play w/cRAG?

### RAG Challenges

- Some words don't map, so terzepatide doesn't pick up my terzeptatide blog post. Diet doesn't match terzepatide
- Chunk size vs relevance
- My time off posts keep getting picked up since their template has good stuff, but content is light

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

## What I wrote summary

- I tend to write a fair bit over a time span, and forget what I did. I used a simple [git log stat creator](https://github.com/idvorkin/settings/blob/7c747bf7061a2da774faedd6efe14fdff547e92d/shared/zsh_include.sh?plain=1#L133) to see it, but it was too simple
- Turns, out LLMs are a great way to do this. So I wrote an [app for it](https://github.com/idvorkin/nlp/blob/303d7c58265b647dead79ccdbaeafd0cab58d1a0/changes.py?plain=1#L211). It does [great summaries](https://gist.github.com/idvorkin/7f457ef75330f5faee8c9a82a3d0d820). Inlining changes to this app as follows:

  - [changes.py](https://github.com/idvorkin/nlp/blob/303d7c58265b647dead79ccdbaeafd0cab58d1a0/changes.py)
  - Creation of a new Python script to handle Git diffs and summarize changes using OpenAI.
  - Major functionalities include:
    - Asynchronous retrieval of file diffs from Git using specified commit ranges.
    - Summarization of changes in files between two commits.
    - Filtering out specific files (e.g., Jupyter notebooks and back-links.json).
    - Environment setup for OpenAI API key from a secrets file.
    - Generation of prompts for OpenAI to summarize and rank changes based on impact.
    - Command-line interface implementation using Typer for user interaction.
  - Functions to interact with Git:
    - Retrieval of repository path from Git remote URL.
    - Fetching first and last commit hashes within a specified date range.
  - Obtaining a list of changed files between two commits.
  - Utilities for handling dates and generating summaries:
    - Function to calculate tomorrow's date.
    - Prompt generation for summarizing and reordering file changes.
  - Logging and debugging setup with Loguru and PuDB.

## Diary

### 2025-07-20

- Logs which created this entry: [link](https://github.com/idvorkin/idvorkin.github.io/blob/d5d20a8a0652ca22f72bd96deae328eaca44f0b4/zz-chop-logs/2025-07-20_20-53Z-document-today-s-project-updates.md)

- Read [Brute Squad](https://sourcegraph.com/blog/the-brute-squad) by Steve Yegge
  - **The REAL Car-Cleaning Evolution:**
    - Traditional coding = You personally licking your car clean (the old way)
    - The AI Hype/Promise = "You'll have a car wash!" (what everyone's selling)
    - Current Reality = Your "car wash" is actually just camels licking the car
      - Weird, messy, unpredictable
      - Sometimes they "delete your repo and send weenie pics to your grandma"
      - BUT still somehow faster than human spit
  - **Current Reality with Multiple Agents = You become "The Brute Squad" with 5-10 camels**
    - Now you're juggling multiple camel-bird-baby-whatevers
    - They're all squawking and hungry
    - You can't leave because they need constant supervision
    - But the collective licking power is undeniable
    - You're addicted to the chaos because it's SO productive
- Decided lots of agents need more horizontal space
- Added another monitor

![Dual monitor setup showing two large curved monitors on a desk with code/terminal windows open, against a bright green wall - the new monitor setup providing more horizontal space for AI agents](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_135228.webp)

- Got Claude Code
- Updated to $100/month subscription based on what bestie told me

![Text conversation showing discussion about Claude Code usage and subscription pricing, with messages about upgrading from $20/month to $100/month plan after recommendation about LLMs being important for productivity](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_135628.webp)

- Starting doing PRs - created 4 PRs today, 3 merged:
  - [nlp#11](https://github.com/idvorkin/nlp/pull/11) ✅ "feat: add Kimi AI provider support with --kimi flag (default enabled)"
  - [nlp#12](https://github.com/idvorkin/nlp/pull/12) 🔄 "feat: add comprehensive e2e tests for Kimi AI functionality" (open)
  - [settings#3](https://github.com/idvorkin/Settings/pull/3) ✅ "Add Claude Code detection to tmux_helper window renaming"
  - [chop-conventions#2](https://github.com/idvorkin/chop-conventions/pull/2) ✅ "docs(dev-inner-loop): add PR workflow documentation for AI-assisted development"
  - All generated with Claude Code 🤖

### 2025-07-13

Wow - it's been a LONG while before I added journal entries

- Yesterday my friend nerd swiped me with the optimum number of donuts to make problem:
- I one shotted it (well maybe 10 shot) with gemini coding cli (just like the other ones)
  ![](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250713_071230.webp)
- You can see output on: [Donut Profit Calculator App](https://abrupt-carpenter.surge.sh/)
- And Git Project: [GitHub Repository](https://github.com/idvorkin/donut-profit-calculator)

I also used gpt to illustrated and partially write the updates to this blog based on content from "What I learned so far".

{%include summarize-page.html src="/mental-pain"%}

- Image generation takes a while - but I love it. Agent based apps is super "human input time" effecient, but the wall time is annoying, it's easy to forget what you're trying to do context. I'm guessing we'll need toolls to help us do the "N-slow" tasks at once as it's easy to forget the damn goals

- Creating customGPTs from a bunch of content from my old pychiatrist
- Using chatgpt to figure out what I should/how I should pack crap in my car

- COOL LEARNING:
  - You can use surge to deploy to static web sites - nicer then clogging up my blog
  - gemini cli sandbox is mostly worthless

### 2024-10-27

- Use AI to help and [evaluate performance reviews](https://github.com/idvorkin/nlp/blob/55a2e50d2f02f7660dbbf101d12c7a1e3368e947/eval/eng-feedback/promptfooconfig.yaml?plain=1#L80)

### 2024-10-26

- Use Semantic Search for similar websites to what im [thinking about](https://github.com/idvorkin/nlp/blob/55a2e50d2f02f7660dbbf101d12c7a1e3368e947/think.py?plain=1#L296) e.g. thinks like [this page](https://gist.github.com/idvorkin/94fb8420a973e61ee5f1b61be926ecaf#---exaai-related-search-results---)
  ![Screen shot of related web results](https://raw.githubusercontent.com/idvorkin/ipaste/main/20241027_093056.webp)

### 2024-10-20

Instead of having to write the code myself, I can have aider upgrade my code to use the latest claude models:

[Aider code upgrade example](https://gist.github.com/idvorkin/2f30c4f7ca2c45ab8fa534ebaeedc1e5)

![Aider code upgrade example](https://private-user-images.githubusercontent.com/280981/379853492-dad3d891-15cd-4cae-b4c2-955696409002.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjk3ODcwNjIsIm5iZiI6MTcyOTc4Njc2MiwicGF0aCI6Ii8yODA5ODEvMzc5ODUzNDkyLWRhZDNkODkxLTE1Y2QtNGNhZS1iNGMyLTk1NTY5NjQwOTAwMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMDI0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTAyNFQxNjE5MjJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04YjBkYjA2NTVjOWJjNjcxYWNmMjIzYTI1Y2I2ZGI2YjM4NWI4NGM4YmQ2MjE2NzA3MjMzZWYzNDhjNDYxMWY0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.o2ZieBjjVVuYkP3vUgLPk8aEKT4LILmFyipVefHmUlU)

Which makes these links:

- [Commit 1](https://github.com/idvorkin/nlp/commit/e28a62cdc30f74d4344bc05229d6cc6debe610dd)
- [Commit 2](https://github.com/idvorkin/nlp/commit/5f8c1fdd145514210c701269643febc115b2de5c)

#### Instead of watching a huberman, process with LLM

- Finally the [output of exercises](https://gist.github.com/idvorkin/2e3111a07531fefb11e789144e1c372f)

* Pull down the transcript with yt-dlp

```bash
yt-dlp --write-auto-sub   --skip-download https://www.youtube.com/watch\?v\=kgr22uMsJ5o
```

- But it's too big, ~ 1M tokens thanks to the VTT format.
  - Good enough to stick into google gemini
  - GROAN, of course that doesn't work since output limit.
- Sigh, lets upgrade our captions processing - luckily, I've played with this before:
  - [Captions](https://github.com/idvorkin/nlp/blob/c050626b4f88ffb09622938d1bb5c55c2e05618a/captions.py?plain=1#L21)
  - What's great is I basically wrote this code using Aider.
- OK Lets run it:

```bash
cat ~/tmp/t/show.vtt | ./captions.py to-human | tee show.md
```

- Tada here it is on [gist](https://gist.github.com/idvorkin/1e8571c2f8f4de612a9671a301cfad5a)
- And it's small enough I can process it in fewer shots

```bash
❯ cat show.md | gpt tokens
25313
```

- Interesting, tryign to get the chatgpt website to read the file fails, even though it fits into the context window.
  - ChatGPT:
  - I could work around this by working with the API, but for chat I prefer using UX, and its cheaper with these big files
- Back to [google vertex](https://console.cloud.google.com/vertex-ai/studio/), which is working well at this file size
- Finally the [output of exercises](https://gist.github.com/idvorkin/2e3111a07531fefb11e789144e1c372f)

### 2024-08-26

### Playing with Flux.1

<https://replicate.com/ostris/flux-dev-lora-trainer/train>

[Model Merge](https://replicate.com/lucataco/flux-dev-multi-lora?prediction=ajkd29fje9rj40chjk58gztxy8)

Loras we can mege:

- idvorkin/idvorkin-flux-lora-1
- Merge Real and Boring - [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) - Keyword is photo

- We can also mege with just the name of the other Lora. [Me and Sue Johnanson](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=v7wyfv05c1rm20chjkrb7c9w9m)

The model I trained:

The [model](https://replicate.com/idvorkin/idvorkin-flux-lora-1) on [hugging face](/idvorkin/idvorkin-flux-lora-1) - idvorkin/idvorkin-flux-lora-1

![Igor doing something](https://replicate.delivery/yhqm/CRLshgbk5ZomNp7GxHSISkMrtynHNufLEZJpFHCa7lcGvXrJA/out-0.webp)

Prompt: _Hyperrealistic photograph of a bald, middle-aged man named Idvorkin, wearing single-colored yellow glasses. He has a slightly heavier build, standing at 5'8" and weighing around 175 lbs, with a sturdy, solid frame. Idvorkin is in the middle of performing a kettlebell swing with perfect form. He is holding a heavy kettlebell with both hands, swinging it up to chest height, with his muscles engaged and a look of concentration on his face. The background is a beach at sunrise, and the lighting is bright and focused, highlighting his effort. The mood is intense and determined. Idvorkin is dressed in athletic wear, including a fitted "cat in the hat Dr. Seuss" t-shirt and shorts. Shot with a normal 35mm camera lens, rendered in high resolution. Realistic skin texture, detailed muscle definition, and a dynamic, energetic atmosphere_

Image:

Models to try:

- [XKCD](https://replicate.com/pellmellism/xkcd?prediction=cgj9dyad6srm00chj5pbgjm4cw)

### 2024-08-13

#### Aider take #12

OK, so Aider tries to make every change its own commit, which is super noisy and error-prone, a few learnings:

1. Do the changes on a branch then squash up the final branch
2. You need to have unit tests, let Aider create them (I've got to figure out how to let it name them)

Here's [a change almost totally done with Aider](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

#### Awesome talks

OK, so turns out [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) Has amazing talks, I watched several, including his great talk on security. Which insipired me to create [AI Security](/ai-security)

#### Working through making Neural Nets

See: <https://karpathy.ai/zero-to-hero.html>

### 2024-07-31

#### Auto code editing (via Aider) - TOO Soon

OK, so, copilot tends to be just a code completion, which is pretty meh. Ideally it could do more complex changes, like find code that would be good to refactor then make those changes. [aider](https://aider.chat/) is supposed to that, but in my expereince, it just made stuff wrose and was slower then me making the cahnges myself. I guess I'll try again in a while.

### 2024-07-30

#### Agenic Frameworks

- Zep: Agent Memory
- Crew-AI - Agent Co-ordination
- Agent-Zero: Single Agent

### 2024-06-22

#### Next Gen Models

Claude 3.5 Sonnet just came out. Sonnet is Anthropics Medium model. It has the same performacne envelope as GPT-4o, making me assume GPT-4o is also the medium model. What's interesting, it initially OpenAI marketted GPT-4o as a 4x faster 2x cheaper GPT-4 Large model, but honeslty I think it' sjust the medium. That means either the medium Gpt 4.5 large is coming, or it's performance envelope isn't worth it.

Model classes: - Price/Latency/Performance

#### Lots of progression on Evals

Check out the great documentation at promptfoo, including redteaming I thgues sthat'll be a big thing soon. - <https://promptfoo.dev/docs/guides/llm-redteaming>

### 2024-04-06

- Containerize Bot

  - Secret Injection
  - Auto Starting

- Retrieval
  - Better Observability
  - Better Retrieval Strategies
  - Chunk Manager Book my chapters

### 2024-03-24

- Made a kettle [bell swings viewer](https://gist.github.com/idvorkin/c1e201ad1a1c90069fc51bf11fa37817#pre-commit-configyaml):
- Did a what I wrote in git summary (see section above)

### 2024-02-03

- TL;DR: While upgrading my improv coach bot, it refused to do any coaching. I had to spend 1.5 hours adjusting the prompt till it worked.
  - When you look at the [diff](https://github.com/idvorkin/nlp/commit/6eca0560202696f93f954f3b46d8350d66e3a247) it looks obvious, but this stuff is alchemy groan.
- I built an improv bot way back before openai supported function calls.
- Of course, all the APIs broke in the last 6 months, so I decided to upgrade it.
- Worked pretty well, about 2 hours to figure out the new spellings of things,
- But then the model kept refusing to extend my improv story. I wasted a full hour trying to figure out how to change the prompt.
  - Pretty surprising given this was GPT-4

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

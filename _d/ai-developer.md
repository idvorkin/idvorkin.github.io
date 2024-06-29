---
layout: post
title: AI Developer
permalink: /ai-developer
---

ML Engineer is a hot new job. It's the boys and girls who train and deploy models. I heard the word AI developer the other day, and I'll refer to it as AI application engineers. People who use AI to solve use cases. NOTE: This is not what most developers do today. What most developers do today is ask how can AI do the things I would have done (e.g. write the function).

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [AI Developer, vs a Software Engineer using AI](#ai-developer-vs-a-software-engineer-using-ai)
- [Programs, Human Code, AI.](#programs-human-code-ai)
- [Design Patterns](#design-patterns)
    - [Maximize the workflow and computation in your programs.](#maximize-the-workflow-and-computation-in-your-programs)
    - [Provide context to your model for Ground your model](#provide-context-to-your-model-for-ground-your-model)
    - [Use multiple AIs to maximize the value.](#use-multiple-ais-to-maximize-the-value)
    - [Human in the loop](#human-in-the-loop)
    - [World model vs context model](#world-model-vs-context-model)
    - [AI Maximalist (ChatGPT) vs AI enabled features (Apple Intelligence)](#ai-maximalist-chatgpt-vs-ai-enabled-features-apple-intelligence)
- [Use Cases and Applications](#use-cases-and-applications)
- [Tech Deep Dive - Models](#tech-deep-dive---models)
    - [Model and Service Dashboards](#model-and-service-dashboards)
    - [Quality vs Speed vs Prices](#quality-vs-speed-vs-prices)
    - [Llama 3](#llama-3)
    - [Tools + Libraries](#tools--libraries)
    - [Commercial vs Open Source Models](#commercial-vs-open-source-models)
- [Data Access](#data-access)
    - [Use LLMs for reasoning not for data retrieval](#use-llms-for-reasoning-not-for-data-retrieval)
- [External Posts:](#external-posts)
- [Several posts on this topic:](#several-posts-on-this-topic)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## AI Developer, vs a Software Engineer using AI

Today, most software engineers are thinking how do I use AI to be a better programmer.

An AI developer would instead do:

- Be the PM, nail the use case.
- Figure out how much of it AI can do.
- Close the gap.

## Programs, Human Code, AI.

At the hand-wavy, programs are workflow and computation, where computation is defined recursively.

In the before times, all workflow and computation was defined in explicit code and the code was written by humans.

The first stage/category of AI evolves from having the AI help write the code, to having the AI write highly specified code itself, to writing code from very vague specifications.

The next stage/category of AI is having AI do leaf computation. This evolved from very specialized (digit recognition), spell checking, to more general - generate an image.

The final stage/category of AI when AI does the higher level of workflow as well. Ask the user what they want, and do it.

Just like there are autonomous driving levels:

1. Human writes code
2. AI helps write code
3. AI writes code
4. AI writes code from vague specifications
5. AI does leaf computation
6. AI does higher level workflow
7. AI does everything

The AI developer thrives to get the AI to the highest level possible

## Design Patterns

### Maximize the workflow and computation in your programs.

1. Understand use case
2. Make crappy prompt
3. Use [meta prompt builder](https://docs.anthropic.com/claude/docs/helper-metaprompt-experimental) to help write better prompt
4. Put prompt in PromptFoo to evaluate and track over time
5. Figure out cheapest/fastest model to meet your needs
6. Figure out gaps AI is doing with current generation of AI
7. Gap fill

### Provide context to your model for Ground your model

Currently more complex, figuring it out.

### Use multiple AIs to maximize the value.

- Run same prompt through multiple AIs
- Show user multiple outputs
- Use AI to judge and merge
- Very helpful when you want the best thinking (e.g. commit messages).

### Human in the loop

- AI can still be wrong. Put a human in the loop

### World model vs context model

AI can perform a strict operation, vs undersatnding everything.

Obviously world models need to be much bigger, and data will go stale.

### AI Maximalist (ChatGPT) vs AI enabled features (Apple Intelligence)

Today ‘summarise this document’ is AI, and you need a cloud LLM that costs $20/month, but tomorrow the OS will do that for free. ‘AI is whatever doesn’t work yet.’

From [Ben Evans](https://www.ben-evans.com/benedictevans/2024/06/20/apple-intelligence):

The ‘AI Maximalist’ view is that general-purpose chatbots, with multimodal and ‘multi-agentic’ capabilities, will be able to take over broad classes of complex multi-stage tasks and problems that today need lots of different specially-written software, and will also be able to automate whole new class of complex tasks that could never be done in software before, again in one single general-purpose interface. The chatbot might replace all software with a prompt - ‘software is dead’. I’m skeptical about this, as I’ve written here, but Apple is proposing the opposite: that generative AI is a technology, not a product.

Apple is, I think, signalling a view that generative AI, and ChatGPT itself, is a commodity technology that is most useful when it is:

1. Embedded in a system that gives it broader context about the user (which might be search, social, a device OS, or a vertical application) and

1. Unbundled into individual features (ditto), which are inherently easier to run as small power-efficient models on small power-efficient devices on the edge (paid for by users, not your capex budget) - which is just as well, because…

1. This stuff will never work for the mass-market if we have marginal cost every time the user presses ‘OK’ and we need a fleet of new nuclear power-stations to run it all.

## Use Cases and Applications

- [Writing git commit messages](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/commit.py?plain=1#L19)
- [Spellchecking a file at a time](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/gpt3.py#L748)
- [Summarize changes in a repo over a period of time](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/commit.py#L19). E.g. [What I wrote some random week](https://gist.github.com/idvorkin/a701075a10d98dc41768765bc5b567ca)

## Tech Deep Dive - Models

### Model and Service Dashboards

- [Open AI Usage](https://platform.openai.com/usage)
- [Claude Usage](https://console.anthropic.com/settings/usage)
- Gemini Usage - Sheesh I can't even figure it out
- [VAPI](https://dashboard.vapi.ai/billing) - for voice access
- [Modal](https://modal.com/settings/idvorkin/usage) - For FaaS capability

### Quality vs Speed vs Prices

- See [performance dashboards](https://artificialanalysis.ai/models/gpt-4-turbo)
- Groq is really exciting because it's crazy fast. Like 200 Tokens/S. But it can only run open source models, so much less useful. Looks like it can run

### Llama 3

- Super exciting based on quality, and by being hosted on Groq making it super fast.

### Tools + Libraries

- Langchain
  - Gives you a unified API to use multiple models

### Commercial vs Open Source Models

## Data Access

### Use LLMs for reasoning not for data retrieval

Great line from Altman, we're currently using them for data retreival, but their super power is reasoning. If we just focus on reasoning, let other tools do the retreiuval that can be better

- RAG
- Raptor
- DSpy

## External Posts:

- [What we've learn in a year of building LLMS](https://applied-llms.org/)
- [How to Prompting](https://eugeneyan.com/writing/prompting/)
- [Apple Intelligence](https://www.ben-evans.com/benedictevans/2024/06/20/apple-intelligence)

## Several posts on this topic:

{% include summarize-page.html src="/ai-testing" %}

---

{% include summarize-page.html src="/ai-bestie" %}

---

{% include summarize-page.html src="/ai-talk" %}

---

{% include summarize-page.html src="/ai-journal" %}

---

{% include summarize-page.html src="/ai-art" %}

---

{% include summarize-page.html src="/ml" %}

---
layout: post
title: AI Developer
permalink: /ai-developer
---

ML Engineer is a hot new job. It's the boys and girls who train and deploy models. I heard the word AI developer the other day, and I'll refer to it as AI application engineers. People who use AI to solve use cases. NOTE: This is not what most developers do today. What most developers do today is ask how can AI do the things I would have done (e.g. write the function).

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [AI Developer, vs a Software Engineer using AI](#ai-developer-vs-a-software-engineer-using-ai)
- [The 10 Commandments of the AI Developer](#the-10-commandments-of-the-ai-developer)
  - [1. The Bitter Lesson: Scale beats clever algorithms](#1-the-bitter-lesson-scale-beats-clever-algorithms)
  - [2. AI can replace a well-defined role, it cannot replace an unbounded problem](#2-ai-can-replace-a-well-defined-role-it-cannot-replace-an-unbounded-problem)
  - [3. Your secret sauce is the evals, then the training data - your prompt has no economic value](#3-your-secret-sauce-is-the-evals-then-the-training-data---your-prompt-has-no-economic-value)
  - [4. Use the most expensive model you can as you prove you can solve the problem](#4-use-the-most-expensive-model-you-can-as-you-prove-you-can-solve-the-problem)
  - [5. Additional Commandment Ideas](#5-additional-commandment-ideas)
- [Programs, Human Code, AI](#programs-human-code-ai)
- [Design Patterns](#design-patterns)
  - [Levels of Cognitive Architecture](#levels-of-cognitive-architecture)
  - [Maximize the workflow and computation in your programs](#maximize-the-workflow-and-computation-in-your-programs)
  - [Ground your model with context](#ground-your-model-with-context)
  - [Use multiple AIs to maximize the value](#use-multiple-ais-to-maximize-the-value)
  - [Human in the loop](#human-in-the-loop)
  - [World model vs context model](#world-model-vs-context-model)
  - [AI Maximalist (ChatGPT) vs AI-enabled features (Apple Intelligence)](#ai-maximalist-chatgpt-vs-ai-enabled-features-apple-intelligence)
  - [Memory](#memory)
- [Use Cases and Applications](#use-cases-and-applications)
  - [Prompt writing helpers:](#prompt-writing-helpers)
  - [Insights from OpenAI CPO:](#insights-from-openai-cpo)
- [Mapping the AI Landscape](#mapping-the-ai-landscape)
  - [Capabilities: Large Context/Structured Output/Real Time](#capabilities-large-contextstructured-outputreal-time)
  - [AI Engagement Model: Tools/Copilots/Chat/Agents](#ai-engagement-model-toolscopilotschatagents)
- [Tech Deep Dive - Use case to Model](#tech-deep-dive---use-case-to-model)
  - [Fast Model](#fast-model)
  - [Hand writing recognition](#hand-writing-recognition)
  - [Coding - with Cursor](#coding---with-cursor)
  - [Coding - with Aider](#coding---with-aider)
  - [Coding - Make a PR for me](#coding---make-a-pr-for-me)
  - [Default](#default)
- [Tech Deep Dive - Models](#tech-deep-dive---models)
  - [Model and Service Dashboards](#model-and-service-dashboards)
  - [Quality vs Speed vs Prices](#quality-vs-speed-vs-prices)
  - [Llama 3](#llama-3)
  - [Tools + Libraries](#tools--libraries)
  - [Ell](#ell)
  - [Commercial vs Open Source Models](#commercial-vs-open-source-models)
- [Data Access](#data-access)
  - [Leaked System Prompts](#leaked-system-prompts)
  - [Use LLMs for reasoning not for data retrieval](#use-llms-for-reasoning-not-for-data-retrieval)
- [External Posts](#external-posts)
- [Several posts on this topic](#several-posts-on-this-topic)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## AI Developer, vs a Software Engineer using AI

Today, most software engineers are thinking how do I use AI to be a better programmer.

An AI developer would instead do:

- Be the PM, nail the use case.
- Figure out how much of it AI can do.
- Close the gap.

## The 10 Commandments of the AI Developer

### 1. The Bitter Lesson: Scale beats clever algorithms

Historical attempts at building intelligence have shown that methods that leverage computation and scale ultimately win over human-designed features and clever algorithms. Plan for scale, not just initial implementation.

### 2. AI can replace a well-defined role, it cannot replace an unbounded problem

Focus on specific, bounded use cases with clear success criteria. AI excels at replacing discrete functions but struggles with open-ended, multi-domain problems that require indefinite scope.

### 3. Your secret sauce is the evals, then the training data - your prompt has no economic value.

Competitive advantage comes from rigorous evaluation frameworks and quality training data, not from hiding prompts. Invest heavily in building comprehensive test suites and data pipelines.

### 4. Use the most expensive model you can as you prove you can solve the problem

Start with the best available model (GPT-4o, Claude Sonnet, etc.) to validate your use case and establish a quality baseline. Don't optimize for cost until you've proven the problem is solvable. Once you have working evals and proven value, then optimize downward to cheaper/faster models while maintaining acceptable quality thresholds.

### 5. Additional Commandment Ideas

- **Design for failure modes explicitly** - AI will fail in unexpected ways. Build error handling, graceful degradation, and clear user feedback when things go wrong.

- **Version your prompts like code** - Track prompt changes, A/B test variations, and maintain rollback capabilities. Prompt engineering is software engineering.

- **Optimize the human-AI handoff** - The transition points where control passes between AI and humans are critical. Make them seamless and obvious.

- **Build domain-specific evaluation datasets** - Generic benchmarks don't predict performance on your specific use case. Create custom test sets that mirror real user scenarios.

- **Treat AI outputs as drafts, not final products** - Design workflows that assume AI output needs human review, editing, or validation before reaching end users.

- **Cache aggressively, compute selectively** - AI inference is expensive. Cache common queries, precompute frequent operations, and only invoke models when truly necessary.

- **Monitor model drift and data shift** - AI performance degrades over time as real-world data changes. Build monitoring to detect when retraining or prompt updates are needed.

- **Design for explainability from day one** - Users need to understand why AI made specific decisions. Build in reasoning traces and confidence indicators.

- **Start with narrow scope, expand gradually** - Begin with the smallest viable AI-powered feature, validate it thoroughly, then incrementally expand capabilities.

- **Prioritize user agency over automation** - Give users control over AI actions. Suggest rather than execute, confirm before taking irreversible actions.

## Programs, Human Code, AI

At the hand-wavy level, programs are workflow and computation, where computation is defined recursively.

In the before times, all workflow and computation was defined in explicit code and the code was written by humans.

The first stage/category of AI evolves from having the AI help write the code, to having the AI write highly specified code itself, to writing code from very vague specifications.

The next stage/category of AI is having AI do leaf computation. This evolved from very specialized (digit recognition), spell checking, to more general - generate an image.

The final stage/category of AI is when AI does the higher level of workflow as well. Ask the user what they want, and do it.

Just like there are autonomous driving levels:

1. Human writes code
2. AI helps write code
3. AI writes code
4. AI writes code from vague specifications
5. AI does leaf computation
6. AI does higher level workflow
7. AI does everything

The AI developer strives to get the AI to the highest level possible

## Design Patterns

### Levels of Cognitive Architecture

This content nicely copied from [langchain](https://blog.langchain.dev/what-is-a-cognitive-architecture/):

![Picture of cognitive arch](https://blog.langchain.dev/content/images/size/w1600/2024/07/Screenshot-2024-06-28-at-7.33.10-PM.png)

**First:** If we refer back to this slide (originally from my TED Talk) on the different levels of autonomy in LLM applications, we can see examples of different cognitive architectures.

**Code:** First is just code - everything is hard-coded. Not even really a cognitive architecture.

**Single LLM Call:** Next is just a single LLM call. Some data preprocessing before and/or after, but a single LLM call makes up the majority of the application. Simple chatbots likely fall into this category.

**Chain of LLM Calls:** Next is a chain of LLM calls. This sequence can be either breaking the problem down into different steps, or just serve different purposes. More complex RAG pipelines fall into this category: use a first LLM call to generate a search query, then a second LLM call to generate an answer.

**Router:** After that, a router. Prior to this, you knew all the steps the application would take ahead of time. Now, you no longer do. The LLM decides which actions to take. This adds in a bit more randomness and unpredictability.

**State Machine:** The next level is what I call a state machine. This is combining an LLM doing some routing with a loop. This is even more unpredictable, as by combining the router with a loop, the system could (in theory) invoke an unlimited number of LLM calls.

**Agent (Autonomous Agent):** The final level of autonomy is the level I call an agent, or really an “autonomous agent”. With state machines, there are still constraints on which actions can be taken and what flows are executed after that action is taken. With autonomous agents, those guardrails are removed. The system itself starts to decide which steps are available to take and what the instructions are: this can be done by updating the prompts, tools, or code used to power the system.

### Maximize the workflow and computation in your programs

1. Understand use case
2. Make crappy prompt
3. Use [meta prompt builder](https://docs.anthropic.com/claude/docs/helper-metaprompt-experimental) to help write better prompt
4. Put prompt in PromptFoo to evaluate and track over time
5. Figure out cheapest/fastest model to meet your needs
6. Figure out gaps AI is doing with current generation of AI
7. Gap fill

### Ground your model with context

Currently more complex, figuring it out.

### Use multiple AIs to maximize the value

- Run same prompt through multiple AIs
- Show user multiple outputs
- Use AI to judge and merge
- Very helpful when you want the best thinking (e.g. commit messages).

### Human in the loop

- AI can still be wrong. Put a human in the loop

### World model vs context model

AI can perform a strict operation, vs understanding everything.

Obviously world models need to be much bigger, and data will go stale.

### AI Maximalist (ChatGPT) vs AI-enabled features (Apple Intelligence)

Today ‘summarize this document’ is AI, and you need a cloud LLM that costs \$20/month, but tomorrow the OS will do that for free. ‘AI is whatever doesn’t work yet.’

From [Ben Evans](https://www.ben-evans.com/benedictevans/2024/06/20/apple-intelligence):

The ‘AI Maximalist’ view is that general-purpose chatbots, with multimodal and ‘multi-agentic’ capabilities, will be able to take over broad classes of complex multi-stage tasks and problems that today need lots of different specially-written software, and will also be able to automate whole new class of complex tasks that could never be done in software before, again in one single general-purpose interface. The chatbot might replace all software with a prompt - ‘software is dead’. I’m skeptical about this, as I’ve written here, but Apple is proposing the opposite: that generative AI is a technology, not a product.

Apple is, I think, signaling a view that generative AI, and ChatGPT itself, is a commodity technology that is most useful when it is:

1. Embedded in a system that gives it broader context about the user (which might be search, social, a device OS, or a vertical application) and

1. Unbundled into individual features (ditto), which are inherently easier to run as small power-efficient models on small power-efficient devices on the edge (paid for by users, not your capex budget) - which is just as well, because…

1. This stuff will never work for the mass-market if we have marginal cost every time the user presses ‘OK’ and we need a fleet of new nuclear power-stations to run it all.

### Memory

Pretty important topic - here's some notes on it from [langchain](https://blog.langchain.dev/memory-for-agents/)

## Use Cases and Applications

- [Writing git commit messages](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/commit.py?plain=1#L19)
- [Spellchecking a file at a time](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/gpt3.py#L748)
- [Summarize changes in a repo over a period of time](https://github.com/idvorkin/nlp/blob/312cee852d96173751c6eaf83dd8bb3299603f13/commit.py#L19). E.g. [What I wrote some random week](https://gist.github.com/idvorkin/a701075a10d98dc41768765bc5b567ca)

### Prompt writing helpers:

[Claude's is awesome](https://console.anthropic.com/dashboard)

### Insights from OpenAI CPO:

- https://youtu.be/VsmEMUiPXIs?si=TqhP1gFd2pk1dDxb
- https://gist.github.com/idvorkin/2f0888b678f17b4c39295e77643fc2d5

**Top ideas:**

TODO: Use ML to analyze the above ^

- Very interesting to develop when there is no clear technology floor - it keeps raising
- As a new business, build stuff that's on the edge of what tech can do, tech will close the gap, you'll have an edge
- How hard it is to price products - look at o1 (reasoning model)
  - Did 8 hours of lawyer work, valued at $8K. In 5 minutes, for $2
  - If you want to charge $7K, you can't as competitors will release for less money.
- OpenAI isn't compute bound, it's eval bound.
  - You provide value by creating evals, and doing RAG.

## Mapping the AI Landscape

If you want to understand apps, and how they should evolve, it's helpful to have a strategic map of the space. This [article](https://interconnected.org/home/2024/07/19/ai-landscape):

### Capabilities: Large Context/Structured Output/Real Time

[![AI Product Map 1st Gen](https://interconnected.org/more/2024/07/19/ai-product-map-1st-gen-matt-webb.png)](https://interconnected.org/more/2024/07/19/ai-product-map-1st-gen-matt-webb.png)

### AI Engagement Model: Tools/Copilots/Chat/Agents

- Tools: Users control AI to generate something.

  - Use case: Image generation, Text-to-speech conversion, 3D model creation
  - Example product: DALL-E, Midjourney, Stable Diffusion
  - Value prop: On-demand creative assets, Rapid prototyping, Customized content generation
  - Challenge: Ensuring output quality and relevance, Managing copyright concerns, Avoiding biased or inappropriate results

- Copilots: The AI works alongside the user in an app in multiple ways.

  - Use case: Code assistance, Writing enhancement, Design suggestions
  - Example product: GitHub Copilot, Grammarly, Adobe Sensei
  - Value prop: Increased developer productivity, Improved writing quality, Faster design iterations
  - Challenge: Integrating seamlessly into existing workflows, Maintaining user agency, Ensuring accuracy of suggestions

- Agents: The AI has some autonomy over how it approaches a task.

  - Use case: Task automation, Personal assistance, Data analysis
  - Example product: AutoGPT, GPT-Agent, AI-powered virtual assistants
  - Value prop: Handling complex, multi-step processes, Autonomous problem-solving, Continuous learning and adaptation
  - Challenge: Maintaining user trust and control, Ensuring ethical decision-making, Managing unexpected outcomes

- Chat: The user talks to the AI as a peer in real-time.
  - Use case: Customer support, Language learning, Mental health support
  - Example product: ChatGPT, Duolingo AI, Woebot
  - Value prop: 24/7 instant responses, Personalized interactions, Scalable conversation capabilities
  - Challenge: Handling complex queries and maintaining context, Ensuring empathy and emotional intelligence, Protecting user privacy

With generative tools, it's about reliability and connecting to existing workflows. Live tools are about having the right high-level "brushes," being able to explore latent space, and finding the balance between steering and helpful hallucination.

With copilots, it's about integrating the AI into apps that already work, acknowledging the different phases of work. Also helping the user make use of all the functionality… which might mean clear names for things in menus, or it might mean ways for the AI to be proactive.

Agents are about interacting with long-running processes: directing them, having visibility over them, correcting them, and trusting them.

Chat has an affordances problem. As Simon Willison says, tools like ChatGPT reward power users.

[![AI Product Map Groups](https://interconnected.org/more/2024/07/19/ai-product-map-groups-matt-webb.png)](https://interconnected.org/more/2024/07/19/ai-product-map-groups-matt-webb.png)

[![AI Product Map Archetypes](https://interconnected.org/more/2024/07/19/ai-product-map-archetypes-matt-webb.png)](https://interconnected.org/more/2024/07/19/ai-product-map-archetypes-matt-webb.png)

## Tech Deep Dive - Use case to Model

I saw an interview question about when do you use which model/tool - this section is changing all the time.

### Fast Model

Having a fast model just changes the game, you can do stuff in real time like spell checking, it's usually good enough for this.

- Right now it's Llama 4 maverick hosted on Groq, [crazy fast speeds](https://artificialanalysis.ai/models/llama-4-maverick/providers) (600 tokens/second!!)

### Handwriting recognition

Right now I'm using Gemini Pro - it does a great job, and I can just inline the binary content.

### Coding - with Cursor

It's been Claude 4 sonnet thinking for a while, need to think about trying others.

### Coding - with Aider

### Coding - Make a PR for me

- I'm not sure how to differentiate codex, google jules and anything else, I guess I will soon.

### Default

## Tech Deep Dive - Models

### Model and Service Dashboards

- [OpenAI Usage](https://platform.openai.com/usage)
- [Claude Usage](https://console.anthropic.com/settings/usage)
- Gemini Usage - Sheesh I can't even figure it out
- [VAPI](https://dashboard.vapi.ai/billing) - for voice access
- [Modal](https://modal.com/settings/idvorkin/usage) - For FaaS capability

### Quality vs Speed vs Prices

- See [performance dashboards](https://artificialanalysis.ai/models/gpt-4-turbo)
- Groq is really exciting because it's crazy fast. Like 200 tokens/s. But it can only run open source models, so much less useful.

### Llama 3

- Super exciting based on quality, and by being hosted on Groq making it super fast.

### Tools + Libraries

- Langchain
  - Gives you a unified API to use multiple models

### Ell

[Ell](https://github.com/MadcowD/ell) believes prompts are programs not strings, and acts accordingly. I predict it will replace langchain, certainly will for me. Its value prop

- The model calling interface is super simple (exactly what I want in fact!)

E.g ([full file](https://github.com/idvorkin/nlp/blob/ee8acccf1e54aa36687a8785775125faaeedec46/pell.py?plain=1#L21)).

```python

@ell.simple(model="gpt-4o-mini")
def hello(world: str):
    """You are a unhelpful assistant, make your answers spicy"""  # System prompt
    name = world.capitalize()
    return f"Say hello to {name}!"  # User prompt

def scratch():
    response = hello("Igor", lm_params=dict(n=2)) # get 2 responses
    ic(response)
```

- It versions and tracks your prompt and prompt usage (like LangTrace), and it does it with gpt-4o. Very clever. Check out their view of my code. I'm looking forward to having this hosted somewhere.

![Screenshot of Ell Studio development interface showing LMP system prompt editing with version history tracking, including system prompt updates like "make your answers spicy" and performance metrics display](https://raw.githubusercontent.com/idvorkin/ipaste/main/20240922_112926.webp)

### Commercial vs Open Source Models

## Data Access

### Leaked System Prompts

A bunch of [leaked prompts](https://github.com/wunderwuzzi23/scratch/tree/master/system_prompts). You can see a bunch of the current alchemy in creating these.

See also: [AI Security - Leaked System Prompts](/ai-security#leaked-system-prompts) for security considerations around leaked prompts.

### Use LLMs for reasoning not for data retrieval

Great line from Altman, we're currently using them for data retrieval, but their super power is reasoning. If we just focus on reasoning, let other tools do the retrieval that can be better

- RAG
- Raptor
- DSpy

## External Posts

- [What we've learned in a year of building LLMS](https://applied-llms.org/)
- [How to Prompting](https://eugeneyan.com/writing/prompting/)
- [Apple Intelligence](https://www.ben-evans.com/benedictevans/2024/06/20/apple-intelligence)

## Several posts on this topic

{% include summarize-page.html src="/ai" %}

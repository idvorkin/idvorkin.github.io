---
layout: post
title: "Seminal AI Papers"
permalink: /ai-paper
redirect_from:
  - ai-papers
---

The original AI papers were all about training, super technical, and not that usable as a practitioner. Nowadays papers are less "mathy" and more applicable to practitioners. Here are some worth reading

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [LLM Agents](#llm-agents)
- [Security](#security)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## LLM Agents

Woah, this starting off point is great:

From [Lilian Weng's LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)

Shamelessly inlining from the above:

In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components:

**Planning**

- Subgoal and decomposition: The agent breaks down large tasks into smaller, manageable subgoals, enabling efficient handling of complex tasks.
- Reflection and refinement: The agent can do self-criticism and self-reflection over past actions, learn from mistakes and refine them for future steps, thereby improving the quality of final results.

**Memory**

- Short-term memory: I would consider all the in-context learning (See Prompt Engineering) as utilizing short-term memory of the model to learn.
- Long-term memory: This provides the agent with the capability to retain and recall (infinite) information over extended periods, often by leveraging an external vector store and fast retrieval.

**Tool use**

- The agent learns to call external APIs for extra information that is missing from the model weights (often hard to change after pre-training), including current information, code execution capability, access to proprietary information sources and more.

![Agent Overview](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)

## Security

{% include summarize-page.html src="ai-security" %}

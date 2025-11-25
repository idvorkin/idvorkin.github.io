---
layout: post
title: "Seminal AI Papers"
permalink: /ai-paper
redirect_from:
  - ai-papers
---

The original AI papers were all about training, super technical, and not that usable as a practitioner. Nowadays papers are less "mathy" and more applicable to practitioners. Here are some worth reading

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [LLM Agents](#llm-agents)
- [Security](#security)
- [Relationships](#relationships)
- [Situational Awareness](#situational-awareness)

<!-- vim-markdown-toc-end -->
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

## Relationships

{% include summarize-page.html src="ai-and-relationships" %}

## Situational Awareness

An [Excellent series of essays on what happens as AI gets to superintelligence](https://situational-awareness.ai/)
The term is how aware is the LLM of its situation. The series of articles talks about how quickly we are progressing, what we need to do etc. Very, very good.

- I. From GPT-4 to AGI: Counting the OOMs

AGI by 2027 is strikingly plausible. GPT-2 to GPT-4 took us from ~preschooler to ~smart high-schooler abilities in 4 years. Tracing trendlines in compute (~0.5 orders of magnitude or OOMs/year), algorithmic efficiencies (~0.5 OOMs/year), and “unhobbling” gains (from chatbot to agent), we should expect another preschooler-to-high-schooler-sized qualitative jump by 2027.

- II. From AGI to Superintelligence: the Intelligence Explosion

AI progress won’t stop at human-level. Hundreds of millions of AGIs could automate AI research, compressing a decade of algorithmic progress (5+ OOMs) into ≤1 year. We would rapidly go from human-level to vastly superhuman AI systems. The power—and the peril—of superintelligence would be dramatic.

- IIIa. Racing to the Trillion-Dollar Cluster

The most extraordinary techno-capital acceleration has been set in motion. As AI revenue grows rapidly, many trillions of dollars will go into GPU, data center, and power buildout before the end of the decade. The industrial mobilization, including growing US electricity production by 10s of percent, will be intense.

- IIIb. Lock Down the Labs: Security for AGI

The nation’s leading AI labs treat security as an afterthought. Currently, they’re basically handing the key secrets for AGI to the CCP on a silver platter. Securing the AGI secrets and weights against the state-actor threat will be an immense effort, and we’re not on track.

- IIIc. Superalignment

Reliably controlling AI systems much smarter than we are is an unsolved technical problem. And while it is a solvable problem, things could easily go off the rails during a rapid intelligence explosion. Managing this will be extremely tense; failure could easily be catastrophic.

- IIId. The Free World Must Prevail

Superintelligence will give a decisive economic and military advantage. China isn’t at all out of the game yet. In the race to AGI, the free world’s very survival will be at stake. Can we maintain our preeminence over the authoritarian powers? And will we manage to avoid self-destruction along the way?

- IV. The Project

As the race to AGI intensifies, the national security state will get involved. The USG will wake from its slumber, and by 27/28 we’ll get some form of government AGI project. No startup can handle superintelligence. Somewhere in a SCIF, the endgame will be on.

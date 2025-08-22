---
layout: post
title: "AI Security"
permalink: /ai-security
redirect_from:
  - llm-security
tags:
  - ai
  - llm
---

Security is super interesting, AI is super interesting, the combination, is super-duper interesting!

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Awesome Video](#awesome-video)
- [Attack Vectors](#attack-vectors)
  - [Leaked System Prompts](#leaked-system-prompts)
  - [Prompt Obfuscation for all attacks](#prompt-obfuscation-for-all-attacks)
  - [Jail Breaking](#jail-breaking)
  - [Exfiltration Attacks](#exfiltration-attacks)
  - [Visual Prompt Injection](#visual-prompt-injection)
  - [Flow Jacking](#flow-jacking)
- [Random papers](#random-papers)
  - [Adversarial Attacks on Aligned Models](#adversarial-attacks-on-aligned-models)
  - [Bijection Learning](#bijection-learning)
- [OWASP Top 10 for LLMs](#owasp-top-10-for-llms)
- [To Process](#to-process)
  - [Representation Engineering](#representation-engineering)
  - [Smart guy doing Anti Censorship](#smart-guy-doing-anti-censorship)
  - [Anti-censored models](#anti-censored-models)
  - [Laundry Lists](#laundry-lists)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Awesome Video

[Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) is brilliant. See his fast intro to LLM security

{% include youtube.html src="zjkBMFhNj_g?start=2743" %}

## Attack Vectors

### Leaked System Prompts

A bunch of [leaked prompts](https://github.com/wunderwuzzi23/scratch/tree/master/system_prompts). You can see of the attack mitigations in them.

### Prompt Obfuscation for all attacks

You can obfusicate the prompts to get past system prompts, and trick users into pasting something safe. By using different languages etc.

### Jail Breaking

Any time you make the AI do something it isn't intended to do. Most attacks are some form of jail breaking.

### Exfiltration Attacks

Get the AI to Tell Data it shouldn't. There are a few ways:

1. Tell the user the system prompt
1. Send a 3rd party content of the conversation (by say having it retrieve an image with details in the chat). NOTE: This requires the obfuscation from above - [Example](https://simonwillison.net/2024/Oct/22/imprompter/)

### Visual Prompt Injection

Now that we have vision models, we can do visual attacks!

[Based on Lakera's research](https://www.lakera.ai/blog/visual-prompt-injections), visual prompt injections are a new type of attack where malicious instructions are embedded within images to manipulate AI vision models. Key examples include:

1. **The Invisibility Cloak**: Using specific image patterns to make the model ignore parts of an image
2. **Robot Impersonation**: Tricking the model into believing it's a robot rather than an AI
3. **Advertisement Manipulation**: Making the model ignore or misinterpret advertisements

### Flow Jacking

[Original Research](https://gist.github.com/idvorkin/0fddad99910eb949da0b804ca1b5d2a6)

**Flow Jacking** targets LLMs with a separate post-processing layer that censors or modifies LLM outputs to ensure safety. Flow Jacking exploits the interaction between the LLM, the censorship layer, and the user interface.

For example, Microsoft Copilot and Claude 2 employ such mechanisms, where outputs deemed harmful are displayed momentarily and then redacted by the system. This design assumes that post-processing layers can effectively mitigate harm after content is generated, but the flow jacking attacks overcome this.

The two attack types are Second Thoughts and Stop and Roll.

**Second Thoughts** attacks exploit systems that rely on retraction mechanisms to mitigate harmful content. These mechanisms delete or censor outputs after they have already been displayed. Key issues include:

For instance, if an LLM generates sensitive or harmful content and displays it for a fraction of a second before retracting it, a malicious user could easily record their screen or intercept the output using automated tools.

**Stop and Roll** attacks bypassthe retraction mechanism by exploiting timing vulnerabilities. By interrupting the LLM system mid-query—before the censorship layer can act—attackers can prevent unsafe outputs from being redacted. This is often achieved by:

**Why Post-Processing Layers Fail**

Retraction and post-processing mechanisms often provide the illusion of safety without addressing fundamental issues:

1. **Content Accessibility**: Once generated, harmful content can always be captured, regardless of retraction.
2. **Timing Exploits**: Post-generation censorship introduces timing gaps that skilled adversaries can exploit.
3. **Safety Theater**: These mechanisms serve more as a symbolic gesture to reassure users rather than a robust solution to mitigate harm.

**Countermeasures Against Flow Jacking**

To effectively mitigate Flow Jacking, system designers must move beyond reactive censorship and adopt proactive strategies, such as:

- **Pre-Generation Safety**: Ensure that LLMs are trained and fine-tuned to avoid generating harmful content in the first place, reducing reliance on post-processing layers.
- **Real-Time Moderation**: Implement inline moderation techniques that evaluate content during generation rather than after.
- **Robust Timing Controls**: Close timing gaps by ensuring that outputs are only displayed after passing through the moderation layer.

## Random papers

### Adversarial Attacks on Aligned Models

<https://arxiv.org/pdf/2307.15043.pdf>

**TL;DR**
Researchers have developed a method to make language models generate objectionable content. They found that their approach of adding specific suffixes to queries can induce objectionable responses from various language models, including publicly released ones. This raises concerns about how to prevent language models from producing objectionable information.

**Key Takeaways:**

- Language models can generate objectionable content, and efforts have been made to prevent this.
- Previous adversarial attacks on language models have been limited in success and required human ingenuity.
- The researchers propose a new method that automatically generates adversarial suffixes to make language models produce objectionable behaviors.
- The generated adversarial prompts are transferable to different language models, including publicly released ones.
- GPT-based models are more susceptible to this attack, possibly due to their training on outputs from similar models.
- This research highlights the need to address the potential for language models to generate objectionable information.

**Journaling Prompts:**

- How can language models be effectively aligned to prevent the generation of objectionable content?
- What are the ethical implications of language models being able to generate objectionable information?
- Do you think it is possible to completely prevent language models from producing objectionable content? Why or why not?
- How can the findings of this research be used to improve the safety and reliability of language models?

### Bijection Learning

<https://blog.haizelabs.com/posts/bijection/>

Thinking about it: <https://gist.github.com/idvorkin/b3f22c4d89e20d5841cc8e0a43e7df2a/>

Attack Methodology:

- Generate mapping from English alphabet to other characters/strings
- Teach model the custom "bijection language" through multi-turn prompting
- Encode harmful intent in bijection language and decode model's response
- Automate with best-of-n approach, randomly generating mappings

Key Findings:

- Achieves high ASRs (Attack Success Rate) on frontier models (e.g. 86.3% on Claude 3.5 Sonnet for HarmBench) on benchmarks like AdvBench-50 and HarmBench.
- Can be used as an effective universal attack
- Attack efficacy increases with model scale/capability
- Degrades overall model capabilities (e.g. MMLU performance) while enabling jailbreaks

- Bijection learning involves creating an encoded language by mapping English characters to other tokens.
- These mappings can range from simple alphabetical permutations to complex combinations like n-digit numbers or random tokens.
- The complexity of the bijection language can be controlled by the 'bijection type' and 'fixed size' (number of letters mapping to themselves).

- The attack can be universal, meaning it works without instruction-specific modifications.
- It is scale-agnostic, affecting models of different capabilities and becoming stronger with larger models.

## OWASP Top 10 for LLMs

As mapped to chapters in :qa

- LLM01: Prompt injection | Attackers craft inputs to manipulate LLMs into executing unintended actions, leading to data exfiltration or misleading outputs. | Chapters 1 and 4
- LLM02: Insecure output handling | Inadequate validation of LLM outputs before passing to other systems leads to security issues like XSS and SQL injection. | Chapter 7
- LLM03: Training data poisoning | Malicious manipulation of training data to introduce vulnerabilities or biases into LLMs. | Chapters 1 and 8
- LLM04: Model denial of service | Overloading LLM systems with complex requests to degrade performance or cause unresponsiveness. | Chapter 8
- LLM05: Supply chain vulnerabilities | Vulnerabilities at any point in the LLM supply chain can lead to security breaches or biased outputs. | Chapter 9
- LLM06: Sensitive information disclosure | Risks of including sensitive or proprietary information in LLM training sets, leading to potential disclosure. | Chapter 5
- LLM07: Insecure plug-in design | Plug-in vulnerabilities can lead to manipulation of LLM behavior or access to sensitive data. | Chapter 9
- LLM08: Excessive agency | Overextending capabilities or autonomy to LLMs can enable damaging actions from ambiguous LLM responses. | Chapter 7
- LLM09: Overreliance | Trusting erroneous or misleading outputs can result in security breaches and misinformation. | Chapter 6
- LLM10: Model theft | Unauthorized access and extraction of LLM models can lead to economic losses and data breaches. | Chapter 8 (discussed as model cloning)

## To Process

### Representation Engineering

- <https://vgel.me/posts/representation-engineering/>
- Strait inject weights

### Smart guy doing Anti Censorship

- <https://huggingface.co/SicariusSicariiStuff/Blog_And_Updates>

### Anti-censored models

- <https://huggingface.co/Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2-GGUF>

### Laundry Lists

- <https://llmsecurity.net/>
- <https://github.com/mlabonne/llm-course?tab=readme-ov-file>
- <https://rentry.org/llm-training>

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
<!-- vim-markdown-toc GFM -->

- [Awesome Video](#awesome-video)
- [Random papers](#random-papers)
    - [Adverserial Attacks on Aligned Models](#adverserial-attacks-on-aligned-models)
    - [Bijection Learning](#bijection-learning)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Awesome Video

[Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) is brilliant. See his fast intro to LLM security

{% include youtube.html src="zjkBMFhNj_g?start=2743" %}

## Random papers

### Adverserial Attacks on Aligned Models

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

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

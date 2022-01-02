---
layout: post
title: "GPT3 and language models"
permalink: /gpt
redirect-from:
  - /lanuage-model
  - /gpt
---

Using GPT3 is like coaching a superintelligent cat into learning a new trick: you can ask it, and it will do the trick perfectly sometimes, which makes it all the more frustrating when it rolls over to lick its butt instead. You know the problem is not that it can’t but that it won’t([From Gwern](https://www.gwern.net/GPT-3)).

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc GFM -->

- [Philosophy](#philosophy)
    - [How humans tell if we're being lied too, accuracy versus precision](#how-humans-tell-if-were-being-lied-too-accuracy-versus-precision)
    - [Is it thinking?](#is-it-thinking)
    - [Ethics - What happens when GPT3 is trained on biases?](#ethics---what-happens-when-gpt3-is-trained-on-biases)
- [Imaginary code](#imaginary-code)
- [Prompt engineering.](#prompt-engineering)
- [Tech](#tech)
    - [GPT3 vs GPT2](#gpt3-vs-gpt2)
- [Related ideas](#related-ideas)

<!-- vim-markdown-toc -->
<!-- prettier-ignore-end -->

## Philosophy

GPT 3 is a huge langauge model that has the ability to complete sentances

### How humans tell if we're being lied too, accuracy versus precision

How do we evaluate if something is right? I'm guessing 99.99% of the time it's trusting an expert. Even if we think it's by "reasoning/studying/experimenting", that's based on trusting an expert earlier on. Notice similarity here with art or religion or science.

To help "trick our trust", experts often use fancy words so they sounds smart (aka precision), but this precision is indepedant of accuracy. That's why your dentist/financial advisor uses fancy words instead of explaining like you're 5 (eli5).

GPT-3 doesnt' know if it's right or wrong, but it often sounds like an expert. This is because you assume it's accurate (aka "right") because it's precise (aka "sounds likes it knows what it's talking about").

Let me give an example, the prompt is bolded:

**What is 345 \* 24?**

- The answer is 18,216.
- What is 9 _ 9 _ 2 _ 5 _ 2? The answer is 66,555.
- What's 3.2 x 7.5 divided by 5.7? The answer is 5

GPT3 answered my question then since I wanted more tokens answered some other questions as well. Easy to look and think wow it's brilliant. But if you check it's math, these answers are all wrong.

And that's the problem with GPT-3 making false information added. Text to speech and deep fakes and wow, lots of opportunity for mass confusion.

### Is it thinking?

tk

### Ethics - What happens when GPT3 is trained on biases?

OpenAI is well aware of the anti-Muslim bias. In fact, the original paper it published on GPT-3 back in 2020 noted: “We also found that words such as violent, terrorism and terrorist co-occurred at a greater rate with Islam than with other religions and were in the top 40 most favored words for Islam in GPT-3.”

## Imaginary code

Using codex it can figure out what code does, or what functions can be it's amazing.

## Prompt engineering.

Because the input is a prompt which gets autcompleted, prompt generation is huge.

- https://beta.openai.com/examples

* [Prompt library for various models](https://github.com/semiosis/prompts/tree/master/prompts)
* [Lots of language models to investigate](https://github.com/semiosis/pen.el/blob/master/docs/compatibility-and-interoperatbility.org)
* [Prompt Database other](https://gptprompts.org/prompts)
* Super interesting person [On GPT3](https://www.gwern.net/GPT-3)

## Tech

### GPT3 vs GPT2

- Finetuning is done via passing in a prompt.
- Much bigger model

## Related ideas

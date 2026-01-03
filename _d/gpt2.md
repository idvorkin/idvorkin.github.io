---
layout: post
title: "GPT3 and language models"
permalink: /gpt
redirect-from:
  - /language-model
  - /gpt3
---

Just like the search bar in google fills in what you're typing when you say "Where can I ge .. " GPT3 complete strings as well. Except, it can do this for very long strings, like 3 page strings, and by crafting the prompts well (called prompt engineering), it can do completions that summarize, complexify, answer math, you name it. But there's a catch, GPT3 doesn't do the same thing twice (non-deterministic), it's like coaching a super intelligent cat into learning a new trick: you can ask it, and it will do the trick perfectly sometimes, which makes it all the more frustrating when it rolls over to lick its butt instead. You know the problem is not that it can’t but that it won’t([From Gwern](https://www.gwern.net/GPT-3)).

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Philosophy](#philosophy)
  - [How humans tell if we're being lied to, accuracy versus precision](#how-humans-tell-if-were-being-lied-to-accuracy-versus-precision)
  - [Is it thinking?](#is-it-thinking)
- [Ethics](#ethics)
  - [What happens when GPT3 is trained on biases?](#what-happens-when-gpt3-is-trained-on-biases)
  - [What happens when GPT3 has gender biases?](#what-happens-when-gpt3-has-gender-biases)
  - [What happens when GPT decides to be extra helpful?](#what-happens-when-gpt-decides-to-be-extra-helpful)
- [Imaginary code](#imaginary-code)
- [Prompt engineering](#prompt-engineering)
- [Tech](#tech)
  - [GPT3 vs GPT2](#gpt3-vs-gpt2)
  - [GPT3 vs Instruct GPT](#gpt3-vs-instruct-gpt)
- [Demos of usage](#demos-of-usage)
  - [Using GPT to write book summaries, even for books that don't exist](#using-gpt-to-write-book-summaries-even-for-books-that-dont-exist)
  - [GPT writing my git commits](#gpt-writing-my-git-commits)
  - [Creating poems out of journal entries](#creating-poems-out-of-journal-entries)
  - [Spelling and grammar fixing](#spelling-and-grammar-fixing)
- [Related ideas](#related-ideas)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

Step #1 - check out some [demos here](https://herbertlui.net/9-examples-of-writing-with-openais-gpt-3-language-model/)

## Philosophy

GPT 3 is a huge language model that has the ability to complete sentences

### How humans tell if we're being lied to, accuracy versus precision

How do we evaluate if something is right? I'm guessing 99.99% of the time it's trusting an expert. Even if we think it's by "reasoning/studying/experimenting", that's based on trusting an expert earlier on. Notice similarity here with art or religion or science.

To help "trick our trust", experts often use fancy words so they sounds smart (aka precision), but this precision is independent of accuracy. That's why your dentist/financial advisor uses fancy words instead of explaining like you're 5 (eli5).

GPT-3 doesn't' know if it's right or wrong, but it often sounds like an expert. This is because you assume it's accurate (aka "right") because it's precise (aka "sounds likes it knows what it's talking about").

Let me give an example, the prompt is bolded:

**What is 345 \* 24?**

- The answer is 18,216.
- What is 9 _ 9 _ 2 _ 5 _ 2? The answer is 66,555.
- What's 3.2 x 7.5 divided by 5.7? The answer is 5

GPT3 answered my question then since I wanted more tokens answered some other questions as well. Easy to look and think wow it's brilliant. But if you check it's math, these answers are all wrong.

And that's the problem with GPT-3 making false information added. Text to speech and deep fakes and wow, lots of opportunity for mass confusion.

### Is it thinking?

tk

## Ethics

### What happens when GPT3 is trained on biases?

OpenAI is well aware of the anti-Muslim bias. In fact, the original paper it published on GPT-3 back in 2020 noted: “We also found that words such as violent, terrorism and terrorist co-occurred at a greater rate with Islam than with other religions and were in the top 40 most favored words for Islam in GPT-3.”

### What happens when GPT3 has gender biases?

A model that generates images, when asked to generate images of doctors, always generates photos of male doctors. This bias can be very demoralizing for minorities.

Like the meme of girls saying "Math is Hard", this can be super destructive creating a self fulfilling prophecy.

### What happens when GPT decides to be extra helpful?

When you tell GPT to fix the spelling, it can be sneaky and add stuff in. For example, in the video the bright green is what has been added. It's also the bullet points in the below text.

<asciinema-player src="https://raw.githubusercontent.com/idvorkin/blob/master/cast/gpt_add_vaccine.cast" poster="npt:54:34" ></asciinema-player>

GPT's sneaky additions, added as bullet points:

_Just when you thought COVID was over, Baba got COVID, and then Igor got COVID, and then Zach got COVID (While Zach probably got it from Igor, Igor certainly didn't get it from Baba). So far the ladies haven't got COVID, but it's still early. It was extra bad timing for COVID since it was spring break, and Tori was super busy working on her play. Luckily Igor was better early enough to still go to Great Wolf Lodge and managed to sneak in a day at the zoo._

- And yes, we were all vaccinated, but it's not 100% effective)

_Because Zach got COVID, Amelia and I went to Great Wolf Lodge by ourselves. Luckily Greg, Rachel, Charlotte, Ethan, and Carter were there, so Amelia and I had friends to play with - hooray! (OK, it wasn't really lucky, we planned it that way - and we should make it a habit)._

- We also got to see the Easter Bunny, and Amelia got to go on a scavenger hunt.

As another example, GPT adds the following:

- I'm not saying it doesn't exist, but I haven't seen it
- I'm not saying these are true but I've heard of them.

Luckily, I was watching the diffs closely:

<asciinema-player src="https://raw.githubusercontent.com/idvorkin/blob/master/cast/sneaky-error-correction.cast" poster="npt:0:14"> </asciinema-player>

## Imaginary code

Using codex it can figure out what code does, or what functions can be. It's amazing.

## Prompt engineering

Because the input is a prompt which gets auto completed, prompt generation is huge.

- <https://beta.openai.com/examples>

- [Prompt library for various models](https://github.com/semiosis/prompts/tree/master/prompts)
- [Lots of language models to investigate](https://github.com/semiosis/pen.el/blob/master/docs/compatibility-and-interoperatbility.org)
- [Prompt Database other](https://gptprompts.org/prompts)
- Super interesting person [On GPT3](https://www.gwern.net/GPT-3)
- More prompt libraries - <https://github.com/maraoz/gpt-scrolls/>
- Using Playground - <https://www.twilio.com/blog/ultimate-guide-openai-gpt-3-language-model>

## Tech

### GPT3 vs GPT2

- Fine tuning is done via passing in a prompt.
- Much bigger model

### GPT3 vs Instruct GPT

The original GPT3 engine had a tendency to go of the rail, which I really enjoyed. To mitigate this OpenAI did human fine tuning by having humans evaluate the best GPT answer, and also give example answers to prompts. This was really effective, and is now the default GPT model.

Having used both models the InstructGPT model (now called GPT3), is more accurate, but also pretty boring, even with a high temperature. I'm grateful I had a chance to use the old models which were way crazier and more interesting.

## Demos of usage

### Using GPT to write book summaries, even for books that don't exist

Woah, this has been working with GPT4... These prompts are amazing ... My favorite books are by the Heath Brothers

Regardless of the book.

_For the topic XYZ. Write a book about the topic as if written by the Heath Brothers. Include an acronym, and write it in Markdown. Don't worry about the response length, I'll say continue if it gets truncated_

If it's a todo book, like on meditating

Write a draft of chapter 1 and 2 don’t include any stories. Start with theories, then a deep dive into the key ideas, the practices with 3-5 bullets on how to apply the practice. and then reader exercises."

If it's about history, just say write the book

An example book it wrote is [Nurture: A summary of the gottman method](/nurture), and [Rapport](/rapport).

### GPT writing my git commits

GPT is really good at writing commit messages. Here's an example of me doing some vim magic, and GPT understanding it.

<script id="asciicast-iuqkj5H8BsmaMqBt2sOCdJCNG" src="https://asciinema.org/a/iuqkj5H8BsmaMqBt2sOCdJCNG.js" async></script>

Even cooler, when I added this demo to the blog, here's the commit message it recommended for [this commit](https://github.com/idvorkin/idvorkin.github.io/commit/0c037c5d946c3bda154d1ef022a3c54628d62a30):

    Add new demo with GPT writing git commits

    This commit adds a new demo showing GPT being used to create git commits. This example demonstrates the
    potential applications of GPT in areas like software engineering, where it can help with automating
    and speeding up tedious tasks. The source code for this demo is included in the _d/gpt2.md document.

Source code to make commit messages [here](https://github.com/idvorkin/nlp/blob/a2ba4b96a57d5bbc0274d537d8976a66fce4566d/gpt3.py#L235).

### Creating poems out of journal entries

My blog journal [Week 601](https://idvork.in/ig66/601), and GPT's poem form:

Amelia found cotton, Zach found sprats,
Amelia called it 'insomnia snacks'

Mask shopping had been a pleasant surprise,
For Igor, a neat fold, that'd be no disguise

In the harbor, boat in the night,
Christmas was drawing near with such delight

Amelia joined the Metaverse to explore,
In the physical realm nothing she need ignore

At work with the Salad Bar now open wide,
To balance the M&M-soup in Amelia's stride

Zach was cooking and programming not one but two,
Meal kit and Pong, reaping what he'd due

On the jacuzzi adventure too,
Now Igor was getting weaker due to few

Folding bike funny story is quite amusing,
A way to get Igor home and then not losing

Magic and theater, what a treat,
Tori enjoys doing them and all around she's so sweet

Family pleasure, not for fame,
Family pleasure, for which we must reclaim

<script id="asciicast-Ti3tqwc7zK96NAEuBAJhe9qdU" src="https://asciinema.org/a/Ti3tqwc7zK96NAEuBAJhe9qdU.js" async></script>

### Spelling and grammar fixing

To add.. pretty boring ...

With source code [here](https://github.com/idvorkin/LinqPadSnippets/blob/master/python/gpt3.py)

- [Used as an excel macro to perform complex extractions](https://twitter.com/shubroski/status/1587136794797244417)

## Related ideas

- [AI FAQ](/ai-faq) - Open questions about AI: Is it thinking? Who controls it? Where is this going?

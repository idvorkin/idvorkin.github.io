---
layout: post
title: "Can a Local Model Anonymize My Journal? Testing OpenAI's Privacy Filter"
permalink: /privacy-filter
tags:
  - ai
---

<!--
INSTRUCTIONS FOR CLAUDE — do not render
- Every example here comes from a made-up journal entry. Never paste real journal text, real names, or real dates into this post.
- Results from the real entries are reported only as counts. Keep it that way.
-->

I want to point AI tools at 15 years of journals without handing over my family's fights, health and worries. When OpenAI released [Privacy Filter](https://openai.com/index/introducing-openai-privacy-filter/), a small open-weight model that finds and masks personal data on your own machine, I ran it on my journal. It does great on emails and phone numbers. It missed most of the names, and it isn't built to notice what I'd most want hidden.

{% include ai-slop.html percent="90" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Redaction isn't anonymization](#redaction-isnt-anonymization)
- [The model](#the-model)
- [On clean, made-up text, it's excellent](#on-clean-made-up-text-its-excellent)
- [On my real journal, it missed most names](#on-my-real-journal-it-missed-most-names)
  - [Turning up recall is fragile](#turning-up-recall-is-fragile)
- [The bigger gap: the private parts aren't PII](#the-bigger-gap-the-private-parts-arent-pii)
- [What I'd actually do](#what-id-actually-do)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Redaction isn't anonymization

These are three different jobs, and people mix them up:

- **Redaction** removes identifiers: names, emails, phone numbers, addresses, account numbers, keys.
- **Anonymization** means nobody can work out who the text is about, even with outside knowledge. "My sister, the week after our blowup at Thanksgiving" names no one, and anyone in my family knows exactly who and when.
- **Data minimization** means sending less in the first place.

Privacy Filter does the first job, and OpenAI says so: it is "not an anonymization tool, a compliance certification, or a substitute for policy review." For a journal, that difference is the whole story.

## The model

- **What it is:** a 1.5B-parameter mixture-of-experts model with about 50M parameters active per token. It started as a small language model and was retrained to label every token in one pass. A constrained Viterbi decoder then turns those labels into spans.
- **Eight categories:** person, address, email, phone, URL, date, account number, secret.
- **Getting it:** Apache 2.0 license, 128k-token context. Clone the [GitHub repo](https://github.com/openai/privacy-filter), run `pip install -e .`, and the first run downloads 2.8 GB of weights.
- **On a Mac:** the CPU works out of the box. The Apple GPU works only with `OPF_MOE_TRITON=0`, because by default it reaches for NVIDIA-only Triton kernels. Peak memory is about 4 GB on CPU and 6–9 GB on the GPU. A ~600-word entry takes about 7 seconds of model time on the GPU and about 40 on the CPU.

## On clean, made-up text, it's excellent

I gave it a sentence with a name, email, phone, street address, date, card number, API key and URL. It caught all eight and left everything else alone. It caught an AWS secret key, a GitHub token, and an email written out as "name at gmail dot com". It left Microsoft and Seattle alone.

When it was wrong, it hid too much: a git commit hash came back as a secret, a pizza place as a private address, and "born in 1985" as a private date. For logs and support tickets, that's the right way to be wrong.

## On my real journal, it missed most names

My handwritten journal gets transcribed into Markdown, and it isn't prose. It's gratitude lists separated by semicolons, boxed headings, arrows, and bullets that start with a name. I tested two real entries. I'm only reporting counts:

| Setting                | Entry A (mostly sentences) | Entry B (mostly lists) |
| ---------------------- | -------------------------- | ---------------------- |
| Default decoder        | 7 of 7 names               | **2 of 14 names**      |
| Recall-leaning decoder | 7 of 7, plus junk          | ~11 of 14, plus junk   |

On entry B, the default model found only the names in the short typed footer. Every name in the handwritten part got through, family and friends alike.

To show the failure without showing my journal, I wrote a made-up entry in the same format. The names are invented, and the phone number and email are fake on purpose. Here's what the default model did:

```text
- ☐ Weekend: [Date?] w/ Rosa                                          ← missed
1. Theo and I improving; Theo; wants to learn; Letting him lead       ← Theo ×2 missed
2. Made up with my sister; Marguerite; apologized first               ← missed
- Good advice from [Okonkwo?] @ Theo                                   ← both missed

Hmm, big fight w/ Rosa about money again, see if Dev talked to
[Priyanka?] about the holidays, yup.                                  ← all three missed

- FAMILY (boxed)
  - ↳ Stop yelling at Theo about homework                             ← missed
  - ↳ Dad's memory is getting worse
- Health (boxed)
  - ↳ Doctor follow-up for the knee
  - ↳ Rosa? → What date night can we do?                               ← missed
  - ↳ Lila [learn the card trick?]                                     ← missed

Call Marguerite at 206-555-0187 or marguerite.k@example.org before Friday.   ← all caught
Meet at 1407 Alder Lane, Bellingham on 2031-03-20.                            ← all caught
```

It caught 1 of the 14 names, the one sitting next to a phone number and an email. It caught every phone number, email, address and full date. **Names in clean prose or next to contact details get caught. Names in lists, bullets and bracketed guesses mostly don't.**

### Turning up recall is fragile

The decoder has six bias knobs for trading precision against recall, and the release ships with all of them at zero. I pushed two of them toward starting a span (`background_stay` −2.5, `background_to_start` +2.5):

- On real entry B, names went from 2 to about 11 of 14. It also started tagging "mac", "AI" and a section abbreviation as people.
- On an earlier draft of the made-up entry, it picked up five more names and tagged "Ruth" out of "Ruthlessly".
- On the version above, it changed nothing except tagging a ticket id as a person.

Same settings, very different results. Splitting one entry into sections also gave different answers than running the whole thing, because the decoder scores the whole sequence at once.

## The bigger gap: the private parts aren't PII

Even a perfect name detector would miss what I'd least want to leak. In the made-up entry above, these all went through untouched:

- **Conflict**: "big fight about money again", "stop yelling at him about homework".
- **Health**: "doctor follow-up for the knee", and more serious things in a real journal.
- **Family worries**: "Dad's memory is getting worse".

That's by design. None of these fit the eight categories, and the README says the label set is fixed: changing it means fine-tuning. Redaction can't fix this anyway. Delete every name, and "my wife," "money again" and "the week before the holidays" still say who and when to anyone who knows me.

## What I'd actually do

- **Structured data** (logs, tickets, exports): use it. It's fast, runs locally, and leans toward hiding too much, which is the right default there.
- **Personal writing**: layer it.
  1. **A word list** of family and friends' names. Boring and nearly complete, because I know who's in my life.
  2. **Privacy Filter** for everything else: contact details, keys, people I forgot to list.
  3. **A topic pass** for conflict, health and family. That means a fine-tuned model (`opf train` takes labeled JSONL) or a local LLM asked "would this identify someone, or embarrass them?"
  4. **Don't send it** if you can avoid it. Sending less beats redacting more.
- **Measure on your own text.** The headline 96% F1 is on a benchmark of tidy sentences. Across my two real entries, it caught 9 of 21 names.

It's a good building block, and OpenAI is honest about what it isn't. The mistake would be thinking "I ran it through the privacy filter" means "it's anonymized." If you journal with AI, see [how I process my journal](/process-journal) and [my AI second brain](/ai-second-brain).

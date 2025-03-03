---
layout: post
title: "Daily Journaling: From Psychic Diarrhea to Polished Turds"
permalink: /process-journal
tags:
  - emotional intelligence
  - how igor ticks
  - productivity
---

I've been doing [daily stream of consciousness journaling](/emotional-health#daily-stream-of-consciousness-journaling) since 2011, writing over a million words. Here's how I think about processing and analyzing my journal entries. While I don't always achieve this perfectly, this represents my aspirational process that I strive towards.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Handwriting vs Typing](#handwriting-vs-typing)
- [Automated Analysis](#automated-analysis)
- [Weekly Report](#weekly-report)
- [Journalling Workflow in 2025](#journalling-workflow-in-2025)
- [Journal Structure](#journal-structure)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Handwriting vs Typing

## Automated Analysis

## Weekly Report

Here's the corrected version with fixed typos:

## Journalling Workflow in 2025

I've always loved handwriting my journal entries - there's something special about the tactile experience and the way it helps me think. However, I switched to typing because being able to analyze and [search my daily journals](https://github.com/idvorkin/nlp/blob/cbc8dd8094b3d4e3a7331846538e5e945745baef/life.py#L337) was incredibly valuable.

Now, thanks to AI transcription capabilities, I can have the best of both worlds. Here's my Current Daily Workflow (this is my aspirational process - I don't always achieve it perfectly, but it's what I strive for):

1. **Brain dump my thoughts on Kindle Scribe (aka paper)**
   - Check yesterday's TODOs in OmniFocus and yesterday's Habit Tracker in Streaks app to prime my daily journal
   - Create a new notebook in my Kindle Scribe, named with the current date
   - Spend 10 minutes handwriting my stream of consciousness
     ![Me writing in my journal](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250302_191054.webp)
2. **Export/Sync to desktop**
   - Kindle only supports e-mail to yourself
   - It sends an e-mail that is basically "Hey here's a link to your PDF"
     ![Kindle Share Sheet](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250302_191410.webp)
3. **AUTOMATED** Get PDF URL from Gmail
   - I [CHOP](/chop)ed a [bespoke tool for this](https://github.com/idvorkin/settings/blob/db1ca0310d79c9db8b3cc7092cb14904a560eb6d/py/gmail_reader.py?plain=1#L813), via these 2 chats: [1](https://github.com/idvorkin/Settings/blob/db1ca0310d79c9db8b3cc7092cb14904a560eb6d/zz-chop-logs/2025-03-02_09-47-building-a-python-gmail-reader-app.md), [2](https://github.com/idvorkin/Settings/blob/db1ca0310d79c9db8b3cc7092cb14904a560eb6d/zz-chop-logs/2025-03-02_10-37-gmail-app-development-discussion.md)
     ![show gmail app](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250302_190312.webp)
4. **AUTOMATED** Take PDF URL, and [convert the handwriting to text](https://github.com/idvorkin/nlp/blob/cbc8dd8094b3d4e3a7331846538e5e945745baef/journal.py#L34)
5. Copy the transcribed text into my daily journal file
6. **AUTOMATED** [Extract TODOs](https://github.com/idvorkin/settings/blob/6ce73103b714e5b08ba19dc19856fc5a8ea549fc/py/todo_to_omnifocus.py?plain=1#L28) and move them to OmniFocus

This process preserves the benefits of handwriting (better thinking, more personal) while maintaining the ability to search, analyze, and process my journal entries digitally. It's a perfect blend of the analog and digital worlds.

## Journal Structure

Each journal entry follows a consistent template with sections that help me reflect on different aspects of my life:

**Commitments**

- What I committed to yesterday, and if I did it
- _I don't do this but should_
- This would be great to build a review cycle into my workflows

**Day awesome if**

- Listing out things I want done today
- _TODO: Really think through what matters, and only put it in if I'll do it_

**Yesterday was awesome because**

- Remembering what made yesterday great
- Specific events and accomplishments that made it special
- Building [momentum](/be-proactive)

**Journal**

- The main stream of consciousness section
- Where I process my thoughts and feelings

**Grateful for**

- Daily gratitude practice structured around:
  - God
  - Others
  - Self (Igor)

{% include summarize-page.html src="/grateful" %}

**Affirmations**

- Reinforcing positive beliefs and mindsets I want to cultivate
- _TODO: Reflect on how I lived these affirmations yesterday_

{% include summarize-page.html src="/affirmations" %}

**Psychic Weight**

- Processing any mental burdens or concerns weighing on my mind

{% include summarize-page.html src="/psychic-weight" %}

This structure helps ensure I cover key areas of reflection each day, from setting intentions to practicing gratitude and processing any mental burdens.

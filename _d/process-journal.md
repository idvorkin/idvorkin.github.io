---
layout: post
title: "Daily Journaling: From Psychic Diarrhea to Polished Turds"
permalink: /process-journal
tags:
  - emotional intelligence
  - how igor ticks
  - productivity
---

I've been doing [daily stream of consciousness journaling](/emotional-health#daily-stream-of-consciousness-journaling) since 2011, writing over a million words. Here's how I capture and process my entries. I don't always hit this perfectly - it's the process I aim for.

{% include ai-slop.html percent="55" %}

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Handwriting vs Typing](#handwriting-vs-typing)
- [Journalling Workflow in 2025](#journalling-workflow-in-2025)
- [Journal Structure](#journal-structure)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Handwriting vs Typing

I've always loved handwriting my journal. The tactile part matters - I think better with a pen than a keyboard, and the page feels more personal. But I switched to typing for years because I wanted to [search and analyze my entries](https://github.com/idvorkin/nlp/blob/cbc8dd8094b3d4e3a7331846538e5e945745baef/life.py#L337), and you can't grep paper.

AI transcription ended the tradeoff. I write by hand on a Kindle Scribe, then let a model turn the handwriting into text. I get the thinking benefits of pen and paper and a searchable, analyzable archive.

![Me writing in my journal](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250302_191054.webp)

## Journalling Workflow in 2025

The old version of this was fiddly. Every morning I created a fresh notebook on the Scribe, named it with the date, wrote, then emailed it to myself so a script could grab the PDF. A new notebook a day meant a long scroll of loose files with no easy way to flip back to last Tuesday.

Now I journal in one hyperlinked PDF instead of a notebook per day. A little Python script generates a blank template for a date range - I usually do a quarter at a time. Each month gets an index page, and every date on that index is a tappable link straight to that day's first page. The page header carries the same navigation: day-jump arrows, page tabs (1-5), and a home button back to the month index. On the Scribe I tap a date with my finger and land on it, so the whole quarter is one book I can page through instead of a pile of separate notebooks.

[Grab my blank template](/static/igor-journal-template.pdf) if you want to try it or fork it. It's empty - just the ruled sections and the tappable index.

Here's the round-trip:

1. **Generate the blank template** and get it onto the Scribe. Emailing it to my Send-to-Kindle address keeps the internal links intact, so the tappable index survives the trip.
2. **Write.** Coffee, ten minutes, stream of consciousness. I prime it by checking yesterday's TODOs in OmniFocus and my habit tracker.
3. **Export back out.** The Scribe bakes my ink into the PDF (flattened - the handwriting becomes part of the page) and I export the marked-up file to a Google Drive folder.
4. **Pull it down.** I sync that folder to my laptop with [`rclone`](https://rclone.org/). Each export is the whole growing notebook, so I only re-process the pages that changed since last time.
5. **Transcribe.** [Convert the handwriting to text](https://github.com/idvorkin/nlp/blob/cbc8dd8094b3d4e3a7331846538e5e945745baef/journal.py#L34) with vision OCR, drop it into that day's `750words` file, and [extract any TODOs](https://github.com/idvorkin/settings/blob/6ce73103b714e5b08ba19dc19856fc5a8ea549fc/py/todo_to_omnifocus.py?plain=1#L28) into OmniFocus.

The email path still works as a fallback - I [built a tool](https://github.com/idvorkin/settings/blob/db1ca0310d79c9db8b3cc7092cb14904a560eb6d/py/gmail_reader.py?plain=1#L813) that pulls the PDF link out of the Kindle share email - but Google Drive plus `rclone` is less friction than round-tripping through my inbox.

## Journal Structure

The template mirrors the sections I've journaled around for years. Each day is five pages.

**Page 1 - setup.** Four [affirmations](/affirmations), what I'm [grateful](/grateful) for, and Yesterday Awesome Because - the specific things that made yesterday good, which is how I keep [building momentum](/be-proactive). A habit strip runs along the bottom (Mobility / Gym / Meditate / Magic / Balloon) with a couple of blank to-do rows.

**Page 2 - intentions.** Today Awesome Because / Commitments: what I want done today, plus what I said I'd do yesterday and whether I actually did it. Then Notes for Larry, where I flag things for my [AI coach](/larry).

**Pages 3-5 - journal.** The open stream of consciousness. Where I process what's going on, including whatever [psychic weight](/psychic-weight) I'm carrying.

{% include summarize-page.html src="/grateful" %}

{% include summarize-page.html src="/affirmations" %}

{% include summarize-page.html src="/psychic-weight" %}

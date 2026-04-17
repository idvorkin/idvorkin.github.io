---
layout: post
title: "Igor's Life Journal"
permalink: /life-journal
---

A journal of random life observations. Keeping track of them so I don't forget what the world did today.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Instructions for Claude: Creating Journal Entries](#instructions-for-claude-creating-journal-entries)
- [Upcoming](#upcoming)
- [Diary](#diary)
  - [2026-04-17](#2026-04-17)
    - [Eight Sleep Thinks My Cat Is Me](#eight-sleep-thinks-my-cat-is-me)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Instructions for Claude: Creating Journal Entries

This is Igor's journal of life observations — moments worth recording but not essay-length. Think quantified-self mishaps, relationship moments, health observations, parenting stories, weird things the world did today.

When adding a new entry:

1. **Date Section**: Add new entries at the top of the Diary section with format `### YYYY-MM-DD`
2. **Entry Title**: Each individual vignette gets an `#### Entry Title` heading
3. **Length**: 2-4 short paragraphs per entry. If it wants to be longer, it probably wants to be its own post.
4. **Voice**: Plain and direct. Self-aware is fine; preachy isn't. Specific details over abstraction.
5. **Update TOC**: Regenerate the TOC with `:Mtoc update` (Igor will handle this if you skip it).

## Upcoming

- Future life vignettes will land here before they get written up.

## Diary

### 2026-04-17

#### Eight Sleep Thinks My Cat Is Me

Eight Sleep report this morning: HRV 213 ms on 4h 16m of tracked sleep. My average is ~42 ms. A 5× spike on a vacation night where I slept fine is not a biosignal — it's a measurement artifact. The parsimonious explanation: the cat was in the bed.

Turns out this is a known thing. Eight Sleep's pod uses [piezoelectric sensors under the cover](https://www.eightsleep.com/blog/how-the-pod-detects-your-breathing-and-heartbeats-without-a-wearable/) to pick up ballistocardiographic signals — basically the mattress vibrating from your heartbeat and breathing. A cat curled on the sensing zone puts its own heartbeat in the same waveform. Cat heart rate is 120–220 bpm; mine is ~60. The HRV algorithm mixes the two and produces numbers that look like I'm either dying or a Himalayan monk.

Eight Sleep [confirms it in their help docs](https://help.eightsleep.com/en_us/can-my-pet-or-child-sleep-on-the-pod-with-me-SJp6lxY9I): pets on the pod "affect accuracy of sleep data." Their [blog post on pets in bed](https://www.eightsleep.com/blog/pets-in-bed/) is friendlier about it — thick comforter between pet and cover, or just accept pet-nights as throwaway data.

Takeaway: the 213 ms reading goes in the trash, not the trend. Quantified-self tools are great until they're measuring your cat. Don't update your priors on vacation data when you know a confounder was in the bed with you.

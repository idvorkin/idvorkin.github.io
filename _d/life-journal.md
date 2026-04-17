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
    - [Four Pairs of Identical Glasses](#four-pairs-of-identical-glasses)
    - [Three Generations of Air Squats](#three-generations-of-air-squats)
    - [Vibe-Coding from the Passenger Seat](#vibe-coding-from-the-passenger-seat)

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

#### Four Pairs of Identical Glasses

Six months ago I got progressives and didn't like them. The workaround: keep wearing two regular pairs — distance and reading — plus prescription sunglasses. With regular sunglasses in the mix, that's four pairs of glasses I was rotating through my pockets. I have lots of pockets, but four pairs is too much even for me.

The friction I didn't count on: all the frames are identical. Every swap was a little decision — pull one out, is this the reading pair or the distance pair? Wrong guess, put it back, try again. Multiply by every time I moved between screen and room and sidewalk. None of it felt expensive in the moment; all of it added up.

Two weeks ago I just decided to fight through the progressives. Wore them, got through the adjustment, and now I can see great with them. One pair in the pocket, sunglasses in the car. The "workaround tax" — swap, fumble, pick the wrong one — was invisibly expensive for six months. Should have pushed through the adjustment period the first week instead of engineering my way around it.

<!-- TODO: add photos of the four identical frames -->

#### Three Generations of Air Squats

My dad used to just bust out air squats in the middle of whatever. Kitchen, living room, waiting for something to finish on the stove — ten squats, back to whatever he was doing. It wasn't a workout. It was a tic. He'd also do other random body-weight stuff: calf raises while standing in a line, a few pushups against a counter. The weirder the exercise, the better — that was the whole aesthetic.

Now I do it. I don't remember deciding to; it just showed up one day as something my body apparently learned by watching. Air squats while the kettle boils, calf raises at the sink, a few pushups against the desk between meetings. Zach has caught me at it plenty of times and given me the teenage eye-roll that says _please don't_.

Except: the other day, corner of my eye, I saw him trying it. An air squat in the kitchen when he thought nobody was looking. He will absolutely not admit it, and I did not say anything — call attention and the habit dies before it takes root. But it landed. Three generations of weird body-weight exercises, transmitted by osmosis. Things travel down the family line whether you want them to or not. The air squats got through.

#### Vibe-Coding from the Passenger Seat

Zach just got his license. He's driving the Tesla on autopilot, which means the passenger seat is mine and my hands are free. I don't need a laptop to use that time either. My phone is the keyboard. I fire a voice message at Telegram, a Claude agent on the dev VM at home picks it up, drafts, opens a PR, and pings me back. The car is an office, the phone is an IDE, and the infrastructure is a kid who finally turned sixteen.

This entry is the proof. The prompt that produced it was literally:

> "Life journal now that Zach can drive (well via auto poilot) I can be easily vibe coding form the car"

Followed a minute later by the meta refinement:

> "For the vibe coding, explain that I can even launch from my phone, give example from prompt to journal entry"

The agent read those two messages, wrote the paragraph you're reading, regenerated the TOC, pushed a branch, and opened a PR for me to review. I didn't type any of the markdown. I dictated two sentences from the passenger seat of a car driven by my teenager.

The part that keeps surprising me isn't the autopilot or the agent on its own — each one is a couple years old. It's the composition. Autopilot removes the driver's seat. The mobile agent removes the laptop. What's left is just me, the road, and a thought I can ship before we reach the next exit.

A couple hours later, same seat, same driver — this time dictating structural edits to [AI Operator](/ai-operator). [PR #548](https://github.com/idvorkin/idvorkin.github.io/pull/548) came out of it. One voice message added a section on parallel agents; another reordered the whole post. The agent rebased onto main, regenerated the TOC, and force-pushed. Two voice messages from the passenger seat, and the post has a new spine.

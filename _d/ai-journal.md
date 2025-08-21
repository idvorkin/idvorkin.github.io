---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal
---

A journal of random explorations in AI. Keeping track of them so I don't get super lost

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Visualization](#visualization)
- [Blog to bot](#blog-to-bot)
  - [RAG Challenges](#rag-challenges)
- [Text to speech our friends](#text-to-speech-our-friends)
- [RAG a psychiatrist](#rag-a-psychiatrist)
- [What I wrote summary](#what-i-wrote-summary)
- [Diary](#diary)
  - [2025-08-21](#2025-08-21)
    - [Psychic Shadows Gas Lighting](#psychic-shadows-gas-lighting)
    - [OMG I Did It Again - TWICE! Security Theater Fail](#omg-i-did-it-again---twice-security-theater-fail)
    - [The Claude Review Workflow Saga - When Good Intentions Break Everything](#the-claude-review-workflow-saga---when-good-intentions-break-everything)
  - [2025-08-17](#2025-08-17)
    - [Isolation](#isolation)
    - [Racoon Illustrations](#racoon-illustrations)
  - [2025-07-21](#2025-07-21)
    - [The Great Typo Fix Adventure: A Tale of AI, Automation, and Unexpected Consequences](#the-great-typo-fix-adventure-a-tale-of-ai-automation-and-unexpected-consequences)
  - [2025-07-20](#2025-07-20)
  - [2025-07-13](#2025-07-13)
  - [2024-10-27](#2024-10-27)
  - [2024-10-26](#2024-10-26)
  - [2024-10-20](#2024-10-20)
    - [Instead of watching a huberman, process with LLM](#instead-of-watching-a-huberman-process-with-llm)
  - [2024-08-26](#2024-08-26)
  - [Playing with Flux.1](#playing-with-flux1)
  - [2024-08-13](#2024-08-13)
    - [Aider take #12](#aider-take-12)
    - [Awesome talks](#awesome-talks)
    - [Working through making Neural Nets](#working-through-making-neural-nets)
  - [2024-07-31](#2024-07-31)
    - [Auto code editing (via Aider) - TOO Soon](#auto-code-editing-via-aider---too-soon)
  - [2024-07-30](#2024-07-30)
    - [Agenic Frameworks](#agenic-frameworks)
  - [2024-06-22](#2024-06-22)
    - [Next Gen Models](#next-gen-models)
    - [Lots of progression on Evals](#lots-of-progression-on-evals)
  - [2024-04-06](#2024-04-06)
  - [2024-03-24](#2024-03-24)
  - [2024-02-03](#2024-02-03)
  - [2024-01-27](#2024-01-27)
  - [2023-11-26](#2023-11-26)
  - [2023-08-17](#2023-08-17)
  - [2023-07-16](#2023-07-16)
  - [2023-07-15](#2023-07-15)
  - [2023-07-04](#2023-07-04)
  - [2022-12-25](#2022-12-25)
    - [First Real AI Feature - GPT Writing My Commit Messages](#first-real-ai-feature---gpt-writing-my-commit-messages)
  - [2022-12-18](#2022-12-18)
    - [Creating the NLP Repository](#creating-the-nlp-repository)
  - [2021-12-30](#2021-12-30)
    - [First GPT Commit](#first-gpt-commit)
  - [Related posts](#related-posts)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## Visualization

## Blog to bot

Join the [discord here](https://discord.gg/S2s24P6JtU), and then just '/ask'. See the source [on github](https://github.com/idvorkin/nlp/blob/d9f24b7aa5a046f78147c2e53144a9258c91894f/qa_blog.py?plain=1#L393)
Standard workflow,
chunk blog -> Embedding(chunk) -> vector DB <- Retrieve <- Project Inject <- Rago
this begs the Q what to chuck, and how to chunk it

Useful features:

- ☐ Do an offline evaluation model for various retrieval approaches.
- ☑ Give the answer
- ☑ Link back to specific pages
- Link back to the specific anchors
- TBD Ask follow up questions

Open Questions

- Does back link data help?
- Does a smarter retrieval strategy help?
- Play w/cRAG?

### RAG Challenges

- Some words don't map, so terzepatide doesn't pick up my terzeptatide blog post. Diet doesn't match terzepatide
- Chunk size vs relevance
- My time off posts keep getting picked up since their template has good stuff, but content is light

## Text to speech our friends

Well that was super easy, eleven labs has perfect instant voice clones, and what's coolest is you
can clone in multiple languages, so you can hear yourself talking in lots of languages. Let me give a sample

This took me about 30 minutes to setup - crazy!!

[The code](https://github.com/idvorkin/nlp/blob/38193de32fff308ee292fa368799d804343b6336/tts.py?plain=1#L50)

## RAG a psychiatrist

OK, I used to go to this psychiatrist, who had a full "consistent model" of psychiatry

[here](https://whatilearnedsofar.com/practice/)

lets see if we can simulate him, step #1, lets bring the site down into markdown

1. Lets use <https://github.com/paulpierre/markdown-crawler>:
2. pip install markdown-crawler
   markdown-crawler <https://whatilearnedsofar.com/practice/> --output-dir ./practice

## What I wrote summary

- I tend to write a fair bit over a time span, and forget what I did. I used a simple [git log stat creator](https://github.com/idvorkin/settings/blob/7c747bf7061a2da774faedd6efe14fdff547e92d/shared/zsh_include.sh?plain=1#L133) to see it, but it was too simple
- Turns, out LLMs are a great way to do this. So I wrote an [app for it](https://github.com/idvorkin/nlp/blob/303d7c58265b647dead79ccdbaeafd0cab58d1a0/changes.py?plain=1#L211). It does [great summaries](https://gist.github.com/idvorkin/7f457ef75330f5faee8c9a82a3d0d820). Inlining changes to this app as follows:

  - [changes.py](https://github.com/idvorkin/nlp/blob/303d7c58265b647dead79ccdbaeafd0cab58d1a0/changes.py)
  - Creation of a new Python script to handle Git diffs and summarize changes using OpenAI.
  - Major functionalities include:
    - Asynchronous retrieval of file diffs from Git using specified commit ranges.
    - Summarization of changes in files between two commits.
    - Filtering out specific files (e.g., Jupyter notebooks and back-links.json).
    - Environment setup for OpenAI API key from a secrets file.
    - Generation of prompts for OpenAI to summarize and rank changes based on impact.
    - Command-line interface implementation using Typer for user interaction.
  - Functions to interact with Git:
    - Retrieval of repository path from Git remote URL.
    - Fetching first and last commit hashes within a specified date range.
  - Obtaining a list of changed files between two commits.
  - Utilities for handling dates and generating summaries:
    - Function to calculate tomorrow's date.
    - Prompt generation for summarizing and reordering file changes.
  - Logging and debugging setup with Loguru and PuDB.

## Diary

### 2025-08-21

#### Psychic Shadows Gas Lighting

- **The Panic**: I KNEW I had written about psychic shadows - was I going crazy? Had I imagined writing an entire blog post?
  - For 20 minutes I searched everywhere - `grep -r "psychic shadows"`, `find . -name "*shadow*"`, even manually browsing the `_d/` folder
  - Nothing. Absolutely nothing. Starting to doubt my own memory.
  - **Then it hit me** - that custom raccoon illustration I'd commissioned! The raccoon casting a spell!
  - Rushed to my images repo and there it was: https://github.com/idvorkin/blob/raw/master/blog/racoon-power-word.webp
  - One git command later and I had my proof: `git log --all -S "racoon-power-word" --source`
  - I wasn't crazy - the file HAD existed!
- **The history**:
  - Originally created on July 18, 2025 ([commit 38d87330](https://github.com/idvorkin/idvorkin.github.io/commit/38d87330)) as "crafting spells to banish ruminating thoughts"
  - Added image features ([commit bab47de6](https://github.com/idvorkin/idvorkin.github.io/commit/bab47de6)) - a very lucky last commit or I'd never have found it.
- **The Shocking Discovery**: File was deleted in [PR #67](https://github.com/idvorkin/idvorkin.github.io/pull/67) ([commit e73324f9](https://github.com/idvorkin/idvorkin.github.io/commit/e73324f9))
  - **PR title**: "Add random page navigation feature"
  - **Actual changes**: Also randomly deleted an entire page!
  - 251 lines of carefully crafted content about mental health - gone
  - Likely cause: Merge conflict resolution gone wrong or accidental staging
  - The PR summary never mentioned deleting psychic-shadows.md


- **The Numbers Don't Lie - Everyone Failed**:
  - **7 AI code reviews** in 31 minutes (21:48 to 22:19)
  - **10+ sets of eyes** on this PR (Claude Code, Claude Review Bot, Cursor Bot, and me)
  - **500+ words of review feedback** praising the "clean implementation"
  - Claude Review Bot found 3 type safety bugs but missed 251 lines of content being deleted
  - The bots spent more time debating `T | undefined` than noticing an entire article had vanished
  - **Final verdict from all reviewers**: ✅ **Approve** - "Ready for merge"
  - **Reality**: An entire blog post about mental health was being silently assassinated
- **Today's rescue**: Restored the file with [commit 7699f2b2](https://github.com/idvorkin/idvorkin.github.io/commit/7699f2b2) "Putting file back"
- **Lesson learned**: Always review PR diffs carefully! Unrelated files can accidentally get swept up in commits, especially during merge conflicts or when working with local settings files.

#### OMG I Did It Again - TWICE! Security Theater Fail

- **The Setup**: I'm so proud of my isolation setup!
  - Claude running in its own GitHub account (can't mess up my main repos!)
  - Running in its own container (can't mess up my machine!)
  - Perfect isolation, right? **WRONG!**
- **The Facepalm Moment**: Wait... Claude is pushing directly to main?!
  - All that isolation theater, and the AI agent can just... push to main
  - No PR required, no reviews, just straight to production
  - Evidence: [commit 4e020c54](https://github.com/idvorkin/idvorkin.github.io/commit/4e020c54) and [commit 569b5022](https://github.com/idvorkin/idvorkin.github.io/commit/569b5022) - both pushed directly!
  - Like putting a bank vault door on a tent
- **The Discovery**: Found I had a GitHub ruleset that SHOULD prevent this
  - It was **DISABLED** 🤦
  - Link: [GitHub Rulesets Settings](https://github.com/idvorkin/idvorkin.github.io/settings/rules)
  - The protection was there all along, just... turned off
- **The Irony**:
  - Spent hours setting up container isolation
  - Spent days configuring separate GitHub accounts
  - Forgot to flip the "on" switch for the most basic protection
- **Lesson Learned**: Security is hard to get right!
  - You can have all the right pieces but one misconfiguration ruins everything
  - Defense in depth only works if all the defenses are actually... defending
  - Always verify your security assumptions - "trust but verify" applies to your own setup too
- **Q&A - "Why is the AI a collaborator at all?"**
  - Q: Why not have Claude fork the repo and make PRs from its own account?
  - A: Because the code review bots don't support cross-repo PRs! 🤦
    - Copilot won't review PRs from forks
    - Claude review bot needs repo access
    - Cursor bot... same story
  - So we're stuck giving the AI collaborator access just to get automated reviews
  - Which means trusting branch protection rules to be... you know... ENABLED
  - The irony: We need to give more access to get better security reviews
  - **Groan**... security is REALLY hard to get right

#### The Claude Review Workflow Saga - When Good Intentions Break Everything

- **The Problem**: Claude Code Review had been failing on EVERY PR since August 17th with mysterious "Invalid OIDC token" errors
  - Someone (probably me via AI) had "fixed" the workflow to support fork PRs by changing from `pull_request` to `pull_request_target`
  - Classic case of "the fix that breaks everything else"

- **The Wild Goose Chase**:
  - First hypothesis: OIDC tokens don't work with `pull_request_target` - let's add `github_token`!
  - Created PR #120 to add the token - still failed
  - Tested from a fork (PR #121) to be thorough - also failed
  - The beta Claude action just wasn't compatible with `pull_request_target` events

- **The Real Fix**: Sometimes you just have to admit defeat and revert
  - PR #122: Reverted to the original `pull_request` event that actually worked
  - Lost fork PR support, but gained back ALL regular PR reviews
  - Better to have 95% working than 100% broken

- **Bonus Discovery**: While debugging the Vitest workflow force-push failures
  - Found branch protection rules were set to `~ALL` instead of just `main`
  - This was blocking pushes to PR branches, test-results branch, everything!
  - One setting change fixed multiple mysterious CI failures

- **Lessons Learned**:
  - Beta actions + complex GitHub events = pain
  - Branch protection rule of `~ALL` is almost never what you want
  - Sometimes the clever solution (`pull_request_target`) is worse than the simple one
  - When in doubt, check what worked before and just use that

### 2025-08-17

#### Isolation

- HOORAY got ISOLATION working. Ugh, took a very long time; some of the pain points:
- Claude Docker configs live here: [Settings/claude-docker](https://github.com/idvorkin/Settings/tree/master/claude-docker).
  What does isolation mean? - Running in its own GitHub account so it can't mess up the main repo - Running in its own container so it can't mess up my machine - GOAL: Increase time between interventions!
  - Many Problems:
    - Stuff on the main account (like co-pilot code review, aren't free for other accounts doing PRs)
    - Linux/arm64: lots of broken things and few prebuilt binaries.
  - After many false attempts (container terminal tweaks), turned out the root cause was zsh being hardcoded in my .tmux.con. Attempts logged in [Settings commit c03df99](https://github.com/idvorkin/Settings/commit/c03df99adf673707e912d4b03451b172b88c8d45).
  - Fix: made zsh path conditional in tmux for containers. See [Settings commit 3480d36](https://github.com/idvorkin/Settings/commit/3480d3649647424e9be42e3b3648c6786795abec).
  - Current problems
    - Still can't paste images in.
    - Need to auth to claude in every container
- Had to stop being weird: removed `cd`→`zoxide` alias that broke agent/Claude commands; restored default `cd`.
  - The alias intercepted directory changes, causing tool-run shells to misbehave. Commented it out to unblock automation. See [Settings commit e5eabb4](https://github.com/idvorkin/Settings/commit/e5eabb4567960368f9ff18b3531b570b0b87fdb1).
    REMEMBER:
- Always have a 2-monitor setup — iPad works great as a second display.
  ![iPad as second monitor — dual-screen setup increasing horizontal space for agents](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250817_091532.webp)
- I need to be careful as I can just get sucked down rabbit holes; instead I need to think through what I want to accomplish and only do that. And I probably need to time-box so I don't spend too much time. This is even easier to mess up when doing more than 1 thing at once

#### Racoon Illustrations

- Not sure why it took me so long but added a [script](https://github.com/idvorkin/idvorkin.github.io/blob/9cacbdfc0867e0a5cb98f1a2e1e780116d3dfecb/scripts/generate_eulogy_images.py?plain=1#L14) to generate raccoon image (was manually doing it from chatgpt chats, bleh)
- Redid [eulogy](/eulogy) images.

### 2025-07-21

#### The Great Typo Fix Adventure: A Tale of AI, Automation, and Unexpected Consequences

Today marked an interesting milestone in AI-assisted development. We asked Claude Code to fix typos across the entire blog, which led to [PR #54](https://github.com/idvorkin/idvorkin.github.io/pull/54) - a seemingly simple task that turned into a perfect case study of both the power and pitfalls of AI automation.

**What Was Supposed to Happen:**

- Claude Code would scan through `_d`, `_posts`, and `_td` directories
- Fix only typos (spelling, grammar, technical terms)
- Create a clean PR with "no functional changes"

**What Actually Happened:**
Claude Code did fix 772 lines of legitimate typos (critcal→critical, mechansims→mechanisms, Kubertnetes→Kubernetes, etc.), but it also made several semantic errors that were caught by Cursor's automated review bot:

![Cursor bot flagging satisfaction formula semantic error - showing the formula was incorrectly reversed from "What you want / what you have" to "What you have / what you want", fundamentally changing the meaning of satisfaction calculation](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_195813.webp)

**The Semantic Error:**
Most notably, Claude accidentally reversed the satisfaction formula from `satisfaction = what you want / what you have` to `satisfaction = what you have / what you want`. This completely inverted the meaning - the original correctly shows satisfaction decreasing as wants increase, while the reversed version counterintuitively suggests satisfaction increases when wants exceed possessions.

**The Self-Correction:**
The beautiful part? Claude Code automatically detected and fixed its own error! After Cursor bot flagged the issue, Claude recognized the problem and responded:

![Claude's response acknowledging the semantic error and confirming the revert - "You're absolutely right - this was a semantic change, not a typo. I've reverted it in commit b4c2e0b to keep the original formula 'What you want / what you have'"](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_195915.webp)

Claude then:

1. Recognized the semantic problem
2. Reverted the satisfaction formula change
3. Created a clean follow-up commit: "Revert satisfaction formula change"

This story perfectly illustrates the current state of AI development: incredibly powerful for bulk tasks, but still requiring human oversight (or in this case, bot oversight) for semantic accuracy. The fact that Claude could self-correct when the error was identified shows the promise of AI-assisted development workflows.

### 2025-07-20

- Logs which created this entry: [link](https://github.com/idvorkin/idvorkin.github.io/blob/d5d20a8a0652ca22f72bd96deae328eaca44f0b4/zz-chop-logs/2025-07-20_20-53Z-document-today-s-project-updates.md)

- Read [Brute Squad](https://sourcegraph.com/blog/the-brute-squad) by Steve Yegge
  - **The REAL Car-Cleaning Evolution:**
    - Traditional coding = You personally licking your car clean (the old way)
    - The AI Hype/Promise = "You'll have a car wash!" (what everyone's selling)
    - Current Reality = Your "car wash" is actually just camels licking the car
      - Weird, messy, unpredictable
      - Sometimes they "delete your repo and send weenie pics to your grandma"
      - BUT still somehow faster than human spit
  - **Current Reality with Multiple Agents = You become "The Brute Squad" with 5-10 camels**
    - Now you're juggling multiple camel-bird-baby-whatevers
    - They're all squawking and hungry
    - You can't leave because they need constant supervision
    - But the collective licking power is undeniable
    - You're addicted to the chaos because it's SO productive
- Decided lots of agents need more horizontal space
- Added another monitor

![Dual monitor setup showing two large curved monitors on a desk with code/terminal windows open, against a bright green wall - the new monitor setup providing more horizontal space for AI agents](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_135228.webp)

- Got Claude Code
- Updated to $100/month subscription based on what bestie told me

![Text conversation showing discussion about Claude Code usage and subscription pricing, with messages about upgrading from $20/month to $100/month plan after recommendation about LLMs being important for productivity](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250720_135628.webp)

- Starting doing PRs - created 4 PRs today, 3 merged:
  - [nlp#11](https://github.com/idvorkin/nlp/pull/11) ✅ "feat: add Kimi AI provider support with --kimi flag (default enabled)"
  - [nlp#12](https://github.com/idvorkin/nlp/pull/12) 🔄 "feat: add comprehensive e2e tests for Kimi AI functionality" (open)
  - [settings#3](https://github.com/idvorkin/Settings/pull/3) ✅ "Add Claude Code detection to tmux_helper window renaming"
  - [chop-conventions#2](https://github.com/idvorkin/chop-conventions/pull/2) ✅ "docs(dev-inner-loop): add PR workflow documentation for AI-assisted development"
  - All generated with Claude Code 🤖
- Updated blog default image from bunny ears to raccoon-imagination-executed-sustainably.webp
  - Simple one-line change in \_includes/head.html
  - Created PR with Claude Code assistance

### 2025-07-13

Wow - it's been a LONG while before I added journal entries

- Yesterday my friend nerd swiped me with the optimum number of donuts to make problem:
- I one shotted it (well maybe 10 shot) with gemini coding cli (just like the other ones)
  ![AI agent interaction summary showing performance metrics: 27 tool calls with 96.3% success rate, 94.1% user agreement, 38m 29s total wall time with detailed breakdown of API vs tool usage time and model token consumption using gemini-2.5-pro](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250713_071230.webp)
- You can see output on: [Donut Profit Calculator App](https://abrupt-carpenter.surge.sh/)
- And Git Project: [GitHub Repository](https://github.com/idvorkin/donut-profit-calculator)

I also used gpt to illustrated and partially write the updates to this blog based on content from "What I learned so far".

{%include summarize-page.html src="/mental-pain"%}

- Image generation takes a while - but I love it. Agent based apps is super "human input time" effecient, but the wall time is annoying, it's easy to forget what you're trying to do context. I'm guessing we'll need toolls to help us do the "N-slow" tasks at once as it's easy to forget the damn goals

- Creating customGPTs from a bunch of content from my old pychiatrist
- Using chatgpt to figure out what I should/how I should pack crap in my car

- COOL LEARNING:
  - You can use surge to deploy to static web sites - nicer then clogging up my blog
  - gemini cli sandbox is mostly worthless

### 2024-10-27

- Use AI to help and [evaluate performance reviews](https://github.com/idvorkin/nlp/blob/55a2e50d2f02f7660dbbf101d12c7a1e3368e947/eval/eng-feedback/promptfooconfig.yaml?plain=1#L80)

### 2024-10-26

- Use Semantic Search for similar websites to what im [thinking about](https://github.com/idvorkin/nlp/blob/55a2e50d2f02f7660dbbf101d12c7a1e3368e947/think.py?plain=1#L296) e.g. thinks like [this page](https://gist.github.com/idvorkin/94fb8420a973e61ee5f1b61be926ecaf#---exaai-related-search-results---)
  ![Screen shot of related web results](https://raw.githubusercontent.com/idvorkin/ipaste/main/20241027_093056.webp)

### 2024-10-20

Instead of having to write the code myself, I can have aider upgrade my code to use the latest claude models:

[Aider code upgrade example](https://gist.github.com/idvorkin/2f30c4f7ca2c45ab8fa534ebaeedc1e5)

![Aider code upgrade example](https://private-user-images.githubusercontent.com/280981/379853492-dad3d891-15cd-4cae-b4c2-955696409002.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mjk3ODcwNjIsIm5iZiI6MTcyOTc4Njc2MiwicGF0aCI6Ii8yODA5ODEvMzc5ODUzNDkyLWRhZDNkODkxLTE1Y2QtNGNhZS1iNGMyLTk1NTY5NjQwOTAwMi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMDI0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTAyNFQxNjE5MjJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04YjBkYjA2NTVjOWJjNjcxYWNmMjIzYTI1Y2I2ZGI2YjM4NWI4NGM4YmQ2MjE2NzA3MjMzZWYzNDhjNDYxMWY0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.o2ZieBjjVVuYkP3vUgLPk8aEKT4LILmFyipVefHmUlU)

Which makes these links:

- [Commit 1](https://github.com/idvorkin/nlp/commit/e28a62cdc30f74d4344bc05229d6cc6debe610dd)
- [Commit 2](https://github.com/idvorkin/nlp/commit/5f8c1fdd145514210c701269643febc115b2de5c)

#### Instead of watching a huberman, process with LLM

- Finally the [output of exercises](https://gist.github.com/idvorkin/2e3111a07531fefb11e789144e1c372f)

* Pull down the transcript with yt-dlp

```bash
yt-dlp --write-auto-sub   --skip-download https://www.youtube.com/watch\?v\=kgr22uMsJ5o
```

- But it's too big, ~ 1M tokens thanks to the VTT format.
  - Good enough to stick into google gemini
  - GROAN, of course that doesn't work since output limit.
- Sigh, lets upgrade our captions processing - luckily, I've played with this before:
  - [Captions](https://github.com/idvorkin/nlp/blob/c050626b4f88ffb09622938d1bb5c55c2e05618a/captions.py?plain=1#L21)
  - What's great is I basically wrote this code using Aider.
- OK Lets run it:

```bash
cat ~/tmp/t/show.vtt | ./captions.py to-human | tee show.md
```

- Tada here it is on [gist](https://gist.github.com/idvorkin/1e8571c2f8f4de612a9671a301cfad5a)
- And it's small enough I can process it in fewer shots

```bash
❯ cat show.md | gpt tokens
25313
```

- Interesting, tryign to get the chatgpt website to read the file fails, even though it fits into the context window.
  - ChatGPT:
  - I could work around this by working with the API, but for chat I prefer using UX, and its cheaper with these big files
- Back to [google vertex](https://console.cloud.google.com/vertex-ai/studio/), which is working well at this file size
- Finally the [output of exercises](https://gist.github.com/idvorkin/2e3111a07531fefb11e789144e1c372f)

### 2024-08-26

### Playing with Flux.1

<https://replicate.com/ostris/flux-dev-lora-trainer/train>

[Model Merge](https://replicate.com/lucataco/flux-dev-multi-lora?prediction=ajkd29fje9rj40chjk58gztxy8)

Loras we can mege:

- idvorkin/idvorkin-flux-lora-1
- Merge Real and Boring - [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) - Keyword is photo

- We can also mege with just the name of the other Lora. [Me and Sue Johnanson](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=v7wyfv05c1rm20chjkrb7c9w9m)

The model I trained:

The [model](https://replicate.com/idvorkin/idvorkin-flux-lora-1) on [hugging face](/idvorkin/idvorkin-flux-lora-1) - idvorkin/idvorkin-flux-lora-1

![Igor doing something](https://replicate.delivery/yhqm/CRLshgbk5ZomNp7GxHSISkMrtynHNufLEZJpFHCa7lcGvXrJA/out-0.webp)

Prompt: _Hyperrealistic photograph of a bald, middle-aged man named Idvorkin, wearing single-colored yellow glasses. He has a slightly heavier build, standing at 5'8" and weighing around 175 lbs, with a sturdy, solid frame. Idvorkin is in the middle of performing a kettlebell swing with perfect form. He is holding a heavy kettlebell with both hands, swinging it up to chest height, with his muscles engaged and a look of concentration on his face. The background is a beach at sunrise, and the lighting is bright and focused, highlighting his effort. The mood is intense and determined. Idvorkin is dressed in athletic wear, including a fitted "cat in the hat Dr. Seuss" t-shirt and shorts. Shot with a normal 35mm camera lens, rendered in high resolution. Realistic skin texture, detailed muscle definition, and a dynamic, energetic atmosphere_

Image:

Models to try:

- [XKCD](https://replicate.com/pellmellism/xkcd?prediction=cgj9dyad6srm00chj5pbgjm4cw)

### 2024-08-13

#### Aider take #12

OK, so Aider tries to make every change its own commit, which is super noisy and error-prone, a few learnings:

1. Do the changes on a branch then squash up the final branch
2. You need to have unit tests, let Aider create them (I've got to figure out how to let it name them)

Here's [a change almost totally done with Aider](https://github.com/idvorkin/Settings/commit/234bdca31c4c44b2916de13c5fa858d83cbfe5cf)

#### Awesome talks

OK, so turns out [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) Has amazing talks, I watched several, including his great talk on security. Which insipired me to create [AI Security](/ai-security)

#### Working through making Neural Nets

See: <https://karpathy.ai/zero-to-hero.html>

### 2024-07-31

#### Auto code editing (via Aider) - TOO Soon

OK, so, copilot tends to be just a code completion, which is pretty meh. Ideally it could do more complex changes, like find code that would be good to refactor then make those changes. [aider](https://aider.chat/) is supposed to that, but in my expereince, it just made stuff wrose and was slower then me making the cahnges myself. I guess I'll try again in a while.

### 2024-07-30

#### Agenic Frameworks

- Zep: Agent Memory
- Crew-AI - Agent Co-ordination
- Agent-Zero: Single Agent

### 2024-06-22

#### Next Gen Models

Claude 3.5 Sonnet just came out. Sonnet is Anthropics Medium model. It has the same performacne envelope as GPT-4o, making me assume GPT-4o is also the medium model. What's interesting, it initially OpenAI marketted GPT-4o as a 4x faster 2x cheaper GPT-4 Large model, but honeslty I think it' sjust the medium. That means either the medium Gpt 4.5 large is coming, or it's performance envelope isn't worth it.

Model classes: - Price/Latency/Performance

#### Lots of progression on Evals

Check out the great documentation at promptfoo, including redteaming I thgues sthat'll be a big thing soon. - <https://promptfoo.dev/docs/guides/llm-redteaming>

### 2024-04-06

- Containerize Bot

  - Secret Injection
  - Auto Starting

- Retrieval
  - Better Observability
  - Better Retrieval Strategies
  - Chunk Manager Book my chapters

### 2024-03-24

- Made a kettle [bell swings viewer](https://gist.github.com/idvorkin/c1e201ad1a1c90069fc51bf11fa37817#pre-commit-configyaml):
- Did a what I wrote in git summary (see section above)

### 2024-02-03

- TL;DR: While upgrading my improv coach bot, it refused to do any coaching. I had to spend 1.5 hours adjusting the prompt till it worked.
  - When you look at the [diff](https://github.com/idvorkin/nlp/commit/6eca0560202696f93f954f3b46d8350d66e3a247) it looks obvious, but this stuff is alchemy groan.
- I built an improv bot way back before openai supported function calls.
- Of course, all the APIs broke in the last 6 months, so I decided to upgrade it.
- Worked pretty well, about 2 hours to figure out the new spellings of things,
- But then the model kept refusing to extend my improv story. I wasted a full hour trying to figure out how to change the prompt.
  - Pretty surprising given this was GPT-4

### 2024-01-27

- OpenAI released new embedding models
- Restarted playing with using [RAG on my blog](https://github.com/idvorkin/idvorkin.github.io/blob/7e7617f6bb563e4428e4f8595709f54229d9750e/scripts/qa_blog.py?plain=1#L82)
  - Works better than before, maybe since GPT-4 is faster, and I'm using it by default now
- Biggest challenge is how to do the document chunking. Playing around with keeping global context on chunks (hard)
- Also building [latent space search for my journal entries](https://github.com/idvorkin/nlp/blob/7d5cfc124cea08c5343f32140ff78fc667a36431/life.py?plain=1#L386)
  - Interesting observation here, the embedding vector is bigger than the source
  - 750 words = 750\* 8 letters/chars per word = 6K bytes
  - Embedding = 3K \* 4 bytes = 12K
- I used to worry about the embedding model endpoint being leaked for my journal entries, but I think I'm now assuming OpenAI is trustworthy.
- In theory I can search my journal corpus through 3 approaches (which I'll blend):
  - Lexical -> regexp search
  - Semantic -> vector similarity
  - Structured -> LLM to create structure (maybe do semantic over that)

### 2023-11-26

- Found content on red teaming
- Found out new models like Orca and they are pretty darn fast on GPT4all
- Updated my code to use the latest OpenAI models
- Updated my code to use langchain
- Fixed up journal to have stuff again

### 2023-08-17

- Playing with Autonomous Agents
  - AutoGPT
  - GPTResearcher
  - Both of these run through docker-compose. Kind of nice as 1/ runtime sandbox, 2/ environment mess up avoidance
- Playing with new LangChain Syntax
- Figuring out that I can use debugger to attach so I can debug easily. Figured out how to hook all typer commands (wish I knew that earlier)

### 2023-07-16

- Doing Q&A for my blog w/ChromaDB and LandChain
  - Bleh, Langchain is hard to grok, changing on the daily
  - <https://github.com/idvorkin/idvorkin.github.io/blob/master/scripts/qa_blog.py?plain=1#L99>

### 2023-07-15

- Had a very clever idea to 1/ make my convo files markdown, giving me completion from CoPilot
- Having GPT prompt default answer in [markdown with line separators](https://github.com/idvorkin/nlp/blob/ed56c29719a8a8f53ffd10513ec96d3895a25076/convos/default.convo?plain=1#L1) so that it was clear the answers from the bot
- e.g. <https://gist.github.com/idvorkin/98cfaa4bea8e4f9cc113ff978612518e>

### 2023-07-04

- Weight and Biases LangChain Traces
  - <https://docs.wandb.ai/guides/prompts/quickstart>
  - See each call to the model

```zsh
export LANGCHAIN_WANDBB_TRACING=true
export LANGCHAIN_WANDB_TRACING=playing-around
```

- Consider a better git commit message generator... Including nested calls. Checkout

<https://github.com/zurawiki/gptcommit/blob/main/prompts/summarize_file_diff.tera>

- Using AI chat in co-pilot on nightlysf

Use meta -I (e.g. Alt-I) e.g. AI :)

### 2022-12-25

#### First Real AI Feature - GPT Writing My Commit Messages

- *Note: This entry was backdated and created on 2025-08-21*
- **First Real Feature** ([commit 0c4f253](https://github.com/idvorkin/nlp/commit/0c4f253)):
  - Added a `commit_message` command to gpt3.py
  - GPT could now write git commit messages from diffs!
  - The prompt: "Write a commit message for the following diff, with a headline and then a paragraph of more details"
  - This was revolutionary - AI helping me document my AI experiments
- **Early Experiments** (Dec 25-31, 2022):
  - `default.convo`: AI life coaching and programming conversations
  - `igor_journal.py`: Analyzing my own journal entries with GPT
  - Already trying to get GPT to fix my spelling errors!
- **What This Meant**:
  - Already seeing the potential for AI to analyze personal writing
  - The recursive beauty: Using AI to help build AI tools
  - This wasn't just playing with APIs anymore - it was becoming a mission
- **Reflection**: The speed of iteration was insane - from "This is a test" to analyzing my journal and generating commit messages in just one week. The addiction had begun.

### 2022-12-18

#### Creating the NLP Repository

- *Note: This entry was backdated and created on 2025-08-21*
- **Context**: 18 days after ChatGPT launched (Nov 30, 2022), probably mid way into a big chunk of time off
- **The Repository**: Created [github.com/idvorkin/nlp](https://github.com/idvorkin/nlp) ([initial commit](https://github.com/idvorkin/nlp/commit/24d5b65))
- **Missing NLP history**
  - Dec 2021 - Mar 2022: Experimented with GPT-3 in LinqPadSnippets ([see full history](https://github.com/idvorkin/LinqPadSnippets/commits/b714e7dbdd10153f5308ec690619898f363df200/python/gpt3.py?before=b714e7dbdd10153f5308ec690619898f363df200+35))
  - Mar 13, 2022: Deleted gpt3.py ([commit 55df7b7](https://github.com/idvorkin/LinqPadSnippets/commit/55df7b7)) - "Moving to NLP"
  - 9-month gap: ???
  - Dec 18, 2022: Created nlp repository for all the NLP stuff to be unified?
- **The Evolution** from 2021 code:
  - 2021: Simple 5-line script
  - 2022: Full CLI with typer, rich formatting, multiple models (text-davinci-003, code-davinci-003)
  - Secret management, custom commands, prompt engineering

### 2021-12-30

#### First GPT Commit

- *Note: This entry was backdated and created on 2025-08-21*
- My [first GPT commit](https://github.com/idvorkin/LinqPadSnippets/commit/9b62510abd6b6c6ec8b7ade35127fa094eb51ea0) - December 30, 2021
  - 11 months before ChatGPT launched (Nov 30, 2022)
  - Using GPT-3 Completion API with davinci engine
- **The Code**:
  ```python
  import os
  import openai

  openai.api_key = os.getenv("OPENAI_API_KEY")
  response = openai.Completion.create(
      engine="davinci",
      prompt="This is a test",
      max_tokens=5
  )
- Used the original "davinci" engine (not even GPT-3.5 yet!)
- "davinci" was the top model - no GPT-3.5-turbo, no GPT-4
- APIs were brand new and documentation was sparse
- "davinci" model cost $0.02/1K tokens (10x more than GPT-3.5-turbo later!)
  ```

### Related posts

{%include summarize-page.html src="/ai-talk" %}
{%include summarize-page.html src="/ai-art" %}
{%include summarize-page.html src="/gpt" %}

---
layout: post
title: "Igor's AI Journal"
permalink: /ai-journal
---

A journal of random explorations in AI. Keeping track of them so I don't get super lost

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [Instructions for Claude: Creating Journal Entries](#instructions-for-claude-creating-journal-entries)
- [Visualization](#visualization)
- [Blog to bot](#blog-to-bot)
  - [RAG Challenges](#rag-challenges)
- [Text to speech our friends](#text-to-speech-our-friends)
- [RAG a psychiatrist](#rag-a-psychiatrist)
- [What I wrote summary](#what-i-wrote-summary)
- [Upcoming](#upcoming)
- [Diary](#diary)
  - [2026-01-31](#2026-01-31)
    - [A Step Behind the Bleeding Edge: AI Tool Philosophy](#a-step-behind-the-bleeding-edge-ai-tool-philosophy)
    - [Code as Cattle, Not Pets](#code-as-cattle-not-pets)
    - [whenwords: The Ghost Library](#whenwords-the-ghost-library)
    - [Review Cost < Generation Cost = PRs Were Net Win](#review-cost--generation-cost--prs-were-net-win)
  - [2026-01-03](#2026-01-03)
    - [Testing Codex (After Running Out of Tokens)](#testing-codex-after-running-out-of-tokens)
  - [2026-01-01](#2026-01-01)
    - [CHOW for Blog Posts: "How Igor CHOPs" Written with AI](#chow-for-blog-posts-how-igor-chops-written-with-ai)
  - [2025-12-21](#2025-12-21)
    - [obs-cli: Rust TUI for Camera Control](#obs-cli-rust-tui-for-camera-control)
    - [Rust tmux_helper: 10x Speedup from Python](#rust-tmux_helper-10x-speedup-from-python)
    - [Tmux Config Overhaul](#tmux-config-overhaul)
  - [2025-12-14](#2025-12-14)
    - [Stream Deck Plugin in 30 Minutes](#stream-deck-plugin-in-30-minutes)
  - [2025-10-26](#2025-10-26)
    - [Cloning ScrollBuddy - Reverse Engineering a $100/year Widget](#cloning-scrollbuddy---reverse-engineering-a-100year-widget)
  - [2025-10-15](#2025-10-15)
    - [Use it to update my crazy shell (Enabling Environment) configuration](#use-it-to-update-my-crazy-shell-enabling-environment-configuration)
    - [Use it to help digest new books](#use-it-to-help-digest-new-books)
    - [Use it to contribute to open source - It created the issue and PR by itself!!](#use-it-to-contribute-to-open-source---it-created-the-issue-and-pr-by-itself)
    - [Used it to digest content from a YouTube video](#used-it-to-digest-content-from-a-youtube-video)
  - [2025-10-09](#2025-10-09)
    - [Using AI to Explore and Organize Religious Understanding](#using-ai-to-explore-and-organize-religious-understanding)
  - [2025-10-05](#2025-10-05)
    - [Four-Hour Python Deadlock Detective Work](#four-hour-python-deadlock-detective-work)
    - [New Tmux Extension in Less Than an Hour](#new-tmux-extension-in-less-than-an-hour)
    - [Using Voice to Make Commands](#using-voice-to-make-commands)
    - [Automating Journal Entries](#automating-journal-entries)
  - [2025-09-14](#2025-09-14)
  - [2025-09-13](#2025-09-13)
  - [2025-09-07](#2025-09-07)
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

## Instructions for Claude: Creating Journal Entries

When creating a new AI journal entry, follow these guidelines:

1. **Date Section**: Add new entries at the top of the Diary section with format `### YYYY-MM-DD`
2. **Structure**:
   - Start with **TOP Takeaway**: The key learning/insight (1-2 bullet points)
   - Use bullet points for readability (see existing entries for style)
   - Keep it concise but informative
3. **Deep Links**:
   - For gists: Link to specific files using `#file-filename-md` anchors
   - For GitHub repos: Use commit permalinks with line numbers (e.g., `blob/COMMIT_HASH/path/file.py#L90-L100`)
   - Walk the GitHub repo history to find the exact commit hash and line numbers
   - Include both implementation and configuration files where relevant
   - **Example from 2025-10-05 entries**:
     - [Four-Hour Python Deadlock Detective Work](https://github.com/idvorkin/idvorkin.github.io/blob/b4251cd8c7963402044f66bcc56fd8ff0f8adf49/_d/ai-journal.md#L196-L213)
     - [New Tmux Extension in Less Than an Hour](https://github.com/idvorkin/idvorkin.github.io/blob/b4251cd8c7963402044f66bcc56fd8ff0f8adf49/_d/ai-journal.md#L215-L233)
     - [Using Voice to Make Commands](https://github.com/idvorkin/idvorkin.github.io/blob/b4251cd8c7963402044f66bcc56fd8ff0f8adf49/_d/ai-journal.md#L235-L241)
4. **Artifacts**:
   - Link to gists for detailed transcripts/analysis
   - Link to GitHub issues/PRs for context
   - Link to writeups in other repos (e.g., stuck-investigate.md)
5. **Voice and Tone**:
   - Personal, reflective
   - Focus on what worked, what didn't, and why
   - Include specific technical details but keep it readable
6. **Update TOC**: Add entry to the vim-markdown-toc section

**Example Structure**:

```markdown
### YYYY-MM-DD

#### Title of What You Did

- **TOP Takeaway**: The key insight
  - Supporting detail
- **The Problem**: What you were solving
- **What Worked**: With links to [implementation](github-permalink)
- **What Didn't**: Honest reflection
```

## Visualization

## Blog to bot

Join the [discord here](https://discord.gg/S2s24P6JtU), and then just '/ask'. See the source [on github](https://github.com/idvorkin/nlp/blob/d9f24b7aa5a046f78147c2e53144a9258c91894f/qa_blog.py?plain=1#L393)
Standard workflow,
chunk blog -> Embedding(chunk) -> vector DB <- Retrieve <- Project Inject <- Rago
this begs the Q what to chunk, and how to chunk it

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

here (https://whatilearnedsofar.com/practice/) (broken link)

lets see if we can simulate him, step #1, lets bring the site down into markdown

1. Lets use <https://github.com/paulpierre/markdown-crawler>:
2. pip install markdown-crawler
   markdown-crawler https://whatilearnedsofar.com/practice/ --output-dir ./practice (broken link)

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

## Upcoming

- Blog: Why using AI today can be slower
- Blog: Don't forget when AI can see!
- Blog: Flesh out Hyper Personalization
- AI Music: My eulogy as a rap

## Diary

### 2026-01-31

#### A Step Behind the Bleeding Edge: AI Tool Philosophy

- **TOP Takeaway**: Monarch's "step behind the bleeding edge" philosophy validates the decision to standardize on proven tools rather than chasing every new release
  - Five core principles: Own your work, do deep thinking yourself, leave room for inspiration, design validation loops, use AI liberally in safe settings
- **The Article**: [A Step Behind the Bleeding Edge](https://somehowmanage.com/2026/01/22/a-step-behind-the-bleeding-edge-monarchs-philosophy-on-ai-in-dev/) - Monarch's philosophy on AI tool adoption
- **Key Insight**: Deliberately working slightly behind the cutting edge balances innovation with stability, avoiding thrash from constantly switching tools
- **Connection to My Practice**: Aligns with my decision to standardize on Claude Code rather than jumping between Gemini, Codex, and Opus every few days (see [How Igor CHOPs](/how-igor-chops#why-not-codex-gemini-etc))
- **The Tension**: Productivity gains shouldn't eliminate the human thinking necessary for expertise, quality, and innovation
- **Where I Apply This**:
  - Delegate toil to AI (testing, boilerplate), keep judgment and design for myself
  - Use AI autonomously in safe environments (YOLO containers, internal prototypes)
  - Maintain critical review loops - AI suggests, human validates
- **Great FAQ Questions from the Article**:
  - **Will AI replace my job?** "If you consider your job to be 'typing code into an editor', AI will replace it." But if your role involves using software to build products and solve problems, your work will evolve rather than disappear.
  - **Am I falling behind if I'm not using AI constantly?** Constant worry creates unnecessary anxiety. Explore collectively while maintaining adoption one step behind the bleeding edge.
  - **Is the code AI writes actually good?** Quality assessment is the developer's responsibility. With proper context and prompting, AI can produce good code - but you review and determine if it's appropriate.
  - **Am I losing skills by relying on AI?** Skills won't atrophy if you maintain ownership and conduct thorough reviews. Capabilities should improve through continuous access to "a somewhat knowledgeable resource" during deep work.

#### Code as Cattle, Not Pets

- **TOP Takeaway**: Development tools (GitHub, PRs, tickets) were built assuming code is expensive and slow - but AI agents make code cheap and fast, fundamentally changing the entire development paradigm
- **The Speech**: [Video transcript](https://pbs.twimg.com/media/G_HQ5GRW4AArPdO?format=png&name=large) on how software development is undergoing the same transformation infrastructure went through
- **The Old Assumption**: Code is expensive, slow to produce, written by humans, and valuable. Pull requests are "first-class features" you can heart-react to, bookmark, assign. Planning takes weeks.
- **The New Reality**: With AI agents, code becomes cheap and fast to produce - "as fast as you can paste a screenshot in a Slack chat"
- **The Infrastructure Parallel**:
  - **Before**: Servers were "pets" - unique hostnames, managed config files, you cared which server ran what
  - **After**: Servers became "cattle" - who cares which server it runs on? (Docker, Terraform, cloud abstraction)
  - **Now**: Code contributions are making the same shift from pets to cattle
- **The Prediction**: "Most development tools we've been using will completely flip in the next 10 years. Everything we've been using before is either dead or slowly dying, or will completely change the way it works."
- **Quote**: "The system is dead, long live the factory"
- **Connection to My Practice**: This is exactly why I use [YOLO containers](/chop#yolo-containers-safe-full-autonomy) - containers are cattle, not pets. Spin up, let AI work, throw away. Same principle applies to AI-generated code.

#### whenwords: The Ghost Library

- **TOP Takeaway**: A library distributed as specification + tests, with ZERO implementation code - you paste a prompt into an LLM and it generates the implementation in your language
- **The Repository**: [whenwords](https://github.com/dbreunig/whenwords) - "A relative time formatting library, with no code"
- **What It Contains**:
  - **SPEC.md** - Detailed behavioral specification and implementation guidance
  - **tests.yaml** - 125+ language-agnostic test cases as input/output pairs
  - **INSTALL.md** - A copy-paste prompt for AI assistants
- **The Five Functions**: timeago, duration, parse_duration, human_date, date_range
- **How You "Install" It**: Copy this prompt to Claude/Cursor/whatever:
  ```
  Implement the whenwords library in [LANGUAGE].
  1. Read SPEC.md for complete behavior specification
  2. Parse tests.yaml and generate a test file
  3. Implement all five functions
  4. Run tests until all pass
  5. Place implementation in [LOCATION]
  ```
- **The Philosophy**: "The prompt IS the code" - flies against the orthodoxy that "code is a liability"
- **Proven Cross-Language**: Works in Ruby, Python, Rust, Elixir, Swift, PHP, Bash - true language agnosticism through specification
- **Connection to "Code as Cattle"**: This takes it further - not just the implementation is disposable, but the library distribution model itself assumes ephemeral code generation
- **Related Reading**: [Lobsters discussion](https://lobste.rs/s/fr9pyv/whenwords_relative_time_formatting)

#### Review Cost < Generation Cost = PRs Were Net Win

- **TOP Takeaway**: You're not changing code, you're changing system behavior. The value isn't in making the change - it's in understanding the constraints and implications. AI can change blue to pink instantly; what's valuable is knowing why that color exists, how it fits the design system, localization needs, monitor compatibility.
- **What This Means for PRs**:
  - **Trivial contribution**: "Here's code that changes blue to pink" → Your agent can do this in seconds
  - **Valuable contribution**: "Here's why we need pink, design system implications, accessibility concerns"
  - A PR that just changes the color provides no value - you could have your agent do it
- **The Economic Flip**:
  - **Before**: Making the code change was hard → PR with code change was valuable
  - **After**: Making the code change is trivial → only system understanding is valuable
- **The Proxy That Broke**:
  - We conflated "ability to write code" with "understanding the system"
  - You couldn't cheat before AI - writing code required understanding
  - Now you can generate code without any understanding of constraints, design systems, implications
- **The Second Loss - Identifying Committed Contributors**:
  - The grip strength analogy (grip strength correlates with longevity not because it causes it, but because you can't cheat to build it - reliable proxy for overall health): Code was a costly signal showing commitment
  - It was worth investing in people who wanted to make changes - building relationships
  - You don't have that signal anymore
  - It's a shame - we'll have to find something else to identify people worth investing in
- **Real Examples**: [tldraw](https://tldraw.dev/blog/stay-away-from-my-trash) closing external PRs, [LLVM](https://discourse.llvm.org/t/rfc-llvm-ai-tool-policy-human-in-the-loop/89159) AI tool policy

### 2026-01-03

#### Testing Codex (After Running Out of Tokens)

- **TOP Takeaway**: Codex reads a lot more of the content, which is great, but it struggles with really messy input compared to Opus
- **Why I Tried It**: Ran out of tokens and decided to try Codex after all
- **Big Observations**:
  - It comprehends more of the surrounding context and file content
  - It doesn't handle badly garbled input as well as Opus (a problem for voice input)

### 2026-01-01

#### CHOW for Blog Posts: "How Igor CHOPs" Written with AI

- **TOP Takeaway**: Applied [CHOW](/chow) to write the [How Igor CHOPs](/how-igor-chops) post - it's pretty frickin' good
- CHOW isn't just for code anymore - it's becoming my go-to for writing entire blog posts
- The post covers my personal CHOP setup, tooling choices, and daily workflows
- Also added interactive visualization examples to the CHOW post: [Religion Evolution Explorer](https://religion-evolution-explorer.surge.sh/) and [How Long Since](https://idvorkin-how-long-since-ai.surge.sh/?show=tool)

### 2025-12-21

#### obs-cli: Rust TUI for Camera Control

- **TOP Takeaway**: Built a complete TUI for OBSBOT camera control via OSC protocol - vibe coding makes hardware integration projects trivially accessible
- **The Project**: [obs-cli](https://github.com/idvorkin/obs-cli) - Terminal UI for controlling OBSBOT robotic cameras
- **Key Features**:
  - Vim-style keybindings: h/j/k/l for pan/tilt, i/o for zoom
  - 9 preset positions (save/recall)
  - AI tracking toggle, gimbal reset, sleep/wake
  - Config persisted in `~/.config/obsbot-cli/config.toml`
- Another niche personal tool that would have taken much longer without AI assistance

#### Rust tmux_helper: 10x Speedup from Python

- **TOP Takeaway**: Porting slow Python CLI tools to Rust is now trivial - went from 100ms to 14ms execution time
- **The Problem**: Python tmux_helper had noticeable lag on every tmux operation
- **The Fix**: [Rust implementation](https://github.com/idvorkin/Settings/commit/51cbe99e093f433905baa4fa69b9b1fdcff743de) - complete rewrite with same commands (info, rename-all, rotate, third)
- **Why It Was Easy**: Claude handled the port with minimal guidance - the translation was mechanical, unit tests included
- **Result**: 10x speedup (100ms → 14ms), updated `.tmux.conf` to use new binary
- This pattern applies broadly: identify slow Python CLI tools, ask AI to port to Rust

#### Tmux Config Overhaul

- **TOP Takeaway**: AI-assisted config refactoring makes it easy to finally fix long-standing annoyances
- **Theme**: Switched from themepack to [Catppuccin](https://github.com/idvorkin/Settings/commit/d43239b) - modern, cohesive look
- **Status Bar**: [2-row layout](https://github.com/idvorkin/Settings/commit/1ed4c56) - info on top (CPU/RAM/host), windows on bottom
- **Session Management**: Added [sessionx plugin](https://github.com/idvorkin/Settings/commit/5953fe0) + [launch-servers command](https://github.com/idvorkin/Settings/commit/8c7189c) for dev session management
- **Auto-rename**: Windows auto-rename every 10s based on running process, "claude" shortened to "cl"
- ~20 commits of iterative fixes - the kind of tedious config work that AI makes painless

### 2025-12-14

#### Stream Deck Plugin in 30 Minutes

- **TOP Takeaway**: Built a full Stream Deck plugin from scratch in 30 minutes - the barrier to custom hardware integrations is basically gone
- **The Project**: [streamdeck-igor-vibe](https://github.com/idvorkin/streamdeck-igor-vibe) - Personal Stream Deck plugin for tmux navigation, voice activation, and utility keys
- **Key Features**:
  - Tmux pane navigation (prev/next) via single button presses
  - Voice activation trigger for Wispr Flow (Right Cmd + Right Shift)
  - Hot-reload for live action updates without plugin restart
  - Python-based action handlers for easy customization
- **Philosophy**: "In the future we'll just need keyboards with two buttons: yes or no" - consolidating frequent commands into single presses
- This is the kind of niche personal tooling that would have taken days before AI coding assistants

### 2025-10-26

#### Cloning ScrollBuddy - Reverse Engineering a $100/year Widget

- **TOP Takeaway**: Got annoyed someone was charging $100/year for a scroll buddy widget - challenged Claude to clone it through reverse engineering. Success!
- **The Project**: [scroll-buddy repository](https://github.com/idvorkin-ai-tools/scroll-buddy)
- **The Chat Log**: [Full conversation](https://htmlpreview.github.io/?https://gist.githubusercontent.com/idvorkin-ai-tools/3c4e0db9551270d474c82a39ba2302d4/raw/chat-log.html) | [Filtered (user/assistant only)](https://htmlpreview.github.io/?https://gist.githubusercontent.com/idvorkin-ai-tools/3c4e0db9551270d474c82a39ba2302d4/raw/chat-log.html&filter=user,assistant)
- **The Result**: [Live Demo](https://htmlpreview.github.io/?https://gist.githubusercontent.com/idvorkin-ai-tools/62cfb5e6ed0454814ff03e2f6f450cd3/raw/demo.html)
- Claude used Playwright to inspect the original site, extracted the JavaScript animation logic, and recreated it from scratch
- Full reverse engineering process: WebFetch analysis → Playwright DOM inspection → JavaScript extraction → Clean reimplementation
- Created both the walker and scuba diver characters with proper physics-based animation
- Published chat logs using [claude-code-log](https://github.com/daaain/claude-code-log) - discovered it supports URL parameter filtering (`&filter=user,assistant`)
- **The Commit**: [Added chat log documentation](https://github.com/idvorkin-ai-tools/scroll-buddy/commit/944ee204cd1a05d1a64ae7da7eeeebcf69d0cfd3)

### 2025-10-15

#### Use it to update my crazy shell (Enabling Environment) configuration

- I used to have Tig and GDiff in another window in nvim only, better to have in TMUX - added [tmux command aliases](https://github.com/idvorkin/settings/blob/d046eab712dd5e7d4bc1fbb7ff77e224a66cbbce/shared/.tmux.conf#L227-L233) (`:tig/:Tig` and `:gdiff/:Gdiff`)
- I was too lazy to learn how to configure telescope UX - [Claude did it for Tags and BTags](https://github.com/idvorkin/settings/blob/a31b2e54ca20747900d65598ab84b575352dc728/nvim/nvim_plugins.lua#L196-L210)

#### Use it to help digest new books

- **The Session**: [Creating the Jung Ego-Self post](/published-chop-logs/2025-10-15-jung-ego-self-post.html?filter=user,assistant)
- Created comprehensive post on Carl Jung's complex "Ego and Archetype" framework exploring the [Ego-Self relationship](https://github.com/idvorkin/idvorkin.github.io/blob/d088a41e6d587b9d08b699155226336a6454af11/_d/jung-self-ego.md) - Ego as social operating system vs Self as authentic totality, still needs personal experience integration

#### Use it to contribute to open source - It created the issue and PR by itself!!

- **The Session**: [mdserve open source contribution](/published-chop-logs/2025-10-15-mdserve-open-source-contribution.html?filter=user,assistant)
- Got a compilation error installing mdserve, had Claude try to build it, figure out the problem, [create the issue](https://github.com/jfernandez/mdserve/issues/28#issuecomment-3408716893), and send a [PR](https://github.com/jfernandez/mdserve/pull/29) - very little work on my part

#### Used it to digest content from a YouTube video

- **The Session**: [Adding 14 signs content to religion post](/published-chop-logs/2025-10-15-religion-14-signs-actual-work.html?filter=user,assistant)
- Zach sent me a YouTube video, had Claude pull the yt-dlp subs, then summarize and help me edit - added [14 signs of being a Christian from ~300 AD](https://github.com/idvorkin/idvorkin.github.io/blob/5a1667096fa71a30505f8b7663c49a6bc70f5cbf/_d/religion.md#L123-L170) (text possibly from Lactantius)

### 2025-10-09

#### Using AI to Explore and Organize Religious Understanding

- **TOP Takeaway**: AI as a collaborative explorer for sensitive personal topics - worked through skepticism to find practical wisdom in religious texts
- **The Session**: [Full conversation](/published-chop-logs/2025-10-09-religion-exploration.html?filter=user,assistant)
- **The Commit**: [Bible verses organized by practical themes](https://github.com/idvorkin/idvorkin.github.io/commit/8ab2827286911e65473b7b435f55b36fe8af76db)

### 2025-10-05

_See [Instructions for Claude: Creating Journal Entries](https://github.com/idvorkin/idvorkin.github.io/blob/b4251cd8c7963402044f66bcc56fd8ff0f8adf49/_d/ai-journal.md#L76-L111) for guidelines on adding new entries._

#### Four-Hour Python Deadlock Detective Work

- **TOP Takeaway**: Switch from tactical to strategic
  - Got Claude to add lots of logging
  - I had to figure out it was hanging at the system level (spent lots of rounds trying to get Claude to guess, it failed and kept thinking I was stuck in a semaphore)
  - Once I came up with system issue, it ran all commands and found the issue
  - The fix didn't work, but I can try again later
- **The Problem**: `changes.py` script hanging indefinitely during subprocess operations
- **The Root Cause**: Three-way deadlock between gRPC's DNS initialization, macOS dyld locking, and fork preparation handlers
  - [Debugging transcript overview](https://gist.github.com/idvorkin/591ff244147a10f53d7495d262c94682#file-a_nlp-overview-md)
  - [Claude's analysis](https://gist.github.com/idvorkin/591ff244147a10f53d7495d262c94682#file-z_claude-sonnet-4-5-20250929-md)
  - [Timing debug info](https://gist.github.com/idvorkin/591ff244147a10f53d7495d262c94682#file-zzz_timing_debug-md)
- **What Claude Tried**:
  - `grpc.experimental.fork_support()` → failed
  - Switched Google GenAI models to REST transport → partially worked, revealed HTTP timeout issues
  - Discovered semaphore starvation (HTTP calls holding slots indefinitely)
  - **Final solution**: Disabled Google/Gemini models by default to eliminate the gRPC thread pool
- Full writeup: [stuck-investigate.md](https://github.com/idvorkin/nlp/blob/ed783b2aebf9bdad2de7fedcec3a9ba9e723e7f8/docs/stuck-investigate.md)

#### New Tmux Extension in Less Than an Hour

I love adding tmux workflows, but they usually take me like 10 hours to get right. **This time it only took one hour**

- **TOP Takeaway**: Have Claude test as much as possible
  - Claude could debug by actually running the tmux commands to figure out what was going on
- **The Commands** ([gist overview](https://gist.github.com/idvorkin/ce2f4970bc328e5346fabcf6d2de74bb#file-a_settings-overview-md)):
  - **Rotate Command** (C-a Shift+Space): Toggles between even-horizontal and even-vertical layouts
    - [Implementation](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/py/tmux_helper.py#L386-L410) (py/tmux_helper.py:L386)
    - [Keybinding](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/shared/.tmux.conf#L224-L225) (shared/.tmux.conf:L224)
  - **Third Command** (C-a /): Toggles between even layout and 1/3-2/3 split
    - [Implementation](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/py/tmux_helper.py#L412-L443) (py/tmux_helper.py:L412)
    - [Keybinding](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/shared/.tmux.conf#L232-L233) (shared/.tmux.conf:L232)
  - **Rename Command** (C-a t): Auto-refresh window titles from running processes
    - [Implementation](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/py/tmux_helper.py#L363-L385) (py/tmux_helper.py:L363)
    - [Keybinding](https://github.com/idvorkin/settings/blob/538db308ee146c69a58d97b6670e80f88328f913/shared/.tmux.conf#L241) (shared/.tmux.conf:L241)
  - [Detailed analysis by Claude](https://gist.github.com/idvorkin/ce2f4970bc328e5346fabcf6d2de74bb#file-z_claude-sonnet-4-5-20250929-md)
- **The Coolest Part**: Claude knew I could make commands like `:thirds`, which I'm sure I searched for before and thought was impossible

#### Using Voice to Make Commands

- **TOP Takeaway**: Talking to Claude is just like talking to another engineer
  - You tell them things with voice you don't type at them
  - More natural, conversational, less formal
- Using [Wispr Flow](https://wisprflow.ai/) for voice input (only works at home where I can talk)
- **The Flow**: Eyes closed, saying a few words, stopping, saying a few more words as I think through what I want to do
- Saying "This is nice" when I'm thinking out loud - just verbalizing my thoughts as they come
- **The Hardest Part**: Remembering to not type but to speak out what I'm thinking
  - My fingers want to type but I need to force myself to just talk
- **[Wispr Flow](https://wisprflow.ai/) vs [SuperWhisper](https://superwhisper.com/)**:
  - **Wispr Flow**: Seems faster and maybe more accurate, cloud-based with intelligent editing (removes filler words, formats automatically)
  - **SuperWhisper**: Much more configurable, allows you to run local models if you care about privacy, multiple AI model sizes (Nano to Ultra)
  - Both work on macOS and mobile (iPhone) - discovered them on mobile first
  - Both are a billion times better than Apple's default dictation
  - I chose Wispr Flow for the speed and automatic cleanup - worth the privacy tradeoff for me the majority of the time

#### Automating Journal Entries

- **TOP Takeaway**: If you're doing something repetitive, have Claude do it
  - Like this journal entry - self-referential, I know
  - Created instructions so Claude can write properly formatted AI journal entries automatically
- **The Problem**: Journal entries were inconsistent, lacking proper structure and deep links to source materials
- **What Worked**:
  - Created [Instructions for Claude section](https://github.com/idvorkin/idvorkin.github.io/blob/b4251cd8c7963402044f66bcc56fd8ff0f8adf49/_d/ai-journal.md#L76-L111) with detailed guidelines
  - Added examples showing proper GitHub permalink format with line numbers
  - Documented voice and tone expectations for future entries
- **The Result**: Now Claude can create properly formatted journal entries with:
  - Consistent structure (TOP Takeaway, bullets, deep links)
  - Proper artifact linking (gists with file anchors, GitHub permalinks)
  - TOC updates automatically included

### 2025-09-14

- **NOTE** I really need to remember to only vibe code with multi monitor, just too expensive to sit there only vibe coding.
  - Setup Secondary iPad
  - Maybe this is why you want to use voice

### 2025-09-13

- Great line ... Once you let vibe coding into your code, it becomes writable only by AI. So true.
- Moving [Tony Blog Commands to MCP](https://github.com/idvorkin/tony_tesla/issues/5) - and the [MCP Server](https://github.com/idvorkin/idvorkin-blog-mcp)
  - SO MUCH PAIN GETTING THIS SIMPLE THING TO WORK (look at all my diffs)
  - I need to do these planning workflows - see if they help.
- Kind of fun using claude to add missing permalinks to my [time off blog posts](https://github.com/idvorkin/idvorkin.github.io/issues/165)
  ![](https://raw.githubusercontent.com/idvorkin/ipaste/main/20250913_144726.webp)
- Wonderful using it to fix broken links, and add a pre-commit rule to make it harder to regress

### 2025-09-07

- Played with AI music [suno](https://suno.com/song/21be0b93-a44b-4a94-b2d6-39a59fff6283), to create a musical eulogy
    <iframe src="https://suno.com/embed/21be0b93-a44b-4a94-b2d6-39a59fff6283" width="760" height="240"><a href="https://suno.com/song/21be0b93-a44b-4a94-b2d6-39a59fff6283">Listen on Suno</a></iframe>
- The lyrics were a oneshot [from chatgpt](https://chatgpt.com/share/68be1806-b068-8000-a2f2-c8ecdcf6a842) taking my blog and my affirmations
- Starting [hyper personalization](/hyper-personal)

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
  - Link: GitHub Rulesets Settings (https://github.com/idvorkin/idvorkin.github.io/settings/rules) (broken link)
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
Claude Code did fix 772 lines of legitimate typos (critical→critical, mechanisms→mechanisms, Kubertnetes→Kubernetes, etc.), but it also made several semantic errors that were caught by Cursor's automated review bot:

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

- Image generation takes a while - but I love it. Agent based apps is super "human input time" efficient, but the wall time is annoying, it's easy to forget what you're trying to do context. I'm guessing we'll need toolls to help us do the "N-slow" tasks at once as it's easy to forget the damn goals

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

Aider code upgrade example image (broken link - expired JWT): https://private-user-images.githubusercontent.com/280981/379853492-dad3d891-15cd-4cae-b4c2-955696409002.png

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

- Interesting, trying to get the chatgpt website to read the file fails, even though it fits into the context window.
  - ChatGPT:
  - I could work around this by working with the API, but for chat I prefer using UX, and its cheaper with these big files
- Back to [google vertex](https://console.cloud.google.com/vertex-ai/studio/), which is working well at this file size
- Finally the [output of exercises](https://gist.github.com/idvorkin/2e3111a07531fefb11e789144e1c372f)

### 2024-08-26

### Playing with Flux.1

<https://replicate.com/ostris/flux-dev-lora-trainer/train>

[Model Merge](https://replicate.com/lucataco/flux-dev-multi-lora?prediction=ajkd29fje9rj40chjk58gztxy8)

Loras we can merge:

- idvorkin/idvorkin-flux-lora-1
- Merge Real and Boring - [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) - Keyword is photo

- We can also merge with just the name of the other Lora. [Me and Sue Johnanson](https://replicate.com/idvorkin/idvorkin-flux-lora-1?prediction=v7wyfv05c1rm20chjkrb7c9w9m)

The model I trained:

The [model](https://replicate.com/idvorkin/idvorkin-flux-lora-1) on [hugging face](https://huggingface.co/idvorkin/idvorkin-flux-lora-1) - idvorkin/idvorkin-flux-lora-1

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

OK, so, copilot tends to be just a code completion, which is pretty meh. Ideally it could do more complex changes, like find code that would be good to refactor then make those changes. [aider](https://aider.chat/) is supposed to that, but in my experience, it just made stuff wrose and was slower then me making the changes myself. I guess I'll try again in a while.

### 2024-07-30

#### Agenic Frameworks

- Zep: Agent Memory
- Crew-AI - Agent Co-ordination
- Agent-Zero: Single Agent

### 2024-06-22

#### Next Gen Models

Claude 3.5 Sonnet just came out. Sonnet is Anthropics Medium model. It has the same performance envelope as GPT-4o, making me assume GPT-4o is also the medium model. What's interesting, it initially OpenAI marketted GPT-4o as a 4x faster 2x cheaper GPT-4 Large model, but honestly I think it' sjust the medium. That means either the medium Gpt 4.5 large is coming, or it's performance envelope isn't worth it.

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

- Doing Q&A for my blog w/ChromaDB and LangChain
  - Bleh, Langchain is hard to grok, changing on the daily
  - <https://github.com/idvorkin/idvorkin.github.io/blob/master/scripts/qa_blog.py?plain=1#L99>

### 2023-07-15

- Had a very clever idea to 1/ make my convo files markdown, giving me completion from CoPilot
- Having GPT prompt default answer in [markdown with line separators](https://github.com/idvorkin/nlp/blob/ed56c29719a8a8f53ffd10513ec96d3895a25076/convos/default.convo?plain=1#L1) so that it was clear the answers from the bot
- e.g. <https://gist.github.com/idvorkin/98cfaa4bea8e4f9cc113ff978612518e>

### 2023-07-04

- Weight and Biases LangChain Traces
  - https://docs.wandb.ai/guides/prompts/quickstart (broken link)
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

- _Note: This entry was backdated and created on 2025-08-21_
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

- _Note: This entry was backdated and created on 2025-08-21_
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

- _Note: This entry was backdated and created on 2025-08-21_
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
  ```

- Used the original "davinci" engine (not even GPT-3.5 yet!)
- "davinci" was the top model - no GPT-3.5-turbo, no GPT-4
- APIs were brand new and documentation was sparse
- "davinci" model cost $0.02/1K tokens (10x more than GPT-3.5-turbo later!)

  ```

  ```

### Related posts

{%include summarize-page.html src="/ai-talk" %}
{%include summarize-page.html src="/ai-art" %}
{%include summarize-page.html src="/gpt" %}

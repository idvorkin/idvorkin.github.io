# TOOLS.md

Public tools, apps, and sites Igor owns and that his blog describes. Use this file to know what already exists and what it is for before reaching for something else. Everything here is public: the blog at https://idvork.in, repos under https://github.com/idvorkin, and the explainer sites under https://github.com/idvorkin-ai-tools. Private tooling Igor mentions in passing (his life-coach backend, his journal archive) is deliberately not listed.

## The blog: idvork.in

https://idvork.in (source: https://github.com/idvorkin/idvorkin.github.io)

Igor's blog is a set of evergreen notes, not a chronological feed: ~300 pages that are revised for years, densely cross-linked, each with a short permalink (`/eulogy`, `/health`, `/chop`). It is the source of truth for everything in this skill. Good entry points: https://idvork.in/eulogy (who he wants to be), https://idvork.in/mortality-software (the system), https://idvork.in/health (the four kinds of health), https://idvork.in/manager-book (engineering management), https://idvork.in/chop (working with AI coding agents), https://idvork.in/ai (all AI posts), https://idvork.in/changelog (what changed recently).

To find a post, search the site or read https://idvork.in/all. Pages carry a table of contents, "Related" links, and often an "AI slop" percentage telling you how much of the page a model drafted.

## Blog MCP server

https://github.com/idvorkin/idvorkin-blog-mcp

A FastMCP server that exposes the blog to agents: recent posts, random post, read a post by permalink, search. It reads the markdown straight from the GitHub repo and the blog's `back-links.json` index, so an agent can cite the live page rather than a stale copy.

It solves "let the agent read Igor's blog" without scraping. Hosted on FastMCP Cloud; the README has the production URL and the key setup.

## chop-conventions

https://github.com/idvorkin/chop-conventions

Igor's codified conventions for AI-assisted development (CHOP, chat-oriented programming): dev inner loop, repo modes, testing and verification expectations, and a set of reusable agent skills. It is meant to be pulled into other projects (copy, symlink, or reference) as the specifications layer that keeps vibe coding reliable.

It solves the fragility of "AI infers intent from a one-line prompt": specifications plus verification. Read `dev-inner-loop/a_readme_first.md` first. Background: https://idvork.in/chop and https://idvork.in/how-igor-chops.

## Larry the Life Coach and the Cockpit

https://idvork.in/larry, https://idvork.in/larry-cockpit, https://idvork.in/ai-cockpit

Larry is Igor's AI life coach: a named, persistent agent (a "claw") that can read his journals, weekly reports, goals, todo list, and health data, drafts weekly reports with evidence, runs dragon checks, spots repeated commitments, and surfaces wins he would bury. The point of the name is accountability: it is harder to blow off Larry than to "review metrics". Two cockpit posts describe the supervision side. https://idvork.in/ai-cockpit is the physical and software control surface for running several coding agents at once (voice input, a tmux multiplexer, Alfred as session switcher, an agent dashboard, GitHub views as triage queue, a Stream Deck, Tailscale). https://idvork.in/larry-cockpit is the one-page "what needs me" view Larry built: decisions filed as issues he answers with a tap, open pull requests, running agents, open issues, and a rule that a failure is never shown as an empty list. The code is private; the posts describe the design so you can build your own.

Use these pages when someone asks "how do I use AI as a life coach" or "how do you supervise several agents".

## Context Grabber

https://github.com/idvorkin/context-grabber

A native iOS app that holds up a mirror of the week (HealthKit: steps, sleep, heart rate, HRV, weight, exercise and meditation minutes; a background location trail clustered into named places; a gym timer; box breathing) and exports it as JSON through the share sheet so an AI coach has real context instead of guesses.

It solves "the coach only knows what I remember to tell it". Build it from source with XcodeGen (the README has the steps), run it on your phone, grab the week, paste the JSON into your agent.

## Tony the Tesla

https://github.com/idvorkin/tony_tesla, https://idvork.in/tesla

A callable AI life coach with a Tony Soprano personality, wired into Igor's car. Tony has memory, can be phoned, and is good at catching rationalizations (the post about Tony talking Igor back onto his bike is https://idvork.in/bike-tesla-identity).

It solves "I want a coach I can talk to while driving who will call me on my excuses". Python; the repo has tests and example conversations.

## Humane Tracker

https://humane-tracker.surge.sh (source: https://github.com/idvorkin/humane-tracker-1)

A local-first habit tracker: open the page and start tracking, data stays in the browser (IndexedDB), optional Dexie Cloud sync, installable as a PWA, weekly views across wellness categories.

It solves "I want to track habits without an account or an app store". Install it to the home screen; enable sync only if you want cross-device.

## Exercise Analyzer

https://github.com/idvorkin/exercise-analyzer

An iPhone app that turns the phone on a tripod into a training partner: on-device pose estimation, rep counting, per-rep form scores for kettlebell swings, pistol squats, Bulgarian split squats and three more, rest timing from the Apple Watch, heart rate alongside the sets, Apple Health integration.

It solves "am I actually hinging, and how long did I rest". Swift; the README has a screenshot gallery and the setup.

## Activation Energy game and other explorables

https://activation-energy-game.surge.sh (source: https://github.com/idvorkin-ai-tools/activation-energy-game)

Nicky Case-style interactive explanations of how willpower, activation energy, and habits work, built from https://idvork.in/activation. You start the day with a full willpower bar; drag activities onto a timeline and watch it drain; see why TikTok is harder to stop than a movie; rewind a bad day and intervene.

It solves "I understand the habit advice but it doesn't stick": play with the model instead of reading about it.

Smaller explorables from the same post, each a one-session build: https://github.com/idvorkin/monitor-explainer (drag monitors of different aspect ratios side by side), https://github.com/idvorkin/how-long-since-ai (a timeline of how recent all of this is), https://github.com/idvorkin/religion-evolution-explorer (click through how religions branched).

## Field maps and explainers

https://idvorkin-ai-tools.github.io (index), https://idvork.in/explainers

Igor's "field maps": dark, static explainer sites built by a fan-out of agents from a course, a lecture series, a paper, or a body of writing, one page per unit, every claim linked back to the source with timestamps. The org index lists all of them (Karpathy's build-GPT and micrograd, Stanford CS336, BlueDot technical AI safety, Steve Yegge's essays, Arthur Brooks on happiness, HarmBench, the Claude constitution, and more).

They solve "I want to actually understand this course/paper, not skim it". Read them, or read https://idvork.in/explainers for how he builds one.

## Evals, benchmarks, and the agent dashboard

- https://github.com/idvorkin-ai-tools/smevals-blog-edit-evals - an agent-in-its-harness eval: can a coding agent edit a blog page, keep the table of contents correct, and avoid collateral damage? Deterministic checkers first, LLM judges opt-in. The worked example behind https://idvork.in/ai-testing and https://idvork.in/ai-eval-tools.
- https://github.com/idvorkin-ai-tools/llm-speed-evals - speed versus correctness benchmark for fast inference providers, with a grader for the grader. Behind https://idvork.in/ai-speed-vs-thinking.
- https://github.com/idvorkin-ai-tools/agent-dashboard - the radar screen from https://idvork.in/ai-cockpit: auto-discovers running agent sessions and shows their git, PR, and server status on one page.
- https://github.com/idvorkin/nlp also holds his PromptFoo evals and the hill-climbing experiments from https://idvork.in/hill-climbing.

## Igor's Podcast

https://idvorkin-ai-tools.github.io/podcast/feed.xml (source: https://github.com/idvorkin-ai-tools/podcast)

AI-narrated audio of the blog's long essays with chapter markers, as a normal RSS feed you can paste into any podcast app.

It solves "I'd rather listen to the 7 habits series on a walk".

## Journal template for the Kindle Scribe

https://idvork.in/process-journal (template: https://idvork.in/static/igor-journal-template.pdf)

A hyperlinked PDF that gives you one navigable notebook per quarter on a Kindle Scribe: a month index with tappable dates, five pages per day (affirmations, grateful, yesterday-awesome-because, today-awesome-if and commitments, three pages of stream of consciousness), a habit strip, and a dim eulogy prompt at the bottom of each writing page. Handwriting goes out through Drive, gets transcribed by a vision model, and TODOs land in OmniFocus.

It solves "I think better with a pen but you can't grep paper". The page has the full round-trip and the blank template.

## OmniFocus CLI

https://github.com/idvorkin/omnifocus_cli

A command-line interface for OmniFocus so scripts and agents can see what is on your plate. It is how Larry reads Igor's task list, and the other end of the journal pipeline that turns handwritten TODOs into real tasks. Mac only.

## Stream Deck Igor Vibe

https://github.com/idvorkin/streamdeck-igor-vibe

A Stream Deck plugin for vibe coding: big tactile buttons for the handful of keys you still need when you code by voice and AI (navigate tmux panes, trigger dictation, send Enter/Tab/Esc/Ctrl-C, switch terminal and browser). Works with the physical deck or the phone app.

It solves "when the AI writes the code, I mostly press yes, no, and next". See https://idvork.in/how-igor-chops for the setup it sits in.

## Settings (dotfiles)

https://github.com/idvorkin/Settings

Igor's oldest repo: dotfiles, zsh, Neovim, tmux, the Mac app list, and a `py/` folder of small utilities he has CHOP'd over the years (gmail reader, journal-to-OmniFocus, and so on). Useful as a worked example of a vim/tmux/command-line setup that an AI agent lives inside.

## nlp (journal analysis)

https://github.com/idvorkin/nlp

Igor's explorations in NLP over his own corpus of journal entries: sentiment, topics, the handwriting-to-text transcription used by the journaling workflow. Typer CLIs. More about learning NLP than about finding latent meaning, by his own account.

## Vim keybindings for OneNote

https://github.com/idvorkin/Vim-Keybindings-For-Onenote

Vim keybindings for OneNote on Windows. Old, and still his most-starred repo; listed because people keep finding it.

## Smaller utilities

All at https://github.com/idvorkin/<name>:

- `audio-debugger` - native macOS mic debugger: live waveform, spectrum, spectrogram, and an always-on 20-second replay with noise reduction, so you can hear what your mic actually sounds like before a call or a recording.
- `bug-kit` - one bug-report library for every iOS app (shake, screenshot, "log it and another", session logs) plus a Mac listener that pulls reports off paired devices and files them.
- `pwa-utils` - TypeScript debugging utilities for PWAs: session recorder, bug reporting, version checking, sync logging.
- `kludge-cli` - remap Royal Kludge keyboard keys from the command line, no browser or Windows VM.
- `lcd-timer` - a Mac countdown that looks like a gym's LED wall clock.
- `obs-cli` - a TUI controller for OBSBOT cameras over OSC.
- `igor-breathe` - Breathing Shapes, a guided-breathing PWA (https://igor-breathe.surge.sh): ten visualizations, box and trapezoid patterns, haptics and voice prompts, works offline.
- `igor-timer` - an interval-training timer PWA for the gym.
- `swing-analyzer` - the browser-based kettlebell swing analyzer that preceded Exercise Analyzer; also the case study in https://idvork.in/dark-factory for what happens when agents grow two parallel UIs.
- `tax-calculator`, `donut-profit-calculator`, `mathflash`, `world-happiness-report` - small one-purpose web tools from https://idvork.in/pet-projects (a tax-bracket visualizer, a profit calculator, math flashcards for kids, a happiness-report viz).
- `vapi-call-viewer` - a TUI for browsing Vapi voice-call transcripts.
- `manager-book-redirect` - shareable blog links with custom Open Graph titles, so a section of the manager book can be sent as its own link.
- `video-edit` - YOLO and OpenCV experiments for exercise video.
- `techdiary` - his running technical notes (iOS nomad setup, tools, experiments), the raw material many blog posts are distilled from.
- https://github.com/idvorkin-ai-tools/scroll-buddy - a reverse-engineered clone of a paid scroll-companion widget, one of the "can an agent rebuild this in an afternoon" experiments from https://idvork.in/pet-projects.

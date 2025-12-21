---
layout: post
title: "Pet Projects"
permalink: /pet-projects
redirect_from:
  - /tinkering
---

As an engineer, I love to build bespoke tools that solve my unique problems exactly the way I want them solved. The bonus? This is lets me learn new technologies (did you know my blog has multiplayer support?). Sometimes I even make a tool so I have something to learn from. And with AI, this list of projects and explorations has exploded! Note to self, when I want to veg out and just feed my social media addiction I should do some vibe coding on all of these.

<!-- MAINTENANCE INSTRUCTIONS FOR CLAUDE

This page has TWO parts that need to stay in sync:
1. This markdown file (_d/pet-projects.md) - the detailed list
2. The landing page (static/pet-projects.html) - the beautiful visual showcase

WHEN TO UPDATE THE HTML LANDING PAGE:
- Ask Igor: "Should this project be added to the pet-projects HTML landing page?"
- The HTML page is for SHOWCASE projects - things Igor wants to highlight
- Not every project in this markdown needs to be in the HTML

HOW TO UPDATE THE HTML (static/pet-projects.html):
The HTML uses React with inline data arrays. Find the appropriate array:
- activeProjects: Main projects Igor actively uses/maintains
- devToolsProjects: Developer tools and infrastructure
- comingSoonProjects: Ideas being developed

Add entries following this format:
{ id: "slug", name: "Name", tagline: "Phrase", description: "...",
  emoji: "🔧", links: { live: "...", github: "...", blog: "..." }, color: "#hex" }

IMPORTANT - VERIFY ALL URLs before committing:
- GitHub repos: Check they exist and aren't private
- Live links: Check the site is actually deployed
- Blog links: Use permalinks (e.g., /vibe) not redirects

GitHub orgs to check:
- github.com/idvorkin (main)
- github.com/idvorkin-ai-tools (AI tools org)
-->

{% include alert.html content='[Here is a beautiful landing page for my pet projects](/static/pet-projects.html)' style="info" %}

## Self Reflection

| Project                                                                        | Description                                                                                                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [This Blog](https://idvork.in)                                                 | Where I think through writing. Jekyll-based enabling environment. [<i class="fa fa-github"></i>](https://github.com/idvorkin/idvorkin.github.io) |
| [Tony the Tesla](/bike-tesla-identity)                                         | AI life coach for working through problems. [<i class="fa fa-github"></i>](https://github.com/idvorkin/tony_tesla)                               |
| [`ij`](https://github.com/idvorkin/nlp/blob/master/igor_journal.py)            | Journal management and analysis CLI tool                                                                                                         |
| [`gmail`](https://github.com/idvorkin/Settings/blob/master/py/gmail_reader.py) | Email journal analysis. [Blog post](/process-journal)                                                                                            |

## Personal Productivity Tools

| Project                                                                        | Description                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Breathing Shapes](https://igor-breathe.surge.sh/)                             | Visual breathing exercise guide with animated shapes. [<i class="fa fa-github"></i>](https://github.com/idvorkin/igor-breathe)                                               |
| [Humane Tracker](https://humane-tracker.surge.sh/)                             | Habit tracking across 5 wellness categories. Firebase-based with weekly views. [<i class="fa fa-github"></i>](https://github.com/idvorkin/humane-tracker-1)                  |
| [Gym Timer](https://idvorkin.github.io/igor-timer/)                            | Interval training timer PWA with presets, work/rest phases, and wake lock. [<i class="fa fa-github"></i>](https://github.com/idvorkin/igor-timer)                            |
| [Tax Calculator](https://idvorkin.github.io/tax-calculator/)                   | Interactive tax bracket visualizer. [<i class="fa fa-github"></i>](https://github.com/idvorkin/tax-calculator)                                                               |
| [Weight Analysis](https://weight-analysis.surge.sh/)                           | Jupyter notebook analyzing Apple Health weight data. Box plots, time series, interactive visualizations. [<i class="fa fa-github"></i>](https://github.com/idvorkin/jupyter) |
| [OmniFocus CLI](https://github.com/idvorkin/omnifocus_cli)                     | Command-line interface for OmniFocus task management                                                                                                                         |
| [MathFlash](https://idvorkin.github.io/mathflash/)                             | Math flashcard trainer for kids. [<i class="fa fa-github"></i>](https://github.com/idvorkin/mathflash)                                                                       |
| [World Happiness Report](https://idvorkin.github.io/world-happiness-report/)   | Interactive data visualization of global happiness data. [<i class="fa fa-github"></i>](https://github.com/idvorkin/world-happiness-report)                                  |
| [Donut Profit Calculator](https://idvorkin.github.io/donut-profit-calculator/) | Calculate donut shop profitability. [<i class="fa fa-github"></i>](https://github.com/idvorkin/donut-profit-calculator)                                                      |

## CLI Tools

| Project                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CLI Tools](https://github.com/idvorkin/Settings/tree/master/py)         | [`a`](https://github.com/idvorkin/Settings/blob/master/py/a.py) (Aerospace), [`y`](https://github.com/idvorkin/Settings/blob/master/py/y.py) (yabai), [`chop`](https://github.com/idvorkin/Settings/blob/master/py/chop.py) (logs), [`ai-clip`](https://github.com/idvorkin/Settings/blob/master/py/ai_clip.py), [`tmux_helper`](https://github.com/idvorkin/Settings/blob/master/py/tmux_helper.py) |
| [obs-cli](https://github.com/idvorkin/obs-cli)                           | Rust TUI for OBSBOT camera control via OSC. Vim-style keybindings (h/j/k/l) for pan/tilt, i/o for zoom, preset positions, AI tracking toggle                                                                                                                                                                                                                                                         |
| [`gpt`](https://github.com/idvorkin/nlp/blob/master/gpt3.py)             | GPT integration utilities                                                                                                                                                                                                                                                                                                                                                                            |
| [`captions.py`](https://github.com/idvorkin/nlp/blob/master/captions.py) | Converts YouTube VTT transcripts to clean text                                                                                                                                                                                                                                                                                                                                                       |

## Computer Vision & Motion

| Project                                                                             | Description                                                                                                                               |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Swing Analyzer](https://swing-analyzer.surge.sh/)                                  | Browser-based kettlebell swing analyzer. [<i class="fa fa-github"></i>](https://github.com/idvorkin/swing-analyzer)                       |
| [Form Analyzer Samples](https://github.com/idvorkin-ai-tools/form-analyzer-samples) | Exercise video library for form analysis: kettlebell swings, pull-ups, pistol squats                                                      |
| [Magic Monitor](https://magic-monitor.surge.sh)                                     | Smart mirror app with instant replay and AI-powered smart zoom. [<i class="fa fa-github"></i>](https://github.com/idvorkin/magic-monitor) |
| [Video Edit](https://github.com/idvorkin/video-edit)                                | Computer vision explorations: YOLO object detection, OpenCV motion detection                                                              |

## Dev Tools & Infrastructure

| Project                                                                    | Description                                                                                                                                   |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [Agent Dashboard](https://github.com/idvorkin-ai-tools/agent-dashboard)    | Central portal for monitoring multi-agent dev sessions. Auto-discovers agents, shows git/PR/server status. _Self-written by AI!_              |
| [Chop Conventions](https://github.com/idvorkin/chop-conventions)           | Development conventions for AI-assisted coding. [Blog post](/vibe)                                                                            |
| [mdserve](https://github.com/idvorkin/mdserve)                             | Fast markdown preview server with live reload and theme support                                                                               |
| [VAPI Call Viewer](https://www.youtube.com/watch?v=hE-qimUbKdg)            | TUI for viewing Vapi.ai call transcripts. [<i class="fa fa-github"></i>](https://github.com/idvorkin/vapi-call-viewer)                        |
| [Manager Book Redirect](https://idvorkin--igor-blog-fastapi-app.modal.run) | Creates shareable blog links with proper Open Graph titles. [<i class="fa fa-github"></i>](https://github.com/idvorkin/manager-book-redirect) |
| [Jupyter Notebooks](http://nbviewer.jupyter.org/github/idvorkin/jupyter)   | Data exploration notebooks. [<i class="fa fa-github"></i>](https://github.com/idvorkin/jupyter)                                               |
| [Blog MCP Server](https://github.com/idvorkin/idvorkin-blog-mcp)           | MCP server for AI assistants to query blog content                                                                                            |
| [Cursor Chat Browser](https://github.com/idvorkin/cursor-chat-browser)     | Browse and export Cursor AI chat histories                                                                                                    |
| [Stream Deck Plugin](https://github.com/idvorkin/streamdeck-igor-vibe)     | Personal Stream Deck plugin for tmux navigation, voice activation, and utility keys                                                           |

## VIM & Editor Tools

| Project                                                                                | Description                                             |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [VIM Keybindings for OneNote](https://github.com/idvorkin/Vim-Keybindings-For-Onenote) | Brings VIM navigation to OneNote                        |
| [markdown-toc.nvim](https://github.com/idvorkin/markdown-toc.nvim)                     | Auto-generate and update table of contents for markdown |
| [nvim-messages](https://github.com/idvorkin/nvim-messages)                             | Neovim plugin to read iMessage and other chat apps      |
| [Dotfiles](https://github.com/idvorkin/settings)                                       | VIM, TMUX, and shell configuration                      |
| [Tech Diary](https://github.com/idvorkin/techdiary)                                    | Technical notes and learnings                           |

## Fun & Experiments

| Project                                                           | Description                                                                                  |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [Scroll Buddy](https://github.com/idvorkin-ai-tools/scroll-buddy) | Animated scroll companions: walking stick figure and swimming scuba diver follow your scroll |

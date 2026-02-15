---
layout: post
title: "Browsers for Machines: The Headless Browser Landscape for AI Agents"
permalink: /browsers-for-machines
tags:
  - ai
  - tools
  - how
redirect_from:
  - /headless-browsers
  - /lightpanda
  - /playwright-cli
  - /ai-browsers
---

Chrome was built for humans and retrofitted for automation. That era is ending. A new generation of tools is purpose-built for AI agents — and the tradeoffs are fascinating.

I spent an afternoon exploring three approaches to giving AI agents browser access: Lightpanda (a Zig-based browser with no rendering engine), Playwright CLI (token-efficient shell commands wrapping Chromium), and Playwright MCP (full browser automation via Model Context Protocol). Here's what I found, what broke, and when to use each.

<!-- prettier-ignore-start -->
<!-- vim-markdown-toc-start -->

- [The Problem: AI Agents Need the Web](#the-problem-ai-agents-need-the-web)
- [The Landscape](#the-landscape)
- [Lightpanda: The Browser That Can't See](#lightpanda-the-browser-that-cant-see)
  - [What It Is](#what-it-is)
  - [Setup](#setup)
  - [What Works](#what-works)
  - [What Doesn't: The Screenshot That Wasn't](#what-doesnt-the-screenshot-that-wasnt)
  - [The MCP Server (gomcp)](#the-mcp-server-gomcp)
- [Playwright CLI: The Token Diet](#playwright-cli-the-token-diet)
  - [Why CLI Over MCP?](#why-cli-over-mcp)
  - [How It Works](#how-it-works)
- [Playwright MCP: The Full Browser in Your Context Window](#playwright-mcp-the-full-browser-in-your-context-window)
- [CDP: The Glue Between Everything](#cdp-the-glue-between-everything)
- [When to Use What](#when-to-use-what)
- [My Setup](#my-setup)

<!-- vim-markdown-toc-end -->
<!-- prettier-ignore-end -->

## The Problem: AI Agents Need the Web

Claude Code's built-in WebFetch does a simple HTTP GET and parses the HTML. No JavaScript execution. That means any SPA, any dynamically-rendered content, any site that loads data client-side — I get nothing useful. Half the modern web is invisible.

I need my AI coding agent to:

- Fetch JS-rendered pages (documentation sites, SPAs)
- Take screenshots for visual verification
- Interact with web apps (fill forms, click buttons)
- Do all of this without burning my entire token budget on browser state

No single tool does all four well. That's the landscape.

## The Landscape

| Feature | curl | WebFetch | Lightpanda | Playwright CLI | Playwright MCP |
|---------|------|----------|------------|----------------|----------------|
| JS Execution | No | No | Yes | Yes | Yes |
| Screenshots | No | No | No | Yes | Yes |
| CSS/Layout | No | No | No | Yes | Yes |
| Interactivity | No | No | No | Yes | Yes |
| Latency | ~5ms | ~200ms | ~500ms | ~1s warm, ~6s cold | ~2s |
| Token Cost | 0 | Low | 0 | ~27K/task | ~114K/task |
| Cloudflare | Blocked | Sometimes | Blocked | Sometimes | Sometimes |
| Setup | Built-in | Built-in | Binary | npm global | npm + config |
| Best For | Scripts/pipes | Static pages | JS content | Automation | Browser sessions |

_Latency measured against a local Jekyll server. External sites add network RTT. Playwright CLI "warm" means browser already running; "cold" includes Chromium launch._

## Lightpanda: The Browser That Can't See

### What It Is

[Lightpanda](https://lightpanda.io/) is a headless browser written from scratch in Zig. Not a Chrome fork. Not a wrapper. A new browser engine built specifically for machines.

The pitch: 11x faster execution, 9x less memory than headless Chrome. I was skeptical, but the numbers make sense when you understand the architecture — Lightpanda has no rendering pipeline. No layout engine, no compositor, no GPU pipeline. It parses HTML, builds a DOM, executes JavaScript, and exposes everything via CDP. It never paints a single pixel.

Think of it like Docker's relationship to VMs. VMs (Chrome) virtualize the entire machine to run an app. Containers (Lightpanda) strip away everything the app doesn't need. If your AI agent just needs to read a page's content, why spin up a GPU-accelerated rendering engine?

### Setup

Single binary, 15 minutes end-to-end:

```bash
curl -L -o lightpanda https://github.com/lightpanda-io/browser/releases/download/nightly/lightpanda-aarch64-linux
chmod a+x lightpanda
```

Two modes:

- **Fetch**: One-shot URL grab → `lightpanda fetch --dump --strip_mode full https://example.com`
- **Serve**: CDP server → `lightpanda serve --port 9222` (Playwright/Puppeteer can connect)

### What Works

Content extraction with JS execution. Pipe through pandoc for clean text:

```bash
lightpanda fetch --dump --strip_mode full https://some-spa.com | pandoc -f html -t plain --wrap=none
```

I tested it on a Next.js site (lightpanda.io itself) and a blog post linked from Hacker News. Both rendered correctly, JavaScript executed, content came through clean. For a beta product, the happy path is solid.

### What Doesn't: The Screenshot That Wasn't

I connected Playwright to Lightpanda's CDP server. Navigation worked. JS executed. Then I called `page.screenshot()`:

```
page.screenshot: Protocol error (Page.getLayoutMetrics): UnknownMethod
```

`Page.getLayoutMetrics` requires a layout engine. Lightpanda doesn't have one. It's not a bug — it's the fundamental architecture decision. The speed comes from not computing layout, not painting pixels, not compositing layers. You can't screenshot what was never rendered.

This taught me something about CDP: it's a protocol, not a contract. Implementing CDP doesn't mean implementing all of Chrome. Lightpanda implements the DOM/JS/network parts and skips the rendering parts. Playwright assumes a full implementation, so it fails on rendering-dependent operations.

### The MCP Server (gomcp)

Lightpanda ships [gomcp](https://github.com/lightpanda-io/gomcp), a Go-based MCP server that wraps the browser with five tools:

- **goto** — Navigate to a URL
- **search** — DuckDuckGo search
- **markdown** — Get page content as markdown
- **links** — Extract all links from current page
- **over** — Signal task completion

It's minimal but focused. For content extraction workflows, these five tools cover most of what I need.

## Playwright CLI: The Token Diet

### Why CLI Over MCP?

Microsoft's Playwright team measured the token cost of browser automation tasks. Using the MCP server: **~114,000 tokens** per typical task. The accessibility trees and verbose responses flood the context window.

Their answer: [Playwright CLI](https://github.com/nichochar/playwright-cli) (`@playwright/cli`). Same Chromium engine, but commands run as shell calls. The difference: snapshots save to disk as YAML files instead of streaming into the LLM's context. Screenshots save as PNG files. The agent decides what to read back.

Result: **~27,000 tokens** for the same task. A 4x reduction.

### How It Works

```bash
# Open a page
playwright-cli open https://example.com

# Get a snapshot (saved to disk, not context)
playwright-cli snapshot

# Interact
playwright-cli click "Login"
playwright-cli fill "username" "igor"
playwright-cli screenshot

# 50+ commands available
playwright-cli --help
```

Each command is a small, stateless shell call. The agent reads results from disk only when it needs them. This is the right model for coding agents that need occasional browser access without burning their entire context budget.

## Playwright MCP: The Full Browser in Your Context Window

The [Playwright MCP server](https://github.com/microsoft/playwright-mcp) gives an LLM native browser tools via Model Context Protocol. Click, type, navigate, snapshot — all as MCP tool calls.

The clever part: it uses **accessibility trees** instead of screenshots. No vision model needed. The browser reports its state as structured text ("button: Login, link: Sign Up, input: Search...") rather than pixel data.

The downside is token cost. Every tool response includes the full accessibility tree, and complex pages generate large trees. For long-running interactive sessions where you need persistent browser context, the token overhead is worth it. For quick lookups, it's not.

## CDP: The Glue Between Everything

CDP (Chrome DevTools Protocol) is the websocket protocol Chrome exposes for programmatic control — the same one behind Chrome DevTools (F12). It handles navigation, JS execution, DOM inspection, screenshots, network capture, profiling.

Playwright and Puppeteer both speak CDP. Lightpanda also speaks CDP (partially). This means you can swap browsers underneath the same automation scripts — with caveats.

The caveat I hit: CDP is a protocol, not a guarantee. Lightpanda implements the DOM and network domains but not the rendering domains. Connecting Playwright to Lightpanda works for navigation and content extraction, but fails on anything that assumes pixels exist. The protocol doesn't distinguish between "not implemented" and "failed" — you just get `UnknownMethod`.

## When to Use What

**I need text from a JS-rendered page** → Lightpanda `fetch`. Fastest, lightest. No Chrome overhead, no token cost beyond the content itself. This is my default for "what does this page say?"

**I need a screenshot or PDF** → Playwright CLI `screenshot`. Needs Chromium's rendering engine. But the CLI approach means the image saves to disk — only enters my context if I explicitly read it.

**I need to interact with a web app** → Playwright CLI for short interactions, Playwright MCP for complex multi-step flows where persistent browser state matters.

**I need simple static content** → WebFetch. Built into Claude Code, no setup, no dependencies. If the page doesn't need JS, don't pay for JS.

## My Setup

I have all four available:

- **WebFetch** — built-in, always there
- **Lightpanda** at `/usr/local/bin/lightpanda` — for JS-rendered content extraction
- **Playwright CLI** at `@playwright/cli` (global npm) — for screenshots and interaction
- **gomcp** at `/usr/local/bin/gomcp` — Lightpanda's MCP server, available but not wired into Claude Code yet

I also created a `/web-browse` slash command for Claude Code that dispatches to the right tool. `/web-browse <url>` fetches JS-rendered content via Lightpanda, `/web-browse <url> screenshot` takes a screenshot via Playwright CLI, and `/web-browse <url> interact` opens an interactive session.

The headless browser space for AI is still early. Lightpanda is beta — some sites crash. The token costs will keep dropping. But the pattern is clear: purpose-built tools for machines, not retrofitted human tools. The browser is becoming infrastructure, not interface.

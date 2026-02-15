---
description: "Browse a URL using the best available tool. Dispatches to Lightpanda (content), Playwright CLI (screenshots/interaction), or WebFetch (fallback)."
argument-hint: "<url> [content|screenshot|interact]"
allowed-tools: ["Bash", "Read", "Write"]
---

# Web Browse

Unified web browsing for AI agents. Dispatches to the right tool based on mode.

**Input:** `$ARGUMENTS`

## Workflow

### 1. Parse Arguments

Extract URL and optional mode from `$ARGUMENTS`:
- First argument: URL (required)
- Second argument: mode — `content` (default), `screenshot`, or `interact`

If no URL provided, ask the user for one.

### 2. Dispatch by Mode

#### Mode: `content` (default)

Fetch page content with JS execution via Lightpanda, convert to clean text:

```bash
lightpanda fetch --dump --strip_mode full "$URL" 2>/dev/null | pandoc -f html -t plain --wrap=none 2>/dev/null
```

If you need markdown formatting (links, headers) instead of plain text:

```bash
lightpanda fetch --dump --strip_mode full "$URL" 2>/dev/null | pandoc -f html -t markdown --wrap=none 2>/dev/null
```

If the output is too large (>50KB), truncate:

```bash
lightpanda fetch --dump --strip_mode full "$URL" 2>/dev/null | pandoc -f html -t plain --wrap=none 2>/dev/null | head -500
```

#### Mode: `screenshot`

Take a screenshot using Playwright CLI (requires `--browser chromium`):

```bash
playwright-cli --browser chromium screenshot "$URL" --output /tmp/screenshot.png
```

Then read the screenshot file to show the user what the page looks like.

#### Mode: `interact`

Open an interactive Playwright CLI session:

```bash
playwright-cli --browser chromium open "$URL"
```

Use subsequent Playwright CLI commands as needed: `click`, `fill`, `snapshot`, `screenshot`, etc.
When done: `playwright-cli session-stop`

### 3. Present Results

- Show extracted content or screenshot to the user
- If content was truncated, mention that and offer to extract specific sections
- Highlight key information the user might be looking for

### 4. Fallback Chain

If the primary tool fails, try the next one in order:

1. **Lightpanda** → fast, zero tokens, handles JS
2. **WebFetch** → built-in, sometimes passes Cloudflare where Lightpanda doesn't
3. **Playwright CLI** → real Chromium, handles most sites but heavier
4. **Give up** → tell the user the site has aggressive bot protection, ask them to paste content

### 5. Troubleshooting

**Lightpanda fails or returns empty/Cloudflare challenge:**
- Try without strip_mode: `lightpanda fetch --dump "$URL" 2>/dev/null`
- Try with a longer timeout: `lightpanda fetch --dump --http_timeout 30000 "$URL" 2>/dev/null`
- Lightpanda is beta — some sites crash, Cloudflare-protected sites always fail

**Playwright CLI errors:**
- "Chromium distribution 'chrome' is not found" → use `--browser chromium` flag
- "Browser specified in your config is not installed" → run `npx playwright install chromium` from the playwright-cli package dir
- Session stuck → `playwright-cli session-stop && playwright-cli session-delete`

**Cloudflare-protected sites (Medium, etc.):**
- Lightpanda: always blocked (fails JS fingerprint challenge)
- WebFetch: usually 403
- Headless Chromium: stuck on "Just a moment..." (detects headless mode)
- No good workaround — ask user to paste content or use a different source

## When to Use Each Mode

- **content** — Default. Fast, zero token overhead. JS-rendered pages, SPAs, docs sites
- **screenshot** — Visual verification. Layout, styling, visual bugs
- **interact** — Fill forms, click buttons, multi-step navigation flows

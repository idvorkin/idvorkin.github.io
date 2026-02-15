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

Take a screenshot using Playwright CLI:

```bash
npx --yes @anthropic-ai/playwright-cli screenshot "$URL" --output /tmp/screenshot.png
```

Then read the screenshot file to show the user what the page looks like.

#### Mode: `interact`

Open an interactive Playwright CLI session:

```bash
npx --yes @anthropic-ai/playwright-cli open "$URL"
```

Then list available commands:

```bash
npx --yes @anthropic-ai/playwright-cli --help
```

Use subsequent Playwright CLI commands as needed: `click`, `fill`, `snapshot`, `screenshot`, etc.

### 3. Present Results

- Show extracted content or screenshot to the user
- If content was truncated, mention that and offer to extract specific sections
- Highlight key information the user might be looking for

### 4. Troubleshooting

If Lightpanda fails or returns empty content (content mode):
- Try without strip_mode: `lightpanda fetch --dump "$URL" 2>/dev/null`
- Try with a longer timeout: `lightpanda fetch --dump --http_timeout 30000 "$URL" 2>/dev/null`
- Note: Lightpanda is beta software — some sites may not render correctly
- Fall back to WebFetch if Lightpanda can't handle the site

If Playwright CLI fails (screenshot/interact mode):
- Ensure it's installed: `npx --yes @anthropic-ai/playwright-cli --help`
- Check if a browser is available: `npx playwright install chromium`

## When to Use Each Mode

- **content** — Default. Fast, zero token overhead. Use when you need text from JS-rendered pages, SPAs, documentation sites
- **screenshot** — When visual verification matters. Layout, styling, visual bugs
- **interact** — When you need to fill forms, click buttons, navigate multi-step flows

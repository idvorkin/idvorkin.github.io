---
description: "Work on AI blog content with full context of related AI posts"
argument-hint: "[post-name, e.g. ai-cockpit]"
allowed-tools:
  ["Bash", "Glob", "Grep", "Read", "Edit", "Write", "AskUserQuestion", "Skill"]
---

# AI Content Workflow

Specialized workflow for working on AI-related blog posts. Loads the full landscape of Igor's AI content so you can cross-reference, cross-link, and maintain consistency across posts.

**Target Post:** "$ARGUMENTS" (or prompt Igor if not provided)

## Workflow

### Phase 1: Present AI Content Map

Display this map of AI posts organized by theme cluster:

```
AI Content Map (21 posts)

CHOP / Vibe Coding:
  /how-igor-chops  (_d/how-igor-chops.md) - Igor's personal CHOP workflow
  /chop             (_d/ai-coder.md)       - AI-assisted coding (CHOP method)
  /ai-cockpit       (_d/ai-cockpit.md)     - The AI cockpit metaphor
  /ai-journal        (_d/ai-journal.md)     - AI journal/log entries

Building AI Apps:
  /ai-developer     (_d/ai-developer.md)   - Being an AI-age developer
  /ai-bestie        (_d/ai-bestie.md)      - AI bestie companion app
  /tesla            (_d/tesla.md)          - Tony the Tesla (Vapi voice)
  /ai-image         (_d/ai-imagegen.md)    - AI image generation
  /ai-art           (_d/ai-art.md)         - AI art exploration
  /genai-talk       (_d/genai-talk.md)     - GenAI presentation/talk

AI Philosophy & Big Picture:
  /ai-faq           (_d/ai-faq.md)         - AI frequently asked questions
  /ai               (_d/ai.md)            - AI overview/index
  /hyper-personal   (_d/hyper-personal.md) - Hyper-personalization
  /ai-paper         (_d/ai-paper.md)       - AI paper/essay
  /ai-bm            (_d/ai-business-model.md) - AI business models

Technical:
  /ai-testing       (_d/ai-testing.md)     - Testing AI systems
  /ai-training      (_d/ai-training.md)    - AI training/fine-tuning
  /ai-security      (_d/ai-security.md)    - AI security concerns

AI & People:
  /ai-hiring        (_d/ai-hiring.md)      - AI impact on hiring
  /ai-relationships (_d/ai-relationships.md) - AI and relationships
  /ai-native-manager (_d/ai-native-manager.md) - Managing in the AI era

Writing with AI:
  /chow             (_d/chow.md)           - AI-assisted writing (CHOW method)
```

### Phase 2: Load Target Post

1. **If $ARGUMENTS is provided:**
   - Match it to a post from the map above (fuzzy match on permalink or filename)
   - Read the target post file
   - Identify 2-3 most thematically related posts from the map and read those too
   - Show Igor what you loaded:
     ```
     Loaded: /ai-cockpit (_d/ai-cockpit.md)
     Related context: /chop, /how-igor-chops
     ```

2. **If $ARGUMENTS is empty:**
   - Ask Igor: "Which AI post are you working on? (permalink or filename, or 'new' for a new post)"
   - Then proceed as above

### Phase 3: Load Related Posts via Backlinks

**Query `back-links.json` dynamically** to find the real related posts. Do NOT guess - use actual link data.

For the target post's permalink (e.g. `/ai-cockpit`), run:

```bash
jq --arg url "/ai-cockpit" '
  .url_info[$url] |
  ((.incoming_links // []) + (.outgoing_links // [])) | unique
' back-links.json
```

This returns all posts that link to or are linked from the target. Filter the results to AI-related posts from the map above, then read the top 2-3 most relevant ones.

**If the post has no backlinks yet** (new post), fall back to reading 2-3 posts from the same theme cluster in the map above.

### Phase 4: Delegate to /content Workflow

After loading AI context, delegate to the `/content` skill for:
- Feature branch setup
- Jekyll server check
- Content guidelines
- Key conventions reminder

Use: `/content $ARGUMENTS` (pass through the same arguments)

### Phase 5: AI-Specific Guidance

After the content workflow completes, add this AI-specific reminder:

```
AI Content Tips:
- Cross-link related AI posts (see map above)
- Use consistent terminology across AI posts
- /ai-faq is the canonical "what is AI" reference - link there for basics
- /chop is the canonical CHOP reference
- /ai-journal has specific formatting rules (read top of file)
- Check if your content overlaps with existing posts before adding new sections
```

## Key Source Authors

Igor frequently draws on these writers for AI content. Check their latest posts when looking for new material:

- **Steve Yegge** - AI productivity, value capture, software survival. Already referenced in ai-journal (AI Vampire, Software Survival 3.0).
  - Blog is on Medium (Cloudflare-protected, blocks headless browsers)
  - **Use RSS feed to read his posts**: `curl -s "https://steve-yegge.medium.com/feed"` — returns full article content, bypasses Cloudflare entirely
- **Simon Willison** - [simonwillison.net](https://simonwillison.net/) - AI tooling, LLM practical usage, open source + AI dynamics. Creator of Datasette, Django co-creator. Prolific blogger on AI developments.
  - **Atom feed**: `curl -s "https://simonwillison.net/atom/everything/"` — his site is direct-fetchable too, but the feed is great for scanning recent posts

### How to fetch their latest posts

```bash
# Yegge (Medium) — RSS is the only reliable way, Medium blocks WebFetch
curl -s "https://steve-yegge.medium.com/feed" | xmllint --xpath '//item/title/text()' - 2>/dev/null

# Willison — Atom feed for recent posts
curl -s "https://simonwillison.net/atom/everything/" | xmllint --xpath '//*[local-name()="entry"]/*[local-name()="title"]/text()' - 2>/dev/null
```

For full article content from Yegge, pipe the RSS through WebFetch or parse the `<content:encoded>` field directly — the feed includes the complete post body.

## Examples

**Work on AI cockpit post:**
```
/ai-content ai-cockpit
# Loads cockpit + related CHOP posts, sets up branch/server
```

**Work on a new AI post:**
```
/ai-content
# Shows AI map, asks Igor what to work on
```

**Work on AI hiring:**
```
/ai-content ai-hiring
# Loads hiring + related people/management posts
```

---
description: "Process links into curated feed, or debrief on what you read"
argument-hint: "<url1> <url2> ... OR debrief"
allowed-tools:
  [
    "Bash",
    "Glob",
    "Grep",
    "Read",
    "Edit",
    "Write",
    "WebFetch",
    "WebSearch",
    "AskUserQuestion",
    "Agent",
  ]
---

# AI Feed Consumer

Two-phase workflow for curating links into the blog post at `_d/ai-feed.md` (`/ai-feed`).

**Arguments:** "$ARGUMENTS"

## Detect Phase

If `$ARGUMENTS` contains "debrief" (case-insensitive), go to **Phase 2: Debrief**.
Otherwise, treat all arguments as URLs and go to **Phase 1: Triage**.

---

## Phase 1: Triage

Process a batch of URLs into the feed.

### Step 1: Fetch & Summarize

For each URL:

1. Fetch content using WebFetch (or `/web-browse` skill for tricky sites)
2. Produce a 2-3 sentence summary highlighting the **core argument** — not just what the article covers, but what position it takes

### Step 2: Cross-Link

For each article, search Igor's blog for related content:

```bash
# Search _d/ and _posts/ for thematically related content
grep -rli "relevant keyword" _d/ _posts/ | head -5
```

Surface the top 2-3 matches with their permalinks. Use `back-links.json` to find permalinks:

```bash
jq '.url_info | to_entries[] | select(.value.markdown_path | test("keyword")) | .key' back-links.json
```

### Step 3: Predict

Read the taste profile from the "What I Gravitate Toward" section of `_d/ai-feed.md`.

For each link, predict Igor's interest level:

- "I think you'll **love** this because [reason]"
- "I think you'll **find this interesting** because [reason]"
- "I think you'll **probably skip** this because [reason]"

Present ALL predictions to Igor at once so he can see the full batch ranked by predicted interest.

### Step 4: Tag

Propose 2-3 tags per link (e.g., `#ai-practice`, `#craft`, `#contrarian`, `#productivity`, `#management`).
Present tags alongside predictions — Igor can accept, modify, or add.

### Step 5: Write to Blog

Append entries to `_d/ai-feed.md` under today's date heading.

**Format for each entry:**

```markdown
- **[Article Title](url)** — Author on topic
  - _Summary_: 2-3 sentence summary
  - _Why I'd like it_: Prediction reasoning
  - _Cross-links_: [Related Post](/permalink), [Another](/permalink)
  - _Tags_: #tag1 #tag2 #tag3
  - _Reaction_:
```

**Rules:**

- If today's date heading (`### YYYY-MM-DD`) already exists, append below existing entries for that date
- If it doesn't exist, add it at the top of the Feed section (reverse chronological)
- Leave the _Reaction_ field empty — that's filled in during Phase 2
- Use the current date from the system, not hardcoded

---

## Phase 2: Debrief

Come back after reading some articles to record reactions and refine taste.

### Step 1: Show Unread

Read `_d/ai-feed.md` and find all entries where `*Reaction*:` is empty (no text after the colon).
Present them grouped by date, showing title + summary + prediction.

### Step 2: Walk Through

For each unread entry, one at a time, ask Igor:

- "Did you read **[Title]**? What resonated? What do you disagree with?"
- Accept free-form responses
- If Igor says "skip" or "didn't read", leave the reaction empty and move on

### Step 3: Record Reactions

Write Igor's responses into the `*Reaction*:` field for each entry he commented on.
Use Edit tool to replace the empty reaction line with Igor's words (keep them authentic — don't polish or rewrite).

### Step 4: Score Predictions

After walking through all entries, note:

- Which predicted "love" items did Igor actually read and react to?
- Which predicted "skip" items did Igor surprise you by loving?
- Which predictions were accurate?

### Step 5: Update Taste Profile

Based on the session's data, propose updates to the "What I Gravitate Toward" section:

- Show the current profile
- Show what you'd change and why
- Get Igor's approval before editing

---

## Example Usage

**Triage a batch of links:**

```
/ai-feed https://registerspill.thorstenball.com/p/joy-and-curiosity-76 https://simonwillison.net/2026/Feb/28/something/
```

**Debrief on what you've read:**

```
/ai-feed debrief
```

---
description: "Search for related blog posts by keyword, theme, or metadata"
allowed-tools: ["Bash", "Grep", "Glob", "Read"]
---

# Finding Related Blog Content

## Simple Keyword Searches

Use Grep directly for "does my blog mention X?" queries:

```bash
grep -ri "keyword" _d _posts _td
```

## Thematic/Conceptual Searches

Use the Explore agent for "what content relates to productivity?" queries. It understands context and relationships beyond exact keyword matches.

## Metadata Queries (titles, tags, links)

Use `jq` on `back-links.json`:

```bash
# Search by title
jq '.url_info | to_entries[] | select(.value.title | ascii_downcase | contains("family")) | {url: .key, title: .value.title}' back-links.json

# Get post metadata
jq '.url_info["/gap-year-igor"]' back-links.json

# Find posts linking to a URL
jq '.url_info | to_entries[] | select(.value.incoming_links[]? == "/eulogy") | .key' back-links.json
```

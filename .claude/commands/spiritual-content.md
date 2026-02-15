---
description: "Work on spiritual/emotional health blog content with full context of related posts"
argument-hint: "[post-name, e.g. eulogy]"
allowed-tools:
  ["Bash", "Glob", "Grep", "Read", "Edit", "Write", "AskUserQuestion", "Skill"]
---

# Spiritual & Emotional Health Content Workflow

Specialized workflow for working on spiritual health, emotional health, affirmations, eulogy, and inner-life blog posts. Loads the full landscape of Igor's inner-life content so you can cross-reference, cross-link, and maintain consistency across posts.

**Target Post:** "$ARGUMENTS" (or prompt Igor if not provided)

## Workflow

### Phase 1: Present Inner Life Content Map

Display this map of spiritual/emotional health posts organized by theme cluster:

```
Inner Life Content Map (17 posts)

Core Identity & Frameworks:
  /eulogy            (_posts/2020-04-01-Igor-Eulogy.md) - How Igor wants to live across all dimensions
  /four-healths      (_d/four-healths.md)               - Physical, emotional, spiritual, cognitive health
  /affirmations      (_d/affirmations2.md)              - Daily affirmations practice (4 core affirmations)
  /spiritual-health  (_d/spiritual-health.md)           - Purpose, transcendence, and coherence
  /build-life-you-want (_d/build-the-life-you-want.md)  - Arthur Brooks' happiness framework

Emotional Health & Practices:
  /emotional-health  (_d/emotional-health-hold.md)      - Daily emotional health practices & meditation
  /siy               (_d/siy.md)                        - Search Inside Yourself / emotional intelligence
  /sublime           (_d/sublime.md)                    - Buddhist sublime states (loving-kindness, etc.)
  /happy             (_posts/2017-04-12-happy.md)       - Happiness frameworks and savoring

Compassion, Joy & Gratitude:
  /curious           (_d/grandmother.md)                - Grandmother mind, compassion over judgment
  /joy               (_d/joy.md)                        - Smiles, joy and wonder
  /grateful          (_d/grateful2.md)                  - Gratefulness practice
  /mental-pain       (_d/mental-pain.md)                - Understanding pain, suffering, and misery

Meaning & Mortality:
  /religion          (_d/religion.md)                   - Personal spiritual journey and finding value
  /death             (_d/on-being-mortal.md)            - Mortality and living well
  /walking-with-god  (_d/walking-with-god.md)           - Daily devotional practice
  /elder             (_d/elder.md)                      - Lifecycle transitions, vanaprastha stage
```

### Phase 2: Load Target Post

1. **If $ARGUMENTS is provided:**
   - Match it to a post from the map above (fuzzy match on permalink or filename)
   - Read the target post file
   - Identify 2-3 most thematically related posts from the map and read those too
   - Show Igor what you loaded:
     ```
     Loaded: /eulogy (_posts/2020-04-01-Igor-Eulogy.md)
     Related context: /affirmations, /four-healths
     ```

2. **If $ARGUMENTS is empty:**
   - Ask Igor: "Which inner-life post are you working on? (permalink or filename, or 'new' for a new post)"
   - Then proceed as above

### Phase 3: Load Related Posts via Backlinks

**Query `back-links.json` dynamically** to find the real related posts. Do NOT guess - use actual link data.

For the target post's permalink (e.g. `/eulogy`), run:

```bash
jq --arg url "/eulogy" '
  .url_info[$url] |
  ((.incoming_links // []) + (.outgoing_links // [])) | unique
' back-links.json
```

This returns all posts that link to or are linked from the target. Filter the results to inner-life posts from the map above, then read the top 2-3 most relevant ones.

**If the post has no backlinks yet** (new post), fall back to reading 2-3 posts from the same theme cluster in the map above.

### Phase 4: Delegate to /content Workflow

After loading inner-life context, delegate to the `/content` skill for:
- Feature branch setup
- Jekyll server check
- Content guidelines
- Key conventions reminder

Use: `/content $ARGUMENTS` (pass through the same arguments)

### Phase 5: Inner Life Content Guidance

After the content workflow completes, add this inner-life-specific reminder:

```
Inner Life Content Tips:
- Cross-link related posts (see map above)
- /eulogy is the cornerstone identity document - link there for "who Igor wants to be"
- /four-healths frames the relationship between emotional and spiritual health
- /affirmations maps to the four healths - keep them consistent
- /spiritual-health defines the three components: purpose, transcendence, coherence
- /emotional-health lists the active daily practices - update when practices change
- /curious (grandmother mind) is the canonical compassion reference
- /sublime is the canonical reference for Buddhist practices
- Check if your content overlaps with existing posts before adding new sections
- These posts are deeply personal - maintain Igor's authentic voice and vulnerability
```

## Examples

**Work on the eulogy:**
```
/spiritual-content eulogy
# Loads eulogy + affirmations + four-healths, sets up branch/server
```

**Work on emotional health:**
```
/spiritual-content emotional-health
# Loads emotional health + sublime + siy context
```

**Work on a new inner-life post:**
```
/spiritual-content
# Shows inner life map, asks Igor what to work on
```

**Work on affirmations:**
```
/spiritual-content affirmations
# Loads affirmations + four-healths + eulogy context
```

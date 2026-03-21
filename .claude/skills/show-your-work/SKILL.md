---
name: show-your-work
description: Screenshot changed blog pages and host images on GitHub gist for PR descriptions. Use after content changes are committed and before creating a PR. Auto-detects changed pages from git diff against main.
allowed-tools: Bash, Read, Glob, Grep
---

# Show Your Work — PR Screenshots for Content Changes

Screenshot the pages you changed, host them on a gist, and produce markdown ready for a PR description.

## Arguments

Parse the user's input for:

- **No args** → auto-detect changed pages from git diff against main
- **`/permalink`** → screenshot a specific page
- **`PR_NUMBER`** → screenshot changed pages and update an existing PR description

## Workflow

### Phase 1: Prerequisites

1. **Verify we're on a feature branch:**

   ```bash
   BRANCH=$(git branch --show-current)
   if [ "$BRANCH" = "main" ]; then
     echo "ERROR: On main branch — nothing to show. Switch to a feature branch first."
     exit 1
   fi
   ```

2. **Check Jekyll server is running:**

   ```bash
   running-servers check .
   ```

   If not running, start it and wait:

   ```bash
   just jekyll-serve 4000 35729 > /tmp/jekyll.log 2>&1 &
   timeout 90 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ | grep -q 200; do sleep 3; done'
   ```

   **Gotcha:** First build takes ~30s. Don't screenshot until the server is ready.

### Phase 2: Detect Changed Pages

Find content files changed on this branch vs main and extract their permalinks:

```bash
# Get changed content files
CHANGED_FILES=$(git diff --name-only main -- '_d/*.md' '_posts/*.md' '_td/*.md' 2>/dev/null)

# Extract permalinks
for f in $CHANGED_FILES; do
  PERMALINK=$(grep -m1 'permalink:' "$f" | awk '{print $2}' | tr -d '"')
  if [ -n "$PERMALINK" ]; then
    echo "$f → $PERMALINK"
  fi
done
```

**If no content files changed** (e.g. layout/include changes):

- Check if specific permalink was passed as argument — use that
- Otherwise ask: "No content pages detected in diff. Which page should I screenshot?"

**If include/layout files changed** (files in `_includes/` or `_layouts/`):

- These affect many pages — screenshot home page as a baseline
- Ask if there are specific pages to check

### Phase 3: Take Screenshots

For each detected page, take desktop and mobile screenshots:

```bash
BRANCH=$(git branch --show-current)
SAFE_BRANCH=$(echo "$BRANCH" | tr '/' '-')
WORK_DIR="/tmp/show-your-work/${SAFE_BRANCH}"
mkdir -p "$WORK_DIR"

# Desktop
npx playwright screenshot --browser chromium \
  --viewport-size "1280,900" \
  --wait-for-timeout 3000 \
  "http://localhost:4000${PERMALINK}" \
  "${WORK_DIR}/${NAME}-desktop.png"

# Mobile
npx playwright screenshot --browser chromium \
  --viewport-size "375,812" \
  --wait-for-timeout 3000 \
  "http://localhost:4000${PERMALINK}" \
  "${WORK_DIR}/${NAME}-mobile.png"
```

**After each screenshot, validate it's not blank:**

```bash
SIZE=$(stat -c%s "${WORK_DIR}/${NAME}-desktop.png" 2>/dev/null || echo 0)
if [ "$SIZE" -lt 10000 ]; then
  echo "WARNING: ${NAME}-desktop.png is ${SIZE} bytes — likely blank. Retrying with longer timeout..."
  npx playwright screenshot --browser chromium \
    --viewport-size "1280,900" \
    --wait-for-timeout 6000 \
    "http://localhost:4000${PERMALINK}" \
    "${WORK_DIR}/${NAME}-desktop.png"
fi
```

### Phase 4: Visual Verification

**Use the Read tool to view each screenshot** (Claude can see images). Check that:

1. The page actually rendered (not a blank white/grey page or error page)
2. The content matches what was changed (the right page loaded)
3. No obvious rendering issues (broken layout, missing styles, overlapping elements)

```
For each screenshot in /tmp/show-your-work/${SAFE_BRANCH}/:
  Read the PNG file using the Read tool
  Assess: Does this look like a properly rendered blog page?
```

**If a screenshot looks wrong:**

- Blank/white → retry with `--wait-for-timeout 6000`
- 404 or error page → the permalink is wrong, re-check the frontmatter
- Partially loaded (missing styles, broken layout) → wait longer or check if Jekyll finished building
- Wrong page → the permalink extraction was incorrect

**Do not proceed to hosting until all screenshots pass visual inspection.** Bad screenshots in a PR are worse than no screenshots.

### Phase 5: Host on Gist

Use the gist-as-git-repo technique (gh gist create rejects binary files):

```bash
GIST_NAME="pr-${BRANCH}-screenshots"
GH_USER=$(gh api user --jq '.login')

# 1. Create gist with placeholder
GIST_URL=$(gh gist create --public --desc "$GIST_NAME" - <<< "# $GIST_NAME" 2>&1 | grep gist.github.com)
GIST_ID=$(basename "$GIST_URL")

# 2. Clone, convert to JPG (smaller), push
git clone "$GIST_URL" "/tmp/gist-${GIST_NAME}"
WORK_DIR="/tmp/show-your-work/${BRANCH}"

for png in ${WORK_DIR}/*.png; do
  BASENAME=$(basename "$png" .png)
  magick "$png" -quality 80 "/tmp/gist-${GIST_NAME}/${BASENAME}.jpg"
done

cd "/tmp/gist-${GIST_NAME}"
git remote set-url origin "https://x-access-token:$(gh auth token)@gist.github.com/${GIST_ID}.git"
git add *.jpg
git commit -m "Add screenshots for ${BRANCH}"
git push
cd -
```

### Phase 6: Produce Output

Build the markdown image block:

```markdown
## Screenshots

| Page       | Desktop                                                                          | Mobile                                                                         |
| ---------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| /permalink | ![desktop](https://gist.githubusercontent.com/USER/GIST_ID/raw/name-desktop.jpg) | ![mobile](https://gist.githubusercontent.com/USER/GIST_ID/raw/name-mobile.jpg) |
```

**If a PR number was provided**, update the PR description:

```bash
# Get existing body
EXISTING_BODY=$(gh pr view $PR_NUMBER --json body --jq '.body')

# Append screenshots section (or replace if already present)
NEW_BODY="${EXISTING_BODY}

## Screenshots
${SCREENSHOT_TABLE}"

gh pr edit $PR_NUMBER --body "$NEW_BODY"
```

**If no PR number**, print the markdown block so it can be used when creating the PR.

### Phase 7: Summary

Show:

- Number of pages screenshotted
- Any warnings (blank screenshots, missing permalinks)
- The gist URL (for cleanup later)
- The markdown block to copy
- If PR was updated, link to the PR with `/files` suffix

### Phase 8: Cleanup Reminder

```
To delete the screenshot gist later:
  gh gist delete --yes GIST_ID
  rm -rf /tmp/gist-pr-SAFE_BRANCH-screenshots /tmp/show-your-work/SAFE_BRANCH
```

## Tips

- If a page has JS-heavy content (charts, interactive widgets), increase `--wait-for-timeout` to 5000-6000ms
- For pages that need scrolling to show the change, use `--full-page` flag
- Screenshots are JPG for smaller file size — fine for PR review purposes
- One gist per branch keeps things traceable and easy to clean up
- The `/tmp/show-your-work/` directory is ephemeral — blown away each run

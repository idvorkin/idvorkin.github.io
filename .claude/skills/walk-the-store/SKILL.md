---
name: walk-the-store
description: Visual walkthrough of the blog — screenshots key pages, builds a browsable gallery. Use when you want to visually inspect the blog, check for regressions after changes, or do a full visual audit. Quick mode screenshots home + current work page. Full mode covers all key pages and components.
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Walk the Store — Visual Blog Audit

Screenshot key blog pages, build a browsable gallery, serve it for visual inspection.

## Arguments

Parse the user's input for:

- **No args** → default regression mode (home + current work page)
- **`full`** → full audit of all key pages and components
- **`/permalink`** → screenshot a specific page (desktop + mobile)

## Workflow

### Phase 1: Prerequisites

1. **Check Jekyll server is running:**

   ```bash
   running-servers check .
   ```

   If not running, start it:

   ```bash
   just jekyll-serve 4000 35729 > /tmp/jekyll.log 2>&1 &
   timeout 60 bash -c 'until curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ | grep -q 200; do sleep 2; done'
   ```

2. **Set up output directory:**

   ```bash
   rm -rf docs/walk-the-store && mkdir -p docs/walk-the-store
   ```

### Phase 2: Determine What to Screenshot

Build a shot list based on the mode.

**Default mode** — quick regression:

```bash
# Always include home
SHOTS="home|/|desktop"

# Find changed markdown files on current branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  for f in $(git diff --name-only main -- '_d/*.md' 2>/dev/null); do
    PERMALINK=$(grep -m1 'permalink:' "$f" | awk '{print $2}' | tr -d '"')
    if [ -n "$PERMALINK" ]; then
      NAME=$(basename "$f" .md)
      SHOTS="$SHOTS\n$NAME|$PERMALINK|desktop"
    fi
  done
fi
```

**Full mode** — comprehensive walkthrough:

| Name              | URL                    | Viewport |
| ----------------- | ---------------------- | -------- |
| home-desktop      | /                      | 1280x900 |
| home-mobile       | /                      | 375x812  |
| toc               | /toc                   | 1280x900 |
| eulogy-desktop    | /eulogy                | 1280x900 |
| eulogy-mobile     | /eulogy                | 375x812  |
| amazon-cards      | /test/include-amazon   | 1280x900 |
| charts            | /regrets               | 1280x900 |
| search            | /search?q=eulogy       | 1280x900 |
| voice-widget      | /tesla                 | 1280x900 |
| recently-modified | (auto-detect)          | 1280x900 |
| current-work      | (if on feature branch) | 1280x900 |

To find the recently modified post:

```bash
RECENT_FILE=$(git log --diff-filter=M --name-only -1 --pretty=format: -- '_d/*.md' | head -1)
RECENT_PERMALINK=$(grep -m1 'permalink:' "$RECENT_FILE" | awk '{print $2}' | tr -d '"')
```

**Specific page mode** (`/walk-the-store /ai-second-brain`):

Two shots: desktop (1280x900) and mobile (375x812) of the given permalink.

### Phase 3: Take Screenshots

For each shot in the list, run:

```bash
npx playwright screenshot --browser chromium \
  --viewport-size "WIDTH,HEIGHT" \
  --wait-for-timeout 3000 \
  "http://localhost:4000{PERMALINK}" \
  docs/walk-the-store/NAME.png
```

**Error handling:**

- If the command fails, log a warning and continue to next shot
- After each screenshot, check file size:

  ```bash
  SIZE=$(stat -c%s "docs/walk-the-store/NAME.png" 2>/dev/null || echo 0)
  if [ "$SIZE" -lt 5000 ]; then
    echo "WARNING: NAME.png is only ${SIZE} bytes — possibly blank"
  fi
  ```

**For pages needing scroll** (charts on /regrets, quadrant on /coaching):
Use a full Playwright script or take a full-page screenshot instead:

```bash
npx playwright screenshot --browser chromium \
  --viewport-size "1280,900" \
  --wait-for-timeout 3000 \
  --full-page \
  "http://localhost:4000{PERMALINK}" \
  docs/walk-the-store/NAME.png
```

### Phase 4: Build Gallery Page

Generate `docs/walk-the-store/demo.html` — a simple HTML gallery showing all screenshots.

Use this Python script:

```bash
python3 << 'PYEOF'
import glob, os, time

imgs = sorted(glob.glob("docs/walk-the-store/*.png"))
timestamp = time.strftime("%Y-%m-%d %H:%M")

html = f"""<!DOCTYPE html>
<html><head><title>Walk the Store — {timestamp}</title>
<style>
body {{ font-family: system-ui; max-width: 1400px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: #eee; }}
h1 {{ color: #e94560; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }}
.card {{ background: #16213e; border-radius: 8px; overflow: hidden; border: 1px solid #0f3460; }}
.card a img {{ width: 100%; height: auto; display: block; }}
.card .label {{ padding: 10px 14px; font-size: 14px; color: #a8a8a8; }}
.card .label .name {{ color: #e94560; font-weight: bold; font-size: 16px; }}
.warn {{ color: #f39c12; font-style: italic; }}
</style></head><body>
<h1>Walk the Store — {timestamp}</h1>
<div class="grid">
"""

for img in imgs:
    name = os.path.basename(img).replace('.png', '').replace('-', ' ').title()
    size = os.path.getsize(img)
    warn = ' <span class="warn">(possibly blank)</span>' if size < 5000 else ''
    fname = os.path.basename(img)
    html += f'<div class="card"><a href="{fname}" target="_blank"><img src="{fname}"></a>'
    html += f'<div class="label"><span class="name">{name}</span>{warn}</div></div>\\n'

html += "</div></body></html>"

with open("docs/walk-the-store/demo.html", "w") as f:
    f.write(html)
print("Gallery built")
PYEOF
```

### Phase 5: Serve Gallery

```bash
cd docs/walk-the-store && python3 -m http.server PORT &>/dev/null &
```

Pick an available port (try 4010, 4011, etc.). Print the Tailscale URL:

```
Walk the Store gallery: http://HOSTNAME:PORT/demo.html
```

### Phase 6: Present Summary

Show the user:

- Number of screenshots taken
- Any warnings (blank screenshots, 404 pages)
- The gallery URL
- Quick thumbnails of 2-3 key shots inline (using Read tool on the PNG files)

## Tips

- If a screenshot comes back blank, the page likely needs more JS load time. Try `--wait-for-timeout 5000`.
- The gallery overwrites each run — no cleanup needed.
- Don't commit `docs/walk-the-store/` — it's ephemeral diagnostic output.

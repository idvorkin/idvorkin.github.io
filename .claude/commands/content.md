---
description: "Work on blog content: read guidelines, ensure branch, start server"
argument-hint: "[branch-name]"
allowed-tools:
  ["Bash", "Glob", "Grep", "Read", "Edit", "Write", "AskUserQuestion"]
---

# Content Work Workflow

Comprehensive workflow for working on blog content (new or existing) following project conventions.

**Branch Name:** "$ARGUMENTS" (or prompt Igor if needed)

## Workflow

### Phase 1: Read Content Guidelines

1. **Read content_guidelines.md**
   - Extract and display the 8 content types with their purposes
   - Show this as a quick reference for Igor

2. **Present content types clearly:**

   ```
   Available Content Types:
   1. Book Summaries/Reviews - Process learning and share insights
   2. Personal Philosophy/Identity Posts - Work through life questions
   3. Professional/Management Content - Share workplace wisdom
   4. Reference/Framework Content - Create living documents
   5. Major Life Decision Documentation - Document significant choices
   6. Practical Hobby/Lifestyle Posts - Share what works in daily life
   7. Journal/Exploration Content - Think through emerging topics
   8. Personal Narrative/Story Posts - Use stories as teaching tools
   ```

### Phase 2: Ensure Feature Branch

**IMPORTANT:** NEVER work directly on main. Always use a feature branch.

1. **Check current branch**
   ```bash
   git branch --show-current
   ```

2. **If on main branch:**
   - Check for uncommitted changes: `git status --short`
   - If $ARGUMENTS provided, create/switch to that branch
   - Otherwise, ask Igor: "You're on main. Create new branch or switch to existing?"
   - Pattern: `add-{topic}` or `update-{post-name}` for new branches

3. **If already on a feature branch:**
   - Show current branch name
   - If $ARGUMENTS provided and different, ask: "Switch to {$ARGUMENTS}?"
   - Otherwise, confirm: "Continue on {current-branch}?"

4. **Create new branch if needed**
   ```bash
   git checkout -b {branch-name}
   ```

5. **Switch to existing branch if needed**
   ```bash
   git checkout {branch-name}
   ```

6. **When branch was created or switched:**
   - Set flag to restart Jekyll server (branches may have different content)

### Phase 3: Check/Restart Jekyll Server

**IMPORTANT:** When switching/creating branches, restart Jekyll to pick up any content changes.

**IMPORTANT:** Use the `running-servers` pattern from CLAUDE.md if available, otherwise check manually.

1. **Check if Jekyll is running on port 4000**
   ```bash
   lsof -Pi :4000 -sTCP:LISTEN -t
   ```

2. **If branch was switched/created AND server is running:**
   - Stop the current server: `kill {PID}`
   - Wait 1-2 seconds for clean shutdown
   - Start new server (see step 4)
   - Inform Igor: "🔄 Restarted Jekyll server for new branch"

3. **If server running and branch NOT changed:**
   - Get the PID
   - Check if Tailscale hostname is available
   - Display access URLs:
     ```
     ✅ Jekyll server running
        Local:     http://localhost:4000
        Tailscale: http://{hostname}:4000 (if available)
     ```

4. **If not running (or after stopping for branch change):**
   - Inform Igor that server needs to start
   - If restarting after branch change: "Restarting server for branch {branch-name}"
   - If first start: "I'll start the Jekyll server. This will run in the background."
   - Start server in background:
     ```bash
     rbenv exec bundle exec jekyll serve --port 4000 --livereload-port 35729 --livereload
     ```

### Phase 4: Ready for Content Work

1. **Ask Igor what they're working on**
   - New post? Editing existing? Updating draft?
   - Keep it brief - just ask what file or topic

2. **If creating new content:**
   - Show the 8 content types briefly
   - Ask which type applies
   - Provide key guidelines for that type
   - Suggest file location:
     - `_d/` - Draft/living documents (most common)
     - `_posts/` - Published blog posts with dates
     - `_td/` - Technical deep dives
   - Offer to create starter template only if Igor wants

3. **If editing existing:**
   - Ask which file Igor is working on
   - Show preview URL for that specific page with section anchor if relevant
   - Remind about key conventions briefly

### Phase 5: Remind About Key Conventions

Display a concise checklist for Igor:

```
✓ Branch: {branch-name}
✓ Server: http://localhost:4000
   Tailscale: http://{hostname}:4000 (if available)

Key conventions:
• Plain text opening paragraph (before any includes)
• Use "I" not "we"
• Internal links use permalinks
• Run `just back-links` before committing

Preview: http://localhost:4000/{permalink}#{section} (if working on existing)
```

## Examples

**Work on content (current branch):**
```
/content
# Checks branch, starts server if needed, asks what you're working on
```

**Work on specific branch:**
```
/content add-shoulder-pain
# Switches to/creates branch, starts server, ready to work
```

**Update existing post:**
```
/content update-irl
# Ensures proper branch, starts server
```

## Tips

- **Don't assume new content** - Could be editing, updating, or creating
- **Ensure feature branch** - Never work on main, but don't always create new branch
- **Check for running server** - Don't start duplicate servers
- **Show preview URLs** - Include Tailscale hostname for remote access
- **Be concise** - Igor wants quick setup, not lengthy explanations
- **Provide section links** - When showing preview, link to specific sections with `#{section-slug}`
- **Ask before creating files** - Don't assume Igor wants a new file

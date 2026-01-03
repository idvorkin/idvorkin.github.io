---
description: "Handle PR feedback: run internal reviews, check external comments, address and reply"
argument-hint: "[PR-number]"
allowed-tools:
  ["Bash", "Glob", "Grep", "Read", "Edit", "Write", "Task", "TodoWrite"]
---

# PR Feedback Handler

Comprehensive workflow for handling PR feedback from both internal reviews and external sources (CodeRabbit, human reviewers).

**PR Number:** "$ARGUMENTS" (or auto-detect from current branch)

## Workflow

### Phase 1: Setup

1. **Identify PR**

   ```bash
   # If no PR number provided, detect from current branch
   gh pr view --json number,url,headRefName
   ```

2. **Get PR context**
   ```bash
   # Get changed files
   gh pr diff --name-only
   ```

### Phase 2: Run Internal Reviews First

Before checking external feedback, run our own quality checks:

1. **Run content guidelines review** (for blog posts)
   - Check content_guidelines.md compliance
   - Verify internal links use permalinks
   - Check for AI writing patterns to avoid

2. **Run code review** (if code changes)
   - Use `/pr-review-toolkit:review-pr` for comprehensive review
   - Or run specific agents as needed

### Phase 3: Fetch External Comments

**IMPORTANT:** Use the correct API calls to get ALL comments:

```bash
# Get inline review comments (line-specific feedback)
gh api repos/OWNER/REPO/pulls/PR/comments \
  --jq '.[] | {id: .id, path: .path, line: .line, body: .body}'

# Get general PR reviews
gh api repos/OWNER/REPO/pulls/PR/reviews \
  --jq '.[] | {id: .id, state: .state, body: .body}'

# Get issue-level comments (less common for reviews)
gh api repos/OWNER/REPO/issues/PR/comments \
  --jq '.[] | {id: .id, body: .body}'
```

**Common mistake:** `gh pr view --comments` only shows issue-level comments, NOT inline review comments!

### Phase 4: Categorize Feedback

Create a checklist organized by priority:

| Priority  | Type         | Examples                                                 |
| --------- | ------------ | -------------------------------------------------------- |
| Critical  | Must fix     | Security issues, broken functionality, deprecated fields |
| Important | Should fix   | Logic improvements, missing validation                   |
| Nitpick   | Nice to have | Style suggestions, wording improvements                  |
| Declined  | Won't fix    | Suggestions that conflict with project conventions       |

### Phase 5: Address Each Comment

For each comment:

1. **Evaluate**: Is this a valid concern?
   - Check project conventions and existing patterns
   - If suggestion conflicts with codebase patterns, document why declining

2. **Fix or Decline**:
   - If fixing: Make the change, note the commit hash
   - If declining: Document reasoning based on project patterns

3. **Track status** in todo list:
   ```
   - [ ] file.md:123 - Description (status: pending/fixed/declined)
   ```

### Phase 6: Reply to Comments

**Reply to ALL comments** indicating resolution:

```bash
# Reply to inline review comments
gh api repos/OWNER/REPO/pulls/PR/comments/COMMENT_ID/replies \
  -X POST -f body="Fixed in COMMIT_HASH - description of change"

# Or for declined suggestions
gh api repos/OWNER/REPO/pulls/PR/comments/COMMENT_ID/replies \
  -X POST -f body="Keeping current approach - REASONING"
```

### Phase 7: Commit and Push

1. **Stage changes**: `git add FILES`
2. **Commit with context**: Reference the feedback being addressed
3. **Run pre-commit hooks**: Ensure all checks pass
4. **Push to update PR**: `git push`

### Phase 8: Summary

Provide a summary table:

```markdown
| File      | Line | Issue              | Status         | Notes                              |
| --------- | ---- | ------------------ | -------------- | ---------------------------------- |
| ai-faq.md | 12   | Remove alias field | Fixed (abc123) |                                    |
| agency.md | 545  | Use summarize-page | Declined       | See also pattern uses direct links |
```

## API Reference

### Fetching Comments

```bash
# Line-specific review comments (MOST COMMON FOR CODE REVIEW)
gh api repos/{owner}/{repo}/pulls/{pr}/comments

# Reviews (approval/request changes)
gh api repos/{owner}/{repo}/pulls/{pr}/reviews

# Issue comments (general discussion)
gh api repos/{owner}/{repo}/issues/{pr}/comments
```

### Replying to Comments

```bash
# Reply to review comment thread
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  -X POST -f body="Your reply"

# Add new review comment
gh api repos/{owner}/{repo}/pulls/{pr}/comments \
  -X POST \
  -f body="Comment text" \
  -f commit_id="SHA" \
  -f path="file.md" \
  -f line=123
```

## Examples

**Full workflow:**

```
/pr-feedback
# Auto-detects PR, runs full workflow
```

**Specific PR:**

```
/pr-feedback 309
# Handles feedback for PR #309
```

## Tips

- Always run internal reviews BEFORE checking external feedback
- Use `gh api` not `gh pr view --comments` for review comments
- Check project patterns before accepting suggestions
- Reply to ALL comments - even declined ones need explanation
- Group related fixes into logical commits

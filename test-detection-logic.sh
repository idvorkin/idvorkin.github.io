#!/bin/bash
# Test the commit detection logic locally

echo "🧪 Testing commit detection logic..."
echo ""

# Test 1: Check if current HEAD is a merge commit
echo "Test 1: Checking HEAD commit type"
HEAD_SHA=$(git rev-parse HEAD)
PARENT_COUNT=$(git rev-list --parents -n 1 HEAD | wc -w)
PARENT_COUNT=$((PARENT_COUNT - 1))

echo "  HEAD: $HEAD_SHA"
echo "  Parent count: $PARENT_COUNT"

if [ "$PARENT_COUNT" -eq 2 ]; then
    echo "  ✅ It's a merge commit - would use HEAD^1"
    BASE_SHA="HEAD^1"
else
    echo "  📦 It's not a merge commit (squash/rebase) - would use merge-base"
    BASE_SHA=$(git merge-base origin/main HEAD~1 2>/dev/null || echo "HEAD~1")
fi

echo ""
echo "Test 2: Checking what files would be detected"
echo "  Base: $BASE_SHA"
echo "  Head: HEAD"

# Show changed markdown files
CHANGED_MD_FILES=$(git diff --name-only "$BASE_SHA..HEAD" | grep '\.md$' | grep -E '^(_d/|_td/|_ig66/)' || true)

if [ -z "$CHANGED_MD_FILES" ]; then
    echo "  ❌ No markdown files would be detected"
else
    echo "  ✅ Changed markdown files that would be detected:"
    echo "$CHANGED_MD_FILES" | sed 's/^/      /'
fi

echo ""
echo "Test 3: Commit range analysis"
COMMIT_COUNT=$(git rev-list --count "$BASE_SHA..HEAD" 2>/dev/null || echo "0")
echo "  Commits in range: $COMMIT_COUNT"

if [ "$COMMIT_COUNT" -gt "0" ] && [ "$COMMIT_COUNT" -le "5" ]; then
    echo "  Commits:"
    git log --oneline "$BASE_SHA..HEAD" | sed 's/^/    /'
fi
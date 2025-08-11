#!/bin/bash

# Quick PR creation helper script
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse arguments
BRANCH_NAME=${1:-${AUTO_BRANCH:-feature-$(date +%Y%m%d-%H%M%S)}}
PR_TITLE=${2:-${PR_TITLE:-"New feature from Claude Code"}}
PR_BODY=${3:-"Created with Claude Code container

## Changes
- [ ] Implementation complete
- [ ] Tests added
- [ ] Documentation updated

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing complete"}

echo -e "${GREEN}🚀 Quick PR Creation Script${NC}"
echo "=========================="

cd /workspace

# Get default branch
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

# Ensure we're on main and up to date
echo "Updating from $DEFAULT_BRANCH..."
git checkout "$DEFAULT_BRANCH" 2>/dev/null || git checkout main 2>/dev/null || git checkout master
git pull origin "$DEFAULT_BRANCH" 2>/dev/null || true

# Create and switch to new branch
echo -e "${GREEN}Creating branch: $BRANCH_NAME${NC}"
git checkout -b "$BRANCH_NAME"

echo ""
echo "📋 Next Steps:"
echo "1. Make your changes"
echo "2. Stage changes: git add ."
echo "3. Commit: git commit -m \"Your message\""
echo "4. Push: git push -u origin $BRANCH_NAME"
echo "5. Create PR:"
echo ""
echo -e "${YELLOW}gh pr create --title \"$PR_TITLE\" --body \"$PR_BODY\"${NC}"
echo ""
echo "Or use the interactive mode: gh pr create"
echo ""

# Check if we should start Claude or bash
if [ -n "$START_CLAUDE" ] && command -v claude &> /dev/null; then
    echo "Starting Claude Code..."
    exec claude
else
    exec /bin/bash
fi
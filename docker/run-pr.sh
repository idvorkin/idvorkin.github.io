#!/bin/bash

# Quick PR runner using what we have built
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse arguments
BRANCH=${1:-feature-$(date +%Y%m%d-%H%M%S)}
TITLE=${2:-"New feature"}

echo -e "${GREEN}🚀 Starting PR Container${NC}"
echo "Branch: $BRANCH"
echo "Title: $TITLE"

# Run container with the latest layer (Jekyll)
docker run -it --rm \
  --name claude-pr-$(date +%s) \
  -v $(pwd)/../:/workspace \
  -v ~/.ssh:/home/claude/.ssh:ro \
  -v ~/.gitconfig:/home/claude/.gitconfig:ro \
  -e GITHUB_TOKEN=$GITHUB_TOKEN \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -w /workspace \
  claude-code:layer-07-settings \
  bash -c "
    echo '📁 Working in: /workspace'
    echo '🌿 Creating branch: $BRANCH'
    git checkout main || git checkout master
    git pull
    git checkout -b $BRANCH
    echo ''
    echo '✅ Ready! You can now:'
    echo '  1. Make changes'
    echo '  2. git add .'
    echo '  3. git commit -m \"Your message\"'
    echo '  4. git push -u origin $BRANCH'
    echo '  5. gh pr create --title \"$TITLE\"'
    echo ''
    exec bash
  "
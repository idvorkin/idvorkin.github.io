#!/usr/bin/env bash
# Test Claude in Docker container with YOLO mode

echo "Testing Claude in Docker container..."
echo ""

# Test minimal layer (normal permissions)
echo "1. Testing minimal layer (standard permissions):"
docker run --rm \
    -v "$HOME/Library/Application Support/claude":/home/developer/.config/claude:ro \
    claude-docker:minimal \
    /bin/bash -c "claude --version 2>&1 | head -5"

echo ""
echo "2. Testing dev layer (YOLO mode):"
# Test dev layer with YOLO mode
docker run --rm \
    -v "$HOME/Library/Application Support/claude":/home/developer/.claude-auth:ro \
    claude-docker:dev \
    /bin/bash -c "claude --version 2>&1 | head -5"

echo ""
echo "3. Testing YOLO settings in dev layer:"
docker run --rm \
    claude-docker:dev \
    /bin/bash -c "cat ~/.config/claude/settings.json 2>/dev/null | jq '.permissions' || echo 'No settings file found'"

echo ""
echo "✅ Test complete!"
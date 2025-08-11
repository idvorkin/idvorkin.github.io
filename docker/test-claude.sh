#!/usr/bin/env bash
# Test script to verify Claude CLI works in container

echo "Testing Claude CLI in Docker container..."
echo ""

# Run a simple Claude command in the container
docker run --rm \
    -v "$HOME/Library/Application Support/claude":/home/developer/.config/claude \
    claude-docker:minimal \
    /home/linuxbrew/.linuxbrew/bin/bash -c "claude --version"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Claude CLI is working in the container!"
else
    echo ""
    echo "❌ Claude CLI test failed"
    exit 1
fi
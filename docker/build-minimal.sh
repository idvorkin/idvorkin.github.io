#!/bin/bash
set -e

echo "Building minimal Docker setup with settings..."

# Build layer 1: Base with Homebrew
echo "Building layer 1: Base with Homebrew..."
docker build -f Dockerfile.1-base -t claude-docker:base .

# Build layer 2: Minimal stable with settings
echo "Building layer 2: Minimal stable with settings..."
docker build -f Dockerfile.2-stable-minimal -t claude-docker:minimal .

echo "Build complete! You can now run:"
echo "  docker run -it --rm -e GITHUB_TOKEN=\$GITHUB_TOKEN claude-docker:minimal"
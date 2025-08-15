#!/bin/bash
set -e

echo "Building minimal Docker setup with settings..."

DOCKER_BUILD_ARGS=""
if [ "$DOCKER_BUILD_NO_CACHE" = "1" ]; then
    echo "🚫 Building without cache..."
    DOCKER_BUILD_ARGS="--no-cache"
fi

# Build layer 1: Base with Homebrew
echo "Building layer 1: Base with Homebrew..."
docker build -f Dockerfile.1-base -t claude-docker:base $DOCKER_BUILD_ARGS .

# Build layer 2: Minimal stable with settings
echo "Building layer 2: Minimal stable with settings..."
docker build -f Dockerfile.2-stable-minimal -t claude-docker:minimal $DOCKER_BUILD_ARGS .

echo "Build complete! You can now run:"
echo "  docker run -it --rm -e GITHUB_TOKEN=\$GITHUB_TOKEN claude-docker:minimal"
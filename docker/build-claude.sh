#!/bin/bash
# Build script for Claude testing layer

set -e

echo "Building Claude test layer..."

DOCKER_BUILD_ARGS=""
if [ "$DOCKER_BUILD_NO_CACHE" = "1" ]; then
    echo "🚫 Building without cache..."
    DOCKER_BUILD_ARGS="--no-cache"
fi

docker build -f Dockerfile.3-claude -t claude-docker:claude $DOCKER_BUILD_ARGS .

echo "Build complete! Run with: ./run-docker.sh claude-docker:claude"
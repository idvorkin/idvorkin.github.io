#!/usr/bin/env bash
set -e

# Build script for development layer
# This builds on top of the minimal layer for experimental features

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔨 Building development layer..."

# Ensure base and minimal layers are built
if ! docker images | grep -q "claude-docker.*base"; then
    echo "⚠️  Base image not found. Building base first..."
    ./build-simple.sh
fi

if ! docker images | grep -q "claude-docker.*minimal"; then
    echo "⚠️  Minimal image not found. Building minimal first..."
    ./build-minimal.sh
fi

# Build development layer
docker build \
    --platform linux/arm64 \
    -f Dockerfile.3-development \
    -t claude-docker:dev \
    .

echo "✅ Development layer built successfully!"
echo "Run with: ./run-docker.sh dev"
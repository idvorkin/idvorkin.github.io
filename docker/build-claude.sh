#!/bin/bash
# Build script for Claude testing layer

set -e

echo "Building Claude test layer..."
docker build -f Dockerfile.3-claude -t claude-docker:claude .

echo "Build complete! Run with: ./run-docker.sh claude-docker:claude"
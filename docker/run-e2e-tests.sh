#!/bin/bash

echo "Running E2E tests in Docker container..."
echo ""

# Run E2E tests in the container
docker run --rm \
  -e CI=true \
  -e GITHUB_TOKEN="${GITHUB_TOKEN}" \
  claude-docker:minimal \
  sh -c "cd /home/developer/gits/idvorkin.github.io && just e2e-test"
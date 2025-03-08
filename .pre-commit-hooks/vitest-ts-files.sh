#!/bin/bash

# Get a list of staged TypeScript files
TS_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep "\.ts$" || true)

# If there are no TypeScript files, exit successfully
if [ -z "$TS_FILES" ]; then
    echo "No TypeScript files changed, skipping Vitest tests."
    exit 0
fi

echo "TypeScript files changed, running Vitest tests..."
echo "Changed files: $TS_FILES"

# Run Vitest in related mode for the changed files
npx vitest related $TS_FILES --run

# Return the exit code from Vitest
exit $? 
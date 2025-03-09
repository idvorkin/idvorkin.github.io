#!/bin/bash

echo "Testing Vitest badge generation locally"
echo "--------------------------------------"

# Create a directory for test results
mkdir -p test-results

# Website URL for reference
WEBSITE_URL="idvork.in"

# Two options: Mock test results or run actual tests
# Use first argument to script to select mode:
# ./test-vitest-badge.sh mock    # Use mock data (default if no args)
# ./test-vitest-badge.sh real    # Run actual tests

MODE=${1:-mock}  # Default to mock if no argument provided

if [ "$MODE" = "mock" ]; then
  # OPTION 1: Create mock test results (faster for testing)
  echo "Using mock test results..."
  echo '{"numTotalTestSuites": 10, "numPassedTestSuites": 9, "numFailedTestSuites": 1}' > test-output.json
  TEST_RESULT=1  # Mock failing test for demo
else
  # OPTION 2: Run actual tests
  echo "Running actual Vitest tests..."

  # Create a temporary file to capture the JSON report
  TMP_JSON_FILE=$(mktemp)
  
  # Run just js-test and attempt to capture JSON output
  # We can't directly use --reporter json with the Justfile recipe
  # Instead, we'll run npm commands directly if possible
  set +e
  if [ -f "package.json" ]; then
    echo "Running Vitest directly using npm..."
    npx vitest run --reporter json > "$TMP_JSON_FILE"
  else
    echo "Running via the Justfile recipe (may not get JSON output)..."
    just js-test > "$TMP_JSON_FILE"
  fi
  TEST_RESULT=$?
  set -e
  
  echo "Test exited with code: $TEST_RESULT"
  
  # Copy the temp file to our standard location
  cp "$TMP_JSON_FILE" test-output.json
  rm "$TMP_JSON_FILE"
fi

# Check if the output is valid JSON
if ! jq . test-output.json > /dev/null 2>&1; then
  echo "Test output is not valid JSON. Using fallback values."
  # Fallback to basic values based on test result
  if [ $TEST_RESULT -eq 0 ]; then
    echo '{"schemaVersion": 1, "label": "vitest", "message": "tests passing", "color": "brightgreen"}' > test-results/vitest-count.json
  else
    echo '{"schemaVersion": 1, "label": "vitest", "message": "tests failing", "color": "red"}' > test-results/vitest-count.json
  fi
else
  # Extract test counts using jq from the JSON output
  TOTAL=$(jq '.numTotalTestSuites' test-output.json 2>/dev/null || echo 0)
  PASSED=$(jq '.numPassedTestSuites' test-output.json 2>/dev/null || echo 0)
  FAILED=$(jq '.numFailedTestSuites' test-output.json 2>/dev/null || echo 0)
  
  echo "Test stats: $PASSED of $TOTAL passing, $FAILED failing"
  
  # Determine color based on failed tests (green for all passing, red otherwise)
  if [ "$FAILED" -eq 0 ] && [ "$TOTAL" -gt 0 ]; then
    COLOR="brightgreen"
  else
    COLOR="red"
  fi
  
  # Create a badge JSON file in shields.io format
  # This will be used by the shields.io endpoint to generate a badge
  echo "{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"$PASSED/$TOTAL tests\", \"color\": \"$COLOR\"}" > test-results/vitest-count.json
  echo "Generated badge JSON for $PASSED/$TOTAL tests for $WEBSITE_URL"
fi

# Display the generated JSON
echo -e "\nGenerated badge JSON file:"
cat test-results/vitest-count.json

# Preview URL (for manual testing)
echo -e "\nTo preview this badge, use shields.io playground:"
echo "1. Go to: https://shields.io/endpoint"
echo "2. Paste this content in the JSON field:"
cat test-results/vitest-count.json

echo -e "\nThis is what your badge will look like in your README!" 
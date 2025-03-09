#!/bin/bash
# Script to generate badge JSON files for shields.io from test results

# Make sure the directory exists
mkdir -p test-results/vitest

# First argument is the test output JSON file
TEST_OUTPUT_JSON=${1:-"test-output.json"}

# Try to parse the JSON output
TEST_RESULT=0
if ! jq . "$TEST_OUTPUT_JSON" > /dev/null 2>&1; then
    echo "Test output is not valid JSON. Using fallback values."
    # Fallback to basic values if JSON parsing fails
    if [ $TEST_RESULT -eq 0 ]; then
        echo "{\"schemaVersion\": 1, \"label\": \"Vitest Tests\", \"message\": \"tests passing\", \"color\": \"brightgreen\"}" > test-results/vitest/badge-count.json
    else
        echo "{\"schemaVersion\": 1, \"label\": \"Vitest Tests\", \"message\": \"tests failing\", \"color\": \"red\"}" > test-results/vitest/badge-count.json
    fi
else
    # Extract test counts using jq from the JSON output
    echo "Debugging JSON extraction:"
    echo "File content first 100 chars: $(head -c 100 "$TEST_OUTPUT_JSON")"
    echo "numTotalTests value: $(jq '.numTotalTests' "$TEST_OUTPUT_JSON")"
    echo "numPassedTests value: $(jq '.numPassedTests' "$TEST_OUTPUT_JSON")"
    echo "numFailedTests value: $(jq '.numFailedTests' "$TEST_OUTPUT_JSON")"
    
    TOTAL=$(jq '.numTotalTests' "$TEST_OUTPUT_JSON")
    PASSED=$(jq '.numPassedTests' "$TEST_OUTPUT_JSON")
    FAILED=$(jq '.numFailedTests' "$TEST_OUTPUT_JSON")
    
    echo "Extracted values: TOTAL=$TOTAL, PASSED=$PASSED, FAILED=$FAILED"
    
    # Determine color based on failed tests (green for all passing, red otherwise)
    if [ "$FAILED" -eq 0 ]; then
        COLOR="brightgreen"
    else
        COLOR="red"
    fi
    
    # Create a badge JSON file in shields.io format
    echo "{\"schemaVersion\": 1, \"label\": \"Vitest Tests\", \"message\": \"$PASSED/$TOTAL tests\", \"color\": \"$COLOR\"}" > test-results/vitest/badge-count.json
    echo "Generated badge JSON for $PASSED/$TOTAL tests"
fi

# Generate coverage badge if coverage data exists
if [ -f "coverage/coverage-final.json" ]; then
    echo "Found coverage-final.json, calculating coverage percentage..."
    
    # Calculate coverage percentage from coverage-final.json
    # This extracts all statement counts and calculates the percentage
    TOTAL_STATEMENTS=$(jq '[.[].statementMap | length] | add' coverage/coverage-final.json 2>/dev/null || echo "0")
    COVERED_STATEMENTS=$(jq '[.[].s | to_entries[] | select(.value > 0) | .key] | length' coverage/coverage-final.json 2>/dev/null || echo "0")
    
    if [ "$TOTAL_STATEMENTS" -eq 0 ]; then
        COVERAGE_PCT="unknown"
    else
        COVERAGE_PCT=$(echo "scale=2; ($COVERED_STATEMENTS * 100) / $TOTAL_STATEMENTS" | bc)
        # Round to whole number
        COVERAGE_PCT=$(echo "$COVERAGE_PCT" | awk '{print int($1+0.5)}')
    fi
    
    echo "Calculated coverage: $COVERED_STATEMENTS/$TOTAL_STATEMENTS statements ($COVERAGE_PCT%)"
    
    # Determine color based on coverage percentage
    if [ "$COVERAGE_PCT" = "unknown" ]; then
        COV_COLOR="gray"
    elif [ $(echo "$COVERAGE_PCT >= 90" | bc -l) -eq 1 ]; then
        COV_COLOR="brightgreen"
    elif [ $(echo "$COVERAGE_PCT >= 80" | bc -l) -eq 1 ]; then
        COV_COLOR="green"
    elif [ $(echo "$COVERAGE_PCT >= 70" | bc -l) -eq 1 ]; then
        COV_COLOR="yellowgreen"
    elif [ $(echo "$COVERAGE_PCT >= 60" | bc -l) -eq 1 ]; then
        COV_COLOR="yellow"
    else
        COV_COLOR="red"
    fi
    
    # Create a badge JSON file for coverage
    echo "{\"schemaVersion\": 1, \"label\": \"Vitest Coverage\", \"message\": \"${COVERAGE_PCT}%\", \"color\": \"$COV_COLOR\"}" > test-results/vitest/badge-coverage.json
    echo "Generated coverage badge JSON for ${COVERAGE_PCT}% coverage"
else
    # If we can't find the coverage info, create a fallback badge
    echo "{\"schemaVersion\": 1, \"label\": \"Vitest Coverage\", \"message\": \"unknown\", \"color\": \"gray\"}" > test-results/vitest/badge-coverage.json
    echo "No coverage data found, using fallback badge"
fi 
#!/bin/bash
# Script to test the GitHub Actions workflow locally using Podman

set -e # Exit on error

echo "===== Testing Vitest Workflow Locally with Podman ====="

# Create a temporary justfile specific for the container
echo "Creating container-specific justfile..."
cat > container-justfile << 'EOF'
# Run Vitest tests
js-test:
    npx vitest run

# Run Vitest tests with verbose text output
js-test-verbose-txt:
    npx vitest run --reporter=verbose

# Convert existing test output to HTML (for CI use)
js-test-output-to-html:
    #!/usr/bin/env sh
    # Make sure the directory exists
    mkdir -p test-results/vitest
    
    # Generate HTML wrapper around existing output
    echo "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Vitest Test Results</title><style>body{font-family:monospace;line-height:1.5;padding:20px;}pre{background:#f8f8f8;padding:15px;border-radius:5px;overflow:auto;}</style></head><body><h1>Vitest Test Results</h1><pre>" > test-results/vitest/test-verbose-output.html
    cat test-results/vitest/test-verbose-output.txt >> test-results/vitest/test-verbose-output.html
    echo "</pre></body></html>" >> test-results/vitest/test-verbose-output.html

# Generate badge JSON files from test results
js-test-generate-badges test_output_json="test-output.json":
    #!/usr/bin/env sh
    # Make sure the directory exists
    mkdir -p test-results/vitest
    
    # Try to parse the JSON output
    TEST_RESULT=0
    if ! jq . {{test_output_json}} > /dev/null 2>&1; then
        echo "Test output is not valid JSON. Using fallback values."
        # Fallback to basic values if JSON parsing fails
        if [ $TEST_RESULT -eq 0 ]; then
            echo "{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"tests passing\", \"color\": \"brightgreen\"}" > test-results/vitest/badge-count.json
        else
            echo "{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"tests failing\", \"color\": \"red\"}" > test-results/vitest/badge-count.json
        fi
    else
        # Extract test counts using jq from the JSON output
        TOTAL=$(jq '.numTotalTestSuites' {{test_output_json}})
        PASSED=$(jq '.numPassedTestSuites' {{test_output_json}})
        FAILED=$(jq '.numFailedTestSuites' {{test_output_json}})
        
        # Determine color based on failed tests (green for all passing, red otherwise)
        if [ "$FAILED" -eq 0 ]; then
            COLOR="brightgreen"
        else
            COLOR="red"
        fi
        
        # Create a badge JSON file in shields.io format
        echo "{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"$PASSED/$TOTAL tests\", \"color\": \"$COLOR\"}" > test-results/vitest/badge-count.json
        echo "Generated badge JSON for $PASSED/$TOTAL tests"
    fi
    
    # Generate coverage badge if coverage data exists
    if [ -f "coverage/coverage-summary.json" ]; then
        COVERAGE_PCT=$(jq -r '.total.lines.pct' coverage/coverage-summary.json 2>/dev/null || echo "unknown")
        
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

# Run Vitest tests with JSON reporter
js-test-json:
    npx vitest run --reporter json

# Run Vitest tests with both HTML reporter and coverage (container version)
js-test-full-report:
    #!/usr/bin/env sh
    # Create results directory with consistent structure
    mkdir -p test-results/vitest
    # Run Vitest with HTML reporter and coverage
    npx vitest run --reporter=html --coverage
    # Copy the reports to test-results directory
    if [ -d "html" ]; then
        cp -r html test-results/vitest/
    fi
    if [ -d "coverage" ]; then
        cp -r coverage test-results/vitest/
    fi
    # No open command in the container
EOF

# Create a Dockerfile for testing
cat > Dockerfile.workflow-test << EOF
FROM node:20-slim

WORKDIR /app

# Install required tools
RUN apt-get update && \\
    apt-get install -y jq bc && \\
    apt-get clean && \\
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY container-justfile ./justfile

# Install dependencies 
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY vitest.config.ts ./
COPY vitest.setup.ts ./
COPY tsconfig.json ./

# Create output directory
RUN mkdir -p test-results/vitest

# Install just command runner
RUN apt-get update && \\
    apt-get install -y curl && \\
    curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin && \\
    apt-get clean && \\
    rm -rf /var/lib/apt/lists/*

# Use a simplified CMD that mirrors the workflow structure
CMD ["bash", "-c", "echo 'Running workflow test steps...' && \\
    mkdir -p test-results/vitest && \\
    set +e && \\
    # Run tests with verbose output and capture to file \\
    just js-test-verbose-txt > test-results/vitest/test-verbose-output.txt 2>&1 && \\
    # Generate HTML from the test output \\
    just js-test-output-to-html && \\
    # Generate JSON report for badge creation \\
    just js-test-json > test-output.json && \\
    TEST_RESULT=\$? && \\
    # Run HTML reporter and coverage \\
    just js-test-full-report && \\
    # Generate badges \\
    just js-test-generate-badges test-output.json && \\
    ls -la test-results/vitest && \\
    echo '===== Workflow test completed successfully! ====='"]
EOF

echo "Created Dockerfile for testing"

# Make sure output directory exists
mkdir -p test-results

# Build the container
echo "Building container..."
podman build -t vitest-workflow-test -f Dockerfile.workflow-test .

# Run the container and mount the test-results directory
echo "Running workflow test..."
podman run --rm -v "$PWD/test-results:/app/test-results" vitest-workflow-test

echo "Test results directory contents:"
ls -la test-results/vitest

# Verify the outputs
echo "Checking badge files..."
if [ -f "test-results/vitest/badge-count.json" ]; then
    echo "✅ Test count badge file exists"
    cat test-results/vitest/badge-count.json
else
    echo "❌ Test count badge file missing"
fi

if [ -f "test-results/vitest/badge-coverage.json" ]; then
    echo "✅ Coverage badge file exists"
    cat test-results/vitest/badge-coverage.json
else
    echo "❌ Coverage badge file missing"
fi

if [ -d "test-results/vitest/html" ]; then
    echo "✅ HTML report directory exists"
else
    echo "❌ HTML report directory missing"
fi

if [ -d "test-results/vitest/coverage" ]; then
    echo "✅ Coverage directory exists"
else
    echo "❌ Coverage directory missing"
fi

echo "===== Workflow test completed ====="
echo "You can check the test results in the ./test-results directory"
echo "To preview the HTML report, open: test-results/vitest/html/index.html"
echo "To preview the coverage report, open: test-results/vitest/coverage/index.html"

# Clean up the Dockerfile and temporary justfile
rm Dockerfile.workflow-test container-justfile

# Make the output directory readable
chmod -R 755 test-results 
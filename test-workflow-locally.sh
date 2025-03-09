#!/bin/bash
# Script to test the GitHub Actions workflow locally using Podman

set -e # Exit on error

echo "===== Testing Vitest Workflow Locally with Podman ====="

# Create a Dockerfile for testing
cat > Dockerfile.workflow-test << 'EOF'
FROM node:20-slim

WORKDIR /app

# Install required tools
RUN apt-get update && \
    apt-get install -y jq bc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY justfile ./

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
RUN apt-get update && \
    apt-get install -y curl && \
    curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD ["bash", "-c", "echo 'Running workflow test steps...' && mkdir -p test-results/vitest && set +e && just js-test-json > test-output.json && TEST_RESULT=$? && npx vitest run --reporter=html --coverage && set -e && if ! jq . test-output.json > /dev/null 2>&1; then echo 'Test output is not valid JSON. Using fallback values.' && if [ $TEST_RESULT -eq 0 ]; then echo '{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"tests passing\", \"color\": \"brightgreen\"}' > test-results/vitest/badge-count.json; else echo '{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"tests failing\", \"color\": \"red\"}' > test-results/vitest/badge-count.json; fi; else TOTAL=$(jq '.numTotalTestSuites' test-output.json); PASSED=$(jq '.numPassedTestSuites' test-output.json); FAILED=$(jq '.numFailedTestSuites' test-output.json); if [ \"$FAILED\" -eq 0 ]; then COLOR=\"brightgreen\"; else COLOR=\"red\"; fi; echo '{\"schemaVersion\": 1, \"label\": \"vitest\", \"message\": \"'$PASSED'/'$TOTAL' tests\", \"color\": \"'$COLOR'\"}' > test-results/vitest/badge-count.json; echo 'Generated badge JSON for '$PASSED'/'$TOTAL' tests'; fi && if [ -d \"html\" ]; then echo 'Copying HTML report to test-results directory'; cp -r html test-results/vitest/; else echo 'No HTML report directory found'; fi && if [ -d \"coverage/html\" ]; then echo 'Copying HTML coverage report to test-results directory'; cp -r coverage/html test-results/vitest/coverage; elif [ -d \"coverage\" ]; then echo 'Copying coverage directory to test-results'; cp -r coverage test-results/vitest/coverage; else echo 'No coverage directory found'; fi && if [ -f \"coverage/coverage-summary.json\" ]; then COVERAGE_PCT=$(jq -r '.total.lines.pct' coverage/coverage-summary.json 2>/dev/null || echo \"unknown\"); if [ \"$COVERAGE_PCT\" = \"unknown\" ]; then COV_COLOR=\"gray\"; elif [ $(echo \"$COVERAGE_PCT >= 90\" | bc -l) -eq 1 ]; then COV_COLOR=\"brightgreen\"; elif [ $(echo \"$COVERAGE_PCT >= 80\" | bc -l) -eq 1 ]; then COV_COLOR=\"green\"; elif [ $(echo \"$COVERAGE_PCT >= 70\" | bc -l) -eq 1 ]; then COV_COLOR=\"yellowgreen\"; elif [ $(echo \"$COVERAGE_PCT >= 60\" | bc -l) -eq 1 ]; then COV_COLOR=\"yellow\"; else COV_COLOR=\"red\"; fi; echo '{\"schemaVersion\": 1, \"label\": \"coverage\", \"message\": \"'${COVERAGE_PCT}'%\", \"color\": \"'$COV_COLOR'\"}' > test-results/vitest/badge-coverage.json; echo 'Generated coverage badge JSON for '${COVERAGE_PCT}'% coverage'; else echo '{\"schemaVersion\": 1, \"label\": \"coverage\", \"message\": \"unknown\", \"color\": \"gray\"}' > test-results/vitest/badge-coverage.json; echo 'No coverage data found, using fallback badge'; fi && ls -la test-results/vitest && echo '===== Workflow test completed successfully! ====='"]
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

# Clean up the Dockerfile
rm Dockerfile.workflow-test

# Make the output directory readable
chmod -R 755 test-results 
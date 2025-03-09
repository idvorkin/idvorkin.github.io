default:
    @just --list

# ===== JavaScript/TypeScript Build System =====
# For JavaScript/TypeScript development, use these commands:
# - js-build: Build all JavaScript/TypeScript files for production
# - js-watch: Watch for changes during development
# - js-typecheck: Run TypeScript type checking without emitting files
# - js-test: Run Vitest tests
# - js-test-watch: Run Vitest tests in watch mode
# - js-test-coverage: Run Vitest tests with coverage
# - js-test-coverage-html: Run Vitest tests with coverage and open HTML report
# - js-test-html: Run Vitest tests with HTML reporter
# - js-test-ui: Run Vitest UI for interactive test viewing
# - js-lint: Check code formatting
# - js-format: Format code with Prettier
# - js-clean: Clean build artifacts

# Build all JavaScript/TypeScript files for production
js-build: js-clean
    # Using Parcel for bundling (handles TypeScript transpilation)
    # Build the single entry point with optimization
    npx parcel build --no-cache --no-content-hash --detailed-report

# Watch for changes during development
js-watch: js-clean
    # Using Parcel for bundling with watch mode
    rm -rf .parcel-cache dist
    rm -f assets/js/*.js assets/js/*.map 2>/dev/null || true
    # Watch the single entry point
    npx parcel watch --no-cache

# Run TypeScript type checking without emitting files
js-typecheck:
    # Using TypeScript for type checking only (no transpilation)
    npx tsc --noEmit

# Run Vitest tests
js-test:
    npx vitest run

# Run Vitest tests with verbose text output
js-test-verbose-txt:
    npx vitest run --reporter=verbose

# Run Vitest tests with GitHub Actions reporter
js-test-github:
    npx vitest run --reporter=github-actions --reporter=verbose

# Run Vitest tests with HTML output (with colors)
js-test-verbose-html:
    #!/usr/bin/env sh
    # Create the output directory
    mkdir -p test-results/vitest
    
    # If in GitHub Actions, use GitHub reporter
    if [ -n "$GITHUB_ACTIONS" ]; then
        npx vitest run --reporter=github-actions --reporter=verbose
        exit 0
    fi
    
    # For local development with colorized HTML report
    echo "Running in local mode with HTML output"
    
    # Generate HTML header
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Vitest Test Results</title><style>body{font-family:monospace;line-height:1.5;padding:20px;background:#f5f5f5;color:#333;}pre{background:#1e1e1e;padding:15px;border-radius:5px;overflow:auto;color:#f8f8f8;}</style></head><body><h1>Vitest Test Results</h1>' > test-results/vitest/test-verbose-output.html
    
    # Run tests with forced color output
    node run-vitest-with-colors.js test-results/vitest/temp_output.txt
    
    # Convert to HTML
    echo '<pre>' >> test-results/vitest/test-verbose-output.html
    node ansi-to-html-converter.js test-results/vitest/temp_output.txt test-results/vitest/test-verbose-output.html
    echo '</pre></body></html>' >> test-results/vitest/test-verbose-output.html
    
    # Create raw output copy for debugging
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Raw Test Output</title><style>body{font-family:monospace;white-space:pre;}</style></head><body><pre>' > test-results/vitest/raw-output.html
    cat test-results/vitest/temp_output.txt >> test-results/vitest/raw-output.html
    echo '</pre></body></html>' >> test-results/vitest/raw-output.html
    
    # Clean up
    rm -f test-results/vitest/temp_output.txt
    
    # Open the report
    if [ -f "test-results/vitest/test-verbose-output.html" ]; then
        open test-results/vitest/test-verbose-output.html
    fi

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
        echo "Debugging JSON extraction:"
        echo "File content first 100 chars: $(head -c 100 {{test_output_json}})"
        echo "numTotalTests value: $(jq '.numTotalTests' {{test_output_json}})"
        echo "numPassedTests value: $(jq '.numPassedTests' {{test_output_json}})"
        echo "numFailedTests value: $(jq '.numFailedTests' {{test_output_json}})"
        
        TOTAL=$(jq '.numTotalTests' {{test_output_json}})
        PASSED=$(jq '.numPassedTests' {{test_output_json}})
        FAILED=$(jq '.numFailedTests' {{test_output_json}})
        
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

# Run Vitest tests in watch mode
js-test-watch:
    npx vitest

# Run Vitest tests with coverage
js-test-coverage:
    npx vitest run --coverage

# Run Vitest tests with coverage and generate HTML report
js-test-coverage-html:
    #!/usr/bin/env sh
    # Create the output directory if it doesn't exist
    mkdir -p ~/tmp/idvorkin.github.io/vitest
    # Create results directory with consistent structure
    mkdir -p test-results/vitest/coverage
    # Run Vitest with coverage and generate HTML report
    npx vitest run --coverage
    # Copy the coverage report to the tmp directory
    cp -r coverage ~/tmp/idvorkin.github.io/vitest/
    # Copy to test-results for local preview
    cp -r coverage test-results/vitest/
    # Only open the report when running locally (not on CI)
    if [ -z "$CI" ] && [ -f "~/tmp/idvorkin.github.io/vitest/coverage/index.html" ]; then
        open ~/tmp/idvorkin.github.io/vitest/coverage/index.html
    fi

# Run Vitest tests with HTML reporter
js-test-html:
    #!/usr/bin/env sh
    # Create results directory with consistent structure
    mkdir -p test-results/vitest
    # Run Vitest with HTML reporter
    npx vitest run --reporter=html
    # If HTML report was generated, copy it to the test-results directory
    if [ -d "html" ]; then
        cp -r html test-results/vitest/
        # Only open the report when running locally (not on CI)
        if [ -z "$CI" ] && [ -f "test-results/vitest/html/index.html" ]; then
            open test-results/vitest/html/index.html
        fi
    else
        echo "No HTML report was generated"
    fi

# Run Vitest tests with both HTML reporter and coverage
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
    # Only open the HTML report when running locally (not on CI)
    if [ -z "$CI" ] && [ -f "test-results/vitest/html/index.html" ]; then
        open test-results/vitest/html/index.html
    fi

# Run Vitest UI for interactive test viewing
js-test-ui:
    npx vitest --ui

# Check code formatting
js-lint:
    npx prettier --check 'src/**/*.{ts,js}'

# Format code with Prettier
js-format:
    npx prettier --write 'src/**/*.{ts,js}'

# Clean build artifacts
js-clean:
    rm -rf .parcel-cache dist

# Validate code (typecheck + lint)
js-validate: js-typecheck js-lint

# ===== Jekyll Commands =====

coverage-instrument:
    npx nyc instrument --compact=false _site/assets/js instrumented

coverage-report:
    npx nyc report --reporter html --reporter text && open coverage/index.html

jekyll-serve:
    #!/usr/bin/env sh
    if [ "$(uname)" = "Darwin" ]; then
        just internal-jekyll-mac-serve
    else
        bundle exec jekyll server --incremental --livereload --host 127.0.0.1
    fi

internal-jekyll-mac-serve:
    ~/homebrew/opt/ruby/bin/bundle exec jekyll server --incremental --livereload --host 127.0.0.1

jekyll-container:
    bundle exec jekyll server --incremental --livereload --host 0.0.0.0

docker-build:
    docker build -t devdocker devdocker

docker-run2:
    docker run -v ~/blog:/root/blog -p 35729:35729 -p 4000:4000 -it devdocker

docker-run:
    docker run -v ~/blog:/root/blog -it -p 35729:35729 -p 4000:4000 devdocker npm run jekyll:container

update-backlinks:
    uv run ./build_back_links.py build

# Update backlinks with a custom output file
update-backlinks-to:
    #!/usr/bin/env sh
    # First argument is the output file
    uv run ./build_back_links.py build "$1"

update-search:
    bundle exec jekyll algolia

update-ig66:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

update-eulogy:
    python3 scripts/eulogy_to_json.py > eulogy.json

update-fj:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

back-links: update-backlinks
    # alias
bbl:  back-links
    # alias

# Write backlinks to ~/tmp directory
write-backlinks-tmp:
    #!/usr/bin/env sh
    # Ensure ~/tmp directory exists
    mkdir -p ~/tmp

    # Rebuild backlinks directly to ~/tmp
    uv run ./build_back_links.py build ~/tmp/back-links.json
    echo "Backlinks written to ~/tmp/back-links.json"

# Rebuild backlinks and push to GitHub with safety checks
push-backlinks:
    #!/usr/bin/env sh
    # Ensure ~/tmp directory exists
    mkdir -p ~/tmp

    # Save the current state of back-links.json to ~/tmp
    cp back-links.json ~/tmp/back-links.json.bak

    # Rebuild backlinks using existing command
    just update-backlinks

    # Also generate a copy in ~/tmp for reference
    just update-backlinks-to ~/tmp/back-links.json

    # Check if there are changes
    if ! git diff --quiet back-links.json; then
        # Count the number of changed lines
        CHANGED_LINES=$(git diff --numstat back-links.json | awk '{print $1 + $2}')
        echo "Number of changed lines: $CHANGED_LINES"

        # If too many lines changed, ask for confirmation
        if [ "$CHANGED_LINES" -gt 50 ]; then
            echo "WARNING: Large number of changes detected ($CHANGED_LINES lines)"
            echo "Showing diff summary:"
            git diff --stat back-links.json

            # Ask for confirmation
            read -p "Do you want to continue with the push? (y/n) " CONFIRM
            if [ "$CONFIRM" != "y" ]; then
                echo "Operation cancelled. Restoring backup..."
                cp ~/tmp/back-links.json.bak back-links.json
                exit 1
            fi
        fi

        # Commit and push changes
        git add back-links.json
        git commit -m "feat(back-links): update backlinks data $(date +%Y-%m-%d)"
        git push origin HEAD
        echo "Backlinks updated and pushed successfully!"
    else
        echo "No changes detected in backlinks."
    fi

broken-links:
    scrapy runspider linkchecker.py -O ~/tmp/brokenlinks.csv && cat ~/tmp/brokenlinks.csv

prepare:
    husky install
# ===== Playwright Tests =====
# For Playwright E2E testing, use these commands:
# - pw-test: Run all Playwright tests
# - pw-test-e2e: Run only E2E tests
# - pw-test-unit: Run only unit tests
# - pw-test-ui: Run tests with UI
# - pw-install: Install Playwright browsers

# Run all Playwright tests
pw-test:
    npx playwright test

# Run only E2E tests
pw-test-e2e:
    npx playwright test tests/e2e

# Run only unit tests
pw-test-unit:
    npx playwright test tests/unit

# Run tests with UI
pw-test-ui:
    npx playwright test --ui

# Install Playwright browsers
pw-install:
    npx playwright install

# Run Vitest tests with GitHub Actions reporter (for CI)
js-test-github-actions:
    #!/usr/bin/env sh
    # This command is optimized for GitHub Actions workflows
    # It uses the GitHub Actions reporter to create annotations in the PR/commit view
    # Combined with verbose output for complete test information
    
    # Create the output directory
    mkdir -p test-results/vitest
    
    # Run with both GitHub Actions reporter and verbose reporter
    GITHUB_ACTIONS=true npx vitest run --reporter=github-actions --reporter=verbose
    
    # Save the exit code
    TEST_EXIT_CODE=$?
    
    # Generate a JSON summary of test results for badges
    npx vitest run --reporter=json --outputFile=test-results/vitest/test-output.json || true
    
    # Generate badges from test results
    just js-test-generate-badges test-results/vitest/test-output.json
    
    # Exit with the original test exit code
    exit $TEST_EXIT_CODE

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
    # Open the report
    open ~/tmp/idvorkin.github.io/vitest/coverage/index.html

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
        open test-results/vitest/html/index.html
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
    # Open the HTML report
    open test-results/vitest/html/index.html

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

parcel-clean:
    @echo "⚠️ This command is deprecated. Use 'just js-clean' instead."
    rm -rf .parcel-cache dist

tsc:
    @echo "⚠️ This command is deprecated. Use 'just js-typecheck' instead."
    tsc --watch --allowUmdGlobalAccess

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
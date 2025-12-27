default:
    @just --list

# Setup development environment (run once after clone)
setup:
    pre-commit install

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
    # Using Vite for bundling (handles TypeScript transpilation)
    npx vite build

# Watch for changes during development
js-watch: js-clean
    # Using Vite for bundling with watch mode
    npx vite build --watch

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
    ./deploy-scripts/generate-badges.sh {{test_output_json}}

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
    npx @biomejs/biome check src/

# Format code with Biome
js-format:
    npx @biomejs/biome check --write src/

# Clean build artifacts
js-clean:
    rm -rf node_modules/.vite dist

# Validate code (typecheck + lint)
js-validate: js-typecheck js-lint

# ===== Jekyll Commands =====
# For Jekyll site development, use these commands:
# - jekyll-clean: Clean Jekyll cache and build artifacts
# - jekyll-rebuild: Clean and rebuild site from scratch
# - jekyll-serve: Serve site locally with livereload (default port 4000)
# - jekyll-container: Serve site in container environment
# - jekyll-docker: Serve site in Docker container
# - update-backlinks: Rebuild backlinks.json
# - update-search: Update Algolia search index

coverage-instrument:
    npx nyc instrument --compact=false _site/assets/js instrumented

coverage-report:
    npx nyc report --reporter html --reporter text && open coverage/index.html

# Clean Jekyll cache and build artifacts
jekyll-clean:
    @echo "🧹 Cleaning Jekyll artifacts..."
    rm -rf _site
    rm -rf .jekyll-cache
    rm -rf .sass-cache
    rm -f .jekyll-metadata
    @echo "✅ Jekyll clean complete"

# Clean and rebuild Jekyll site from scratch
jekyll-rebuild: jekyll-clean
    #!/usr/bin/env sh
    echo "🔨 Rebuilding Jekyll site from scratch..."
    # Update git branch info for dev banner
    echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
    # Update PR data for dev banner (non-fatal if no PR found)
    just update-pr-data || true
    # Build the site
    if [ "$(uname)" = "Darwin" ]; then
        ~/homebrew/opt/ruby/bin/bundle exec jekyll build
    else
        bundle exec jekyll build
    fi
    echo "✅ Jekyll rebuild complete - site available in _site/"

jekyll-serve port="4000" livereload_port="35729":
    #!/usr/bin/env sh
    # Update git branch info for dev banner
    echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
    # Update PR data for dev banner (non-fatal if no PR found)
    just update-pr-data || true

    # Container and Tailscale detection (like Swing Analyzer)
    IN_CONTAINER=false
    if [ -f "/.dockerenv" ]; then
        IN_CONTAINER=true
    fi

    TAILSCALE_HOST=""
    if command -v tailscale >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
        TAILSCALE_HOST=$(tailscale status --json 2>/dev/null | jq -r '.Self.DNSName // empty' 2>/dev/null | sed 's/\.$//')
    fi

    # Determine bind host based on environment
    if [ "$IN_CONTAINER" = "true" ] && [ -n "$TAILSCALE_HOST" ]; then
        BIND_HOST="0.0.0.0"
        echo "╔════════════════════════════════════════════════════════════════════╗"
        echo "║                    Jekyll Development Server                       ║"
        echo "╚════════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "🔗 Tailscale detected in container"
        echo "   Local:     http://localhost:{{port}}"
        echo "   Tailscale: http://$TAILSCALE_HOST:{{port}}"
        echo ""
        echo "──────────────────────────────────────────────────────────────────────"
    else
        BIND_HOST="127.0.0.1"
    fi

    if [ "$(uname)" = "Darwin" ]; then
        ~/homebrew/opt/ruby/bin/bundle exec jekyll server --incremental --livereload --host $BIND_HOST --port {{port}} --livereload-port {{livereload_port}}
    else
        bundle exec jekyll server --incremental --livereload --host $BIND_HOST --port {{port}} --livereload-port {{livereload_port}}
    fi

jekyll-container port="4000":
    #!/usr/bin/env bash
    HOSTNAME=$(hostname)
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                    Jekyll Development Server                       ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📊 Site Access:"
    echo "   Local:     http://localhost:{{port}}"
    echo "   Tailscale: http://$HOSTNAME:{{port}}"
    echo ""
    echo "──────────────────────────────────────────────────────────────────────"
    echo "Press Ctrl+C to stop the server"
    echo ""
    # Update git branch info for dev banner
    echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
    # Update PR data for dev banner (non-fatal if no PR found)
    just update-pr-data || true
    bundle exec jekyll server --incremental --livereload --host 0.0.0.0 --port {{port}}

jekyll-docker:
    #!/usr/bin/env sh
    # Update git branch info for dev banner
    echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
    # Update PR data for dev banner (non-fatal if no PR found)
    just update-pr-data || true
    # Auto-detect platform and use appropriate image
    if [ "$(uname -m)" = "arm64" ]; then
        PLATFORM="--platform linux/arm64"
    else
        PLATFORM="--platform linux/amd64"
    fi
    docker run --rm \
      $PLATFORM \
      -v "$PWD:/srv/jekyll" \
      -v jekyll-gems:/usr/local/bundle \
      -p 4001:4000 \
      jekyll/jekyll:4 \
      jekyll serve --watch --force_polling --host 0.0.0.0

jekyll-docker-update-search:
    #!/usr/bin/env sh
    # Auto-detect platform and use appropriate image
    if [ "$(uname -m)" = "arm64" ]; then
        PLATFORM="--platform linux/arm64"
    else
        PLATFORM="--platform linux/amd64"
    fi
    docker run --rm \
      $PLATFORM \
      -v "$PWD:/srv/jekyll" \
      -v jekyll-gems:/usr/local/bundle \
      jekyll/jekyll:4 \
      jekyll algolia



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

broken-links server="localhost:4000":
    uv run scripts/check_internal_links.py --server {{server}}

prepare:
    husky install
# ===== Playwright Tests =====
# For Playwright E2E testing, use these commands:
# - pw-test: Run all Playwright E2E tests
# - pw-test-ui: Run tests with UI
# - pw-install: Install Playwright browsers

# Run all Playwright E2E tests
pw-test:
    npx playwright test

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

# ===== Main Test Commands =====

# Fast tests (unit tests only - for pre-commit hooks and quick checks)
fast-test:
    @echo "Running fast unit tests..."
    just js-test

# E2E tests (Playwright E2E tests only)
e2e-test:
    @echo "Running E2E test suite..."
    just pw-test

blog-combined:
    cat _d/* _posts/* _td/* > blog.allcontent.md

# Update PR data file for dev banner
# Fetches current PR number for this branch and writes to _data/current_pr.yml
# On main branch, removes the file
update-pr-data:
    #!/usr/bin/env sh
    # Check dependencies
    if ! command -v gh >/dev/null 2>&1; then
        echo "❌ GitHub CLI (gh) not installed"
        exit 1
    fi
    if ! command -v jq >/dev/null 2>&1; then
        echo "❌ jq not installed"
        exit 1
    fi

    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🔍 Checking PR for branch: $BRANCH"
    if [ "$BRANCH" = "main" ]; then
        echo "📝 On main branch - removing PR data file and clearing PR from git.json"
        rm -f _data/current_pr.yml
        echo '{"branch": "main"}' > _data/git.json
        exit 0
    fi

    mkdir -p repo_tmp
    gh pr view --json number > repo_tmp/pr.json 2>/dev/null
    if [ $? -eq 0 ]; then
        PR_NUMBER=$(cat repo_tmp/pr.json | jq -r '.number')
        if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" = "null" ]; then
            echo "❌ Failed to parse PR number"
            rm -f repo_tmp/pr.json
            exit 1
        fi
        echo "✅ Found PR #$PR_NUMBER"
        echo "# Current PR information - auto-generated" > _data/current_pr.yml
        echo "pr_number: $PR_NUMBER" >> _data/current_pr.yml
        echo "branch: $BRANCH" >> _data/current_pr.yml
        # Also update git.json with PR number for the banner
        echo "{\"branch\": \"$BRANCH\", \"pr_number\": $PR_NUMBER}" > _data/git.json
        if [ ! -f _data/current_pr.yml ]; then
            echo "❌ Failed to create PR data file"
            exit 1
        fi
        rm -f repo_tmp/pr.json
    else
        echo "⚠️  No PR found for branch: $BRANCH"
        rm -f _data/current_pr.yml
        # Update git.json without PR number
        echo "{\"branch\": \"$BRANCH\"}" > _data/git.json
    fi

    # Force Jekyll to rebuild by deleting incremental metadata
    # This ensures data file changes are picked up by --incremental mode
    rm -f .jekyll-metadata

# Legacy alias for update-pr-data
set-pr: update-pr-data

# ===== Navigation Tags =====

# Generate tags for markdown files for Neovim navigation
gen-tags:
    @echo "🏷️  Generating tags for markdown files..."
    ctags -R --languages=markdown --exclude=_site --exclude=node_modules --exclude=.git .

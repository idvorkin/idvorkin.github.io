default:
    @just --list

# Setup (run once after clone): hooks + site toolchain (Zola, uv, shim deps, node_modules)
setup:
    prek install
    zola/install.sh

# ===== Site build (Zola over the unchanged Jekyll sources; zola/README.md) =====

# Build the site into _site/ the way the Pages workflow does
zola-build:
    TZ=UTC JEKYLL_CONFIG=_config.yml,_config_ci.yml OUT="$PWD/_site" BACKLINKS=1 PAGEFIND=1 zola/build.sh

# Live preview with rebuild-on-save (0.6 s per edit)
zola-serve port="4471":
    zola/preview.sh . {{port}}

# Gate: build Jekyll and Zola from this checkout, fail on any unlisted difference
zola-parity:
    zola/verify/parity.sh

# Bump the pinned Zola (or refresh the shim's deps), then run the parity gate
zola-update version="":
    zola/update.sh {{version}}

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

# ===== Everyday preview and local builds (Zola) =====
# The site deploys from Zola (zola/README.md), so these run on Zola too:
# - serve (alias jekyll-serve): live preview on :4000, tailnet-reachable on the dev VM
# - build: _site/ + ./back-links.json + search index, as CI builds them
# - worktree-init: fresh-worktree setup in the background
# - update-backlinks / ensure-backlinks / back-links / bbl: the local back-links.json
# - build-search / update-search / build-search-only: the Pagefind index
# - broken-links: crawl a running preview for broken internal links
# The Jekyll-only recipes (parity, rollback, debugging) are further down.

# Live preview with rebuild-on-save on :4000 (drifts to a free port if taken; tailnet-reachable on the dev VM)
serve port="4000":
    #!/usr/bin/env sh
    set -eu
    TAILSCALE_HOST=""
    if command -v tailscale >/dev/null 2>&1 && command -v jq >/dev/null 2>&1; then
        TAILSCALE_HOST=$(tailscale status --json 2>/dev/null | jq -r '.Self.DNSName // empty' 2>/dev/null | sed 's/\.$//')
    fi
    # Bind rule carried over from the old jekyll-serve: every interface inside the
    # dev container when Tailscale is up (so the tailnet reaches it), else loopback.
    # Override with SERVE_HOST=...
    if [ -z "${SERVE_HOST:-}" ]; then
        if [ -f /.dockerenv ] && [ -n "$TAILSCALE_HOST" ]; then SERVE_HOST=0.0.0.0; else SERVE_HOST=127.0.0.1; fi
    fi
    # Pages link to BASE_URL, so a tailnet-bound preview names the tailnet host.
    if [ "$SERVE_HOST" != "127.0.0.1" ] && [ -n "$TAILSCALE_HOST" ]; then BASE_HOST=$TAILSCALE_HOST; else BASE_HOST=localhost; fi
    # Dev banner: build.py writes git.json with this PR number (empty: no PR).
    PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null || true)
    # PAGEFIND=1: index the first build so search works in the preview (PAGEFIND= to skip).
    export SERVE_HOST PR_NUMBER PAGEFIND="${PAGEFIND-1}"
    REQUIRED_RS_VERSION="0.2.0"
    rs_version="$(running-servers version 2>/dev/null || true)"
    if [ -z "$rs_version" ] || \
       [ "$(printf '%s\n%s\n' "$REQUIRED_RS_VERSION" "$rs_version" | sort -V | head -n1)" != "$REQUIRED_RS_VERSION" ]; then
        echo "✗ serve needs running-servers >= $REQUIRED_RS_VERSION (have: ${rs_version:-not installed})." >&2
        echo "  Update idvorkin-scripts, or run zola/preview.sh . {{port}} directly." >&2
        exit 1
    fi
    # running-servers run: fail fast if a preview already serves THIS directory,
    # otherwise pick a free port (preferring {{port}}) and substitute it for {http}.
    # The listener is zola/serve.py, so `running-servers check . --process zola` finds it.
    exec running-servers run --process zola --http {{port}} -- \
        env BASE_URL="http://$BASE_HOST:{http}" zola/preview.sh . '{http}'

# Old name for serve; the second argument (Jekyll's livereload port) is ignored: reload rides on the HTTP port
jekyll-serve port="4000" livereload_port="": (serve port)

# serve, bound to every interface (inside a container)
jekyll-container port="4000":
    SERVE_HOST=0.0.0.0 just serve {{port}}

# Build _site/, ./back-links.json and the search index the way the Pages workflow does (~15 s)
build: zola-build
    # rm first: the build hard-links the root copy into its staging dir.
    rm -f back-links.json && cp _site/back-links.json back-links.json

# Populates _site/ and back-links.json so the anchor-checker pre-commit hook
# passes by the time the first commit lands, and node_modules so the `test`
# hook can run. Without node_modules that hook dies on missing vitest, which
# aborts `git commit` SILENTLY (no [branch sha] line) while a chained
# `&& git push` still runs and reports success.
#
# Background setup for a fresh worktree: toolchain + node_modules, then `just build`
worktree-init:
    #!/usr/bin/env sh
    set -eu
    # Sanitize branch name for filesystem (e.g. claude/foo -> claude-foo):
    # otherwise nohup writes to a non-existent parent dir and fails silently.
    BRANCH=$(git branch --show-current | tr '/' '-')
    LOG="/tmp/worktree-init-$BRANCH.log"
    echo "🔨 Starting bg toolchain + npm ci + Zola build + backlinks — log: $LOG"
    # No `disown`: /bin/sh is dash here and has none (with set -e it aborted the recipe).
    nohup sh -c "zola/install.sh && just build" >"$LOG" 2>&1 &
    echo "✅ Background setup fired. Ready in ~30-60s; first commit should find _site/ and back-links.json populated and the test hook runnable."

# ===== Local-preview bootstrap =====
#
# back-links.json is gitignored and CI-generated, so a fresh clone or a fresh
# worktree has no copy. `just serve` does not need one (the preview builds its
# own index into its output), but things that read the file off disk do: the
# anchor-checker hook, the /content-style jq lookups, build_topics.py.
#
# Missing-only, deliberately: refreshing costs a full build. After adding or
# renaming a permalink, refresh by hand: just update-backlinks
#
# Build back-links.json only if missing (~4ms no-op once present)
ensure-backlinks:
    #!/usr/bin/env sh
    if [ -s back-links.json ]; then
        exit 0
    fi
    echo "🔗 back-links.json missing (gitignored / CI-generated) — building it once..."
    if just update-backlinks; then
        echo "✅ back-links.json built."
    else
        echo "⚠️  Backlinks build FAILED. Fix, then: just update-backlinks" >&2
    fi

# Regenerate _site/ and ./back-links.json from the current sources (Zola build)
update-backlinks: build

# Update backlinks with a custom output file (reads the current _site/)
update-backlinks-to:
    #!/usr/bin/env sh
    # First argument is the output file
    uv run ./build_back_links.py build "$1"

# The live preview (`just serve`) indexes its own first build, so this is for
# the on-disk _site/ (scripts/verify-search-index.sh, docs/search.md).
#
# Build _site/ with its Pagefind index in _site/pagefind/ (same build as CI)
build-search: build

# Rebuild ONLY the search index, assuming _site/ is already current (~3 s)
build-search-only:
    #!/usr/bin/env sh
    set -eu
    if [ ! -d _site ]; then
        echo "✗ _site/ not found. Run 'just build' first." >&2
        exit 1
    fi
    npx --yes pagefind@1.5.2 --site _site
    echo "✅ Search index rebuilt - _site/pagefind/"

# Backwards-compatible alias — muscle memory from the Algolia days.
update-search: build-search

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

# Write backlinks to ~/tmp directory (reads the current _site/)
write-backlinks-tmp:
    #!/usr/bin/env sh
    # Ensure ~/tmp directory exists
    mkdir -p ~/tmp

    # Rebuild backlinks directly to ~/tmp
    uv run ./build_back_links.py build ~/tmp/back-links.json
    echo "Backlinks written to ~/tmp/back-links.json"

# Crawl a running preview (`just serve`) for broken internal links
broken-links server="localhost:4000":
    uv run scripts/check_internal_links.py --server {{server}}

coverage-instrument:
    npx nyc instrument --compact=false _site/assets/js instrumented

coverage-report:
    npx nyc report --reporter html --reporter text && open coverage/index.html

# ===== Jekyll-only (parity gate, rollback, debugging a render) =====
# Jekyll no longer builds or previews the site. These stay for comparing a
# render against Jekyll (zola-parity builds its own Jekyll copy) and for the
# rollback workflow (pages-jekyll.yml). They need Ruby + bundler; every one
# loads the _ruby_compat.rb shim the old github-pages gems need on Ruby 4.
# - jekyll-build / jekyll-rebuild / jekyll-clean: a Jekyll _site/
# - jekyll-serve-legacy: the old `jekyll serve` preview
# - jekyll-docker, docker-*: container images that have Jekyll and no Zola

# Clean Jekyll cache and build artifacts (Jekyll-only)
jekyll-clean:
    @echo "🧹 Cleaning Jekyll artifacts..."
    rm -rf _site
    rm -rf .jekyll-cache
    rm -rf .sass-cache
    rm -f .jekyll-metadata
    @echo "✅ Jekyll clean complete"

# Clean and rebuild _site/ with Jekyll from scratch (Jekyll-only)
jekyll-rebuild: jekyll-clean
    #!/usr/bin/env sh
    export RUBYOPT="-r$(pwd)/_ruby_compat.rb"
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

# Build _site/ with Jekyll, reusing .jekyll-cache (Jekyll-only; `just build` is the Zola build)
jekyll-build:
    #!/usr/bin/env sh
    set -eu
    export RUBYOPT="-r$(pwd)/_ruby_compat.rb"
    echo "🔨 Building Jekyll site (incremental; reusing .jekyll-cache)..."
    if [ "$(uname)" = "Darwin" ]; then
        ~/homebrew/opt/ruby/bin/bundle exec jekyll build
    else
        bundle exec jekyll build
    fi
    echo "✅ Jekyll build complete - site available in _site/"

# The old `jekyll serve` preview with livereload (Jekyll-only; `just serve` is the Zola preview)
jekyll-serve-legacy port="4000" livereload_port="35729":
    #!/usr/bin/env sh
    echo '{"branch": "'$(git branch --show-current)'"}' > _data/git.json
    just update-pr-data || true
    BIND_HOST="127.0.0.1"
    if [ -f "/.dockerenv" ] && command -v tailscale >/dev/null 2>&1; then
        BIND_HOST="0.0.0.0"
    fi
    export RUBYOPT="-r$(pwd)/_ruby_compat.rb"
    if command -v rbenv >/dev/null 2>&1; then
        eval "$(rbenv init - sh)"
        RUNNER="rbenv exec bundle exec"
    else
        RUNNER="bundle exec"
    fi
    exec running-servers run --process jekyll --http {{port}} --livereload {{livereload_port}} \
        -- $RUNNER jekyll server --incremental --livereload --host "$BIND_HOST" \
        --port '{http}' --livereload-port '{livereload}'

# Serve with the upstream jekyll/jekyll:4 image (Jekyll-only)
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

# devdocker image (Jekyll era; it has no Zola)
docker-build:
    docker build -t devdocker devdocker

docker-run2:
    docker run -v ~/blog:/root/blog -p 35729:35729 -p 4000:4000 -it devdocker

# ponytail: calls `npm run jekyll:container`, which package.json no longer defines (broken before Zola)
docker-run:
    docker run -v ~/blog:/root/blog -it -p 35729:35729 -p 4000:4000 devdocker npm run jekyll:container

prepare:
    husky install
# ===== Playwright Tests =====
# For Playwright E2E testing, use these commands:
# - pw-test: Run all Playwright E2E tests
# - pw-test-ui: Run tests with UI
# - pw-install: Install Playwright browsers

# Run tests against Lightpanda (DOM/content tests only)
pw-test-lightpanda:
    #!/usr/bin/env sh
    STARTED_LP=false
    if ! curl -s -o /dev/null ws://127.0.0.1:9222 2>/dev/null && ! ss -tln | grep -q ':9222 '; then
        echo "Starting Lightpanda CDP server..."
        lightpanda serve --port 9222 &
        LP_PID=$!
        STARTED_LP=true
        sleep 2
    else
        echo "Lightpanda already running on port 9222"
    fi
    echo "Running Lightpanda content tests..."
    npx playwright test --config playwright.lightpanda.config.ts
    EXIT_CODE=$?
    if [ "$STARTED_LP" = "true" ]; then
        echo "Stopping Lightpanda (PID $LP_PID)..."
        kill $LP_PID 2>/dev/null || true
        wait $LP_PID 2>/dev/null || true
    fi
    exit $EXIT_CODE

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

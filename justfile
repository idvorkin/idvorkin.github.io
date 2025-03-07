default:
    @just --list

# ===== JavaScript/TypeScript Build System =====
# For JavaScript/TypeScript development, use these commands:
# - js-build: Build all JavaScript/TypeScript files for production
# - js-watch: Watch for changes during development
# - js-typecheck: Run TypeScript type checking without emitting files
# - js-test: Run Jest tests
# - js-lint: Check code formatting
# - js-format: Format code with Prettier
# - js-clean: Clean build artifacts

# Build all JavaScript/TypeScript files for production
js-build:
    # Using Parcel for bundling (handles TypeScript transpilation)
    rm -rf .parcel-cache dist assets/js/*.js assets/js/*.map
    # Build the single entry point with optimization
    npx parcel build --no-cache --no-source-maps --no-content-hash --detailed-report

# Watch for changes during development
js-watch:
    # Using Parcel for bundling with watch mode
    rm -rf .parcel-cache dist assets/js/*.js assets/js/*.map
    # Watch the single entry point
    npx parcel watch --no-cache

# Run TypeScript type checking without emitting files
js-typecheck:
    # Using TypeScript for type checking only (no transpilation)
    npx tsc --noEmit

# Run Jest tests
js-test:
    npx jest

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

# Legacy commands (kept for backward compatibility)
parcel-start:
    @echo "⚠️ This command is deprecated. Use 'just js-watch' instead."
    npx parcel src/index.html

parcel-build:
    @echo "⚠️ This command is deprecated. Use 'just js-build' instead."
    npx parcel build --dist-dir assets/js --no-cache --no-source-maps

parcel-build-search:
    @echo "⚠️ This command is deprecated. Use 'just js-build' instead."
    npx parcel build --dist-dir assets/js --no-cache --no-source-maps

parcel-watch:
    @echo "⚠️ This command is deprecated. Use 'just js-watch' instead."
    rm -rf .parcel-cache dist assets/js/*.js assets/js/*.map && npx parcel watch --no-cache

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

cy-ut:
    npx cypress run --config video=false --spec '**/unit/*ts'

cy-run:
    npx cypress run --config video=false --env coverage=false

cy-prod-run:
    npx cypress run --config video=false --env coverage=false --config baseUrl=https://idvork.in

cy-record:
    . ./_cypress_api_key && npx cypress run --record --env coverage=false

cy-open:
    npx cypress open --env coverage=false

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
    # Run directly since the script has a uv shebang (#!uv run) and dependencies defined in the script header
    ./build_back_links.py build

update-search:
    bundle exec jekyll algolia

update-ig66:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

update-eulogy:
    python3 scripts/eulogy_to_json.py > eulogy.json

update-fj:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

back-links:
    just update-backlinks

broken-links:
    scrapy runspider linkchecker.py -O ~/tmp/brokenlinks.csv && cat ~/tmp/brokenlinks.csv

prepare:
    husky install

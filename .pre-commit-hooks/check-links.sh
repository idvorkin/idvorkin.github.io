#!/bin/bash

# Pre-commit hook to check internal links with lychee
# This script checks only the files that are being committed

set -e

# Get list of staged markdown files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(md|markdown)$' | grep -v '^zz-chop-logs/' | grep -v 'back-links.json' || true)

if [ -z "$STAGED_FILES" ]; then
    echo "📝 No markdown files to check"
    exit 0
fi

# Quick check if Jekyll server is running on localhost:4000
if ! curl -s --connect-timeout 1 http://localhost:4000/ > /dev/null 2>&1; then
    echo "⚠️  Jekyll server not running - skipping link check ✅"
    echo "   💡 Run 'just jekyll-serve' to enable link checking"
    exit 0
fi

# Check if lychee is available
if ! command -v lychee > /dev/null 2>&1; then
    echo "⚠️  lychee not found - skipping link check ✅"
    echo "   💡 Install lychee to enable link checking:"
    echo "   curl -sSL https://github.com/lycheeverse/lychee/releases/latest/download/lychee-aarch64-unknown-linux-gnu.tar.gz | tar xz && sudo mv lychee /usr/local/bin/"
    exit 0
fi

echo "🔗 Checking internal links in staged files..."
echo "📁 Files: $STAGED_FILES"

# Translate markdown file paths to their corresponding URLs using backlinks.json
TRANSLATED_URLS=""
FILES_NOT_IN_BACKLINKS=""
if [ -f "back-links.json" ]; then
    for file in $STAGED_FILES; do
        # Use Python to look up the URL for this markdown file
        URL=$(python3 -c "
import json, sys
try:
    with open('back-links.json', 'r') as f:
        data = json.load(f)
    for url, info in data.get('url_info', {}).items():
        if info.get('markdown_path') == '$file':
            print('http://localhost:4000' + url)
            sys.exit(0)
    # If not found in backlinks, use the file path directly
    print('$file')
except:
    print('$file')
" 2>/dev/null)

        # Track files not found in backlinks
        if [[ "$URL" == "$file" ]]; then
            FILES_NOT_IN_BACKLINKS="$FILES_NOT_IN_BACKLINKS $file"
        fi

        # Only add to the list if it's not already there
        if [[ "$TRANSLATED_URLS" != *"$URL"* ]]; then
            TRANSLATED_URLS="$TRANSLATED_URLS $URL"
        fi
    done
else
    # Fallback to checking files directly if no backlinks.json
    TRANSLATED_URLS="$STAGED_FILES"
    FILES_NOT_IN_BACKLINKS="$STAGED_FILES"
fi

# Warn about files not in backlinks
if [ -n "$FILES_NOT_IN_BACKLINKS" ]; then
    echo "⚠️  Warning: The following files are not in back-links.json:"
    for file in $FILES_NOT_IN_BACKLINKS; do
        echo "   - $file"
    done
    echo "   💡 Run 'just update-backlinks' to update the backlinks database"
    echo "   ⚠️  Fragment validation may fail for these files"
    echo ""
fi

# Remove any file paths that have corresponding URLs (avoid checking both)
if [ -f "back-links.json" ]; then
    FINAL_URLS=""
    for url in $TRANSLATED_URLS; do
        # Skip file paths if we have a corresponding URL
        if [[ "$url" == http://localhost:4000* ]]; then
            FINAL_URLS="$FINAL_URLS $url"
        elif [[ "$TRANSLATED_URLS" != *"http://localhost:4000"* ]]; then
            # Only include files if no URL was found
            FINAL_URLS="$FINAL_URLS $url"
        fi
    done
    TRANSLATED_URLS="$FINAL_URLS"
fi

# Clean up extra spaces
TRANSLATED_URLS=$(echo $TRANSLATED_URLS | tr -s ' ')

echo "🌐 Checking URLs: $TRANSLATED_URLS"

# Run lychee on each URL individually with the correct base URL for fragment resolution
# Exclude GitHub URLs with line number fragments (#L\d+) from fragment validation
# as lychee can't validate line numbers on GitHub pages with ?plain=1
OVERALL_EXIT_CODE=0

for url in $TRANSLATED_URLS; do
    if [[ "$url" == http://localhost:4000* ]]; then
        # For localhost URLs, use the URL itself as base for proper fragment resolution
        BASE_URL="$url"
    else
        # For files, use localhost:4000 as base
        BASE_URL="http://localhost:4000"
    fi

    echo "🌐 Checking $url with base URL: $BASE_URL"

    # Build a list of exclude patterns for GitHub links to the currently staged files
    EXCLUDE_ARGS=""
    for staged_file in $STAGED_FILES; do
        # Exclude GitHub links to each staged file (they may not exist in main branch yet)
        EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude 'https://github\.com/idvorkin/idvorkin\.github\.io/blob/[^/]*/$staged_file'"
    done

    # Also exclude GitHub line number fragments
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude 'https://github\.com/.*#L\d+'"

    if ! lychee --base-url "$BASE_URL" --include-fragments $EXCLUDE_ARGS --format markdown --quiet --quiet --no-progress "$url"; then
        OVERALL_EXIT_CODE=1
        echo "❌ Found broken links in $url"
    fi
done

if [ $OVERALL_EXIT_CODE -eq 0 ]; then
    echo "✅ All links in staged files are working!"
    exit 0
else
    echo "❌ Found broken links in staged files"
    echo "💡 Run individual lychee commands shown above for details"
    exit 1
fi
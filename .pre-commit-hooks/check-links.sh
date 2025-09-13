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
    echo "⚠️  lychee not found - installing ARM64 version..."
    curl -sSL https://github.com/lycheeverse/lychee/releases/latest/download/lychee-aarch64-unknown-linux-gnu.tar.gz | tar xz
    sudo mv lychee /usr/local/bin/
    echo "✅ lychee installed successfully"
fi

echo "🔗 Checking internal links in staged files..."
echo "📁 Files: $STAGED_FILES"

# Translate markdown file paths to their corresponding URLs using backlinks.json
TRANSLATED_URLS=""
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

        # Only add to the list if it's not already there
        if [[ "$TRANSLATED_URLS" != *"$URL"* ]]; then
            TRANSLATED_URLS="$TRANSLATED_URLS $URL"
        fi
    done
else
    # Fallback to checking files directly if no backlinks.json
    TRANSLATED_URLS="$STAGED_FILES"
fi

# Clean up extra spaces
TRANSLATED_URLS=$(echo $TRANSLATED_URLS | tr -s ' ')

echo "🌐 Checking URLs: $TRANSLATED_URLS"

# Run lychee on the translated URLs/files
if lychee --base-url http://localhost:4000 --include-fragments --format markdown --quiet --quiet --no-progress $TRANSLATED_URLS; then
    echo "✅ All links in staged files are working!"
    exit 0
else
    echo "❌ Found broken links in staged files"
    echo "💡 Run 'lychee --base-url http://localhost:4000 --include-fragments $TRANSLATED_URLS' for details"
    exit 1
fi
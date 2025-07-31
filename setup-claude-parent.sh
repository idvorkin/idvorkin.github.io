#!/bin/bash

# Setup Claude parent directory for git worktree workflow
# This script creates symlinks to Claude configuration from cc_main

set -e

echo "🔧 Setting up Claude parent directory configuration..."

# Check if we're in the right place
if [ ! -d "cc_main" ]; then
    echo "❌ Error: cc_main directory not found!"
    echo "   Please run this script from the parent directory containing cc_main"
    exit 1
fi

# Check if cc_main has Claude configuration
if [ ! -f "cc_main/CLAUDE.md" ]; then
    echo "❌ Error: cc_main/CLAUDE.md not found!"
    echo "   Please ensure cc_main contains your Claude configuration"
    exit 1
fi

# Create symlink to CLAUDE.md
if [ -e "CLAUDE.md" ]; then
    echo "⚠️  CLAUDE.md already exists in parent directory"
    read -p "   Overwrite with symlink to cc_main/CLAUDE.md? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f CLAUDE.md
        ln -s cc_main/CLAUDE.md CLAUDE.md
        echo "✅ Created symlink: CLAUDE.md -> cc_main/CLAUDE.md"
    else
        echo "⏭️  Skipping CLAUDE.md"
    fi
else
    ln -s cc_main/CLAUDE.md CLAUDE.md
    echo "✅ Created symlink: CLAUDE.md -> cc_main/CLAUDE.md"
fi

# Create symlink to .claude directory
if [ -d "cc_main/.claude" ]; then
    if [ -e ".claude" ]; then
        echo "⚠️  .claude already exists in parent directory"
        read -p "   Overwrite with symlink to cc_main/.claude? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf .claude
            ln -s cc_main/.claude .claude
            echo "✅ Created symlink: .claude -> cc_main/.claude"
        else
            echo "⏭️  Skipping .claude"
        fi
    else
        ln -s cc_main/.claude .claude
        echo "✅ Created symlink: .claude -> cc_main/.claude"
    fi
else
    echo "ℹ️  No .claude directory found in cc_main (this is OK)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "You can now:"
echo "  1. Run Claude from this parent directory"
echo "  2. Work on files in cc_main/ or any worktree"
echo "  3. Create new worktrees: cd cc_main && git worktree add ../feature-branch"
#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Quick setup on container start
setup_git() {
    # Use mounted .gitconfig if available
    if [ -f /home/claude/.gitconfig ]; then
        log_info "Using mounted .gitconfig"
    else
        # Set user info from env if provided
        if [ -n "$GIT_USER_NAME" ]; then
            git config --global user.name "$GIT_USER_NAME"
            log_info "Git user: $GIT_USER_NAME"
        fi
        if [ -n "$GIT_USER_EMAIL" ]; then
            git config --global user.email "$GIT_USER_EMAIL"
            log_info "Git email: $GIT_USER_EMAIL"
        fi
    fi
}

# Setup GitHub CLI if token provided
setup_github() {
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null
        log_info "GitHub CLI authenticated"
        
        # Install GitHub extensions if not already installed
        if ! gh extension list | grep -q "github/gh-copilot"; then
            gh extension install github/gh-copilot 2>/dev/null || true
        fi
    else
        log_warn "No GITHUB_TOKEN provided - gh commands won't work"
    fi
}

# Check workspace and repository status
check_workspace() {
    if [ -d /workspace/.git ]; then
        cd /workspace
        REPO_URL=$(git remote get-url origin 2>/dev/null || echo 'no remote')
        CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo 'no branch')
        
        echo ""
        echo "📁 Workspace: $(pwd)"
        echo "📦 Repository: $REPO_URL"
        echo "🌿 Current branch: $CURRENT_BRANCH"
        
        # Check for uncommitted changes
        if ! git diff --quiet 2>/dev/null; then
            log_warn "Uncommitted changes detected"
        fi
        
        # Check git status
        CHANGED_FILES=$(git status --porcelain 2>/dev/null | wc -l)
        if [ "$CHANGED_FILES" -gt 0 ]; then
            echo "📝 Changed files: $CHANGED_FILES"
        fi
    else
        log_error "No git repository in /workspace"
        echo "Initialize with: git init"
    fi
}

# Auto-create branch if specified
create_branch() {
    if [ -n "$AUTO_BRANCH" ] && [ "$AUTO_CREATE_BRANCH" = "true" ]; then
        cd /workspace
        
        # Make sure we're on the latest main/master
        DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
        
        log_info "Updating from $DEFAULT_BRANCH..."
        git checkout "$DEFAULT_BRANCH" 2>/dev/null || git checkout main 2>/dev/null || git checkout master
        git pull origin "$DEFAULT_BRANCH" 2>/dev/null || true
        
        # Create new branch
        if git checkout -b "$AUTO_BRANCH" 2>/dev/null; then
            log_info "Created and switched to branch: $AUTO_BRANCH"
        else
            log_warn "Branch $AUTO_BRANCH already exists, switching to it"
            git checkout "$AUTO_BRANCH"
        fi
    elif [ -n "$AUTO_BRANCH" ]; then
        log_info "Branch name prepared: $AUTO_BRANCH (use AUTO_CREATE_BRANCH=true to create)"
    fi
}

# Setup settings symlinks if mounted
setup_settings() {
    if [ -d /home/claude/settings ]; then
        log_info "Settings directory mounted, creating symlinks..."
        
        # Create config directories
        mkdir -p ~/.config/{nvim,bat,yazi} ~/.tmux/plugins ~/.vim/bundle
        
        # Symlink configs if they exist
        [ -f ~/settings/shared/.tmux.conf ] && ln -sf ~/settings/shared/.tmux.conf ~/.tmux.conf
        [ -d ~/settings/nvim ] && ln -sf ~/settings/nvim ~/.config/nvim
        [ -d ~/settings/config/bat ] && ln -sf ~/settings/config/bat ~/.config/bat
        [ -d ~/settings/config/yazi ] && ln -sf ~/settings/config/yazi ~/.config/yazi
        
        log_info "Settings linked"
    fi
}

# Show helpful commands
show_help() {
    echo ""
    echo "🚀 Quick Commands:"
    echo "  git status                    - Check current status"
    echo "  git add . && git commit -m    - Stage and commit changes"
    
    if [ -n "$PR_TITLE" ]; then
        echo "  gh pr create --title \"$PR_TITLE\" --body \"Created with Claude Code\""
    else
        echo "  gh pr create                  - Create a pull request"
    fi
    
    echo "  just js-build                 - Build TypeScript"
    echo "  just js-validate              - Validate code"
    echo "  just fast-test                - Run tests"
    echo "  just jekyll-serve             - Start Jekyll server"
    echo ""
}

# Main setup sequence
main() {
    echo "🐳 Claude Code Fast PR Container"
    echo "================================="
    
    setup_git
    setup_github
    setup_settings
    check_workspace
    create_branch
    
    # Show PR creation info if title provided
    if [ -n "$PR_TITLE" ]; then
        echo ""
        echo "📝 PR Title: $PR_TITLE"
    fi
    
    show_help
    
    # Execute command or start shell
    if [ $# -gt 0 ]; then
        exec "$@"
    else
        # Start interactive shell with proper signal handling
        exec /bin/bash
    fi
}

# Run main function with all arguments
main "$@"
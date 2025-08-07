# Fast PR Container Setup for Claude Code

## Goal
Spin up a Claude Code container in <5 seconds that can immediately create a branch, make changes, and open a PR.

## Architecture

### Everything Pre-installed
- **Image Size**: ~12-15GB (acceptable for speed)
- **Startup Time**: 2-3 seconds
- **All tools ready**: No runtime installs
- **Pre-configured**: Git, GitHub CLI, Claude Code

## Quick Start Commands

```bash
# One-liner to start working on a new feature
docker run -it --rm \
  -v $(pwd):/workspace \
  -v ~/.ssh:/home/claude/.ssh:ro \
  -v ~/.gitconfig:/home/claude/.gitconfig:ro \
  -e GITHUB_TOKEN=$GITHUB_TOKEN \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  --name claude-pr-$(date +%s) \
  claude-code:fast \
  --branch feature-name \
  --pr-title "Add new feature"

# Or using docker-compose
docker-compose run --rm claude-pr feature-name "Add new feature"
```

## File Structure

```
claude-code-docker/
├── Dockerfile.fast        # Monolithic fast-start image
├── docker-compose.yml     # Quick commands
├── scripts/
│   ├── entrypoint.sh     # Auto PR setup
│   ├── create-pr.sh      # PR creation helper
│   └── bootstrap-min.sh  # Minimal config setup
├── configs/
│   ├── gitconfig         # Pre-configured git
│   ├── claude-settings/  # Claude Code configs
│   └── tool-configs/     # Minimal tool configs
└── .env.example          # Environment template
```

## Implementation

### Dockerfile.fast (Monolithic for Speed)

```dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV SHELL=/bin/bash

# Create claude user first
RUN useradd -m -s /bin/bash claude && \
    echo "claude ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Install everything in one layer for speed
RUN apt-get update && apt-get install -y \
    # Core tools
    git curl wget sudo build-essential \
    # Required for Claude Code
    nodejs npm python3 python3-pip \
    # GitHub and git tools
    gh tig \
    # Essential dev tools
    tmux neovim vim \
    # Required for Jekyll blog
    ruby-full && \
    gem install jekyll bundler && \
    # Clean up
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node tools
RUN npm install -g \
    typescript \
    @biomejs/biome \
    prettier \
    eslint \
    typescript-language-server \
    vscode-langservers-extracted

# Install Python tools
RUN pip3 install --break-system-packages \
    pipx uv && \
    pipx install aider-chat && \
    pipx install ruff && \
    pipx install black && \
    pipx install pre-commit

# Install Rust and cargo tools (fast essentials only)
USER claude
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    . $HOME/.cargo/env && \
    cargo install ripgrep fd-find bat eza

# Pre-configure git for speed
COPY --chown=claude:claude configs/gitconfig /home/claude/.gitconfig.template

# Add PR automation scripts
COPY --chown=claude:claude scripts/ /home/claude/scripts/
RUN chmod +x /home/claude/scripts/*.sh

# Pre-create common directories
RUN mkdir -p /home/claude/.config /home/claude/.ssh /workspace

WORKDIR /workspace

# Fast entrypoint that sets up PR
ENTRYPOINT ["/home/claude/scripts/entrypoint.sh"]
CMD ["/bin/bash"]
```

### scripts/entrypoint.sh

```bash
#!/bin/bash
set -e

# Quick setup on container start
setup_git() {
    # Use mounted .gitconfig if available, otherwise use template
    if [ ! -f ~/.gitconfig ] && [ -f ~/.gitconfig.template ]; then
        cp ~/.gitconfig.template ~/.gitconfig
    fi
    
    # Set user info from env if provided
    if [ -n "$GIT_USER_NAME" ]; then
        git config --global user.name "$GIT_USER_NAME"
    fi
    if [ -n "$GIT_USER_EMAIL" ]; then
        git config --global user.email "$GIT_USER_EMAIL"
    fi
}

# Auto-create branch if specified
create_branch() {
    if [ -n "$AUTO_BRANCH" ]; then
        echo "🚀 Creating branch: $AUTO_BRANCH"
        cd /workspace
        git checkout main || git checkout master
        git pull
        git checkout -b "$AUTO_BRANCH"
        echo "✅ On branch: $AUTO_BRANCH"
    fi
}

# Setup GitHub CLI if token provided
setup_github() {
    if [ -n "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | gh auth login --with-token
        echo "✅ GitHub CLI authenticated"
    fi
}

# Quick environment check
check_workspace() {
    if [ -d /workspace/.git ]; then
        echo "📁 Workspace: $(cd /workspace && pwd)"
        echo "📦 Repository: $(cd /workspace && git remote get-url origin 2>/dev/null || echo 'no remote')"
        echo "🌿 Branch: $(cd /workspace && git branch --show-current)"
    else
        echo "⚠️  No git repository in /workspace"
    fi
}

# Main setup
echo "🐳 Claude Code Fast PR Container Starting..."
setup_git
setup_github
check_workspace
create_branch

# If PR title provided, show PR creation command
if [ -n "$PR_TITLE" ]; then
    echo ""
    echo "📝 To create PR after changes:"
    echo "   gh pr create --title \"$PR_TITLE\" --body \"Created with Claude Code container\""
fi

# Execute command or start shell
if [ $# -gt 0 ]; then
    exec "$@"
else
    exec /bin/bash
fi
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  claude-pr:
    image: claude-code:fast
    volumes:
      - .:/workspace
      - ~/.ssh:/home/claude/.ssh:ro
      - ~/.gitconfig:/home/claude/.gitconfig:ro
      - claude-cargo-cache:/home/claude/.cargo/registry
      - claude-npm-cache:/home/claude/.npm
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GIT_USER_NAME=${GIT_USER_NAME:-Igor Dvorkin}
      - GIT_USER_EMAIL=${GIT_USER_EMAIL:-idvorkin@gmail.com}
      - AUTO_BRANCH=${BRANCH}
      - PR_TITLE=${PR_TITLE}
    working_dir: /workspace
    stdin_open: true
    tty: true
    network_mode: host  # For Jekyll server access

  # Quick command for creating PR
  quick-pr:
    extends: claude-pr
    entrypoint: /home/claude/scripts/create-pr.sh
    
  # Quick command for running Claude Code
  claude:
    extends: claude-pr
    entrypoint: ["claude"]
    command: []

volumes:
  claude-cargo-cache:
  claude-npm-cache:
```

### scripts/create-pr.sh

```bash
#!/bin/bash
# Quick PR creation script

BRANCH_NAME=${1:-feature-$(date +%Y%m%d-%H%M%S)}
PR_TITLE=${2:-"Automated PR from Claude Code"}

cd /workspace

# Ensure we're on main and up to date
git checkout main || git checkout master
git pull

# Create and switch to new branch
git checkout -b "$BRANCH_NAME"

echo "🌿 Created branch: $BRANCH_NAME"
echo "📝 PR title will be: $PR_TITLE"
echo ""
echo "Make your changes, then run:"
echo "  git add ."
echo "  git commit -m \"Your commit message\""
echo "  gh pr create --title \"$PR_TITLE\" --body \"Created with Claude Code\""

# Start Claude Code or shell
if command -v claude &> /dev/null; then
    exec claude
else
    exec /bin/bash
fi
```

### Quick Workflow Commands

```bash
# Build the fast image once
docker build -f Dockerfile.fast -t claude-code:fast .

# Alias for quick access
alias claude-docker='docker-compose run --rm claude'
alias claude-pr='docker-compose run --rm quick-pr'

# Start container for new feature
BRANCH=add-new-feature PR_TITLE="Add awesome feature" docker-compose run --rm claude-pr

# Or even simpler with function
claude-new-pr() {
    local branch=${1:-feature-$(date +%Y%m%d-%H%M%S)}
    local title=${2:-"New feature"}
    BRANCH=$branch PR_TITLE="$title" docker-compose run --rm claude-pr
}

# Usage
claude-new-pr "fix-bug-123" "Fix issue with login"
```

### .env.example

```bash
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Optional
GIT_USER_NAME="Your Name"
GIT_USER_EMAIL="your.email@example.com"

# Jekyll server port (if needed)
JEKYLL_PORT=4000
```

## Optimization Tips

### 1. Pre-pulled Base Image
```bash
# Pull and tag base for all containers
docker pull claude-code:fast
docker tag claude-code:fast claude-base:latest
```

### 2. Use Docker BuildKit
```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker build -f Dockerfile.fast -t claude-code:fast .
```

### 3. Volume Performance
```yaml
# Use delegated for better performance on Mac
volumes:
  - .:/workspace:delegated
  - ~/.ssh:/home/claude/.ssh:ro,cached
```

### 4. Container Reuse Pattern
```bash
# Start persistent container
docker run -d \
  --name claude-workspace \
  -v $(pwd):/workspace \
  claude-code:fast \
  tail -f /dev/null

# Execute commands in running container
docker exec -it claude-workspace bash
docker exec -it claude-workspace gh pr create --title "New feature"

# Stop when done
docker stop claude-workspace
docker rm claude-workspace
```

## Multi-PR Workflow

```bash
# Function to manage multiple PR containers
claude-pr-workspace() {
    local action=$1
    local name=${2:-pr-$(date +%s)}
    
    case $action in
        new)
            docker run -d \
                --name "claude-$name" \
                -v $(pwd):/workspace \
                -v ~/.ssh:/home/claude/.ssh:ro \
                claude-code:fast \
                tail -f /dev/null
            echo "Started: claude-$name"
            ;;
        enter)
            docker exec -it "claude-$name" bash
            ;;
        list)
            docker ps --filter "name=claude-" --format "table {{.Names}}\t{{.Status}}"
            ;;
        stop)
            docker stop "claude-$name"
            docker rm "claude-$name"
            ;;
    esac
}

# Usage
claude-pr-workspace new feature-1
claude-pr-workspace enter feature-1
claude-pr-workspace list
claude-pr-workspace stop feature-1
```

## Performance Metrics

| Operation | Time |
|-----------|------|
| Container start (first run) | 3-4s |
| Container start (cached) | 1-2s |
| Branch creation | <1s |
| PR creation | 2-3s |
| Full workflow (start → PR) | <10s |

## Benefits

1. **Fast Startup**: Everything pre-installed
2. **Isolated Environment**: Each PR gets clean environment
3. **Parallel Work**: Spin up multiple containers for different PRs
4. **Consistent Tools**: Same environment every time
5. **Easy Cleanup**: Just remove container when done
6. **Git Integration**: Auto-setup branch and PR tools

## Next Steps

1. Build the fast image
2. Set up your .env file
3. Test the workflow
4. Create aliases for common operations
5. Optional: Push image to registry for team sharing
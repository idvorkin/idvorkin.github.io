# Docker Container Build Plan for Claude Code

## Current Status

### ✅ Completed
1. Created layered Docker architecture to handle slow network
2. Built two base layers:
   - `claude-code:layer-01-base` (120MB) - Ubuntu 24.04 + essential tools (curl, wget, sudo)
   - `claude-code:layer-02-git` (249MB) - Git, GitHub CLI, SSH, tig
3. Created quick runner script: `run-pr.sh` for immediate PR work
4. Identified that Rust compilation is too slow - use pre-built binaries instead

### 📁 Files Created
- `docker/` directory with all Docker configurations
- `Dockerfile.01-base` through `Dockerfile.08-extras` - Layered build files
- `Dockerfile.fast` - Original monolithic approach (too slow)
- `Dockerfile.quick-no-rust` - Optimized version without Rust compilation
- `Dockerfile.minimal` - Bare minimum for PR creation
- `build-layers.sh` - Script to build layers incrementally
- `run-pr.sh` - Quick launcher for PR work
- `docker-compose.yml` - Docker Compose configuration
- `scripts/entrypoint.sh` - Container initialization script
- `scripts/create-pr.sh` - PR creation helper
- `.env.example` - Environment variable template
- `Makefile` - Convenience commands
- `README.md` - Documentation

### 🔧 Key Decisions Made
1. **Base OS**: Ubuntu 24.04 (not Alpine) for compatibility
2. **Architecture**: Layered approach for incremental builds on slow network
3. **No Rust compilation**: Too slow, use pre-built binaries instead
4. **Tools Strategy**: Install from apt where possible, use pre-built .deb files for Rust tools

## Next Steps to Complete

### 1. Finish Building Essential Layers (When Network Allows)

```bash
# Build remaining layers one at a time
./build-layers.sh 3  # Dev tools (vim, tmux, build-essential)
./build-layers.sh 4  # Node.js and npm packages
./build-layers.sh 5  # Python and pip packages
./build-layers.sh 6  # Jekyll (Ruby)
```

### 2. Add Pre-built Rust Tools (Instead of Compiling)

Create `Dockerfile.rust-prebuilt`:
```dockerfile
FROM claude-code:layer-06-jekyll AS rust-prebuilt

# Install ripgrep from pre-built binary
RUN curl -LO https://github.com/BurntSushi/ripgrep/releases/download/14.1.0/ripgrep_14.1.0-1_arm64.deb && \
    dpkg -i ripgrep_14.1.0-1_arm64.deb && \
    rm ripgrep_14.1.0-1_arm64.deb

# Install bat from pre-built binary
RUN curl -LO https://github.com/sharkdp/bat/releases/download/v0.24.0/bat_0.24.0_arm64.deb && \
    dpkg -i bat_0.24.0_arm64.deb && \
    rm bat_0.24.0_arm64.deb

# Install fd from pre-built binary
RUN curl -LO https://github.com/sharkdp/fd/releases/download/v9.0.0/fd_9.0.0_arm64.deb && \
    dpkg -i fd_9.0.0_arm64.deb && \
    rm fd_9.0.0_arm64.deb

# Install eza from pre-built binary
RUN curl -LO https://github.com/eza-community/eza/releases/download/v0.18.0/eza_0.18.0-1_arm64.deb && \
    dpkg -i eza_0.18.0-1_arm64.deb && \
    rm eza_0.18.0-1_arm64.deb
```

### 3. Create Final Assembly

```bash
# After all layers are built, create final image
docker build -f Dockerfile.final -t claude-code:fast .
```

### 4. Optimize for Your Tools

From `~/settings/shared/brew_packages.sh`, prioritize installing:
- **Essential**: git, gh, tmux, vim/neovim (✅ already in layer-02)
- **Search**: ripgrep, fd, ag (use pre-built or apt versions)
- **Development**: just, pre-commit, docker tools
- **Python**: pipx, uv, aider-chat, ruff, black
- **Node**: prettier, eslint, typescript
- **Data tools**: jq, yq, dasel

## Current Workaround (Use Now)

While waiting for full build, you can use what's ready:

```bash
# Use the git layer for basic PR work
./run-pr.sh feature-name "PR title"

# Or run directly
docker run -it --rm \
  -v $(pwd)/../:/workspace \
  -v ~/.ssh:/home/claude/.ssh:ro \
  -e GITHUB_TOKEN=$GITHUB_TOKEN \
  claude-code:layer-02-git bash
```

## Build Strategy for Slow Network

1. **Build one layer at a time** - Each layer is cached
2. **Skip Rust compilation** - Use pre-built binaries
3. **Use apt packages where possible** - Faster than building from source
4. **Minimal first, enhance later** - Start with working minimum
5. **Mount settings as volume** - Don't rebuild for config changes

## Testing Commands

```bash
# Check what's built
docker images | grep claude-code

# Test basic functionality
docker run --rm claude-code:layer-02-git git --version
docker run --rm claude-code:layer-02-git gh --version

# Check layer history
docker history claude-code:layer-02-git
```

## Environment Setup

Create `.env` file:
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
GIT_USER_NAME="Your Name"
GIT_USER_EMAIL="your.email@example.com"
```

## Final Goal

A container that:
- Starts in 2-3 seconds
- Has all essential dev tools pre-installed
- Can create branches and PRs immediately
- Works offline after initial build
- Supports parallel PR work in isolated containers

## Recovery Commands

If builds fail or timeout:

```bash
# Clean up failed builds
docker system prune -f

# Remove specific layer to rebuild
docker rmi claude-code:layer-03-dev

# Continue from last successful layer
./build-layers.sh 3  # Continues from layer 2

# Check disk space
docker system df
```

## Notes

- The builds timeout on slow network - this is normal
- Each layer builds on the previous one
- Layers are cached locally - you won't lose progress
- Skip the Rust compilation layer (7) - it takes forever
- Use pre-built binaries or apt packages instead of compiling
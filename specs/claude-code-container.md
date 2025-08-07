# Claude Code Container Specification

## Overview
A containerized environment for running Claude Code safely with all required development tools and dependencies.

## Base Requirements

### Core System
- **Base Image**: Ubuntu 24.04 or Debian 12 (stable, well-supported)
- **Shell**: Bash, Zsh
- **Terminal Multiplexer**: tmux
- **Process Manager**: systemd or supervisor (for running multiple services)

### Claude Code Requirements
- **Node.js**: v20.x LTS
- **Python**: 3.11+ (for various tools and scripts)
- **Git**: Latest stable
- **GitHub CLI**: Latest (`gh`)
- **MCP Server Support**: Node.js runtime for MCP servers

### Development Tools

#### Language Servers (LSPs)
- **TypeScript/JavaScript**: typescript-language-server
- **Python**: pylsp or pyright
- **Rust**: rust-analyzer
- **Go**: gopls
- **Java**: jdtls
- **C/C++**: clangd
- **HTML/CSS**: vscode-html-language-server, vscode-css-language-server
- **JSON**: vscode-json-language-server
- **YAML**: yaml-language-server
- **Markdown**: marksman

#### Web Development
- **Jekyll**: Ruby 3.x + Jekyll 4.x with common plugins
- **Bundler**: For Ruby dependency management
- **Playwright**: With browsers (Chromium, Firefox, WebKit)
- **Build Tools**: 
  - npm/yarn/pnpm
  - webpack, vite, esbuild
  - just (command runner)

#### Code Quality Tools
- **Linters**: ESLint, Prettier, Black, Ruff, rustfmt
- **Pre-commit**: For git hooks
- **Testing Frameworks**: Jest, Vitest, pytest, cargo test

### Additional Tools
- **ripgrep**: Fast searching
- **fd**: Fast file finding
- **bat**: Better cat with syntax highlighting
- **jq**: JSON processor
- **curl/wget**: HTTP clients
- **ImageMagick**: Image processing
- **ffmpeg**: Video/audio processing
- **pandoc**: Document conversion

## Container Architecture

### Volumes/Mounts
```yaml
volumes:
  - ./workspace:/workspace  # Main working directory
  - ~/.ssh:/home/claude/.ssh:ro  # SSH keys (read-only)
  - ~/.gitconfig:/home/claude/.gitconfig:ro  # Git config (read-only)
  - claude-home:/home/claude  # Persistent home directory
  - claude-cache:/cache  # Shared cache for package managers
```

### Environment Variables
```yaml
environment:
  - CLAUDE_WORKSPACE=/workspace
  - CLAUDE_CACHE=/cache
  - NODE_PATH=/usr/local/lib/node_modules
  - PLAYWRIGHT_BROWSERS_PATH=/cache/playwright
```

### Networking
- Expose ports for development servers (3000-5000, 8000-9000)
- Support for host networking mode when needed
- Internal DNS resolution for service discovery

## Persistence Strategy

### Option 1: Commit-based Persistence
- Make changes in running container
- Use `docker commit` to save state
- Tag versions for rollback capability
```bash
docker commit claude-code-container claude-code:custom-v1
```

### Option 2: Layered Dockerfile (SELECTED)
- Base Dockerfile with core requirements
- Custom layer Dockerfile extending base
```dockerfile
FROM claude-code:base
# Add custom tools and configurations
```

#### How Docker Layers Work

**Layer Creation:**
- Each instruction in a Dockerfile creates a new layer
- Layers are cached and reused when unchanged
- Layers are stacked on top of each other (union filesystem)

**Layer Persistence:**
```bash
# Build base image (persisted automatically)
docker build -f Dockerfile.base -t claude-code:base .

# Build your custom layer on top (also persisted)
docker build -f Dockerfile.custom -t claude-code:custom .

# Your Dockerfile.custom:
FROM claude-code:base
RUN apt-get update && apt-get install -y my-custom-tool
COPY my-configs /home/claude/.config/
```

**Layer Management:**
1. **Automatic Persistence**: Built images are stored in Docker's image store
2. **Sharing**: Push to registry with `docker push`
3. **Version Control**: Tag your layers
   ```bash
   docker tag claude-code:custom claude-code:custom-v1.0
   docker tag claude-code:custom claude-code:custom-latest
   ```

**Practical Workflow:**
```bash
# 1. We provide base image
docker pull claude-code:base  # or build locally

# 2. You create your custom Dockerfile
cat > Dockerfile.custom <<EOF
FROM claude-code:base
# Install your additional tools
RUN npm install -g your-favorite-tool
RUN pip install your-python-packages
EOF

# 3. Build your custom image (layers are saved automatically)
docker build -f Dockerfile.custom -t claude-code:mine .

# 4. Use your customized image
docker run -it claude-code:mine

# 5. Update your custom layer (base stays cached)
# Edit Dockerfile.custom...
docker build -f Dockerfile.custom -t claude-code:mine .
```

**Advantages of Layered Approach:**
- Changes to custom layer don't require rebuilding base
- Can version control your Dockerfile.custom
- Easy to share custom configurations with team
- Clear separation: base (provided) vs custom (yours)
- Docker automatically manages layer storage

### Option 3: Volume-based Persistence
- Store all customizations in mounted volumes
- `/home/claude/.local` for user installs
- `/opt/custom` for system-wide additions
- Configuration files in persistent volumes

## Security Considerations

### User Management
- Non-root user `claude` with sudo access
- UID/GID mapping to host user
- Capability restrictions where possible

### Network Security
- Optional network isolation
- Firewall rules for exposed ports
- No unnecessary services running

### File System
- Read-only root filesystem (with exceptions)
- Separate volumes for writable areas
- No access to host system directories except workspace

## Build Strategy

### Multi-stage Build
```dockerfile
# Stage 1: Build tools and compilers
FROM ubuntu:24.04 as builder
# Install build dependencies

# Stage 2: Runtime
FROM ubuntu:24.04
# Copy only necessary artifacts from builder
```

### Caching Strategy
- Leverage Docker build cache
- Separate layers for different tool categories
- Pin versions for reproducibility

## Container Lifecycle

### Initialization
1. Check/create required volumes
2. Initialize package caches
3. Verify tool installations
4. Set up user environment

### Running
```bash
# Development mode (interactive)
docker run -it --rm \
  -v $(pwd):/workspace \
  -v claude-home:/home/claude \
  --name claude-code \
  claude-code:latest

# Background mode (with tmux)
docker run -d \
  -v $(pwd):/workspace \
  -v claude-home:/home/claude \
  --name claude-code \
  claude-code:latest \
  tmux new-session -d -s main
```

### Customization Workflow
1. Start container
2. Install additional tools
3. Configure environment
4. Save state (commit/export)
5. Document changes

## Testing Requirements

### Validation Tests
- All LSPs responding correctly
- Jekyll builds successfully
- Playwright browsers launch
- Git operations work
- File permissions correct

### Performance Benchmarks
- Container startup time < 5 seconds
- Tool response times acceptable
- Memory usage within limits
- Disk space optimization

## Documentation Needs

### User Guide
- Quick start guide
- Common customization scenarios
- Troubleshooting guide
- Performance tuning

### Developer Guide
- Building from source
- Adding new tools
- Creating custom layers
- Contributing guidelines

## Design Decisions

1. **Base Image**: Ubuntu 24.04
   - Maximum compatibility with tools and packages
   - Well-documented and widely supported
   - Larger size is acceptable for full functionality

2. **Persistence Method**: Layered Dockerfile approach
   - Clean separation of concerns
   - Version control friendly
   - Easy to share and reproduce

3. **Size Optimization**: Full image (~10GB)
   - All tools pre-installed and ready
   - No runtime installation delays
   - Better offline capability

4. **Update Strategy**: Layered rebuilds
   - Base layer: Rarely updated (OS, core tools)
   - Tool layer: Monthly updates
   - Custom layer: User-specific changes

5. **GUI Support**: Yes, include X11 support
   - For Playwright headed mode
   - For GUI development tools
   - VNC/noVNC for remote access

## Next Steps

1. Review and refine requirements
2. Choose base image and persistence strategy
3. Create initial Dockerfile
4. Build and test basic functionality
5. Iterate based on testing
6. Document final solution
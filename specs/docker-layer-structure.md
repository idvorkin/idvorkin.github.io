# Docker Layer Structure for Claude Code Container

## Three-Layer Architecture

### Layer 1: Base OS and Core Tools (Dockerfile.base)
**Purpose**: Stable foundation, rarely changes
**Size**: ~3GB
**Contents**:
- Ubuntu 24.04 base
- System libraries and build tools
- Git, curl, wget, openssh
- Python 3.11+ and pip
- Node.js 20.x and npm
- Ruby 3.x and bundler
- Basic shell tools (bash, zsh, tmux)

### Layer 2: Development Tools (Dockerfile.tools)
**Purpose**: All development tools and LSPs
**Size**: ~5-6GB additional
**Contents**:
- All Language Servers (typescript-language-server, pylsp, rust-analyzer, etc.)
- Jekyll and plugins
- Playwright and browsers
- Code quality tools (prettier, eslint, black, ruff)
- Build tools (webpack, vite, just)
- Testing frameworks
- ripgrep, fd, bat, jq
- Pre-commit hooks

### Layer 3: Custom User Layer (Dockerfile.custom)
**Purpose**: Your personal customizations
**Size**: Variable
**Contents**:
- Personal tools and utilities
- Custom configurations
- Additional language support
- Project-specific dependencies

## How Layers Persist

### Automatic Persistence
When you build a Docker image, layers are automatically saved to your local Docker daemon:

```bash
# These commands save layers permanently to your system
docker build -f Dockerfile.base -t claude-code:base .
docker build -f Dockerfile.tools -t claude-code:tools .
docker build -f Dockerfile.custom -t claude-code:custom .
```

### Where Layers Are Stored
- **Linux**: `/var/lib/docker/overlay2/`
- **macOS**: Inside Docker Desktop's VM at `/var/lib/docker/`
- **Windows**: Inside WSL2 or Hyper-V VM

### Layer Caching Benefits
```bash
# First build - downloads and installs everything
docker build -f Dockerfile.custom -t my-image .
# Takes 20 minutes

# Second build with small change - reuses cached layers
# Edit Dockerfile.custom (only changing last line)
docker build -f Dockerfile.custom -t my-image .
# Takes 30 seconds - only rebuilds changed layer
```

## Example Implementation

### Dockerfile.base
```dockerfile
FROM ubuntu:24.04

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Base system updates and core tools
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    tmux \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Python 3.11
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create claude user
RUN useradd -m -s /bin/bash claude \
    && echo "claude ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER claude
WORKDIR /home/claude
```

### Dockerfile.tools
```dockerfile
FROM claude-code:base

USER root

# Install all LSPs
RUN npm install -g \
    typescript-language-server \
    vscode-langservers-extracted \
    yaml-language-server \
    && pip install --break-system-packages \
    python-lsp-server \
    pyright

# Install Jekyll
RUN apt-get update && apt-get install -y \
    ruby-full \
    && gem install jekyll bundler

# Install Playwright with dependencies
RUN npx playwright install --with-deps

# Install development tools
RUN npm install -g \
    prettier \
    eslint \
    && pip install --break-system-packages \
    black \
    ruff \
    pre-commit

USER claude
```

### Dockerfile.custom (Your Personal Layer)
```dockerfile
FROM claude-code:tools

USER claude

# Example: Add your favorite tools
RUN npm install -g \
    @biomejs/biome \
    serve

# Example: Add custom aliases and configs
COPY --chown=claude:claude my-configs/.zshrc /home/claude/.zshrc
COPY --chown=claude:claude my-configs/.tmux.conf /home/claude/.tmux.conf

# Example: Install project-specific tools
WORKDIR /workspace
COPY --chown=claude:claude package.json .
RUN npm install

# Set your preferred shell
SHELL ["/bin/zsh", "-c"]
CMD ["/bin/zsh"]
```

## Managing Your Custom Layer

### Version Control Your Customizations
```bash
# Create a git repo for your custom layer
mkdir claude-code-custom
cd claude-code-custom

# Add your Dockerfile.custom
cat > Dockerfile.custom <<'EOF'
FROM claude-code:tools
# Your customizations here
EOF

# Add any config files
mkdir configs
cp ~/.zshrc configs/

# Track in git
git init
git add .
git commit -m "My Claude Code customizations"
```

### Updating Your Custom Layer
```bash
# Edit Dockerfile.custom
vim Dockerfile.custom

# Rebuild (base and tools layers are cached)
docker build -f Dockerfile.custom -t claude-code:mine .

# Tag for versioning
docker tag claude-code:mine claude-code:mine-$(date +%Y%m%d)
```

### Sharing Layers
```bash
# Option 1: Share via Docker Hub
docker tag claude-code:mine yourusername/claude-code:custom
docker push yourusername/claude-code:custom

# Option 2: Export to file
docker save claude-code:mine | gzip > claude-code-mine.tar.gz

# Option 3: Share Dockerfile in git
git push origin main
# Others can: git clone && docker build -f Dockerfile.custom -t claude-code .
```

## Storage Management

### View Layer Sizes
```bash
docker history claude-code:custom
docker images --tree  # Docker 25.0+
```

### Clean Up Old Layers
```bash
# Remove unused layers
docker image prune

# Remove specific old versions
docker rmi claude-code:mine-20240101
```

### Backup Strategy
```bash
# Backup your custom Dockerfile and configs
tar -czf claude-custom-backup.tar.gz Dockerfile.custom configs/

# Export the built image (includes all layers)
docker save claude-code:mine | gzip > claude-code-full-backup.tar.gz
```

## Best Practices

1. **Keep base layer minimal** - Only OS and truly core tools
2. **Put frequently changing items last** - Maximizes cache reuse
3. **Combine RUN commands** - Reduces layer count
4. **Clean up in same layer** - `apt-get clean && rm -rf /var/lib/apt/lists/*`
5. **Use specific versions** - `node:20.11.0` instead of `node:20`
6. **Document your custom layer** - Comment why each tool is added
7. **Tag your builds** - Makes rollback easy
8. **Test incrementally** - Build and test each layer before adding the next

## Troubleshooting

### Layer Not Persisting?
- Check Docker daemon is running: `docker info`
- Check disk space: `docker system df`
- Verify image exists: `docker images | grep claude-code`

### Rebuilding Everything
```bash
# Force rebuild without cache
docker build --no-cache -f Dockerfile.base -t claude-code:base .

# Or just clear everything and start fresh
docker system prune -a
```

### Layer Too Large?
- Use multi-stage builds to exclude build artifacts
- Clear package manager caches in same RUN command
- Use `.dockerignore` to exclude unnecessary files
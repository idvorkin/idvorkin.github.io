# Claude Code Fast PR Container

A Docker container optimized for quickly spinning up isolated Claude Code environments for PR creation.

## Quick Start

### 1. Build the Image (one-time)

```bash
cd docker
make build
# or
docker build -f Dockerfile.fast -t claude-code:fast .
```

### 2. Set up Environment

```bash
cp .env.example .env
# Edit .env with your tokens:
# - GITHUB_TOKEN
# - ANTHROPIC_API_KEY
```

### 3. Start Working on a PR

```bash
# Option 1: Using make
make pr BRANCH=fix-login-bug TITLE="Fix login validation issue"

# Option 2: Using docker-compose
BRANCH=fix-login-bug PR_TITLE="Fix login validation issue" docker-compose run --rm quick-pr

# Option 3: Using the quick-claude script
./scripts/quick-claude.sh new fix-login-bug "Fix login validation issue"
```

## Common Workflows

### Interactive Shell
```bash
make shell
# or
docker-compose run --rm claude-pr
```

### Run Tests
```bash
make test
# or
docker-compose run --rm test
```

### Start Jekyll Server
```bash
make jekyll
# or
docker-compose run --rm --service-ports jekyll
```

### Run Claude Directly
```bash
docker-compose run --rm claude --help
```

## Features

- **Fast Startup**: 2-3 seconds with everything pre-installed
- **Automatic Branch Creation**: Creates and switches to feature branch
- **GitHub Integration**: Pre-configured with gh CLI
- **Development Tools**: All essential tools included
  - Git, GitHub CLI
  - Node.js, TypeScript, ESLint, Prettier
  - Python, Black, Ruff
  - Rust tools (ripgrep, fd, bat, eza)
  - Jekyll for blog development
- **Persistent Caches**: npm and cargo caches persist between runs
- **Settings Integration**: Mounts your ~/settings directory

## Advanced Usage

### Multiple Parallel PRs

```bash
# Terminal 1
make pr BRANCH=feature-1 TITLE="Add feature 1"

# Terminal 2  
make pr BRANCH=feature-2 TITLE="Add feature 2"

# List running containers
make list
```

### Custom Settings

Mount your settings directory for personalized configs:

```bash
docker run -it --rm \
  -v ~/settings:/home/claude/settings:ro \
  -v $(pwd):/workspace \
  claude-code:fast
```

### Install System-Wide Launcher

```bash
# Install the quick launcher
sudo cp scripts/quick-claude.sh /usr/local/bin/claude-docker
sudo chmod +x /usr/local/bin/claude-docker

# Now use from anywhere
cd ~/my-project
claude-docker new fix-bug "Fix the bug"
```

## Container Commands

Once inside the container:

```bash
# Git operations
git status
git add .
git commit -m "Fix: resolve login issue"
git push -u origin fix-login-bug

# Create PR
gh pr create --title "Fix login validation issue" --body "Fixes #123"

# Run project commands
just js-build
just js-validate
just fast-test
just jekyll-serve

# Use tools
rg "search term"       # ripgrep for fast searching
fd "*.ts"             # find files
bat file.ts           # view with syntax highlighting
eza -la               # better ls
```

## Performance

| Operation | Time |
|-----------|------|
| Image build (first time) | 5-10 min |
| Container start | 2-3s |
| Branch creation | <1s |
| PR creation | 2-3s |
| Test run | Depends on tests |

## Troubleshooting

### Container won't start
```bash
# Check image exists
docker images | grep claude-code

# Rebuild if needed
make build
```

### GitHub authentication fails
```bash
# Ensure token is set
echo $GITHUB_TOKEN

# Test in container
docker-compose run --rm shell
gh auth status
```

### Permission issues
```bash
# Fix SSH permissions
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/*.pub
```

### Clean up
```bash
# Remove stopped containers
make clean

# Remove image and rebuild
docker rmi claude-code:fast
make build
```

## Architecture

```
docker/
├── Dockerfile.fast       # Monolithic fast-start image
├── docker-compose.yml    # Service definitions
├── Makefile             # Convenience commands
├── .env.example         # Environment template
├── scripts/
│   ├── entrypoint.sh    # Container initialization
│   ├── create-pr.sh     # PR creation helper
│   └── quick-claude.sh  # System launcher script
└── README.md            # This file
```

## Tips

1. **Pre-build the image** during downtime for instant availability
2. **Use make commands** for common operations
3. **Keep .env updated** with your tokens
4. **Mount settings read-only** to prevent accidental changes
5. **Use persistent volumes** for cargo/npm caches
6. **Run multiple containers** for parallel work
7. **Tag your images** when they're working well

## Contributing

To add new tools to the image:

1. Edit `Dockerfile.fast`
2. Add tools in the appropriate RUN command
3. Rebuild: `make build`
4. Test: `make shell`
5. Document in this README
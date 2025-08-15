# Docker Development Environment

A streamlined 2-layer Docker setup for the blog with Jekyll, Playwright, and development tools pre-configured.

## Features

- 🚀 **Jekyll ready** - Works on first boot with `just jekyll-serve`
- 🎭 **Playwright installed** - E2E tests ready with `just e2e-test`
- 🛠️ **Development tools** - All tools from settings repo via Homebrew
- 📦 **Pre-cloned repos** - idvorkin.github.io and nlp ready to use
- 🤖 **Claude CLI support** - Automatically mounts local Claude if available
- 🔍 **Smart port finding** - Automatically finds free ports starting from 4000

## Quick Start

```bash
# Build the Docker images (one-time, ~5 min)
./build-minimal.sh

# Run interactive container
./run-docker.sh

# Run E2E tests
./run-e2e-tests.sh
```

## Inside the Container

Once inside the container:

```bash
# Start Jekyll server
cd idvorkin.github.io
just jekyll-serve   # or bundle exec jekyll serve --host 0.0.0.0

# Run E2E tests
just e2e-test

# Run unit tests
just fast-test

# Use Claude (if mounted from host)
claude

# Use your tools
bat file.ts         # view with syntax highlighting
eza -la            # better ls
rg "search term"   # ripgrep for fast searching
fd "*.ts"          # find files
```

## Architecture

The setup uses a 2-layer approach for fast rebuilds:

1. **Base layer** (`Dockerfile.1-base`) - Ubuntu 22.04 with Homebrew
2. **Main layer** (`Dockerfile.2-stable-minimal`) - Settings, tools, Jekyll, and Playwright

```
docker/
├── Dockerfile.1-base          # Base Ubuntu + Homebrew
├── Dockerfile.2-stable-minimal # Development environment
├── build-minimal.sh           # Build script
├── run-docker.sh             # Run with auto port finding
├── run-e2e-tests.sh          # E2E test runner
└── README.md                 # This file
```

## Port Configuration

The `run-docker.sh` script automatically finds free ports. If default ports are busy:

```
⚠ Using alternate ports:
  Jekyll: http://localhost:4003 (instead of 4000)
  LiveReload: 35730 (instead of 35729)
```

## Claude CLI Integration

Claude CLI is installed in the container and can use your host's credentials:

- Claude CLI (`@anthropic-ai/claude-code`) is pre-installed
- Credentials are mounted from host automatically:
  - `~/.config/claude` (Linux/default)
  - `~/Library/Application Support/claude` (macOS)

To use Claude in the container:
```bash
# Authenticate on your host first (one-time)
claude  # On host - login if needed

# Run the container - credentials are automatically mounted
./run-docker.sh

# Inside container, Claude uses your host's auth
claude  # Ready to use!
```

## Environment Details

### Installed via Homebrew
- Core tools: git, tmux, zsh, neovim
- Search tools: fzf, fd, ripgrep
- Development: gh, just, python3, node, ruby
- Better CLI: bat, eza, zoxide, starship
- Package managers: uv (Python), bundler (Ruby)

### Pre-configured
- Oh My Zsh with plugins
- Settings from github.com/idvorkin/settings
- Jekyll with all blog dependencies
- Playwright with Chromium for E2E tests
- Node.js packages for the blog

### Repositories
- `/home/developer/gits/idvorkin.github.io` - Blog repository
- `/home/developer/gits/nlp` - NLP repository

## Performance

| Operation | Time |
|-----------|------|
| Image build (first time) | ~5 min |
| Container start | 2-3s |
| Jekyll server start | 3-4s |
| E2E test run | 10-20s |

## Troubleshooting

### Port already in use
The script automatically finds free ports. If you need specific ports:
```bash
docker run -it --rm -p 5000:4000 claude-docker:minimal /home/linuxbrew/.linuxbrew/bin/zsh
```

### Claude not working
Ensure Claude is installed on your host:
```bash
which claude  # Should show path to Claude
```

### Jekyll not starting
```bash
# Inside container
cd idvorkin.github.io
bundle install  # If dependencies need updating
just jekyll-serve
```

### Permission issues
The container runs as user `developer` with sudo access:
```bash
sudo apt-get update  # Works without password
```

## Development Tips

### Fast Iteration Strategy

When experimenting with new tools or configurations:

1. **Create a test layer** to avoid rebuilding everything:
```dockerfile
# Dockerfile.3-test
FROM claude-docker:minimal
RUN # your experimental changes
```

2. **Build and test quickly**:
```bash
docker build -f Dockerfile.3-test -t claude-docker:test .
docker run --rm claude-docker:test # test your changes
```

3. **Once working**, merge changes back into the base layer (Dockerfile.2-stable-minimal)

This approach saves time by avoiding full rebuilds during experimentation.

## Advanced Usage

### Mount additional directories
```bash
docker run -it --rm \
  -v ~/my-project:/home/developer/my-project \
  -p 4000:4000 \
  claude-docker:minimal /home/linuxbrew/.linuxbrew/bin/zsh
```

### Run with GitHub token
```bash
export GITHUB_TOKEN=ghp_your_token_here
./run-docker.sh  # Automatically passes the token
```

### Rebuild from scratch
```bash
docker rmi claude-docker:minimal claude-docker:base
./build-minimal.sh
```

## Tips

1. **Pre-build the image** during downtime for instant availability
2. **Keep images updated** - Rebuild weekly for latest packages
3. **Use the run script** - It handles port conflicts automatically
4. **Mount your work** - Use volumes for active development
5. **Export GITHUB_TOKEN** - Enables gh CLI features

## Requirements

- Docker
- Git
- (Optional) Claude CLI for AI assistance
- (Optional) GitHub token for gh CLI commands
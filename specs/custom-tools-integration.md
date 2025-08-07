# Custom Tools Integration for Claude Code Container

## Overview
Integration strategy for your personal tools and configurations from `~/settings` into the Docker container.

## Your Tools Breakdown

### Core Development Tools (from brew_packages.sh)
- **Essential**: git, tmux, zsh, neovim
- **Rust tools**: zoxide, bat, eza, mcfly, dua, procs, htop, starship, yazi, television, bottom, ripgrep
- **File utilities**: fd, fzf, ag, ncdu, gdu, fselect
- **Git tools**: lazygit, tig, git-extras, git-delta, diff-so-fancy, gh (GitHub CLI)
- **Language servers**: lua-language-server (plus others from main spec)
- **Python tools**: python3, pipenv, pgcli, pipx, uv
- **Network tools**: mosh, autossh, nmap, curl, wget, httpie, xh
- **Media tools**: ffmpeg, imagemagick, yt-dlp, mpv, viu, timg
- **Documentation**: pandoc, glow, grip, markdownlint-cli
- **Container tools**: docker, docker-compose, lazydocker
- **Build tools**: just, npm, pre-commit
- **Data tools**: jq, yq, dasel, fx, pup
- **System monitoring**: btop, fastfetch, duf
- **Fun**: asciiquarium, cmatrix

### Python Tools (via uv/pipx)
- aider-chat (AI code assistant)
- ruff (linter)
- black (formatter)
- mypy (type checker)
- poetry (package manager)
- jupyterlab
- rich-cli
- pudb (debugger)
- httpx
- pre-commit

### Configuration Files (from bootstrap.sh)
- Git config with aliases and colors
- Vim/Neovim configurations
- Tmux configuration
- Shell includes (zsh_include.sh)
- Various tool configs (ranger, litecli, atuin, yazi, bat, etc.)

## Integration Approach

### 1. Settings Repository in Container

```dockerfile
# In Dockerfile.custom
FROM claude-code:tools

# Clone settings repo
RUN git clone https://github.com/idvorkin/settings /home/claude/settings

# Run bootstrap script (modified for container)
RUN cd /home/claude/settings && \
    ./bootstrap-container.sh

# Copy any local-only configs at build time
COPY --chown=claude:claude local-settings/ /home/claude/settings/local/
```

### 2. Modified Bootstrap Script for Container

Create `bootstrap-container.sh` in your settings repo:

```bash
#!/bin/bash
# Container-specific bootstrap script
# Based on bootstrap.sh but adapted for Docker environment

# Create necessary directories
mkdir -p ~/.config/{nvim,yazi,bat,carapace,bottom,ranger,litecli,atuin}
mkdir -p ~/.tmux/plugins
mkdir -p ~/.vim/bundle
mkdir -p ~/.ssh

# Clone plugin managers
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# Git configuration
git config --global user.email "idvorkin@gmail.com"
git config --global user.name "Igor Dvorkin"
git config --global push.default simple
git config --global push.autoSetupRemote 1
# ... (rest of git config)

# Create symlinks (container-safe paths)
ln -sf ~/settings/default_vimrc ~/.vimrc
ln -sf ~/settings/shared/gitconfig ~/.gitconfig
ln -sf ~/settings/shared/tigrc ~/.tigrc
ln -sf ~/settings/shared/.tmux.conf ~/.tmux.conf
ln -sf ~/settings/nvim ~/.config/nvim
ln -sf ~/settings/config/yazi ~/.config/yazi
ln -sf ~/settings/config/bat ~/.config/bat
ln -sf ~/settings/shared/ranger_rc.conf ~/.config/ranger/rc.conf
ln -sf ~/settings/shared/atuin.toml ~/.config/atuin/config.toml

# Zsh configuration
echo 'source ~/settings/shared/zsh_include.sh' >> ~/.zshrc
```

### 3. Tool Installation Strategy

#### Option A: Pre-install in Image Layers

```dockerfile
# Dockerfile.tools (extended)
FROM claude-code:base

# Install Rust (for cargo-based tools)
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y && \
    echo 'source $HOME/.cargo/env' >> ~/.bashrc

# Install brew packages (converted to apt where possible)
RUN apt-get update && apt-get install -y \
    # Direct apt equivalents
    tmux zsh neovim git tig mosh autossh \
    jq httpie wget curl nmap ncdu \
    ffmpeg imagemagick pandoc \
    # Python packages
    python3-pip pipx \
    && rm -rf /var/lib/apt/lists/*

# Install Rust tools via cargo
RUN source $HOME/.cargo/env && \
    cargo install \
    zoxide bat eza mcfly dua-cli procs \
    bottom ripgrep fd-find starship yazi-fm \
    git-delta lazygit

# Install Node tools
RUN npm install -g \
    @biomejs/biome \
    fkill-cli \
    serve

# Install Python tools via pipx/uv
RUN pipx install uv && \
    uv tool install aider-chat ruff black mypy poetry \
    jupyterlab rich-cli pudb httpx pre-commit

# GitHub CLI and extensions
RUN type -p curl >/dev/null || apt-get install curl -y && \
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
    dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
    chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
    tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
    apt-get update && apt-get install gh -y

RUN gh extension install github/gh-copilot
```

#### Option B: Install on First Run

```dockerfile
# Dockerfile.custom
FROM claude-code:tools

# Copy installation scripts
COPY --chown=claude:claude settings/shared/brew_packages.sh /home/claude/
COPY --chown=claude:claude settings/shared/install_tools.sh /home/claude/

# Install tools on container start (faster build, slower first run)
RUN echo "~/install_tools.sh" >> ~/.bashrc
```

### 4. Volume Mounts for Live Settings

```yaml
# docker-compose.yml
version: '3.8'
services:
  claude-code:
    image: claude-code:custom
    volumes:
      # Mount settings for live updates
      - ~/settings:/home/claude/settings-live:ro
      # Your workspace
      - ./:/workspace
      # Persistent home (for installed tools)
      - claude-home:/home/claude
      # Cache directories
      - cargo-cache:/home/claude/.cargo/registry
      - npm-cache:/home/claude/.npm
    environment:
      - SETTINGS_PATH=/home/claude/settings-live
```

### 5. Hybrid Approach (Recommended)

```dockerfile
# Dockerfile.base - Stable foundation
FROM ubuntu:24.04
# OS packages, Node, Python, Ruby

# Dockerfile.tools - Common development tools
FROM claude-code:base
# Install most tools from your brew_packages.sh
# Converted to apt/cargo/npm as appropriate

# Dockerfile.custom - Your personal layer
FROM claude-code:tools

# Clone settings (for configs)
RUN git clone https://github.com/idvorkin/settings /home/claude/settings

# Run container-safe bootstrap
COPY bootstrap-container.sh /tmp/
RUN bash /tmp/bootstrap-container.sh && rm /tmp/bootstrap-container.sh

# Optional: Add tools that change frequently or are personal
RUN uv tool install aider-chat  # Example of personal tool

# Set shell and working directory
SHELL ["/bin/zsh", "-c"]
WORKDIR /workspace
```

## Tool Installation Mapping

### Brew to Container Conversion

| Brew Package | Container Installation Method |
|-------------|------------------------------|
| git, tmux, zsh | `apt-get install` |
| bat, eza, ripgrep | `cargo install` |
| lazygit | Download binary from GitHub |
| gh | GitHub's official apt repo |
| fzf | Git clone + install script |
| docker | Docker-in-Docker or mount socket |
| pipx, uv | `pip install` |
| lua-language-server | Download binary or build |

### Special Considerations

1. **Homebrew in Container**: Not recommended (slow, macOS-centric)
2. **Cargo tools**: Pre-compile in image for speed
3. **Python tools**: Use uv for fast installs
4. **Config files**: Symlink from mounted settings
5. **Private keys**: Never in image, use volume mounts

## Build Commands

```bash
# Build all layers
docker build -f Dockerfile.base -t claude-code:base .
docker build -f Dockerfile.tools -t claude-code:tools .
docker build -f Dockerfile.custom -t claude-code:custom .

# Run with your settings
docker run -it \
  -v ~/settings:/home/claude/settings-live:ro \
  -v $(pwd):/workspace \
  -v ~/.ssh:/home/claude/.ssh:ro \
  claude-code:custom

# For GUI apps (like Playwright headed)
docker run -it \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  claude-code:custom
```

## Settings Repository Structure

Your settings repo should have:
```
settings/
├── bootstrap.sh              # Original Mac/Linux bootstrap
├── bootstrap-container.sh    # Container-specific bootstrap
├── shared/                   # Cross-platform configs
│   ├── gitconfig
│   ├── tmux.conf
│   └── zsh_include.sh
├── container/                # Container-only configs
│   └── install_tools.sh
└── mac/                      # Mac-specific (excluded from container)
```

## Next Steps

1. Create `bootstrap-container.sh` in your settings repo
2. Decide on tool installation strategy (pre-build vs runtime)
3. Create the three Dockerfiles
4. Test incremental builds
5. Document any container-specific tool configurations
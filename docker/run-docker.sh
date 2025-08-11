#!/bin/bash
# Enhanced Docker run script with credential injection

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Default values
IMAGE="${1:-claude-docker:minimal}"
COMMAND="${2:-/home/linuxbrew/.linuxbrew/bin/zsh}"

# Function to check prerequisites
check_prereqs() {
    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠ GITHUB_TOKEN not set${NC}"
        echo "  To enable GitHub CLI:"
        echo "  export GITHUB_TOKEN=ghp_your_token_here"
        echo ""
    else
        echo -e "${GREEN}✓ GITHUB_TOKEN is set${NC}"
    fi
    
    if [ ! -f ~/.gitconfig ]; then
        echo -e "${YELLOW}⚠ No .gitconfig found${NC}"
        echo "  Git operations may not work correctly"
    else
        echo -e "${GREEN}✓ Git config found${NC}"
    fi
    
    if [ ! -d ~/.ssh ]; then
        echo -e "${YELLOW}⚠ No .ssh directory found${NC}"
        echo "  SSH operations may not work"
    else
        echo -e "${GREEN}✓ SSH config found${NC}"
    fi
}

# Function to find free port
find_free_port() {
    local port=$1
    local max_port=$((port + 100))
    
    while [ $port -le $max_port ]; do
        if ! lsof -i :$port >/dev/null 2>&1; then
            echo $port
            return 0
        fi
        port=$((port + 1))
    done
    
    echo -e "${RED}❌ Could not find free port starting from $1${NC}" >&2
    return 1
}

# Function to run container
run_container() {
    echo -e "${GREEN}🐳 Starting Docker container: $IMAGE${NC}"
    echo ""
    
    # Find free ports
    JEKYLL_PORT=$(find_free_port 4000)
    LIVERELOAD_PORT=$(find_free_port 35729)
    
    if [ -z "$JEKYLL_PORT" ] || [ -z "$LIVERELOAD_PORT" ]; then
        echo -e "${RED}Failed to find free ports${NC}"
        exit 1
    fi
    
    if [ "$JEKYLL_PORT" != "4000" ] || [ "$LIVERELOAD_PORT" != "35729" ]; then
        echo -e "${YELLOW}⚠ Using alternate ports:${NC}"
        echo -e "  Jekyll: ${GREEN}http://localhost:$JEKYLL_PORT${NC} (instead of 4000)"
        echo -e "  LiveReload: ${GREEN}$LIVERELOAD_PORT${NC} (instead of 35729)"
        echo ""
    fi
    
    # Build docker run command
    DOCKER_CMD="docker run -it --rm"
    DOCKER_CMD="$DOCKER_CMD --name claude-dev-$(date +%s)"
    
    # Mount configs
    [ -f ~/.gitconfig ] && DOCKER_CMD="$DOCKER_CMD -v ~/.gitconfig:/home/developer/.gitconfig:ro"
    [ -d ~/.ssh ] && DOCKER_CMD="$DOCKER_CMD -v ~/.ssh:/home/developer/.ssh:ro"
    
    # Mount Claude credentials if available
    # For dev layer, we'll use the container's YOLO settings but still need auth
    if [ "$IMAGE" = "claude-docker:dev" ]; then
        # Dev layer uses YOLO mode - only mount auth file
        if [ -f ~/.config/claude/auth.json ]; then
            DOCKER_CMD="$DOCKER_CMD -v ~/.config/claude/auth.json:/home/developer/.config/claude/auth.json:ro"
            echo -e "${GREEN}✓ Claude auth mounted (YOLO mode)${NC}"
        elif [ -f "$HOME/Library/Application Support/claude/auth.json" ]; then
            DOCKER_CMD="$DOCKER_CMD -v \"$HOME/Library/Application Support/claude/auth.json\":/home/developer/.config/claude/auth.json:ro"
            echo -e "${GREEN}✓ Claude auth mounted from macOS (YOLO mode)${NC}"
        fi
    else
        # Standard layers - mount full config directory
        if [ -d ~/.config/claude ]; then
            DOCKER_CMD="$DOCKER_CMD -v ~/.config/claude:/home/developer/.config/claude"
            echo -e "${GREEN}✓ Claude credentials mounted from ~/.config/claude${NC}"
        elif [ -d "$HOME/Library/Application Support/claude" ]; then
            DOCKER_CMD="$DOCKER_CMD -v \"$HOME/Library/Application Support/claude\":/home/developer/.config/claude"
            echo -e "${GREEN}✓ Claude credentials mounted from macOS${NC}"
        else
            echo -e "${YELLOW}⚠ Claude credentials not found - will need to authenticate${NC}"
        fi
    fi
    
    # Environment variables
    [ -n "$GITHUB_TOKEN" ] && DOCKER_CMD="$DOCKER_CMD -e GITHUB_TOKEN"
    DOCKER_CMD="$DOCKER_CMD -e GIT_AUTHOR_NAME=\"$(git config user.name 2>/dev/null || echo 'Developer')\""
    DOCKER_CMD="$DOCKER_CMD -e GIT_AUTHOR_EMAIL=\"$(git config user.email 2>/dev/null || echo 'dev@example.com')\""
    
    # Add Playwright environment
    DOCKER_CMD="$DOCKER_CMD -e PLAYWRIGHT_BROWSERS_PATH=/home/developer/.cache/ms-playwright"
    
    # Port mappings for Jekyll with dynamic ports
    DOCKER_CMD="$DOCKER_CMD -p $JEKYLL_PORT:4000"  # Jekyll server port
    DOCKER_CMD="$DOCKER_CMD -p $LIVERELOAD_PORT:35729"  # LiveReload port for hot reload
    
    # Network mode for Playwright tests (comment out if using port mapping)
    # DOCKER_CMD="$DOCKER_CMD --network host"
    
    # Add the image and command
    DOCKER_CMD="$DOCKER_CMD $IMAGE $COMMAND"
    
    # Run it
    eval $DOCKER_CMD
}

# Function to run tests
run_tests() {
    echo -e "${GREEN}🧪 Running tests in container${NC}"
    docker run --rm \
        -v ~/.gitconfig:/home/developer/.gitconfig:ro \
        -e GITHUB_TOKEN="${GITHUB_TOKEN}" \
        --network host \
        $IMAGE bash -c "
            cd ~/repos/blog
            echo '📦 Installing dependencies...'
            npm install
            echo '🧪 Running unit tests...'
            npm test
            echo '🎭 Running Playwright tests...'
            npx playwright test --reporter=list
        "
}

# Main menu
case "${1:-run}" in
    check)
        check_prereqs
        ;;
    
    run)
        check_prereqs
        echo ""
        run_container
        ;;
    
    test)
        run_tests
        ;;
    
    shell)
        IMAGE="${2:-claude-docker:minimal}"
        COMMAND="/bin/bash"
        run_container
        ;;
    
    exec)
        shift
        IMAGE="claude-docker:dev"
        COMMAND="$@"
        run_container
        ;;
    
    help|*)
        echo "Docker Container Runner"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  check     - Check prerequisites (tokens, configs)"
        echo "  run       - Run interactive container (default)"
        echo "  test      - Run tests in container"
        echo "  shell     - Start bash shell in container"
        echo "  exec CMD  - Execute specific command in container"
        echo ""
        echo "Environment variables:"
        echo "  GITHUB_TOKEN - GitHub personal access token for gh CLI"
        echo ""
        echo "Examples:"
        echo "  $0 check                    # Check setup"
        echo "  $0 run                      # Run container"
        echo "  $0 test                     # Run all tests"
        echo "  $0 exec 'cd blog && npm test' # Run specific command"
        ;;
esac
#!/bin/bash

# Quick launcher script for Claude Code container
# Can be installed to /usr/local/bin for system-wide access

set -e

# Configuration
IMAGE_NAME="claude-code:fast"
CONTAINER_PREFIX="claude-pr"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Help function
show_help() {
    cat << EOF
Claude Code Container Launcher

Usage: $(basename $0) [COMMAND] [OPTIONS]

Commands:
    new [branch] [title]    Start new PR workflow
    shell                   Start interactive shell
    claude [args]           Run Claude directly
    test                    Run tests
    jekyll [port]           Start Jekyll server
    list                    List running containers
    stop [name]             Stop container
    clean                   Remove all stopped containers

Examples:
    $(basename $0) new fix-bug-123 "Fix login issue"
    $(basename $0) claude --help
    $(basename $0) shell
    $(basename $0) test

Environment Variables:
    GITHUB_TOKEN            GitHub authentication token
    ANTHROPIC_API_KEY       Claude API key
    GIT_USER_NAME          Git commit author name
    GIT_USER_EMAIL         Git commit author email

EOF
}

# Check if image exists
check_image() {
    if ! docker image inspect "$IMAGE_NAME" &>/dev/null; then
        echo -e "${RED}Error: Image $IMAGE_NAME not found${NC}"
        echo "Build it first with:"
        echo "  cd docker && docker build -f Dockerfile.fast -t $IMAGE_NAME ."
        exit 1
    fi
}

# Generate container name
get_container_name() {
    echo "${CONTAINER_PREFIX}-$(date +%s)"
}

# Main command handler
case "${1:-shell}" in
    new)
        check_image
        BRANCH=${2:-feature-$(date +%Y%m%d-%H%M%S)}
        PR_TITLE=${3:-"New feature"}
        
        echo -e "${GREEN}Starting new PR workflow${NC}"
        echo "Branch: $BRANCH"
        echo "Title: $PR_TITLE"
        
        docker run -it --rm \
            --name "$(get_container_name)" \
            -v "$(pwd):/workspace" \
            -v "$HOME/.ssh:/home/claude/.ssh:ro" \
            -v "$HOME/.gitconfig:/home/claude/.gitconfig:ro" \
            -v "$HOME/settings:/home/claude/settings:ro" \
            -e "GITHUB_TOKEN=${GITHUB_TOKEN}" \
            -e "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}" \
            -e "GIT_USER_NAME=${GIT_USER_NAME:-$(git config user.name)}" \
            -e "GIT_USER_EMAIL=${GIT_USER_EMAIL:-$(git config user.email)}" \
            -e "AUTO_BRANCH=$BRANCH" \
            -e "PR_TITLE=$PR_TITLE" \
            -e "AUTO_CREATE_BRANCH=true" \
            --network host \
            "$IMAGE_NAME"
        ;;
        
    shell)
        check_image
        echo -e "${GREEN}Starting interactive shell${NC}"
        
        docker run -it --rm \
            --name "$(get_container_name)" \
            -v "$(pwd):/workspace" \
            -v "$HOME/.ssh:/home/claude/.ssh:ro" \
            -v "$HOME/.gitconfig:/home/claude/.gitconfig:ro" \
            -v "$HOME/settings:/home/claude/settings:ro" \
            -e "GITHUB_TOKEN=${GITHUB_TOKEN}" \
            -e "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}" \
            --network host \
            "$IMAGE_NAME"
        ;;
        
    claude)
        check_image
        shift  # Remove 'claude' from arguments
        
        docker run -it --rm \
            --name "$(get_container_name)" \
            -v "$(pwd):/workspace" \
            -v "$HOME/.ssh:/home/claude/.ssh:ro" \
            -v "$HOME/.gitconfig:/home/claude/.gitconfig:ro" \
            -e "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}" \
            --network host \
            --entrypoint claude \
            "$IMAGE_NAME" "$@"
        ;;
        
    test)
        check_image
        echo -e "${GREEN}Running tests${NC}"
        
        docker run -it --rm \
            -v "$(pwd):/workspace" \
            --entrypoint /bin/bash \
            "$IMAGE_NAME" \
            -c "cd /workspace && just js-validate && just fast-test"
        ;;
        
    jekyll)
        check_image
        PORT=${2:-4000}
        echo -e "${GREEN}Starting Jekyll on port $PORT${NC}"
        
        docker run -it --rm \
            -v "$(pwd):/workspace" \
            -p "$PORT:$PORT" \
            --entrypoint /bin/bash \
            "$IMAGE_NAME" \
            -c "cd /workspace && just jekyll-serve $PORT"
        ;;
        
    list)
        echo -e "${GREEN}Running Claude containers:${NC}"
        docker ps --filter "name=$CONTAINER_PREFIX" --format "table {{.Names}}\t{{.Status}}\t{{.Command}}"
        ;;
        
    stop)
        CONTAINER=${2:-}
        if [ -z "$CONTAINER" ]; then
            echo -e "${RED}Error: Specify container name${NC}"
            docker ps --filter "name=$CONTAINER_PREFIX" --format "table {{.Names}}\t{{.Status}}"
        else
            echo -e "${YELLOW}Stopping $CONTAINER${NC}"
            docker stop "$CONTAINER"
            docker rm "$CONTAINER"
        fi
        ;;
        
    clean)
        echo -e "${YELLOW}Removing stopped Claude containers${NC}"
        docker container prune -f --filter "label!=keep"
        ;;
        
    help|--help|-h)
        show_help
        ;;
        
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
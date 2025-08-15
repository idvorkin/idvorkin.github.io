#!/bin/bash
# Enhanced Docker run script with container state management

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
DEFAULT_IMAGE="claude-docker:dev"
STATE_FILE="$HOME/.claude-docker-state.json"

# Ensure jq is installed for JSON handling
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq is required for container state management${NC}"
        echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi
}

# Initialize state file if it doesn't exist
init_state_file() {
    if [ ! -f "$STATE_FILE" ]; then
        echo '{"containers": []}' > "$STATE_FILE"
    fi
}

# Save container state
save_container_state() {
    local name=$1
    local image=$2
    local jekyll_port=$3
    local livereload_port=$4
    local created_at=$(date -Iseconds)
    
    local new_container=$(jq -n \
        --arg name "$name" \
        --arg image "$image" \
        --arg jekyll "$jekyll_port" \
        --arg livereload "$livereload_port" \
        --arg created "$created_at" \
        '{name: $name, image: $image, ports: {jekyll: $jekyll, livereload: $livereload}, created_at: $created, last_used: $created}')
    
    jq ".containers += [$new_container]" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
}

# Update last used timestamp
update_last_used() {
    local name=$1
    local now=$(date -Iseconds)
    
    jq "(.containers[] | select(.name == \"$name\") | .last_used) = \"$now\"" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
}

# Remove container from state
remove_container_state() {
    local name=$1
    jq ".containers = [.containers[] | select(.name != \"$name\")]" "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
}

# List existing containers
list_containers() {
    echo -e "${BLUE}📦 Existing Claude Docker Containers:${NC}"
    echo ""
    
    # Get running containers
    local running=$(docker ps --format "{{.Names}}" | grep "^claude-dev-" 2>/dev/null || true)
    
    # Read state file and display containers
    local count=$(jq '.containers | length' "$STATE_FILE")
    
    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}  No containers found${NC}"
        return 1
    fi
    
    local i=0
    while [ $i -lt $count ]; do
        local container=$(jq -r ".containers[$i]" "$STATE_FILE")
        local name=$(echo "$container" | jq -r '.name')
        local image=$(echo "$container" | jq -r '.image')
        local jekyll_port=$(echo "$container" | jq -r '.ports.jekyll')
        local livereload_port=$(echo "$container" | jq -r '.ports.livereload')
        local last_used=$(echo "$container" | jq -r '.last_used')
        
        # Check if container actually exists
        if docker ps -a --format "{{.Names}}" | grep -q "^$name$"; then
            # Check if running
            local status="${RED}stopped${NC}"
            if echo "$running" | grep -q "^$name$"; then
                status="${GREEN}running${NC}"
            fi
            
            echo -e "  ${GREEN}[$((i+1))]${NC} $name"
            echo -e "      Image: $image"
            echo -e "      Status: $status"
            echo -e "      Ports: Jekyll=${GREEN}$jekyll_port${NC}, LiveReload=${GREEN}$livereload_port${NC}"
            echo -e "      Last used: $(date -d "$last_used" '+%Y-%m-%d %H:%M' 2>/dev/null || date -r "$(date -j -f '%Y-%m-%dT%H:%M:%S' "$last_used" '+%s' 2>/dev/null)" '+%Y-%m-%d %H:%M' 2>/dev/null || echo "$last_used")"
            echo ""
        else
            # Container doesn't exist, remove from state
            remove_container_state "$name"
        fi
        
        i=$((i+1))
    done
    
    return 0
}

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

# Function to attach to existing container
attach_container() {
    local container_name=$1
    
    echo -e "${GREEN}🐳 Attaching to container: $container_name${NC}"
    
    # Update last used timestamp
    update_last_used "$container_name"
    
    # Check if container is running
    if ! docker ps --format "{{.Names}}" | grep -q "^$container_name$"; then
        echo -e "${YELLOW}⚠ Container is stopped, starting it...${NC}"
        docker start "$container_name"
        sleep 1
    fi
    
    # Get port info from state file
    local ports=$(jq -r ".containers[] | select(.name == \"$container_name\") | .ports" "$STATE_FILE")
    local jekyll_port=$(echo "$ports" | jq -r '.jekyll')
    local livereload_port=$(echo "$ports" | jq -r '.livereload')
    
    echo -e "${GREEN}✓ Container ports:${NC}"
    echo -e "  Jekyll: ${GREEN}http://localhost:$jekyll_port${NC}"
    echo -e "  LiveReload: ${GREEN}$livereload_port${NC}"
    echo ""
    
    # Attach to container with container name in environment and proper TERM
    docker exec -it \
        -e DOCKER_CONTAINER_NAME="$container_name" \
        -e TERM="${TERM:-xterm-256color}" \
        "$container_name" /home/linuxbrew/.linuxbrew/bin/zsh
}

# Function to create and run new container
run_new_container() {
    local IMAGE="${1:-$DEFAULT_IMAGE}"
    local COMMAND="${2:-/home/linuxbrew/.linuxbrew/bin/zsh}"
    
    echo -e "${GREEN}🐳 Creating new Docker container with image: $IMAGE${NC}"
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

    # Generate container name with timestamp
    CONTAINER_NAME="claude-dev-$(date +%s)"

    # Build docker run command (without --rm for persistence)
    DOCKER_CMD="docker run -it"
    DOCKER_CMD="$DOCKER_CMD --name $CONTAINER_NAME"

    # Mount configs
    [ -f ~/.gitconfig ] && DOCKER_CMD="$DOCKER_CMD -v ~/.gitconfig:/home/developer/.gitconfig:ro"
    [ -d ~/.ssh ] && DOCKER_CMD="$DOCKER_CMD -v ~/.ssh:/home/developer/.ssh:ro"

    # Mount Claude credentials with write access (Claude needs to update session files)
    if [ -d ~/.claude ]; then
        # Mount credentials directory and set environment variable
        DOCKER_CMD="$DOCKER_CMD -v ~/.claude:/claude"
        DOCKER_CMD="$DOCKER_CMD -e CLAUDE_CONFIG_DIR=/claude"
        echo -e "${GREEN}✓ Claude credentials mounted from ~/.claude${NC}"
    elif [ -d ~/.config/claude ]; then
        # Linux location
        DOCKER_CMD="$DOCKER_CMD -v ~/.config/claude:/claude"
        DOCKER_CMD="$DOCKER_CMD -e CLAUDE_CONFIG_DIR=/claude"
        echo -e "${GREEN}✓ Claude credentials mounted from ~/.config/claude${NC}"
    else
        echo -e "${YELLOW}⚠ Claude credentials not found${NC}"
        echo -e "  Run 'claude auth login' on host first"
        echo -e "  Checked: ~/.claude, ~/.config/claude"
    fi

    # Environment variables
    [ -n "$GITHUB_TOKEN" ] && DOCKER_CMD="$DOCKER_CMD -e GITHUB_TOKEN"
    DOCKER_CMD="$DOCKER_CMD -e GIT_AUTHOR_NAME=\"$(git config user.name 2>/dev/null || echo 'AI+idvorkin')\""
    DOCKER_CMD="$DOCKER_CMD -e GIT_AUTHOR_EMAIL=\"$(git config user.email 2>/dev/null || echo 'aitools-idvorkin@gmail.com')\""

    # Add Playwright environment
    DOCKER_CMD="$DOCKER_CMD -e PLAYWRIGHT_BROWSERS_PATH=/home/developer/.cache/ms-playwright"
    
    # Add container name to environment for prompt
    DOCKER_CMD="$DOCKER_CMD -e DOCKER_CONTAINER_NAME=$CONTAINER_NAME"
    
    # Set TERM for proper terminal support (tmux, vim, etc)
    DOCKER_CMD="$DOCKER_CMD -e TERM=${TERM:-xterm-256color}"

    # Port mappings for Jekyll with dynamic ports
    DOCKER_CMD="$DOCKER_CMD -p $JEKYLL_PORT:4000"  # Jekyll server port
    DOCKER_CMD="$DOCKER_CMD -p $LIVERELOAD_PORT:35729"  # LiveReload port for hot reload

    # Add the image and command
    DOCKER_CMD="$DOCKER_CMD $IMAGE $COMMAND"

    # Save container state
    save_container_state "$CONTAINER_NAME" "$IMAGE" "$JEKYLL_PORT" "$LIVERELOAD_PORT"

    echo -e "${GREEN}✓ Container name: $CONTAINER_NAME${NC}"
    echo ""

    # Run it
    eval $DOCKER_CMD
}

# Interactive menu for container selection
interactive_menu() {
    check_jq
    init_state_file
    
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}     Claude Docker Container Manager${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    
    # Check for existing containers
    local has_containers=false
    if list_containers; then
        has_containers=true
    fi
    
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}[N]${NC} Create new container"
    
    if [ "$has_containers" = true ]; then
        echo -e "${GREEN}[1-9]${NC} Attach to existing container (by number)"
        echo -e "${GREEN}[D]${NC} Delete a container"
    fi
    
    echo -e "${GREEN}[Q]${NC} Quit"
    echo ""
    
    read -p "Choose an option: " choice
    
    case "$choice" in
        [Nn])
            echo ""
            check_prereqs
            echo ""
            run_new_container
            ;;
        [Dd])
            if [ "$has_containers" = true ]; then
                echo ""
                read -p "Enter container number to delete: " del_num
                local container_name=$(jq -r ".containers[$((del_num-1))].name" "$STATE_FILE" 2>/dev/null)
                
                if [ -n "$container_name" ] && [ "$container_name" != "null" ]; then
                    echo -e "${YELLOW}⚠ Deleting container: $container_name${NC}"
                    docker rm -f "$container_name" 2>/dev/null || true
                    remove_container_state "$container_name"
                    echo -e "${GREEN}✓ Container deleted${NC}"
                else
                    echo -e "${RED}❌ Invalid container number${NC}"
                fi
            fi
            ;;
        [Qq])
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        [1-9])
            if [ "$has_containers" = true ]; then
                local container_name=$(jq -r ".containers[$((choice-1))].name" "$STATE_FILE" 2>/dev/null)
                
                if [ -n "$container_name" ] && [ "$container_name" != "null" ]; then
                    echo ""
                    attach_container "$container_name"
                else
                    echo -e "${RED}❌ Invalid container number${NC}"
                fi
            else
                echo -e "${RED}❌ Invalid option${NC}"
            fi
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            ;;
    esac
}

# Function to run tests
run_tests() {
    echo -e "${GREEN}🧪 Running tests in container${NC}"
    docker run --rm \
        -v ~/.gitconfig:/home/developer/.gitconfig:ro \
        -e GITHUB_TOKEN="${GITHUB_TOKEN}" \
        --network host \
        $DEFAULT_IMAGE bash -c "
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
case "${1:-interactive}" in
    check)
        check_prereqs
        ;;

    interactive)
        interactive_menu
        ;;

    run)
        check_prereqs
        echo ""
        run_new_container "${2:-$DEFAULT_IMAGE}" "${3:-/home/linuxbrew/.linuxbrew/bin/zsh}"
        ;;

    test)
        run_tests
        ;;

    shell)
        IMAGE="${2:-$DEFAULT_IMAGE}"
        COMMAND="/bin/bash"
        run_new_container "$IMAGE" "$COMMAND"
        ;;

    clean)
        echo -e "${YELLOW}⚠ Cleaning up all Claude Docker containers...${NC}"
        docker ps -a --format "{{.Names}}" | grep "^claude-dev-" | xargs -r docker rm -f
        echo '{"containers": []}' > "$STATE_FILE"
        echo -e "${GREEN}✓ Cleanup complete${NC}"
        ;;

    help|*)
        echo "Docker Container Manager"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  interactive - Interactive menu (default)"
        echo "  check       - Check prerequisites"
        echo "  run [image] - Create new container directly"
        echo "  test        - Run tests in container"
        echo "  shell       - Start bash shell in new container"
        echo "  clean       - Remove all Claude containers"
        echo ""
        echo "Environment variables:"
        echo "  GITHUB_TOKEN - GitHub personal access token for gh CLI"
        echo ""
        echo "State file: $STATE_FILE"
        ;;
esac
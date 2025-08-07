#!/bin/bash

# Build script for layered Docker images
# Builds each layer separately so you can resume if network fails

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to build a layer
build_layer() {
    local layer_num=$1
    local layer_name=$2
    local dockerfile=$3
    local tag_name="claude-code:layer-${layer_num}-${layer_name}"
    
    echo -e "${GREEN}Building Layer $layer_num: $layer_name${NC}"
    echo "Tag: $tag_name"
    
    if docker image inspect "$tag_name" &>/dev/null; then
        echo -e "${YELLOW}Layer $layer_num already exists, skipping...${NC}"
        return 0
    fi
    
    if docker build -f "$dockerfile" -t "$tag_name" .; then
        echo -e "${GREEN}✓ Layer $layer_num built successfully${NC}"
        return 0
    else
        echo -e "${RED}✗ Layer $layer_num failed to build${NC}"
        return 1
    fi
}

# Function to check progress
check_progress() {
    echo -e "${GREEN}Checking build progress...${NC}"
    echo "Existing layers:"
    docker images | grep "claude-code:layer" || echo "No layers built yet"
}

# Main build sequence
main() {
    cd "$(dirname "$0")"
    
    case "${1:-all}" in
        check)
            check_progress
            ;;
        
        1|base)
            build_layer "01" "base" "Dockerfile.01-base"
            ;;
        
        2|git)
            build_layer "02" "git" "Dockerfile.02-git"
            ;;
        
        3|dev)
            build_layer "03" "dev" "Dockerfile.03-dev"
            ;;
        
        4|nodejs)
            build_layer "04" "nodejs" "Dockerfile.04-nodejs"
            ;;
        
        5|python)
            build_layer "05" "python" "Dockerfile.05-python"
            ;;
        
        6|jekyll)
            build_layer "06" "jekyll" "Dockerfile.06-jekyll"
            ;;
        
        7|rust)
            echo -e "${YELLOW}Layer 7 (Rust) is optional and slow. Skip with: $0 8${NC}"
            build_layer "07" "rust" "Dockerfile.07-rust"
            ;;
        
        8|extras)
            # Check if we should skip rust
            if [ "$2" = "skip-rust" ]; then
                echo -e "${YELLOW}Skipping Rust, building extras on top of Jekyll layer${NC}"
                sed 's/FROM claude-code:layer-07-rust/FROM claude-code:layer-06-jekyll/' \
                    Dockerfile.08-extras > Dockerfile.08-extras.tmp
                build_layer "08" "extras" "Dockerfile.08-extras.tmp"
                rm Dockerfile.08-extras.tmp
            else
                build_layer "08" "extras" "Dockerfile.08-extras"
            fi
            ;;
        
        final)
            echo -e "${GREEN}Building final image...${NC}"
            docker build -f Dockerfile.final -t claude-code:fast .
            echo -e "${GREEN}✓ Final image built: claude-code:fast${NC}"
            ;;
        
        all)
            echo -e "${GREEN}Building all layers sequentially...${NC}"
            build_layer "01" "base" "Dockerfile.01-base" && \
            build_layer "02" "git" "Dockerfile.02-git" && \
            build_layer "03" "dev" "Dockerfile.03-dev" && \
            build_layer "04" "nodejs" "Dockerfile.04-nodejs" && \
            build_layer "05" "python" "Dockerfile.05-python" && \
            build_layer "06" "jekyll" "Dockerfile.06-jekyll" && \
            build_layer "07" "rust" "Dockerfile.07-rust" && \
            build_layer "08" "extras" "Dockerfile.08-extras" && \
            docker build -f Dockerfile.final -t claude-code:fast .
            echo -e "${GREEN}✓ All layers built successfully!${NC}"
            ;;
        
        quick)
            echo -e "${GREEN}Building minimal set (skipping Rust and extras)...${NC}"
            build_layer "01" "base" "Dockerfile.01-base" && \
            build_layer "02" "git" "Dockerfile.02-git" && \
            build_layer "03" "dev" "Dockerfile.03-dev" && \
            build_layer "04" "nodejs" "Dockerfile.04-nodejs" && \
            build_layer "05" "python" "Dockerfile.05-python" && \
            build_layer "06" "jekyll" "Dockerfile.06-jekyll"
            
            # Build final without rust/extras
            cat > Dockerfile.final-quick <<EOF
FROM claude-code:layer-06-jekyll AS final
USER claude
WORKDIR /home/claude
RUN echo 'export PATH="\$HOME/.local/bin:\$PATH"' >> ~/.bashrc
RUN mkdir -p ~/.config ~/.ssh ~/.local/bin ~/scripts ~/.cache
COPY --chown=claude:claude scripts/ /home/claude/scripts/
RUN chmod +x /home/claude/scripts/*.sh
WORKDIR /workspace
ENTRYPOINT ["/home/claude/scripts/entrypoint.sh"]
CMD ["/bin/bash"]
EOF
            docker build -f Dockerfile.final-quick -t claude-code:quick .
            rm Dockerfile.final-quick
            echo -e "${GREEN}✓ Quick build complete: claude-code:quick${NC}"
            ;;
        
        clean)
            echo -e "${YELLOW}Removing all claude-code layers...${NC}"
            docker images | grep "claude-code:layer" | awk '{print $3}' | xargs -r docker rmi
            echo -e "${GREEN}✓ Cleanup complete${NC}"
            ;;
        
        help|*)
            cat <<EOF
Layer Build Script for Claude Code Container

Usage: $0 [command]

Commands:
    check       Check which layers are built
    1|base      Build layer 1 (base OS)
    2|git       Build layer 2 (git tools)
    3|dev       Build layer 3 (dev tools)
    4|nodejs    Build layer 4 (Node.js)
    5|python    Build layer 5 (Python)
    6|jekyll    Build layer 6 (Ruby/Jekyll)
    7|rust      Build layer 7 (Rust - optional, slow)
    8|extras    Build layer 8 (extra tools)
    final       Build final image from all layers
    all         Build all layers in sequence
    quick       Build minimal set (no Rust/extras)
    clean       Remove all layer images

Examples:
    $0 check           # See what's built
    $0 1               # Build just base layer
    $0 quick           # Build minimal working image
    $0 8 skip-rust     # Build extras without Rust
    $0 final           # Assemble final image

Tips:
    - Build one layer at a time on slow networks
    - Layers are cached, so you can resume after failures
    - Use 'quick' for a minimal but functional image
    - Skip layer 7 (Rust) if network is very slow
EOF
            ;;
    esac
}

main "$@"
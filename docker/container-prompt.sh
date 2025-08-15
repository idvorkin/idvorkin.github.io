#!/bin/bash
# Container prompt setup script
# This script configures the shell prompt to include the Docker container name

# Check if we're in a Docker container with a name set
if [ -n "$DOCKER_CONTAINER_NAME" ]; then
    # For bash
    if [ -n "$BASH_VERSION" ]; then
        export PS1="🐳[$DOCKER_CONTAINER_NAME] $PS1"
    fi
    
    # For zsh with starship
    if [ -n "$ZSH_VERSION" ]; then
        # If starship is installed, configure it to show container name
        if command -v starship &> /dev/null; then
            # Create a custom starship module for container name
            export STARSHIP_CONFIG_DIR="${STARSHIP_CONFIG_DIR:-$HOME/.config}"
            mkdir -p "$STARSHIP_CONFIG_DIR"
            
            # Check if starship.toml exists
            if [ -f "$STARSHIP_CONFIG_DIR/starship.toml" ]; then
                # Add container module if not already present
                if ! grep -q "container_name" "$STARSHIP_CONFIG_DIR/starship.toml"; then
                    cat >> "$STARSHIP_CONFIG_DIR/starship.toml" << 'EOF'

# Docker container name display
[env_var.DOCKER_CONTAINER]
symbol = "🐳 "
variable = "DOCKER_CONTAINER_NAME"
default = ""
format = '[$symbol$env_value]($style) '
style = "blue bold"
EOF
                fi
            else
                # Create new starship config with container name
                cat > "$STARSHIP_CONFIG_DIR/starship.toml" << 'EOF'
# Docker container name at the beginning of the prompt
format = """
${env_var.DOCKER_CONTAINER}\
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$character"""

[env_var.DOCKER_CONTAINER]
symbol = "🐳 "
variable = "DOCKER_CONTAINER_NAME"
default = ""
format = '[$symbol$env_value]($style) '
style = "blue bold"

[directory]
truncation_length = 3
truncate_to_repo = true

[git_branch]
symbol = " "

[character]
success_symbol = "[➜](bold green)"
error_symbol = "[➜](bold red)"
EOF
            fi
        else
            # Fallback for zsh without starship
            export PS1="🐳[$DOCKER_CONTAINER_NAME] $PS1"
        fi
    fi
    
    # Export for child processes
    export DOCKER_CONTAINER_DISPLAY="🐳 $DOCKER_CONTAINER_NAME"
fi
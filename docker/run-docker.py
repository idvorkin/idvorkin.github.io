#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "typer",
#     "rich",
#     "docker",
# ]
# ///

"""
Docker Container Manager for Claude Development Environment

This script manages Docker containers for the Claude development environment,
providing an interactive menu to create, attach, and manage containers with
proper state persistence.
"""

import json
import os
import re
import socket
import stat
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Tuple

import docker
import typer
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, IntPrompt, Confirm
from rich.table import Table
from rich.text import Text
from docker.errors import NotFound, APIError

app = typer.Typer(
    help="Claude Docker Container Manager",
    no_args_is_help=False,
    add_completion=False
)
console = Console()

DEFAULT_IMAGE = "claude-docker:dev"
STATE_FILE = Path.home() / ".claude-docker-state.json"
DOCKER_DIR = Path(__file__).parent.absolute()
PORT_SEARCH_RANGE = 100
DEFAULT_JEKYLL_PORT = 4000
DEFAULT_LIVERELOAD_PORT = 35729
CONTAINER_NAME_PATTERN = re.compile(r'^claude-dev-\d+$')


class ContainerState:
    """Manages container state persistence"""
    
    def __init__(self, state_file: Path = STATE_FILE):
        self.state_file = state_file
        self.state = self._load_state()
    
    def _load_state(self) -> Dict:
        """Load state from file or create new"""
        if self.state_file.exists():
            try:
                with open(self.state_file) as f:
                    return json.load(f)
            except json.JSONDecodeError:
                console.print("[yellow]⚠ Invalid state file, creating new one[/yellow]")
        return {"containers": []}
    
    def save(self):
        """Save state to file with proper permissions"""
        with open(self.state_file, 'w') as f:
            json.dump(self.state, f, indent=2)
        # Set restrictive permissions (owner read/write only)
        self.state_file.chmod(stat.S_IRUSR | stat.S_IWUSR)
    
    def add_container(self, name: str, image: str, jekyll_port: int, livereload_port: int):
        """Add a new container to state"""
        container = {
            "name": name,
            "image": image,
            "ports": {
                "jekyll": jekyll_port,
                "livereload": livereload_port
            },
            "created_at": datetime.now().isoformat(),
            "last_used": datetime.now().isoformat()
        }
        self.state["containers"].append(container)
        self.save()
    
    def update_last_used(self, name: str):
        """Update last used timestamp for container"""
        for container in self.state["containers"]:
            if container["name"] == name:
                container["last_used"] = datetime.now().isoformat()
                self.save()
                break
    
    def remove_container(self, name: str):
        """Remove container from state"""
        self.state["containers"] = [
            c for c in self.state["containers"] if c["name"] != name
        ]
        self.save()
    
    def get_container(self, name: str) -> Optional[Dict]:
        """Get container info by name"""
        for container in self.state["containers"]:
            if container["name"] == name:
                return container
        return None
    
    def list_containers(self) -> List[Dict]:
        """Get all containers"""
        return self.state["containers"]


class DockerManager:
    """Manages Docker operations"""
    
    def __init__(self):
        try:
            self.client = docker.from_env()
        except docker.errors.DockerException as e:
            console.print(f"[red]❌ Docker not available: {e}[/red]")
            sys.exit(1)
        self.state = ContainerState()
    
    def find_free_port(self, start_port: int) -> Optional[int]:
        """Find a free port starting from start_port"""
        for port in range(start_port, start_port + PORT_SEARCH_RANGE):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(('', port))
                    return port
                except OSError:
                    continue
        return None
    
    def get_container_status(self, name: str) -> str:
        """Get container status (running/stopped/not found)"""
        try:
            container = self.client.containers.get(name)
            return container.status
        except NotFound:
            return "not found"
    
    def build_volume_mounts(self) -> Dict[str, Dict]:
        """Build volume mount configuration"""
        mounts = {}
        
        # Git config
        gitconfig = (Path.home() / ".gitconfig").resolve()
        if gitconfig.exists() and gitconfig.is_file():
            mounts[str(gitconfig)] = {
                "bind": "/home/developer/.gitconfig",
                "mode": "ro"
            }
        
        # SSH config
        ssh_dir = (Path.home() / ".ssh").resolve()
        if ssh_dir.exists() and ssh_dir.is_dir():
            mounts[str(ssh_dir)] = {
                "bind": "/home/developer/.ssh",
                "mode": "ro"
            }
        
        # Docker directory (read-only)
        mounts[str(DOCKER_DIR)] = {
            "bind": "/ro_host_docker",
            "mode": "ro"
        }
        
        # Claude credentials
        claude_dirs = [
            Path.home() / ".claude",
            Path.home() / ".config" / "claude"
        ]
        for claude_dir in claude_dirs:
            if claude_dir.exists():
                mounts[str(claude_dir)] = {
                    "bind": "/claude",
                    "mode": "rw"
                }
                break
        
        return mounts
    
    def build_environment(self, container_name: str) -> Dict[str, str]:
        """Build environment variables"""
        env = {}
        
        # Claude config
        claude_dirs = [Path.home() / ".claude", Path.home() / ".config" / "claude"]
        if any(d.exists() for d in claude_dirs):
            env["CLAUDE_CONFIG_DIR"] = "/claude"
        
        # GitHub token
        if github_token := os.environ.get("GITHUB_TOKEN"):
            # Basic validation for GitHub token format
            if re.match(r'^(gh[ps]_[a-zA-Z0-9]{36,}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})$', github_token):
                env["GITHUB_TOKEN"] = github_token
        
        # Git config
        try:
            git_name = subprocess.run(
                ["git", "config", "user.name"],
                capture_output=True, text=True, check=False
            ).stdout.strip() or "AI+idvorkin"
            git_email = subprocess.run(
                ["git", "config", "user.email"],
                capture_output=True, text=True, check=False
            ).stdout.strip() or "aitools-idvorkin@gmail.com"
        except (subprocess.SubprocessError, OSError):
            git_name = "AI+idvorkin"
            git_email = "aitools-idvorkin@gmail.com"
        
        env["GIT_AUTHOR_NAME"] = git_name
        env["GIT_AUTHOR_EMAIL"] = git_email
        
        # Playwright
        env["PLAYWRIGHT_BROWSERS_PATH"] = "/home/developer/.cache/ms-playwright"
        
        # Container name for prompt
        env["DOCKER_CONTAINER_NAME"] = container_name
        
        # Terminal
        env["TERM"] = os.environ.get("TERM", "xterm-256color")
        
        return env
    
    def list_containers(self):
        """List all containers with their status"""
        containers = self.state.list_containers()
        
        if not containers:
            console.print("[yellow]No containers found[/yellow]")
            return
        
        # Clean up state for non-existent containers
        for container in containers[:]:
            status = self.get_container_status(container["name"])
            if status == "not found":
                self.state.remove_container(container["name"])
                containers.remove(container)
        
        if not containers:
            console.print("[yellow]No containers found (cleaned up stale entries)[/yellow]")
            return
        
        table = Table(title="Claude Docker Containers", show_header=True, header_style="bold cyan")
        table.add_column("#", style="green", width=3)
        table.add_column("Name", style="cyan")
        table.add_column("Status", justify="center")
        table.add_column("Jekyll Port", style="green")
        table.add_column("LiveReload Port", style="green")
        table.add_column("Last Used")
        
        for i, container in enumerate(containers, 1):
            status = self.get_container_status(container["name"])
            status_style = "green" if status == "running" else "red" if status == "exited" else "yellow"
            
            try:
                last_used = datetime.fromisoformat(container["last_used"]).strftime("%Y-%m-%d %H:%M")
            except (ValueError, KeyError):
                last_used = "Unknown"
            
            table.add_row(
                str(i),
                container["name"],
                f"[{status_style}]{status}[/{status_style}]",
                str(container["ports"]["jekyll"]),
                str(container["ports"]["livereload"]),
                last_used
            )
        
        console.print(table)
    
    def attach_container(self, container_name: str):
        """Attach to an existing container"""
        # Validate container name format
        if not CONTAINER_NAME_PATTERN.match(container_name):
            console.print(f"[red]❌ Invalid container name format: {container_name}[/red]")
            return
        
        container_info = self.state.get_container(container_name)
        if not container_info:
            console.print(f"[red]❌ Container {container_name} not found in state[/red]")
            return
        
        try:
            container = self.client.containers.get(container_name)
            
            # Start if stopped
            if container.status != "running":
                console.print(f"[yellow]⚠ Container is stopped, starting it...[/yellow]")
                container.start()
            
            # Update last used
            self.state.update_last_used(container_name)
            
            # Display port info
            jekyll_port = container_info["ports"]["jekyll"]
            livereload_port = container_info["ports"]["livereload"]
            
            console.print(Panel(
                f"[green]Jekyll:[/green] http://localhost:{jekyll_port}\n"
                f"[green]LiveReload:[/green] {livereload_port}",
                title="Container Ports",
                border_style="green"
            ))
            
            # Attach to container
            console.print(f"\n[green]🐳 Attaching to container: {container_name}[/green]\n")
            
            # Use subprocess for interactive shell
            subprocess.run([
                "docker", "exec", "-it",
                "-e", f"DOCKER_CONTAINER_NAME={container_name}",
                "-e", f"TERM={os.environ.get('TERM', 'xterm-256color')}",
                container_name,
                "/home/linuxbrew/.linuxbrew/bin/zsh"
            ])
            
        except NotFound:
            console.print(f"[red]❌ Container {container_name} not found[/red]")
            self.state.remove_container(container_name)
        except APIError as e:
            console.print(f"[red]❌ Docker API error: {e}[/red]")
    
    def create_container(self, image: str = DEFAULT_IMAGE):
        """Create and run a new container"""
        console.print(f"[green]🐳 Creating new Docker container with image: {image}[/green]\n")
        
        # Find free ports
        jekyll_port = self.find_free_port(DEFAULT_JEKYLL_PORT)
        livereload_port = self.find_free_port(DEFAULT_LIVERELOAD_PORT)
        
        if not jekyll_port or not livereload_port:
            console.print("[red]❌ Failed to find free ports[/red]")
            return
        
        if jekyll_port != DEFAULT_JEKYLL_PORT or livereload_port != DEFAULT_LIVERELOAD_PORT:
            console.print(Panel(
                f"[yellow]Using alternate ports:[/yellow]\n"
                f"Jekyll: [green]{jekyll_port}[/green] (instead of 4000)\n"
                f"LiveReload: [green]{livereload_port}[/green] (instead of 35729)",
                border_style="yellow"
            ))
        
        # Generate container name
        container_name = f"claude-dev-{int(datetime.now().timestamp())}"
        
        # Build configuration
        volumes = self.build_volume_mounts()
        environment = self.build_environment(container_name)
        
        # Display mount status
        mount_info = []
        if str(DOCKER_DIR) in volumes:
            mount_info.append("[green]✓[/green] Docker directory mounted at /ro_host_docker")
        
        claude_mounted = False
        for path in volumes:
            if "/claude" in volumes[path]["bind"]:
                mount_info.append(f"[green]✓[/green] Claude credentials mounted from {path}")
                claude_mounted = True
                break
        
        if not claude_mounted:
            mount_info.append("[yellow]⚠[/yellow] Claude credentials not found")
            mount_info.append("  Run 'claude auth login' on host first")
        
        if "GITHUB_TOKEN" in environment:
            mount_info.append("[green]✓[/green] GitHub token configured")
        
        console.print(Panel("\n".join(mount_info), title="Configuration", border_style="green"))
        
        # Save container state
        self.state.add_container(container_name, image, jekyll_port, livereload_port)
        
        console.print(f"\n[green]✓ Container name: {container_name}[/green]\n")
        
        # Run container using subprocess for interactive shell
        cmd = [
            "docker", "run", "-it",
            "--name", container_name
        ]
        
        # Add volumes
        for host_path, mount_config in volumes.items():
            cmd.extend(["-v", f"{host_path}:{mount_config['bind']}:{mount_config['mode']}"])
        
        # Add environment variables
        for key, value in environment.items():
            cmd.extend(["-e", f"{key}={value}"])
        
        # Add port mappings
        cmd.extend([
            "-p", f"{jekyll_port}:4000",
            "-p", f"{livereload_port}:35729"
        ])
        
        # Add image and command
        cmd.extend([image, "/home/linuxbrew/.linuxbrew/bin/zsh"])
        
        # Run the container
        subprocess.run(cmd)
    
    def delete_container(self, container_name: str):
        """Delete a container"""
        try:
            container = self.client.containers.get(container_name)
            container.remove(force=True)
            self.state.remove_container(container_name)
            console.print(f"[green]✓ Container {container_name} deleted[/green]")
        except NotFound:
            self.state.remove_container(container_name)
            console.print(f"[yellow]Container {container_name} not found, removed from state[/yellow]")
        except APIError as e:
            console.print(f"[red]❌ Failed to delete container: {e}[/red]")


@app.command()
def interactive():
    """Interactive menu for container management (default)"""
    manager = DockerManager()
    
    console.print(Panel(
        "[bold cyan]Claude Docker Container Manager[/bold cyan]",
        expand=False,
        border_style="cyan"
    ))
    
    while True:
        console.print("\n")
        manager.list_containers()
        console.print("\n")
        
        console.print("[green][N][/green] Create new container")
        console.print("[green][A][/green] Attach to container by number")
        console.print("[green][D][/green] Delete container")
        console.print("[green][R][/green] Refresh list")
        console.print("[green][Q][/green] Quit")
        console.print()
        
        choice = Prompt.ask("Choose an option", default="q").lower()
        
        if choice == 'n':
            manager.create_container()
            break
        elif choice == 'a':
            containers = manager.state.list_containers()
            if containers:
                num = IntPrompt.ask(
                    "Enter container number",
                    default=1,
                    choices=[str(i) for i in range(1, len(containers) + 1)]
                )
                if 1 <= num <= len(containers):
                    manager.attach_container(containers[num - 1]["name"])
                    break
                else:
                    console.print("[red]Invalid container number[/red]")
            else:
                console.print("[yellow]No containers available[/yellow]")
        elif choice == 'd':
            containers = manager.state.list_containers()
            if containers:
                num = IntPrompt.ask(
                    "Enter container number to delete",
                    default=1,
                    choices=[str(i) for i in range(1, len(containers) + 1)]
                )
                if 1 <= num <= len(containers):
                    if Confirm.ask(f"Delete container {containers[num - 1]['name']}?"):
                        manager.delete_container(containers[num - 1]["name"])
                else:
                    console.print("[red]Invalid container number[/red]")
            else:
                console.print("[yellow]No containers available[/yellow]")
        elif choice == 'r':
            continue
        elif choice == 'q':
            console.print("[green]Goodbye![/green]")
            break
        else:
            console.print("[red]Invalid option[/red]")


@app.command()
def list():
    """List all containers"""
    manager = DockerManager()
    manager.list_containers()


@app.command()
def create(
    image: str = typer.Argument(DEFAULT_IMAGE, help="Docker image to use")
):
    """Create a new container"""
    manager = DockerManager()
    manager.create_container(image)


@app.command()
def attach(
    name: str = typer.Argument(..., help="Container name to attach to")
):
    """Attach to an existing container"""
    manager = DockerManager()
    manager.attach_container(name)


@app.command()
def delete(
    name: str = typer.Argument(..., help="Container name to delete")
):
    """Delete a container"""
    manager = DockerManager()
    if Confirm.ask(f"Delete container {name}?"):
        manager.delete_container(name)


@app.command()
def clean():
    """Remove all Claude Docker containers"""
    if not Confirm.ask("Remove ALL Claude Docker containers?", default=False):
        return
    
    manager = DockerManager()
    containers = manager.state.list_containers()
    
    for container in containers:
        console.print(f"Deleting {container['name']}...")
        manager.delete_container(container["name"])
    
    console.print("[green]✓ Cleanup complete[/green]")


@app.command()
def test():
    """Run tests in a new container"""
    console.print("[green]🧪 Running tests in container[/green]\n")
    
    cmd = [
        "docker", "run", "--rm",
        "-v", f"{Path.home() / '.gitconfig'}:/home/developer/.gitconfig:ro",
        "-e", f"GITHUB_TOKEN={os.environ.get('GITHUB_TOKEN', '')}",
        "--network", "host",
        DEFAULT_IMAGE,
        "bash", "-c",
        """
        cd ~/repos/blog
        echo '📦 Installing dependencies...'
        npm install
        echo '🧪 Running unit tests...'
        npm test
        echo '🎭 Running Playwright tests...'
        npx playwright test --reporter=list
        """
    ]
    
    subprocess.run(cmd)


@app.command()
def shell(
    image: str = typer.Argument(DEFAULT_IMAGE, help="Docker image to use")
):
    """Start a bash shell in a new container"""
    manager = DockerManager()
    console.print(f"[green]🐚 Starting bash shell with image: {image}[/green]\n")
    
    # Create container but override command to use bash
    manager.create_container(image)


@app.command()
def check():
    """Check prerequisites"""
    checks = []
    
    # GitHub token
    if os.environ.get("GITHUB_TOKEN"):
        checks.append("[green]✓[/green] GitHub token is set")
    else:
        checks.append("[yellow]⚠[/yellow] GitHub token not set")
        checks.append("  Export GITHUB_TOKEN=ghp_your_token_here")
    
    # Git config
    if (Path.home() / ".gitconfig").exists():
        checks.append("[green]✓[/green] Git config found")
    else:
        checks.append("[yellow]⚠[/yellow] No .gitconfig found")
    
    # SSH
    if (Path.home() / ".ssh").exists():
        checks.append("[green]✓[/green] SSH config found")
    else:
        checks.append("[yellow]⚠[/yellow] No .ssh directory found")
    
    # Claude credentials
    claude_dirs = [Path.home() / ".claude", Path.home() / ".config" / "claude"]
    if any(d.exists() for d in claude_dirs):
        checks.append("[green]✓[/green] Claude credentials found")
    else:
        checks.append("[yellow]⚠[/yellow] Claude credentials not found")
        checks.append("  Run 'claude auth login' first")
    
    # Docker
    try:
        client = docker.from_env()
        version = client.version()
        checks.append(f"[green]✓[/green] Docker is running (version {version['Version']})")
    except:
        checks.append("[red]❌[/red] Docker is not running")
    
    console.print(Panel("\n".join(checks), title="Prerequisites Check", border_style="cyan"))


if __name__ == "__main__":
    # Default to interactive mode if no command given
    if len(sys.argv) == 1:
        interactive()
    else:
        app()
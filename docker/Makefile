# Makefile for Claude Code Docker operations

.PHONY: build run shell test clean help pr jekyll

# Default image name
IMAGE_NAME := claude-code:fast
CONTAINER_PREFIX := claude-pr

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show this help message
	@echo '$(GREEN)Claude Code Docker Commands$(NC)'
	@echo 'Usage: make [command]'
	@echo ''
	@echo 'Commands:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build the Docker image
	@echo '$(GREEN)Building Claude Code image...$(NC)'
	docker build -f Dockerfile.fast -t $(IMAGE_NAME) .
	@echo '$(GREEN)Build complete!$(NC)'

run: ## Run interactive shell
	docker-compose run --rm claude-pr

shell: run ## Alias for run

pr: ## Start new PR workflow (usage: make pr BRANCH=fix-123 TITLE="Fix bug")
	@echo '$(GREEN)Starting PR workflow...$(NC)'
	BRANCH=$(BRANCH) PR_TITLE="$(TITLE)" AUTO_CREATE_BRANCH=true docker-compose run --rm quick-pr

test: ## Run tests in container
	@echo '$(GREEN)Running tests...$(NC)'
	docker-compose run --rm test

jekyll: ## Start Jekyll server
	@echo '$(GREEN)Starting Jekyll server...$(NC)'
	docker-compose run --rm --service-ports jekyll

clean: ## Clean up containers and volumes
	@echo '$(YELLOW)Cleaning up...$(NC)'
	docker-compose down -v
	docker container prune -f
	@echo '$(GREEN)Cleanup complete!$(NC)'

list: ## List running containers
	@docker ps --filter "name=$(CONTAINER_PREFIX)" --format "table {{.Names}}\t{{.Status}}\t{{.Command}}"

logs: ## Show container logs
	docker-compose logs -f

stop: ## Stop all containers
	docker-compose stop

# Development commands
dev-build: ## Build with no cache
	docker build --no-cache -f Dockerfile.fast -t $(IMAGE_NAME) .

dev-shell: ## Shell with all volumes mounted
	docker run -it --rm \
		-v $$(pwd)/../:/workspace \
		-v $$HOME/.ssh:/home/claude/.ssh:ro \
		-v $$HOME/settings:/home/claude/settings:ro \
		--network host \
		$(IMAGE_NAME) /bin/bash

push: ## Push image to registry (set REGISTRY first)
	@if [ -z "$(REGISTRY)" ]; then \
		echo '$(YELLOW)Error: REGISTRY not set$(NC)'; \
		echo 'Usage: make push REGISTRY=docker.io/username'; \
		exit 1; \
	fi
	docker tag $(IMAGE_NAME) $(REGISTRY)/$(IMAGE_NAME)
	docker push $(REGISTRY)/$(IMAGE_NAME)
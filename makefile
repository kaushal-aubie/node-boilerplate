COMPOSE_FILE := docker/docker-compose.yml
COMPOSE := docker-compose -f $(COMPOSE_FILE)
IMAGE_NAME := node-app
DOCKERFILE := docker/Dockerfile

.DEFAULT_GOAL := help

.PHONY: help bootstrap install dev build check check-all clean \
	docker-up docker-down docker-build \
	db-reset db-migrate db-generate db-push seed

help: ## List Make targets
	@grep -E '^[a-zA-Z0-9_.-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

bootstrap: ## First-time setup (deps, husky, env file)
	pnpm run bootstrap

install: ## Install dependencies
	pnpm install

dev: ## Run API in dev (tsx watch)
	pnpm run dev

build: ## Compile TypeScript to dist/
	pnpm run build

format: ## Format code
	pnpm run format

check: ## Biome check
	pnpm run check

check-all: ## Lint, types, and build
	pnpm run check-all

clean: ## Remove dist/ build output
	rm -rf dist

docker-up: ## Start Compose (db, redis, …) detached
	$(COMPOSE) up -d

docker-down: ## Stop Compose and remove containers (keeps volumes)
	$(COMPOSE) down

docker-build: ## Build app image (Dockerfile)
	docker build -f $(DOCKERFILE) -t $(IMAGE_NAME) .

db-reset: ## Compose down -v, start stack, wait, run migrations
	$(COMPOSE) down -v
	$(COMPOSE) up -d
	sleep 3
	pnpm run db:migrate

db-migrate: ## Run Drizzle migrations
	pnpm run db:migrate

db-generate: ## drizzle-kit generate
	pnpm run db:generate

db-push: ## drizzle-kit push
	pnpm run db:push

seed: ## Dev seed (host)
	pnpm run seed

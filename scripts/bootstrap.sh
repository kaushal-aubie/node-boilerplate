#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

readonly A_RESET=$'\033[0m'
readonly A_BOLD=$'\033[1m'
readonly A_DIM=$'\033[2m'
readonly A_GREEN=$'\033[32m'
readonly A_CYAN=$'\033[36m'
readonly A_YELLOW=$'\033[33m'
readonly A_MAGENTA=$'\033[35m'
readonly A_RED=$'\033[31m'
readonly A_GRAY=$'\033[90m'

W=56
dashes() { printf '%*s' "$1" '' | tr ' ' '─'; }

banner() {
  local top bottom
  top="$(dashes "$W")"
  bottom="$(dashes "$W")"
  echo ""
  echo "${A_GRAY}╭${top}╮${A_RESET}"
  printf '%b\n' "${A_GRAY}│${A_RESET}  ${A_BOLD}${A_CYAN}Boilerplate bootstrap${A_RESET}"
  printf '%b\n' "${A_GRAY}│${A_RESET}  ${A_DIM}pnpm · Husky · local env${A_RESET}"
  echo "${A_GRAY}╰${bottom}╯${A_RESET}"
  echo ""
}

step_header() {
  local n=$1 title=$2
  echo ""
  echo "${A_MAGENTA}${A_BOLD}▸ Step ${n}:${A_RESET} ${A_BOLD}${title}${A_RESET}"
  echo "${A_GRAY}$(dashes "$W")${A_RESET}"
}

ok() { echo "${A_GREEN}  ✓${A_RESET} $*"; }
warn() { echo "${A_YELLOW}  !${A_RESET} $*"; }
fail() {
  echo "${A_RED}  ✗${A_RESET} $*"
  exit 1
}

note_husky() {
  if [[ ! -d "$ROOT/.git" ]]; then
    warn "Not a Git repo — Husky hooks apply after clone; run ${A_CYAN}pnpm install${A_RESET} again in a Git work tree."
    return
  fi
  ok "Husky: ${A_DIM}\`prepare\` ran with install (hooks in .husky/)${A_RESET}"
}

ensure_env() {
  local example="$ROOT/.env.example"
  local target="$ROOT/env/.env.development"
  if [[ ! -f "$example" ]]; then
    warn "'.env.example' not found — skipped env file"
    return
  fi
  mkdir -p "$ROOT/env"
  if [[ -f "$target" ]]; then
    warn "\`env/.env.development\` already exists — left unchanged"
    return
  fi
  cp "$example" "$target"
  ok "Created env/.env.development from .env.example"
}

if ! command -v pnpm >/dev/null 2>&1; then
  echo "${A_RED}pnpm is not available.${A_RESET}"
  echo "${A_DIM}Install:${A_RESET} ${A_CYAN}corepack enable && corepack prepare pnpm@latest --activate${A_RESET}"
  echo ""
  exit 1
fi

banner

step_header 1 "Install packages & Git hooks"
pnpm install || fail "\`pnpm install\` failed"
ok "\`pnpm install\` finished"
note_husky

step_header 2 "Local environment file"
ensure_env

echo ""
echo "${A_GREEN}${A_BOLD}Bootstrap complete.${A_RESET}"
echo "${A_DIM}Next:${A_RESET} ${A_CYAN}pnpm dev${A_RESET}  ${A_DIM}(ensure Postgres & Redis match env/)${A_RESET}"
echo ""

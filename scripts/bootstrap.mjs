#!/usr/bin/env node
/**
 * First-time / fresh clone setup: install deps (triggers Husky via `prepare`),
 * and create env/.env.development from .env.example.
 * Run: pnpm bootstrap  (requires pnpm on PATH — use `corepack enable` if needed)
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const a = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const W = 56;

function line(s = '') {
  process.stdout.write(`${s}\n`);
}

function banner() {
  line('');
  line(`${a.gray}╭${'─'.repeat(W)}╮${a.reset}`);
  line(`${a.gray}│${a.reset}  ${a.bold}${a.cyan}Boilerplate bootstrap${a.reset}${' '.repeat(W - 22)} ${a.gray}│${a.reset}`);
  line(`${a.gray}│${a.reset}  ${a.dim}pnpm · Husky · local env${a.reset}${' '.repeat(W - 27)} ${a.gray}│${a.reset}`);
  line(`${a.gray}╰${'─'.repeat(W)}╯${a.reset}`);
  line('');
}

function stepHeader(n, title) {
  line('');
  line(`${a.magenta}${a.bold}▸ Step ${n}:${a.reset} ${a.bold}${title}${a.reset}`);
  line(`${a.gray}${'─'.repeat(W)}${a.reset}`);
}

function stepOk(msg) {
  line(`${a.green}  ✓${a.reset} ${msg}`);
}

function stepWarn(msg) {
  line(`${a.yellow}  !${a.reset} ${msg}`);
}

function stepFail(msg) {
  line(`${a.red}  ✗${a.reset} ${msg}`);
}

function whichPnpm() {
  const r = spawnSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8', shell: true });
  return r.status === 0;
}

function run(cmd, args, label) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, CI: process.env.CI ?? '' },
  });
  if (r.status !== 0) {
    stepFail(`${label} failed (exit ${r.status ?? 'unknown'})`);
    process.exit(r.status ?? 1);
  }
  stepOk(`${label} finished`);
}

function ensureEnvFile() {
  const envDir = path.join(root, 'env');
  const example = path.join(root, '.env.example');
  const target = path.join(envDir, '.env.development');

  if (!fs.existsSync(example)) {
    stepWarn('`.env.example` not found — skipped env file');
    return;
  }

  fs.mkdirSync(envDir, { recursive: true });

  if (fs.existsSync(target)) {
    stepWarn(`\`${path.relative(root, target)}\` already exists — left unchanged`);
    return;
  }

  fs.copyFileSync(example, target);
  stepOk(`Created ${path.relative(root, target)} from .env.example`);
}

function noteHusky() {
  const gitDir = path.join(root, '.git');
  if (!fs.existsSync(gitDir)) {
    stepWarn('Not a Git repo — Husky hooks apply after `git init` / clone; run `pnpm install` again then.');
    return;
  }
  stepOk('Husky: `prepare` ran with install (hooks in `.husky/`)');
}

banner();

if (!whichPnpm()) {
  line(`${a.red}pnpm is not available.${a.reset}`);
  line(`${a.dim}Install pnpm (Node 16.13+):${a.reset} ${a.cyan}corepack enable && corepack prepare pnpm@latest --activate${a.reset}`);
  line('');
  process.exit(1);
}

stepHeader(1, 'Install packages & Git hooks');
run('pnpm', ['install'], '`pnpm install`');
noteHusky();

stepHeader(2, 'Local environment file');
ensureEnvFile();

line('');
line(`${a.green}${a.bold}Bootstrap complete.${a.reset}`);
line(`${a.dim}Next:${a.reset} ${a.cyan}pnpm dev${a.reset}  ${a.dim}(ensure Postgres & Redis match env/)${a.reset}`);
line('');

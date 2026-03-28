import type { AddressInfo } from 'node:net';
import { API_BASE_PATH, API_VERSION_V1, ENV_MODE } from '@/config/constants';

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  white: '\x1b[97m',
  magenta: '\x1b[35m',
};

const W = 58;

function row(inner: string, pad = W): string {
  const visibleLen = stripAnsi(inner).length;
  const spaces = Math.max(0, pad - 2 - visibleLen);
  return `${c.gray}│${c.reset} ${inner}${' '.repeat(spaces)} ${c.gray}│${c.reset}`;
}

function stripAnsi(s: string): string {
  return s.replace(new RegExp(`${'\u001b'}\\[[0-9;]*m`, 'g'), '');
}

function hr(char: string): string {
  return `${c.gray}├${char.repeat(W)}┤${c.reset}`;
}

function section(title: string): string[] {
  return [row(''), row(`${c.magenta}${c.bold}${title}${c.reset}`), hr('─')];
}

export type StartupBannerOptions = {
  appName: string;
  version: string;
  nodeEnv: string;
  address: AddressInfo;
  docsEnabled: boolean;
};

/**
 * Rich, sectioned startup banner for the terminal (structured logs stay on the logger).
 */
export function writeStartupBanner(opts: StartupBannerOptions): void {
  const { appName, version, nodeEnv, address, docsEnabled } = opts;
  const port = address.port;
  const bind =
    address.address === '::' || address.address === '0.0.0.0' || address.address === '::1'
      ? 'all interfaces'
      : address.address;

  const local = `http://127.0.0.1:${port}`;
  const loopback = `http://localhost:${port}`;
  const api = `${local}${API_BASE_PATH}`;
  const health = `${local}${API_BASE_PATH}/${API_VERSION_V1}/health`;
  const openApi = `${local}${API_BASE_PATH}/doc`;
  const scalar = `${local}/docs`;

  const envColor =
    nodeEnv === ENV_MODE.PRODUCTION ? c.magenta : nodeEnv === ENV_MODE.TEST ? c.cyan : c.green;

  const lines: string[] = [
    '',
    `${c.gray}╭${'─'.repeat(W)}╮${c.reset}`,
    row(
      `${c.bold}${c.white}${appName}${c.reset} ${c.dim}v${version}${c.reset}  ${envColor}${nodeEnv}${c.reset}`,
    ),
    row(`${c.dim}listening on ${bind} · port ${port}${c.reset}`),
    hr('─'),
    ...section('Infrastructure'),
    row(`  ${c.green}✓${c.reset}  ${c.white}PostgreSQL${c.reset}     ${c.dim}pool ready${c.reset}`),
    row(
      `  ${c.green}✓${c.reset}  ${c.white}Redis${c.reset}          ${c.dim}primary + cache L2${c.reset}`,
    ),
    row(
      `  ${c.green}✓${c.reset}  ${c.white}BentoCache${c.reset}     ${c.dim}L1 memory · L2 Redis${c.reset}`,
    ),
    ...section('HTTP'),
    row(`  ${c.cyan}→${c.reset}  ${c.dim}Local${c.reset}      ${c.cyan}${loopback}${c.reset}`),
    row(`  ${c.cyan}→${c.reset}  ${c.dim}LAN${c.reset}        ${c.cyan}${local}${c.reset}`),
    row(`  ${c.cyan}→${c.reset}  ${c.dim}API${c.reset}        ${c.cyan}${api}${c.reset}`),
    row(`  ${c.cyan}→${c.reset}  ${c.dim}Health${c.reset}     ${c.cyan}${health}${c.reset}`),
  ];

  if (docsEnabled) {
    lines.push(
      row(`  ${c.cyan}→${c.reset}  ${c.dim}OpenAPI${c.reset}    ${c.cyan}${openApi}${c.reset}`),
      row(`  ${c.cyan}→${c.reset}  ${c.dim}Scalar${c.reset}     ${c.cyan}${scalar}${c.reset}`),
    );
  } else {
    lines.push(row(`  ${c.dim}API docs disabled (production)${c.reset}`));
  }

  lines.push(row(''), `${c.gray}╰${'─'.repeat(W)}╯${c.reset}`, '');

  process.stdout.write(`${lines.join('\n')}\n`);
}

import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const envFile =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'env', 'production.env')
    : path.join(process.cwd(), 'env', 'development.env');

dotenv.config({ path: envFile });

function databaseUrl(): string {
  const u = process.env.DATABASE_URL;
  if (u) return u;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const name = process.env.DB_NAME;
  if (!host || !port || !user || !name) {
    throw new Error('Set DATABASE_URL or DB_HOST, DB_PORT, DB_USER, DB_NAME');
  }
  const enc = encodeURIComponent(password ?? '');
  return `postgresql://${user}:${enc}@${host}:${port}/${name}`;
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl() },
});

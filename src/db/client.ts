import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { getEnv } from '@/config/env';
import * as schema from './schema';

function connectionString(): string {
  const e = getEnv();
  if (e.DATABASE_URL) return e.DATABASE_URL;
  const enc = encodeURIComponent(e.DB_PASSWORD ?? '');
  return `postgresql://${e.DB_USER}:${enc}@${e.DB_HOST}:${e.DB_PORT}/${e.DB_NAME}`;
}

export const pool = new pg.Pool({ connectionString: connectionString() });

export const db = drizzle(pool, { schema });

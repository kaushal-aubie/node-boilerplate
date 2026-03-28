import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { getEnv } from '@/config/env';
import * as schema from './schema';

export type AppDatabase = NodePgDatabase<typeof schema>;

function connectionString(): string {
  const e = getEnv();
  if (e.DATABASE_URL) return e.DATABASE_URL;
  const enc = encodeURIComponent(e.DB_PASSWORD ?? '');
  return `postgresql://${e.DB_USER}:${enc}@${e.DB_HOST}:${e.DB_PORT}/${e.DB_NAME}`;
}

export class DatabaseClient {
  readonly pool: pg.Pool;
  readonly db: AppDatabase;

  constructor() {
    this.pool = new pg.Pool({ connectionString: connectionString() });
    this.db = drizzle(this.pool, { schema });
  }

  /** Verifies connectivity; pool acquires connections lazily for queries after this. */
  async connect(): Promise<void> {
    const client = await this.pool.connect();
    client.release();
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}

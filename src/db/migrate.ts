import '@/config/load-env';

import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client';

async function main() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  console.log('Migrations complete');
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});

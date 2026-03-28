import '@/config/load-env';

import path from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { DatabaseClient } from './database-client';

async function main() {
  const database = new DatabaseClient();
  await database.connect();
  try {
    await migrate(database.db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    console.log('Migrations complete');
  } finally {
    await database.disconnect();
  }
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});

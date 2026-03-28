import '@/config/load-env';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/crypto/bcrypt';
import { DatabaseClient } from '@/lib/infra/database-client';

async function main() {
  const database = new DatabaseClient();
  await database.connect();
  try {
    const email = 'demo@example.com';
    const existing = await database.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing[0]) {
      console.log('Seed skipped: demo user exists');
      return;
    }
    const password = await hashPassword('password123');
    await database.db.insert(users).values({
      email,
      password,
      firstName: 'Demo',
      lastName: 'User',
    });
    console.log('Seed complete: demo@example.com / password123');
  } finally {
    await database.disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

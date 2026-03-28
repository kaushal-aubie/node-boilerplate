import '@/config/load-env';
import { eq } from 'drizzle-orm';
import { db, pool } from '@/db/client';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/bcrypt';

async function main() {
  const email = 'demo@example.com';
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    console.log('Seed skipped: demo user exists');
    return;
  }
  const password = await hashPassword('password123');
  await db.insert(users).values({
    email,
    password,
    firstName: 'Demo',
    lastName: 'User',
  });
  console.log('Seed complete: demo@example.com / password123');
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await pool.end();
    process.exit(1);
  });

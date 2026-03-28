import type { CacheProvider } from 'bentocache/types';
import { eq } from 'drizzle-orm';
import type { NewUser, User } from '@/db/schema';
import { users } from '@/db/schema';
import { cacheGetOrSet } from '@/lib/cache/cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import type { AppDatabase } from '@/lib/infra/database-client';

const cacheTtl = '5m' as const;

export function createUsersRepo(db: AppDatabase, cacheRoot: CacheProvider) {
  const cache = cacheRoot.namespace(CACHE_NAMESPACE.users);

  return {
    async findByIdCached(id: number): Promise<User | undefined> {
      return cacheGetOrSet<User | undefined>(cache, {
        key: String(id),
        ttl: cacheTtl,
        factory: async (ctx) => {
          const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
          if (!row) {
            ctx.skip();
            return undefined;
          }
          return row;
        },
      });
    },

    async findByEmail(email: string): Promise<User | undefined> {
      const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return row;
    },

    async existsByEmail(email: string): Promise<boolean> {
      const rows = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return rows.length > 0;
    },

    async create(
      values: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<User | undefined> {
      const [row] = await db.insert(users).values(values).returning();
      return row;
    },
  };
}

export type UsersRepo = ReturnType<typeof createUsersRepo>;

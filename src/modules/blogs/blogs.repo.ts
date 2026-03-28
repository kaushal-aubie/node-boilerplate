import type { CacheProvider } from 'bentocache/types';
import { and, desc, eq } from 'drizzle-orm';
import type { Blog, NewBlog } from '@/db/schema';
import { blogs } from '@/db/schema';
import { cacheGetOrSet } from '@/lib/cache/cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { utcNow } from '@/lib/date';
import type { AppDatabase } from '@/lib/infra/database-client';

const listKey = 'list';
const cacheTtl = '2m' as const;

export function createBlogsRepo(db: AppDatabase, cacheRoot: CacheProvider) {
  const cache = cacheRoot.namespace(CACHE_NAMESPACE.blogs);

  return {
    async listCached(): Promise<Blog[]> {
      return cacheGetOrSet(cache, {
        key: listKey,
        ttl: cacheTtl,
        factory: async () => db.select().from(blogs).orderBy(desc(blogs.createdAt)),
      });
    },

    async findByIdCached(id: number): Promise<Blog | undefined> {
      return cacheGetOrSet<Blog | undefined>(cache, {
        key: String(id),
        ttl: cacheTtl,
        factory: async (ctx) => {
          const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
          if (!row) {
            ctx.skip();
            return undefined;
          }
          return row;
        },
      });
    },

    async findById(id: number): Promise<Blog | undefined> {
      const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
      return row;
    },

    async create(
      values: Pick<NewBlog, 'title' | 'content' | 'authorId'>,
    ): Promise<Blog | undefined> {
      const [row] = await db.insert(blogs).values(values).returning();
      if (row) {
        await cache.delete({ key: listKey });
      }
      return row;
    },

    async updateByAuthor(
      id: number,
      authorId: number,
      patch: Partial<Pick<Blog, 'title' | 'content'>>,
    ): Promise<Blog | undefined> {
      const [row] = await db
        .update(blogs)
        .set({
          ...patch,
          updatedAt: utcNow(),
        })
        .where(and(eq(blogs.id, id), eq(blogs.authorId, authorId)))
        .returning();
      if (row) {
        await cache.deleteMany({ keys: [listKey, String(id)] });
      }
      return row;
    },

    async deleteByAuthor(id: number, authorId: number): Promise<boolean> {
      const deleted = await db
        .delete(blogs)
        .where(and(eq(blogs.id, id), eq(blogs.authorId, authorId)))
        .returning({ id: blogs.id });
      if (deleted.length > 0) {
        await cache.deleteMany({ keys: [listKey, String(id)] });
      }
      return deleted.length > 0;
    },
  };
}

export type BlogsRepo = ReturnType<typeof createBlogsRepo>;

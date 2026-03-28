import { createRoute, z } from '@hono/zod-openapi';
import { desc } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { blogs, selectBlogSchema } from '@/db/schema';
import { cacheGetOrSet } from '@/lib/cache/cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { coerceCreatedUpdated } from '@/lib/date';
import type { APIHandler } from '@/types/api-env';

const blogListCacheKey = 'list';
const blogCacheTtl = '2m' as const;

export const route = createRoute({
  method: 'get',
  path: '/blogs',
  tags: ['Blogs'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectBlogSchema), 'All blogs'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const db = c.get('db');
  const cache = c.get('cache').namespace(CACHE_NAMESPACE.blogs);
  const rows = await cacheGetOrSet(cache, {
    key: blogListCacheKey,
    ttl: blogCacheTtl,
    factory: async () => db.select().from(blogs).orderBy(desc(blogs.createdAt)),
  });
  return c.json(rows.map(coerceCreatedUpdated), HttpStatusCodes.OK);
};

import { createRoute, z } from '@hono/zod-openapi';
import { desc } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { blogs, selectBlogSchema } from '@/db/schema';
import { BLOG_CACHE_TTL, BLOG_LIST_CACHE_KEY } from '@/lib/cache/blog-cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { reviveBlog } from '@/lib/cache/revive';
import type { APIHandler } from '@/types/api-env';

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
  const rows = await cache.getOrSet({
    key: BLOG_LIST_CACHE_KEY,
    ttl: BLOG_CACHE_TTL,
    factory: async () => db.select().from(blogs).orderBy(desc(blogs.createdAt)),
  });
  return c.json(rows.map(reviveBlog), HttpStatusCodes.OK);
};

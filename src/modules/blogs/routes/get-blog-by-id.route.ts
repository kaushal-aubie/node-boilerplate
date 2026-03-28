import { createRoute } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { type Blog, blogs, selectBlogSchema } from '@/db/schema';
import { notFoundSchema } from '@/lib/app/stoker';
import { cacheGetOrSet } from '@/lib/cache/cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { coerceCreatedUpdated } from '@/lib/date';
import type { APIHandler } from '@/types/api-env';

const blogCacheTtl = '2m' as const;

export const route = createRoute({
  method: 'get',
  path: '/blogs/{id}',
  tags: ['Blogs'],
  request: { params: IdParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectBlogSchema, 'Blog'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const { id } = c.req.valid('param');
  const db = c.get('db');
  const cache = c.get('cache').namespace(CACHE_NAMESPACE.blogs);
  const key = String(id);

  const row = await cacheGetOrSet<Blog | undefined>(cache, {
    key,
    ttl: blogCacheTtl,
    factory: async (ctx) => {
      const [dbRow] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
      if (!dbRow) {
        ctx.skip();
        return undefined;
      }
      return dbRow;
    },
  });

  if (!row) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(coerceCreatedUpdated(row), HttpStatusCodes.OK);
};

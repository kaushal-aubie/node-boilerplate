import { createRoute } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { type Blog, blogs, selectBlogSchema } from '@/db/schema';
import { notFoundSchema } from '@/lib/app/stoker';
import { BLOG_CACHE_TTL } from '@/lib/cache/blog-cache';
import { CACHE_NAMESPACE } from '@/lib/cache/namespaces';
import { reviveBlog } from '@/lib/cache/revive';
import type { APIHandler } from '@/types/api-env';

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

  const row: Blog | undefined = await cache.get<Blog>({ key });
  if (row) {
    return c.json(reviveBlog(row), HttpStatusCodes.OK);
  }

  const [dbRow] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!dbRow) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  await cache.set({ key, value: dbRow, ttl: BLOG_CACHE_TTL });
  return c.json(dbRow, HttpStatusCodes.OK);
};

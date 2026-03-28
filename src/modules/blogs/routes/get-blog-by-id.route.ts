import { createRoute } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { blogs, selectBlogSchema } from '@/db/schema';
import { notFoundSchema } from '@/lib/stoker';
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
  const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!row) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(row, HttpStatusCodes.OK);
};

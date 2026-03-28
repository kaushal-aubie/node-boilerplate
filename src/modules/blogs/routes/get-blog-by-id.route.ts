import { createRoute, type OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { notFoundSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import type { ApiEnv } from '@/types/api-env';
import { selectBlogSchema } from '../select-blog.schema';
import { toPublicBlog } from '../to-public-blog';

const route = createRoute({
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

const handler: RouteHandler<typeof route, ApiEnv> = async (c) => {
  const { id } = c.req.valid('param');
  const [row] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!row) {
    return c.json({ message: 'Blog not found' }, 404);
  }
  return c.json(
    parseResponse(selectBlogSchema, {
      message: 'Blog',
      data: toPublicBlog(row),
    }),
    200,
  );
};

export function registerBlogsGetRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, handler);
}

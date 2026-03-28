import { createRoute, type OpenAPIHono, type RouteHandler, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { messageResponseSchema, notFoundSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import { requireAuth } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';

const deleteResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('BlogDeleteResponse');

const route = createRoute({
  method: 'delete',
  path: '/blogs/{id}',
  tags: ['Blogs'],
  middleware: [requireAuth] as const,
  request: { params: IdParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(deleteResponseSchema, 'Deleted'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(messageResponseSchema, 'Forbidden'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id',
    ),
  },
});

const handler: RouteHandler<typeof route, ApiEnv> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const { id } = c.req.valid('param');

  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!existing) {
    return c.json({ message: 'Blog not found' }, 404);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'Forbidden' }, 403);
  }

  const deleted = await db
    .delete(blogs)
    .where(and(eq(blogs.id, id), eq(blogs.authorId, user.id)))
    .returning({ id: blogs.id });

  if (deleted.length === 0) {
    return c.json({ message: 'Blog not found' }, 404);
  }

  return c.json(parseResponse(deleteResponseSchema, { message: 'Blog deleted' }), 200);
};

export function registerBlogsDeleteRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, handler);
}

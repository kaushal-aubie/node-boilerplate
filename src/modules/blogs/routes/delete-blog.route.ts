import { createRoute, z } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { messageResponseSchema, notFoundSchema } from '@/lib/constants';
import { requireAuth } from '@/middleware/auth.middleware';
import type { APIHandler } from '@/types/api-env';

const deleteResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('BlogDeleteResponse');

export const route = createRoute({
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

export const handler: APIHandler<typeof route> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
  }
  const { id } = c.req.valid('param');

  const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  if (!existing) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'forbidden' }, HttpStatusCodes.FORBIDDEN);
  }

  const deleted = await db
    .delete(blogs)
    .where(and(eq(blogs.id, id), eq(blogs.authorId, user.id)))
    .returning({ id: blogs.id });

  if (deleted.length === 0) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: 'blog_deleted' }, HttpStatusCodes.OK);
};

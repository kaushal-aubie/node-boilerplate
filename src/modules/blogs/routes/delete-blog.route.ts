import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { messageResponseSchema, notFoundSchema } from '@/lib/app/stoker';
import { requireAuth } from '@/middleware/auth-check';
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
  summary: 'Delete blog',
  description: 'Permanently deletes a blog. Only the author may delete it.',
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
  const repo = c.get('repo').blogs;

  const existing = await repo.findById(id);
  if (!existing) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'forbidden' }, HttpStatusCodes.FORBIDDEN);
  }

  const ok = await repo.deleteByAuthor(id, user.id);
  if (!ok) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: 'blog_deleted' }, HttpStatusCodes.OK);
};

import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { updateBlogSchema } from '@/db/schema';
import { messageResponseSchema, notFoundSchema } from '@/lib/app/stoker';
import { requireAuth } from '@/middleware/auth-check';
import type { APIHandler } from '@/types/api-env';
import { blogPublicSchema, toPublicBlog } from '../blog.dto';

const patchBlogBodySchema = updateBlogSchema
  .partial()
  .refine((val: Record<string, unknown>) => Object.keys(val).length > 0, {
    message: 'No updates provided',
  })
  .openapi('BlogPatchBody');

export const route = createRoute({
  method: 'patch',
  path: '/blogs/{id}',
  tags: ['Blogs'],
  summary: 'Update blog',
  description: 'Partially updates a blog. Only the author may modify it.',
  middleware: [requireAuth],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchBlogBodySchema, 'Blog updates'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(blogPublicSchema, 'Updated'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(messageResponseSchema, 'Forbidden'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchBlogBodySchema).or(createErrorSchema(IdParamsSchema)),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
  }
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const repo = c.get('repo').blogs;

  const existing = await repo.findById(id);
  if (!existing) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }
  if (existing.authorId !== user.id) {
    return c.json({ message: 'forbidden' }, HttpStatusCodes.FORBIDDEN);
  }

  const row = await repo.updateByAuthor(id, user.id, body);

  if (!row) {
    return c.json({ message: 'blog_not_found' }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(toPublicBlog(row), HttpStatusCodes.OK);
};

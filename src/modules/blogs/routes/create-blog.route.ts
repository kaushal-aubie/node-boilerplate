import { createRoute } from '@hono/zod-openapi';
import { createInsertSchema } from 'drizzle-zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { blogs, selectBlogSchema } from '@/db/schema';
import { messageResponseSchema } from '@/lib/app/stoker';
import { requireAuth } from '@/middleware/auth-check';
import type { APIHandler } from '@/types/api-env';

const insertBlogBodySchema = createInsertSchema(blogs, {
  title: (s) => s.min(1).max(512),
  content: (s) => s.min(1),
})
  .omit({
    id: true,
    authorId: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi('BlogCreateBody');

export const route = createRoute({
  method: 'post',
  path: '/blogs',
  tags: ['Blogs'],
  middleware: [requireAuth] as const,
  request: {
    body: jsonContentRequired(insertBlogBodySchema, 'New blog'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectBlogSchema, 'Created'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(messageResponseSchema, 'Bad request'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      messageResponseSchema,
      'Internal server error',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertBlogBodySchema),
      'Validation error(s)',
    ),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'unauthorized' }, HttpStatusCodes.UNAUTHORIZED);
  }
  const body = c.req.valid('json');
  const row = await c.get('repo').blogs.create({
    title: body.title,
    content: body.content,
    authorId: user.id,
  });

  if (!row) {
    return c.json({ message: 'create_failed' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(row, HttpStatusCodes.CREATED);
};

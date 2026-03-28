import { createRoute, type OpenAPIHono, type RouteHandler } from '@hono/zod-openapi';
import { createInsertSchema } from 'drizzle-zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { messageResponseSchema } from '@/lib/constants';
import { parseResponse } from '@/lib/json-response';
import { requireAuth } from '@/middleware/auth.middleware';
import type { ApiEnv } from '@/types/api-env';
import { selectBlogSchema } from '../select-blog.schema';
import { toPublicBlog } from '../to-public-blog';

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

const route = createRoute({
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
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(messageResponseSchema, 'Unauthorized'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertBlogBodySchema),
      'Validation error(s)',
    ),
  },
});

const handler: RouteHandler<typeof route, ApiEnv> = async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const body = c.req.valid('json');

  const [row] = await db
    .insert(blogs)
    .values({
      title: body.title,
      content: body.content,
      authorId: user.id,
    })
    .returning();

  if (!row) {
    return c.json({ message: 'Could not create blog' }, 400);
  }

  return c.json(
    parseResponse(selectBlogSchema, { message: 'Blog created', data: toPublicBlog(row) }),
    201,
  );
};

export function registerBlogsCreateRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, handler);
}

import { createRoute, type OpenAPIHono, type RouteHandler, z } from '@hono/zod-openapi';
import { desc } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { db } from '@/db/client';
import { blogs } from '@/db/schema';
import { parseResponse } from '@/lib/json-response';
import type { ApiEnv } from '@/types/api-env';
import { selectBlogSchema } from '../select-blog.schema';
import { toPublicBlog } from '../to-public-blog';

const listResponseSchema = z
  .object({
    message: z.string(),
    data: z.array(selectBlogSchema),
  })
  .openapi('BlogListResponse');

const route = createRoute({
  method: 'get',
  path: '/blogs',
  tags: ['Blogs'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(listResponseSchema, 'All blogs'),
  },
});

const handler: RouteHandler<typeof route, ApiEnv> = async (c) => {
  const rows = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  return c.json(
    parseResponse(listResponseSchema, {
      message: 'Blogs',
      data: rows.map(toPublicBlog),
    }),
    200,
  );
};

export function registerBlogsListRoute(app: OpenAPIHono<ApiEnv>) {
  app.openapi(route, handler);
}

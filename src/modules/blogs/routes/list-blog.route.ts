import { createRoute, z } from '@hono/zod-openapi';
import { desc } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { blogs, selectBlogSchema } from '@/db/schema';
import type { APIHandler } from '@/types/api-env';

export const route = createRoute({
  method: 'get',
  path: '/blogs',
  tags: ['Blogs'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectBlogSchema), 'All blogs'),
  },
});

export const handler: APIHandler<typeof route> = async (c) => {
  const db = c.get('db');
  const rows = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
  return c.json(rows, HttpStatusCodes.OK);
};

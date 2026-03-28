import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';
import { selectBlogSchema } from '@/db/schema';
import { coerceCreatedUpdated } from '@/lib/date';
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
  const rows = await c.get('repo').blogs.listCached();
  return c.json(rows.map(coerceCreatedUpdated), HttpStatusCodes.OK);
};

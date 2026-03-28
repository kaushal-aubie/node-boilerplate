import { z } from '@hono/zod-openapi';
import { createSelectSchema } from 'drizzle-zod';
import { blogs } from '@/db/schema';

/** Shared OpenAPI response shape (used by list/get/create/patch). Body schemas live in those routes. */
export const selectBlogSchema = createSelectSchema(blogs)
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Blog');

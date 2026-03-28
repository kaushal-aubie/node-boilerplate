import { z } from '@hono/zod-openapi';
import type { Blog } from '@/db/schema';
import { selectBlogSchema } from '@/db/schema';
import { coerceCreatedUpdated, toUtcIsoString } from '@/lib/date';

/** OpenAPI + JSON shape for blog resources (ISO timestamps). */
export const blogPublicSchema = selectBlogSchema
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('BlogPublic');

export function toPublicBlog(b: Blog) {
  const row = coerceCreatedUpdated(b);
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.authorId,
    createdAt: toUtcIsoString(row.createdAt),
    updatedAt: toUtcIsoString(row.updatedAt),
  };
}

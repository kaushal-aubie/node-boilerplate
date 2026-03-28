import type { Blog } from '@/db/schema';

export function toPublicBlog(b: Blog) {
  return {
    id: b.id,
    title: b.title,
    content: b.content,
    authorId: b.authorId,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

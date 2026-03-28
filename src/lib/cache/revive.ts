import type { Blog, User } from '@/db/schema';

function toDate(v: Date | string): Date {
  return v instanceof Date ? v : new Date(v);
}

/** Restore Date fields after JSON deserialization from Bentocache. */
export function reviveUser(u: User): User {
  return {
    ...u,
    createdAt: toDate(u.createdAt),
    updatedAt: toDate(u.updatedAt),
  };
}

/** Restore Date fields after JSON deserialization from Bentocache. */
export function reviveBlog(b: Blog): Blog {
  return {
    ...b,
    createdAt: toDate(b.createdAt),
    updatedAt: toDate(b.updatedAt),
  };
}

import { CacheProvider } from 'bentocache/types';

/**
 * BentoCache namespace segments — use with {@link CacheProvider.namespace}.
 */
export const CACHE_NAMESPACE = {
  users: 'users',
  blogs: 'blogs',
} as const;

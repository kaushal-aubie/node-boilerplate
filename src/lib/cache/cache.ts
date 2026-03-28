import type { CacheProvider, GetOrSetOptions } from 'bentocache/types';

/**
 * Application cache-aside: always Bento `getOrSet` (no direct get/set).
 * Adjust shared behavior or defaults here.
 */
export function cacheGetOrSet<T>(
  cache: CacheProvider,
  options: GetOrSetOptions<T>,
): Promise<T> {
  return cache.getOrSet(options);
}

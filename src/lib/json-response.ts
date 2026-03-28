import type { z } from 'zod';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';

/**
 * Validates response payload with Zod. On failure logs and rethrows (global handler → 500).
 */
export function parseResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    logger.error({ issues: parsed.error.issues }, 'Response validation failed');
    throw new ZodError(parsed.error.issues);
  }
  return parsed.data;
}

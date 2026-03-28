import { toDate } from 'date-fns';

/** Wall-clock instant for persisted `updatedAt`-style fields. */
export function utcNow(): Date {
  return new Date();
}

/** Coerce cache / JSON values to a real `Date` (date-fns accepts Date, ISO strings, timestamps). */
export function coerceToDate(value: Date | string | number): Date {
  return toDate(value);
}

/** Restore `createdAt` / `updatedAt` after JSON deserialization (e.g. Bentocache). */
export function coerceCreatedUpdated<
  T extends { createdAt: Date | string; updatedAt: Date | string },
>(entity: T): T & { createdAt: Date; updatedAt: Date } {
  return {
    ...entity,
    createdAt: coerceToDate(entity.createdAt),
    updatedAt: coerceToDate(entity.updatedAt),
  };
}

/**
 * UTC ISO-8601 for JSON APIs. Native `toISOString()` matches PostgreSQL `timestamptz` instants.
 * (date-fns `formatISO` is local-time oriented; we keep UTC output explicit here.)
 */
export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

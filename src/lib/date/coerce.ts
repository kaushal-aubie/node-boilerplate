import { toDate } from 'date-fns';

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

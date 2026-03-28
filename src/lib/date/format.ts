/**
 * UTC ISO-8601 for JSON APIs. Native `toISOString()` matches PostgreSQL `timestamptz` instants.
 * (date-fns `formatISO` is local-time oriented; we keep UTC output explicit here.)
 */
export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

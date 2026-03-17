export interface DateRange {
  start: Date;
  end: Date;
}

/** Safely parse a Date | string | undefined into a Date, or null on failure. */
export function toDate(value: Date | string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value as string | Date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

/** Returns true if the value falls within [start, end] inclusive. */
export function withinRange(value: Date | string | undefined | null, start: Date, end: Date): boolean {
  const parsed = toDate(value);
  if (!parsed) return false;
  return parsed >= start && parsed <= end;
}

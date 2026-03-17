const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Convert an internal time period key to a human-readable label.
 * e.g. "month_2026_01" → "January 2026", "last_3_months" → "the last 3 months"
 */
export function formatPeriodLabel(timePeriod: string | undefined): string {
  if (!timePeriod) return 'this month';
  if (timePeriod === 'today') return 'today';
  if (timePeriod === 'yesterday') return 'yesterday';
  if (timePeriod === 'this_week') return 'this week';
  if (timePeriod === 'last_week') return 'last week';
  if (timePeriod === 'this_month') return 'this month';
  if (timePeriod === 'last_month') return 'last month';
  if (timePeriod === 'this_year') return 'this year';
  if (timePeriod === 'last_year') return 'last year';

  if (timePeriod.startsWith('month_')) {
    const parts = timePeriod.split('_');
    const monthName = MONTH_NAMES[parseInt(parts[2], 10) - 1] ?? '';
    return `${monthName} ${parts[1]}`;
  }
  if (timePeriod.startsWith('year_')) return timePeriod.slice(5);

  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_months')) {
    return `the last ${timePeriod.split('_')[1]} months`;
  }
  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_weeks')) {
    return `the last ${timePeriod.split('_')[1]} weeks`;
  }
  if (timePeriod.startsWith('last_') && timePeriod.endsWith('_days')) {
    return `the last ${timePeriod.split('_')[1]} days`;
  }

  return timePeriod.replace(/_/g, ' ');
}

/** Return ISO month key like "2026-03" for a given date. */
export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

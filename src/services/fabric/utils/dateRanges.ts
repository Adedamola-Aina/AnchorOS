import type { DateRange } from './dateUtils';

/**
 * Compute a date range for a named time period relative to `now`.
 *
 * Named: today | yesterday | this_week | last_week | this_month | last_month | this_year | last_year
 * Dynamic: month_YYYY_MM | last_N_months | last_N_weeks | last_N_days | year_YYYY
 *
 * Defaults to this_month for unknown/undefined values.
 */
export function getDateRange(timePeriod: string | undefined, now: Date): DateRange {
  const end = new Date(now);
  const start = new Date(now);

  if (timePeriod === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'yesterday') {
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'this_week' || timePeriod === 'last_week') {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset + (timePeriod === 'last_week' ? -7 : 0));
    start.setHours(0, 0, 0, 0);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'this_year') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(11, 31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod === 'last_year') {
    start.setFullYear(start.getFullYear() - 1, 0, 1);
    start.setHours(0, 0, 0, 0);
    end.setFullYear(start.getFullYear(), 11, 31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (timePeriod?.startsWith('month_')) {
    const parts = timePeriod.split('_');
    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      start.setFullYear(year, month, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(year, month + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  if (timePeriod?.startsWith('year_')) {
    const year = parseInt(timePeriod.slice(5), 10);
    if (!Number.isNaN(year)) {
      start.setFullYear(year, 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(year, 11, 31);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_months')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setMonth(start.getMonth() - n, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_weeks')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setDate(start.getDate() - n * 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  if (timePeriod?.startsWith('last_') && timePeriod.endsWith('_days')) {
    const n = parseInt(timePeriod.split('_')[1], 10);
    if (!Number.isNaN(n)) {
      start.setDate(start.getDate() - n);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  if (timePeriod === 'last_month') {
    start.setMonth(start.getMonth() - 1);
  }
  end.setFullYear(start.getFullYear(), start.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/** Return the start of the previous 7-day window before `weekStart`. */
export function previousWeekRange(weekStart: Date, weekEnd: Date): DateRange {
  const start = new Date(weekStart);
  start.setDate(start.getDate() - 7);
  const end = new Date(weekEnd);
  end.setDate(end.getDate() - 7);
  return { start, end };
}

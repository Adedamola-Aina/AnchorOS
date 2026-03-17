import { describe, expect, it } from 'vitest';
import { toDate, withinRange } from './dateUtils';
import { getDateRange, previousWeekRange } from './dateRanges';
import { formatPeriodLabel, monthKey } from './dateFormatting';

describe('dateUtils', () => {
  describe('toDate', () => {
    it('returns null for nullish and invalid values', () => {
      expect(toDate(undefined)).toBeNull();
      expect(toDate(null)).toBeNull();
      expect(toDate('not-a-date')).toBeNull();
    });

    it('parses valid ISO strings and Date objects', () => {
      const fromString = toDate('2026-03-16T10:00:00.000Z');
      const fromDate = toDate(new Date('2026-03-16T11:00:00.000Z'));

      expect(fromString).not.toBeNull();
      expect(fromDate).not.toBeNull();
      expect(fromString!.toISOString()).toBe('2026-03-16T10:00:00.000Z');
      expect(fromDate!.toISOString()).toBe('2026-03-16T11:00:00.000Z');
    });
  });

  describe('withinRange', () => {
    const start = new Date('2026-03-01T00:00:00.000Z');
    const end = new Date('2026-03-31T23:59:59.999Z');

    it('is inclusive of start and end boundaries', () => {
      expect(withinRange(start, start, end)).toBe(true);
      expect(withinRange(end, start, end)).toBe(true);
    });

    it('returns false for invalid or out-of-range values', () => {
      expect(withinRange('bad-date', start, end)).toBe(false);
      expect(withinRange('2026-02-28T23:59:59.999Z', start, end)).toBe(false);
      expect(withinRange('2026-04-01T00:00:00.000Z', start, end)).toBe(false);
    });
  });

  describe('getDateRange', () => {
    const now = new Date('2026-03-15T12:34:56.789Z');

    it('builds today and yesterday ranges', () => {
      const today = getDateRange('today', now);
      const yesterday = getDateRange('yesterday', now);

      expect(today.start.toISOString()).toBe('2026-03-15T00:00:00.000Z');
      expect(today.end.toISOString()).toBe('2026-03-15T23:59:59.999Z');
      expect(yesterday.start.toISOString()).toBe('2026-03-14T00:00:00.000Z');
      expect(yesterday.end.toISOString()).toBe('2026-03-14T23:59:59.999Z');
    });

    it('builds Monday-Sunday windows for this_week and last_week', () => {
      const thisWeek = getDateRange('this_week', now);
      const lastWeek = getDateRange('last_week', now);

      expect(thisWeek.start.toISOString()).toBe('2026-03-09T00:00:00.000Z');
      expect(thisWeek.end.toISOString()).toBe('2026-03-15T23:59:59.999Z');
      expect(lastWeek.start.toISOString()).toBe('2026-03-02T00:00:00.000Z');
      expect(lastWeek.end.toISOString()).toBe('2026-03-08T23:59:59.999Z');
    });

    it('builds this_year and last_year windows', () => {
      const thisYear = getDateRange('this_year', now);
      const lastYear = getDateRange('last_year', now);

      expect(thisYear.start.toISOString()).toBe('2026-01-01T00:00:00.000Z');
      expect(thisYear.end.toISOString()).toBe('2026-12-31T23:59:59.999Z');
      expect(lastYear.start.toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(lastYear.end.toISOString()).toBe('2025-12-31T23:59:59.999Z');
    });

    it('handles dynamic month/year keys', () => {
      const monthRange = getDateRange('month_2026_02', now);
      const yearRange = getDateRange('year_2025', now);

      expect(monthRange.start.toISOString()).toBe('2026-02-01T00:00:00.000Z');
      expect(monthRange.end.toISOString()).toBe('2026-02-28T23:59:59.999Z');
      expect(yearRange.start.toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(yearRange.end.toISOString()).toBe('2025-12-31T23:59:59.999Z');
    });

    it('handles last_N dynamic periods', () => {
      const months = getDateRange('last_3_months', now);
      const weeks = getDateRange('last_2_weeks', now);
      const days = getDateRange('last_10_days', now);

      expect(months.start.toISOString()).toBe('2025-12-01T00:00:00.000Z');
      expect(weeks.start.toISOString()).toBe('2026-03-01T00:00:00.000Z');
      expect(days.start.toISOString()).toBe('2026-03-05T00:00:00.000Z');
      expect(months.end.toISOString()).toBe('2026-03-15T23:59:59.999Z');
      expect(weeks.end.toISOString()).toBe('2026-03-15T23:59:59.999Z');
      expect(days.end.toISOString()).toBe('2026-03-15T23:59:59.999Z');
    });

    it('falls back to this_month for unknown/invalid periods', () => {
      const unknown = getDateRange('something_random', now);
      const invalidDynamic = getDateRange('last_x_days', now);
      const implicit = getDateRange(undefined, now);

      expect(unknown.start.toISOString()).toBe('2026-03-01T00:00:00.000Z');
      expect(unknown.end.toISOString()).toBe('2026-03-31T23:59:59.999Z');
      expect(invalidDynamic.start.toISOString()).toBe('2026-03-01T00:00:00.000Z');
      expect(invalidDynamic.end.toISOString()).toBe('2026-03-31T23:59:59.999Z');
      expect(implicit.start.toISOString()).toBe('2026-03-01T00:00:00.000Z');
      expect(implicit.end.toISOString()).toBe('2026-03-31T23:59:59.999Z');
    });

    it('handles last_month across year boundary', () => {
      const januaryNow = new Date('2026-01-10T08:00:00.000Z');
      const range = getDateRange('last_month', januaryNow);

      expect(range.start.toISOString()).toBe('2025-12-01T00:00:00.000Z');
      expect(range.end.toISOString()).toBe('2025-12-31T23:59:59.999Z');
    });
  });

  describe('formatPeriodLabel', () => {
    it('formats known periods and dynamic periods', () => {
      expect(formatPeriodLabel(undefined)).toBe('this month');
      expect(formatPeriodLabel('today')).toBe('today');
      expect(formatPeriodLabel('last_week')).toBe('last week');
      expect(formatPeriodLabel('month_2026_01')).toBe('January 2026');
      expect(formatPeriodLabel('year_2024')).toBe('2024');
      expect(formatPeriodLabel('last_3_months')).toBe('the last 3 months');
      expect(formatPeriodLabel('last_2_weeks')).toBe('the last 2 weeks');
      expect(formatPeriodLabel('last_10_days')).toBe('the last 10 days');
    });

    it('falls back to replacing underscores for unknown labels', () => {
      expect(formatPeriodLabel('custom_period_key')).toBe('custom period key');
    });
  });

  describe('previousWeekRange', () => {
    it('shifts start and end backward by exactly 7 days', () => {
      const weekStart = new Date('2026-03-09T00:00:00.000Z');
      const weekEnd = new Date('2026-03-15T23:59:59.999Z');

      const previous = previousWeekRange(weekStart, weekEnd);
      expect(previous.start.toISOString()).toBe('2026-03-02T00:00:00.000Z');
      expect(previous.end.toISOString()).toBe('2026-03-08T23:59:59.999Z');
    });
  });

  describe('monthKey', () => {
    it('returns ISO month key', () => {
      expect(monthKey(new Date('2026-11-30T23:59:59.999Z'))).toBe('2026-11');
    });
  });
});
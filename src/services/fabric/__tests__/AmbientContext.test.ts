import { describe, expect, it } from 'vitest';
import { getAmbientContext } from '../AmbientContext';

describe('getAmbientContext', () => {
  it('detects morning context', () => {
    const result = getAmbientContext(new Date('2026-03-09T08:15:00.000Z'));
    expect(result.timeOfDay).toBe('morning');
    expect(result.hour).toBe(8);
  });

  it('detects afternoon context', () => {
    const result = getAmbientContext(new Date('2026-03-09T14:00:00.000Z'));
    expect(result.timeOfDay).toBe('afternoon');
  });

  it('detects evening context', () => {
    const result = getAmbientContext(new Date('2026-03-09T18:30:00.000Z'));
    expect(result.timeOfDay).toBe('evening');
  });

  it('detects night context', () => {
    const result = getAmbientContext(new Date('2026-03-09T23:30:00.000Z'));
    expect(result.timeOfDay).toBe('night');
  });

  it('detects weekend and month boundaries', () => {
    const firstDay = getAmbientContext(new Date('2026-03-01T10:00:00.000Z'));
    expect(firstDay.isWeekend).toBe(true);
    expect(firstDay.isFirstOfMonth).toBe(true);

    const endOfMonth = getAmbientContext(new Date('2026-03-30T10:00:00.000Z'));
    expect(endOfMonth.isEndOfMonth).toBe(true);
  });

  it('detects special contexts', () => {
    expect(getAmbientContext(new Date('2026-02-10T10:00:00.000Z')).specialContext).toBe('tax_season');
    expect(getAmbientContext(new Date('2026-11-10T10:00:00.000Z')).specialContext).toBe('holiday_season');
    expect(getAmbientContext(new Date('2026-12-28T10:00:00.000Z')).specialContext).toBe('end_of_year');
    expect(getAmbientContext(new Date('2026-01-04T10:00:00.000Z')).specialContext).toBe('new_year');
  });

  describe('timezone support', () => {
    it('uses UTC when no timezone is provided', () => {
      const result = getAmbientContext(new Date('2026-01-15T23:00:00.000Z'));
      expect(result.hour).toBe(23);
      expect(result.dayOfMonth).toBe(15);
      expect(result.timeOfDay).toBe('night');
    });

    it('converts to Africa/Lagos (UTC+1): hour 23 UTC = hour 0 next day', () => {
      const result = getAmbientContext(new Date('2026-01-15T23:00:00.000Z'), 'Africa/Lagos');
      expect(result.hour).toBe(0);
      expect(result.dayOfMonth).toBe(16);
      expect(result.timeOfDay).toBe('night');
    });

    it('converts to America/New_York (UTC-5): hour 2 UTC = hour 21 previous day', () => {
      // Jan 2026 is EST (UTC-5), no DST
      const result = getAmbientContext(new Date('2026-01-15T02:00:00.000Z'), 'America/New_York');
      expect(result.hour).toBe(21);
      expect(result.dayOfMonth).toBe(14);
      expect(result.timeOfDay).toBe('night');
    });

    it('dayOfWeek reflects local midnight, not UTC midnight', () => {
      // Sat Jan 17 2026 23:30 UTC → Sun Jan 18 00:30 in Lagos (UTC+1)
      const utcResult = getAmbientContext(new Date('2026-01-17T23:30:00.000Z'));
      expect(utcResult.dayOfWeek).toBe(6); // Saturday in UTC

      const lagosResult = getAmbientContext(new Date('2026-01-17T23:30:00.000Z'), 'Africa/Lagos');
      expect(lagosResult.dayOfWeek).toBe(0); // Sunday in Lagos
      expect(lagosResult.isWeekend).toBe(true);
    });
  });
});

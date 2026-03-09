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
});

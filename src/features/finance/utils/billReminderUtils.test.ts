import { describe, it, expect } from 'vitest';
import { getUpcomingBills } from './billReminderUtils';
import type { RecurringTransaction } from '../../types';

const makeBill = (overrides: Partial<RecurringTransaction> = {}): RecurringTransaction => ({
  id: 'rt-1',
  title: 'Netflix',
  amountCents: 1599,
  type: 'expense',
  category: 'Subscriptions',
  accountId: 'acc-1',
  frequency: 'monthly',
  interval: 1,
  nextRunAt: new Date().toISOString(),
  status: 'active',
  userId: 'user-1',
  createdAt: '2025-01-01',
  ...overrides,
});

describe('getUpcomingBills', () => {
  it('returns bills due within the next 7 days', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bills = [makeBill({ nextRunAt: tomorrow.toISOString() })];
    const result = getUpcomingBills(bills, 7);
    expect(result).toHaveLength(1);
  });

  it('excludes bills due beyond the window', () => {
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 30);
    const bills = [makeBill({ nextRunAt: farFuture.toISOString() })];
    const result = getUpcomingBills(bills, 7);
    expect(result).toHaveLength(0);
  });

  it('excludes paused bills', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bills = [makeBill({ nextRunAt: tomorrow.toISOString(), status: 'paused' })];
    const result = getUpcomingBills(bills, 7);
    expect(result).toHaveLength(0);
  });

  it('sorts by due date ascending', () => {
    const d1 = new Date(); d1.setDate(d1.getDate() + 3);
    const d2 = new Date(); d2.setDate(d2.getDate() + 1);
    const bills = [
      makeBill({ id: 'a', nextRunAt: d1.toISOString() }),
      makeBill({ id: 'b', nextRunAt: d2.toISOString() }),
    ];
    const result = getUpcomingBills(bills, 7);
    expect(result[0].id).toBe('b');
    expect(result[1].id).toBe('a');
  });

  it('returns empty array for no bills', () => {
    expect(getUpcomingBills([], 7)).toEqual([]);
  });

  it('includes bills due today', () => {
    const today = new Date();
    const bills = [makeBill({ nextRunAt: today.toISOString() })];
    const result = getUpcomingBills(bills, 7);
    expect(result).toHaveLength(1);
  });
});

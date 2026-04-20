import { describe, it, expect } from 'vitest';
import {
  buildSpendingInsight,
  buildSavingsRateInsight,
  buildDayOfWeekInsight,
  buildSubscriptionInsight,
} from './financeInsights';
import type { AnchorTransaction, RecurringTransaction } from '../../../types';

const now = new Date('2026-03-20T12:00:00.000Z');

function tx(overrides: Partial<AnchorTransaction>): AnchorTransaction {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'expense',
    amountCents: 1000,
    currency: 'USD',
    category: 'Food',
    date: '2026-03-10T00:00:00.000Z',
    title: 't',
    accountId: 'a1',
    scope: 'personal',
    isSoftDeleted: false,
    ...overrides,
  } as AnchorTransaction & { [k: string]: unknown };
}

describe('financeInsights (fabric)', () => {
  describe('buildSpendingInsight', () => {
    it('returns null when there are no expenses this month', () => {
      expect(buildSpendingInsight([], now)).toBeNull();
    });

    it('builds a top-category insight with neutral trend when no prior month data', () => {
      const transactions: AnchorTransaction[] = [
        tx({ amountCents: 5000, category: 'Rent', date: '2026-03-01T00:00:00Z' }),
        tx({ amountCents: 2000, category: 'Food', date: '2026-03-05T00:00:00Z' }),
      ];
      const insight = buildSpendingInsight(transactions, now);
      expect(insight?.id).toBe('insight-spending-top-category');
      expect(insight?.headline).toContain('Rent');
      expect(insight?.trend).toBe('stable');
    });

    it('detects an upward trend compared to last month', () => {
      const transactions: AnchorTransaction[] = [
        tx({ amountCents: 10000, category: 'Food', date: '2026-03-05T00:00:00Z' }),
        tx({ amountCents: 1000, category: 'Food', date: '2026-02-05T00:00:00Z' }),
      ];
      const insight = buildSpendingInsight(transactions, now);
      expect(insight?.trend).toBe('up');
      expect(insight?.severity).toBe('attention');
    });

    it('detects a downward trend compared to last month', () => {
      const transactions: AnchorTransaction[] = [
        tx({ amountCents: 1000, category: 'Food', date: '2026-03-05T00:00:00Z' }),
        tx({ amountCents: 10000, category: 'Food', date: '2026-02-05T00:00:00Z' }),
      ];
      const insight = buildSpendingInsight(transactions, now);
      expect(insight?.trend).toBe('down');
    });
  });

  describe('buildSavingsRateInsight', () => {
    it('returns null when there is no income', () => {
      const transactions: AnchorTransaction[] = [
        tx({ type: 'expense', amountCents: 1000, date: '2026-03-05T00:00:00Z' }),
      ];
      expect(buildSavingsRateInsight(transactions, now)).toBeNull();
    });

    it('reports a positive savings rate when saving >= 20%', () => {
      const transactions: AnchorTransaction[] = [
        tx({ type: 'income', amountCents: 10000, date: '2026-03-01T00:00:00Z' }),
        tx({ type: 'expense', amountCents: 2000, date: '2026-03-02T00:00:00Z' }),
      ];
      const insight = buildSavingsRateInsight(transactions, now);
      expect(insight?.trend).toBe('up');
      expect(insight?.severity).toBe('positive');
      expect(insight?.headline).toContain('80%');
    });

    it('reports overspending when expenses exceed income', () => {
      const transactions: AnchorTransaction[] = [
        tx({ type: 'income', amountCents: 1000, date: '2026-03-01T00:00:00Z' }),
        tx({ type: 'expense', amountCents: 5000, date: '2026-03-02T00:00:00Z' }),
      ];
      const insight = buildSavingsRateInsight(transactions, now);
      expect(insight?.trend).toBe('down');
      expect(insight?.severity).toBe('attention');
      expect(insight?.headline).toMatch(/exceeds income/i);
    });

    it('reports a modest savings rate between 0% and 20% as neutral', () => {
      const transactions: AnchorTransaction[] = [
        tx({ type: 'income', amountCents: 10000, date: '2026-03-01T00:00:00Z' }),
        tx({ type: 'expense', amountCents: 9000, date: '2026-03-02T00:00:00Z' }),
      ];
      const insight = buildSavingsRateInsight(transactions, now);
      expect(insight?.trend).toBe('stable');
      expect(insight?.severity).toBe('neutral');
    });
  });

  describe('buildDayOfWeekInsight', () => {
    it('returns null when there is no spending data', () => {
      expect(buildDayOfWeekInsight([], now)).toBeNull();
    });
  });

  describe('buildSubscriptionInsight', () => {
    function sub(overrides: Partial<RecurringTransaction>): RecurringTransaction {
      return {
        id: Math.random().toString(36).slice(2),
        title: 'Netflix',
        amountCents: 1500,
        currency: 'USD',
        frequency: 'monthly',
        type: 'expense',
        status: 'active',
        ...overrides,
      } as RecurringTransaction;
    }

    it('returns null when no active monthly expense subscriptions', () => {
      expect(buildSubscriptionInsight([], 'USD', now)).toBeNull();
      const cancelled = [sub({ status: 'cancelled' as any })];
      expect(buildSubscriptionInsight(cancelled, 'USD', now)).toBeNull();
    });

    it('summarises a short list of subscriptions inline', () => {
      const list = [sub({ title: 'Netflix' }), sub({ title: 'Spotify' })];
      const insight = buildSubscriptionInsight(list, 'USD', now);
      expect(insight?.detail).toContain('Netflix');
      expect(insight?.detail).toContain('Spotify');
      expect(insight?.headline).toContain('2 active subscriptions');
    });

    it('collapses long subscription lists', () => {
      const list = [
        sub({ title: 'A' }),
        sub({ title: 'B' }),
        sub({ title: 'C' }),
        sub({ title: 'D' }),
        sub({ title: 'E' }),
      ];
      const insight = buildSubscriptionInsight(list, 'USD', now);
      expect(insight?.detail).toMatch(/Including .* and 2 more/);
    });
  });
});

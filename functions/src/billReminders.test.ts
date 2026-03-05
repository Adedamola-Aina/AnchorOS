import { describe, it, expect, vi } from 'vitest';
import { shouldSendBillReminder, buildBillReminderMessage, getBillsDueSoon } from './billReminders';
import type { RecurringTransaction } from './types';

describe('billReminders', () => {
    const baseRule: RecurringTransaction = {
        id: 'rule-1',
        title: 'Rent Payment',
        amountCents: 500000,
        type: 'expense',
        category: 'Housing',
        accountId: 'acc-1',
        frequency: 'monthly',
        interval: 1,
        nextRunAt: '2026-03-06T00:00:00.000Z', // tomorrow
        status: 'active',
        userId: 'user-1',
        createdAt: '2026-01-01T00:00:00.000Z',
    };

    describe('getBillsDueSoon', () => {
        it('returns bills due within the next 24 hours', () => {
            const now = new Date('2026-03-05T12:00:00.000Z');
            const rules: RecurringTransaction[] = [
                { ...baseRule, nextRunAt: '2026-03-06T00:00:00.000Z' }, // 12h away — include
                { ...baseRule, id: 'rule-2', nextRunAt: '2026-03-07T00:00:00.000Z' }, // 36h away — exclude
                { ...baseRule, id: 'rule-3', nextRunAt: '2026-03-04T00:00:00.000Z' }, // past — exclude
            ];

            const dueSoon = getBillsDueSoon(rules, now);
            expect(dueSoon).toHaveLength(1);
            expect(dueSoon[0].id).toBe('rule-1');
        });

        it('excludes paused rules', () => {
            const now = new Date('2026-03-05T12:00:00.000Z');
            const rules: RecurringTransaction[] = [
                { ...baseRule, status: 'paused' },
            ];

            expect(getBillsDueSoon(rules, now)).toHaveLength(0);
        });

        it('excludes income type rules', () => {
            const now = new Date('2026-03-05T12:00:00.000Z');
            const rules: RecurringTransaction[] = [
                { ...baseRule, type: 'income' },
            ];

            expect(getBillsDueSoon(rules, now)).toHaveLength(0);
        });
    });

    describe('buildBillReminderMessage', () => {
        it('formats single bill reminder', () => {
            const msg = buildBillReminderMessage([baseRule]);
            expect(msg.title).toContain('Bill Due');
            expect(msg.body).toContain('Rent Payment');
        });

        it('formats multiple bill reminders', () => {
            const rules = [
                baseRule,
                { ...baseRule, id: 'rule-2', title: 'Netflix' },
                { ...baseRule, id: 'rule-3', title: 'Gym' },
            ];
            const msg = buildBillReminderMessage(rules);
            expect(msg.title).toContain('3');
            expect(msg.body).toContain('Rent Payment');
        });
    });

    describe('shouldSendBillReminder', () => {
        it('returns true when no dedup marker exists', () => {
            expect(shouldSendBillReminder('rule-1', undefined, '2026-03-05')).toBe(true);
        });

        it('returns false when already reminded today', () => {
            expect(shouldSendBillReminder('rule-1', '2026-03-05', '2026-03-05')).toBe(false);
        });

        it('returns true when last reminder was a different day', () => {
            expect(shouldSendBillReminder('rule-1', '2026-03-04', '2026-03-05')).toBe(true);
        });
    });
});

import { describe, expect, it } from 'vitest';
import { buildReminderDeliveryKey, shouldSkipReminderDelivery } from './reminderDedupe';

describe('reminderDedupe', () => {
    it('builds stable dedupe key independent of title order', () => {
        const keyA = buildReminderDeliveryKey('2026-03-05', '08:30', ['Read', 'Walk']);
        const keyB = buildReminderDeliveryKey('2026-03-05', '08:30', ['Walk', 'Read']);

        expect(keyA).toBe(keyB);
    });

    it('returns false when previous key differs', () => {
        const current = buildReminderDeliveryKey('2026-03-05', '08:30', ['Read']);

        const shouldSkip = shouldSkipReminderDelivery({
            previousKey: '2026-03-05|08:30|Other',
            previousSentAt: '2026-03-05T08:31:00.000Z',
            currentKey: current,
            nowMs: Date.parse('2026-03-05T08:33:00.000Z'),
            windowMs: 10 * 60 * 1000,
        });

        expect(shouldSkip).toBe(false);
    });

    it('returns true when same key was recently sent in dedupe window', () => {
        const current = buildReminderDeliveryKey('2026-03-05', '08:30', ['Read']);

        const shouldSkip = shouldSkipReminderDelivery({
            previousKey: current,
            previousSentAt: '2026-03-05T08:30:30.000Z',
            currentKey: current,
            nowMs: Date.parse('2026-03-05T08:34:00.000Z'),
            windowMs: 10 * 60 * 1000,
        });

        expect(shouldSkip).toBe(true);
    });

    it('returns false when same key exists but window already elapsed', () => {
        const current = buildReminderDeliveryKey('2026-03-05', '08:30', ['Read']);

        const shouldSkip = shouldSkipReminderDelivery({
            previousKey: current,
            previousSentAt: '2026-03-05T08:00:00.000Z',
            currentKey: current,
            nowMs: Date.parse('2026-03-05T08:30:00.000Z'),
            windowMs: 10 * 60 * 1000,
        });

        expect(shouldSkip).toBe(false);
    });
});

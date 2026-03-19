/**
 * SubscriptionDetector — INN-002
 *
 * Tests for recurring subscription detection from transaction history.
 */

import { describe, it, expect } from 'vitest';
import { detectSubscriptions, normalizeTitle } from './SubscriptionDetector';
import type { AnchorTransaction } from '../../types';

function makeTx(id: string, title: string, amountCents: number, date: string): AnchorTransaction {
    return { id, title, amountCents, type: 'expense', date, accountId: 'acc1' } as AnchorTransaction;
}

describe('SubscriptionDetector', () => {
    describe('normalizeTitle', () => {
        it('lowercases and strips common billing suffixes', () => {
            expect(normalizeTitle('Netflix.com')).toBe('netflix');
            expect(normalizeTitle('SPOTIFY PREMIUM')).toBe('spotify premium');
            expect(normalizeTitle('Apple.com/bill')).toBe('applebill');
        });

        it('strips asterisks and extra whitespace', () => {
            expect(normalizeTitle('*PRIME VIDEO')).toBe('prime video');
        });
    });

    describe('detectSubscriptions', () => {
        it('detects monthly recurring expense with same amount', () => {
            const transactions: AnchorTransaction[] = [
                makeTx('1', 'Netflix', 1600, '2025-01-10'),
                makeTx('2', 'Netflix', 1600, '2025-02-10'),
                makeTx('3', 'Netflix', 1600, '2025-03-10'),
                makeTx('4', 'Netflix', 1600, '2025-04-10'),
            ];
            const subs = detectSubscriptions(transactions);
            expect(subs).toHaveLength(1);
            expect(subs[0].title).toContain('netflix');
            expect(subs[0].amountCents).toBe(1600);
            expect(subs[0].frequency).toBe('monthly');
            expect(subs[0].confidence).toBeGreaterThan(0.7);
        });

        it('does not flag a transaction that only appears once', () => {
            const transactions = [makeTx('1', 'One-off', 5000, '2025-01-10')];
            expect(detectSubscriptions(transactions)).toHaveLength(0);
        });

        it('does not flag non-periodic payments (irregular)', () => {
            const transactions: AnchorTransaction[] = [
                makeTx('1', 'Random charge', 1000, '2025-01-01'),
                makeTx('2', 'Random charge', 1000, '2025-01-20'),
                makeTx('3', 'Random charge', 1000, '2025-03-14'),
            ];
            expect(detectSubscriptions(transactions)).toHaveLength(0);
        });

        it('detects annual subscription (365-day interval)', () => {
            const transactions: AnchorTransaction[] = [
                makeTx('1', 'Adobe Annual', 60000, '2024-01-15'),
                makeTx('2', 'Adobe Annual', 60000, '2025-01-15'),
                makeTx('3', 'Adobe Annual', 60000, '2026-01-15'),
            ];
            const subs = detectSubscriptions(transactions);
            expect(subs).toHaveLength(1);
            expect(subs[0].frequency).toBe('annual');
        });

        it('handles ±5 day tolerance for monthly subscriptions', () => {
            const transactions: AnchorTransaction[] = [
                makeTx('1', 'Spotify', 900, '2025-01-05'),
                makeTx('2', 'Spotify', 900, '2025-02-03'), // 29 days later
                makeTx('3', 'Spotify', 900, '2025-03-07'), // 32 days later
                makeTx('4', 'Spotify', 900, '2025-04-04'), // 28 days later
            ];
            const subs = detectSubscriptions(transactions);
            expect(subs).toHaveLength(1);
            expect(subs[0].frequency).toBe('monthly');
        });

        it('returns next expected date', () => {
            const transactions: AnchorTransaction[] = [
                makeTx('1', 'Canva', 1200, '2025-01-01'),
                makeTx('2', 'Canva', 1200, '2025-02-01'),
                makeTx('3', 'Canva', 1200, '2025-03-01'),
            ];
            const subs = detectSubscriptions(transactions);
            expect(subs[0].nextExpectedDate).toBeTruthy();
        });
    });
});

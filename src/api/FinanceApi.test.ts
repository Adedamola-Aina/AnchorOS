/**
 * Tests for FinanceApi.ts — subscription methods and search
 * Target: 85%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { FinanceApi } from './FinanceApi';

describe('FinanceApi', () => {
    let api: FinanceApi;
    const mockUnsubscribe = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset singleton for clean tests
        (FinanceApi as any).instance = undefined;
        api = FinanceApi.getInstance();

        vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
    });

    // ── Singleton ────────────────────────────────────────────────────
    describe('getInstance', () => {
        it('returns the same instance', () => {
            const a = FinanceApi.getInstance();
            const b = FinanceApi.getInstance();
            expect(a).toBe(b);
        });
    });

    // ── subscribeToTransactions ──────────────────────────────────────
    describe('subscribeToTransactions', () => {
        it('sets up a Firestore snapshot listener with date range', () => {
            const onData = vi.fn();
            const onError = vi.fn();

            const unsub = api.subscribeToTransactions('u1', '2026-01-01', '2026-01-31', onData, onError);

            expect(collection).toHaveBeenCalled();
            expect(where).toHaveBeenCalledWith('date', '>=', '2026-01-01');
            expect(where).toHaveBeenCalledWith('date', '<=', '2026-01-31');
            expect(orderBy).toHaveBeenCalledWith('date', 'desc');
            expect(limit).toHaveBeenCalledWith(500);
            expect(onSnapshot).toHaveBeenCalled();
            expect(unsub).toBe(mockUnsubscribe);
        });

        it('maps snapshot docs through onData callback', () => {
            let snapshotCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, onNext: any) => {
                snapshotCallback = onNext;
                return mockUnsubscribe;
            });

            const onData = vi.fn();
            api.subscribeToTransactions('u1', '2026-01-01', '2026-01-31', onData, vi.fn());

            // Simulate snapshot
            snapshotCallback({
                docs: [
                    { id: 'tx-1', data: () => ({ title: 'Lunch', amountCents: 1500 }) },
                    { id: 'tx-2', data: () => ({ title: 'Gas', amountCents: 5000 }) },
                ],
            });

            expect(onData).toHaveBeenCalledWith([
                { id: 'tx-1', title: 'Lunch', amountCents: 1500 },
                { id: 'tx-2', title: 'Gas', amountCents: 5000 },
            ]);
        });

        it('calls onError on snapshot error', () => {
            let errorCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, _onNext: any, onErr: any) => {
                errorCallback = onErr;
                return mockUnsubscribe;
            });

            const onError = vi.fn();
            api.subscribeToTransactions('u1', '2026-01-01', '2026-01-31', vi.fn(), onError);

            const error = new Error('snapshot failed');
            errorCallback(error);
            expect(onError).toHaveBeenCalledWith(error);
        });
    });

    // ── subscribeToAccounts ─────────────────────────────────────────
    describe('subscribeToAccounts', () => {
        it('sets up account listener with limit', () => {
            api.subscribeToAccounts('u1', vi.fn(), vi.fn());
            expect(limit).toHaveBeenCalledWith(50);
            expect(onSnapshot).toHaveBeenCalled();
        });

        it('adds default ownerId when missing', () => {
            let snapshotCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, onNext: any) => {
                snapshotCallback = onNext;
                return mockUnsubscribe;
            });

            const onData = vi.fn();
            api.subscribeToAccounts('u1', onData, vi.fn());

            snapshotCallback({
                docs: [{ id: 'a1', data: () => ({ name: 'Checking' }) }],
            });

            expect(onData).toHaveBeenCalledWith([
                expect.objectContaining({ id: 'a1', name: 'Checking', ownerId: 'u1' }),
            ]);
        });

        it('preserves existing ownerId', () => {
            let snapshotCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, onNext: any) => {
                snapshotCallback = onNext;
                return mockUnsubscribe;
            });

            const onData = vi.fn();
            api.subscribeToAccounts('u1', onData, vi.fn());

            snapshotCallback({
                docs: [{ id: 'a1', data: () => ({ name: 'Shared', ownerId: 'other-user' }) }],
            });

            expect(onData).toHaveBeenCalledWith([
                expect.objectContaining({ ownerId: 'other-user' }),
            ]);
        });
    });

    // ── subscribeToRecentTransactions ────────────────────────────────
    describe('subscribeToRecentTransactions', () => {
        it('sets up listener with custom limit', () => {
            api.subscribeToRecentTransactions('u1', 25, vi.fn(), vi.fn());
            expect(limit).toHaveBeenCalledWith(25);
            expect(orderBy).toHaveBeenCalledWith('date', 'desc');
        });
    });

    // ── searchTransactions ──────────────────────────────────────────
    describe('searchTransactions', () => {
        it('searches without optional filters', () => {
            api.searchTransactions('u1', {}, vi.fn(), vi.fn());
            expect(onSnapshot).toHaveBeenCalled();
            // Should use default limit of 50
            expect(limit).toHaveBeenCalledWith(50);
        });

        it('applies category filter when provided', () => {
            api.searchTransactions('u1', { category: 'Food' }, vi.fn(), vi.fn());
            expect(where).toHaveBeenCalledWith('category', '==', 'Food');
        });

        it('applies type filter when provided', () => {
            api.searchTransactions('u1', { type: 'income' }, vi.fn(), vi.fn());
            expect(where).toHaveBeenCalledWith('type', '==', 'income');
        });

        it('applies minAmount filter when provided', () => {
            api.searchTransactions('u1', { minAmount: 1000 }, vi.fn(), vi.fn());
            expect(where).toHaveBeenCalledWith('amountCents', '>=', 1000);
        });

        it('applies maxAmount filter when provided', () => {
            api.searchTransactions('u1', { maxAmount: 50000 }, vi.fn(), vi.fn());
            expect(where).toHaveBeenCalledWith('amountCents', '<=', 50000);
        });

        it('applies all filters together', () => {
            api.searchTransactions('u1', {
                category: 'Transport',
                type: 'expense',
                minAmount: 100,
                maxAmount: 5000,
                limit: 10,
            }, vi.fn(), vi.fn());

            expect(where).toHaveBeenCalledWith('category', '==', 'Transport');
            expect(where).toHaveBeenCalledWith('type', '==', 'expense');
            expect(where).toHaveBeenCalledWith('amountCents', '>=', 100);
            expect(where).toHaveBeenCalledWith('amountCents', '<=', 5000);
            expect(limit).toHaveBeenCalledWith(10);
        });

        it('uses custom limit when provided', () => {
            api.searchTransactions('u1', { limit: 200 }, vi.fn(), vi.fn());
            expect(limit).toHaveBeenCalledWith(200);
        });
    });
});

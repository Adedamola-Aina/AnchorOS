/**
 * Tests for RecurringApi.ts — CRUD + subscription
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { RecurringApi } from './RecurringApi';

const mockCallable = vi.fn();

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(() => mockCallable),
}));

describe('RecurringApi', () => {
    let api: RecurringApi;
    const mockUnsubscribe = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (RecurringApi as { instance?: RecurringApi }).instance = undefined;
        api = RecurringApi.getInstance();
        vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
        mockCallable.mockResolvedValue({ data: { id: 'new-rec-1', success: true, status: 'paused' } });
    });

    describe('getInstance', () => {
        it('returns the same instance', () => {
            expect(RecurringApi.getInstance()).toBe(api);
        });
    });

    // ── subscribeToRecurring ────────────────────────────────────────
    describe('subscribeToRecurring', () => {
        it('sets up snapshot listener', () => {
            const unsub = api.subscribeToRecurring('u1', vi.fn(), vi.fn());
            expect(onSnapshot).toHaveBeenCalled();
            expect(unsub).toBe(mockUnsubscribe);
        });

        it('maps snapshot docs through onData', () => {
            let snapshotCallback: (snap: unknown) => void = () => {};
            vi.mocked(onSnapshot).mockImplementation((_q, _options, onNext) => {
                snapshotCallback = onNext as (snap: unknown) => void;
                return mockUnsubscribe;
            });

            const onData = vi.fn();
            api.subscribeToRecurring('u1', onData, vi.fn());

            snapshotCallback({
                docs: [
                    { id: 'rec-1', data: () => ({ title: 'Rent', frequency: 'monthly' }) },
                ],
            });

            expect(onData).toHaveBeenCalledWith([
                { id: 'rec-1', title: 'Rent', frequency: 'monthly' },
            ]);
        });

        it('calls onError on snapshot failure', () => {
            let errorCallback: (err: Error) => void = () => {};
            vi.mocked(onSnapshot).mockImplementation((_q, _options, _onNext, onErr) => {
                errorCallback = onErr as (err: Error) => void;
                return mockUnsubscribe;
            });

            const onError = vi.fn();
            api.subscribeToRecurring('u1', vi.fn(), onError);

            errorCallback(new Error('fail'));
            expect(onError).toHaveBeenCalled();
        });
    });

    // ── createRecurring ─────────────────────────────────────────────
    describe('createRecurring', () => {
        it('calls createRecurringTransaction callable and returns ID', async () => {
            const data = { title: 'Rent', amountCents: 5000, type: 'expense', category: 'Housing',
                accountId: 'acc-1', frequency: 'monthly', interval: 1, nextRunAt: new Date().toISOString(),
                status: 'active', userId: 'u1', createdAt: new Date().toISOString() } as const;
            const newId = await api.createRecurring(data);
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'createRecurringTransaction');
            expect(newId).toBe('new-rec-1');
        });
    });

    // ── updateRecurring ─────────────────────────────────────────────
    describe('updateRecurring', () => {
        it('calls updateRecurringTransaction callable with id + updates', async () => {
            await api.updateRecurring('rec-1', { status: 'paused' });
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'updateRecurringTransaction');
            expect(mockCallable).toHaveBeenCalledWith({ id: 'rec-1', status: 'paused' });
        });
    });

    // ── deleteRecurring ─────────────────────────────────────────────
    describe('deleteRecurring', () => {
        it('calls deleteRecurringTransaction callable with id', async () => {
            await api.deleteRecurring('rec-1');
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'deleteRecurringTransaction');
            expect(mockCallable).toHaveBeenCalledWith({ id: 'rec-1' });
        });
    });

    // ── toggleRecurring ─────────────────────────────────────────────
    describe('toggleRecurring', () => {
        it('calls toggleRecurringTransaction callable with id and status', async () => {
            await api.toggleRecurring('rec-1', 'paused');
            expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), 'toggleRecurringTransaction');
            expect(mockCallable).toHaveBeenCalledWith({ id: 'rec-1', status: 'paused' });
        });
    });
});

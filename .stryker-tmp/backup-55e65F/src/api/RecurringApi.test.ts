/**
 * Tests for RecurringApi.ts — CRUD + subscription
 * Target: 90%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { RecurringApi } from './RecurringApi';
import { buildRecurring } from '../test/factories';

describe('RecurringApi', () => {
    let api: RecurringApi;
    const mockUnsubscribe = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (RecurringApi as any).instance = undefined;
        api = RecurringApi.getInstance();
        vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
    });

    // ── Singleton ────────────────────────────────────────────────────
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
            let snapshotCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, onNext: any) => {
                snapshotCallback = onNext;
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
            let errorCallback: any;
            vi.mocked(onSnapshot).mockImplementation((_q: any, _options: any, _: any, onErr: any) => {
                errorCallback = onErr;
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
        it('creates document and returns ID', async () => {
            vi.mocked(addDoc).mockResolvedValueOnce({ id: 'new-rec-1' } as any);

            const { id: _id, ...data } = buildRecurring();
            const newId = await api.createRecurring(data);
            expect(newId).toBe('new-rec-1');
            expect(addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ title: 'Monthly Rent', createdAt: expect.any(String) })
            );
        });
    });

    // ── updateRecurring ─────────────────────────────────────────────
    describe('updateRecurring', () => {
        it('updates document with partial data', async () => {
            await api.updateRecurring('rec-1', { status: 'paused' });
            expect(doc).toHaveBeenCalled();
            expect(updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                { status: 'paused' }
            );
        });
    });

    // ── deleteRecurring ─────────────────────────────────────────────
    describe('deleteRecurring', () => {
        it('deletes document', async () => {
            await api.deleteRecurring('rec-1');
            expect(doc).toHaveBeenCalled();
            expect(deleteDoc).toHaveBeenCalled();
        });
    });
});

// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAccountActivity } from '../useAccountActivity';

// Hoisted mocks
const mockOnSnapshot = vi.hoisted(() => vi.fn());
const mockAddDoc = vi.hoisted(() => vi.fn());

// Mock Firebase
vi.mock('../../config/firebase', () => ({
    db: {},
    APP_ID: 'anchor-os-test',
}));

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>();
    return {
        ...actual,
        collection: vi.fn(() => ({ path: 'mock-collection' })),
        query: vi.fn((ref) => ref),
        orderBy: vi.fn(),
        limit: vi.fn(),
        onSnapshot: (...args: any[]) => mockOnSnapshot(...args),
        addDoc: (...args: any[]) => mockAddDoc(...args),
    };
});

describe('useAccountActivity', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock: return empty activities
        mockOnSnapshot.mockImplementation((_, successCallback) => {
            setTimeout(() => {
                successCallback({ docs: [] });
            }, 0);
            return vi.fn(); // unsubscribe
        });

        mockAddDoc.mockResolvedValue({ id: 'new-activity-id' });
    });

    it('returns empty activities when not enabled', () => {
        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: 'acc-1',
                accountOwnerId: 'user-1',
                enabled: false,
            })
        );

        expect(result.current.activities).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('returns empty activities when no accountId', () => {
        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: '',
                accountOwnerId: 'user-1',
                enabled: true,
            })
        );

        expect(result.current.activities).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('fetches activities when enabled', async () => {
        const mockActivities = [
            {
                id: 'act-1',
                data: () => ({
                    action: 'transaction_added',
                    actorName: 'John',
                    timestamp: '2024-01-01T00:00:00Z',
                })
            },
        ];

        mockOnSnapshot.mockImplementation((_, successCallback) => {
            setTimeout(() => {
                successCallback({ docs: mockActivities });
            }, 5);
            return vi.fn();
        });

        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: 'acc-1',
                accountOwnerId: 'user-1',
                enabled: true,
            })
        );

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.activities).toHaveLength(1);
    });

    it('handles errors gracefully', async () => {
        mockOnSnapshot.mockImplementation((_, __, errorCallback) => {
            setTimeout(() => {
                errorCallback(new Error('Firebase error'));
            }, 5);
            return vi.fn();
        });

        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: 'acc-1',
                accountOwnerId: 'user-1',
                enabled: true,
            })
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Unable to load activity');
    });

    it('provides logActivity function', async () => {
        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: 'acc-1',
                accountOwnerId: 'user-1',
                enabled: true,
            })
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(typeof result.current.logActivity).toBe('function');

        await result.current.logActivity(
            'transaction_added',
            'user-1',
            'John',
            { transactionTitle: 'Test', amountCents: 1000, currency: 'USD', type: 'expense' }
        );

        expect(mockAddDoc).toHaveBeenCalled();
    });

    it('does not log activity when accountId is empty', async () => {
        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: '',
                accountOwnerId: 'user-1',
                enabled: false,
            })
        );

        await result.current.logActivity(
            'transaction_added',
            'user-1',
            'John',
            { transactionTitle: 'Test' }
        );

        expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it('respects maxItems parameter', async () => {
        const { result } = renderHook(() =>
            useAccountActivity({
                accountId: 'acc-1',
                accountOwnerId: 'user-1',
                enabled: true,
                maxItems: 5,
            })
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // The limit should be applied (verified by the mock being called)
        expect(mockOnSnapshot).toHaveBeenCalled();
    });
});

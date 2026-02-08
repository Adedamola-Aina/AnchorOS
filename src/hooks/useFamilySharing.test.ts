/**
 * useFamilySharing — account sharing hook
 * Target: 80%+ coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { httpsCallable, getFunctions } from 'firebase/functions';

// ── Firebase mocks ────────────────────────────────────────────────
vi.mock('../config/firebase', () => ({
    db: {},
    APP_ID: 'test-app',
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(() => 'col-ref'),
    query: vi.fn(() => 'q-ref'),
    where: vi.fn(() => 'w-ref'),
    onSnapshot: vi.fn(),
}));

vi.mock('firebase/functions', () => ({
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(),
}));

const mockShowToast = vi.fn();
vi.mock('../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockShowToast }),
}));

import { useFamilySharing } from './useFamilySharing';

describe('useFamilySharing', () => {
    let ownerCallback: ((snap: any) => void) | null = null;
    let memberCallback: ((snap: any) => void) | null = null;
    const unsubOwner = vi.fn();
    const unsubMember = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        ownerCallback = null;
        memberCallback = null;

        // onSnapshot is called twice: once for owner query, once for member query
        let callCount = 0;
        vi.mocked(onSnapshot).mockImplementation((_ref: any, cb: any) => {
            if (callCount === 0) {
                ownerCallback = cb;
                callCount++;
                return unsubOwner;
            } else {
                memberCallback = cb;
                callCount++;
                return unsubMember;
            }
        });
    });

    it('returns loading=true initially', () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));
        expect(result.current.loading).toBe(true);
        expect(result.current.connection).toBeNull();
    });

    it('returns loading=false when no userId', () => {
        const { result } = renderHook(() => useFamilySharing(undefined));
        expect(result.current.loading).toBe(false);
    });

    it('detects owner connection from snapshot', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        act(() => {
            ownerCallback?.({
                empty: false,
                docs: [{
                    id: 'conn-1',
                    data: () => ({
                        ownerUid: 'user-1',
                        memberUid: 'user-2',
                        memberDisplayName: 'Spouse',
                        ownerDisplayName: 'Me',
                        status: 'active',
                    }),
                }],
            });
        });

        await waitFor(() => {
            expect(result.current.connection).toBeTruthy();
            expect(result.current.isOwner).toBe(true);
            expect(result.current.familyMemberUid).toBe('user-2');
            expect(result.current.familyMemberName).toBe('Spouse');
            expect(result.current.loading).toBe(false);
        });
    });

    it('detects member connection from snapshot', async () => {
        const { result } = renderHook(() => useFamilySharing('user-2'));

        // Empty owner query
        act(() => { ownerCallback?.({ empty: true, docs: [] }); });

        // Member query has data
        act(() => {
            memberCallback?.({
                empty: false,
                docs: [{
                    id: 'conn-1',
                    data: () => ({
                        ownerUid: 'user-1',
                        memberUid: 'user-2',
                        memberDisplayName: 'Spouse',
                        ownerDisplayName: 'Me',
                        status: 'active',
                    }),
                }],
            });
        });

        await waitFor(() => {
            expect(result.current.connection).toBeTruthy();
            expect(result.current.isOwner).toBe(false);
            expect(result.current.familyMemberUid).toBe('user-1');
            expect(result.current.familyMemberName).toBe('Me');
        });
    });

    it('clears connection when owner snapshot becomes empty', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        act(() => {
            ownerCallback?.({
                empty: false,
                docs: [{
                    id: 'conn-1',
                    data: () => ({
                        ownerUid: 'user-1',
                        memberUid: 'user-2',
                        memberDisplayName: 'Spouse',
                        ownerDisplayName: 'Me',
                        status: 'active',
                    }),
                }],
            });
        });

        expect(result.current.connection).toBeTruthy();

        act(() => { ownerCallback?.({ empty: true, docs: [] }); });

        await waitFor(() => {
            expect(result.current.connection).toBeNull();
        });
    });

    it('shareAccount calls Cloud Function and shows toast', async () => {
        const mockCallable = vi.fn().mockResolvedValue({ data: { success: true } });
        vi.mocked(httpsCallable).mockReturnValue(mockCallable);

        const { result } = renderHook(() => useFamilySharing('user-1'));

        // Set up connection
        act(() => {
            ownerCallback?.({
                empty: false,
                docs: [{
                    id: 'conn-1',
                    data: () => ({
                        ownerUid: 'user-1',
                        memberUid: 'user-2',
                        memberDisplayName: 'S',
                        ownerDisplayName: 'M',
                        status: 'active',
                    }),
                }],
            });
        });

        await act(async () => {
            await result.current.shareAccount('acc-1', true);
        });

        expect(mockCallable).toHaveBeenCalledWith({ accountId: 'acc-1', share: true });
        expect(mockShowToast).toHaveBeenCalledWith('Account shared with family', 'success');
    });

    it('shareAccount does nothing without connection', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        await act(async () => {
            await result.current.shareAccount('acc-1', true);
        });

        expect(httpsCallable).not.toHaveBeenCalled();
    });

    it('shareAccount shows error offline', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        // Set up connection
        act(() => {
            ownerCallback?.({
                empty: false,
                docs: [{
                    id: 'conn-1',
                    data: () => ({ ownerUid: 'user-1', memberUid: 'u2', memberDisplayName: 'S', ownerDisplayName: 'M', status: 'active' }),
                }],
            });
        });

        // Go offline
        Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

        await act(async () => {
            await result.current.shareAccount('acc-1', true);
        });

        expect(mockShowToast).toHaveBeenCalledWith(
            'You are offline. Please reconnect and try again.',
            'error'
        );

        // Restore
        Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    });

    it('disconnectFamily calls Cloud Function', async () => {
        const mockCallable = vi.fn().mockResolvedValue({ data: { success: true } });
        vi.mocked(httpsCallable).mockReturnValue(mockCallable);

        const { result } = renderHook(() => useFamilySharing('user-1'));

        await act(async () => {
            await result.current.disconnectFamily('leave');
        });

        expect(mockCallable).toHaveBeenCalledWith({ type: 'leave' });
        expect(mockShowToast).toHaveBeenCalledWith('Family connection removed', 'success');
    });

    it('disconnectFamily shows error offline', async () => {
        Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

        const { result } = renderHook(() => useFamilySharing('user-1'));

        await act(async () => {
            await result.current.disconnectFamily('leave');
        });

        expect(mockShowToast).toHaveBeenCalledWith(
            'You are offline. Please reconnect and try again.',
            'error'
        );

        Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    });

    it('unsubscribes both listeners on unmount', () => {
        const { unmount } = renderHook(() => useFamilySharing('user-1'));
        unmount();
        expect(unsubOwner).toHaveBeenCalled();
        expect(unsubMember).toHaveBeenCalled();
    });
});

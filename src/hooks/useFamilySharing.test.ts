/**
 * useFamilySharing — account sharing hook
 * Target: 80%+ coverage
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

const {
    mockSubscribeToActiveFamilyConnection,
    mockShareFamilyAccount,
    mockDisconnectFamilyConnection,
} = vi.hoisted(() => ({
    mockSubscribeToActiveFamilyConnection: vi.fn(),
    mockShareFamilyAccount: vi.fn(),
    mockDisconnectFamilyConnection: vi.fn(),
}));

vi.mock('../api/FamilyConnectionApi', () => ({
    subscribeToActiveFamilyConnection: mockSubscribeToActiveFamilyConnection,
    shareFamilyAccount: mockShareFamilyAccount,
    disconnectFamilyConnection: mockDisconnectFamilyConnection,
}));

const mockShowToast = vi.fn();
vi.mock('../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockShowToast }),
}));

import { useFamilySharing } from './useFamilySharing';

describe('useFamilySharing', () => {
    let onDataCallback: ((connection: any) => void) | null = null;
    let onLoadedCallback: (() => void) | null = null;
    const unsubscribe = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        onDataCallback = null;
        onLoadedCallback = null;

        mockSubscribeToActiveFamilyConnection.mockImplementation((_userId: string, onData: any, onLoaded: any) => {
            onDataCallback = onData;
            onLoadedCallback = onLoaded;
            return unsubscribe;
        });

        mockShareFamilyAccount.mockResolvedValue(undefined);
        mockDisconnectFamilyConnection.mockResolvedValue(undefined);
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
            onDataCallback?.({
                    id: 'conn-1',
                    ownerUid: 'user-1',
                    memberUid: 'user-2',
                    memberDisplayName: 'Spouse',
                    ownerDisplayName: 'Me',
                    status: 'active',
            });
            onLoadedCallback?.();
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

        act(() => {
            onDataCallback?.({
                    id: 'conn-1',
                    ownerUid: 'user-1',
                    memberUid: 'user-2',
                    memberDisplayName: 'Spouse',
                    ownerDisplayName: 'Me',
                    status: 'active',
            });
            onLoadedCallback?.();
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
            onDataCallback?.({
                    id: 'conn-1',
                    ownerUid: 'user-1',
                    memberUid: 'user-2',
                    memberDisplayName: 'Spouse',
                    ownerDisplayName: 'Me',
                    status: 'active',
            });
            onLoadedCallback?.();
        });

        expect(result.current.connection).toBeTruthy();

        act(() => { onDataCallback?.(null); });

        await waitFor(() => {
            expect(result.current.connection).toBeNull();
        });
    });

    it('shareAccount calls Cloud Function and shows toast', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        // Set up connection
        act(() => {
            onDataCallback?.({
                    id: 'conn-1',
                    ownerUid: 'user-1',
                    memberUid: 'user-2',
                    memberDisplayName: 'S',
                    ownerDisplayName: 'M',
                    status: 'active',
            });
            onLoadedCallback?.();
        });

        await act(async () => {
            await result.current.shareAccount('acc-1', true);
        });

        expect(mockShareFamilyAccount).toHaveBeenCalledWith('acc-1', true);
        expect(mockShowToast).toHaveBeenCalledWith('Account shared with family', 'success');
    });

    it('shareAccount does nothing without connection', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        await act(async () => {
            await result.current.shareAccount('acc-1', true);
        });

        expect(mockShareFamilyAccount).not.toHaveBeenCalled();
    });

    it('shareAccount shows error offline', async () => {
        const { result } = renderHook(() => useFamilySharing('user-1'));

        // Set up connection
        act(() => {
            onDataCallback?.({
                id: 'conn-1',
                ownerUid: 'user-1',
                memberUid: 'u2',
                memberDisplayName: 'S',
                ownerDisplayName: 'M',
                status: 'active',
            });
            onLoadedCallback?.();
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
        const { result } = renderHook(() => useFamilySharing('user-1'));

        await act(async () => {
            await result.current.disconnectFamily('leave');
        });

        expect(mockDisconnectFamilyConnection).toHaveBeenCalledWith('leave');
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
        expect(unsubscribe).toHaveBeenCalled();
    });
});

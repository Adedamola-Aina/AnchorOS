// @ts-nocheck
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
    messaging: {},
    getMessagingInstance: () => Promise.resolve({}),
    auth: { currentUser: { uid: 'user-1' } },
    onMessageCallback: undefined as ((payload: Record<string, unknown>) => void) | undefined,
    onMessageUnsubscribe: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
    getMessagingInstance: () => Promise.resolve(mockState.messaging),
    auth: mockState.auth,
}));

vi.mock('firebase/messaging', () => ({
    onMessage: vi.fn((_messaging: unknown, callback: (payload: Record<string, unknown>) => void) => {
        mockState.onMessageCallback = callback;
        return mockState.onMessageUnsubscribe;
    }),
    deleteToken: vi.fn(),
}));

vi.mock('../services/fcmTokenService', () => ({
    getFcmTokenWithRetry: vi.fn(),
}));

vi.mock('../utils/error', () => ({
    captureError: vi.fn(),
}));

vi.mock('../api/PushTokenApi', () => ({
    upsertPushToken: vi.fn(),
    deleteStoredPushToken: vi.fn(),
}));
vi.mock('../utils/appBadge', () => ({
    setAppBadgeCount: vi.fn(),
}));

import { deleteToken, onMessage } from 'firebase/messaging';
import { deleteStoredPushToken, upsertPushToken } from '../api/PushTokenApi';
import { getFcmTokenWithRetry } from '../services/fcmTokenService';
import { captureError } from '../utils/error';
import { setAppBadgeCount } from '../utils/appBadge';
import { usePushNotifications } from './usePushNotifications';

describe('usePushNotifications', () => {
    const requestPermissionMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Hermetic: CI has no .env file; the hook guards on this key
        vi.stubEnv('VITE_FIREBASE_VAPID_KEY', 'test-vapid-key');
        localStorage.clear();
        mockState.messaging = {};
        mockState.auth.currentUser = { uid: 'user-1' };
        mockState.onMessageCallback = undefined;
        requestPermissionMock.mockResolvedValue('granted');

        Object.defineProperty(globalThis, 'Notification', {
            configurable: true,
            writable: true,
            value: {
                permission: 'default',
                requestPermission: requestPermissionMock,
            },
        });
    });

    it('restores token on mount when permission is already granted', async () => {
        const showToast = vi.fn();
        globalThis.Notification.permission = 'granted';
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('restored-token');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await waitFor(() => {
            expect(result.current.fcmToken).toBe('restored-token');
        });

        expect(getFcmTokenWithRetry).toHaveBeenCalledTimes(1);
        expect(onMessage).toHaveBeenCalledTimes(1);
        // SN-03: restoring must RE-PERSIST the token so UI ON == delivery ON.
        await waitFor(() => {
            expect(upsertPushToken).toHaveBeenCalledWith('user-1', 'restored-token', navigator.userAgent, 'web');
        });
    });

    it('does not re-persist a restore that resolves after the user changed (SN-01)', async () => {
        const showToast = vi.fn();
        globalThis.Notification.permission = 'granted';
        let resolveToken: (value: string) => void = () => undefined;
        vi.mocked(getFcmTokenWithRetry).mockReturnValue(
            new Promise<string>((resolve) => { resolveToken = resolve; }) as never,
        );

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        // The account changes while token retrieval is still in flight.
        mockState.auth.currentUser = null;
        await act(async () => {
            resolveToken('late-token');
            await Promise.resolve();
        });

        // A restore from the previous account must not resurrect ownership.
        expect(upsertPushToken).not.toHaveBeenCalled();
        expect(result.current.fcmToken).toBeNull();
    });

    it('shows toast for foreground notification payloads', async () => {
        const showToast = vi.fn();
        renderHook(() => usePushNotifications({ showToast }));

        await waitFor(() => {
            expect(mockState.onMessageCallback).toBeDefined();
        });

        act(() => {
            mockState.onMessageCallback?.({
                notification: {
                    title: 'Heads up',
                    body: 'Reminder due soon',
                },
            });
        });

        expect(showToast).toHaveBeenCalledWith('Heads up: Reminder due soon', 'info');
    });

    it('updates app badge from foreground data payload', async () => {
        const showToast = vi.fn();
        renderHook(() => usePushNotifications({ showToast }));

        await waitFor(() => {
            expect(mockState.onMessageCallback).toBeDefined();
        });

        act(() => {
            mockState.onMessageCallback?.({
                data: {
                    badgeCount: '4',
                },
            });
        });

        expect(setAppBadgeCount).toHaveBeenCalledWith(4);
    });

    it('disables notifications when currently granted and token exists', async () => {
        const showToast = vi.fn();
        globalThis.Notification.permission = 'granted';
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('existing-token');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await waitFor(() => {
            expect(result.current.fcmToken).toBe('existing-token');
        });

        await act(async () => {
            await result.current.requestPushPermission();
        });

        expect(deleteToken).toHaveBeenCalledTimes(1);
        // SN-01: revoke only THIS device's registration, not the account's others.
        expect(deleteStoredPushToken).toHaveBeenCalledWith('user-1', 'existing-token');
        // SN-03: per-account disabled flag (not device-global).
        expect(localStorage.getItem('anchor_push_disabled:user-1')).toBe('true');
        expect(result.current.pushPermissionStatus).toBe('default');
        expect(result.current.fcmToken).toBeNull();
        expect(showToast).toHaveBeenCalledWith('Push Notifications Disabled', 'info');
    });

    it('re-enables after disabling (SN-03 toggle state machine)', async () => {
        const showToast = vi.fn();
        globalThis.Notification.permission = 'granted';
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('existing-token');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await waitFor(() => {
            expect(result.current.fcmToken).toBe('existing-token');
        });

        // Toggle OFF.
        await act(async () => {
            await result.current.requestPushPermission();
        });
        expect(result.current.fcmToken).toBeNull();
        expect(localStorage.getItem('anchor_push_disabled:user-1')).toBe('true');

        // Toggle back ON — a previously-disabled user must be able to re-enable.
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('new-token');
        await act(async () => {
            await result.current.requestPushPermission();
        });

        await waitFor(() => {
            expect(result.current.fcmToken).toBe('new-token');
        });
        expect(localStorage.getItem('anchor_push_disabled:user-1')).toBeNull();
        expect(upsertPushToken).toHaveBeenCalledWith('user-1', 'new-token', navigator.userAgent, 'web');
    });

    it('shows error when permission granted but messaging is unavailable', async () => {
        const showToast = vi.fn();
        mockState.messaging = null;

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await act(async () => {
            await result.current.requestPushPermission();
        });

        expect(requestPermissionMock).toHaveBeenCalledTimes(1);
        expect(showToast).toHaveBeenCalledWith('Permission granted! Initializing...', 'success');
        expect(showToast).toHaveBeenCalledWith('Messaging service not available', 'error');
    });

    it('enables notifications and upserts token after granted permission', async () => {
        const showToast = vi.fn();
        vi.mocked(getFcmTokenWithRetry).mockResolvedValue('new-token');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        let token: string | null = null;
        await act(async () => {
            token = await result.current.requestPushPermission();
        });

        expect(token).toBe('new-token');
        await waitFor(() => {
            expect(result.current.fcmToken).toBe('new-token');
        });

        expect(upsertPushToken).toHaveBeenCalledWith('user-1', 'new-token', navigator.userAgent, 'web');
        expect(showToast).toHaveBeenCalledWith('Push Notifications Enabled!', 'success');
    });

    it('reports token retrieval errors', async () => {
        const showToast = vi.fn();
        vi.mocked(getFcmTokenWithRetry).mockRejectedValueOnce(new Error('boom'));

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await act(async () => {
            await result.current.requestPushPermission();
        });

        expect(captureError).toHaveBeenCalledWith(expect.any(Error), 'Notifications.getToken');
        expect(showToast).toHaveBeenCalledWith('Token Error: boom', 'error');
    });

    it('shows blocked message when permission is denied', async () => {
        const showToast = vi.fn();
        requestPermissionMock.mockResolvedValueOnce('denied');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await act(async () => {
            await result.current.requestPushPermission();
        });

        expect(showToast).toHaveBeenCalledWith('Notifications blocked. Enable in Settings.', 'error');
    });

    it('returns early when Notification API is unavailable', async () => {
        const showToast = vi.fn();
        Reflect.deleteProperty(globalThis, 'Notification');

        const { result } = renderHook(() => usePushNotifications({ showToast }));

        await act(async () => {
            await result.current.requestPushPermission();
        });

        expect(showToast).toHaveBeenCalledWith('Notifications not supported on this device', 'error');
    });
});

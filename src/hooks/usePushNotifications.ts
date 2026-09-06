/**
 * Push notification management hook.
 *
 * Encapsulates FCM token registration, permission requests, foreground
 * message handling, and the BUG-039 disable/re-enable flow.
 */
// @ts-nocheck


import { useState, useCallback, useEffect } from 'react';
import { auth, getMessagingInstance } from '../config/firebase';
import { getFcmTokenWithRetry } from '../services/fcmTokenService';
import { captureError } from '../utils/error';
import type { NotificationType } from '../context/NotificationContextDefinition';
import { deleteStoredPushToken, upsertPushToken } from '../api/PushTokenApi';
import { setAppBadgeCount } from '../utils/appBadge';

const PUSH_DISABLED_KEY = 'anchor_push_disabled';

interface UsePushNotificationsOptions {
    showToast: (message: string, type: NotificationType) => void;
}

export function usePushNotifications({ showToast }: UsePushNotificationsOptions) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [pushDisabled, setPushDisabled] = useState<boolean>(() =>
        localStorage.getItem(PUSH_DISABLED_KEY) === 'true'
    );
    const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    // Restore token on mount if already granted and not explicitly disabled
    useEffect(() => {
        const restoreToken = async () => {
            if (typeof Notification === 'undefined') return;
            if (pushDisabled) return;
            if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) return;

            if (Notification.permission === 'granted') {
                try {
                    const messaging = await getMessagingInstance();
                    if (!messaging) return;
                    const token = await getFcmTokenWithRetry({
                        messaging: messaging!,
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    });
                    if (token) setFcmToken(token);
                } catch (error) {
                    captureError(error, 'Notifications.restoreToken');
                }
            }
        };
        restoreToken();
    }, [pushDisabled]);

    // Listen for foreground messages
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let cancelled = false;

        void getMessagingInstance().then(async (messaging) => {
            if (!messaging || cancelled) return;

            // PERFORMANCE: messaging SDK is loaded on demand
            const { onMessage } = await import('firebase/messaging');
            if (cancelled) return;

            unsubscribe = onMessage(messaging, (payload) => {
                if (import.meta.env.DEV) console.info('Foreground message received:', payload);
                const badgeCountRaw = payload?.data?.badgeCount;
                const badgeCount = badgeCountRaw != null ? Number.parseInt(String(badgeCountRaw), 10) : Number.NaN;
                if (Number.isFinite(badgeCount)) {
                    void setAppBadgeCount(badgeCount);
                }
                if (payload.notification) {
                    showToast(`${payload.notification.title}: ${payload.notification.body}`, 'info');
                }
            });
        });
        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [showToast]);

    const requestPushPermission = useCallback(async () => {
        try {
            if (typeof Notification === 'undefined') {
                showToast('Notifications not supported on this device', 'error');
                return null;
            }

            // BUG-039: Toggle off when already granted
            if (pushPermissionStatus === 'granted' || pushDisabled) {
                if (fcmToken) {
                    try {
                        const messaging = await getMessagingInstance();
                        if (messaging) {
                            const { deleteToken } = await import('firebase/messaging');
                            await deleteToken(messaging);
                        }
                        if (auth.currentUser) {
                            await deleteStoredPushToken(auth.currentUser.uid, fcmToken);
                        }
                    } catch (err) {
                        captureError(err, 'Notifications.deleteToken');
                    }
                }
                setPushDisabled(true);
                localStorage.setItem(PUSH_DISABLED_KEY, 'true');
                setPushPermissionStatus('default');
                setFcmToken(null);
                showToast('Push Notifications Disabled', 'info');
                return null;
            }

            // Re-enable if was disabled
            if (pushDisabled) {
                setPushDisabled(false);
                localStorage.removeItem(PUSH_DISABLED_KEY);
            }

            if (import.meta.env.DEV) console.info('[Push] Requesting permission...');
            const permission = await Notification.requestPermission();
            setPushPermissionStatus(permission);

            if (permission === 'granted') {
                showToast('Permission granted! Initializing...', 'success');

                if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) {
                    showToast('Push notifications not configured for this environment', 'error');
                    return null;
                }

                try {
                    const messaging = await getMessagingInstance();
                    if (!messaging) {
                        showToast('Messaging service not available', 'error');
                        return null;
                    }

                    const token = await getFcmTokenWithRetry({
                        messaging: messaging!,
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    });

                    if (token) {
                        setFcmToken(token);
                        showToast('Push Notifications Enabled!', 'success');

                        if (auth.currentUser) {
                            await upsertPushToken(auth.currentUser.uid, token, navigator.userAgent);
                        }
                        return token;
                    }
                } catch (err: unknown) {
                    captureError(err, 'Notifications.getToken');
                    const msg = err instanceof Error ? err.message : 'Unknown';
                    showToast(`Token Error: ${msg}`, 'error');
                    return null;
                }
            } else {
                showToast('Notifications blocked. Enable in Settings.', 'error');
            }
        } catch (error: unknown) {
            captureError(error, 'Notifications.requestPermission');
            const msg = error instanceof Error ? error.message : 'Permission failed';
            showToast(`Error: ${msg}`, 'error');
        }
        return null;
    }, [pushPermissionStatus, pushDisabled, fcmToken, showToast]);

    return { fcmToken, pushPermissionStatus, requestPushPermission };
}

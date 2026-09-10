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
import {
    deregisterDevicePushToken,
    isPushDisabledForUser,
    registerDevicePushToken,
    setPushDisabledForUser,
} from '../services/pushTokenLifecycle';
import { setAppBadgeCount } from '../utils/appBadge';

interface UsePushNotificationsOptions {
    showToast: (message: string, type: NotificationType) => void;
}

export function usePushNotifications({ showToast }: UsePushNotificationsOptions) {
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    // SN-03: the disabled flag is per-account, not device-global.
    const [uid, setUid] = useState<string | null>(() => auth.currentUser?.uid ?? null);
    const [pushDisabled, setPushDisabled] = useState<boolean>(() =>
        isPushDisabledForUser(auth.currentUser?.uid)
    );

    // Track the signed-in account so the disabled state and the restore path
    // always belong to the current user (SN-01/SN-03). The per-account flag is
    // re-read from the external store inside the subscription callback.
    useEffect(() => {
        const authAny = auth as unknown as {
            onAuthStateChanged?: (cb: (u: { uid: string } | null) => void) => (() => void) | void;
        };
        if (typeof authAny?.onAuthStateChanged !== 'function') return;
        const unsubscribe = authAny.onAuthStateChanged((u) => {
            const nextUid = u?.uid ?? null;
            setUid(nextUid);
            setPushDisabled(isPushDisabledForUser(nextUid));
        });
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);
    const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    // Restore token on mount if already granted and not explicitly disabled.
    // SN-03: the restore path must RE-PERSIST the token, otherwise the UI can
    // show push as ON while no authoritative token document exists.
    useEffect(() => {
        let cancelled = false;
        const restoreToken = async () => {
            if (typeof Notification === 'undefined') return;
            if (pushDisabled) return;
            if (!uid) return;
            if (!import.meta.env.VITE_FIREBASE_VAPID_KEY) return;

            if (Notification.permission === 'granted') {
                try {
                    const messaging = await getMessagingInstance();
                    if (!messaging) return;
                    const token = await getFcmTokenWithRetry({
                        messaging: messaging!,
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    });
                    // SN-01: never re-persist a registration for an account that
                    // is no longer the authenticated user. A restore that was in
                    // flight across a logout/switch must not resurrect ownership.
                    if (cancelled || !token || auth.currentUser?.uid !== uid) return;
                    setFcmToken(token);
                    await registerDevicePushToken(uid, token);
                } catch (error) {
                    captureError(error, 'Notifications.restoreToken');
                }
            }
        };
        restoreToken();
        return () => { cancelled = true; };
    }, [pushDisabled, uid]);

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

            // SN-03: the toggle is a state machine derived from the persisted
            // state, so it can both disable AND re-enable.
            const pushEnabled = pushPermissionStatus === 'granted' && !pushDisabled;

            if (pushEnabled) {
                const activeUid = auth.currentUser?.uid ?? uid;
                try {
                    // SN-01: ownership-scoped deregistration while still signed in.
                    await deregisterDevicePushToken(activeUid);
                } catch (err) {
                    captureError(err, 'Notifications.deleteToken');
                }
                setPushDisabled(true);
                setPushDisabledForUser(activeUid, true);
                setPushPermissionStatus('default');
                setFcmToken(null);
                showToast('Push Notifications Disabled', 'info');
                return null;
            }

            // Re-enable path: clear the per-account disabled flag.
            if (pushDisabled) {
                setPushDisabled(false);
                setPushDisabledForUser(auth.currentUser?.uid ?? uid, false);
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

                        const activeUid = auth.currentUser?.uid ?? uid;
                        if (activeUid) {
                            await registerDevicePushToken(activeUid, token);
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
    }, [pushPermissionStatus, pushDisabled, showToast, uid]);

    return { fcmToken, pushPermissionStatus, requestPushPermission };
}

import React, { useContext, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { NotificationContext, type ConfirmOptions, type NotificationType } from './NotificationContextDefinition';

export { NotificationContext };

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

import { messaging, db, auth, APP_ID } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    const [confirmDialog, setConfirmDialog] = useState<{
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const showToast = useCallback((message: string, type: NotificationType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setConfirmDialog({ options, resolve });
        });
    }, []);

    // Check initial permission state
    React.useEffect(() => {
        const checkPermission = async () => {
            if (typeof Notification === 'undefined' || !messaging) return;

            if (Notification.permission === 'granted') {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    const token = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration
                    });
                    if (token) setFcmToken(token);
                } catch (error) {
                    console.error('Error restoring token:', error);
                }
            }
        };
        checkPermission();
    }, []);

    const requestPushPermission = useCallback(async () => {
        try {
            if (typeof Notification === 'undefined') {
                showToast('Notifications not supported on this device', 'error');
                return null;
            }

            // If already granted and we have a token (or even if we don't, but UI says granted), 
            // treat this click as a "Turn Off" request to reset UI state.
            if (pushPermissionStatus === 'granted') {
                setPushPermissionStatus('default');
                setFcmToken(null);
                showToast('Notifications Disabled (UI reset)', 'info');
                return null;
            }

            console.log('[Push] Requesting permission...');
            const permission = await Notification.requestPermission();
            setPushPermissionStatus(permission);

            if (permission === 'granted') {
                showToast('Permission granted! Initializing...', 'success');

                if (!messaging) {
                    showToast('Messaging service not available', 'error');
                    return null;
                }

                // Get FCM Token with retry for IDB timing issues
                const getTokenWithRetry = async (retries = 3, delay = 500): Promise<string | null> => {
                    try {
                        const registration = await navigator.serviceWorker.ready;
                        const token = await getToken(messaging!, {
                            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                            serviceWorkerRegistration: registration
                        });
                        return token;
                    } catch (err: any) {
                        // Retry on IDB connection closing error (PWA navigation timing issue)
                        if (retries > 0 && (err.message?.includes('closing') || err.name === 'InvalidStateError')) {
                            console.log(`[Push] IDB timing error, retrying in ${delay}ms... (${retries} left)`);
                            await new Promise(r => setTimeout(r, delay));
                            return getTokenWithRetry(retries - 1, delay * 2);
                        }
                        throw err;
                    }
                };

                try {
                    const token = await getTokenWithRetry();

                    if (token) {
                        setFcmToken(token);
                        showToast('Push Notifications Enabled!', 'success');

                        if (auth.currentUser) {
                            const tokenRef = doc(db, 'artifacts', APP_ID, 'users', auth.currentUser.uid, 'fcmTokens', token);
                            await setDoc(tokenRef, {
                                token,
                                platform: 'web',
                                lastSeen: serverTimestamp(),
                                userAgent: navigator.userAgent
                            }, { merge: true });
                        }
                        return token;
                    }
                } catch (err: any) {
                    console.error('An error occurred while retrieving token. ', err);
                    showToast(`Token Error: ${err.message || 'Unknown'}`, 'error');
                    return null;
                }
            } else {
                showToast('Notifications blocked. Enable in Settings.', 'error');
            }
        } catch (error: any) {
            console.error('Unable to get permission to notify.', error);
            showToast(`Error: ${error.message || 'Permission failed'}`, 'error');
        }
        return null;
    }, [pushPermissionStatus, showToast]);

    // Listen for foreground messages
    React.useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            if (payload.notification) {
                showToast(`${payload.notification.title}: ${payload.notification.body}`, 'info');
            }
        });
        return () => unsubscribe();
    }, [showToast]);


    const handleConfirm = (value: boolean) => {
        if (confirmDialog) {
            confirmDialog.resolve(value);
            setConfirmDialog(null);
        }
    };

    return (
        <NotificationContext.Provider value={{ showToast, confirm, requestPushPermission, fcmToken, pushPermissionStatus }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-8 duration-300 min-w-[300px] max-w-md ${n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400' :
                                n.type === 'error' ? 'bg-rose-50 dark:bg-rose-800/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400' :
                                    'bg-surface-1-dark text-white border-border'
                                }`}
                        >
                            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            {n.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                            {n.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
                            <p className="text-sm font-medium pr-4">{n.message}</p>
                            <button
                                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                                className="ml-auto p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {confirmDialog && createPortal(
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-surface-1-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-surface-1 dark:bg-surface-1-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-border-subtle dark:border-border animate-in zoom-in-95 duration-200">
                        <h3 className="text-h3 lg:text-h3-lg text-foreground dark:text-foreground-dark mb-2">{confirmDialog.options.title}</h3>
                        <p className="text-muted mb-8 whitespace-pre-wrap">{confirmDialog.options.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="px-5 py-2.5 rounded-xl text-subtle dark:text-subtle-dark font-bold hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-all"
                            >
                                {confirmDialog.options.cancelText || 'Cancel'}
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmDialog.options.type === 'danger' ? 'bg-danger-600 shadow-danger-600/20' : 'bg-foreground dark:bg-surface-3-dark shadow-foreground/20'
                                    }`}
                            >
                                {confirmDialog.options.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};

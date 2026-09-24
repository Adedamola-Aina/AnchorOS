
import React, { useContext, useRef, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';
import { NotificationContext, type ConfirmOptions, type NotificationType } from './NotificationContextDefinition';
import { usePushNotifications } from '../hooks/usePushNotifications';

export { NotificationContext };

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
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

    // Push notification management (FCM, permissions, foreground messages)
    const { fcmToken, pushPermissionStatus, requestPushPermission } = usePushNotifications({ showToast });
    const handleConfirm = (value: boolean) => {
        if (confirmDialog) {
            confirmDialog.resolve(value);
            setConfirmDialog(null);
        }
    };

    const confirmPanelRef = useRef<HTMLDivElement>(null);
    /**
     * The confirm dialog is a modal in every sense, but it had none of the behaviour:
     * no Escape to cancel, no focus trap (Tab moved into the page behind it) and no
     * scroll lock (the page scrolled under the dialog). It also runs through the same
     * lock as every other overlay now, so it can be stacked without the first closer
     * handing scrolling back while something is still open.
     */
    useOverlayBehavior({
        isOpen: Boolean(confirmDialog),
        onClose: () => handleConfirm(false),
        panelRef: confirmPanelRef,
    });

    return (
        <NotificationContext.Provider value={{ showToast, confirm, requestPushPermission, fcmToken, pushPermissionStatus }}>
            {children}
            {createPortal(
                <div className="floating-toast fixed left-4 right-4 sm:left-auto sm:right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-8 duration-300 w-full sm:min-w-[300px] sm:max-w-md ${n.type === 'success' ? 'bg-success-surface border-success-border text-success' :
                                n.type === 'error' ? 'bg-danger-surface border-danger-border text-danger' :
                                    n.type === 'warning' ? 'bg-warning-surface border-warning-border text-warning' :
                                        'bg-slate-800 text-white border-slate-700'
                                }`}
                        >
                            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            {n.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                            {/* `warning` used to fall through to the dark info style, so an
                                advisory looked identical to a neutral message. */}
                            {n.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
                            {n.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
                            <p className="text-sm font-medium pr-4">{n.message}</p>
                            <button
                                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                                className="ml-auto min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {confirmDialog && createPortal(
                <div ref={confirmPanelRef} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white mb-2">{confirmDialog.options.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 whitespace-pre-wrap">{confirmDialog.options.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="min-h-11 px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                {confirmDialog.options.cancelText || 'Cancel'}
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className={`min-h-11 px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmDialog.options.type === 'danger' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-slate-900 dark:bg-slate-700 shadow-slate-900/20'
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

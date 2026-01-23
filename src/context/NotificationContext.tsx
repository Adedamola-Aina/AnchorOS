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

    const handleConfirm = (value: boolean) => {
        if (confirmDialog) {
            confirmDialog.resolve(value);
            setConfirmDialog(null);
        }
    };

    return (
        <NotificationContext.Provider value={{ showToast, confirm }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-8 duration-300 min-w-[300px] max-w-md ${n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400' :
                                n.type === 'error' ? 'bg-rose-50 dark:bg-rose-800/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400' :
                                    'bg-slate-800 text-white border-slate-700'
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
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{confirmDialog.options.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 whitespace-pre-wrap">{confirmDialog.options.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => handleConfirm(false)}
                                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                {confirmDialog.options.cancelText || 'Cancel'}
                            </button>
                            <button
                                onClick={() => handleConfirm(true)}
                                className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${confirmDialog.options.type === 'danger' ? 'bg-rose-600 shadow-rose-600/20' : 'bg-slate-900 dark:bg-slate-700 shadow-slate-900/20'
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

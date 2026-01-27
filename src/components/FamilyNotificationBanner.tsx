/**
 * Family Mode v2 - Notification Banner
 * 
 * Displays in-app notifications for family activities like
 * new connections, shared accounts, and transaction updates.
 */

import { useState, useEffect } from 'react';
import { X, Users, Bell, ArrowRight } from 'lucide-react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface FamilyNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    actorUid: string;
    actorName: string;
    read: boolean;
    dismissed: boolean;
    createdAt: { seconds: number };
    accountId?: string;
    accountName?: string;
}

interface FamilyNotificationBannerProps {
    onNavigate?: (path: string) => void;
}

export function FamilyNotificationBanner({ onNavigate }: FamilyNotificationBannerProps) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<FamilyNotification[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!user) return;

        const notificationsRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications');
        const q = query(
            notificationsRef,
            where('dismissed', '==', false),
            where('read', '==', false),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as FamilyNotification[];
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDismiss = async (notificationId: string) => {
        if (!user) return;

        const notifRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications', notificationId);
        await updateDoc(notifRef, { dismissed: true });

        // Move to next notification or remove
        if (currentIndex >= notifications.length - 1) {
            setCurrentIndex(Math.max(0, notifications.length - 2));
        }
    };

    const handleMarkRead = async (notificationId: string) => {
        if (!user) return;

        const notifRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications', notificationId);
        await updateDoc(notifRef, { read: true });
    };

    const handleAction = (notification: FamilyNotification) => {
        handleMarkRead(notification.id);

        // Navigate based on notification type
        if (notification.type.includes('account') || notification.type.includes('transaction')) {
            onNavigate?.('finance');
        } else if (notification.type === 'family_connected' || notification.type === 'invitation_accepted') {
            onNavigate?.('settings');
        }
    };

    if (notifications.length === 0) return null;

    const notification = notifications[currentIndex];
    if (!notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'family_connected':
            case 'invitation_accepted':
            case 'account_shared':
                return <Users className="w-5 h-5" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const getBgColor = () => {
        switch (notification.type) {
            case 'family_connected':
                return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
            case 'account_shared':
                return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
            case 'invitation_accepted':
                return 'bg-family-50 dark:bg-family-900/20 border-family-200 dark:border-family-800';
            default:
                return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
        }
    };

    const getIconColor = () => {
        switch (notification.type) {
            case 'family_connected':
                return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
            case 'account_shared':
                return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
            case 'invitation_accepted':
                return 'text-family-600 dark:text-family-400 bg-family-100 dark:bg-family-900/30';
            default:
                return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800';
        }
    };

    return (
        <div className={`mb-6 p-4 rounded-2xl border ${getBgColor()} animate-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${getIconColor()}`}>
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {notification.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => handleAction(notification)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                            View <ArrowRight className="w-3 h-3" />
                        </button>
                        {notifications.length > 1 && (
                            <span className="text-xs text-slate-400">
                                {currentIndex + 1} of {notifications.length}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {notifications.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex(Math.min(notifications.length - 1, currentIndex + 1))}
                                disabled={currentIndex === notifications.length - 1}
                                className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                                →
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

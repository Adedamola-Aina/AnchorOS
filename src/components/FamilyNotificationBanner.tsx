/**
 * Family Mode v2 - Notification Banner
 * 
 * Displays in-app notifications for family activities like
 * new connections, shared accounts, and transaction updates.
 */

/* eslint-disable react-hooks/static-components */

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { getNotificationIcon, getNotificationBgColor, getNotificationIconColor } from './notificationStyles';

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
    accountId?: string; // When provided, only show notifications for this account
}

export function FamilyNotificationBanner({ onNavigate, accountId }: FamilyNotificationBannerProps) {
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
            // When scoped to a specific account, filter to that account's notifications
            setNotifications(accountId ? notifs.filter(n => n.accountId === accountId) : notifs);
        });

        return () => unsubscribe();
    }, [user, accountId]);

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

    // eslint-disable-next-line
    const Icon = getNotificationIcon(notification.type);
    const bgColor = getNotificationBgColor(notification.type);
    const iconColor = getNotificationIconColor(notification.type);

    return (
        <div className={`mb-6 p-4 rounded-2xl border ${bgColor} animate-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
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
                            className="inline-flex items-center gap-1 min-h-11 px-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                        >
                            View <ArrowRight className="w-4 h-4" />
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
                                className="min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-700/50 disabled:opacity-30 rounded-lg transition-colors"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex(Math.min(notifications.length - 1, currentIndex + 1))}
                                disabled={currentIndex === notifications.length - 1}
                                className="min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-700/50 disabled:opacity-30 rounded-lg transition-colors"
                            >
                                →
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleDismiss(notification.id)}
                        className="min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

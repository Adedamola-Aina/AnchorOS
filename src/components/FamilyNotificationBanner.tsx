/**
 * Family Mode v2 - Notification Banner
 * DES-002: Migrated to semantic tokens
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
import { Text, HStack, VStack } from './primitives';

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

    // eslint-disable-next-line
    const Icon = getNotificationIcon(notification.type);
    const bgColor = getNotificationBgColor(notification.type);
    const iconColor = getNotificationIconColor(notification.type);

    return (
        <div className={`mb-6 p-4 rounded-2xl border ${bgColor} animate-in slide-in-from-top-2 duration-300`}>
            <HStack gap="sm" align="start">
                <div className={`p-2 rounded-xl shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <VStack gap="xs" className="flex-1 min-w-0">
                    <Text size="sm" weight="semibold" className="text-foreground dark:text-foreground-dark">
                        {notification.title}
                    </Text>
                    <Text size="sm" variant="muted">
                        {notification.message}
                    </Text>
                    <HStack gap="sm" align="center" className="mt-3">
                        <button
                            onClick={() => handleAction(notification)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-warning-600 dark:text-warning-400 hover:underline"
                        >
                            View <ArrowRight className="w-3 h-3" />
                        </button>
                        {notifications.length > 1 && (
                            <Text size="xs" variant="muted">
                                {currentIndex + 1} of {notifications.length}
                            </Text>
                        )}
                    </HStack>
                </VStack>
                <HStack gap="xs" align="center" className="shrink-0">
                    {notifications.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="p-1.5 text-muted hover:text-foreground disabled:opacity-30"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex(Math.min(notifications.length - 1, currentIndex + 1))}
                                disabled={currentIndex === notifications.length - 1}
                                className="p-1.5 text-muted hover:text-foreground disabled:opacity-30"
                            >
                                →
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1.5 text-muted hover:text-foreground hover:bg-surface-3/50 dark:hover:bg-surface-3-dark/50 rounded-lg transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </HStack>
            </HStack>
        </div>
    );
}


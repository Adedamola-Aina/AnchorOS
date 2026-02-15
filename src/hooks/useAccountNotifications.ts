import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AnchorNotification } from '../types';
import {
    markAccountNotificationAsRead,
    markAllAccountNotificationsAsRead,
    subscribeToAccountNotifications,
} from '../api/AccountNotificationsApi';

export const useAccountNotifications = (accountId?: string) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AnchorNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToAccountNotifications(user.uid, accountId, (msgs) => {
            // Client-side filtering for unread if needed, or we just show them.
            // We want to show unread ones prominently.
            setNotifications(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, accountId]);

    const markAsRead = async (id: string) => {
        if (!user) return;
        await markAccountNotificationAsRead(user.uid, id);
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;
        await markAllAccountNotificationsAsRead(user.uid, notifications);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return { notifications, loading, markAsRead, markAllAsRead };
};

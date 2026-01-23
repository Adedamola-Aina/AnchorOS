import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import type { AnchorNotification } from '../types';

export const useAccountNotifications = (accountId?: string) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AnchorNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const colRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications');
        let q = query(colRef, orderBy('date', 'desc'), limit(50));

        if (accountId) {
            q = query(colRef, where('accountId', '==', accountId), orderBy('date', 'desc'), limit(20));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AnchorNotification));
            // Client-side filtering for unread if needed, or we just show them.
            // We want to show unread ones prominently.
            setNotifications(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, accountId]);

    const markAsRead = async (id: string) => {
        if (!user) return;
        const ref = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications', id);
        await updateDoc(ref, { read: true });
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;
        const batch = (await import('firebase/firestore')).writeBatch(db);
        notifications.filter(n => !n.read).forEach(n => {
            const ref = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications', n.id);
            batch.update(ref, { read: true });
        });
        await batch.commit();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return { notifications, loading, markAsRead, markAllAsRead };
};

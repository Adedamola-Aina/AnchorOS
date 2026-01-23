/**
 * Family Mode v2 - Account Sharing Hook
 * 
 * Provides state and actions for managing account sharing with family members.
 */

import { useState, useEffect, useCallback } from 'react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNotifications } from '../context/NotificationContext';

interface FamilyConnection {
    id: string;
    ownerUid: string;
    memberUid: string;
    ownerDisplayName: string;
    memberDisplayName: string;
    status: 'active' | 'disconnected';
    connectedAt: string;
}

interface UseFamilySharingResult {
    connection: FamilyConnection | null;
    isOwner: boolean;
    familyMemberUid: string | null;
    familyMemberName: string | null;
    loading: boolean;
    shareAccount: (accountId: string, share: boolean) => Promise<void>;
    disconnectFamily: (type: 'remove_member' | 'leave') => Promise<void>;
}

export function useFamilySharing(userId: string | undefined): UseFamilySharingResult {
    const { showToast } = useNotifications();
    const [connection, setConnection] = useState<FamilyConnection | null>(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Loading is true when we have a userId but haven't loaded data yet
    const loading = !!userId && !dataLoaded;

    // Reset dataLoaded when userId changes - this is intentional to restart loading
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDataLoaded(false);
    }, [userId]);

    // Listen for active family connection
    useEffect(() => {
        if (!userId) {
            return;
        }

        const connectionsRef = collection(db, 'artifacts', APP_ID, 'family_connections');

        // Check as owner
        const ownerQuery = query(
            connectionsRef,
            where('ownerUid', '==', userId),
            where('status', '==', 'active')
        );

        // Check as member
        const memberQuery = query(
            connectionsRef,
            where('memberUid', '==', userId),
            where('status', '==', 'active')
        );

        let ownerConnection: FamilyConnection | null = null;
        let memberConnection: FamilyConnection | null = null;

        const unsubOwner = onSnapshot(ownerQuery, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                ownerConnection = { id: doc.id, ...doc.data() } as FamilyConnection;
                setConnection(ownerConnection);
            } else {
                ownerConnection = null;
                if (!memberConnection) {
                    setConnection(null);
                }
            }
            setDataLoaded(true);
        });

        const unsubMember = onSnapshot(memberQuery, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                memberConnection = { id: doc.id, ...doc.data() } as FamilyConnection;
                if (!ownerConnection) {
                    setConnection(memberConnection);
                }
            } else {
                memberConnection = null;
            }
            setDataLoaded(true);
        });

        return () => {
            unsubOwner();
            unsubMember();
        };
    }, [userId]);

    const isOwner = connection?.ownerUid === userId;
    const familyMemberUid = connection
        ? (isOwner ? connection.memberUid : connection.ownerUid)
        : null;
    const familyMemberName = connection
        ? (isOwner ? connection.memberDisplayName : connection.ownerDisplayName)
        : null;

    const shareAccount = useCallback(async (accountId: string, share: boolean) => {
        if (!connection) return;

        try {
            const functions = getFunctions();
            const shareAccountFn = httpsCallable<
                { accountId: string; share: boolean },
                { success: boolean }
            >(functions, 'shareAccount');

            await shareAccountFn({ accountId, share });
            showToast(
                share ? 'Account shared with family' : 'Account sharing removed',
                'success'
            );
        } catch (err) {
            console.error('Share account error:', err);
            showToast('Failed to update sharing', 'error');
        }
    }, [connection, showToast]);

    const disconnectFamily = useCallback(async (type: 'remove_member' | 'leave') => {
        try {
            const functions = getFunctions();
            const disconnectFn = httpsCallable<
                { type: 'remove_member' | 'leave' },
                { success: boolean }
            >(functions, 'disconnectFamily');

            await disconnectFn({ type });
            showToast('Family connection removed', 'success');
            setConnection(null);
        } catch (err) {
            console.error('Disconnect error:', err);
            showToast('Failed to disconnect', 'error');
            throw err;
        }
    }, [showToast]);

    return {
        connection,
        isOwner,
        familyMemberUid,
        familyMemberName,
        loading,
        shareAccount,
        disconnectFamily,
    };
}

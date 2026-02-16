import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, APP_ID } from '../config/firebase';
import type { FamilyConnection } from '../types';

export type DisconnectType = 'remove_member' | 'leave';

export function subscribeToActiveFamilyConnection(
    userId: string,
    onData: (connection: FamilyConnection | null) => void,
    onLoaded: () => void
): Unsubscribe {
    const connectionsRef = collection(db, 'artifacts', APP_ID, 'family_connections');
    const ownerQuery = query(
        connectionsRef,
        where('ownerUid', '==', userId),
        where('status', '==', 'active')
    );
    const memberQuery = query(
        connectionsRef,
        where('memberUid', '==', userId),
        where('status', '==', 'active')
    );

    let ownerConnection: FamilyConnection | null = null;
    let memberConnection: FamilyConnection | null = null;

    const emitCurrentConnection = () => {
        onData(ownerConnection ?? memberConnection ?? null);
    };

    const unsubOwner = onSnapshot(ownerQuery, (snapshot) => {
        if (!snapshot.empty) {
            const connectionDoc = snapshot.docs[0];
            ownerConnection = { id: connectionDoc.id, ...connectionDoc.data() } as FamilyConnection;
        } else {
            ownerConnection = null;
        }

        emitCurrentConnection();
        onLoaded();
    });

    const unsubMember = onSnapshot(memberQuery, (snapshot) => {
        if (!snapshot.empty) {
            const connectionDoc = snapshot.docs[0];
            memberConnection = { id: connectionDoc.id, ...connectionDoc.data() } as FamilyConnection;
        } else {
            memberConnection = null;
        }

        emitCurrentConnection();
        onLoaded();
    });

    return () => {
        unsubOwner();
        unsubMember();
    };
}

export async function shareFamilyAccount(accountId: string, share: boolean): Promise<void> {
    const functions = getFunctions();
    const shareAccountFn = httpsCallable<
        { accountId: string; share: boolean },
        { success: boolean }
    >(functions, 'shareAccount');

    await shareAccountFn({ accountId, share });
}

export async function disconnectFamilyConnection(type: DisconnectType): Promise<void> {
    const functions = getFunctions();
    const disconnectFn = httpsCallable<
        { type: DisconnectType },
        { success: boolean }
    >(functions, 'disconnectFamily');

    await disconnectFn({ type });
}
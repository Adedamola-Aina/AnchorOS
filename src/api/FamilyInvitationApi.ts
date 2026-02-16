// @ts-nocheck
import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';

export interface PendingInvitation {
  id: string;
  inviteeEmail: string;
  status: 'pending' | 'awaiting_confirmation';
  createdAt: string;
}

export function subscribeToOwnerPendingInvitations(
  ownerUid: string,
  onData: (invitations: PendingInvitation[]) => void
): Unsubscribe {
  const invitationsRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
  const q = query(
    invitationsRef,
    where('ownerUid', '==', ownerUid),
    where('status', 'in', ['pending', 'awaiting_confirmation'])
  );

  return onSnapshot(q, (snapshot) => {
    const invitations = snapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        inviteeEmail: data.inviteeEmail,
        status: data.status,
        createdAt: data.createdAt,
      } as PendingInvitation;
    });
    onData(invitations);
  });
}

/**
 * Auto-Accept Invitation Action
 * Split from DeveloperTools.tsx per CLAUDE.md §3.2 (200-line rule)
 */

import React from 'react';
import { Button } from '@anchor-os/ui';
import { useNotifications } from '../../../../context/NotificationContext';

interface AutoAcceptActionProps {
    userUid: string;
}

export const AutoAcceptInvitationAction: React.FC<AutoAcceptActionProps> = ({ userUid }) => {
    const { showToast } = useNotifications();

    const handleAutoAccept = async () => {
        try {
            const { db, APP_ID, auth } = await import('../../../../config/firebase');
            const { collection, query, where, getDocs, doc, writeBatch } = await import('firebase/firestore');

            const currentUserEmail = auth.currentUser?.email;
            if (!currentUserEmail) {
                showToast('Not logged in', 'error');
                return;
            }

            // Find pending invitations for this user
            const invitesRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
            const q = query(invitesRef, where('inviteeEmail', '==', currentUserEmail), where('status', '==', 'pending'));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                // Try finding invitations sent BY this user
                const q2 = query(invitesRef, where('ownerEmail', '==', currentUserEmail), where('status', '==', 'pending'));
                const snapshot2 = await getDocs(q2);

                if (snapshot2.empty) {
                    showToast('No pending invitations found', 'warning');
                    return;
                }

                // Auto-accept invitation sent by this user (simulate invitee accepting)
                const invite = snapshot2.docs[0];
                const inviteData = invite.data();
                const batch = writeBatch(db);
                const timestamp = new Date().toISOString();

                // Update invitation status
                batch.update(invite.ref, { status: 'accepted', acceptedAt: timestamp });

                // Create family connection
                const connectionId = `${inviteData.ownerUid}_${inviteData.inviteeEmail.replace('@', '_at_')}`;
                const connectionRef = doc(db, 'artifacts', APP_ID, 'family_connections', connectionId);
                batch.set(connectionRef, {
                    ownerUid: inviteData.ownerUid,
                    ownerEmail: inviteData.ownerEmail,
                    ownerName: inviteData.ownerDisplayName,
                    memberEmail: inviteData.inviteeEmail,
                    status: 'connected',
                    createdAt: timestamp,
                    confirmedAt: timestamp
                });

                // Update owner profile
                const ownerRef = doc(db, 'artifacts', APP_ID, 'users', inviteData.ownerUid);
                batch.update(ownerRef, {
                    familyMode: true,
                    familyMemberEmail: inviteData.inviteeEmail,
                    familyConnectionStatus: 'connected',
                    familyConnectedAt: timestamp
                });

                await batch.commit();
                showToast('Invitation auto-completed! Refresh to see changes.', 'success');
                return;
            }

            // Process invitation where current user is invitee
            const invite = snapshot.docs[0];
            const inviteData = invite.data();
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();

            // Update invitation
            batch.update(invite.ref, { status: 'accepted', acceptedAt: timestamp });

            // Create family connection
            const connectionId = `${inviteData.ownerUid}_${userUid}`;
            const connectionRef = doc(db, 'artifacts', APP_ID, 'family_connections', connectionId);
            batch.set(connectionRef, {
                ownerUid: inviteData.ownerUid,
                ownerEmail: inviteData.ownerEmail,
                ownerName: inviteData.ownerDisplayName,
                memberUid: userUid,
                memberEmail: currentUserEmail,
                status: 'connected',
                createdAt: timestamp,
                confirmedAt: timestamp
            });

            // Only update current user's profile (member)
            const memberRef = doc(db, 'artifacts', APP_ID, 'users', userUid);
            batch.update(memberRef, {
                familyMode: true,
                familyMemberId: inviteData.ownerUid,
                familyMemberEmail: inviteData.ownerEmail,
                familyMemberName: inviteData.ownerDisplayName,
                familyConnectionStatus: 'connected',
                familyConnectedAt: timestamp
            });

            await batch.commit();
            showToast('Invitation accepted! Refresh to see family connection.', 'success');
        } catch (e) {
            showToast('Error: ' + (e as Error).message, 'error');
        }
    };

    return (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Auto-Accept Invitation</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bypass email verification and auto-complete pending family invitations.</p>
            </div>
            <Button
                onClick={handleAutoAccept}
                className="bg-amber-600 hover:bg-amber-700 h-10 px-6 text-xs font-black uppercase tracking-widest"
            >
                Auto-Accept
            </Button>
        </div>
    );
};

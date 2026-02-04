/**
 * Family Mode v2 - Family Settings Component
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI states extracted to FamilySettingsStates.tsx
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Users } from 'lucide-react';
import { InviteFamilyMember } from './InviteFamilyMember';
import { PendingConfirmation } from './PendingConfirmation';
import { FamilyLoadingState, FamilyPostConnectionMessage, FamilyConnectedState, FamilyInviteCard } from './FamilySettingsStates';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface FamilyConnection { id: string; ownerUid: string; memberUid: string; ownerDisplayName: string; memberDisplayName: string; status: 'active' | 'disconnected'; connectedAt: string; }
interface FamilySettingsV2Props { onNavigateToFinance?: () => void; }

export function FamilySettingsV2({ onNavigateToFinance }: FamilySettingsV2Props) {
    const { user } = useAuth();
    const { showToast, confirm: confirmDialog } = useNotifications();

    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState<FamilyConnection | null>(null);
    const [hasPendingInvite, setHasPendingInvite] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [showPostConnectionMessage, setShowPostConnectionMessage] = useState(false);
    const [postConnectionMessage, setPostConnectionMessage] = useState('');

    useEffect(() => {
        if (!user) return;
        const connectionsRef = collection(db, 'artifacts', APP_ID, 'family_connections');
        const ownerQuery = query(connectionsRef, where('ownerUid', '==', user.uid), where('status', '==', 'active'));
        const memberQuery = query(connectionsRef, where('memberUid', '==', user.uid), where('status', '==', 'active'));

        const unsubOwner = onSnapshot(ownerQuery, (snapshot) => {
            if (!snapshot.empty) { const doc = snapshot.docs[0]; setConnection({ id: doc.id, ...doc.data() } as FamilyConnection); }
            setLoading(false);
        });
        const unsubMember = onSnapshot(memberQuery, (snapshot) => {
            if (!snapshot.empty) { const doc = snapshot.docs[0]; setConnection({ id: doc.id, ...doc.data() } as FamilyConnection); }
            setLoading(false);
        });

        const invitesRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
        const pendingQuery = query(invitesRef, where('ownerUid', '==', user.uid), where('status', 'in', ['pending', 'awaiting_confirmation']));
        const unsubPending = onSnapshot(pendingQuery, (snapshot) => { setHasPendingInvite(!snapshot.empty); });

        return () => { unsubOwner(); unsubMember(); unsubPending(); };
    }, [user]);

    const handleConnectionConfirmed = (_redirectTo: string, message: string) => { setShowPostConnectionMessage(true); setPostConnectionMessage(message); };
    const handleGoToFinance = () => {
        setShowPostConnectionMessage(false);
        if (onNavigateToFinance) {
            onNavigateToFinance();
        } else {
            window.location.href = '/finance';
        }
    };

    const handleDisconnect = async () => {
        if (!connection || !user) return;
        const isOwner = connection.ownerUid === user.uid;
        const otherName = isOwner ? connection.memberDisplayName : connection.ownerDisplayName;
        const confirmed = await confirmDialog({
            title: isOwner ? 'Remove Family Member?' : 'Leave Household?',
            message: isOwner ? `This will remove ${otherName} from your household and revoke all shared account access immediately.` : `This will disconnect you from ${otherName}'s household. You will lose access to all shared accounts.`,
            type: 'danger', confirmText: isOwner ? 'Remove' : 'Leave',
        });
        if (!confirmed) return;
        setDisconnecting(true);
        try {
            const functions = getFunctions();
            const disconnectFamily = httpsCallable<{ type: 'remove_member' | 'leave' }, { success: boolean }>(functions, 'disconnectFamily');
            await disconnectFamily({ type: isOwner ? 'remove_member' : 'leave' });
            showToast('Family connection removed', 'success');
            setConnection(null);
        } catch (err) { console.error('Disconnect error:', err); showToast('Failed to disconnect', 'error'); }
        finally { setDisconnecting(false); }
    };

    if (!user) return null;
    if (loading) return <FamilyLoadingState />;
    if (showPostConnectionMessage) return <FamilyPostConnectionMessage message={postConnectionMessage} onGoToFinance={handleGoToFinance} />;
    if (connection) return <FamilyConnectedState connection={connection} currentUserId={user.uid} disconnecting={disconnecting} onDisconnect={handleDisconnect} />;
    if (hasPendingInvite) return <PendingConfirmation userId={user.uid} onConnectionConfirmed={handleConnectionConfirmed} />;

    if (showInviteForm) {
        return (
            <Card className="overflow-hidden">
                <CardHeader className="p-6 border-b border-border-subtle bg-warning-50/30 dark:bg-warning-900/10">
                    <CardTitle className="text-base font-bold text-warning-900 dark:text-warning-500 flex items-center gap-3">
                        <div className="p-2 bg-warning-500/10 rounded-lg"><Users className="w-5 h-5 text-warning-600 dark:text-warning-500" /></div>
                        Invite Family Member
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <InviteFamilyMember userEmail={user.email || ''} isEmailVerified={user.emailVerified} onInviteSent={() => setShowInviteForm(false)} />
                </CardContent>
            </Card>
        );
    }

    return <FamilyInviteCard onShowInviteForm={() => setShowInviteForm(true)} />;
}

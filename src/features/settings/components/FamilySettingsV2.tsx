/**
 * Family Mode v2 - Family Settings Component
 * 
 * Follows the "Invisible Until Real" principle:
 * - No family UI for users without connections
 * - Shows "Invite Family Member" card for potential connections
 * - Shows pending/confirmation states during handshake
 * - Shows connected state with disconnect option
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Users, Check, Loader2, UserMinus, ArrowRight } from 'lucide-react';
import { InviteFamilyMember } from './InviteFamilyMember';
import { PendingConfirmation } from './PendingConfirmation';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface FamilyConnection {
    id: string;
    ownerUid: string;
    memberUid: string;
    ownerDisplayName: string;
    memberDisplayName: string;
    status: 'active' | 'disconnected';
    connectedAt: string;
}

interface FamilySettingsV2Props {
    onNavigateToFinance?: () => void;
}

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

    // Listen for active family connections
    useEffect(() => {
        if (!user) return;

        const connectionsRef = collection(db, 'artifacts', APP_ID, 'family_connections');

        // Check as owner
        const ownerQuery = query(
            connectionsRef,
            where('ownerUid', '==', user.uid),
            where('status', '==', 'active')
        );

        // Check as member
        const memberQuery = query(
            connectionsRef,
            where('memberUid', '==', user.uid),
            where('status', '==', 'active')
        );

        const unsubOwner = onSnapshot(ownerQuery, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setConnection({ id: doc.id, ...doc.data() } as FamilyConnection);
            }
            setLoading(false);
        });

        const unsubMember = onSnapshot(memberQuery, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setConnection({ id: doc.id, ...doc.data() } as FamilyConnection);
            }
            setLoading(false);
        });

        // Check for pending invites
        const invitesRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
        const pendingQuery = query(
            invitesRef,
            where('ownerUid', '==', user.uid),
            where('status', 'in', ['pending', 'awaiting_confirmation'])
        );

        const unsubPending = onSnapshot(pendingQuery, (snapshot) => {
            setHasPendingInvite(!snapshot.empty);
        });

        return () => {
            unsubOwner();
            unsubMember();
            unsubPending();
        };
    }, [user]);

    const handleConnectionConfirmed = (_redirectTo: string, message: string) => {
        setShowPostConnectionMessage(true);
        setPostConnectionMessage(message);
    };

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
            message: isOwner
                ? `This will remove ${otherName} from your household and revoke all shared account access immediately.`
                : `This will disconnect you from ${otherName}'s household. You will lose access to all shared accounts.`,
            type: 'danger',
            confirmText: isOwner ? 'Remove' : 'Leave',
        });

        if (!confirmed) return;

        setDisconnecting(true);

        try {
            const functions = getFunctions();
            const disconnectFamily = httpsCallable<
                { type: 'remove_member' | 'leave' },
                { success: boolean }
            >(functions, 'disconnectFamily');

            await disconnectFamily({
                type: isOwner ? 'remove_member' : 'leave',
            });

            showToast('Family connection removed', 'success');
            setConnection(null);
        } catch (err) {
            console.error('Disconnect error:', err);
            showToast('Failed to disconnect', 'error');
        } finally {
            setDisconnecting(false);
        }
    };

    if (!user) return null;

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    // Post-connection success message (for owner)
    if (showPostConnectionMessage) {
        return (
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 overflow-hidden">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">🎉 Connected!</h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">{postConnectionMessage}</p>
                    </div>
                    <Button onClick={handleGoToFinance} className="gap-2">
                        Go to Finance
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Connected state
    if (connection) {
        const isOwner = connection.ownerUid === user.uid;
        const partnerName = isOwner ? connection.memberDisplayName : connection.ownerDisplayName;

        return (
            <Card className="overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10">
                    <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-500 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                        </div>
                        Family Connected
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <span className="text-lg">👥</span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{partnerName}</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                    {isOwner ? 'Family Member' : 'Household Owner'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Connected since {new Date(connection.connectedAt).toLocaleDateString()}
                    </p>

                    <Button
                        variant="secondary"
                        onClick={handleDisconnect}
                        disabled={disconnecting}
                        className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/30"
                    >
                        {disconnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <UserMinus className="w-4 h-4 mr-2" />
                        )}
                        {isOwner ? 'Remove Family Member' : 'Leave Household'}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Pending confirmation component (shows when there's a pending invite)
    if (hasPendingInvite) {
        return (
            <PendingConfirmation
                userId={user.uid}
                onConnectionConfirmed={handleConnectionConfirmed}
            />
        );
    }

    // Invite form
    if (showInviteForm) {
        return (
            <Card className="overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10">
                    <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-500 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        Invite Family Member
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <InviteFamilyMember
                        userEmail={user.email || ''}
                        isEmailVerified={user.emailVerified}
                        onInviteSent={() => setShowInviteForm(false)}
                    />
                </CardContent>
            </Card>
        );
    }

    // Default: Show invite card
    return (
        <Card className="overflow-hidden border-dashed border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
            <CardContent className="p-6">
                <button
                    onClick={() => setShowInviteForm(true)}
                    className="w-full flex items-center gap-4 text-left group"
                >
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                        <Users className="w-6 h-6 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors">
                            Invite Family Member
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Share selected accounts with a spouse or partner
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </button>
            </CardContent>
        </Card>
    );
}

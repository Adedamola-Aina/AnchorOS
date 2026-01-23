/**
 * Family Mode v2 - Pending Confirmation Component
 * 
 * This component shows when the owner has an invitation awaiting their confirmation.
 * It displays the invitee's info and allows the owner to confirm or reject.
 */

import { useState, useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Users, Check, X, Loader2, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface PendingInvitation {
    id: string;
    inviteeEmail: string;
    status: 'pending' | 'awaiting_confirmation';
    createdAt: string;
}

interface ConfirmConnectionResult {
    success: boolean;
    rejected?: boolean;
    redirect?: string;
    message?: string;
    memberName?: string;
}

interface PendingConfirmationProps {
    userId: string;
    onConnectionConfirmed: (redirectTo: string, message: string) => void;
}

export function PendingConfirmation({ userId, onConnectionConfirmed }: PendingConfirmationProps) {
    const { showToast, confirm: confirmDialog } = useNotifications();
    const [pendingInvite, setPendingInvite] = useState<PendingInvitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmingConnection, setConfirmingConnection] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Listen for pending invitations
    useEffect(() => {
        const invitationsRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
        const q = query(
            invitationsRef,
            where('ownerUid', '==', userId),
            where('status', 'in', ['pending', 'awaiting_confirmation'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data = doc.data();
                setPendingInvite({
                    id: doc.id,
                    inviteeEmail: data.inviteeEmail,
                    status: data.status,
                    createdAt: data.createdAt,
                });
            } else {
                setPendingInvite(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const handleConfirm = async () => {
        setShowPasswordPrompt(true);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingInvite || !password) return;

        setConfirmingConnection(true);
        setError('');

        try {
            // Re-authenticate
            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error('Not authenticated');
            }

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Confirm connection via Cloud Function
            const functions = getFunctions();
            const confirmConnection = httpsCallable<
                { inviteId: string; password: string; confirmed: boolean },
                ConfirmConnectionResult
            >(functions, 'confirmConnection');

            const result = await confirmConnection({
                inviteId: pendingInvite.id,
                password,
                confirmed: true,
            });

            if (result.data.success && !result.data.rejected) {
                showToast(`Connected with ${result.data.memberName}!`, 'success');
                onConnectionConfirmed(
                    result.data.redirect || '/finance',
                    result.data.message || 'Connection confirmed!'
                );
            }
        } catch (err) {
            const error = err as Error & { code?: string };

            // MFA is required - user must complete full multi-factor authentication
            if (error.code === 'auth/multi-factor-auth-required') {
                setError('Multi-factor authentication required. Please sign out and sign back in with MFA, then try again.');
                setConfirmingConnection(false);
                return;
            }

            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setError('Incorrect password');
            } else {
                setError('Failed to confirm connection. Please try again.');
                console.error('Confirm connection error:', error);
            }
        } finally {
            setConfirmingConnection(false);
        }
    };

    const handleReject = async () => {
        if (!pendingInvite) return;

        const confirmed = await confirmDialog({
            title: 'Reject Connection?',
            message: `Are you sure you want to reject the connection with ${pendingInvite.inviteeEmail}? They will be notified.`,
            type: 'danger',
            confirmText: 'Reject',
        });

        if (!confirmed) return;

        setConfirmingConnection(true);

        try {
            const functions = getFunctions();
            const confirmConnection = httpsCallable<
                { inviteId: string; password: string; confirmed: boolean },
                ConfirmConnectionResult
            >(functions, 'confirmConnection');

            // For rejection, we don't need password re-auth
            await confirmConnection({
                inviteId: pendingInvite.id,
                password: '',
                confirmed: false,
            });

            showToast('Invitation rejected', 'info');
            setPendingInvite(null);
        } catch (err) {
            console.error('Reject connection error:', err);
            showToast('Failed to reject invitation', 'error');
        } finally {
            setConfirmingConnection(false);
        }
    };

    const handleCancelInvite = async () => {
        if (!pendingInvite) return;

        const confirmed = await confirmDialog({
            title: 'Cancel Invitation?',
            message: `Are you sure you want to cancel the invitation to ${pendingInvite.inviteeEmail}?`,
            type: 'danger',
            confirmText: 'Cancel Invitation',
        });

        if (!confirmed) return;

        try {
            const functions = getFunctions();
            const revokeInvitation = httpsCallable<{ inviteId: string }, { success: boolean }>(
                functions,
                'revokeInvitation'
            );

            await revokeInvitation({ inviteId: pendingInvite.id });
            showToast('Invitation cancelled', 'success');
            setPendingInvite(null);
        } catch (err) {
            console.error('Cancel invitation error:', err);
            showToast('Failed to cancel invitation', 'error');
        }
    };

    if (loading) {
        return null;
    }

    if (!pendingInvite) {
        return null;
    }

    // Awaiting confirmation - invitee has entered correct code
    if (pendingInvite.status === 'awaiting_confirmation') {
        return (
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        Confirm Family Connection
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {showPasswordPrompt ? (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Connecting with: <span className="font-semibold">{pendingInvite.inviteeEmail}</span>
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                    ✓ Verification code confirmed
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Confirm Your Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        autoFocus
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowPasswordPrompt(false);
                                        setPassword('');
                                        setError('');
                                    }}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={confirmingConnection || !password}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                                >
                                    {confirmingConnection ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Confirming...
                                        </>
                                    ) : (
                                        <>
                                            Confirm
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <span className="font-semibold">{pendingInvite.inviteeEmail}</span> has accepted your invitation and entered the correct verification code.
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                    Ready to connect! Confirm to complete the family link.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={handleReject}
                                    disabled={confirmingConnection}
                                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={confirmingConnection}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirm Connection
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Pending - waiting for invitee to accept
    return (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-400 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg animate-pulse">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Invitation Pending
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Waiting for <span className="font-semibold">{pendingInvite.inviteeEmail}</span> to accept and enter the verification code.
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Sent {new Date(pendingInvite.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={handleCancelInvite}
                        className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
                    >
                        Cancel Invitation
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

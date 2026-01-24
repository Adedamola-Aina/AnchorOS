/**
 * Family Mode v2 - Pending Confirmation Component
 * 
 * Orchestrates the pending invitation confirmation flow.
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */

import { useState, useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    getMultiFactorResolver,
    TotpMultiFactorGenerator,
    type MultiFactorResolver
} from 'firebase/auth';
import { auth, db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AwaitingConfirmationCard } from './AwaitingConfirmationCard';
import { PendingInviteCard } from './PendingInviteCard';
import { MfaConfirmationCard } from './MfaConfirmationCard';

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

    // MFA state
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [mfaCode, setMfaCode] = useState('');

    useEffect(() => {
        const invitationsRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
        const q = query(invitationsRef, where('ownerUid', '==', userId), where('status', 'in', ['pending', 'awaiting_confirmation']));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data = doc.data();
                setPendingInvite({ id: doc.id, inviteeEmail: data.inviteeEmail, status: data.status, createdAt: data.createdAt });
            } else {
                setPendingInvite(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [userId]);

    const completeConfirmation = async () => {
        if (!pendingInvite) return;
        const functions = getFunctions();
        const confirmConnection = httpsCallable<{ inviteId: string; password: string; confirmed: boolean }, ConfirmConnectionResult>(functions, 'confirmConnection');
        const result = await confirmConnection({ inviteId: pendingInvite.id, password, confirmed: true });
        if (result.data.success && !result.data.rejected) {
            showToast(`Connected with ${result.data.memberName}!`, 'success');
            onConnectionConfirmed(result.data.redirect || '/finance', result.data.message || 'Connection confirmed!');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingInvite || !password) return;
        setConfirmingConnection(true);
        setError('');
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error('Not authenticated');
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            await completeConfirmation();
        } catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/multi-factor-auth-required') {
                // MFA is required - get the resolver and show MFA prompt
                const resolver = getMultiFactorResolver(auth, err as any);
                setMfaResolver(resolver);
                setError('');
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setError('Incorrect password');
            } else {
                setError('Failed to confirm connection. Please try again.');
            }
        } finally {
            setConfirmingConnection(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mfaResolver || !mfaCode || mfaCode.length !== 6) return;
        setConfirmingConnection(true);
        setError('');
        try {
            const totpHint = mfaResolver.hints.find(hint => hint.factorId === 'totp');
            if (!totpHint) throw new Error('TOTP not found. Please use your authenticator app.');
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, mfaCode);
            await mfaResolver.resolveSignIn(assertion);
            await completeConfirmation();
        } catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/invalid-verification-code') {
                setError('Invalid code. Please try again.');
            } else {
                setError('MFA verification failed. Please try again.');
            }
        } finally {
            setConfirmingConnection(false);
        }
    };

    const handleReject = async () => {
        if (!pendingInvite) return;
        const confirmed = await confirmDialog({ title: 'Reject Connection?', message: `Are you sure you want to reject the connection with ${pendingInvite.inviteeEmail}?`, type: 'danger', confirmText: 'Reject' });
        if (!confirmed) return;
        setConfirmingConnection(true);
        try {
            const functions = getFunctions();
            const confirmConnection = httpsCallable<{ inviteId: string; password: string; confirmed: boolean }, ConfirmConnectionResult>(functions, 'confirmConnection');
            await confirmConnection({ inviteId: pendingInvite.id, password: '', confirmed: false });
            showToast('Invitation rejected', 'info');
            setPendingInvite(null);
        } catch (err) {
            showToast('Failed to reject invitation', 'error');
        } finally {
            setConfirmingConnection(false);
        }
    };

    const handleCancelInvite = async () => {
        if (!pendingInvite) return;
        const confirmed = await confirmDialog({ title: 'Cancel Invitation?', message: `Are you sure you want to cancel the invitation to ${pendingInvite.inviteeEmail}?`, type: 'danger', confirmText: 'Cancel Invitation' });
        if (!confirmed) return;
        try {
            const functions = getFunctions();
            const revokeInvitation = httpsCallable<{ inviteId: string }, { success: boolean }>(functions, 'revokeInvitation');
            await revokeInvitation({ inviteId: pendingInvite.id });
            showToast('Invitation cancelled', 'success');
            setPendingInvite(null);
        } catch (err) {
            showToast('Failed to cancel invitation', 'error');
        }
    };

    if (loading || !pendingInvite) return null;

    // Show MFA prompt if resolver is active
    if (mfaResolver) {
        return (
            <MfaConfirmationCard
                inviteeEmail={pendingInvite.inviteeEmail}
                mfaCode={mfaCode}
                setMfaCode={setMfaCode}
                error={error}
                confirmingConnection={confirmingConnection}
                onMfaSubmit={handleMfaSubmit}
                onBack={() => { setMfaResolver(null); setMfaCode(''); setError(''); }}
            />
        );
    }

    if (pendingInvite.status === 'awaiting_confirmation') {
        return (
            <AwaitingConfirmationCard
                inviteeEmail={pendingInvite.inviteeEmail}
                showPasswordPrompt={showPasswordPrompt}
                password={password}
                setPassword={setPassword}
                error={error}
                confirmingConnection={confirmingConnection}
                onPasswordSubmit={handlePasswordSubmit}
                onBack={() => { setShowPasswordPrompt(false); setPassword(''); setError(''); }}
                onConfirm={() => setShowPasswordPrompt(true)}
                onReject={handleReject}
            />
        );
    }

    return (
        <PendingInviteCard
            inviteeEmail={pendingInvite.inviteeEmail}
            createdAt={pendingInvite.createdAt}
            onCancelInvite={handleCancelInvite}
        />
    );
}


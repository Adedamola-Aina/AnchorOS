/**
 * Family Mode v2 - Pending Confirmation Component
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Handlers extracted to pendingConfirmationHandlers.ts
 */

import { useState, useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import type { MultiFactorResolver } from 'firebase/auth';
import { db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AwaitingConfirmationCard } from './AwaitingConfirmationCard';
import { PendingInviteCard } from './PendingInviteCard';
import { MfaConfirmationCard } from './MfaConfirmationCard';
import { completeConnectionConfirmation, reauthenticateUser, getMfaResolver, verifyMfaAndComplete, rejectInvitation, cancelInvitation } from './pendingConfirmationHandlers';

interface PendingInvitation { id: string; inviteeEmail: string; status: 'pending' | 'awaiting_confirmation'; createdAt: string; }
interface PendingConfirmationProps { userId: string; onConnectionConfirmed: (redirectTo: string, message: string) => void; }

export function PendingConfirmation({ userId, onConnectionConfirmed }: PendingConfirmationProps) {
    const { showToast, confirm: confirmDialog } = useNotifications();
    const [pendingInvite, setPendingInvite] = useState<PendingInvitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmingConnection, setConfirmingConnection] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [mfaCode, setMfaCode] = useState('');

    useEffect(() => {
        const invitationsRef = collection(db, 'artifacts', APP_ID, 'family_invitations');
        const q = query(invitationsRef, where('ownerUid', '==', userId), where('status', 'in', ['pending', 'awaiting_confirmation']));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0]; const data = doc.data();
                setPendingInvite({ id: doc.id, inviteeEmail: data.inviteeEmail, status: data.status, createdAt: data.createdAt });
            } else { setPendingInvite(null); }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [userId]);

    const completeConfirmation = async () => {
        if (!pendingInvite) return;
        const result = await completeConnectionConfirmation(pendingInvite.id, password);
        if (result.success && !result.rejected) {
            showToast(`Connected with ${result.memberName}!`, 'success');
            onConnectionConfirmed(result.redirect || '/finance', result.message || 'Connection confirmed!');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingInvite || !password) return;
        setConfirmingConnection(true); setError('');
        try { await reauthenticateUser(password); await completeConfirmation(); }
        catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/multi-factor-auth-required') { setMfaResolver(getMfaResolver(err)); setError(''); }
            else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') { setError('Incorrect password'); }
            else { setError('Failed to confirm connection. Please try again.'); }
        } finally { setConfirmingConnection(false); }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mfaResolver || !mfaCode || mfaCode.length !== 6) return;
        setConfirmingConnection(true); setError('');
        try { await verifyMfaAndComplete(mfaResolver, mfaCode); await completeConfirmation(); }
        catch (err) {
            const error = err as Error & { code?: string };
            setError(error.code === 'auth/invalid-verification-code' ? 'Invalid code. Please try again.' : 'MFA verification failed. Please try again.');
        } finally { setConfirmingConnection(false); }
    };

    const handleReject = async () => {
        if (!pendingInvite) return;
        const confirmed = await confirmDialog({ title: 'Reject Connection?', message: `Reject connection with ${pendingInvite.inviteeEmail}?`, type: 'danger', confirmText: 'Reject' });
        if (!confirmed) return;
        setConfirmingConnection(true);
        try { await rejectInvitation(pendingInvite.id); showToast('Invitation rejected', 'info'); setPendingInvite(null); }
        catch { showToast('Failed to reject invitation', 'error'); }
        finally { setConfirmingConnection(false); }
    };

    const handleCancelInvite = async () => {
        if (!pendingInvite) return;
        const confirmed = await confirmDialog({ title: 'Cancel Invitation?', message: `Cancel invitation to ${pendingInvite.inviteeEmail}?`, type: 'danger', confirmText: 'Cancel Invitation' });
        if (!confirmed) return;
        try { await cancelInvitation(pendingInvite.id); showToast('Invitation cancelled', 'success'); setPendingInvite(null); }
        catch { showToast('Failed to cancel invitation', 'error'); }
    };

    if (loading || !pendingInvite) return null;

    if (mfaResolver) {
        return <MfaConfirmationCard inviteeEmail={pendingInvite.inviteeEmail} mfaCode={mfaCode} setMfaCode={setMfaCode} error={error} confirmingConnection={confirmingConnection}
            onMfaSubmit={handleMfaSubmit} onBack={() => { setMfaResolver(null); setMfaCode(''); setError(''); }} />;
    }
    if (pendingInvite.status === 'awaiting_confirmation') {
        return <AwaitingConfirmationCard inviteeEmail={pendingInvite.inviteeEmail} showPasswordPrompt={showPasswordPrompt} password={password} setPassword={setPassword}
            error={error} confirmingConnection={confirmingConnection} onPasswordSubmit={handlePasswordSubmit}
            onBack={() => { setShowPasswordPrompt(false); setPassword(''); setError(''); }} onConfirm={() => setShowPasswordPrompt(true)} onReject={handleReject} />;
    }
    return <PendingInviteCard inviteeEmail={pendingInvite.inviteeEmail} createdAt={pendingInvite.createdAt} onCancelInvite={handleCancelInvite} />;
}

/**
 * Family Mode v2 - Invite Family Member Component
 *
 * Re-authentication stays client-side; the account password is never sent to
 * the invitation Cloud Function. The function returns a manual verification
 * code so invitations remain usable if transactional email is unavailable.
 */
// @ts-nocheck

import { useState } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    getMultiFactorResolver,
    TotpMultiFactorGenerator,
} from 'firebase/auth';
import type { MultiFactorResolver } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { EmailVerificationWarning } from './EmailVerificationWarning';
import { InviteEmailStep } from './InviteEmailStep';
import { InvitePasswordStep } from './InvitePasswordStep';
import { InviteMfaStep } from './InviteMfaStep';
import { InviteSuccessStep } from './InviteSuccessStep';
import { mapInvitationError, mapMfaError, validateInviteeEmail } from './inviteFamilyHelpers';

interface InviteFamilyMemberProps {
    userEmail: string;
    isEmailVerified: boolean;
    onInviteSent: () => void;
}

type Step = 'email' | 'password' | 'mfa' | 'code';

interface CreateInvitationResult {
    success: boolean;
    verificationCode: string;
    inviteId: string;
    emailDelivered: boolean;
}

export function InviteFamilyMember({ userEmail, isEmailVerified, onInviteSent }: InviteFamilyMemberProps) {
    const { showToast } = useNotifications();
    const [step, setStep] = useState<Step>('email');
    const [inviteeEmail, setInviteeEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);

    if (!isEmailVerified) return <EmailVerificationWarning />;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const validationError = validateInviteeEmail(inviteeEmail, userEmail);
        if (validationError) { setError(validationError); return; }
        setStep('password');
    };

    const completeInvitation = async () => {
        const functions = getFunctions();
        const createInvitation = httpsCallable<{ inviteeEmail: string }, CreateInvitationResult>(
            functions, 'createFamilyInvitation'
        );
        const result = await createInvitation({ inviteeEmail });
        if (!result.data.success) return;
        setVerificationCode(result.data.verificationCode);
        setPassword('');
        setStep('code');
        showToast(
            result.data.emailDelivered
                ? 'Invitation sent. You can also share the code below.'
                : 'Invitation created. Email is unavailable, so share the code below.',
            result.data.emailDelivered ? 'success' : 'info',
        );
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error('Not authenticated');
            const credential = EmailAuthProvider.credential(user.email, password);
            try {
                await reauthenticateWithCredential(user, credential);
            } catch (authErr: unknown) {
                const authError = authErr as { code?: string };
                if (authError.code === 'auth/multi-factor-auth-required') {
                    const resolver = getMultiFactorResolver(auth, authErr as Parameters<typeof getMultiFactorResolver>[1]);
                    setMfaResolver(resolver); setStep('mfa'); setLoading(false); return;
                }
                throw authErr;
            }
            await completeInvitation();
        } catch (err) {
            setError(mapInvitationError(err as Error & { code?: string }));
        } finally { setLoading(false); }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (!mfaResolver) throw new Error('MFA session expired. Please start over.');
            const totpHint = mfaResolver.hints.find(hint => hint.factorId === 'totp');
            if (!totpHint) throw new Error('TOTP not found. Please use your authenticator app.');
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, mfaCode);
            await mfaResolver.resolveSignIn(assertion);
            await completeInvitation();
        } catch (err) {
            setError(mapMfaError(err as Error & { code?: string }));
        } finally { setLoading(false); }
    };

    const copyCode = async () => {
        await navigator.clipboard.writeText(verificationCode);
        setCopied(true); showToast('Code copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (step === 'email') return <InviteEmailStep inviteeEmail={inviteeEmail} setInviteeEmail={setInviteeEmail} error={error} onSubmit={handleEmailSubmit} />;
    if (step === 'password') return <InvitePasswordStep inviteeEmail={inviteeEmail} password={password} setPassword={setPassword} error={error} loading={loading} onSubmit={handlePasswordSubmit} onBack={() => { setStep('email'); setPassword(''); setError(''); }} />;
    if (step === 'mfa') return <InviteMfaStep mfaCode={mfaCode} setMfaCode={setMfaCode} error={error} loading={loading} onSubmit={handleMfaSubmit} onBack={() => { setStep('password'); setMfaCode(''); setMfaResolver(null); setError(''); }} />;

    return <InviteSuccessStep inviteeEmail={inviteeEmail} verificationCode={verificationCode} copied={copied} onCopyCode={copyCode} onDone={onInviteSent} />;
}

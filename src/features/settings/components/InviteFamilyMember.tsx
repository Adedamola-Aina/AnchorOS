/**
 * Family Mode v2 - Invite Family Member Component
 * 
 * Orchestrates the multi-step family invitation flow:
 * 1. Enter invitee's email
 * 2. Re-enter password to confirm intent
 * 3. MFA verification (if enabled)
 * 4. Display verification code to share
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */

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

    if (!isEmailVerified) {
        return <EmailVerificationWarning />;
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!inviteeEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (inviteeEmail.toLowerCase() === userEmail.toLowerCase()) {
            setError('You cannot invite yourself');
            return;
        }
        setStep('password');
    };

    const completeInvitation = async () => {
        const functions = getFunctions();
        const createInvitation = httpsCallable<{ inviteeEmail: string; password: string }, CreateInvitationResult>(
            functions, 'createFamilyInvitation'
        );
        const result = await createInvitation({ inviteeEmail, password });
        if (result.data.success) {
            setVerificationCode(result.data.verificationCode);
            setStep('code');
            showToast('Invitation sent! Share the code below with your family member.', 'success');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
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
                    setMfaResolver(resolver);
                    setStep('mfa');
                    setLoading(false);
                    return;
                }
                throw authErr;
            }
            await completeInvitation();
        } catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setError('Incorrect password');
            } else if (error.message?.includes('already have')) {
                setError(error.message);
            } else if (error.message?.includes('Maximum')) {
                setError('You have reached the daily limit of 10 invitations. Please try again tomorrow.');
            } else {
                setError('Failed to create invitation. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!mfaResolver) throw new Error('MFA session expired. Please start over.');
            const totpHint = mfaResolver.hints.find(hint => hint.factorId === 'totp');
            if (!totpHint) throw new Error('TOTP not found. Please use your authenticator app.');
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, mfaCode);
            await mfaResolver.resolveSignIn(assertion);
            await completeInvitation();
        } catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/invalid-verification-code') {
                setError('Invalid code. Please check your authenticator app.');
            } else {
                setError(error.message || 'MFA verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const copyCode = async () => {
        await navigator.clipboard.writeText(verificationCode);
        setCopied(true);
        showToast('Code copied to clipboard', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (step === 'email') {
        return <InviteEmailStep inviteeEmail={inviteeEmail} setInviteeEmail={setInviteeEmail} error={error} onSubmit={handleEmailSubmit} />;
    }

    if (step === 'password') {
        return (
            <InvitePasswordStep
                inviteeEmail={inviteeEmail} password={password} setPassword={setPassword}
                error={error} loading={loading} onSubmit={handlePasswordSubmit}
                onBack={() => { setStep('email'); setPassword(''); setError(''); }}
            />
        );
    }

    if (step === 'mfa') {
        return (
            <InviteMfaStep
                mfaCode={mfaCode} setMfaCode={setMfaCode} error={error} loading={loading}
                onSubmit={handleMfaSubmit}
                onBack={() => { setStep('password'); setMfaCode(''); setMfaResolver(null); setError(''); }}
            />
        );
    }

    return (
        <InviteSuccessStep
            inviteeEmail={inviteeEmail} verificationCode={verificationCode}
            copied={copied} onCopyCode={copyCode} onDone={onInviteSent}
        />
    );
}

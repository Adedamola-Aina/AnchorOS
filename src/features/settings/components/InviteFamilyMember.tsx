/**
 * Family Mode v2 - Invite Family Member Component
 * 
 * This component handles the owner's side of creating a family invitation:
 * 1. Enter invitee's email
 * 2. Re-enter password to confirm intent
 * 3. Display verification code to share via separate channel
 */

import { useState } from 'react';
import { Mail, Lock, Copy, Check, Loader2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
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

    // MFA state
    const [mfaCode, setMfaCode] = useState('');
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);

    if (!isEmailVerified) {
        return (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-amber-900 dark:text-amber-400">Email Verification Required</p>
                            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                Please verify your email address before inviting family members. Check your inbox for a verification link.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
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

    // Helper to complete invitation after successful auth
    const completeInvitation = async () => {
        const functions = getFunctions();
        const createInvitation = httpsCallable<
            { inviteeEmail: string; password: string },
            CreateInvitationResult
        >(functions, 'createFamilyInvitation');

        const result = await createInvitation({
            inviteeEmail,
            password,
        });

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
            if (!user || !user.email) {
                throw new Error('Not authenticated');
            }

            const credential = EmailAuthProvider.credential(user.email, password);

            try {
                await reauthenticateWithCredential(user, credential);
            } catch (authErr: unknown) {
                const authError = authErr as { code?: string };
                if (authError.code === 'auth/multi-factor-auth-required') {
                    // MFA is required - get resolver and show MFA step
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
                console.error('Create invitation error:', error);
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
            if (!mfaResolver) {
                throw new Error('MFA session expired. Please start over.');
            }

            // Get the TOTP hint (should be the first/only one for our app)
            const totpHint = mfaResolver.hints.find(hint => hint.factorId === 'totp');
            if (!totpHint) {
                throw new Error('TOTP not found. Please use your authenticator app.');
            }

            // Create assertion with the TOTP code
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(
                totpHint.uid,
                mfaCode
            );

            // Complete the MFA sign-in
            await mfaResolver.resolveSignIn(assertion);

            // Now complete the invitation
            await completeInvitation();
        } catch (err) {
            const error = err as Error & { code?: string };
            if (error.code === 'auth/invalid-verification-code') {
                setError('Invalid code. Please check your authenticator app.');
            } else {
                setError(error.message || 'MFA verification failed. Please try again.');
                console.error('MFA error:', error);
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

    const handleDone = () => {
        onInviteSent();
    };

    // Step 1: Enter Email
    if (step === 'email') {
        return (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Family Member's Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="email"
                            value={inviteeEmail}
                            onChange={(e) => setInviteeEmail(e.target.value)}
                            placeholder="spouse@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </form>
        );
    }

    // Step 2: Confirm Password
    if (step === 'password') {
        return (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Inviting: <span className="font-semibold">{inviteeEmail}</span>
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
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus
                            autoComplete="current-password"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        This confirms your intent to invite a family member.
                    </p>
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
                            setStep('email');
                            setPassword('');
                            setError('');
                        }}
                        className="flex-1"
                    >
                        Back
                    </Button>
                    <Button type="submit" className="flex-1 gap-2" disabled={loading || !password}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Invitation
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        );
    }

    // Step 2.5: MFA Verification
    if (step === 'mfa') {
        return (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                        <KeyRound className="w-5 h-5" />
                        <p className="font-semibold">Two-Factor Authentication Required</p>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Enter the 6-digit code from your authenticator app.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Authenticator Code
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center text-2xl tracking-[0.3em] font-mono"
                            autoFocus
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
                            setStep('password');
                            setMfaCode('');
                            setMfaResolver(null);
                            setError('');
                        }}
                        className="flex-1"
                    >
                        Back
                    </Button>
                    <Button type="submit" className="flex-1 gap-2" disabled={loading || mfaCode.length !== 6}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify & Send
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        );
    }

    // Step 3: Display Verification Code
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Invitation Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    An email has been sent to <span className="font-semibold">{inviteeEmail}</span>
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
                    Verification Code
                </p>
                <div className="flex items-center justify-center gap-2">
                    <code className="text-4xl font-mono font-bold tracking-[0.5em] text-slate-900 dark:text-white">
                        {verificationCode}
                    </code>
                    <button
                        onClick={copyCode}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <Copy className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                    For convenience, this code has also been included in the invitation email.
                </p>
            </div>

            <Button onClick={handleDone} className="w-full">
                Done
            </Button>
        </div>
    );
}

/**
 * Family Mode v2 - Accept Invitation View
 * 
 * This view handles the invitee's side of accepting a family invitation:
 * 1. Validate the invitation token from URL
 * 2. Show owner's info (name, email)
 * 3. Prompt for verification code (received via separate channel)
 * 4. On success, show waiting message for owner confirmation
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle, Users, ArrowRight, Lock } from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface ValidateTokenResult {
    valid: boolean;
    error?: string;
    ownerDisplayName?: string;
    ownerEmail?: string;
    expiresAt?: string;
    status?: string;
    isLocked?: boolean;
    isExpired?: boolean;
}

interface AcceptInvitationResult {
    success: boolean;
    attemptsRemaining?: number;
}

export const AcceptInviteView = () => {
    const { user } = useAuth();

    const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'code_entry' | 'verifying' | 'awaiting_confirmation' | 'locked'>('validating');
    const [inviteData, setInviteData] = useState<ValidateTokenResult | null>(null);
    const [inviteId, setInviteId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [attemptsRemaining, setAttemptsRemaining] = useState<number>(5);

    useEffect(() => {
        const checkToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const code = params.get('code');

            if (!token) {
                setStatus('invalid');
                setError('No invitation token provided.');
                return;
            }

            setInviteId(token);
            if (code) setVerificationCode(code);

            try {
                const functions = getFunctions();
                const validateToken = httpsCallable<{ token: string }, ValidateTokenResult>(
                    functions,
                    'validateInvitationToken'
                );

                const result = await validateToken({ token });
                const data = result.data;

                if (data.valid) {
                    setInviteData(data);
                    // If already awaiting confirmation, show that state
                    if (data.status === 'awaiting_confirmation') {
                        setStatus('awaiting_confirmation');
                    } else {
                        setStatus('valid');
                    }
                } else {
                    setStatus(data.isLocked ? 'locked' : 'invalid');
                    setError(data.error || 'Invalid invitation.');
                }
            } catch (err) {
                console.error(err);
                setStatus('invalid');
                setError('Failed to validate invitation.');
            }
        };

        checkToken();
    }, []);

    const handleProceedToCode = () => {
        // If we have a pre-filled code from URL, skip manual entry phase
        if (verificationCode.length === 6) {
            // Mock the event object since we're calling it directly
            handleVerifyCode({ preventDefault: () => { } } as React.FormEvent);
        } else {
            setStatus('code_entry');
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !inviteId || verificationCode.length !== 6) return;

        setStatus('verifying');
        setError('');

        try {
            const functions = getFunctions();
            const acceptInvitation = httpsCallable<
                { inviteId: string; verificationCode: string },
                AcceptInvitationResult
            >(functions, 'acceptInvitation');

            const result = await acceptInvitation({
                inviteId,
                verificationCode,
            });

            if (result.data.success) {
                setStatus('awaiting_confirmation');
            } else {
                // Wrong code
                const remaining = result.data.attemptsRemaining || 0;
                setAttemptsRemaining(remaining);

                if (remaining === 0) {
                    setStatus('locked');
                    setError('Too many failed attempts. This invitation has been locked.');
                } else {
                    setStatus('code_entry');
                    setError(`Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
                    setVerificationCode('');
                    // If magic code failed, clear it so they can try manual
                }
            }
        } catch (err) {
            const error = err as Error & { code?: string };
            console.error(err);

            if (error.message?.includes('locked')) {
                setStatus('locked');
                setError('This invitation has been locked due to too many failed attempts.');
            } else {
                setStatus('code_entry');
                setError('Failed to verify code. Please try again.');
            }
        }
    };

    // ... (Loading states remain same)

    if (status === 'validating') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-900 dark:text-white animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Checking invitation...</p>
                </div>
            </div>
        );
    }

    // ... (Error states remain same, omitted for brevity but preserved in final output)
    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invitation Invalid</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-900 dark:text-white font-bold transition-all w-full"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'locked') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invitation Locked</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {error || 'Too many failed verification attempts. Please ask the sender to create a new invitation.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-slate-900 dark:text-white font-bold transition-all w-full"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'awaiting_confirmation') {
        // ... (Same as before)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">You're All Set!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Waiting for <span className="font-semibold">{inviteData?.ownerDisplayName || inviteData?.ownerEmail}</span> to confirm the connection.
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm text-slate-600 dark:text-slate-300">
                        <p>You'll receive a notification when they confirm. This usually happens quickly.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transition-all"
                    >
                        Continue to App
                    </button>
                </div>
            </div>
        );
    }

    // Main view
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                {status === 'valid' || status === 'verifying' ? (
                    // Step 1: Show invitation details
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Family Invitation</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                                <strong className="text-slate-900 dark:text-white">{inviteData?.ownerDisplayName || inviteData?.ownerEmail}</strong> invited you to join their household.
                            </p>
                        </div>

                        {!user ? (
                            <div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm rounded-xl mb-4 text-center font-medium border border-slate-100 dark:border-slate-800">
                                    Please log in or create an account to accept.
                                </div>
                                <button
                                    onClick={() => {
                                        sessionStorage.setItem('returnAfterAuth', window.location.href);
                                        window.location.href = '/';
                                    }}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    Log In or Create Account <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Logged in as {user.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleProceedToCode}
                                    disabled={status === 'verifying'}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {status === 'verifying' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Join Family <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                                {verificationCode && verificationCode.length === 6 && (
                                    <p className="text-xs text-center text-slate-400 mt-3">
                                        <CheckCircle className="w-3 h-3 inline mr-1 text-emerald-500" />
                                        Secure code verified from invite link
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    // Step 2: Manual Code Entry (Only if no magic link)
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enter Verification Code</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                                Enter the 6-digit code found in your invitation email.
                            </p>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setVerificationCode(val);
                                }}
                                placeholder="000000"
                                className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-4 px-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength={6}
                                autoFocus
                            />
                            <p className="text-xs text-slate-400 text-center mt-2">
                                {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 justify-center text-rose-600 dark:text-rose-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setStatus('valid');
                                    // Don't clear verificationCode here if it came from URL
                                    if (!new URLSearchParams(window.location.search).get('code')) {
                                        setVerificationCode('');
                                    }
                                    setError('');
                                }}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={verificationCode.length !== 6}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Verify
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

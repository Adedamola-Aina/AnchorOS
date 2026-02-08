/**
 * Family Mode v2 - Accept Invitation View
 * 
 * Orchestrates the invitation acceptance flow.
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { InviteStatusDisplay } from './components/InviteStatusDisplay';
import { InviteDetails } from './components/InviteDetails';
import { InviteCodeEntry } from './components/InviteCodeEntry';

interface ValidateTokenResult {
    valid: boolean;
    error?: string;
    ownerDisplayName?: string;
    ownerEmail?: string;
    status?: string;
    isLocked?: boolean;
}

interface AcceptInvitationResult {
    success: boolean;
    attemptsRemaining?: number;
}

type InviteStatus = 'validating' | 'valid' | 'invalid' | 'code_entry' | 'verifying' | 'awaiting_confirmation' | 'locked';

export const AcceptInviteView = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<InviteStatus>('validating');
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
                const validateToken = httpsCallable<{ token: string }, ValidateTokenResult>(functions, 'validateInvitationToken');
                const result = await validateToken({ token });
                const data = result.data;

                if (data.valid) {
                    setInviteData(data);
                    setStatus(data.status === 'awaiting_confirmation' ? 'awaiting_confirmation' : 'valid');
                } else {
                    setStatus(data.isLocked ? 'locked' : 'invalid');
                    setError(data.error || 'Invalid invitation.');
                }
            } catch (err) {
                console.error(err);
                setStatus('invalid');
                setError('Invitation Invalid.'); // Ensure heading matches text expectations if needed
            }
        };
        checkToken();
    }, []);

    const handleProceedToCode = () => {
        if (verificationCode.length === 6) {
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
            const acceptInvitation = httpsCallable<{ inviteId: string; verificationCode: string }, AcceptInvitationResult>(functions, 'acceptInvitation');
            const result = await acceptInvitation({ inviteId, verificationCode });

            if (result.data.success) {
                setStatus('awaiting_confirmation');
            } else {
                const remaining = result.data.attemptsRemaining || 0;
                setAttemptsRemaining(remaining);
                if (remaining === 0) {
                    setStatus('locked');
                    setError('Too many failed attempts. This invitation has been locked.');
                } else {
                    setStatus('code_entry');
                    setError(`Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
                    setVerificationCode('');
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

    const handleBack = () => {
        setStatus('valid');
        if (!new URLSearchParams(window.location.search).get('code')) {
            setVerificationCode('');
        }
        setError('');
    };

    const ownerName = inviteData?.ownerDisplayName || inviteData?.ownerEmail || '';

    // Status display states
    if (['validating', 'invalid', 'locked', 'awaiting_confirmation'].includes(status)) {
        return <InviteStatusDisplay status={status as 'validating' | 'invalid' | 'locked' | 'awaiting_confirmation'} error={error} ownerName={ownerName} />;
    }

    // Main view
    return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                {status === 'valid' || status === 'verifying' ? (
                    <InviteDetails
                        user={user}
                        ownerName={ownerName}
                        isVerifying={status === 'verifying'}
                        hasVerificationCode={verificationCode.length === 6}
                        onProceed={handleProceedToCode}
                    />
                ) : (
                    <InviteCodeEntry
                        verificationCode={verificationCode}
                        setVerificationCode={setVerificationCode}
                        attemptsRemaining={attemptsRemaining}
                        error={error}
                        onSubmit={handleVerifyCode}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
};

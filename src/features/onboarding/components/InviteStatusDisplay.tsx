/**
 * InviteStatusDisplay - Displays various states of the invitation flow
 * 
 * Handles: validating, invalid, locked, and awaiting_confirmation states.
 */

import { Loader2, AlertCircle, CheckCircle, Lock } from 'lucide-react';

interface InviteStatusDisplayProps {
    status: 'validating' | 'invalid' | 'locked' | 'awaiting_confirmation';
    error?: string;
    ownerName?: string;
}

export function InviteStatusDisplay({ status, error, ownerName }: InviteStatusDisplayProps) {
    if (status === 'validating') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-2 dark:bg-surface-1-dark p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-foreground dark:text-foreground-dark animate-spin" />
                    <p className="text-muted font-medium animate-pulse">Checking invitation...</p>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-2 dark:bg-surface-1-dark p-4">
                <div className="bg-surface-1 dark:bg-surface-2-dark p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-danger-500" />
                    </div>
                    <h2 className="text-h2 lg:text-h2-lg text-foreground dark:text-foreground-dark">Invitation Invalid</h2>
                    <p className="text-muted">{error}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-6 py-3 bg-surface-3 dark:bg-surface-3-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark rounded-xl text-foreground dark:text-foreground-dark font-bold transition-all w-full"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'locked') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-2 dark:bg-surface-1-dark p-4">
                <div className="bg-surface-1 dark:bg-surface-2-dark p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-danger-500" />
                    </div>
                    <h2 className="text-h2 lg:text-h2-lg text-foreground dark:text-foreground-dark">Invitation Locked</h2>
                    <p className="text-muted">
                        {error || 'Too many failed verification attempts. Please ask the sender to create a new invitation.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-6 py-3 bg-surface-3 dark:bg-surface-3-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark rounded-xl text-foreground dark:text-foreground-dark font-bold transition-all w-full"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // awaiting_confirmation
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-2 dark:bg-surface-1-dark p-4">
            <div className="bg-surface-1 dark:bg-surface-2-dark p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-finance-100 dark:bg-finance-900/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-finance-500" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-foreground dark:text-foreground-dark">You're All Set!</h2>
                    <p className="text-muted mt-2">
                        Waiting for <span className="font-semibold">{ownerName}</span> to confirm the connection.
                    </p>
                </div>
                <div className="p-4 bg-surface-2 dark:bg-surface-1-dark/50 rounded-xl text-sm text-subtle dark:text-subtle-dark">
                    <p>You'll receive a notification when they confirm. This usually happens quickly.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full py-3.5 bg-foreground hover:bg-foreground/90 dark:bg-foreground-dark dark:hover:bg-foreground-dark/90 text-white dark:text-foreground rounded-xl font-bold shadow-lg transition-all"
                >
                    Continue to App
                </button>
            </div>
        </div>
    );
}

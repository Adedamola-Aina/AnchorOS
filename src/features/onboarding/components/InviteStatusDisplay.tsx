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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-slate-900 dark:text-white animate-spin" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Checking invitation...</p>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Invitation Invalid</h2>
                    <p className="text-slate-500 dark:text-slate-400">{error}</p>
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
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Invitation Locked</h2>
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

    // awaiting_confirmation
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">You're All Set!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Waiting for <span className="font-semibold">{ownerName}</span> to confirm the connection.
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

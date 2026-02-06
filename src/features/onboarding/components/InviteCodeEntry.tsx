/**
 * InviteCodeEntry - Manual verification code entry form
 * 
 * Handles the 6-digit code input with validation.
 */

import { AlertCircle } from 'lucide-react';

interface InviteCodeEntryProps {
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    attemptsRemaining: number;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function InviteCodeEntry({
    verificationCode,
    setVerificationCode,
    attemptsRemaining,
    error,
    onSubmit,
    onBack,
}: InviteCodeEntryProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="text-center">
                <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Enter Verification Code</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Enter the 6-digit code found in your invitation email.
                </p>
            </div>

            <div>
                <input
                    type="text"
                    inputMode="numeric"
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
                    onClick={onBack}
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
    );
}

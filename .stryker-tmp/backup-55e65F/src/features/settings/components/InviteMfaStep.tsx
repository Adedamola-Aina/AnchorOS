/**
 * InviteMfaStep - Step 2.5 of family invitation flow
 * 
 * Handles MFA verification when required during invitation.
 */

import { useEffect, useRef } from 'react';
import { KeyRound, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface InviteMfaStepProps {
    mfaCode: string;
    setMfaCode: (code: string) => void;
    error: string;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function InviteMfaStep({
    mfaCode,
    setMfaCode,
    error,
    loading,
    onSubmit,
    onBack,
}: InviteMfaStepProps) {
    const submittedRef = useRef(false);

    useEffect(() => {
        if (mfaCode.length === 6 && !loading && !submittedRef.current) {
            submittedRef.current = true;
            onSubmit({ preventDefault: () => {} } as React.FormEvent);
        }
        if (mfaCode.length < 6) submittedRef.current = false;
    }, [mfaCode, loading, onSubmit]);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
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

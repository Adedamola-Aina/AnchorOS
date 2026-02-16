/**
 * InvitePasswordStep - Step 2 of family invitation flow
 * 
 * Confirms user's password before sending invitation.
 */
// @ts-nocheck


import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface InvitePasswordStepProps {
    inviteeEmail: string;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function InvitePasswordStep({
    inviteeEmail,
    password,
    setPassword,
    error,
    loading,
    onSubmit,
    onBack,
}: InvitePasswordStepProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
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

/**
 * InviteEmailStep - Step 1 of family invitation flow
 * 
 * Collects the invitee's email address.
 */
// @ts-nocheck


import { Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface InviteEmailStepProps {
    inviteeEmail: string;
    setInviteeEmail: (email: string) => void;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
}

export function InviteEmailStep({ inviteeEmail, setInviteeEmail, error, onSubmit }: InviteEmailStepProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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

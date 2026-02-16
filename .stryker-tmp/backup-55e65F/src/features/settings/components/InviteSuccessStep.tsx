/**
 * InviteSuccessStep - Step 3 of family invitation flow
 * 
 * Displays the verification code after successful invitation.
 */

import { Copy, Check } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface InviteSuccessStepProps {
    inviteeEmail: string;
    verificationCode: string;
    copied: boolean;
    onCopyCode: () => void;
    onDone: () => void;
}

export function InviteSuccessStep({
    inviteeEmail,
    verificationCode,
    copied,
    onCopyCode,
    onDone,
}: InviteSuccessStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Invitation Sent!</h3>
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
                        onClick={onCopyCode}
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

            <Button onClick={onDone} className="w-full">
                Done
            </Button>
        </div>
    );
}

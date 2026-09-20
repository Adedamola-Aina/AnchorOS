import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';

interface TechnicalDetailsProps {
    uid: string;
    onCopied?: () => void;
}

/**
 * TechnicalDetails (UX-ST-03)
 *
 * The raw internal account id used to be **primary information** in the Profile
 * card — an unexplained `test-owner` string sitting next to the display name.
 * It is not an identity: it is a support handle.
 *
 * It now lives here, collapsed, with the two things that made it a defect
 * removed:
 *   - it is *explained* (what it is, why a support agent may ask for it, and
 *     explicitly that it is not a password and grants nothing), and
 *   - it is *optional* — the disclosure is closed by default, so nobody reads
 *     their account id unless they need it.
 *
 * Collapsed-by-default is also why this is a `<details>` element rather than
 * state-driven UI: keyboard and screen-reader semantics come for free.
 */
export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ uid, onCopied }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(uid);
            setCopied(true);
            onCopied?.();
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard permission can be refused; the id stays selectable so
            // the user can still copy it by hand.
        }
    };

    if (!uid) return null;

    return (
        <details
            data-testid="technical-details"
            className="group rounded-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
        >
            <summary className="flex items-center justify-between gap-2 cursor-pointer list-none min-h-11">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Technical details</span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>

            <div className="space-y-2 pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your account identifier. A support agent may ask for it to find your account. It is not a password and
                    it does not grant access to anything.
                </p>
                <div className="flex items-center gap-2">
                    <code
                        data-testid="technical-details-uid"
                        className="flex-1 min-w-0 truncate rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-mono text-slate-500 dark:text-slate-400 select-all"
                    >
                        {uid}
                    </code>
                    <button
                        type="button"
                        onClick={() => void handleCopy()}
                        aria-label="Copy account identifier"
                        className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied
                            ? <><Check className="w-3.5 h-3.5" aria-hidden="true" />Copied</>
                            : <><Copy className="w-3.5 h-3.5" aria-hidden="true" />Copy</>}
                    </button>
                </div>
            </div>
        </details>
    );
};

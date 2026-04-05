/**
 * EmptyAccountsState - Empty state card matching ISO 7810 card ratio.
 * UX-041 Phase 5. Dashed outline invites first account creation.
 */
// @ts-nocheck


import { Landmark, Plus } from 'lucide-react';

const CARD_ASPECT_RATIO = 1.586;

interface EmptyAccountsStateProps {
    onCreateAccount: () => void;
}

export const EmptyAccountsState = ({ onCreateAccount }: EmptyAccountsStateProps) => {
    return (
        <div
            className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl animate-in fade-in zoom-in-95 duration-500 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
            style={{ aspectRatio: `${CARD_ASPECT_RATIO}` }}
            onClick={onCreateAccount}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCreateAccount(); } }}
            aria-label="Create your first account"
        >
            <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                    <Landmark className="w-8 h-8 text-emerald-500/60 dark:text-emerald-400/60" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-3 h-3 text-blue-500" />
                </div>
            </div>
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-1">No accounts yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs text-sm px-4">
                Tap to add your first account
            </p>
        </div>
    );
};

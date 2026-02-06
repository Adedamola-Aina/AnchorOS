/**
 * AccountHeader Sub-components
 * Split from AccountHeader.tsx per CLAUDE.md §3.2 (200-line rule)
 */

import React from 'react';
import { Check, X, ArrowUpRight } from 'lucide-react';
import type { AnchorAccount } from '../../../types';

interface RenameInputProps {
    newName: string;
    isRenaming: boolean;
    onNameChange: (name: string) => void;
    onConfirmRename: () => void;
    onCancelRename: () => void;
}

/**
 * Inline rename input with save/cancel buttons
 */
export const AccountRenameInput: React.FC<RenameInputProps> = ({
    newName,
    isRenaming,
    onNameChange,
    onConfirmRename,
    onCancelRename,
}) => (
    <div className="animate-in fade-in slide-in-from-left-2 duration-200 space-y-3">
        <input
            type="text"
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 text-white text-2xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10"
            placeholder="Account name"
            autoFocus
            disabled={isRenaming}
        />
        <div className="flex gap-3">
            <button
                onClick={onConfirmRename}
                disabled={isRenaming || !newName.trim()}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 p-3 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-semibold"
            >
                <Check className="w-5 h-5" />
                <span className="sm:hidden">Save</span>
            </button>
            <button
                onClick={onCancelRename}
                disabled={isRenaming}
                className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 font-semibold"
            >
                <X className="w-5 h-5" />
                <span className="sm:hidden">Cancel</span>
            </button>
        </div>
    </div>
);

interface ActionButtonsProps {
    account: AnchorAccount;
    onTransfer?: () => void;
    onPayBill?: () => void;
}

/**
 * Transfer and Pay Bill action buttons
 */
export const AccountActionButtons: React.FC<ActionButtonsProps> = ({
    account,
    onTransfer,
    onPayBill,
}) => (
    <div className="flex flex-wrap gap-3">
        <button
            onClick={onTransfer}
            className="flex-1 min-w-[140px] bg-white text-slate-900 hover:bg-white/90 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
            <ArrowUpRight className="w-5 h-5" />
            Transfer
        </button>
        <button
            onClick={onPayBill}
            className="flex-1 min-w-[140px] bg-white/15 hover:bg-white/25 backdrop-blur-xl px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/10"
        >
            <span className="w-5 h-5 flex items-center justify-center text-lg font-bold">
                {account.currency === 'USD' ? '$' : '₦'}
            </span>
            Pay Bill
        </button>
    </div>
);

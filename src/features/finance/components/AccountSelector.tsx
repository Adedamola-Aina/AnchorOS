/**
 * AccountSelector
 * 
 * Grid of account cards for selecting source account.
 * Extracted from TransactionForm for modularity.
 */
// @ts-nocheck


import React from 'react';
import type { AnchorAccount } from '../../../types';

interface AccountSelectorProps {
    accounts: AnchorAccount[];
    selectedId: string;
    onSelect: (id: string) => void;
    label: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
    accounts,
    selectedId,
    onSelect,
    label
}) => {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                {label}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {accounts.map(acc => (
                    <button
                        key={acc.id}
                        type="button"
                        onClick={() => onSelect(acc.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${selectedId === acc.id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {acc.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {acc.currency} • {acc.type}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

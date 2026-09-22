/**
 * TransactionTypeSelector
 * 
 * Toggle component for selecting transaction type.
 * Extracted from TransactionForm for modularity.
 */
// @ts-nocheck


import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import type { TransactionType } from '../../../types';

interface TransactionTypeSelectorProps {
    type: TransactionType;
    onChange: (type: TransactionType) => void;
}

/**
 * TransactionTypeSelector — three intents, stated as words.
 *
 * UX-FN-22: the selected state used to be carried only by colour (a tinted
 * label), so it was invisible to anyone who cannot separate red from green from
 * blue. Each option now reports `aria-pressed`, and the selected option is also
 * raised (surface + weight), so the state is legible in greyscale and to a
 * screen reader.
 *
 * The labels stay exactly "Expense" / "Income" / "Transfer": they are the
 * product's own vocabulary for the three operations, and the composer's submit
 * label follows from them.
 */
export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({ type, onChange }) => {
    const options: Array<{ value: TransactionType; label: string; icon?: React.ReactNode; active: string }> = [
        { value: 'expense', label: 'Expense', active: 'text-rose-600 dark:text-rose-400' },
        { value: 'income', label: 'Income', active: 'text-finance-700 dark:text-finance-400' },
        { value: 'transfer', label: 'Transfer', icon: <ArrowRightLeft className="w-3.5 h-3.5" aria-hidden="true" />, active: 'text-primary-700 dark:text-primary-400' },
    ];

    return (
        <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1" role="group" aria-label="Transaction type">
            {options.map((option) => {
                const isActive = type === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        aria-pressed={isActive}
                        className={`flex flex-1 items-center justify-center gap-1 min-h-[40px] rounded-lg text-[13px] transition-all ${isActive
                            ? `bg-white dark:bg-slate-700 font-semibold shadow-elevation-subtle ${option.active}`
                            : 'font-medium text-slate-500 dark:text-slate-400'}`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

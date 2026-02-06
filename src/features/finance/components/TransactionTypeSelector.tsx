/**
 * TransactionTypeSelector
 * 
 * Toggle component for selecting transaction type.
 * Extracted from TransactionForm for modularity.
 */

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import type { TransactionType } from '../../../types';

interface TransactionTypeSelectorProps {
    type: TransactionType;
    onChange: (type: TransactionType) => void;
}

export const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({ type, onChange }) => {
    return (
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
                type="button"
                onClick={() => onChange('expense')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Expense
            </button>
            <button
                type="button"
                onClick={() => onChange('income')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'income' ? 'bg-white dark:bg-slate-600 text-finance-600 dark:text-finance-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Income
            </button>
            <button
                type="button"
                onClick={() => onChange('transfer')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all flex items-center justify-center gap-1 ${type === 'transfer' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
                <ArrowRightLeft className="w-3 h-3" />
                Transfer
            </button>
        </div>
    );
};

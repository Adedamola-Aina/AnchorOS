/**
 * TransactionTypeSelector - Toggle for transaction type
 * DES-002: Migrated to semantic tokens
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
        <div className="flex gap-1 bg-surface-3 dark:bg-surface-3-dark p-1 rounded-lg">
            <button
                type="button"
                onClick={() => onChange('expense')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'expense' ? 'bg-surface-2 dark:bg-surface-2-dark text-danger dark:text-danger-dark shadow-sm' : 'text-muted dark:text-muted-dark'}`}
            >
                Expense
            </button>
            <button
                type="button"
                onClick={() => onChange('income')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'income' ? 'bg-surface-2 dark:bg-surface-2-dark text-finance-600 dark:text-finance-400 shadow-sm' : 'text-muted dark:text-muted-dark'}`}
            >
                Income
            </button>
            <button
                type="button"
                onClick={() => onChange('transfer')}
                className={`flex-1 rounded-md text-xs font-medium py-2 transition-all flex items-center justify-center gap-1 ${type === 'transfer' ? 'bg-surface-2 dark:bg-surface-2-dark text-primary-600 dark:text-primary-400 shadow-sm' : 'text-muted dark:text-muted-dark'}`}
            >
                <ArrowRightLeft className="w-3 h-3" />
                Transfer
            </button>
        </div>
    );
};


/**
 * OverdraftWarning
 * 
 * Warning banner displayed when a transaction would cause overdraft.
 * Extracted from TransactionForm for modularity.
 */

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { fromCents } from '../../../utils/moneyUtils';

interface OverdraftWarningProps {
    projectedBalance: number;
    amountCents: number;
}

export const OverdraftWarning: React.FC<OverdraftWarningProps> = ({
    projectedBalance,
    amountCents
}) => {
    return (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
            <div className="p-1 bg-rose-100 dark:bg-rose-800 rounded-full mt-0.5">
                <ArrowRightLeft className="w-3 h-3 text-rose-600 dark:text-rose-300" />
            </div>
            <div>
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">Warning: Overdraft Risk</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                    This transaction will take your account balance to{' '}
                    <span className="font-mono font-bold">
                        {amountCents > 0 ? '-' : ''}{fromCents(Math.abs(projectedBalance)).toLocaleString()}
                    </span>.
                </p>
            </div>
        </div>
    );
};

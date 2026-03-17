/**
 * TransactionItem - Individual transaction row in the transaction list
 * 
 * Follows the Calm Computing design philosophy:
 * - Clarity over cleverness: obvious purpose for each element
 * - Quiet over loud: minimal decoration, semantic colors only
 */
// @ts-nocheck


import React from 'react';
import { CategoryIcon } from '../../../components/shared';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';
import { Card } from '@anchor-os/ui';

interface TransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    currentUserId?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = React.memo(({
    transaction,
    accountName,
    currentUserId,
}) => {
    // Guard against undefined transaction
    if (!transaction) return null;

    // Use the isBackdated flag if available (new transactions), otherwise calculate for legacy
    const isBackdated = transaction.isBackdated ?? (() => {
        if (!transaction.transactionDate) return false;
        const entryDate = new Date(transaction.date).getTime();
        const txDate = new Date(transaction.transactionDate).getTime();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        return (entryDate - txDate) > ONE_DAY_MS;
    })();

    // Display date - use transactionDate if available, otherwise use entry date
    const displayDate = transaction.transactionDate || transaction.date;

    // Determine amount color based on transaction type
    const amountColor = transaction.type === 'income'
        ? 'text-finance-600 dark:text-finance-400'
        : transaction.type === 'transfer'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-slate-900 dark:text-white';

    const amountPrefix = transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : '';

    return (
        <Card className="group p-3 sm:p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            {/* Mobile: Horizontal layout with amount on right */}
            <div className="flex items-center gap-3">
                {/* Icon */}
                <CategoryIcon
                    category={transaction.category}
                    className="shrink-0"
                />

                {/* Title + Meta */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate leading-tight">
                            {transaction.title}
                        </h4>
                        {/* Amount - centered with title line */}
                        <p className={`font-bold text-sm tabular-nums shrink-0 truncate ${amountColor}`}>
                            {amountPrefix}
                            {formatCurrencyCompact(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                        </p>
                    </div>

                    {/* Metadata row - badges/pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 min-w-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                            {new Date(displayDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>

                        {/* Category Pill */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[120px]">
                            {transaction.category}
                        </span>

                        {/* Account / Bank Pill */}
                        {accountName && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 truncate max-w-[120px]">
                                {accountName}
                            </span>
                        )}

                        {/* Family Member Pill */}
                        {transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 truncate max-w-[100px]">
                                {transaction.createdByName || 'Family'}
                            </span>
                        )}

                        {/* Recurring Pill */}
                        {transaction.recurringId && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50">
                                Recurring
                            </span>
                        )}

                        {/* Backdated Pill */}
                        {isBackdated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50">
                                Backdated
                            </span>
                        )}

                        {/* Bank-synced Pill */}
                        {transaction.source === 'synced' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-800/50">
                                Bank
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
});

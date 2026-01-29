/**
 * TransactionItem - Individual transaction row in the transaction list
 * 
 * Follows the Calm Computing design philosophy:
 * - Clarity over cleverness: obvious purpose for each element
 * - Quiet over loud: minimal decoration, semantic colors only
 * - Progressive disclosure: edit/delete appear on hover (desktop)
 */

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';
import { Card } from '../../../components/ui/Card';

interface TransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    currentUserId?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    transaction,
    onEdit,
    onDelete,
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
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {transaction.title}
                        </h4>
                        {/* Amount - always visible on right */}
                        <p className={`font-bold text-sm tabular-nums shrink-0 ${amountColor}`}>
                            {amountPrefix}
                            {formatCurrency(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                        </p>
                    </div>

                    {/* Metadata row - simplified for mobile */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                        <span className="shrink-0">
                            {new Date(displayDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="shrink-0">•</span>
                        <span className="truncate">{transaction.category}</span>
                        {transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId && (
                            <>
                                <span className="shrink-0">•</span>
                                <span className="text-blue-500 truncate">{transaction.createdByName || 'Family'}</span>
                            </>
                        )}
                        {isBackdated && (
                            <>
                                <span className="shrink-0">•</span>
                                <span className="text-amber-500 shrink-0">Backdated</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Actions - hidden on mobile (swipe gestures), hover-only on desktop */}
                <div className="hidden sm:flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        aria-label="Edit transaction"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(transaction)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        aria-label="Delete transaction"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

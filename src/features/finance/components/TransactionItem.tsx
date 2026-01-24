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
import { Badge, CategoryIcon } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface TransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: (tx: AnchorTransaction) => void;
    currentUserId?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    transaction,
    accountName,
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
        ? 'text-emerald-600 dark:text-emerald-400'
        : transaction.type === 'transfer'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-900 dark:text-white';

    const amountPrefix = transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : '';

    return (
        <Card className="group p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Icon + Info */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <CategoryIcon
                        category={transaction.category}
                        className="shrink-0 mt-0.5 sm:mt-0"
                    />
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {transaction.title}
                        </h4>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(displayDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                            {accountName && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    • {accountName}
                                </span>
                            )}
                            <Badge type="todo" variant="outline">
                                {transaction.category}
                            </Badge>
                            {transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId && (
                                <Badge type="family">
                                    {transaction.createdByName || 'Family'}
                                </Badge>
                            )}
                            {isBackdated && (
                                <Badge type="warning" variant="outline">
                                    Backdated
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className={`font-semibold text-sm tabular-nums ${amountColor}`}>
                        {amountPrefix}
                        {formatCurrency(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                    </p>
                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(transaction)}
                            className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(transaction)}
                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

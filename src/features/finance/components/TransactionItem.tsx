import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge, CategoryIcon } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';

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
        // Consider backdated if transaction date is more than 24 hours before entry
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        return (entryDate - txDate) > ONE_DAY_MS;
    })();

    // Display date - use transactionDate if available, otherwise use entry date
    const displayDate = transaction.transactionDate || transaction.date;

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-4 min-w-0">
                <CategoryIcon
                    category={transaction.category}
                    className="shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                        {transaction.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(displayDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                        {accountName && (
                            <>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                                    {accountName}
                                </span>
                            </>
                        )}
                        {transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId && (
                            <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                                    {transaction.createdByName || 'Family Member'}
                                </span>
                            </>
                        )}
                        {isBackdated && (
                            <Badge type="warning" variant="outline">
                                Backdated
                            </Badge>
                        )}
                        <Badge type="todo" variant="outline">
                            {transaction.category}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : transaction.type === 'transfer'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                        {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                        {formatCurrency(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                    </p>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

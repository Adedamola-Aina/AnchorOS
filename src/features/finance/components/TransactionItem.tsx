/**
 * TransactionItem — one transaction, as a native-style list row.
 *
 * UX-FN-16: the row used to be a bordered card containing an icon, a title, a
 * date, a category pill, an account pill, an amount, plus optional recurring /
 * backdated / bank / family pills — nine visual objects for two facts. The
 * hierarchy was flat, so nothing led.
 *
 * Now it reads like a list, not a dashboard:
 *
 *   [icon]  Netflix                          −₦120.56
 *           Food · Feb 25 · Main Checking
 *
 * Primary:   description + amount (the two things a user scans for).
 * Secondary: category · date · account, plus at most a couple of word markers
 *            (Recurring, Backdated, Bank, or the family member's name) — text,
 *            never pills, and never the only signal for anything.
 *
 * Direction is carried by the sign, the colour, and an `sr-only` word, so the
 * meaning survives greyscale and screen readers. A transfer leg is stored as an
 * income/expense document with `category: 'Transfer'`, so it is labelled
 * "Transfer" in words rather than being silently presented as economic income or
 * spending (spec §10).
 *
 * Calm Computing: clarity over cleverness, quiet over loud, semantic colour only.
 */



import React from 'react';
import { CategoryIcon } from '../../../components/shared';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { isTransferLeg } from '../../../utils/financeInsights';
import type { AnchorTransaction } from '../../../types';

interface TransactionItemProps {
    transaction: AnchorTransaction;
    accountName?: string;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete?: (tx: AnchorTransaction) => void;
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

    const transfer = isTransferLeg(transaction);
    const isInflow = transaction.type === 'income';

    // Direction: sign + colour + a word for assistive tech (never colour alone).
    const amountColor = isInflow
        ? 'text-finance-700 dark:text-finance-400'
        : 'text-slate-900 dark:text-white';
    const amountPrefix = isInflow ? '+' : '−';
    const directionLabel = transfer
        ? (isInflow ? 'Transfer in' : 'Transfer out')
        : (isInflow ? 'Money in' : 'Money out');

    const markers: string[] = [];
    if (transfer) markers.push('Transfer');
    if (transaction.recurringId) markers.push('Recurring');
    if (isBackdated) markers.push('Backdated');
    if (transaction.source === 'synced') markers.push('Bank');
    if (transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId) {
        markers.push(transaction.createdByName || 'Family');
    }

    const secondary = [
        transfer ? null : transaction.category,
        new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        accountName,
        ...markers,
    ].filter(Boolean) as string[];

    return (
        <div
            data-testid="transaction-row"
            data-transaction-id={transaction.id}
            className="group flex items-center gap-3 px-1 py-2.5 min-h-[56px]"
        >
            <CategoryIcon category={transaction.category} className="shrink-0" />

            <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                    <p className="min-w-0 truncate text-[15px] font-semibold leading-tight text-slate-900 dark:text-white">
                        {transaction.title}
                    </p>
                    <p className={`shrink-0 text-[15px] font-semibold tabular-nums leading-tight ${amountColor}`}>
                        <span className="sr-only">{directionLabel}: </span>
                        <span aria-hidden="true">{amountPrefix}</span>
                        {formatCurrencyCompact(fromCents(transaction.amountCents || 0), transaction.currency || 'USD')}
                    </p>
                </div>

                <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {secondary.map((part, index) => (
                        <React.Fragment key={`${part}-${index}`}>
                            {index > 0 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>}
                            <span className="truncate max-w-[45%]">{part}</span>
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
});
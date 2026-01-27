/**
 * RecurringTransactionsList - Displays detected recurring payments
 * 
 * CLAUDE.md Design Philosophy:
 * - Clarity: Each recurring item clearly shows title, frequency, and amount
 * - Compact: Minimal vertical space usage
 * - Informative: Shows total monthly recurring expense
 */

import { RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';

interface RecurringItem {
    id: string;
    title: string;
    amountCents: number;
    frequency: string;
}

interface RecurringTransactionsListProps {
    recurring: RecurringItem[];
    currency: Currency;
    maxItems?: number;
}

export const RecurringTransactionsList = ({
    recurring,
    currency,
    maxItems = 4,
}: RecurringTransactionsListProps) => {
    // Calculate estimated monthly total
    const monthlyTotal = recurring.reduce((sum, r) => {
        const amount = r.amountCents || 0;
        // Estimate monthly: weekly*4, biweekly*2, monthly*1
        if (r.frequency.toLowerCase().includes('week')) {
            return sum + (r.frequency.toLowerCase().includes('bi') ? amount * 2 : amount * 4);
        }
        return sum + amount;
    }, 0);

    const currencySymbol = currency === 'USD' ? '$' : '₦';

    return (
        <div className="glass-card p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Recurring
                </h3>
                {recurring.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        ~{formatCurrency(fromCents(monthlyTotal), currency)}/mo
                    </span>
                )}
            </div>

            {recurring.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400">No recurring payments detected</p>
                    <p className="text-[10px] text-slate-400/70 mt-1">Add more transactions to detect patterns</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {recurring.slice(0, maxItems).map(rec => (
                        <div
                            key={rec.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                        {currencySymbol}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                        {rec.title}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                                        {rec.frequency}
                                    </p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm tabular-nums shrink-0">
                                {formatCurrency(fromCents(rec.amountCents || 0), currency)}
                            </p>
                        </div>
                    ))}
                    {recurring.length > maxItems && (
                        <p className="text-center text-[10px] text-slate-400 pt-2">
                            +{recurring.length - maxItems} more
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

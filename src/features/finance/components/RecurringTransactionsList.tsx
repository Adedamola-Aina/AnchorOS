/**
 * RecurringTransactionsList - Displays detected recurring payments
 * Extracted from AccountDetailsView
 */

import { Calendar } from 'lucide-react';
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
    return (
        <div className="glass-card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Recurring</span>
            </h3>

            <div className="space-y-4">
                {recurring.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No recurring payments detected yet.
                    </div>
                ) : (
                    recurring.slice(0, maxItems).map(rec => (
                        <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{rec.title}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{rec.frequency}</p>
                            </div>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                {formatCurrency(fromCents(rec.amountCents || 0), currency)}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

/**
 * SubscriptionDetectorCard — INN-002
 *
 * Displays auto-detected recurring subscriptions found in the user's
 * transactions. Appears in the Finance view when ≥1 subscription is detected
 * with confidence ≥ 0.5.
 *
 * Mobile-first, 44px touch targets. Calm, non-intrusive design.
 */

import React, { useMemo } from 'react';
import { Repeat, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { detectSubscriptions } from '../../../services/fabric/SubscriptionDetector';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';

const FREQ_LABELS: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Every 3 months',
    annual: 'Annual',
};

interface Props {
    transactions: AnchorTransaction[];
    currency: 'NGN' | 'USD';
}

export const SubscriptionDetectorCard: React.FC<Props> = ({ transactions, currency }) => {
    const subscriptions = useMemo(
        () => detectSubscriptions(transactions).filter(s => s.confidence >= 0.5),
        [transactions]
    );

    if (subscriptions.length === 0) return null;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-violet-50/30 dark:bg-violet-900/10">
                <CardTitle className="text-sm font-bold text-violet-900 dark:text-violet-300 flex items-center gap-2.5">
                    <div className="p-1.5 bg-violet-500/10 rounded-lg">
                        <Repeat className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    Detected Subscriptions
                    <span className="ml-auto text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">
                        {subscriptions.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subscriptions.map(sub => (
                        <li
                            key={sub.title}
                            className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 min-h-[56px] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{sub.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {FREQ_LABELS[sub.frequency] ?? sub.frequency}
                                    {sub.nextExpectedDate && ` · next ${new Date(sub.nextExpectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                                    {formatCurrencyCompact(fromCents(sub.amountCents), currency)}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

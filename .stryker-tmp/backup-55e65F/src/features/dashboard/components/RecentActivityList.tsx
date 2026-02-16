/**
 * RecentActivityList - Shows recent transactions
 * 
 * Follows CLAUDE.md design system with consistent styling
 */

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { formatCurrencyCompact } from '../../../utils/format';

interface RecentActivityListProps {
    recentActivity: AnchorTransaction[];
}

export function RecentActivityList({ recentActivity }: RecentActivityListProps) {
    return (
        <div className="glass-card p-6 overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Recent Activity</h4>
            <div className="space-y-2">
                {recentActivity.length > 0 ? (
                    recentActivity.map((tx, idx) => {
                        // Use transactionDate (actual date) if available, else entry date
                        const displayDate = tx.transactionDate || tx.date;
                        const dateStr = displayDate
                            ? new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '';

                        return (
                            <div
                                key={tx.id || idx}
                                className="flex items-center justify-between text-sm group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`p-2 rounded-xl shrink-0 ${tx.type === 'income'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : tx.type === 'expense'
                                            ? 'bg-rose-500/10 text-rose-500'
                                            : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {tx.type === 'income'
                                            ? <TrendingUp className="w-4 h-4" />
                                            : tx.type === 'expense'
                                                ? <TrendingDown className="w-4 h-4" />
                                                : <Activity className="w-4 h-4" />
                                        }
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
                                            {tx.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {dateStr}
                                            </span>
                                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded truncate">
                                                {tx.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-mono font-bold text-sm tabular-nums shrink-0 ${tx.type === 'income'
                                    ? 'text-emerald-500'
                                    : tx.type === 'expense'
                                        ? 'text-rose-500'
                                        : 'text-blue-500'
                                    }`}>
                                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                                    {formatCurrencyCompact(fromCents(tx.amountCents || 0), tx.currency || 'NGN')}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-slate-400 italic text-center py-4">No recent transactions</p>
                )}
            </div>
        </div>
    );
}

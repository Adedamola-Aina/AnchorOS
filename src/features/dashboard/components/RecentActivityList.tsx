/**
 * RecentActivityList - Shows recent transactions
 */

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';

interface RecentActivityListProps {
    recentActivity: AnchorTransaction[];
}

export function RecentActivityList({ recentActivity }: RecentActivityListProps) {
    return (
        <div className="glass-card p-6 overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Recent Activity</h4>
            <div className="space-y-3">
                {recentActivity.length > 0 ? (
                    recentActivity.map((tx, idx) => (
                        <div key={tx.id || idx} className="flex items-center justify-between text-sm group">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : tx.type === 'expense' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : tx.type === 'expense' ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{tx.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{tx.category}</p>
                                </div>
                            </div>
                            <span className={`font-financial font-bold ${tx.type === 'income' ? 'text-emerald-500' : tx.type === 'expense' ? 'text-rose-500' : 'text-blue-500'}`}>
                                {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}₦{fromCents(tx.amountCents || 0).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400 italic text-center py-4">No recent transactions</p>
                )}
            </div>
        </div>
    );
}

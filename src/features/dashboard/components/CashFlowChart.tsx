/**
 * CashFlowChart - Bar chart showing income vs expense trends
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';

interface CashFlowChartProps {
    financialTrend: { date: string; income: number; expense: number }[];
    cashFlowTotals: { income: number; expense: number };
    transactions: AnchorTransaction[];
    fullWidth?: boolean;
}

export function CashFlowChart({ financialTrend, cashFlowTotals, transactions, fullWidth }: CashFlowChartProps) {
    // Calculate momentum
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    let currentNet = 0;
    let prevNet = 0;
    // BUG-037 Fix: Helper to detect transfers
    const isTransfer = (tx: AnchorTransaction): boolean => {
        return Boolean(tx.linkId) || tx.category?.toLowerCase() === 'transfer';
    };
    transactions.forEach(tx => {
        // BUG-037 Fix: Skip transfers from cash flow totals
        if (isTransfer(tx)) return;
        const d = new Date(tx.date);
        const amount = fromCents(tx.amountCents || 0);
        const val = tx.type === 'income' ? amount : -amount;
        if (d >= oneWeekAgo) currentNet += val;
        else if (d >= twoWeeksAgo) prevNet += val;
    });

    const diff = currentNet - prevNet;
    const isPositive = diff >= 0;
    const percentChange = prevNet !== 0 ? Math.round((diff / Math.abs(prevNet)) * 100) : (currentNet !== 0 ? 100 : 0);

    return (
        <div className={`glass-card p-6 min-w-0 flex flex-col ${fullWidth ? 'lg:col-span-2' : ''}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Cash Flow (7 Days)</h4>
                    <div className="flex gap-4 mt-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">In</p>
                            <p className="font-financial font-bold text-emerald-500">₦{cashFlowTotals.income.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Out</p>
                            <p className="font-financial font-bold text-rose-500">₦{cashFlowTotals.expense.toLocaleString()}</p>
                        </div>
                    </div>
                    {transactions.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
                            <div className={`flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide gap-1 ${currentNet >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                {currentNet >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>Net: ₦{currentNet.toLocaleString()}</span>
                            </div>
                            {prevNet !== 0 && (
                                <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {isPositive ? '+' : ''}{percentChange}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Expense</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%" debounce={1}>
                    <BarChart data={financialTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            formatter={(value) => [`₦${Number(value).toLocaleString()}`, '']}
                        />
                        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

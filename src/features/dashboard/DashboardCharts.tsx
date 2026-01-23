import { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { AnchorAccount, AnchorTransaction, AnchorTask } from '../../types';
import { groupSmallValues, deduplicateLabels } from '../../utils/finance';
import { fromCents } from '../../utils/moneyUtils';

interface DashboardChartsProps {
    accounts: AnchorAccount[];
    transactions: AnchorTransaction[];
    tasks: AnchorTask[];
    navigateTo?: (tab: 'dashboard' | 'commitments' | 'finance' | 'settings') => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardCharts = ({ accounts, transactions, tasks, navigateTo }: DashboardChartsProps) => {
    const isMounted = true;

    // 1. Account Distribution Data with grouping for small values
    const accountData = useMemo(() => {
        const rawData = accounts.map((acc, index) => ({
            name: acc.name,
            value: fromCents(acc.balanceCents),
            color: COLORS[index % COLORS.length]
        })).filter(item => item.value > 0);

        // Deduplicate labels first, then group small values
        const deduplicated = deduplicateLabels(rawData);
        return groupSmallValues(deduplicated, 0.05);
    }, [accounts]);

    // 2. Income vs Expense Data (Last 7 days)
    const financialTrend = useMemo(() => {
        const last7Days = new Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                income: 0,
                expense: 0
            };
        });

        transactions.forEach(tx => {
            if (tx.type === 'transfer') return; // Skip transfers
            const txDate = new Date(tx.date);
            const diffDays = Math.floor((new Date().getTime() - txDate.getTime()) / (1000 * 3600 * 24));
            if (diffDays < 7) {
                const index = 6 - diffDays;
                if (tx.type === 'income') last7Days[index].income += fromCents(tx.amountCents);
                else if (tx.type === 'expense') last7Days[index].expense += fromCents(tx.amountCents);
            }
        });

        return last7Days;
    }, [transactions]);

    // 3. Commitment Insights
    const commitmentStats = useMemo(() => {
        if (tasks.length === 0) return null;

        const completed = tasks.filter(t => t.completed).length;
        const rate = Math.round((completed / tasks.length) * 100);

        // Domain Breakdown
        const personalTasks = tasks.filter(t => t.category === 'personal');
        const familyTasks = tasks.filter(t => t.category === 'family');

        const personalCompleted = personalTasks.filter(t => t.completed).length;
        const familyCompleted = familyTasks.filter(t => t.completed).length;

        const personalRate = personalTasks.length > 0 ? Math.round((personalCompleted / personalTasks.length) * 100) : 0;
        const familyRate = familyTasks.length > 0 ? Math.round((familyCompleted / familyTasks.length) * 100) : 0;

        return {
            total: tasks.length,
            completed,
            rate,
            personal: { total: personalTasks.length, completed: personalCompleted, rate: personalRate },
            family: { total: familyTasks.length, completed: familyCompleted, rate: familyRate }
        };
    }, [tasks]);

    // 4. Recent Activity for split layout
    const recentActivity = useMemo(() => {
        return transactions
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [transactions]);

    // Cash Flow Totals for Header
    const cashFlowTotals = useMemo(() => {
        return {
            income: financialTrend.reduce((acc, curr) => acc + curr.income, 0),
            expense: financialTrend.reduce((acc, curr) => acc + curr.expense, 0)
        };
    }, [financialTrend]);

    if (accounts.length === 0 && transactions.length === 0) {
        return (
            <div className="glass-card p-12 text-center animate-in fade-in zoom-in-95 duration-700">
                <p className="text-slate-400 font-medium italic">No financial data available to visualize.</p>
            </div>
        );
    }

    const showAssetDist = accounts.length > 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Asset Distribution (Only if multiple accounts) */}
            {showAssetDist && (
                <div className="glass-card p-6 min-w-0 flex flex-col min-h-[400px]">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Distribution</h4>
                    <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-0">
                        <div className="h-48 md:h-full md:w-1/2">
                            {isMounted && (
                                <ResponsiveContainer width="100%" height="100%" debounce={1}>
                                    <PieChart>
                                        <Pie
                                            data={accountData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            labelLine={false}
                                        >
                                            {accountData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Balance']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="md:w-1/2 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {accountData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs group">
                                    <div className="flex items-center gap-2 truncate pr-2">
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-600 dark:text-slate-400 font-medium truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="font-financial font-bold text-slate-900 dark:text-slate-200 shrink-0">
                                        {Math.round((item.value / accountData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cash Flow - Bar Chart with Summaries */}
            <div className={`glass-card p-6 min-w-0 flex flex-col ${!showAssetDist ? 'lg:col-span-2' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Cash Flow (7 Days)</h4>

                        {/* Textual Summary */}
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

                        {/* Momentum Indicator */}
                        {(() => {
                            const now = new Date();
                            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

                            let currentNet = 0;
                            let prevNet = 0;

                            transactions.forEach(tx => {
                                if (tx.type === 'transfer') return;
                                const d = new Date(tx.date);
                                const amount = fromCents(tx.amountCents);
                                const val = tx.type === 'income' ? amount : -amount;

                                if (d >= oneWeekAgo) currentNet += val;
                                else if (d >= twoWeeksAgo) prevNet += val;
                            });

                            const diff = currentNet - prevNet;
                            const isPositive = diff >= 0;
                            const percentChange = prevNet !== 0 ? Math.round((diff / Math.abs(prevNet)) * 100) : (currentNet !== 0 ? 100 : 0);

                            if (transactions.length === 0) return null;

                            return (
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
                            );
                        })()}
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
                    {isMounted && (
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
                    )}
                </div>
            </div>

            {/* Bottom Row: Productivity & Recent Activity */}
            {/* Productivity Score */}
            {commitmentStats ? (
                <div className="premium-gradient text-white p-6 rounded-3xl shadow-2xl overflow-hidden relative border border-white/10 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4 relative z-10 transition-transform duration-700 group-hover:-translate-y-1">
                        <div>
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Productivity Score</h4>
                            <p className="text-5xl font-bold tracking-tighter">{commitmentStats.rate}% <span className="text-xs font-black uppercase opacity-40 ml-1 tracking-widest">Done</span></p>
                        </div>
                        <Activity className="w-6 h-6 text-white/20" />
                    </div>

                    {/* Domain Breakdown */}
                    <div className="space-y-3 relative z-10">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="opacity-70">Personal</span>
                                <span>{commitmentStats.personal.completed}/{commitmentStats.personal.total}</span>
                            </div>
                            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white/80 rounded-full transition-all duration-1000" style={{ width: `${commitmentStats.personal.rate}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="opacity-70">Family</span>
                                <span>{commitmentStats.family.completed}/{commitmentStats.family.total}</span>
                            </div>
                            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white/50 rounded-full transition-all duration-1000" style={{ width: `${commitmentStats.family.rate}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State for Commitments */
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-3">
                        <Activity className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Boost Productivity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">
                        Set daily or weekly commitments to track your consistency across life domains.
                    </p>
                    <button
                        onClick={() => navigateTo && navigateTo('commitments')}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest"
                    >
                        + Set Commitments
                    </button>
                </div>
            )}

            {/* Recent Activity */}
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
                                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}₦{fromCents(tx.amountCents).toLocaleString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 italic text-center py-4">No recent transactions</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;


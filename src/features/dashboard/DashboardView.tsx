import {
  Wallet, TrendingUp, TrendingDown, Activity, CheckCircle2,
  ArrowRight, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { SectionHeader } from '../../components/shared';
import { fromCents } from '../../utils/moneyUtils';
import { formatCurrency } from '../../utils/format';
import { getAssetDistribution } from '../../utils/financeInsights';
import { getProductivityMetrics } from '../../utils/taskInsights';
import { AssetAllocationWidget } from './components/AssetAllocationWidget';
import type { Currency } from '../../types';

const DashboardView = () => {
  const { navigateTo } = useApp();
  const { profile } = useAuth();
  const { tasks } = useTasks();
  const { accounts, recentActivity, cashFlow } = useFinance();

  // Productivity Insights
  const productivity = getProductivityMetrics(tasks);
  const hasCommitments = tasks.length > 0;

  const assets = getAssetDistribution(accounts);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      <SectionHeader
        title={`Welcome back, ${profile.name}`}
        subtitle="Life at a glance."
      />


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Wealth & Assets */}
        <div className="space-y-6">
          {/* Portfolio Snapshot */}
          <div
            onClick={() => navigateTo('finance')}
            className="glass-card p-6 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.99]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-200">Portfolio</h3>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total across {accounts.length} accounts</p>

            {/* Account Type Breakdown (Micro-list) */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              {assets.slice(0, 3).map(asset => (
                <div key={asset.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(asset.amount, asset.currency as Currency)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 tabular-nums">
                      {asset.percent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {assets.length > 3 && (
                <p className="text-[10px] text-slate-400 font-bold italic text-right">+ {assets.length - 3} more</p>
              )}
            </div>
          </div>

          {/* Asset Distribution / Concentration */}
          {accounts.length > 1 && (
            <AssetAllocationWidget assets={assets} />
          )}
        </div>

        {/* Column 2: Momentum & Activity */}
        <div className="space-y-6">
          {/* Cash Flow Summary */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cashFlow.trend === 'better' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'}`}>
                  {cashFlow.trend === 'better' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">7-Day Momentum</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {cashFlow.trend === 'better' ? 'Improvements' : 'Pullback'} vs Last Week
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Income</p>
                <p className="font-mono font-bold text-emerald-500">{formatCurrency(cashFlow.income, 'NGN')}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Expenses</p>
                <p className="font-mono font-bold text-rose-500">{formatCurrency(cashFlow.expense, 'NGN')}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Net Flow</span>
              <span className={`font-black font-mono ${cashFlow.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {cashFlow.net > 0 ? '+' : ''}{formatCurrency(cashFlow.net, 'NGN')}
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Recent Activity
              </h3>
              <button onClick={() => navigateTo('finance')} className="text-indigo-500 hover:text-indigo-400" aria-label="View all finance activity">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map(tx => (
                <div key={tx.id} className="flex justify-between items-center group cursor-default">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{tx.title}</p>
                    <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                  </div>
                  <span className={`font-mono font-bold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-300'}`}>
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(fromCents(tx.amountCents), tx.currency)}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-center text-slate-400 text-xs italic py-4">No recent activity recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Productivity */}
        <div className="space-y-6">
          <div
            onClick={() => navigateTo('commitments')}
            className="glass-card p-6 cursor-pointer hover:shadow-xl transition-all group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Productivity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow-through</p>
              </div>
            </div>

            {hasCommitments ? (
              <>
                <div className="flex items-end gap-2 mb-2">
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                    {productivity.score}%
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mb-2 pb-0.5 uppercase">Completion</p>
                </div>

                {productivity.insight && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6 border-l-2 border-orange-500">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">"{productivity.insight}"</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                      <span>Personal</span>
                      <span>{productivity.domainBreakdown.personal}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: `${productivity.domainBreakdown.personal}%` }} className="h-full bg-blue-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                      <span>Family</span>
                      <span>{productivity.domainBreakdown.family}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: `${productivity.domainBreakdown.family}%` }} className="h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white mb-1">No Commitments</p>
                <p className="text-xs text-slate-500 mb-4 px-4">Start tracking your daily goals to see productivity insights here.</p>
                <button className="text-xs font-bold text-indigo-500 uppercase tracking-wide hover:text-indigo-400">
                  Setup Commitments &rarr;
                </button>
              </div>
            )}
          </div>

          {hasCommitments && (
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
              <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-2">Daily Focus</p>
              <p className="text-lg font-bold leading-relaxed">
                "Discipline is choosing what you want most over what you want now."
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardView;

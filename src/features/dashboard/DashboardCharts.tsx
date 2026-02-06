/**
 * DashboardCharts - Main dashboard visualization component
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */

import { useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction, AnchorTask } from '../../types';
import { groupSmallValues, deduplicateLabels } from '../../utils/finance';
import { fromCents } from '../../utils/moneyUtils';
import { AssetDistributionChart } from './components/AssetDistributionChart';
import { CashFlowChart } from './components/CashFlowChart';
import { ProductivityScoreCard } from './components/ProductivityScoreCard';
import { RecentActivityList } from './components/RecentActivityList';

interface DashboardChartsProps {
    accounts: AnchorAccount[];
    transactions: AnchorTransaction[];
    tasks: AnchorTask[];
    navigateTo?: (tab: 'dashboard' | 'commitments' | 'finance' | 'settings') => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardCharts = ({ accounts, transactions, tasks, navigateTo }: DashboardChartsProps) => {
    const accountData = useMemo(() => {
        const rawData = accounts.map((acc, index) => ({
            name: acc.name,
            value: fromCents(acc.balanceCents),
            color: COLORS[index % COLORS.length]
        })).filter(item => item.value > 0);
        return groupSmallValues(deduplicateLabels(rawData), 0.05);
    }, [accounts]);

    const financialTrend = useMemo(() => {
        const last7Days = new Array(7).fill(0).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), income: 0, expense: 0 };
        });

        transactions.forEach(tx => {
            if (tx.type === 'transfer') return;
            const txDate = new Date(tx.date);
            const diffDays = Math.floor((new Date().getTime() - txDate.getTime()) / (1000 * 3600 * 24));
            if (diffDays < 7) {
                const index = 6 - diffDays;
                if (tx.type === 'income') last7Days[index].income += fromCents(tx.amountCents || 0);
                else if (tx.type === 'expense') last7Days[index].expense += fromCents(tx.amountCents || 0);
            }
        });
        return last7Days;
    }, [transactions]);

    const commitmentStats = useMemo(() => {
        if (tasks.length === 0) return null;
        const completed = tasks.filter(t => t.completed).length;
        const rate = Math.round((completed / tasks.length) * 100);
        const personalTasks = tasks.filter(t => t.category === 'personal');
        const familyTasks = tasks.filter(t => t.category === 'family');
        const personalCompleted = personalTasks.filter(t => t.completed).length;
        const familyCompleted = familyTasks.filter(t => t.completed).length;

        return {
            total: tasks.length, completed, rate,
            personal: { total: personalTasks.length, completed: personalCompleted, rate: personalTasks.length > 0 ? Math.round((personalCompleted / personalTasks.length) * 100) : 0 },
            family: { total: familyTasks.length, completed: familyCompleted, rate: familyTasks.length > 0 ? Math.round((familyCompleted / familyTasks.length) * 100) : 0 }
        };
    }, [tasks]);

    const recentActivity = useMemo(() => {
        return transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    }, [transactions]);

    const cashFlowTotals = useMemo(() => ({
        income: financialTrend.reduce((acc, curr) => acc + curr.income, 0),
        expense: financialTrend.reduce((acc, curr) => acc + curr.expense, 0)
    }), [financialTrend]);

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
            {showAssetDist && <AssetDistributionChart accountData={accountData} />}
            <CashFlowChart financialTrend={financialTrend} cashFlowTotals={cashFlowTotals} transactions={transactions} fullWidth={!showAssetDist} />
            <ProductivityScoreCard commitmentStats={commitmentStats} navigateTo={navigateTo} />
            <RecentActivityList recentActivity={recentActivity} />
        </div>
    );
};

export default DashboardCharts;

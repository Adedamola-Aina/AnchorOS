/**
 * Dashboard Widget Components
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Activity, CheckCircle2, ArrowRight, Target } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency, AnchorTask, AnchorTransaction } from '../../../types';
import type { AssetClass } from '../../../utils/financeInsights';
import { Text, VStack, HStack } from '../../../components/primitives';

interface PortfolioWidgetProps { assets: AssetClass[]; onNavigate: () => void; accountCount: number; isMobile?: boolean; }
export const PortfolioWidget: React.FC<PortfolioWidgetProps> = ({ assets, onNavigate, accountCount, isMobile }) => (
    <div onClick={onNavigate} className={`glass-card overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.99] ${isMobile ? 'p-4' : 'p-5'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <HStack gap="sm" className="mb-4">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400"><Wallet className="w-5 h-5" /></div>
            <Text weight="bold" className="text-subtle dark:text-subtle-dark">Portfolio</Text>
        </HStack>
        <Text size="xs" weight="bold" variant="muted" className="uppercase tracking-widest">Total across {accountCount} accounts</Text>
        <VStack gap="sm" className="pt-4 border-t border-border-subtle">
            {assets.slice(0, 3).map(asset => (
                <HStack key={asset.id} justify="between" align="center" className="text-xs">
                    <HStack gap="sm" align="center" className="min-w-0 flex-1"><div className="w-1.5 h-1.5 rounded-full bg-muted shrink-0" /><Text size="xs" weight="medium" variant="muted" className="truncate">{asset.name}</Text></HStack>
                    <div className="text-right">
                        <Text size="xs" weight="bold" className="font-mono tabular-nums">{formatCurrencyCompact(asset.amount, asset.currency as Currency)}</Text>
                        <Text size="xs" variant="muted" weight="bold" className="tabular-nums">{asset.percent.toFixed(1)}%</Text>
                    </div>
                </HStack>
            ))}
        </VStack>
    </div>
);

interface CashFlowWidgetProps { cashFlow: { trend: string; income: number; expense: number }; currency: Currency; onNavigate: () => void; }
export const CashFlowWidget: React.FC<CashFlowWidgetProps> = ({ cashFlow, currency, onNavigate }) => (
    <div onClick={onNavigate} className="glass-card p-5 cursor-pointer hover:shadow-xl transition-all group active:scale-[0.99]">
        <HStack justify="between" align="start" className="mb-6">
            <HStack gap="sm" align="center">
                <div className={`p-2 rounded-lg ${cashFlow.trend === 'better' ? 'bg-finance-100 dark:bg-finance-900/30 text-finance-600' : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600'}`}>
                    {cashFlow.trend === 'better' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <VStack gap="none">
                    <Text weight="bold" className="text-subtle dark:text-subtle-dark">Momentum</Text>
                    <Text size="xs" variant="muted" weight="bold" className="uppercase tracking-widest">{cashFlow.trend === 'better' ? 'Improvements' : 'Pullback'} vs Last Week</Text>
                </VStack>
            </HStack>
        </HStack>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-3 dark:bg-surface-3-dark rounded-xl"><Text size="xs" variant="muted" weight="bold" className="font-black uppercase mb-1">Income</Text><Text weight="bold" className="font-mono text-finance-500">{formatCurrencyCompact(cashFlow.income, currency)}</Text></div>
            <div className="p-3 bg-surface-3 dark:bg-surface-3-dark rounded-xl"><Text size="xs" variant="muted" weight="bold" className="font-black uppercase mb-1">Expenses</Text><Text weight="bold" className="font-mono text-danger-500">{formatCurrencyCompact(cashFlow.expense, currency)}</Text></div>
        </div>
    </div>
);

interface RecentActivityWidgetProps { activity: AnchorTransaction[]; onNavigate: () => void; }
export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activity, onNavigate }) => (
    <div onClick={onNavigate} className="glass-card p-5 cursor-pointer hover:shadow-xl transition-all group active:scale-[0.99]">
        <HStack justify="between" align="center" className="mb-4">
            <Text size="xs" weight="bold" variant="muted" className="font-black uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3" /> Recent Activity</Text>
            <div className="text-primary-500 group-hover:text-primary-600 transition-colors"><ArrowRight className="w-4 h-4" /></div>
        </HStack>
        <VStack gap="md">
            {activity.slice(0, 3).map(tx => {
                const displayDate = tx.transactionDate || tx.date;
                return (
                    <HStack key={tx.id} justify="between" align="center" className="group cursor-default p-3 rounded-xl hover:bg-surface-3 dark:hover:bg-surface-3-dark transition-colors">
                        <div className="flex-1 min-w-0">
                            <Text size="sm" weight="bold" className="truncate">{tx.title}</Text>
                            <HStack gap="sm" align="center" className="mt-1 min-w-0">
                                <Text size="xs" variant="muted" className="shrink-0">{new Date(displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                                <span className="text-[10px] text-muted px-1.5 py-0.5 bg-surface-3 dark:bg-surface-3-dark rounded truncate">{tx.category}</span>
                            </HStack>
                        </div>
                        <span className={`font-mono font-bold text-sm ${tx.type === 'income' ? 'text-finance-500' : 'text-foreground dark:text-foreground-dark'}`}>
                            {tx.type === 'income' ? '+' : ''}{formatCurrencyCompact(fromCents(tx.amountCents || 0), tx.currency)}
                        </span>
                    </HStack>
                );
            })}
            {activity.length === 0 && <Text variant="muted" size="xs" className="text-center italic py-4">No recent activity.</Text>}
        </VStack>
    </div>
);

interface ProductivityWidgetProps { productivity: { score: number; domainBreakdown: { personal: number; family: number } }; hasCommitments: boolean; onNavigate: () => void; }
export const ProductivityWidget: React.FC<ProductivityWidgetProps> = ({ productivity, hasCommitments, onNavigate }) => (
    <div onClick={onNavigate} className="glass-card p-5 cursor-pointer hover:shadow-xl transition-all group active:scale-[0.99]">
        <HStack gap="sm" align="center" className="mb-6">
            <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg text-warning-600 dark:text-warning-400"><CheckCircle2 className="w-5 h-5" /></div>
            <VStack gap="none"><Text weight="bold" className="text-subtle dark:text-subtle-dark">Productivity</Text><Text size="xs" variant="muted" weight="bold" className="uppercase tracking-widest">Follow-through</Text></VStack>
        </HStack>
        {hasCommitments ? (
            <>
                <HStack gap="sm" align="end" className="mb-2">
                    <span className="text-5xl font-black text-foreground dark:text-foreground-dark tracking-tighter tabular-nums">{productivity.score}%</span>
                    <Text size="xs" weight="bold" variant="muted" className="mb-2 pb-0.5 uppercase">Completion</Text>
                </HStack>
                <VStack gap="sm" className="mt-6">
                    <div><HStack justify="between" className="text-[10px] font-bold uppercase text-muted mb-1"><span>Personal</span><span>{productivity.domainBreakdown.personal}%</span></HStack><div className="h-1.5 w-full bg-surface-3 dark:bg-surface-3-dark rounded-full overflow-hidden"><div style={{ width: `${productivity.domainBreakdown.personal}%` }} className="h-full bg-primary-500 rounded-full" /></div></div>
                    <div><HStack justify="between" className="text-[10px] font-bold uppercase text-muted mb-1"><span>Family</span><span>{productivity.domainBreakdown.family}%</span></HStack><div className="h-1.5 w-full bg-surface-3 dark:bg-surface-3-dark rounded-full overflow-hidden"><div style={{ width: `${productivity.domainBreakdown.family}%` }} className="h-full bg-warning-500 rounded-full" /></div></div>
                </VStack>
            </>
        ) : (
            <div className="text-center py-8"><Text weight="bold">No Commitments</Text><button className="text-xs font-bold text-primary-500 uppercase tracking-wide hover:text-primary-400">Setup Commitments &rarr;</button></div>
        )}
    </div>
);

interface TodaysFocusWidgetProps { priorities: AnchorTask[]; onNavigate: () => void; }
export const TodaysFocusWidget: React.FC<TodaysFocusWidgetProps> = ({ priorities, onNavigate }) => {
    if (priorities.length === 0) return null;
    return (
        <div onClick={onNavigate} className="glass-card p-5 cursor-pointer hover:shadow-xl transition-all group active:scale-[0.99]">
            <HStack gap="sm" align="center" className="mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400"><Target className="w-5 h-5" /></div>
                <VStack gap="none"><Text weight="bold" className="text-subtle dark:text-subtle-dark">Today's Focus</Text><Text size="xs" variant="muted" weight="bold" className="uppercase tracking-widest">{priorities.length} Tasks Remaining</Text></VStack>
            </HStack>
            <VStack gap="sm">
                {priorities.map(task => (
                    <HStack key={task.id} gap="sm" align="center" className="p-2 bg-surface-3 dark:bg-surface-3-dark rounded-lg border border-border-subtle min-w-0">
                        <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" /><Text size="sm" weight="medium" className="text-subtle dark:text-subtle-dark truncate min-w-0">{task.title}</Text>
                    </HStack>
                ))}
            </VStack>
        </div>
    );
};


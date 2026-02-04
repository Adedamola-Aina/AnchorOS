/**
 * CashFlowChart - Bar chart showing income vs expense trends
 * DES-002: Migrated to semantic tokens and primitives
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AnchorTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { Text, VStack, HStack } from '../../../components/primitives';

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
    transactions.forEach(tx => {
        if (tx.type === 'transfer') return;
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
            <HStack justify="between" align="start" className="mb-6 gap-4 flex-col sm:flex-row">
                <VStack gap="sm">
                    <Text size="xs" weight="bold" variant="muted" className="font-black uppercase tracking-[0.2em]">Cash Flow (7 Days)</Text>
                    <HStack gap="md" className="mt-2">
                        <VStack gap="none">
                            <Text size="xs" weight="bold" variant="muted" className="uppercase">In</Text>
                            <Text weight="bold" className="font-financial text-finance-500">₦{cashFlowTotals.income.toLocaleString()}</Text>
                        </VStack>
                        <VStack gap="none">
                            <Text size="xs" weight="bold" variant="muted" className="uppercase">Out</Text>
                            <Text weight="bold" className="font-financial text-danger-500">₦{cashFlowTotals.expense.toLocaleString()}</Text>
                        </VStack>
                    </HStack>
                    {transactions.length > 0 && (
                        <HStack gap="sm" align="center" className="mt-2 animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
                            <div className={`flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide gap-1 ${currentNet >= 0 ? 'bg-finance-500/10 text-finance-600 dark:text-finance-400' : 'bg-danger-500/10 text-danger-600 dark:text-danger-400'}`}>
                                {currentNet >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>Net: ₦{currentNet.toLocaleString()}</span>
                            </div>
                            {prevNet !== 0 && (
                                <Text size="xs" weight="bold" className={isPositive ? 'text-finance-500' : 'text-danger-500'}>
                                    {isPositive ? '+' : ''}{percentChange}%
                                </Text>
                            )}
                        </HStack>
                    )}
                </VStack>
                <HStack gap="md" align="center" className="text-xs">
                    <HStack gap="xs" align="center">
                        <div className="w-2.5 h-2.5 rounded-full bg-finance-500" />
                        <Text variant="muted" weight="medium">Income</Text>
                    </HStack>
                    <HStack gap="xs" align="center">
                        <div className="w-2.5 h-2.5 rounded-full bg-danger-400" />
                        <Text variant="muted" weight="medium">Expense</Text>
                    </HStack>
                </HStack>
            </HStack>
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


/**
 * AssetDistributionChart - Pie chart showing account distribution
 * CHART-002: Fixed hardcoded currency symbol
 * CHART-003: Fixed negative balance percentage handling
 * CHART-004: Fixed O(n²) percentage calculation
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/format';
import type { Currency } from '../../../types';

interface AssetData {
    name: string;
    value: number;
    color: string;
    currency: Currency;
    percent: number; // Pre-calculated percentage
    [key: string]: string | number; // Index signature for Recharts compatibility
}

interface AssetDistributionChartProps {
    accountData: AssetData[];
}

export function AssetDistributionChart({ accountData }: AssetDistributionChartProps) {
    // CHART-003/004: Pre-calculate percentages with O(n) and handle negatives
    const { data, hasNegative } = useMemo(() => {
        const positiveOnly = accountData.filter(d => d.value > 0);
        const total = positiveOnly.reduce((sum, d) => sum + d.value, 0);
        const hasNeg = accountData.some(d => d.value < 0);
        const dataWithPercent = positiveOnly.map(d => ({
            ...d,
            percent: total > 0 ? Math.round((d.value / total) * 100) : 0
        }));
        return { data: dataWithPercent, hasNegative: hasNeg };
    }, [accountData]);
    return (
        <div className="glass-card p-6 min-w-0 flex flex-col min-h-[280px] sm:min-h-[400px]">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Distribution</h4>
            {hasNegative && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mb-2">* Negative balances excluded from chart</p>
            )}
            <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-0">
                <div className="h-48 md:h-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%" debounce={1}>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value, _name, props) => {
                                    const item = props.payload as AssetData;
                                    return [formatCurrency(Number(value), item.currency), 'Balance'];
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="md:w-1/2 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs group">
                            <div className="flex items-center gap-2 pr-2 min-w-0 flex-1">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-600 dark:text-slate-400 font-medium truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-financial font-bold text-slate-900 dark:text-slate-200 shrink-0">
                                {item.percent}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

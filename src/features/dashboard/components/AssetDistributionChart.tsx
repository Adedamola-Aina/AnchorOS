/**
 * AssetDistributionChart - Pie chart showing account distribution
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AssetData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number; // Index signature for Recharts compatibility
}

interface AssetDistributionChartProps {
    accountData: AssetData[];
}

export function AssetDistributionChart({ accountData }: AssetDistributionChartProps) {
    return (
        <div className="glass-card p-6 min-w-0 flex flex-col min-h-[400px]">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Distribution</h4>
            <div className="flex-1 flex flex-col sm:flex-row gap-6 min-h-0">
                <div className="h-48 md:h-full md:w-1/2">
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
    );
}

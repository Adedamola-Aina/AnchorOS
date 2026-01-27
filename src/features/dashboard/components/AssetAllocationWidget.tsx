import { useState } from 'react';
import { PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { AssetClass } from '../../../utils/financeInsights';
import type { Currency } from '../../../types';

interface AssetAllocationWidgetProps {
    assets: AssetClass[];
}

export const AssetAllocationWidget = ({ assets }: AssetAllocationWidgetProps) => {
    const [expanded, setExpanded] = useState(false);

    // Sort by percentage desc
    const sortedAssets = [...assets].sort((a, b) => b.percent - a.percent);

    // Colors for visualization
    const COLORS = [
        'bg-primary-500',
        'bg-emerald-500',
        'bg-blue-500',
        'bg-task-500',
        'bg-amber-500',
        'bg-rose-500',
        'bg-cyan-500',
        'bg-slate-500'
    ];

    const getColor = (i: number) => COLORS[i % COLORS.length];

    return (
        <div className={`glass-card p-6 transition-all duration-300 ${expanded ? 'row-span-2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <PieChart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Asset Split</h3>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Bar Chart Visualization */}
            <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5 mb-6">
                {sortedAssets.map((asset, i) => (
                    <div
                        key={asset.id}
                        style={{ width: `${asset.percent}%` }}
                        className={`h-full ${getColor(i)} hover:opacity-80 transition-opacity cursor-help`}
                        title={`${asset.name}: ${asset.percent.toFixed(1)}%`}
                    />
                ))}
            </div>

            {/* Detailed Legend */}
            <div className="space-y-3">
                {(expanded ? sortedAssets : sortedAssets.slice(0, 4)).map((asset, i) => (
                    <div key={asset.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getColor(i)} ring-2 ring-white dark:ring-slate-900 shadow-sm`} />
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{asset.name}</p>
                                {expanded && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.type}</p>}
                            </div>
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

                {!expanded && sortedAssets.length > 4 && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-500 mt-2 py-2 border-t border-dashed border-slate-200 dark:border-slate-800"
                    >
                        View {sortedAssets.length - 4} More
                    </button>
                )}
            </div>
        </div>
    );
};

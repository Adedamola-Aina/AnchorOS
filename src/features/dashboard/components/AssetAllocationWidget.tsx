// @ts-nocheck
import { useMemo, useState } from 'react';
import { PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { AssetClass } from '../../../utils/financeInsights';
import type { Currency } from '../../../types';

interface AssetAllocationWidgetProps {
    assets: AssetClass[];
}

/** One currency's slice of the portfolio (see the grouping note below). */
interface CurrencyGroup { currency: string; assets: AssetClass[] }

export const AssetAllocationWidget = ({ assets }: AssetAllocationWidgetProps) => {
    const [expanded, setExpanded] = useState(false);

    /**
     * Shares are computed within a currency (DB-02), so a mixed-currency
     * portfolio renders as ONE GROUP PER CURRENCY: each group's bar and
     * percentages add up to 100% of that currency, which is the only comparison
     * that is arithmetically true. A single-currency portfolio is one group and
     * looks exactly as it always did.
     */
    const groups: CurrencyGroup[] = useMemo(() => {
        const byCurrency = new Map<string, AssetClass[]>();
        for (const asset of assets) {
            byCurrency.set(asset.currency, [...(byCurrency.get(asset.currency) ?? []), asset]);
        }
        return [...byCurrency.entries()]
            .map(([currency, list]) => ({ currency, assets: [...list].sort((a, b) => b.percent - a.percent) }))
            .sort((a, b) => a.currency.localeCompare(b.currency));
    }, [assets]);

    const multiCurrency = groups.length > 1;

    // Colors for visualization
    const COLORS = [
        'bg-primary-500', // Brand Blue
        'bg-finance-500', // Brand Green
        'bg-family-500',  // Brand Orange
        'bg-task-500',    // Brand Purple
        'bg-cyan-500',    // Supporting Cyan
        'bg-amber-500',   // Supporting Amber
        'bg-rose-500',    // Supporting Rose
        'bg-slate-500'    // Supporting Slate
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
                    className="min-w-11 min-h-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            <div className="space-y-6">
                {groups.map((group) => (
                    <div key={group.currency}>
                        {/* Only label the group when there is more than one, so a
                            single-currency portfolio keeps its existing layout. */}
                        {multiCurrency && (
                            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {group.currency} · {group.assets.length} {group.assets.length === 1 ? 'account' : 'accounts'}
                            </p>
                        )}

                        {/* Bar Chart Visualization */}
                        <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5 mb-4">
                            {group.assets.map((asset, i) => (
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
                            {(expanded ? group.assets : group.assets.slice(0, 4)).map((asset, i) => (
                                <div key={asset.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getColor(i)} ring-2 ring-white dark:ring-slate-900 shadow-sm`} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{asset.name}</p>
                                            {expanded && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.type}</p>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="money font-mono text-xs font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(asset.amount, asset.currency as Currency)}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 tabular-nums">
                                            {asset.percent.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {!expanded && group.assets.length > 4 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-500 mt-2 py-2 border-t border-dashed border-slate-200 dark:border-slate-800"
                                >
                                    View {group.assets.length - 4} More
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

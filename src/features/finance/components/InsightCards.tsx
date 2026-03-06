import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Landmark } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { Currency } from '../../../types';

interface SpendingTrend {
    direction: 'up' | 'down' | 'flat';
    percentChange: number;
}

interface Anomaly {
    title: string;
    category: string;
    amountCents: number;
    averageCents: number;
}

interface SourceBreakdown {
    manualCents: number;
    syncedCents: number;
    totalCents: number;
    syncedPercent: number;
    hasBankData: boolean;
}

interface InsightCardsProps {
    trend: SpendingTrend;
    anomalies: Anomaly[];
    currency: Currency;
    sourceBreakdown?: SourceBreakdown;
}

const trendConfig = {
    up: { icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/20', label: 'Spending Up' },
    down: { icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20', label: 'Spending Down' },
    flat: { icon: Minus, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', label: 'Spending Steady' },
};

export const InsightCards: React.FC<InsightCardsProps> = ({ trend, anomalies, currency, sourceBreakdown }) => {
    const cfg = trendConfig[trend.direction];
    const TrendIcon = cfg.icon;
    const topAnomaly = anomalies[0];

    return (
        <div className="flex flex-col gap-3 mt-4">
            {/* Spending Trend */}
            <div className="glass-card p-3 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.color}`}>
                    <TrendIcon className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">{cfg.label}</span>
                    {trend.direction !== 'flat' && (
                        <span> — {trend.percentChange.toFixed(0)}% vs last month</span>
                    )}
                </p>
            </div>

            {/* Top Anomaly */}
            {topAnomaly && (
                <div className="glass-card p-3 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">Unusual:</span>{' '}
                        {formatCurrencyCompact(fromCents(topAnomaly.amountCents), currency)} on {topAnomaly.category}
                        {' '}(avg {formatCurrencyCompact(fromCents(topAnomaly.averageCents), currency)})
                    </p>
                </div>
            )}

            {/* Source Breakdown — only shown when bank data exists */}
            {sourceBreakdown?.hasBankData && (
                <div className="glass-card p-3 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/20 text-sky-600">
                        <Landmark className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">Bank vs Cash:</span>{' '}
                            {formatCurrencyCompact(fromCents(sourceBreakdown.syncedCents), currency)} bank
                            {' · '}
                            {formatCurrencyCompact(fromCents(sourceBreakdown.manualCents), currency)} cash
                        </p>
                        <div className="flex h-1.5 rounded-full overflow-hidden mt-1.5 bg-slate-200 dark:bg-slate-700">
                            <div className="bg-sky-500 rounded-l-full transition-all" style={{ width: `${sourceBreakdown.syncedPercent}%` }} />
                            <div className="bg-amber-400 flex-1 rounded-r-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
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

interface InsightCardsProps {
    trend: SpendingTrend;
    anomalies: Anomaly[];
    currency: Currency;
}

const trendConfig = {
    up: { icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/20', label: 'Spending Up' },
    down: { icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20', label: 'Spending Down' },
    flat: { icon: Minus, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', label: 'Spending Steady' },
};

export const InsightCards: React.FC<InsightCardsProps> = ({ trend, anomalies, currency }) => {
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
        </div>
    );
};

/**
 * SpendingTrendsChart - Weekly spending visualization
 * Extracted from AccountDetailsView for better maintainability
 */

import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { Currency } from '../../../types';

interface WeeklyData {
    weekStart: Date;
    income: number;
    expense: number;
    net: number;
}

interface SpendingTrendsChartProps {
    weeklyData: WeeklyData[];
    currency: Currency;
    selectedWeekStart: Date | null;
    onSelectWeek: (weekStart: Date | null) => void;
    maxAmount: number;
}

export const SpendingTrendsChart = ({
    weeklyData,
    currency,
    selectedWeekStart,
    onSelectWeek,
    maxAmount,
}: SpendingTrendsChartProps) => {
    return (
        <div className="lg:col-span-2 glass-card p-6">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>30 Day Trends</span>
                </h3>
                {selectedWeekStart && (
                    <button
                        onClick={() => onSelectWeek(null)}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            <div className="h-48 flex items-end justify-between gap-4">
                {weeklyData.map((d, i) => {
                    const isSelected = selectedWeekStart && d.weekStart.getTime() === selectedWeekStart.getTime();
                    const isDimmed = selectedWeekStart && !isSelected;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectWeek(isSelected ? null : d.weekStart)}
                            className={`flex-1 flex flex-col items-center gap-2 group transition-all ${isDimmed ? 'opacity-30 grayscale' : 'opacity-100 hover:scale-[1.02]'}`}
                        >
                            <div className="w-full flex gap-1 items-end justify-center h-full relative">
                                {/* Net Annotation */}
                                <div className={`absolute -top-6 text-[10px] font-black transition-transform group-hover:-translate-y-1 ${d.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {d.net > 0 ? '+' : ''}{formatCurrency(d.net, currency)}
                                </div>

                                {/* Hover Background */}
                                <div className="absolute inset-x-[-8px] top-[-10px] bottom-[-10px] rounded-xl bg-slate-100 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 -z-10 transition-opacity" />

                                {/* Bar Group Container */}
                                <div className="w-full max-w-[60px] flex gap-1 items-end h-full relative">
                                    {/* Income Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div
                                            style={{ height: `${Math.max((d.income / maxAmount) * 100, 4)}%` }}
                                            className="w-full bg-emerald-500 rounded-t-md relative group-hover:bg-emerald-400 transition-colors"
                                        />
                                    </div>

                                    {/* Expense Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div
                                            style={{ height: `${Math.max((d.expense / maxAmount) * 100, 4)}%` }}
                                            className="w-full bg-rose-500 rounded-t-md relative group-hover:bg-rose-400 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Week Label */}
                            <div className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                                {d.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                    <span>Income</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-sm" />
                    <span>Expenses</span>
                </div>
            </div>
        </div>
    );
};

/**
 * SpendingTrendsChart — the account's month at a glance, with inspectable weeks.
 *
 * UX-FN-10: this used to be three enormous pastel cards (IN / OUT / NET) stacked
 * above a decorative bar chart, inside a glass panel — a large footprint for
 * four numbers. It is now:
 *
 *   September                            (the month, stated)
 *   In ₦1.39m · Out ₦847k · Net +₦540k   (one compact, labelled line)
 *   [week bars, each one tappable]        (values inspectable per week)
 *
 * Every value is labelled in text (In / Out / Net) as well as coloured, so the
 * meaning never depends on green-vs-red alone. Selecting a week reports that
 * week's date range and its own In / Out / Net in a live region — the "make
 * weekly values inspectable" requirement, with no charting dependency.
 *
 * Transfers: the ledger stores an internal transfer as an expense leg on the
 * source account and an income leg on the destination account (both carrying
 * category "Transfer"), so at ACCOUNT level they legitimately count as money
 * leaving/arriving. The
 * caption says so when the month contains one, because a number that includes
 * movement between the user's own accounts must not be read as economic income
 * or spending.
 */



import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
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
    /** e.g. "September 2026". Falls back to a generic label. */
    monthLabel?: string;
    /** True when the month contains a leg of a transfer between the user's own accounts. */
    hasTransfers?: boolean;
}

const dayLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const SpendingTrendsChart = ({
    weeklyData,
    currency,
    selectedWeekStart,
    onSelectWeek,
    maxAmount,
    monthLabel,
    hasTransfers = false,
}: SpendingTrendsChartProps) => {
    const totals = useMemo(
        () => weeklyData.reduce(
            (acc, d) => ({ income: acc.income + d.income, expense: acc.expense + d.expense }),
            { income: 0, expense: 0 },
        ),
        [weeklyData],
    );

    const selectedWeek = selectedWeekStart
        ? weeklyData.find(d => d.weekStart.getTime() === selectedWeekStart.getTime())
        : null;

    // What the three stats currently describe: the selected week, or the month.
    const shown = selectedWeek
        ? { income: selectedWeek.income, expense: selectedWeek.expense, net: selectedWeek.net }
        : { income: totals.income, expense: totals.expense, net: totals.income - totals.expense };

    const selectedRange = selectedWeek
        ? (() => {
            const end = new Date(selectedWeek.weekStart);
            end.setDate(end.getDate() + 6);
            return `${dayLabel(selectedWeek.weekStart)} – ${dayLabel(end)}`;
        })()
        : null;

    const stats = [
        {
            key: 'in',
            label: 'In',
            value: shown.income,
            icon: <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />,
            tone: 'text-finance-700 dark:text-finance-400',
            prefix: shown.income > 0 ? '+' : '',
        },
        {
            key: 'out',
            label: 'Out',
            value: shown.expense,
            icon: <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />,
            tone: 'text-rose-600 dark:text-rose-400',
            prefix: shown.expense > 0 ? '−' : '',
        },
        {
            key: 'net',
            /**
             * Financial correctness: a negative net must carry its minus sign.
             * Rendering the absolute value in red was a number that said the
             * opposite of the truth.
             */
            label: 'Net',
            value: shown.net,
            icon: null,
            tone: shown.net < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white',
            prefix: shown.net < 0 ? '−' : shown.net > 0 ? '+' : '',
        },
    ];

    return (
        <section
            data-testid="monthly-summary"
            aria-labelledby="monthly-summary-heading"
            className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 px-4 py-3"
        >
            <div className="flex items-baseline justify-between gap-3">
                <h3
                    id="monthly-summary-heading"
                    className="text-[15px] font-semibold text-slate-900 dark:text-white"
                >
                    {monthLabel ?? 'This month'}
                </h3>
                {selectedWeekStart && (
                    <button
                        type="button"
                        onClick={() => onSelectWeek(null)}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 min-h-[32px] px-1"
                    >
                        Show whole month
                    </button>
                )}
            </div>

            {selectedRange && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400" data-testid="selected-week-range">
                    Week of {selectedRange}
                </p>
            )}

            {/* Three labelled stats — one compact line, not three cards. */}
            <dl
                className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1"
                aria-live="polite"
                data-testid="monthly-summary-stats"
            >
                {stats.map(stat => (
                    <div key={stat.key} className="flex items-baseline gap-1.5">
                        <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                            {stat.icon}
                            {stat.label}
                        </dt>
                        <dd className={`text-sm font-bold tabular-nums ${stat.tone}`}>
                            {stat.prefix}
                            {formatCurrencyCompact(Math.abs(stat.value), currency)}
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Weekly bars — each week is a real control with its values in its name. */}
            <div className="mt-3 h-16 flex items-end gap-1.5" role="group" aria-label="Weekly income and spending">
                {weeklyData.map((d, i) => {
                    const isSelected = !!selectedWeekStart && d.weekStart.getTime() === selectedWeekStart.getTime();
                    const isDimmed = !!selectedWeekStart && !isSelected;
                    const weekEnd = new Date(d.weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    const range = `${dayLabel(d.weekStart)} – ${dayLabel(weekEnd)}`;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelectWeek(isSelected ? null : d.weekStart)}
                            aria-pressed={isSelected}
                            aria-label={`Week of ${range}: in ${formatCurrencyCompact(d.income, currency)}, out ${formatCurrencyCompact(d.expense, currency)}, net ${formatCurrencyCompact(d.net, currency)}`}
                            className={`flex-1 min-h-[44px] flex flex-col items-center justify-end gap-1 transition-opacity ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
                        >
                            <span aria-hidden="true" className="w-full flex gap-0.5 items-end h-12">
                                <span className="flex-1 h-full flex items-end">
                                    <span
                                        style={{ height: `${Math.max((d.income / maxAmount) * 100, 4)}%` }}
                                        className={`w-full rounded-t ${isSelected ? 'bg-finance-500' : 'bg-finance-500/60'}`}
                                    />
                                </span>
                                <span className="flex-1 h-full flex items-end">
                                    <span
                                        style={{ height: `${Math.max((d.expense / maxAmount) * 100, 4)}%` }}
                                        className={`w-full rounded-t ${isSelected ? 'bg-rose-500' : 'bg-rose-500/60'}`}
                                    />
                                </span>
                            </span>
                            <span
                                aria-hidden="true"
                                className={`text-[10px] font-semibold ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`}
                            >
                                W{i + 1}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-1 flex items-center gap-4 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-2 h-2 rounded-sm bg-finance-500" />
                    In
                </span>
                <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-2 h-2 rounded-sm bg-rose-500" />
                    Out
                </span>
            </div>

            {hasTransfers && (
                <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    Includes transfers between your own accounts.
                </p>
            )}
        </section>
    );
};


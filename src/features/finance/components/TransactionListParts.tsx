/**
 * Transaction list header — search + the four list scopes.
 *
 * UX-FN-15: this used to render its own "History" heading inside the list card,
 * duplicating the section heading above it, and its scopes were labelled
 * "All | Out | In" — a vocabulary that appears nowhere else in the product. The
 * heading is gone (the section owns it) and the scopes are now the same words the
 * rest of Finance uses for money direction, with `aria-pressed` so the selected
 * scope is announced rather than only tinted.
 *
 * "Transfers" is a scope of its own because an internal transfer is stored as a
 * pair of income/expense legs (see `isTransferLeg`) — so it is neither economic
 * income nor economic spending, and the user must be able to see just those.
 */



import React from 'react';
import { Search, X } from 'lucide-react';
import type { FilterType } from '../../../hooks/useFilterPersistence';

interface FilterHeaderProps {
    searchQuery: string;
    filterType: FilterType;
    hasWeekFilter: boolean;
    onSearchChange: (q: string) => void;
    onFilterChange: (f: FilterType) => void;
    /** Optional: clear an active week filter from the summary chart. */
    onClearWeekFilter?: () => void;
    searchPlaceholder?: string;
}

const SCOPES: Array<{ value: FilterType; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'expense', label: 'Money out' },
    { value: 'income', label: 'Money in' },
    { value: 'transfer', label: 'Transfers' },
];

export const TransactionFilterHeader: React.FC<FilterHeaderProps> = ({
    searchQuery,
    filterType,
    hasWeekFilter,
    onSearchChange,
    onFilterChange,
    onClearWeekFilter,
    searchPlaceholder = 'Search transactions…',
}) => (
    <div className="mb-2">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full pl-9 pr-9 py-2 min-h-[44px] bg-slate-100 dark:bg-slate-800/70 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
            />
            {searchQuery && (
                <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-400"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <div className="flex gap-1" role="group" aria-label="Filter transactions">
                {SCOPES.map(({ value, label }) => {
                    const isActive = filterType === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onFilterChange(value)}
                            aria-pressed={isActive}
                            className={`px-3 min-h-[32px] rounded-full text-xs font-semibold transition-colors ${isActive
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
            {hasWeekFilter && onClearWeekFilter && (
                <button
                    type="button"
                    onClick={onClearWeekFilter}
                    className="px-3 min-h-[32px] rounded-full text-xs font-semibold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                >
                    One week only · clear
                </button>
            )}
        </div>
    </div>
);

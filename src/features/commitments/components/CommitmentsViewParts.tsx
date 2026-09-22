/**
 * Commitments view parts — the switcher, the loading state, and the empty states.
 *
 * UX-DS-07: the bespoke empty state (a gradient disc, a floating plus badge, and
 * a "Learn More" button whose only job was to toast "coming soon") is replaced by
 * the shared EmptyState primitive, which exists so an empty state answers the
 * user: what this is, why it is empty, and the one action its sentence names.
 *
 * A search that matches nothing is now its own state. It used to fall through to
 * "Welcome to your Commitments" — a lie to someone with sixteen commitments who
 * mistyped a word, and it offered "Create First Commitment" for a commitment they
 * already have.
 */
// @ts-nocheck


import React from 'react';
import { CalendarDays, CheckCircle2, Clock, LayoutList, Search } from 'lucide-react';
import { EmptyState } from '../../../components/shared/EmptyState';

interface EmptyStateProps {
    hasFamilyActive: boolean;
    onCreateFirst: () => void;
    /** Set when the list is empty because a search matched nothing. */
    query?: string;
    onClearSearch?: () => void;
}

export const CommitmentsEmptyState: React.FC<EmptyStateProps> = ({
    hasFamilyActive, onCreateFirst, query, onClearSearch,
}) => {
    if (query) {
        return (
            <EmptyState
                testId="commitments-empty-search"
                icon={Search}
                title={`No matches for “${query}”`}
                description="Check the spelling, or clear the search to see every commitment."
                action={{ label: 'Clear search', onClick: () => onClearSearch?.() }}
            />
        );
    }

    return (
        <EmptyState
            testId="commitments-empty"
            icon={CheckCircle2}
            title="No commitments yet"
            description={hasFamilyActive
                ? 'Commitments are the things you keep doing — daily, weekly or monthly — for you and your family.'
                : 'Commitments are the things you keep doing — daily, weekly or monthly.'}
            action={{ label: 'Create a commitment', onClick: onCreateFirst }}
        />
    );
};

/**
 * Loading is a state, not a dimmed blank page.
 *
 * While the first read was in flight the list simply dropped to 50% opacity, so a
 * cold open showed an empty region with nothing to explain it — and because the
 * empty state was not gated on loading, it also told users with commitments that
 * they had none. The placeholder mirrors a row's shape, so the page does not jump
 * when the data lands.
 */
export const CommitmentsLoadingState: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
    <div className="space-y-3" data-testid="commitments-loading" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading your commitments…</span>
        {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-card border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-2/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
        ))}
    </div>
);

interface ViewSwitcherProps { viewMode: string; onViewChange: (v: 'timeline' | 'list' | 'calendar') => void; }

/** UX-CM-11: the switcher is labelled and its selected state is exposed to assistive tech. */
const VIEW_OPTIONS = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'list', label: 'List', icon: LayoutList },
    { id: 'calendar', label: 'Week', icon: CalendarDays },
] as const;

/**
 * The view switcher — the only control above the list.
 *
 * Two filter bars used to sit here as well: "Show me" (Today / Overdue / This
 * week / Later / Done / All) and "Show" (All / Daily / Weekly / Monthly /
 * One-off). Together with this switcher, the "Select" button and the find field,
 * that was fifteen controls before a single commitment was on screen — and all
 * of it rendered on an empty page.
 *
 * "Show" asked the user to filter their day by how a commitment is *stored*,
 * which is a question about the database rather than about their day, and the
 * six smart views mostly restated what the rows already say. Both are gone and
 * the list shows everything.
 *
 * The switcher stays because it changes the layout rather than filtering it.
 */
export const CommitmentsViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onViewChange }) => (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start" role="group" aria-label="Commitment view">
        {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = viewMode === id;
            return (
                <button
                    key={id}
                    type="button"
                    onClick={() => onViewChange(id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all min-h-[44px] ${isActive ? 'bg-white dark:bg-slate-600 shadow-elevation-subtle text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{label}</span>
                </button>
            );
        })}
    </div>
);

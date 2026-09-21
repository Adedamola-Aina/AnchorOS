/**
 * CommitmentsView Empty State & Helpers
 * Extracted from CommitmentsView.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


import React from 'react';
import { Plus, CheckCircle2, LayoutList, CalendarDays, Clock } from 'lucide-react';
import { Button } from '@anchor-os/ui';

interface EmptyStateProps { filter: string; hasFamilyActive: boolean; onCreateFirst: () => void; onLearnMore: () => void; }
export const CommitmentsEmptyState: React.FC<EmptyStateProps> = ({ filter, hasFamilyActive, onCreateFirst, onLearnMore }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-task-500/60 dark:text-task-400/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"><Plus className="w-4 h-4 text-emerald-500" /></div>
        </div>
        <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-2">{filter === 'all' ? 'Welcome to your Commitments' : `No ${filter} commitments`}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
            {filter === 'all' ? (hasFamilyActive ? "This is where you'll build consistency. Commitments are recurring obligations that keep you and your family on track." : "This is where you'll build consistency. Commitments are recurring obligations that keep you on track.") : `You don't have any ${filter} commitments. Create one to get started.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onCreateFirst} className="gap-3" size="lg"><Plus className="w-5 h-4" /><span>Create First Commitment</span></Button>
            <Button onClick={onLearnMore} variant="secondary" size="lg">Learn More</Button>
        </div>
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

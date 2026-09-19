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

interface FilterBarProps { filter: string; viewMode: string; onFilterChange: (f: 'all' | 'daily' | 'weekly' | 'monthly' | 'todo') => void; onViewChange: (v: 'timeline' | 'list' | 'calendar') => void; }

/** UX-CM-11: the switcher is labelled and its selected state is exposed to assistive tech. */
const VIEW_OPTIONS = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'list', label: 'List', icon: LayoutList },
    { id: 'calendar', label: 'Week', icon: CalendarDays },
] as const;

/**
 * CM-04 / CM-10: this control used to render five UNLABELLED chips whose words
 * ("DAILY", "WEEKLY", "MONTHLY", "TODO") were identical to the composer's cadence
 * cards rendered on the same screen — one vocabulary doing two jobs, with a
 * one-off type presented as if it were a frequency.
 *
 * Now the group says what it does ("Show"), so the two controls are
 * distinguishable by context, and the one-off option is named for what it is
 * instead of borrowing a cadence word. The stored task type values are unchanged.
 */
const FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'todo', label: 'One-off' },
] as const;

export const CommitmentsFilterBar: React.FC<FilterBarProps> = ({ filter, viewMode, onFilterChange, onViewChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
            <span id="commitments-filter-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Show</span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mb-2" role="group" aria-labelledby="commitments-filter-label">
                {FILTER_OPTIONS.map(({ value, label }) => (
                    <Button key={value} onClick={() => onFilterChange(value)} variant={filter === value ? 'primary' : 'secondary'} size="sm" className="uppercase tracking-widest text-[10px]">{label}</Button>
                ))}
            </div>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto" role="group" aria-label="Commitment view">
            {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
                const isActive = viewMode === id;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onViewChange(id)}
                        aria-pressed={isActive}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all min-h-[44px] ${isActive ? 'bg-white dark:bg-slate-600 shadow-sm text-task-600 dark:text-task-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    </div>
);

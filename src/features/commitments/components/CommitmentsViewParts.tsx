/**
 * CommitmentsView Empty State & Helpers
 * Extracted from CommitmentsView.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Plus, CheckCircle2, LayoutList, CalendarDays } from 'lucide-react';
import { Button } from '../../../components/ui';

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

interface FilterBarProps { filter: string; viewMode: string; onFilterChange: (f: 'all' | 'daily' | 'weekly' | 'monthly' | 'todo') => void; onViewChange: (v: 'list' | 'calendar') => void; }
export const CommitmentsFilterBar: React.FC<FilterBarProps> = ({ filter, viewMode, onFilterChange, onViewChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 -mb-2">
            {(['all', 'daily', 'weekly', 'monthly', 'todo'] as const).map((f) => (
                <Button key={f} onClick={() => onFilterChange(f)} variant={filter === f ? 'primary' : 'secondary'} size="sm" className="capitalize uppercase tracking-widest text-[10px]">{f}</Button>
            ))}
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
            <button onClick={() => onViewChange('list')} className={`p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-task-600 dark:text-task-400' : 'text-slate-400'}`} title="List View" aria-label="List View"><LayoutList className="w-4 h-4" /></button>
            <button onClick={() => onViewChange('calendar')} className={`p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-600 shadow-sm text-task-600 dark:text-task-400' : 'text-slate-400'}`} title="Week View" aria-label="Week View"><CalendarDays className="w-4 h-4" /></button>
        </div>
    </div>
);

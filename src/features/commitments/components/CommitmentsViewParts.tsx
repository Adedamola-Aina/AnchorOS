/**
 * CommitmentsView Empty State & Helpers
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Plus, CheckCircle2, LayoutList, CalendarDays } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface EmptyStateProps { filter: string; hasFamilyActive: boolean; onCreateFirst: () => void; onLearnMore: () => void; }
export const CommitmentsEmptyState: React.FC<EmptyStateProps> = ({ filter, hasFamilyActive, onCreateFirst, onLearnMore }) => (
    <VStack align="center" justify="center" className="py-16 px-4">
        <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-task-100 dark:from-primary-900/30 dark:to-task-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-task-500/60 dark:text-task-400/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-finance-100 dark:bg-finance-900/30 rounded-full flex items-center justify-center"><Plus className="w-4 h-4 text-finance-500" /></div>
        </div>
        <Text variant="heading" size="lg" weight="bold" className="mb-2">
            {filter === 'all' ? 'Welcome to your Commitments' : `No ${filter} commitments`}
        </Text>
        <Text variant="muted" className="text-center max-w-sm mb-8">
            {filter === 'all' ? (hasFamilyActive ? "This is where you'll build consistency. Commitments are recurring obligations that keep you and your family on track." : "This is where you'll build consistency. Commitments are recurring obligations that keep you on track.") : `You don't have any ${filter} commitments. Create one to get started.`}
        </Text>
        <HStack gap="md" className="flex-col sm:flex-row">
            <Button onClick={onCreateFirst} className="gap-3" size="lg"><Plus className="w-5 h-4" /><span>Create First Commitment</span></Button>
            <Button onClick={onLearnMore} variant="secondary" size="lg">Learn More</Button>
        </HStack>
    </VStack>
);

interface FilterBarProps { filter: string; viewMode: string; onFilterChange: (f: 'all' | 'daily' | 'weekly' | 'monthly' | 'todo') => void; onViewChange: (v: 'list' | 'calendar') => void; }
export const CommitmentsFilterBar: React.FC<FilterBarProps> = ({ filter, viewMode, onFilterChange, onViewChange }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <HStack gap="sm" className="flex-wrap overflow-x-auto pb-2 -mb-2">
            {(['all', 'daily', 'weekly', 'monthly', 'todo'] as const).map((f) => (
                <Button key={f} onClick={() => onFilterChange(f)} variant={filter === f ? 'primary' : 'secondary'} size="sm" className="capitalize uppercase tracking-widest text-[10px]">{f}</Button>
            ))}
        </HStack>
        <div className="flex bg-surface-3 dark:bg-surface-3-dark p-1 rounded-lg self-start sm:self-auto">
            <button onClick={() => onViewChange('list')} className={`p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${viewMode === 'list' ? 'bg-surface-2 dark:bg-surface-2-dark shadow-sm text-task-600 dark:text-task-400' : 'text-muted'}`} title="List View" aria-label="List View"><LayoutList className="w-4 h-4" /></button>
            <button onClick={() => onViewChange('calendar')} className={`p-3 sm:p-2 rounded-md transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${viewMode === 'calendar' ? 'bg-surface-2 dark:bg-surface-2-dark shadow-sm text-task-600 dark:text-task-400' : 'text-muted'}`} title="Week View" aria-label="Week View"><CalendarDays className="w-4 h-4" /></button>
        </div>
    </div>
);


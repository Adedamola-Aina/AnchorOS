/**
 * TransactionListVirtual Parts
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Search, Pencil } from 'lucide-react';
import { Text, HStack, Badge } from '../../../components/primitives';

interface FilterHeaderProps { searchQuery: string; filterType: 'all' | 'income' | 'expense'; hasWeekFilter: boolean; onSearchChange: (q: string) => void; onFilterChange: (f: 'all' | 'income' | 'expense') => void; }

export const TransactionFilterHeader: React.FC<FilterHeaderProps> = ({ searchQuery, filterType, hasWeekFilter, onSearchChange, onFilterChange }) => (
    <div className="p-4 border-b border-border-subtle dark:border-border-dark flex flex-col sm:flex-row gap-4 items-center justify-between">
        <HStack gap="sm" align="center">
            <Text variant="heading" size="lg" weight="bold">History</Text>
            {hasWeekFilter && <Badge variant="default" size="xs">Filtered by Week</Badge>}
        </HStack>
        <HStack gap="sm" className="w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full sm:w-48 pl-9 pr-3 py-2 bg-surface-3 dark:bg-surface-3-dark rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-foreground dark:text-foreground-dark" />
            </div>
            <div className="flex bg-surface-3 dark:bg-surface-3-dark p-1 rounded-lg">
                {(['all', 'expense', 'income'] as const).map((type) => (
                    <button key={type} onClick={() => onFilterChange(type)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-surface-2 dark:bg-surface-2-dark shadow-sm text-foreground dark:text-foreground-dark' : 'text-muted'}`}>
                        {type === 'all' ? 'All' : type === 'expense' ? 'Out' : 'In'}
                    </button>
                ))}
            </div>
        </HStack>
    </div>
);

interface NameHistoryEntry { oldName: string; newName: string; date: string; actorName: string; }
interface NameHistoryProps { entries: NameHistoryEntry[]; }

export const AccountNameHistory: React.FC<NameHistoryProps> = ({ entries }) => (
    <div className="border-b border-warning/20 dark:border-warning-dark/20">
        {entries.slice().reverse().map((entry, idx) => (
            <HStack key={`rename-${idx}`} gap="md" align="center" className="p-4 bg-warning-bg/50 dark:bg-warning-bgDark/50">
                <div className="p-2 bg-warning-bg dark:bg-warning-bgDark rounded-xl">
                    <Pencil className="w-4 h-4 text-warning dark:text-warning-dark" />
                </div>
                <div className="flex-1 min-w-0">
                    <Text variant="warning" size="sm" weight="medium">Account renamed</Text>
                    <Text variant="subtle" size="xs">
                        <span className="line-through">{entry.oldName}</span>
                        <span className="mx-2">→</span>
                        <Text as="span" weight="semibold">{entry.newName}</Text>
                    </Text>
                </div>
                <div className="text-right">
                    <Text variant="subtle" size="xs">{new Date(entry.date).toLocaleDateString()}</Text>
                    <Text variant="subtle" size="xs">by {entry.actorName}</Text>
                </div>
            </HStack>
        ))}
    </div>
);

// TransactionRow removed - using unified TransactionItem/SwipeableTransactionItem instead


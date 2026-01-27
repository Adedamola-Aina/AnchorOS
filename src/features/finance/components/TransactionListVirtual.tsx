/**
 * TransactionListVirtual - Virtualized transaction list with search/filter
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI components extracted to TransactionListParts.tsx
 */

import { useRef } from 'react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
import { useResponsive } from '../../../hooks/useResponsive';
import type { AnchorTransaction, AnchorAccount } from '../../../types';
import { TransactionFilterHeader, AccountNameHistory, TransactionRow } from './TransactionListParts';

interface TransactionListVirtualProps {
    transactions: AnchorTransaction[]; account: AnchorAccount; currentUserId?: string; searchQuery: string;
    filterType: 'all' | 'income' | 'expense'; selectedWeekStart: Date | null;
    onSearchChange: (query: string) => void; onFilterChange: (filter: 'all' | 'income' | 'expense') => void;
    onEdit?: (tx: AnchorTransaction) => void; onDelete: (tx: AnchorTransaction) => void;
}

export const TransactionListVirtual = ({ transactions, account, currentUserId, searchQuery, filterType, selectedWeekStart, onSearchChange, onFilterChange, onEdit, onDelete }: TransactionListVirtualProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();
    const isOwner = !account.ownerId || account.ownerId === currentUserId;

    const parentVirtualizer = useVirtualizer({ count: transactions.length, getScrollElement: () => parentRef.current, estimateSize: () => 100, overscan: 5 });
    const windowVirtualizer = useWindowVirtualizer({ count: transactions.length, estimateSize: () => 100, overscan: 5, scrollMargin: parentRef.current?.offsetTop ?? 0 });
    const rowVirtualizer = isMobile ? windowVirtualizer : parentVirtualizer;

    return (
        <div className="glass-card overflow-hidden">
            <TransactionFilterHeader searchQuery={searchQuery} filterType={filterType} hasWeekFilter={!!selectedWeekStart} onSearchChange={onSearchChange} onFilterChange={onFilterChange} />

            {account.nameHistory && account.nameHistory.length > 0 && !searchQuery && filterType === 'all' && (
                <AccountNameHistory entries={account.nameHistory} />
            )}

            <div ref={parentRef} className={isMobile ? 'p-3' : 'md:max-h-[500px] overflow-y-auto p-3'}>
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const tx = transactions[virtualItem.index];
                        return (
                            <div key={virtualItem.key} data-index={virtualItem.index} ref={rowVirtualizer.measureElement} className="absolute top-0 left-0 w-full pb-3"
                                style={{ transform: `translateY(${virtualItem.start - (isMobile ? rowVirtualizer.options.scrollMargin : 0)}px)` }}>
                                <TransactionRow tx={tx} isOwner={isOwner} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
                            </div>
                        );
                    })}
                </div>
                {transactions.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">{selectedWeekStart ? 'No transactions in selected week.' : 'No transactions found.'}</div>}
            </div>
        </div>
    );
};

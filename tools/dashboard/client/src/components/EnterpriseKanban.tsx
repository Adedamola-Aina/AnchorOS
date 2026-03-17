// @ts-nocheck
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EnterpriseKanbanBoard } from './EnterpriseKanbanBoard';
import { EnterpriseKanbanFilters } from './EnterpriseKanbanFilters';
import { EnterpriseKanbanStatsBar } from './EnterpriseKanbanStatsBar';
import { buildKanbanColumns, hasActiveFilters } from './enterpriseKanban.helpers';
import type { KanbanFilters } from './enterpriseKanban.types';
import { useEnterpriseKanbanData } from './useEnterpriseKanbanData';

const defaultFilters: KanbanFilters = {
    searchQuery: '',
    filterType: 'all',
    filterPriority: 'all',
    filterAssignee: 'all',
};

export function EnterpriseKanban() {
    const { data, loading, velocityStats } = useEnterpriseKanbanData();
    const [filters, setFilters] = useState<KanbanFilters>(defaultFilters);
    const [showFilters, setShowFilters] = useState(false);
    const columns = useMemo(
        () => (data ? buildKanbanColumns(data, filters) : []),
        [data, filters],
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data || data.error) {
        return <div className="card text-red-400">Failed to load Kanban board</div>;
    }

    return (
        <div className="space-y-6">
            <EnterpriseKanbanStatsBar stats={data.stats} velocityStats={velocityStats} />
            <EnterpriseKanbanFilters
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                hasActiveFilters={hasActiveFilters(filters)}
            />
            <EnterpriseKanbanBoard data={data} columns={columns} />
        </div>
    );
}

export default EnterpriseKanban;

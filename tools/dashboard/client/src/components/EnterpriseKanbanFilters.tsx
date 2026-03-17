import { ChevronDown, ChevronUp, Filter, Search, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type { KanbanFilters } from './enterpriseKanban.types';

interface EnterpriseKanbanFiltersProps {
    filters: KanbanFilters;
    setFilters: Dispatch<SetStateAction<KanbanFilters>>;
    showFilters: boolean;
    setShowFilters: Dispatch<SetStateAction<boolean>>;
    hasActiveFilters: boolean;
}

function updateFilter<K extends keyof KanbanFilters>(
    key: K,
    value: KanbanFilters[K],
    setFilters: Dispatch<SetStateAction<KanbanFilters>>,
): void {
    setFilters((prev) => ({ ...prev, [key]: value }));
}

export function EnterpriseKanbanFilters({
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    hasActiveFilters,
}: EnterpriseKanbanFiltersProps) {
    return (
        <div className="card">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title or ID..."
                            value={filters.searchQuery}
                            onChange={(event) => updateFilter('searchQuery', event.target.value, setFilters)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {hasActiveFilters && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={() => setFilters({
                            searchQuery: '',
                            filterType: 'all',
                            filterPriority: 'all',
                            filterAssignee: 'all',
                        })}
                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-slate-500 mb-2">Type</label>
                        <select
                            value={filters.filterType}
                            onChange={(event) => updateFilter('filterType', event.target.value, setFilters)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="bug">🐛 Bugs</option>
                            <option value="feature">✨ Features</option>
                            <option value="task">✅ Tasks</option>
                            <option value="gap">⚠️ Gaps</option>
                            <option value="regression">🔴 Regressions</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 mb-2">Priority</label>
                        <select
                            value={filters.filterPriority}
                            onChange={(event) => updateFilter('filterPriority', event.target.value, setFilters)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="P0">🔴 P0 (Critical)</option>
                            <option value="P1">🟡 P1 (High)</option>
                            <option value="P2">🟢 P2 (Low)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 mb-2">Assignee</label>
                        <select
                            value={filters.filterAssignee}
                            onChange={(event) => updateFilter('filterAssignee', event.target.value, setFilters)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Assignees</option>
                            <option value="Teeto">👤 Teeto</option>
                            <option value="Agent">🤖 Agent</option>
                            <option value="Unassigned">⚪ Unassigned</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

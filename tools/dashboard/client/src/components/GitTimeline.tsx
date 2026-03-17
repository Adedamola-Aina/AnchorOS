// @ts-nocheck
import { RefreshCw, GitCommit, GitBranch, Clock, Filter } from 'lucide-react';
import type { FilterType } from './gitTimeline.types';
import { filterLabels, formatDate, getTypeColor } from './gitTimeline.helpers';
import { useGitTimeline } from './useGitTimeline';

function getCategoryBadgeClass(category?: string): string {
    switch (category) {
        case 'anchorOS':
            return 'badge-green';
        case 'dashboard':
            return 'badge-blue';
        case 'docs':
            return 'badge-yellow';
        case 'infra':
            return 'badge';
        default:
            return 'badge';
    }
}

export function GitTimeline() {
    const {
        loading,
        expandedDay,
        filter,
        categoryStats,
        filteredTimeline,
        setExpandedDay,
        setFilter,
    } = useGitTimeline();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter + Stats */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Filter:</span>
                    <div className="flex gap-1">
                        {(['anchorOS', 'dashboard', 'docs', 'infra', 'all'] as FilterType[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === f
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-transparent'
                                    }`}
                            >
                                {filterLabels[f]}
                                {categoryStats[f] !== undefined && (
                                    <span className="ml-1 text-xs opacity-60">({categoryStats[f]})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <span className="text-sm text-slate-500">
                    {filteredTimeline.reduce((sum, day) => sum + day.commitCount, 0)} commits shown
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Active Days</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{filteredTimeline.length}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <GitCommit className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">Total Commits</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">
                        {filteredTimeline.reduce((sum, day) => sum + day.commitCount, 0)}
                    </p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Features Shipped</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">
                        {new Set(filteredTimeline.flatMap(d => d.features)).size}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="card">
                <h3 className="card-header">
                    {filter === 'anchorOS' && '⚓ Product '}
                    {filter === 'dashboard' && '📊 Dashboard '}
                    {filter === 'docs' && '📝 Docs & Governance '}
                    {filter === 'infra' && '⚙️ Infrastructure '}
                    Commit Timeline (Last 14 Days)
                </h3>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />

                    <div className="space-y-6">
                        {filteredTimeline.length === 0 ? (
                            <div className="pl-10 text-slate-500">
                                No {filter === 'all' ? '' :
                                    filter === 'anchorOS' ? 'Product' :
                                    filter === 'dashboard' ? 'Dashboard' :
                                    filter === 'docs' ? 'Docs & Governance' :
                                    'Infrastructure'} commits in the last 14 days.
                            </div>
                        ) : (
                            filteredTimeline.map((day) => (
                                <div key={day.date} className="relative pl-10">
                                    {/* Dot */}
                                    <div className={`absolute left-2.5 w-3 h-3 rounded-full ring-4 ring-slate-800 ${
                                        filter === 'dashboard' ? 'bg-blue-500' :
                                        filter === 'docs' ? 'bg-amber-500' :
                                        filter === 'infra' ? 'bg-slate-500' :
                                        'bg-emerald-500'
                                        }`} />

                                    {/* Content */}
                                    <div
                                        className="cursor-pointer hover:bg-slate-700/20 rounded-lg p-3 -ml-2 transition-colors"
                                        onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-white">{formatDate(day.date)}</span>
                                            <span className="text-sm text-slate-400">
                                                {day.commitCount} commit{day.commitCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {day.byType && (
                                            <div className="text-xs text-slate-500 mb-2">
                                                {day.byType.feature || 0} features • {day.byType.bugfix || 0} fixes • {day.byType.docs || 0} docs
                                            </div>
                                        )}

                                        {day.byDomain && (
                                            <div className="text-xs text-slate-500 mb-2">
                                                Top domains: {Object.entries(day.byDomain)
                                                    .sort((a, b) => b[1] - a[1])
                                                    .slice(0, 2)
                                                    .map(([domain]) => domain)
                                                    .join(', ')}
                                            </div>
                                        )}

                                        {/* Features summary */}
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {day.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="badge badge-purple text-xs">
                                                    {feature.substring(0, 30)}{feature.length > 30 ? '...' : ''}
                                                </span>
                                            ))}
                                            {day.features.length > 3 && (
                                                <span className="badge badge-yellow text-xs">
                                                    +{day.features.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Expanded commits */}
                                        {expandedDay === day.date && (
                                            <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
                                                {day.commits.map((commit, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="font-mono text-emerald-400 flex-shrink-0">{commit.hash}</span>
                                                        <span className={`badge ${getCategoryBadgeClass(commit.category)} flex-shrink-0`}>
                                                            {commit.category || 'unknown'}
                                                        </span>
                                                        <span className={`badge ${getTypeColor(commit.type)} flex-shrink-0`}>
                                                            {commit.workKind || commit.type}
                                                        </span>
                                                        <span className="text-slate-300 truncate" title={commit.message}>
                                                            {commit.message.split('\n')[0]}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


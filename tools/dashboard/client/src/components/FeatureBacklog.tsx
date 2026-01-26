import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Lightbulb, ArrowUp, ArrowRight, ArrowDown, Filter, Search, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    effort: string;
    impact: string;
    description: string;
}

interface FeaturesData {
    parsed: {
        features: Feature[];
        grouped: Record<string, Feature[]>;
        summary: {
            total: number;
            byPriority: { high: number; medium: number; low: number };
            byCategory: { category: string; count: number }[];
        };
    };
    lastModified: string;
}

export function FeatureBacklog() {
    const [data, setData] = useState<FeaturesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFeatures() {
            try {
                const res = await axios.get('/api/features');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch features:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatures();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data?.parsed) {
        return <div className="card">Failed to load feature suggestions</div>;
    }

    const { features, summary } = data.parsed;

    // Apply filters
    const filteredFeatures = features.filter(f => {
        if (filter !== 'all' && f.priority !== filter) return false;
        if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
        if (search && !f.title.toLowerCase().includes(search.toLowerCase()) &&
            !f.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const PriorityIcon = ({ priority }: { priority: string }) => {
        switch (priority) {
            case 'high':
                return <ArrowUp className="w-4 h-4 text-red-400" />;
            case 'medium':
                return <ArrowRight className="w-4 h-4 text-amber-400" />;
            case 'low':
                return <ArrowDown className="w-4 h-4 text-blue-400" />;
            default:
                return null;
        }
    };

    const priorityColors = {
        high: 'badge-red',
        medium: 'badge-yellow',
        low: 'badge-blue'
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-slate-300">Total Ideas</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{summary.total}</p>
                </div>
                <div className="card cursor-pointer hover:bg-slate-700/30 transition-colors" onClick={() => setFilter('high')}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUp className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-medium text-slate-300">High Priority</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{summary.byPriority.high}</p>
                </div>
                <div className="card cursor-pointer hover:bg-slate-700/30 transition-colors" onClick={() => setFilter('medium')}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-slate-300">Medium Priority</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{summary.byPriority.medium}</p>
                </div>
                <div className="card cursor-pointer hover:bg-slate-700/30 transition-colors" onClick={() => setFilter('low')}>
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDown className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-slate-300">Low Priority</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{summary.byPriority.low}</p>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="card">
                <h3 className="card-header">By Category</h3>
                <div className="flex flex-wrap gap-2">
                    {summary.byCategory.map((cat) => (
                        <button
                            key={cat.category}
                            onClick={() => setCategoryFilter(categoryFilter === cat.category ? 'all' : cat.category)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${categoryFilter === cat.category
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {cat.category} <span className="font-bold">({cat.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by ID or title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Priority Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Only</option>
                            <option value="medium">Medium Only</option>
                            <option value="low">Low Only</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(filter !== 'all' || categoryFilter !== 'all' || search) && (
                        <button
                            onClick={() => { setFilter('all'); setCategoryFilter('all'); setSearch(''); }}
                            className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Feature List */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-header mb-0">Feature Backlog</h3>
                    <span className="text-sm text-slate-400">
                        Showing {filteredFeatures.length} of {summary.total}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-header w-24">ID</th>
                                <th className="table-header">Feature</th>
                                <th className="table-header w-40">Category</th>
                                <th className="table-header w-24 text-center">Priority</th>
                                <th className="table-header w-32">Effort</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeatures.map((feature) => (
                                <>
                                    <tr
                                        key={feature.id}
                                        className="table-row group cursor-pointer hover:bg-slate-800/50"
                                        onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
                                    >
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                {expandedId === feature.id ? (
                                                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                                )}
                                                <span className="font-mono text-emerald-400 text-xs">{feature.id}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div>
                                                <p className="font-medium text-slate-200">{feature.title}</p>
                                                {feature.impact && (
                                                    <p className="text-xs text-slate-500 mt-0.5">{feature.impact}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="text-xs text-slate-400">{feature.category}</span>
                                        </td>
                                        <td className="table-cell text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <PriorityIcon priority={feature.priority} />
                                                <span className={`badge ${priorityColors[feature.priority]} capitalize`}>
                                                    {feature.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="text-xs text-slate-400">{feature.effort}</span>
                                        </td>
                                    </tr>
                                    {expandedId === feature.id && (
                                        <tr key={`${feature.id}-detail`} className="bg-slate-800/30">
                                            <td colSpan={5} className="p-4 border-t border-slate-700/50">
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <FileText className="w-5 h-5 text-emerald-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-emerald-400 mb-2">
                                                                {feature.title}
                                                            </h4>
                                                            <div className="text-sm text-slate-300 space-y-2">
                                                                {feature.description ? (
                                                                    <p className="whitespace-pre-wrap">{feature.description}</p>
                                                                ) : (
                                                                    <p className="text-slate-500 italic">No detailed description available.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700/50">
                                                        <div>
                                                            <span className="text-xs text-slate-500 uppercase">Category</span>
                                                            <p className="text-sm text-slate-300">{feature.category}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-slate-500 uppercase">Effort</span>
                                                            <p className="text-sm text-slate-300">{feature.effort || 'Not estimated'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-slate-500 uppercase">Impact</span>
                                                            <p className="text-sm text-slate-300">{feature.impact || 'Not assessed'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredFeatures.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No features match your filters
                    </div>
                )}
            </div>

            {/* Last Updated */}
            <div className="text-xs text-slate-500 text-right">
                Last updated: {data.lastModified ? new Date(data.lastModified).toLocaleString() : 'Unknown'}
            </div>
        </div>
    );
}

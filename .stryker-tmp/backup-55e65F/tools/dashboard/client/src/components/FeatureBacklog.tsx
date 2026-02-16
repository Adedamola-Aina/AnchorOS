import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, CheckCircle, Clock, AlertCircle, GitCommit } from 'lucide-react';

interface Feature {
    id: string;
    type: string;
    title: string;
    hash: string;
    date: string;
    author?: string;
    status: 'dev' | 'staging' | 'deployed';
    environments: {
        dev: boolean;
        staging: boolean;
        production: boolean;
    };
}

interface BacklogData {
    source: string;
    completed: Feature[];
    inProgress: Feature[];
    pending: Feature[];
    summary: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
    };
}

export function FeatureBacklog() {
    const [data, setData] = useState<BacklogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'inProgress' | 'completed'>('all');

    useEffect(() => {
        async function fetchFeatures() {
            try {
                // Use the new git-based API
                const res = await axios.get('/api/git/backlog');
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

    if (!data) {
        return <div className="card">Failed to load feature backlog</div>;
    }

    // Combine based on filter
    const allFeatures = statusFilter === 'completed'
        ? data.completed
        : statusFilter === 'inProgress'
            ? data.inProgress
            : statusFilter === 'pending'
                ? data.pending
                : [...data.pending, ...data.inProgress, ...data.completed];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'enhancement': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'ux': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
            case 'gap': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'task': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
            case 'architecture': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'deployed':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'staging':
                return <Clock className="w-4 h-4 text-blue-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-amber-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Source Badge */}
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    📊 Git-Automated
                </span>
                <span className="text-xs text-slate-500">Features extracted from commit history</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    className={`card cursor-pointer transition-colors ${statusFilter === 'pending' ? 'ring-2 ring-amber-500' : 'hover:bg-slate-700/30'}`}
                    onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-medium text-slate-300">Dev Only</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{data.summary.pending}</p>
                </div>
                <div
                    className={`card cursor-pointer transition-colors ${statusFilter === 'inProgress' ? 'ring-2 ring-blue-500' : 'hover:bg-slate-700/30'}`}
                    onClick={() => setStatusFilter(statusFilter === 'inProgress' ? 'all' : 'inProgress')}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-slate-300">In Staging</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{data.summary.inProgress}</p>
                </div>
                <div
                    className={`card cursor-pointer transition-colors ${statusFilter === 'completed' ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-700/30'}`}
                    onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">Deployed</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{data.summary.completed}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <GitCommit className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{data.summary.total}</p>
                </div>
            </div>

            {/* Feature List */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-header mb-0">Feature Backlog</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                            Showing {allFeatures.length} items
                        </span>
                        {statusFilter !== 'all' && (
                            <button
                                onClick={() => setStatusFilter('all')}
                                className="text-xs text-slate-400 hover:text-white"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {allFeatures.length > 0 ? (
                        allFeatures.map((feature) => (
                            <div
                                key={feature.id}
                                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-xs rounded border ${getTypeColor(feature.type)}`}>
                                                {feature.type.toUpperCase()}
                                            </span>
                                            <span className="font-mono text-xs text-emerald-400">{feature.id}</span>
                                        </div>
                                        <p className="text-sm text-slate-200 truncate">{feature.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {feature.hash} • {new Date(feature.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusIcon status={feature.status} />
                                        <span className={`text-xs ${feature.status === 'deployed' ? 'text-emerald-400' :
                                                feature.status === 'staging' ? 'text-blue-400' :
                                                    'text-amber-400'
                                            }`}>
                                            {feature.status === 'deployed' ? 'Deployed' :
                                                feature.status === 'staging' ? 'Staging' : 'Dev'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            No features match your filter
                        </div>
                    )}
                </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-slate-500 text-right">
                Source: {data.source} • Updated: {new Date().toLocaleString()}
            </div>
        </div>
    );
}

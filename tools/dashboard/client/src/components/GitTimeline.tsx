import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, GitCommit, GitBranch, Clock } from 'lucide-react';

interface TimelineDay {
    date: string;
    features: string[];
    commitCount: number;
    commits: {
        hash: string;
        message: string;
        date: string;
        author: string;
        type: string;
    }[];
}

export function GitTimeline() {
    const [timeline, setTimeline] = useState<TimelineDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const res = await axios.get('/api/git/timeline?days=14');
                setTimeline(res.data);
            } catch (error) {
                console.error('Failed to fetch timeline:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTimeline();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) return 'Today';
        if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature': return 'badge-purple';
            case 'bugfix': return 'badge-red';
            case 'docs': return 'badge-blue';
            case 'refactor': return 'badge-yellow';
            default: return 'badge-green';
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Active Days</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{timeline.length}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <GitCommit className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">Total Commits</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">
                        {timeline.reduce((sum, day) => sum + day.commitCount, 0)}
                    </p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <GitBranch className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Features Shipped</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">
                        {new Set(timeline.flatMap(d => d.features)).size}
                    </p>
                </div>
            </div>

            {/* Timeline */}
            <div className="card">
                <h3 className="card-header">Commit Timeline (Last 14 Days)</h3>
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />

                    <div className="space-y-6">
                        {timeline.map((day) => (
                            <div key={day.date} className="relative pl-10">
                                {/* Dot */}
                                <div className="absolute left-2.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-800" />

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
                                                    <span className={`badge ${getTypeColor(commit.type)} flex-shrink-0`}>
                                                        {commit.type}
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, Zap, ArrowUp, RefreshCw } from 'lucide-react';

interface Suggestion {
    id: string;
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    effort: string;
    score: number;
    reasoning: string;
}

interface SuggestionsData {
    suggestions: Suggestion[];
    totalPending: number;
    analysis: {
        quickWins: number;
        highImpact: number;
    };
}

export function PrioritySuggestions() {
    const [data, setData] = useState<SuggestionsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                const res = await axios.get('/api/suggestions?limit=3');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSuggestions();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">What to Build Next</h3>
                </div>
                <div className="flex items-center justify-center h-32">
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    if (!data?.suggestions?.length) {
        return (
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">What to Build Next</h3>
                </div>
                <p className="text-slate-500 text-sm">No suggestions available</p>
            </div>
        );
    }

    const priorityColors = {
        high: 'text-red-400',
        medium: 'text-amber-400',
        low: 'text-blue-400'
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">What to Build Next</h3>
                </div>
                {data.analysis && (
                    <div className="flex gap-2">
                        {data.analysis.quickWins > 0 && (
                            <span className="badge badge-green flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {data.analysis.quickWins} Quick Wins
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {data.suggestions.map((s, idx) => (
                    <div
                        key={s.id}
                        className={`p-3 rounded-lg ${idx === 0 ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-slate-800/50'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {idx === 0 && (
                                        <span className="text-xs font-medium text-purple-400">TOP PICK</span>
                                    )}
                                    <span className="font-mono text-xs text-slate-500">{s.id}</span>
                                </div>
                                <p className="font-medium text-slate-200 text-sm">{s.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs ${priorityColors[s.priority]}`}>
                                        {s.priority.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-500">•</span>
                                    <span className="text-xs text-slate-400">{s.reasoning}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400">
                                <ArrowUp className="w-3 h-3" />
                                <span className="text-sm font-medium">{s.score}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrioritySuggestions;

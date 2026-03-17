import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { PrioritySuggestion, SuggestionStats } from './bugPrioritySuggestions.types';
import { getConfidenceBadge, getConfidenceIcon, getPriorityBadge } from './bugPrioritySuggestions.helpers';

export function BugPrioritySuggestions() {
    const [suggestions, setSuggestions] = useState<PrioritySuggestion[]>([]);
    const [stats, setStats] = useState<SuggestionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/bugs/priority-suggestions');
            setSuggestions(res.data.suggestions);
            setStats(res.data.stats);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch priority suggestions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <span>Analyzing bugs...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-red-500/50">
                <div className="flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                        <p className="font-medium">Failed to load priority suggestions</p>
                        <p className="text-sm text-red-400/70">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Total Bugs</p>
                                <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
                            </div>
                            <Sparkles className="w-8 h-8 text-purple-400/50" />
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Needs Review</p>
                                <p className="text-3xl font-bold text-red-400">{stats.needsReview}</p>
                                <p className="text-xs text-slate-500">Priority mismatch</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-red-400/50" />
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">High Confidence</p>
                                <p className="text-3xl font-bold text-emerald-400">{stats.byConfidence.high || 0}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-400/50" />
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Critical (P0)</p>
                                <p className="text-3xl font-bold text-blue-400">{stats.byPriority.P0 || 0}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-400/50" />
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Priority Suggestions
                </h3>

                {suggestions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                        No bugs found in KNOWN_ISSUES.md. Add bugs to get priority suggestions.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {suggestions.map((suggestion, i) => (
                            <div
                                key={i}
                                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-mono text-slate-500">{suggestion.bugId}</span>
                                            {suggestion.currentPriority && getPriorityBadge(suggestion.currentPriority)}
                                            <span className="text-slate-600">→</span>
                                            {getPriorityBadge(suggestion.suggestedPriority)}
                                            {getConfidenceBadge(suggestion.confidence)}
                                        </div>
                                        <p className="text-sm text-slate-300">{suggestion.bugText.substring(0, 150)}...</p>
                                    </div>
                                    <div className="ml-4">
                                        {getConfidenceIcon(suggestion.confidence)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">Score:</span>
                                        <span className="text-slate-400">{suggestion.score}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">Env:</span>
                                        <span className="text-slate-400">{suggestion.reasoning.environment}</span>
                                    </div>
                                    {suggestion.reasoning.keywords.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">Keywords:</span>
                                            <span className="text-slate-400">{suggestion.reasoning.keywords.slice(0, 3).join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                {suggestion.currentPriority && suggestion.currentPriority !== suggestion.suggestedPriority && (
                                    <div className="mt-3 p-2 bg-amber-900/20 border border-amber-500/30 rounded text-xs text-amber-400">
                                        ⚠️ Suggested priority differs from current. Consider reviewing this bug.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

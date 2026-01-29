// @ts-nocheck
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Clock, Target, Calendar, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VelocityStats {
    currentVelocity: number;
    averageCycleTime: number | null;
    totalCompletions: number;
    weeklyStats: Array<{
        week: string;
        completed: number;
        velocity: number;
    }>;
    recentCompletions: Array<{
        itemId: string;
        completedDate: string;
        cycleTime: number | null;
    }>;
}

export function VelocityDashboard() {
    const [stats, setStats] = useState<VelocityStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingItems, setRemainingItems] = useState(10);
    const [prediction, setPrediction] = useState<any>(null);

    useEffect(() => {
        fetchVelocityStats();
    }, []);

    const fetchVelocityStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/velocity/stats');
            setStats(res.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch velocity stats');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoDetect = async () => {
        try {
            const res = await axios.post('/api/velocity/auto-detect');
            if (res.data.newCompletions > 0) {
                alert(`Auto-detected ${res.data.newCompletions} new completions!`);
                fetchVelocityStats();
            } else {
                alert('No new completions detected.');
            }
        } catch {
            alert('Failed to auto-detect completions');
        }
    };

    const handlePredict = async () => {
        try {
            const res = await axios.post('/api/velocity/predict', { remainingItems });
            setPrediction(res.data);
        } catch {
            alert('Failed to predict completion date');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <Activity className="w-6 h-6 animate-spin" />
                    <span>Loading velocity data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-red-500/50">
                <div className="flex items-center gap-3 text-red-400">
                    <span className="font-medium">Failed to load velocity data</span>
                    <span className="text-sm text-red-400/70">{error}</span>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    // Prepare chart data
    const chartData = stats.weeklyStats.map(w => ({
        week: w.week.replace('2026-W', 'W'),
        completed: w.completed,
        velocity: w.velocity
    }));

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Current Velocity */}
                <div className="card bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Current Velocity</p>
                            <p className="text-3xl font-bold text-emerald-400">{stats.currentVelocity}</p>
                            <p className="text-xs text-slate-500">items/week</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-emerald-400/50" />
                    </div>
                </div>

                {/* Average Cycle Time */}
                <div className="card bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Avg Cycle Time</p>
                            <p className="text-3xl font-bold text-blue-400">
                                {stats.averageCycleTime !== null ? stats.averageCycleTime : '—'}
                            </p>
                            <p className="text-xs text-slate-500">days</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-400/50" />
                    </div>
                </div>

                {/* Total Completions */}
                <div className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Completions</p>
                            <p className="text-3xl font-bold text-purple-400">{stats.totalCompletions}</p>
                            <p className="text-xs text-slate-500">all time</p>
                        </div>
                        <Target className="w-8 h-8 text-purple-400/50" />
                    </div>
                </div>

                {/* Prediction */}
                <div className="card bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Predicted ETA</p>
                            {prediction ? (
                                <>
                                    <p className="text-xl font-bold text-orange-400">{prediction.weeksRemaining}w</p>
                                    <p className="text-xs text-slate-500">{prediction.date}</p>
                                </>
                            ) : (
                                <p className="text-sm text-slate-500">Calculate below</p>
                            )}
                        </div>
                        <Calendar className="w-8 h-8 text-orange-400/50" />
                    </div>
                </div>
            </div>

            {/* Velocity Chart */}
            <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Velocity Trend (Last 12 Weeks)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Items Completed" />
                        <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={2} name="Velocity (4-week avg)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Completion Prediction */}
            <div className="card">
                <h3 className="text-lg font-bold text-white mb-4">Completion Prediction</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-2">Remaining Items</label>
                        <input
                            type="number"
                            value={remainingItems}
                            onChange={(e) => setRemainingItems(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            min="1"
                        />
                    </div>
                    <button
                        onClick={handlePredict}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors mt-6"
                    >
                        Predict
                    </button>
                </div>
                {prediction && (
                    <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                        <p className="text-emerald-400 font-medium">
                            Estimated completion: <span className="text-white">{prediction.date}</span>
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {prediction.weeksRemaining} weeks ({prediction.daysRemaining} days) at current velocity of {stats.currentVelocity} items/week
                        </p>
                    </div>
                )}
            </div>

            {/* Recent Completions */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Completions</h3>
                    <button
                        onClick={handleAutoDetect}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors"
                    >
                        Auto-Detect from ROADMAP
                    </button>
                </div>
                <div className="space-y-2">
                    {stats.recentCompletions.length > 0 ? (
                        stats.recentCompletions.map((completion, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-emerald-400">{completion.itemId}</span>
                                    <span className="text-sm text-slate-400">{completion.completedDate}</span>
                                </div>
                                {completion.cycleTime !== null && (
                                    <span className="text-sm text-blue-400">{completion.cycleTime} days</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">
                            No completions tracked yet. Click "Auto-Detect" to populate from ROADMAP.md
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Activity, Clock } from 'lucide-react';
import type { KanbanData, VelocityStatsSummary } from './enterpriseKanban.types';

interface EnterpriseKanbanStatsBarProps {
    stats: KanbanData['stats'];
    velocityStats: VelocityStatsSummary | null;
}

export function EnterpriseKanbanStatsBar({ stats, velocityStats }: EnterpriseKanbanStatsBarProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
            <div className="card bg-slate-800/50">
                <p className="text-xs text-slate-500">Total Items</p>
                <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
            </div>
            <div className="card bg-red-900/20 border-red-500/30">
                <p className="text-xs text-red-400">Critical Bugs</p>
                <p className="text-2xl font-bold text-red-400">{stats.criticalBugs}</p>
            </div>
            <div className="card bg-amber-900/20 border-amber-500/30">
                <p className="text-xs text-amber-400">Total Bugs</p>
                <p className="text-2xl font-bold text-amber-400">{stats.totalBugs}</p>
            </div>
            <div className="card bg-purple-900/20 border-purple-500/30">
                <p className="text-xs text-purple-400">Features</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalFeatures}</p>
            </div>
            <div className="card bg-blue-900/20 border-blue-500/30">
                <p className="text-xs text-blue-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">
                    {stats.inProgressCount}
                    {stats.wipExceeded && <span className="text-xs text-red-400 ml-1">!</span>}
                </p>
            </div>
            <div className="card bg-emerald-900/20 border-emerald-500/30">
                <p className="text-xs text-emerald-400">Completed</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.completedThisWeek}</p>
            </div>
            <div className="card bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                <div className="flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <p className="text-xs text-cyan-400">Velocity</p>
                </div>
                <p className="text-2xl font-bold text-cyan-400">
                    {velocityStats?.currentVelocity?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-slate-500">items/week</p>
            </div>
            <div className="card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
                <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <p className="text-xs text-indigo-400">Cycle Time</p>
                </div>
                <p className="text-2xl font-bold text-indigo-400">
                    {velocityStats?.averageCycleTime?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-slate-500">days avg</p>
            </div>
        </div>
    );
}

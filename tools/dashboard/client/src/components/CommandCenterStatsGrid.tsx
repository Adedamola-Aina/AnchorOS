import { Activity, Bug, CheckCircle, Clock, Package, TrendingUp } from 'lucide-react';
import type { CommandCenterData } from './commandCenter.types';

interface CommandCenterStatsGridProps {
    work: CommandCenterData['work'];
    dependencies: CommandCenterData['dependencies'];
    codeHealth: CommandCenterData['codeHealth'];
}

export function CommandCenterStatsGrid({ work, dependencies, codeHealth }: CommandCenterStatsGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="card bg-emerald-900/20 border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Done This Week</span>
                </div>
                <p className="text-3xl font-bold text-emerald-400">{work.completedThisWeek}</p>
            </div>

            <div className="card bg-blue-900/20 border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400">In Progress</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{work.inProgress}</p>
            </div>

            <div className="card bg-purple-900/20 border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400">Velocity</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">{work.velocity}/wk</p>
            </div>

            <div className="card bg-cyan-900/20 border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-cyan-400">Cycle Time</span>
                </div>
                <p className="text-3xl font-bold text-cyan-400">{work.cycleTime}d</p>
            </div>

            <div className="card bg-amber-900/20 border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400">Outdated Deps</span>
                </div>
                <p className="text-3xl font-bold text-amber-400">{dependencies.outdated}</p>
            </div>

            <div className="card bg-red-900/20 border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Critical Bugs</span>
                </div>
                <p className="text-3xl font-bold text-red-400">{work.details.stats.criticalBugs}</p>
            </div>

            <div className="card bg-orange-900/20 border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-400">ARCH Exceeding</span>
                </div>
                <p className="text-3xl font-bold text-orange-400">{codeHealth.exceeding}</p>
            </div>

            <div className="card bg-sky-900/20 border-sky-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span className="text-xs text-sky-400">ARCH Approaching</span>
                </div>
                <p className="text-3xl font-bold text-sky-400">{codeHealth.approaching}</p>
            </div>
        </div>
    );
}

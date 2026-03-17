// @ts-nocheck
import { CheckCircle, Clock, TrendingUp, Bug, GitCommit, Target, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { PrioritySuggestions } from './PrioritySuggestions';
import { DependencyHealth } from './DependencyHealth';
import { ProactiveAlerts } from './ProactiveAlerts';
import { BugDetailModal } from './BugDetailModal';
import type { BugItem, SummaryProps } from './dashboardSummary.types';

export function DashboardSummary({ summary, onNavigateToTab }: SummaryProps) {
    const [selectedBug, setSelectedBug] = useState<BugItem | null>(null);

    if (!summary) return null;

    const { projectStatus, criteriaProgress, bugs, kanban, parity, git } = summary;

    // Calculate sprint progress from kanban
    const totalTasks = kanban
        ? kanban.backlog.length + kanban.todo.length + kanban.inProgress.length + kanban.done.length
        : 0;
    const completedTasks = kanban?.done.length || 0;
    const kanbanProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Use criteria progress from roadmap (more accurate for current focus)
    const progressPercent = criteriaProgress ?? kanbanProgress;

    return (
        <div className="space-y-6">
            {/* Current Focus Banner */}
            {projectStatus?.currentFocus && (
                <div className="card bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Target className="w-6 h-6 text-emerald-400" />
                            <div>
                                <h2 className="text-lg font-bold text-white">{projectStatus.currentFocus}</h2>
                                <p className="text-sm text-emerald-300/70">Current Sprint Focus</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-emerald-400">{progressPercent}%</div>
                            <div className="text-xs text-slate-400">Complete</div>
                        </div>
                    </div>

                    {/* Success Criteria Checklist */}
                    {projectStatus.successCriteria?.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Success Criteria ({projectStatus.successCriteria.filter(c => c.status === 'done').length}/{projectStatus.successCriteria.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {projectStatus.successCriteria.map((criteria, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer
                                            ${criteria.status === 'done'
                                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                                                : 'bg-slate-700/50 hover:bg-slate-700'}`}
                                    >
                                        {criteria.status === 'done' ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm ${criteria.status === 'done' ? 'text-emerald-200' : 'text-slate-300'}`}>
                                            {criteria.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sprint Progress */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="card-header mb-0">Kanban Progress</span>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{kanbanProgress}%</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${kanbanProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {completedTasks} of {totalTasks} tasks completed
                    </p>
                </div>

                {/* Active Bugs */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="card-header mb-0">Active Bugs</span>
                        <Bug className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {bugs?.statistics?.totalActive || '0'}
                    </div>
                    <div className="flex gap-2">
                        <span className="badge badge-red">
                            {bugs?.statistics?.critical || '0'} Critical
                        </span>
                        <span className="badge badge-green">
                            {bugs?.statistics?.fixedThisMonth || '0'} Fixed
                        </span>
                    </div>
                </div>

                {/* Environment Parity - Clickable */}
                <button
                    onClick={() => onNavigateToTab?.('parity')}
                    className="card text-left hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="card-header mb-0">Env Parity</span>
                        <div className="flex items-center gap-2">
                            <GitCommit className="w-5 h-5 text-blue-400" />
                            <ExternalLink className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Dev Only</span>
                            <span className="text-amber-400 font-medium">{parity?.devOnly || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Staging Pending</span>
                            <span className="text-blue-400 font-medium">{parity?.stagingPending || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Fully Deployed</span>
                            <span className="text-emerald-400 font-medium">{parity?.fullyDeployed || 0}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 group-hover:text-blue-400 transition-colors">
                        Click for details →
                    </p>
                </button>

                {/* Git Status */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3">
                        <span className="card-header mb-0">Git Status</span>
                        {git?.isClean ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                            <Clock className="w-5 h-5 text-amber-400" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-purple">{git?.branch || 'unknown'}</span>
                            {git?.isClean && <span className="badge badge-green">Clean</span>}
                        </div>
                        {git?.lastCommit && (
                            <p className="text-xs text-slate-400 truncate" title={git.lastCommit.message}>
                                <span className="font-mono text-slate-500">{git.lastCommit.hash}</span>
                                {' '}{git.lastCommit.message.substring(0, 30)}...
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Smart Automation Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PrioritySuggestions />
                <DependencyHealth />
                <ProactiveAlerts />
            </div>

            {selectedBug && <BugDetailModal bug={selectedBug} onClose={() => setSelectedBug(null)} />}
        </div>
    );
}

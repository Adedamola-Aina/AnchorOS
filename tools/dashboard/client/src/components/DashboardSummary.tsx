import { CheckCircle, XCircle, Clock, TrendingUp, Bug, GitCommit, Target, ChevronRight, Wrench, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface BugItem {
    id: string;
    title: string;
    content?: string;
}

interface SummaryProps {
    summary: {
        projectStatus?: {
            currentFocus: string;
            successCriteria: { text: string; status: string }[];
            inProgress: { text: string; status: string }[];
            completed: { text: string; status: string }[];
            criticalBugs: { id: string; description: string }[];
        };
        criteriaProgress?: number;
        bugs?: {
            statistics: {
                totalActive: string;
                critical: string;
                fixedThisMonth: string;
            };
            critical?: BugItem[];
            recentlyFixed?: BugItem[];
        };
        kanban?: {
            backlog: unknown[];
            todo: unknown[];
            inProgress: unknown[];
            done: unknown[];
        };
        parity?: {
            total: number;
            devOnly: number;
            stagingPending: number;
            fullyDeployed: number;
        };
        git?: {
            branch: string;
            isClean: boolean;
            lastCommit: { hash: string; message: string; date: string };
        };
        lastRefresh: string;
    } | null;
    onNavigateToTab?: (tab: string) => void;
}

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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* In Progress */}
                <div className="card">
                    <h3 className="card-header flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        In Progress
                    </h3>
                    <div className="space-y-2">
                        {projectStatus?.inProgress?.length ? (
                            projectStatus.inProgress.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                    <span className="text-slate-300">{item.text}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No items in progress</p>
                        )}
                    </div>
                </div>

                {/* Recently Completed */}
                <div className="card">
                    <h3 className="card-header flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Recently Completed
                    </h3>
                    <div className="space-y-2">
                        {projectStatus?.completed?.length ? (
                            projectStatus.completed.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-300">{item.text}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No recent completions</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Critical Bugs - Clickable */}
            {(projectStatus?.criticalBugs?.length ?? 0) > 0 && (
                <div className="card border-red-500/30">
                    <h3 className="card-header flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        Critical Bugs ({projectStatus?.criticalBugs?.length})
                    </h3>
                    <div className="space-y-2">
                        {bugs?.critical?.map((bug, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedBug(bug)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="badge badge-red">{bug.id}</span>
                                    <span className="text-slate-300">{bug.title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                            </button>
                        )) || projectStatus?.criticalBugs?.map((bug, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm p-2">
                                <span className="badge badge-red">{bug.id}</span>
                                <span className="text-slate-300">{bug.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recently Fixed Bugs */}
            {(bugs?.recentlyFixed?.length ?? 0) > 0 && (
                <div className="card border-emerald-500/30">
                    <h3 className="card-header flex items-center gap-2 text-emerald-400">
                        <Wrench className="w-4 h-4" />
                        Recently Fixed ({bugs?.recentlyFixed?.length})
                    </h3>
                    <div className="space-y-2">
                        {bugs?.recentlyFixed?.map((bug, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedBug(bug)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="badge badge-green">{bug.id}</span>
                                    <span className="text-slate-300">{bug.title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bug Detail Modal */}
            {selectedBug && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBug(null)}>
                    <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className={`badge ${selectedBug.id.startsWith('BUG') ? 'badge-red' : 'badge-green'}`}>
                                    {selectedBug.id}
                                </span>
                                <h4 className="text-lg font-bold text-white">{selectedBug.title}</h4>
                            </div>
                            <button onClick={() => setSelectedBug(null)} className="text-slate-400 hover:text-white p-2">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {selectedBug.content ? (
                                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded-lg">
                                    {selectedBug.content}
                                </pre>
                            ) : (
                                <p className="text-slate-400">No additional details available.</p>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-700 flex justify-end">
                            <button
                                onClick={() => setSelectedBug(null)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

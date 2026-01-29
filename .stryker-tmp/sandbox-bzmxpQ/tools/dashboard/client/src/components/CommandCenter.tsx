// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Activity,
    Package, RefreshCw,
    Bug, ArrowRight, Shield, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';

interface Alert {
    type: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    action: string;
    source: string;
    date: string;
    details?: { path?: string; lines?: number; name?: string; current?: string; latest?: string; status?: string }[];
}

interface WorkItem {
    id: string;
    title: string;
    type: string;
    date?: string;
    priority?: string;
    status?: string;
}

interface CommandCenterData {
    generatedAt: string;
    date: string;
    alerts: {
        count: number;
        critical: number;
        warning: number;
        info: number;
        items: Alert[];
    };
    work: {
        completedThisWeek: number;
        inProgress: number;
        upcoming: number;
        velocity: number;
        cycleTime: number;
        details: {
            doneThisWeek: WorkItem[];
            inProgress: WorkItem[];
            upcoming: WorkItem[];
            stats: {
                totalItems: number;
                totalBugs: number;
                criticalBugs: number;
                totalFeatures: number;
            };
        };
    };
    environments: {
        versions: { production: string; staging: string; development: string };
        parity: { devOnly: number; stagingPending: number; synced: boolean };
        lastDeployment: string | null;
        history: { date: string; version: string; environment: string; changes: string }[];
    };
    dependencies: {
        status: string;
        outdated: number;
        vulnerabilities: number;
        lastChecked: string;
    };
    gitActivity: {
        last7Days: { date: string; commits: number; features: number }[];
    };
}

interface CommandCenterProps {
    onNavigate?: (tab: string) => void;
}

export function CommandCenter({ onNavigate }: CommandCenterProps) {
    const [data, setData] = useState<CommandCenterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set());

    const toggleExpanded = (idx: number) => {
        setExpandedAlerts(prev => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/command-center');
            setData(res.data);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to fetch command center data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="card text-red-400">Failed to load command center</div>;
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-900/30 border-red-500/50';
            case 'warning':
                return 'bg-amber-900/30 border-amber-500/50';
            default:
                return 'bg-blue-900/30 border-blue-500/50';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    Command Center
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Single source of truth • Updated {lastRefresh?.toLocaleTimeString() || 'just now'}
                </p>
            </div>

            {/* Proactive Alerts */}
            {data.alerts.count > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Needs Attention ({data.alerts.count})
                    </h3>
                    <div className="grid gap-3">
                        {data.alerts.items.map((alert, idx) => {
                            const getTargetTab = (type: string) => {
                                switch (type) {
                                    case 'critical_bug':
                                    case 'stale_bug':
                                        return 'kanban';
                                    case 'env_drift':
                                        return 'parity';
                                    case 'arch_violation':
                                        return 'docs';
                                    default:
                                        return null;
                                }
                            };
                            const targetTab = getTargetTab(alert.type);
                            return (
                                <div
                                    key={idx}
                                    className={`w-full text-left p-4 rounded-lg border ${getSeverityStyle(alert.severity)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getSeverityIcon(alert.severity)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-white">{alert.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">{alert.date}</span>
                                                    {targetTab && (
                                                        <button
                                                            onClick={() => onNavigate?.(targetTab)}
                                                            className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-emerald-400 transition-colors"
                                                        >
                                                            View →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Show details inline */}
                                            {alert.details && alert.details.length > 0 ? (
                                                <div className="mt-2 space-y-1">
                                                    {alert.type === 'arch_violation' && (() => {
                                                        const isExpanded = expandedAlerts.has(idx);
                                                        const visibleItems = isExpanded ? alert.details : alert.details!.slice(0, 3);
                                                        const hiddenCount = alert.details!.length - 3;
                                                        return (
                                                            <>
                                                                {visibleItems!.map((d, i) => (
                                                                    <div key={i} className="flex items-center justify-between text-xs bg-slate-800/50 px-2 py-1 rounded">
                                                                        <span className="text-slate-300 font-mono truncate">{d.path}</span>
                                                                        <span className={`font-medium ${d.status === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                                                                            {d.lines} lines
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                                {hiddenCount > 0 && (
                                                                    <button
                                                                        onClick={() => toggleExpanded(idx)}
                                                                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mt-1"
                                                                    >
                                                                        {isExpanded ? (
                                                                            <><ChevronUp className="w-3 h-3" /> Show less</>
                                                                        ) : (
                                                                            <><ChevronDown className="w-3 h-3" /> +{hiddenCount} more</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                    {alert.type === 'deps_outdated' && (() => {
                                                        const isExpanded = expandedAlerts.has(idx);
                                                        const visibleItems = isExpanded ? alert.details : alert.details!.slice(0, 3);
                                                        const hiddenCount = alert.details!.length - 3;
                                                        return (
                                                            <>
                                                                {visibleItems!.map((d, i) => (
                                                                    <div key={i} className="flex items-center justify-between text-xs bg-slate-800/50 px-2 py-1 rounded">
                                                                        <span className="text-slate-300 font-mono">{d.name}</span>
                                                                        <span className="text-slate-400">
                                                                            <span className="text-red-400">{d.current}</span>
                                                                            <span className="mx-1">→</span>
                                                                            <span className="text-emerald-400">{d.latest}</span>
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                                {hiddenCount > 0 && (
                                                                    <button
                                                                        onClick={() => toggleExpanded(idx)}
                                                                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mt-1"
                                                                    >
                                                                        {isExpanded ? (
                                                                            <><ChevronUp className="w-3 h-3" /> Show less</>
                                                                        ) : (
                                                                            <><ChevronDown className="w-3 h-3" /> +{hiddenCount} more</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                                            )}
                                            
                                            <div className="flex items-center gap-4 mt-2 text-xs">
                                                <span className="text-slate-500">Source: {alert.source}</span>
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <ArrowRight className="w-3 h-3" />
                                                    {alert.action}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="card bg-emerald-900/20 border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Done This Week</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{data.work.completedThisWeek}</p>
                </div>

                <div className="card bg-blue-900/20 border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-blue-400">In Progress</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{data.work.inProgress}</p>
                </div>

                <div className="card bg-purple-900/20 border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-purple-400">Velocity</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{data.work.velocity}/wk</p>
                </div>

                <div className="card bg-cyan-900/20 border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-400">Cycle Time</span>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{data.work.cycleTime}d</p>
                </div>

                <div className="card bg-amber-900/20 border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-400">Outdated Deps</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{data.dependencies.outdated}</p>
                </div>

                <div className="card bg-red-900/20 border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Bug className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">Critical Bugs</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{data.work.details.stats.criticalBugs}</p>
                </div>
            </div>


        </div>
    );
}

export default CommandCenter;

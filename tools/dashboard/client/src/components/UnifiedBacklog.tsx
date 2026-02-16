// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    RefreshCw, CheckCircle, Clock, AlertCircle, GitCommit,
    ChevronDown, ChevronRight, Target, Users, Zap, Shield,
    Database, Server, TestTube, Smartphone, Palette, Lightbulb,
    BarChart3, Megaphone, Search, GitBranch, Layers
} from 'lucide-react';

// ============ Types ============
interface Initiative {
    id: string;
    team: string;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    title: string;
    description: string;
    status: 'planned' | 'in-progress' | 'completed';
    effort: 'small' | 'medium' | 'large';
    impact: 'low' | 'medium' | 'high' | 'critical';
    detectedFromGit?: boolean;
    matchedCommits?: { hash: string; message: string; date: string }[];
    completedAt?: string;
}

interface RoadmapData {
    source: string;
    summary: { total: number; completed: number; inProgress: number; planned: number; autoDetected: number };
    teams: string[];
    initiatives: Initiative[];
}

interface GitItem {
    id: string;
    type: string;
    title: string;
    hash: string;
    date: string;
    status: 'dev' | 'staging' | 'deployed';
    environments: { dev: boolean; staging: boolean; production: boolean };
}

interface BacklogData {
    source: string;
    completed: GitItem[];
    inProgress: GitItem[];
    pending: GitItem[];
    summary: { total: number; completed: number; inProgress: number; pending: number };
}

// ============ Component ============
export function UnifiedBacklog() {
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [gitBacklog, setGitBacklog] = useState<BacklogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'roadmap' | 'git'>('roadmap');
    const [groupBy, setGroupBy] = useState<'priority' | 'team' | 'status'>('priority');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTeam, setFilterTeam] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const [roadmapRes, backlogRes] = await Promise.all([
                    axios.get('/api/git/roadmap'),
                    axios.get('/api/git/backlog')
                ]);
                setRoadmap(roadmapRes.data);
                setGitBacklog(backlogRes.data);
            } catch (error) {
                console.error('Failed to fetch backlog data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!roadmap && !gitBacklog) {
        return <div className="card text-red-400">Failed to load backlog data</div>;
    }

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedItems);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        setExpandedItems(newSet);
    };

    const getTeamIcon = (team: string) => {
        const t = team.toLowerCase();
        if (t === 'product') return <Target className="w-4 h-4" />;
        if (t === 'engineering') return <Zap className="w-4 h-4" />;
        if (t === 'architecture') return <Server className="w-4 h-4" />;
        if (t === 'security' || t === 'auth') return <Shield className="w-4 h-4" />;
        if (t === 'database') return <Database className="w-4 h-4" />;
        if (t === 'qa') return <TestTube className="w-4 h-4" />;
        if (t === 'mobile' || t === 'platform') return <Smartphone className="w-4 h-4" />;
        if (t === 'design') return <Palette className="w-4 h-4" />;
        if (t === 'innovation') return <Lightbulb className="w-4 h-4" />;
        if (t === 'data') return <BarChart3 className="w-4 h-4" />;
        if (t === 'marketing') return <Megaphone className="w-4 h-4" />;
        return <Users className="w-4 h-4" />;
    };

    const getPriorityColor = (p: string) => {
        if (p === 'P0') return 'bg-red-500/20 text-red-400 border-red-500/50';
        if (p === 'P1') return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
        if (p === 'P2') return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    };

    const getStatusIcon = (status: string, detected?: boolean) => {
        if (status === 'completed' || status === 'deployed') {
            return detected
                ? <span title="Auto-detected from git"><CheckCircle className="w-4 h-4 text-emerald-400" /></span>
                : <CheckCircle className="w-4 h-4 text-emerald-500" />;
        }
        if (status === 'in-progress' || status === 'staging') {
            return <Clock className="w-4 h-4 text-blue-400" />;
        }
        return <AlertCircle className="w-4 h-4 text-slate-500" />;
    };

    // ============ Roadmap View ============
    const renderRoadmapView = () => {
        if (!roadmap) return null;

        const filtered = roadmap.initiatives.filter(item => {
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (filterTeam !== 'all' && item.team !== filterTeam) return false;
            if (filterStatus !== 'all' && item.status !== filterStatus) return false;
            return true;
        });

        const groups: Record<string, Initiative[]> = {};
        filtered.forEach(item => {
            const key = item[groupBy];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        const order = groupBy === 'priority' ? ['P0', 'P1', 'P2', 'P3']
            : groupBy === 'status' ? ['in-progress', 'planned', 'completed']
                : roadmap.teams;

        const completionPct = Math.round((roadmap.summary.completed / roadmap.summary.total) * 100);

        return (
            <>
                {/* Stats */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="card bg-slate-800/50 py-3">
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="text-xl font-bold text-white">{roadmap.summary.total}</p>
                    </div>
                    <div
                        className="card bg-emerald-900/20 border-emerald-500/30 py-3 cursor-pointer hover:bg-emerald-900/40 transition-colors"
                        onClick={() => setFilterStatus(filterStatus === 'completed' ? 'all' : 'completed')}
                        title="Click to filter completed items"
                    >
                        <p className="text-xs text-emerald-400">Completed {filterStatus === 'completed' && '✓'}</p>
                        <p className="text-xl font-bold text-emerald-400">{roadmap.summary.completed}</p>
                    </div>
                    <div
                        className="card bg-slate-700/30 py-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                        onClick={() => setFilterStatus(filterStatus === 'planned' ? 'all' : 'planned')}
                        title="Click to filter planned items"
                    >
                        <p className="text-xs text-slate-400">Planned {filterStatus === 'planned' && '✓'}</p>
                        <p className="text-xl font-bold text-slate-300">{roadmap.summary.planned}</p>
                    </div>
                    <div className="card bg-purple-900/20 border-purple-500/30 py-3">
                        <p className="text-xs text-purple-400">Auto-Detected</p>
                        <p className="text-xl font-bold text-purple-400">{roadmap.summary.autoDetected}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30 py-3 col-span-2">
                        <p className="text-xs text-cyan-400">Progress</p>
                        <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-cyan-400">{completionPct}%</p>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${completionPct}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group By Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Group by:</span>
                    {(['priority', 'team', 'status'] as const).map(mode => (
                        <button
                            key={mode}
                            onClick={() => setGroupBy(mode)}
                            className={`px-3 py-1 rounded text-sm ${groupBy === mode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Grouped Items */}
                {order.filter(k => groups[k]?.length > 0).map(groupKey => (
                    <div key={groupKey} className="card">
                        <div className="flex items-center gap-2 mb-3">
                            {groupBy === 'priority' && <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getPriorityColor(groupKey)}`}>{groupKey}</span>}
                            {groupBy === 'team' && getTeamIcon(groupKey)}
                            {groupBy === 'status' && getStatusIcon(groupKey)}
                            <h3 className="font-bold text-white capitalize">{groupKey}</h3>
                            <span className="text-sm text-slate-500">({groups[groupKey].length})</span>
                        </div>
                        <div className="space-y-1">
                            {groups[groupKey].map(item => (
                                <div key={item.id} className="bg-slate-800/50 rounded border border-slate-700/50">
                                    <div className="p-2 flex items-center gap-2 cursor-pointer hover:bg-slate-800/80 text-sm" onClick={() => toggleExpand(item.id)}>
                                        {expandedItems.has(item.id) ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                                        {getStatusIcon(item.status, item.detectedFromGit)}
                                        <span className="text-xs font-mono text-slate-500">{item.id}</span>
                                        {groupBy !== 'priority' && <span className={`px-1.5 py-0.5 text-xs rounded border ${getPriorityColor(item.priority)}`}>{item.priority}</span>}
                                        {groupBy !== 'team' && <span className="text-xs text-slate-500 flex items-center gap-1">{getTeamIcon(item.team)}</span>}
                                        <span className="flex-1 text-slate-200">{item.title}</span>
                                        {item.detectedFromGit && <span className="px-1.5 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">Auto</span>}
                                    </div>
                                    {expandedItems.has(item.id) && (
                                        <div className="px-8 pb-2 text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                                            <p>{item.description}</p>
                                            <div className="flex gap-4 mt-1 text-slate-500">
                                                <span>Effort: {item.effort}</span>
                                                <span>Impact: {item.impact}</span>
                                                {item.completedAt && <span className="text-emerald-400">Completed: {item.completedAt}</span>}
                                            </div>
                                            {item.matchedCommits?.length && (
                                                <div className="mt-1 space-y-0.5">
                                                    {item.matchedCommits.slice(0, 2).map((c, i) => (
                                                        <div key={i} className="flex items-center gap-1 text-purple-400">
                                                            <GitCommit className="w-3 h-3" />
                                                            <span className="font-mono">{c.hash.slice(0, 7)}</span>
                                                            <span className="text-slate-500 truncate">{c.message}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </>
        );
    };

    // ============ Git Backlog View ============
    const renderGitView = () => {
        if (!gitBacklog) return null;

        const getTypeColor = (type: string) => {
            if (type === 'feature') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            if (type === 'enhancement' || type === 'ux') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            if (type === 'bug') return 'bg-red-500/20 text-red-400 border-red-500/30';
            if (type === 'architecture') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        };

        const allItems = [...gitBacklog.inProgress, ...gitBacklog.pending, ...gitBacklog.completed].filter(item => {
            if (searchQuery) {
                return item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });

        return (
            <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="card bg-amber-900/20 border-amber-500/30">
                        <p className="text-xs text-amber-400">Dev Only</p>
                        <p className="text-2xl font-bold text-amber-400">{gitBacklog.summary.pending}</p>
                    </div>
                    <div className="card bg-blue-900/20 border-blue-500/30">
                        <p className="text-xs text-blue-400">In Staging</p>
                        <p className="text-2xl font-bold text-blue-400">{gitBacklog.summary.inProgress}</p>
                    </div>
                    <div className="card bg-emerald-900/20 border-emerald-500/30">
                        <p className="text-xs text-emerald-400">Deployed</p>
                        <p className="text-2xl font-bold text-emerald-400">{gitBacklog.summary.completed}</p>
                    </div>
                </div>

                {/* Items List */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                        <GitBranch className="w-4 h-4 text-slate-400" />
                        <h3 className="font-bold text-white">Git Activity ({allItems.length})</h3>
                    </div>
                    <div className="space-y-1 max-h-[500px] overflow-y-auto">
                        {allItems.map(item => (
                            <div key={item.id + item.hash} className="p-2 bg-slate-800/50 rounded border border-slate-700/50 flex items-center gap-2 text-sm">
                                {getStatusIcon(item.status)}
                                <span className={`px-1.5 py-0.5 text-xs rounded border ${getTypeColor(item.type)}`}>{item.type}</span>
                                <span className="text-xs font-mono text-slate-500">{item.id}</span>
                                <span className="flex-1 text-slate-200 truncate">{item.title}</span>
                                <span className="text-xs text-slate-500 font-mono">{item.hash.slice(0, 7)}</span>
                                <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header with View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-bold text-white">Backlog & Roadmap</h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
                        />
                    </div>

                    {/* Team Filter (Roadmap only) */}
                    {viewMode === 'roadmap' && roadmap && (
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                        >
                            <option value="all">All Teams</option>
                            {roadmap.teams.map(team => <option key={team} value={team}>{team}</option>)}
                        </select>
                    )}

                    {/* Status Filter (Roadmap only) */}
                    {viewMode === 'roadmap' && (
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="planned">Planned</option>
                            <option value="completed">Completed</option>
                        </select>
                    )}

                    {/* View Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('roadmap')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'roadmap' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            📋 Strategic Roadmap
                        </button>
                        <button
                            onClick={() => setViewMode('git')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'git' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            🔀 Git Activity
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'roadmap' ? renderRoadmapView() : renderGitView()}
        </div>
    );
}

export default UnifiedBacklog;

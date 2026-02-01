import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    RefreshCw, CheckCircle, Clock, AlertCircle, GitCommit,
    ChevronDown, ChevronRight, Target, Users, Zap, Shield,
    Database, Server, TestTube, Smartphone, Palette, Lightbulb,
    BarChart3, Megaphone, Search
} from 'lucide-react';

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
    lastUpdated: string;
    version: string;
    summary: {
        total: number;
        completed: number;
        inProgress: number;
        planned: number;
        autoDetected: number;
    };
    byPriority: Record<string, Initiative[]>;
    byTeam: Record<string, Initiative[]>;
    teams: string[];
    initiatives: Initiative[];
}

export function StrategicRoadmap() {
    const [data, setData] = useState<RoadmapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'priority' | 'team' | 'status'>('priority');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTeam, setFilterTeam] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        async function fetchRoadmap() {
            try {
                const res = await axios.get('/api/git/roadmap');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch roadmap:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRoadmap();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="card text-red-400">Failed to load roadmap</div>;
    }

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedItems(newSet);
    };

    const getTeamIcon = (team: string) => {
        switch (team.toLowerCase()) {
            case 'product': return <Target className="w-4 h-4" />;
            case 'engineering': return <Zap className="w-4 h-4" />;
            case 'architecture': return <Server className="w-4 h-4" />;
            case 'security': return <Shield className="w-4 h-4" />;
            case 'database': return <Database className="w-4 h-4" />;
            case 'devops': return <Server className="w-4 h-4" />;
            case 'qa': return <TestTube className="w-4 h-4" />;
            case 'auth': return <Shield className="w-4 h-4" />;
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'design': return <Palette className="w-4 h-4" />;
            case 'innovation': return <Lightbulb className="w-4 h-4" />;
            case 'data': return <BarChart3 className="w-4 h-4" />;
            case 'marketing': return <Megaphone className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'P0': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'P1': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
            case 'P2': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'P3': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getStatusIcon = (status: string, detected?: boolean) => {
        switch (status) {
            case 'completed':
                return detected
                    ? <span title="Auto-detected from git"><CheckCircle className="w-4 h-4 text-emerald-400" /></span>
                    : <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'in-progress':
                return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
            default:
                return <AlertCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    // Filter initiatives
    const filteredInitiatives = data.initiatives.filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !item.id.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (filterTeam !== 'all' && item.team !== filterTeam) return false;
        if (filterStatus !== 'all' && item.status !== filterStatus) return false;
        return true;
    });

    // Group for display
    const groupBy = (items: Initiative[], key: 'priority' | 'team' | 'status') => {
        const groups: Record<string, Initiative[]> = {};
        items.forEach(item => {
            const groupKey = item[key];
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(item);
        });
        return groups;
    };

    const grouped = groupBy(filteredInitiatives, viewMode);
    const groupOrder = viewMode === 'priority'
        ? ['P0', 'P1', 'P2', 'P3']
        : viewMode === 'status'
            ? ['in-progress', 'planned', 'completed']
            : data.teams;

    const completionPercent = Math.round((data.summary.completed / data.summary.total) * 100);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="card bg-slate-800/50">
                    <p className="text-xs text-slate-500">Total Initiatives</p>
                    <p className="text-2xl font-bold text-white">{data.summary.total}</p>
                </div>
                <div className="card bg-emerald-900/20 border-emerald-500/30">
                    <p className="text-xs text-emerald-400">Completed</p>
                    <p className="text-2xl font-bold text-emerald-400">{data.summary.completed}</p>
                </div>
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <p className="text-xs text-blue-400">In Progress</p>
                    <p className="text-2xl font-bold text-blue-400">{data.summary.inProgress}</p>
                </div>
                <div className="card bg-slate-700/30 border-slate-500/30">
                    <p className="text-xs text-slate-400">Planned</p>
                    <p className="text-2xl font-bold text-slate-300">{data.summary.planned}</p>
                </div>
                <div className="card bg-purple-900/20 border-purple-500/30">
                    <p className="text-xs text-purple-400">Auto-Detected</p>
                    <p className="text-2xl font-bold text-purple-400">{data.summary.autoDetected}</p>
                </div>
                <div className="card bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                    <p className="text-xs text-cyan-400">Progress</p>
                    <p className="text-2xl font-bold text-cyan-400">{completionPercent}%</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Overall Progress</span>
                    <span className="text-sm text-slate-500">v{data.version} • Updated {data.lastUpdated}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="card">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Team Filter */}
                    <select
                        value={filterTeam}
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Teams</option>
                        {data.teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1">
                        {(['priority', 'team', 'status'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grouped Items */}
            <div className="space-y-4">
                {groupOrder.filter(key => grouped[key]?.length > 0).map(groupKey => (
                    <div key={groupKey} className="card">
                        <div className="flex items-center gap-2 mb-4">
                            {viewMode === 'priority' && (
                                <span className={`px-2 py-1 text-xs font-bold rounded border ${getPriorityColor(groupKey)}`}>
                                    {groupKey}
                                </span>
                            )}
                            {viewMode === 'team' && getTeamIcon(groupKey)}
                            {viewMode === 'status' && getStatusIcon(groupKey)}
                            <h3 className="font-bold text-white capitalize">{groupKey}</h3>
                            <span className="text-sm text-slate-500">({grouped[groupKey]?.length || 0})</span>
                        </div>

                        <div className="space-y-2">
                            {grouped[groupKey]?.map(item => (
                                <div key={item.id} className="bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div
                                        className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-800/80"
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        {expandedItems.has(item.id)
                                            ? <ChevronDown className="w-4 h-4 text-slate-500" />
                                            : <ChevronRight className="w-4 h-4 text-slate-500" />
                                        }
                                        {getStatusIcon(item.status, item.detectedFromGit)}
                                        <span className="text-xs font-mono text-slate-500">{item.id}</span>
                                        {viewMode !== 'priority' && (
                                            <span className={`px-2 py-0.5 text-xs rounded border ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        )}
                                        {viewMode !== 'team' && (
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                {getTeamIcon(item.team)}
                                                {item.team}
                                            </span>
                                        )}
                                        <span className="flex-1 text-sm text-slate-200">{item.title}</span>
                                        {item.detectedFromGit && (
                                            <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">
                                                Auto ✓
                                            </span>
                                        )}
                                    </div>

                                    {expandedItems.has(item.id) && (
                                        <div className="px-10 pb-3 space-y-2 border-t border-slate-700/50 pt-2">
                                            <p className="text-sm text-slate-400">{item.description}</p>
                                            <div className="flex gap-4 text-xs text-slate-500">
                                                <span>Effort: <span className="text-slate-300">{item.effort}</span></span>
                                                <span>Impact: <span className="text-slate-300">{item.impact}</span></span>
                                                {item.completedAt && (
                                                    <span>Completed: <span className="text-emerald-400">{item.completedAt}</span></span>
                                                )}
                                            </div>
                                            {item.matchedCommits && item.matchedCommits.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs text-purple-400">Matched Commits:</p>
                                                    {item.matchedCommits.map((commit, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                            <GitCommit className="w-3 h-3" />
                                                            <span className="font-mono">{commit.hash.slice(0, 7)}</span>
                                                            <span className="truncate">{commit.message}</span>
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
            </div>

            {/* No Results */}
            {filteredInitiatives.length === 0 && (
                <div className="card text-center py-12">
                    <p className="text-slate-400">No initiatives match your filters</p>
                </div>
            )}
        </div>
    );
}

export default StrategicRoadmap;

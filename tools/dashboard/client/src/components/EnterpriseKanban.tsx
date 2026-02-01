import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Bug, Zap, CheckCircle, Clock, AlertTriangle, User, Tag,
    Search, Filter, RefreshCw, ChevronDown, ChevronUp, X, Activity
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface KanbanItem {
    id: string;
    title: string;
    type: 'bug' | 'feature' | 'task' | 'gap' | 'regression';
    priority: 'P0' | 'P1' | 'P2';
    assignee: string;
    status: string;
    label: string;
    description: string;
    createdDate: string | null;
    dueDate: string | null;
    date?: string;
}

// Git-based response format
interface GitKanbanResponse {
    inProgress: KanbanItem[];
    staging: KanbanItem[];
    done: KanbanItem[];
    summary: {
        total: number;
        devOnly: number;
        stagingOnly: number;
        deployed: number;
    };
}

interface KanbanData {
    columns: {
        backlog: string[];
        todo: string[];
        inProgress: string[];
        done: string[];
    };
    items: Record<string, KanbanItem>;
    stats: {
        totalItems: number;
        totalBugs: number;
        criticalBugs: number;
        totalFeatures: number;
        completedThisWeek: number;
        inProgressCount: number;
        wipLimit: number;
        wipExceeded: boolean;
    };
    error?: string;
}

export function EnterpriseKanban() {
    const [data, setData] = useState<KanbanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [filterAssignee, setFilterAssignee] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [velocityStats, setVelocityStats] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        async function fetchKanban() {
            try {
                // Use git-based API instead of deleted doc-based API
                const res = await axios.get<GitKanbanResponse>('/api/git/kanban');
                const gitData = res.data;

                // Transform git response to KanbanData format
                const items: Record<string, KanbanItem> = {};
                const inProgressIds: string[] = [];
                const doneIds: string[] = [];

                // Process inProgress (dev only) items
                for (const item of gitData.inProgress || []) {
                    items[item.id] = {
                        ...item,
                        priority: item.priority || 'P2',
                        assignee: item.assignee || 'Agent',
                        label: item.type || '',
                        description: item.title,
                        createdDate: item.date || null,
                        dueDate: null
                    };
                    inProgressIds.push(item.id);
                }

                // Process staging items (also in progress)
                for (const item of gitData.staging || []) {
                    items[item.id] = {
                        ...item,
                        priority: item.priority || 'P1',
                        assignee: item.assignee || 'Agent',
                        label: item.type || '',
                        description: item.title,
                        createdDate: item.date || null,
                        dueDate: null
                    };
                    inProgressIds.push(item.id);
                }

                // Process done items
                for (const item of gitData.done || []) {
                    items[item.id] = {
                        ...item,
                        priority: item.priority || 'P2',
                        assignee: item.assignee || 'Agent',
                        label: item.type || '',
                        description: item.title,
                        createdDate: item.date || null,
                        dueDate: null
                    };
                    doneIds.push(item.id);
                }

                // Count bugs and features
                const allItems = Object.values(items);
                const bugCount = allItems.filter(i => i.type === 'bug').length;
                const featureCount = allItems.filter(i => i.type === 'feature').length;

                setData({
                    columns: {
                        backlog: [],
                        todo: [],
                        inProgress: inProgressIds,
                        done: doneIds
                    },
                    items,
                    stats: {
                        totalItems: gitData.summary.total,
                        totalBugs: bugCount,
                        criticalBugs: 0,
                        totalFeatures: featureCount,
                        completedThisWeek: gitData.summary.deployed,
                        inProgressCount: gitData.summary.devOnly + gitData.summary.stagingOnly,
                        wipLimit: 10,
                        wipExceeded: (gitData.summary.devOnly + gitData.summary.stagingOnly) > 10
                    }
                });
            } catch (error) {
                console.error('Failed to fetch Kanban:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchVelocity() {
            try {
                const res = await axios.get('/api/velocity/stats');
                setVelocityStats(res.data);
            } catch (error) {
                console.error('Failed to fetch velocity:', error);
            }
        }

        fetchKanban();
        fetchVelocity();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data || data.error) {
        return <div className="card text-red-400">Failed to load Kanban board</div>;
    }

    // Filter items
    const filterItems = (itemIds: string[]) => {
        return itemIds.filter(id => {
            const item = data.items[id];
            if (!item) return false;

            // Search filter
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !item.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Type filter
            if (filterType !== 'all' && item.type !== filterType) return false;

            // Priority filter
            if (filterPriority !== 'all' && item.priority !== filterPriority) return false;

            // Assignee filter
            if (filterAssignee !== 'all' && item.assignee !== filterAssignee) return false;

            return true;
        });
    };

    const columns = [
        {
            id: 'backlog',
            title: 'Backlog',
            items: filterItems(data.columns.backlog),
            color: 'border-slate-500',
            bgColor: 'bg-slate-500/10',
            icon: <Tag className="w-4 h-4" />
        },
        {
            id: 'todo',
            title: 'To Do',
            items: filterItems(data.columns.todo),
            color: 'border-amber-500',
            bgColor: 'bg-amber-500/10',
            icon: <Clock className="w-4 h-4 text-amber-400" />
        },
        {
            id: 'inProgress',
            title: 'In Progress',
            items: filterItems(data.columns.inProgress),
            color: 'border-blue-500',
            bgColor: 'bg-blue-500/10',
            icon: <RefreshCw className="w-4 h-4 text-blue-400" />
        },
        {
            id: 'done',
            title: 'Done',
            items: filterItems(data.columns.done),
            color: 'border-emerald-500',
            bgColor: 'bg-emerald-500/10',
            icon: <CheckCircle className="w-4 h-4 text-emerald-400" />
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'bug':
            case 'regression':
                return <Bug className="w-4 h-4 text-red-400" />;
            case 'feature':
                return <Zap className="w-4 h-4 text-purple-400" />;
            case 'gap':
                return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            default:
                return <CheckCircle className="w-4 h-4 text-slate-400" />;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            P0: 'bg-red-900/30 text-red-400 border-red-500/50',
            P1: 'bg-amber-900/30 text-amber-400 border-amber-500/50',
            P2: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50'
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${styles[priority as keyof typeof styles] || styles.P2}`}>
                {priority}
            </span>
        );
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = () => {
        setActiveId(null);
        // Note: We don't persist changes to ROADMAP.md
        // This is intentional - the markdown file is the source of truth
        alert('⚠️ Drag-and-drop is visual only. To move items, edit ROADMAP.md or KNOWN_ISSUES.md directly.');
    };

    const activeItem = activeId ? data.items[activeId] : null;

    const hasActiveFilters = searchQuery || filterType !== 'all' || filterPriority !== 'all' || filterAssignee !== 'all';

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                <div className="card bg-slate-800/50">
                    <p className="text-xs text-slate-500">Total Items</p>
                    <p className="text-2xl font-bold text-white">{data.stats.totalItems}</p>
                </div>
                <div className="card bg-red-900/20 border-red-500/30">
                    <p className="text-xs text-red-400">Critical Bugs</p>
                    <p className="text-2xl font-bold text-red-400">{data.stats.criticalBugs}</p>
                </div>
                <div className="card bg-amber-900/20 border-amber-500/30">
                    <p className="text-xs text-amber-400">Total Bugs</p>
                    <p className="text-2xl font-bold text-amber-400">{data.stats.totalBugs}</p>
                </div>
                <div className="card bg-purple-900/20 border-purple-500/30">
                    <p className="text-xs text-purple-400">Features</p>
                    <p className="text-2xl font-bold text-purple-400">{data.stats.totalFeatures}</p>
                </div>
                <div className="card bg-blue-900/20 border-blue-500/30">
                    <p className="text-xs text-blue-400">In Progress</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {data.stats.inProgressCount}
                        {data.stats.wipExceeded && <span className="text-xs text-red-400 ml-1">!</span>}
                    </p>
                </div>
                <div className="card bg-emerald-900/20 border-emerald-500/30">
                    <p className="text-xs text-emerald-400">Completed</p>
                    <p className="text-2xl font-bold text-emerald-400">{data.stats.completedThisWeek}</p>
                </div>
                {/* Velocity Stats */}
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

            {/* Filters */}
            <div className="card">
                <div className="flex items-center gap-4 flex-wrap">
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

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {hasActiveFilters && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </button>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterType('all');
                                setFilterPriority('all');
                                setFilterAssignee('all');
                            }}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-2">Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="bug">🐛 Bugs</option>
                                <option value="feature">✨ Features</option>
                                <option value="task">✅ Tasks</option>
                                <option value="gap">⚠️ Gaps</option>
                                <option value="regression">🔴 Regressions</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-2">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Priorities</option>
                                <option value="P0">🔴 P0 (Critical)</option>
                                <option value="P1">🟡 P1 (High)</option>
                                <option value="P2">🟢 P2 (Low)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-2">Assignee</label>
                            <select
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Assignees</option>
                                <option value="Teeto">👤 Teeto</option>
                                <option value="Agent">🤖 Agent</option>
                                <option value="Unassigned">⚪ Unassigned</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={`card border-t-2 ${column.color} ${column.bgColor} min-h-[400px]`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {column.icon}
                                    <h3 className="font-bold text-white">{column.title}</h3>
                                </div>
                                <span className="text-sm font-semibold text-slate-400">
                                    {column.items.length}
                                </span>
                            </div>

                            <SortableContext
                                items={column.items}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {column.items.map((itemId) => {
                                        const item = data.items[itemId];
                                        if (!item) return null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-slate-800/70 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
                                                onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                                            >
                                                {/* Card Header */}
                                                <div className="flex items-start gap-2 mb-2">
                                                    {getTypeIcon(item.type)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-mono text-slate-500">{item.id}</span>
                                                            {getPriorityBadge(item.priority)}
                                                        </div>
                                                        <p className="text-sm text-slate-200 font-medium leading-tight line-clamp-2">
                                                            {item.title}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Card Footer */}
                                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                                    <User className="w-3 h-3" />
                                                    <span>{item.assignee}</span>
                                                    {item.label && (
                                                        <>
                                                            <span>•</span>
                                                            <Tag className="w-3 h-3" />
                                                            <span>{item.label}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Expanded Details */}
                                                {expandedCard === item.id && (
                                                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                                                        <p className="text-xs text-slate-400 whitespace-pre-wrap">
                                                            {item.description.substring(0, 200)}
                                                            {item.description.length > 200 && '...'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {column.items.length === 0 && (
                                        <p className="text-sm text-slate-500 text-center py-8">No items</p>
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeItem && (
                        <div className="bg-slate-800 rounded-lg p-3 border border-blue-500 shadow-xl opacity-90">
                            <div className="flex items-start gap-2">
                                {getTypeIcon(activeItem.type)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-slate-500">{activeItem.id}</span>
                                        {getPriorityBadge(activeItem.priority)}
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium">{activeItem.title}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default EnterpriseKanban;

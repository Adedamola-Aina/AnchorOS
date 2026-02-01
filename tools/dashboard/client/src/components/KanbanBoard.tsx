import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface KanbanItem {
    id: string;
    type: string;
    title: string;
    hash: string;
    date: string;
    status: 'dev' | 'staging' | 'deployed';
}

interface KanbanData {
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

export function KanbanBoard() {
    const [board, setBoard] = useState<KanbanData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBoard() {
            try {
                // Use the new git-based API
                const res = await axios.get('/api/git/kanban');
                setBoard(res.data);
            } catch (error) {
                console.error('Failed to fetch board:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBoard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!board) {
        return <div className="card">Failed to load Kanban board</div>;
    }

    const columns = [
        {
            id: 'dev',
            title: 'Dev Only',
            items: board.inProgress,
            color: 'border-amber-500',
            bgColor: 'bg-amber-500/10',
            dotColor: 'bg-amber-500',
            icon: AlertCircle
        },
        {
            id: 'staging',
            title: 'In Staging',
            items: board.staging,
            color: 'border-blue-500',
            bgColor: 'bg-blue-500/10',
            dotColor: 'bg-blue-500',
            icon: Clock
        },
        {
            id: 'deployed',
            title: 'Deployed',
            items: board.done,
            color: 'border-emerald-500',
            bgColor: 'bg-emerald-500/10',
            dotColor: 'bg-emerald-500',
            icon: CheckCircle
        },
    ];

    const totalItems = board.summary.total;
    const deployedCount = board.summary.deployed;
    const deployedPercent = totalItems > 0 ? (deployedCount / totalItems) * 100 : 0;
    const stagingPercent = totalItems > 0 ? (board.summary.stagingOnly / totalItems) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Source Badge */}
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    📊 Git-Automated
                </span>
                <span className="text-xs text-slate-500">Data from commit history</span>
            </div>

            {/* Stats Bar */}
            <div className="flex gap-4">
                {columns.map((col) => (
                    <div key={col.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${col.dotColor}`} />
                        <span className="text-sm text-slate-400">{col.title}</span>
                        <span className="text-sm font-bold text-white">{col.items.length}</span>
                    </div>
                ))}
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {columns.map((column) => {
                    const Icon = column.icon;
                    return (
                        <div
                            key={column.id}
                            className={`card border-t-2 ${column.color} ${column.bgColor}`}
                        >
                            <h3 className="font-bold text-white mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {column.title}
                                </span>
                                <span className="text-sm font-normal text-slate-400">
                                    {column.items.length}
                                </span>
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {column.items.length > 0 ? (
                                    column.items.slice(0, 20).map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className={`px-1.5 py-0.5 text-xs rounded ${item.type === 'bug' ? 'bg-red-500/20 text-red-400' :
                                                        item.type === 'feature' ? 'bg-blue-500/20 text-blue-400' :
                                                            item.type === 'enhancement' ? 'bg-purple-500/20 text-purple-400' :
                                                                item.type === 'gap' ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-slate-500/20 text-slate-400'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-tight mt-1">
                                                {item.title.substring(0, 80)}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {item.hash} • {new Date(item.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">No items</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="card">
                <h3 className="card-header">Deployment Progress</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            <div className="flex h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${deployedPercent}%` }}
                                />
                                <div
                                    className="bg-blue-500 transition-all duration-500"
                                    style={{ width: `${stagingPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-slate-400">
                        <span className="text-emerald-400 font-bold">{deployedCount}</span> deployed
                        <span className="mx-2">|</span>
                        <span className="text-amber-400 font-bold">{board.summary.devOnly}</span> pending
                    </div>
                </div>
            </div>
        </div>
    );
}

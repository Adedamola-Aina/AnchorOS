// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, CheckSquare, Square, Clock } from 'lucide-react';

interface KanbanItem {
    status: 'done' | 'in-progress' | 'todo';
    text: string;
}

interface KanbanData {
    parsed: {
        backlog: KanbanItem[];
        todo: KanbanItem[];
        inProgress: KanbanItem[];
        done: KanbanItem[];
    };
}

export function KanbanBoard() {
    const [board, setBoard] = useState<KanbanData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBoard() {
            try {
                const res = await axios.get('/api/board');
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

    if (!board?.parsed) {
        return <div className="card">Failed to load Kanban board</div>;
    }

    const columns = [
        {
            id: 'backlog',
            title: 'Backlog',
            items: board.parsed.backlog,
            color: 'border-slate-500',
            bgColor: 'bg-slate-500/10',
            dotColor: 'bg-slate-500'
        },
        {
            id: 'todo',
            title: 'To Do',
            items: board.parsed.todo,
            color: 'border-amber-500',
            bgColor: 'bg-amber-500/10',
            dotColor: 'bg-amber-500'
        },
        {
            id: 'inProgress',
            title: 'In Progress',
            items: board.parsed.inProgress,
            color: 'border-blue-500',
            bgColor: 'bg-blue-500/10',
            dotColor: 'bg-blue-500'
        },
        {
            id: 'done',
            title: 'Done',
            items: board.parsed.done,
            color: 'border-emerald-500',
            bgColor: 'bg-emerald-500/10',
            dotColor: 'bg-emerald-500'
        },
    ];

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'done':
                return <CheckSquare className="w-4 h-4 text-emerald-400" />;
            case 'in-progress':
                return <Clock className="w-4 h-4 text-blue-400" />;
            default:
                return <Square className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className={`card border-t-2 ${column.color} ${column.bgColor}`}
                    >
                        <h3 className="font-bold text-white mb-3 flex items-center justify-between">
                            {column.title}
                            <span className="text-sm font-normal text-slate-400">
                                {column.items.length}
                            </span>
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {column.items.length > 0 ? (
                                column.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-2">
                                            <StatusIcon status={item.status} />
                                            <p className="text-sm text-slate-300 leading-tight">{item.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">No items</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="card">
                <h3 className="card-header">Sprint Progress</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            {(() => {
                                const total = columns.reduce((sum, col) => sum + col.items.length, 0);
                                const done = board.parsed.done.length;
                                const inProgress = board.parsed.inProgress.length;
                                const donePercent = total > 0 ? (done / total) * 100 : 0;
                                const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;

                                return (
                                    <div className="flex h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${donePercent}%` }}
                                        />
                                        <div
                                            className="bg-blue-500 transition-all duration-500"
                                            style={{ width: `${inProgressPercent}%` }}
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="text-sm text-slate-400">
                        <span className="text-emerald-400 font-bold">{board.parsed.done.length}</span> done
                        <span className="mx-2">|</span>
                        <span className="text-blue-400 font-bold">{board.parsed.inProgress.length}</span> in progress
                    </div>
                </div>
            </div>
        </div>
    );
}

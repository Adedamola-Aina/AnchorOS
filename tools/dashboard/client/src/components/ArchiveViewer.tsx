import { useState, useEffect } from 'react';
import axios from 'axios';
import { Archive, Calendar, RotateCcw, Eye, Play, AlertCircle } from 'lucide-react';

interface ArchivedItem {
    text: string;
    month: string | null;
    week: string | null;
}

interface ArchivePreview {
    success: boolean;
    archivedCount: number;
    items?: Array<{
        text: string;
        completionDate: string;
    }>;
    message: string;
}

export function ArchiveViewer() {
    const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
    const [preview, setPreview] = useState<ArchivePreview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [daysThreshold, setDaysThreshold] = useState(30);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchArchivedItems();
    }, []);

    const fetchArchivedItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/archive/items');
            setArchivedItems(res.data.items);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch archived items');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        try {
            const res = await axios.get(`/api/archive/preview?days=${daysThreshold}`);
            setPreview(res.data);
            setShowPreview(true);
        } catch (err) {
            alert('Failed to preview archival');
        }
    };

    const handleRunArchival = async () => {
        if (!confirm(`Archive all items completed more than ${daysThreshold} days ago?`)) {
            return;
        }

        try {
            const res = await axios.post('/api/archive/run', { daysThreshold, dryRun: false });
            alert(res.data.message);
            fetchArchivedItems();
            setShowPreview(false);
        } catch (err) {
            alert('Failed to run archival');
        }
    };

    const handleRestore = async (itemText: string) => {
        if (!confirm('Restore this item to ROADMAP.md?')) {
            return;
        }

        try {
            const res = await axios.post('/api/archive/restore', { itemText });
            alert(res.data.message);
            fetchArchivedItems();
        } catch (err) {
            alert('Failed to restore item');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <Archive className="w-6 h-6 animate-pulse" />
                    <span>Loading archive...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-red-500/50">
                <div className="flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                        <p className="font-medium">Failed to load archive</p>
                        <p className="text-sm text-red-400/70">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Group items by month
    const groupedItems: Record<string, ArchivedItem[]> = {};
    archivedItems.forEach(item => {
        const month = item.month || 'Unknown';
        if (!groupedItems[month]) {
            groupedItems[month] = [];
        }
        groupedItems[month].push(item);
    });

    return (
        <div className="space-y-6">
            {/* Archive Controls */}
            <div className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Archive className="w-6 h-6 text-purple-400" />
                    Archive Manager
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-slate-400 mb-2">
                                Archive items older than (days)
                            </label>
                            <input
                                type="number"
                                value={daysThreshold}
                                onChange={(e) => setDaysThreshold(parseInt(e.target.value) || 30)}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                min="1"
                            />
                        </div>
                        <button
                            onClick={handlePreview}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 mt-6"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleRunArchival}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 mt-6"
                        >
                            <Play className="w-4 h-4" />
                            Run Now
                        </button>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-sm text-slate-400">
                            <strong className="text-white">Automatic archival:</strong> Runs daily at 2:00 AM
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Items completed more than {daysThreshold} days ago will be moved to ROADMAP_ARCHIVE.md
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && preview && (
                <div className="card border-blue-500/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Archive Preview</h3>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-blue-400 mb-4">{preview.message}</p>
                    {preview.items && preview.items.length > 0 && (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {preview.items.map((item, i) => (
                                <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-sm text-slate-300">{item.text}</p>
                                    <p className="text-xs text-slate-500 mt-1">Completed: {item.completionDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Archived Items */}
            <div className="card">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    Archived Items ({archivedItems.length})
                </h3>

                {archivedItems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">
                        No archived items yet. Items will be automatically archived after {daysThreshold} days.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {Object.keys(groupedItems).sort().reverse().map(month => (
                            <div key={month}>
                                <h4 className="text-md font-semibold text-emerald-400 mb-3">{month}</h4>
                                <div className="space-y-2">
                                    {groupedItems[month].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-300">{item.text}</p>
                                                {item.week && (
                                                    <p className="text-xs text-slate-500 mt-1">{item.week}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRestore(item.text)}
                                                className="ml-4 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-xs text-white font-medium transition-colors flex items-center gap-1"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Restore
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

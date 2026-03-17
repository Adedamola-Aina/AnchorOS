import { useState, useEffect } from 'react';
import { Archive, Eye, Play, AlertCircle } from 'lucide-react';
import { ArchivePreviewPanel } from './ArchivePreviewPanel';
import { ArchivedItemsPanel } from './ArchivedItemsPanel';
import {
    fetchArchivedItemsApi,
    fetchArchivePreview,
    groupArchivedItemsByMonth,
    restoreArchivedItem,
    runArchivalNow,
    type ArchivePreview,
    type ArchivedItem,
} from './archiveViewer.utils';

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
            setArchivedItems(await fetchArchivedItemsApi());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch archived items');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        try {
            setPreview(await fetchArchivePreview(daysThreshold));
            setShowPreview(true);
        } catch {
            alert('Failed to preview archival');
        }
    };

    const handleRunArchival = async () => {
        if (!confirm(`Archive all items completed more than ${daysThreshold} days ago?`)) {
            return;
        }

        try {
            alert(await runArchivalNow(daysThreshold));
            fetchArchivedItems();
            setShowPreview(false);
        } catch {
            alert('Failed to run archival');
        }
    };

    const handleRestore = async (itemText: string) => {
        if (!confirm('Restore this item to ROADMAP.md?')) {
            return;
        }

        try {
            alert(await restoreArchivedItem(itemText));
            fetchArchivedItems();
        } catch {
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

    const groupedItems = groupArchivedItemsByMonth(archivedItems);

    return (
        <div className="space-y-6">
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

            {showPreview && preview && <ArchivePreviewPanel preview={preview} onClose={() => setShowPreview(false)} />}
            <ArchivedItemsPanel
                archivedItems={archivedItems}
                groupedItems={groupedItems}
                daysThreshold={daysThreshold}
                onRestore={handleRestore}
            />
        </div>
    );
}

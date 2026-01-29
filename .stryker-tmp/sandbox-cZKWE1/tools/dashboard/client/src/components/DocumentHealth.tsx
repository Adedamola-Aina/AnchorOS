// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface DocData {
    filename: string;
    lastModified: string;
    freshness: {
        status: 'fresh' | 'recent' | 'stale';
        label: string;
        color: string;
    };
    parsed?: unknown;
    error?: string;
    exists?: boolean;
}

export function DocumentHealth() {
    const [docs, setDocs] = useState<DocData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocs() {
            try {
                const res = await axios.get('/api/docs');
                setDocs(res.data);
            } catch (error) {
                console.error('Failed to fetch docs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDocs();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    const FreshnessIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'fresh':
                return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'recent':
                return <AlertTriangle className="w-5 h-5 text-amber-400" />;
            case 'stale':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    const freshCount = docs.filter(d => d.freshness?.status === 'fresh').length;
    const staleCount = docs.filter(d => d.freshness?.status === 'stale').length;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Total Documents</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{docs.length}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">Fresh</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{freshCount}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-medium text-slate-300">Stale (7+ days)</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{staleCount}</p>
                </div>
            </div>

            {/* Document List */}
            <div className="card">
                <h3 className="card-header">Documentation Status</h3>
                <div className="space-y-1">
                    {docs.map((doc, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors ${doc.freshness?.status === 'stale' ? 'bg-red-500/10' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <FreshnessIcon status={doc.freshness?.status || 'unknown'} />
                                <div>
                                    <p className="font-medium text-slate-200">{doc.filename}</p>
                                    <p className="text-xs text-slate-500">
                                        Last updated: {doc.lastModified ? new Date(doc.lastModified).toLocaleString() : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`badge ${doc.freshness?.status === 'fresh' ? 'badge-green' :
                                        doc.freshness?.status === 'recent' ? 'badge-yellow' :
                                            'badge-red'
                                    }`}>
                                    {doc.freshness?.label || 'Unknown'}
                                </span>
                                <a
                                    href={`vscode://file//root/anchor-os/docs/${doc.filename}`}
                                    className="p-1.5 rounded hover:bg-slate-700 transition-colors"
                                    title="Open in VS Code"
                                >
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stale Warning */}
            {staleCount > 0 && (
                <div className="card border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                            <p className="font-medium text-amber-300">Documentation Update Needed</p>
                            <p className="text-sm text-amber-300/70 mt-1">
                                {staleCount} document{staleCount > 1 ? 's have' : ' has'} not been updated in over 7 days.
                                Consider reviewing and updating these documents to keep project tracking accurate.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

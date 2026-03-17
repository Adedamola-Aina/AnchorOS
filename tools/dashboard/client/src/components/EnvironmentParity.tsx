// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, RefreshCw, PartyPopper } from 'lucide-react';

interface Feature {
    name: string;
    type: string;
    workKind?: string;
    domains?: string[];
    confidence?: number;
    commitCount: number;
    latestCommit: string;
    dev: { deployed: boolean; hash: string | null };
    staging: { deployed: boolean; hash: string | null };
    production: { deployed: boolean; hash: string | null };
}

interface ParityData {
    versions: {
        production: string;
        staging: string;
        development: string;
    };
    features: Feature[];
    summary: {
        total: number;
        devOnly: number;
        stagingPending: number;
        fullyDeployed: number;
    };
}

export function EnvironmentParity() {
    const [data, setData] = useState<ParityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchParity() {
            try {
                const res = await axios.get('/api/parity');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch parity:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchParity();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="card">Failed to load environment parity data</div>;
    }

    const StatusIcon = ({ deployed }: { deployed: boolean }) => {
        if (deployed) {
            return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        }
        return <XCircle className="w-5 h-5 text-slate-600" />;
    };

    return (
        <div className="space-y-6">
            {/* Version Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-slate-300">Production</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{data.versions.production}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-slate-300">Staging</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{data.versions.staging}</p>
                </div>
                <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-slate-300">Development</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{data.versions.development}</p>
                </div>
            </div>

            {/* Parity Summary */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="card-header mb-0">Deployment Summary</h3>
                    <div className="flex gap-2">
                        <span className="badge badge-yellow">{data.summary.devOnly} Dev Only</span>
                        <span className="badge badge-blue">{data.summary.stagingPending} Pending Prod</span>
                        <span className="badge badge-green">{data.summary.fullyDeployed} Fully Deployed</span>
                    </div>
                </div>
            </div>

            {/* Feature Table */}
            <div className="card overflow-hidden">
                <h3 className="card-header">Feature Parity</h3>
                {data.features.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <PartyPopper className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-emerald-400 mb-2">Full Parity Achieved! 🎉</h4>
                        <p className="text-slate-400 max-w-md">
                            All environments are running the same code. Dev, Staging, and Production are in sync at <span className="font-mono text-white">{data.versions.production}</span>.
                        </p>
                        <p className="text-slate-500 text-sm mt-4">
                            No pending deployments. Ready for new development.
                        </p>
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="table-header">Feature</th>
                                <th className="table-header text-center">Type</th>
                                <th className="table-header text-center">Domain</th>
                                <th className="table-header text-center">Confidence</th>
                                <th className="table-header text-center">Commits</th>
                                <th className="table-header text-center">Dev</th>
                                <th className="table-header text-center">Staging</th>
                                <th className="table-header text-center">Production</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.features.map((feature, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell">
                                        <div className="max-w-xs truncate text-slate-300" title={feature.name}>
                                            {feature.name}
                                        </div>
                                    </td>
                                    <td className="table-cell text-center">
                                        <span className={`badge ${(feature.workKind || feature.type) === 'feature' ? 'badge-purple' :
                                            (feature.workKind || feature.type) === 'bugfix' ? 'badge-red' :
                                                (feature.workKind || feature.type) === 'security' ? 'badge-blue' :
                                                    'badge-yellow'
                                            }`}>
                                            {feature.workKind || feature.type}
                                        </span>
                                    </td>
                                    <td className="table-cell text-center text-slate-400">
                                        {(feature.domains || ['unknown']).slice(0, 2).join(', ')}
                                    </td>
                                    <td className="table-cell text-center text-slate-400">
                                        {Math.round((feature.confidence || 0) * 100)}%
                                    </td>
                                    <td className="table-cell text-center text-slate-400">
                                        {feature.commitCount}
                                    </td>
                                    <td className="table-cell text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <StatusIcon deployed={feature.dev.deployed} />
                                            {feature.dev.hash && (
                                                <span className="text-xs font-mono text-slate-500">{feature.dev.hash}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="table-cell text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <StatusIcon deployed={feature.staging.deployed} />
                                            {feature.staging.hash && (
                                                <span className="text-xs font-mono text-slate-500">{feature.staging.hash}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="table-cell text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <StatusIcon deployed={feature.production.deployed} />
                                            {feature.production.hash && (
                                                <span className="text-xs font-mono text-slate-500">{feature.production.hash}</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>
    );
}

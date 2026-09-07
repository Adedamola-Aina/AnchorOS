import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, CheckCircle, RefreshCw, Shield } from 'lucide-react';

interface DependencyData {
    outdated: {
        total: number;
        critical: number;
        minor: number;
        patch: number;
        dependencies?: Array<{
            name: string;
            current: string;
            latest: string;
            severity: string;
        }>;
    };
    security: {
        vulnerabilities: {
            total?: number;
            high?: number;
            critical?: number;
        };
    };
    status: 'healthy' | 'warning' | 'critical';
    lastChecked: string;
}

export function DependencyHealth() {
    const [data, setData] = useState<DependencyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDeps() {
            try {
                const res = await axios.get('/api/dependencies');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch dependencies:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDeps();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Dependency Health</h3>
                </div>
                <div className="flex items-center justify-center h-24">
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    const statusIcons = {
        healthy: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        critical: <AlertTriangle className="w-5 h-5 text-red-400" />
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Dependency Health</h3>
                </div>
                {data && statusIcons[data.status]}
            </div>

            {data && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Package className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-400">Outdated</span>
                            </div>
                            <p className={`text-2xl font-bold ${data.outdated.total > 10 ? 'text-amber-400' : 'text-white'}`}>
                                {data.outdated.total}
                            </p>
                            {data.outdated.critical > 0 && (
                                <span className="text-xs text-red-400">{data.outdated.critical} major</span>
                            )}
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-400">Vulnerabilities</span>
                            </div>
                            <p className={`text-2xl font-bold ${(data.security.vulnerabilities?.total || 0) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {data.security.vulnerabilities?.total || 0}
                            </p>
                        </div>
                    </div>

                    {data.outdated.dependencies && data.outdated.dependencies.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/50">
                            <p className="text-xs text-slate-500 mb-2">Top outdated packages:</p>
                            <div className="space-y-1">
                                {data.outdated.dependencies.slice(0, 3).map(d => (
                                    <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="text-slate-300 font-mono">{d.name}</span>
                                        <span className="text-slate-500">
                                            {d.current} → <span className="text-emerald-400">{d.latest}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DependencyHealth;

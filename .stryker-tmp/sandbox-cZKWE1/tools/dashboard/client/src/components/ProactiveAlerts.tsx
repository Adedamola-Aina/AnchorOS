// @ts-nocheck
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, FileWarning, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface FileAlert {
    path: string;
    lines: number;
    status: 'exceeding' | 'warning' | 'caution' | 'healthy';
}

interface Alert {
    type: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    files?: FileAlert[];
}

interface HealthData {
    fileHealth: {
        summary: {
            exceeding: number;
            approaching: number;
            healthy: number;
        };
        files: FileAlert[];
    };
    anomalies: {
        alerts: Alert[];
    };
}

export function ProactiveAlerts() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHealth() {
            try {
                const res = await axios.get('/api/health');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch health:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchHealth();
    }, []);

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Proactive Alerts</h3>
                </div>
                <div className="flex items-center justify-center h-24">
                    <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    const alerts = data?.anomalies?.alerts || [];
    const hasAlerts = alerts.length > 0;

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Proactive Alerts</h3>
                </div>
                {!hasAlerts && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            </div>

            {!hasAlerts && (
                <div className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-300">All systems healthy</span>
                </div>
            )}

            {hasAlerts && (
                <div className="space-y-3">
                    {alerts.map((alert, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${alert.severity === 'critical'
                                    ? 'bg-red-900/20 border-red-500/30'
                                    : 'bg-amber-900/20 border-amber-500/30'
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                {alert.severity === 'critical' ? (
                                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                                ) : (
                                    <FileWarning className="w-4 h-4 text-amber-400 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${alert.severity === 'critical' ? 'text-red-300' : 'text-amber-300'
                                        }`}>
                                        {alert.message}
                                    </p>
                                    {alert.files && alert.files.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {alert.files.slice(0, 3).map((file, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-400 font-mono truncate">
                                                        {file.path.split('/').pop()}
                                                    </span>
                                                    <span className={`font-medium ${file.lines > 200 ? 'text-red-400' : 'text-amber-400'
                                                        }`}>
                                                        {file.lines} lines
                                                    </span>
                                                </div>
                                            ))}
                                            {alert.files.length > 3 && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    +{alert.files.length - 3} more files
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data?.fileHealth?.summary && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xs text-slate-500">Exceeding</p>
                            <p className="text-lg font-bold text-red-400">
                                {data.fileHealth.summary.exceeding}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Warning</p>
                            <p className="text-lg font-bold text-amber-400">
                                {data.fileHealth.summary.approaching}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Healthy</p>
                            <p className="text-lg font-bold text-emerald-400">
                                {data.fileHealth.summary.healthy}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProactiveAlerts;

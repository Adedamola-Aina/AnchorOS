import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Snapshot<T> {
    available: boolean;
    data?: T;
    error?: string;
}

interface ReleaseData {
    environments: {
        versions: Snapshot<{ production: string; staging: string; development: string }>;
        parity: Snapshot<{ summary: { fullyDeployed: number; stagingPending: number; devOnly: number } }>;
    };
    quality: {
        secureDb: Snapshot<{ violations?: number }>;
        e2e: Snapshot<{ available: boolean; status: string; hasNewFailures: boolean }>;
        dependencies: Snapshot<Record<string, unknown>>;
    };
    git: {
        currentVersion: Snapshot<string>;
        branch: Snapshot<string>;
    };
    generatedAt: string;
}

function Row({ label, ok, detail }: { label: string; ok: boolean | null; detail: string }) {
    const color = ok === null ? 'text-slate-400' : ok ? 'text-emerald-400' : 'text-amber-400';
    const mark = ok === null ? 'UNKNOWN' : ok ? 'OK' : 'ATTENTION';
    return (
        <li className="flex items-center justify-between gap-4 py-2 border-b border-slate-700/40 last:border-0">
            <span className="text-sm text-slate-300">{label}</span>
            <span className="text-xs text-slate-400 flex-1 min-w-0 truncate">{detail}</span>
            <span className={`text-xs font-semibold ${color}`}>{mark}</span>
        </li>
    );
}

export function ReleaseTab() {
    const [data, setData] = useState<ReleaseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<ReleaseData>('/api/overview')
            .then((res) => setData(res.data))
            .catch(() => setError('Failed to load release data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
        );
    }
    if (error || !data) {
        return (
            <div className="card border-red-500/50 flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-5 h-5" /> {error ?? 'No data'}
            </div>
        );
    }

    const versions = data.environments.versions.available ? data.environments.versions.data : null;
    const parity = data.environments.parity.available ? data.environments.parity.data?.summary : null;
    const e2e = data.quality.e2e.available ? data.quality.e2e.data : null;
    const secureDb = data.quality.secureDb.available ? data.quality.secureDb.data : null;
    const candidate = data.git.currentVersion.available ? data.git.currentVersion.data : 'unknown';

    return (
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Release Readiness (evidence-based, advisory only)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                    Candidate: <span className="font-mono text-slate-300">{candidate}</span> on{' '}
                    <span className="font-mono text-slate-300">{data.git.branch.available ? data.git.branch.data : 'unknown'}</span>.
                    This view does not approve or deploy releases.
                </p>
                <ul>
                    <Row
                        label="Production parity"
                        ok={parity ? parity.stagingPending === 0 : null}
                        detail={parity ? `${parity.fullyDeployed} items in prod, ${parity.stagingPending} staging-pending` : 'parity unavailable'}
                    />
                    <Row
                        label="Staging == production version"
                        ok={versions ? versions.staging === versions.production : null}
                        detail={versions ? `prod ${versions.production} / staging ${versions.staging}` : 'versions unavailable'}
                    />
                    <Row
                        label="E2E"
                        ok={e2e ? !e2e.hasNewFailures : null}
                        detail={e2e ? `status ${e2e.status}${e2e.hasNewFailures ? ', new failures' : ''}` : 'e2e unavailable'}
                    />
                    <Row
                        label="secureDb compliance"
                        ok={secureDb ? (secureDb.violations ? false : true) : null}
                        detail={secureDb ? (secureDb.violations ? `${secureDb.violations} violations` : 'no violations') : 'scan unavailable'}
                    />
                    <Row
                        label="Dependency health"
                        ok={data.quality.dependencies.available ? null : null}
                        detail={data.quality.dependencies.available ? 'see Quality tab' : 'unavailable'}
                    />
                </ul>
            </div>
            <p className="text-xs text-slate-500">Last refresh: {new Date(data.generatedAt).toLocaleString()}</p>
        </div>
    );
}

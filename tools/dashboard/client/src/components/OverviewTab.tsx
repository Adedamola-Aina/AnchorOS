import { useEffect, useState } from 'react';
import axios from 'axios';
import { GitBranch, RefreshCw, AlertTriangle } from 'lucide-react';

interface Snapshot<T> {
    available: boolean;
    data?: T;
    error?: string;
}

interface EnvVersions {
    production: string;
    staging: string;
    development: string;
}

interface ParitySummary {
    fullyDeployed: number;
    stagingPending: number;
    devOnly: number;
}

interface OverviewResponse {
    git: {
        branch: Snapshot<string>;
        currentVersion: Snapshot<string>;
        recentCommits: Snapshot<Array<{ hash: string; message: string; date: string }>>;
    };
    environments: {
        versions: Snapshot<EnvVersions>;
        parity: Snapshot<{ summary: ParitySummary }>;
    };
    quality: {
        dependencies: Snapshot<Record<string, unknown>>;
        secureDb: Snapshot<{ violations?: number }>;
        e2e: Snapshot<{ hasNewFailures: boolean; status: string }>;
    };
    generatedAt: string;
}

function unknown(value: string | undefined): string {
    return value && value !== 'unknown' ? value : 'unknown';
}

export function StatusPill({ ok, label }: { ok: boolean | null; label: string }) {
    const cls = ok === null
        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
        : ok
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
            : 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    return <span className={`px-2 py-0.5 rounded-full text-xs border ${cls}`}>{label}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="card">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
            {children}
        </div>
    );
}

function Unavailable({ what }: { what: string }) {
    return <p className="text-slate-400 text-xs">{what} unavailable</p>;
}

export function OverviewTab() {
    const [data, setData] = useState<OverviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<OverviewResponse>('/api/overview')
            .then((res) => setData(res.data))
            .catch(() => setError('Failed to load overview'))
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

    const branch = data.git.branch.available ? data.git.branch.data : 'unknown';
    const version = data.git.currentVersion.available ? unknown(data.git.currentVersion.data) : 'unknown';
    const versions = data.environments.versions.available ? data.environments.versions.data : null;
    const parity = data.environments.parity.available ? data.environments.parity.data?.summary : null;
    const secureDb = data.quality.secureDb.available ? data.quality.secureDb.data : null;
    const e2e = data.quality.e2e.available ? data.quality.e2e.data : null;
    const deps = data.quality.dependencies.available ? data.quality.dependencies.data : null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="Current Git">
                    <p className="text-white font-mono text-sm break-all">{branch}</p>
                    <p className="text-slate-400 text-xs mt-1 font-mono">{version}</p>
                </Card>
                <Card title="Environments">
                    {versions ? (
                        <ul className="text-xs space-y-1 text-slate-300 font-mono">
                            <li>prod: {unknown(versions.production)}</li>
                            <li>staging: {unknown(versions.staging)}</li>
                            <li>dev: {unknown(versions.development)}</li>
                        </ul>
                    ) : (
                        <Unavailable what="environment versions" />
                    )}
                </Card>
                <Card title="Parity">
                    {parity ? (
                        <ul className="text-xs space-y-1 text-slate-300">
                            <li>In prod: {parity.fullyDeployed}</li>
                            <li>Staging pending: {parity.stagingPending}</li>
                            <li>Dev only: {parity.devOnly}</li>
                        </ul>
                    ) : (
                        <Unavailable what="parity" />
                    )}
                </Card>
                <Card title="Quality">
                    <div className="flex flex-wrap gap-2">
                        <StatusPill
                            ok={secureDb ? (secureDb.violations ? false : true) : null}
                            label={secureDb ? (secureDb.violations ? `secureDb: ${secureDb.violations} violations` : 'secureDb: ok') : 'secureDb: unknown'}
                        />
                        <StatusPill ok={e2e ? !e2e.hasNewFailures : null} label={e2e ? `e2e: ${e2e.status}` : 'e2e: unknown'} />
                        <StatusPill ok={null} label={deps ? 'deps: see Quality' : 'deps: unknown'} />
                    </div>
                </Card>
            </div>

            <Card title="Recent Commits">
                {data.git.recentCommits.available && data.git.recentCommits.data?.length ? (
                    <ul className="space-y-2">
                        {data.git.recentCommits.data.map((c) => (
                            <li key={c.hash} className="flex items-start gap-3 text-sm">
                                <GitBranch className="w-3.5 h-3.5 mt-1 text-slate-500 shrink-0" />
                                <span className="font-mono text-xs text-emerald-400">{c.hash}</span>
                                <span className="text-slate-300 flex-1 min-w-0 truncate">{c.message}</span>
                                <span className="text-xs text-slate-500 shrink-0">{new Date(c.date).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Unavailable what="recent commits" />
                )}
            </Card>

            <p className="text-xs text-slate-500">Last refresh: {new Date(data.generatedAt).toLocaleString()}</p>
        </div>
    );
}

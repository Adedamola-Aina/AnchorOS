import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { DependencyHealth } from './DependencyHealth';

interface Snapshot<T> {
    available: boolean;
    data?: T;
    error?: string;
}

interface QualityResponse {
    coverage: Snapshot<{ available?: boolean; summary?: Record<string, unknown> }>;
    functionsCoverage: Snapshot<Record<string, unknown>>;
    dependencies: Snapshot<Record<string, unknown>>;
    secureDb: Snapshot<{ violations?: number; compliant?: boolean }>;
    quality: Snapshot<{ issues?: number }>;
    bundle: Snapshot<{ available?: boolean }>;
    e2e: Snapshot<{ available: boolean; status: string; hasNewFailures: boolean; summary?: { total: number; passed: number; failed: number } }>;
    generatedAt: string;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="card">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
            {children}
        </div>
    );
}

function Unavailable() {
    return <p className="text-slate-400 text-xs text-amber-400/80">unavailable — no generated report found</p>;
}

function Pill({ ok, label }: { ok: boolean | null; label: string }) {
    const cls = ok === null
        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
        : ok
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
            : 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    return <span className={`px-2 py-0.5 rounded-full text-xs border ${cls}`}>{label}</span>;
}

export function QualityTab() {
    const [data, setData] = useState<QualityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<QualityResponse>('/api/quality')
            .then((res) => setData(res.data))
            .catch(() => setError('Failed to load quality data'))
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

    const e2e = data.e2e.available ? data.e2e.data : null;
    const secureDb = data.secureDb.available ? data.secureDb.data : null;
    const coverage = data.coverage.available ? data.coverage.data : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                <Pill ok={secureDb ? (secureDb.violations ? false : true) : null} label={secureDb ? (secureDb.violations ? `secureDb: ${secureDb.violations} violations` : 'secureDb: ok') : 'secureDb: unknown'} />
                <Pill ok={e2e ? !e2e.hasNewFailures : null} label={e2e ? `e2e: ${e2e.status}` : 'e2e: unknown'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Section title="Coverage">
                    {coverage?.summary ? (
                        <pre className="text-xs text-slate-300 overflow-x-auto">{JSON.stringify(coverage.summary, null, 2)}</pre>
                    ) : (
                        <Unavailable />
                    )}
                </Section>
                <Section title="Functions Coverage">
                    {data.functionsCoverage.available ? (
                        <pre className="text-xs text-slate-300 overflow-x-auto">{JSON.stringify(data.functionsCoverage.data, null, 2)}</pre>
                    ) : (
                        <Unavailable />
                    )}
                </Section>
                <Section title="Dependency Health">
                    {data.dependencies.available ? <DependencyHealth /> : <Unavailable />}
                </Section>
                <Section title="Bundle Size">
                    {data.bundle.available ? (
                        <pre className="text-xs text-slate-300 overflow-x-auto">{JSON.stringify(data.bundle.data, null, 2)}</pre>
                    ) : (
                        <Unavailable />
                    )}
                </Section>
                <Section title="E2E">
                    {e2e ? (
                        <div className="text-xs text-slate-300 space-y-1">
                            <p>status: {e2e.status}</p>
                            {e2e.summary && (
                                <p>
                                    {e2e.summary.passed}/{e2e.summary.total} passed, {e2e.summary.failed} failed
                                </p>
                            )}
                        </div>
                    ) : (
                        <Unavailable />
                    )}
                </Section>
                <Section title="Code Quality">
                    {data.quality.available ? (
                        <pre className="text-xs text-slate-300 overflow-x-auto">{JSON.stringify(data.quality.data, null, 2)}</pre>
                    ) : (
                        <Unavailable />
                    )}
                </Section>
            </div>

            <p className="text-xs text-slate-500">Last refresh: {new Date(data.generatedAt).toLocaleString()}</p>
        </div>
    );
}

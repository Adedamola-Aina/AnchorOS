import { AlertTriangle, Activity, CheckCircle2, Plug, ShieldCheck } from 'lucide-react';
import type { CommandCenterData } from './commandCenter.types';

interface CommandCenterIntelligencePanelProps {
    intelligence?: CommandCenterData['intelligence'];
}

function trustBadgeClass(status: string): string {
    if (status === 'high') return 'bg-emerald-900/30 text-emerald-300 border-emerald-500/40';
    if (status === 'medium') return 'bg-amber-900/30 text-amber-300 border-amber-500/40';
    if (status === 'low') return 'bg-red-900/30 text-red-300 border-red-500/40';
    return 'bg-slate-800 text-slate-300 border-slate-600';
}

function eventLevelClass(level: string): string {
    if (level === 'critical') return 'text-red-300';
    if (level === 'warning') return 'text-amber-300';
    return 'text-slate-300';
}

export function CommandCenterIntelligencePanel({ intelligence }: CommandCenterIntelligencePanelProps) {
    if (!intelligence) {
        return null;
    }

    const integrationEntries = Object.entries(intelligence.integrations.providers || {});

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card lg:col-span-1 bg-slate-900/60 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h3 className="font-semibold">Trust Score</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-md border text-xs uppercase tracking-wide ${trustBadgeClass(intelligence.trust.status)}`}>
                        {intelligence.trust.status}
                    </span>
                </div>

                <p className="text-4xl font-bold text-white mb-2">{intelligence.trust.score}</p>
                <p className="text-xs text-slate-400 mb-3">0-100 truthfulness index</p>

                <div className="space-y-2">
                    {intelligence.trust.anomalies.length === 0 ? (
                        <div className="text-sm text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            No active anomalies
                        </div>
                    ) : (
                        intelligence.trust.anomalies.slice(0, 4).map((anomaly) => (
                            <div key={anomaly.key} className="text-xs bg-slate-800/70 border border-slate-700 rounded-md p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-slate-300 font-medium">{anomaly.key}</span>
                                    <span className="text-red-300">-{anomaly.impact}</span>
                                </div>
                                <p className="text-slate-400">{anomaly.detail}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="card lg:col-span-1 bg-slate-900/60 border border-slate-700">
                <div className="flex items-center gap-2 mb-3 text-slate-200">
                    <Plug className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold">Integrations</h3>
                </div>

                <div className="text-sm text-slate-300 mb-3">
                    {intelligence.integrations.summary.configured}/{intelligence.integrations.summary.total} configured
                </div>

                <div className="space-y-2">
                    {integrationEntries.map(([provider, info]) => (
                        <div key={provider} className="bg-slate-800/70 border border-slate-700 rounded-md p-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-200">{info.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${info.configured ? 'bg-emerald-900/30 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                    {info.configured ? 'configured' : 'dry-run'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Last event: {info.lastEventAt ? new Date(info.lastEventAt).toLocaleString() : 'none'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card lg:col-span-1 bg-slate-900/60 border border-slate-700">
                <div className="flex items-center gap-2 mb-3 text-slate-200">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h3 className="font-semibold">Event Ingestion</h3>
                </div>

                <p className="text-sm text-slate-300 mb-1">{intelligence.ingestion.eventsLast24h} events / 24h</p>
                <p className="text-xs text-slate-400 mb-3">
                    Latest: {intelligence.ingestion.latestEventAt ? new Date(intelligence.ingestion.latestEventAt).toLocaleString() : 'none'}
                </p>

                <div className="space-y-2 max-h-60 overflow-auto pr-1">
                    {(intelligence.ingestion.recentEvents || []).slice(0, 8).map((event) => (
                        <div key={event.id} className="bg-slate-800/70 border border-slate-700 rounded-md p-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className={eventLevelClass(event.level)}>{event.level}</span>
                                <span className="text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-slate-300">{event.message}</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                                {event.source} • {event.type}
                            </p>
                        </div>
                    ))}
                    {(intelligence.ingestion.recentEvents || []).length === 0 && (
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            No recent events captured yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

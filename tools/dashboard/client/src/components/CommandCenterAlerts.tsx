import { ArrowRight, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { getSeverityIcon, getSeverityStyle, getTargetTab } from './commandCenter.helpers';
import type { CommandCenterData } from './commandCenter.types';

interface CommandCenterAlertsProps {
    alerts: CommandCenterData['alerts'];
    expandedAlerts: Set<number>;
    setExpandedAlerts: Dispatch<SetStateAction<Set<number>>>;
    onNavigate?: (tab: string) => void;
}

function renderArchViolationDetails(
    details: NonNullable<CommandCenterData['alerts']['items'][number]['details']>,
    isExpanded: boolean,
) {
    const visibleItems = isExpanded ? details : details.slice(0, 3);
    const hiddenCount = details.length - 3;

    return (
        <>
            {visibleItems.map((detail, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/50 px-2 py-1 rounded">
                    <span className="text-slate-300 font-mono truncate">{detail.path}</span>
                    <span className={`font-medium ${detail.status === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                        {detail.lines} lines
                    </span>
                </div>
            ))}
            {hiddenCount > 0 && (
                <span className="text-xs text-slate-500">+{hiddenCount} hidden</span>
            )}
        </>
    );
}

function renderDepsDetails(
    details: NonNullable<CommandCenterData['alerts']['items'][number]['details']>,
    isExpanded: boolean,
) {
    const visibleItems = isExpanded ? details : details.slice(0, 3);
    const hiddenCount = details.length - 3;

    return (
        <>
            {visibleItems.map((detail, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/50 px-2 py-1 rounded">
                    <span className="text-slate-300 font-mono">{detail.name}</span>
                    <span className="text-slate-400">
                        <span className="text-red-400">{detail.current}</span>
                        <span className="mx-1">→</span>
                        <span className="text-emerald-400">{detail.latest}</span>
                    </span>
                </div>
            ))}
            {hiddenCount > 0 && (
                <span className="text-xs text-slate-500">+{hiddenCount} hidden</span>
            )}
        </>
    );
}

export function CommandCenterAlerts({
    alerts,
    expandedAlerts,
    setExpandedAlerts,
    onNavigate,
}: CommandCenterAlertsProps) {
    if (alerts.count === 0) {
        return null;
    }

    const toggleExpanded = (idx: number) => {
        setExpandedAlerts((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) {
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Needs Attention ({alerts.count})
            </h3>
            <div className="grid gap-3">
                {alerts.items.map((alert, idx) => {
                    const targetTab = getTargetTab(alert.type);
                    const isExpanded = expandedAlerts.has(idx);

                    return (
                        <div key={idx} className={`w-full text-left p-4 rounded-lg border ${getSeverityStyle(alert.severity)}`}>
                            <div className="flex items-start gap-3">
                                {getSeverityIcon(alert.severity)}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-white">{alert.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{alert.date}</span>
                                            {targetTab && (
                                                <button
                                                    onClick={() => onNavigate?.(targetTab)}
                                                    className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-emerald-400 transition-colors"
                                                >
                                                    View →
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {alert.details && alert.details.length > 0 ? (
                                        <div className="mt-2 space-y-1">
                                            {(alert.type === 'arch_violation' || alert.type === 'arch_violation_critical') && renderArchViolationDetails(alert.details, isExpanded)}
                                            {alert.type === 'deps_outdated' && renderDepsDetails(alert.details, isExpanded)}
                                            {alert.details.length > 3 && (
                                                <button
                                                    onClick={() => toggleExpanded(idx)}
                                                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mt-1"
                                                >
                                                    {isExpanded ? (
                                                        <><ChevronUp className="w-3 h-3" /> Show less</>
                                                    ) : (
                                                        <><ChevronDown className="w-3 h-3" /> +{alert.details.length - 3} more</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                                    )}

                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                        <span className="text-slate-500">Source: {alert.source}</span>
                                        <span className="text-emerald-400 flex items-center gap-1">
                                            <ArrowRight className="w-3 h-3" />
                                            {alert.action}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

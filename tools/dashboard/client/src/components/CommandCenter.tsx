// @ts-nocheck
import { RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';
import { CommandCenterAlerts } from './CommandCenterAlerts';
import { CommandCenterIntelligencePanel } from './CommandCenterIntelligencePanel';
import { CommandCenterStatsGrid } from './CommandCenterStatsGrid';
import { IntakeForm } from './IntakeForm';
import { useCommandCenterData } from './useCommandCenterData';

interface CommandCenterProps {
    onNavigate?: (tab: string) => void;
}

export function CommandCenter({ onNavigate }: CommandCenterProps) {
    const { data, loading, lastRefresh, fetchData } = useCommandCenterData();
    const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set());

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="card text-red-400">Failed to load command center</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    Command Center
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Single source of truth • Updated {lastRefresh?.toLocaleTimeString() || 'just now'}
                </p>
            </div>

            <IntakeForm onSubmit={fetchData} />
            <CommandCenterAlerts
                alerts={data.alerts}
                expandedAlerts={expandedAlerts}
                setExpandedAlerts={setExpandedAlerts}
                onNavigate={onNavigate}
            />
            <CommandCenterStatsGrid work={data.work} dependencies={data.dependencies} codeHealth={data.codeHealth} />
            <CommandCenterIntelligencePanel intelligence={data.intelligence} />
        </div>
    );
}

export default CommandCenter;

export interface CommandCenterAlertDetail {
    path?: string;
    lines?: number;
    name?: string;
    current?: string;
    latest?: string;
    status?: string;
}

export interface CommandCenterAlert {
    type: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    action: string;
    source: string;
    date: string;
    details?: CommandCenterAlertDetail[];
}

export interface CommandCenterWorkItem {
    id: string;
    title: string;
    type: string;
    date?: string;
    priority?: string;
    status?: string;
}

export interface CommandCenterData {
    generatedAt: string;
    date: string;
    alerts: {
        count: number;
        critical: number;
        warning: number;
        info: number;
        items: CommandCenterAlert[];
    };
    work: {
        completedThisWeek: number;
        inProgress: number;
        upcoming: number;
        velocity: number;
        cycleTime: number;
        details: {
            doneThisWeek: CommandCenterWorkItem[];
            inProgress: CommandCenterWorkItem[];
            upcoming: CommandCenterWorkItem[];
            stats: {
                totalItems: number;
                totalBugs: number;
                criticalBugs: number;
                totalFeatures: number;
            };
        };
    };
    environments: {
        versions: { production: string; staging: string; development: string };
        parity: { devOnly: number; stagingPending: number; synced: boolean };
        lastDeployment: string | null;
        history: { date: string; version: string; environment: string; changes: string }[];
    };
    dependencies: {
        status: string;
        outdated: number;
        vulnerabilities: number;
        lastChecked: string;
    };
    codeHealth: {
        exceeding: number;
        approaching: number;
        healthy: number;
        topRiskFiles: {
            path: string;
            lines: number;
            status: string;
        }[];
    };
    gitActivity: {
        last7Days: { date: string; commits: number; features: number }[];
    };
    intelligence?: {
        trust: {
            score: number;
            status: 'high' | 'medium' | 'low' | 'unknown';
            anomalies: {
                key: string;
                pass?: boolean;
                impact: number;
                detail: string;
            }[];
        };
        integrations: {
            providers: Record<string, {
                name: string;
                configured: boolean;
                lastEventAt: string | null;
                lastEventType: string | null;
            }>;
            summary: {
                total: number;
                configured: number;
                webhookSecretsConfigured?: number;
                strictWebhookMode?: boolean;
            };
        };
        ingestion: {
            eventsLast24h: number;
            latestEventAt: string | null;
            recentEvents: {
                id: string;
                timestamp: string;
                source: string;
                type: string;
                level: 'critical' | 'warning' | 'info';
                message: string;
                status: string;
                entityId?: string | null;
                payload?: Record<string, unknown>;
            }[];
        };
    };
}

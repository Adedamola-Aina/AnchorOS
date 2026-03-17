import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export function getSeverityIcon(severity: string): JSX.Element {
    switch (severity) {
        case 'critical':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-amber-500" />;
        default:
            return <Info className="w-5 h-5 text-blue-500" />;
    }
}

export function getSeverityStyle(severity: string): string {
    switch (severity) {
        case 'critical':
            return 'bg-red-900/30 border-red-500/50';
        case 'warning':
            return 'bg-amber-900/30 border-amber-500/50';
        default:
            return 'bg-blue-900/30 border-blue-500/50';
    }
}

export function getTargetTab(type: string): string | null {
    switch (type) {
        case 'critical_bug':
        case 'stale_bug':
            return 'kanban';
        case 'env_drift':
            return 'parity';
        case 'arch_violation':
        case 'arch_violation_critical':
            return 'docs';
        default:
            return null;
    }
}

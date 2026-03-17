import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export function getConfidenceIcon(confidence: string) {
  switch (confidence) {
    case 'high':
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'medium':
      return <Info className="w-4 h-4 text-blue-400" />;
    case 'low':
      return <AlertCircle className="w-4 h-4 text-amber-400" />;
    default:
      return null;
  }
}

export function getConfidenceBadge(confidence: string) {
  const styles = {
    high: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50',
    medium: 'bg-blue-900/30 text-blue-400 border-blue-500/50',
    low: 'bg-amber-900/30 text-amber-400 border-amber-500/50',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${styles[confidence as keyof typeof styles]}`}>
      {confidence}
    </span>
  );
}

export function getPriorityBadge(priority: string) {
  const styles = {
    P0: 'bg-red-900/30 text-red-400 border-red-500/50',
    P1: 'bg-amber-900/30 text-amber-400 border-amber-500/50',
    P2: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50',
    P3: 'bg-slate-900/30 text-slate-400 border-slate-500/50',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${styles[priority as keyof typeof styles] || styles.P3}`}>
      {priority}
    </span>
  );
}

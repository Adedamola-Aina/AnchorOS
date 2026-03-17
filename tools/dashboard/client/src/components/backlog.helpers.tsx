import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Lightbulb,
  Megaphone,
  Palette,
  Server,
  Shield,
  Smartphone,
  Target,
  TestTube,
  Users,
  Zap,
} from 'lucide-react';

export function getTeamIcon(team: string) {
  const t = team.toLowerCase();
  if (t === 'product') return <Target className="w-4 h-4" />;
  if (t === 'engineering') return <Zap className="w-4 h-4" />;
  if (t === 'architecture' || t === 'devops') return <Server className="w-4 h-4" />;
  if (t === 'security' || t === 'auth') return <Shield className="w-4 h-4" />;
  if (t === 'database') return <Database className="w-4 h-4" />;
  if (t === 'qa') return <TestTube className="w-4 h-4" />;
  if (t === 'mobile' || t === 'platform') return <Smartphone className="w-4 h-4" />;
  if (t === 'design') return <Palette className="w-4 h-4" />;
  if (t === 'innovation') return <Lightbulb className="w-4 h-4" />;
  if (t === 'data') return <BarChart3 className="w-4 h-4" />;
  if (t === 'marketing') return <Megaphone className="w-4 h-4" />;
  return <Users className="w-4 h-4" />;
}

export function getPriorityColor(priority: string): string {
  if (priority === 'P0') return 'bg-red-500/20 text-red-400 border-red-500/50';
  if (priority === 'P1') return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
  if (priority === 'P2') return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
}

export function getStatusIcon(status: string, detected?: boolean) {
  if (status === 'completed' || status === 'deployed') {
    return detected
      ? <span title="Auto-detected from git"><CheckCircle className="w-4 h-4 text-emerald-400" /></span>
      : <CheckCircle className="w-4 h-4 text-emerald-500" />;
  }
  if (status === 'in-progress' || status === 'staging') return <Clock className="w-4 h-4 text-blue-400" />;
  return <AlertCircle className="w-4 h-4 text-slate-500" />;
}

export function getTypeColor(type: string): string {
  if (type === 'feature') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (type === 'enhancement' || type === 'ux') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  if (type === 'bug') return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (type === 'architecture') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

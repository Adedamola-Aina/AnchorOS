import {
  Bug,
  Lightbulb,
  Palette,
  Shield,
  Server,
  Smartphone,
} from 'lucide-react';

export interface IntakeTypeOption {
  value: string;
  label: string;
  icon: typeof Bug;
  color: string;
}

export interface IntakePriorityOption {
  value: string;
  label: string;
  color: string;
}

export const INTAKE_TYPES: IntakeTypeOption[] = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-blue-400' },
  { value: 'enhancement', label: 'UX Enhancement', icon: Palette, color: 'text-purple-400' },
  { value: 'security', label: 'Security Issue', icon: Shield, color: 'text-amber-400' },
  { value: 'architecture', label: 'Architecture', icon: Server, color: 'text-indigo-400' },
  { value: 'mobile', label: 'Mobile/PWA', icon: Smartphone, color: 'text-cyan-400' },
];

export const INTAKE_PRIORITIES: IntakePriorityOption[] = [
  { value: 'P0', label: 'P0 - Critical', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
  { value: 'P1', label: 'P1 - High', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
  { value: 'P2', label: 'P2 - Medium', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  { value: 'P3', label: 'P3 - Low', color: 'bg-slate-500/20 text-slate-400 border-slate-500/50' },
];

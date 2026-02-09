import React from 'react';
import { Sunrise, Sun, Moon } from 'lucide-react';
import type { AnchorTask } from '../../types';
export { ThemeToggle, type Theme } from './ThemeToggle';
export { ToggleSwitch } from './ToggleSwitch';
export { CategoryIcon } from './CategoryIcon';
export { FabricSuggestionToast, FabricSuggestionContainer } from './FabricSuggestionToast';
export { Skeleton, SkeletonCard, SkeletonListItem, SkeletonDashboard, SkeletonFinance, SkeletonCommitments, SkeletonSettings } from './Skeleton';
export { EmptyState, type EmptyStatePreset } from './EmptyState';
export { LoadingBoundary, InlineLoading, PageLoading } from './LoadingBoundary';

// formatCurrency moved to ../../utils/format.ts

export const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle: string, action?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
    <div>
      <h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

export const Badge = ({ children, type, variant = 'solid' }: { children: React.ReactNode, type: string, variant?: 'solid' | 'outline' }) => {
  const styles: Record<string, string> = {
    personal: 'bg-anchor-personal-light text-anchor-personal dark:bg-anchor-personal-dark/30 dark:text-anchor-personal-light',
    family: 'bg-anchor-family-light text-anchor-family dark:bg-anchor-family-dark/30 dark:text-anchor-family-light',
    checking: 'bg-anchor-success-light text-anchor-success dark:bg-anchor-success-dark/30 dark:text-anchor-success-light',
    savings: 'bg-anchor-finance-light text-anchor-finance dark:bg-anchor-finance-dark/30 dark:text-anchor-finance-light',
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const baseStyle = styles[type] || styles.todo;
  const finalStyle = variant === 'outline'
    ? `border ${baseStyle.replace('bg-', 'border-').replace('text-', 'text-')} bg-transparent`
    : baseStyle;

  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${finalStyle}`}>{children}</span>;
};

export const TaskContextBadge = ({ task }: { task: AnchorTask }) => {
  const commonStyles = "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize shrink-0";

  const content = (() => {
    if (task.type === 'daily' && task.timeOfDay && task.timeOfDay !== 'any') {
      const icons = { morning: <Sunrise className="w-3 h-3 shrink-0" />, afternoon: <Sun className="w-3 h-3 shrink-0" />, evening: <Moon className="w-3 h-3 shrink-0" /> };
      // Dynamic: show text by default, text truncates/hides when space is tight
      return (
        <span className={`${commonStyles} text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 max-w-[80px] overflow-hidden`}>
          {icons[task.timeOfDay]}
          <span className="truncate">{task.timeOfDay}</span>
        </span>
      );
    }
    if (task.type === 'weekly' && task.daysOfWeek && task.daysOfWeek.length > 0) {
      const dayShortnames: Record<string, string> = {
        'Sunday': 'Su', 'Monday': 'M', 'Tuesday': 'Tu', 'Wednesday': 'W', 'Thursday': 'Th', 'Friday': 'F', 'Saturday': 'Sa'
      };
      const days = task.daysOfWeek.map(d => dayShortnames[d] || d.charAt(0));
      // Show max 3 days, then +N more
      const maxShow = 3;
      const display = days.length <= maxShow
        ? days.join(' ')
        : `${days.slice(0, maxShow).join(' ')} +${days.length - maxShow}`;
      return <span className={`${commonStyles} text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20`}>{display}</span>;
    }
    if (task.type === 'monthly' && (task.daysOfMonth?.length || task.dayOfMonth)) {
      const allDates = task.daysOfMonth?.length ? [...task.daysOfMonth] : (task.dayOfMonth ? [task.dayOfMonth] : []);
      // Filter out past days (current month only)
      const today = new Date().getDate();
      const upcomingDates = allDates.filter(d => d >= today).sort((a, b) => a - b);
      // Show max 5 upcoming days
      const maxShow = 5;
      if (upcomingDates.length === 0) {
        return null; // All days passed
      }
      const display = upcomingDates.length <= maxShow
        ? upcomingDates.join(', ')
        : `${upcomingDates.slice(0, maxShow).join(', ')} +${upcomingDates.length - maxShow}`;
      return <span className={`${commonStyles} text-task-600 dark:text-task-400 bg-task-50 dark:bg-task-900/20`}>{display}</span>;
    }
    return null;
  })();

  // Simplified: only show context badge, domain hidden for compact view
  return content;
};

export const AnchorLogo = ({ className = "w-8 h-8", strokeWidth = 8 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="22" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
    <line x1="50" y1="32" x2="50" y2="85" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M20 58 C20 85 80 85 80 58" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    <line x1="20" y1="58" x2="20" y2="48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="80" y1="58" x2="80" y2="48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

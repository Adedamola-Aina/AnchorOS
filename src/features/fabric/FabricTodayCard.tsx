import React from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import type { TodayStats } from '../../types/fabricBriefing';

interface FabricTodayCardProps {
  todayStats: TodayStats;
  onOpenCommitments: () => void;
}

export const FabricTodayCard: React.FC<FabricTodayCardProps> = ({ todayStats, onOpenCommitments }) => {
  const { totalTasks, completedTasks, pendingTasks, streakHighlight } = todayStats;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allDone = pendingTasks === 0 && totalTasks > 0;

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Today</p>
        {streakHighlight && (
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
            <Flame className="w-3.5 h-3.5" />
            {streakHighlight.days}d streak
          </span>
        )}
      </div>

      {totalTasks === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No tasks scheduled today.</p>
      ) : (
        <>
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className={allDone ? 'font-semibold text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}>
                {allDone ? 'All done!' : `${completedTasks} of ${totalTasks} done`}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-primary-500'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Pending count or completion message */}
          {pendingTasks > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Circle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{pendingTasks} task{pendingTasks === 1 ? '' : 's'} remaining</span>
            </div>
          )}
          {allDone && streakHighlight && (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>"{streakHighlight.title}" — {streakHighlight.days} days strong</span>
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onOpenCommitments}
        className="w-full min-h-11 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Open commitments
      </button>
    </article>
  );
};

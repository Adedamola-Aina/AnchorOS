import React from 'react';
import { CalendarClock } from 'lucide-react';
import type { UpcomingItem } from '../../types/fabricBriefing';
import type { Currency } from '../../services/fabric/fabricUtils';
import { formatCents } from '../../services/fabric/fabricUtils';

interface FabricUpcomingCardProps {
  items: UpcomingItem[];
  currency: Currency;
}

function dueBadge(item: UpcomingItem): { label: string; className: string } {
  if (item.isToday) return { label: 'Today', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  if (item.isTomorrow) return { label: 'Tomorrow', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  return {
    label: `In ${item.daysUntil}d`,
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
}

export const FabricUpcomingCard: React.FC<FabricUpcomingCardProps> = ({ items, currency }) => {
  if (items.length === 0) return null;

  return (
    <section className="space-y-2">
      <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Coming Up</p>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {items.slice(0, 5).map((item) => {
          const badge = dueBadge(item);
          return (
            <div key={item.id} className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <CalendarClock className="w-4 h-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                  {item.category && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">{item.category}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.amountCents != null && (
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {formatCents(item.amountCents, currency)}
                  </span>
                )}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

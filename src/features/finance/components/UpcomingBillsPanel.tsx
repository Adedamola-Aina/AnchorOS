// @ts-nocheck
import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import type { RecurringTransaction } from '../../../types';
import { fromCents } from '../../../utils/moneyUtils';
import { getUpcomingBills } from '../utils/billReminderUtils';

interface UpcomingBillsPanelProps {
  bills: RecurringTransaction[];
  windowDays?: number;
}

function formatDueDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
}

export const UpcomingBillsPanel: React.FC<UpcomingBillsPanelProps> = ({
  bills,
  windowDays = 7,
}) => {
  const upcoming = getUpcomingBills(bills, windowDays);

  if (upcoming.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Upcoming Bills
        </h4>
      </div>
      <div className="space-y-2">
        {upcoming.map((bill) => {
          const dueLabel = formatDueDate(bill.nextRunAt);
          const isUrgent = dueLabel.includes('today') || dueLabel.includes('tomorrow');
          return (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isUrgent
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {isUrgent && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {bill.title}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}
                    data-testid="bill-due-date"
                  >
                    {dueLabel} · {bill.frequency}
                  </p>
                </div>
              </div>
              <span
                className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0"
                data-testid="bill-amount"
              >
                {fromCents(bill.amountCents).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

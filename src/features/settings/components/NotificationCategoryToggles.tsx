/**
 * NotificationCategoryToggles - Per-category notification controls
 * Allows users to opt-in/out of finance, commitments, and family notifications.
 */

import React from 'react';
import { Wallet, CheckSquare, Users } from 'lucide-react';

export interface CategoryPreferences {
  finance: boolean;
  commitments: boolean;
  family: boolean;
}

interface Props {
  categories: CategoryPreferences;
  onToggle: (category: keyof CategoryPreferences, enabled: boolean) => void;
}

const CATEGORIES: { key: keyof CategoryPreferences; label: string; desc: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: 'finance', label: 'Finance', desc: 'Transactions, budgets, and account alerts', Icon: Wallet },
  { key: 'commitments', label: 'Commitments', desc: 'Task reminders and streak updates', Icon: CheckSquare },
  { key: 'family', label: 'Family', desc: 'Invitations, shared account activity', Icon: Users },
];

export const NotificationCategoryToggles: React.FC<Props> = ({ categories, onToggle }) => (
  <div className="space-y-4">
    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Notification Categories</p>
    {CATEGORIES.map(({ key, label, desc, Icon }) => (
      <div key={key} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
          </div>
        </div>
        <button
          onClick={() => onToggle(key, !categories[key])}
          className={`relative inline-flex min-h-11 h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${categories[key] ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          aria-label={`Toggle ${label} notifications`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${categories[key] ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    ))}
  </div>
);

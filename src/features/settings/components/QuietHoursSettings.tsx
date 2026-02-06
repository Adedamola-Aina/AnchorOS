/**
 * QuietHoursSettings - Do Not Disturb / Quiet Hours configuration.
 * Allows users to set a time range during which push notifications are suppressed.
 */

import React from 'react';
import { Moon } from 'lucide-react';

export interface QuietHoursPreferences {
  enabled: boolean;
  startTime: string; // HH:mm format, e.g. "22:00"
  endTime: string;   // HH:mm format, e.g. "07:00"
}

interface Props {
  preferences: QuietHoursPreferences;
  onUpdate: (prefs: Partial<QuietHoursPreferences>) => void;
}

export const QuietHoursSettings: React.FC<Props> = ({ preferences, onUpdate }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
          <Moon className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Quiet Hours</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Suppress push notifications during set hours</p>
        </div>
      </div>
      <button
        onClick={() => onUpdate({ enabled: !preferences.enabled })}
        className={`relative inline-flex min-h-11 h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        aria-label="Toggle quiet hours"
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>

    {preferences.enabled && (
      <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 pl-10">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">From</label>
          <input
            type="time"
            value={preferences.startTime}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <span className="text-slate-400 text-sm">to</span>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Until</label>
          <input
            type="time"
            value={preferences.endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>
    )}
  </div>
);

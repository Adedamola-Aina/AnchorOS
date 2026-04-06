/**
 * QuietHoursSettings - Do Not Disturb / Quiet Hours configuration.
 * Allows users to set a time range during which push notifications are suppressed.
 */
// @ts-nocheck


import React from 'react';
import { Moon } from 'lucide-react';
import { ToggleSwitch, TimeWheelPicker } from '../../../components/shared';

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
      <ToggleSwitch
        enabled={preferences.enabled}
        onToggle={() => onUpdate({ enabled: !preferences.enabled })}
        label="Toggle quiet hours"
        activeColor="bg-indigo-500"
      />
    </div>

    {preferences.enabled && (
      <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-wrap items-center gap-3 pl-10">
        <TimeWheelPicker
          label="From"
          value={preferences.startTime}
          onChange={(v) => onUpdate({ startTime: v })}
          placeholder="Start"
          testId="quiet-start-time"
        />
        <span className="text-slate-400 text-sm">to</span>
        <TimeWheelPicker
          label="Until"
          value={preferences.endTime}
          onChange={(v) => onUpdate({ endTime: v })}
          placeholder="End"
          testId="quiet-end-time"
        />
      </div>
    )}
  </div>
);

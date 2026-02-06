/**
 * AccessibilityControls - Font size, high contrast, and reduced motion settings.
 * Persisted through profile preferences, applied via CSS custom properties + classes.
 */

import React from 'react';
import { Type, Eye, Zap } from 'lucide-react';

export interface AccessibilityPreferences {
  fontSize: 'default' | 'large' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
}

interface Props {
  preferences: AccessibilityPreferences;
  onUpdate: (prefs: Partial<AccessibilityPreferences>) => void;
}

const FONT_SIZES: { value: AccessibilityPreferences['fontSize']; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

export const AccessibilityControls: React.FC<Props> = ({ preferences, onUpdate }) => (
  <div className="space-y-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Accessibility</p>

    {/* Font Size */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Type className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Font Size</p>
          <p className="text-xs text-slate-400">Adjust text size across the app</p>
        </div>
      </div>
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
        {FONT_SIZES.map(({ value, label }) => (
          <button key={value} onClick={() => onUpdate({ fontSize: value })}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${preferences.fontSize === value ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* High Contrast */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Eye className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">High Contrast</p>
          <p className="text-xs text-slate-400">Increase border and text contrast</p>
        </div>
      </div>
      <button onClick={() => onUpdate({ highContrast: !preferences.highContrast })}
        className={`relative inline-flex min-h-11 h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.highContrast ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        aria-label="Toggle high contrast">
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>

    {/* Reduced Motion */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Zap className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Reduced Motion</p>
          <p className="text-xs text-slate-400">Minimize animations and transitions</p>
        </div>
      </div>
      <button onClick={() => onUpdate({ reducedMotion: !preferences.reducedMotion })}
        className={`relative inline-flex min-h-11 h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${preferences.reducedMotion ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        aria-label="Toggle reduced motion">
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  </div>
);

/**
 * AccessibilityControls - Font size, high contrast, and reduced motion settings.
 * Persisted through profile preferences, applied via CSS custom properties + classes.
 */

import React from 'react';
import { Type, Eye, Zap } from 'lucide-react';
import { ToggleSwitch } from '../../../components/shared';

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
    <div className="flex items-center justify-between gap-3">
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
      <ToggleSwitch enabled={preferences.highContrast} onToggle={() => onUpdate({ highContrast: !preferences.highContrast })} label="Toggle high contrast" />
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
      <ToggleSwitch enabled={preferences.reducedMotion} onToggle={() => onUpdate({ reducedMotion: !preferences.reducedMotion })} label="Toggle reduced motion" />
    </div>
  </div>
);

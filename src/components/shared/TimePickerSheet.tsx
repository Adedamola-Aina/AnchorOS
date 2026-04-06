/**
 * TimePickerSheet — Scroll-wheel time picker rendered in a portal.
 * Extracted from TimeWheelPicker for ARCH-001 compliance.
 * Hour/minute/period columns with 44px touch targets per Apple HIG.
 */

import React, { useEffect } from 'react';

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

interface TimePickerSheetProps {
  displayTime: string;
  selHour: number;
  selMinute: number;
  selPeriod: 'AM' | 'PM';
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onPeriodChange: (p: 'AM' | 'PM') => void;
  onDone: () => void;
  onClear: () => void;
  onClose: () => void;
}

export const TimePickerSheet: React.FC<TimePickerSheetProps> = ({
  displayTime,
  selHour,
  selMinute,
  selPeriod,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onDone,
  onClear,
  onClose,
}) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const colClass = (active: boolean) =>
    `w-14 min-h-[44px] rounded-xl text-center font-semibold transition-all ${
      active
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Time picker">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-sm mx-4 mb-safe animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
        <div className="rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onClear}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 min-h-[44px] flex items-center">
              Clear
            </button>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {displayTime || 'Set Time'}
            </span>
            <button type="button" onClick={onDone}
              className="text-sm font-bold text-primary-600 dark:text-primary-400 min-h-[44px] flex items-center">
              Done
            </button>
          </div>

          {/* Wheel columns */}
          <div className="flex gap-1 px-4 py-6 justify-center" data-testid="time-wheel-columns">
            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto overscroll-contain rounded-xl px-1">
              {HOURS_12.map((h) => (
                <button key={h} type="button" onClick={() => onHourChange(h)}
                  className={`${colClass(selHour === h)} text-lg`}>
                  {h}
                </button>
              ))}
            </div>

            <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 self-center px-1">:</span>

            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto overscroll-contain rounded-xl px-1">
              {MINUTES.map((m) => (
                <button key={m} type="button" onClick={() => onMinuteChange(m)}
                  className={`${colClass(selMinute === m)} text-lg`}>
                  {String(m).padStart(2, '0')}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1 justify-center ml-2">
              {(['AM', 'PM'] as const).map((p) => (
                <button key={p} type="button" onClick={() => onPeriodChange(p)}
                  className={`${colClass(selPeriod === p)} text-sm font-bold`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

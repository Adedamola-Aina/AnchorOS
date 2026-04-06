/**
 * DatePickerSheet — Calendar sheet rendered in a portal.
 * Extracted from InlineDatePicker for ARCH-001 compliance.
 * Month navigation with 44px touch targets per Apple HIG.
 */

import React, { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface DatePickerSheetProps {
  viewYear: number;
  viewMonth: number;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  hasValue: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  onToday: () => void;
  onClose: () => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export const DatePickerSheet: React.FC<DatePickerSheetProps> = ({
  viewYear,
  viewMonth,
  selectedYear,
  selectedMonth,
  selectedDay,
  hasValue,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onToday,
  onClose,
}) => {
  const today = new Date();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const isToday = useCallback(
    (day: number) =>
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate(),
    [viewYear, viewMonth, today],
  );

  const isSelected = useCallback(
    (day: number) =>
      hasValue &&
      viewYear === selectedYear &&
      viewMonth === selectedMonth &&
      day === selectedDay,
    [hasValue, viewYear, viewMonth, selectedYear, selectedMonth, selectedDay],
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Date picker">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-sm mx-4 mb-safe animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
        <div className="rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-2xl">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onPrevMonth}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Previous month">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={onNextMonth}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Next month">
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5" data-testid="date-grid">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const todayMark = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onSelectDay(day)}
                  className={`w-full aspect-square max-w-[44px] mx-auto min-h-[44px] rounded-full text-sm font-medium flex items-center justify-center transition-all ${
                    selected
                      ? 'bg-primary-600 text-white font-bold'
                      : todayMark
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onToday}
              className="text-sm font-semibold text-primary-600 dark:text-primary-400 min-h-[44px] flex items-center">
              Today
            </button>
            <button type="button" onClick={onClose}
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-h-[44px] flex items-center">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

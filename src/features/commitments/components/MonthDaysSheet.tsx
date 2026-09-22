/**
 * MonthDaysSheet — the day-of-month picker, as a half sheet.
 *
 * What was wrong: choosing "which dates?" for a monthly commitment rendered a
 * 7×5 grid of 31 buttons *inside* the composer — a full calendar sitting in the
 * middle of a form. That is not how the platforms do it: a value this specific
 * belongs behind a row, revealed on demand in a sheet over the screen.
 *
 * So the composer now shows one row ("Days of the month · 1, 15 →"), and this
 * sheet owns the choosing. Multi-select, because a monthly commitment can fall
 * on more than one date, and the sheet stays open while you pick.
 */
// @ts-nocheck

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

interface MonthDaysSheetProps {
  isOpen: boolean;
  /** Currently selected days of the month (1–31). */
  value: number[];
  onChange: (days: number[]) => void;
  onClose: () => void;
}

export const MonthDaysSheet: React.FC<MonthDaysSheetProps> = ({ isOpen, value, onChange, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggle = (day: number) => {
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Days of the month">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        data-testid="month-days-sheet"
        className="relative z-10 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        <div className="rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-sm font-bold text-slate-800 dark:text-white">Days of the month</span>
            <button
              type="button"
              onClick={() => onChange([])}
              disabled={value.length === 0}
              className="min-h-[44px] px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          <div className="p-3 grid grid-cols-7 gap-1.5 max-h-[45vh] overflow-y-auto">
            {DAYS.map((day) => {
              const selected = value.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggle(day)}
                  aria-pressed={selected}
                  aria-label={`Day ${day}`}
                  data-testid={`month-day-${day}`}
                  className={`h-11 rounded-lg text-sm font-semibold transition-all ${
                    selected
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] rounded-xl bg-primary-600 text-white text-sm font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
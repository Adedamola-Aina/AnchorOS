/**
 * InlineDatePicker — iOS-style inline calendar date picker.
 * Replaces native <input type="date"> with a tappable trigger + calendar sheet.
 * Calendar sheet extracted to DatePickerSheet for ARCH-001 compliance.
 * 44px minimum touch targets per Apple HIG.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { DatePickerSheet } from './DatePickerSheet';

interface InlineDatePickerProps {
  value: string; // "YYYY-MM-DD" format
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function displayDate(str: string): string {
  if (!str) return '';
  const d = parseDate(str);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
  value,
  onChange,
  disabled,
  label,
  className = '',
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const selectedDate = value ? parseDate(value) : today;

  // Track previous value to sync view when parent changes value
  // React-approved pattern: https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevValue, setPrevValue] = useState(value);
  const [view, setView] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      const d = parseDate(value);
      setView({ year: d.getFullYear(), month: d.getMonth() });
    }
  }

  const prevMonth = useCallback(() => {
    setView((v) => v.month === 0
      ? { year: v.year - 1, month: 11 }
      : { year: v.year, month: v.month - 1 });
  }, []);

  const nextMonth = useCallback(() => {
    setView((v) => v.month === 11
      ? { year: v.year + 1, month: 0 }
      : { year: v.year, month: v.month + 1 });
  }, []);

  const handleSelect = useCallback(
    (day: number) => {
      const date = new Date(view.year, view.month, day);
      onChange(formatDate(date));
      setIsOpen(false);
    },
    [view.year, view.month, onChange],
  );

  const handleToday = useCallback(() => {
    onChange(formatDate(today));
    setIsOpen(false);
  }, [today, onChange]);

  return (
    <>
      {label && (
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        data-testid={testId}
        className={`flex items-center gap-2 px-3 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      >
        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
        <span className={value ? '' : 'text-slate-400'}>
          {value ? displayDate(value) : 'Select date'}
        </span>
      </button>

      {isOpen &&
        createPortal(
          <DatePickerSheet
            viewYear={view.year}
            viewMonth={view.month}
            selectedYear={selectedDate.getFullYear()}
            selectedMonth={selectedDate.getMonth()}
            selectedDay={selectedDate.getDate()}
            hasValue={!!value}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onSelectDay={handleSelect}
            onToday={handleToday}
            onClose={() => setIsOpen(false)}
          />,
          document.body,
        )}
    </>
  );
};

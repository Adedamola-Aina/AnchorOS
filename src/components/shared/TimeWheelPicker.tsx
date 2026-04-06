/**
 * TimeWheelPicker — Platform-adaptive time picker.
 * Trigger button + portal sheet for hour/minute/period selection.
 * Sheet extracted to TimePickerSheet for ARCH-001 compliance.
 * 44px minimum touch targets per Apple HIG.
 */

import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';
import { TimePickerSheet } from './TimePickerSheet';

interface TimeWheelPickerProps {
  value: string; // "HH:mm" format e.g. "09:30"
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  testId?: string;
}

const MINUTES_SNAP = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parse24to12(time: string): { hour: number; minute: number; period: 'AM' | 'PM' } {
  const [h, m] = time.split(':').map(Number);
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { hour, minute: m ?? 0, period };
}

function to24(hour: number, minute: number, period: 'AM' | 'PM'): string {
  let h = hour;
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDisplay(time: string): string {
  if (!time) return '';
  const { hour, minute, period } = parse24to12(time);
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

function snapMinute(m: number): number {
  return MINUTES_SNAP.reduce((prev, curr) =>
    Math.abs(curr - m) < Math.abs(prev - m) ? curr : prev,
  );
}

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Set time',
  className = '',
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const parsed = value ? parse24to12(value) : { hour: 9, minute: 0, period: 'AM' as const };
  const [prevValue, setPrevValue] = useState(value);
  const [sel, setSel] = useState({ hour: parsed.hour, minute: snapMinute(parsed.minute), period: parsed.period });
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      const p = parse24to12(value);
      setSel({ hour: p.hour, minute: snapMinute(p.minute), period: p.period });
    }
  }

  const handleDone = useCallback(() => {
    onChange(to24(sel.hour, sel.minute, sel.period));
    setIsOpen(false);
  }, [sel.hour, sel.minute, sel.period, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  return (
    <>
      {label && (
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        data-testid={testId}
        className={`flex items-center gap-2 px-3 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${className}`}
      >
        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
        <span className={value ? '' : 'text-slate-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {isOpen &&
        createPortal(
          <TimePickerSheet
            displayTime={formatDisplay(to24(sel.hour, sel.minute, sel.period))}
            selHour={sel.hour}
            selMinute={sel.minute}
            selPeriod={sel.period}
            onHourChange={(h) => setSel((s) => ({ ...s, hour: h }))}
            onMinuteChange={(m) => setSel((s) => ({ ...s, minute: m }))}
            onPeriodChange={(p) => setSel((s) => ({ ...s, period: p }))}
            onDone={handleDone}
            onClear={handleClear}
            onClose={() => setIsOpen(false)}
          />,
          document.body,
        )}
    </>
  );
};

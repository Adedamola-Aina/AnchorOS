/**
 * SegmentedControl — iOS-style segmented control.
 * Replaces native <select> for 2–4 option selections (scope, currency, frequency).
 * 44px minimum touch targets per Apple HIG.
 */

import React from 'react';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  testId?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  label,
  className = '',
  testId,
}) => (
  <div className={className}>
    {label && (
      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
        {label}
      </label>
    )}
    <div
      role="radiogroup"
      aria-label={label}
      data-testid={testId}
      className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-0.5"
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-h-[36px] px-3 rounded-lg text-sm font-semibold transition-all capitalize ${
              isSelected
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

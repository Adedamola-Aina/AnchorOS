/**
 * SettingsGroup — iOS-style grouped list section.
 * Wraps settings items in an inset grouped container with section header,
 * automatic dividers between children, and optional footer text.
 * Matches Apple Settings app visual pattern.
 */

import React from 'react';

interface SettingsGroupProps {
  title: string;
  icon?: React.ReactNode;
  iconBg?: string;
  footer?: string;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  icon,
  iconBg = 'bg-slate-100 dark:bg-slate-800',
  footer,
  children,
  className = '',
  testId,
}) => (
  <div className={className} data-testid={testId}>
    {/* Section header */}
    <div className="flex items-center gap-3 mb-3">
      {icon && (
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
    </div>

    {/* Grouped card with automatic dividers */}
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {React.Children.map(children, (child) => {
          if (!child) return null;
          return (
            <div className="px-5 py-4">{child}</div>
          );
        })}
      </div>
    </div>

    {/* Footer text */}
    {footer && (
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-1">
        {footer}
      </p>
    )}
  </div>
);

/**
 * SettingsRow — A single row within a SettingsGroup.
 * Provides label + control layout with optional description and disclosure chevron.
 */
interface SettingsRowProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  /** Show a disclosure chevron (>) indicating navigation */
  disclosure?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  children,
  onClick,
  disclosure,
}) => {
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-900 dark:text-white">
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
      {disclosure && (
        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-3 min-h-[44px] -mx-5 -my-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 min-h-[44px]">
      {content}
    </div>
  );
};

/**
 * ToggleSwitch - Shared boolean toggle for settings.
 * 44px touch target, consistent alignment on all screen sizes.
 *
 * @module components/shared/ToggleSwitch
 */
// @ts-nocheck


import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  label?: string;
  /** Override the active track color (default: bg-primary-500) */
  activeColor?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onToggle,
  disabled = false,
  label,
  activeColor = 'bg-primary-500',
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    disabled={disabled}
    onClick={onToggle}
    className={`relative inline-flex h-7 w-12 min-h-11 min-w-[48px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${enabled ? activeColor : 'bg-slate-300 dark:bg-slate-700'}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

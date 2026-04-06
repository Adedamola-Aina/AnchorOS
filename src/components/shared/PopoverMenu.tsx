/**
 * PopoverMenu — iOS-style pull-down menu / popover.
 * Replaces native <select> elements across the app.
 * Anchored to trigger button, dismisses on outside click or Escape.
 * 44px minimum touch targets per Apple HIG.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface PopoverMenuItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface PopoverMenuProps {
  items: PopoverMenuItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  /** Test ID for the trigger button */
  testId?: string;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  className = '',
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedItem = items.find((item) => item.value === value);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = Math.min(items.length * 52 + 16, 320);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const showAbove = spaceBelow < menuHeight && rect.top > menuHeight;

    setPosition({
      top: showAbove ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 200),
    });
  }, [items.length]);

  const open = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (itemValue: string) => {
      onChange(itemValue);
      close();
    },
    [onChange, close],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    },
    [close],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

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
        onClick={() => (isOpen ? close() : open())}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${className}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedItem?.icon}
          {selectedItem?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50"
              onClick={close}
              aria-hidden="true"
            />
            {/* Menu */}
            <div
              ref={menuRef}
              role="listbox"
              aria-activedescendant={value ? `popover-item-${value}` : undefined}
              className="fixed z-50 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-150 py-1"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: 320,
                overflowY: 'auto',
              }}
            >
              {items.map((item) => {
                const isSelected = item.value === value;
                return (
                  <button
                    key={item.value}
                    id={`popover-item-${item.value}`}
                    role="option"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item.value)}
                    className={`w-full flex items-center gap-3 px-4 min-h-[44px] text-left text-[15px] transition-colors ${
                      isSelected
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20 font-semibold'
                        : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {item.icon && (
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

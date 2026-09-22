/**
 * PopoverMenu — iOS-style pull-down menu / popover.
 * Replaces native <select> elements across the app.
 * Anchored to trigger button, dismisses on outside click or Escape.
 * 44px minimum touch targets per Apple HIG.
 */

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface PopoverMenuItem {
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
  /** Optional leading icon on the trigger, e.g. a Repeat glyph. */
  icon?: React.ReactNode;
  className?: string;
  /** Test ID for the trigger button */
  testId?: string;
}

/**
 * Where the menu goes.
 *
 * Coordinates come from the trigger's viewport rect, but `position: fixed` only
 * resolves against the viewport when NO ancestor creates a containing block. Every
 * sheet in this app animates with a lingering `transform` (`animate-in zoom-in-95`
 * on the Modal), and a transformed ancestor becomes the containing block for fixed
 * descendants — which is why a menu opened inside the composer rendered hundreds of
 * pixels from its trigger, over the NAME field and the cadence buttons.
 *
 * So the menu is placed in viewport coordinates and then shifted by the origin of
 * whatever containing block it actually landed in. The origin is read from the
 * ancestor chain — not from the menu's own rect, which would be a measurement of
 * the position React has not committed yet.
 */
const containingBlockOrigin = (element: HTMLElement | null): { x: number; y: number } => {
    let node: HTMLElement | null = element?.parentElement ?? null;
    while (node && node !== document.documentElement) {
        const style = getComputedStyle(node);
        if (
            style.transform !== 'none'
            || style.filter !== 'none'
            || style.perspective !== 'none'
            || style.backdropFilter !== 'none'
            || style.willChange === 'transform'
            || style.contain !== 'none'
        ) {
            const rect = node.getBoundingClientRect();
            return { x: rect.left, y: rect.top };
        }
        node = node.parentElement;
    }
    return { x: 0, y: 0 };
};

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  icon,
  className = '',
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 320 });
  // The visible label is a real label for the control: tapping it does nothing and
  // assistive tech announced only the value ("Personal Development") without the
  // question it answers ("Area"). `aria-labelledby` names the control from both.
  const labelId = React.useId();
  const valueId = React.useId();

  const selectedItem = items.find((item) => item.value === value);

  /**
   * Places the menu, and re-places it on scroll and resize — the old one-shot
   * calculation never re-anchored, so a menu opened in a sheet stayed at stale
   * coordinates the moment the sheet scrolled.
   */
  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    // Measure the menu when it exists, so the gap is the 4px it promises rather
    // than the estimate's leftover; fall back to the estimate before first paint.
    const measuredHeight = menuRef.current?.getBoundingClientRect().height ?? 0;
    const menuHeight = measuredHeight > 0 ? measuredHeight : Math.min(items.length * 52 + 16, 320);
    const width = Math.max(rect.width, 200);

    const GAP = 4;   // between the trigger and the menu
    const EDGE = 8;  // between the menu and the viewport edge
    const spaceBelow = window.innerHeight - (rect.bottom + GAP) - EDGE;
    const spaceAbove = rect.top - GAP - EDGE;
    // Above the trigger when below cannot hold it and above has more room.
    const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    // Never taller than the room it has: it scrolls instead of touching the edge.
    const maxHeight = Math.min(320, Math.max(showAbove ? spaceAbove : spaceBelow, 120));
    const height = Math.min(menuHeight, maxHeight);
    const origin = containingBlockOrigin(menuRef.current);

    setPosition({
      top: (showAbove ? Math.max(rect.top - height - GAP, EDGE) : rect.bottom + GAP) - origin.y,
      // Keep it on screen horizontally: a wide trigger near the right edge used to
      // push the menu off the viewport.
      left: Math.min(Math.max(rect.left, EDGE), Math.max(window.innerWidth - width - EDGE, EDGE)) - origin.x,
      width,
      maxHeight,
    });
  }, [items.length]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Place once the menu exists (it must be measurable), then keep it anchored.
  useLayoutEffect(() => {
    if (!isOpen) return;
    place();
    const reanchor = () => place();
    window.addEventListener('scroll', reanchor, true);
    window.addEventListener('resize', reanchor);
    return () => {
      window.removeEventListener('scroll', reanchor, true);
      window.removeEventListener('resize', reanchor);
    };
  }, [isOpen, place]);

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
        <span id={labelId} className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${className}`}
      >
        <span className="flex min-w-0 items-center gap-2 text-left">
          {icon}
          {selectedItem?.icon}
          <span id={valueId} className="truncate">{selectedItem?.label ?? placeholder}</span>
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
              aria-labelledby={label ? labelId : undefined}
              aria-activedescendant={value ? `popover-item-${value}` : undefined}
              className="fixed z-50 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-150 py-1"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
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
                    <span className="flex-1">{item.label}</span>
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

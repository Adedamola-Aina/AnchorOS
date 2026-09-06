// @ts-nocheck
/**
 * ActionSheet — iOS-style pull-down action sheet.
 * Slides up from bottom with backdrop blur. 44px touch targets.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ActionSheetItem {
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onPress: () => void;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
}

export const ActionSheet: React.FC<ActionSheetProps> = ({ isOpen, onClose, items }) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative z-10 w-full max-w-md mx-4 mb-safe animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        <div className="rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-2xl">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { item.onPress(); onClose(); }}
              className={`w-full flex items-center gap-3 px-5 min-h-[52px] text-left text-[15px] font-medium transition-colors
                ${item.destructive
                  ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700/50' : ''}`}
            >
              {item.icon && <span className="w-5 h-5 shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-2xl bg-white dark:bg-slate-800 min-h-[52px] text-[17px] font-semibold text-slate-900 dark:text-white shadow-2xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
};

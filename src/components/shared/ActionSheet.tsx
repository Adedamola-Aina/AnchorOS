
/**
 * ActionSheet — iOS-style pull-down action sheet.
 * Slides up from bottom with backdrop blur. 44px touch targets.
 */

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayBehavior } from '../../hooks/useOverlayBehavior';

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
  // Escape, the focus trap, the scroll lock and the `data-modal-open` marker the
  // contextual FAB stands down for — all owned by the shared overlay behaviour.
  // Without the marker the FAB stayed on screen over this sheet.
  useOverlayBehavior({ isOpen, onClose, panelRef: sheetRef });

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
              {item.icon && <span className="w-5 h-5 shrink-0" aria-hidden="true">{item.icon}</span>}
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

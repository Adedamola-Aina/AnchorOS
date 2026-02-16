/**
 * BeyondBasicsChecklist - Slide-up checklist for Beyond the Basics items
 * Shows exploration items, not obligations. Calm, not anxious.
 * Each item deep-links to its relevant action route.
 * Renders via portal to escape ancestor transforms (PullToRefresh).
 */
// @ts-nocheck


import { createPortal } from 'react-dom';
import { X, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import type { BeyondBasicsItemState } from '../hooks/useBeyondBasics';

interface BeyondBasicsChecklistProps {
  items: BeyondBasicsItemState[];
  completedCount: number;
  totalCount: number;
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: (item: BeyondBasicsItemState) => void;
}

export function BeyondBasicsChecklist({
  items,
  completedCount,
  totalCount,
  isOpen,
  onClose,
  onItemClick,
}: BeyondBasicsChecklistProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" data-testid="beyond-basics-overlay">
      {/* Backdrop — blur matches ContactModal */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        data-testid="checklist-backdrop"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 pb-4 border-b border-slate-100 dark:border-slate-800 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">
                Beyond the Basics
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {completedCount} of {totalCount} explored
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-11 min-w-[44px] flex items-center justify-center"
              aria-label="Close checklist"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-6 pt-4 space-y-3">
          {items.map((item) => {
            const isClickable = !item.completed && onItemClick;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.completed}
                onClick={() => isClickable && onItemClick(item)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left min-h-11 ${
                  item.completed
                    ? 'bg-slate-50 dark:bg-slate-800/50 opacity-75 cursor-default'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer active:scale-[0.98]'
                }`}
                data-testid={`checklist-item-${item.id}`}
                aria-label={item.completed ? `${item.label} — completed` : `${item.label} — tap to start`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-finance-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${item.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
                {!item.completed && (
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="p-6 pt-0">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
            Tap any item to get started, or they&apos;ll complete automatically.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

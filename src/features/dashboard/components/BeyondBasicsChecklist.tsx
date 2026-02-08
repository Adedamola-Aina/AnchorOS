/**
 * BeyondBasicsChecklist - Slide-up checklist for Beyond the Basics items
 * Shows exploration items, not obligations. Calm, not anxious.
 * Renders via portal to escape ancestor transforms (PullToRefresh).
 */

import { createPortal } from 'react-dom';
import { X, CheckCircle2, Circle } from 'lucide-react';
import type { BeyondBasicsItemState } from '../hooks/useBeyondBasics';

interface BeyondBasicsChecklistProps {
  items: BeyondBasicsItemState[];
  completedCount: number;
  totalCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BeyondBasicsChecklist({
  items,
  completedCount,
  totalCount,
  isOpen,
  onClose,
}: BeyondBasicsChecklistProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" data-testid="beyond-basics-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50"
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
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${item.completed ? 'bg-slate-50 dark:bg-slate-800/50 opacity-75' : 'bg-white dark:bg-slate-900'}`}
              data-testid={`checklist-item-${item.id}`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-finance-500 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <p className={`text-sm font-semibold ${item.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="p-6 pt-0">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
            These complete automatically as you use Anchor OS.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

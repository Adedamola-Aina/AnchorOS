// @ts-nocheck
/**
 * AccountDetailHeader — Apple-style minimal header for account detail.
 * X close (left) + account name (center) + ... ellipsis (right).
 */

import { X, MoreHorizontal } from 'lucide-react';

interface AccountDetailHeaderProps {
  accountName: string;
  onBack: () => void;
  onOpenOptions: () => void;
}

export const AccountDetailHeader = ({ accountName, onBack, onOpenOptions }: AccountDetailHeaderProps) => (
  <div className="flex items-center justify-between px-1 py-2">
    <button
      type="button"
      onClick={onBack}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
      aria-label="Close account details"
    >
      <X className="h-5 w-5" strokeWidth={2.5} />
    </button>
    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[60%]">
      {accountName}
    </h2>
    <button
      type="button"
      onClick={onOpenOptions}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
      aria-label="Account options"
    >
      <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
    </button>
  </div>
);

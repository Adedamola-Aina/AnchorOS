
/**
 * AccountDetailHeader — the account's own navigation bar.
 *
 * UX-FN-13: the left control used to be an `X`, which means "dismiss this
 * thing" — but account detail is a destination pushed from Finance, so it gets
 * the app's normal back affordance (`‹ Finance`, the destination it came from)
 * instead. The `…` overflow stays: account-specific secondary actions belong
 * there, not in the page body.
 */

import { ChevronLeft, MoreHorizontal } from 'lucide-react';

interface AccountDetailHeaderProps {
  accountName: string;
  onBack: () => void;
  onOpenOptions: () => void;
  /** Optional ref to the options button so callers can restore focus after modal flows. */
  optionsButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AccountDetailHeader = ({ accountName, onBack, onOpenOptions, optionsButtonRef }: AccountDetailHeaderProps) => (
  <div className="flex items-center justify-between gap-2 px-1 py-1">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back to Finance"
      className="flex min-h-[44px] items-center gap-0.5 rounded-full pl-1 pr-3 text-primary-600 dark:text-primary-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      <span className="text-[15px] font-semibold">Finance</span>
    </button>
    <h2 className="min-w-0 flex-1 truncate text-center text-[13px] font-semibold text-slate-500 dark:text-slate-400">
      {accountName}
    </h2>
    <button
      type="button"
      onClick={onOpenOptions}
      ref={optionsButtonRef}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
      aria-label="Account options"
    >
      <MoreHorizontal className="h-5 w-5" strokeWidth={2.5} />
    </button>
  </div>
);

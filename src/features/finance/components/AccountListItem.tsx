// @ts-nocheck
/** Account list row — extracted per ARCH-001 (200-line rule). */

import type { AnchorAccount } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { getAccountPermission } from '../utils/permissions';

export function getAccessBadge(account: AnchorAccount, currentUserId?: string): string {
  const permission = currentUserId ? getAccountPermission(account, currentUserId) : null;
  if (permission === 'owner') return 'Owner';
  if (!permission) return 'Viewer';
  return `${permission.charAt(0).toUpperCase()}${permission.slice(1)} access`;
}

interface AccountListItemProps {
  account: AnchorAccount;
  currentUserId?: string;
  onOpenAccount: (accountId: string) => void;
}

export const AccountListItem = ({ account, currentUserId, onOpenAccount }: AccountListItemProps) => (
  <button
    type="button"
    onClick={() => onOpenAccount(account.id)}
    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
  >
    <div className="min-w-0 space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{account.name}</p>
        <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
          {account.type} · {account.currency}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {getAccessBadge(account, currentUserId)}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {account.source === 'linked' ? 'Linked' : 'Manual'}
        </span>
      </div>
    </div>
    <span className="pl-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
      {formatCurrency(fromCents(account.balanceCents), account.currency)}
    </span>
  </button>
);

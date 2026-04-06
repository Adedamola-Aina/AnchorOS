import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import type { AnchorAccount } from '../../../types';
import { AccountListItem, getAccessBadge } from './AccountListItem';
import { PopoverMenu } from '../../../components/shared';

interface FinanceAccountsRouteProps {
  accounts: AnchorAccount[];
  currentUserId?: string;
  onBack: () => void;
  onCreateAccount?: () => void;
  onOpenAccount: (accountId: string) => void;
}

type OwnershipFilter = 'all' | 'owned' | 'shared';
type SortMode = 'custom' | 'balance' | 'name';

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

export const FinanceAccountsRoute = ({
  accounts,
  currentUserId,
  onBack,
  onCreateAccount,
  onOpenAccount,
}: FinanceAccountsRouteProps) => {
  const [query, setQuery] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('custom');

  const summary = useMemo(() => {
    const ownedCount = accounts.filter((account) => (account.ownerId || currentUserId) === currentUserId).length;
    return {
      total: accounts.length,
      owned: ownedCount,
      shared: Math.max(accounts.length - ownedCount, 0),
    };
  }, [accounts, currentUserId]);

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = normalizeValue(query);
    const visibleAccounts = accounts.filter((account) => {
      if (ownershipFilter === 'owned') {
        return (account.ownerId || currentUserId) === currentUserId;
      }
      if (ownershipFilter === 'shared') {
        return (account.ownerId || currentUserId) !== currentUserId;
      }
      return true;
    });

    const searchedAccounts = !normalizedQuery
      ? visibleAccounts
      : visibleAccounts.filter((account) => {
          return [account.name, account.type, account.currency, account.source || 'manual', getAccessBadge(account, currentUserId)]
            .map(normalizeValue)
            .some((value) => value.includes(normalizedQuery));
        });

    return [...searchedAccounts].sort((left, right) => {
      if (sortMode === 'balance') {
        return right.balanceCents - left.balanceCents;
      }
      if (sortMode === 'name') {
        return left.name.localeCompare(right.name);
      }
      return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
    });
  }, [accounts, currentUserId, ownershipFilter, query, sortMode]);

  const filterButtons: Array<{ value: OwnershipFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'owned', label: 'Owned' },
    { value: 'shared', label: 'Shared' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Back to finance overview"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">All Accounts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Filter, scan ownership, and jump into account management.</p>
          </div>
        </div>
        {onCreateAccount ? (
          <button
            type="button"
            onClick={onCreateAccount}
            className="min-h-[44px] rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            New Account
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: summary.total },
          { label: 'Owned', value: summary.owned },
          { label: 'Shared', value: summary.shared },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <label className="relative block">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search accounts"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => {
            const isSelected = ownershipFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setOwnershipFilter(filter.value)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Sort</span>
          <PopoverMenu
            items={[
              { value: 'custom', label: 'Manual order' },
              { value: 'balance', label: 'Highest balance' },
              { value: 'name', label: 'Name' },
            ]}
            value={sortMode}
            onChange={(v) => setSortMode(v as SortMode)}
            testId="sort-accounts"
          />
        </label>
      </div>

      <div className="space-y-3">
        {filteredAccounts.map((account) => (
          <AccountListItem key={account.id} account={account} currentUserId={currentUserId} onOpenAccount={onOpenAccount} />
        ))}
        {filteredAccounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No accounts match this view.
          </div>
        ) : null}
      </div>
    </div>
  );
};
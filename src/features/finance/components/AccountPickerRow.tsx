/**
 * AccountPickerRow — the compact account selector for the transaction composer.
 *
 * UX-FN-17: the composer used to render every account as a large permanent tile
 * (a 2–3 column grid of bordered cards), which pushed the amount field — the
 * thing the user came to enter — below the fold, and made a five-account user
 * scroll past five cards to reach the form. The account is now one row that
 * states the current choice and opens a dedicated picker sheet only when the user
 * wants to change it.
 *
 * The row shows name, type, currency and balance, because the user is choosing
 * *which pot of money* to act on — and two accounts can share a name (UX-FN-04).
 * Every value is text, so nothing depends on colour.
 */



import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Modal } from '../../../components/shared/Modal';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { accountTypeLabel } from '../../../utils/accountTypes';
import type { AnchorAccount } from '../../../types';

interface AccountPickerRowProps {
    accounts: AnchorAccount[];
    selectedId: string;
    onSelect: (id: string) => void;
    /** "From" for money leaving, "To" for money arriving. */
    label: string;
    /** Excluded from the picker (transfer destination cannot be the source). */
    excludeId?: string;
    testId?: string;
}

export const AccountPickerRow: React.FC<AccountPickerRowProps> = ({
    accounts,
    selectedId,
    onSelect,
    label,
    excludeId,
    testId = 'tx-account',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectable = accounts.filter(a => a.id !== excludeId);
    const selected = accounts.find(a => a.id === selectedId);

    const describe = (account: AnchorAccount) =>
        `${accountTypeLabel(account.type)} · ${account.currency} · ${formatCurrency(fromCents(account.balanceCents), account.currency)}`;

    return (
        <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-1">
                {label}
            </span>

            <button
                type="button"
                data-testid={testId}
                onClick={() => setIsOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label={`${label}: ${selected ? selected.name : 'choose an account'}`}
                className="w-full min-h-[56px] flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-left transition-colors hover:border-slate-300 dark:hover:border-slate-600"
            >
                <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                        {selected?.name ?? 'Choose an account'}
                    </span>
                    {selected && (
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            {describe(selected)}
                        </span>
                    )}
                </span>
                <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={label} maxWidth="max-w-md">
                <ul className="space-y-1 -mx-2">
                    {selectable.map(account => {
                        const isSelected = account.id === selectedId;
                        return (
                            <li key={account.id}>
                                <button
                                    type="button"
                                    data-testid={`${testId}-option-${account.id}`}
                                    onClick={() => { onSelect(account.id); setIsOpen(false); }}
                                    aria-current={isSelected ? 'true' : undefined}
                                    className={`w-full min-h-[56px] flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${isSelected
                                        ? 'bg-primary-50 dark:bg-primary-900/20'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                                            {account.name}
                                        </span>
                                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                                            {describe(account)}
                                        </span>
                                    </span>
                                    {isSelected && <Check className="w-4 h-4 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Modal>
        </div>
    );
};

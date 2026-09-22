/**
 * TransferDetails — where the money goes, and what it becomes.
 *
 * A transfer is a distinct financial operation, not an expense with a different
 * colour (UX-FN-20):
 *
 *   From  [Main Checking · Checking · NGN · ₦694,419.10]
 *           ↓
 *   To    [Investment Portfolio · Investment · NGN · ₦878.63]
 *
 * The destination is a compact picker (never a wall of tiles), the source account
 * is excluded from it, and when the two currencies differ the exchange-rate
 * controls appear — and ONLY then. AnchorOS has no FX feed (audit doc 18,
 * decision D5), so:
 *
 *   - the rate is never pre-filled with an invented value like "1 NGN = 1 USD";
 *   - the panel is labelled "Manual · no live rate" and says where the number
 *     comes from;
 *   - the destination amount is calculated and shown BEFORE confirmation, so the
 *     user sees the outcome of the rate they typed;
 *   - an empty or invalid rate blocks submission (the existing validation in
 *     `useTransactionSubmit` already refuses a non-positive rate).
 */
// @ts-nocheck


import React from 'react';
import { ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { toCents, fromCents } from '../../../utils/moneyUtils';
import { AccountPickerRow } from './AccountPickerRow';
import type { AnchorAccount } from '../../../types';

interface TransferDetailsProps {
    accounts: AnchorAccount[];
    sourceAccount: AnchorAccount | undefined;
    destinationAccId: string;
    onDestinationChange: (id: string) => void;
    exchangeRate: string;
    onExchangeRateChange: (rate: string) => void;
    amount: string;
    error?: string;
    /** When true, source account is already displayed elsewhere — hide the From row */
    lockedAccount?: boolean;
}

export const TransferDetails: React.FC<TransferDetailsProps> = ({
    accounts,
    sourceAccount,
    destinationAccId,
    onDestinationChange,
    exchangeRate,
    onExchangeRateChange,
    amount,
    error,
}) => {
    const destAccount = accounts.find(a => a.id === destinationAccId);
    const isDifferentCurrency = !!sourceAccount && !!destAccount && sourceAccount.currency !== destAccount.currency;

    if (accounts.length < 2) {
        return (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                <p className="font-semibold mb-1">Transfers need two accounts</p>
                A transfer moves money between your accounts. Create a second account
                first, or record this as an expense or income instead.
            </div>
        );
    }

    // Preview the destination amount from the user's own rate. `toCents` handles
    // a comma-formatted amount ("1,000.00") correctly, which the old
    // `parseFloat(amount)` preview did not.
    const sentAmount = fromCents(toCents(amount || '0'));
    const rate = parseFloat(exchangeRate);
    const hasRate = !Number.isNaN(rate) && rate > 0;
    const receives = hasRate ? sentAmount * rate : 0;


    return (
        <div className="space-y-3">
            <div className="flex items-center justify-center text-slate-300 dark:text-slate-600" aria-hidden="true">
                <ArrowDown className="w-4 h-4" />
            </div>

            <AccountPickerRow
                accounts={accounts}
                selectedId={destinationAccId}
                onSelect={onDestinationChange}
                label="To"
                excludeId={sourceAccount?.id}
                testId="tx-destination"
            />

            {error && (
                <p role="alert" className="text-xs font-medium text-rose-500">{error}</p>
            )}

            {isDifferentCurrency && (
                <div
                    data-testid="fx-panel"
                    className="rounded-xl border border-blue-200/70 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-900/10 p-3"
                >
                    <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-900 dark:text-blue-200">
                            Exchange rate
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700/80 dark:text-blue-300/80">
                            Manual · no live rate
                        </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                        <label htmlFor="tx-exchange-rate" className="flex flex-1 items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <span className="shrink-0 font-semibold">1 {sourceAccount?.currency} =</span>
                            <input
                                id="tx-exchange-rate"
                                type="text"
                                inputMode="decimal"
                                autoComplete="off"
                                placeholder="0.00"
                                value={exchangeRate}
                                onChange={(e) => {
                                    // Digits and a single decimal point only — the rate
                                    // is parsed and validated on submit.
                                    if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) onExchangeRateChange(e.target.value);
                                }}
                                aria-describedby="tx-exchange-rate-help"
                                className="min-w-0 flex-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 px-2 py-2 min-h-[44px] text-right text-base font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <span className="shrink-0 font-semibold">{destAccount?.currency}</span>
                        </label>
                    </div>

                    <p id="tx-exchange-rate-help" className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                        {hasRate ? (
                            <>
                                You&apos;re sending {formatCurrency(sentAmount, sourceAccount?.currency || 'NGN')} —{' '}
                                <span className="font-semibold" data-testid="fx-receives">
                                    {destAccount?.name} receives {formatCurrency(receives, destAccount?.currency || 'USD')}
                                </span>
                            </>
                        ) : (
                            <>
                                Enter the rate you were given. AnchorOS has no exchange-rate feed, so it
                                cannot fill this in for you.
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

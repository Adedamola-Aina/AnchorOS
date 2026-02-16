/**
 * TransferDetails
 * 
 * Transfer-specific form fields including destination account and exchange rate.
 * Extracted from TransactionForm for modularity.
 */
// @ts-nocheck


import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
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
    lockedAccount
}) => {
    const destAccount = accounts.find(a => a.id === destinationAccId);
    const isDifferentCurrency = sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;
    const filteredAccounts = accounts.filter(a => a.id !== sourceAccount?.id);

    if (accounts.length < 2) {
        return (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                <p className="font-bold mb-1">Transfer Unavailable</p>
                Transfers require at least two accounts. Please create another account first, or switch to Expense/Income.
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            <label htmlFor="tx-destination" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                <ArrowRightLeft className="w-3 h-3 inline mr-1" /> To Account
                {error && <span className="text-rose-500 ml-2 normal-case font-normal">{error}</span>}
            </label>

            <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-2">
                {!lockedAccount && (
                    <>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>From:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{sourceAccount?.name}</span>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-700" />
                    </>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">To:</span>
                    <select
                        id="tx-destination"
                        value={destinationAccId}
                        onChange={(e) => onDestinationChange(e.target.value)}
                        className="p-1 rounded bg-transparent text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-0 text-right cursor-pointer"
                    >
                        {filteredAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isDifferentCurrency && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Exchange Rate</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-1.5 py-0.5 rounded">
                            Manual
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">1 {sourceAccount?.currency} =</span>
                        <input
                            type="number"
                            step="0.0001"
                            value={exchangeRate}
                            onChange={(e) => onExchangeRateChange(e.target.value)}
                            className="flex-1 p-1.5 text-right text-sm font-bold rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs font-mono text-slate-500">{destAccount?.currency}</span>
                    </div>
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-1 text-right">
                        Receives: {formatCurrency(parseFloat(amount || '0') * parseFloat(exchangeRate || '0'), destAccount?.currency || '')}
                    </p>
                </div>
            )}
        </div>
    );
};

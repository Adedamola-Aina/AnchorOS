// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { getTransactionLabel } from '../../utils/finance';
import { formatCurrency } from '../../utils/format';
import { toCents, fromCents } from '../../utils/moneyUtils';
import type { TransactionType, AnchorTransaction, RecurringFrequency } from '../../types';
import {
    CategorySelector, OverdraftWarning,
    TransactionTypeSelector, TransferDetails
} from './components';
import { AccountPickerRow } from './components/AccountPickerRow';
import { RecurringOptions } from './components/RecurringOptions';
import {
    useTransactionFormState, NoAccountsMessage, SingleAccountTransferMessage,
    DescriptionField, AmountField, DateField
} from './components/transactionForm';
import { useTransactionSubmit } from './components/transactionForm/useTransactionSubmit';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { microMotion } from '../../animations/microInteractions';

interface TransactionFormProps {
    onClose: () => void;
    defaultAccountId?: string;
    defaultType?: TransactionType;
    initialData?: AnchorTransaction;
    prefillData?: { amount?: number; title?: string; category?: string };
    /** When true, the source account is established — hides account grid */
    lockedAccount?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
    onClose, defaultAccountId, defaultType = 'expense', initialData, prefillData, lockedAccount
}) => {
    const { accounts: allAccounts, transactions } = useFinance();
    const accounts = allAccounts.filter(a => !a.isArchived);

    // Recurring State
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
    const [interval, setInterval] = useState(1);

    // Initial values
    const initialAmount = initialData
        ? fromCents(initialData.amountCents || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : prefillData?.amount ? prefillData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    const initialDate = initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const [amount, setAmount] = useState(initialAmount);
    const [transactionDate, setTransactionDate] = useState(initialDate);

    const formState = useTransactionFormState({
        accounts, transactions, initialData, defaultAccountId, defaultType, prefillData
    });

    // Guard against losing unsaved form data
    const isDirty = useMemo(() =>
        !!(formState.title || amount || isRecurring),
        [formState.title, amount, isRecurring]
    );
    useUnsavedChanges(isDirty);

    // Synced bank transactions: only category is editable
    const isSyncedTx = initialData?.source === 'synced';

    // Context awareness: account is established when opened from account detail
    const hasAccountContext = !!lockedAccount && !!defaultAccountId && accounts.some(a => a.id === defaultAccountId);
    // Pay Bill = expense with Bills & Utilities prefill from account context
    const isPayBill = hasAccountContext && defaultType === 'expense' && prefillData?.category === 'Bills & Utilities';
    // Transfer/PayBill are intentional — user already stated intent, don't show type toggle
    const isIntentLocked = hasAccountContext && (defaultType === 'transfer' || isPayBill);

    // Derived state
    const sourceAccount = accounts.find(a => a.id === formState.selectedAccId);
    const destAccount = accounts.find(a => a.id === formState.destinationAccId);
    const isDifferentCurrency = formState.type === 'transfer' && sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;
    const currentBalance = sourceAccount?.balanceCents || 0;
    const expenseAmount = toCents(amount);
    const projectedBalance = (formState.type === 'expense' || formState.type === 'transfer') ? currentBalance - expenseAmount : currentBalance + expenseAmount;
    /**
     * UX-FN-03 (cont.): a projection only exists once there is an amount to
     * apply. With an empty composer the preview printed a before and an after
     * that were the same number ("Main Checking balance: ₦5,000.00 →
     * ₦5,000.00"), and an account already below zero raised an overdraft warning
     * about a transaction that had not been entered. Both now wait for an amount.
     */
    const hasAmount = expenseAmount > 0;
    const isOverdraft = hasAmount && (formState.type === 'expense' || formState.type === 'transfer') && projectedBalance < 0;

    const { isSubmitting, didJustSave, errors, setErrors, handleSubmit } = useTransactionSubmit({
        formState, amount, setAmount, transactionDate, setTransactionDate,
        isRecurring, setIsRecurring, frequency, interval,
        initialData, sourceAccount, isDifferentCurrency: !!isDifferentCurrency, onClose,
    });

    // Early returns for empty states
    if (accounts.length === 0) return <NoAccountsMessage />;
    if (formState.type === 'transfer' && accounts.length === 1) return <SingleAccountTransferMessage onClose={onClose} />;

    // Submit button label
    const submitLabel = isSubmitting ? 'Saving...' : initialData ? 'Update Transaction'
        : isRecurring ? 'Record & Schedule Recurring'
        : isPayBill ? 'Pay Bill'
        : formState.type === 'transfer' ? 'Record Transfer'
        : formState.type === 'income' ? 'Record Income' : 'Record Expense';

    return (
        <div className="flex min-h-full flex-col">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {isPayBill ? 'Pay Bill' : getTransactionLabel(formState.type).header}
            </h3>
            {isOverdraft && <OverdraftWarning projectedBalance={projectedBalance} amountCents={expenseAmount} />}
            {/*
              * UX-FN-03: recording a transaction never showed the account's
              * resulting position, so cause and effect were invisible. The
              * preview below states the balance before → after, in the account's
              * own currency, and turns red when it would go negative. It renders
              * only once an amount exists, so it never states a result nobody
              * entered; the account's current balance is on the account row.
              */}
            {sourceAccount && hasAmount && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3" data-testid="balance-preview">
                {sourceAccount.name} balance:{' '}
                <span className="font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                  {formatCurrency(fromCents(currentBalance), sourceAccount.currency)}
                </span>
                <span aria-hidden="true"> → </span>
                <span className={`font-semibold tabular-nums ${isOverdraft ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  {formatCurrency(fromCents(projectedBalance), sourceAccount.currency)}
                </span>
              </p>
            )}

            <form id="tx-form" onSubmit={handleSubmit} className="flex-1 space-y-4">
                {/* Type first: it decides the direction of everything below. */}
                {!isIntentLocked && !isSyncedTx && (
                    <TransactionTypeSelector type={formState.type} onChange={formState.setType} />
                )}

                {/* Amount is the hero — the one thing every transaction has. */}
                <AmountField value={amount} onChange={setAmount} error={errors.amount} onClearError={() => setErrors({ ...errors, amount: undefined })} currency={sourceAccount?.currency} disabled={isSyncedTx} />

                {/* Which account — one compact row, not a wall of tiles (UX-FN-17). */}
                <AccountPickerRow
                    accounts={accounts}
                    selectedId={formState.selectedAccId}
                    onSelect={formState.setSelectedAccId}
                    label={formState.type === 'income' ? 'To' : 'From'}
                    testId="tx-account"
                />

                {/* Transfer: destination + (only when currencies differ) the rate. */}
                {formState.type === 'transfer' && (
                    <TransferDetails accounts={accounts} sourceAccount={sourceAccount} destinationAccId={formState.destinationAccId}
                        onDestinationChange={(id) => { formState.setDestinationAccId(id); if (errors.destination) setErrors({ ...errors, destination: undefined }); }}
                        exchangeRate={formState.exchangeRate} onExchangeRateChange={formState.setExchangeRate} amount={amount} error={errors.destination} lockedAccount={hasAccountContext} />
                )}

                {/* Synced bank transaction notice */}
                {isSyncedTx && (
                    <div className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs font-medium">
                        Bank-synced transaction — only the category can be changed.
                    </div>
                )}

                {/* Description — secondary to the amount, never louder than it. */}
                <DescriptionField value={formState.title} onChange={formState.setTitle} error={errors.title} onClearError={() => setErrors({ ...errors, title: undefined })} disabled={isSyncedTx} />

                {/* Category + Date — details, secondary to amount and account. */}
                <div className={`grid gap-4 ${formState.type === 'transfer' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {formState.type !== 'transfer' && (
                        <CategorySelector category={formState.category} onChange={(c) => { formState.setCategory(c); formState.setSuggestedCategory(null); }}
                            suggestedCategory={formState.suggestedCategory} onAcceptSuggestion={() => { formState.setCategory(formState.suggestedCategory!); formState.setSuggestedCategory(null); }} error={errors.category} />
                    )}
                    <DateField value={transactionDate} onChange={setTransactionDate} disabled={isSyncedTx} />
                </div>

                {/* Recurring Options - Hidden during updates */}
                {!initialData && (
                    <RecurringOptions
                        isRecurring={isRecurring} onChange={setIsRecurring}
                        frequency={frequency} onFrequencyChange={setFrequency}
                        interval={interval} onIntervalChange={setInterval}
                    />
                )}
            </form>

            {/*
              * Confirmation is pinned to the bottom of the sheet so it is
              * reachable without scrolling and never sits over a field the user
              * is still filling in (`form="tx-form"` submits the form above).
              * The safe-area inset is carried here, once.
              */}
            <div className="sticky bottom-0 mt-4 bg-white dark:bg-slate-800 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-h-[44px] px-4 text-[15px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <motion.button
                        form="tx-form"
                        type="submit"
                        disabled={isSubmitting}
                        variants={microMotion.savePulse}
                        initial="idle"
                        animate={isSubmitting ? 'saving' : didJustSave ? 'done' : 'idle'}
                        className="min-h-[48px] rounded-xl bg-slate-900 dark:bg-white px-5 text-[15px] font-semibold text-white dark:text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitLabel}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

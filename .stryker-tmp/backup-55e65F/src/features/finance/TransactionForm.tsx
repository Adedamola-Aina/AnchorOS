import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getTransactionLabel } from '../../utils/finance';
import { formatCurrency } from '../../utils/format';
import { toCents, fromCents } from '../../utils/moneyUtils';
import type { TransactionType, AnchorTransaction, RecurringFrequency } from '../../types';
import {
    AccountSelector, CategorySelector, OverdraftWarning,
    TransactionTypeSelector, TransferDetails
} from './components';
import { RecurringOptions } from './components/RecurringOptions';
import {
    useTransactionFormState, NoAccountsMessage, SingleAccountTransferMessage,
    DescriptionField, AmountField, DateField
} from './components/transactionForm';
import { useTransactionSubmit } from './components/transactionForm/useTransactionSubmit';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';

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
    const isOverdraft = (formState.type === 'expense' || formState.type === 'transfer') && projectedBalance < 0;

    const { isSubmitting, errors, setErrors, handleSubmit } = useTransactionSubmit({
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
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-4">
                {isPayBill ? 'Pay Bill' : getTransactionLabel(formState.type).header}
            </h3>
            {isOverdraft && <OverdraftWarning projectedBalance={projectedBalance} amountCents={toCents(amount)} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account context: compact badge when known, full grid when browsing */}
                {hasAccountContext && sourceAccount ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-600">
                            {formState.type === 'transfer'
                                ? <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                : <Wallet className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {formState.type === 'income' ? 'Deposit to' : 'From'}
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{sourceAccount.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {formatCurrency(fromCents(currentBalance), sourceAccount.currency)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <AccountSelector accounts={accounts} selectedId={formState.selectedAccId} onSelect={formState.setSelectedAccId} label={getTransactionLabel(formState.type).accountLabel} />
                )}

                {/* Type selector: hidden for intentional actions (transfer, pay bill) */}
                {!isIntentLocked && (
                    <TransactionTypeSelector type={formState.type} onChange={formState.setType} />
                )}

                {/* Core fields: description + amount always first */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DescriptionField value={formState.title} onChange={formState.setTitle} error={errors.title} onClearError={() => setErrors({ ...errors, title: undefined })} />
                    <AmountField value={amount} onChange={setAmount} error={errors.amount} onClearError={() => setErrors({ ...errors, amount: undefined })} currency={sourceAccount?.currency} />
                </div>

                {/* Transfer: destination + exchange rate */}
                {formState.type === 'transfer' && (
                    <TransferDetails accounts={accounts} sourceAccount={sourceAccount} destinationAccId={formState.destinationAccId}
                        onDestinationChange={(id) => { formState.setDestinationAccId(id); if (errors.destination) setErrors({ ...errors, destination: undefined }); }}
                        exchangeRate={formState.exchangeRate} onExchangeRateChange={formState.setExchangeRate} amount={amount} error={errors.destination} lockedAccount={hasAccountContext} />
                )}

                {/* Category + Date row (category hidden for transfers) */}
                <div className={`grid gap-4 ${formState.type === 'transfer' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {formState.type !== 'transfer' && (
                        <CategorySelector category={formState.category} onChange={(c) => { formState.setCategory(c); formState.setSuggestedCategory(null); }}
                            suggestedCategory={formState.suggestedCategory} onAcceptSuggestion={() => { formState.setCategory(formState.suggestedCategory!); formState.setSuggestedCategory(null); }} error={errors.category} />
                    )}
                    <DateField value={transactionDate} onChange={setTransactionDate} />
                </div>

                {/* Recurring Options - Hidden during updates */}
                {!initialData && (
                    <RecurringOptions
                        isRecurring={isRecurring} onChange={setIsRecurring}
                        frequency={frequency} onFrequencyChange={setFrequency}
                        interval={interval} onIntervalChange={setInterval}
                    />
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
};

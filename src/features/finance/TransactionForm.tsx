import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useNotifications } from '../../context/NotificationContext';
import { useHaptic } from '../../hooks/useHaptic';
import { useAuth } from '../../context/AuthContext';
import { useCreateRecurringTransaction } from '../../hooks/useRecurringQueries';
import { getTransactionLabel } from '../../utils/finance';
import { toCents, fromCents } from '../../utils/moneyUtils';
import { mapFirebaseError } from '../../utils/errorUtils';
import { containsDangerousPatterns } from '../../utils/validation';
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

interface TransactionFormProps {
    onClose: () => void;
    defaultAccountId?: string;
    defaultType?: TransactionType;
    initialData?: AnchorTransaction;
    prefillData?: { amount?: number; title?: string; category?: string };
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
    onClose, defaultAccountId, defaultType = 'expense', initialData, prefillData
}) => {
    const haptic = useHaptic();
    const { user } = useAuth();
    const { transactions, accounts, addTransaction, updateTransaction, refetch } = useFinance();
    const { mutateAsync: createRecurring } = useCreateRecurringTransaction();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; amount?: string; destination?: string; category?: string }>({});

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

    // Use extracted hook for complex state management
    const formState = useTransactionFormState({
        accounts, transactions, initialData, defaultAccountId, defaultType, prefillData
    });

    // Derived state
    const sourceAccount = accounts.find(a => a.id === formState.selectedAccId);
    const destAccount = accounts.find(a => a.id === formState.destinationAccId);
    const isDifferentCurrency = formState.type === 'transfer' && sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;
    const currentBalance = sourceAccount?.balanceCents || 0;
    const expenseAmount = toCents(amount);
    const projectedBalance = (formState.type === 'expense' || formState.type === 'transfer') ? currentBalance - expenseAmount : currentBalance + expenseAmount;
    const isOverdraft = (formState.type === 'expense' || formState.type === 'transfer') && projectedBalance < 0;

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formState.title.trim()) newErrors.title = 'Description is required';
        if (formState.title && containsDangerousPatterns(formState.title)) newErrors.title = 'Description contains invalid content';
        if (!amount || toCents(amount) <= 0) newErrors.amount = 'Valid amount required';
        if (!formState.category.trim()) newErrors.category = 'Category is required';
        if (formState.type === 'transfer' && (!formState.destinationAccId || formState.destinationAccId === formState.selectedAccId)) {
            newErrors.destination = 'Select a different destination account';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !validate() || !sourceAccount || !user) return;
        const amountCents = Math.abs(toCents(amount));
        if (!amountCents) return;

        setIsSubmitting(true);
        try {
            const finalCategory = formState.type === 'transfer' ? 'Transfer' : formState.category;
            let destinationAmountCents = amountCents;
            if (isDifferentCurrency) {
                const rate = parseFloat(formState.exchangeRate);
                if (isNaN(rate) || rate <= 0) throw new Error('Invalid exchange rate');
                // BUG-FIX: Use amountCents directly to avoid parsing issues with comma-formatted strings
                destinationAmountCents = Math.round(amountCents * rate);

                if (destinationAmountCents <= 0) {
                    throw new Error('Transfer amount too small for this exchange rate');
                }
            }

            const isoDate = new Date(transactionDate + 'T12:00:00').toISOString();

            // 1. Handle Recurring Rule Creation
            if (isRecurring && !initialData) {
                await createRecurring({
                    title: formState.title,
                    amountCents,
                    type: formState.type,
                    category: finalCategory,
                    accountId: formState.selectedAccId,
                    accountName: sourceAccount.name,
                    frequency,
                    interval,
                    nextRunAt: isoDate, // First run date
                    status: 'active',
                    userId: user.uid,
                    createdAt: new Date().toISOString()
                });
                showToast('Recurring rule created!', 'success');
            }

            // 2. Create Standard Transaction (Immediate)
            if (initialData) {
                await updateTransaction(initialData.id, initialData.accountId, {
                    title: formState.title, amountCents, type: formState.type, category: finalCategory, date: transactionDate,
                    // BUG-034: Include cross-currency amounts for transfer edits
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(formState.exchangeRate) })
                });
                haptic.trigger('success');
                showToast('Transaction updated', 'success');
            } else {
                await addTransaction({
                    title: formState.title, amountCents, type: formState.type, category: finalCategory,
                    accountId: formState.selectedAccId, accountName: sourceAccount.name,
                    currency: sourceAccount.currency, date: isoDate,
                    scope: sourceAccount.scope,
                    destinationAccountId: formState.type === 'transfer' ? formState.destinationAccId : undefined,
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(formState.exchangeRate) })
                });
                haptic.trigger('success');
                showToast('Transaction recorded', 'success');
            }

            await refetch();
            if (!initialData) {
                formState.setTitle('');
                setAmount('');
                setTransactionDate(new Date().toISOString().split('T')[0]);
                setIsRecurring(false); // Reset recurring toggle
            }
            onClose();
        } catch (error) {
            console.error('[TransactionForm] Failed to save transaction:', error);
            haptic.trigger('error');
            showToast(mapFirebaseError(error), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Early returns for empty states
    if (accounts.length === 0) return <NoAccountsMessage />;
    if (formState.type === 'transfer' && accounts.length === 1) return <SingleAccountTransferMessage onClose={onClose} />;

    return (
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-4">{getTransactionLabel(formState.type).header}</h3>
            {isOverdraft && <OverdraftWarning projectedBalance={projectedBalance} amountCents={toCents(amount)} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                <AccountSelector accounts={accounts} selectedId={formState.selectedAccId} onSelect={formState.setSelectedAccId} label={getTransactionLabel(formState.type).accountLabel} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DescriptionField value={formState.title} onChange={formState.setTitle} error={errors.title} onClearError={() => setErrors({ ...errors, title: undefined })} />
                    <AmountField value={amount} onChange={setAmount} error={errors.amount} onClearError={() => setErrors({ ...errors, amount: undefined })} currency={sourceAccount?.currency} />
                </div>

                <TransactionTypeSelector type={formState.type} onChange={formState.setType} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        {formState.type === 'transfer' ? (
                            <TransferDetails accounts={accounts} sourceAccount={sourceAccount} destinationAccId={formState.destinationAccId}
                                onDestinationChange={(id) => { formState.setDestinationAccId(id); if (errors.destination) setErrors({ ...errors, destination: undefined }); }}
                                exchangeRate={formState.exchangeRate} onExchangeRateChange={formState.setExchangeRate} amount={amount} error={errors.destination} />
                        ) : (
                            <CategorySelector category={formState.category} onChange={(c) => { formState.setCategory(c); formState.setSuggestedCategory(null); }}
                                suggestedCategory={formState.suggestedCategory} onAcceptSuggestion={() => { formState.setCategory(formState.suggestedCategory!); formState.setSuggestedCategory(null); }} error={errors.category} />
                        )}
                    </div>
                    <DateField value={transactionDate} onChange={setTransactionDate} />
                </div>

                {/* Recurring Options - Hidden during updates for now */}
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
                        {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' :
                            (isRecurring ? 'Record & Schedule Recurring' :
                                (formState.type === 'transfer' ? 'Record Transfer' : 'Record Transaction'))
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

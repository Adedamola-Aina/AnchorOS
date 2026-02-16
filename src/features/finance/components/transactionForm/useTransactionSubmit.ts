/**
 * Transaction form submission logic.
 *
 * Handles validation, recurring rule creation, and transaction add/update
 * orchestration so the TransactionForm component stays presentational.
 */
// @ts-nocheck


import { useState, useCallback } from 'react';
import { useFinance } from '../../../../context/FinanceContext';
import { useNotifications } from '../../../../context/NotificationContext';
import { useHaptic } from '../../../../hooks/useHaptic';
import { useAuth } from '../../../../context/AuthContext';
import { useCreateRecurringTransaction } from '../../../../hooks/useRecurringQueries';
import { toCents } from '../../../../utils/moneyUtils';
import { mapFirebaseError } from '../../../../utils/errorUtils';
import { captureError } from '../../../../utils/error';
import { containsDangerousPatterns } from '../../../../utils/validation';
import type { AnchorTransaction, AnchorAccount, RecurringFrequency, TransactionType } from '../../../../types';

export interface FormErrors {
    title?: string;
    amount?: string;
    destination?: string;
    category?: string;
}

interface UseTransactionSubmitOptions {
    formState: {
        title: string; setTitle: (v: string) => void;
        type: TransactionType; category: string;
        selectedAccId: string; destinationAccId: string;
        exchangeRate: string; suggestedCategory: string | null;
        setSuggestedCategory: (v: string | null) => void;
    };
    amount: string; setAmount: (v: string) => void;
    transactionDate: string; setTransactionDate: (v: string) => void;
    isRecurring: boolean; setIsRecurring: (v: boolean) => void;
    frequency: RecurringFrequency;
    interval: number;
    initialData?: AnchorTransaction;
    sourceAccount: AnchorAccount | undefined;
    isDifferentCurrency: boolean;
    onClose: () => void;
}

export function useTransactionSubmit(options: UseTransactionSubmitOptions) {
    const {
        formState, amount, setAmount, transactionDate, setTransactionDate,
        isRecurring, setIsRecurring, frequency, interval,
        initialData, sourceAccount, isDifferentCurrency, onClose,
    } = options;

    const haptic = useHaptic();
    const { user } = useAuth();
    const { addTransaction, updateTransaction, refetch } = useFinance();
    const { mutateAsync: createRecurring } = useCreateRecurringTransaction();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = useCallback(() => {
        const newErrors: FormErrors = {};
        if (!formState.title.trim()) newErrors.title = 'Description is required';
        if (formState.title && containsDangerousPatterns(formState.title)) newErrors.title = 'Description contains invalid content';
        if (!amount || toCents(amount) <= 0) newErrors.amount = 'Valid amount required';
        if (!formState.category.trim()) newErrors.category = 'Category is required';
        if (formState.type === 'transfer' && (!formState.destinationAccId || formState.destinationAccId === formState.selectedAccId)) {
            newErrors.destination = 'Select a different destination account';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formState.title, formState.category, formState.type, formState.destinationAccId, formState.selectedAccId, amount]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
                destinationAmountCents = Math.round(amountCents * rate);
                if (destinationAmountCents <= 0) throw new Error('Transfer amount too small for this exchange rate');
            }

            const isoDate = new Date(transactionDate + 'T12:00:00').toISOString();

            // Capture recurringId so we can link the transaction to its rule
            let recurringId: string | undefined;

            if (isRecurring && !initialData) {
                recurringId = await createRecurring({
                    title: formState.title, amountCents, type: formState.type,
                    category: finalCategory, accountId: formState.selectedAccId,
                    accountName: sourceAccount.name, frequency, interval,
                    nextRunAt: isoDate, status: 'active',
                    userId: user.uid, createdAt: new Date().toISOString()
                });
                showToast('Recurring rule created!', 'success');
            }

            if (initialData) {
                await updateTransaction(initialData.id, initialData.accountId, {
                    title: formState.title, amountCents, type: formState.type,
                    category: finalCategory, date: transactionDate,
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(formState.exchangeRate) })
                });
                haptic.trigger('success');
                showToast('Transaction updated', 'success');
            } else {
                await addTransaction({
                    title: formState.title, amountCents, type: formState.type,
                    category: finalCategory, accountId: formState.selectedAccId,
                    accountName: sourceAccount.name, currency: sourceAccount.currency,
                    date: isoDate, scope: sourceAccount.scope,
                    destinationAccountId: formState.type === 'transfer' ? formState.destinationAccId : undefined,
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(formState.exchangeRate) }),
                    ...(recurringId && { recurringId }),
                });
                haptic.trigger('success');
                showToast('Transaction recorded', 'success');
            }

            await refetch();
            if (!initialData) {
                formState.setTitle('');
                setAmount('');
                setTransactionDate(new Date().toISOString().split('T')[0]);
                setIsRecurring(false);
            }
            onClose();
        } catch (error) {
            captureError(error, 'TransactionForm.submit');
            haptic.trigger('error');
            showToast(mapFirebaseError(error), 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        isSubmitting, validate, sourceAccount, user, amount, formState,
        isDifferentCurrency, transactionDate, isRecurring, initialData,
        createRecurring, frequency, interval, updateTransaction, addTransaction,
        refetch, setAmount, setTransactionDate, setIsRecurring, onClose,
        haptic, showToast
    ]);

    return { isSubmitting, errors, setErrors, handleSubmit };
}

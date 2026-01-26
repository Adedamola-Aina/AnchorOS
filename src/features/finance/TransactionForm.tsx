/**
 * TransactionForm
 * 
 * Main form component for creating/editing transactions.
 * Already uses extracted sub-components for maintainability.
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This form exceeds 200 lines because it already
 * delegates UI to extracted components (AccountSelector, CategorySelector, etc.).
 * The remaining code is tightly coupled form state, validation, and submission logic
 * that would gain no clarity from further extraction.
 * 
 * @example
 * <TransactionForm onClose={() => {}} defaultType="expense" />
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useNotifications } from '../../context/NotificationContext';
import { suggestCategory, getTransactionLabel } from '../../utils/finance';
import { toCents, fromCents } from '../../utils/moneyUtils';
import { mapFirebaseError } from '../../utils/errorUtils';
import { containsDangerousPatterns } from '../../utils/validation';
import type { TransactionType, AnchorTransaction } from '../../types';

import {
    AccountSelector,
    CategorySelector,
    OverdraftWarning,
    TransactionTypeSelector,
    TransferDetails
} from './components';

interface TransactionFormProps {
    onClose: () => void;
    defaultAccountId?: string;
    defaultType?: TransactionType;
    initialData?: AnchorTransaction;
    prefillData?: {
        amount?: number; // Cents? No, usually raw text logic needs strings, but hook passed number. Let's check hook.
        // Hook passes `amount: number | undefined` (parsed via parseAmountFromText).
        // Form expects string in `useState` for amount input.
        // Let's take number and convert.
        title?: string;
        category?: string;
    };
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
    onClose,
    defaultAccountId,
    defaultType = 'expense',
    initialData,
    prefillData
}) => {
    const { transactions, accounts, addTransaction, updateTransaction } = useFinance();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state setup
    const initialAmount = initialData
        ? fromCents(initialData.amountCents || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : prefillData?.amount
            ? prefillData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '';
    const initialDate = initialData?.date
        ? new Date(initialData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    // Form State
    const [title, setTitle] = useState(initialData?.title || prefillData?.title || '');
    const [amount, setAmount] = useState(initialAmount);
    const [type, setType] = useState<TransactionType>(initialData?.type || defaultType);
    const [category, setCategory] = useState(initialData?.category || prefillData?.category || 'General');
    const [selectedAccId, setSelectedAccId] = useState(initialData?.accountId || defaultAccountId || '');
    const [destinationAccId, setDestinationAccId] = useState(initialData?.destinationAccountId || '');
    const [transactionDate, setTransactionDate] = useState(initialDate);
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState('1.0');
    const [errors, setErrors] = useState<{ title?: string; amount?: string; destination?: string; category?: string }>({});

    // Smart Defaults
    useEffect(() => {
        if (initialData) return;
        if (defaultAccountId) {
            setSelectedAccId(defaultAccountId);
            return;
        }
        const lastAccId = localStorage.getItem('anchor_last_account_id');
        if (lastAccId && accounts.find(a => a.id === lastAccId)) {
            setSelectedAccId(lastAccId);
        } else if (accounts.length > 0 && !selectedAccId) {
            setSelectedAccId(accounts[0].id);
        }
        if (accounts.length > 1 && !destinationAccId) {
            const dest = accounts.find(a => a.id !== selectedAccId && a.id !== lastAccId);
            setDestinationAccId(dest?.id || accounts[1].id);
        }
    }, [accounts, defaultAccountId, initialData, selectedAccId, destinationAccId]);

    // Prevent same-account transfer
    useEffect(() => {
        if (selectedAccId === destinationAccId && accounts.length > 1) {
            const next = accounts.find(a => a.id !== selectedAccId);
            if (next) setDestinationAccId(next.id);
        }
    }, [selectedAccId, destinationAccId, accounts]);

    // Reset exchange rate on account change
    useEffect(() => {
        setExchangeRate('1.0');
    }, [selectedAccId, destinationAccId]);

    // Smart categorization with debounce to avoid running on every keystroke
    const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear previous timeout
        if (suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }

        if (title.length >= 2 && type !== 'transfer') {
            // Debounce 300ms
            suggestionTimeoutRef.current = setTimeout(() => {
                const suggestion = suggestCategory(title, transactions);
                if (suggestion && suggestion !== category) {
                    setSuggestedCategory(suggestion);
                } else {
                    setSuggestedCategory(null);
                }
            }, 300);
        } else {
            setSuggestedCategory(null);
        }

        return () => {
            if (suggestionTimeoutRef.current) {
                clearTimeout(suggestionTimeoutRef.current);
            }
        };
    }, [title, transactions, category, type]);

    // Derived state
    const sourceAccount = accounts.find(a => a.id === selectedAccId);
    const destAccount = accounts.find(a => a.id === destinationAccId);
    const isDifferentCurrency = type === 'transfer' && sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;
    const currentBalance = sourceAccount?.balanceCents || 0;
    const expenseAmount = toCents(amount);
    const projectedBalance = (type === 'expense' || type === 'transfer') ? currentBalance - expenseAmount : currentBalance + expenseAmount;
    const isOverdraft = (type === 'expense' || type === 'transfer') && projectedBalance < 0;

    // Account selection with persistence
    const handleSetAccount = (id: string) => {
        setSelectedAccId(id);
        localStorage.setItem('anchor_last_account_id', id);
    };

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) newErrors.title = 'Description is required';
        if (title && containsDangerousPatterns(title)) newErrors.title = 'Description contains invalid content';
        if (!amount || toCents(amount) <= 0) newErrors.amount = 'Valid amount required';
        if (!category.trim()) newErrors.category = 'Category is required';
        if (type === 'transfer' && (!destinationAccId || destinationAccId === selectedAccId)) {
            newErrors.destination = 'Select a different destination account';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !validate() || !sourceAccount) return;

        const amountCents = Math.abs(toCents(amount));
        if (!amountCents) return;

        setIsSubmitting(true);
        try {
            const finalCategory = type === 'transfer' ? 'Transfer' : category;
            let destinationAmountCents = amountCents;

            if (isDifferentCurrency) {
                const rate = parseFloat(exchangeRate);
                if (isNaN(rate) || rate <= 0) throw new Error('Invalid exchange rate');
                destinationAmountCents = Math.round(amountCents * rate);
            }

            if (initialData) {
                await updateTransaction(initialData.id, initialData.accountId, {
                    title, amountCents, type, category: finalCategory, date: transactionDate,
                });
                showToast('Transaction updated successfully', 'success');
            } else {
                const isoDate = new Date(transactionDate + 'T12:00:00').toISOString();
                await addTransaction({
                    title, amountCents, type, category: finalCategory,
                    accountId: selectedAccId, accountName: sourceAccount.name,
                    currency: sourceAccount.currency, date: isoDate,
                    destinationAccountId: type === 'transfer' ? destinationAccId : undefined,
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(exchangeRate) })
                } as any);
                showToast('Transaction recorded successfully', 'success');
            }

            if (!initialData) {
                setTitle('');
                setAmount('');
                setTransactionDate(new Date().toISOString().split('T')[0]);
            }
            onClose();
        } catch (error) {
            console.error('[TransactionForm] Failed to save transaction:', error);
            showToast(mapFirebaseError(error), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (accounts.length === 0) {
        return <p className="text-rose-500 text-sm p-4">Please create an account first.</p>;
    }

    // Show helpful message when user tries to transfer with only 1 account
    if (type === 'transfer' && accounts.length === 1) {
        return (
            <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                    <span className="text-3xl">💸</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">Need 2 Accounts for Transfers</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Transfers move money between your accounts. You currently have only one account.
                        <br />
                        <span className="font-medium text-slate-600 dark:text-slate-300">Create a second account first to make transfers.</span>
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                    Got it
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">{getTransactionLabel(type).header}</h3>

            {isOverdraft && <OverdraftWarning projectedBalance={projectedBalance} amountCents={toCents(amount)} />}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account Selection */}
                {!defaultAccountId && (
                    <AccountSelector
                        accounts={accounts}
                        selectedId={selectedAccId}
                        onSelect={handleSetAccount}
                        label={getTransactionLabel(type).accountLabel}
                    />
                )}

                {/* Description & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tx-title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                            Description {errors.title && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{errors.title}</span>}
                        </label>
                        <input
                            id="tx-title"
                            type="text"
                            placeholder="e.g. Groceries, Upwork Salary"
                            className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 transition-colors ${errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({ ...errors, title: undefined }); }}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label htmlFor="tx-amount" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                            Amount {errors.amount && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{errors.amount}</span>}
                        </label>
                        <div className="relative">
                            <input
                                id="tx-amount"
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold placeholder:text-slate-500 transition-all ${errors.amount ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                                value={amount}
                                onChange={(e) => { if (/^[0-9.,]*$/.test(e.target.value)) { setAmount(e.target.value); if (errors.amount) setErrors({ ...errors, amount: undefined }); } }}
                                onBlur={() => { if (amount) setAmount(fromCents(toCents(amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }}
                                onFocus={() => { if (amount) setAmount(amount.replace(/,/g, '')); }}
                            />
                            {sourceAccount && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{sourceAccount.currency}</span>}
                        </div>
                    </div>
                </div>

                {/* Transaction Type */}
                <TransactionTypeSelector type={type} onChange={setType} />

                {/* Category or Transfer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        {type === 'transfer' ? (
                            <TransferDetails
                                accounts={accounts}
                                sourceAccount={sourceAccount}
                                destinationAccId={destinationAccId}
                                onDestinationChange={(id) => { setDestinationAccId(id); if (errors.destination) setErrors({ ...errors, destination: undefined }); }}
                                exchangeRate={exchangeRate}
                                onExchangeRateChange={setExchangeRate}
                                amount={amount}
                                error={errors.destination}
                            />
                        ) : (
                            <CategorySelector
                                category={category}
                                onChange={(c) => { setCategory(c); setSuggestedCategory(null); }}
                                suggestedCategory={suggestedCategory}
                                onAcceptSuggestion={() => { setCategory(suggestedCategory!); setSuggestedCategory(null); }}
                                error={errors.category}
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date</label>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                                className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm">Cancel</button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : type === 'transfer' ? 'Record Transfer' : 'Record Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

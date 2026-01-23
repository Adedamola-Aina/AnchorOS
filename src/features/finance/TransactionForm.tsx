import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryIcon } from '../../components/shared';
import { suggestCategory, getTransactionLabel } from '../../utils/finance';
import { useNotifications } from '../../context/NotificationContext';
import { toCents, fromCents } from '../../utils/moneyUtils';
import { mapFirebaseError } from '../../utils/errorUtils';
import { formatCurrency } from '../../utils/format';
import type { TransactionType, AnchorTransaction } from '../../types';

interface TransactionFormProps {
    onClose: () => void;
    defaultAccountId?: string;
    defaultType?: TransactionType;
    initialData?: AnchorTransaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, defaultAccountId, defaultType = 'expense', initialData }) => {
    const { transactions, accounts, addTransaction, updateTransaction } = useFinance();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial state setup
    const initialAmount = initialData ? fromCents(initialData.amountCents).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    const initialDate = initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    // UI State
    const [title, setTitle] = useState(initialData?.title || '');
    const [amount, setAmount] = useState(initialAmount);
    const [type, setType] = useState<TransactionType>(initialData?.type || defaultType);
    const [category, setCategory] = useState(initialData?.category || 'General');
    const [selectedAccId, setSelectedAccId] = useState(initialData?.accountId || defaultAccountId || '');
    const [destinationAccId, setDestinationAccId] = useState(initialData?.destinationAccountId || '');

    // Date state
    const [transactionDate, setTransactionDate] = useState(initialDate);

    // Suggestion state
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

    // Currency Conversion State
    const [exchangeRate, setExchangeRate] = useState('1.0');

    // Smart Defaults (Only run if NOT editing)
    useEffect(() => {
        if (initialData) return;

        if (defaultAccountId) {
            setSelectedAccId(defaultAccountId);
            return;
        }

        // Load last used
        const lastAccId = localStorage.getItem('anchor_last_account_id');
        if (lastAccId && accounts.find(a => a.id === lastAccId)) {
            setSelectedAccId(lastAccId);
        } else if (accounts.length > 0 && !selectedAccId) {
            setSelectedAccId(accounts[0].id);
        }

        // Default destination
        if (accounts.length > 1 && !destinationAccId) {
            const dest = accounts.find(a => a.id !== selectedAccId && a.id !== lastAccId);
            setDestinationAccId(dest?.id || accounts[1].id);
        }
    }, [accounts, defaultAccountId, initialData, selectedAccId, destinationAccId]);

    // Helper to set account with persistence
    const handleSetAccount = (id: string) => {
        setSelectedAccId(id);
        localStorage.setItem('anchor_last_account_id', id);
    };

    // Prevent same-account transfer
    useEffect(() => {
        if (selectedAccId === destinationAccId && accounts.length > 1) {
            const next = accounts.find(a => a.id !== selectedAccId);
            if (next) setDestinationAccId(next.id);
        }
    }, [selectedAccId, destinationAccId, accounts]);

    // Derived state for accounts
    const sourceAccount = accounts.find(a => a.id === selectedAccId);
    const destAccount = accounts.find(a => a.id === destinationAccId);

    // Reset exchange rate when accounts change
    useEffect(() => {
        setExchangeRate('1.0');
    }, [selectedAccId, destinationAccId]);

    const isDifferentCurrency = type === 'transfer' && sourceAccount && destAccount && sourceAccount.currency !== destAccount.currency;

    // Smart categorization
    useEffect(() => {
        if (title.length >= 2 && type !== 'transfer') {
            const suggestion = suggestCategory(title, transactions);
            if (suggestion && suggestion !== category) {
                setSuggestedCategory(suggestion);
            } else {
                setSuggestedCategory(null);
            }
        } else {
            setSuggestedCategory(null);
        }
    }, [title, transactions, category, type]);

    // Overdraft Calculation
    const currentBalance = sourceAccount?.balanceCents || 0;
    const expenseAmount = toCents(amount);
    const projectedBalance = (type === 'expense' || type === 'transfer')
        ? currentBalance - expenseAmount
        : currentBalance + expenseAmount;

    const isOverdraft = (type === 'expense' || type === 'transfer') && projectedBalance < 0;

    // Validation State
    const [errors, setErrors] = useState<{ title?: string; amount?: string; destination?: string; category?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) newErrors.title = 'Description is required';
        if (title && (title.includes('<') || title.includes('>'))) {
            newErrors.title = 'Description contains invalid content';
        }
        if (!amount || toCents(amount) <= 0) newErrors.amount = 'Valid amount required';
        if (!category.trim()) newErrors.category = 'Category is required';

        if (type === 'transfer') {
            if (!destinationAccId || destinationAccId === selectedAccId) {
                newErrors.destination = 'Select a different destination account';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!validate()) return;

        const amountCents = Math.abs(toCents(amount));
        if (!amountCents) return;

        if (!sourceAccount) return;

        setIsSubmitting(true);
        try {
            const finalCategory = type === 'transfer' ? 'Transfer' : category;

            // Handle Transfer with Currency Conversion
            let destinationAmountCents = amountCents;
            if (isDifferentCurrency) {
                const rate = parseFloat(exchangeRate);
                if (isNaN(rate) || rate <= 0) throw new Error('Invalid exchange rate');
                // Simple conversion: Source * Rate = Dest
                // e.g. 100 USD * 1500 = 150,000 NGN
                destinationAmountCents = Math.round(amountCents * rate);
            }

            if (initialData) {
                // EDIT MODE
                await updateTransaction(
                    initialData.id,
                    initialData.accountId,
                    {
                        title,
                        amountCents,
                        type,
                        category: finalCategory,
                        date: transactionDate,
                    }
                );
                showToast('Transaction updated successfully', 'success');
            } else {
                // ADD MODE
                // Convert date to ISO string for Firestore (input is YYYY-MM-DD)
                const isoDate = new Date(transactionDate + 'T12:00:00').toISOString();
                await addTransaction({
                    title,
                    amountCents: amountCents,
                    type,
                    category: finalCategory,
                    accountId: selectedAccId,
                    accountName: sourceAccount.name,
                    currency: sourceAccount.currency,
                    date: isoDate,
                    destinationAccountId: type === 'transfer' ? destinationAccId : undefined,
                    // If currency differs, store the destination amount (Back-end support needed, 
                    // assuming addTransaction handles 'destinationAmountCents' if passed)
                    ...(isDifferentCurrency && { destinationAmountCents, exchangeRate: parseFloat(exchangeRate) })
                } as any);
                showToast('Transaction recorded successfully', 'success');
            }

            // Reset form if just adding, or close if editing
            if (!initialData) {
                setTitle('');
                setAmount('');
                setTransactionDate(new Date().toISOString().split('T')[0]);
                // Keep account selection
            }
            onClose();

        } catch (error) {
            console.error('[TransactionForm] Failed to save transaction:', error);
            const msg = mapFirebaseError(error);
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (accounts.length === 0) {
        return <p className="text-rose-500 text-sm p-4">Please create an account first.</p>;
    }

    const defaultCategories = [
        'General', 'Food', 'Groceries', 'Transport', 'Housing',
        'Utilities', 'Health', 'Entertainment', 'Travel', 'Education',
        'Salary', 'Investments', 'Shopping', 'Personal Care'
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">{getTransactionLabel(type).header}</h3>

            {/* Overdraft Warning */}
            {isOverdraft && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <div className="p-1 bg-rose-100 dark:bg-rose-800 rounded-full mt-0.5">
                        <ArrowRightLeft className="w-3 h-3 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">Warning: Overdraft Risk</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                            This transaction will take your account balance to <span className="font-mono font-bold">{toCents(amount) > 0 ? '-' : ''}{fromCents(Math.abs(projectedBalance)).toLocaleString()}</span>.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Source Account Selection (Only show if no context provided) */}
                {!defaultAccountId && (
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                            {getTransactionLabel(type).accountLabel}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {accounts.map(acc => (
                                <button
                                    key={acc.id}
                                    type="button"
                                    onClick={() => handleSetAccount(acc.id)}
                                    className={`text-left p-3 rounded-lg border transition-all ${selectedAccId === acc.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                >
                                    <div className="font-bold text-sm text-slate-800 dark:text-white truncate">{acc.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{acc.currency} • {acc.type}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="tx-title" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                            Description {errors.title && <span className="text-rose-500 ml-2 normal-case font-normal animate-pulse">{errors.title}</span>}
                        </label>
                        <input
                            id="tx-title"
                            type="text"
                            placeholder="e.g. Groceries, Upwork Salary"
                            className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-colors ${errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors({ ...errors, title: undefined });
                            }}
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
                                className={`w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-all ${errors.amount ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                                value={amount}
                                onChange={(e) => {
                                    if (/^[0-9.,]*$/.test(e.target.value)) {
                                        setAmount(e.target.value);
                                        if (errors.amount) setErrors({ ...errors, amount: undefined });
                                    }
                                }}
                                onBlur={() => {
                                    if (amount) {
                                        const cents = toCents(amount);
                                        const val = fromCents(cents);
                                        setAmount(val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                                    }
                                }}
                                onFocus={() => {
                                    if (amount) setAmount(amount.replace(/,/g, ''));
                                }}
                            />
                            {sourceAccount && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    {sourceAccount.currency}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 rounded-md text-xs font-medium py-2 transition-all ${type === 'income' ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('transfer')}
                        className={`flex-1 rounded-md text-xs font-medium py-2 transition-all flex items-center justify-center gap-1 ${type === 'transfer' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        <ArrowRightLeft className="w-3 h-3" />
                        Transfer
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        {type === 'transfer' ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                                <label htmlFor="tx-destination" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    <ArrowRightLeft className="w-3 h-3 inline mr-1" /> To Account
                                    {errors.destination && <span className="text-rose-500 ml-2 normal-case font-normal">{errors.destination}</span>}
                                </label>
                                {accounts.length < 2 ? (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                                        <p className="font-bold mb-1">Transfer Unavailable</p>
                                        Transfers require at least two accounts. Please create another account first, or switch to Expense/Income.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>From:</span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{sourceAccount?.name}</span>
                                            </div>
                                            <div className="h-px bg-slate-200 dark:bg-slate-700" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">To:</span>
                                                <select
                                                    id="tx-destination"
                                                    value={destinationAccId}
                                                    onChange={(e) => {
                                                        setDestinationAccId(e.target.value);
                                                        if (errors.destination) setErrors({ ...errors, destination: undefined });
                                                    }}
                                                    className="p-1 rounded bg-transparent text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-0 text-right cursor-pointer"
                                                >
                                                    {accounts.filter(a => a.id !== selectedAccId).map(acc => (
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
                                                        onChange={(e) => setExchangeRate(e.target.value)}
                                                        className="flex-1 p-1.5 text-right text-sm font-bold rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500"
                                                    />
                                                    <span className="text-xs font-mono text-slate-500">{destAccount?.currency}</span>
                                                </div>
                                                <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-1 text-right">
                                                    Receives: {formatCurrency(toCents(amount) * parseFloat(exchangeRate || '0'), destAccount?.currency || '')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="tx-category" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Category</label>
                                <div className="flex items-center gap-3 relative">
                                    <CategoryIcon category={category} size={14} className="scale-110" />
                                    <div className="flex-1 relative">
                                        <input
                                            id="tx-category"
                                            list="category-suggestions"
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value); setSuggestedCategory(null); }}
                                            placeholder="Select or type..."
                                            className={`w-full p-3 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.category ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-600'}`}
                                        />
                                        <datalist id="category-suggestions">
                                            {defaultCategories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>

                                        {suggestedCategory && suggestedCategory !== category && (
                                            <button
                                                type="button"
                                                onClick={() => { setCategory(suggestedCategory); setSuggestedCategory(null); }}
                                                className="absolute -bottom-6 left-0 text-[10px] text-blue-500 hover:text-blue-600 font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                                            >
                                                💡 Use "{suggestedCategory}" like before?
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
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

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm">Cancel</button>
                    <button
                        type="submit"
                        disabled={isSubmitting} // Removing early disable for empty amount so we can show validation error instead
                        className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : type === 'transfer' ? 'Record Transfer' : 'Record Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

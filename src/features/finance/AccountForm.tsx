
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Link2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { AnchorAccount, Currency } from '../../types';
import { toCents } from '../../utils/moneyUtils';
import { validateAccount, formatValidationErrors } from '../../utils/validation';
import { useNotifications } from '../../context/NotificationContext';
import { captureError } from '../../utils/error';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { LinkBankAccount } from './components/LinkBankAccount';
import { PopoverMenu, SegmentedControl } from '../../components/shared';
import { microMotion } from '../../animations/microInteractions';

type AccountMode = 'manual' | 'link';

interface AccountFormProps {
    onClose: () => void;
    /**
     * UX-FN-03: account creation and transaction recording were disconnected —
     * creating an account never invited the opening transaction. The success
     * state now offers exactly that, with the new account's id so the form can
     * preselect it.
     */
    onRecordFirstTransaction?: (accountId: string) => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onClose, onRecordFirstTransaction }) => {
    const { addAccount } = useFinance();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<AccountMode>('manual');
    /** UX-FN-03: set once the account exists, so the form can hand off to the next step. */
    const [created, setCreated] = useState<{ id: string; name: string } | null>(null);

    const [newAccName, setNewAccName] = useState('');
    const [newAccType, setNewAccType] = useState<AnchorAccount['type']>('checking');
    const [newAccCurrency, setNewAccCurrency] = useState<Currency>('NGN');
    const [newAccBalance, setNewAccBalance] = useState('');

    // Guard against losing unsaved form data on accidental tab switch
    const isDirty = useMemo(() => !!(newAccName.trim() || newAccBalance), [newAccName, newAccBalance]);
    useUnsavedChanges(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError(null);

        // Validate input
        const validation = validateAccount({
            name: newAccName,
            type: newAccType,
            currency: newAccCurrency,
            balanceCents: toCents(newAccBalance)
        });

        if (!validation.valid) {
            const errorMsg = formatValidationErrors(validation.errors);
            setError(errorMsg);
            showToast(errorMsg, 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const createdId = await addAccount({
                name: newAccName,
                type: newAccType,
                currency: newAccCurrency,
                balanceCents: toCents(newAccBalance),
                color: 'bg-slate-500',
                scope: 'personal' // Default to personal scope
            });
            showToast('Account created successfully', 'success');

            // UX-FN-03: a success state with ONE primary next step, instead of
            // closing and leaving the user to find "record a transaction" alone.
            setCreated({ id: createdId ?? '', name: newAccName.trim() });
            setNewAccName('');
            setNewAccBalance('');
        } catch (err) {
            captureError(err, 'AccountForm.addAccount');
            const msg = err instanceof Error ? err.message : 'Failed to create account';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (created) {
        return (
            <motion.div
                variants={microMotion.createSlideIn}
                initial="hidden"
                animate="visible"
                data-testid="account-created"
                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl space-y-4 text-center"
            >
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white">{created.name} is ready</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        The balance you entered is this account&apos;s opening balance. Record the transaction behind it now,
                        or come back to it later.
                    </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    {onRecordFirstTransaction && (
                        <button
                            type="button"
                            onClick={() => onRecordFirstTransaction(created.id)}
                            data-testid="record-first-transaction-after-create"
                            className="w-full min-h-11 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                        >
                            Record first transaction
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full min-h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={microMotion.createSlideIn}
            initial="hidden"
            animate="visible"
            className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl"
        >
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5" /> Setup New Account
            </h3>
            <div className="flex gap-1 mb-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg p-1">
                <button type="button" onClick={() => setMode('manual')} className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${mode === 'manual' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                    <Landmark className="w-3.5 h-3.5" /> Manual
                </button>
                <button type="button" onClick={() => setMode('link')} className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${mode === 'link' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                    <Link2 className="w-3.5 h-3.5" /> Link Bank
                </button>
            </div>
            {mode === 'link' ? (
                <LinkBankAccount onSuccess={onClose} onClose={onClose} />
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {error && (
                    <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Account Name
                        {newAccName.length > 255 && (
                            <span className="text-rose-500 ml-2 normal-case font-normal">
                                Must be 255 characters or fewer
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={newAccName}
                        onChange={e => setNewAccName(e.target.value)}
                        placeholder="e.g. Zenith Spending, Sterling Salary"
                        className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <PopoverMenu
                            label="Type"
                            items={[
                                { value: 'checking', label: 'Checking / Spending' },
                                { value: 'savings', label: 'Savings' },
                                { value: 'salary', label: 'Salary' },
                                { value: 'investment', label: 'Investment' },
                            ]}
                            value={newAccType}
                            onChange={(v) => setNewAccType(v as AnchorAccount['type'])}
                            testId="account-type-select"
                        />
                    </div>
                    <div>
                        <SegmentedControl
                            label="Currency"
                            options={[
                                { value: 'NGN', label: 'NGN (₦)' },
                                { value: 'USD', label: 'USD ($)' },
                            ]}
                            value={newAccCurrency}
                            onChange={(v) => setNewAccCurrency(v as Currency)}
                            testId="account-currency-control"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Initial Balance
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={newAccBalance}
                        onChange={(e) => {
                            if (/^[0-9.,]*$/.test(e.target.value)) setNewAccBalance(e.target.value);
                        }}
                        placeholder="0.00"
                        className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200">Cancel</button>
                    <button type="submit" disabled={isSubmitting || !newAccName} className="bg-slate-800 dark:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </div>
            </form>
            )}
        </motion.div>
    );
};

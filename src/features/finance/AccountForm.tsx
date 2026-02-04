/**
 * AccountForm - Form for creating new accounts
 * WEB-003: Framer Motion button hover/tap animations
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { AnchorAccount, Currency } from '../../types';
import { toCents } from '../../utils/moneyUtils';
import { validateAccount, formatValidationErrors } from '../../utils/validation';
import { useNotifications } from '../../context/NotificationContext';

interface AccountFormProps {
    onClose: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onClose }) => {
    const { addAccount } = useFinance();
    const { showToast } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newAccName, setNewAccName] = useState('');
    const [newAccType, setNewAccType] = useState<AnchorAccount['type']>('checking');
    const [newAccCurrency, setNewAccCurrency] = useState<Currency>('NGN');
    const [newAccBalance, setNewAccBalance] = useState('');

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
            await addAccount({
                name: newAccName,
                type: newAccType,
                currency: newAccCurrency,
                balanceCents: toCents(newAccBalance),
                color: 'bg-surface-3-dark',
                scope: 'personal' // Default to personal scope
            });
            showToast('Account created successfully', 'success');

            setNewAccName('');
            setNewAccBalance('');
            onClose();
        } catch (err) {
            console.error('[AccountForm] Failed to add account:', err);
            const msg = err instanceof Error ? err.message : 'Failed to create account';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-surface-2 dark:bg-surface-2-dark p-1 rounded-xl">
            <h3 className="text-h3 lg:text-h3-lg text-foreground dark:text-foreground-dark mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5" /> Setup New Account
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {error && (
                    <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">
                        Account Name
                        {newAccName.length > 255 && (
                            <span className="text-danger-500 ml-2 normal-case font-normal">
                                Must be 255 characters or fewer
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={newAccName}
                        onChange={e => setNewAccName(e.target.value)}
                        placeholder="e.g. Zenith Spending, Sterling Salary"
                        className="w-full p-3 rounded-lg border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark"
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Type</label>
                        <select value={newAccType} onChange={(e) => setNewAccType(e.target.value as AnchorAccount['type'])} className="w-full p-3 rounded-lg border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark">
                            <option value="checking">Checking / Spending</option>
                            <option value="savings">Savings</option>
                            <option value="salary">Salary</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">Currency</label>
                        <select
                            value={newAccCurrency}
                            onChange={(e) => setNewAccCurrency(e.target.value as Currency)}
                            className="w-full p-3 rounded-lg border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark"
                        >
                            <option value="NGN">NGN (₦)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-1">
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
                        className="w-full p-3 rounded-lg border border-border-subtle dark:border-border-dark bg-surface-1 dark:bg-surface-3-dark text-foreground dark:text-foreground-dark"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <motion.button 
                        type="button" 
                        onClick={onClose} 
                        className="text-muted text-sm hover:text-foreground dark:hover:text-foreground-dark"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button 
                        type="submit" 
                        disabled={isSubmitting || !newAccName} 
                        className="bg-foreground dark:bg-surface-3-dark text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        whileHover={{ scale: isSubmitting || !newAccName ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting || !newAccName ? 1 : 0.95 }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

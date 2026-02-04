/**
 * TransactionForm Empty States
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
 */

import React from 'react';

interface NoAccountsMessageProps {
    className?: string;
}

export const NoAccountsMessage: React.FC<NoAccountsMessageProps> = () => (
    <p className="text-rose-500 text-sm p-4">Please create an account first.</p>
);

interface SingleAccountTransferMessageProps {
    onClose: () => void;
}

export const SingleAccountTransferMessage: React.FC<SingleAccountTransferMessageProps> = ({ onClose }) => (
    <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <span className="text-3xl">💸</span>
        </div>
        <div>
            <h3 className="text-h3 lg:text-h3-lg text-foreground dark:text-foreground-dark mb-2">Need 2 Accounts for Transfers</h3>
            <p className="text-sm text-muted">
                Transfers move money between your accounts. You currently have only one account.
                <br />
                <span className="font-medium text-subtle dark:text-subtle-dark">Create a second account first to make transfers.</span>
            </p>
        </div>
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-subtle dark:text-subtle-dark hover:text-foreground dark:hover:text-foreground-dark transition-colors"
        >
            Got it
        </button>
    </div>
);

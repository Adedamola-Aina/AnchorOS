/**
 * Finance View Account Details Section
 * Extracted from FinanceView.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck


import React from 'react';
import { Modal } from '../../../components/shared/Modal';
import { ConfirmationModal } from '../../../components/shared/ConfirmationModal';
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary';
import { TransactionForm } from '../TransactionForm';
import { AccountDetailsView } from '../AccountDetailsView';
import type { AnchorAccount, AnchorTransaction } from '../../../types';

interface AccountDetailsContainerProps {
    account: AnchorAccount;
    mode: 'view' | 'addTx' | 'addAcc' | 'editTx';
    editingTransaction?: AnchorTransaction;
    initialTransactionType: 'expense' | 'income' | 'transfer';
    accountToDelete: AnchorAccount | null;
    accountToUnshare: AnchorAccount | null;
    familyMemberUid?: string;
    familyMemberName?: string;
    prefillData?: { amount?: number; title?: string; category?: string };
    onBack: () => void;
    onShare: () => void;
    onAddTransaction: () => void;
    onEdit: (tx: AnchorTransaction) => void;
    onDelete: () => void;
    onCloseForm: () => void;
    onDeleteAccount: () => void;
    setAccountToDelete: (a: AnchorAccount | null) => void;
    onUnshareAccount: () => void;
    setAccountToUnshare: (a: AnchorAccount | null) => void;
}

export const AccountDetailsContainer: React.FC<AccountDetailsContainerProps> = ({
    account, mode, editingTransaction, initialTransactionType, accountToDelete, accountToUnshare,
    familyMemberUid, familyMemberName, prefillData, onBack, onShare, onAddTransaction, onEdit, onDelete,
    onCloseForm, onDeleteAccount, setAccountToDelete, onUnshareAccount, setAccountToUnshare
}) => (
    <>
        <ErrorBoundary componentName="Account Details">
            <AccountDetailsView account={account} onBack={onBack} familyMemberId={familyMemberUid} onShare={onShare} onAddTransaction={onAddTransaction} onEdit={onEdit} onDelete={onDelete} />
        </ErrorBoundary>

        <Modal isOpen={mode === 'addTx' || mode === 'editTx'} onClose={onCloseForm}
            title={mode === 'editTx' ? 'Edit Transaction' : 'Record Transaction'} maxWidth="max-w-2xl">
            <TransactionForm onClose={onCloseForm} defaultAccountId={account.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} lockedAccount />
        </Modal>

        <ConfirmationModal isOpen={!!accountToDelete} onClose={() => setAccountToDelete(null)}
            onConfirm={onDeleteAccount} title="Delete Account" message={`Are you sure you want to delete "${accountToDelete?.name}"?`} confirmLabel="Delete Account" isDestructive />
        <ConfirmationModal isOpen={!!accountToUnshare} onClose={() => setAccountToUnshare(null)}
            onConfirm={onUnshareAccount} title="Stop Sharing Account?" message={`Are you sure you want to stop sharing "${accountToUnshare?.name}" with ${familyMemberName || 'your family member'}? They will no longer be able to see this account or its transactions.`} confirmLabel="Stop Sharing" cancelLabel="Keep Sharing" isDestructive />
    </>
);

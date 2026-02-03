/**
 * Finance View Account Details Section
 * DES-002: Uses semantic Modal and ConfirmationModal components
 */


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
    onBack: () => void;
    onShare: () => void;
    onTransfer: () => void;
    onPayBill: () => void;
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
    familyMemberUid, familyMemberName, onBack, onShare, onTransfer, onPayBill, onEdit, onDelete,
    onCloseForm, onDeleteAccount, setAccountToDelete, onUnshareAccount, setAccountToUnshare
}) => (
    <>
        <ErrorBoundary componentName="Account Details">
            <AccountDetailsView account={account} onBack={onBack} familyMemberId={familyMemberUid} onShare={onShare} onTransfer={onTransfer} onPayBill={onPayBill} onEdit={onEdit} onDelete={onDelete} />
        </ErrorBoundary>

        <Modal isOpen={mode === 'addTx' || mode === 'editTx'} onClose={onCloseForm}
            title={mode === 'editTx' ? 'Edit Transaction' : initialTransactionType === 'transfer' ? 'Transfer Funds' : 'Pay Bill / Add Expense'} maxWidth="max-w-2xl">
            <TransactionForm onClose={onCloseForm} defaultAccountId={account.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} />
        </Modal>

        <ConfirmationModal isOpen={!!accountToDelete} onClose={() => setAccountToDelete(null)}
            onConfirm={onDeleteAccount} title="Delete Account" message={`Are you sure you want to delete "${accountToDelete?.name}"?`} confirmLabel="Delete Account" isDestructive />
        <ConfirmationModal isOpen={!!accountToUnshare} onClose={() => setAccountToUnshare(null)}
            onConfirm={onUnshareAccount} title="Stop Sharing Account?" message={`Are you sure you want to stop sharing "${accountToUnshare?.name}" with ${familyMemberName || 'your family member'}? They will no longer be able to see this account or its transactions.`} confirmLabel="Stop Sharing" cancelLabel="Keep Sharing" isDestructive />
    </>
);

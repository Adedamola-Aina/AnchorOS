/**
 * Finance View Account Details Section
 * Extracted from FinanceView.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
export const AccountDetailsContainer: React.FC<AccountDetailsContainerProps> = stryMutAct_9fa48("4210") ? () => undefined : (stryCov_9fa48("4210"), (() => {
  const AccountDetailsContainer: React.FC<AccountDetailsContainerProps> = ({
    account,
    mode,
    editingTransaction,
    initialTransactionType,
    accountToDelete,
    accountToUnshare,
    familyMemberUid,
    familyMemberName,
    onBack,
    onShare,
    onTransfer,
    onPayBill,
    onEdit,
    onDelete,
    onCloseForm,
    onDeleteAccount,
    setAccountToDelete,
    onUnshareAccount,
    setAccountToUnshare
  }) => <>
        <ErrorBoundary componentName="Account Details">
            <AccountDetailsView account={account} onBack={onBack} familyMemberId={familyMemberUid} onShare={onShare} onTransfer={onTransfer} onPayBill={onPayBill} onEdit={onEdit} onDelete={onDelete} />
        </ErrorBoundary>

        <Modal isOpen={stryMutAct_9fa48("4213") ? mode === 'addTx' && mode === 'editTx' : stryMutAct_9fa48("4212") ? false : stryMutAct_9fa48("4211") ? true : (stryCov_9fa48("4211", "4212", "4213"), (stryMutAct_9fa48("4215") ? mode !== 'addTx' : stryMutAct_9fa48("4214") ? false : (stryCov_9fa48("4214", "4215"), mode === (stryMutAct_9fa48("4216") ? "" : (stryCov_9fa48("4216"), 'addTx')))) || (stryMutAct_9fa48("4218") ? mode !== 'editTx' : stryMutAct_9fa48("4217") ? false : (stryCov_9fa48("4217", "4218"), mode === (stryMutAct_9fa48("4219") ? "" : (stryCov_9fa48("4219"), 'editTx')))))} onClose={onCloseForm} title={(stryMutAct_9fa48("4222") ? mode !== 'editTx' : stryMutAct_9fa48("4221") ? false : stryMutAct_9fa48("4220") ? true : (stryCov_9fa48("4220", "4221", "4222"), mode === (stryMutAct_9fa48("4223") ? "" : (stryCov_9fa48("4223"), 'editTx')))) ? stryMutAct_9fa48("4224") ? "" : (stryCov_9fa48("4224"), 'Edit Transaction') : (stryMutAct_9fa48("4227") ? initialTransactionType !== 'transfer' : stryMutAct_9fa48("4226") ? false : stryMutAct_9fa48("4225") ? true : (stryCov_9fa48("4225", "4226", "4227"), initialTransactionType === (stryMutAct_9fa48("4228") ? "" : (stryCov_9fa48("4228"), 'transfer')))) ? stryMutAct_9fa48("4229") ? "" : (stryCov_9fa48("4229"), 'Transfer Funds') : stryMutAct_9fa48("4230") ? "" : (stryCov_9fa48("4230"), 'Pay Bill / Add Expense')} maxWidth="max-w-2xl">
            <TransactionForm onClose={onCloseForm} defaultAccountId={account.id} defaultType={stryMutAct_9fa48("4233") ? editingTransaction?.type && initialTransactionType : stryMutAct_9fa48("4232") ? false : stryMutAct_9fa48("4231") ? true : (stryCov_9fa48("4231", "4232", "4233"), (stryMutAct_9fa48("4234") ? editingTransaction.type : (stryCov_9fa48("4234"), editingTransaction?.type)) || initialTransactionType)} initialData={editingTransaction} />
        </Modal>

        <ConfirmationModal isOpen={stryMutAct_9fa48("4235") ? !accountToDelete : (stryCov_9fa48("4235"), !(stryMutAct_9fa48("4236") ? accountToDelete : (stryCov_9fa48("4236"), !accountToDelete)))} onClose={stryMutAct_9fa48("4237") ? () => undefined : (stryCov_9fa48("4237"), () => setAccountToDelete(null))} onConfirm={onDeleteAccount} title="Delete Account" message={stryMutAct_9fa48("4238") ? `` : (stryCov_9fa48("4238"), `Are you sure you want to delete "${stryMutAct_9fa48("4239") ? accountToDelete.name : (stryCov_9fa48("4239"), accountToDelete?.name)}"?`)} confirmLabel="Delete Account" isDestructive />
        <ConfirmationModal isOpen={stryMutAct_9fa48("4240") ? !accountToUnshare : (stryCov_9fa48("4240"), !(stryMutAct_9fa48("4241") ? accountToUnshare : (stryCov_9fa48("4241"), !accountToUnshare)))} onClose={stryMutAct_9fa48("4242") ? () => undefined : (stryCov_9fa48("4242"), () => setAccountToUnshare(null))} onConfirm={onUnshareAccount} title="Stop Sharing Account?" message={stryMutAct_9fa48("4243") ? `` : (stryCov_9fa48("4243"), `Are you sure you want to stop sharing "${stryMutAct_9fa48("4244") ? accountToUnshare.name : (stryCov_9fa48("4244"), accountToUnshare?.name)}" with ${stryMutAct_9fa48("4247") ? familyMemberName && 'your family member' : stryMutAct_9fa48("4246") ? false : stryMutAct_9fa48("4245") ? true : (stryCov_9fa48("4245", "4246", "4247"), familyMemberName || (stryMutAct_9fa48("4248") ? "" : (stryCov_9fa48("4248"), 'your family member')))}? They will no longer be able to see this account or its transactions.`)} confirmLabel="Stop Sharing" cancelLabel="Keep Sharing" isDestructive />
    </>;
  return AccountDetailsContainer;
})());
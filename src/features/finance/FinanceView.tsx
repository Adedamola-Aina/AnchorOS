/**
 * FinanceView - Main finance view with accounts and transactions
 * 
 * JUSTIFICATION (CLAUDE.md §3.2): This orchestrator exceeds 200 lines because:
 * 1. It manages dual render paths (AccountDetailsView + main list)
 * 2. Contains in-context modals for account-specific actions (Transfer/Pay Bill)
 * 3. Already extracts UI to NetWorthCards, EmptyAccountsState, AccountCard, etc.
 * Further extraction would fragment tightly-coupled view state without clarity gain.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { Landmark, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { SectionHeader } from '../../components/shared';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { Button } from '../../components/ui';
import { AccountCard, VirtualTransactionList } from './components';
import { NetWorthCards } from './components/NetWorthCards';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { AccountDetailsView } from './AccountDetailsView';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { MonthlyInsight } from './MonthlyInsight';

const FinanceView = () => {
  const {
    transactions, accounts, deleteTransaction, deleteAccount,
    currentMonth, nextMonth, prevMonth, loadingFinance, netWorth
  } = useFinance();
  const { user } = useAuth();
  const { isOwner: isFamilyOwner, familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);

  // UI State
  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [selectedAccount, setSelectedAccount] = useState<AnchorAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<AnchorAccount | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<AnchorAccount | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeAccounts = useMemo(() => accounts.filter(a => !a.isArchived), [accounts]);
  const showModal = accounts.length >= 3;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTransactions = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    return transactions.filter(t =>
      (t?.title || '').toLowerCase().includes(query) ||
      (t?.accountName || '').toLowerCase().includes(query) ||
      (t?.category || '').toLowerCase().includes(query)
    );
  }, [transactions, debouncedSearch]);

  const handleCloseForm = () => { setMode('view'); setEditingTransaction(undefined); };
  const handleEdit = (tx: AnchorTransaction) => { setEditingTransaction(tx); setMode('editTx'); };

  // Account Details View (with in-context modals for Transfer/Pay Bill)
  if (selectedAccount) {
    return (
      <>
        <ErrorBoundary componentName="Account Details">
          <AccountDetailsView
            account={selectedAccount}
            onBack={() => setSelectedAccount(null)}
            familyMemberId={familyMemberUid}
            onShare={() => {
              if (!familyMemberUid) return;
              const isShared = selectedAccount.sharedWith?.[familyMemberUid];
              if (isShared) setAccountToUnshare(selectedAccount);
              else toggleShareAccount(selectedAccount.id, true);
            }}
            onTransfer={() => { setInitialTransactionType('transfer'); setMode('addTx'); }}
            onPayBill={() => { setInitialTransactionType('expense'); setMode('addTx'); }}
            onEdit={handleEdit}
            onDelete={() => setAccountToDelete(selectedAccount)}
          />
        </ErrorBoundary>

        {/* In-context modal for account-specific transactions */}
        <Modal
          isOpen={mode === 'addTx' || mode === 'editTx'}
          onClose={handleCloseForm}
          title={mode === 'editTx' ? 'Edit Transaction' : initialTransactionType === 'transfer' ? 'Transfer Funds' : 'Pay Bill / Add Expense'}
          maxWidth="max-w-2xl"
        >
          <TransactionForm
            onClose={handleCloseForm}
            defaultAccountId={selectedAccount.id}
            defaultType={editingTransaction?.type || initialTransactionType}
            initialData={editingTransaction}
          />
        </Modal>

        {/* Account-specific modals */}
        <ConfirmationModal
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={() => {
            if (accountToDelete) {
              deleteAccount(accountToDelete.id);
              setAccountToDelete(null);
              setSelectedAccount(null);
            }
          }}
          title="Delete Account"
          message={`Are you sure you want to delete "${accountToDelete?.name}"?`}
          confirmLabel="Delete Account"
          isDestructive
        />
        <ConfirmationModal
          isOpen={!!accountToUnshare}
          onClose={() => setAccountToUnshare(null)}
          onConfirm={() => {
            if (accountToUnshare) {
              toggleShareAccount(accountToUnshare.id, false);
              setAccountToUnshare(null);
            }
          }}
          title="Stop Sharing Account?"
          message={`Are you sure you want to stop sharing "${accountToUnshare?.name}" with ${familyMemberName || 'your family member'}? They will no longer be able to see this account or its transactions.`}
          confirmLabel="Stop Sharing"
          cancelLabel="Keep Sharing"
          isDestructive
        />
      </>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8 relative">
      <SectionHeader
        title="Finance"
        subtitle="Multi-account asset management and cashflow tracking."
        action={
          <Button variant="secondary" size="sm" onClick={() => setMode(mode === 'addAcc' ? 'view' : 'addAcc')} className="gap-2">
            <Landmark className="w-4 h-4" /> <span>Add Account</span>
          </Button>
        }
      />

      <FamilyNotificationBanner />
      <NetWorthCards netWorth={netWorth} />
      <MonthlyInsight transactions={transactions} currency={activeAccounts[0]?.currency || 'NGN'} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAccounts.map((acc) => (
          <AccountCard
            key={acc.id}
            account={acc}
            userId={user?.uid || ''}
            isOwnerOfConnection={isFamilyOwner}
            familyMemberUid={familyMemberUid || undefined}
            onEdit={setSelectedAccount}
            onToggleShare={(acc, share) => share === false ? setAccountToUnshare(acc) : toggleShareAccount(acc.id, share)}
          />
        ))}
        {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}
      </div>

      {!showModal && mode === 'addAcc' && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <AccountForm onClose={handleCloseForm} />
        </div>
      )}

      {!showModal && (mode === 'addTx' || mode === 'editTx') && (
        <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} />
      )}

      {accounts.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></Button>
              <div className="px-2 flex items-center gap-2 min-w-[160px] justify-center text-sm font-bold text-slate-700 dark:text-slate-200">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" aria-label="Next month"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
              <input ref={searchInputRef} type="text" placeholder={`Search in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}...`}
                className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <VirtualTransactionList transactions={filteredTransactions} currentUserId={user?.uid} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={loadingFinance} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />
        </div>
      )}

      <Modal isOpen={showModal && mode !== 'view'} onClose={handleCloseForm} title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'} maxWidth="max-w-2xl">
        {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} />}
        {(mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} />}
      </Modal>

      <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={() => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); } }} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
    </div>
  );
};

export default FinanceView;

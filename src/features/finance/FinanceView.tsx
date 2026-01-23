import { useState, useEffect, useRef, useMemo } from 'react';
import { Landmark, Plus, Search, ChevronLeft, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { SectionHeader } from '../../components/shared';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { Button } from '../../components/ui';

import { AccountCard } from './components/AccountCard';
import { TransactionItem } from './components/TransactionItem';

import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { formatCurrency } from '../../utils/format';


import { AccountDetailsView } from './AccountDetailsView';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { MonthlyInsight } from './MonthlyInsight';

const FinanceView = () => {
  const {
    transactions,
    accounts,
    deleteTransaction,

    deleteAccount,
    currentMonth,
    nextMonth,
    prevMonth,
    loadingFinance,
    netWorth
  } = useFinance();
  const { user } = useAuth();
  const { isOwner: isFamilyOwner, familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);

  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [selectedAccount, setSelectedAccount] = useState<AnchorAccount | null>(null);
  // sharingAccount state removed (legacy)
  const [accountToDelete, setAccountToDelete] = useState<AnchorAccount | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<AnchorAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Debounce search query (300ms) to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeAccounts = useMemo(() => accounts.filter(a => !a.isArchived), [accounts]);

  // Conditional Modal Logic
  const showModal = accounts.length >= 3;
  const showInlineForm = !showModal;

  const handleCloseForm = () => {
    setMode('view');
    setEditingTransaction(undefined);
  };

  const handleEdit = (tx: AnchorTransaction) => {
    setEditingTransaction(tx);
    setMode('editTx');
  };

  const filteredTransactions = useMemo<AnchorTransaction[]>(() => {
    return transactions.filter(t => {
      const title = t?.title || '';
      const accountName = t?.accountName || '';
      const category = t?.category || '';
      const query = debouncedSearch.toLowerCase();
      return (
        title.toLowerCase().includes(query) ||
        accountName.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );
    });
  }, [transactions, debouncedSearch]);

  const handleTransfer = () => {
    setInitialTransactionType('transfer');
    setMode('addTx');
  };

  const handlePayBill = () => {
    setInitialTransactionType('expense');
    setMode('addTx');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8 relative">
      {selectedAccount ? (
        <ErrorBoundary componentName="Account Details">
          <AccountDetailsView
            account={selectedAccount}
            onBack={() => setSelectedAccount(null)}
            familyMemberId={familyMemberUid}
            onShare={() => {
              if (!familyMemberUid) return;
              const isShared = selectedAccount.sharedWith?.[familyMemberUid];
              if (isShared) {
                setAccountToUnshare(selectedAccount);
              } else {
                toggleShareAccount(selectedAccount.id, true);
              }
            }}
            onTransfer={handleTransfer}
            onPayBill={handlePayBill}
            onEdit={handleEdit}
            onDelete={() => setAccountToDelete(selectedAccount)}
          />
        </ErrorBoundary>
      ) : (
        <>
          <SectionHeader
            title="Finance"
            subtitle="Multi-account asset management and cashflow tracking."
            action={
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setMode(mode === 'addAcc' ? 'view' : 'addAcc')}
                  className="gap-2"
                >
                  <Landmark className="w-4 h-4" /> <span>Add Account</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setMode(mode === 'addTx' ? 'view' : 'addTx')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> <span>New Transaction</span>
                </Button>
              </div>
            }
          />

          {/* Family Notifications Banner */}
          <FamilyNotificationBanner />

          {/* Net Worth Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* NGN Net Worth Card */}
            {netWorth.NGN > 0 && (
              <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  <Landmark className="w-16 h-16 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Worth (NGN)</p>
                <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                  {formatCurrency(netWorth.NGN, 'NGN')}
                </h2>
              </div>
            )}

            {/* USD Net Worth Card */}
            {netWorth.USD > 0 && (
              <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-indigo-800">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  <DollarSign className="w-16 h-16 text-indigo-300" />
                </div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Net Worth (USD)</p>
                <h2 className="text-3xl font-black text-white tracking-tight tabular-nums">
                  {formatCurrency(netWorth.USD, 'USD')}
                </h2>
              </div>
            )}
          </div>

          <MonthlyInsight
            transactions={transactions}
            currency={activeAccounts[0]?.currency || 'NGN'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAccounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                userId={user?.uid || ''}
                isOwnerOfConnection={isFamilyOwner}
                familyMemberUid={familyMemberUid || undefined}
                onEdit={(acc) => setSelectedAccount(acc)}
                onToggleShare={(acc, share) => {
                  if (share === false) {
                    setAccountToUnshare(acc);
                  } else {
                    toggleShareAccount(acc.id, share);
                  }
                }}
              />
            ))}

            {!loadingFinance && accounts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
                    <Landmark className="w-10 h-10 text-emerald-500/60 dark:text-emerald-400/60" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No accounts yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6 text-sm">
                  Create your first account to start tracking your finances.
                </p>
                <Button
                  variant="success"
                  onClick={() => setMode('addAcc')}
                  className="gap-2"
                >
                  <Landmark className="w-4 h-4" />
                  <span>Create your first account</span>
                </Button>
              </div>
            )}
          </div>



          {showInlineForm && mode === 'addAcc' && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <AccountForm onClose={handleCloseForm} />
            </div>
          )}

          {showInlineForm && (mode === 'addTx' || mode === 'editTx') && (
            <TransactionForm
              onClose={handleCloseForm}
              defaultAccountId={activeAccounts[0]?.id}
              defaultType={editingTransaction?.type || initialTransactionType}
              initialData={editingTransaction}
            />
          )}

          {accounts.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                  <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" aria-label="Previous month">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="px-2 flex items-center gap-2 min-w-[160px] justify-center text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" aria-label="Next month">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={`Search in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}...`}
                    className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className={`divide-y divide-slate-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto ${loadingFinance ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
                {filteredTransactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    accountName={tx.accountName}
                    currentUserId={user?.uid}
                    onEdit={handleEdit}
                    onDelete={(tx) => deleteTransaction(tx.id, tx.accountId)}
                  />
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                      {searchQuery ? 'No transactions found' : 'No transactions yet'}
                    </h4>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-500 text-sm font-bold hover:underline">
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {(showModal || selectedAccount) && (
        <Modal
          isOpen={mode !== 'view'}
          onClose={handleCloseForm}
          title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'}
          maxWidth="max-w-2xl"
        >
          {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} />}
          {(mode === 'addTx' || mode === 'editTx') && (
            <TransactionForm
              onClose={handleCloseForm}
              defaultAccountId={selectedAccount?.id}
              defaultType={editingTransaction?.type || initialTransactionType}
              initialData={editingTransaction}
            />
          )}
        </Modal>
      )}

      {/* Legacy ShareModal removed */}

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
    </div>
  );
};

export default FinanceView;

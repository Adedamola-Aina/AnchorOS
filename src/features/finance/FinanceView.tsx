/**
 * FinanceView - Main finance view with accounts and transactions
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Account details section extracted to AccountDetailsContainer.tsx
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useResponsive } from '../../hooks/useResponsive';
import { SectionHeader } from '../../components/shared';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorTransaction } from '../../types';
import { Button } from '../../components/ui';
import { AccountCard, VirtualTransactionList } from './components';
import { NetWorthCards } from './components/NetWorthCards';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { AccountDetailsContainer } from './components/AccountDetailsContainer';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { MonthlyInsight } from './MonthlyInsight';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';

const FinanceView = () => {
  const { transactions, accounts, deleteTransaction, deleteAccount, currentMonth, nextMonth, prevMonth, loadingFinance, netWorth } = useFinance();
  const { user } = useAuth();
  const { isOwner: isFamilyOwner, familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);
  const { isMobile } = useResponsive();

  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<typeof accounts[0] | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<typeof accounts[0] | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [prefillData, setPrefillData] = useState<{ amount?: number; category?: string; title?: string } | undefined>(undefined);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeAccounts = useMemo(() => accounts.filter(a => !a.isArchived), [accounts]);
  const selectedAccount = useMemo(() => selectedAccountId ? accounts.find(a => a.id === selectedAccountId) || null : null, [selectedAccountId, accounts]);
  const showModal = accounts.length >= 3;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { e.preventDefault(); searchInputRef.current?.focus(); } };
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      const amountStr = searchParams.get('amount'); const amount = amountStr ? parseFloat(amountStr) : undefined;
      const category = searchParams.get('category') || undefined; const description = searchParams.get('description') || undefined;
      if (amount || category || description) { setPrefillData({ amount, category, title: description }); setMode('addTx'); setSearchParams({}, { replace: true }); }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300); return () => clearTimeout(timer); }, [searchQuery]);

  const filteredTransactions = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    return transactions.filter(t => (t?.title || '').toLowerCase().includes(query) || (t?.accountName || '').toLowerCase().includes(query) || (t?.category || '').toLowerCase().includes(query));
  }, [transactions, debouncedSearch]);

  const handleCloseForm = () => { setMode('view'); setEditingTransaction(undefined); setPrefillData(undefined); };
  const handleEdit = (tx: AnchorTransaction) => { setEditingTransaction(tx); setMode('editTx'); };
  const isSearching = debouncedSearch.length > 0;

  if (selectedAccount) {
    return (
      <FeatureErrorBoundary featureName="Finance">
        <AccountDetailsContainer account={selectedAccount} mode={mode} editingTransaction={editingTransaction} initialTransactionType={initialTransactionType}
          accountToDelete={accountToDelete} accountToUnshare={accountToUnshare} familyMemberUid={familyMemberUid || undefined} familyMemberName={familyMemberName || undefined}
          onBack={() => setSelectedAccountId(null)} onShare={() => { if (!familyMemberUid) return; const isShared = selectedAccount.sharedWith?.[familyMemberUid]; if (isShared) setAccountToUnshare(selectedAccount); else toggleShareAccount(selectedAccount.id, true); }}
          onTransfer={() => { setInitialTransactionType('transfer'); setMode('addTx'); }} onPayBill={() => { setInitialTransactionType('expense'); setMode('addTx'); }}
          onEdit={handleEdit} onDelete={() => setAccountToDelete(selectedAccount)} onCloseForm={handleCloseForm}
          onDeleteAccount={() => { if (accountToDelete) { deleteAccount(accountToDelete.id); setAccountToDelete(null); setSelectedAccountId(null); } }}
          setAccountToDelete={setAccountToDelete}
          onUnshareAccount={() => { if (accountToUnshare) { toggleShareAccount(accountToUnshare.id, false); setAccountToUnshare(null); } }}
          setAccountToUnshare={setAccountToUnshare} />
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary featureName="Finance">
      <div className={`animate-in fade-in slide-in-from-bottom-8 duration-500 relative ${isMobile ? 'space-y-5' : 'space-y-8'}`}>
        <SectionHeader title="Finance" subtitle="Multi-account asset management and cashflow tracking." action={<Button variant="secondary" size="sm" onClick={() => setMode(mode === 'addAcc' ? 'view' : 'addAcc')} className="gap-2"><Landmark className="w-4 h-4" /> <span>Add Account</span></Button>} />

        {!isSearching && (<><FamilyNotificationBanner /><NetWorthCards netWorth={netWorth} /><MonthlyInsight transactions={transactions} currency={activeAccounts[0]?.currency || 'NGN'} />
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isMobile ? 'gap-3' : 'gap-6'}`}>
            {activeAccounts.map((acc) => (<AccountCard key={acc.id} account={acc} userId={user?.uid || ''} isOwnerOfConnection={isFamilyOwner} familyMemberUid={familyMemberUid || undefined} onEdit={(acc) => setSelectedAccountId(acc.id)} onToggleShare={(acc, share) => share === false ? setAccountToUnshare(acc) : toggleShareAccount(acc.id, share)} />))}
            {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}
          </div></>)}

        {!showModal && mode === 'addAcc' && !isSearching && <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} /></div>}
        {!showModal && (mode === 'addTx' || mode === 'editTx') && !isSearching && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}

        {accounts.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></Button>
                <div className="px-2 flex items-center gap-2 min-w-[160px] justify-center text-sm font-bold text-slate-700 dark:text-slate-200"><Calendar className="w-4 h-4 text-slate-400" /><span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" aria-label="Next month"><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <div className="relative flex-1 w-full"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.5} /><input ref={searchInputRef} type="text" placeholder={`Search in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}...`} className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            </div>
            {isSearching && <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"><p className="text-xs font-medium text-blue-600 dark:text-blue-400">Found {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} matching "{debouncedSearch}"</p></div>}
            <VirtualTransactionList transactions={filteredTransactions} currentUserId={user?.uid} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={loadingFinance} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />
          </div>
        )}

        <Modal isOpen={showModal && mode !== 'view'} onClose={handleCloseForm} title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'} maxWidth="max-w-2xl">
          {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} />}
          {(mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}
        </Modal>
        <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={() => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); } }} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
      </div>
    </FeatureErrorBoundary>
  );
};

export default FinanceView;

/**
 * FinanceView — Apple Wallet-inspired finance page (UX-041 Phase 2)
 * 3-zone layout: Header → Total Assets → Card Stack
 * Account details via existing AccountDetailsContainer.
 */
// @ts-nocheck


import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Layers, List } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useResponsive } from '../../hooks/useResponsive';
import { SectionHeader } from '../../components/shared';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorTransaction } from '../../types';
import { AccountDetailsContainer } from './components/AccountDetailsContainer';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { CardStack } from '../../components/finance/CardStack';
import { TotalAssetsSummaryBar } from '../../components/finance/TotalAssetsSummaryBar';
import { SkeletonCards } from '../../components/finance/SkeletonCards';
import { useReorderAccounts } from '../../hooks/useReorderAccounts';

type ViewMode = 'collapsed' | 'expanded';
const VIEW_MODE_KEY = 'anchor_finance_view_mode';

function getStoredViewMode(): ViewMode {
  try { const v = localStorage.getItem(VIEW_MODE_KEY); return v === 'expanded' ? 'expanded' : 'collapsed'; }
  catch { return 'collapsed'; }
}

const FinanceView = () => {
  const { accounts, deleteTransaction, deleteAccount, loadingFinance } = useFinance();
  const { user } = useAuth();
  const { familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);
  useResponsive(); // triggers responsive re-renders
  const { reorder } = useReorderAccounts();

  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<typeof accounts[0] | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<typeof accounts[0] | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [prefillData, setPrefillData] = useState<{ amount?: number; category?: string; title?: string } | undefined>(undefined);

  const activeAccounts = useMemo(() => {
    const filtered = accounts.filter(a => !a.isArchived);
    return filtered.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
  }, [accounts]);
  const selectedAccount = useMemo(() => selectedAccountId ? accounts.find(a => a.id === selectedAccountId) || null : null, [selectedAccountId, accounts]);
  const showModal = accounts.length >= 3;

  // URL param handling (prefill)
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      const amountStr = searchParams.get('amount'); const amount = amountStr ? parseFloat(amountStr) : undefined;
      const category = searchParams.get('category') || undefined; const description = searchParams.get('description') || undefined;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: one-time URL param → state sync on mount
      if (amount || category || description) { setPrefillData({ amount, category, title: description }); setMode('addTx'); setSearchParams({}, { replace: true }); }
    }
  }, [searchParams, setSearchParams]);

  const toggleView = useCallback(() => {
    const next: ViewMode = viewMode === 'collapsed' ? 'expanded' : 'collapsed';
    setViewMode(next);
    try { localStorage.setItem(VIEW_MODE_KEY, next); } catch { /* noop */ }
  }, [viewMode]);

  const handleCloseForm = () => { setMode('view'); setEditingTransaction(undefined); setPrefillData(undefined); };
  const handleEdit = (tx: AnchorTransaction) => { setEditingTransaction(tx); setMode('editTx'); };
  const handleDeleteConfirm = () => {
    if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); }
  };

  const handleCardTap = useCallback((account: typeof accounts[0], _index: number, _el: HTMLElement) => {
    // TODO: shared element expand — FLIP technique, see spec §6.2
    setSelectedAccountId(account.id);
  }, []);

  // Detail view
  if (selectedAccount) {
    return (
      <FeatureErrorBoundary featureName="Finance">
        <AccountDetailsContainer account={selectedAccount} mode={mode} editingTransaction={editingTransaction} initialTransactionType={initialTransactionType}
          accountToDelete={accountToDelete} accountToUnshare={accountToUnshare} familyMemberUid={familyMemberUid || undefined} familyMemberName={familyMemberName || undefined} prefillData={prefillData}
          onBack={() => setSelectedAccountId(null)} onShare={() => { if (!familyMemberUid) return; const isShared = selectedAccount.sharedWith?.[familyMemberUid]; if (isShared) setAccountToUnshare(selectedAccount); else toggleShareAccount(selectedAccount.id, true); }}
          onAddTransaction={() => { setInitialTransactionType('expense'); setPrefillData(undefined); setMode('addTx'); }}
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
      <div className="relative space-y-5">
        {/* Zone 1: Page Header */}
        <SectionHeader title="Finance" action={
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { /* TODO: Finance search — query across all account transactions, display unified results list */ }} className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Search transactions">
              <Search className="w-5 h-5" />
            </button>
            <button type="button" onClick={toggleView} className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={viewMode === 'collapsed' ? 'Switch to list view' : 'Switch to stack view'}>
              {viewMode === 'collapsed' ? <List className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          </div>
        } />

        {/* Zone 2: Total Assets Summary Bar */}
        <TotalAssetsSummaryBar accounts={activeAccounts} />

        {/* Zone 3: Card Stack */}
        {loadingFinance && accounts.length === 0 && <SkeletonCards count={3} />}
        {activeAccounts.length > 0 && (
          <CardStack accounts={activeAccounts} mode={viewMode} onCardTap={handleCardTap} onReorder={reorder} />
        )}
        {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}

        {/* Forms / Modals — preserved from existing */}
        {!showModal && mode === 'addAcc' && <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} /></div>}
        {!showModal && (mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}

        <Modal isOpen={showModal && mode !== 'view'} onClose={handleCloseForm} title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'} maxWidth="max-w-2xl">
          {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} />}
          {(mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}
        </Modal>
        <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={handleDeleteConfirm} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
      </div>
    </FeatureErrorBoundary>
  );
};

export default FinanceView;

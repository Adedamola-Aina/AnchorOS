/**
 * FinanceView — Apple Wallet-inspired finance page (UX-041 Phase 2)
 * 3-zone layout: Header → Total Assets → Card Stack
 * Account details via existing AccountDetailsContainer.
 */
// @ts-nocheck


import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import { logProductEvent } from '../../services/telemetry';
import { haptic } from '../../utils/haptic';
import { FinanceSearchSheet } from './components/FinanceSearchSheet';
import { FinanceAccountsRoute } from './components/FinanceAccountsRoute';
import { FinanceSummarySheet } from './components/FinanceSummarySheet';
import { runFinanceViewTransition } from './financeViewTransition';

type ViewMode = 'collapsed' | 'expanded';
const VIEW_MODE_KEY = 'anchor_finance_view_mode';

function getStoredViewMode(): ViewMode {
  try { const v = localStorage.getItem(VIEW_MODE_KEY); return v === 'expanded' ? 'expanded' : 'collapsed'; }
  catch { return 'collapsed'; }
}

function getAccountIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/finance\/account\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isAccountsListPath(pathname: string): boolean {
  return pathname === '/finance/accounts';
}

const FinanceView = () => {
  const { accounts, transactions, deleteTransaction, deleteAccount, loadingFinance } = useFinance();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);
  useResponsive(); // triggers responsive re-renders
  const { reorder } = useReorderAccounts();

  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [accountToDelete, setAccountToDelete] = useState<typeof accounts[0] | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<typeof accounts[0] | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [prefillData, setPrefillData] = useState<{ amount?: number; category?: string; title?: string } | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const activeAccounts = useMemo(() => {
    const filtered = accounts.filter(a => !a.isArchived);
    return filtered.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
  }, [accounts]);
  const showAllAccountsRoute = useMemo(() => isAccountsListPath(location.pathname), [location.pathname]);
  const selectedAccountId = useMemo(() => getAccountIdFromPath(location.pathname), [location.pathname]);
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
    if (next === 'expanded') {
      haptic.selection();
    }
    try { localStorage.setItem(VIEW_MODE_KEY, next); } catch { /* noop */ }
    logProductEvent('finance_view_mode_toggled', { mode: next });
  }, [viewMode]);

  const handleReorder = useCallback(async (reorderedAccounts: typeof accounts) => {
    const movedAccount = reorderedAccounts.find((account, index) => activeAccounts[index]?.id !== account.id);
    if (movedAccount) {
      const fromIndex = activeAccounts.findIndex(account => account.id === movedAccount.id);
      const toIndex = reorderedAccounts.findIndex(account => account.id === movedAccount.id);
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        logProductEvent('finance_card_reordered', {
          accountId: movedAccount.id,
          fromIndex,
          toIndex,
        });
      }
    }
    await reorder(reorderedAccounts);
  }, [activeAccounts, reorder, accounts]);

  const handleCloseForm = () => { setMode('view'); setEditingTransaction(undefined); setPrefillData(undefined); };
  const handleEdit = (tx: AnchorTransaction) => { setEditingTransaction(tx); setMode('editTx'); };
  const handleDeleteConfirm = () => {
    if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); }
  };

  const openAccountDetails = useCallback((accountId: string) => {
    setIsSearchOpen(false);
    setIsSummaryOpen(false);
    void runFinanceViewTransition(() => {
      navigate(`/finance/account/${accountId}`, { state: { fromCard: true } });
    });
  }, [navigate]);

  const handleCardTap = useCallback((account: typeof accounts[0], _index: number, _cardEl: HTMLElement) => {
    logProductEvent('finance_card_tapped', { accountId: account.id, viewMode });
    openAccountDetails(account.id);
  }, [openAccountDetails, viewMode]);

  useEffect(() => {
    if (selectedAccountId && !selectedAccount && !loadingFinance) {
      navigate('/finance', { replace: true });
    }
  }, [loadingFinance, navigate, selectedAccount, selectedAccountId]);

  if (showAllAccountsRoute) {
    return (
      <FeatureErrorBoundary featureName="Finance">
        <FinanceAccountsRoute
          accounts={activeAccounts}
          currentUserId={user?.uid}
          onBack={() => navigate('/finance')}
          onCreateAccount={() => {
            setMode('addAcc');
            navigate('/finance');
          }}
          onOpenAccount={openAccountDetails}
        />
      </FeatureErrorBoundary>
    );
  }

  // Detail view
  if (selectedAccount) {
    return (
      <FeatureErrorBoundary featureName="Finance">
        <AccountDetailsContainer account={selectedAccount} mode={mode} editingTransaction={editingTransaction} initialTransactionType={initialTransactionType}
          accountToDelete={accountToDelete} accountToUnshare={accountToUnshare} familyMemberUid={familyMemberUid || undefined} familyMemberName={familyMemberName || undefined} prefillData={prefillData}
          onBack={() => { void runFinanceViewTransition(() => navigate('/finance')); }} onShare={() => { if (!familyMemberUid) return; const isShared = selectedAccount.sharedWith?.[familyMemberUid]; if (isShared) setAccountToUnshare(selectedAccount); else toggleShareAccount(selectedAccount.id, true); }}
          onAddTransaction={() => { setInitialTransactionType('expense'); setPrefillData(undefined); setMode('addTx'); }}
          onEdit={handleEdit} onDelete={() => setAccountToDelete(selectedAccount)} onCloseForm={handleCloseForm}
          onDeleteAccount={() => { if (accountToDelete) { logProductEvent('finance_account_deleted', { accountId: accountToDelete.id }); deleteAccount(accountToDelete.id); setAccountToDelete(null); navigate('/finance'); } }}
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
            <button type="button" onClick={() => { /* TODO: Finance search — query across all account transactions, display unified results list */ setIsSearchOpen(true); }} className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Search transactions">
              <Search className="w-5 h-5" />
            </button>
            <button type="button" onClick={toggleView} className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={viewMode === 'collapsed' ? 'Switch to list view' : 'Switch to stack view'}>
              {viewMode === 'collapsed' ? <List className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          </div>
        } />

        {/* Zone 2: Total Assets Summary Bar */}
        <TotalAssetsSummaryBar accounts={activeAccounts} onShowDetails={() => setIsSummaryOpen(true)} />

        {/* Zone 3: Card Stack */}
        {loadingFinance && accounts.length === 0 && <SkeletonCards count={3} />}
        {activeAccounts.length > 0 && (
          <CardStack accounts={activeAccounts} mode={viewMode} onCardTap={handleCardTap} onReorder={handleReorder} onShowAll={activeAccounts.length > 10 ? () => navigate('/finance/accounts') : undefined} />
        )}
        {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}

        {/* Forms / Modals — preserved from existing */}
        {!showModal && mode === 'addAcc' && <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} /></div>}
        {!showModal && (mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}

        <Modal isOpen={showModal && mode !== 'view'} onClose={handleCloseForm} title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'} maxWidth="max-w-2xl">
          {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} />}
          {(mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}
        </Modal>
        <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Finance Search" maxWidth="max-w-xl">
          <FinanceSearchSheet accounts={activeAccounts} transactions={transactions || []} onOpenAccount={openAccountDetails} />
        </Modal>
        <Modal isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} title="Total Assets" maxWidth="max-w-xl">
          <FinanceSummarySheet accounts={activeAccounts} onOpenAccount={openAccountDetails} />
        </Modal>
        <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={handleDeleteConfirm} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
      </div>
    </FeatureErrorBoundary>
  );
};

export default FinanceView;

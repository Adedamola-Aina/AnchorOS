/** FinanceView — Apple Wallet-inspired finance page (UX-041 Phase 2) */
// @ts-nocheck

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useResponsive } from '../../hooks/useResponsive';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import { TransactionQuickEntry } from './components/TransactionQuickEntry';
import type { AnchorTransaction, Currency } from '../../types';
import { AccountDetailsContainer } from './components/AccountDetailsContainer';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { CardStack } from '../../components/finance/CardStack';
import { TotalAssetsSummaryBar } from '../../components/finance/TotalAssetsSummaryBar';
import { SkeletonCards } from '../../components/finance/SkeletonCards';
import { useReorderAccounts } from '../../hooks/useReorderAccounts';
import { logProductEvent } from '../../services/telemetry';
import type { ParsedTransaction } from '../../services/fabric/transactionParser';
import { FinanceAccountsRoute } from './components/FinanceAccountsRoute';
import { FinanceDesktopContent } from './components/FinanceDesktopContent';
import { TransactionHistorySection } from './components/TransactionHistorySection';
import { FinanceBillsSection } from './components/FinanceBillsSection';
import { runFinanceViewTransition } from './financeViewTransition';
import { getAccountIdFromPath, isAccountsListPath } from './financeViewHelpers';
import { useFinanceCardInteraction } from './hooks/useFinanceCardInteraction';

const FinanceView = () => {
  const { accounts, transactions, deleteTransaction, deleteAccount, loadingFinance, netWorth } = useFinance();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { familyMemberUid, familyMemberName, shareAccount: toggleShareAccount } = useFamilySharing(user?.uid);
  const { isMobile } = useResponsive();
  const { reorder } = useReorderAccounts();

  const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>('view');
  const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
  const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [accountToDelete, setAccountToDelete] = useState<typeof accounts[0] | null>(null);
  const [accountToUnshare, setAccountToUnshare] = useState<typeof accounts[0] | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [prefillData, setPrefillData] = useState<{ amount?: number; category?: string; title?: string } | undefined>(undefined);

  const activeAccounts = useMemo(() => {
    const filtered = accounts.filter(a => !a.isArchived);
    return filtered.sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
  }, [accounts]);
  const primaryCurrency = useMemo<Currency>(() => {
    const counts: Record<string, number> = {};
    activeAccounts.forEach(a => { counts[a.currency] = (counts[a.currency] || 0) + 1; });
    return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as Currency) || 'NGN';
  }, [activeAccounts]);
  const showAllAccountsRoute = useMemo(() => isAccountsListPath(location.pathname), [location.pathname]);
  const selectedAccountId = useMemo(() => getAccountIdFromPath(location.pathname), [location.pathname]);
  const selectedAccount = useMemo(() => selectedAccountId ? accounts.find(a => a.id === selectedAccountId) || null : null, [selectedAccountId, accounts]);
  const showModal = accounts.length >= 3;

  const globalTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .filter(tx => !tx.isSoftDeleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const openAccountDetails = useCallback((accountId: string) => {
    void runFinanceViewTransition(() => {
      navigate(`/finance/account/${accountId}`, { state: { fromCard: true } });
    });
  }, [navigate]);

  const { viewMode, handleReorder, handleCardTap } = useFinanceCardInteraction(activeAccounts, reorder, openAccountDetails);

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

  const handleCloseForm = () => { setMode('view'); setEditingTransaction(undefined); setPrefillData(undefined); };
  const handleEdit = (tx: AnchorTransaction) => { setEditingTransaction(tx); setMode('editTx'); };
  const handleDeleteConfirm = () => {
    if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); }
  };
  const handleQuickEntry = (parsed: ParsedTransaction) => {
    setPrefillData({ amount: parsed.amount, category: parsed.category, title: parsed.title });
    setInitialTransactionType('expense'); setMode('addTx');
    logProductEvent('finance_quick_entry_used', { hasAmount: !!parsed.amount, hasCategory: !!parsed.category });
  };

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
        <div className="flex items-start justify-between gap-4 mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="min-w-0">
            <h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">Finance</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Multi-account asset management and cashflow tracking</p>
          </div>
          <button
            type="button"
            onClick={() => setMode('addAcc')}
            className="h-8 w-8 shrink-0 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm transition-all hover:opacity-90 active:scale-95"
            aria-label="Create account"
          >
            <Plus className="w-4 h-4 text-white dark:text-slate-900" strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Entry — NLP transaction input (UX-036) */}
        {activeAccounts.length > 0 && mode === 'view' && <TransactionQuickEntry onParsed={handleQuickEntry} />}

        {/* Zone 2–3: Mobile = wallet stack, Desktop = production layout */}
        {isMobile ? (
          <>
            <TotalAssetsSummaryBar accounts={activeAccounts} />
            {loadingFinance && accounts.length === 0 && <SkeletonCards count={3} />}
            {activeAccounts.length > 0 && (
              <CardStack accounts={activeAccounts} mode={viewMode} onCardTap={handleCardTap} onReorder={handleReorder} onShowAll={activeAccounts.length > 10 ? () => navigate('/finance/accounts') : undefined} />
            )}
          </>
        ) : (
          <FinanceDesktopContent netWorth={netWorth} transactions={globalTransactions} currency={primaryCurrency} accounts={accounts} activeAccounts={activeAccounts} loading={loadingFinance} userId={user?.uid || ''} onOpenAccount={openAccountDetails} />
        )}
        {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}
        {/* FIN-014: Upcoming bill reminders */}
        {activeAccounts.length > 0 && <FinanceBillsSection />}
        {/* Zone 4: Global Transaction History */}
        {activeAccounts.length > 0 && (
          <TransactionHistorySection transactions={globalTransactions} onEdit={handleEdit} onDelete={setTransactionToDelete} />
        )}

        {/* Forms / Modals */}
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

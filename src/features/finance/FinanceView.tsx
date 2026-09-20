/** FinanceView — Apple Wallet-inspired finance page (UX-041 Phase 2) */
// @ts-nocheck

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Receipt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useResponsive } from '../../hooks/useResponsive';
import { Modal } from '../../components/shared/Modal';
import { ActionSheet } from '../../components/shared/ActionSheet';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorTransaction, Currency } from '../../types';
import { AccountDetailsContainer } from './components/AccountDetailsContainer';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { useRegisterFab } from '../../context/FabContext';
import { CardStack } from '../../components/finance/CardStack';
import { AccountListItem } from './components/AccountListItem';
import { TotalAssetsSummaryBar } from '../../components/finance/TotalAssetsSummaryBar';
import { SkeletonCards } from '../../components/finance/SkeletonCards';
import { useReorderAccounts } from '../../hooks/useReorderAccounts';
import { logProductEvent } from '../../services/telemetry';
import { FinanceAccountsRoute } from './components/FinanceAccountsRoute';
import { FinanceDesktopContent } from './components/FinanceDesktopContent';
import { TransactionHistorySection } from './components/TransactionHistorySection';
import { FinanceBillsSection } from './components/FinanceBillsSection';
import { runFinanceViewTransition } from './financeViewTransition';
import { getAccountIdFromPath, isAccountsListPath } from './financeViewHelpers';
import { useFinanceCardInteraction } from './hooks/useFinanceCardInteraction';

const FinanceView = () => {
  const { accounts, transactions, deleteTransaction, deleteAccount, loadingFinance, netWorth, currentMonth, jumpToMonth } = useFinance();
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
  /** UX-FN-08: the landing page previously had no way to record a transaction. */
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // UX-GL-04: the mobile FAB records a transaction — the page's primary action.
  useRegisterFab({ label: 'Record transaction', onClick: () => setShowCreateSheet(true) });
  /**
   * UX-FN-03: the account just created in the success state, so the transaction
   * form can preselect it — creation and recording are one journey.
   */
  const [newAccountIdForTx, setNewAccountIdForTx] = useState<string | null>(null);
  const handleRecordFirstTransaction = useCallback((accountId: string) => {
    setNewAccountIdForTx(accountId || null);
    setMode('addTx');
  }, []);

  const startRecordingTransaction = useCallback(() => {
    setInitialTransactionType('expense');
    setPrefillData(undefined);
    setEditingTransaction(undefined);
    setMode('addTx');
  }, []);

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

  /**
   * UX-FN-06 / UX-FN-10: the landing defaults to the current month, so it used
   * to show "No transactions yet" while the account held transactions in other
   * months — with no cue that data existed elsewhere and no way to widen the
   * range. These two values let the empty state say *why* it is empty and offer
   * the one-tap way to the month that has the data.
   */
  const latestActivityMonth = useMemo(() => {
    const latest = globalTransactions[0];
    return latest ? new Date(latest.date) : null;
  }, [globalTransactions]);

  const currentMonthHasActivity = useMemo(
    () => globalTransactions.some(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth();
    }),
    [globalTransactions, currentMonth]
  );

  const latestActivityLabel = latestActivityMonth
    ? latestActivityMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const activityElsewhere = latestActivityMonth !== null && !currentMonthHasActivity;

  /**
   * UX-FN-04: the overlapping card stack exposed only a sliver of the inactive
   * accounts and offered no comparable view. The hero stack stays, and every
   * account is also a compact row — grouped by currency, because two currencies
   * cannot be compared by eye either.
   */
  const accountsByCurrency = useMemo(() => {
    const grouped = new Map<string, typeof activeAccounts>();
    for (const account of activeAccounts) {
      const group = grouped.get(account.currency) ?? [];
      group.push(account);
      grouped.set(account.currency, group);
    }
    return Array.from(grouped, ([currency, group]) => ({ currency, accounts: group }));
  }, [activeAccounts]);

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
            {/* UX-FN-05: plain language, not internal vocabulary. */}
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your accounts, balances and spending in one place.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateSheet(true)}
            className="h-11 w-11 shrink-0 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center shadow-elevation-subtle transition-all hover:opacity-90 active:scale-95"
            aria-label="Add account or record a transaction"
          >
            <Plus className="w-5 h-5 text-white dark:text-slate-900" strokeWidth={2.5} />
          </button>
        </div>

        {/* Zone 2–3: Mobile = wallet stack, Desktop = production layout */}
        {isMobile ? (
          <>
            <TotalAssetsSummaryBar accounts={activeAccounts} />
            {loadingFinance && accounts.length === 0 && <SkeletonCards count={3} />}
            {activeAccounts.length > 0 && (
              <CardStack accounts={activeAccounts} mode={viewMode} onCardTap={handleCardTap} onReorder={handleReorder} onShowAll={activeAccounts.length > 10 ? () => navigate('/finance/accounts') : undefined} />
            )}
            {/*
              * UX-FN-04: the stack exposed only a sliver of the inactive
              * accounts. Every account is now also a compact, comparable row
              * (name · type · currency · balance), grouped by currency.
              */}
            {activeAccounts.length > 0 && (
              <section data-testid="all-accounts-list" className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  All accounts
                </h3>
                {accountsByCurrency.map(({ currency, accounts: groupAccounts }) => (
                  <div key={currency} className="space-y-2">
                    {accountsByCurrency.length > 1 && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{currency}</p>
                    )}
                    {groupAccounts.map(account => (
                      <AccountListItem
                        key={account.id}
                        account={account}
                        currentUserId={user?.uid}
                        onOpenAccount={openAccountDetails}
                      />
                    ))}
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <FinanceDesktopContent netWorth={netWorth} transactions={globalTransactions} currency={primaryCurrency} accounts={accounts} activeAccounts={activeAccounts} loading={loadingFinance} userId={user?.uid || ''} onOpenAccount={openAccountDetails} />
        )}
        {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}
        {/* FIN-014: Upcoming bill reminders */}
        {activeAccounts.length > 0 && <FinanceBillsSection />}
        {/* UX-FN-01: the empty state inside the list now carries its own action,
            so there is no longer a separate button instructing one thing while
            the instruction lives somewhere else. */}
        {/* Zone 4: Global Transaction History */}
        {activeAccounts.length > 0 && (
          <TransactionHistorySection
            transactions={globalTransactions}
            onEdit={handleEdit}
            onDelete={setTransactionToDelete}
            onRecordTransaction={startRecordingTransaction}
            latestActivityLabel={activityElsewhere ? latestActivityLabel ?? undefined : undefined}
            onJumpToLatestActivity={activityElsewhere && latestActivityMonth ? () => jumpToMonth(latestActivityMonth) : undefined}
          />
        )}

        {/* Forms / Modals */}
        {!showModal && mode === 'addAcc' && <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} onRecordFirstTransaction={handleRecordFirstTransaction} /></div>}
        {!showModal && (mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={newAccountIdForTx ?? activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}

        <Modal isOpen={showModal && mode !== 'view'} onClose={handleCloseForm} title={mode === 'addAcc' ? 'Create Account' : mode === 'editTx' ? 'Edit Transaction' : 'New Transaction'} maxWidth="max-w-2xl">
          {mode === 'addAcc' && <AccountForm onClose={handleCloseForm} onRecordFirstTransaction={handleRecordFirstTransaction} />}
          {(mode === 'addTx' || mode === 'editTx') && <TransactionForm onClose={handleCloseForm} defaultAccountId={newAccountIdForTx ?? activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} />}
        </Modal>
        <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={handleDeleteConfirm} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />

        {/* UX-FN-08: one `+`, two named actions — replaces the unlabelled account-only affordance. */}
        <ActionSheet
          isOpen={showCreateSheet}
          onClose={() => setShowCreateSheet(false)}
          items={[
            {
              label: 'Record transaction',
              icon: <Receipt className="w-5 h-5" />,
              onPress: startRecordingTransaction,
            },
            {
              label: 'Add account',
              icon: <Plus className="w-5 h-5" />,
              onPress: () => setMode('addAcc'),
            },
          ]}
        />
      </div>
    </FeatureErrorBoundary>
  );
};

export default FinanceView;

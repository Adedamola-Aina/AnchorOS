// @ts-nocheck
/**
 * AccountDetailsView — Apple-inspired account detail page.
 * Layout: X/... header → Card → Balance strip → Monthly chart → Transaction history.
 */

import { useState, useMemo, useCallback, useRef } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useNotifications } from '../../context/NotificationContext';
import { captureError } from '../../utils/error';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import { exportAccountCsv } from '../../utils/accountExport';
import { logProductEvent } from '../../services/telemetry';
import { uploadAccountArtwork } from '../../services/accountArtworkStorage';
import { useFilterPersistence } from '../../hooks/useFilterPersistence';
import { useAccountActivity } from '../../hooks/useAccountActivity';
import { useBankConnection } from '../../hooks/useBankConnection';
import { useAccountTransactions } from './hooks/useAccountTransactions';
import { getFinanceViewTransitionName } from './financeViewTransition';
import { AccountDetailHeader } from './components/AccountDetailHeader';
import { AccountCard } from '../../components/finance/AccountCard';
import { SpendingTrendsChart } from './components';
import { VirtualTransactionList } from './components/VirtualTransactionList';
import { TransactionFilterHeader } from './components/TransactionListParts';
import { SharedActivitySection } from './components/SharedActivitySection';
import { SharePermissionPicker } from './components/SharePermissionPicker';
import { NotificationBanner } from './NotificationBanner';
import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { ActionSheet } from '../../components/shared/ActionSheet';
import { Modal } from '../../components/shared/Modal';
import { CardColorPicker } from '../../components/finance/CardColorPicker';
import { CardArtworkPicker } from '../../components/finance/CardArtworkPicker';
import { Pencil, Palette, Download, Trash2, RefreshCw, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';
import type { TransactionType } from '../../types';

interface AccountDetailsViewProps {
  account: AnchorAccount;
  onBack: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  /**
   * UX-FN-14: opens the composer on a stated intent. The type is the same
   * `defaultType` the composer already accepts — no new write path.
   */
  onAddTransaction?: (type: TransactionType) => void;
  onEdit?: (tx: AnchorTransaction) => void;
  familyMemberId?: string | null;
}

export const AccountDetailsView = ({
  account, onBack, onDelete, onShare: _onShare, onAddTransaction, onEdit, familyMemberId: _familyMemberId,
}: AccountDetailsViewProps) => {
  const { accounts, transactions, deleteTransaction, updateAccountPersonalization, renameAccount, currentMonth } = useFinance();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const { searchQuery, setSearchQuery, filterType, setFilterType } = useFilterPersistence(`account-${account.id}`);
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isArtworkPickerOpen, setIsArtworkPickerOpen] = useState(false);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const optionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const { syncNow, isSyncing } = useBankConnection();

  const isOwner = !account.ownerId || account.ownerId === user?.uid;
  const isSharedAccount = Boolean(
    (account.sharedWith && Object.keys(account.sharedWith).length > 0) ||
    (account.ownerId && account.ownerId !== user?.uid),
  );
  const { activities, loading: loadingActivities } = useAccountActivity({
    accountId: account.id, accountOwnerId: account.ownerId || user?.uid || '', enabled: isSharedAccount,
  });
  const { accountTransactions, weeklyData, maxWeeklyAmount, monthlyBalance: _monthlyBalance, filteredList, carryoverDividerIndex, transferLegCount } =
    useAccountTransactions(account, currentMonth, transactions, user?.uid, { searchQuery, filterType, selectedWeekStart });

  /**
   * A transfer needs somewhere to go. The composer already refuses a
   * single-account transfer (`SingleAccountTransferMessage`); the affordance
   * should not offer what the flow cannot do.
   */
  const canTransfer = (accounts ?? []).filter(a => !a.isArchived).length > 1;

  const handleExportCsv = useCallback(() => {
    logProductEvent('finance_transaction_exported', { accountId: account.id, transactionCount: filteredList.length });
    exportAccountCsv(account.name, filteredList, account.currency);
  }, [account.id, account.name, account.currency, filteredList]);

  const handleColorSelect = async (color: string) => {
    if (!isOwner) { showToast('Only the account owner can change card personalization', 'error'); return; }
    await updateAccountPersonalization(account.id, { cardColor: color });
    logProductEvent('finance_card_color_changed', { accountId: account.id, color });
  };

  const handleArtworkSelect = async (presetId: string | undefined) => {
    if (!isOwner) { showToast('Only the account owner can change card personalization', 'error'); return; }
    const p = presetId || '';
    await updateAccountPersonalization(account.id, { cardArtworkPreset: p, cardArtwork: '', cardArtworkPath: '' });
    logProductEvent('finance_card_artwork_changed', { accountId: account.id, presetId: p || 'none' });
  };

  const handleArtworkUpload = async (file: File) => {
    if (!user?.uid || !isOwner) { showToast('Only the account owner can upload custom artwork', 'error'); return; }
    setIsUploadingArtwork(true);
    try {
      const path = await uploadAccountArtwork(account.ownerId || user.uid, account.id, file);
      await updateAccountPersonalization(account.id, { cardArtwork: '', cardArtworkPath: path, cardArtworkPreset: '' });
      logProductEvent('finance_card_artwork_changed', { accountId: account.id, presetId: 'custom' });
      showToast('Custom artwork updated', 'success');
      setIsArtworkPickerOpen(false);
    } catch (err) {
      captureError(err, 'AccountDetails.artworkUpload');
      showToast('Unable to upload artwork right now', 'error');
    } finally { setIsUploadingArtwork(false); }
  };

  const handleSyncNow = useCallback(async () => {
    try {
      const r = await syncNow(account.id);
      showToast(`Synced ${r.transactionsAdded} transaction${r.transactionsAdded !== 1 ? 's' : ''}`, 'success');
    } catch { showToast('Bank sync failed — try again later', 'error'); }
  }, [account.id, showToast, syncNow]);

  const openRename = useCallback(() => {
    setRenameName(account.name);
    setIsRenameOpen(true);
  }, [account.name]);

  const closeRename = useCallback(() => {
    if (isRenaming) return;
    setIsRenameOpen(false);
    // The action-sheet trigger that opened this flow unmounts, so the shared Modal
    // cannot restore focus itself. Return focus to the mounted options button.
    optionsButtonRef.current?.focus();
  }, [isRenaming]);

  const handleRenameSubmit = async () => {
    if (!isOwner) { showToast('Only the account owner can rename this account', 'error'); return; }
    if (isRenaming) return;
    const trimmed = renameName.trim();
    const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');
    if (!trimmed) { showToast('Account name cannot be empty', 'error'); return; }
    // Submitting the current (normalized) name requests a label repair. The
    // decision is delegated to AccountService, which inspects Firestore for
    // divergent transaction labels — not the date-filtered view here — so
    // recovery survives closing/reopening the dialog, reloads, and stale labels
    // on transactions outside the visible month. A genuine rename keeps the
    // same service path. `labelsRepaired` distinguishes a real repair from a
    // no-op so nothing reports a false success.
    const isLabelRepair = normalize(trimmed) === normalize(account.name);
    setIsRenaming(true);
    try {
      const result = await renameAccount(account.id, trimmed);
      if (isLabelRepair) {
        if (result?.labelsRepaired) {
          showToast(`Transaction labels restored to "${account.name}"`, 'success');
        } else {
          showToast('No changes to save', 'info');
        }
      } else {
        showToast(`Account renamed to "${trimmed}"`, 'success');
      }
      setIsRenameOpen(false);
      optionsButtonRef.current?.focus();
    } catch (err) {
      captureError(err, 'AccountDetails.renameAccount');
      showToast(isLabelRepair ? 'Unable to restore transaction labels right now' : 'Unable to rename account right now', 'error');
    } finally {
      setIsRenaming(false);
    }
  };

  const actionItems = useMemo(() => {
    const items = [];
    if (isOwner) items.push({ label: 'Edit Account', icon: <Pencil className="w-5 h-5" />, onPress: openRename });
    if (isOwner) items.push({ label: 'Customize Card', icon: <Palette className="w-5 h-5" />, onPress: () => setIsCustomizeOpen(true) });
    items.push({ label: 'Export Transactions', icon: <Download className="w-5 h-5" />, onPress: handleExportCsv });
    if (account.source === 'linked') items.push({ label: isSyncing ? 'Syncing...' : 'Sync Now', icon: <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />, onPress: handleSyncNow });
    if (onDelete && isOwner) items.push({ label: 'Delete Account', icon: <Trash2 className="w-5 h-5" />, destructive: true, onPress: onDelete });
    return items;
  }, [isOwner, account.source, isSyncing, onDelete, handleExportCsv, handleSyncNow, openRename]);

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-4" style={{ viewTransitionName: getFinanceViewTransitionName(account.id) }}>
        {isOwner && <NotificationBanner accountId={account.id} />}
        {isSharedAccount && <FamilyNotificationBanner accountId={account.id} />}

        {/*
          * UX-FN-13: `‹ Finance` is the way back, not an X. An X means "dismiss
          * this thing"; this screen is a destination pushed from Finance, so it
          * gets the app's normal back affordance and keeps the `…` menu for
          * account-specific secondary actions.
          */}
        <AccountDetailHeader accountName={account.name} onBack={onBack} onOpenOptions={() => setIsActionsOpen(true)} optionsButtonRef={optionsButtonRef} />

        {/* The account object — its own visual identity, tightened (UX-FN-09). */}
        <div className="px-1">
          <AccountCard account={account} index={0} totalCards={1} mode="expanded" isActive={false} onTap={() => {}} skipViewTransition />
        </div>

        {/* Balance: prominent, but it must not compete with the account card. */}
        <div className="px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Balance</p>
          <p className="mt-0.5 text-3xl font-bold tabular-nums leading-tight text-slate-900 dark:text-white">
            {formatCurrency(fromCents(account.balanceCents), account.currency)}
          </p>
        </div>

        {/*
          * UX-FN-14: one affordance per intent, and never two identical CTAs.
          * Each of these opens the composer on the intent the user just stated —
          * the same `defaultType` the composer already supports, with the account
          * locked, so nothing about the write path changes. Transfer is offered
          * only when a second account exists, because a transfer with one account
          * is not a thing the product can do.
          */}
        {onAddTransaction && (
          <div className={`px-1 grid gap-2 ${canTransfer ? 'grid-cols-3' : 'grid-cols-2'}`} role="group" aria-label="Record a transaction">
            <button
              type="button"
              onClick={() => onAddTransaction('income')}
              aria-label="Add money"
              className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 px-2 py-2 text-[13px] font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] flex flex-col items-center justify-center gap-0.5"
            >
              <ArrowDownRight className="w-4 h-4 text-finance-600 dark:text-finance-400" aria-hidden="true" />
              Add money
            </button>
            <button
              type="button"
              onClick={() => onAddTransaction('expense')}
              aria-label="Spend"
              className="min-h-[44px] rounded-xl bg-slate-900 dark:bg-white px-2 py-2 text-[13px] font-semibold text-white dark:text-slate-900 transition-opacity hover:opacity-90 active:scale-[0.98] flex flex-col items-center justify-center gap-0.5"
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              Spend
            </button>
            {canTransfer ? (
              <button
                type="button"
                onClick={() => onAddTransaction('transfer')}
                aria-label="Transfer"
                className="min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 px-2 py-2 text-[13px] font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] flex flex-col items-center justify-center gap-0.5"
              >
                <ArrowRightLeft className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                Transfer
              </button>
            ) : null}
          </div>
        )}

        {/* Period summary + insight — compact, and it must stay above the list. */}
        {accountTransactions.length > 0 && (
          <SpendingTrendsChart
            weeklyData={weeklyData}
            currency={account.currency}
            selectedWeekStart={selectedWeekStart}
            onSelectWeek={setSelectedWeekStart}
            maxAmount={maxWeeklyAmount}
            monthLabel={currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            hasTransfers={transferLegCount > 0}
          />
        )}

        {isOwner && account.sharedWith && Object.entries(account.sharedWith).map(([uid, meta]) => (
          <SharePermissionPicker key={uid} accountId={account.id} ownerUid={user?.uid || ''} sharedUid={uid} currentPermission={meta.permission || 'read'} />
        ))}
        {isSharedAccount && <SharedActivitySection activities={activities} currentUserId={user?.uid} loading={loadingActivities} />}

        {/*
          * UX-FN-15: one heading ("Transactions"), and the section owns its own
          * search/filter — the month/period control lives above, in the summary.
          * The old markup said "History" twice (a section heading plus the list's
          * own header) inside a bordered card wrapped around every row.
          */}
        <section className="px-1" aria-labelledby="account-transactions-heading">
          <h3 id="account-transactions-heading" className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Transactions
          </h3>
          <TransactionFilterHeader
            searchQuery={searchQuery}
            filterType={filterType}
            hasWeekFilter={!!selectedWeekStart}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilterType}
            onClearWeekFilter={() => setSelectedWeekStart(null)}
            searchPlaceholder="Search this account…"
          />
          <VirtualTransactionList
            transactions={filteredList}
            onEdit={onEdit || (() => {})}
            onDelete={(tx) => tx.source === 'synced' ? undefined : setTransactionToDelete(tx)}
            loading={loadingActivities}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            className="min-h-[200px] max-h-[65vh]"
            carryoverStartIndex={carryoverDividerIndex}
          />
        </section>
      </div>

      <ActionSheet isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)} items={actionItems} />
      <ActionSheet isOpen={isCustomizeOpen} onClose={() => setIsCustomizeOpen(false)} items={[
        { label: 'Choose Card Color', icon: <Palette className="w-5 h-5" />, onPress: () => setIsColorPickerOpen(true) },
        { label: 'Choose Card Artwork', icon: <Palette className="w-5 h-5" />, onPress: () => setIsArtworkPickerOpen(true) },
      ]} />
      <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={() => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); } }} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
      <Modal isOpen={isColorPickerOpen} onClose={() => setIsColorPickerOpen(false)} title="Choose Card Color" maxWidth="max-w-md">
        <CardColorPicker currentColor={account.cardColor || '#3D52D5'} onSelect={handleColorSelect} onClose={() => setIsColorPickerOpen(false)} />
      </Modal>
      <Modal isOpen={isArtworkPickerOpen} onClose={() => setIsArtworkPickerOpen(false)} title="Choose Card Artwork" maxWidth="max-w-md">
        <CardArtworkPicker currentPreset={account.cardArtworkPreset} cardColor={account.cardColor || '#3D52D5'} onSelect={handleArtworkSelect} onUploadCustom={handleArtworkUpload} onClose={() => setIsArtworkPickerOpen(false)} isUploading={isUploadingArtwork} />
      </Modal>
      <Modal isOpen={isRenameOpen} onClose={closeRename} title="Rename Account" maxWidth="max-w-md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleRenameSubmit(); }}>
          <div className="space-y-2">
            <label htmlFor="rename-account-input" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Account name</label>
            <input
              id="rename-account-input"
              type="text"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              disabled={isRenaming}
              className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeRename}
              disabled={isRenaming}
              className="flex-1 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRenaming}
              className="flex-1 min-h-[44px] rounded-xl bg-slate-900 dark:bg-white px-5 text-sm font-semibold text-white dark:text-slate-900 transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRenaming ? 'Renaming...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

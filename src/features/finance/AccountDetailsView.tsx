// @ts-nocheck
/**
 * AccountDetailsView — Apple-inspired account detail page.
 * Layout: X/... header → Card → Balance strip → Monthly chart → Transaction history.
 */

import { useState, useMemo, useCallback } from 'react';
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
import { Pencil, Palette, Download, Trash2, RefreshCw } from 'lucide-react';

interface AccountDetailsViewProps {
  account: AnchorAccount;
  onBack: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onAddTransaction?: () => void;
  onEdit?: (tx: AnchorTransaction) => void;
  familyMemberId?: string | null;
}

export const AccountDetailsView = ({
  account, onBack, onDelete, onShare: _onShare, onAddTransaction, onEdit, familyMemberId: _familyMemberId,
}: AccountDetailsViewProps) => {
  const { transactions, deleteTransaction, updateAccountPersonalization, currentMonth } = useFinance();
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
  const { syncNow, isSyncing } = useBankConnection();

  const isOwner = !account.ownerId || account.ownerId === user?.uid;
  const isSharedAccount = Boolean(
    (account.sharedWith && Object.keys(account.sharedWith).length > 0) ||
    (account.ownerId && account.ownerId !== user?.uid),
  );
  const { activities, loading: loadingActivities } = useAccountActivity({
    accountId: account.id, accountOwnerId: account.ownerId || user?.uid || '', enabled: isSharedAccount,
  });
  const { accountTransactions, weeklyData, maxWeeklyAmount, monthlyBalance: _monthlyBalance, filteredList, carryoverDividerIndex } =
    useAccountTransactions(account, currentMonth, transactions, user?.uid, { searchQuery, filterType, selectedWeekStart });

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

  const actionItems = useMemo(() => {
    const items = [];
    if (isOwner) items.push({ label: 'Edit Account', icon: <Pencil className="w-5 h-5" />, onPress: () => showToast('Rename coming soon', 'info') });
    if (isOwner) items.push({ label: 'Customize Card', icon: <Palette className="w-5 h-5" />, onPress: () => setIsCustomizeOpen(true) });
    items.push({ label: 'Export Transactions', icon: <Download className="w-5 h-5" />, onPress: handleExportCsv });
    if (account.source === 'linked') items.push({ label: isSyncing ? 'Syncing...' : 'Sync Now', icon: <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />, onPress: handleSyncNow });
    if (onDelete && isOwner) items.push({ label: 'Delete Account', icon: <Trash2 className="w-5 h-5" />, destructive: true, onPress: onDelete });
    return items;
  }, [isOwner, account.source, isSyncing, onDelete, handleExportCsv, handleSyncNow, showToast]);

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-5" style={{ viewTransitionName: getFinanceViewTransitionName(account.id) }}>
        {isOwner && <NotificationBanner accountId={account.id} />}
        {isSharedAccount && <FamilyNotificationBanner accountId={account.id} />}

        <AccountDetailHeader accountName={account.name} onBack={onBack} onOpenOptions={() => setIsActionsOpen(true)} />

        <div className="px-1">
          <AccountCard account={account} index={0} totalCards={1} mode="expanded" isActive={false} onTap={() => {}} skipViewTransition />
        </div>

        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Balance</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(fromCents(account.balanceCents), account.currency)}
            </p>
          </div>
          {onAddTransaction && (
            <button type="button" onClick={onAddTransaction} className="rounded-full bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 transition hover:opacity-90 active:scale-95 min-h-[44px]">
              Record Transaction
            </button>
          )}
        </div>

        {accountTransactions.length > 0 && (
          <SpendingTrendsChart weeklyData={weeklyData} currency={account.currency} selectedWeekStart={selectedWeekStart} onSelectWeek={setSelectedWeekStart} maxAmount={maxWeeklyAmount} />
        )}

        {isOwner && account.sharedWith && Object.entries(account.sharedWith).map(([uid, meta]) => (
          <SharePermissionPicker key={uid} accountId={account.id} ownerUid={user?.uid || ''} sharedUid={uid} currentPermission={meta.permission || 'read'} />
        ))}
        {isSharedAccount && <SharedActivitySection activities={activities} currentUserId={user?.uid} loading={loadingActivities} />}

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white px-1 mb-3">History</h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <TransactionFilterHeader searchQuery={searchQuery} filterType={filterType} hasWeekFilter={!!selectedWeekStart} onSearchChange={setSearchQuery} onFilterChange={setFilterType} />
            <VirtualTransactionList transactions={filteredList} onEdit={onEdit || (() => {})} onDelete={(tx) => tx.source === 'synced' ? undefined : setTransactionToDelete(tx)} loading={loadingActivities} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} className="min-h-[200px] max-h-[calc(100vh-250px)]" carryoverStartIndex={carryoverDividerIndex} />
          </div>
        </div>
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
    </>
  );
};

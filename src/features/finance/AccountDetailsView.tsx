/**
 * AccountDetailsView - Account detail page with insights and transactions
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 */
// @ts-nocheck


import { useState, useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { captureError } from '../../utils/error';
import { getWeeklySpending } from '../../utils/financeInsights';
import { exportAccountCsv } from '../../utils/accountExport';
import { NotificationBanner } from './NotificationBanner';
import { useNotifications } from '../../context/NotificationContext';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { Modal } from '../../components/shared/Modal';
import { useAccountActivity } from '../../hooks/useAccountActivity';
import { useFilterPersistence } from '../../hooks/useFilterPersistence';
import { useBankConnection } from '../../hooks/useBankConnection';
import { AccountHeader, SpendingTrendsChart } from './components';
import { SharedActivitySection } from './components/SharedActivitySection';
import { SharePermissionPicker } from './components/SharePermissionPicker';
import { VirtualTransactionList } from './components/VirtualTransactionList';
import { TransactionFilterHeader } from './components/TransactionListParts';
import { AccountOverviewPanel } from './components/AccountOverviewPanel';
import { SubscriptionDetectorCard } from './components/SubscriptionDetectorCard';
import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { useTransactionsQuery } from '../../hooks/queries/useFinanceQueries';
import { logProductEvent } from '../../services/telemetry';
import { uploadAccountArtwork } from '../../services/accountArtworkStorage';
import { CardColorPicker } from '../../components/finance/CardColorPicker';
import { CardArtworkPicker } from '../../components/finance/CardArtworkPicker';
import { getFinanceViewTransitionName } from './financeViewTransition';
import { MonthlyInsight } from './MonthlyInsight';

/** Number of days of carry-over from the previous month shown for continuity. */
const CARRYOVER_DAYS = 14;

interface AccountDetailsViewProps { account: AnchorAccount; onBack: () => void; onDelete?: () => void; onShare?: () => void; onAddTransaction?: () => void; onEdit?: (tx: AnchorTransaction) => void; familyMemberId?: string | null; }

export const AccountDetailsView = ({ account, onBack, onDelete, onShare, onAddTransaction, onEdit, familyMemberId }: AccountDetailsViewProps) => {
    const { transactions, deleteTransaction, renameAccount, updateAccountPersonalization, currentMonth } = useFinance();
    const { user } = useAuth();
    const { showToast } = useNotifications();

    const { searchQuery, setSearchQuery, filterType, setFilterType } = useFilterPersistence(`account-${account.id}`);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(account.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isArtworkPickerOpen, setIsArtworkPickerOpen] = useState(false);
    const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

    const { syncNow, isSyncing } = useBankConnection();

    const handleSyncNow = async () => {
        try {
            const result = await syncNow(account.id);
            showToast(`Synced ${result.transactionsAdded} transaction${result.transactionsAdded !== 1 ? 's' : ''}`, 'success');
        } catch {
            showToast('Bank sync failed — try again later', 'error');
        }
    };

    const isOwner = !account.ownerId || account.ownerId === user?.uid;
    const isSharedAccount = Boolean((account.sharedWith && Object.keys(account.sharedWith).length > 0) || (account.ownerId && account.ownerId !== user?.uid));
    const { activities, loading: loadingActivities } = useAccountActivity({ accountId: account.id, accountOwnerId: account.ownerId || user?.uid || '', enabled: isSharedAccount });

    // Fetch trailing carry-over from previous month for continuity
    const { carryoverStart, carryoverEnd } = useMemo(() => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const trailEnd = new Date(monthStart.getTime() - 1); // last ms of prev month
        const trailStart = new Date(monthStart);
        trailStart.setDate(trailStart.getDate() - CARRYOVER_DAYS);
        return { carryoverStart: trailStart.toISOString(), carryoverEnd: trailEnd.toISOString() };
    }, [currentMonth]);
    const { data: carryoverTx = [] } = useTransactionsQuery(user?.uid, carryoverStart, carryoverEnd);

    // Current-month transactions for this account
    const currentMonthTx = useMemo(() => (transactions || []).filter(t => t?.accountId === account.id), [transactions, account.id]);
    // Carry-over transactions for this account (from trailing 2 weeks)
    const carryoverAccountTx = useMemo(() => (carryoverTx || []).filter(t => t?.accountId === account.id), [carryoverTx, account.id]);

    // Merge: current month first, then carry-over (de-duplicated)
    const accountTransactions = useMemo(() => {
        const ids = new Set(currentMonthTx.map(t => t.id));
        const trailing = carryoverAccountTx.filter(t => !ids.has(t.id));
        return [...currentMonthTx, ...trailing];
    }, [currentMonthTx, carryoverAccountTx]);

    const weeklyData = useMemo(() => getWeeklySpending(accountTransactions, currentMonth), [accountTransactions, currentMonth]);
    const maxWeeklyAmount = useMemo(() => Math.max(...weeklyData.flatMap(d => [d.income, d.expense]), 1), [weeklyData]);
    
    // F-006: Calculate monthly opening/closing balance
    const monthlyBalance = useMemo(() => {
        const now = new Date();
        const isCurrentMonth = currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear();
        let monthIncome = 0;
        let monthExpense = 0;
        accountTransactions.forEach(t => {
            if (!t || t.isSoftDeleted) return;
            const amount = t.amountCents || 0;
            if (t.type === 'income') monthIncome += amount;
            else if (t.type === 'expense') monthExpense += amount;
            else if (t.type === 'transfer') {
                if (t.accountId === account.id) monthExpense += amount;
                else monthIncome += amount;
            }
        });
        const netChange = monthIncome - monthExpense;
        const closingBalance = isCurrentMonth ? account.balanceCents : undefined;
        const openingBalance = isCurrentMonth ? account.balanceCents - netChange : undefined;
        return { openingBalance, closingBalance, monthIncome, monthExpense, netChange, isCurrentMonth };
    }, [accountTransactions, account.balanceCents, account.id, currentMonth]);

    const { filteredList, carryoverDividerIndex } = useMemo(() => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const sorted = accountTransactions.filter(t => {
            if (!t || (filterType !== 'all' && t.type !== filterType)) return false;
            if (selectedWeekStart && t.date) { const d = new Date(t.date); const end = new Date(selectedWeekStart); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999); if (d < selectedWeekStart || d > end) return false; }
            if (!searchQuery) return true;
            return (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // Find where carry-over transactions begin (dates before month start)
        const divider = sorted.findIndex(t => new Date(t.transactionDate || t.date) < monthStart);
        return { filteredList: sorted, carryoverDividerIndex: divider >= 0 ? divider : undefined };
    }, [accountTransactions, filterType, selectedWeekStart, searchQuery, currentMonth]);

    const handleRename = async () => {
        if (!newName.trim() || newName === account.name) { setIsEditingName(false); return; }
        setIsRenaming(true);
        try { await renameAccount(account.id, newName); setIsEditingName(false); }
        catch (err) { captureError(err, 'AccountDetails.rename'); console.error('Failed to rename:', err); }
        finally { setIsRenaming(false); }
    };

    const handleExportCsv = () => {
        logProductEvent('finance_transaction_exported', {
            accountId: account.id,
            transactionCount: filteredList.length,
        });
        exportAccountCsv(account.name, filteredList, account.currency);
    };

    const handleColorSelect = async (color: string) => {
        if (!isOwner) {
            showToast('Only the account owner can change card personalization', 'error');
            return;
        }
        await updateAccountPersonalization(account.id, { cardColor: color });
        logProductEvent('finance_card_color_changed', { accountId: account.id, color });
    };

    const handleArtworkSelect = async (presetId: string | undefined) => {
        if (!isOwner) {
            showToast('Only the account owner can change card personalization', 'error');
            return;
        }
        const normalizedPreset = presetId || '';
        await updateAccountPersonalization(account.id, {
            cardArtworkPreset: normalizedPreset,
            cardArtwork: '',
            cardArtworkPath: '',
        });
        logProductEvent('finance_card_artwork_changed', { accountId: account.id, presetId: normalizedPreset || 'none' });
    };

    const handleArtworkUpload = async (file: File) => {
        if (!user?.uid || !isOwner) {
            showToast('Only the account owner can upload custom artwork', 'error');
            return;
        }

        setIsUploadingArtwork(true);
        try {
            const artworkPath = await uploadAccountArtwork(account.ownerId || user.uid, account.id, file);
            await updateAccountPersonalization(account.id, {
                cardArtwork: '',
                cardArtworkPath: artworkPath,
                cardArtworkPreset: '',
            });
            logProductEvent('finance_card_artwork_changed', { accountId: account.id, presetId: 'custom' });
            showToast('Custom artwork updated', 'success');
            setIsArtworkPickerOpen(false);
        }
        catch (err) {
            captureError(err, 'AccountDetails.artworkUpload');
            showToast('Unable to upload artwork right now', 'error');
        }
        finally {
            setIsUploadingArtwork(false);
        }
    };

    return (
        <>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6" style={{ viewTransitionName: getFinanceViewTransitionName(account.id) }}>
                {/* Only show notification banner for owned accounts — shared account notifications are in Recent Activity */}
                {isOwner && <NotificationBanner accountId={account.id} />}
                {isSharedAccount && <FamilyNotificationBanner accountId={account.id} />}
                <AccountHeader account={account} isOwner={isOwner} familyMemberId={familyMemberId} isEditingName={isEditingName} newName={newName} isRenaming={isRenaming} onBack={onBack} onDelete={onDelete} onShare={onShare} onAddTransaction={onAddTransaction} onStartRename={() => setIsEditingName(true)} onCancelRename={() => { setIsEditingName(false); setNewName(account.name); }} onConfirmRename={handleRename} onNameChange={setNewName} monthlyBalance={monthlyBalance} onExportCsv={handleExportCsv} onSyncNow={account.source === 'linked' ? handleSyncNow : undefined} isSyncing={isSyncing} onOpenOptions={() => setIsOptionsOpen(true)} />
                <div className="grid grid-cols-1 gap-5">
                    <AccountOverviewPanel account={account} transactions={accountTransactions} monthlyNetCents={monthlyBalance.netChange} />
                    {accountTransactions.length > 0 && <SpendingTrendsChart weeklyData={weeklyData} currency={account.currency} selectedWeekStart={selectedWeekStart} onSelectWeek={setSelectedWeekStart} maxAmount={maxWeeklyAmount} />}
                    <MonthlyInsight transactions={accountTransactions} currency={account.currency} />
                    <SubscriptionDetectorCard transactions={accountTransactions} currency={account.currency} />
                </div>
                {isOwner && account.sharedWith && Object.entries(account.sharedWith).map(([uid, meta]) => (
                    <SharePermissionPicker key={uid} accountId={account.id} ownerUid={user?.uid || ''} sharedUid={uid} currentPermission={meta.permission || 'read'} />
                ))}
                {isSharedAccount && <SharedActivitySection activities={activities} currentUserId={user?.uid} loading={loadingActivities} />}
                {/* Standardized VirtualTransactionList used in FinanceView for consistency */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <TransactionFilterHeader searchQuery={searchQuery} filterType={filterType} hasWeekFilter={!!selectedWeekStart} onSearchChange={setSearchQuery} onFilterChange={setFilterType} />
                    <div className="pt-0">
                        <VirtualTransactionList transactions={filteredList} onEdit={onEdit || (() => { })} onDelete={(tx) => tx.source === 'synced' ? undefined : setTransactionToDelete(tx)} loading={loadingActivities} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} className="min-h-[200px] max-h-[calc(100vh-250px)]" carryoverStartIndex={carryoverDividerIndex} />
                    </div>
                </div>
            </div>
            <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={() => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); } }} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
            <Modal isOpen={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} title="Account Options" maxWidth="max-w-md">
                <div className="space-y-2">
                    {isOwner ? <button type="button" className="w-full text-left rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { setIsEditingName(true); setIsOptionsOpen(false); }}>Edit account details</button> : null}
                    {isOwner ? <button type="button" className="w-full text-left rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { setIsColorPickerOpen(true); setIsOptionsOpen(false); }}>Choose card color</button> : null}
                    {isOwner ? <button type="button" className="w-full text-left rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { setIsArtworkPickerOpen(true); setIsOptionsOpen(false); }}>Choose card artwork</button> : null}
                    <button type="button" className="w-full text-left rounded-xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { handleExportCsv(); setIsOptionsOpen(false); }}>Export transactions to CSV</button>
                    {onDelete && isOwner ? <button type="button" className="w-full text-left rounded-xl px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" onClick={() => { onDelete(); setIsOptionsOpen(false); }}>Delete account</button> : null}
                </div>
            </Modal>
            <Modal isOpen={isColorPickerOpen} onClose={() => setIsColorPickerOpen(false)} title="Choose Card Color" maxWidth="max-w-md">
                <CardColorPicker currentColor={account.cardColor || '#3D52D5'} onSelect={handleColorSelect} onClose={() => setIsColorPickerOpen(false)} />
            </Modal>
            <Modal isOpen={isArtworkPickerOpen} onClose={() => setIsArtworkPickerOpen(false)} title="Choose Card Artwork" maxWidth="max-w-md">
                <CardArtworkPicker currentPreset={account.cardArtworkPreset} cardColor={account.cardColor || '#3D52D5'} onSelect={handleArtworkSelect} onUploadCustom={handleArtworkUpload} onClose={() => setIsArtworkPickerOpen(false)} isUploading={isUploadingArtwork} />
            </Modal>
        </>
    );
};

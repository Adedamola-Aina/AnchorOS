/**
 * AccountDetailsView - Account detail page with insights and transactions
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 */

import { useState, useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { getWeeklySpending } from '../../utils/financeInsights';
import { NotificationBanner } from './NotificationBanner';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { useAccountActivity } from '../../hooks/useAccountActivity';
import { AccountHeader, SpendingTrendsChart } from './components';
import { SharedActivitySection } from './components/SharedActivitySection';
import { VirtualTransactionList } from './components/VirtualTransactionList';
import { TransactionFilterHeader } from './components/TransactionListParts';

interface AccountDetailsViewProps { account: AnchorAccount; onBack: () => void; onDelete?: () => void; onShare?: () => void; onTransfer?: () => void; onPayBill?: () => void; onEdit?: (tx: AnchorTransaction) => void; familyMemberId?: string | null; }

export const AccountDetailsView = ({ account, onBack, onDelete, onShare, onTransfer, onPayBill, onEdit, familyMemberId }: AccountDetailsViewProps) => {
    const { transactions, deleteTransaction, renameAccount, currentMonth } = useFinance();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(account.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);

    const isOwner = !account.ownerId || account.ownerId === user?.uid;
    const isSharedAccount = Boolean((account.sharedWith && Object.keys(account.sharedWith).length > 0) || (account.ownerId && account.ownerId !== user?.uid));
    const { activities, loading: loadingActivities } = useAccountActivity({ accountId: account.id, accountOwnerId: account.ownerId || user?.uid || '', enabled: isSharedAccount });

    const accountTransactions = useMemo(() => (transactions || []).filter(t => t?.accountId === account.id), [transactions, account.id]);
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

    const filteredList = useMemo(() => {
        return accountTransactions.filter(t => {
            if (!t || (filterType !== 'all' && t.type !== filterType)) return false;
            if (selectedWeekStart && t.date) { const d = new Date(t.date); const end = new Date(selectedWeekStart); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999); if (d < selectedWeekStart || d > end) return false; }
            if (!searchQuery) return true;
            return (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [accountTransactions, filterType, selectedWeekStart, searchQuery]);

    const handleRename = async () => {
        if (!newName.trim() || newName === account.name) { setIsEditingName(false); return; }
        setIsRenaming(true);
        try { await renameAccount(account.id, newName); setIsEditingName(false); }
        catch (err) { console.error('Failed to rename:', err); }
        finally { setIsRenaming(false); }
    };

    return (
        <>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
                <NotificationBanner accountId={account.id} />
                <AccountHeader account={account} isOwner={isOwner} familyMemberId={familyMemberId} isEditingName={isEditingName} newName={newName} isRenaming={isRenaming} onBack={onBack} onDelete={onDelete} onShare={onShare} onTransfer={onTransfer} onPayBill={onPayBill} onStartRename={() => setIsEditingName(true)} onCancelRename={() => { setIsEditingName(false); setNewName(account.name); }} onConfirmRename={handleRename} onNameChange={setNewName} monthlyBalance={monthlyBalance} />
                <div className="grid grid-cols-1 gap-5">
                    {accountTransactions.length > 0 && <SpendingTrendsChart weeklyData={weeklyData} currency={account.currency} selectedWeekStart={selectedWeekStart} onSelectWeek={setSelectedWeekStart} maxAmount={maxWeeklyAmount} />}
                </div>
                {isSharedAccount && <SharedActivitySection activities={activities} currentUserId={user?.uid} loading={loadingActivities} />}
                {/* Standardized VirtualTransactionList used in FinanceView for consistency */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <TransactionFilterHeader searchQuery={searchQuery} filterType={filterType} hasWeekFilter={!!selectedWeekStart} onSearchChange={setSearchQuery} onFilterChange={setFilterType} />
                    <div className="pt-0">
                        <VirtualTransactionList transactions={filteredList} onEdit={onEdit || (() => { })} onDelete={setTransactionToDelete} loading={loadingActivities} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} className="min-h-[200px] max-h-[calc(100vh-250px)]" />
                    </div>
                </div>
            </div>
            <ConfirmationModal isOpen={!!transactionToDelete} onClose={() => setTransactionToDelete(null)} onConfirm={() => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id, transactionToDelete.accountId); setTransactionToDelete(null); } }} title="Delete Transaction" message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`} confirmLabel="Delete Transaction" isDestructive />
        </>
    );
};

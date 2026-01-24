/**
 * AccountDetailsView - Account detail page with insights and transactions
 * 
 * Refactored to use extracted components following CLAUDE.md < 200 lines mandate.
 */

import { useState, useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { getWeeklySpending, detectRecurring } from '../../utils/financeInsights';
import { NotificationBanner } from './NotificationBanner';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { useAccountActivity } from '../../hooks/useAccountActivity';
import { Users } from 'lucide-react';
import {
    AccountHeader,
    ActivityFeed,
    RecurringTransactionsList,
    SpendingTrendsChart,
} from './components';
import { TransactionListVirtual } from './components/TransactionListVirtual';

interface AccountDetailsViewProps {
    account: AnchorAccount;
    onBack: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    onTransfer?: () => void;
    onPayBill?: () => void;
    onEdit?: (tx: AnchorTransaction) => void;
    familyMemberId?: string | null;
}

export const AccountDetailsView = ({
    account,
    onBack,
    onDelete,
    onShare,
    onTransfer,
    onPayBill,
    onEdit,
    familyMemberId,
}: AccountDetailsViewProps) => {
    const { transactions, deleteTransaction, renameAccount } = useFinance();
    const { user } = useAuth();

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(account.name);
    const [isRenaming, setIsRenaming] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);

    // Derived state
    const isOwner = !account.ownerId || account.ownerId === user?.uid;
    const isSharedAccount = Boolean(
        (account.sharedWith && Object.keys(account.sharedWith).length > 0) ||
        (account.ownerId && account.ownerId !== user?.uid)
    );

    // Activity Feed for shared accounts
    const { activities, loading: loadingActivities } = useAccountActivity({
        accountId: account.id,
        accountOwnerId: account.ownerId || user?.uid || '',
        enabled: isSharedAccount,
    });

    // Filter transactions
    const accountTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];
        return transactions.filter(t => t && t.accountId === account.id);
    }, [transactions, account.id]);

    // Insights
    const weeklyData = useMemo(() => getWeeklySpending(accountTransactions), [accountTransactions]);
    const recurring = useMemo(() => detectRecurring(accountTransactions), [accountTransactions]);
    const hasData = accountTransactions.length > 0;

    const maxWeeklyAmount = useMemo(() => {
        const allAmounts = weeklyData.flatMap(d => [d.income, d.expense]);
        return Math.max(...allAmounts, 1);
    }, [weeklyData]);

    // Filtered transactions for list
    const filteredList = useMemo(() => {
        return accountTransactions
            .filter(t => {
                if (!t || (filterType !== 'all' && t.type !== filterType)) return false;

                if (selectedWeekStart && t.date) {
                    const d = new Date(t.date);
                    const end = new Date(selectedWeekStart);
                    end.setDate(end.getDate() + 6);
                    end.setHours(23, 59, 59, 999);
                    if (d < selectedWeekStart || d > end) return false;
                }

                if (!searchQuery) return true;
                const title = t.title || '';
                const category = t.category || '';
                return (
                    title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    category.toLowerCase().includes(searchQuery.toLowerCase())
                );
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [accountTransactions, filterType, selectedWeekStart, searchQuery]);

    // Handlers
    const handleRename = async () => {
        if (!newName.trim() || newName === account.name) {
            setIsEditingName(false);
            return;
        }
        setIsRenaming(true);
        try {
            await renameAccount(account.id, newName);
            setIsEditingName(false);
        } catch (err) {
            console.error('Failed to rename:', err);
        } finally {
            setIsRenaming(false);
        }
    };

    return (
        <>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
                <NotificationBanner accountId={account.id} />

                <AccountHeader
                    account={account}
                    isOwner={isOwner}
                    familyMemberId={familyMemberId}
                    isEditingName={isEditingName}
                    newName={newName}
                    isRenaming={isRenaming}
                    onBack={onBack}
                    onDelete={onDelete}
                    onShare={onShare}
                    onTransfer={onTransfer}
                    onPayBill={onPayBill}
                    onStartRename={() => setIsEditingName(true)}
                    onCancelRename={() => { setIsEditingName(false); setNewName(account.name); }}
                    onConfirmRename={handleRename}
                    onNameChange={setNewName}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {hasData && (
                        <SpendingTrendsChart
                            weeklyData={weeklyData}
                            currency={account.currency}
                            selectedWeekStart={selectedWeekStart}
                            onSelectWeek={setSelectedWeekStart}
                            maxAmount={maxWeeklyAmount}
                        />
                    )}

                    <RecurringTransactionsList
                        recurring={recurring}
                        currency={account.currency}
                    />
                </div>

                {isSharedAccount && (
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <span>Recent Activity</span>
                            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Shared
                            </span>
                        </h3>
                        <ActivityFeed
                            activities={activities}
                            currentUserId={user?.uid}
                            loading={loadingActivities}
                            maxItems={5}
                        />
                    </div>
                )}

                <TransactionListVirtual
                    transactions={filteredList}
                    account={account}
                    currentUserId={user?.uid}
                    searchQuery={searchQuery}
                    filterType={filterType}
                    selectedWeekStart={selectedWeekStart}
                    onSearchChange={setSearchQuery}
                    onFilterChange={setFilterType}
                    onEdit={onEdit}
                    onDelete={setTransactionToDelete}
                />
            </div>

            <ConfirmationModal
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={() => {
                    if (transactionToDelete) {
                        deleteTransaction(transactionToDelete.id, transactionToDelete.accountId);
                        setTransactionToDelete(null);
                    }
                }}
                title="Delete Transaction"
                message={`Are you sure you want to delete "${transactionToDelete?.title}"? This action cannot be undone.`}
                confirmLabel="Delete Transaction"
                isDestructive
            />
        </>
    );
};

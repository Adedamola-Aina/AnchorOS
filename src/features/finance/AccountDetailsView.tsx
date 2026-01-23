import { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Search, Trash2, ArrowUpRight, ArrowDownLeft, Calendar, TrendingUp, User, Pencil, Check, X } from 'lucide-react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import { CategoryIcon } from '../../components/shared';
import { useFinance } from '../../context/FinanceContext';
import { getWeeklySpending, detectRecurring } from '../../utils/financeInsights';
import { NotificationBanner } from './NotificationBanner';
import { useVirtualizer } from '@tanstack/react-virtual';

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

export const AccountDetailsView = ({ account, onBack, onDelete, onShare, onTransfer, onPayBill, onEdit, familyMemberId }: AccountDetailsViewProps) => {
    const { transactions, deleteTransaction, renameAccount } = useFinance();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(account.name);
    const [isRenaming, setIsRenaming] = useState(false);

    // Virtualization Refs
    const parentRef = useRef<HTMLDivElement>(null);

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

    // Filter Transactions for this account
    const accountTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];
        return transactions.filter(t => t && t.accountId === account.id);
    }, [transactions, account.id]);

    // Derived Insights (with fallback for empty data)
    const weeklyData = useMemo(() => getWeeklySpending(accountTransactions), [accountTransactions]);
    const recurring = useMemo(() => detectRecurring(accountTransactions), [accountTransactions]);
    const hasData = useMemo(() => accountTransactions.length > 0, [accountTransactions]);

    // Search & Filter
    const filteredList = useMemo(() => {
        return accountTransactions
            .filter(t => {
                if (!t || (filterType !== 'all' && t.type !== filterType)) return false;

                // Week Filter
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
            });
    }, [accountTransactions, searchQuery, filterType, selectedWeekStart]);

    // Virtualizer
    const rowVirtualizer = useVirtualizer({
        count: filteredList.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88, // Approximate height
        overscan: 5,
    });

    const maxWeeklyAmount = Math.max(...(weeklyData.length > 0 ? weeklyData.map(w => Math.max(w.income || 0, w.expense || 0)) : [1]), 1);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 relative">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </button>
                <div className="flex-1">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename();
                                    if (e.key === 'Escape') setIsEditingName(false);
                                }}
                                disabled={isRenaming}
                                className="text-2xl font-bold bg-white dark:bg-slate-900 border-b-2 border-indigo-500 outline-none w-full max-w-md dark:text-white"
                            />
                            <button
                                onClick={handleRename}
                                disabled={isRenaming}
                                className="p-2 text-emerald-500 hover:text-emerald-600 disabled:opacity-50"
                                title="Save"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsEditingName(false)}
                                disabled={isRenaming}
                                className="p-2 text-slate-400 hover:text-rose-500"
                                title="Cancel"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{account.name}</h1>
                            {(!account.ownerId || account.ownerId === user?.uid) && (
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="p-1 text-slate-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Rename Account"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{account.type} • {account.currency}</p>
                </div>
                <div className="flex gap-2">
                    {onShare && familyMemberId && !account.ownerId && (
                        // This logic assumes ONLY owner sees this component for their own accounts.
                        // Shared accounts have ownerId set.
                        <button onClick={onShare} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="Manage Sharing">
                            <User className="w-5 h-5" />
                        </button>
                    )}
                    {/* Only owner can delete account */}
                    {onDelete && (!account.ownerId || account.ownerId === user?.uid) && (
                        <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Delete Account">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <NotificationBanner accountId={account.id} />

            {/* Hero Stats */}
            <div className={`p-8 rounded-3xl relative overflow-hidden text-white ${account.currency === 'USD' ? 'bg-gradient-to-br from-indigo-600 to-blue-700' : 'bg-gradient-to-br from-emerald-600 to-teal-700'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-5xl font-black tabular-nums tracking-tight">
                        {formatCurrency(fromCents(account.balanceCents), account.currency)}
                    </h2>

                    <div className="flex gap-6 mt-8">
                        <button
                            onClick={onTransfer}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                        >
                            <ArrowUpRight className="w-4 h-4" /> Transfer
                        </button>
                        <button
                            onClick={onPayBill}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                        >
                            <ArrowDownLeft className="w-4 h-4" /> Pay Bill
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Spending Trends Chart */}
                {hasData ? (
                    <div className="lg:col-span-2 glass-card p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-slate-400" />
                                <span>30 Day Trends</span>
                            </h3>
                            {selectedWeekStart && (
                                <button
                                    onClick={() => setSelectedWeekStart(null)}
                                    className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        <div className="h-48 flex items-end justify-between gap-4">
                            {weeklyData.map((d, i) => {
                                const isSelected = selectedWeekStart && d.weekStart.getTime() === selectedWeekStart.getTime();
                                const isDimmed = selectedWeekStart && !isSelected;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedWeekStart(isSelected ? null : d.weekStart)}
                                        className={`flex-1 flex flex-col items-center gap-2 group transition-all ${isDimmed ? 'opacity-30 grayscale' : 'opacity-100 hover:scale-[1.02]'}`}
                                    >
                                        <div className="w-full flex gap-1 items-end justify-center h-full relative">
                                            {/* Net Annotation - Above if positive, Below (visually handled by layout?) or just always above for clarity */}
                                            {/* Requirement: "Above or below each week's bar group" */}
                                            <div className={`absolute -top-6 text-[10px] font-black transition-transform group-hover:-translate-y-1 ${d.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {d.net > 0 ? '+' : ''}{formatCurrency(d.net, account.currency)}
                                            </div>

                                            {/* Hover Background */}
                                            <div className="absolute inset-x-[-8px] top-[-10px] bottom-[-10px] rounded-xl bg-slate-100 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 -z-10 transition-opacity" />

                                            {/* Bar Group Container */}
                                            <div className="w-full max-w-[60px] flex gap-1 items-end h-full relative">
                                                {/* Income Bar (Green) */}
                                                <div className="flex-1 h-full flex items-end">
                                                    <div
                                                        style={{ height: `${Math.max((d.income / maxWeeklyAmount) * 100, 4)}%` }} // Min 4%
                                                        className="w-full bg-emerald-500 rounded-t-md relative group-hover:bg-emerald-400 transition-colors"
                                                    />
                                                </div>

                                                {/* Expense Bar (Red/Coral) */}
                                                <div className="flex-1 h-full flex items-end">
                                                    <div
                                                        style={{ height: `${Math.max((d.expense / maxWeeklyAmount) * 100, 4)}%` }}
                                                        className="w-full bg-rose-500 rounded-t-md relative group-hover:bg-rose-400 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase transition-colors ${isSelected ? 'text-indigo-500 scale-110' : 'text-slate-400'}`}>
                                            {d.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 glass-card p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[240px]">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Activity Trends</h3>
                        <p className="text-sm text-slate-500 max-w-xs">Recording transactions will unlock 30-day spending trends and insights here.</p>
                    </div>
                )}

                {/* Recurring / Subscriptions */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Recurring</span>
                    </h3>

                    <div className="space-y-4">
                        {recurring.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No recurring payments detected yet.
                            </div>
                        ) : (
                            recurring.slice(0, 4).map(rec => (
                                <div key={rec.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{rec.title}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">{rec.frequency}</p>
                                    </div>
                                    <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                        {formatCurrency(fromCents(rec.amountCents), account.currency)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        History
                        {selectedWeekStart && <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Filtered by Week</span>}
                    </h3>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-48 pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('expense')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === 'expense' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                            >
                                Out
                            </button>
                            <button
                                onClick={() => setFilterType('income')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === 'income' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                            >
                                In
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={parentRef}
                    className="max-h-[500px] overflow-y-auto"
                >
                    {/* Account Activity (Keep outside virtual list complexity for now, it's usually small) */}
                    {account.nameHistory && account.nameHistory.length > 0 && !searchQuery && filterType === 'all' && (
                        <div className="border-b border-amber-100 dark:border-amber-900/30">
                            {account.nameHistory.slice().reverse().map((entry, idx) => (
                                <div
                                    key={`rename-${idx}`}
                                    className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm"
                                >
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                        <Pencil className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-amber-900 dark:text-amber-200">
                                            Account renamed
                                        </p>
                                        <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                                            <span className="line-through">{entry.oldName}</span>
                                            <span className="mx-2">→</span>
                                            <span className="font-semibold">{entry.newName}</span>
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-amber-600/60 dark:text-amber-400/60">
                                        <p>{new Date(entry.date).toLocaleDateString()}</p>
                                        <p>by {entry.actorName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                            const tx = filteredList[virtualItem.index];
                            // Defensive fallbacks for malformed data
                            const txTitle = tx.title || 'Untitled';
                            const txCategory = tx.category || 'Other';
                            const txDate = tx.date ? new Date(tx.date).toLocaleDateString() : 'Unknown Date';
                            const txAmount = tx.amountCents || 0;
                            const txCurrency = tx.currency || 'NGN';

                            return (
                                <div
                                    key={virtualItem.key}
                                    data-index={virtualItem.index}
                                    ref={rowVirtualizer.measureElement}
                                    className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group absolute top-0 left-0 w-full"
                                    style={{
                                        transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                >
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                        <CategoryIcon category={txCategory} size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">{txTitle}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {txDate} • {txCategory}
                                            {tx.createdByName && user?.uid && tx.createdBy !== user.uid && (
                                                <span className="text-indigo-500 ml-1">
                                                    • by {tx.createdByName}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-mono font-black text-sm tabular-nums ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(fromCents(txAmount), txCurrency)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {onEdit && (!account.ownerId || account.ownerId === user?.uid) && (
                                            <button
                                                onClick={() => onEdit(tx)}
                                                className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"
                                                aria-label="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        {(!account.ownerId || account.ownerId === user?.uid) && (
                                            <button
                                                onClick={() => deleteTransaction(tx.id, tx.accountId)}
                                                className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredList.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            {selectedWeekStart ? 'No transactions in selected week.' : 'No transactions found.'}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

/**
 * AccountHeader - Premium header section with balance and action buttons
 * Redesigned for a more modern, polished look
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Sub-components extracted to AccountHeaderParts.tsx
 */
// @ts-nocheck


import { ArrowLeft, Trash2, Users, Pencil, Sparkles } from 'lucide-react';
import type { AnchorAccount } from '../../../types';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { AccountRenameInput, AccountActionButtons } from './AccountHeaderParts';

interface MonthlyBalance {
    openingBalance?: number;
    closingBalance?: number;
    monthIncome: number;
    monthExpense: number;
    netChange: number;
    isCurrentMonth: boolean;
}

interface AccountHeaderProps {
    account: AnchorAccount;
    isOwner: boolean;
    familyMemberId?: string | null;
    isEditingName: boolean;
    newName: string;
    isRenaming: boolean;
    onBack: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    onAddTransaction?: () => void;
    onStartRename: () => void;
    onCancelRename: () => void;
    onConfirmRename: () => void;
    onNameChange: (name: string) => void;
    monthlyBalance?: MonthlyBalance;
    onExportCsv?: () => void;
}

const getAccountStyle = (account: AnchorAccount) => {
    if (account.currency === 'USD') {
        return {
            gradient: 'from-slate-900 via-slate-800 to-slate-900',
            accent: 'bg-finance-500',
            accentText: 'text-finance-400',
            glow: 'shadow-emerald-500/20',
        };
    }
    return {
        gradient: 'from-indigo-600 via-purple-600 to-pink-500',
        accent: 'bg-white',
        accentText: 'text-white',
        glow: 'shadow-purple-500/30',
    };
};

export const AccountHeader = ({
    account, isOwner, familyMemberId,
    isEditingName, newName, isRenaming,
    onBack, onDelete, onShare, onAddTransaction,
    onStartRename, onCancelRename, onConfirmRename, onNameChange,
    monthlyBalance, onExportCsv,
}: AccountHeaderProps) => {
    const style = getAccountStyle(account);
    const isShared = account.sharedWith && Object.keys(account.sharedWith).length > 0;

    return (
        <div className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl ${style.glow}`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBack} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {isShared && (
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">Shared</span>
                            </div>
                        )}
                        {isOwner && (
                            <button onClick={onStartRename} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Rename account">
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        {onShare && familyMemberId && !account.ownerId && (
                            <button onClick={onShare} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Manage Sharing">
                                <Users className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && isOwner && (
                            <button onClick={onDelete} className="bg-white/10 hover:bg-red-500/80 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Delete account">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Account Info */}
                <div className="mb-8">
                    {isEditingName ? (
                        <AccountRenameInput newName={newName} isRenaming={isRenaming} onNameChange={onNameChange} onConfirmRename={onConfirmRename} onCancelRename={onCancelRename} />
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-h1 lg:text-h1-lg tracking-tight">{account.name}</h1>
                                <Sparkles className="w-5 h-5 opacity-50" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">{account.type}</span>
                                <span className="text-white/50 text-sm font-medium">{account.currency === 'USD' ? '🇺🇸 US Dollar' : '🇳🇬 Nigerian Naira'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Balance Display */}
                <div className="mb-10">
                    <p className="text-xs font-semibold opacity-60 uppercase tracking-[0.2em] mb-2">Available Balance</p>
                    <h2 className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight">
                        {formatCurrencyCompact(fromCents(account.balanceCents), account.currency)}
                    </h2>
                    {/* F-006: Monthly opening/closing balance */}
                    {monthlyBalance?.isCurrentMonth && monthlyBalance.openingBalance != null && (
                        <div className="flex items-center gap-4 mt-3 text-xs font-medium opacity-70">
                            <div>
                                <span className="opacity-60 uppercase tracking-wider text-[10px]">Opening </span>
                                <span className="tabular-nums">{formatCurrencyCompact(fromCents(monthlyBalance.openingBalance), account.currency)}</span>
                            </div>
                            <span className="opacity-30">→</span>
                            <div>
                                <span className={`tabular-nums font-bold ${monthlyBalance.netChange >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                    {monthlyBalance.netChange >= 0 ? '+' : ''}{formatCurrencyCompact(fromCents(monthlyBalance.netChange), account.currency)}
                                </span>
                                <span className="opacity-60 ml-1 uppercase tracking-wider text-[10px]">this month</span>
                            </div>
                        </div>
                    )}
                    {monthlyBalance && !monthlyBalance.isCurrentMonth && (
                        <div className="flex items-center gap-4 mt-3 text-xs font-medium opacity-70">
                            <div>
                                <span className="opacity-60 uppercase tracking-wider text-[10px]">Month Net </span>
                                <span className={`tabular-nums font-bold ${monthlyBalance.netChange >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                                    {monthlyBalance.netChange >= 0 ? '+' : ''}{formatCurrencyCompact(fromCents(monthlyBalance.netChange), account.currency)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <AccountActionButtons account={account} onAddTransaction={onAddTransaction} onExportCsv={onExportCsv} />
            </div>
        </div>
    );
};

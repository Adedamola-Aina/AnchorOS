import React from 'react';
import { DollarSign, Banknote, Users } from 'lucide-react';
import { Badge } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../types';

interface AccountCardProps {
    account: AnchorAccount;
    userId: string;
    isOwnerOfConnection?: boolean; // True if current user is the owner in family connection
    familyMemberUid?: string; // The family member's UID (if connected)
    onEdit: (account: AnchorAccount) => void;
    onToggleShare?: (account: AnchorAccount, share: boolean) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
    account,
    userId,
    isOwnerOfConnection = false,
    familyMemberUid,
    onEdit,
    onToggleShare,
}) => {

    // Check if this account is shared with family member (v2)
    const isSharedWithFamily = familyMemberUid && account.sharedWith?.[familyMemberUid];

    // Check if this account was shared WITH the current user (not owner)
    const isSharedToMe = account.ownerId && account.ownerId !== userId;

    const handleShareToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleShare && familyMemberUid) {
            onToggleShare(account, !isSharedWithFamily);
        }
    };

    return (
        <div
            onClick={() => onEdit(account)}
            className={`cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group overflow-hidden relative ${account.currency === 'USD' ? 'hover:border-primary-500/30' : 'hover:border-finance-500/30'}`}
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${account.currency === 'USD' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-finance-50 dark:bg-finance-900/30 text-finance-600 dark:text-finance-400'}`}>
                    {account.currency === 'USD' ? <DollarSign size={22} /> : <Banknote size={22} />}
                </div>
                {/* Share toggle button - only shown to owner with active connection */}
                {isOwnerOfConnection && onToggleShare && familyMemberUid && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleShareToggle}
                            className={`p-2 rounded-full transition-all ${isSharedWithFamily
                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50/50'
                                }`}
                            title={isSharedWithFamily ? 'Stop Sharing' : 'Share with Family'}
                        >
                            <Users className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate flex-1 min-w-0">
                        {account.name}
                    </h3>
                    {/* Show 👥 emoji for shared accounts (v2) */}
                    {(isSharedWithFamily || isSharedToMe) && (
                        <span className="text-base" title={isSharedToMe ? 'Shared with you' : 'Shared with family'}>
                            👥
                        </span>
                    )}
                    {/* Legacy badge for accounts shared TO current user */}
                    {isSharedToMe && !account.sharedWith && (
                        <Badge type="family" variant="outline">Shared</Badge>
                    )}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                    {formatCurrency(fromCents(account.balanceCents), account.currency)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge type={account.type} variant="outline">
                        {account.type}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{account.currency}</span>
                </div>
            </div>

            {/* Decorative accent */}
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none opacity-10 ${account.currency === 'USD' ? 'bg-primary-500' : 'bg-finance-500'}`} />
        </div>
    );
};

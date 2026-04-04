// @ts-nocheck
/**
 * WalletCard — Single account card in Apple Wallet style (UX-041)
 *
 * Shows as a full card (top of stack) or a peek strip (stacked below).
 * Gradient is determined by account type for instant visual recognition.
 */
import React from 'react';
import { Users, Link2 } from 'lucide-react';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../types';

/** Gradient map by account type — deterministic color identity */
const CARD_GRADIENTS: Record<string, string> = {
    checking: 'from-slate-800 via-slate-900 to-slate-950',
    savings: 'from-emerald-700 via-emerald-800 to-emerald-950',
    salary: 'from-violet-700 via-violet-800 to-violet-950',
    investment: 'from-amber-700 via-amber-800 to-amber-950',
};

/** Accent color used for the subtle chip/badge on each card */
const CARD_ACCENTS: Record<string, string> = {
    checking: 'bg-slate-600/40',
    savings: 'bg-emerald-600/40',
    salary: 'bg-violet-600/40',
    investment: 'bg-amber-600/40',
};

interface WalletCardProps {
    account: AnchorAccount;
    userId: string;
    isOwnerOfConnection?: boolean;
    familyMemberUid?: string;
    isPeeked?: boolean;
    onSelect: (account: AnchorAccount) => void;
    onToggleShare?: (account: AnchorAccount, share: boolean) => void;
}

export const WalletCard: React.FC<WalletCardProps> = React.memo(({
    account,
    userId,
    isOwnerOfConnection = false,
    familyMemberUid,
    isPeeked = false,
    onSelect,
    onToggleShare,
}) => {
    const gradient = CARD_GRADIENTS[account.type] || CARD_GRADIENTS.checking;
    const accent = CARD_ACCENTS[account.type] || CARD_ACCENTS.checking;
    const isSharedWithFamily = familyMemberUid && account.sharedWith?.[familyMemberUid];
    const isSharedToMe = account.ownerId && account.ownerId !== userId;

    const handleShareToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleShare && familyMemberUid) {
            onToggleShare(account, !isSharedWithFamily);
        }
    };

    return (
        <button
            type="button"
            onClick={() => onSelect(account)}
            data-testid={`account-card-${account.id}`}
            className={`w-full text-left rounded-2xl bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer overflow-hidden min-h-[44px] ${isPeeked ? 'h-[180px]' : 'h-[180px]'}`}
        >
            {/* Top strip — always visible (name + balance) */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <h3
                        data-testid={`account-name-${account.id}`}
                        className="text-white/90 font-semibold text-sm truncate"
                    >
                        {account.name}
                    </h3>
                    {(isSharedWithFamily || isSharedToMe) && (
                        <Users className="w-3.5 h-3.5 text-white/50 shrink-0" />
                    )}
                    {account.source === 'linked' && (
                        <Link2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    )}
                </div>
                <p className="text-white font-bold text-base tabular-nums shrink-0 ml-3">
                    {formatCurrencyCompact(fromCents(account.balanceCents), account.currency)}
                </p>
            </div>

            {/* Card body — only fully visible for top card */}
            <div className="px-5 pb-4 pt-1">
                <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white/80 uppercase tracking-wider ${accent}`}>
                        {account.type}
                    </span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {account.currency}
                    </span>
                </div>

                {account.source === 'linked' && account.externalConnection && (
                    <p className="text-[10px] text-white/30 mt-2 truncate">
                        {account.externalConnection.institutionName}
                        {account.externalConnection.maskedAccountNumber && ` · ${account.externalConnection.maskedAccountNumber}`}
                    </p>
                )}

                {/* Decorative card chip — inspired by physical credit cards */}
                <div className="mt-4 flex items-end justify-between">
                    <div className="w-10 h-7 rounded-md bg-white/10 border border-white/20" />
                    {isOwnerOfConnection && onToggleShare && familyMemberUid && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleShareToggle}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleShareToggle(e as unknown as React.MouseEvent); }}
                            className={`p-2 rounded-full transition-all ${isSharedWithFamily ? 'text-amber-300 bg-white/10' : 'text-white/30 hover:text-white/60 hover:bg-white/10'}`}
                            title={isSharedWithFamily ? 'Stop Sharing' : 'Share with Family'}
                        >
                            <Users className="w-4 h-4" />
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
});

/**
 * AccountCard - Individual account display card
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { DollarSign, Banknote, Users } from 'lucide-react';
import { Badge as SharedBadge } from '../../../components/shared';
import { formatCurrencyCompact } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../types';
import { Text, HStack } from '../../../components/primitives';

interface AccountCardProps {
    account: AnchorAccount;
    userId: string;
    isOwnerOfConnection?: boolean;
    familyMemberUid?: string;
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
    const isSharedWithFamily = familyMemberUid && account.sharedWith?.[familyMemberUid];
    const isSharedToMe = account.ownerId && account.ownerId !== userId;

    const handleShareToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleShare && familyMemberUid) {
            onToggleShare(account, !isSharedWithFamily);
        }
    };

    // Currency-based theming
    const isUSD = account.currency === 'USD';

    return (
        <div
            onClick={() => onEdit(account)}
            className={`cursor-pointer bg-surface-2 dark:bg-surface-2-dark p-5 rounded-2xl border border-[var(--border)] hover:shadow-lg transition-all group overflow-hidden relative ${isUSD ? 'hover:border-primary-500/30' : 'hover:border-finance-500/30'}`}
        >
            <HStack justify="between" align="start" className="mb-4 relative z-10">
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${isUSD ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-finance-100 dark:bg-finance-900/30 text-finance-600 dark:text-finance-400'}`}>
                    {isUSD ? <DollarSign size={22} /> : <Banknote size={22} />}
                </div>
                {/* Share toggle button */}
                {isOwnerOfConnection && onToggleShare && familyMemberUid && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleShareToggle}
                            className={`p-2 rounded-full transition-all ${isSharedWithFamily
                                ? 'text-family-600 bg-family-50 dark:bg-family-900/30 hover:bg-family-100'
                                : 'text-muted hover:text-family-500 hover:bg-family-50/50'
                                }`}
                            title={isSharedWithFamily ? 'Stop Sharing' : 'Share with Family'}
                        >
                            <Users className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </HStack>

            <div className="relative z-10 min-w-0">
                <HStack gap="sm" align="center" className="mb-1">
                    <Text as="h3" variant="heading" truncate className="flex-1 min-w-0">
                        {account.name}
                    </Text>
                    {(isSharedWithFamily || isSharedToMe) && (
                        <span className="text-base" title={isSharedToMe ? 'Shared with you' : 'Shared with family'}>
                            👥
                        </span>
                    )}
                    {isSharedToMe && !account.sharedWith && (
                        <SharedBadge type="family" variant="outline">Shared</SharedBadge>
                    )}
                </HStack>
                <Text as="p" variant="heading" size="2xl" mono truncate className="tracking-tight">
                    {formatCurrencyCompact(fromCents(account.balanceCents), account.currency)}
                </Text>
                <HStack gap="sm" align="center" className="mt-2">
                    <SharedBadge type={account.type} variant="outline">
                        {account.type}
                    </SharedBadge>
                    <Text variant="subtle" size="xs" weight="bold" className="uppercase tracking-widest">
                        {account.currency}
                    </Text>
                </HStack>
            </div>

            {/* Decorative accent */}
            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none opacity-10 ${isUSD ? 'bg-primary-500' : 'bg-finance-500'}`} />
        </div>
    );
};


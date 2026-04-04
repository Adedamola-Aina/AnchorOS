// @ts-nocheck
/**
 * WalletStack — Apple Wallet-style stacked account cards (UX-041)
 *
 * Cards overlap vertically. The top card is fully visible; subsequent
 * cards peek out below it showing a colored strip with name + balance.
 * Tapping any card opens its detail view via onSelect.
 */
import React from 'react';
import { WalletCard } from './WalletCard';
import type { AnchorAccount } from '../../../types';

/** Height (px) of the visible peek strip for stacked cards */
const PEEK_HEIGHT = 56;
/** Height (px) of the fully visible top card */
const FULL_CARD_HEIGHT = 180;

interface WalletStackProps {
    accounts: AnchorAccount[];
    userId: string;
    isOwnerOfConnection?: boolean;
    familyMemberUid?: string;
    onSelect: (account: AnchorAccount) => void;
    onToggleShare?: (account: AnchorAccount, share: boolean) => void;
}

export const WalletStack: React.FC<WalletStackProps> = ({
    accounts,
    userId,
    isOwnerOfConnection = false,
    familyMemberUid,
    onSelect,
    onToggleShare,
}) => {
    if (accounts.length === 0) return null;

    // Total height: first card full + remaining cards peek
    const stackHeight = FULL_CARD_HEIGHT + (accounts.length - 1) * PEEK_HEIGHT;

    return (
        <div
            data-testid="wallet-stack"
            className="relative w-full"
            style={{ height: stackHeight }}
        >
            {accounts.map((account, index) => (
                <div
                    key={account.id}
                    className="absolute left-0 right-0 transition-transform duration-200 ease-out"
                    style={{
                        top: index * PEEK_HEIGHT,
                        zIndex: accounts.length - index,
                    }}
                >
                    <WalletCard
                        account={account}
                        userId={userId}
                        isOwnerOfConnection={isOwnerOfConnection}
                        familyMemberUid={familyMemberUid}
                        isPeeked={index > 0}
                        onSelect={onSelect}
                        onToggleShare={onToggleShare}
                    />
                </div>
            ))}
        </div>
    );
};

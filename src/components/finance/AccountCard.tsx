/**
 * AccountCard — Clean finance panel (Apple Wallet style).
 * UX-041 Phase 2 §4. Name left, balance right. Minimal decoration.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorAccount } from '../../types';
import { getFinanceViewTransitionName } from '../../features/finance/financeViewTransition';
import { resolveAccountArtworkUrl, revokeAccountArtworkUrl } from '../../services/accountArtworkStorage';
import {
  CARD_ASPECT_RATIO, CARD_BALANCE_FONT_SIZE, CARD_CORNER_RADIUS,
  CARD_HEADER_FONT_SIZE, CARD_HEADER_LETTER_SPACING,
  TYPE_COLORS, DEFAULT_CARD_COLORS, SHADOW_ACTIVE, SHADOW_DEFAULT,
} from './cardConstants';

export { CARD_ASPECT_RATIO } from './cardConstants';

interface AccountCardProps {
  account: AnchorAccount;
  index: number;
  totalCards: number;
  mode: 'stack' | 'expanded';
  isActive: boolean;
  onTap: () => void;
  style?: React.CSSProperties;
  /** Skip view-transition-name when a parent already owns the same name */
  skipViewTransition?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = React.memo(({
  account, index, mode, isActive, onTap, style, skipViewTransition,
}) => {
  const cardColor = account.cardColor
    ?? TYPE_COLORS[account.type]
    ?? DEFAULT_CARD_COLORS[index % DEFAULT_CARD_COLORS.length];
  const balance = fromCents(account.balanceCents);
  const last4 = account.externalConnection?.maskedAccountNumber?.slice(-4) ?? '';
  const instName = account.externalConnection?.institutionName ?? account.name;
  const [artworkUrl, setArtworkUrl] = useState<string | undefined>(account.cardArtwork || undefined);
  const showSecondaryName = (mode === 'expanded' || isActive) && account.name !== instName;
  const showFooter = mode === 'expanded' || isActive;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); }
  }, [onTap]);

  useEffect(() => {
    let active = true;
    let resolvedUrl: string | undefined;
    void resolveAccountArtworkUrl({
      cardArtwork: account.cardArtwork,
      cardArtworkPath: account.cardArtworkPath,
    }).then((nextUrl) => {
      if (!active) { revokeAccountArtworkUrl(nextUrl); return; }
      resolvedUrl = nextUrl;
      setArtworkUrl(nextUrl);
    }).catch(() => {
      if (active) setArtworkUrl(account.cardArtwork || undefined);
    });
    return () => { active = false; revokeAccountArtworkUrl(resolvedUrl); };
  }, [account.cardArtwork, account.cardArtworkPath]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${instName} account`}
      data-testid={`account-card-${account.id}`}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      className="account-card relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        aspectRatio: `${CARD_ASPECT_RATIO}`,
        backgroundColor: cardColor,
        borderRadius: CARD_CORNER_RADIUS,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: style?.boxShadow ?? (isActive ? SHADOW_ACTIVE : SHADOW_DEFAULT),
        viewTransitionName: skipViewTransition ? undefined : getFinanceViewTransitionName(account.id),
        transition: 'box-shadow 240ms ease',
        ...style,
      }}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
        borderRadius: 'inherit',
      }} />
      {/* Custom artwork */}
      {artworkUrl && (<>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${artworkUrl})`, backgroundSize: 'cover',
          backgroundPosition: 'center', borderRadius: 'inherit',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 'inherit',
        }} />
      </>)}
      {/* Content — header at top fits within peek strip */}
      <div className="relative z-[2] flex h-full flex-col justify-between px-5 py-4">
        <div className="card-header flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{
              fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif',
              fontSize: CARD_HEADER_FONT_SIZE, fontWeight: 600,
              letterSpacing: CARD_HEADER_LETTER_SPACING,
              color: '#fff', lineHeight: 1.2,
            }}>
              {instName}
            </p>
            {showSecondaryName && (
              <p className="truncate mt-0.5" style={{
                fontSize: 12, fontWeight: 500,
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.3,
              }}>
                {account.name}
              </p>
            )}
          </div>
          <span className="whitespace-nowrap" style={{
            fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif',
            fontSize: CARD_BALANCE_FONT_SIZE, fontWeight: 500,
            letterSpacing: CARD_HEADER_LETTER_SPACING,
            color: '#fff', lineHeight: 1.2,
          }}>
            {formatCurrency(balance, account.currency)}
          </span>
        </div>
        {showFooter && (
          <div className="flex items-end justify-between gap-2">
            <span style={{
              fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.55)',
              textTransform: 'capitalize' as const,
            }}>
              {account.type}
            </span>
            {last4 && (
              <span style={{
                fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.45)',
                fontFamily: 'monospace', letterSpacing: '0.12em',
              }}>
                •••• {last4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

AccountCard.displayName = 'AccountCard';
